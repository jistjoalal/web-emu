import ROMS from "./roms.js";

import Computer from "./Computer.js";

let root = document.getElementById("root");
let c = new Computer(10, root);
c.load(ROMS.Counter);

/**
 * TODO:
 * - permanent ROM storage
 * - delete ROM button
 * - history display
 * - cap history size
 * - render speed controls (how many CPU cycles per frame)
 * - hex/dec/ascii mode toggle
 * - n-bits mode toggle
 * - step forward n steps button
 */
