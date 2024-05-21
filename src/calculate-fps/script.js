const mainCanvas = document.getElementById('mainCanvas');
const mainCtx = mainCanvas.getContext('2d');

let frameCount = 0;
let lastTime = performance.now();
let fps = 0;
const fpsInterval = 1000; // Calculate FPS every second

function draw() {
  const now = performance.now();
  const deltaTime = now - lastTime;

  // Update frame count
  frameCount++;

  // Calculate FPS every fpsInterval
  if (deltaTime >= fpsInterval) {
    fps = (frameCount / deltaTime) * 1000;
    frameCount = 0;
    lastTime = now;
  }

  // Clear the canvas
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

  // Draw a sample animation (e.g., a moving circle)
  const x = (now / 10) % mainCanvas.width;
  mainCtx.beginPath();
  mainCtx.arc(x, mainCanvas.height / 2, 20, 0, Math.PI * 2);
  mainCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  mainCtx.fill();
  mainCtx.closePath();

  // Display FPS on the canvas
  mainCtx.font = '20px Arial';
  mainCtx.fillStyle = 'black';
  mainCtx.fillText(`FPS: ${Math.round(fps)}`, 10, 30);

  // Request the next frame
  requestAnimationFrame(draw);
}

// Start the animation loop
draw();