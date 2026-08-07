'use client';

import { useState } from 'react';
import { goal, GOALS } from '@/lib/metrika';

/**
 * Промокод с кнопкой копирования. Копирование считается целью Метрики:
 * это тот же уровень намерения, что клик по партнёрской ссылке
 */
export default function PromoCode({ code, provider, locale = 'ru' }) {
  const [copied, setCopied] = useState(false);
  const en = locale === 'en';

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // без clipboard API код всё равно виден и выделяется, просто без кнопки
    }
    setCopied(true);
    goal(GOALS.promoCopy, { provider, code });
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" className="promo-code" onClick={copy} title={en ? 'Copy promo code' : 'Скопировать промокод'}>
      <span className="mono">{code}</span>
      <span className="promo-code-hint">{copied ? (en ? 'copied' : 'скопирован') : (en ? 'copy' : 'копировать')}</span>
    </button>
  );
}
