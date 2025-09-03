/**
 * Constantes de tema y colores para la aplicación
 */

/**
 * Colores para indicadores de estado
 */
export const THEME_COLORS = {
  TEXT: {
    NORMAL: '#6b7280',
    WARNING: '#f59e0b',
    DANGER: '#dc2626'
  },
  CHAR_COUNT: {
    THRESHOLDS: {
      WARNING: 100, // Amarillo cuando supera el 80% (100/120)
      DANGER: 110   // Rojo cuando supera el 90% (110/120)
    }
  }
} as const;

/**
 * Obtiene el color apropiado basado en el conteo de caracteres
 * @param count - Número actual de caracteres
 * @param warningThreshold - Umbral para mostrar advertencia
 * @param dangerThreshold - Umbral para mostrar peligro
 * @returns Color hexadecimal apropiado
 */
export function getCharCountColor(
  count: number, 
  warningThreshold: number = THEME_COLORS.CHAR_COUNT.THRESHOLDS.WARNING,
  dangerThreshold: number = THEME_COLORS.CHAR_COUNT.THRESHOLDS.DANGER
): string {
  if (count > dangerThreshold) return THEME_COLORS.TEXT.DANGER;
  if (count > warningThreshold) return THEME_COLORS.TEXT.WARNING;
  return THEME_COLORS.TEXT.NORMAL;
}
