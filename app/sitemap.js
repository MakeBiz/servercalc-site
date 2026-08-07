import { PROVIDERS, TASKS, GEO_PAGES, STATS } from '@/lib/data';
import { allPosts } from '@/lib/news';
import { HAS_PROMOS } from '@/lib/promos';
import { absUrl } from '@/lib/site';

/**
 * Карта сайта генерируется из данных, а не поддерживается руками.
 * Добавили провайдера или задачу в JSON, страница появилась в sitemap автоматически.
 *
 * Двуязычие: каждая логическая страница выводится дважды, русским и английским
 * адресом, и у обеих проставлены hreflang-альтернативы. Так реципрокность
 * hreflang обеспечивается на уровне карты сайта, даже если у русских страниц
 * ещё нет alternates в <head>
 */
// Нужно для статического экспорта: маршрут отдаётся файлом, а не функцией
export const dynamic = 'force-static';

/**
 * Дата последней правки текстовых страниц. lastmod должен отражать реальное
 * изменение конкретной страницы, поэтому страницы с данными живут по дате
 * проверки базы, а страницы-документы по этой константе. Меняете текст на
 * /metodologiya, /o-proekte, /cookie или в политике, поднимите дату здесь
 */
const DOCS_UPDATED = '2026-08-06';

export default function sitemap() {
  const updated = new Date(STATS.verifiedAt);
  const docs = new Date(DOCS_UPDATED);
  const posts = allPosts();
  // лента новостей меняется тогда, когда выходит свежий материал
  const newsUpdated = posts.length
    ? new Date(Math.max(...posts.map((p) => new Date(p.updated || p.date).getTime())))
    : docs;

  /**
   * Пара «русский адрес → английский адрес» с общим блоком hreflang.
   * Возвращает две записи для карты сайта: русский и английский адрес одной
   * и той же страницы, у обеих один и тот же набор alternates
   */
  const pair = (ruPath, enPath, opts) => {
    const languages = {
      ru: absUrl(ruPath),
      en: absUrl(enPath),
      'x-default': absUrl(ruPath),
    };
    return [
      { url: absUrl(ruPath), ...opts, alternates: { languages } },
      { url: absUrl(enPath), ...opts, alternates: { languages } },
    ];
  };

  const core = [
    ...pair('/', '/en', { priority: 1, changeFrequency: 'daily', lastModified: updated }),
    ...pair('/catalog', '/en/catalog', { priority: 0.9, changeFrequency: 'daily', lastModified: updated }),
    ...pair('/provajdery', '/en/providers', { priority: 0.8, changeFrequency: 'weekly', lastModified: updated }),
    ...pair('/vps-dlya', '/en/vps-for', { priority: 0.8, changeFrequency: 'weekly', lastModified: updated }),
    ...pair('/vps', '/en/vps-in', { priority: 0.8, changeFrequency: 'weekly', lastModified: updated }),
    ...pair('/novosti', '/en/news', { priority: 0.7, changeFrequency: 'weekly', lastModified: newsUpdated }),
    // раздел акций попадает в карту, только когда в нём есть проверенные акции
    ...(HAS_PROMOS
      ? pair('/akcii', '/en/deals', { priority: 0.8, changeFrequency: 'daily', lastModified: updated })
      : []),
    ...pair('/metodologiya', '/en/methodology', { priority: 0.6, changeFrequency: 'monthly', lastModified: docs }),
    ...pair('/o-proekte', '/en/about', { priority: 0.5, changeFrequency: 'monthly', lastModified: docs }),
    ...pair('/politika-konfidencialnosti', '/en/privacy', { priority: 0.3, changeFrequency: 'yearly', lastModified: docs }),
    ...pair('/cookie', '/en/cookie', { priority: 0.3, changeFrequency: 'yearly', lastModified: docs }),
  ];

  const tasks = TASKS.flatMap((t) =>
    pair(`/vps-dlya/${t.slug}`, `/en/vps-for/${t.slug}`, {
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  );

  const geos = GEO_PAGES.flatMap((g) =>
    pair(`/vps/${g.slug}`, `/en/vps-in/${g.slug}`, {
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  );

  const providers = PROVIDERS.flatMap((p) =>
    pair(`/provajdery/${p.slug}`, `/en/providers/${p.slug}`, {
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  );

  const postUrls = posts.flatMap((p) =>
    pair(`/novosti/${p.slug}`, `/en/news/${p.slug}`, {
      lastModified: new Date(p.updated || p.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  );

  return [...core, ...tasks, ...geos, ...providers, ...postUrls];
}
