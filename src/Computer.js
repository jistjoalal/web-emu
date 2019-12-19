import BitWidth from "./BitWidth.js";
import Controls from "./Controls.js";
import Display from "./Display.js";
import CPU from "./CPU.js";

export default class Computer {
  constructor(N, root) {
    this.bw = new BitWidth(N);
    this.mem = {};
    this.history = [];
    this.halt = true;
    for (let i = 0; i < this.bw.L; i++) {
      this.mem[i] = 0;
    }
    this.controls = new Controls(root, this);
    this.display = new Display(root, this);
  }
  load(rom) {
    this.halt = true;
    for (let k in rom) {
      this.mem[k] = rom[k];
      this.display.drawCell(k);
    }
    this.history = [];
  }
  apply(changes) {
    this.mem = { ...this.mem, ...changes };
    for (let k in changes) {
      this.display.drawCell(k);
    }
  }
  save(changes) {
    let inverseChanges = {};
    for (let k in changes) {
      inverseChanges[k] = this.mem[k];
      this.display.drawCell(k);
    }
    this.history.push(inverseChanges);
  }
  run() {
    this.cycleForward();
    if (!this.halt) requestAnimationFrame(this.run.bind(this));
  }
  cycleForward() {
    let changes = CPU(this.mem, this.int.bind(this));
    this.save(changes);
    this.apply(changes);
  }
  cycleBack() {
    let changes = this.history.pop();
    this.apply(changes);
  }
  int(n) {
    return (~~n + this.bw.L) % this.bw.L;
  }
}
