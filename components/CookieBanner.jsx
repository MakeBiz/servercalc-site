'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { goal, GOALS } from '@/lib/metrika';
import { localeFromPath, t } from '@/lib/i18n';

const KEY = 'servercalc.cookie.v1';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const pathname = usePathname() || '/';
  const locale = localeFromPath(pathname);
  const c = t(locale).cookie;
  const L = (ru, en) => (locale === 'en' ? en : ru);

  useEffect(() => {
    try {
      if (!document.cookie.includes(`${KEY}=1`)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function accept() {
    try {
      const year = 365 * 24 * 60 * 60;
      document.cookie = `${KEY}=1; path=/; max-age=${year}; samesite=lax`;
    } catch {
      /* приватный режим браузера */
    }
    goal(GOALS.cookieAccept);
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="cookie" role="dialog" aria-label={c.aria}>
      <p>
        {c.text} <Link href={L('/cookie', '/en/cookie')}>{c.cookieLink}</Link> {c.and}{' '}
        <Link href={L('/politika-konfidencialnosti', '/en/privacy')}>{c.privacyLink}</Link>
      </p>
      <button className="btn btn-brass btn-sm" onClick={accept}>
        {c.accept}
      </button>
    </div>
  );
}
