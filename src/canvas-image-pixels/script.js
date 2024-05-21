const mainCanvas = document.getElementById('mainCanvas');
const mainCtx = mainCanvas.getContext('2d');

// Image to be loaded and pixelated
const image = new Image();
image.src = 'https://images.pexels.com/photos/12043242/pexels-photo-12043242.jpeg';
image.crossOrigin = 'Anonymous';
image.onload = () => {
  mainCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
  pixelateImage(4); // Change the pixel size as needed
};

function pixelateImage(pixelSize) {
  const width = mainCanvas.width;
  const height = mainCanvas.height;
  // get image pixels data from (0, 0) to (width, height)
  const imageData = mainCtx.getImageData(0, 0, width, height);
  const data = imageData.data;

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
          
          if (px < data.length) {
            data[px] = r;
            data[px + 1] = g;
            data[px + 2] = b;
            data[px + 3] = a;
          }
        }
      }
    }
  }

  // Put the modified image data back onto the canvas
  mainCtx.putImageData(imageData, 0, 0);
}

function average(arr) {
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}