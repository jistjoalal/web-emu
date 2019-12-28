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
    this.speed = 1;
    for (let i = 0; i < this.bw.L; i++) {
      this.mem[i] = 0;
    }
    this.controls = new Controls(root, this);
    this.display = new Display(root, this);
  }
  load(rom) {
    this.halt = true;
    for (let k = 0; k < this.bw.L; k++) {
      this.mem[k] = rom[k] || 0;
      this.display.drawCell(k);
    }
    this.history = [];
  }
  updateDisplay(changes) {
    for (let k in changes) {
      this.display.drawCell(k);
    }
  }
  save(changes) {
    if (JSON.stringify(changes) == "{}") {
      return;
    }
    let inverseChanges = {};
    for (let k in changes) {
      inverseChanges[k] = this.mem[k];
      this.display.drawCell(k);
    }
    this.history.push(inverseChanges);
  }
  run() {
    this.cycle(this.speed);
    if (!this.halt) requestAnimationFrame(this.run.bind(this));
  }
  cycle(n) {
    let batchChanges = {};
    for (let i = 0; i < Math.abs(n); i++) {
      let changes = {};
      if (n > 0) {
        changes = CPU(this.mem, this.int.bind(this));
        this.save(changes);
      } else {
        changes = this.history.pop();
      }
      batchChanges = { ...batchChanges, ...changes };
      this.mem = { ...this.mem, ...changes };
    }
    this.updateDisplay(batchChanges);
  }
  int(n) {
    return (~~n + this.bw.L) % this.bw.L;
  }
}
