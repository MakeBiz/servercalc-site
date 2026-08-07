import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { SITE, SITE_NAME, METRIKA_ID, GA_ID } from '@/lib/site';
import { STATS } from '@/lib/data';
import { fmtDate } from '@/lib/format';

const LOCALE = 'en';

export const metadata = {
  title: 'Privacy policy',
  description:
    'What data the service processes and why, how long it is kept, what rights a visitor has and how to withdraw consent',
  alternates: {
    canonical: '/en/privacy',
    languages: {
      ru: '/politika-konfidencialnosti',
      en: '/en/privacy',
      'x-default': '/politika-konfidencialnosti',
    },
  },
  robots: { index: true, follow: true },
};

const UPDATED = '2026-08-02';

export default function PrivacyPageEn() {
  return (
    <>
      <PageHead
        locale={LOCALE}
        eyebrow="Legal"
        title="Privacy policy"
        lead="This document describes what visitor data the service processes, for what purpose, and what a visitor can do about it"
        crumbs={[{ href: '/en/privacy', label: 'Privacy policy' }]}
        badges={<span className="badge badge-brass">revision of {fmtDate(UPDATED, LOCALE)}</span>}
      />

      <section className="section paper">
        <div className="wrap-narrow">
          <div className="prose">
            <h2>1. General</h2>
            <p>
              This policy sets out how the personal data of visitors to {SITE.domain} (the service) is
              processed. The service operates from Russia, and the policy is drawn up in accordance
              with Russian Federal Law No. 152-FZ of 27 July 2006 “On Personal Data”.
            </p>
            <p>
              The data controller’s details will be published in this clause once the legal entity is
              registered. Until then the service operates in test mode.
            </p>
            <p>
              Using the service means the visitor agrees to this policy. If you do not agree with its
              terms, use your browser settings to block cookies or leave the site.
            </p>

            <h2>2. What data is processed</h2>
            <p>The service does not ask for or store names, phone numbers or addresses. Only the data a browser transmits automatically is processed:</p>
            <ul>
              <li>the IP address and the approximate region derived from it</li>
              <li>browser type and version, operating system, screen resolution</li>
              <li>the referring source, the search query, the addresses of the pages viewed</li>
              <li>the time and length of the visit, and actions within pages</li>
              <li>identifiers stored in cookies, including the analytics visitor identifier</li>
            </ul>
            <p>
              If a visitor voluntarily sends a message to the email address shown on the site, the
              sender’s address and the content of the message are also processed, solely to reply to
              the message.
            </p>

            <h2>3. Purposes of processing</h2>
            <ul>
              <li>keeping the service running and protecting it from automated requests</li>
              <li>measuring traffic and content quality, improving the matching and the catalog</li>
              <li>analyzing referral sources, including clicks to providers via affiliate links</li>
              <li>replying to visitor messages</li>
            </ul>
            <p>
              The data is not used to make legally significant decisions about the visitor and is not
              used for profiling that carries legal consequences.
            </p>

            <h2>4. Analytics systems</h2>
            <p>
              The service runs two analytics systems. Yandex Metrika (counter number {METRIKA_ID})
              collects anonymized data about visitor behavior, including a recording of actions in the
              interface, and processes it on its own servers under the terms of use and privacy policy
              of Yandex LLC.
            </p>
            <p>
              Google Analytics{GA_ID ? ` (measurement ID ${GA_ID})` : ''} collects anonymized data
              about traffic and interactions and processes it on Google’s servers under the Google
              terms of service and privacy policy.
            </p>
            <p>
              You can opt out of this collection by installing a blocker, the official Yandex Metrika
              opt-out add-on provided by Yandex, or the Google Analytics opt-out browser add-on
              provided by Google.
            </p>

            <h2>5. Affiliate clicks</h2>
            <p>
              Some of the links to provider sites are affiliate links. When you follow such a link the
              provider may set its own cookies and record the click in order to calculate a
              commission. Data processing after the click is governed by the policy of the site you
              landed on, and this document does not extend to it. The affiliate nature of a link is
              disclosed next to the link itself.
            </p>

            <h2>6. Sharing with third parties</h2>
            <p>
              The service does not sell or share visitor data with third parties, except to the
              analytics providers to the extent required for those systems to work, and in cases
              expressly provided for by law upon an official request from an authorized body.
            </p>

            <h2>7. Retention periods</h2>
            <p>
              Analytics data is kept in the analytics systems for the period set by their operators.
              Cookies set by the service have a lifetime of up to one year. Email messages are kept
              until the correspondence ends and for one year after that.
            </p>

            <h2>8. Visitor rights</h2>
            <p>A visitor has the right to:</p>
            <ul>
              <li>obtain information about the processing of their data</li>
              <li>demand that their data be corrected, blocked or destroyed</li>
              <li>withdraw consent to processing</li>
              <li>appeal the operator’s actions to Roskomnadzor or in court</li>
            </ul>
            <p>
              To exercise these rights, send a message to the address shown on the{' '}
              <Link href="/en/about">about</Link> page. You can withdraw consent to the use of cookies
              by clearing cookies in your browser and blocking them in the settings.
            </p>

            <h2>9. Data protection</h2>
            <p>
              The service applies organizational and technical measures to protect the data it
              processes from unlawful access: data is transmitted over a secure protocol, and access
              to the administrative side is restricted.
            </p>

            <h2>10. Changes to the policy</h2>
            <p>
              The operator may amend this policy. The current version is always available at this
              address, and the revision date is shown at the top of the page. Material changes are
              published in the <Link href="/en/news">news section</Link>.
            </p>
          </div>

          {/* Service notice, visible only while the site is in demo mode; it disappears
              together with demo mode when meta.dataStatus in taxonomy.json becomes "live" */}
          {STATS.demo && (
            <div className="notice notice-warn mt-lg">
              <strong>Draft, requires review by a lawyer.</strong> This text was prepared for the
              typical operating model of {SITE_NAME} and must be verified after the legal entity is
              chosen, together with the filing of a personal-data processing notice with Roskomnadzor
            </div>
          )}
        </div>
      </section>
    </>
  );
}
