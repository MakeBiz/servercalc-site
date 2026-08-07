/**
 * Двуязычие ServerCalc. Английский — основной язык, живёт в корне сайта.
 * Русский добавляется под /ru. Встроенная i18n-маршрутизация Next в режиме
 * output:export не работает, поэтому локаль определяется по адресу, а строки
 * берутся из словаря ниже. Компоненты по умолчанию берут locale='en'.
 *
 * Слаги: английское дерево получает чистые слаги в корне, русское сохраняет
 * исторические слаги под префиксом /ru (важно для 301-редиректов со старых
 * русских адресов, которые раньше жили в корне).
 */

export const LOCALES = ['en', 'ru'];
export const DEFAULT_LOCALE = 'en';

export function isLocale(x) {
  return LOCALES.includes(x);
}

/** Определить локаль по адресу страницы: /ru или /ru/* — русский, иначе английский */
export function localeFromPath(pathname = '/') {
  return pathname === '/ru' || pathname.startsWith('/ru/') ? 'ru' : 'en';
}

export function otherLocale(locale) {
  return locale === 'en' ? 'ru' : 'en';
}

/**
 * Разделы навигации. У каждого раздела свой слаг на каждом языке:
 * английский в корне, русский под /ru с историческими слагами.
 * optional: раздел показывается только когда в базе есть живые акции.
 */
export const NAV = [
  { key: 'catalog', en: '/catalog', ru: '/ru/catalog', label: { en: 'Catalog', ru: 'Каталог' } },
  { key: 'providers', en: '/providers', ru: '/ru/provajdery', label: { en: 'Providers', ru: 'Провайдеры' } },
  { key: 'tasks', en: '/vps-for', ru: '/ru/vps-dlya', label: { en: 'Use cases', ru: 'Задачи' } },
  { key: 'geo', en: '/vps-in', ru: '/ru/vps', label: { en: 'Locations', ru: 'География' } },
  { key: 'promos', en: '/deals', ru: '/ru/akcii', label: { en: 'Deals', ru: 'Акции' }, optional: true },
  { key: 'news', en: '/news', ru: '/ru/novosti', label: { en: 'News', ru: 'Новости' } },
  { key: 'methodology', en: '/methodology', ru: '/ru/metodologiya', label: { en: 'Methodology', ru: 'Методология' } },
];

/** Пары «английский слаг (корень) → русский слаг (/ru)» для переключения языка */
const PAGE_PAIRS = [
  ['/', '/ru'],
  ['/catalog', '/ru/catalog'],
  ['/providers', '/ru/provajdery'],
  ['/vps-for', '/ru/vps-dlya'],
  ['/vps-in', '/ru/vps'],
  ['/deals', '/ru/akcii'],
  ['/news', '/ru/novosti'],
  ['/methodology', '/ru/metodologiya'],
  ['/about', '/ru/o-proekte'],
  ['/privacy', '/ru/politika-konfidencialnosti'],
  ['/cookie', '/ru/cookie'],
];

/** Страницы с параметром: слаг сущности сохраняется при переключении языка */
const DYN_PAIRS = [
  ['/providers/', '/ru/provajdery/'],
  ['/vps-for/', '/ru/vps-dlya/'],
  ['/vps-in/', '/ru/vps/'],
  ['/news/', '/ru/novosti/'],
];

/**
 * Перевести адрес текущей страницы в адрес того же раздела на другом языке.
 * Если пары нет, возвращаем корень нужного языка.
 */
export function switchPath(pathname, toLocale) {
  const path = (pathname || '/').replace(/\/+$/, '') || '/';
  const from = localeFromPath(path);
  if (from === toLocale) return path;

  // точное совпадение статической страницы
  for (const [en, ru] of PAGE_PAIRS) {
    if (toLocale === 'ru' && path === en) return ru;
    if (toLocale === 'en' && path === ru) return en;
  }
  // страницы с сущностью: /providers/timeweb <-> /ru/provajdery/timeweb и т.п.
  for (const [en, ru] of DYN_PAIRS) {
    if (toLocale === 'ru' && path.startsWith(en)) return ru + path.slice(en.length);
    if (toLocale === 'en' && path.startsWith(ru)) return en + path.slice(ru.length);
  }
  return toLocale === 'en' ? '/' : '/ru';
}

