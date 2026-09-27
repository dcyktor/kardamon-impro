// Obrazki dopasowywane po nazwie pliku (bez rozszerzenia, małymi literami).
// Astro przy buildzie zmniejsza je i konwertuje do WebP.
import type { ImageMetadata } from 'astro';
import { existsSync, readdirSync } from 'node:fs';

export type ImageFiles = Record<string, { default: ImageMetadata }>;

export const baseName = (path: string) => path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase();

export const byName = (files: ImageFiles) =>
  new Map(Object.entries(files).map(([path, m]) => [baseName(path), m.default]));

// Każde ostrzeżenie tylko raz na build, choć kilka stron korzysta z tych samych obrazków.
const warned = new Set<string>();
const warnOnce = (message: string) => {
  if (!warned.has(message)) {
    warned.add(message);
    console.warn(message);
  }
};

export const warnUnmatched = (label: string, images: Map<string, ImageMetadata>, expected: string[]) => {
  for (const name of images.keys()) {
    if (!expected.includes(name)) {
      warnOnce(`[${label}] ${name} nie pasuje do niczego (oczekiwane nazwy: ${expected.join(', ')})`);
    }
  }
};

// HEIC (domyślny format zdjęć z iPhone'a) nie przechodzi przez optymalizację obrazków: ostrzeż, zamiast cicho pominąć.
export const warnHeic = () => {
  for (const dir of ['src/assets/hero', 'src/assets/sklad', 'src/content/events']) {
    const heic = existsSync(dir) ? readdirSync(dir).filter((f) => /\.hei[cf]$/i.test(f)) : [];
    if (heic.length > 0) warnOnce(`[obrazki] ${dir}: ${heic.join(', ')} – format HEIC nie jest obsługiwany, zapisz jako JPG`);
  }
};
