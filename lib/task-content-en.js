/**
 * English content layer for the workload pages. Mirrors TASK_CONTENT in
 * task-content.js one-to-one (same slugs), so the RU file stays untouched.
 * This is what stops a workload page from being a thin affiliate shim.
 *
 * sizing: three configuration tiers with a note on what happens at each
 * checklist: what to check with the provider before paying
 * faq: questions people actually ask, also feed the FAQPage markup
 */

export const TASK_CONTENT_EN = {
  sajt: {
    why: 'A website rarely runs short of CPU: the bottleneck is almost always memory and disk operations. A typical cached WordPress site lives comfortably on one core and two gigabytes of memory, because PHP processes finish quickly and page caching absorbs the heavy queries. The trouble starts not from traffic but from the number of plugins and the absence of caching',
    sizing: [
      { label: 'Minimum', cpu: 1, ram: 1, disk: 15, note: 'A landing page or static site, up to a few hundred visits a day' },
      { label: 'Working', cpu: 1, ram: 2, disk: 25, note: 'WordPress or another CMS with caching, database on the same server' },
      { label: 'With headroom', cpu: 2, ram: 4, disk: 40, note: 'Several sites on one server, on-site search, images without a CDN' },
    ],
    checklist: [
      'Whether there is a control panel or the server has to be run through the console',
      'How much a dedicated IPv4 address costs, needed for your own domain and certificate',
      'How backups work: included in the plan or billed per gigabyte',
      'The renewal price, not just the price of the first term',
    ],
    faq: [
      {
        q: 'Why is a VPS better than ordinary shared hosting for a website',
        a: 'On shared hosting the resources are split among hundreds of sites, and you do not control the PHP version, the cache or the limits. On a VPS the resources are yours, but you are responsible for updates and security. For a single simple site, hosting is often cheaper; for several projects or a non-standard stack, a VPS is cheaper and more predictable',
      },
      {
        q: 'Is one gigabyte of memory enough for WordPress',
        a: 'It will run, but with no headroom. One gigabyte means a hard limit on the number of simultaneous PHP processes, and a traffic spike or a heavy plugin will crash the site with a memory error. Two gigabytes is a reasonable minimum if the site earns money',
      },
    ],
  },

  magazin: {
    why: 'A store differs from a website in that not everything can be cached: the cart, the account and the checkout are computed on the fly. On top of that the database grows with the catalog and the order history, and product images take up space. That is why a store takes twice the memory of a website with the same traffic',
    sizing: [
      { label: 'Minimum', cpu: 2, ram: 2, disk: 30, note: 'A catalog of up to a few hundred products, a few orders a day' },
      { label: 'Working', cpu: 2, ram: 4, disk: 50, note: 'WooCommerce or OpenCart, thousands of products, dozens of orders a day' },
      { label: 'With headroom', cpu: 4, ram: 8, disk: 80, note: 'Bitrix, integrations with 1C and marketplaces, sales with peak load' },
    ],
    checklist: [
      'The disk subsystem: on a store the difference between SSD and NVMe shows in how the catalog renders',
      'Whether there are snapshots to roll back after a failed module update',
      'How the provider behaves under a traffic spike, whether resources can be added quickly',
      'Whether there is enough space for product images with two years of headroom',
    ],
    faq: [
      {
        q: 'Do I need a separate server for the database',
        a: 'Up to a few thousand products and dozens of orders a day, no: the database and the application live together comfortably. Splitting them makes sense when the server starts hitting its memory limit during a catalog export, or when an integration with an accounting system blocks the storefront',
      },
      {
        q: 'What matters more for a store, cores or memory',
        a: 'Memory. Cores are needed when dozens of non-cacheable pages are computed at once, but a memory shortage kills a store immediately: the database spills to disk and the catalog starts taking seconds to open',
      },
    ],
  },

  '1c-bitrix': {
    why: 'The requirements of 1C depend not on the number of employees but on the database’s operating mode and the number of concurrent sessions. A file-based database lives on disk operations and hits locking at just five users. Client-server mode with PostgreSQL removes the ceiling but needs memory for the DBMS cache and the application server at the same time. Bitrix adds its own requirements for the PHP version and the cache',
    sizing: [
      { label: 'Minimum', cpu: 2, ram: 4, disk: 40, note: 'Up to five active sessions, a file database or a small Bitrix24' },
      { label: 'Working', cpu: 4, ram: 8, disk: 60, note: 'Five to fifteen sessions, client-server mode with PostgreSQL' },
      { label: 'With headroom', cpu: 8, ram: 16, disk: 120, note: 'Fifteen sessions and up, scheduled jobs, exchanges with external systems' },
    ],
    checklist: [
      'Disk type: on 1C the difference between SATA-SSD and NVMe shows when posting documents',
      'Windows Server and terminal-access licenses, if work goes through RDP, they are paid separately',
      'Space for backups: a week of depth needs two to four times the database size',
      'Whether there is a ready image with a configured environment or you set it all up by hand',
    ],
    faq: [
      {
        q: 'How much memory does 1C need for ten users',
        a: 'Eight gigabytes in client-server mode. About half of it goes to the DBMS cache, the rest is shared by the application server and the operating system. Ten sessions will work on four gigabytes, but the month-end close will drag and scheduled jobs will start conflicting with users',
      },
      {
        q: 'Can 1C be kept on a foreign server',
        a: 'Technically yes, but if the database holds personal data of employees or clients, hosting is governed by the requirement to process it on Russian territory. This is a question of legal setup, not performance, and it should be agreed before the move',
      },
      {
        q: 'What speeds up 1C faster, adding cores or moving to NVMe',
        a: 'In most cases the disk. Posting and re-posting documents are bound by random-access latency, not by CPU frequency. A two-core plan on NVMe often beats a four-core plan on ordinary SSD',
      },
    ],
  },

  'telegram-bot': {
    why: 'A bot is almost always idle: it waits for an event, replies in tens of milliseconds and waits again. It needs resources not for load but for stability: so the process does not die on memory and the server does not reboot. That is why a bot takes the smallest plan, and the money goes on backups and monitoring rather than cores',
    sizing: [
      { label: 'Minimum', cpu: 1, ram: 1, disk: 15, note: 'One bot on webhooks, simple logic, no database' },
      { label: 'Working', cpu: 1, ram: 2, disk: 20, note: 'A bot with a database, a queue and a couple of background tasks' },
      { label: 'With headroom', cpu: 2, ram: 4, disk: 30, note: 'Several bots, media processing, integrations with external services' },
    ],
    checklist: [
      'Network stability matters more than speed: look at uptime, not benchmarks',
      'Whether there is hourly billing to spin up a test server for a day',
      'Automatic server restart after a failure on the provider’s side',
      'The ability to change the IPv4 address quickly if it falls under restrictions',
    ],
    faq: [
      {
        q: 'Is one gigabyte of memory enough for a bot',
        a: 'For a typical Python or Node bot on webhooks it is plenty. A gigabyte stops being enough when the bot processes images, holds a large queue or launches a browser for scraping',
      },
      {
        q: 'Does a bot need a dedicated IPv4',
        a: 'For webhooks you need a public address and a certificate, which means an IPv4 address. With long polling you can do without one, but that is a less reliable setup',
      },
    ],
  },

  'baza-dannyh': {
    why: 'For a database, memory is not headroom but a working tool: the more data fits in the cache, the fewer trips to disk. The rule to start from: the active part of the database should fit in memory. The second most important parameter is the disk, and not so much sequential read speed as random-access latency',
    sizing: [
      { label: 'Minimum', cpu: 2, ram: 4, disk: 40, note: 'A database of up to a few gigabytes, a dozen concurrent connections' },
      { label: 'Working', cpu: 4, ram: 8, disk: 80, note: 'PostgreSQL or MySQL under a medium-sized application' },
      { label: 'With headroom', cpu: 8, ram: 16, disk: 160, note: 'Analytical queries, ClickHouse, hundreds of connections' },
    ],
    checklist: [
      'The I/O operations limit: NVMe in the description guarantees nothing if the plan caps IOPS',
      'The ability to grow the disk without reinstalling the server',
      'Snapshots and their frequency, a database is the last thing you can afford to lose',
      'A private network between servers, if the database will be separate from the application',
    ],
    faq: [
      {
        q: 'How much memory does PostgreSQL need',
        a: 'A guideline: the size of the active part of the database plus headroom for connections and the operating system. For a four-gigabyte database it is reasonable to take eight gigabytes of memory. If the database is several times larger than memory, the disk becomes the bottleneck, and then it matters more to take NVMe without a hard operations cap',
      },
      {
        q: 'Keep the database with the application or separate',
        a: 'Together is simpler and cheaper while the server copes. Splitting them makes sense when the application’s peaks start taking memory from the database or when you need to scale them independently. Splitting across servers requires a private network, otherwise traffic goes over the public address',
      },
    ],
  },

  ai: {
    why: 'AI tasks on a virtual server usually mean not training models but inference, orchestration and vector search. Training needs a GPU and will not run on an ordinary VPS. But the scenarios “your own front-end to a language model”, “a vector database for document search” and “automation with calls to an external API” live well on CPU servers, and they need memory for the indexes',
    sizing: [
      { label: 'Minimum', cpu: 2, ram: 4, disk: 40, note: 'A layer to an external model API, a chat interface, simple agents' },
      { label: 'Working', cpu: 4, ram: 8, disk: 80, note: 'A vector database, document search, a task queue' },
      { label: 'With headroom', cpu: 8, ram: 16, disk: 160, note: 'Local inference of small models on the CPU, large indexes' },
    ],
    checklist: [
      'Whether you need a GPU: local inference of large models on the CPU is not cost-effective',
      'Network speed and the traffic limit, if the model is called over an external API',
      'The ability to grow memory quickly for a growing vector index',
      'Hourly billing for experiments that live a few days',
    ],
    faq: [
      {
        q: 'Can a language model run on an ordinary VPS',
        a: 'Small quantized models run on the CPU and work, but slowly: a few tokens per second. Interactive use needs a GPU. A practical setup at the start is to call an external API and keep the logic, history and vector search on your own server',
      },
      {
        q: 'How much memory does a vector database need',
        a: 'It depends on the dimension and the number of vectors. A guideline for estimation: a million vectors of dimension 768 in a four-byte representation take about three gigabytes for the vectors alone, without the index and metadata. Plan memory with a twofold headroom',
      },
    ],
  },

  game: {
    why: 'For a game server, single-core frequency and network latency matter most, not the number of cores. Most game engines parallelize poorly: the world tick is computed in a single thread. So a server with four fast cores beats a server with eight slow ones, and location matters more than either: ping defines how the game feels',
    sizing: [
      { label: 'Minimum', cpu: 2, ram: 4, disk: 30, note: 'Minecraft without mods for five to ten players' },
      { label: 'Working', cpu: 4, ram: 8, disk: 60, note: 'A modded pack, twenty to thirty players, plugins' },
      { label: 'With headroom', cpu: 6, ram: 16, disk: 100, note: 'Heavy packs, several worlds, large maps' },
    ],
    checklist: [
      'Location: ping to players matters more than any server specs',
      'DDoS protection, game servers become a target fast',
      'CPU frequency, not just the number of cores',
      'Hourly billing, if the server is needed for the weekend, not the month',
    ],
    faq: [
      {
        q: 'How much memory does a Minecraft server need',
        a: 'A vanilla server for ten players lives on four gigabytes. A modded pack starts from eight, and heavy packs ask for twelve and up: mods load the whole world into memory. This is not the place to economize; a memory shortage shows up as stutters for all players at once',
      },
      {
        q: 'Does DDoS protection matter for a game server',
        a: 'It does. Game servers get attacked regularly, often by their own players after a disputed ban. Basic filtering on the provider’s side removes most of the problem and is almost always included in the plan, worth checking before ordering',
      },
    ],
  },

  dev: {
    why: 'For development, flexibility matters more than power: a server is spun up for a task, lives a week and is deleted. Hence the two main requirements that do not apply to production: hourly billing and snapshots. Resources are taken by the heaviest build step, not by average consumption',
    sizing: [
      { label: 'Minimum', cpu: 1, ram: 2, disk: 25, note: 'A sandbox, a demo stand, a light environment' },
      { label: 'Working', cpu: 2, ram: 4, disk: 50, note: 'A continuous-integration runner, a project’s Docker environment' },
      { label: 'With headroom', cpu: 4, ram: 8, disk: 100, note: 'A frontend build, several environments at once, a dependency cache' },
    ],
    checklist: [
      'Hourly billing, otherwise a week-long stand costs as much as a month',
      'Snapshots, to roll an environment back in a minute',
      'Server provisioning speed: at some providers it is minutes, at others hours',
      'An API to automate creating and deleting servers',
    ],
    faq: [
      {
        q: 'What matters more for a build runner, cores or disk',
        a: 'Usually cores: frontend builds and compilation parallelize well. But if the project pulls thousands of small dependency files, the disk comes out ahead. Practical advice: measure the build during a trial period, the difference in build time between plans is visible right away',
      },
      {
        q: 'Do I need hourly billing if the server runs constantly',
        a: 'No, for a constant server monthly billing is almost always cheaper. Hourly billing is for where servers are created and deleted: test environments, a client demo, experiments',
      },
    ],
  },

  pochta: {
    why: 'A mail server cares about deliverability and stability, not cores. Relaying mail itself is almost free; the resources go to anti-spam and filtering — a stack like Mailcow pulls in Rspamd, ClamAV and a database, and those eat the memory. But mail is decided by the address, not the server: without a correct reverse PTR record, an open port 25 and a clean IP reputation, your mail lands in spam no matter how the server is configured',
    sizing: [
      { label: 'Minimum', cpu: 1, ram: 2, disk: 25, note: 'Postfix and Dovecot by hand, a few mailboxes on one domain, light anti-spam' },
      { label: 'Working', cpu: 2, ram: 4, disk: 50, note: 'A ready mail suite with a web UI, dozens of mailboxes; Mailcow is happier from 6 GB' },
      { label: 'With headroom', cpu: 4, ram: 8, disk: 120, note: 'Several domains, antivirus and deep filtering, mail archive' },
    ],
    checklist: [
      'Whether the provider lets you set a reverse PTR record for your IP: without it mail lands in spam en masse',
      'Whether outbound port 25 is open: some providers and clouds block it by default',
      'The reputation of the assigned IPv4: whether it is already on blocklists at handover',
      'Whether you can quickly change the address if it turns out to be "dirty" from spam lists',
    ],
    faq: [
      {
        q: 'Why does mail from my server land in spam',
        a: 'Almost always it is the domain and address setup, not the message text. You need three DNS records — SPF, DKIM and DMARC — a correct reverse PTR record for the IP, and an unblocked port 25. If the address came from spam lists, only replacing it helps. This is about reputation, not server power',
      },
      {
        q: 'How much does a mail server need',
        a: 'A hand-rolled Postfix and Dovecot for a few mailboxes lives on two gigabytes of memory. Ready suites with anti-spam and antivirus — Mailcow, Mailu, Mail-in-a-Box — ask for noticeably more: Mailcow officially recommends six gigabytes and up, because Rspamd and ClamAV keep their databases in memory. Size the disk with headroom for the mail archive',
      },
      {
        q: 'Is it worth running your own mail or using a hosted service',
        a: 'Your own server removes the per-mailbox fee and keeps correspondence under your control, but shifts deliverability, updates and spam-fighting onto you. For a handful of mailboxes a hosted service is almost always simpler and cheaper all-in; your own server pays off when there are many mailboxes or data isolation matters',
      },
    ],
  },

  n8n: {
    why: 'Self-hosted automation is bound not by computation but by memory: each active process holds an execution context, and the task queue accumulates in the database. The second bottleneck is the disk, if the workflows process files. Cores start to matter only when concurrent executions number in the dozens',
    sizing: [
      { label: 'Minimum', cpu: 1, ram: 2, disk: 25, note: 'A few workflows, scheduled runs once an hour' },
      { label: 'Working', cpu: 2, ram: 4, disk: 50, note: 'Dozens of workflows, webhooks, an executions database on the same server' },
      { label: 'With headroom', cpu: 4, ram: 8, disk: 80, note: 'Concurrent executions, file processing, AI integrations' },
    ],
    checklist: [
      'Uptime matters more than speed: a missed webhook is lost forever',
      'Backups of the executions database, it holds all the history and settings',
      'Space for logs: active automation writes them fast',
      'The ability to grow memory without a reinstall',
    ],
    faq: [
      {
        q: 'How many resources does n8n need',
        a: 'Two gigabytes of memory is a working minimum for a dozen workflows on a schedule. Four gigabytes are needed when webhooks with unpredictable load and concurrent executions appear. Separately, budget space for the executions database, it grows faster than it seems',
      },
      {
        q: 'Keep automation on your own server or in the service’s cloud',
        a: 'Self-hosting is cheaper at volume and removes limits on the number of executions, but it shifts updates, backups and monitoring onto you. A reasonable threshold to switch is when the bill for the cloud version exceeds the cost of a server by three or four times',
      },
    ],
  },

  vydelennyj: {
    why: 'A dedicated server is taken not for power but for predictability: the resources are not shared with neighbors, so there is no noisy-neighbor effect and no sudden dip at peak hour. The second motive is licensing requirements and data isolation. The threshold to switch from a virtual server comes roughly where a VPS configuration approaches the cost of a physical machine',
    sizing: [
      { label: 'Entry', cpu: 8, ram: 32, disk: 480, note: 'A replacement for a large VPS, one heavy service' },
      { label: 'Working', cpu: 16, ram: 64, disk: 960, note: 'Several services, a database under load, virtualization' },
      { label: 'Loaded', cpu: 32, ram: 128, disk: 2000, note: 'A cluster, analytics, isolation for security requirements' },
    ],
    checklist: [
      'Provisioning time: a physical machine can take from a few hours to a few days to prepare',
      'What is included in administration and how fast a failed disk is replaced',
      'The setup cost and the minimum rental term',
      'Whether there is power and uplink redundancy in the data center',
    ],
    faq: [
      {
        q: 'When is it time to move from a VPS to a dedicated server',
        a: 'When a virtual server of the needed configuration costs comparably to a physical one, when neighbor unpredictability gets in the way, or when data-isolation requirements do not allow sharing hardware. Until then a virtual server is more flexible: it is easier to grow and easier to migrate',
      },
      {
        q: 'What happens when a disk fails',
        a: 'It depends on the configuration. On a mirror the service keeps running and the disk is replaced without downtime. On a single disk it means downtime during replacement plus a restore from backup. Clarify this before ordering: on a virtual server fault tolerance is usually on the provider’s side, on a dedicated one it is yours',
      },
    ],
  },
};

export function taskContentEn(slug) {
  return TASK_CONTENT_EN[slug] || null;
}
