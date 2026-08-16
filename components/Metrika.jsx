import Script from 'next/script';
import { METRIKA_ID, SITE_KEY } from '@/lib/site';
import GoogleAnalytics from './GoogleAnalytics';

/**
 * Аналитика сайта, подключается в корневом макете.
 * - Первопартийный счётчик сквозной аналитики (панель vps-analytics) подключается ВСЕГДА,
 *   на всех доменах, через rewrite /px/*. Ключ сайта data-site={SITE_KEY} зависит от домена
 *   (servercalc.online → servercalc-online, serverselection.online → serverselection).
 * - Яндекс.Метрика подключается только там, где задан её номер (на serverselection выключена).
 * - Google Analytics подключается всегда.
 * Цели Метрики перечислены в lib/metrika.js
 */
export default function Metrika() {
  const code = METRIKA_ID ? `
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}', 'ym');
ym(${METRIKA_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
`.trim() : null;

  return (
    <>
      {/* Сквозная аналитика: первопартийный счётчик, идёт через rewrite /px/*. Ключ зависит от домена. */}
      <Script id="px-counter" src="/px/t.js" strategy="afterInteractive" data-site={SITE_KEY} />
      {METRIKA_ID && (
        <>
          <Script id="ym-counter" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: code }} />
          <noscript>
            <div>
              <img src={`https://mc.yandex.ru/watch/${METRIKA_ID}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
            </div>
          </noscript>
        </>
      )}
      <GoogleAnalytics />
    </>
  );
}
