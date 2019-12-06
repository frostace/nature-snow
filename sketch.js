let snowflakes = [];
let gravity;
let disturbance;
let windStrength = 0.01;
let zOff = 0;
let mouseRepellRadius = 500;
let mouseRepellCoeff = 100;
let mouseAttractRadius = 2000;
let mouseAttractCoeff = 200;

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

  disturbance = createVector(0, 0);
  console.log(disturbance);
}

function attractForceofMouse(snowflake) {
  let attractForce;
  if (mouseX < 0 || mouseY < 0 || mouseX >= width || mouseY >= height
    || createVector(snowflake.pos.x - mouseX, snowflake.pos.y - mouseY).mag()
    > mouseAttractRadius) {
    attractForce = createVector(0, 0);
  } else {
    attractForce = createVector( mouseX - snowflake.pos.x,
                                 mouseY - snowflake.pos.y);
    attractForce.setMag(mouseAttractCoeff / (attractForce.mag()
                                          * attractForce.mag() + 0.00000001));
    attractForce.limit(0.03);
  }
  return attractForce;
}

function repellForceofMouse(snowflake) {
  let repellForce;
  // console.log(mouseX, width, mouseY, height);
  if (mouseX < 0 || mouseY < 0 || mouseX >= width || mouseY >= height
    || createVector(snowflake.pos.x - mouseX, snowflake.pos.y - mouseY).mag()
    > mouseRepellRadius) {
    repellForce = createVector(0, 0);
  } else {
    repellForce = createVector( snowflake.pos.x - mouseX,
                                snowflake.pos.y - mouseY);
    repellForce.setMag(mouseRepellCoeff / (repellForce.mag()
                                        * repellForce.mag() + 0.00000001));
    repellForce.limit(0.02);
  }
  return repellForce;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    disturbance = createVector(-0.01, 0);
  } else if (keyCode === RIGHT_ARROW) {
    disturbance = createVector(0.01, 0);
  } else if (keyCode === UP_ARROW) {
    disturbance = createVector(0, -0.01);
  } else if (keyCode === DOWN_ARROW) {
    disturbance = createVector(0, 0.01);
  } else {
    disturbance = createVector(0, 0);
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

    // a snowflake cannot have attractForce and repellForce at the same time
    let mouseForce;
    if (mouseIsPressed) {
      mouseForce = attractForceofMouse(snowflake);
    } else {
      mouseForce = repellForceofMouse(snowflake);
    }

    snowflake.applyForce(gravity);
    snowflake.applyForce(wind);
    snowflake.applyForce(mouseForce);
    snowflake.applyForce(disturbance);

    snowflake.fall();
    snowflake.render();
  }

  // for (let i = snowflakes.length - 1; i >= 0; i--) {
  //   if (snowflakes[i].offScreen()) {
  //     snowflakes.splice(i, 1);
  //   }
  // }
}
