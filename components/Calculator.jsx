'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import OutLink from './OutLink';
import TaskIcon from './TaskIcon';
import { runMatch } from '@/lib/score';
import { price, plural, fmtPrice, fmtDate, budgetToRub } from '@/lib/format';
import { goal, GOALS } from '@/lib/metrika';
import { CAMPAIGN } from '@/lib/utm';
import { t } from '@/lib/i18n';
import { readParams, num, list, writeParams } from '@/lib/url-state';

const RAM_STEPS = [1, 2, 4, 8, 16, 32, 64];
const CPU_STEPS = [1, 2, 4, 6, 8, 12, 16];

function nearestIndex(steps, value) {
  let best = 0;
  for (let i = 0; i < steps.length; i += 1) {
    if (Math.abs(steps[i] - value) < Math.abs(steps[best] - value)) best = i;
  }
  return best;
}

export default function Calculator({ payload, presetTask = null, presetGeo = 'any', campaign = CAMPAIGN.calculator, compact = false, split = false, locale = 'ru' }) {
  const en = locale === 'en';
  const tt = t(locale).calc;
  const unitGb = en ? 'GB' : 'ГБ';
  const nm = (o) => (en ? o?.nameEn || o?.name : o?.name);
  const methodologyHref = en ? '/methodology' : '/ru/metodologiya';
  const BUDGET = en ? { min: 5, max: 125, step: 5, def: 25 } : { min: 200, max: 10000, step: 100, def: 2000 };

  const presetTaskObj = payload.tasks.find((t2) => t2.slug === presetTask) || null;

  const [task, setTask] = useState(presetTask);
  const [geo, setGeo] = useState(presetGeo);
  const [requirements, setRequirements] = useState([]);
  const [ram, setRam] = useState(presetTaskObj?.ram ?? 4);
  const [cpu, setCpu] = useState(presetTaskObj?.cpu ?? 2);
  const [budget, setBudget] = useState(BUDGET.def);
  const [showAll, setShowAll] = useState(false);
  const resourcesTouched = useRef(Boolean(presetTask));
  const started = useRef(false);
  const [copied, setCopied] = useState(false);
  const restored = useRef(false);

  // восстановление подбора из адреса страницы
  useEffect(() => {
    const p = readParams();
    if ([...p.keys()].some((k) => ['task', 'geo', 'ram', 'cpu', 'budget', 'req'].includes(k))) {
      const tv = p.get('task');
      if (tv && payload.tasks.some((x) => x.slug === tv)) setTask(tv);
      const g = p.get('geo');
      if (g && (g === 'any' || payload.geos.some((x) => x.slug === g))) setGeo(g);
      const r = num(p, 'ram', null);
      if (r && RAM_STEPS.includes(r)) { setRam(r); resourcesTouched.current = true; }
      const c = num(p, 'cpu', null);
      if (c && CPU_STEPS.includes(c)) { setCpu(c); resourcesTouched.current = true; }
      const b = num(p, 'budget', null);
      if (b && b >= BUDGET.min && b <= BUDGET.max) setBudget(b);
      const reqs = list(p, 'req');
      if (reqs) setRequirements(reqs.filter((code) => payload.requirements.some((x) => x.code === code)));
    }
    restored.current = true;
  }, [payload]);

  // запись текущего состояния в адрес: ссылку можно переслать
  useEffect(() => {
    if (!restored.current) return;
    writeParams({
      task: task || null,
      geo: geo && geo !== 'any' ? geo : null,
      ram: ram === 4 && !resourcesTouched.current ? null : ram,
      cpu: cpu === 2 && !resourcesTouched.current ? null : cpu,
      budget: budget === BUDGET.def ? null : budget,
      req: requirements.length ? requirements.join(',') : null,
    });
  }, [task, geo, ram, cpu, budget, requirements]);

  function copyLink() {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(done).catch(() => {});
    else done();
  }

  const track = useCallback((what, extra) => {
    if (!started.current) {
      started.current = true;
      goal(GOALS.calcStart);
    }
    goal(GOALS.calcResult, { field: what, ...extra });
  }, []);

  function chooseTask(slug) {
    const next = task === slug ? null : slug;
    setTask(next);
    const t2 = payload.tasks.find((x) => x.slug === next);
    if (t2 && !resourcesTouched.current) {
      setRam(t2.ram);
      setCpu(t2.cpu);
    }
    setShowAll(false);
    track('task', { task: next || 'none' });
  }

  function toggleRequirement(code) {
    setRequirements((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
    track('requirements', { req: code });
  }

  const query = useMemo(
    () => ({ task, geo, ram, cpu, budget: budget >= BUDGET.max ? null : budgetToRub(budget, locale), requirements }),
    [task, geo, ram, cpu, budget, requirements]
  );

  const results = useMemo(() => runMatch(payload, query, locale), [payload, query, locale]);
  const visible = showAll ? results : results.slice(0, 6);
  const taskObj = payload.tasks.find((t2) => t2.slug === task) || null;
  const budgetLabel = budget >= BUDGET.max
    ? tt.budgetNoLimit
    : en ? `up to $${budget} / month` : `до ${price(budget)} в месяц`;

  function reset() {
    setTask(null);
    setGeo('any');
    setRequirements([]);
    setRam(4);
    setCpu(2);
    setBudget(BUDGET.def);
    setShowAll(false);
    resourcesTouched.current = false;
  }

  return (
    <div id="podbor" className={split ? 'anchor calc-split' : 'anchor'}>
      <div className="calc">
        <div className="calc-head">
          <h2>{tt.title}</h2>
          <span className="faint">
            {en
              ? `${payload.stats.plans} plans with a verified price, data checked ${fmtDate(payload.stats.verifiedAt, locale)}`
              : `${payload.stats.plans} ${plural(payload.stats.plans, 'тариф', 'тарифа', 'тарифов')} с проверенной ценой, база проверена ${fmtDate(payload.stats.verifiedAt, locale)}`}
          </span>
        </div>

        <div className="field">
          <div className="field-head">
            <span className="label">01 · {tt.task}</span>
            {taskObj && <span className="field-val">{tt.recommend(taskObj.cpu, taskObj.ram)}</span>}
          </div>
          <div className="chips">
            {payload.tasks.map((t2) => (
              <button
                key={t2.slug}
                type="button"
                className={task === t2.slug ? 'chip on' : 'chip'}
                aria-pressed={task === t2.slug}
                onClick={() => chooseTask(t2.slug)}
              >
                <TaskIcon slug={t2.slug} />
                {nm(t2)}
              </button>
            ))}
          </div>
          {taskObj && <p className="faint" style={{ marginTop: 10 }}>{en ? taskObj.intentEn || taskObj.intent : taskObj.intent}</p>}
        </div>

        <div className="calc-cols">
          <div className="field span-2">
            <div className="field-head">
              <span className="label">02 · {tt.geo}</span>
            </div>
            {split ? (
              <div className="chips">
                <button
                  type="button"
                  className={geo === 'any' ? 'chip on' : 'chip'}
                  aria-pressed={geo === 'any'}
                  onClick={() => { setGeo('any'); track('geo', { geo: 'any' }); }}
                >
                  {tt.geoAny}
                </button>
                {payload.geos.map((g) => (
                  <button
                    key={g.slug}
                    type="button"
                    className={geo === g.slug ? 'chip on' : 'chip'}
                    aria-pressed={geo === g.slug}
                    onClick={() => { setGeo(g.slug); track('geo', { geo: g.slug }); }}
                  >
                    {nm(g)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="seg">
                <button type="button" className={geo === 'any' ? 'on' : ''} onClick={() => { setGeo('any'); track('geo', { geo: 'any' }); }}>
                  {tt.geoAny}
                </button>
                {payload.geos.map((g) => (
                  <button
                    key={g.slug}
                    type="button"
                    className={geo === g.slug ? 'on' : ''}
                    onClick={() => { setGeo(g.slug); track('geo', { geo: g.slug }); }}
                  >
                    {nm(g)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="field">
            <div className="field-head">
              <span className="label">03 · {tt.ram}</span>
              <span className="field-val">{ram} {unitGb}</span>
            </div>
            <input
              className="range"
              type="range"
              min={0}
              max={RAM_STEPS.length - 1}
              step={1}
              value={nearestIndex(RAM_STEPS, ram)}
              onChange={(e) => { resourcesTouched.current = true; setRam(RAM_STEPS[Number(e.target.value)]); }}
              onMouseUp={() => track('ram', { ram })}
              onTouchEnd={() => track('ram', { ram })}
              aria-label={tt.ram}
            />
            <div className="range-scale">
              <span>{tt.ramScaleMin}</span>
              <span>{tt.ramScaleMax}</span>
            </div>
          </div>

          <div className="field">
            <div className="field-head">
              <span className="label">04 · {tt.cpu}</span>
              <span className="field-val">{cpu} {en ? (cpu === 1 ? 'core' : 'cores') : plural(cpu, 'ядро', 'ядра', 'ядер')}</span>
            </div>
            <input
              className="range"
              type="range"
              min={0}
              max={CPU_STEPS.length - 1}
              step={1}
              value={nearestIndex(CPU_STEPS, cpu)}
              onChange={(e) => { resourcesTouched.current = true; setCpu(CPU_STEPS[Number(e.target.value)]); }}
              onMouseUp={() => track('cpu', { cpu })}
              onTouchEnd={() => track('cpu', { cpu })}
              aria-label={tt.cpu}
            />
            <div className="range-scale">
              <span>1</span>
              <span>16</span>
            </div>
          </div>

          <div className="field">
            <div className="field-head">
              <span className="label">05 · {tt.budget}</span>
              <span className="field-val">{budgetLabel}</span>
            </div>
            <input
              className="range"
              type="range"
              min={BUDGET.min}
              max={BUDGET.max}
              step={BUDGET.step}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              onMouseUp={() => track('budget', { budget })}
              onTouchEnd={() => track('budget', { budget })}
              aria-label={tt.budget}
            />
            <div className="range-scale">
              <span>{en ? `$${BUDGET.min}` : '200 ₽'}</span>
              <span>{tt.budgetScaleMax}</span>
            </div>
          </div>

          <div className="field">
            <div className="field-head">
              <span className="label">06 · {tt.requirements}</span>
              {requirements.length > 0 && <span className="field-val">{tt.chosen(requirements.length)}</span>}
            </div>
            <div className="chips">
              {payload.requirements.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  className={requirements.includes(r.code) ? 'chip on' : 'chip'}
                  aria-pressed={requirements.includes(r.code)}
                  onClick={() => toggleRequirement(r.code)}
                  title={en ? r.noteEn || r.note : r.note}
                >
                  {nm(r)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="calc-foot">
          <span className="faint">
            {tt.commissionNote}{' '}
            <Link href={methodologyHref} className="link-brass">{tt.howScore}</Link>
          </span>
          <div className="row">
            <button type="button" className="btn btn-ghost btn-sm" onClick={copyLink}>
              {copied ? tt.copied : tt.copyLink}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
              {tt.reset}
            </button>
          </div>
        </div>
      </div>

      <div className="results">
        <div className="results-head">
          <span className="label" style={{ margin: 0 }}>
            {tt.resultTitle}
          </span>
          <span className="faint">
            {en
              ? `${results.length} matching plan${results.length === 1 ? '' : 's'}`
              : `${results.length} ${plural(results.length, 'подходящий тариф', 'подходящих тарифа', 'подходящих тарифов')}`}
          </span>
        </div>

        {visible.length === 0 && (
          <p className="dim">{tt.empty}</p>
        )}

        {visible.map((r, i) => (
          <article className={split && i === 0 ? 'rescard rescard-top' : 'rescard'} key={r.provider.slug}>
            <div className="res-rank">{String(i + 1).padStart(2, '0')}</div>
            <div className="res-body">
              <div>
                <div className="res-title">
                  <strong>{r.provider.name}</strong>
                  {!r.provider.partner && <span className="badge badge-plain">{tt.noPartner}</span>}
                  {r.provider.country === 'RU' && <span className="badge">{tt.ruBadge}</span>}
                </div>
                <div className="res-plan">
                  {nm(r.plan)} · {r.plan.cpu} × {r.plan.ram} {unitGb} · {r.plan.disk} {unitGb} {r.plan.diskType}
                  {' · '}
                  {nm(payload.geos.find((g) => g.code === r.plan.geo)) || r.plan.geo}
                </div>
                <div className="reasons">
                  {r.reasons.map((reason) => (
                    <span key={reason.code} className={reason.ok ? 'reason reason-ok' : 'reason reason-no'}>
                      {reason.ok ? '✓' : '✕'} {reason.text}
                    </span>
                  ))}
                </div>
              </div>

              <div className="res-side">
                <div className="res-score">
                  <span className="res-score-v">{r.score}</span>
                  <span className="res-bar">
                    <i style={{ width: `${r.score}%` }} />
                  </span>
                </div>
                <div className="res-price">{fmtPrice(r.plan.priceRub, locale)}<span className="faint"> {tt.perMonth}</span></div>
                <OutLink provider={r.provider} campaign={campaign} className="btn btn-brass btn-sm btn-block">
                  {r.provider.partner ? tt.go : tt.toSite}
                </OutLink>
              </div>
            </div>
          </article>
        ))}

        {results.length > visible.length && (
          <button type="button" className="btn btn-ghost btn-sm mt" onClick={() => setShowAll(true)}>
            {tt.showRest(results.length - visible.length)}
          </button>
        )}

        {!compact && (
          <p className="disclosure" style={{ marginTop: 18 }}>
            {tt.disclosure}{' '}
            <Link href={methodologyHref}>{tt.formulaOpen}</Link>
          </p>
        )}
      </div>
    </div>
  );
}
