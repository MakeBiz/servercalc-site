import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

/**
 * Раздел публикаций. Никакой админки: чтобы выпустить материал,
 * достаточно положить файл в content/news с фронтматтером
 *
 * ---
 * title: Заголовок
 * date: 2026-08-02
 * rubric: novosti | obzory | ceny
 * description: Одно предложение для выдачи и для превью
 * author: Редакция ServerCalc
 * ---
 */

export const RUBRICS = [
  { slug: 'novosti', name: 'Новости', nameEn: 'News', note: 'Что происходит на рынке и у провайдеров', noteEn: 'What is happening in the market and at the providers' },
  { slug: 'obzory', name: 'Разборы', nameEn: 'Reviews', note: 'Как выбирать и на что смотреть', noteEn: 'How to choose and what to look at' },
  { slug: 'ceny', name: 'Изменения цен', nameEn: 'Price changes', note: 'Что подорожало и подешевело в базе', noteEn: 'What went up and down in the base' },
];

const DIR_RU = path.join(process.cwd(), 'content', 'news');
const DIR_EN = path.join(process.cwd(), 'content', 'news-en');
const dirFor = (locale) => (locale === 'en' ? DIR_EN : DIR_RU);

marked.setOptions({ mangle: false, headerIds: false });

/**
 * Дата из фронтматтера. YAML разбирает 2026-08-05 в объект Date, и наивное
 * приведение к строке даёт «Wed Aug 05», из которого потом получается 2001 год.
 * Поэтому объект Date приводим к ISO явно
 */
function toIso(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function readAll(locale = 'ru') {
  const DIR = dirFor(locale);
  const authorDefault = locale === 'en' ? 'ServerCalc Editorial' : 'Редакция ServerCalc';
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    // README и файлы с подчёркиванием в начале имени публикацией не считаются:
    // так в папке можно держать инструкцию и черновики
    .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md')
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
      let data = {};
      let content = raw;
      try {
        const parsed = matter(raw);
        data = parsed.data;
        content = parsed.content;
      } catch (e) {
        // Сломанный фронтматтер не должен ронять сборку всего сайта.
        // Чаще всего причина в двоеточии внутри заголовка: его надо взять в кавычки
        console.warn(`[news] не удалось разобрать фронтматтер в ${file}: ${e.message}`);
        return null;
      }
      const words = content.split(/\s+/).filter(Boolean).length;
      return {
        slug: file.replace(/\.md$/, ''),
        title: data.title || file,
        date: toIso(data.date),
        updated: data.updated ? toIso(data.updated) : null,
        rubric: data.rubric || 'novosti',
        // Материал может быть привязан к провайдеру из каталога: тогда внизу
        // появляется кнопка перехода на его сайт. Поле необязательное,
        // у обзорных материалов провайдера нет
        provider: data.provider || null,
        // Материал может относиться к одной или нескольким задачам из каталога:
        // тогда он появляется на соответствующей странице /vps-dlya/<задача>.
        // Это лечит статьи, на которые больше ниоткуда не ведут ссылки
        tasks: Array.isArray(data.tasks) ? data.tasks : [],
        description: data.description || '',
        author: data.author || authorDefault,
        minutes: Math.max(1, Math.round(words / 160)),
        body: content,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function allPosts(locale = 'ru') {
  return readAll(locale);
}

export function postsByRubric(rubric, locale = 'ru') {
  return readAll(locale).filter((p) => p.rubric === rubric);
}

/** Материалы, привязанные к задаче из каталога */
export function postsForTask(slug, locale = 'ru') {
  return readAll(locale).filter((p) => (p.tasks || []).includes(slug));
}

/**
 * Внешние ссылки в тексте материала: открываем в новой вкладке и закрываем
 * от передачи веса. Источники мы указываем честно, но среди них попадаются
 * конкурирующие каталоги, и отдавать им ссылочный вес незачем.
 * Внутренние ссылки трогать нельзя: они должны открываться в той же вкладке
 */
function markExternalLinks(html) {
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g, (m, href) =>
    href.includes('servercalc.online')
      ? m
      : `<a href="${href}" target="_blank" rel="nofollow noopener"`
  );
}

export function getPost(slug, locale = 'ru') {
  const post = readAll(locale).find((p) => p.slug === slug);
  if (!post) return null;
  return { ...post, html: markExternalLinks(marked.parse(post.body)) };
}

export function rubricName(slug, locale = 'ru') {
  const r = RUBRICS.find((x) => x.slug === slug);
  if (!r) return locale === 'en' ? 'Articles' : 'Материалы';
  return locale === 'en' ? r.nameEn : r.name;
}
