let meltingCoeff = 1.001;

function getRandomSize() {
    let r = pow(random(0.2, 1), 5);
    // let r = pow(random(0.98, 1), 5);
    return constrain(r * 32, 2, 32);
}

class Snowflake {
    constructor(sx, sy, texture) {
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
        this.resideTree = null; // quad

        // uncomment this to enable quad tree
        // qt.insert(this);
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

        // if snowflake falls out of bottom or too small, regenerate
        if (this.pos.y > height + this.r || this.r < 0.01) {
            this.randomize();
        }

        // if snowflake gets out of left / right side, re-appear from the other side
        if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        }

        this.r = this.r / meltingCoeff;
        this.angle += (this.dir * this.vel.mag()) / 500;

        // now that position of the snowflake is confirmed in this iteration, update quadtree
        // console.log(this.outOfCurrArea());
        if (!this.outOfCurrArea()) {
            // do nothing
        } else {
            // console.log("insert to new sub qt", this.pos.x, this.pos.y);
            // delete this snowflake from this.resideTree if it has a resideTree
            !this.resideTree || removeFlakeFromResideTree(snowflake);

            // insert this snowflake again into qt
            this.resideTree = null;

            // uncomment this to enable quad tree
            // qt.insert(this);
        }
        // !this.outOfCurrArea() || qt.insert(this);
    }

    render() {
        push();
        translate(this.pos.x + this.dir * this.xOffset, this.pos.y);
        rotate(this.angle);
        // stroke(255);
        // strokeWeight(this.r);
        // point(this.pos.x, this.pos.y);
        imageMode(CENTER);
        image(this.texture, 0, 0, this.r, this.r);
        pop();
    }

    offScreen() {
        return (
            this.pos.y > height + this.r ||
            this.pos.x < -this.r ||
            this.pos.x > width + this.r
        );
    }

    outOfCurrArea() {
        // console.log("checking: ", this.pos.x, this.pos.y, this.resideTree);
        return (
            !this.resideTree ||
            Math.abs(this.pos.x - this.resideTree.area.x) >
                this.resideTree.area.w / 2 ||
            Math.abs(this.pos.y - this.resideTree.area.y) >
                this.resideTree.area.h / 2
        );
    }
}

function removeFlakeFromResideTree(snowflake) {
    snowflake.resideTree.snowflakes.splice(
        snowflake.resideTree.snowflakes.indexOf(snowflake),
        1
    );
}
