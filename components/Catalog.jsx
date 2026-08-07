'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import OutLink from './OutLink';
import { price, plural, fmtPrice, fmtDateShort, budgetToRub } from '@/lib/format';
import { goal, GOALS } from '@/lib/metrika';
import { CAMPAIGN } from '@/lib/utm';
import { readParams, num, list, writeParams } from '@/lib/url-state';

const RAM_STEPS = [0, 1, 2, 4, 8, 16, 32];
const CPU_STEPS = [0, 1, 2, 4, 6, 8];

export default function Catalog({ rows, providers, geos, requirements, presetGeo = null, locale = 'ru' }) {
  const en = locale === 'en';
  const unitGb = en ? 'GB' : 'ГБ';
  const nm = (o) => (en ? o?.nameEn || o?.name : o?.name);
  const shortOf = (r) => (en ? r?.shortEn || r?.short : r?.short);
  const noteOf = (r) => (en ? r?.noteEn || r?.note : r?.note);
  const money = (rub) => fmtPrice(rub, locale);
  const detailHref = (slug) => (en ? `/en/providers/${slug}` : `/provajdery/${slug}`);
  const methodologyHref = en ? '/en/methodology' : '/metodologiya';
  const P = en ? { min: 5, max: 150, step: 5 } : { min: 200, max: 12000, step: 100 };

  const SORTS = [
    { code: 'price', label: en ? 'Cheapest' : 'Дешевле', fn: (a, b) => a.priceRub - b.priceRub },
    { code: 'ram', label: en ? 'More memory' : 'Больше памяти', fn: (a, b) => b.ram - a.ram || a.priceRub - b.priceRub },
    { code: 'cpu', label: en ? 'More cores' : 'Больше ядер', fn: (a, b) => b.cpu - a.cpu || a.priceRub - b.priceRub },
    { code: 'perGb', label: en ? 'Price per GB' : 'Цена за ГБ памяти', fn: (a, b) => a.priceRub / a.ram - b.priceRub / b.ram },
  ];

  const [geo, setGeo] = useState(presetGeo);
  const [minRam, setMinRam] = useState(0);
  const [minCpu, setMinCpu] = useState(0);
  const [maxPrice, setMaxPrice] = useState(P.max);
  const [reqs, setReqs] = useState([]);
  const [sort, setSort] = useState('price');

  const providerBySlug = useMemo(
    () => Object.fromEntries(providers.map((p) => [p.slug, p])),
    [providers]
  );

  const restored = useRef(false);

  useEffect(() => {
    const p = readParams();
    const g = p.get('geo');
    if (g && geos.some((x) => x.code === g)) setGeo(g);
    const r = num(p, 'ram', null);
    if (r !== null && RAM_STEPS.includes(r)) setMinRam(r);
    const c = num(p, 'cpu', null);
    if (c !== null && CPU_STEPS.includes(c)) setMinCpu(c);
    const pr = num(p, 'price', null);
    if (pr !== null && pr > 0 && pr <= P.max) setMaxPrice(pr);
    const rq = list(p, 'req');
    if (rq) setReqs(rq.filter((code) => requirements.some((x) => x.code === code)));
    const s = p.get('sort');
    if (s && SORTS.some((x) => x.code === s)) setSort(s);
    restored.current = true;
  }, [geos, requirements]);

  useEffect(() => {
    if (!restored.current) return;
    writeParams({
      geo: geo && geo !== presetGeo ? geo : null,
      ram: minRam || null,
      cpu: minCpu || null,
      price: maxPrice < P.max ? maxPrice : null,
      req: reqs.length ? reqs.join(',') : null,
      sort: sort !== 'price' ? sort : null,
    });
  }, [geo, minRam, minCpu, maxPrice, reqs, sort, presetGeo]);

  function touch(field, value) {
    goal(GOALS.catalogFilter, { field, value: String(value) });
  }

  function toggleReq(code) {
    setReqs((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
    touch('requirement', code);
  }

  const maxPriceRub = budgetToRub(maxPrice, locale);

  const filtered = useMemo(() => {
    const out = rows.filter((r) => {
      if (geo && r.geo !== geo) return false;
      if (r.ram < minRam) return false;
      if (r.cpu < minCpu) return false;
      if (maxPrice < P.max && r.priceRub > maxPriceRub) return false;
      for (const code of reqs) {
        if (code === 'nvme') {
          if (r.diskType !== 'NVMe') return false;
        } else if (!r.requirements.includes(code)) return false;
      }
      return true;
    });
    const s = SORTS.find((x) => x.code === sort) || SORTS[0];
    return [...out].sort(s.fn);
  }, [rows, geo, minRam, minCpu, maxPrice, reqs, sort]);

  function reset() {
    setGeo(presetGeo);
    setMinRam(0);
    setMinCpu(0);
    setMaxPrice(P.max);
    setReqs([]);
    setSort('price');
  }

  const blocker = useMemo(() => {
    if (filtered.length > 0) return null;
    const pass = (r, skip) => {
      if (skip !== 'geo' && geo && r.geo !== geo) return false;
      if (skip !== 'ram' && r.ram < minRam) return false;
      if (skip !== 'cpu' && r.cpu < minCpu) return false;
      if (skip !== 'price' && maxPrice < P.max && r.priceRub > maxPriceRub) return false;
      for (const code of reqs) {
        if (skip === `req:${code}`) continue;
        if (code === 'nvme') {
          if (r.diskType !== 'NVMe') return false;
        } else if (!r.requirements.includes(code)) return false;
      }
      return true;
    };
    const candidates = [];
    if (geo) candidates.push({ key: 'geo', label: (en ? 'location: ' : 'география: ') + (nm(geos.find((g) => g.code === geo)) || geo), clear: () => setGeo(null) });
    if (minRam > 0) candidates.push({ key: 'ram', label: en ? `memory from ${minRam} GB` : `память от ${minRam} ГБ`, clear: () => setMinRam(0) });
    if (minCpu > 0) candidates.push({ key: 'cpu', label: en ? `cores from ${minCpu}` : `ядер от ${minCpu}`, clear: () => setMinCpu(0) });
    if (maxPrice < P.max) candidates.push({ key: 'price', label: en ? `price up to $${maxPrice}` : `цена до ${maxPrice} ₽`, clear: () => setMaxPrice(P.max) });
    reqs.forEach((code) => {
      const name = shortOf(requirements.find((r) => r.code === code)) || code;
      candidates.push({ key: `req:${code}`, label: en ? `requirement “${name}”` : `требование «${name}»`, clear: () => toggleReq(code) });
    });
    const scored = candidates
      .map((c) => ({ ...c, gain: rows.filter((r) => pass(r, c.key)).length }))
      .filter((c) => c.gain > 0)
      .sort((a, b) => b.gain - a.gain);
    return scored[0] || null;
  }, [filtered.length, rows, geo, minRam, minCpu, maxPrice, reqs, geos, requirements]);

  return (
    <div>
      <div className="filters">
        <div className="field">
          <span className="label">{en ? 'Location' : 'География'}</span>
          <div className="chips">
            <button
              type="button"
              className={geo === null ? 'chip chip-light on' : 'chip chip-light'}
              aria-pressed={geo === null}
              onClick={() => { setGeo(null); touch('geo', 'all'); }}
            >
              {en ? 'All' : 'Все'}
            </button>
            {geos.map((g) => (
              <button
                key={g.code}
                type="button"
                className={geo === g.code ? 'chip chip-light on' : 'chip chip-light'}
                aria-pressed={geo === g.code}
                onClick={() => { setGeo(g.code); touch('geo', g.code); }}
              >
                {nm(g)}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="label">{en ? 'Requirements' : 'Требования'}</span>
          <div className="chips">
            {requirements.map((r) => (
              <button
                key={r.code}
                type="button"
                className={reqs.includes(r.code) ? 'chip chip-light on' : 'chip chip-light'}
                aria-pressed={reqs.includes(r.code)}
                onClick={() => toggleReq(r.code)}
                title={noteOf(r)}
              >
                {shortOf(r)}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-head">
            <span className="label">{en ? 'Min memory' : 'Минимум памяти'}</span>
            <span className="field-val" style={{ color: 'var(--brass-deep)' }}>
              {minRam === 0 ? (en ? 'any' : 'любая') : (en ? `${minRam}+ GB` : `от ${minRam} ГБ`)}
            </span>
          </div>
          <input
            className="range range-light"
            type="range"
            min={0}
            max={RAM_STEPS.length - 1}
            value={RAM_STEPS.indexOf(minRam)}
            onChange={(e) => setMinRam(RAM_STEPS[Number(e.target.value)])}
            onMouseUp={() => touch('ram', minRam)}
            aria-label={en ? 'Minimum memory' : 'Минимальный объём памяти'}
          />
          <div className="field-head" style={{ marginTop: 14, marginBottom: 0 }}>
            <span className="label">{en ? 'Min cores' : 'Минимум ядер'}</span>
            <span className="field-val" style={{ color: 'var(--brass-deep)' }}>
              {minCpu === 0 ? (en ? 'any' : 'любое') : (en ? `${minCpu}+` : `от ${minCpu}`)}
            </span>
          </div>
          <input
            className="range range-light"
            type="range"
            min={0}
            max={CPU_STEPS.length - 1}
            value={CPU_STEPS.indexOf(minCpu)}
            onChange={(e) => setMinCpu(CPU_STEPS[Number(e.target.value)])}
            onMouseUp={() => touch('cpu', minCpu)}
            aria-label={en ? 'Minimum cores' : 'Минимальное число ядер'}
          />
        </div>

        <div className="field">
          <div className="field-head">
            <span className="label">{en ? 'Price / month' : 'Цена в месяц'}</span>
            <span className="field-val" style={{ color: 'var(--brass-deep)' }}>
              {maxPrice >= P.max ? (en ? 'any' : 'любая') : (en ? `up to $${maxPrice}` : `до ${price(maxPrice)}`)}
            </span>
          </div>
          <input
            className="range range-light"
            type="range"
            min={P.min}
            max={P.max}
            step={P.step}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            onMouseUp={() => touch('price', maxPrice)}
            aria-label={en ? 'Maximum price' : 'Максимальная цена'}
          />
          <div className="range-scale" style={{ color: 'var(--text-faint)' }}>
            <span>{en ? `$${P.min}` : '200 ₽'}</span>
            <span>{en ? 'no limit' : 'без лимита'}</span>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={reset}>
            {en ? 'Reset filters' : 'Сбросить фильтры'}
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <span className="dim">
          {en
            ? `${filtered.length} of ${rows.length} plans`
            : `${filtered.length} ${plural(filtered.length, 'тариф', 'тарифа', 'тарифов')} из ${rows.length}`}
        </span>
        <div className="chips">
          <span className="label" style={{ margin: 0, alignSelf: 'center' }}>{en ? 'Sort' : 'Сортировка'}</span>
          {SORTS.map((s) => (
            <button
              key={s.code}
              type="button"
              className={sort === s.code ? 'chip chip-light on' : 'chip chip-light'}
              aria-pressed={sort === s.code}
              onClick={() => { setSort(s.code); touch('sort', s.code); }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tbl-wrap">
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>{en ? 'Provider' : 'Провайдер'}</th>
                <th>{en ? 'Plan' : 'Тариф'}</th>
                <th>CPU</th>
                <th>{en ? 'Memory' : 'Память'}</th>
                <th>{en ? 'Disk' : 'Диск'}</th>
                <th>{en ? 'Location' : 'Локация'}</th>
                <th>{en ? 'Per GB' : 'Цена за ГБ'}</th>
                <th>{en ? 'Verified' : 'Проверено'}</th>
                <th style={{ textAlign: 'right' }}>{en ? 'Price' : 'Цена'}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={detailHref(r.providerSlug)} style={{ textDecoration: 'none', fontWeight: 600 }}>
                      {r.providerName}
                    </Link>
                    {!r.partner && (
                      <div className="faint" style={{ fontSize: '0.72rem' }}>{en ? 'no affiliation' : 'без партнёрства'}</div>
                    )}
                  </td>
                  <td>{nm(r)}</td>
                  <td className="td-num">{r.cpu}</td>
                  <td className="td-num">{r.ram} {unitGb}</td>
                  <td className="td-num">
                    {r.disk} {unitGb} <span className="faint">{r.diskType}</span>
                  </td>
                  <td>{en ? (geos.find((g) => g.code === r.geo) ? nm(geos.find((g) => g.code === r.geo)) : r.geoNameEn) : r.geoName}</td>
                  <td className="td-num">{money(r.priceRub / r.ram)}</td>
                  <td className="td-num faint">{fmtDateShort(r.verifiedAt, locale)}</td>
                  <td className="td-price" style={{ textAlign: 'right' }}>{money(r.priceRub)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {providerBySlug[r.providerSlug] && (
                      <OutLink
                        provider={providerBySlug[r.providerSlug]}
                        campaign={CAMPAIGN.catalog}
                        content={r.id}
                        className="btn btn-ghost btn-sm"
                      >
                        {en ? 'Open' : 'Открыть'}
                      </OutLink>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="dim" style={{ padding: 28, textAlign: 'center' }}>
                    {blocker ? (
                      <>
                        {en
                          ? `Nothing in the base fits these filters: it is all cut off by ${blocker.label}. ${blocker.gain} ${blocker.gain === 1 ? 'plan appears' : 'plans appear'} if you remove that filter`
                          : `Под такие фильтры в базе ничего нет: всё отсекает ${blocker.label}. ${blocker.gain} ${plural(blocker.gain, 'тариф найдётся', 'тарифа найдётся', 'тарифов найдётся')}, если снять этот фильтр`}
                        <div className="row" style={{ justifyContent: 'center', marginTop: 14 }}>
                          <button type="button" className="btn btn-brass btn-sm" onClick={blocker.clear}>
                            {en ? 'Remove this filter' : 'Снять этот фильтр'}
                          </button>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
                            {en ? 'Reset all' : 'Сбросить все'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {en
                          ? 'Nothing in the base fits these filters, and removing one filter does not help'
                          : 'Под такие фильтры в базе ничего нет, и снятие одного фильтра не помогает'}
                        <div className="row" style={{ justifyContent: 'center', marginTop: 14 }}>
                          <button type="button" className="btn btn-brass btn-sm" onClick={reset}>
                            {en ? 'Reset all filters' : 'Сбросить все фильтры'}
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="disclosure mt">
        {en
          ? 'Some links are affiliate links: if you sign up we earn a commission at no extra cost to you. Row order is set by the chosen sort, there is no paid placement in the table, '
          : 'Часть переходов партнёрские: при оформлении услуги мы получаем вознаграждение, цена для вас не меняется. Порядок строк задаётся выбранной сортировкой, платных мест в таблице нет, '}
        <Link href={methodologyHref}>{en ? 'the matching formula is open' : 'формула подбора открыта'}</Link>
      </p>
    </div>
  );
}
