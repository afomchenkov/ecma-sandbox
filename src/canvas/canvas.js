document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');

  const canvas = document.getElementById('main-canvas');
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.src = '../assets/1920x1080-beach-water.jpg';

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Additional processing can go here
  };

  img.onerror = function () {
    console.error('Failed to load the image.');
  };
});

function generateRandomColor() {
  return {
    r: Math.random() * 255,
    g: Math.random() * 255,
    b: Math.random() * 255,
    a: 1
  };
};
