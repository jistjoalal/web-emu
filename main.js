import ROMS from "./roms.js";

function computer() {
  const root = document.querySelector("#root");
  const N = 8;
  const L = 2 ** N;
  const S = Math.round(Math.sqrt(L));
  const UI_SCALE = 30;
  const FONT = "12px monospace";

  let cvs, ctx;
  let mem = { ...ROMS.FIB };
  let history = [];
  let halt = true;

  function rand() {
    return ~~(Math.random() * L);
  }

  function int(n) {
    return n % L;
  }

  function init() {
    initControls();
    initScreen();
  }

  function initControls() {
    /**
     * container
     */
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    root.appendChild(container);

    /**
     * buttons
     */
    function createButton(text, onClick) {
      const button = document.createElement("button");
      container.appendChild(button);
      button.innerHTML = text;
      button.addEventListener("click", onClick);
    }
    // pause
    createButton("pause", e => {
      halt = true;
    });
    // play
    createButton("play", e => {
      if (!halt) return;
      halt = false;
      run();
    });
    // step forward
    createButton("step forward", e => {
      if (!halt) return;
      cycleForward();
    });
    // step back
    createButton("step back", e => {
      if (!halt || !history.length) return;
      cycleBack();
    });

    /**
     * rom list
     */
    // rom list
    const romList = document.createElement("ul");
    container.appendChild(romList);
    function addRom(title) {
      const item = document.createElement("li");
      romList.appendChild(item);
      item.innerHTML = title;
      item.addEventListener("click", e => {
        load(ROMS[title]);
      });
    }
    for (let title in ROMS) {
      addRom(title);
    }
    // save
    const saveTitleInput = document.createElement("input");
    container.appendChild(saveTitleInput);
    saveTitleInput.type = "text";
    saveTitleInput.placeholder = "Title";
    createButton("Save", e => {
      const title = saveTitleInput.value;
      if (!title) return;
      ROMS[title] = { ...mem };
      saveTitleInput.value = "";
      addRom(title);
    });
  }

  function initScreen() {
    cvs = document.createElement("canvas");
    ctx = cvs.getContext("2d");
    cvs.width = S * UI_SCALE;
    cvs.height = S * UI_SCALE;
    ctx.font = FONT;
    root.appendChild(cvs);
    // initial render
    for (let i = 0; i < L; i++) {
      drawCell(i);
    }
  }

  function drawCell(i) {
    // c = background color
    let c = ~~(mem[i] * (256 / L));
    // d = text color
    let d = c > 127 ? 0 : 255;
    let [y, x] = [~~(i / S), i % S];
    let [sy, sx] = [y * UI_SCALE, x * UI_SCALE];
    let text = mem[i] || 0;
    // background
    ctx.fillStyle = `rgb(${c},${c},${c})`;
    ctx.fillRect(sx, sy, UI_SCALE, UI_SCALE);
    // text
    ctx.fillStyle = `rgb(${d},${d},${d})`;
    ctx.fillText(text, sx + 1, sy + UI_SCALE / 1.6);
  }

  function CPU() {
    let pc = mem[0];
    let [op, a, b, c] = [mem[pc], mem[pc + 1], mem[pc + 2], mem[pc + 3]];
    if (op == 1) {
      // add
      return {
        [c]: int(mem[a] + mem[b]),
        0: mem[0] + 4
      };
    } else if (op == 2) {
      // jump to
      return {
        0: int(a)
      };
    } else if (op == 3) {
      // copy
      return {
        [b]: mem[a],
        0: mem[0] + 3
      };
    }
    return {};
  }

  function load(rom) {
    halt = true;
    mem = { ...rom };
    history = [];
    for (let i = 0; i < L; i++) {
      drawCell(i);
    }
  }

  function apply(changes) {
    mem = { ...mem, ...changes };
    for (let k in changes) {
      drawCell(k);
    }
  }

  function save(changes) {
    let inverseChanges = {};
    for (let k in changes) {
      inverseChanges[k] = mem[k];
    }
    history.push(inverseChanges);
  }

  function run() {
    cycleForward();
    if (!halt) requestAnimationFrame(run);
  }

  function cycleForward() {
    let changes = CPU();
    save(changes);
    apply(changes);
  }

  function cycleBack() {
    let changes = history.pop();
    apply(changes);
  }

  init();
}

computer();

/**
 * TODO:
 * - permanent ROM storage
 * - history display
 * - cap history size
 * - scroll to set cell
 * - render speed controls (how many CPU cycles per frame)
 * - hex/dec/ascii mode toggle
 */
