const mainCanvas = document.getElementById('mainCanvas');
const mainCtx = mainCanvas.getContext('2d');

// Offscreen canvas for lens
const lensCanvas = document.createElement('canvas');
const lensCtx = lensCanvas.getContext('2d');

const image = new Image();
image.src = 'https://images.pexels.com/photos/12043242/pexels-photo-12043242.jpeg';
image.crossOrigin = 'Anonymous';
image.onload = () => {
  mainCanvas.width = image.width;
  mainCanvas.height = image.height;
  mainCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
};

// Lens settings
const lensRadius = 60;
const pixelSize = 5;
const zoomFactor = 10;
lensCanvas.width = lensRadius * 2;
lensCanvas.height = lensRadius * 2;

const worker = new Worker('worker.js');
// Handle messages from the worker
// worker.onmessage = (event) => {
//   if (event.data === 'eventName') {
//
//   }
// };

// Mouse move event listener
mainCanvas.addEventListener('mousemove', (event) => {
  const rect = mainCanvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  drawLens(mouseX, mouseY);
});

function drawLens(mouseX, mouseY) {
  // Clear previous lens content
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  // Draw background image onto the main canvas
  mainCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);

  // Calculate source coordinates for the lens
  const sx = Math.max(0, Math.min(image.width - lensCanvas.width / zoomFactor, mouseX - lensRadius / zoomFactor));
  const sy = Math.max(0, Math.min(image.height - lensCanvas.height / zoomFactor, mouseY - lensRadius / zoomFactor));
  // const sx = Math.max(0, mouseX);
  // const sy = Math.max(0, mouseY);

  // Get the image data from the zoomed area (expensive operation)
  // const imageData = mainCtx.getImageData(mouseX - lensRadius, mouseY - lensRadius, 2 * lensRadius, 2 * lensRadius);
  // const data = imageData.data; // { colorSpace: "srgb", height: 120, width: 120 }

  // worker.postMessage({ canvas: lensCanvas.transferControlToOffscreen(), imageSrc: image.src }, [lensCanvas]);
  
  // Draw zoomed portion on the offscreen canvas
  lensCtx.clearRect(0, 0, lensCanvas.width, lensCanvas.height);
  const cropWidth = lensCanvas.width / zoomFactor;
  const cropHeight = lensCanvas.height / zoomFactor;
  const givenWidth = lensCanvas.width;
  const givenHeight = lensCanvas.height;
  lensCtx.drawImage(image, sx, sy, cropWidth, cropHeight, 0, 0, givenWidth, givenHeight);

  // Clip and draw the lens on the main canvas
  mainCtx.save();
  mainCtx.beginPath();
  mainCtx.arc(mouseX, mouseY, lensRadius, 0, Math.PI * 2);
  mainCtx.clip();
  mainCtx.drawImage(lensCanvas, mouseX - lensRadius, mouseY - lensRadius);
  mainCtx.restore();

  // Draw lens border
  mainCtx.beginPath();
  mainCtx.arc(mouseX, mouseY, lensRadius, 0, Math.PI * 2);
  mainCtx.strokeStyle = 'white';
  mainCtx.lineWidth = 3;
  mainCtx.stroke();
}
