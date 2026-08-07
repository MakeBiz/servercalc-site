'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { SITE_NAME } from '@/lib/site';
import { fmtDate } from '@/lib/format';
import { localeFromPath, t } from '@/lib/i18n';

export default function Footer({ verifiedAt, hasPromos = false, domain, contactEmail }) {
  const pathname = usePathname() || '/';
  const locale = localeFromPath(pathname);
  const tt = t(locale);
  const f = tt.footer;
  const home = locale === 'en' ? '/en' : '/';
  const L = (ru, en) => (locale === 'en' ? en : ru);
  const year = new Date().getUTCFullYear();

  return (
    <footer className="footer ink-deep">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href={home} className="brand" style={{ marginBottom: 14 }}>
              <Logo size={24} />
              <span>Server<em>Calc</em></span>
            </Link>
            <p style={{ maxWidth: 320, marginTop: 12 }}>{f.about}</p>
            <p style={{ marginTop: 14 }}>
              <span className="badge badge-brass">{f.verified} {fmtDate(verifiedAt, locale)}</span>
            </p>
          </div>

          <div>
            <h4>{f.colPick}</h4>
            <ul>
              <li><Link href={`${home === '/' ? '' : home}/#podbor`}>{f.calculator}</Link></li>
              <li><Link href={L('/catalog', '/en/catalog')}>{f.catalog}</Link></li>
              <li><Link href={L('/vps-dlya', '/en/vps-for')}>{f.byTask}</Link></li>
              <li><Link href={L('/vps', '/en/vps-in')}>{f.byGeo}</Link></li>
              {hasPromos && <li><Link href={L('/akcii', '/en/deals')}>{f.promos}</Link></li>}
            </ul>
          </div>

          <div>
            <h4>{f.colProviders}</h4>
            <ul>
              <li><Link href={L('/provajdery', '/en/providers')}>{f.allProviders}</Link></li>
              <li><Link href={L('/provajdery/timeweb', '/en/providers/timeweb')}>Timeweb Cloud</Link></li>
              <li><Link href={L('/provajdery/adminvps', '/en/providers/adminvps')}>AdminVPS</Link></li>
              <li><Link href={L('/provajdery/hostman', '/en/providers/hostman')}>Hostman</Link></li>
            </ul>
          </div>

          <div>
            <h4>{f.colAbout}</h4>
            <ul>
              <li><Link href={L('/metodologiya', '/en/methodology')}>{f.methodology}</Link></li>
              <li><Link href={L('/o-proekte', '/en/about')}>{f.aboutPage}</Link></li>
              <li><Link href={L('/novosti', '/en/news')}>{f.news}</Link></li>
              <li><Link href={L('/politika-konfidencialnosti', '/en/privacy')}>{f.privacy}</Link></li>
              <li><Link href={L('/cookie', '/en/cookie')}>{f.cookie}</Link></li>
              {contactEmail && (
                <li>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            {year} {SITE_NAME}, {domain}
          </span>
          <span style={{ maxWidth: 620 }}>
            {f.disclosure}{' '}
            <Link href={L('/metodologiya', '/en/methodology')} style={{ textDecoration: 'underline' }}>
              {f.formulaOpen}
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
