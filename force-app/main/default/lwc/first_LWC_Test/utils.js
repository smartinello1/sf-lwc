export default class utils {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getY() {
    return this.y;
  }

  getX() {
    return this.x;
  }

  add() {
    return this.x + this.y;
  }

  sub() {
    return this.x - this.y;
  }
}

//export default { multiply };