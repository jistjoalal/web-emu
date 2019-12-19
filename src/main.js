import ROMS from "./roms.js";

import Computer from "./Computer.js";

let root = document.getElementById("root");
let c = new Computer(8, root);
c.load(ROMS.Counter);
