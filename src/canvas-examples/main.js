let canvas;
let ctx;
let flowField;
let flowFieldAnimation;

// set up canvas
window.onload = function () {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
}

// resize canvas window
window.addEventListener('resize', function () {
  cancelAnimationFrame(flowFieldAnimation);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
});

const mouse = {
  x: 0,
  y: 0,
};

window.addEventListener('mousemove', function (e) {
  mouse.x = e.x;
  mouse.y = t.y;
});

class FlowFieldEffect {
  #ctx;
  #width;
  #height;

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#height = height;
    this.#width = width;
    this.#ctx.strokeStyle = 'white';
    this.#ctx.lineWidth = 5;
    this.angle = 0;

    this.lastTime = 0;
    this.interval = 1000 / 60; // 60fps
    this.timer = 0;
    this.cellSize = 15;
    this.gradient;
    this.#createGradient();
    this.#ctx.strokeStyle = this.gradient;
  }

  #drawLine(x, y) {
    const length = 300;

    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    // this.#ctx.lineTo(x + length, y + length);
    // move line after mouse coursor
    this.#ctx.lineTo(mouse.x, mouse.y);
    this.#ctx.stroke();
  }

  #createGradient() {
    this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
    this.gradient.addColorStop('0.1', '#ff5c33');
    this.gradient.addColorStop('0.2', '#ff66b2');
    this.gradient.addColorStop('0.4', '#ccccff');
    this.gradient.addColorStop('0.6', '#b3ffff');
    this.gradient.addColorStop('0.9', '#80ff80');
    this.gradient.addColorStop('0.9', '#ffff33');
  }

  animate(timeStamp) {
    // measuring delta time for faster animation serving
    let deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;

    if (this.timer > this.interval) {
      // this.#drawLine(this.x, this.y);
      // start from the center
      // this.#drawLine(this.#width / 2, this.#height / 2);
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      // make circular movements
      this.#drawLine(this.#width / 2 + Math.sin(this.angle) * 100, this.#height / 2 + Math.cos(this.angle) * 100);
      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }

    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    this.angle += 0.1;

    console.log('animating');
    flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }

  drawGrid(timeStamp) {
    // measuring delta time for faster animation serving
    let deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;

    if (this.timer > this.interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height);

      for (let y = 0; y < this.#height; y += this.cellSize) {
        for (let x = 0; x < this.#width; x += this.cellSize) {
          this.#drawLine(x, y);
        }
      }

      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }
    flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}