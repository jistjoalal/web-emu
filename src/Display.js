export default class Display {
  constructor(root, comp) {
    this.comp = comp;
    this.cvs = document.createElement("canvas");
    this.ctx = this.cvs.getContext("2d");
    this.UI_SCALE = 30;
    this.FONT = "12px monospace";
    root.appendChild(this.cvs);
    this.initGrid();
    this.initListeners();
  }
  initGrid() {
    this.cvs.width = this.comp.bw.S * this.UI_SCALE;
    this.cvs.height = this.comp.bw.S * this.UI_SCALE;
    this.ctx.font = this.FONT;

    // initial render
    for (let i = 0; i < this.comp.bw.L; i++) {
      this.drawCell(i);
    }
  }
  initListeners() {
    // mouse input
    const getIndex = e => {
      const [y, x] = [
        ~~((e.clientY - this.cvs.offsetTop) / this.UI_SCALE),
        ~~((e.clientX - this.cvs.offsetLeft) / this.UI_SCALE)
      ];
      return y * this.comp.bw.S + x;
    };
    this.cvs.addEventListener("click", e => {
      if (!this.comp.halt) return;
      const i = getIndex(e);
      this.comp.mem[i] = this.comp.int(this.comp.mem[i] + 1);
      this.drawCell(i);
    });
    this.cvs.addEventListener("contextmenu", e => {
      e.preventDefault();
      if (!this.comp.halt) return;
      const i = getIndex(e);
      this.comp.mem[i] = this.comp.int(this.comp.mem[i] - 1);
      this.drawCell(i);
    });
  }
  drawCell(i) {
    // c = background color
    let c = ~~(this.comp.mem[i] * (256 / this.comp.bw.L));
    // d = text color
    let d = c > 127 ? 0 : 255;
    let [y, x] = [~~(i / this.comp.bw.S), i % this.comp.bw.S];
    let [sy, sx] = [y * this.UI_SCALE, x * this.UI_SCALE];
    let text = this.comp.mem[i];
    // background
    this.ctx.fillStyle = `rgb(${c},${c},${c})`;
    this.ctx.fillRect(sx, sy, this.UI_SCALE, this.UI_SCALE);
    // text
    this.ctx.fillStyle = `rgb(${d},${d},${d})`;
    this.ctx.fillText(text, sx + 1, sy + this.UI_SCALE / 1.6);
  }
}
