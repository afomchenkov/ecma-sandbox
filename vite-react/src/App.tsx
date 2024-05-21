import { useEffect, useState, useRef } from 'react';
import { rgbToHex } from './utils';

import ColorPickerSvg from './assets/color-picker.svg';
// import SelectedColorSvg from './assets/selected-color.svg';

const SelectedColorSvg = `
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M80 148C117.555 148 148 117.555 148 80C148 42.4446 117.555 12 80 12C42.4446 12 12 42.4446 12 80C12 117.555 42.4446 148 80 148ZM80 160C124.183 160 160 124.183 160 80C160 35.8172 124.183 0 80 0C35.8172 0 0 35.8172 0 80C0 124.183 35.8172 160 80 160Z" fill="#D9D9D9"/>
  </svg>
`;

import './App.css';

type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
}

const RATIO = .5;

const loadImage = async (imageUrl: string): Promise<HTMLImageElement> => {
  if (!imageUrl) {
    throw new Error('Image URL is not provided');
  }

  const img = new Image();
  img.crossOrigin = 'Anonymous';

  const imgLoaded = new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
  
  img.src = imageUrl;
  await imgLoaded;

  return img;
}

const drawImage = (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): void => {
  canvas.width = image.width * RATIO;
  canvas.height = image.height * RATIO;

  // draw full size image
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  image.style.display = 'none';
}

const getPixelData = (
  event: MouseEvent,
  context: CanvasRenderingContext2D
): RGBAColor => {
  const x = event.offsetX;
  const y = event.offsetY;
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

const zoomInCirclePixels = (
  centerX: number,
  centerY: number,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
) => {
  const zoomRadius = 70; // Radius of the circular zoom area
  const pixelSize = 11; // Size of each square pixel in the zoomed display

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

// Convert SVG string to an Image
const svgStringToImage = async (svgString: string, color?: string): Promise<HTMLImageElement> => {
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

// Draw the SVG at the cursor position
const drawSvgAtCursor = (
  x: number,
  y: number,
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  rgbColor: RGBAColor
  ): void => {
  // Clear the canvas
  // context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image on the canvas centered at the cursor position
  context.drawImage(image, x - image.width / 2, y - image.height / 2);
}

const App = () => {
  const canvasRef = useRef<HTMLElement | null>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [hexColor, setHexColor] = useState<string>('--');

  /**
   * Canvas X/Y
   * 
   * +----------------+
   * |(0, 0)          |
   * |                |
   * | cursor - (x, y)|
   * +----------------+
   */
  
  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    if (canvas) {
      canvasRef.current = canvas;
      const context = canvas.getContext('2d');

      if (context) {
        canvasContextRef.current = context;

        loadImage('https://images.pexels.com/photos/12043242/pexels-photo-12043242.jpeg')
          .then(async (image) => {
            drawImage(image, canvas, context);

            // click - mousemove
            canvas.addEventListener('mousemove', async (event) => {
              const rect = canvas.getBoundingClientRect();
              const x = event.clientX - rect.left;
              const y = event.clientY - rect.top;
      
              zoomInCirclePixels(x, y, canvas, context, image);

              const color = getPixelData(event, context);
              const { r, g, b } = color;
              const hexcolor = rgbToHex(r, g, b);
              setHexColor(hexcolor);

              // const selectedColorImage = await svgStringToImage(SelectedColorSvg, hexcolor);
              // drawSvgAtCursor(x, y, selectedColorImage, canvas, context, color);
            });
          });
      }
    }

  }, [])

  return (
    <>
      <header className='app-header'>
        <div className='app-color-picker'>
          <img src={ColorPickerSvg} alt='color picker' />
        </div>
        <div className='app-hex-color'>
          <span>{hexColor}</span>
        </div>
      </header>
      <main className='app-canvas-container'>
        <canvas id="canvas"></canvas>
      </main>
    </>
  )
}

export default App
