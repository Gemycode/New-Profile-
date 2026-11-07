// Resizes an image in the browser and encodes it as WebP, so uploads match /public/work
// (800w and 1600w) without any server-side image processing.

async function toWebp(bitmap: ImageBitmap, width: number, quality: number): Promise<Blob> {
  const w = Math.min(width, bitmap.width) // never upscale
  const h = Math.round((bitmap.height / bitmap.width) * w)
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas is not available in this browser")
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(bitmap, 0, 0, w, h)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality))
  if (!blob || blob.type !== "image/webp") throw new Error("This browser can't encode WebP; try Chrome, Edge or Firefox")
  return blob
}

export async function prepareImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file")
  if (file.size > 25 * 1024 * 1024) throw new Error("Image is larger than 25 MB")
  const bitmap = await createImageBitmap(file)
  try {
    const [w800, w1600] = await Promise.all([toWebp(bitmap, 800, 0.78), toWebp(bitmap, 1600, 0.82)])
    return { w800, w1600, width: bitmap.width, height: bitmap.height }
  } finally {
    bitmap.close()
  }
}
