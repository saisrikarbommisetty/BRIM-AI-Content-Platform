/**
 * Preprocesses an image (JPG/JPEG/PNG) client-side.
 * Resizes the image if its dimensions exceed 2048px (preserving aspect ratio)
 * and compresses it using canvas to a reasonable JPEG quality (0.85).
 * If the original image is already small or the compressed version is not smaller,
 * it returns the original file to avoid unnecessary quality loss.
 */
export async function preprocessImage(file: File): Promise<{
  file: File;
  originalSize: number;
  optimizedSize: number;
  isCompressed: boolean;
}> {
  const originalSize = file.size;

  // Only preprocess JPG, JPEG, PNG
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const isTargetImage = ['jpg', 'jpeg', 'png'].includes(fileExtension || '') || 
                        ['image/jpeg', 'image/png'].includes(file.type);

  if (!isTargetImage) {
    return { file, originalSize, optimizedSize: originalSize, isCompressed: false };
  }

  // Create an image element and load the file
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const MAX_DIM = 2048;
          let width = img.width;
          let height = img.height;
          let needsResize = false;

          if (width > MAX_DIM || height > MAX_DIM) {
            needsResize = true;
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          // If the image is small (e.g. <= 200KB) and doesn't need resize, skip compression
          // to prevent unnecessary quality loss.
          if (!needsResize && originalSize <= 200 * 1024) {
            resolve({ file, originalSize, optimizedSize: originalSize, isCompressed: false });
            return;
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            console.warn('Canvas context could not be created, falling back to original image.');
            resolve({ file, originalSize, optimizedSize: originalSize, isCompressed: false });
            return;
          }

          // Fill with white background (important for transparent PNGs converted to JPEG)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Draw the image
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with quality 0.85
          // 0.85 provides excellent detail retention for OCR/AI Vision while reducing file size drastically.
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                console.warn('Canvas toBlob returned null, falling back to original image.');
                resolve({ file, originalSize, optimizedSize: originalSize, isCompressed: false });
                return;
              }

              // Only use the compressed file if it's actually smaller than the original
              if (blob.size < originalSize) {
                // Determine name and extension
                let newName = file.name;
                const lastDot = file.name.lastIndexOf('.');
                const baseName = lastDot !== -1 ? file.name.substring(0, lastDot) : file.name;
                // If it was PNG, we converted it to JPEG for efficient compression
                const newExt = fileExtension === 'png' ? 'jpg' : fileExtension;
                newName = `${baseName}_optimized.${newExt}`;

                const optimizedFile = new File([blob], newName, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });

                resolve({
                  file: optimizedFile,
                  originalSize,
                  optimizedSize: optimizedFile.size,
                  isCompressed: true,
                });
              } else {
                // If compressed version is larger (e.g. already compressed high-ratio file), keep original
                resolve({ file, originalSize, optimizedSize: originalSize, isCompressed: false });
              }
            },
            'image/jpeg',
            0.85
          );
        } catch (err) {
          console.error('Error during image processing, falling back to original:', err);
          resolve({ file, originalSize, optimizedSize: originalSize, isCompressed: false });
        }
      };

      img.onerror = () => {
        console.error('Failed to load image element, falling back to original.');
        resolve({ file, originalSize, optimizedSize: originalSize, isCompressed: false });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      console.error('FileReader failed to read image file, falling back to original.');
      resolve({ file, originalSize, optimizedSize: originalSize, isCompressed: false });
    };

    reader.readAsDataURL(file);
  });
}
