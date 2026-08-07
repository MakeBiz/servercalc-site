import Link from 'next/link';
import PageHead from '@/components/PageHead';
import JsonLd from '@/components/JsonLd';
import { allPosts, RUBRICS, rubricName } from '@/lib/news';
import { fmtDate } from '@/lib/format';
import { absUrl } from '@/lib/site';

const LOCALE = 'en';

export const metadata = {
  title: 'News and reviews',
  description:
    'Reviews on choosing a server, hosting-market news and a log of price changes in the catalog. Every piece answers a specific reader question rather than restating a press release',
  alternates: {
    canonical: '/news',
  },
};

export default function NewsPageEn() {
  const posts = allPosts(LOCALE);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'News and reviews',
          numberOfItems: posts.length,
          itemListElement: posts.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.title,
            url: absUrl(`/news/${p.slug}`),
          })),
        }}
      />

      <PageHead
        locale={LOCALE}
        eyebrow="Articles"
        title="News and reviews"
        lead="Not a news feed for its own sake: every piece answers a question that comes up when choosing a server. A separate section is set aside for price changes in the catalog"
        crumbs={[{ href: '/news', label: 'News' }]}
        badges={
          <>
            <span className="badge badge-brass">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </span>
            {RUBRICS.map((r) => (
              <span className="badge" key={r.slug}>
                {r.nameEn || r.name}
              </span>
            ))}
          </>
        }
      />

      <section className="section paper">
        <div className="wrap">
          {posts.length > 0 && (
            <Link href={`/news/${posts[0].slug}`} className="news-featured">
              <div className="nf-top">
                <span className="badge">{rubricName(posts[0].rubric, LOCALE)}</span>
                <span className="faint mono">{fmtDate(posts[0].date, LOCALE)}</span>
              </div>
              <div className="nf-body">
                <h2 className="nf-featitle">{posts[0].title}</h2>
                <div className="nf-right">
                  <p className="dim">{posts[0].description}</p>
                  <div className="between">
                    <span className="faint">{posts[0].author}</span>
                    <span className="faint mono">{posts[0].minutes} min</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="cards cards-2">
            {posts.slice(1).map((post) => (
              <Link key={post.slug} href={`/news/${post.slug}`} className="card">
                <div className="card-top">
                  <span className="badge">{rubricName(post.rubric, LOCALE)}</span>
                  <span className="faint mono">{fmtDate(post.date, LOCALE)}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem' }}>{post.title}</h3>
                <p className="faint" style={{ margin: 0 }}>{post.description}</p>
                <div className="card-foot">
                  <span className="faint">{post.author}</span>
                  <span className="faint">{post.minutes} min</span>
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="notice">
              <strong>Empty for now.</strong> Articles will appear here right after the first publication
            </div>
          )}

          <div className="grid-3 mt-lg">
            {RUBRICS.map((r) => (
              <div className="notice" key={r.slug}>
                <strong>{r.nameEn || r.name}.</strong> {r.noteEn || r.note}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
