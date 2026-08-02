declare module "imagetracerjs" {
  type TraceOptions = Record<string, string | number | boolean>;

  const ImageTracer: {
    imagedataToSVG(imageData: ImageData, options?: TraceOptions): string;
  };

  export default ImageTracer;
}