/** Абсолютный путь раздела навигации для нужной локали */
export function navHref(item, locale) {
  return locale === 'en' ? item.en : item.ru;
}

/* ------------------------------------------------------------------ */
/* Словарь интерфейсных строк. Ключи сгруппированы по областям.        */
/* ------------------------------------------------------------------ */

export const DICT = {
  ru: {
    brandCta: 'Подобрать сервер',
    menuOpen: 'Открыть меню',
    menuClose: 'Закрыть меню',
    langLabel: 'Язык',
    langSwitchTo: 'English',

    footer: {
      about: 'Справочный каталог виртуальных серверов. Подбираем по задаче, ресурсам и географии, показываем дату проверки каждой цены',
      verified: 'база проверена',
      colPick: 'Подбор',
      calculator: 'Калькулятор',
      catalog: 'Каталог тарифов',
      byTask: 'Подбор под задачу',
      byGeo: 'Подбор по географии',
      promos: 'Акции и промокоды',
      colProviders: 'Провайдеры',
      allProviders: 'Все провайдеры',
      colAbout: 'О сервисе',
      methodology: 'Методология подбора',
      aboutPage: 'О проекте',
      news: 'Новости и обзоры',
      privacy: 'Политика конфиденциальности',
      cookie: 'Использование cookie',
      disclosure: 'Сервис публикует справочную информацию о тарифах сторонних провайдеров. Часть переходов к провайдерам партнёрские: если вы оформите услугу, мы получим вознаграждение, цена для вас при этом не меняется. Размер вознаграждения не влияет на подбор,',
      formulaOpen: 'формула открыта',
    },

    cookie: {
      text: 'Сайт использует cookie и Яндекс Метрику, чтобы понимать, какие страницы полезны читателям. Подробности в',
      cookieLink: 'разделе про cookie',
      and: 'и',
      privacyLink: 'политике конфиденциальности',
      accept: 'Принять',
      aria: 'Использование cookie',
    },

    calc: {
      title: 'Подбор сервера',
      base: (n, verified) => `${n} тариф(ов) с проверенной ценой, база проверена ${verified}`,
      task: 'Задача',
      geo: 'География',
      ram: 'Память',
      cpu: 'Ядра',
      budget: 'Бюджет',
      requirements: 'Требования',
      recommend: (cpu, ram) => `рекомендуем ${cpu} × ${ram} ГБ`,
      geoAny: 'Не важна',
      chosen: (n) => `выбрано ${n}`,
      budgetNoLimit: 'без ограничения',
      budgetUpTo: (v) => `до ${v} в месяц`,
      commissionNote: 'Комиссия провайдеров в формулу не входит.',
      howScore: 'Как считается процент',
      copyLink: 'Скопировать подбор',
      copied: 'Ссылка скопирована',
      reset: 'Сбросить',
      resultTitle: 'Результат подбора',
      matches: (n) => `${n} подходящих тарифов`,
      empty: 'Под такие условия в базе ничего нет. Попробуйте ослабить требования или поднять бюджет',
      noPartner: 'без партнёрства',
      ruBadge: 'Россия',
      perMonth: 'в месяц',
      go: 'Перейти',
      toSite: 'На сайт',
      showRest: (n) => `Показать остальные ${n}`,
      disclosure: 'Часть переходов партнёрские: при оформлении услуги мы получаем вознаграждение, цена для вас не меняется. На порядок в списке это не влияет,',
      formulaOpen: 'формула подбора открыта',
      ramScaleMin: '1 ГБ',
      ramScaleMax: '64 ГБ',
      budgetScaleMax: 'без лимита',
    },

    card: {
      ruProvider: 'Российский провайдер',
      foreignProvider: 'Зарубежный провайдер',
      partnerLink: 'партнёрская ссылка',
      noPartner: 'без партнёрства',
      testPeriod: 'тест-период',
      hourly: 'почасовая',
      plansFrom: 'Тарифы от',
      tbd: 'уточняется',
      review: 'Обзор',
      toSite: 'На сайт',
    },

    crumbHome: 'Главная',
    perMonth: 'в месяц',
  },

  en: {
    brandCta: 'Find a server',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    langLabel: 'Language',
    langSwitchTo: 'Русский',

    footer: {
      about: 'A reference catalog of virtual servers. We match by workload, resources and location, and show the verification date on every price',
      verified: 'data verified',
      colPick: 'Matching',
      calculator: 'Calculator',
      catalog: 'Plan catalog',
      byTask: 'Match by workload',
      byGeo: 'Match by location',
      promos: 'Deals and promo codes',
      colProviders: 'Providers',
      allProviders: 'All providers',
      colAbout: 'About',
      methodology: 'Matching methodology',
      aboutPage: 'About the project',
      news: 'News and reviews',
      privacy: 'Privacy policy',
      cookie: 'Cookie usage',
      disclosure: 'This service publishes reference information about third-party providers’ plans. Some links to providers are affiliate links: if you sign up, we earn a commission at no extra cost to you. The commission does not affect the matching,',
      formulaOpen: 'the formula is open',
    },

    cookie: {
      text: 'This site uses cookies and Yandex Metrica to understand which pages are useful to readers. Details in the',
      cookieLink: 'cookie section',
      and: 'and',
      privacyLink: 'privacy policy',
      accept: 'Accept',
      aria: 'Cookie usage',
    },

    calc: {
      title: 'Server matching',
      base: (n, verified) => `${n} plans with a verified price, data checked ${verified}`,
      task: 'Workload',
      geo: 'Location',
      ram: 'Memory',
      cpu: 'Cores',
      budget: 'Budget',
      requirements: 'Requirements',
      recommend: (cpu, ram) => `we suggest ${cpu} × ${ram} GB`,
      geoAny: 'Any',
      chosen: (n) => `${n} selected`,
      budgetNoLimit: 'no limit',
      budgetUpTo: (v) => `up to ${v} / month`,
      commissionNote: 'Provider commission is not part of the formula.',
      howScore: 'How the score works',
      copyLink: 'Copy this match',
      copied: 'Link copied',
      reset: 'Reset',
      resultTitle: 'Matching result',
      matches: (n) => `${n} matching plans`,
      empty: 'Nothing in the base fits these conditions. Try relaxing the requirements or raising the budget',
      noPartner: 'no affiliation',
      ruBadge: 'Russia',
      perMonth: '/ month',
      go: 'Go to provider',
      toSite: 'Visit site',
      showRest: (n) => `Show the other ${n}`,
      disclosure: 'Some links are affiliate links: if you sign up we earn a commission at no extra cost to you. It does not affect the ranking,',
      formulaOpen: 'the matching formula is open',
      ramScaleMin: '1 GB',
      ramScaleMax: '64 GB',
      budgetScaleMax: 'no limit',
    },

    card: {
      ruProvider: 'Russian provider',
      foreignProvider: 'International provider',
      partnerLink: 'affiliate link',
      noPartner: 'no affiliation',
      testPeriod: 'trial',
      hourly: 'hourly',
      plansFrom: 'Plans from',
      tbd: 'TBD',
      review: 'Review',
      toSite: 'Visit site',
    },

    crumbHome: 'Home',
    perMonth: '/ month',
  },
};

/** Строки для нужной локали */
export function t(locale) {
  return DICT[locale] || DICT.en;
}
