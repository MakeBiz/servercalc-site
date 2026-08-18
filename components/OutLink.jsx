'use client';

import { usePathname } from 'next/navigation';
import { providerLink } from '@/lib/utm';
import { goal, GOALS } from '@/lib/metrika';
import { localeFromPath } from '@/lib/i18n';

/**
 * Единственная точка выхода на провайдера.
 * Здесь и только здесь проставляются UTM, атрибуты rel и цель Метрики.
 * utm_medium несёт язык страницы (ru или eng), чтобы в кабинете провайдера
 * было видно, с какой языковой версии пришёл клик.
 * Если провайдер без партнёрства, отдаётся обычная ссылка на его сайт
 */
export default function OutLink({
  provider,
  campaign,
  content,
  children,
  className = 'btn btn-brass btn-sm',
  showDisclosure = false,
  funnel,
}) {
  const pathname = usePathname() || '/';
  const en = localeFromPath(pathname) === 'en';
  const medium = en ? 'eng' : 'ru';
  const { href, rel, partner } = providerLink(provider, { campaign, content, medium });
  if (!href) return null;

  return (
    <>
      <a
        href={href}
        rel={rel}
        target="_blank"
        className={className}
        onClick={() => {
          // общая цель с параметрами: по ней считается вся воронка
          goal(GOALS.providerClick, {
            provider: provider.slug,
            campaign: campaign || 'unknown',
            partner: partner ? 1 : 0,
          });
          // и отдельная цель на каждого провайдера в формате go_<slug>
          goal(`go_${provider.slug}`);
          // низ конкретной воронки: calc_click из результатов калькулятора,
          // promo_click со страницы акций (для вкладки «Воронки» в панели)
          if (funnel) goal(`${funnel}_click`, { provider: provider.slug });
        }}
      >
        {children || (partner
          ? (en ? 'Go to provider' : 'Перейти к провайдеру')
          : (en ? 'Visit site' : 'Открыть сайт'))}
      </a>
      {showDisclosure && (
        <p className="disclosure">
          {partner
            ? (en
                ? 'Affiliate link: if you sign up we earn a commission at no extra cost to you'
                : 'Переход партнёрский: при оформлении услуги мы получим вознаграждение, цена для вас не меняется')
            : (en
                ? 'A plain link; we have no affiliate relationship with this provider'
                : 'Обычная ссылка, партнёрских отношений с этим провайдером нет')}
        </p>
      )}
    </>
  );
}
