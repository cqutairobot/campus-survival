/** Linked spatial hash. Reuses its head/next arrays; query results are caller-owned. */
export class SpatialGrid {
  private heads = new Int32Array(16384).fill(-1);
  private next: Int32Array;
  private cellX: Int32Array;
  private cellY: Int32Array;
  constructor(capacity: number, readonly size = 64) { this.next = new Int32Array(capacity); this.cellX = new Int32Array(capacity); this.cellY = new Int32Array(capacity); }
  private key(x: number, y: number) { return ((x * 73856093) ^ (y * 19349663)) & 16383; }
  rebuild(active: number[], x: Float32Array, y: Float32Array) {
    this.heads.fill(-1);
    for (const id of active) {
      const cx = Math.floor(x[id] / this.size), cy = Math.floor(y[id] / this.size), key = this.key(cx, cy);
      this.cellX[id] = cx; this.cellY[id] = cy; this.next[id] = this.heads[key]; this.heads[key] = id;
    }
  }
  query(x: number, y: number, radius: number, out: number[]) {
    out.length = 0;
    for (let cy = Math.floor((y - radius) / this.size); cy <= Math.floor((y + radius) / this.size); cy++) {
      for (let cx = Math.floor((x - radius) / this.size); cx <= Math.floor((x + radius) / this.size); cx++) {
        for (let id = this.heads[this.key(cx, cy)]; id !== -1; id = this.next[id]) {
          if (this.cellX[id] === cx && this.cellY[id] === cy) out.push(id);
        }
      }
    }
    return out;
  }
}
