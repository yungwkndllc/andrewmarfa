let ppr,
  nr = 60,
  nrf,
  ma,
  balls = [],
  radius,
  rc = [],
  S_D = 7;
let aBa = [],
  aCol = [],
  sizes = [],
  numRings = [],
  morphAmps = [],
  xPercs = [],
  yPercs = [],
  boxBounds = [];

let allPalettes = [
  // Vibrant summer
  ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#FF8B94", "#45B7D1", "#FFBE0B"],
  // Electric pop
  ["#7400B8", "#5390D9", "#48BFE3", "#64DFDF", "#80FFDB", "#6930C3", "#4EA8DE"],
  // Candy store
  ["#FF69EB", "#FF86C8", "#FFA3A5", "#FFBF81", "#FFE26E", "#F25C54", "#FF9ECD"],
  // Forest fresh
  ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2", "#1B4332", "#81B29A"],
  // Sunset vibes
  ["#F72585", "#7209B7", "#3A0CA3", "#4361EE", "#4CC9F0", "#B5179E", "#560BAD"],
];

let allPalettesNotBW = allPalettes;
let p5g = new P5Grain();
let num;
let particles = [];
const urlSearchParams = new URLSearchParams(window.location.search);

function genTokenData(projectNum) {
  let data = {};
  let hash = "0x";
  for (var i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  data.hash = hash;
  data.tokenId = (
    projectNum * 1000000 +
    Math.floor(Math.random() * 1000)
  ).toString();
  return data;
}
// let tokenData = {
//   tokenId: "5000142",
//   hash: "0xf6b1d3043f06ebb4fcb4933de87c55912e65a550ef99d0c6d9c6333a82fee5e0",
// };

let tokenData = genTokenData(Math.floor(Math.random() * 1000));

if (urlSearchParams.has("hash")) {
  tokenData.hash = urlSearchParams.get("hash");
}
let R = new Random();
let boxes = 1; //R.r_i(1, 3)
let palette = R.r_c(allPalettes);
let bleedOver = R.r_b(0.5);
let size = 0.1; // Math.max(0.001, Math.abs(R.r_n(S_D / 2 - 5, S_D / 2 - 1)));
let rings = R.r_n(nr - 5, nr + 5);
let noBounds = Math.abs(size) < 0.5 ? R.r_b(0.05) : R.r_b(0.25);
let curveSpeed = R.r_n(0.001, 0.01);
let t = {
  palette: palette,
  bleedOver: bleedOver,
  size: size,
  rings: rings,
  boxes: boxes,
  vertical: boxes > 1 && R.r_b(0.5),
  diffB:
    palette.includes("white") && R.r_b(0.5) ? R.r_c(allPalettesNotBW) : false,
  crvTh: R.r_i(1, 5),
  curveSpeed: curveSpeed,
  noBounds: true, //noBounds,
  grain: noBounds ? true : R.r_b(0.5),
  bgGrain: true, //palette == puP ? false : boxes == 1 ? true : R.r_b(0.2), // single box has to have bg grain
  omgWhat: true, //boxes == 1 ? R.r_b(0.1) : false
};

let maxCanv;

let svg1, svg2, svg3;

function preload() {
  svg1 = loadImage("1.svg");
  svg2 = loadImage("2.svg");
  svg3 = loadImage("3.svg");
}

function setup() {
  pixelDensity(1);
  // Make it 16:9 ratio
  cnv = createCanvas((windowHeight / 3) * 2, windowHeight);
  // record();
  // recorder.start();
  maxCanv = min(width, height);
  (w = width), (h = height);
  ppr = 800;
  p5g.setup();
  noFill();
  nrf = t.omgWhat ? 69 : 250;
  ma = 1;
  num = R.r_i(500, 1000);

  for (let i = 0; i < num; i++) {
    let loc = createVector(R.r_n(0, width), R.r_n(0, height));
    let dir = createVector(0, 0);
    let speed = t.curveSpeed * maxCanv * 0.001;

    particles[i] = new Particle(loc, dir, speed);
  }
  background(255);
  if (!t.bleedOver) {
    fill(R.r_c(t.palette));
    let boundingBoxes = boundingBox();
    for (let j = 0; j < boundingBoxes.length; j++) {
      let { x: boundX, y: boundY } = boundingBoxes[j];
      rect(boundX[0], boundY[0], boundX[1] - boundX[0], boundY[1] - boundY[0]);
    }
  }
  // if (t.bgGrain) {
  //   p5g.granulateSimple(100 * 1.5);
  // }

  let boundingBoxes = boundingBox();
  for (let j = 0; j < boundingBoxes.length; j++) {
    // x and y should be a random percent of the bounding box
    let xPerc;
    let yPerc;
    if (t.boxes == 1) {
      xPerc = R.r_n(0, 1);
      yPerc = R.r_n(0, 1);
    } else if (t.boxes == 2) {
      // If boxes are vertical
      if (t.vertical) {
        xPerc = j == 0 ? R.r_n(0, 0.5) : R.r_n(0.5, 1);
        yPerc = R.r_n(0, 1);
      } else {
        xPerc = R.r_n(0, 1);
        yPerc = j == 0 ? R.r_n(0, 0.5) : R.r_n(0.5, 1);
      }
    } else if (t.boxes == 3) {
      // If boxes are vertical
      if (t.vertical) {
        xPerc =
          j == 0 ? R.r_n(0, 0.33) : j == 1 ? R.r_n(0.33, 0.66) : R.r_n(0.66, 1);
        yPerc = R.r_n(0, 1);
      } else {
        xPerc = R.r_n(0, 1);
        yPerc =
          j == 0 ? R.r_n(0, 0.33) : j == 1 ? R.r_n(0.33, 0.66) : R.r_n(0.66, 1);
      }
    }
    newCircle(boundingBoxes[j]);
    xPercs.push(xPerc);
    yPercs.push(yPerc);
  }

  for (let i = 0; i < nrf; i++) {
    let progress = map(i, 0, nrf, 0, 1, (withinBounds = true));
    progress = 1 - pow(progress, 8);

    for (let k = 0; k < aBa.length; k++) {
      for (let j = 0; j < numRings[k]; j++) {
        if (aCol[k][j]) {
          let rcol = aCol[k][j];

          fill(rcol);
          stroke(rcol);
          strokeWeight(t.crvTh * maxCanv * 0.001);

          for (let i = 0; i < ppr; i++) {
            let nf = nF(
              aBa[k][j][0][i],
              aBa[k][j][1][i],
              progress * morphAmps[k],
              0.01
            );
            aBa[k][j][0][i] += nf[0];
            aBa[k][j][1][i] += nf[1];
          }
          dCL(aBa[k][j], sizes[k], xPercs[k], yPercs[k], boxBounds[k]);
        }
      }
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].run();
    }
  }
  if (t.grain) {
    p5g.granulateSimple(100 * 1.5);
  }

  // Break output into 6 squares (3 rows x 2 columns) and shuffle them
  let squares = [];
  // Random number of rows and cols between 2 and 6
  let rows = 6; //R.r_i(2, 6);
  let cols = 4; // R.r_i(2, 6);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      squares.push(
        cnv.get(
          (col * width) / cols,
          (row * height) / rows,
          width / cols,
          height / rows
        )
      );
    }
  }
  squares.sort(() => R.random_dec() - 0.5);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let index = row * cols + col;
      image(squares[index], (col * width) / cols, (row * height) / rows);
      // Draw a white border
      stroke(255);
      strokeWeight(1);
      noFill();
      rect(
        (col * width) / cols,
        (row * height) / rows,
        width / cols,
        height / rows
      );
    }
  }

  // Draw a white border
  stroke(255);
  strokeWeight(60);
  noFill();
  rect(0, 0, width, height);

  // Put 1.svg on top of the canvas
  // Center mode

  // Random scale for the svg
  let scale = 1.5; // R.r_n(1.0, 2);

  imageMode(CENTER);
  // blendMode(BURN);
  blendMode(SUBTRACT);
  image(
    R.r_c([svg1, svg2, svg3]),
    width / 2,
    height / 2,
    width * scale,
    height * scale
  );
  // saveCanvas(cnv, `${tokenData.hash}-${Math.round(width)}`, "png");
}

function draw() {}
