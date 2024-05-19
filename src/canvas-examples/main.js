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
  }

  #draw(x, y) {
    const length = 300;

    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    // this.#ctx.lineTo(x + length, y + length);
    // move line after mouse coursor
    this.#ctx.lineTo(mouse.x, mouse.y);
    this.#ctx.stroke();
  }

  animate(timeStamp) {
    // measuring delta time for faster animation serving
    let deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;

    if (this.timer > this.interval) {
      // this.#draw(this.x, this.y);
      // start from the center
      // this.#draw(this.#width / 2, this.#height / 2);
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      // make circular movements
      this.#draw(this.#width / 2 + Math.sin(this.angle) * 100, this.#height / 2 + Math.cos(this.angle) * 100);
    } else {
      this.timer += deltaTime;
    }

    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    this.angle += 0.1;

    console.log('animating');
    flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}