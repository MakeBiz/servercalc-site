import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHead from '@/components/PageHead';
import Calculator from '@/components/Calculator';
import ProviderCard from '@/components/ProviderCard';
import JsonLd from '@/components/JsonLd';
import TaskIcon from '@/components/TaskIcon';
import { TASKS, getTask, providersForTask, minPriceOf, calculatorPayload, VISIBLE_PLANS, STATS } from '@/lib/data';
import { taskContentEn } from '@/lib/task-content-en';
import { postsForTask, rubricName } from '@/lib/news';
import { CAMPAIGN } from '@/lib/utm';
import { fmtPrice, fmtDate } from '@/lib/format';

const LOCALE = 'en';

export function generateStaticParams() {
  return TASKS.map((t) => ({ task: t.slug }));
}

export async function generateMetadata({ params }) {
  const { task: slug } = await params;
  const task = getTask(slug);
  if (!task) return {};
  return {
    title: task.h1En || task.h1,
    description: `${task.intentEn || task.intent}. A recommended configuration with an explanation of why that many resources, what to check with the provider, and suitable plans with a price-verification date`,
    alternates: {
      canonical: `/en/vps-for/${slug}`,
      languages: {
        ru: `/vps-dlya/${slug}`,
        en: `/en/vps-for/${slug}`,
        'x-default': `/vps-dlya/${slug}`,
      },
    },
  };
}

export default async function TaskPageEn({ params }) {
  const { task: slug } = await params;
  const task = getTask(slug);
  if (!task) notFound();

  const content = taskContentEn(slug);
  const providers = providersForTask(slug);
  const related = postsForTask(slug, LOCALE);
  const payload = calculatorPayload();
  const suited = VISIBLE_PLANS.filter(
    (p) => p.ram >= task.ram && p.cpu >= task.cpu && providers.some((x) => x.slug === p.providerSlug)
  ).sort((a, b) => a.priceRub - b.priceRub);
  const cheapest = suited[0];
  const name = task.nameEn || task.name;

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
        eyebrow="Match by workload"
        title={task.h1En || task.h1}
        lead={task.intentEn || task.intent}
        crumbs={[
          { href: '/en/vps-for', label: 'Workloads' },
          { href: `/en/vps-for/${slug}`, label: name },
        ]}
        badges={
          <>
            <span className="badge badge-brass">we suggest {task.cpu} × {task.ram} GB</span>
            <span className="badge">{providers.length} matching providers</span>
            {cheapest && <span className="badge">from {fmtPrice(cheapest.priceRub, LOCALE)} / month</span>}
            <span className="badge">verified {fmtDate(STATS.verifiedAt, LOCALE)}</span>
          </>
        }
      />

      {/* configuration with an explanation: what people come to this page for */}
      <section className="section paper">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label">How many resources you need</span>
          </div>
          <h2>Why that many</h2>
          <p className="lead mb">{content?.why}</p>

          <div className="cards" style={{ marginTop: 26 }}>
            {content?.sizing.map((row, i) => (
              <div className="card" key={row.label}>
                <div className="card-top">
                  <span className="label" style={{ margin: 0 }}>
                    {String(i + 1).padStart(2, '0')} · {row.label}
                  </span>
                  {i === 1 && <span className="badge badge-brass">typical choice</span>}
                </div>
                <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
                  {row.cpu} × {row.ram} GB
                </div>
                <p className="faint" style={{ margin: 0 }}>disk from {row.disk} GB</p>
                <p className="dim" style={{ fontSize: '0.92rem', marginTop: 6 }}>{row.note}</p>
              </div>
            ))}
          </div>

          <div className="grid-2 mt-lg">
            <div>
              <div className="eyebrow">
                <span className="label">What to check before paying</span>
              </div>
              <ul className="list-check">
                {content?.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="notice">
              <strong>How this ties into the matching.</strong> The calculator below is already set up
              for this workload: {task.cpu} {task.cpu === 1 ? 'core' : 'cores'} and {task.ram} GB of
              memory from the recommendation are filled in. You can change the values and the match
              recalculates instantly. A workload fit adds +25 points to a provider,{' '}
              <Link href="/en/methodology">the full formula</Link>
            </div>
          </div>
        </div>
      </section>

      {/* calculator with a preset */}
      <section className="section ink">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label label-brass">Matching</span>
          </div>
          <h2 style={{ marginBottom: 24 }}>Find a server for a {name.toLowerCase()}</h2>
          <Calculator payload={payload} presetTask={slug} campaign={CAMPAIGN.task(slug)} locale={LOCALE} />
        </div>
      </section>

      {/* plans */}
      <section className="section paper">
        <div className="wrap">
          <div className="between mb">
            <div>
              <div className="eyebrow">
                <span className="label">Plans</span>
              </div>
              <h2>Suitable plans from the base</h2>
              <p className="lead">
                Selected are the ones that cover the recommended configuration: at least {task.cpu}{' '}
                {task.cpu === 1 ? 'core' : 'cores'} and {task.ram} GB of memory
              </p>
            </div>
            <Link href="/en/catalog" className="btn btn-ghost">
              Full catalog
            </Link>
          </div>

          {suited.length === 0 ? (
            <div className="notice notice-warn">
              <strong>Empty for now.</strong> The base has no plans with a verified price that cover
              this configuration. As soon as the parser updates prices, the list will appear
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
                    {suited.slice(0, 12).map((p) => {
                      const provider = providers.find((x) => x.slug === p.providerSlug);
                      return (
                        <tr key={p.id}>
                          <td>
                            <Link href={`/en/providers/${p.providerSlug}`} style={{ textDecoration: 'none', fontWeight: 600 }}>
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

      {/* providers */}
      <section className="section paper-alt">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label">Providers</span>
          </div>
          <h2 style={{ marginBottom: 24 }}>Who claims this workload</h2>
          <div className="cards cards-2">
            {providers.map((p) => (
              <ProviderCard key={p.slug} provider={p} minPrice={minPriceOf(p.slug)} campaign={CAMPAIGN.task(slug)} locale={LOCALE} />
            ))}
          </div>
        </div>
      </section>

      {/* questions */}
      {content?.faq && (
        <section className="section paper">
          <div className="wrap">
            <div className="eyebrow">
              <span className="label">Questions</span>
            </div>
            <h2 style={{ marginBottom: 26 }}>Common questions about a {name.toLowerCase()}</h2>
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

      {/* reviews on this workload */}
      {related.length > 0 && (
        <section className="section paper-alt">
          <div className="wrap">
            <div className="eyebrow">
              <span className="label">Related reading</span>
            </div>
            <h2 style={{ marginBottom: 26 }}>What to read before choosing</h2>
            <div className="cards cards-2">
              {related.map((p) => (
                <Link key={p.slug} href={`/en/news/${p.slug}`} className="card">
                  <div className="card-top">
                    <span className="badge">{rubricName(p.rubric, LOCALE)}</span>
                    <span className="faint mono">{fmtDate(p.date, LOCALE)}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem' }}>{p.title}</h3>
                  <p className="faint" style={{ margin: 0 }}>{p.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* other workloads */}
      <section className="section-tight paper">
        <div className="wrap">
          <div className="eyebrow">
            <span className="label">Other workloads</span>
          </div>
          <div className="chips">
            {TASKS.filter((t) => t.slug !== slug).map((t) => (
              <Link key={t.slug} href={`/en/vps-for/${t.slug}`} className="chip chip-light">
                <TaskIcon slug={t.slug} size={16} />
                {t.nameEn || t.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
