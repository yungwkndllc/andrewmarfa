function nF(x, y, amp, smoothness) {
  return [
    amp * (2 * R.r_no(smoothness * x, smoothness * y) - 1),
    amp * (2 * R.r_no(smoothness * x, smoothness * y, 50) - 1),
  ];
}

function getBallPoints(r, nr_points) {
  let x = [],
    y = [];
  for (let i = 0; i < nr_points; i++) {
    x[i] = r * cos((2 * PI * i) / nr_points);
    y[i] = r * sin((2 * PI * i) / nr_points);
  }
  return [x, y];
}

function boundingBox() {
  let e = maxCanv / 12;
  if (t.vertical) {
    if (t.boxes === 2) {
      return [
        {
          x: [e, w / 2 - e],
          y: [e, h - e],
        },
        {
          x: [w / 2 + e, w - e],
          y: [e, h - e],
        },
      ];
    } else if (t.boxes === 3) {
      return [
        {
          x: [e, w / 3 - e / 3],
          y: [e, h - e],
        },
        {
          x: [w / 3 + e / 3, (2 * w) / 3 - e / 3],
          y: [e, h - e],
        },
        {
          x: [(2 * w) / 3 + e / 3, w - e],
          y: [e, h - e],
        },
      ];
    }
  }

  if (t.boxes === 1) {
    return [
      {
        x: [e, w - e],
        y: [e, h - e],
      },
    ];
  } else if (t.boxes === 2) {
    return [
      {
        x: [e, w - e],
        y: [e, h / 2 - e],
      },
      {
        x: [e, w - e],
        y: [h / 2 + e, h - e],
      },
    ];
  } else if (t.boxes === 3) {
    return [
      {
        x: [e, w - e],
        y: [e, h / 3 - e / 3],
      },
      {
        x: [e, w - e],
        y: [h / 3 + e / 3, (2 * h) / 3 - e / 3],
      },
      {
        x: [e, w - e],
        y: [(2 * h) / 3 + e / 3, h - e],
      },
    ];
  }
}

function dCL(cline, size, xo, yo, rB) {
  let len = cline[0].length;
  if (t.omgWhat) {
    noFill();
  }
  beginShape();
  let { x: bX, y: bY } = rB;
  for (let i = 0; i < len + 1; i++) {
    let x =
      ((cline[0][i % len] / size) * w) / 600 +
      w / 2 +
      (bX[1] - bX[0]) * xo +
      bX[0] -
      w * xo;
    let y =
      ((cline[1][i % len] / size) * h) / 900 +
      h / 2 +
      (bY[1] - bY[0]) * yo +
      bY[0] -
      h * yo;
    if (x > bX[0] && x < bX[1] && y > bY[0] && y < bY[1]) {
      vertex(x, y);
    } else if (t.noBounds) {
      vertex(x, y);
    }
  }
  endShape(CLOSE);
}

function newCircle(boundingBoxes) {
  balls = [];
  rc = [];
  let noR = t.rings;

  for (let j = 0; j < noR; j++) {
    balls[j] = getBallPoints((0.7 * 500 * (noR - j)) / noR, ppr, boundingBoxes);
    rc[j] = R.r_c(t.palette);
  }

  aBa.push(balls);
  aCol.push(rc);
  sizes.push(t.size);
  boxBounds.push(boundingBoxes);
  numRings.push(noR);
  morphAmps.push(ma);
}
