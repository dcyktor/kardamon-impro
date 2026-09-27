# Kardamon – strona teatru impro

Statyczna strona w [Astro](https://astro.build). Wydarzenia to pliki Markdown, strona sama dzieli je na nadchodzące i minione.

## Co gdzie jest

| Plik / folder | Co edytujesz |
|---|---|
| `src/content/events/*.md` | Wydarzenia – jeden plik = jeden występ |
| `src/data/site.ts` | Nazwa, opisy, e-mail, link do biletów, skład, social media |
| `src/data/o-nas.md` | Tekst sekcji „O nas” (zwykły Markdown) |
| `src/styles/global.css` | Wygląd; kolory są na samej górze pliku |
| `public/` | Logo, favicon – wszystko stąd jest dostępne pod `/nazwa-pliku` |
| `src/assets/sklad/` | Zdjęcia składu (patrz niżej) |
| `src/assets/hero/` | Zdjęcia do karuzeli na górze strony (patrz niżej) |
| `src/components/Icon.astro` | Ikony social mediów (dopisz nową, jeśli dojdzie kolejny serwis) |
| `src/content.config.ts` | Schemat wydarzenia (jakie pola, co wymagane) |
| `src/pages/index.astro` | Szablon strony |

## Dodanie wydarzenia

Nowy plik w `src/content/events/`, np. `2026-11-20-harold.md` (nazwa pliku dowolna, data na początku ułatwia porządek):

```markdown
---
title: "Kurz, Konie i Złe Decyzje"
subtitle: "Improwizowany Western"   # opcjonalne – mniejszy napis pod tytułem
date: 2026-11-20
time: "19:30"               # w cudzysłowie!
venue: "Klub XYZ"
city: "Wrocław"             # opcjonalne, domyślnie Wrocław
description: "Krótki opis"  # opcjonalne
tickets: "https://..."      # opcjonalne – brak = ogólny link z site.ts
soldOut: false              # opcjonalne – true pokazuje „Wyprzedane”
free: false                 # opcjonalne – true pokazuje „Wstęp wolny”
---
```

Grafika wydarzenia (opcjonalna): wrzuć ją obok pliku `.md` pod tą samą nazwą, np. `2026-11-20-harold.jpg`. Na karcie pokazuje się jako kwadrat przycięty od środka, więc najlepiej od razu kwadratowa, min. 800×800 px.

Commit, push i po ~minucie zmiana jest na stronie. Da się to zrobić nawet z przeglądarki na GitHubie („Add file → Create new file”).

Jeśli pomylisz format albo zapomnisz wymaganego pola, build się zatrzyma i w zakładce **Actions** zobaczysz, który plik i które pole jest złe. Strona na produkcji zostaje wtedy bez zmian.

Wydarzenie jest „nadchodzące” do końca swojego dnia (czas polski). Minione trafiają automatycznie do zakładki „Zakończone”, od najnowszych.

## Uruchomienie lokalnie

Potrzebny Node.js 22.12 lub nowszy.

```bash
npm install
npm run dev      # http://localhost:4321, odświeża się na żywo przy każdej zmianie
npm run build    # wynik w dist/
```

## Publikacja na GitHub Pages (za darmo)

1. Utwórz repo na GitHubie i wypchnij ten projekt na gałąź `main`.
2. W repo: **Settings → Pages → Source: GitHub Actions**.
3. Gotowe – każdy push publikuje stronę. Dodatkowo workflow odpala się codziennie w nocy, żeby wczorajsze występy przeszły do archiwum.

### Własna domena

1. W `astro.config.mjs` ustaw `site` na domenę (teraz `https://kardamonimpro.pl`).
2. **Settings → Pages → Custom domain** i ustaw rekordy DNS u rejestratora według instrukcji GitHuba. Plik `CNAME` nie jest potrzebny: przy deployu przez GitHub Actions GitHub go ignoruje.

Bez własnej domeny strona będzie pod `https://<użytkownik>.github.io/<repo>/` i logo z faviconą się tam nie wyświetlą, bo ich ścieżki (`/logo.png`) prowadzą do głównego katalogu domeny.

### Uwaga o codziennym rebuildzie

GitHub wyłącza zaplanowane workflowy w repozytoriach bez aktywności przez 60 dni. Jeśli przez dwa miesiące nic nie commitujecie, wejdź w zakładkę Actions i włącz workflow ponownie (albo po prostu dodaj kolejne wydarzenie).

## Zmiana kolorów i zdjęć

Zdjęcia z występów do karuzeli na górze strony wrzuć do `src/assets/hero/` (poziome, najlepiej min. 1920 px szerokości). Pokazują się po kolei według nazw plików (`01-...jpg`, `02-...jpg`), zmieniają co 10 sekund i są przykryte matowym, zielonkawym „szkłem”, na którym leży logo i opis. Bez zdjęć w tym folderze góra strony ma zielone tło.

Obsługiwane formaty obrazków: JPG, PNG, WebP. HEIC (domyślny format z iPhone'a) nie jest obsługiwany – build wypisze ostrzeżenie `[obrazki]`. Na Macu konwersja: `sips -s format jpeg plik.HEIC --out plik.jpg`.

Kolory z designu są zmiennymi na górze `src/styles/global.css` (`--green`, `--green-dark`, `--mint`, `--paper` itd.).

Zdjęcia składu wrzuć do `src/assets/sklad/` i nazwij według imienia i nazwiska z `site.ts`: małe litery, bez polskich znaków, myślnik zamiast spacji, np. `rafal-kwasnik.jpg`. Zdjęcie przypisze się samo. Najlepiej kwadratowe 1:1, bo takie są kafelki; rozmiar nie ma znaczenia, bo Astro przy buildzie zmniejsza je i konwertuje do WebP. Jeśli nazwa pliku nie pasuje do nikogo, `npm run dev`/`npm run build` wypisze ostrzeżenie `[skład]`.
