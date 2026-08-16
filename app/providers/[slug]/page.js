import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHead from '@/components/PageHead';
import OutLink from '@/components/OutLink';
import JsonLd from '@/components/JsonLd';
import Freshness from '@/components/Freshness';
import TaskIcon from '@/components/TaskIcon';
import {
  PROVIDERS,
  providersFor,
  getProvider,
  plansOf,
  allPlansOf,
  minPriceOf,
  TASKS,
  GEOS,
  REQUIREMENTS,
  providerMeets,
  STATS,
} from '@/lib/data';
import { CAMPAIGN } from '@/lib/utm';
import { fmtPrice, fmtDate, USD_RATE } from '@/lib/format';
import { absUrl } from '@/lib/site';

const LOCALE = 'en';

export function generateStaticParams() {
  return providersFor('en').map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const provider = getProvider(slug);
  if (!provider) return {};
  const min = minPriceOf(slug);
  const desc = provider.descriptionEn || provider.description;
  return {
    title: `${provider.name}: plans, specs and limitations`,
    description: `${desc.slice(0, 150)}${min ? ` Plans from ${fmtPrice(min, LOCALE)} per month.` : ''} What the provider covers, what it does not, and which workloads it fits`,
    alternates: {
      canonical: `/providers/${slug}`,
    },
  };
}

