import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHead from '@/components/PageHead';
import Calculator from '@/components/Calculator';
import ProviderCard from '@/components/ProviderCard';
import JsonLd from '@/components/JsonLd';
import { GEO_PAGES, getGeo, providersForGeo, plansForGeo, minPriceOf, calculatorPayload, STATS } from '@/lib/data';
import { geoContentEn } from '@/lib/geo-content-en';
import { CAMPAIGN } from '@/lib/utm';
import { fmtPrice, fmtDate } from '@/lib/format';

const LOCALE = 'en';

export function generateStaticParams() {
  return GEO_PAGES.map((g) => ({ geo: g.slug }));
}

export async function generateMetadata({ params }) {
  const { geo: slug } = await params;
  const geo = getGeo(slug);
  if (!geo) return {};
  return {
    title: geo.h1En || geo.h1,
    description: `${geo.noteEn || geo.note}. Providers with a location in this region, plans with a price-verification date, and a breakdown of who this hosting fits and who it does not`,
    alternates: {
      canonical: `/vps-in/${slug}`,
    },
  };
}

export default async function GeoPageEn({ params }) {
  const { geo: slug } = await params;
  const geo = getGeo(slug);
  if (!geo) notFound();

  const content = geoContentEn(slug);
  const providers = providersForGeo(geo.code);
  const plans = plansForGeo(geo.code);
  const payload = calculatorPayload();
  const cheapest = plans[0];
  const name = geo.nameEn || geo.name;

  return (
    <>
      {content?.faq && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: 'en-US',
            mainEntity: content.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
      )}

      <PageHead
        locale={LOCALE}
        eyebrow="Locations"
        title={geo.h1En || geo.h1}
        lead={geo.noteEn || geo.note}
        crumbs={[
          { href: '/vps-in', label: 'Locations' },
          { href: `/vps-in/${slug}`, label: name },
        ]}
        badges={
          <>
            <span className="badge badge-brass">
              {plans.length} {plans.length === 1 ? 'plan' : 'plans'}
            </span>
            <span className="badge">
              {providers.length} {providers.length === 1 ? 'provider' : 'providers'}
            </span>
            {cheapest && <span className="badge">from {fmtPrice(cheapest.priceRub, LOCALE)} / month</span>}
            <span className="badge">verified {fmtDate(STATS.verifiedAt, LOCALE)}</span>
          </>
        }
      />

      <section className="section paper">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label">Why this location</span>
          </div>
          <h2>Who {name} fits</h2>
          <p className="lead mb">{content?.why}</p>

          <div className="grid-2 mt">
            <div>
              <div className="eyebrow">
                <span className="label">What it gives you</span>
              </div>
              <ul className="list-check">
                {content?.pros.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow">
                <span className="label">What you pay for it</span>
              </div>
              <ul className="list-check list-minus">
                {content?.cons.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section ink">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label label-brass">Matching</span>
          </div>
          <h2 style={{ marginBottom: 24 }}>Find a server located in {name}</h2>
          <Calculator payload={payload} presetGeo={slug} campaign={CAMPAIGN.geo(slug)} locale={LOCALE} />
        </div>
      </section>

      <section className="section paper">
        <div className="wrap">
          <div className="between mb">
            <div>
              <div className="eyebrow">
                <span className="label">Plans</span>
              </div>
              <h2>Plans with this location</h2>
            </div>
            <Link href="/catalog" className="btn btn-ghost">
              Full catalog
            </Link>
          </div>

          {plans.length === 0 ? (
            <div className="notice notice-warn">
              <strong>Empty for now.</strong> Plans with this location have not been checked for more
              than {STATS.staleDays} days and are hidden from the showcase
            </div>
          ) : (
            <div className="tbl-wrap">
              <div className="tbl-scroll">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Plan</th>
                      <th>CPU</th>
                      <th>RAM</th>
                      <th>Disk</th>
                      <th>Price per GB</th>
                      <th>Verified</th>
                      <th style={{ textAlign: 'right' }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((p) => {
                      const provider = providers.find((x) => x.slug === p.providerSlug);
                      return (
                        <tr key={p.id}>
                          <td>
                            <Link href={`/providers/${p.providerSlug}`} style={{ textDecoration: 'none', fontWeight: 600 }}>
                              {provider?.name || p.providerSlug}
                            </Link>
                          </td>
                          <td>{p.nameEn || p.name}</td>
                          <td className="td-num">{p.cpu}</td>
                          <td className="td-num">{p.ram} GB</td>
                          <td className="td-num">{p.disk} GB <span className="faint">{p.diskType}</span></td>
                          <td className="td-num">{fmtPrice(p.priceRub / p.ram, LOCALE)}</td>
                          <td className="td-num faint">{fmtDate(p.verifiedAt, LOCALE)}</td>
                          <td className="td-price" style={{ textAlign: 'right' }}>{fmtPrice(p.priceRub, LOCALE)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section paper-alt">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label">Providers</span>
          </div>
          <h2 style={{ marginBottom: 24 }}>Who has this location</h2>
          <div className="cards cards-2">
            {providers.map((p) => (
              <ProviderCard
                key={p.slug}
                provider={p}
                minPrice={minPriceOf(p.slug)}
                campaign={CAMPAIGN.geo(slug)}
                geoLabel={name}
                locale={LOCALE}
              />
            ))}
          </div>
        </div>
      </section>

      {content?.faq && (
        <section className="section paper">
          <div className="wrap">
            <div className="eyebrow">
              <span className="label">Questions</span>
            </div>
            <h2 style={{ marginBottom: 26 }}>Common questions about this location</h2>
            <div className="stack-lg">
              {content.faq.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p className="dim">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-tight paper-alt">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label">Other locations</span>
          </div>
          <div className="chips">
            {GEO_PAGES.filter((g) => g.slug !== slug).map((g) => (
              <Link key={g.slug} href={`/vps-in/${g.slug}`} className="chip chip-light">
                {g.nameEn || g.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
