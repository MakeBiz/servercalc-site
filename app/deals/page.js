import Link from 'next/link';
import PageHead from '@/components/PageHead';
import JsonLd from '@/components/JsonLd';
import OutLink from '@/components/OutLink';
import PromoCode from '@/components/PromoCode';
import { PROMOS, PROMOS_HIDDEN, HAS_PROMOS } from '@/lib/promos';
import { STATS } from '@/lib/data';
import { fmtDate } from '@/lib/format';
import { absUrl } from '@/lib/site';

const LOCALE = 'en';

export const metadata = {
  title: 'VPS provider deals and promo codes',
  description:
    'Active deals and promo codes for virtual servers. Every deal is checked against the provider’s terms, each carries a verification date, and expired ones are hidden automatically',
  alternates: {
    canonical: '/deals',
  },
  // an empty section is not indexed: a thin page with no content is of no use to search
  robots: HAS_PROMOS ? { index: true, follow: true } : { index: false, follow: true },
};

export default function DealsPageEn() {
  return (
    <>
      {HAS_PROMOS && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Deals and promo codes for virtual servers',
            numberOfItems: PROMOS.length,
            itemListElement: PROMOS.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `${p.provider.name}: ${p.titleEn || p.title}`,
              url: absUrl('/deals'),
            })),
          }}
        />
      )}

      <PageHead
        locale={LOCALE}
        eyebrow="Deals"
        title="Deals and promo codes"
        lead="Discounts and promo codes from the providers in our catalog. The rule is the same as for prices: every deal is checked against the provider’s terms, each carries a verification date, and expired ones leave the page automatically"
        crumbs={[{ href: '/deals', label: 'Deals and promo codes' }]}
        badges={
          <>
            <span className="badge badge-brass">
              {PROMOS.length} {PROMOS.length === 1 ? 'deal' : 'deals'}
            </span>
            {PROMOS_HIDDEN > 0 && (
              <span className="badge">
                {PROMOS_HIDDEN} hidden as outdated
              </span>
            )}
          </>
        }
      />

      <section className="section paper">
        <div className="wrap">
          {!HAS_PROMOS ? (
            <div className="notice notice-warn" style={{ maxWidth: 720 }}>
              <strong>No verified deals right now.</strong> Only offers we have checked against the
              provider’s terms appear here, each with a verification date. Showing a deal we are not
              sure about is worse than showing none: a promo code that fails at checkout hurts trust
              in the catalog, not in the provider. In the meantime, take a look at the{' '}
              <Link href="/catalog">plan catalog</Link>: the base prices there are checked every
              week
            </div>
          ) : (
            <div className="cards cards-2">
              {PROMOS.map((p) => (
                <div className="card" key={p.id}>
                  <div className="card-top">
                    <span className="badge badge-brass">{p.provider.name}</span>
                    <span className="faint mono">verified {fmtDate(p.verifiedAt, LOCALE)}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem' }}>{p.titleEn || p.title}</h3>
                  {(p.benefitEn || p.benefit) && (
                    <p className="dim" style={{ margin: '6px 0 0' }}>{p.benefitEn || p.benefit}</p>
                  )}

                  {p.code ? (
                    <div className="mt">
                      <PromoCode code={p.code} provider={p.provider.slug} locale={LOCALE} />
                    </div>
                  ) : (
                    <p className="faint mt" style={{ margin: 0 }}>
                      No promo code needed: {p.mechanicsEn || p.mechanics || 'the discount applies when you follow the link'}
                    </p>
                  )}

                  {Array.isArray(p.conditionsEn || p.conditions) && (p.conditionsEn || p.conditions).length > 0 && (
                    <ul className="list-check list-minus mt" style={{ fontSize: '0.92rem' }}>
                      {(p.conditionsEn || p.conditions).map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  )}

                  <div className="row mt">
                    <OutLink
                      provider={p.provider}
                      campaign={`akcii_${p.provider.slug}`}
                      content={p.id}
                      place="promo"
                      className="btn btn-brass btn-sm"
                    >
                      Get it at {p.provider.name}
                    </OutLink>
                    <Link href={`/providers/${p.provider.slug}`} className="btn btn-ghost btn-sm">
                      Provider review
                    </Link>
                  </div>

                  <p className="faint" style={{ marginTop: 10, fontSize: '0.85rem' }}>
                    {p.validUntil ? `valid until ${fmtDate(p.validUntil, LOCALE)}` : 'no announced end date'}
                    {p.provider.affiliateStatus === 'active'
                      ? '. This is an affiliate link: if you sign up we earn a commission, at no extra cost to you'
                      : ''}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="grid-2 mt-lg">
            <div className="notice">
              <strong>Why there are few deals here.</strong> We publish only what we have checked by
              hand: the promo code entered, the discount applied, the limits written down. A showcase
              of a hundred unverified coupons has the opposite effect: half the codes do not work
            </div>
            <div className="notice">
              <strong>About honest prices.</strong> A promo price almost always applies to the first
              billing term. Check the renewal price in the <Link href="/catalog">catalog</Link>:
              overpaying for a brand shows up in the price per gigabyte of memory, not in the size of
              the discount
            </div>
          </div>

          <p className="faint mt">
            A deal older than {STATS.staleDays} days without a re-check is hidden automatically, just
            like the plans in the catalog
          </p>
        </div>
      </section>
    </>
  );
}
