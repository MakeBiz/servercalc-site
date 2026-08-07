import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { METRIKA_ID, GA_ID, SITE_NAME } from '@/lib/site';
import { fmtDate } from '@/lib/format';

const LOCALE = 'en';

export const metadata = {
  title: 'Use of cookies',
  description:
    'Which cookies the service uses, what they are for, how long they live and how to turn them off in your browser',
  alternates: {
    canonical: '/en/cookie',
    languages: { ru: '/cookie', en: '/en/cookie', 'x-default': '/cookie' },
  },
};

const UPDATED = '2026-08-02';

const COOKIES = [
  {
    name: 'servercalc.cookie.v1',
    who: SITE_NAME,
    what: 'Remembers that you closed the cookie notice so it does not appear on every visit',
    life: '1 year',
    kind: 'Technical',
  },
  {
    name: '_ym_uid, _ym_d',
    who: 'Yandex Metrika',
    what: 'An anonymized visitor identifier and the date of the first visit. Used to tell new readers from returning ones',
    life: '1 year',
    kind: 'Analytics',
  },
  {
    name: '_ym_isad, _ym_visorc',
    who: 'Yandex Metrika',
    what: 'Service values of the counter: whether a blocker is present and the session-recording state',
    life: 'session to 2 days',
    kind: 'Analytics',
  },
  {
    name: '_ga, _ga_WE8E8VWCS7',
    who: 'Google Analytics',
    what: 'An anonymized visitor identifier and the Google Analytics session state. Used to count visits and distinguish visitors',
    life: '2 years',
    kind: 'Analytics',
  },
];

export default function CookiePageEn() {
  return (
    <>
      <PageHead
        locale={LOCALE}
        eyebrow="Legal"
        title="Use of cookies"
        lead="Cookies are small text records a site stores in your browser. This page lists exactly which records the service creates and why"
        crumbs={[{ href: '/en/cookie', label: 'Cookies' }]}
        badges={<span className="badge badge-brass">revision of {fmtDate(UPDATED, LOCALE)}</span>}
      />

      <section className="section paper">
        <div className="wrap-narrow">
          <div className="prose">
            <h2>What they are for</h2>
            <p>
              The service uses cookies for two things: to avoid showing the same notice on every visit
              and to understand which pages readers use and which are useless. We do not use cookies
              for ad targeting and do not pass them to ad networks.
            </p>
          </div>

          <div className="tbl-wrap mt">
            <div className="tbl-scroll">
              <table className="tbl" style={{ minWidth: 620 }}>
                <thead>
                  <tr>
                    <th>Record</th>
                    <th>Set by</th>
                    <th>Purpose</th>
                    <th>Lifetime</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name}>
                      <td className="mono" style={{ fontSize: '0.82rem' }}>{c.name}</td>
                      <td>{c.who}</td>
                      <td className="dim">{c.what}</td>
                      <td className="td-num">{c.life}</td>
                      <td>
                        <span className="badge">{c.kind}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="prose mt-lg">
            <h2>Partner cookies</h2>
            <p>
              When you follow an affiliate link to a provider, its site may set its own cookies to tie
              an order to our click. Those records are created on the provider’s side and are subject
              to its rules. The affiliate relationship itself is disclosed next to every such link and
              in the review of the provider in question.
            </p>

            <h2>How to turn them off</h2>
            <p>
              Every modern browser lets you block cookies entirely or for specific sites in the
              settings section devoted to privacy and site data. Records already stored can be deleted
              there too.
            </p>
            <p>
              Data collection by Yandex Metrika can be declined separately with the official browser
              add-on provided by Yandex; Google Analytics collection can be declined with the official
              opt-out add-on provided by Google, or with any blocker.
            </p>
            <p>
              With cookies disabled the service keeps working: the matching, the catalog and the
              content do not need them to render. The only inconvenience is that the cookie notice
              reappears on every visit.
            </p>

            <h2>Counters</h2>
            <p>
              The Yandex Metrika counter number on the service is {METRIKA_ID}
              {GA_ID ? `, and the Google Analytics measurement ID is ${GA_ID}` : ''}. Details of the
              data processing are described in the{' '}
              <Link href="/en/privacy">privacy policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
