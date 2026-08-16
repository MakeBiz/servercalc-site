'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { SITE_NAME } from '@/lib/site';
import { NAV, navHref, localeFromPath, switchPath, t } from '@/lib/i18n';

export default function Header({ showPromos = false }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '/';
  const locale = localeFromPath(pathname);
  const tt = t(locale);
  const home = locale === 'ru' ? '/ru' : '/';

  // сравнение по сегментам: иначе /vps подсвечивался бы на /vps-dlya/...
  const isActive = (href) =>
    href === home ? pathname === home : pathname === href || pathname.startsWith(href + '/');

  // Страницы, которых нет в английской версии (Россия и провайдеры, скрытые в EN).
  // Для них переключатель ведёт на ближайший английский раздел, а не на 404
  const EN_MISSING = new Set(['/vps-in/rossiya', '/providers/timeweb', '/providers/vpshouse']);
  const enComputed = locale === 'en' ? pathname : switchPath(pathname, 'en');
  const enHref = EN_MISSING.has(enComputed)
    ? (enComputed.startsWith('/providers/') ? '/providers' : '/vps-in')
    : enComputed;
  const ruHref = locale === 'ru' ? pathname : switchPath(pathname, 'ru');

  return (
    <header className="header">
      <div className="wrap header-in">
        <Link href={home} className="brand" onClick={() => setOpen(false)}>
          <Logo />
          <span>Server<em>Calc</em></span>
        </Link>

        <nav className={open ? 'nav nav-open' : 'nav'}>
          {NAV.filter((item) => !item.optional || showPromos).map((item) => {
            const href = navHref(item, locale);
            return (
              <Link
                key={item.key}
                href={href}
                className={isActive(href) ? 'active' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label[locale]}
              </Link>
            );
          })}
        </nav>

        <div className="header-right">
          <span className="lang-toggle" role="group" aria-label={tt.langLabel}>
            <Link
              href={enHref}
              className="lang-opt"
              hrefLang="en"
              aria-current={locale === 'en' ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              EN
            </Link>
            <Link
              href={ruHref}
              className="lang-opt"
              hrefLang="ru"
              aria-current={locale === 'ru' ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              RU
            </Link>
          </span>
          <Link href={`${home === '/' ? '' : home}/#podbor`} className="btn btn-brass btn-sm header-cta">
            {tt.brandCta}
          </Link>
        </div>

        <button
          className="burger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? tt.menuClose : `${tt.menuOpen} ${SITE_NAME}`}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
            {open ? (
              <path d="M2 2l14 10M16 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M0 1h18M0 7h18M0 13h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
