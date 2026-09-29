// Podstawowe dane strony. Tekst "O nas" jest w pliku o-nas.md obok.
export const site = {
  name: 'Kardamon',
  kicker: 'Teatr improwizacji z Wrocławia', // pod logo, część nagłówka H1 – miasto widać od razu (SEO)
  // Tytuł strony głównej w karcie przeglądarki i w wynikach Google
  title: 'Kardamon – teatr improwizacji we Wrocławiu · spektakle impro',
  tagline: 'Komedia, która powstaje na Waszych oczach.',
  // Opis strony w wynikach Google (meta description), osobny od krótkiego hasła
  description: 'Kardamon – teatr improwizacji z Wrocławia. Komediowe spektakle bez scenariusza, tworzone z sugestii publiczności.',
  footerText: 'Teatr improwizacji z Wrocławia',
  email: 'kardamon.impro@gmail.com',
  ticketsUrl: 'https://app.evently.pl/organizers/25295-kardamon-impro', // ogólny link do biletów

  // Zdjęcia dobierają się same po nazwie pliku w src/assets/sklad/:
  // imię-nazwisko małymi literami, bez polskich znaków, np. 'Rafał Kwaśnik' -> rafal-kwasnik.jpg.
  // Najlepiej kwadratowe 1:1 (kafelki są kwadratowe). Brak pliku = placeholder.
  team: [
    { name: 'Daniel Cyktor' },
    { name: 'Patryk Wawok' },
    { name: 'Maciej Olszowy' },
    { name: 'Rafał Kwaśnik' },
    { name: 'Patryk Kudyk' },
  ],

  // icon: instagram | facebook | tiktok | youtube (ikony w src/components/Icon.astro)
  socials: [
    { icon: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/kardamon.impro' },
    { icon: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/kardamon.impro' },
    { icon: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@kardamon.impro' },
    { icon: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@kardamonimpro' },
  ],
} as const;
