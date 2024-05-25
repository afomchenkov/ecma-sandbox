let offscreenCanvas, ctx, backgroundImg;
let mousePosition = { x: 0, y: 0 };
const lensRadius = 75;
const zoomFactor = 2;
let pixelatedImage, newImgDataBitmap, selectedColorImage, circleSvgBitmap = null;

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

async function loadSvg(svgString) {
  // Create a Blob from the SVG string
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  // Use fetch to load the SVG as a response
  const response = await fetch(url);
  const svgText = await response.text();
  URL.revokeObjectURL(url); // Revoke the URL as soon as possible


  // Create an image bitmap from the SVG text
  const svgBlobForBitmap = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const bitmap = await createImageBitmap(svgBlobForBitmap);

  // return bitmap;
}

// Convert SVG string to an Image
// async function svgStringToImage(svgString, color) {
//   let coloredSvgString = svgString;
//   if (color) {
//     coloredSvgString = svgString.replace('#D9D9D9', color);
//   }
  
//   const svgBlob = new Blob([coloredSvgString], { type: 'image/svg+xml;charset=utf-8' });
//   const url = URL.createObjectURL(svgBlob);
//   const img = new Image();

//   const imgLoaded = new Promise((resolve, reject) => {
//     img.onload = () => {
//       URL.revokeObjectURL(url);
//       resolve(img);
//     };
//     img.onerror = reject;
//   });
  
//   img.src = url;
//   await imgLoaded;

//   return img;
// }

function componentToHex(component) {
  const hex = component.toString(16);
  return hex.length === 1 ? '0' : '' + hex;
}

function rgbToHex(colors) {
  const { r, g, b } = colors;
  const rHex = componentToHex(r);
  const gHex = componentToHex(g);
  const bHex = componentToHex(b);
  return `#${rHex}${gHex}${bHex}`.padEnd(7, 0);
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
    newImgDataBitmap = await createImageBitmap(new ImageData(pixelatedImage, width, height));
    // circleSvgBitmap = await loadSvg(SelectedColorSvg);

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

  // Calculate the index of the pixel
  const index = getPixelIndex(x, y, offscreenCanvas.width);

  // Log the pixel data at the clicked position
  const r = pixelatedImage[index];
  const g = pixelatedImage[index + 1];
  const b = pixelatedImage[index + 2];
  const a = pixelatedImage[index + 3];

  const hex = rgbToHex({ r, g, b });
  console.log({ r, g, b, a, hex });

  // zoomCtx.drawImage(selectedColorImage, x - selectedColorImage.width / 2, y - selectedColorImage.height / 2);

  // Draw the zoomed portion of the image onto the offscreen canvas
  zoomCtx.drawImage(
    newImgDataBitmap,
    x - (radius / zoom),
    y - (radius / zoom),
    diameter / zoom,
    diameter / zoom,
    0,
    0,
    diameter,
    diameter
  );

  const textX = radius - 30;
  const textY = radius + 20;

  drawRoundedRect(zoomCtx, textX - 5, textY - 15, 75, 20, 5);

  zoomCtx.font = '16px Arial';
  zoomCtx.fillStyle = hex;
  zoomCtx.fillText(hex, textX, textY);

  // // Draw lens border
  // zoomCtx.beginPath();
  // zoomCtx.arc(diameter / zoom, diameter / zoom, radius, 0, Math.PI * 2);
  // zoomCtx.strokeStyle = hex;
  // zoomCtx.lineWidth = 16;
  // zoomCtx.stroke();

  // // Draw outer lens border
  // zoomCtx.beginPath();
  // zoomCtx.arc(diameter / zoom, diameter / zoom, radius, 0, Math.PI * 2);
  // zoomCtx.strokeStyle = 'white';
  // zoomCtx.lineWidth = 1;
  // zoomCtx.stroke();

  // Clip and draw the zoomed circle onto the main canvas
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.clip();
  ctx.drawImage(zoomCanvas, startX, startY);
  ctx.restore();

  // Draw lens border
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = hex;
  ctx.lineWidth = 10;
  ctx.stroke();

  // Draw outer lens border
  // ctx.beginPath();
  // ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
  // ctx.strokeStyle = 'grey';
  // ctx.lineWidth = 1;
  // ctx.stroke();

  // // Draw inner lens border
  // ctx.beginPath();
  // ctx.arc(x, y, radius - 5, 0, Math.PI * 2);
  // ctx.strokeStyle = 'white';
  // ctx.lineWidth = 1;
  // ctx.stroke();
}

function pixelateImage(pixelSize, ctx, width, height) {
  const { data: pixels } = ctx.getImageData(0, 0, width, height);
  const newImageLayout = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const red = [];
      const green = [];
      const blue = [];
      const alpha = [];

      for (let yy = 0; yy < pixelSize; yy++) {
        for (let xx = 0; xx < pixelSize; xx++) {
          const px = (x + xx + (y + yy) * width) * 4;

          if (px < pixels.length) {
            red.push(pixels[px]);
            green.push(pixels[px + 1]);
            blue.push(pixels[px + 2]);
            alpha.push(pixels[px + 3]);
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

          if (px < pixels.length) {
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

function getPixelIndex(x, y, width) {
  return (y * width + x) * 4;
}

function average(arr) {
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}

function invertColor(r, g, b) {
  // Invert each component
  const invertedR = 255 - r;
  const invertedG = 255 - g;
  const invertedB = 255 - b;

  return {
    r: invertedR,
    g: invertedG,
    b: invertedB,
  };
}

function drawRoundedRect(ctx, x, y, width, height, radius, color) {
  ctx.fillStyle = color || 'grey';
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  ctx.fill();
}
