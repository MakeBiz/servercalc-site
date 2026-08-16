import { PROVIDERS, TASKS, GEO_PAGES, STATS } from '@/lib/data';
import { allPosts } from '@/lib/news';
import { HAS_PROMOS } from '@/lib/promos';
import { absUrl } from '@/lib/site';

/**
 * Карта сайта генерируется из данных, а не поддерживается руками.
 * Добавили провайдера или задачу в JSON, страница появилась в sitemap автоматически.
 *
 * Двуязычие: английская версия в корне (основная), русская под /ru. Каждая
 * логическая страница выводится дважды, у обеих проставлены hreflang-альтернативы,
 * x-default указывает на английскую версию. Так реципрокность hreflang
 * обеспечивается на уровне карты сайта.
 */
// Нужно для статического экспорта: маршрут отдаётся файлом, а не функцией
export const dynamic = 'force-static';

/**
 * Дата последней правки текстовых страниц. lastmod должен отражать реальное
 * изменение конкретной страницы, поэтому страницы с данными живут по дате
 * проверки базы, а страницы-документы по этой константе.
 */
const DOCS_UPDATED = '2026-08-07';

export default function sitemap() {
  const updated = new Date(STATS.verifiedAt);
  const docs = new Date(DOCS_UPDATED);
  const posts = allPosts();
  const newsUpdated = posts.length
    ? new Date(Math.max(...posts.map((p) => new Date(p.updated || p.date).getTime())))
    : docs;

  /**
   * Пара «английский адрес (корень) → русский адрес (/ru)» с общим блоком hreflang.
   * Возвращает две записи карты сайта, у обеих один и тот же набор alternates,
   * x-default указывает на английскую (основную) версию.
   */
  const pair = (enPath, ruPath, opts) => {
    const languages = {
      en: absUrl(enPath),
      ru: absUrl(ruPath),
      'x-default': absUrl(enPath),
    };
    return [
      { url: absUrl(enPath), ...opts, alternates: { languages } },
      { url: absUrl(ruPath), ...opts, alternates: { languages } },
    ];
  };

  // Только русская запись, без английской альтернативы: для России и провайдеров,
  // скрытых в английской версии
  const ruOnly = (ruPath, opts) => [
    { url: absUrl(ruPath), ...opts, alternates: { languages: { ru: absUrl(ruPath), 'x-default': absUrl(ruPath) } } },
  ];

  const core = [
    ...pair('/', '/ru', { priority: 1, changeFrequency: 'daily', lastModified: updated }),
    ...pair('/catalog', '/ru/catalog', { priority: 0.9, changeFrequency: 'daily', lastModified: updated }),
    ...pair('/providers', '/ru/provajdery', { priority: 0.8, changeFrequency: 'weekly', lastModified: updated }),
    ...pair('/vps-for', '/ru/vps-dlya', { priority: 0.8, changeFrequency: 'weekly', lastModified: updated }),
    ...pair('/vps-in', '/ru/vps', { priority: 0.8, changeFrequency: 'weekly', lastModified: updated }),
    ...pair('/news', '/ru/novosti', { priority: 0.7, changeFrequency: 'weekly', lastModified: newsUpdated }),
    ...(HAS_PROMOS
      ? pair('/deals', '/ru/akcii', { priority: 0.8, changeFrequency: 'daily', lastModified: updated })
      : []),
    ...pair('/methodology', '/ru/metodologiya', { priority: 0.6, changeFrequency: 'monthly', lastModified: docs }),
    ...pair('/about', '/ru/o-proekte', { priority: 0.5, changeFrequency: 'monthly', lastModified: docs }),
    ...pair('/privacy', '/ru/politika-konfidencialnosti', { priority: 0.3, changeFrequency: 'yearly', lastModified: docs }),
    ...pair('/cookie', '/ru/cookie', { priority: 0.3, changeFrequency: 'yearly', lastModified: docs }),
  ];

  const tasks = TASKS.flatMap((t) =>
    pair(`/vps-for/${t.slug}`, `/ru/vps-dlya/${t.slug}`, {
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  );

  const geos = GEO_PAGES.flatMap((g) =>
    g.code === 'ru'
      ? ruOnly(`/ru/vps/${g.slug}`, { lastModified: updated, changeFrequency: 'weekly', priority: 0.85 })
      : pair(`/vps-in/${g.slug}`, `/ru/vps/${g.slug}`, {
          lastModified: updated,
          changeFrequency: 'weekly',
          priority: 0.85,
        })
  );

  const providers = PROVIDERS.flatMap((p) =>
    p.enHidden
      ? ruOnly(`/ru/provajdery/${p.slug}`, { lastModified: updated, changeFrequency: 'weekly', priority: 0.7 })
      : pair(`/providers/${p.slug}`, `/ru/provajdery/${p.slug}`, {
          lastModified: updated,
          changeFrequency: 'weekly',
          priority: 0.7,
        })
  );

  const postUrls = posts.flatMap((p) =>
    pair(`/news/${p.slug}`, `/ru/novosti/${p.slug}`, {
      lastModified: new Date(p.updated || p.date),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  );

  return [...core, ...tasks, ...geos, ...providers, ...postUrls];
}
