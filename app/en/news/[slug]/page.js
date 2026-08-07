import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHead from '@/components/PageHead';
import JsonLd from '@/components/JsonLd';
import OutLink from '@/components/OutLink';
import { allPosts, getPost, rubricName } from '@/lib/news';
import { getProvider, minPriceOf } from '@/lib/data';
import { fmtDate, fmtPrice } from '@/lib/format';
import { absUrl, SITE_NAME } from '@/lib/site';

const LOCALE = 'en';

export function generateStaticParams() {
  return allPosts(LOCALE).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug, LOCALE);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/en/news/${slug}`,
      languages: {
        ru: `/novosti/${slug}`,
        en: `/en/news/${slug}`,
        'x-default': `/novosti/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
    },
  };
}

export default async function PostPageEn({ params }) {
  const { slug } = await params;
  const post = getPost(slug, LOCALE);
  if (!post) notFound();

  const others = allPosts(LOCALE).filter((p) => p.slug !== slug).slice(0, 2);

  const provider = post.provider ? getProvider(post.provider) : null;
  const providerMin = provider ? minPriceOf(provider.slug) : null;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated || post.date,
          author: { '@type': 'Organization', name: post.author },
          publisher: { '@type': 'Organization', name: SITE_NAME },
          mainEntityOfPage: absUrl(`/en/news/${slug}`),
          inLanguage: 'en-US',
        }}
      />

      <PageHead
        locale={LOCALE}
        eyebrow={rubricName(post.rubric, LOCALE)}
        title={post.title}
        lead={post.description}
        crumbs={[
          { href: '/en/news', label: 'News' },
          { href: `/en/news/${slug}`, label: post.title },
        ]}
        badges={
          <>
            <span className="badge badge-brass">{fmtDate(post.date, LOCALE)}</span>
            <span className="badge">{post.author}</span>
            <span className="badge">{post.minutes} min read</span>
            {post.updated && <span className="badge">updated {fmtDate(post.updated, LOCALE)}</span>}
          </>
        }
      />

      <section className="section paper">
        <div className="wrap-narrow">
          <article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          {provider ? (
            <div className="cta-provider ink">
              <div className="eyebrow">
                <span className="label label-brass">Provider from this article</span>
              </div>
              <div className="between mb">
                <div>
                  <h3 style={{ margin: 0 }}>{provider.name}</h3>
                  {providerMin && (
                    <p className="faint" style={{ margin: '6px 0 0' }}>
                      plans in our base from {fmtPrice(providerMin, LOCALE)} / month
                    </p>
                  )}
                </div>
              </div>
              <div className="row">
                <OutLink
                  provider={provider}
                  campaign={`news_${provider.slug}`}
                  content={slug}
                  className="btn btn-brass"
                >
                  Go to {provider.name}
                </OutLink>
                <Link href={`/en/providers/${provider.slug}`} className="btn btn-ghost">
                  Review and plans
                </Link>
                <Link href="/en#podbor" className="btn btn-ghost">
                  Find a server
                </Link>
              </div>
              <p className="disclosure">
                {provider.affiliateStatus === 'active'
                  ? 'This is an affiliate link: if you sign up, we earn a commission. The price for you does not change, and it has no effect on the provider’s position in the matching'
                  : 'A plain link to the provider’s site; we have no affiliate relationship with it'}
              </p>
            </div>
          ) : (
            <div className="row" style={{ marginTop: 40 }}>
              <Link href="/en#podbor" className="btn btn-brass">
                Find a server
              </Link>
              <Link href="/en/catalog" className="btn btn-ghost">
                Plan catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section className="section-tight paper-alt">
          <div className="wrap">
            <div className="eyebrow">
              <span className="label">Read next</span>
            </div>
            <div className="cards cards-2">
              {others.map((p) => (
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
    </>
  );
}
