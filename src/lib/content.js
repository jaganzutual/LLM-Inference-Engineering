import GithubSlugger from 'github-slugger';
import { pad } from './utils.js';

/**
 * Markdown lessons are optional. A file at src/content/049.md is picked up
 * automatically as the notes for topic 49. The README in that folder is
 * ignored by the filename filter.
 */
const contentModules = import.meta.glob('../content/[0-9][0-9][0-9].md', {
  query: '?raw',
  import: 'default',
});

const contentEntries = new Map();

for (const [path, load] of Object.entries(contentModules)) {
  const match = /\/(\d{3})\.md$/.exec(path);
  if (match) contentEntries.set(Number(match[1]), load);
}

export const notesCount = contentEntries.size;

export function hasNotes(topicNumber) {
  return contentEntries.has(Number(topicNumber));
}

export async function loadNotes(topicNumber) {
  const load = contentEntries.get(Number(topicNumber));
  if (!load) return null;
  const markdown = await load();
  return typeof markdown === 'string' ? markdown : null;
}

export function estimateReadTime(markdown) {
  if (!markdown) return null;

  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~|[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / 220));
}

export function extractHeadings(markdown) {
  if (!markdown) return [];

  const slugger = new GithubSlugger();
  const headings = [];
  let inFence = false;

  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,4})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length;
    const text = match[2].replace(/[*_`~[\]]/g, '').trim();
    const id = slugger.slug(text);

    if (depth === 2 || depth === 3) {
      headings.push({ depth, text, id });
    }
  }

  return headings;
}

export function contentFileName(topicNumber) {
  return `${pad(topicNumber)}.md`;
}
