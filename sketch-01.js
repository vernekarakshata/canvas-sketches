const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  fps: 1.2,
  playbackRate: 'throttle',
};

const params = {
  stroke: '#000000',
  background: '#ffffff',
  lineWidth: 0.01,
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = params.background;
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * params.lineWidth;

    const w = width * 0.1;
    const h = height * 0.1;
    const gap = width * 0.03;

    const ix = width * 0.17;
    const iy = height * 0.17;

    const off = width * 0.02;

    context.strokeStyle = params.stroke;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = ix + (w + gap) * i;
        y = iy + (h + gap) * j;

        context.beginPath();
        context.rect(x, y, w, h);
        context.stroke();

        if (Math.random() > 0.5) {
          context.beginPath();
          context.rect(x + off / 2, y + off / 2, w - off, h - off);
          context.stroke();
        }
      }
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Properties' });
  pane.addInput(params, 'stroke', {
    picker: 'inline',
    expanded: false,
  });
  pane.addInput(params, 'background', {
    picker: 'inline',
    expanded: false,
  });

  folder.addInput(params, 'lineWidth', { min: 0.001, max: 0.02, step: 0.001 });
};

createPane();

canvasSketch(sketch, settings);
