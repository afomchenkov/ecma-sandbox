let canvas, ctx, image, imageLoaded = false;
let x = 100, y = 100, radius = 20, speed = 2;

self.onmessage = async (event) => {
  if (event.data.canvas) {
    canvas = event.data.canvas;
    ctx = canvas.getContext('2d');

    const resp = await fetch(event.data.imageSrc);
    if (!resp.ok) {
      throw 'network error';
    }
    const blob = await resp.blob();
    image = await createImageBitmap(blob);
    imageLoaded = true;
    
    // const { width, height } = image;
    // const canvas = new OffscreenCanvas(width, height);
    // const ctx = canvas.getContext('2d');
    // ctx.drawImage(image, 0, 0);

    drawMovingObject();
    self.postMessage('requestAnimationFrame');
    // image.close();
    // const imgData = ctx.getImageData(0, 0, width, height);

    // image = new Image();
    // image.src = event.data.imageSrc;
    // image.onload = () => {
    //   imageLoaded = true;
    //   drawMovingObject();
    //   self.postMessage('requestAnimationFrame');
    // };
  } else if (event.data === 'animationFrame') {
    updatePosition();
    drawMovingObject();
    self.postMessage('requestAnimationFrame');
  }
};

function drawMovingObject() {
  if (!imageLoaded) return;
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw the static background image for OffscreenCanvas
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  // Draw the moving object
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
}

function updatePosition() {
  x += speed;
  if (x - radius < 0 || x + radius > canvas.width) {
    x = radius;
  }
}