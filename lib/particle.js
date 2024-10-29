class Particle {
  constructor(_loc, _dir, _speed) {
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.i = 0;
    this.original = {
      x: _loc.x,
      y: _loc.y,
    };
  }
  run() {
    this.update();
    this.checkEdges();
    this.i++;
  }
  checkEdges() {
    if (this.loc.x < 0 || this.loc.x > w || this.loc.y < 0 || this.loc.y > h) {
      this.loc.x = R.r_n(0, w);
      this.loc.y = R.r_n(0, h);
    }
    if (
      this.loc.x / w > (this.original.x + maxCanv * 0.005) / w ||
      this.loc.x / w < (this.original.x - maxCanv * 0.005) / w
    ) {
      this.loc.x = R.r_n(0, w);
      this.loc.y = R.r_n(0, h);
    }
  }

  move() {
    for (let j = 0; j < 10; j++) {
      let angle =
        R.r_no(
          (1000 * this.loc.x) / (1000 * w),
          (1000 * this.loc.y) / (1000 * h)
        ) * TWO_PI;
      this.dir.x = cos(angle);
      this.dir.y = sin(angle);
      var vel = this.dir.copy();
      vel.mult(this.speed);
      this.loc.add(vel);
    }
  }
  update() {
    stroke(t.diffB ? R.r_c(t.diffB) : R.r_c(t.palette));
    strokeWeight(t.crvTh * min(w, h) * 0.005);

    let x1 = this.loc.x,
      y1 = this.loc.y;
    this.move();
    let x2 = this.loc.x,
      y2 = this.loc.y;
    this.move();
    let x3 = this.loc.x,
      y3 = this.loc.y;
    this.move();
    let x4 = this.loc.x,
      y4 = this.loc.y;

    if (bF(x1, y1) || bF(x2, y2) || bF(x3, y3) || bF(x4, y4)) {
      quad(x1, y1, x2, y2, x3, y3, x4, y4);
      // blendMode(DIFFERENCE);
      // image(pepeImg, x1, y1, 20, 20);
    }
  }
}

const bF = (x, y) => {
  if (t.bleedOver) {
    return true;
  }
  let boundingBoxes = boundingBox(),
    notIn = true;
  for (let j = 0; j < boundingBoxes.length; j++) {
    let { x: xB, y: yB } = boundingBoxes[j];
    notIn = notIn && (x < xB[0] || x > xB[1] || y < yB[0] || y > yB[1]);
  }
  return notIn;
};
