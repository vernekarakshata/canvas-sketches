const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const params = {
  invert: false,
  speed: 30
}

const sketch = ({ width, height }) => {
  let steps = 0;
  let x, y;
  const w = width * 0.10, h = height * 0.10;
  const ix = width * 0.17, iy = height * 0.17;
  const gap = width * 0.03, off = width * 0.02;

  return ({ context, width, height }) => {
    context.lineWidth = width * 0.01;
    steps++;

    if (steps === params.speed) {
      context.clearRect(0, 0, width, height);

      if (params.invert) {
        context.fillStyle = "#000000";
        context.fillRect(0, 0, width, height);
        context.strokeStyle = "#FFFFFF"
      }

      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          x = ix + (w + gap) * i;
          y = iy + (h + gap) * j;
          drawRect(context, x, y, w, h);

          if (Math.random() > 0.5) {
            drawRect(context, x + off / 2, y + off / 2, w - off, h - off);
          }
        }
      }
      steps = 0;
    }
  };
};

const drawRect = (context, x, y, w, h) => {
  context.beginPath();
  context.rect(x, y, w, h);
  context.stroke();
}
const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  folder = pane.addFolder({
    title: 'Square-Sketch',
  });
  folder.addInput(params, 'invert');
}
createPane();

canvasSketch(sketch, settings);
