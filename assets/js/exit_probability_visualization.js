// Exit Probability Visualization - JavaScript Implementation - Based on p5

// Same area for all shapes: circle R, semicircle sqrt(2) R, cake 2 R
const SHAPE_RADIUS = 150;

// Shape on top in a SHAPE_AREA square, density plot below
const SHAPE_AREA = 512;
const PLOT_HEIGHT = 120;
const PLOT_MARGIN = 16;

const BOUNDARY_WIDTH = 16;
const DENSITY_SPLIT_PROB = 0.005;
const DENSITY_MAX_DEPTH = 8;

// viridis colors sampled from matplotlib cmap
const DENSITY_COLORS = [[68, 1, 84], [72, 36, 117], [59, 82, 139], [44, 114, 142], [33, 145, 140], [40, 174, 128], [94, 201, 98], [170, 220, 50], [253, 231, 37]];
function densityScale(q) {
    return Math.min(1, Math.max(0, (Math.log2(q) + 3) / 9));
}

function densityColor(p, q) {
    const t = densityScale(q) * (DENSITY_COLORS.length - 1);
    const k = Math.min(DENSITY_COLORS.length - 2, Math.floor(t));
    const [a, b] = [DENSITY_COLORS[k], DENSITY_COLORS[k + 1]];
    return p.color(...a.map((v, i) => v + (b[i] - v) * (t - k)));
}

const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

// Samples the exit density along the boundary pieces, returns segments { a, b, q } and the first index of each piece
// angleOf(u) is the angle of boundary point u on the unit circle after the conformal map
function sampleExitDensity(pieces, angleOf) {
    const uniformDensity = 1 / (2 * Math.PI * SHAPE_RADIUS);
    const segments = [], pieceStarts = [];
    for (const piece of pieces) {
        pieceStarts.push(segments.length);
        const refine = (s0, s1, theta0, theta1, depth) => {
            let sweep = theta1 - theta0;
            if (sweep < 0) {
                sweep += 2 * Math.PI;
            }
            const prob = sweep / (2 * Math.PI);
            const a = piece.at(s0), b = piece.at(s1), length = dist(a, b);
            if (prob > DENSITY_SPLIT_PROB && depth < DENSITY_MAX_DEPTH) {
                const sm = (s0 + s1) / 2, thetaM = angleOf(piece.at(sm).u);
                refine(s0, sm, theta0, thetaM, depth + 1);
                refine(sm, s1, thetaM, theta1, depth + 1);
                return;
            }
            segments.push({ a, b, q: prob / length / uniformDensity });
        };
        let theta = angleOf(piece.at(0).u);
        for (let i = 0; i < piece.n; i++) {
            const next = angleOf(piece.at((i + 1) / piece.n).u);
            refine(i / piece.n, (i + 1) / piece.n, theta, next, 0);
            theta = next;
        }
    }
    return { segments, pieceStarts };
}

// Outward normal of a counterclockwise segment points along (dy, -dx)
function normalAngle({ a, b }) {
    return Math.atan2(-(b.x - a.x), b.y - a.y);
}

// Colored border outside the boundary, shifted by half its width along the outward normal
function drawDensityBoundary(p, density) {
    p.push();
    p.strokeWeight(BOUNDARY_WIDTH);
    p.strokeCap(p.SQUARE);
    for (const segment of density.segments) {
        const { a, b, q } = segment;
        const len = dist(a, b);
        const dx = 0.75 * (b.x - a.x) / len, dy = 0.75 * (b.y - a.y) / len;
        const normal = normalAngle(segment);
        const ox = Math.cos(normal) * BOUNDARY_WIDTH / 2, oy = Math.sin(normal) * BOUNDARY_WIDTH / 2;
        p.stroke(densityColor(p, q));
        p.line(a.x - dx + ox, a.y - dy + oy, b.x + dx + ox, b.y + dy + oy);
    }
    if (density.pieceStarts.length > 1) {
        // fans at the corners
        const r = BOUNDARY_WIDTH - 0.5, STEPS = 12;
        p.strokeWeight(1);
        for (const i of density.pieceStarts) {
            const before = density.segments[(i + density.segments.length - 1) % density.segments.length];
            const after = density.segments[i];
            const from = normalAngle(before), turn = Math.atan2(Math.sin(normalAngle(after) - from), Math.cos(normalAngle(after) - from));
            const c0 = densityColor(p, before.q), c1 = densityColor(p, after.q);
            const { x, y } = after.a;
            for (let k = 0; k < STEPS; k++) {
                const t0 = from + turn * k / STEPS, t1 = from + turn * (k + 1) / STEPS;
                const c = p.lerpColor(c0, c1, (k + 0.5) / STEPS);
                p.fill(c);
                p.stroke(c);
                p.triangle(x, y, x + r * Math.cos(t0), y + r * Math.sin(t0), x + r * Math.cos(t1), y + r * Math.sin(t1));
            }
        }
    }
    p.pop();
}

