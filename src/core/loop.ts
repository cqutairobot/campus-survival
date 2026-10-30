export class FixedLoop {
  readonly step = 1 / 60;
  private accumulator = 0;
  droppedSeconds = 0;
  advance(delta: number, update: (dt: number) => void) {
    this.droppedSeconds += Math.max(0,delta-0.1);
    this.accumulator += Math.min(Math.max(delta, 0), 0.1);
    let count = 0;
    while (this.accumulator + 1e-10 >= this.step && count < 5) { update(this.step); this.accumulator -= this.step; count++; }
    if (this.accumulator >= this.step) { this.droppedSeconds += this.accumulator; this.accumulator = 0; }
    return Math.max(0, this.accumulator / this.step);
  }
  reset() { this.accumulator = 0; }
}
