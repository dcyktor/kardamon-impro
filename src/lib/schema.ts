// Dane strukturalne schema.org dla Google i asystentów AI: grupa oraz spektakle.
import { getImage } from 'astro:assets';
import { site } from '../data/site';
import { endIso, eventPath, startIso, type EventItem } from './events';

const absolute = (path: string, base: URL) => new URL(path, base).href;

const performer = (base: URL) => ({ '@type': 'PerformingGroup', name: site.name, url: absolute('/', base) });

export const groupSchema = (base: URL) => ({
  '@context': 'https://schema.org',
  ...performer(base),
  description: site.description,
  logo: absolute('/logo.png', base),
  email: site.email,
  sameAs: site.socials.map((s) => s.url),
});

export const eventSchema = async (e: EventItem, base: URL) => ({
  '@context': 'https://schema.org',
  '@type': 'TheaterEvent',
  name: `${site.name}: ${e.title}`,
  url: absolute(eventPath(e.id), base),
  ...((e.description ?? e.subtitle) && { description: e.description ?? e.subtitle }),
  startDate: startIso(e.date, e.time),
  endDate: endIso(e.date, e.time),
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: e.venue,
    address: { '@type': 'PostalAddress', ...(e.address && { streetAddress: e.address }), addressLocality: e.city, addressCountry: 'PL' },
  },
  ...(e.image && { image: [absolute((await getImage({ src: e.image, format: 'jpg' })).src, base)] }),
  performer: performer(base),
  organizer: performer(base),
  offers: {
    '@type': 'Offer',
    url: e.tickets ?? site.ticketsUrl,
    availability: `https://schema.org/${e.soldOut ? 'SoldOut' : 'InStock'}`,
    ...(e.free ? { price: 0, priceCurrency: 'PLN' } : e.price !== undefined && { price: e.price, priceCurrency: 'PLN' }),
  },
});