const PLOT_LEFT = PLOT_MARGIN, PLOT_TOP = SHAPE_AREA + PLOT_MARGIN, PLOT_BOTTOM = SHAPE_AREA + PLOT_HEIGHT;

// x and width of each segment on the unrolled boundary
function plotPositions(p, density) {
    const lengths = density.segments.map(({ a, b }) => dist(a, b));
    const total = lengths.reduce((x, y) => x + y, 0);
    const width = p.width - 2 * PLOT_MARGIN;
    let x = PLOT_LEFT;
    return lengths.map((length) => {
        const position = { x, w: width * length / total };
        x += position.w;
        return position;
    });
}

// Boundary unrolled below the shape, same log scale as the color bar
function drawDensityPlot(p, density) {
    const left = PLOT_LEFT, right = p.width - PLOT_MARGIN, top = PLOT_TOP, bottom = PLOT_BOTTOM;
    const y = (q) => bottom - (bottom - top) * densityScale(q);
    const positions = plotPositions(p, density);

    p.push();
    p.noStroke();
    density.segments.forEach(({ q }, i) => {
        const { x, w } = positions[i];
        p.fill(densityColor(p, q));
        p.rect(x, y(q), w + 0.5, bottom - y(q));
        if (i > 0 && density.pieceStarts.includes(i)) {
            p.stroke(170);
            p.strokeWeight(1);
            p.line(x, top, x, bottom);
            p.noStroke();
        }
    });
    p.stroke(170);
    p.strokeWeight(1);
    p.line(left, bottom, right, bottom);
    p.drawingContext.setLineDash([4, 4]);
    p.line(left, y(1), right, y(1));
    p.pop();
}

// Hover linking between shape and plot, set HOVER_LINK to false to turn it off
const HOVER_LINK = true;

// Also redraws once after the mouse leaves to clear the marker
function hoverNeedsRedraw(p) {
    const inside = p.mouseX >= 0 && p.mouseX < p.width && p.mouseY >= 0 && p.mouseY < p.height;
    const redraw = inside || p.hoverWasInside;
    p.hoverWasInside = inside;
    return redraw;
}

// Called in shape coordinates with origin (originX, originY) on the canvas
function drawHoverLink(p, density, originX, originY) {
    const positions = plotPositions(p, density);
    p.push();
    p.stroke(255);
    p.strokeWeight(2);

    let index = -1;
    if (p.mouseY >= PLOT_TOP && p.mouseY <= PLOT_BOTTOM && p.mouseX >= PLOT_LEFT && p.mouseX <= p.width - PLOT_MARGIN) {
        index = positions.findIndex(({ x, w }) => p.mouseX < x + w);
    } else {
        const mx = p.mouseX - originX, my = p.mouseY - originY;
        let best = BOUNDARY_WIDTH + 8;
        density.segments.forEach(({ a, b }, i) => {
            const d = Math.hypot((a.x + b.x) / 2 - mx, (a.y + b.y) / 2 - my);
            if (d < best) {
                best = d;
                index = i;
            }
        });
    }
    if (index >= 0) {
        const segment = density.segments[index], n = normalAngle(segment);
        const mid = { x: (segment.a.x + segment.b.x) / 2, y: (segment.a.y + segment.b.y) / 2 };
        p.noFill();
        p.circle(mid.x + Math.cos(n) * BOUNDARY_WIDTH / 2, mid.y + Math.sin(n) * BOUNDARY_WIDTH / 2, BOUNDARY_WIDTH + 6);
        const x = positions[index].x + positions[index].w / 2 - originX;
        p.line(x, PLOT_TOP - originY, x, PLOT_BOTTOM - originY);
    }
    p.pop();
}

// Grab distance in canvas pixels, scaled up when the canvas is shown smaller
function grabRadius(p) {
    return (p.touches.length > 0 ? 28 : 12) * p.width / p.drawingContext.canvas.clientWidth;
}

function toComplex(pointOrRe, im) {
    if (pointOrRe.re !== undefined && pointOrRe.im !== undefined) {
        return pointOrRe;
    }
    if (im !== undefined) {
        return math.complex(pointOrRe, im);
    }
    return math.complex(pointOrRe[0], pointOrRe[1]);
}

