import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { METRIKA_ID, GA_ID, SITE_NAME } from '@/lib/site';
import { ruDate } from '@/lib/format';

export const metadata = {
  title: 'Использование cookie',
  description:
    'Какие cookie использует сервис, зачем они нужны, сколько живут и как их отключить в браузере',
  alternates: { canonical: '/ru/cookie' },
};

const UPDATED = '2026-08-02';

const COOKIES = [
  {
    name: 'servercalc.cookie.v1',
    who: SITE_NAME,
    what: 'Запоминает, что вы закрыли уведомление о cookie, чтобы оно не появлялось при каждом визите',
    life: '1 год',
    kind: 'Техническая',
  },
  {
    name: '_ym_uid, _ym_d',
    who: 'Яндекс Метрика',
    what: 'Обезличенный идентификатор посетителя и дата первого визита. Нужны, чтобы отличать новых читателей от вернувшихся',
    life: '1 год',
    kind: 'Аналитическая',
  },
  {
    name: '_ym_isad, _ym_visorc',
    who: 'Яндекс Метрика',
    what: 'Служебные значения счётчика: наличие блокировщика и запись действий в интерфейсе',
    life: 'от сессии до 2 суток',
    kind: 'Аналитическая',
  },
  {
    name: `_ga, _ga_${(GA_ID || '').replace('G-', '')}`,
    who: 'Google Analytics',
    what: 'Обезличенный идентификатор посетителя и состояние сессии Google Analytics. Нужны для подсчёта визитов и различения посетителей',
    life: '2 года',
    kind: 'Аналитическая',
  },
];

export default function CookiePage() {
  return (
    <>
      <PageHead
        eyebrow="Право"
        title="Использование cookie"
        lead="Cookie это небольшие текстовые записи, которые сайт сохраняет в браузере. Здесь перечислено, какие именно записи создаёт сервис и зачем"
        crumbs={[{ href: '/ru/cookie', label: 'Cookie' }]}
        badges={<span className="badge badge-brass">редакция от {ruDate(UPDATED)}</span>}
      />

      <section className="section paper">
        <div className="wrap-narrow">
          <div className="prose">
            <h2>Зачем они нужны</h2>
            <p>
              Сервис использует cookie для двух вещей: чтобы не показывать одно и то же уведомление
              при каждом визите и чтобы понимать, какими страницами читатели пользуются, а какие
              бесполезны. Мы не используем cookie для рекламного таргетинга и не передаём их
              рекламным сетям.
            </p>
          </div>

          <div className="tbl-wrap mt">
            <div className="tbl-scroll">
              <table className="tbl" style={{ minWidth: 620 }}>
                <thead>
                  <tr>
                    <th>Запись</th>
                    <th>Кто создаёт</th>
                    <th>Зачем</th>
                    <th>Срок</th>
                    <th>Тип</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.filter((c) => METRIKA_ID || c.who !== 'Яндекс Метрика').map((c) => (
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
            <h2>Cookie партнёров</h2>
            <p>
              При переходе по партнёрской ссылке к провайдеру его сайт может установить собственные
              cookie, чтобы связать заказ с нашим переходом. Эти записи создаются уже на стороне
              провайдера и подчиняются его правилам. Сам факт партнёрских отношений раскрыт рядом с
              каждой такой ссылкой и в обзоре соответствующего провайдера.
            </p>

            <h2>Как отключить</h2>
            <p>
              Все современные браузеры позволяют запретить cookie полностью или для отдельных сайтов
              в разделе настроек, посвящённом конфиденциальности и данным сайтов. Уже сохранённые
              записи можно удалить там же.
            </p>
            <p>
              {METRIKA_ID
                ? 'Отдельно можно отказаться от сбора данных Яндекс Метрикой с помощью официального дополнения Яндекса, а от сбора данных Google Analytics с помощью официального дополнения Google для браузера или любого блокировщика.'
                : 'Отказаться от сбора данных Google Analytics можно с помощью официального дополнения Google для браузера или любого блокировщика.'}
            </p>
            <p>
              При отключении cookie сервис продолжит работать: подбор, каталог и материалы не
              требуют их для отображения. Единственное неудобство это повторное появление
              уведомления о cookie при каждом визите.
            </p>

            <h2>Счётчики</h2>
            <p>
              {METRIKA_ID
                ? `Номер счётчика Яндекс Метрики, установленного на сервисе: ${METRIKA_ID}${GA_ID ? `, идентификатор Google Analytics: ${GA_ID}` : ''}.`
                : GA_ID
                  ? `Идентификатор Google Analytics на сервисе: ${GA_ID}.`
                  : ''}{' '}
              Подробности об обработке данных описаны в{' '}
              <Link href="/ru/politika-konfidencialnosti">политике конфиденциальности</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
