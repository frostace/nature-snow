class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.myQuad = null;
    }
}

class Area {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(snowflake) {
        return (
            Math.abs(snowflake.pos.x - this.x) < this.w / 2 &&
            Math.abs(snowflake.pos.y - this.y) < this.h / 2
        );
    }

    intersects(area) {
        return (
            area.x - area.w / 2 > this.x + this.w / 2 &&
            this.x - this.w / 2 > area.x + area.w / 2 &&
            area.y - area.h / 2 > this.y + this.h / 2 &&
            this.y - this.h / 2 > area.y + area.h / 2
        );
    }
}

class QuadTree {
    constructor(initArea, n) {
        this.area = initArea;
        this.capacity = n;
        this.snowflakes = [];
        this.divided = false;
        this.personalColor = [
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
        ];
    }

    // subQuadOf(point) {
    //     if (point.x < this.area.x) {
    //         if (point.y < this.area.y) {
    //             return this.topLeft;
    //         } else return this.topRight;
    //     } else {
    //         if (point.y < this.area.y) {
    //             return this.bottomLeft;
    //         } else return this.bottomRight;
    //     }
    // }
    redistribute() {
        for (let snowflake of this.snowflakes) {
            this.topLeft.insert(snowflake);
            this.topRight.insert(snowflake);
            this.bottomLeft.insert(snowflake);
            this.bottomRight.insert(snowflake);
        }
    }

    subdivide() {
        let x = this.area.x,
            y = this.area.y,
            w = this.area.w,
            h = this.area.h;
        let topLeftArea = new Area(x - w / 4, y - h / 4, w / 2, h / 2);
        let topRightArea = new Area(x + w / 4, y - h / 4, w / 2, h / 2);
        let bottomLeftArea = new Area(x - w / 4, y + h / 4, w / 2, h / 2);
        let bottomRightArea = new Area(x + w / 4, y + h / 4, w / 2, h / 2);
        this.topLeft = new QuadTree(topLeftArea, this.capacity);
        this.topRight = new QuadTree(topRightArea, this.capacity);
        this.bottomLeft = new QuadTree(bottomLeftArea, this.capacity);
        this.bottomRight = new QuadTree(bottomRightArea, this.capacity);
        this.divided = true;
        this.redistribute();
        this.snowflakes = [];
    }

    insert(snowflake) {
        // console.log(snowflake.pos.x, snowflake.pos.y);
        // console.log(snowflake.pos.x, snowflake.pos.y, this.area);
        // edge case
        if (!this.area.contains(snowflake)) {
            // console.log(
            //     "==",
            //     snowflake.pos.x,
            //     snowflake.pos.y,
            //     this.area.x,
            //     this.area.y,
            //     this.area.w,
            //     this.area.h
            // );
            return false;
        }
        // console.log("i am here");
        if (this.snowflakes.length < this.capacity && !this.divided) {
            this.snowflakes.push(snowflake);
            // (re-)assign Tree to this snowflake
            snowflake.resideTree = this;
            return true;
        } else {
            this.divided || this.subdivide();
            this.topLeft.insert(snowflake) ||
                this.topRight.insert(snowflake) ||
                this.bottomLeft.insert(snowflake) ||
                this.bottomRight.insert(snowflake);
        }

        //TODO: if all sub quad trees are found to be empty, merge all sub trees?
    }

    query(targetArea, nearbySnowflakes) {
        if (this.area.intersects(targetArea)) return;

        // if not divided, insert snowflakes
        for (let snowflake of this.snowflakes) {
            !this.divided &&
                targetArea.contains(snowflake) &&
                nearbySnowflakes.push(snowflake);
        }

        // if it's divided, check its children
        if (!this.divided) return;
        this.topLeft.query(targetArea, nearbySnowflakes);
        this.topRight.query(targetArea, nearbySnowflakes);
        this.bottomLeft.query(targetArea, nearbySnowflakes);
        this.bottomRight.query(targetArea, nearbySnowflakes);
    }

    // help visualize quad tree area and snowflake nums in this tree
    show() {
        stroke(
            this.personalColor[0],
            this.personalColor[1],
            this.personalColor[2]
        );
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.area.x, this.area.y, this.area.w, this.area.h);

        textSize(14);
        fill(255);
        text(
            this.snowflakes.length.toString(),
            this.area.x - this.area.w / 2 + 10,
            this.area.y - this.area.h / 2 + 15
        );

        if (this.divided) {
            this.topLeft.show();
            this.topRight.show();
            this.bottomLeft.show();
            this.bottomRight.show();
        }
        for (let p of this.snowflakes) {
            let c;
            if (p.outOfCurrArea()) {
                c = color(255, 204, 0);
                // console.log(p.pos.x, p.pos.y, p.resideTree);
            } else
                c = color(
                    this.personalColor[0],
                    this.personalColor[1],
                    this.personalColor[2]
                );

            stroke(c);
            strokeWeight(1);
            noFill();
            rectMode(CENTER);
            rect(p.pos.x, p.pos.y, 10, 10);
        }
    }
}
