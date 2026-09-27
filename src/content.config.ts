import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Schemat wydarzenia – jak DTO z walidacją.
// Jeśli w pliku .md zabraknie pola albo będzie w złym formacie, build się zatrzyma z czytelnym błędem.
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(), // np. "Improwizowany Western", pod tytułem mniejszą czcionką
    // "2026-10-09" (w cudzysłowie lub bez) -> zawsze string RRRR-MM-DD
    date: z.coerce.date().transform((d) => d.toISOString().slice(0, 10)),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Godzina w formacie "GG:MM", w cudzysłowie, np. "19:30"'),
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
