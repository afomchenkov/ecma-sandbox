const mainCanvas = document.getElementById('mainCanvas');
const mainCtx = mainCanvas.getContext('2d');
const scaleFactor = 1;

// Image to be loaded and pixelated
const image = new Image();
image.src = 'https://images.pexels.com/photos/12043242/pexels-photo-12043242.jpeg';
image.crossOrigin = 'Anonymous';
image.onload = () => {
  mainCanvas.width = image.width * scaleFactor;
  mainCanvas.height = image.height * scaleFactor;
  mainCtx.scale(scaleFactor, scaleFactor);

  mainCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);

  // https://stackoverflow.com/questions/60031536/difference-between-imagebitmap-and-imagedata
  const newImageLayout = pixelateImage(6); // Change the pixel size as needed
  const newImgData = new ImageData(newImageLayout, mainCanvas.width, mainCanvas.height);

  mainCtx.putImageData(newImgData, 0, 0);
};

function pixelateImage(pixelSize) {
  const width = mainCanvas.width;
  const height = mainCanvas.height;
  // get image pixels data from (0, 0) to (width, height)
  const imageData = mainCtx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const newImageLayout = new Uint8ClampedArray(data.length);

  /**
   * Canvas pixels layout
   *
   * +------------------+
   * |     .(x, y)      |
   * |                  |
   * |                  |
   * +------------------+
   */
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const red = [];
      const green = [];
      const blue = [];
      const alpha = [];

      /**
       * Extract specific block of size 'pixelSize'
       * 
       * +------------------+
       * |     +-+          |
       * |     | |          |
       * |     +-+          |
       * +------------------+
       * 
       * Collect color data from the pixel block to calculate increased pixel color as an average value
       */
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

          // if (px < data.length) {
          //   data[px] = r;
          //   data[px + 1] = g;
          //   data[px + 2] = b;
          //   data[px + 3] = a;
          // }
          
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

  // Put the modified image data back onto the canvas
  // mainCtx.putImageData(imageData, 0, 0);

  return newImageLayout;
}

function average(arr) {
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}