import ROMS from "./roms.js";

export default class Controls {
  constructor(root, comp) {
    this.comp = comp;
    /**
     * container
     */
    this.container = document.createElement("div");
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    root.appendChild(this.container);

    this.initButtons();
    this.initRomList();
  }
  createButton(text, onClick) {
    const button = document.createElement("button");
    this.container.appendChild(button);
    button.innerHTML = text;
    button.addEventListener("click", onClick);
  }

  initButtons() {
    // pause
    this.createButton("pause", e => {
      this.comp.halt = true;
    });
    // play
    this.createButton("play", e => {
      if (!this.comp.halt) return;
      this.comp.halt = false;
      this.comp.run();
    });
    // step forward
    this.createButton("step forward", e => {
      if (!this.comp.halt) return;
      this.comp.cycleForward();
    });
    // step back
    this.createButton("step back", e => {
      if (!this.comp.halt || !this.comp.history.length) return;
      this.comp.cycleBack();
    });
  }
  initRomList() {
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
    for (let title in ROMS) {
      addRom(title);
    }
    // save
    const saveTitleInput = document.createElement("input");
    this.container.appendChild(saveTitleInput);
    saveTitleInput.type = "text";
    saveTitleInput.placeholder = "Title";
    this.createButton("Save", e => {
      const title = saveTitleInput.value;
      if (!title) return;
      ROMS[title] = { ...this.comp.mem };
      saveTitleInput.value = "";
      addRom(title);
    });
  }
}
