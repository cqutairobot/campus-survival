/** Stable slot + monotonically increasing generation; O(1) spawn and swap removal. */
export class SlotPool {
  readonly active: number[] = [];
  readonly alive: Uint8Array;
  readonly generation: Uint32Array;
  private readonly free: number[];
  private readonly positions: Int32Array;
  overflow = 0;
  peak = 0;
  constructor(readonly capacity: number) {
    this.alive = new Uint8Array(capacity); this.generation = new Uint32Array(capacity);
    this.positions = new Int32Array(capacity); this.free = Array.from({ length: capacity }, (_, i) => capacity - i - 1);
  }
  acquire() {
    const id = this.free.pop();
    if (id === undefined) { this.overflow++; return -1; }
    this.alive[id] = 1; this.generation[id]++; this.positions[id] = this.active.length; this.active.push(id);
    this.peak = Math.max(this.peak, this.active.length); return id;
  }
  release(id: number) {
    if (!this.alive[id]) return;
    const position = this.positions[id], last = this.active.pop()!;
    if (last !== id) { this.active[position] = last; this.positions[last] = position; }
    this.alive[id] = 0; this.free.push(id);
  }
  valid(id: number, generation: number) { return id >= 0 && this.alive[id] === 1 && this.generation[id] === generation; }
  clear() { while (this.active.length) this.release(this.active[this.active.length - 1]); }
}
