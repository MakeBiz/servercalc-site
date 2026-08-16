import Link from 'next/link';
import Calculator from '@/components/Calculator';
import ProviderCard from '@/components/ProviderCard';
import TaskIcon from '@/components/TaskIcon';
import JsonLd from '@/components/JsonLd';
import { calculatorPayload, TASKS, GEO_PAGES, PROVIDERS, STATS, minPriceOf, geoPagesFor, providersFor } from '@/lib/data';
import { fmtNum, fmtDate } from '@/lib/format';
import { CAMPAIGN } from '@/lib/utm';
import { SITE_NAME, SITE_URL } from '@/lib/site';

const LOCALE = 'en';

export const metadata = {
  title: 'Find the right VPS for your workload',
  description:
    'A VPS matching calculator: pick a workload, resources and location and get a list of providers with an explanation of why each plan fits. Every price carries a verification date',
  alternates: {
    canonical: '/',
  },
};

const FAQ = [
  {
    q: 'How is the match percentage calculated',
    a: 'Every provider starts at a base of 42 points, then points are added or removed for fitting the workload, location, met requirements, resource coverage, staying within budget and price per gigabyte of RAM relative to the base median. The affiliate commission is not a term in the formula; the weights are published on the methodology page',
  },
  {
    q: 'Why are there providers you have no affiliation with',
    a: 'Because the catalog would be incomplete without them. Providers with no affiliate relationship take part in the matching on equal terms and are marked separately; their link is a plain link with no affiliate tag',
  },
  {
    q: 'How current are the prices',
    a: 'Every plan has a verification date shown on the card. A plan not checked for more than seven days is hidden automatically rather than shown with an old price. Prices are checked by hand against provider price lists. If we have not verified a provider’s price yet, it is not shown at all: instead there is a note that the data is being updated',
  },
  {
    q: 'Do you charge providers for a spot in the list',
    a: 'No. The order is set by the formula; there is no paid placement in the catalog. We earn on affiliate clicks, and that has no effect on a provider’s position in the calculator output',
  },
];

