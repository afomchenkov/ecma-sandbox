const componentToHex = (component: number) => {
  const hex = component.toString(16);
  return hex.length === 1 ? '0' : '' + hex;
}

export const rgbaToHex = (
  r: number,
  g: number,
  b: number,
  a: number = 1,
) => {
  // Ensure the alpha value is between 0 and 1
  if (a > 1) a = 1;
  if (a < 0) a = 0;

  // Convert the RGB components to hex
  const rHex = componentToHex(r);
  const gHex = componentToHex(g);
  const bHex = componentToHex(b);
  // Convert the alpha component to hex (0 to 255 range)
  const aHex = componentToHex(Math.round(a * 255));

  return `#${rHex}${gHex}${bHex}${aHex}`;
}

export const rgbToHex = (
  r: number,
  g: number,
  b: number
) => {
  // Convert the RGB components to hex
  const rHex = componentToHex(r);
  const gHex = componentToHex(g);
  const bHex = componentToHex(b);

  // Combine and return the full hex color code
  return `#${rHex}${gHex}${bHex}`;
}
