import Script from 'next/script';
import { GA_ID } from '@/lib/site';

/**
 * Google Analytics 4 (gtag.js). Идентификатор задаётся в data/site.json полем gaId.
 * Нужен в первую очередь для английской версии и учёта конверсий из Google Ads.
 * Грузится с googletagmanager.com, поэтому это внешний запрос к Google
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
