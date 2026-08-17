// Шрифты подключаются локально пакетами fontsource, а не с серверов Google.
// Так у сайта нет внешних запросов при загрузке: это и скорость, и отсутствие
// зависимости от доступности fonts.googleapis.com для читателей из России
// Дизайн-система Claude Design: Manrope для заголовков, Inter для текста,
// JetBrains Mono для цифр, дат, кодов и надзаголовков
import '@fontsource-variable/manrope';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import Metrika from '@/components/Metrika';
import DemoStrip from '@/components/DemoStrip';
import HtmlLang from '@/components/HtmlLang';
import { SITE, SITE_URL, SITE_NAME } from '@/lib/site';
import { STATS } from '@/lib/data';
import { HAS_PROMOS } from '@/lib/promos';

// Английский — основной язык, живёт в корне. Русский под /ru получает свои
// метаданные из app/ru/layout.js. Тег <html lang> ставится здесь как en и
// правится на клиенте (HtmlLang) для страниц /ru
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — pick a VPS by workload`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    'Reference catalog of virtual servers: match a VPS by workload, resources and location, compare plans by price per resource, with a verification date on every price',
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  // Подтверждение владения в Google Search Console (serverselection). Рендерится как
  // <meta name="google-site-verification" content="...">. Тег общий для домена, на
  // servercalc.online он безвреден (просто не подтверждает чужую сущность)
  verification: {
    google: 'EKfwLtnGQYW_-jFo0QeNBq3dnPAwb_eroHZ-gPnGk4k',
    yandex: 'd57e90403c04f2b6',
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  formatDetection: { telephone: false, address: false },
};

export const viewport = {
  themeColor: '#0b0e12',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Impact.com верификация сайта: raw-тег с атрибутом value= (не content=).
            React 19 поднимает <meta> в <head>. Значение из кабинета Impact */}
        <meta name="impact-site-verification" value="6fac83ed-2076-4858-806d-1709267f30cf" />
        <HtmlLang />
        <DemoStrip />
        <Header showPromos={HAS_PROMOS} />
        <main>{children}</main>
        <Footer
          verifiedAt={STATS.verifiedAt}
          hasPromos={HAS_PROMOS}
          domain={SITE.domain}
          contactEmail={SITE.contactEmail}
        />
        <CookieBanner />
        <Metrika />
      </body>
    </html>
  );
}
