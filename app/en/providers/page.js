import PageHead from '@/components/PageHead';
import ProviderCard from '@/components/ProviderCard';
import JsonLd from '@/components/JsonLd';
import { PROVIDERS, STATS, minPriceOf, plansOf } from '@/lib/data';
import { CAMPAIGN } from '@/lib/utm';
import { fmtDate } from '@/lib/format';
import { absUrl } from '@/lib/site';

const LOCALE = 'en';

export const metadata = {
  title: 'VPS providers in the comparison',
  description:
    'Every virtual server provider in the matching: Russian and international, with and without affiliate relationships. Each has its own page with plans and limitations',
  alternates: {
    canonical: '/en/providers',
    languages: { ru: '/provajdery', en: '/en/providers', 'x-default': '/provajdery' },
  },
};

export default function ProvidersPageEn() {
  const ru = PROVIDERS.filter((p) => p.country === 'RU');
  const intl = PROVIDERS.filter((p) => p.country !== 'RU');
  const sortByPrice = (a, b) => (minPriceOf(a.slug) ?? Infinity) - (minPriceOf(b.slug) ?? Infinity);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Virtual server providers',
          numberOfItems: PROVIDERS.length,
          itemListElement: PROVIDERS.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.name,
            url: absUrl(`/en/providers/${p.slug}`),
          })),
        }}
      />

      <PageHead
        locale={LOCALE}
        eyebrow="Providers"
        title="Providers in the comparison"
        lead="The catalog deliberately includes providers we have no affiliate relationship with: without them the comparison would be incomplete and the matching dishonest"
        crumbs={[{ href: '/en/providers', label: 'Providers' }]}
        badges={
          <>
            <span className="badge badge-brass">{STATS.plans} plans with a verified price</span>
            <span className="badge">verified {fmtDate(STATS.verifiedAt, LOCALE)}</span>
          </>
        }
      />

      <section className="section paper">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label">Russian providers</span>
          </div>
          <p className="lead mb">
            Data centers in Russia, contracts and proper invoicing for legal entities, and in-country
            data residency
          </p>
          <div className="cards cards-2">
            {[...ru].sort(sortByPrice).map((p) => (
              <ProviderCard key={p.slug} provider={p} minPrice={minPriceOf(p.slug)} campaign={CAMPAIGN.providers} locale={LOCALE} />
            ))}
          </div>
        </div>
      </section>

      <section className="section paper-alt">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label">International providers</span>
          </div>
          <p className="lead mb">
            Locations in Europe, the USA, the UAE and worldwide. A fit when your project’s audience is
            outside Russia or you need a specific host country
          </p>
          <div className="cards cards-2">
            {[...intl].sort(sortByPrice).map((p) => (
              <ProviderCard key={p.slug} provider={p} minPrice={minPriceOf(p.slug)} campaign={CAMPAIGN.providers} locale={LOCALE} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight paper">
        <div className="wrap">
          <div className="notice">
            <strong>How this list is formed.</strong> A provider makes the catalog if it has a public
            price list we can verify and a line of virtual servers. Position in the list depends on
            the lowest price in the base, not on the size of the commission. The base holds{' '}
            {PROVIDERS.reduce((n, p) => n + plansOf(p.slug).length, 0)} verified plans in total
          </div>
        </div>
      </section>
    </>
  );
}
