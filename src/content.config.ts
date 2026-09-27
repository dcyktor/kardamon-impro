import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Data po polsku ("20.11.2026", też "5.1.2027") albo po staremu "2026-11-20"; zawsze zamieniana na RRRR-MM-DD.
// Nieistniejący dzień (np. 31.02) zatrzymuje build, zamiast po cichu przeskoczyć na następny miesiąc.
const eventDate = z.union([z.string(), z.date()]).transform((value, ctx) => {
  let parts: number[];
  if (value instanceof Date) {
    // YAML sam zamienia niecytowane "2026-11-20" na datę
    parts = [value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate()];
  } else {
    const polish = value.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    const iso = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!polish && !iso) {
      ctx.addIssue({ code: 'custom', message: `Data "${value}" – wpisz ją jako DD.MM.RRRR, np. 20.11.2026` });
      return z.NEVER;
    }
    parts = polish ? [+polish[3], +polish[2], +polish[1]] : [+iso![1], +iso![2], +iso![3]];
  }
  const [year, month, day] = parts;
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    ctx.addIssue({ code: 'custom', message: `Nie ma takiego dnia: ${day}.${month}.${year}` });
    return z.NEVER;
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
});

// Godzina po polsku: 19:00, 19.00, 9:30 – z cudzysłowem albo bez; zawsze zamieniana na GG:MM.
// Bez cudzysłowu YAML czyta "19.30" jako liczbę 19.3, dlatego minuty odtwarzamy z części ułamkowej.
const eventTime = z.union([z.string(), z.number()]).transform((value, ctx) => {
  let hour: number;
  let minute: number;
  if (typeof value === 'number') {
    hour = Math.trunc(value);
    minute = Math.round((value - hour) * 100);
  } else {
    const match = value.trim().match(/^(\d{1,2})[:.](\d{2})$/);
    if (!match) {
      ctx.addIssue({ code: 'custom', message: `Godzina "${value}" – wpisz ją jako GG:MM, np. 19:00` });
      return z.NEVER;
    }
    hour = +match[1];
    minute = +match[2];
  }
  if (hour > 23 || minute > 59) {
    ctx.addIssue({ code: 'custom', message: `Nie ma takiej godziny: ${value}` });
    return z.NEVER;
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
});

// Schemat wydarzenia – jak DTO z walidacją.
// Jeśli w pliku .md zabraknie pola albo będzie w złym formacie, build się zatrzyma z czytelnym błędem.
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(), // np. "Improwizowany Western", pod tytułem mniejszą czcionką
    date: eventDate,
    time: eventTime,
    venue: z.string(),
    address: z.string().optional(), // ulica i numer, np. "Łaciarska 4" – link do mapy i dane dla Google
    city: z.string().default('Wrocław'),
    description: z.string().optional(),
    tickets: z.url().optional(), // brak = ogólny link z site.ts
    soldOut: z.boolean().default(false),
    free: z.boolean().default(false),
  }),
});

export const collections = { events };
