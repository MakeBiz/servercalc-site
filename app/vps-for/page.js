import Link from 'next/link';
import PageHead from '@/components/PageHead';
import TaskIcon from '@/components/TaskIcon';
import JsonLd from '@/components/JsonLd';
import { TASKS, providersForTask, VISIBLE_PLANS } from '@/lib/data';
import { taskContentEn } from '@/lib/task-content-en';
import { fmtPrice } from '@/lib/format';
import { absUrl } from '@/lib/site';

const LOCALE = 'en';

export const metadata = {
  title: 'Choose a VPS by workload',
  description:
    'Nine common scenarios with a recommended configuration and an explanation of why that many resources: a website, a store, 1C and Bitrix, a database, bots, automation, games, development',
  alternates: {
    canonical: '/vps-for',
  },
};

export default function TasksPageEn() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Choose a VPS by workload',
          numberOfItems: TASKS.length,
          itemListElement: TASKS.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t.h1En || t.h1,
            url: absUrl(`/vps-for/${t.slug}`),
          })),
        }}
      />

      <PageHead
        locale={LOCALE}
        eyebrow="Workloads"
        title="Match by workload"
        lead="A server is chosen not by gigabytes but by what will run on it. Every page has a configuration with an explanation of where the numbers come from and a list of what to check with the provider before paying"
        crumbs={[{ href: '/vps-for', label: 'Workloads' }]}
        badges={
          <>
            <span className="badge badge-brass">{TASKS.length} scenarios</span>
            <span className="badge">three configuration tiers on each</span>
          </>
        }
      />

      <section className="section paper">
        <div className="wrap">
          <div className="cards cards-2">
            {TASKS.map((task) => {
              const providers = providersForTask(task.slug);
              const suited = VISIBLE_PLANS.filter(
                (p) => p.ram >= task.ram && p.cpu >= task.cpu && providers.some((x) => x.slug === p.providerSlug)
              ).sort((a, b) => a.priceRub - b.priceRub);
              const content = taskContentEn(task.slug);
              return (
                <Link key={task.slug} href={`/vps-for/${task.slug}`} className="card">
                  <div className="card-top">
                    <span className="card-ico"><TaskIcon slug={task.slug} size={24} /></span>
                    <span className="badge">{task.cpu} × {task.ram} GB</span>
                  </div>
                  <h3>{task.h1En || task.h1}</h3>
                  <p className="faint" style={{ margin: 0 }}>{task.intentEn || task.intent}</p>
                  {content && (
                    <p className="dim" style={{ fontSize: '0.9rem', margin: 0 }}>
                      {content.why.split('.')[0]}
                    </p>
                  )}
                  <div className="card-foot">
                    <span className="faint">
                      {providers.length} {providers.length === 1 ? 'provider' : 'providers'}
                    </span>
                    <span className="mono">{suited[0] ? `from ${fmtPrice(suited[0].priceRub, LOCALE)}` : '—'}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="notice mt-lg">
            <strong>What is not here.</strong> We do not create a page for every filter combination:
            that produces thousands of near-identical pages, which search engines penalize. A workload
            page exists only if it has its own resource recommendation and a clear list of checks
          </div>
        </div>
      </section>
    </>
  );
}
