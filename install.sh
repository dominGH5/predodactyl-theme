#!/bin/bash
# =============================================================================
# PREDODACTYL THEME — Skrypt instalacyjny
# Wersja: 2.0.0
# 
# Użycie: bash install.sh
# =============================================================================

set -e

PTERO_DIR="/var/www/pterodactyl"
THEME_CSS="predodactyl-override.css"
BACKUP_DIR="$PTERO_DIR/predodactyl-backup-$(date +%Y%m%d_%H%M%S)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║     ${CYAN}PREDODACTYL THEME INSTALLER v2.0${PURPLE}                ║${NC}"
echo -e "${PURPLE}║     ${NC}Glassmorphism + Neon + Animated Gradients${PURPLE}      ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERROR]${NC} Ten skrypt wymaga uprawnień root. Użyj: sudo bash install.sh"
  exit 1
fi

# Check if Pterodactyl directory exists
if [ ! -d "$PTERO_DIR" ]; then
  echo -e "${RED}[ERROR]${NC} Nie znaleziono katalogu Pterodactyl: $PTERO_DIR"
  echo -e "${YELLOW}Podaj ścieżkę do instalacji Pterodactyl:${NC}"
  read -r PTERO_DIR
  if [ ! -d "$PTERO_DIR" ]; then
    echo -e "${RED}[ERROR]${NC} Katalog nie istnieje: $PTERO_DIR"
    exit 1
  fi
fi

echo -e "${CYAN}[1/5]${NC} Tworzenie kopii zapasowej..."
mkdir -p "$BACKUP_DIR"

# Backup tailwind config
if [ -f "$PTERO_DIR/tailwind.config.js" ]; then
  cp "$PTERO_DIR/tailwind.config.js" "$BACKUP_DIR/"
  echo -e "  ${GREEN}✓${NC} tailwind.config.js"
fi

# Backup blade template
WRAPPER_FILE=$(find "$PTERO_DIR/resources/views" -name "wrapper.blade.php" 2>/dev/null | head -1)
if [ -n "$WRAPPER_FILE" ]; then
  cp "$WRAPPER_FILE" "$BACKUP_DIR/"
  echo -e "  ${GREEN}✓${NC} wrapper.blade.php"
fi

# Backup layout files
for f in $(find "$PTERO_DIR/resources/views" -name "*.blade.php" -path "*layout*" 2>/dev/null); do
  cp "$f" "$BACKUP_DIR/"
  echo -e "  ${GREEN}✓${NC} $(basename $f)"
done

echo -e "${GREEN}  Kopia zapasowa: $BACKUP_DIR${NC}"
echo ""

echo -e "${CYAN}[2/5]${NC} Kopiowanie plików theme..."

# Copy CSS override
cp "$THEME_CSS" "$PTERO_DIR/public/predodactyl-override.css"
echo -e "  ${GREEN}✓${NC} predodactyl-override.css → public/"

# Copy tailwind config
cp "tailwind.config.js" "$PTERO_DIR/tailwind.config.js"
echo -e "  ${GREEN}✓${NC} tailwind.config.js"
echo ""

echo -e "${CYAN}[3/5]${NC} Wstrzykiwanie CSS do blade template..."

# Find the wrapper/layout blade file
BLADE_FILE=""
POSSIBLE_FILES=(
  "$PTERO_DIR/resources/views/templates/wrapper.blade.php"
  "$PTERO_DIR/resources/views/layouts/app.blade.php"  
  "$PTERO_DIR/resources/views/layouts/master.blade.php"
)

for f in "${POSSIBLE_FILES[@]}"; do
  if [ -f "$f" ]; then
    BLADE_FILE="$f"
    break
  fi
done

if [ -z "$BLADE_FILE" ]; then
  BLADE_FILE=$(find "$PTERO_DIR/resources/views" -name "*.blade.php" | xargs grep -l "</head>" 2>/dev/null | head -1)
fi

if [ -n "$BLADE_FILE" ]; then
  # Check if already injected
  if grep -q "predodactyl-override.css" "$BLADE_FILE" 2>/dev/null; then
    echo -e "  ${YELLOW}⚠${NC} CSS już wstrzyknięty w $(basename $BLADE_FILE)"
  else
    # Inject CSS link before </head>
    sed -i 's|</head>|    <link rel="stylesheet" href="/predodactyl-override.css?v={{ filemtime(public_path("predodactyl-override.css")) }}">\n    </head>|' "$BLADE_FILE"
    echo -e "  ${GREEN}✓${NC} CSS wstrzyknięty do: $(basename $BLADE_FILE)"
  fi
else
  echo -e "  ${RED}✗${NC} Nie znaleziono pliku blade z </head>. Ręcznie dodaj do głównego layoutu:"
  echo -e "  ${YELLOW}<link rel=\"stylesheet\" href=\"/predodactyl-override.css\">${NC}"
fi
echo ""

echo -e "${CYAN}[4/5]${NC} Instalacja zależności i build..."

cd "$PTERO_DIR"

# Install line-clamp plugin if not present
if ! grep -q "line-clamp" "$PTERO_DIR/node_modules/@tailwindcss/line-clamp/package.json" 2>/dev/null; then
  echo -e "  Instalowanie @tailwindcss/line-clamp..."
  yarn add @tailwindcss/line-clamp 2>/dev/null || npm install @tailwindcss/line-clamp 2>/dev/null
  echo -e "  ${GREEN}✓${NC} @tailwindcss/line-clamp zainstalowany"
fi

echo -e "  Budowanie assets (to może potrwać ~30s)..."
if yarn build:production 2>&1 | tail -3; then
  echo -e "  ${GREEN}✓${NC} Build zakończony pomyślnie!"
else
  echo -e "  ${RED}✗${NC} Build nieudany. Sprawdź logi powyżej."
  exit 1
fi
echo ""

echo -e "${CYAN}[5/5]${NC} Czyszczenie cache..."
php artisan view:clear 2>/dev/null && echo -e "  ${GREEN}✓${NC} View cache wyczyszczony" || true
php artisan cache:clear 2>/dev/null && echo -e "  ${GREEN}✓${NC} App cache wyczyszczony" || true
echo ""

echo -e "${PURPLE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║     ${GREEN}INSTALACJA ZAKOŃCZONA POMYŚLNIE!${PURPLE}               ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Odśwież panel w przeglądarce (Ctrl+Shift+R)${NC}"
echo -e "${YELLOW}Backup plików: $BACKUP_DIR${NC}"
echo ""
echo -e "${PURPLE}Aby odinstalować, przywróć pliki z backup:${NC}"
echo -e "  cp $BACKUP_DIR/* $PTERO_DIR/"
echo -e "  rm $PTERO_DIR/public/predodactyl-override.css"
echo -e "  cd $PTERO_DIR && yarn build:production"
echo ""
