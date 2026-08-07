import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
  // Канонический адрес наследуется из корневого layout, но ошибочная страница
  // не должна объявлять главную своим эквивалентом: null убирает наследование
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <section className="hero ink" style={{ paddingBottom: 96 }}>
      <div className="wrap hero-in">
        <div className="eyebrow">
          <span className="label label-brass">404</span>
        </div>
        <h1 className="display" style={{ maxWidth: 720 }}>
          No such page
        </h1>
        <p className="lead">
          The address may be mistyped or the page may have moved. From here you can go back to the
          matching tool or open the plan catalog
        </p>
        <div className="row mt">
          <Link href="/" className="btn btn-brass">
            Home
          </Link>
          <Link href="/catalog" className="btn btn-ghost">
            Plan catalog
          </Link>
          <Link href="/providers" className="btn btn-ghost">
            Providers
          </Link>
        </div>
      </div>
    </section>
  );
}
