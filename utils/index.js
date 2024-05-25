function pixelateImage(pixelSize, ctx, width, height) {
    const { data: pixels } = ctx.getImageData(0, 0, width, height);

    // Create a new Uint8ClampedArray for the pixelated image
    const pixelatedData = new Uint8ClampedArray(pixels.length);

    // Process the image pixels to create the pixelation effect
    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            const red = pixels[((width * y) + x) * 4];
            const green = pixels[((width * y) + x) * 4 + 1];
            const blue = pixels[((width * y) + x) * 4 + 2];
            const alpha = pixels[((width * y) + x) * 4 + 3];

            // Fill the pixel block with the average color
            for (let py = 0; py < pixelSize; py++) {
                for (let px = 0; px < pixelSize; px++) {
                    if (x + px < width && y + py < height) {
                        const index = ((width * (y + py)) + (x + px)) * 4;
                        pixelatedData[index] = red;
                        pixelatedData[index + 1] = green;
                        pixelatedData[index + 2] = blue;
                        pixelatedData[index + 3] = alpha;
                    }
                }
            }
        }
    }

    // Add grey delimiter lines between pixels
    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            // Draw horizontal line
            for (let px = 0; px < pixelSize; px++) {
                if (x + px < width && y + pixelSize < height) {
                    const index = ((width * (y + pixelSize)) + (x + px)) * 4;
                    pixelatedData[index] = 128;      // Grey color
                    pixelatedData[index + 1] = 128;
                    pixelatedData[index + 2] = 128;
                    pixelatedData[index + 3] = 255;  // Fully opaque
                }
            }
            // Draw vertical line
            for (let py = 0; py < pixelSize; py++) {
                if (x + pixelSize < width && y + py < height) {
                    const index = ((width * (y + py)) + (x + pixelSize)) * 4;
                    pixelatedData[index] = 128;      // Grey color
                    pixelatedData[index + 1] = 128;
                    pixelatedData[index + 2] = 128;
                    pixelatedData[index + 3] = 255;  // Fully opaque
                }
            }
        }
    }

    return pixelatedData;
};
