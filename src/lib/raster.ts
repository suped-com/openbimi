export async function traceRasterFile(file: File) {
  const bitmap = await createImageBitmap(file);
  const size = Math.min(512, Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("This browser could not prepare the image.");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, size, size);
  const scale = Math.min(size / bitmap.width, size / bitmap.height);
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;
  context.drawImage(bitmap, (size - width) / 2, (size - height) / 2, width, height);
  bitmap.close();

  const ImageTracer = (await import("imagetracerjs")).default;
  return ImageTracer.imagedataToSVG(context.getImageData(0, 0, size, size), {
    ltres: 1,
    qtres: 1,
    pathomit: 8,
    colorsampling: 2,
    numberofcolors: 8,
    mincolorratio: 0.02,
    colorquantcycles: 3,
    scale: 1,
    roundcoords: 1,
    viewbox: true,
    desc: false,
  });
}
