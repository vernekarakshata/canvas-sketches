const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const lineParams = {
  width: 5
};

const stripParams = {
  count: 10,
  height: 1,
  width: 2
};

const arcParams = {
  sradius: 0.2,
  eradius: 1.5
};

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  fps: 5,
  playbackRate: 'throttle'
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    // Center Point
    const cx = width * 0.5;
    const cy = height * 0.5;

    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    const num = stripParams.count;
    const radius = width * 0.3;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      drawRect(context, x, y, w, h, angle);
      drawArc(context, cx, cy, radius, angle, slice);
    }
  };
};

const drawRect = (context, x, y, w, h, angle) => {
  context.save();
  context.translate(x, y);
  context.rotate(-angle);
  context.scale(
    random.range(0.1, stripParams.width),
    random.range(0.2, stripParams.height)
  );

  context.beginPath();
  context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
  context.fill();
  context.restore();
};

const drawArc = (context, cx, cy, r, angle, slice) => {
  context.save();
  context.translate(cx, cy);
  context.rotate(-angle);
  context.lineWidth = random.range(1, lineParams.width);
  context.beginPath();
  const arcRadius = r * random.range(arcParams.sradius, arcParams.eradius);
  const sAngle = slice * random.range(1, -8);
  const eAngle = slice * random.range(1, 5);
  context.arc(0, 0, arcRadius, sAngle, eAngle);
  context.stroke();
  context.restore();
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Strip' });
  folder.addInput(stripParams, 'count', { min: 2, max: 1000, step: 1 });
  folder.addInput(stripParams, 'width', { min: 1, max: 10, step: 0.01 });
  folder.addInput(stripParams, 'height', { min: 0.1, max: 2, step: 0.01 });

  folder = pane.addFolder({ title: 'Arc' });
  folder.addInput(arcParams, 'sradius', { min: 0, max: 0.5, step: 0.001 });
  folder.addInput(arcParams, 'eradius', { min: 0.8, max: 1.5, step: 0.001 });

  folder = pane.addFolder({ title: 'Line' });
  folder.addInput(lineParams, 'width', { min: 0, max: 20, step: 1 });
};

createPane();

canvasSketch(sketch, settings);
