// Wspólne dla strony i plików kalendarza. Wszystkie czasy liczone w strefie Europe/Warsaw,
// niezależnie od serwera, na którym idzie build.
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

export const mapsUrl = (venue: string, address: string, city: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${address}, ${city}`)}`;

export const calendarPath = (id: string) => `/kalendarz/${id}.ics`;
