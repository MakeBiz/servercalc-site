import Link from 'next/link';
import PageHead from '@/components/PageHead';
import JsonLd from '@/components/JsonLd';
import { GEO_PAGES, providersForGeo, plansForGeo, geoPagesFor } from '@/lib/data';
import { geoContentEn } from '@/lib/geo-content-en';
import { fmtPrice } from '@/lib/format';
import { absUrl } from '@/lib/site';

const LOCALE = 'en';

export const metadata = {
  title: 'Where to host a VPS',
  description:
    'Where to place a server: Russia, Europe, the UAE, the USA, Kazakhstan, or a provider with a worldwide network. A breakdown of latency, price per resource and data-residency requirements',
  alternates: {
    canonical: '/vps-in',
  },
};

export default function GeosPageEn() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'VPS hosting locations',
          numberOfItems: geoPagesFor('en').length,
          itemListElement: geoPagesFor('en').map((g, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: g.h1En || g.h1,
            url: absUrl(`/vps-in/${g.slug}`),
          })),
        }}
      />

      <PageHead
        locale={LOCALE}
        eyebrow="Locations"
        title="Where to host the server"
        lead="Location affects three things: latency to your audience, the price for the same resources, and which data you are allowed to keep there. Every page covers all three"
        crumbs={[{ href: '/vps-in', label: 'Locations' }]}
        badges={<span className="badge badge-brass">{geoPagesFor('en').length} locations</span>}
      />

      <section className="section paper">
        <div className="wrap">
          <div className="cards cards-2">
            {geoPagesFor('en').map((geo) => {
              const plans = plansForGeo(geo.code, 'en');
              const providers = providersForGeo(geo.code, 'en');
              const content = geoContentEn(geo.slug);
              return (
                <Link key={geo.slug} href={`/vps-in/${geo.slug}`} className="card">
                  <div className="card-top">
                    <h3>{geo.h1En || geo.h1}</h3>
                    <span className="badge">
                      {plans.length} {plans.length === 1 ? 'plan' : 'plans'}
                    </span>
                  </div>
                  <p className="faint" style={{ margin: 0 }}>{geo.noteEn || geo.note}</p>
                  {content && (
                    <p className="dim" style={{ fontSize: '0.9rem', margin: 0 }}>
                      {content.why.split('. ')[0]}
                    </p>
                  )}
                  <div className="card-foot">
                    <span className="faint">
                      {providers.length} {providers.length === 1 ? 'provider' : 'providers'}
                    </span>
                    <span className="mono">{plans[0] ? `from ${fmtPrice(plans[0].priceRub, LOCALE)}` : '—'}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="notice mt-lg">
            <strong>About personal data.</strong> If a project collects the personal data of Russian
            users, it must be processed using databases located in Russia. This applies to sign-ups,
            forms and personal accounts, and it is a matter of legal setup, not performance. For
            projects without personal data, the location is chosen only by latency and price
          </div>
        </div>
      </section>
    </>
  );
}
