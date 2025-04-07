const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const eases = require('eases');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const params = {
  stroke: '#ffffff',
  background: '#000000',
  lineWidth: 0.01,
  circles: 20
};

const particles = [];
const cursor1 = { x: 9999, y: 9999 };

let elCanvas;

const sketch = ({ width, height, canvas }) => {
  let x, y, particle, radius;
  let pos = [];
  const numCircles = 20;
  const gapCircles = 8;
  const gapDot = 4;
  let dotRadius = 12;
  let cirRadius = 0;
  const fitRadius = dotRadius;

  elCanvas = canvas;
  canvas.addEventListener('pointerdown', onMouseDown);

  for (let i = 0; i < numCircles; i++) {
    const circumferance = Math.PI * 2 * cirRadius;
    const numFit = i ? Math.floor(circumferance / (fitRadius * 2 + gapDot)) : 1;
    const fitSlice = (Math.PI * 2) / numFit;
    for (let j = 0; j < numFit; j++) {
      const theta = fitSlice * j;

      x = Math.cos(theta) * cirRadius;
      y = Math.sin(theta) * cirRadius;

      x += width * 0.5;
      y += height * 0.5;

      radius = dotRadius;

      particle = new Particle({ x, y, radius });
      particles.push(particle);
    }
    cirRadius += fitRadius * 2 + gapCircles;
    dotRadius = (1 - eases.quadOut(i / numCircles)) * fitRadius;
  }

  return ({ context, width, height }) => {
    context.fillStyle = params.background;
    context.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw(context);
    });
  };
};

const onMouseDown = (e) => {
  window.addEventListener('pointermove', onMouseMove);
  window.addEventListener('pointerup', onMouseUp);

  onMouseMove(e);
};

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  cursor1.x = x;
  cursor1.y = y;
};

const onMouseUp = (e) => {
  window.removeEventListener('pointermove', onMouseMove);
  window.removeEventListener('pointerup', onMouseUp);
  cursor1.x = 9999;
  cursor1.y = 9999;
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Properties' });
  pane.addInput(params, 'stroke', {
    picker: 'inline',
    expanded: false
  });
  pane.addInput(params, 'background', {
    picker: 'inline',
    expanded: false
  });
};

createPane();

canvasSketch(sketch, settings);

class Particle {
  constructor({ x, y, radius = 10 }) {
    // position
    this.x = x;
    this.y = y;

    // acceleration
    this.ax = 0;
    this.ay = 0;

    // velocity
    this.vx = 0;
    this.vy = 0;

    // initial position
    this.ix = x;
    this.iy = y;

    this.radius = radius;

    this.minDist = random.range(100, 300);
    this.pushFactor = random.range(0.01, 0.02);
    this.pullFactor = random.range(0.002, 0.006);
    this.dampFactor = random.range(0.9, 0.95);
  }

  update() {
    let dx, dy, dd, disDelta;

    // pull force
    dx = this.ix - this.x;
    dy = this.iy - this.y;

    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    // push force
    dx = this.x - cursor1.x;
    dy = this.y - cursor1.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    disDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * disDelta * this.pushFactor;
      this.ay += (dy / dd) * disDelta * this.pushFactor;
    }

    // this.ax += 0.001;
    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.dampFactor;
    this.vy *= this.dampFactor;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);

    context.fillStyle = params.stroke;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}
