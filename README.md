# Kardamon – strona teatru impro

Statyczna strona w [Astro](https://astro.build). Wydarzenia to pliki Markdown, strona sama dzieli je na nadchodzące i minione.

## Jak dodać wydarzenie (instrukcja dla składu)

Wszystko robisz w przeglądarce na GitHubie, nic nie trzeba instalować. Potrzebujesz konta na GitHubie z dostępem do tego repo – poproś Daniela, żeby Cię dodał. Całość zajmuje ok. 5–10 minut.

### 1. Przygotuj dwie rzeczy

- **Wydarzenie na Evently** – żeby mieć link do biletów.
- **Grafikę** – najlepiej kwadratową, co najmniej 800×800 px, w formacie JPG, PNG albo WebP. HEIC (domyślny format zdjęć z iPhone'a) nie zadziała.

### 2. Wymyśl nazwę pliku

Data spektaklu zapisana od roku + krótka nazwa, małymi literami, bez polskich znaków i spacji, np. `2026-11-20-harold`. Rok na początku sprawia, że pliki w folderze układają się po kolei. Z tej nazwy powstanie adres podstrony: `kardamonimpro.pl/wydarzenia/2026-11-20-harold/`.

### 3. Dodaj plik z wydarzeniem

1. Na GitHubie wejdź w repo → folder `src/content/events`.
2. **Add file → Create new file**, jako nazwę wpisz `2026-11-20-harold.md`.
3. Wklej szablon i uzupełnij:

```markdown
---
title: "Harold"
subtitle: "Długa forma improwizowana"
date: 20.11.2026
time: 19:00
venue: "Sztuka na Miejscu"
address: "Łaciarska 4"
description: "Jedno krótkie zdanie, które pokaże się na karcie na stronie głównej."
tickets: "https://app.evently.pl/events/..."
price: 35
---

Tu wklej pełny opis spektaklu, np. z Evently.
Złamania linii zostają tak, jak je wpiszesz,
a pusta linia zaczyna nowy akapit.
```

Teksty (tytuł, miejsce, opis, link) zostaw w cudzysłowach – dzięki temu nie przeszkadzają w nich dwukropki i inne znaki. Datę i godzinę możesz wpisać bez cudzysłowu.

4. **Commit changes** (zielony przycisk).

Co oznaczają pola:

| Pole | Wymagane? | Uwagi |
|---|---|---|
| `title` | tak | tytuł spektaklu |
| `subtitle` | nie | mniejszy napis pod tytułem, np. „Improwizowany Western”; trafia też na główny przycisk na górze strony |
| `date` | tak | po polsku: dzień.miesiąc.rok, np. `20.11.2026` |
| `time` | tak | po polsku, np. `19:00`, `19.30` albo `9:30`; cudzysłów niepotrzebny |
| `venue` | tak | nazwa miejsca |
| `address` | nie | ulica i numer; bez niego nie będzie linku do mapy |
| `city` | nie | domyślnie Wrocław |
| `description` | nie | jedno zdanie na kartę na stronie głównej |
| `tickets` | nie | link do biletów na to wydarzenie; bez niego przyciski prowadzą na ogólną stronę na Evently |
| `price` | nie | cena biletu w zł, np. `35` albo `35,50`; na stronie jej nie widać, ale Google pokazuje ją przy wydarzeniu w wynikach wyszukiwania |
| `soldOut` | nie | `true` = zamiast przycisku biletów napis „Wyprzedane” |
| `free` | nie | `true` = napis „Wstęp wolny” zamiast przycisku biletów |

### 4. Dodaj grafikę

1. Zmień nazwę grafiki na taką samą jak pliku, tylko z innym rozszerzeniem, np. `2026-11-20-harold.jpg`.
2. W tym samym folderze `src/content/events`: **Add file → Upload files**, przeciągnij grafikę, **Commit changes**.

### 5. Sprawdź

Po ok. minucie wydarzenie jest na stronie. Postęp widać w zakładce **Actions**: zielony ptaszek = gotowe, czerwony krzyżyk = błąd (niżej, co wtedy).

### Co dzieje się samo

- karta na stronie głównej z datą, miejscem, mapą, „Kup bilety” i „Dodaj do kalendarza”,
- jeśli to najbliższy spektakl – główny przycisk na górze strony („Bilety · Długa forma improwizowana · 20.11”),
- podstrona wydarzenia z pełnym opisem,
- obrazek do podglądu linku na Messengerze i Facebooku, dane dla Google, wpis w mapie strony,
- dzień po spektaklu wydarzenie samo przechodzi do zakładki „Zakończone”.

### Zmiany po dodaniu

Otwórz plik wydarzenia na GitHubie, kliknij ołówek (**Edit**), popraw i **Commit changes**:

- **wyprzedane** – dopisz linijkę `soldOut: true` (między liniami `---`),
- **zmiana godziny, miejsca, opisu** – popraw odpowiednie pole,
- **odwołane** – usuń plik `.md` i grafikę (menu `…` → **Delete file**).

### Gdy coś nie działa

Jeśli w **Actions** pojawi się czerwony krzyżyk, strona się po prostu nie zaktualizowała – poprzednia wersja dalej działa. Kliknij w nieudane uruchomienie i w błąd, a zobaczysz, który plik i które pole są złe. Najczęstsze przyczyny:

- godzina w innym formacie niż `GG:MM` albo `GG.MM` (np. `7 PM`) albo nieistniejąca (np. `25:00`),
- data w innym formacie niż `DD.MM.RRRR` (np. `20/11/2026`) albo nieistniejący dzień (np. `31.02.2026`),
- brak cudzysłowu zamykającego albo `---` na początku i końcu nagłówka.

Grafika się nie pokazuje? Sprawdź, czy ma dokładnie tę samą nazwę co plik `.md` i czy nie jest w formacie HEIC.

## Dla technicznych

### Co gdzie jest

| Plik / folder | Co edytujesz |
|---|---|
| `src/content/events/*.md` | Wydarzenia – jeden plik = jeden występ |
| `src/data/site.ts` | Nazwa, opisy, e-mail, link do biletów, skład, social media |
| `src/data/o-nas.md` | Tekst sekcji „O nas” (zwykły Markdown) |
| `src/styles/global.css` | Wygląd; kolory są na samej górze pliku |
| `public/` | Logo (`logo-napis.svg` na stronie, kwadratowe `logo.png` jako ikonka), favicon – wszystko stąd jest dostępne pod `/nazwa-pliku` |
| `src/assets/sklad/` | Zdjęcia składu (patrz niżej) |
| `src/assets/hero/` | Zdjęcia do karuzeli na górze strony (patrz niżej) |
| `src/components/Icon.astro` | Ikony social mediów (dopisz nową, jeśli dojdzie kolejny serwis) |
| `src/content.config.ts` | Schemat wydarzenia (jakie pola, co wymagane) |
| `src/pages/index.astro` | Szablon strony |

### Uruchomienie lokalnie

Potrzebny Node.js 22.12 lub nowszy.

```bash
npm install
npm run dev      # http://localhost:4321, odświeża się na żywo przy każdej zmianie
npm run build    # wynik w dist/
```

### Publikacja na GitHub Pages (za darmo)

1. Utwórz repo na GitHubie i wypchnij ten projekt na gałąź `main`.
2. W repo: **Settings → Pages → Source: GitHub Actions**.
3. Gotowe – każdy push publikuje stronę. Dodatkowo workflow odpala się codziennie w nocy, żeby wczorajsze występy przeszły do archiwum.

#### Własna domena

1. W `astro.config.mjs` ustaw `site` na domenę (teraz `https://kardamonimpro.pl`).
2. **Settings → Pages → Custom domain** i ustaw rekordy DNS u rejestratora według instrukcji GitHuba. Plik `CNAME` nie jest potrzebny: przy deployu przez GitHub Actions GitHub go ignoruje.

Bez własnej domeny strona będzie pod `https://<użytkownik>.github.io/<repo>/` i logo z faviconą się tam nie wyświetlą, bo ich ścieżki (`/logo.png`) prowadzą do głównego katalogu domeny.

#### Uwaga o codziennym rebuildzie

GitHub wyłącza zaplanowane workflowy w repozytoriach bez aktywności przez 60 dni. Jeśli przez dwa miesiące nic nie commitujecie, wejdź w zakładkę Actions i włącz workflow ponownie (albo po prostu dodaj kolejne wydarzenie).

### Zmiana kolorów i zdjęć

Zdjęcia z występów do karuzeli na górze strony wrzuć do `src/assets/hero/` (poziome, najlepiej min. 1920 px szerokości). Pokazują się po kolei według nazw plików (`01-...jpg`, `02-...jpg`), zmieniają co 10 sekund i są przykryte matowym, zielonkawym „szkłem”, na którym leży logo i opis. Bez zdjęć w tym folderze góra strony ma zielone tło.

Obsługiwane formaty obrazków: JPG, PNG, WebP. HEIC (domyślny format z iPhone'a) nie jest obsługiwany – build wypisze ostrzeżenie `[obrazki]`. Na Macu konwersja: `sips -s format jpeg plik.HEIC --out plik.jpg`.

Kolory z designu są zmiennymi na górze `src/styles/global.css` (`--green`, `--green-dark`, `--mint`, `--paper` itd.).

Zdjęcia składu wrzuć do `src/assets/sklad/` i nazwij według imienia i nazwiska z `site.ts`: małe litery, bez polskich znaków, myślnik zamiast spacji, np. `rafal-kwasnik.jpg`. Zdjęcie przypisze się samo. Najlepiej kwadratowe 1:1, bo takie są kafelki; rozmiar nie ma znaczenia, bo Astro przy buildzie zmniejsza je i konwertuje do WebP. Jeśli nazwa pliku nie pasuje do nikogo, `npm run dev`/`npm run build` wypisze ostrzeżenie `[skład]`.
