export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: PixelCrop
): Promise<File> => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise<void>((resolve) => {
    image.onload = () => resolve();
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Nepodařilo se vytvořit 2D kontext pro canvas.");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas je prázdný, nepodařilo se vytvořit blob."));
        return;
      }
      resolve(new File([blob], "cropped-image.webp", { type: "image/webp" }));
    }, "image/webp");
  });
};