# Predodactyl Theme — Custom Pterodactyl Panel Theme

Nowoczesny, ciemny motyw dla Pterodactyl Panel v1.11+ z glassmorphism, animowanymi gradientami i real-time wykresami.

---

## Struktura plików

```
pterodactyl/                              ← katalog główny Pterodactyla
├── tailwind.config.js                    ← PODMIEŃ istniejący plik
└── resources/
    └── scripts/
        ├── css/
        │   └── predodactyl.css           ← NOWY: globalne style
        └── components/
            └── theme/
                ├── index.ts              ← barrel export
                ├── theme.ts              ← konfiguracja kolorów/zmiennych
                ├── ThemeProvider.tsx      ← provider CSS Variables
                ├── useTheme.ts           ← React hook
                ├── Sidebar.tsx           ← nawigacja boczna
                ├── Navbar.tsx            ← górny pasek
                ├── ServerCard.tsx         ← karta serwera z wykresami
                ├── Dashboard.tsx         ← główny widok
                └── LoginPage.tsx         ← strona logowania
```

---

## Instalacja krok po kroku

### 1. Zainstaluj zależności

W katalogu głównym Pterodactyla:

```bash
npm install framer-motion lucide-react
```

Jeśli brakuje:
```bash
npm install tailwindcss postcss autoprefixer
```

### 2. Skopiuj pliki

Skopiuj zawartość tego folderu do katalogu Pterodactyla zachowując strukturę:

```bash
# Z katalogu theme:
cp tailwind.config.js /var/www/pterodactyl/tailwind.config.js
cp -r resources/ /var/www/pterodactyl/resources/
```

### 3. Zaimportuj CSS

W pliku `resources/scripts/css/app.css` (lub `index.css`) **dodaj na końcu**:

```css
@import './predodactyl.css';
```

### 4. Owinąć App w ThemeProvider

W pliku `resources/scripts/App.tsx` (lub głównym entry point):

```tsx
import ThemeProvider from '@/components/theme/ThemeProvider';

// PRZED:
// return <Router>...</Router>

// PO:
return (
  <ThemeProvider>
    <Router>
      {/* ...istniejące routes... */}
    </Router>
  </ThemeProvider>
);
```

### 5. Podmiany komponentów (przykłady)

#### Dashboard — zamiana głównego widoku

W `resources/scripts/routers/DashboardRouter.tsx`:

```tsx
// DODAJ import:
import Dashboard from '@/components/theme/Dashboard';

// PODMIEŃ route na główny widok:
<Route path="/" exact>
  <Dashboard />
</Route>
```

#### Login — zamiana strony logowania

W `resources/scripts/routers/AuthenticationRouter.tsx`:

```tsx
import LoginPage from '@/components/theme/LoginPage';

<Route path="/auth/login" exact>
  <LoginPage
    onLogin={(data) => {
      // Twoja logika logowania (wywołanie API Pterodactyla)
      login(data.email, data.password);
    }}
  />
</Route>
```

### 6. Zbuduj projekt

```bash
# Development
npm run build:dev

# Production (dla serwera produkcyjnego)
npm run build

# Lub bezpośrednio:
npx webpack --mode=production
```

---

## Stack technologiczny

| Technologia      | Wersja      | Zastosowanie                    |
|------------------|-------------|----------------------------------|
| React            | 17.x        | Baza UI (zgodna z Pterodactylem) |
| TypeScript       | 4.x         | Typowanie                        |
| Tailwind CSS     | 3.x         | Klasy utility                    |
| Framer Motion    | 6.x+        | Animacje i przejścia             |
| Lucide React     | latest      | Ikony SVG                        |

---

## Paleta kolorów

| Nazwa           | Wartość     | Użycie                              |
|-----------------|-------------|--------------------------------------|
| Background      | `#0a0a0f`   | Główne tło                           |
| Card            | `#111118`   | Tło kart / paneli                    |
| Tertiary        | `#16161f`   | Elementy podniesione                 |
| Purple Accent   | `#6c47ff`   | Główny akcent (przyciski, obramowania)|
| Cyan Accent     | `#00d4ff`   | Drugi akcent (linki, statusy)         |
| Text Primary    | `#e4e4ed`   | Główny tekst                         |
| Text Secondary  | `#9898b0`   | Tekst pomocniczy                     |
| Text Muted      | `#5c5c75`   | Tekst wyciszony                      |
| Online          | `#22c55e`   | Status: online                       |
| Offline         | `#ef4444`   | Status: offline                       |
| Starting        | `#f59e0b`   | Status: uruchamianie                 |

---

## Funkcje komponentów

### `ServerCard.tsx`
- Glassmorphism z `backdrop-filter: blur(20px)`
- Sparkline canvas chart CPU/RAM (real-time)
- Paski postępu z gradientem (zmiana koloru >80%)
- Hover: glow + `translateY(-6px)`
- Animowane wejście z `staggerChildren`
- Quick actions: Start/Stop/Restart (on hover)
- Status dot z animacją pulse

### `Sidebar.tsx`
- Zwijany (240px ↔ 72px) z `spring` animation
- `layoutId` active indicator (płynne przejście)
- Tooltip na hover (gdy zwinięty)
- Sekcje z headerami (GŁÓWNE / ADMIN)
- Glassmorphism tło z blur

### `Dashboard.tsx`
- Stats grid (serwery, CPU, RAM, dysk) z trend badges
- Filtrowanie po statusie (tabs)
- Wyszukiwanie serwerów
- Grid / List toggle
- Auto-refresh co 3s (real-time CPU/RAM)
- Animowane tło z orbami

### `LoginPage.tsx`
- Animowane cząsteczki w tle (30 particles)
- Gradient grid background
- Pole email/hasło z focus glow
- Show/hide password
- Remember me checkbox
- OAuth buttons (GitHub, Discord)
- Shimmer na przycisku submit
- Error messages z animacją

### `Navbar.tsx`
- Search bar z animowaną szerokością
- Notifications dropdown z badge
- Profil dropdown z avatar/initials
- Reaguje na szerokość Sidebara

---

## Kompatybilność

- **Pterodactyl**: v1.11.x, v1.12.x
- **React**: 17.x (zgodnie z bazą Pterodactyla)
- **Node.js**: 16+ (do budowania)
- **Przeglądarki**: Chrome 80+, Firefox 78+, Safari 14+, Edge 80+

---

## Licencja

MIT — wolne użycie, modyfikacja i dystrybucja.
