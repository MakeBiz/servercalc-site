import Link from 'next/link';
import PageHead from '@/components/PageHead';
import Catalog from '@/components/Catalog';
import JsonLd from '@/components/JsonLd';
import { catalogRows, PROVIDERS, GEO_PAGES, REQUIREMENTS, STATS, VISIBLE_PLANS, META, providersFor, geoPagesFor, visiblePlansFor } from '@/lib/data';
import { fmtPrice, USD_RATE } from '@/lib/format';
import { fmtDate } from '@/lib/format';
import { absUrl } from '@/lib/site';

const LOCALE = 'en';

export const metadata = {
  title: 'VPS plan catalog',
  description:
    'Every virtual server plan in one table: filters by location, memory, cores and requirements, sorting by price and by price per gigabyte of memory. Every plan carries a price-verification date',
  alternates: {
    canonical: '/catalog',
  },
};

export default function CatalogPageEn() {
  const rows = catalogRows('en');
  const providers = providersFor('en').map((p) => ({
    slug: p.slug,
    name: p.name,
    affiliateStatus: p.affiliateStatus,
    url: p.url,
    noUtm: p.noUtm || false,
    site: p.site,
  }));

  const cheapest = [...visiblePlansFor('en')].sort((a, b) => a.priceRub - b.priceRub)[0];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Virtual server plan catalog',
          numberOfItems: rows.length,
          itemListElement: rows.slice(0, 40).map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Product',
              name: `${r.providerName} ${r.name}`,
              description: `${r.cpu} × ${r.ram} GB, ${r.disk} GB ${r.diskType} disk, ${r.geoName}`,
              offers: {
                '@type': 'Offer',
                price: Math.max(1, Math.round(r.priceRub / USD_RATE)),
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: absUrl(`/providers/${r.providerSlug}`),
              },
            },
          })),
        }}
      />

      <PageHead
        locale={LOCALE}
        eyebrow="Catalog"
        title="Plan catalog"
        lead="The full table of plans from the base. Compare not by the showcase price but by price per gigabyte of memory: that metric shows where you overpay for a brand"
        crumbs={[{ href: '/catalog', label: 'Plan catalog' }]}
        badges={
          <>
            <span className="badge badge-brass">{STATS.plans} plans</span>
            <span className="badge">data verified {fmtDate(STATS.verifiedAt, LOCALE)}</span>
            {cheapest && <span className="badge">from {fmtPrice(cheapest.priceRub, LOCALE)}</span>}
          </>
        }
      />

      <section className="section paper">
        <div className="wrap">
          <Catalog rows={rows} providers={providers} geos={geoPagesFor('en')} requirements={REQUIREMENTS} locale={LOCALE} />

          <p className="faint mt">{META.rateNoteEn || META.rateNote}</p>

          <div className="grid-3 mt-lg">
            <div className="notice">
              <strong>What “verified” means.</strong> It is the date the price was checked against the
              provider’s price list. A plan not checked for more than {STATS.staleDays} days drops out
              of the table automatically, see the{' '}
              <Link href="/methodology">freshness rule</Link>
            </div>
            <div className="notice">
              <strong>The showcase price is not the whole price.</strong> A plan usually adds an IPv4
              address, a panel, backups and traffic over the limit, see the{' '}
              <Link href="/methodology">methodology</Link>
            </div>
            <div className="notice">
              <strong>What the table does not have.</strong> Paid spots and pinned rows. Order is set
              by the chosen sort, the size of the commission does not affect it,{' '}
              <Link href="/methodology">methodology</Link>
            </div>
          </div>

          <div className="mt">
            <p className="faint">
              A plan not checked for more than {STATS.staleDays} days is hidden from the table
              automatically rather than shown with an old price
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
