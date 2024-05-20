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
    renderBackground();
  }

  if (data.type === 'mousemove') {
    const { x, y } = data;
    calculateHeavyMovement(x, y);
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
