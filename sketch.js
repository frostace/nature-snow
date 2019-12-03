let snowflakes = [];
let gravity;
let windStrength = 0.01;
let zOff = 0;

let file;
let textures = [];
function preload() {
  file = loadImage('flakes32.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gravity = createVector(0, 0.01);
  for (let x = 0; x < file.width; x += 32) {
    for (let y = 0; y < file.height; y += 32) {
      let img = file.get(x, y, 32, 32);
      // image(img, x, y);
      textures.push(img);
    }
  }

  for (let i = 0; i < 1200; i++){
    let x = random(width);
    let y = random(height);
    let texture = random(textures);
    snowflakes.push(new Snowflake(x, y, texture));
  }
}

function draw() {
  background(0);
  // image(textures, 0, 0);
  // snowflakes.push(new Snowflake());

  // let wx = map(mouseX, 0, width, -0.1, 0.1);
  // let wind = createVector(wx, 0);

  zOff += 0.01;

  for (snowflake of snowflakes) {
    let xOff = snowflake.pos.x / width;
    let yOff = snowflake.pos.y / height;
    let wAngle = noise(xOff, yOff, zOff) * TWO_PI;
    let wind = p5.Vector.fromAngle(wAngle);
    wind.mult(windStrength);

    snowflake.applyForce(gravity);
    snowflake.applyForce(wind);
    snowflake.fall();
    snowflake.render();
  }

  // for (let i = snowflakes.length - 1; i >= 0; i--) {
  //   if (snowflakes[i].offScreen()) {
  //     snowflakes.splice(i, 1);
  //   }
  // }
}
