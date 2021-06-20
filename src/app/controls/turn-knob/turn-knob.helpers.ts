export function clampInteger(value: number, threshold: number): number {
  if (value < 0) {
    return Math.max(value, -threshold);
  }
  return Math.min(value, threshold);
}
