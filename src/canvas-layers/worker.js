let offscreenCanvas, ctx, backgroundImg;
let mousePosition = { x: 0, y: 0 };
const lensRadius = 70;
const zoomFactor = 3;
let pixelatedImage, newImgDataBitmap, selectedColorImage = null;

const SelectedColorSvg = `
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M80 148C117.555 148 148 117.555 148 80C148 42.4446 117.555 12 80 12C42.4446 12 12 42.4446 12 80C12 117.555 42.4446 148 80 148ZM80 160C124.183 160 160 124.183 160 80C160 35.8172 124.183 0 80 0C35.8172 0 0 35.8172 0 80C0 124.183 35.8172 160 80 160Z" fill="#D9D9D9"/>
  </svg>
`;

function getPixelData(context, x, y) {
  // const x = event.offsetX;
  // const y = event.offsetY;
  // Get the image data for the specified pixel
  const pixel = context.getImageData(x, y, 1, 1);
  const data = pixel.data;

  // Extract the RGBA values
  const r = data[0];
  const g = data[1];
  const b = data[2];
  const a = data[3];

  // Return the RGBA values
  return { r, g, b, a, };
}

// Convert SVG string to an Image
async function svgStringToImage(svgString, color) {
  let coloredSvgString = svgString;
  if (color) {
    coloredSvgString = svgString.replace('#D9D9D9', color);
  }
  
  const svgBlob = new Blob([coloredSvgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  const imgLoaded = new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
  });
  
  img.src = url;
  await imgLoaded;

  return img;
}

function componentToHex(component) {
  const hex = component.toString(16);
  return hex.length === 1 ? '0' : '' + hex;
}

function rgbToHex(r, g, b) {
  // Convert the RGB components to hex
  const rHex = componentToHex(r);
  const gHex = componentToHex(g);
  const bHex = componentToHex(b);

  // Combine and return the full hex color code
  return `#${rHex}${gHex}${bHex}`;
}


self.onmessage = async (event) => {
  const { data } = event;

  if (data.canvas) {
    // Initialize OffscreenCanvas
    offscreenCanvas = data.canvas;
    ctx = offscreenCanvas.getContext('2d');
    // Load the background image
    backgroundImg = await loadImage('https://images.pexels.com/photos/12043242/pexels-photo-12043242.jpeg');
    const { width, height } = backgroundImg;

    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    render();

    // preload and pixelate the image for zoom
    pixelatedImage = pixelateImage(4, ctx, width, height);
    const newImgData = new ImageData(pixelatedImage, width, height);
    newImgDataBitmap = await createImageBitmap(newImgData);

    // selectedColorImage = await svgStringToImage(SelectedColorSvg);
  }

  if (data.type === 'mousemove') {
    mousePosition = { x: data.x, y: data.y };
    render();
  }
};

async function loadImage(src) {
  const resp = await fetch(src);
  if (!resp.ok) {
    throw 'network error';
  }
  const blob = await resp.blob();
  image = await createImageBitmap(blob);

  return image;
}

function render() {
  if (!ctx || !backgroundImg) return;
  // Clear the canvas
  ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
  // Draw the background image
  ctx.drawImage(backgroundImg, 0, 0);
  // Draw the zoom-in lens effect
  drawZoomLens(ctx, mousePosition.x, mousePosition.y, lensRadius, zoomFactor);
}

function drawZoomLens(ctx, x, y, radius, zoom) {
  if (!newImgDataBitmap) return;

  const startX = x - radius;
  const startY = y - radius;
  const diameter = radius * 2;

  // Create an offscreen canvas to hold the zoomed circle area
  const zoomCanvas = new OffscreenCanvas(diameter, diameter);
  const zoomCtx = zoomCanvas.getContext('2d');

  // const color = getPixelData(zoomCtx, mousePosition.x, mousePosition.y);
  // const { r, g, b } = color;
  // const hexcolor = rgbToHex(r, g, b);
  // console.log(hexcolor);

  // zoomCtx.drawImage(selectedColorImage, x - selectedColorImage.width / 2, y - selectedColorImage.height / 2);

  // Draw the zoomed portion of the image onto the offscreen canvas
  zoomCtx.drawImage(
    newImgDataBitmap,
    startX - (radius / zoom),
    startY - (radius / zoom),
    diameter / zoom,
    diameter / zoom,
    0,
    0,
    diameter,
    diameter
  );

  // Clip and draw the zoomed circle onto the main canvas
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.clip();
  ctx.drawImage(zoomCanvas, startX, startY);
  ctx.restore();
}

function pixelateImage(pixelSize, ctx, width, height) {
  // get image pixels data from (0, 0) to (width, height)
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const newImageLayout = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const red = [];
      const green = [];
      const blue = [];
      const alpha = [];

      for (let yy = 0; yy < pixelSize; yy++) {
        for (let xx = 0; xx < pixelSize; xx++) {
          const px = (x + xx + (y + yy) * width) * 4;

          if (px < data.length) {
            red.push(data[px]);
            green.push(data[px + 1]);
            blue.push(data[px + 2]);
            alpha.push(data[px + 3]);
          }
        }
      }

      // Calculate the average color of the block
      const r = average(red);
      const g = average(green);
      const b = average(blue);
      const a = average(alpha);

      // Set the color of each pixel in the block to the average color
      for (let yy = 0; yy < pixelSize; yy++) {
        for (let xx = 0; xx < pixelSize; xx++) {
          const px = (x + xx + (y + yy) * width) * 4;

          if (px < data.length) {
            newImageLayout[px] = r;
            newImageLayout[px + 1] = g;
            newImageLayout[px + 2] = b;
            newImageLayout[px + 3] = a;
          }
        }
      }
    }
  }

  return newImageLayout;
}

function average(arr) {
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}