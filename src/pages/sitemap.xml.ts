// Mapa strony dla wyszukiwarek: strona główna i podstrony wszystkich wydarzeń.
import type { APIRoute } from 'astro';
import { eventPath, loadEvents } from '../lib/events';

export const GET: APIRoute = async ({ site }) => {
  const paths = ['/', ...(await loadEvents()).map((e) => eventPath(e.id))];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
