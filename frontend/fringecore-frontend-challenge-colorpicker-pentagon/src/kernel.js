export const kernelFunction = function (width, height, hue) {
  const i = this.thread.x;
  const y = Math.floor(i / (width * 4));
  const x = Math.floor(i / 4 - y * width);
  const channel = i % 4;
  const normalizedX = x / width;
  const normalizedY = y / height;

  const h = hue * 6;
  const e = 1;
  const x_hsv = e * (1 - Math.abs(h % 2 - 1));
  let r = 0, g = 0, b = 0;
  
  if (h < 1) { r = e; g = x_hsv; b = 0; }
  else if (h < 2) { r = x_hsv; g = e; b = 0; }
  else if (h < 3) { r = 0; g = e; b = x_hsv; }
  else if (h < 4) { r = 0; g = x_hsv; b = e; }
  else if (h < 5) { r = x_hsv; g = 0; b = e; }
  else { r = e; g = 0; b = x_hsv; }
  
  r = r + (1 - r) * (1 - normalizedX);
  g = g + (1 - g) * (1 - normalizedX);
  b = b + (1 - b) * (1 - normalizedX);
  
  r *= (1 - normalizedY);
  g *= (1 - normalizedY);
  b *= (1 - normalizedY);
  

  if (channel == 0) return r * 255;  // Red
  if (channel == 1) return g * 255;  // Green
  if (channel == 2) return b * 255;  // Blue
  return 255; 
};
