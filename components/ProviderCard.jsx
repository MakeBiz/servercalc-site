import Link from 'next/link';
import OutLink from './OutLink';
import { fmtPrice } from '@/lib/format';
import { t } from '@/lib/i18n';

/**
 * Карточка провайдера. Подача строго одинаковая у всех: ни закрепления,
 * ни ярлыков «выбор редакции», ни визуального выделения за деньги.
 * Это условие, при котором каталог остаётся справочным материалом,
 * а не рекламной публикацией (позиция ФАС по агрегаторам)
 */
export default function ProviderCard({ provider, minPrice, campaign, geoLabel, locale = 'ru' }) {
  const en = locale === 'en';
  const tt = t(locale).card;
  const initials = provider.name.replace(/[^A-Za-zА-Яа-я]/g, '').slice(0, 2).toUpperCase();
  const detail = en ? `/providers/${provider.slug}` : `/ru/provajdery/${provider.slug}`;
  const description = (en ? provider.descriptionEn || provider.description : provider.description) || '';

  return (
    <article className="prov">
      <div className="prov-head">
        <span className="prov-mark" style={{ background: provider.color }}>
          {initials}
        </span>
        <div style={{ minWidth: 0 }}>
          <Link href={detail} className="prov-name">
            {provider.name}
          </Link>
          {(() => {
            // Английская версия не выделяет российские площадки отдельно:
            // подпись «Russian/International provider» скрыта, остаётся только гео, если оно задано
            const meta = en
              ? geoLabel || ''
              : `${provider.country === 'RU' ? tt.ruProvider : tt.foreignProvider}${geoLabel ? `, ${geoLabel}` : ''}`;
            return meta ? <div className="prov-meta">{meta}</div> : null;
          })()}
        </div>
      </div>

      <p className="faint" style={{ margin: 0, lineHeight: 1.5 }}>
        {description.length > 132 ? description.slice(0, 130).trim() + '…' : description}
      </p>

      <div className="row" style={{ gap: 6 }}>
        {provider.affiliateStatus === 'active' ? (
          <span className="badge">{tt.partnerLink}</span>
        ) : (
          <span className="badge badge-plain">{tt.noPartner}</span>
        )}
        {provider.features?.testPeriod && <span className="badge">{tt.testPeriod}</span>}
        {provider.features?.hourly && <span className="badge">{tt.hourly}</span>}
      </div>

      <div className="card-foot">
        <span className="faint">{tt.plansFrom}</span>
        <span className="prov-price">{minPrice ? fmtPrice(minPrice, locale) : tt.tbd}</span>
      </div>

      <div className="prov-actions">
        <Link href={detail} className="btn btn-ghost btn-sm">
          {tt.review}
        </Link>
        <OutLink provider={provider} campaign={campaign} className="btn btn-brass btn-sm">
          {tt.toSite}
        </OutLink>
      </div>
    </article>
  );
}
