// =============================================================================
// index.ts — Barrel export dla wszystkich komponentów Predodactyl Theme
// Ścieżka: resources/scripts/components/theme/index.ts
// =============================================================================

export { default as theme, cssVariables } from './theme';
export type { Theme, ThemeColors } from './theme';

export { default as Sidebar } from './Sidebar';
export { default as Navbar } from './Navbar';
export { default as ServerCard, SparklineChart, ResourceBar } from './ServerCard';
export type { ServerData, ServerStatus } from './ServerCard';
export { default as Dashboard } from './Dashboard';
export { default as LoginPage } from './LoginPage';
