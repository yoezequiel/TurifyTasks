/**
 * Utilidades para manejo de texto
 */

/**
 * Trunca el texto si excede la longitud máxima especificada
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima permitida (por defecto 20)
 * @returns Texto truncado con puntos suspensivos si es necesario
 */
export function truncateText(text: string, maxLength: number = 20): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Validaciones de longitud de texto para formularios
 */
export const TEXT_LIMITS = {
  TASK_TITLE: 120,
  TASK_DESCRIPTION: 120,
  TRUNCATE_LENGTH: 20
} as const;

/**
 * Valida si un texto excede el límite especificado
 * @param text - Texto a validar
 * @param limit - Límite de caracteres
 * @returns true si el texto es válido
 */
export function isValidTextLength(text: string, limit: number): boolean {
  return !!text && text.length <= limit;
}
