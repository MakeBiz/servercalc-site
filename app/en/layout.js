import { SITE_NAME } from '@/lib/site';

/**
 * Английская ветка живёт под /en, пока не состоялся переезд EN в корень.
 * Здесь задаются общие английские метаданные. Тег <html lang> ставит корневой
 * макет (ru) и правит на клиенте HtmlLang; после переезда язык будет серверным
 */
export const metadata = {
  title: {
    default: `${SITE_NAME} — pick a VPS by workload`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    'Reference catalog of virtual servers: match a VPS by workload, resources and location, compare plans by price per resource, with a verification date on every price',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
  },
};

export default function EnLayout({ children }) {
  return children;
}