export default function HomePageEn() {
  const payload = calculatorPayload('en');
  const providers = [...providersFor('en')].sort((a, b) => {
    const pa = minPriceOf(a.slug) ?? Infinity;
    const pb = minPriceOf(b.slug) ?? Infinity;
    return pa - pb;
  });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          inLanguage: 'en-US',
          description:
            'Reference catalog of virtual servers with workload-based matching and a verification date on every price',
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          inLanguage: 'en-US',
          mainEntity: FAQ.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }}
      />

      {/* ---------- hero + calculator ---------- */}
      <section className="hero ink">
        <div className="wrap hero-in">
          <div className="hero-head">
            <div className="eyebrow">
              <span className="label label-brass">Server reference catalog</span>
            </div>
            <h1 className="display">
              Find a server for
              <br />
              a specific job
            </h1>
            <p className="lead">
              We match by workload, resources, location and requirements. Instead of a showcase, we
              show the reasoning: why this plan fits and what the provider is missing
            </p>
          </div>

          <Calculator payload={payload} campaign={CAMPAIGN.calculator} split locale={LOCALE} />

          <div style={{ height: 72 }} />
        </div>
      </section>

      {/* ---------- three principles ---------- */}
      <section className="section paper">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label">How the service works</span>
          </div>
          <div className="cards" style={{ marginTop: 8 }}>
            <div className="card">
              <div className="card-top">
                <h3>A date on every price</h3>
                <span className="badge badge-brass">key difference</span>
              </div>
              <p className="dim" style={{ fontSize: '0.95rem' }}>
                11 of the 13 catalogs we checked show no price-check date at all. We put it on every
                plan, and stale ones drop off the showcase automatically
              </p>
              <div className="card-foot">
                <span className="faint">data verified</span>
                <span className="mono">{fmtDate(STATS.verifiedAt, LOCALE)}</span>
              </div>
            </div>

            <div className="card">
              <div className="card-top">
                <h3>An open formula</h3>
              </div>
              <p className="dim" style={{ fontSize: '0.95rem' }}>
                The matching weights are published: you can see how many points the workload,
                location, requirements and budget add. Provider commission is not part of it
              </p>
              <div className="card-foot">
                <Link href="/methodology" className="link-arrow">
                  Methodology
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="card-top">
                <h3>The same presentation for all</h3>
              </div>
              <p className="dim" style={{ fontSize: '0.95rem' }}>
                No pinned blocks, no “editor’s choice” labels, no paid spots. Every card looks the
                same, and each review has a limitations section
              </p>
              <div className="card-foot">
                <Link href="/providers" className="link-arrow">
                  Provider reviews
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- workloads ---------- */}
      <section className="section paper-alt">
        <div className="wrap">
          <div className="between mb">
            <div>
              <div className="eyebrow">
                <span className="label">Match by workload</span>
              </div>
              <h2>What the server has to handle</h2>
              <p className="lead">
                Each page has a recommended configuration with an explanation of why that many
                resources, and the plans that fit
              </p>
            </div>
          </div>
          <div className="cards cards-4">
            {TASKS.map((task) => (
              <Link key={task.slug} href={`/vps-for/${task.slug}`} className="card">
                <div className="card-top">
                  <span className="card-ico"><TaskIcon slug={task.slug} size={24} /></span>
                </div>
                <h3 style={{ fontSize: '1.05rem' }}>{task.nameEn}</h3>
                <p className="faint" style={{ margin: 0 }}>
                  {task.cpu} × {task.ram} GB suggested
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- locations ---------- */}
      <section className="section paper">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label">Locations</span>
          </div>
          <h2>Where to host the server</h2>
          <div className="cards cards-4 mt">
            {geoPagesFor('en').map((geo) => (
              <Link key={geo.slug} href={`/vps-in/${geo.slug}`} className="card">
                <h3 style={{ fontSize: '1.05rem' }}>{geo.nameEn}</h3>
                <p className="faint" style={{ margin: 0 }}>{geo.noteEn}</p>
                <div className="card-foot">
                  <span className="faint">plans</span>
                  <span className="mono">{payload.plans.filter((p) => p.geo === geo.code).length}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- providers ---------- */}
      <section className="section paper-alt">
        <div className="wrap">
          <div className="between mb">
            <div>
              <div className="eyebrow">
                <span className="label">Providers</span>
              </div>
              <h2>Who’s in the comparison</h2>
              <p className="lead">
                Sorted by the lowest price in the base. The comparison includes providers we have no
                affiliation with: the catalog would be incomplete without them
              </p>
            </div>
            <Link href="/providers" className="btn btn-ghost">
              All providers
            </Link>
          </div>
          <div className="cards cards-2">
            {providers.slice(0, 6).map((p) => (
              <ProviderCard key={p.slug} provider={p} minPrice={minPriceOf(p.slug)} campaign={CAMPAIGN.providers} locale={LOCALE} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- catalog ---------- */}
      <section className="section ink">
        <div className="wrap">
          <div className="grid-2">
            <div>
              <div className="eyebrow">
                <span className="label label-brass">Catalog</span>
              </div>
              <h2>Every plan in one table</h2>
              <p className="lead">
                Filters by location, memory, cores and requirements. Sort by price, by memory and by
                price per gigabyte of RAM: a normalized metric that shows where you overpay for a
                brand
              </p>
              <div className="row mt">
                <Link href="/catalog" className="btn btn-brass">
                  Open the catalog
                </Link>
                <Link href="/methodology" className="btn btn-ghost">
                  How we score
                </Link>
              </div>
            </div>
            <div>
              <div className="notice">
                <strong>Freshness rule.</strong> A plan not checked for more than {STATS.staleDays}{' '}
                days is hidden from the showcase automatically rather than shown with an old price.
                The base currently holds {fmtNum(STATS.plansTotal, LOCALE)} plans, {STATS.hidden} of
                them hidden
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section paper-alt">
        <div className="wrap-narrow" style={{ padding: 0 }}>
          <div className="wrap">
            <div className="eyebrow">
              <span className="label">Frequently asked</span>
            </div>
            <h2>What people ask most</h2>
            <div className="stack-lg mt">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <h3>{item.q}</h3>
                  <p className="dim">{item.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-lg">
              <p className="faint">
                A plan not checked for more than {STATS.staleDays} days is hidden from the showcase
                automatically rather than shown with an old price
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
