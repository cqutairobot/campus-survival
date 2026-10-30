export const TAU = Math.PI * 2;
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const distanceSq = (ax: number, ay: number, bx: number, by: number) => (ax - bx) ** 2 + (ay - by) ** 2;
export function segmentDistanceSq(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax, dy = by - ay;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1), 0, 1);
  return distanceSq(px, py, ax + t * dx, ay + t * dy);
}
export function angleDelta(a: number, b: number) { return ((b - a + Math.PI * 3) % TAU) - Math.PI; }
export class Random {
  constructor(public state = 1) { this.state = state >>> 0 || 1; }
  next() { let x = this.state; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.state = x >>> 0; return this.state / 4294967296; }
  range(a: number, b: number) { return a + this.next() * (b - a); }
  int(a: number, b: number) { return Math.floor(this.range(a, b + 1)); }
  weighted<T>(items: T[], weight: (item: T) => number): T {
    let v = this.next() * items.reduce((s, a) => s + weight(a), 0);
    for (const item of items) { v -= weight(item); if (v <= 0) return item; }
    return items[items.length - 1];
  }
}
export function colorNumber(color: string) { return parseInt(color.replace('#', ''), 16); }
