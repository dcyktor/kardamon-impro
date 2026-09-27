// Obrazki do podglądu linków (Messenger, Facebook, WhatsApp): 1200×630 JPEG pod /og/<nazwa>.jpg.
// "strona": pierwsze zdjęcie z karuzeli pod zielonym szkłem z logo-napisem, jak w hero.
// Wydarzenie: jego grafika na środku, na rozmytym tle z niej samej (bez grafiki: obrazek strony).
import type { APIRoute, GetStaticPaths } from 'astro';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import sharp from 'sharp';
import { loadEvents } from '../../lib/events';
import { baseName } from '../../lib/images';

const WIDTH = 1200;
const HEIGHT = 630;
const IMAGE = /\.(jpe?g|png|webp)$/i;

const firstImage = (dir: string, name?: string) => {
  if (!existsSync(dir)) return undefined;
  const file = readdirSync(dir).filter((f) => IMAGE.test(f) && (!name || baseName(f) === name)).sort()[0];
  return file && `${dir}/${file}`;
};

export const getStaticPaths = (async () => {
  const events = await loadEvents();
  return [
    { params: { name: 'strona' }, props: { photo: undefined } },
    ...events.map((e) => ({ params: { name: e.id }, props: { photo: firstImage('src/content/events', e.id) } })),
  ];
}) satisfies GetStaticPaths;

const sitePreview = async () => {
  const logo = await sharp(readFileSync('public/logo-napis.svg'), { density: 300 }).resize({ width: 560 }).png().toBuffer();
  const glass = await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: { r: 128, g: 175, b: 136, alpha: 0.72 } } })
    .png().toBuffer();
  const photo = firstImage('src/assets/hero');
  const base = photo
    ? sharp(photo).rotate().resize(WIDTH, HEIGHT, { fit: 'cover', position: 'north' }).blur(6)
    : sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#80AF88' } });
  return base.composite([{ input: glass }, { input: logo, gravity: 'centre' }]).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
};

const eventPreview = async (file: string) => {
  const size = HEIGHT - 70;
  const corners = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="28" ry="28"/></svg>`);
  const background = await sharp(file).resize(WIDTH, HEIGHT, { fit: 'cover' }).blur(28).modulate({ brightness: 0.85 }).toBuffer();
  const poster = await sharp(file).resize(size, size, { fit: 'cover' }).composite([{ input: corners, blend: 'dest-in' }]).png().toBuffer();
  return sharp(background).composite([{ input: poster, gravity: 'centre' }]).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
};

export const GET: APIRoute = async ({ props }) => {
  const { photo } = props as { photo?: string };
  const image = photo ? await eventPreview(photo) : await sitePreview();
  return new Response(new Uint8Array(image), { headers: { 'Content-Type': 'image/jpeg' } });
};
