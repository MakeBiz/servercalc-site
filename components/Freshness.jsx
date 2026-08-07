import { agoLabel, plural, fmtDate } from '@/lib/format';
import { STATS } from '@/lib/data';

/** Английский аналог agoLabel для локали en */
function agoLabelEn(days) {
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

/**
 * Плашка свежести. Главный дифференциатор проекта: у 11 из 13 проверенных
 * конкурентов даты проверки цен нет вообще
 */
export default function Freshness({ date, age, compact = false, locale = 'ru' }) {
  const iso = date || STATS.verifiedAt;
  const days = typeof age === 'number' ? age : null;
  const stale = days != null && days > STATS.staleDays;
  const en = locale === 'en';

  return (
    <span className={stale ? 'freshness stale' : 'freshness'}>
      <span className="dot" />
      {compact ? (
        <span className="mono">{fmtDate(iso, locale)}</span>
      ) : (
        <span>
          {en ? 'price verified ' : 'цена проверена '}{fmtDate(iso, locale)}
          {days != null && <span className="faint">, {en ? agoLabelEn(days) : agoLabel(days)}</span>}
        </span>
      )}
    </span>
  );
}

export function FreshnessRule() {
  return (
    <p className="faint">
      Тариф, который не проверялся дольше {STATS.staleDays}{' '}
      {plural(STATS.staleDays, 'дня', 'дней', 'дней')}, автоматически скрывается с витрины, а не
      показывается со старой ценой
    </p>
  );
}
