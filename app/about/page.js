import Link from 'next/link';
import PageHead from '@/components/PageHead';
import SecHead from '@/components/SecHead';
import { STATS } from '@/lib/data';
import { SITE, SITE_NAME } from '@/lib/site';
import { fmtDate } from '@/lib/format';

const LOCALE = 'en';

export const metadata = {
  title: 'About the project',
  description:
    'What ServerCalc is, where the catalog data comes from, the principles the service runs on, and what is planned next',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPageEn() {
  return (
    <>
      <PageHead
        locale={LOCALE}
        eyebrow="About"
        title="About the project"
        lead={`${SITE_NAME} is a reference catalog of virtual servers with workload-based matching. We do not sell servers and we are not a hosting provider: we help you choose and we say plainly how we earn`}
        crumbs={[{ href: '/about', label: 'About' }]}
        badges={
          <>
            <span className="badge badge-brass">{STATS.plans} plans with a verified price</span>
            <span className="badge">data verified {fmtDate(STATS.verifiedAt, LOCALE)}</span>
          </>
        }
      />

      <section className="section paper">
        <div className="wrap-narrow">
          <div className="prose">
            <SecHead n="01">Why this exists</SecHead>
            <p>
              The VPS market is inconvenient for the buyer. Showcase prices are promotional, the real
              cost of ownership is spread across five line items, and comparing means opening a dozen
              tabs by hand. Existing catalogs solve half the problem: they show plans but do not
              explain which one fits you, and they almost never say when a price was last checked.
            </p>
            <p>
              We do three things this market lacks: matching with an explanation, a verification date
              on every price, and an open formula you can challenge.
            </p>

            <SecHead n="02">Where the data comes from</SecHead>
            <p>
              Specs and prices come from providers’ public price lists. At the start the check is
              manual; later a scheduled parser does it. Every plan carries the date it was last
              verified, and if that date is older than {STATS.staleDays} days, the plan drops off the
              showcase automatically.
            </p>
            <p>
              We write the descriptions and assessments ourselves. We will not copy plan descriptions
              from providers’ sites: it is useless to the reader and search engines treat it as a thin
              affiliate scheme.
            </p>

            <SecHead n="03">Principles</SecHead>
            <ul className="roman-list">
              <li>The matching formula is published in full and changes in public</li>
              <li>The size of the affiliate commission does not affect the matching result</li>
              <li>The catalog includes providers we earn nothing from</li>
              <li>Every review has a limitations section</li>
              <li>A stale price is hidden, not shown</li>
              <li>We do not write “best” without a published comparison criterion</li>
            </ul>

            <SecHead n="04">What’s next</SecHead>
            <p>
              Near-term plans: moving the base to automatic price updates, a separate renewal-price
              field next to the promo price, and factoring the cost of an IPv4 address and a control
              panel into the cost of ownership. From the second month, our own benchmark stand:
              several entry-level plans from different providers, monthly measurements of disk, CPU
              and network by the same method. There is almost no such data on the Russian market today.
            </p>

            <SecHead n="05">Who runs the project</SecHead>
            <p>
              The operator’s details will be published here after the legal entity is registered. The
              service is not a hosting provider, does not provide hosting, and does not take payments
              for servers: all contracts are signed directly with the chosen provider.
            </p>
            <p>
              {SITE.contactEmail
                ? `Contact: ${SITE.contactEmail}`
                : 'A contact address will be published here together with the operator’s details.'}
            </p>
          </div>

          <div className="grid-2 mt-lg">
            <div className="notice">
              <strong>Want to argue with the numbers.</strong> The formula is open for exactly that,
              see the <Link href="/methodology">methodology</Link>
            </div>
            <div className="notice">
              <strong>Want to know who we partner with.</strong> It is stated in every provider
              review, <Link href="/providers">the full list</Link>
            </div>
          </div>

          <div className="mt-lg">
            <p className="faint">
              The catalog includes providers we have no affiliate relationship with: they take part in
              the matching on equal terms, and we earn nothing from them
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
