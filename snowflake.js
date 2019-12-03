function getRandomSize() {
  let r = pow(random(0.2, 1), 5);
  return constrain(r * 32, 2, 32);
  // let r = randomGaussian() * 2.5;
  // return constrain(abs(r * r), 2, 10);
}


class Snowflake {

  constructor(sx, sy, texture){
    let x = sx || random(width);
    let y = sy || random(-100, -10);
    this.texture = texture;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector();
    this.r = getRandomSize();
    this.mass = this.r * this.r;
    this.angle = random(TWO_PI);
    this.dir = random(1) > 0.5 ? 1 : -1;
    this.xOffset = 0;
  }

  randomize() {
    let x = random(width);
    let y = random(-100, -10);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector();
    this.r = getRandomSize();
  }

  applyForce(force) {
    let f = force.copy();
    f.mult(this.r);
    this.acc.add(f);
  }

  fall() {

    this.xOffset = sin(this.angle) * this.r;
    this.vel.add(this.acc);
    this.vel.limit(this.r * 0.2);

    if (this.vel.mag() < 1) {
      this.vel.normalize();
    }
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.y > height + this.r || this.r < 0.01) {
      this.randomize();
    }

    if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    }

    this.r = this.r / 1.0005;
    this.angle += this.dir * this.vel.mag() / 500;
  }

  render() {
    push();
    translate(this.pos.x + this.dir * this.xOffset, this.pos.y);
    rotate(this.angle) ;
    // stroke(255);
    // strokeWeight(this.r);
    // point(this.pos.x, this.pos.y);
    imageMode(CENTER);
    image(this.texture, 0, 0, this.r, this.r);
    pop();
  }

  offScreen() {
    return (this.pos.y > height + this.r ||
            this.pos.x < -this.r ||
            this.pos.x > width + this.r);
  }
}