function angle(z) {
    return Math.atan2(z.im, z.re);
}

class OffsetCircleProbability {
    F3(c, x) {
        // Convert a complex number from the offset unit circle to the unit circle
        //  (x - c) / (Eigen::dcomplex(1) - x * conj(c));
        const one = math.complex(1, 0);
        const numerator = math.subtract(x, c);
        const denominator = math.subtract(one, math.multiply(x, math.conj(c)));
        return math.divide(numerator, denominator);
    }

    // u => angle of boundary point u on the unit circle
    angle_map(offset, R) {
        const c = toComplex([offset[0] / R, offset[1] / R]);
        return (u) => angle(this.F3(c, toComplex(u)));
    }
}

class SemicircleProbability {
    constructor() {
        this.offsetCircle = new OffsetCircleProbability();
    }

    // u => angle of boundary point u under G(z_k, u)
    angle_map(offset, R) {
        const f2_c = this.F2(toComplex([offset[0] / R, offset[1] / R]));
        return (u) => angle(this.offsetCircle.F3(f2_c, this.F2(toComplex(u))));
    }

    F0(z) {
        // Convert a complex number from the unit semicircle to the upper half plane
        const i = toComplex(0, 1);
        const z_minus_i = math.subtract(z, i);
        const z_plus_i = math.add(z, i);
        const numerator = math.multiply(z_minus_i, z_minus_i);
        const denominator = math.multiply(z_plus_i, z_plus_i);
        return math.divide(numerator, denominator);
    }

    F1(y) {
        // Convert a complex number from the upper half plane to the unit circle
        const i = toComplex(0, 1);
        const numerator = math.subtract(y, i);
        const denominator = math.add(y, i);
        return math.divide(numerator, denominator);
    }

    F2(z) {
        // Convert a complex number from the unit semicircle to the unit circle
        const y = this.F0(z);
        // pole at -i, F2 tends to 1 there
        if (!Number.isFinite(y.re) || !Number.isFinite(y.im)) {
            return toComplex(1, 0);
        }
        return this.F1(y);
    }
}

class CakeProbability {
    constructor(half_angle) {
        this.half_angle = half_angle;
        this.semicircle = new SemicircleProbability();
        this.offsetCircle = new OffsetCircleProbability();
    }

    F4(a, w) {
        // Convert a complex number from the unit cake to the unit semicircle
        // pow(w, π/(2a))
        return this.complexPow(w, toComplex(Math.PI / (2 * a), 0));
    }

    complexPow(base, exponent) {
        // base^exponent = exp(exponent * ln(base))
        // 0^a = 0 at the tip, ln(0) would give NaN
        if (base.re === 0 && base.im === 0) {
            return toComplex(0, 0);
        }
        return this.complexExp(math.multiply(exponent, this.complexLn(base)));
    }

    complexLn(z) {
        // natural logarithm of complex number
        return toComplex(Math.log(Math.hypot(z.re, z.im)), angle(z));
    }

    complexExp(z) {
        // exponential of complex number
        const exp_re = Math.exp(z.re);
        return toComplex(exp_re * Math.cos(z.im), exp_re * Math.sin(z.im));
    }

    // u => angle of boundary point u under H(half_angle, w_k, u)
    angle_map(offset, R) {
        const a = this.half_angle;
        const f2_c = this.semicircle.F2(this.F4(a, toComplex([offset[0] / R, offset[1] / R])));
        return (u) => angle(this.offsetCircle.F3(f2_c, this.semicircle.F2(this.F4(a, toComplex(u)))));
    }
}


// P5 sketches

// A shape gives the boundary pieces and their conformal map, the start point, the canvas x of its origin, a clamp for
// the draggable point and its outline. All coordinates are in pixels, relative to the origin.
function circleShape() {
    const D = 2 * SHAPE_RADIUS, R = D * 0.5;
    const N = 360;
    return {
        originX: SHAPE_AREA / 2,
        start: [0, 0],
        pieces: [{
            n: N - 1, at: (t) => {
                const angle = t * 2 * Math.PI;
                return { u: [Math.cos(angle), Math.sin(angle)], x: R * Math.cos(angle), y: R * Math.sin(angle) };
            }
        }],
        angleMap: (point) => new OffsetCircleProbability().angle_map(point, R),
        clamp: (x, y) => {
            const length = Math.sqrt(x * x + y * y);
            return length > D * 0.49 ? [x * D * 0.49 / length, y * D * 0.49 / length] : [x, y];
        },
        outline: (p) => p.circle(0, 0, D),
    };
}

