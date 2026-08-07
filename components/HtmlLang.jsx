'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { localeFromPath } from '@/lib/i18n';

/**
 * Корневой макет один на весь сайт и ставит lang="ru" статически. Пока EN живёт
 * на /en аддитивно, корректируем язык страницы на клиенте. После переезда EN
 * в корень с раздельными макетами (route groups) это уйдёт: lang будет ставиться
 * на сервере для каждого языкового дерева
 */
export default function HtmlLang() {
  const pathname = usePathname() || '/';
  useEffect(() => {
    document.documentElement.lang = localeFromPath(pathname);
  }, [pathname]);
  return null;
}
