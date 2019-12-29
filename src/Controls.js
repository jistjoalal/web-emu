import ROMS from "./roms.js";

export default class Controls {
  constructor(root, comp) {
    this.comp = comp;

    this.container = document.createElement("div");
    this.container.style.float = "left";
    root.appendChild(this.container);

    this.initButtons();
    this.initRomList();
    this.initHistory();
  }

  createButton(text, parent, onClick) {
    const button = document.createElement("button");
    parent.appendChild(button);
    button.innerHTML = text;
    button.addEventListener("click", onClick);
  }

  initButtons() {
    const buttons = document.createElement("div");
    this.container.appendChild(buttons);
    // pause
    this.createButton("pause", buttons, e => {
      this.comp.halt = true;
    });
    // play
    this.createButton("play", buttons, e => {
      if (!this.comp.halt) return;
      this.comp.halt = false;
      this.comp.run();
    });
    // step forward
    this.createButton("step forward", buttons, e => {
      if (!this.comp.halt) return;
      this.comp.cycle(this.comp.speed);
    });
    // step back
    this.createButton("step back", buttons, e => {
      if (!this.comp.halt) return;
      this.comp.cycle(-this.comp.speed);
    });
    // speed input
    const speed = document.createElement("div");
    buttons.appendChild(speed);
    const text = document.createTextNode("speed: ");
    speed.appendChild(text);
    const input = document.createElement("input");
    speed.appendChild(input);
    input.style.width = "4em";
    input.min = -1e3;
    input.max = 1e3;
    input.type = "number";
    input.value = this.comp.speed;
    input.addEventListener("change", e => {
      const speed = input.value;
      this.comp.speed = speed;
    });
  }
  initRomList() {
    this.createButton("ROM List", this.container, e => {
      let d = romList.style.display;
      romList.style.display = d ? "" : "none";
    });
    const romList = document.createElement("ul");
    this.container.appendChild(romList);
    const addRom = title => {
      const item = document.createElement("li");
      romList.appendChild(item);
      item.innerHTML = title;
      item.addEventListener("click", e => {
        this.comp.load(ROMS[title]);
      });
    };
    // save input + button
    const saveTitleInput = document.createElement("input");
    romList.appendChild(saveTitleInput);
    saveTitleInput.type = "text";
    saveTitleInput.placeholder = "Title";
    this.createButton("Save", romList, e => {
      const title = saveTitleInput.value;
      if (!title) return;
      ROMS[title] = { ...this.comp.mem };
      saveTitleInput.value = "";
      addRom(title);
    });
    // list
    for (let title in ROMS) {
      addRom(title);
    }
  }

  initHistory() {
    this.createButton("History", this.container, e => {
      let d = this.history.style.display;
      this.history.style.display = d ? "" : "none";
    });
    this.history = document.createElement("ol");
    this.history.style.overflow = "scroll";
    this.history.style.height = "200px";
    this.container.appendChild(this.history);
  }

  addHistoryChanges(changes) {
    for (let change of changes) {
      const li = document.createElement("li");
      this.history.appendChild(li);
      li.style.borderBottom = "1px solid black";
      li.style.background = "#eee";
      li.innerHTML = `<pre>${JSON.stringify(change, null, 2)}</pre>`;
      this.history.scrollTop = this.history.scrollHeight;
    }
  }

  popHistoryChange(n) {
    for (let i = 0; i < n && this.history.children.length; i++) {
      this.history.removeChild(this.history.lastChild);
    }
  }

  clearHistory() {
    this.history.innerHTML = "";
  }
}
