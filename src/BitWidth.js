export default class BitWidth {
  constructor(N) {
    this.N = N;
    this.L = 2 ** N;
    this.S = Math.round(Math.sqrt(this.L));
  }
}
