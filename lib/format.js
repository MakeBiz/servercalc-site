const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

/** 2026-08-02 -> «2 августа 2026» */
export function ruDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Короткая форма: «2 авг» */
export function ruDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)}`;
}

/** Склонение: plural(5, 'тариф', 'тарифа', 'тарифов') -> «тарифов» */
export function plural(n, one, few, many) {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}

/** 1290 -> «1 290 ₽» */
export function price(rub, { suffix = ' ₽' } = {}) {
  if (rub == null) return '—';
  return Math.round(rub).toLocaleString('ru-RU').replace(/ /g, ' ') + suffix;
}

/** Цена за гигабайт памяти, нормализованная метрика для честного сравнения */
export function pricePerGb(plan) {
  if (!plan || !plan.ram) return null;
  return plan.priceRub / plan.ram;
}

export function num(n) {
  return Number(n).toLocaleString('ru-RU').replace(/ /g, ' ');
}

/** Разница в днях между двумя датами, без учёта времени */
export function daysBetween(fromIso, toIso) {
  const a = new Date(fromIso);
  const b = new Date(toIso);
  return Math.floor((b - a) / 86400000);
}

/** «сегодня», «вчера», «3 дня назад» */
export function agoLabel(days) {
  if (days <= 0) return 'сегодня';
  if (days === 1) return 'вчера';
  return `${days} ${plural(days, 'день', 'дня', 'дней')} назад`;
}

/* ------------------------------------------------------------------ */
/* Локале-осознанный формат. Русский слой выше не трогаем: EN-страницы  */
/* и локализованные компоненты зовут функции с явной локалью.           */
/* ------------------------------------------------------------------ */

/**
 * Курс для показа цен на английской версии в долларах. Цены в базе хранятся
 * в рублях (priceRub, пересчёт по курсу ЦБ), для международной аудитории
 * рубли читаются плохо, поэтому на EN показываем доллары по тому же курсу,
 * что зафиксирован в taxonomy.meta.rateNote на 6 августа 2026
 */
export const USD_RATE = 80.93;

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Дата в формате локали: ru «2 августа 2026», en «August 2, 2026» */
export function fmtDate(iso, locale = 'ru') {
  if (!iso) return '';
  if (locale !== 'en') return ruDate(iso);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return `${MONTHS_EN[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** Цена по локали: ru «1 290 ₽», en «$16» (пересчёт из рублей по USD_RATE) */
export function fmtPrice(rub, locale = 'ru') {
  if (rub == null) return locale === 'en' ? 'TBD' : '—';
  if (locale !== 'en') return price(rub);
  const usd = Math.max(1, Math.round(rub / USD_RATE));
  return '$' + usd.toLocaleString('en-US');
}

/** Перевести бюджет из валюты интерфейса в рубли для фильтра подбора */
export function budgetToRub(value, locale = 'ru') {
  return locale === 'en' ? Math.round(value * USD_RATE) : value;
}

export function fmtNum(n, locale = 'ru') {
  if (locale === 'en') return Number(n).toLocaleString('en-US');
  return num(n);
}

const MONTHS_EN_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Короткая дата по локали: ru «2 авг», en «Aug 2» */
export function fmtDateShort(iso, locale = 'ru') {
  if (!iso) return '';
  if (locale !== 'en') return ruDateShort(iso);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return `${MONTHS_EN_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;
}
