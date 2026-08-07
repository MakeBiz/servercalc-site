import { SITE, SITE_NAME } from '@/lib/site';

/**
 * Русская ветка живёт под /ru. Здесь задаются общие русские метаданные,
 * переопределяющие английские из корневого макета. Тег <html lang> корневой
 * (en) правится на клиенте (HtmlLang) на ru для адресов /ru
 */
export const metadata = {
  title: {
    default: `${SITE_NAME}, ${SITE.tagline}`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    'Справочный каталог виртуальных серверов: подбор под задачу, сравнение тарифов по цене за ресурс и дата проверки цены у каждого тарифа',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: SITE_NAME,
  },
};

export default function RuLayout({ children }) {
  return children;
}
