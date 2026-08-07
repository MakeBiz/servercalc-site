import Link from 'next/link';
import PageHead from '@/components/PageHead';
import SecHead from '@/components/SecHead';
import { WEIGHTS_TABLE_EN } from '@/lib/score';
import { STATS, REQUIREMENTS } from '@/lib/data';
import { fmtDate } from '@/lib/format';

const LOCALE = 'en';

export const metadata = {
  title: 'Matching methodology',
  description:
    'How the match percentage is calculated: the full table of formula weights, the plan-selection rules, the price-freshness rule, and why the size of the affiliate commission is not part of the calculation',
  alternates: {
    canonical: '/en/methodology',
    languages: { ru: '/metodologiya', en: '/en/methodology', 'x-default': '/metodologiya' },
  },
};

export default function MethodologyPageEn() {
  return (
    <>
      <PageHead
        locale={LOCALE}
        eyebrow="Trust"
        title="Matching methodology"
        lead="We publish the formula in full so the result can be checked. If a match percentage cannot be explained, it is not matching, it is a showcase with a pretty number"
        crumbs={[{ href: '/en/methodology', label: 'Methodology' }]}
        badges={
          <>
            <span className="badge badge-brass">the formula is open</span>
            <span className="badge">commission is not a factor</span>
            <span className="badge">updated {fmtDate(STATS.verifiedAt, LOCALE)}</span>
          </>
        }
      />

      <section className="section paper">
        <div className="wrap-narrow">
          <div className="prose">
            <SecHead n="01">What exactly is scored</SecHead>
            <p>
              Matching works as a sum of points. Every provider starts from a base value, then points
              are added or subtracted across six signals. The result is clamped to a range from 6 to
              99: we never give zero or one hundred on principle, because a perfect fit on every
              parameter does not exist.
            </p>
          </div>

          <div className="tbl-wrap mt">
            <div className="tbl-scroll">
              <table className="tbl" style={{ minWidth: 560 }}>
                <thead>
                  <tr>
                    <th>Signal</th>
                    <th>Points</th>
                    <th>When it applies</th>
                  </tr>
                </thead>
                <tbody>
                  {WEIGHTS_TABLE_EN.map((row) => (
                    <tr key={row.label}>
                      <td style={{ fontWeight: 600 }}>{row.label}</td>
                      <td className="td-num" style={{ color: 'var(--brass-deep)', fontWeight: 600 }}>
                        {row.value}
                      </td>
                      <td className="dim">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="prose mt-lg">
            <SecHead n="02">About the “price per resource” axis</SecHead>
            <p>
              The last term compares the chosen plan’s price per gigabyte of memory with the median
              across the whole base. A plan half the median gets the maximum, twice the median gets
              the minimum, at the median it is zero. This is the only axis that works even when the
              visitor has chosen nothing yet: without it, all suitable providers would get the same
              score.
            </p>
            <p>
              The metric is objective and computed from the same data shown in the catalog: you can
              recompute it by hand from the “per GB” column. It does not account for differences in
              platform quality, so its weight is deliberately small, just six points either way.
            </p>

            <SecHead n="03">What the formula does not contain</SecHead>
            <p>
              The size of the affiliate commission is not a term in the calculation. A provider that
              pays us more gets not a single extra point. This is not a statement of intent but a
              property of the code: the file with the formula has no access to commission data.
            </p>
            <p>
              For the same reason the catalog includes providers we have no affiliate relationship
              with. They take part in the matching on equal terms, and we earn nothing from them.
            </p>

            <SecHead n="04">How a plan is chosen within a provider</SecHead>
            <p>
              The score is computed not for a provider in general but for the specific plan that best
              answers the request. The selection order is:
            </p>
            <ol className="num-list">
              <li>First, plans in the required location are selected, if one is set</li>
              <li>Of those, the ones that cover the requested cores and memory remain</li>
              <li>If a disk requirement is checked, plans with NVMe get priority</li>
              <li>Among those within budget, the cheapest is chosen: you asked for a specific configuration, not the most power for your money</li>
              <li>If nothing fits the budget, the closest by price is shown</li>
            </ol>
            <p>
              The last point matters: we do not hide a provider that did not fit the limit, we show
              it with an honest note of how much more expensive it is.
            </p>

            <SecHead n="05">The price-freshness rule</SecHead>
            <p>
              Every plan has a verification date, shown on the showcase. A plan not checked for more
              than {STATS.staleDays} days is hidden automatically rather than shown with an old price.
              The provider stays in the catalog, it just has no price until the next check.
            </p>
            <p>
              That decision costs us part of the showcase. We consider the trade-off right: a catalog
              with forty confirmed prices is more useful than a catalog with four hundred prices of
              unknown freshness.
            </p>

            <SecHead n="06">What the requirements mean</SecHead>
            <p>
              Requirements in the calculator are checked in different ways, worth knowing to read the
              result correctly:
            </p>
            <ul>
              {REQUIREMENTS.map((r) => (
                <li key={r.code}>
                  <strong>{r.nameEn || r.name}</strong>: {r.noteEn || r.note}
                  {r.code === 'nvme' ? ' Checked per specific plan, not per provider' : ' Checked against the provider’s features'}
                </li>
              ))}
            </ul>

            <SecHead n="07">How the catalog is formed</SecHead>
            <p>
              A provider makes the catalog if it has a public price list we can verify and a line of
              virtual servers. We do not charge for inclusion or for a spot in the list. There is no
              paid placement on the site: if it ever appears, it will be a separate, clearly marked
              block and will not mix with the matching results.
            </p>
            <p>
              We do not copy plan descriptions from providers’ sites. Specs come from the price list,
              but the wording is our own: copied merchant descriptions are treated by search engines
              as a thin affiliate scheme.
            </p>

            <SecHead n="08">Why we do not write “best”</SecHead>
            <p>
              A superlative without a published comparison criterion is both an advertising-law issue
              and simply dishonest. We say “fits the workload” and show by which signals, not “best
              host of the year”.
            </p>

            <SecHead n="09">What we will add</SecHead>
            <p>
              Near-term changes to the methodology: a separate renewal-price field next to the promo
              price, factoring the cost of an IPv4 address and a control panel into the total cost of
              ownership, and from the second month our own performance measurements on entry-level
              plans from several providers. Every change to the formula will be reflected on this page.
            </p>
          </div>

          <div className="notice mt-lg">
            <strong>Found an error in the calculation.</strong> The formula is open exactly so it can
            be challenged. If a matching result looks wrong, write to us and we will look into the
            specific case, and if needed adjust the weights and note it in the{' '}
            <Link href="/en/news">news section</Link>
          </div>
        </div>
      </section>
    </>
  );
}
