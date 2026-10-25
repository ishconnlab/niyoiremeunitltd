/**
 * Small helpers for working with translated values whose shape is only known
 * at runtime (arrays of objects returned by `t(key, { returnObjects: true })`).
 */

/** Narrow an unknown value to an array of `T`. */
export const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

/** Narrow an unknown value to a plain object. */
export const asRecord = <T extends object>(value: unknown): T =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as T) : ({} as T);

