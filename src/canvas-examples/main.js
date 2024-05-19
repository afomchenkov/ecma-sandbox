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
  flowField.animate();
}

// resize canvas window
window.addEventListener('resize', function () {
  cancelAnimationFrame(flowFieldAnimation);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate();
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

    // this.#draw(10, 10);
    // this.x = 0;
    // this.y = 0;
  }

  #draw(x, y) {
    const length = 300;

    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x + length, y + length);
    this.#ctx.stroke();
  }

  animate() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    // this.#draw(this.x, this.y);
    // start from the center
    this.#draw(this.#width / 2, this.#height / 2);

    // this.x += 0.5;
    // this.y += 2.5;

    console.log('animating');
    flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}