function semicircleShape() {
    const ARC_SEGMENTS = 180;
    const LINE_SEGMENTS = 90;
    // Same area as the circle
    const D = 2 * SHAPE_RADIUS * Math.SQRT2, R = D * 0.5;

    // Counterclockwise boundary in unit coordinates, as in the reference
    const arc = {
        n: ARC_SEGMENTS, at: (t) => {
            const angle = -Math.PI / 2 + t * Math.PI;
            return { u: [Math.cos(angle), Math.sin(angle)], x: R * Math.cos(angle), y: R * Math.sin(angle) };
        }
    };
    const diameter = {
        n: LINE_SEGMENTS, at: (t) => ({ u: [0, 1 - 2 * t], x: 0, y: R * (1 - 2 * t) })
    };

    return {
        // Shift left to center the shape
        originX: SHAPE_AREA / 2 - D * 0.25,
        // Origin is on the boundary, start at D/4
        start: [D * 0.25, 0],
        pieces: [arc, diameter],
        angleMap: (point) => new SemicircleProbability().angle_map(point, R),
        // Clamp to within 0.49 D and D/100 away from the diameter
        clamp: (x, y) => {
            const rMax = D * 0.49, xMin = D * 0.01;
            const len = Math.sqrt(x * x + y * y);
            if (x >= xMin && len <= rMax) {
                return [x, y];
            }
            // Outside the circle: pull onto it, unless that lands left of the margin line
            if (len > rMax && x * rMax / len >= xMin) {
                return [x * rMax / len, y * rMax / len];
            }
            // Otherwise the nearest point is on the margin line, at most where it meets the circle
            const yMax = Math.sqrt(rMax * rMax - xMin * xMin);
            return [xMin, Math.max(-yMax, Math.min(yMax, y))];
        },
        outline: (p) => {
            p.arc(0, 0, D, D, -Math.PI / 2, Math.PI / 2, p.OPEN);
            p.line(0, -R, 0, R);
        },
    };
}

function cakeShape() {
    const halfAngle = Math.PI / 4; // 45 degrees half angle (90 degree total angle)
    const ARC_SEGMENTS = 120;
    const SIDE_SEGMENTS = 60;
    // Same area as the circle
    const D = 4 * SHAPE_RADIUS, R = D * 0.5;

    // Counterclockwise boundary in unit coordinates, as in the reference
    const arc = {
        n: ARC_SEGMENTS, at: (t) => {
            const angle = -halfAngle + t * 2 * halfAngle;
            return { u: [Math.cos(angle), Math.sin(angle)], x: R * Math.cos(angle), y: R * Math.sin(angle) };
        }
    };
    const side = (angle, r0, r1) => ({
        n: SIDE_SEGMENTS, at: (t) => {
            const r = r0 + t * (r1 - r0);
            return { u: [r * Math.cos(angle), r * Math.sin(angle)], x: R * r * Math.cos(angle), y: R * r * Math.sin(angle) };
        }
    });

    return {
        // Shift left to center the shape
        originX: SHAPE_AREA / 2 - D * 0.25,
        // Origin is the tip, start at D/4
        start: [D * 0.25, 0],
        pieces: [arc, side(halfAngle, 1, 0), side(-halfAngle, 0, 1)],
        angleMap: (point) => new CakeProbability(halfAngle).angle_map(point, R),
        // Clamp to within 0.49 D and D/100 away from both sides
        // The allowed region is the cake shrunk by that margin: a wedge with the same half-angle whose
        // tip moved right to (margin / sin(halfAngle), 0), intersected with the disk.
        clamp: (x, y) => {
            const rMax = D * 0.49;
            const tipX = D * 0.01 / Math.sin(halfAngle);
            const inDisk = (px, py) => px * px + py * py <= rMax * rMax;

            // Project onto the shrunk wedge
            let wx = x, wy = y;
            if (Math.abs(Math.atan2(y, x - tipX)) > halfAngle) {
                const ux = Math.cos(halfAngle), uy = Math.sign(y || 1) * Math.sin(halfAngle);
                const s = Math.max(0, (x - tipX) * ux + y * uy);
                wx = tipX + s * ux;
                wy = s * uy;
            }
            if (inDisk(wx, wy)) {
                return [wx, wy];
            }

            // Project onto the disk
            const len = Math.sqrt(x * x + y * y);
            const dx = x * rMax / len, dy = y * rMax / len;
            if (Math.abs(Math.atan2(dy, dx - tipX)) <= halfAngle) {
                return [dx, dy];
            }
            const ux = Math.cos(halfAngle), uy = Math.sign(y || 1) * Math.sin(halfAngle);
            const s = -tipX * ux + Math.sqrt(tipX * tipX * ux * ux - tipX * tipX + rMax * rMax);
            return [tipX + s * ux, s * uy];
        },
        // PIE strokes the arc and both sides
        outline: (p) => p.arc(0, 0, D, D, -halfAngle, halfAngle, p.PIE),
    };
}

