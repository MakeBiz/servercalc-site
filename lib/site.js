import site from '@/data/site.json';

// Значения можно переопределить переменными окружения (Vercel → Settings → Environment Variables).
// Это позволяет ОДНОМУ коду обслуживать несколько доменов с разной аналитикой:
//   servercalc.online       — переменные НЕ заданы → берётся data/site.json (как раньше);
//   serverselection.online  — заданы NEXT_PUBLIC_* → свой домен и своя GA4, Метрика выключена.
function pick(key, fallback) {
  const v = process.env[key];
  return v === undefined || v === '' ? fallback : v;
}

export const SITE_NAME = pick('NEXT_PUBLIC_SITE_NAME', site.name);
export const SITE_URL = pick('NEXT_PUBLIC_SITE_URL', site.url).replace(/\/$/, '');
export const SITE_DOMAIN = pick('NEXT_PUBLIC_SITE_DOMAIN', site.domain);
export const UTM_SOURCE = pick('NEXT_PUBLIC_UTM_SOURCE', site.utmSource);
export const STALE_AFTER_DAYS = site.staleAfterDays;

// Аналитика. Пустая переменная = выключить (на serverselection Метрика выключена).
export const GA_ID = (() => {
  const v = process.env.NEXT_PUBLIC_GA_ID;
  if (v === undefined) return site.gaId || null;
  return v || null;
})();
export const METRIKA_ID = (() => {
  const v = process.env.NEXT_PUBLIC_METRIKA_ID;
  if (v === undefined) return site.metrikaId || null;
  return v === '' || v === '0' ? null : v;
})();

// Ключ сайта для первопартийного счётчика сквозной аналитики (панель vps-analytics).
// Один код на два домена: событие уходит под ключом своего домена.
// servercalc.online → 'servercalc-online', serverselection.online → 'serverselection'.
// Можно переопределить переменной NEXT_PUBLIC_SITE_KEY, иначе выводится из домена.
export const SITE_KEY = (() => {
  const v = process.env.NEXT_PUBLIC_SITE_KEY;
  if (v) return v;
  return /serverselection/.test(SITE_URL) ? 'serverselection' : 'servercalc-online';
})();

// SITE — для обратной совместимости, с переопределёнными полями.
export const SITE = { ...site, name: SITE_NAME, url: SITE_URL, domain: SITE_DOMAIN, utmSource: UTM_SOURCE };

/** Абсолютный адрес для канонических ссылок, sitemap и микроразметки */
export function absUrl(path = '/') {
  if (!path.startsWith('/')) path = '/' + path;
  return SITE_URL + (path === '/' ? '' : path);
}

/** Заголовок вкладки: единый шаблон на весь сайт */
export function pageTitle(title) {
  return title ? `${title} — ${SITE_NAME}` : `${SITE_NAME}, ${site.tagline}`;
}
