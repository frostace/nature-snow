let snowflakes = [];
let gravity;
let disturbance;
let disturbanceStrength = 1.5;
let windStrength = 0.01;
let zOff = 0;
let mouseRepellRadius = 500;
let mouseRepellCoeff = 100;
let mouseAttractRadius = 2000;
let mouseAttractCoeff = 200;
let snowflakeNum = 800;

let file;
let textures = [];

// init global qt
let w = window.innerWidth,
    h = window.innerHeight;
let area = new Area(w / 2, h / 2, w, h);
let qt = new QuadTree(area, 4);

function preload() {
    file = loadImage("./assets/flakes32.png");
}

function setup() {
    let cvn = createCanvas(windowWidth, windowHeight);
    cvn.mouseOut(disableGlowEffect);

    gravity = createVector(0, 0.01);
    for (let x = 0; x < file.width; x += 32) {
        for (let y = 0; y < file.height; y += 32) {
            let img = file.get(x, y, 32, 32);
            // image(img, x, y);
            textures.push(img);
        }
    }

    for (let i = 0; i < snowflakeNum; i++) {
        let x = random(width);
        let y = random(height);
        let texture = random(textures);
        snowflakes.push(new Snowflake(x, y, texture));
    }

    disturbance = createVector(0, 0);
    // console.log(disturbance);
}

function attractForceofMouse(snowflake) {
    let attractForce;
    if (
        !mouseOnScreen() ||
        createVector(snowflake.pos.x - mouseX, snowflake.pos.y - mouseY).mag() >
            mouseAttractRadius
    ) {
        attractForce = createVector(0, 0);
    } else {
        attractForce = createVector(
            mouseX - snowflake.pos.x,
            mouseY - snowflake.pos.y
        );
        attractForce.setMag(
            mouseAttractCoeff /
                (attractForce.mag() * attractForce.mag() + 0.00000001)
        );
        attractForce.limit(0.03);
    }
    return attractForce;
}

function repellForceofMouse(snowflake) {
    let repellForce;
    // console.log(mouseX, width, mouseY, height);
    if (
        !mouseOnScreen() ||
        createVector(snowflake.pos.x - mouseX, snowflake.pos.y - mouseY).mag() >
            mouseRepellRadius
    ) {
        repellForce = createVector(0, 0);
    } else {
        repellForce = createVector(
            snowflake.pos.x - mouseX,
            snowflake.pos.y - mouseY
        );
        repellForce.setMag(
            mouseRepellCoeff /
                (repellForce.mag() * repellForce.mag() + 0.00000001)
        );
        repellForce.limit(0.02);
    }
    return repellForce;
}

function keyPressed() {
    disturbance =
        keyCode === LEFT_ARROW
            ? createVector(-0.01, 0)
            : keyCode === RIGHT_ARROW
            ? createVector(0.01, 0)
            : keyCode === UP_ARROW
            ? createVector(0, -0.01)
            : keyCode === DOWN_ARROW
            ? createVector(0, 0.01)
            : createVector(0, 0);
    disturbance.mult(disturbanceStrength);
}

function mouseOnScreen() {
    return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function draw() {
    background(0);
    // image(textures, 0, 0);
    // snowflakes.push(new Snowflake());

    // let wx = map(mouseX, 0, width, -0.1, 0.1);
    // let wind = createVector(wx, 0);

    zOff += 0.01;

    // find nearby snowflakes
    // let nearbySnowflakes = [];
    // let testArea = new Area(250, 250, 300, 300);
    // stroke(255);
    // strokeWeight(1);
    // noFill();
    // rect(testArea.x, testArea.y, testArea.w, testArea.h);
    // qt.query(testArea, nearbySnowflakes);
    // console.log(nearbySnowflakes.length);

    // if I were to generate interactions between snowflakes,
    // I shall only generate force with nearby snowflakes
    for (snowflake of snowflakes) {
        let xOff = snowflake.pos.x / width;
        let yOff = snowflake.pos.y / height;
        let wAngle = noise(xOff, yOff, zOff) * TWO_PI;

        let wind = p5.Vector.fromAngle(wAngle);
        wind.mult(windStrength);

        // temporary: a snowflake cannot have attractForce and repellForce at the same time
        let mouseForce;
        if (mouseIsPressed && mouseOnScreen()) {
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

    // qt.show();
}

function mouseMoved() {
    // sync location of glow effect with cursor
    let glowEffect = document.getElementById("glow");
    glowEffect.style.top = mouseY + "px";
    glowEffect.style.left = mouseX + "px";
}

function mouseDragged() {
    // sync location of glow effect with cursor
    let glowEffect = document.getElementById("glow");
    glowEffect.style.top = mouseY + "px";
    glowEffect.style.left = mouseX + "px";
}

function disableGlowEffect() {
    // console.log("out");
    let glowEffect = document.getElementById("glow");
    glowEffect.style.display = "hidden";
}
