// Wydarzenia: wczytywanie, daty i adresy. Wspólne dla strony głównej, podstron wydarzeń i plików kalendarza.
// Wszystkie czasy liczone w strefie Europe/Warsaw, niezależnie od serwera, na którym idzie build.
import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { baseName, byName, warnUnmatched } from './images';

const TZ = 'Europe/Warsaw';

// "Dzisiaj" w Polsce jako RRRR-MM-DD.
export const todayInWarsaw = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());

// Wydarzenie jest "nadchodzące" do końca swojego dnia.
export const isUpcoming = (date: string) => date >= todayInWarsaw();

// Przesunięcie strefy w danym dniu, np. "+02:00" latem i "+01:00" zimą.
const offset = (date: string, time: string) => {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${date}T${time}:00Z`))
    .find((p) => p.type === 'timeZoneName')!.value; // "GMT+02:00"
  return name === 'GMT' ? '+00:00' : name.slice(3);
};

// Początek wydarzenia w ISO 8601 z przesunięciem strefy, np. 2026-10-19T19:00:00+02:00.
export const startIso = (date: string, time: string) => `${date}T${time}:00${offset(date, time)}`;

// Pliki wydarzeń nie mają godziny końca; spektakle trwają zwykle ok. 2 godzin (tyle podaje Evently).
export const DURATION_MS = 2 * 60 * 60 * 1000;

// Koniec wydarzenia (start + 2 h) w ISO 8601 z przesunięciem strefy; poprawnie przechodzi przez północ.
export const endIso = (date: string, time: string) => {
  const end = new Date(new Date(startIso(date, time)).getTime() + DURATION_MS);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(end).map((p) => [p.type, p.value]),
  );
  return startIso(`${parts.year}-${parts.month}-${parts.day}`, `${parts.hour}:${parts.minute}`);
};

export const eventPath = (id: string) => `/wydarzenia/${id}/`;
export const calendarPath = (id: string) => `/kalendarz/${id}.ics`;
export const mapsUrl = (venue: string, address: string, city: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${address}, ${city}`)}`;

// Daty po polsku. Data "RRRR-MM-DD" jako południe UTC, żeby strefa czasowa nie przesunęła dnia.
const asDate = (d: string) => new Date(`${d}T12:00:00Z`);
const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('pl-PL', { timeZone: 'UTC', ...o });
export const day = (d: string) => fmt({ day: '2-digit' }).format(asDate(d));
export const month = (d: string) => fmt({ month: 'short' }).format(asDate(d)).replace('.', '').toUpperCase();
export const longDate = (d: string) => fmt({ day: 'numeric', month: 'long', year: 'numeric' }).format(asDate(d));
export const weekday = (d: string) => fmt({ weekday: 'long' }).format(asDate(d));
export const shortDate = (d: string) => `${Number(d.slice(8, 10))}.${d.slice(5, 7)}`; // 19.10, 5.12

export type EventItem = CollectionEntry<'events'>['data'] & {
  id: string;
  image?: ImageMetadata;
  entry: CollectionEntry<'events'>;
};

// Wszystkie wydarzenia od najstarszego, z dopasowaną grafiką:
// plik obok .md o tej samej nazwie, np. 2026-10-19-western.md + 2026-10-19-western.jpg.
export const loadEvents = async (): Promise<EventItem[]> => {
  const images = byName(import.meta.glob<{ default: ImageMetadata }>(
    '../content/events/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true }));
  const entries = await getCollection('events');
  const fileName = (e: CollectionEntry<'events'>) => baseName(e.filePath ?? e.id);
  warnUnmatched('wydarzenia', images, entries.map(fileName));
  return entries
    .map((entry) => ({ ...entry.data, id: entry.id, image: images.get(fileName(entry)), entry }))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
};
