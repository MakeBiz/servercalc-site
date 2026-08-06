/**
 * Двуязычие ServerCalc. Русский это язык по умолчанию и живёт в корне сайта,
 * английский добавляется под /en. Встроенная i18n-маршрутизация Next в режиме
 * output:export не работает, поэтому локаль определяется по адресу, а строки
 * берутся из словаря ниже. Русский вывод обязан оставаться прежним: компоненты
 * по умолчанию берут locale='ru'.
 *
 * Итоговая раскладка (после переезда): EN в корне, RU на /ru. Пока идёт сборка,
 * EN живёт на /en аддитивно, чтобы не трогать живой русский сайт.
 */

export const LOCALES = ['ru', 'en'];
export const DEFAULT_LOCALE = 'ru';

export function isLocale(x) {
  return LOCALES.includes(x);
}

/** Определить локаль по адресу страницы */
export function localeFromPath(pathname = '/') {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ru';
}

export function otherLocale(locale) {
  return locale === 'en' ? 'ru' : 'en';
}

/**
 * Разделы навигации. У каждого раздела свой слаг на каждом языке:
 * русское дерево сохраняет исторические слаги, английское получает чистые.
 * optional: раздел показывается только когда в базе есть живые акции.
 */
export const NAV = [
  { key: 'catalog', ru: '/catalog', en: '/en/catalog', label: { ru: 'Каталог', en: 'Catalog' } },
  { key: 'providers', ru: '/provajdery', en: '/en/providers', label: { ru: 'Провайдеры', en: 'Providers' } },
  { key: 'tasks', ru: '/vps-dlya', en: '/en/vps-for', label: { ru: 'Задачи', en: 'Use cases' } },
  { key: 'geo', ru: '/vps', en: '/en/vps-in', label: { ru: 'География', en: 'Locations' } },
  { key: 'promos', ru: '/akcii', en: '/en/deals', label: { ru: 'Акции', en: 'Deals' }, optional: true },
  { key: 'news', ru: '/novosti', en: '/en/news', label: { ru: 'Новости', en: 'News' } },
  { key: 'methodology', ru: '/metodologiya', en: '/en/methodology', label: { ru: 'Методология', en: 'Methodology' } },
];

/** Пары «русский слаг → английский слаг» для точного переключения языка на странице */
const PAGE_PAIRS = [
  ['/', '/en'],
  ['/catalog', '/en/catalog'],
  ['/provajdery', '/en/providers'],
  ['/vps-dlya', '/en/vps-for'],
  ['/vps', '/en/vps-in'],
  ['/akcii', '/en/deals'],
  ['/novosti', '/en/news'],
  ['/metodologiya', '/en/methodology'],
  ['/o-proekte', '/en/about'],
  ['/politika-konfidencialnosti', '/en/privacy'],
  ['/cookie', '/en/cookie'],
];

/**
 * Перевести адрес текущей страницы в адрес того же раздела на другом языке.
 * Для страниц с параметром (провайдер, задача, гео, статья) слаг сущности
 * сохраняется. Если пары нет, возвращаем корень нужного языка.
 */
export function switchPath(pathname, toLocale) {
  const path = (pathname || '/').replace(/\/+$/, '') || '/';
  const from = localeFromPath(path);
  if (from === toLocale) return path;

  // точное совпадение статической страницы
  for (const [ru, en] of PAGE_PAIRS) {
    if (toLocale === 'en' && path === ru) return en;
    if (toLocale === 'ru' && path === en) return ru;
  }
  // страницы с сущностью: /provajdery/timeweb <-> /en/providers/timeweb и т.п.
  const dyn = [
    ['/provajdery/', '/en/providers/'],
    ['/vps-dlya/', '/en/vps-for/'],
    ['/vps/', '/en/vps-in/'],
    ['/novosti/', '/en/news/'],
  ];
  for (const [ru, en] of dyn) {
    if (toLocale === 'en' && path.startsWith(ru)) return en + path.slice(ru.length);
    if (toLocale === 'ru' && path.startsWith(en)) return ru + path.slice(en.length);
  }
  return toLocale === 'en' ? '/en' : '/';
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
  return DICT[locale] || DICT.ru;
}