const makeSketch = (shape) => function (p) {
    const { originX, start, pieces, angleMap, clamp, outline } = shape;
    const originY = SHAPE_AREA / 2;
    const POINT_SIZE = 8;
    const LINE_WIDTH = 3;
    let tmpX = start[0], tmpY = start[1];
    let density = null;
    let isDragging = false;
    let pointColor = "#000000";

    p.setup = function () {
        p.createCanvas(SHAPE_AREA, SHAPE_AREA + PLOT_HEIGHT);
        // Redraw only on interaction
        p.noLoop();
    };

    p.draw = function () {
        p.background("#111111");
        if (p.mouseIsPressed && isDragging) {
            [tmpX, tmpY] = clamp(p.mouseX - originX, p.mouseY - originY);
        }
        if (!density || density.start[0] !== tmpX || density.start[1] !== tmpY) {
            density = sampleExitDensity(pieces, angleMap([tmpX, tmpY]));
            density.start = [tmpX, tmpY];
        }
        drawDensityPlot(p, density);
        p.translate(originX, originY);
        drawDensityBoundary(p, density);

        p.push();
        p.drawingContext.setLineDash([10, 10]);
        p.strokeWeight(LINE_WIDTH);
        p.fill("#AAAAAA");
        p.stroke("#FFFFFF");
        outline(p);
        p.pop();

        p.push();
        p.strokeWeight(2);
        p.stroke("#FFFFFF");
        p.fill(pointColor);
        p.circle(tmpX, tmpY, POINT_SIZE);
        p.pop();
        if (HOVER_LINK) {
            drawHoverLink(p, density, originX, originY);
        }
    };

    p.mousePressed = function () {
        if (Math.hypot(p.mouseX - originX - tmpX, p.mouseY - originY - tmpY) <= grabRadius(p)) {
            isDragging = true;
            pointColor = "#3388FF";
            p.redraw();
        }
    };

    p.mouseReleased = function () {
        isDragging = false;
        pointColor = "#000000";
        p.redraw();
    };

    p.mouseMoved = function () {
        if (HOVER_LINK && hoverNeedsRedraw(p)) {
            p.redraw();
        }
    };

    p.mouseDragged = function () {
        if (isDragging) {
            p.redraw();
            return false;
        }
    };

    // Touch: keep the page from scrolling while the point is held
    p.touchStarted = function () {
        p.mousePressed();
        if (isDragging) {
            return false;
        }
    };

    p.touchEnded = function () {
        const wasDragging = isDragging;
        p.mouseReleased();
        if (wasDragging) {
            return false;
        }
    };

    p.resetSketch = function () {
        [tmpX, tmpY] = start;
        isDragging = false;
        pointColor = "#000000";
        p.redraw();
    };
};

const offsetCircleSketch = makeSketch(circleShape());
const semicircleSketch = makeSketch(semicircleShape());
const cakeSketch = makeSketch(cakeShape());


// Listener stuff

document.addEventListener('DOMContentLoaded', function () {
    const sketches = {
        'offset-circle-reset-button': new p5(offsetCircleSketch, 'offset-circle-exit-probability-canvas-wrapper'),
        'semicircle-reset-button': new p5(semicircleSketch, 'semicircle-probability-canvas-wrapper'),
        'cake-reset-button': new p5(cakeSketch, 'cake-probability-canvas-wrapper'),
    };
    for (const [buttonId, sketch] of Object.entries(sketches)) {
        document.getElementById(buttonId).addEventListener('click', () => sketch.resetSketch());
    }

    // Fill the color bar
    const colorBar = document.getElementById('density-color-bar');
    const colorBarTicks = document.getElementById('density-color-bar-ticks');
    const stops = DENSITY_COLORS.map((c, i) => `rgb(${c.join(', ')}) ${100 * i / (DENSITY_COLORS.length - 1)}%`);
    colorBar.style.background = `linear-gradient(to right, ${stops.join(', ')})`;
    for (const [label, q] of [['1/8×', 1 / 8], ['1×', 1], ['8×', 8], ['64×', 64]]) {
        const tick = document.createElement('span');
        tick.textContent = label;
        tick.style.left = `${100 * densityScale(q)}%`;
        colorBarTicks.appendChild(tick);
    }
});
