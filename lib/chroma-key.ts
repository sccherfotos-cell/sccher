import sharp from "sharp";

const THRESHOLD_LOW = 18; // fully transparent below this color distance from the sampled background
const THRESHOLD_HIGH = 55; // fully opaque above this distance

/**
 * Removes a near-uniform background color from an image, turning it
 * transparent. Samples the background color from the four corners, then
 * fades alpha based on each pixel's color distance from that sample.
 */
export async function removeBackground(input: Buffer): Promise<Buffer> {
  const image = sharp(input).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const corners = [
    0,
    (width - 1) * channels,
    (height - 1) * width * channels,
    ((height - 1) * width + (width - 1)) * channels,
  ];

  let br = 0;
  let bg = 0;
  let bb = 0;
  for (const c of corners) {
    br += data[c];
    bg += data[c + 1];
    bb += data[c + 2];
  }
  br /= corners.length;
  bg /= corners.length;
  bb /= corners.length;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const dist = Math.sqrt((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2);

    let alpha: number;
    if (dist <= THRESHOLD_LOW) alpha = 0;
    else if (dist >= THRESHOLD_HIGH) alpha = 255;
    else alpha = Math.round(((dist - THRESHOLD_LOW) / (THRESHOLD_HIGH - THRESHOLD_LOW)) * 255);

    data[i + 3] = alpha;
  }

  return sharp(data, { raw: { width, height, channels } })
    .trim()
    .png()
    .toBuffer();
}
