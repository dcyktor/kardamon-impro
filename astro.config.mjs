import { defineConfig } from 'astro/config';

export default defineConfig({
  // Docelowa domena (ważne dla linków i SEO)
  site: 'https://kardamonimpro.pl',
  build: {
    // Cały CSS trafia do index.html – jeden plik, zero dodatkowych zapytań
    inlineStylesheets: 'always',
  },
});
