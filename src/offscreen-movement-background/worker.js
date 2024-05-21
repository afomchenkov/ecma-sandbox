self.onmessage = async (event) => {
  const { data } = event;

  if (data.canvas) {
    const canvas = data.canvas;
    const ctx = canvas.getContext('2d');

    self.offscreenCanvas = canvas;
    self.offscreenCtx = ctx;
  }

  if (data.type === 'renderBackground') {
    const img = await loadImage(data.img);
    self.backgroundImg = img;

    // set background size to the original image size
    self.offscreenCanvas.width = img.width;
    self.offscreenCanvas.height = img.height;

    renderBackground();
  }

  if (data.type === 'mousemove') {
    const { x, y } = data;
    // calculateHeavyMovement(x, y);
    zoomInCirclePixels(x, y);
  }
};

async function loadImage(src) {
  // return new Promise((resolve) => {
  //   const img = new Image();
  //   img.src = src;
  //   img.onload = () => resolve(img);
  // });

  const resp = await fetch(src);
  if (!resp.ok) {
    throw 'network error';
  }
  const blob = await resp.blob();
  const image = await createImageBitmap(blob);
  // image.close();
  return image;
}

function renderBackground() {
  if (self.backgroundImg) {
    self.offscreenCtx.drawImage(self.backgroundImg, 0, 0);
    // self.postMessage({ type: 'renderFrame', frame: self.offscreenCanvas });
  }
}

function zoomInCirclePixels(centerX, centerY) {
  if (!self.offscreenCanvas || !self.offscreenCtx) {
    return;
  }

  const canvas = self.offscreenCanvas;
  const context = self.offscreenCtx;
  const image = self.backgroundImg;

  const zoomRadius = 70; // Radius of the circular zoom area
  const pixelSize = 13; // Size of each square pixel in the zoomed display

  // clear and re-draw image
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Get the image data from the zoomed area
  const imageData = context.getImageData(centerX - zoomRadius, centerY - zoomRadius, 2 * zoomRadius, 2 * zoomRadius);
  const data = imageData.data;

  // Save the current context state
  context.save();
  // Create a circular clipping path
  context.beginPath();
  context.arc(centerX, centerY, zoomRadius, 0, 2 * Math.PI);
  context.clip();

  // Draw each pixel as a zoomed-in square in the zoomed area
  for (let y = 0; y < 2 * zoomRadius; y++) {
    for (let x = 0; x < 2 * zoomRadius; x++) {
      const index = (y * 2 * zoomRadius + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3] / 255;

      // Set the fill style to the pixel's color
      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

      // Calculate the position for the zoomed pixel
      const pixelX = centerX + (x - zoomRadius) * pixelSize;
      const pixelY = centerY + (y - zoomRadius) * pixelSize;

      // Draw the rectangle for the zoomed pixel
      context.fillRect(pixelX, pixelY, pixelSize, pixelSize);
    }
  }

  // Restore the context to remove the clipping path
  context.restore();

  // Draw lens border
  context.beginPath();
  context.arc(centerX, centerY, zoomRadius, 0, Math.PI * 2);
  context.strokeStyle = 'white';
  context.lineWidth = 3;
  context.stroke();
}

function calculateHeavyMovement(x, y) {
  // Perform heavy calculations here
  // Example: move an object based on the mouse position

  self.offscreenCtx.clearRect(0, 0, self.offscreenCanvas.width, self.offscreenCanvas.height);
  renderBackground();

  // Example object
  const objectSize = 20;
  self.offscreenCtx.fillStyle = 'red';
  self.offscreenCtx.fillRect(x - objectSize / 2, y - objectSize / 2, objectSize, objectSize);

  self.postMessage({ type: 'renderFrame', frame: self.offscreenCanvas });
}
