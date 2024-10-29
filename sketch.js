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
let g = "green",
  b = "#000",
  pP = [g, g, g, g, g, g, g, g, g, b, b, "red", "blue"],
  puP = ["#FFD6FF", "#E7C6FF", "#C8B6FF", "#B8C0FF", "#BBD0FF"],
  kP = [
    "#9e248b",
    "#144a7b",
    "#feec35",
    "#92d3cc",
    "#1db1ed",
    "#19a991",
    "#f6bbd5",
    "#dada5f",
    "#bf85ba",
    "#ea168d",
    "#303191",
  ],
  bwP = ["#fff", b],
  bP = ["#900025", "#ff8657", "#374f9b", "#060622", "#7a5cee", "#d1b4bf"],
  gwP = ["#24476a", "#286991", "#ecbf9e", "#ebd7b2"],
  wlP = ["#748838", "#b6bfcf", "#eeb5a1", "#779d9d"];
let allPalettes = [pP, puP, kP, bP, gwP, wlP, bwP];

allPalettes = [
  ["#529e4a", "#4d4f3c", "#fae44c", "#e9723e", "#d93932", "#e56613", "#f5cc17"],
];

function getRandomSimilarColor(hexColor) {
  // Convert hex to RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // Adjust saturation and brightness
  let saturation = Math.random() * 0.2 + 0.8; // Adjust saturation between 0.8 and 1
  let brightness = Math.random() * 0.2 + 0.8; // Adjust brightness between 0.8 and 1

  // Convert back to hex
  r = Math.round(Math.min(Math.max(0, r * saturation), 255));
  g = Math.round(Math.min(Math.max(0, g * saturation), 255));
  b = Math.round(Math.min(Math.max(0, b * saturation), 255));

  r = Math.round(Math.min(Math.max(0, r * brightness), 255));
  g = Math.round(Math.min(Math.max(0, g * brightness), 255));
  b = Math.round(Math.min(Math.max(0, b * brightness), 255));

  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

let allPalettesNotBW = allPalettes.filter((p) => p != bwP);
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
  grain: palette == puP ? false : noBounds ? true : R.r_b(0.5),
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
  background(0);
  if (!t.bleedOver) {
    fill(R.r_c(t.palette));
    let boundingBoxes = boundingBox();
    for (let j = 0; j < boundingBoxes.length; j++) {
      let { x: boundX, y: boundY } = boundingBoxes[j];
      rect(boundX[0], boundY[0], boundX[1] - boundX[0], boundY[1] - boundY[0]);
    }
  }
  if (t.bgGrain) {
    p5g.granulateSimple(100 * 1.5);
  }

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

          // For jonooo
          // if (rcol === '#b2bf0a') {
          //   rcol = getRandomSimilarColor(rcol)
          // }

          // if (R.random_dec() < 0.5) {
          fill(rcol);
          stroke(rcol);
          // }
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
  let rows = 6;
  let cols = 4;
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

  // Put 1.svg on top of the canvas
  // Center mode
  imageMode(CENTER);
  blendMode(REMOVE);
  image(
    R.r_c([svg1, svg2, svg3]),
    width / 2,
    height / 2,
    width * 2,
    height * 2
  );
  // saveCanvas(cnv, `${tokenData.hash}-${Math.round(width)}`, "png");
}

function draw() {}
