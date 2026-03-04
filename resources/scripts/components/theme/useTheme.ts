// =============================================================================
// useTheme.ts — Hook do wykorzystania zmiennych theme w komponentach
// Ścieżka: resources/scripts/components/theme/useTheme.ts
// =============================================================================

import { useMemo } from 'react';
import theme from './theme';
import type { Theme } from './theme';

/**
 * Hook zwracający obiekt theme z typowaniem.
 * Wykorzystuje memoizację — bezpieczny do użycia w dowolnym komponencie.
 *
 * @example
 * const { colors, glass, shadows } = useTheme();
 * <div style={{ background: colors.background.card }} />
 */
export const useTheme = (): Theme => {
  return useMemo(() => theme, []);
};

/**
 * Helper: pobierz kolor statusu serwera.
 */
export const useStatusColor = (
  status: 'online' | 'offline' | 'starting' | 'stopping' | 'installing'
): string => {
  return useMemo(() => {
    return theme.colors.status[status] || theme.colors.text.muted;
  }, [status]);
};

export default useTheme;