export default async function ProviderPageEn({ params }) {
  const { slug } = await params;
  const provider = getProvider(slug);
  if (!provider) notFound();

  const plans = plansOf(slug);
  const hidden = allPlansOf(slug).length - plans.length;
  const min = minPriceOf(slug);
  const tasks = TASKS.filter((t) => (provider.tasks || []).includes(t.slug));
  const geos = GEOS.filter((g) => (provider.geos || []).includes(g.code));
  const isPartner = provider.affiliateStatus === 'active';
  const desc = provider.descriptionEn || provider.description;
  const pros = provider.prosEn || provider.pros;
  const cons = provider.consEn || provider.cons;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: provider.name,
          url: provider.site,
          description: desc,
        }}
      />
      {plans.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${provider.name} plans`,
            numberOfItems: plans.length,
            itemListElement: plans.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Product',
                name: `${provider.name} ${p.nameEn || p.name}`,
                description: `${p.cpu} × ${p.ram} GB, ${p.disk} GB ${p.diskType} disk`,
                offers: {
                  '@type': 'Offer',
                  price: Math.max(1, Math.round(p.priceRub / USD_RATE)),
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                  url: absUrl(`/providers/${slug}`),
                },
              },
            })),
          }}
        />
      )}

      <PageHead
        locale={LOCALE}
        eyebrow="Provider review"
        title={provider.name}
        lead={desc}
        crumbs={[
          { href: '/providers', label: 'Providers' },
          { href: `/providers/${slug}`, label: provider.name },
        ]}
        badges={
          <>
            {min && <span className="badge badge-brass">plans from {fmtPrice(min, LOCALE)}</span>}
            <span className="badge">
              {provider.country === 'RU' ? 'Russian provider' : 'international provider'}
            </span>
            {geos.map((g) => (
              <span className="badge" key={g.code}>{g.nameEn || g.name}</span>
            ))}
            {!isPartner && <span className="badge badge-plain">no affiliation</span>}
          </>
        }
      >
        <div className="row mt">
          <OutLink provider={provider} campaign={CAMPAIGN.providerPage} className="btn btn-brass">
            {isPartner ? `Go to ${provider.name}` : `Open ${provider.name}`}
          </OutLink>
          <Link href="/#podbor" className="btn btn-ghost">
            Compare with others
          </Link>
        </div>
        <p className="disclosure" style={{ maxWidth: 640 }}>
          {isPartner
            ? 'This is an affiliate link: if you sign up, we earn a commission. The price for you does not change, and it has no effect on the provider’s position in the matching'
            : 'We have no affiliate relationship with this provider. The link is a plain one and we earn nothing from the click'}
        </p>
      </PageHead>

      <section className="section paper">
        <div className="wrap">
          <div className="grid-2">
            <div>
              <div className="eyebrow">
                <span className="label">Strengths</span>
              </div>
              <ul className="list-check">
                {pros.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow">
                <span className="label">Limitations</span>
              </div>
              <ul className="list-check list-minus">
                {cons.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="faint mt">
                A limitations section is in every review. A review without one would be an
                advertisement, not a reference material
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section paper-alt">
        <div className="wrap">
          <div className="between mb">
            <div>
              <div className="eyebrow">
                <span className="label">Plans</span>
              </div>
              <h2>What is in the base</h2>
            </div>
            <Freshness date={STATS.verifiedAt} locale={LOCALE} />
          </div>

          {plans.length === 0 ? (
            <div className="notice notice-warn">
              {allPlansOf(slug).length === 0 ? (
                <>
                  <strong>Prices not verified yet.</strong> We have not checked this provider’s price
                  list yet, so there are no prices here at all. We will not make them up: the point of
                  the catalog is that a shown price can be trusted. The provider stays in the
                  comparison, and the specs below are current
                </>
              ) : (
                <>
                  <strong>Prices under review.</strong> This provider’s plans have not been checked
                  for more than {STATS.staleDays} days, so we have hidden them. Showing a stale price
                  is worse than showing none
                </>
              )}
            </div>
          ) : (
            <div className="tbl-wrap">
              <div className="tbl-scroll">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>CPU</th>
                      <th>RAM</th>
                      <th>Disk</th>
                      <th>Location</th>
                      <th>IPv4</th>
                      <th>Verified</th>
                      <th style={{ textAlign: 'right' }}>Price</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600 }}>{p.nameEn || p.name}</td>
                        <td className="td-num">{p.cpu}</td>
                        <td className="td-num">{p.ram} GB</td>
                        <td className="td-num">
                          {p.disk} GB <span className="faint">{p.diskType}</span>
                        </td>
                        <td>{GEOS.find((g) => g.code === p.geo)?.nameEn || GEOS.find((g) => g.code === p.geo)?.name || p.geo}</td>
                        {/* null = the provider does not state it on the plan page,
                            which is not the same as "there is no address" */}
                        <td className="td-num">
                          {p.ipv4 === true ? 'yes' : p.ipv4 === false ? 'no' : <span className="faint">unverified</span>}
                        </td>
                        <td className="td-num faint">
                          {fmtDate(p.verifiedAt, LOCALE)}
                          {p.source && (
                            <>
                              {' '}
                              <a
                                href={p.source}
                                target="_blank"
                                rel="nofollow noopener"
                                className="link-brass"
                                title="The price-list page the price was checked against"
                              >
                                price list
                              </a>
                            </>
                          )}
                        </td>
                        <td className="td-price" style={{ textAlign: 'right' }}>{fmtPrice(p.priceRub, LOCALE)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <OutLink
                            provider={provider}
                            campaign={CAMPAIGN.providerPage}
                            content={p.id}
                            className="btn btn-ghost btn-sm"
                          >
                            Open
                          </OutLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {hidden > 0 && (
            <p className="faint mt">
              {hidden} more {hidden === 1 ? 'plan is' : 'plans are'} hidden because the price has not
              been checked for more than {STATS.staleDays} days
            </p>
          )}
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="grid-2">
            <div>
              <div className="eyebrow">
                <span className="label">Specs</span>
              </div>
              <dl className="specs">
                <div className="spec">
                  <dt>Virtualization</dt>
                  <dd>{(provider.virtualization || []).join(', ') || '—'}</dd>
                </div>
                <div className="spec">
                  <dt>Locations</dt>
                  <dd>{geos.map((g) => g.nameEn || g.name).join(', ') || '—'}</dd>
                </div>
                {REQUIREMENTS.map((r) => (
                  <div className="spec" key={r.code}>
                    <dt>{r.nameEn || r.name}</dt>
                    <dd style={{ color: providerMeets(provider, r.code) ? 'var(--ok)' : 'var(--text-faint)' }}>
                      {providerMeets(provider, r.code) ? 'yes' : 'no'}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <div className="eyebrow">
                <span className="label">Which workloads it fits</span>
              </div>
              {tasks.length === 0 ? (
                <p className="dim">The provider does not claim a specialization for any specific scenario</p>
              ) : (
                <div className="chips">
                  {tasks.map((t) => (
                    <Link key={t.slug} href={`/vps-for/${t.slug}`} className="chip chip-light">
                      <TaskIcon slug={t.slug} size={16} />
                      {t.nameEn || t.name}
                    </Link>
                  ))}
                </div>
              )}
              <div className="notice mt">
                <strong>How we decide this.</strong> A workload makes the list if the provider claims
                it itself or if it has plans with a suitable configuration. It affects the matching: a
                workload fit adds +25 points,{' '}
                <Link href="/methodology">the full formula</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight paper-alt">
        <div className="wrap">
          <div className="notice">
            <strong>Disclosure.</strong>{' '}
            {isPartner
              ? `We have an affiliate relationship with ${provider.name}: we earn a commission for a service ordered through our link. It affects neither the provider’s position in the matching nor the content of the review: everyone has a limitations section.`
              : `We have no affiliate relationship with ${provider.name} and earn nothing from clicks. The provider is in the catalog because the comparison would be incomplete without it.`}{' '}
            <Link href="/methodology">The matching formula is fully open</Link>
          </div>
        </div>
      </section>
    </>
  );
}
