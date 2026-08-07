/**
 * English content layer for the location pages. Mirrors GEO_CONTENT in
 * geo-content.js one-to-one (same slugs), so the RU file stays untouched.
 * Without this, a location page is just a filtered showcase, i.e. exactly
 * what search engines treat as thin affiliate content.
 */

export const GEO_CONTENT_EN = {
  rossiya: {
    why: 'A Russian location solves two problems at once: minimal latency for an audience inside the country, and keeping data on Russian territory, which the law requires for users’ personal data. The ping from Moscow to a Moscow data center is single-digit milliseconds; to Europe it is already 25-40, and on interactive interfaces the difference is noticeable',
    pros: [
      'Latency from Russia of 3 to 15 milliseconds, several times more to Europe',
      'A contract, an invoice and proper closing documents for a legal entity',
      'Support in Russian during your time zone’s business hours',
      'Personal data hosted inside the country',
    ],
    cons: [
      'The price for the same resources is usually higher than European',
      'A narrower choice of configurations with a large amount of memory',
    ],
    faq: [
      {
        q: 'Is it mandatory to host the server in Russia',
        a: 'If a project collects the personal data of Russian users, it must be processed using databases located in Russia. This applies to sign-ups, feedback forms and personal accounts. For a project without personal data there is no restriction, and the choice is driven only by latency and price',
      },
      {
        q: 'Moscow or St. Petersburg, is there a difference',
        a: 'For an audience across the whole country the difference is a few milliseconds and has no practical significance. It appears if your audience is concentrated in one of the cities or if you need redundancy across two independent sites',
      },
    ],
  },

  evropa: {
    why: 'Europe is the best price-to-resources ratio on the market: Germany and the Netherlands give twice the memory for the same money compared with Russian sites. The price for that is latency: from Moscow to Frankfurt it is about 30-40 milliseconds. For websites and APIs it is imperceptible; for interactive interfaces and game servers it is already felt',
    pros: [
      'The best price per gigabyte of memory among the popular locations',
      'A wide choice of configurations and providers',
      'Strong connectivity to the rest of the world',
    ],
    cons: [
      'Latency from Russia of 25-40 milliseconds',
      'The personal data of Russian users cannot be hosted here',
      'Billing in foreign currency, exchange-rate risk',
    ],
    faq: [
      {
        q: 'Germany or the Netherlands',
        a: 'By latency and price the difference is minimal, and both are connected to Russia directly. The Netherlands has traditionally been a little more liberal on content requirements, Germany stricter on copyright enforcement. In practice the choice is more often decided by which provider has the configuration you need',
      },
      {
        q: 'Does 30 milliseconds of latency get in the way',
        a: 'For a website, an API and background tasks it does not get in the way at all: it is lost against page-render time. It is noticeable on interactive apps where every action waits for a server response, and on games where the count is in frames',
      },
    ],
  },

  oae: {
    why: 'The UAE makes sense for a specific audience: the Middle East, the Persian Gulf and South Asia. Dubai has become a major connectivity hub, and latency from here to India, Saudi Arabia and East Africa is substantially lower than from Europe. For a Russian audience the location loses to both Europe and local sites',
    pros: [
      'Minimal latency for a Middle East and South Asia audience',
      'Local legal entities and in-region support',
      'A growing data-center market and good connectivity',
    ],
    cons: [
      'Prices higher than European for the same resources',
      'A noticeably narrower choice of providers and configurations',
      'For a Russian audience, latency of about 90-120 milliseconds',
    ],
    faq: [
      {
        q: 'Who is a server in the UAE for',
        a: 'Projects whose audience or partners are in the Persian Gulf region, and companies registered in the UAE for which local data hosting matters. For a project with a Russian audience this location is unjustifiably expensive',
      },
    ],
  },

  ssha: {
    why: 'The USA remains a center of gravity for services that integrate with American APIs: payment systems, email providers, cloud platforms. Hosting next to these services removes the latency on every request, and at dozens of calls per operation that already adds up to seconds',
    pros: [
      'Minimal latency to most major SaaS and APIs',
      'A huge choice of providers and configurations',
      'Often cheaper than Europe on larger configurations',
    ],
    cons: [
      'Latency from Russia of 100-150 milliseconds, a lot for interactive use',
      'The personal data of Russian users cannot be hosted here',
    ],
    faq: [
      {
        q: 'East or west coast',
        a: 'The east coast is about 20-30 milliseconds closer to Europe and Russia, the west coast closer to Asia. If a project integrates with a specific service, it is reasonable to choose the region by its location rather than by the audience’s geography',
      },
    ],
  },

  kazahstan: {
    why: 'Kazakhstan is chosen as a compromise: latency to Russia is lower than European, the jurisdiction is separate, and payments are simpler than with far-abroad countries. The location suits projects that serve several CIS countries at once, and those who need a site outside Russia without losing connectivity',
    pros: [
      'Latency to a Russian audience lower than from Europe',
      'A separate jurisdiction while keeping CIS connectivity',
      'Russian-speaking support at most providers',
    ],
    cons: [
      'A small choice of providers and configurations',
      'Prices closer to Russian than to European',
    ],
    faq: [
      {
        q: 'How is Kazakhstan better than Europe',
        a: 'In latency to an audience in Russia and Central Asia: it is roughly half the European figure. It is worse on the choice of configurations and price per resource. This is a location for a specific task, not a universal replacement',
      },
    ],
  },

  globalno: {
    why: 'Providers with a wide data-center network are needed when the audience is spread out and there is no single right region. The practical value is not in the number of dots on the map but in being able to move the server to another region without changing the provider or the control panel',
    pros: [
      'The option to pick a region for a specific project and change it later',
      'One account and one panel for all sites',
      'Usually a private network between regions',
    ],
    cons: [
      'Local providers are often cheaper in their own region',
      'The quality of sites within one network can vary',
    ],
    faq: [
      {
        q: 'What to choose, a global provider or a local one',
        a: 'A local one is usually cheaper and closer to the audience of a specific country. A global one is more convenient when there are several regions or when it is not yet clear where the main audience will be: changing sites within one account is easier than moving a project between providers',
      },
    ],
  },
};

export function geoContentEn(slug) {
  return GEO_CONTENT_EN[slug] || null;
}
