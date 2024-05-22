let offscreenCanvas, ctx, backgroundImg;
let objectPosition = { x: 0, y: 0 };

self.onmessage = async (event) => {
  const { data } = event;

  if (data.canvas) {
    // Initialize OffscreenCanvas
    offscreenCanvas = data.canvas;
    ctx = offscreenCanvas.getContext('2d');
    // Load the background image
    backgroundImg = await loadImage('https://images.pexels.com/photos/12043242/pexels-photo-12043242.jpeg');
    drawZoom();
  }

  if (data.type === 'mousemove') {
    objectPosition = { x: data.x, y: data.y };
    // self.postMessage({ type: 'renderFrame', frame: offscreenCanvas });
    drawZoom();
  }
};

async function loadImage(src) {
  const resp = await fetch(src);
  if (!resp.ok) {
    throw 'network error';
  }
  const blob = await resp.blob();
  const image = await createImageBitmap(blob);
  // image.close();
  return image;
}

function drawZoom() {
  if (!ctx || !backgroundImg) return;

  const radius = 70; // Radius of the moving object, the circular zoom area
  const pixelSize = 14; // Size of each square pixel in the zoomed display

  const centerX = objectPosition.x;
  const centerY = objectPosition.y;

  // Clear the main canvas
  ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  // Draw the offscreen canvas (background image) onto the main canvas
  ctx.drawImage(backgroundImg, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

  // Get the image data from the zoomed area
  const imageData = ctx.getImageData(centerX - radius, centerY - radius, 2 * radius, 2 * radius);
  const data = imageData.data;

  // Save the current context state
  ctx.save();
  // Create a circular clipping path
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.clip();

  // Draw each pixel as a zoomed-in square in the zoomed area
  for (let y = 0; y < 2 * radius; y++) {
    for (let x = 0; x < 2 * radius; x++) {
      const index = (y * 2 * radius + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3] / 255;

      // Set the fill style to the pixel's color
      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

      // Calculate the position for the zoomed pixel
      const pixelX = centerX + (x - radius) * pixelSize;
      const pixelY = centerY + (y - radius) * pixelSize;

      // Draw the rectangle for the zoomed pixel
      ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
    }
  }

  // Restore the context to remove the clipping path
  ctx.restore();
}
