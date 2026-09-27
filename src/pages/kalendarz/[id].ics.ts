// "Dodaj do kalendarza": plik .ics dla każdego nadchodzącego wydarzenia, pod /kalendarz/<nazwa-pliku>.ics.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../../data/site';
import { DURATION_MS, eventPath, isUpcoming, startIso } from '../../lib/events';

export const getStaticPaths = (async () => {
  const events = await getCollection('events', (e) => isUpcoming(e.data.date));
  return events.map((event) => ({ params: { id: event.id }, props: { event } }));
}) satisfies GetStaticPaths;

// W tekstach iCalendar przecinek, średnik, backslash i nowa linia muszą być poprzedzone "\".
const escape = (text: string) => text.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

// Czas UTC w formacie iCalendar, np. 20261019T170000Z.
const utc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

// Linie dłuższe niż 75 bajtów trzeba łamać (kontynuacja zaczyna się od spacji).
// Liczymy bajty UTF-8, bo polskie litery zajmują po 2.
const fold = (line: string) => {
  const encoder = new TextEncoder();
  let out = '';
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    if (bytes + size > 74) {
      out += '\r\n ';
      bytes = 1;
    }
    out += ch;
    bytes += size;
  }
  return out;
};

export const GET: APIRoute = ({ props, site: siteUrl }) => {
  const { id, data: e } = (props as { event: CollectionEntry<'events'> }).event;
  const start = new Date(startIso(e.date, e.time));
  const tickets = e.tickets ?? site.ticketsUrl;
  const page = siteUrl ? new URL(eventPath(id), siteUrl).href : undefined;
  const description = [e.subtitle, e.description, e.free ? 'Wstęp wolny' : `Bilety: ${tickets}`, page && `Więcej: ${page}`]
    .filter(Boolean).join('\n');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${site.name}//Strona//PL`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${id}@${siteUrl?.hostname ?? 'kardamonimpro.pl'}`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(start)}`,
    `DTEND:${utc(new Date(start.getTime() + DURATION_MS))}`,
    `SUMMARY:${escape(`${site.name}: ${e.title}`)}`,
    `LOCATION:${escape([e.venue, e.address, e.city].filter(Boolean).join(', '))}`,
    `DESCRIPTION:${escape(description)}`,
    `URL:${tickets}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return new Response(`${lines.map(fold).join('\r\n')}\r\n`, {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
