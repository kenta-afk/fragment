type ScreenshotInput = {
  text: string;
  wallpaperDataUrl: string;
};

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = source;
  });
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): void {
  const lines: string[] = [];
  const paragraphs = text.split("\n");

  paragraphs.forEach((paragraph) => {
    if (!paragraph) {
      lines.push("");
      return;
    }

    let line = "";
    for (const char of paragraph) {
      const testLine = line + char;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        lines.push(line);
        line = char;
      } else {
        line = testLine;
      }
    }

    lines.push(line);
  });

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

export function useScreenshot() {
  const saveScreenshot = async ({
    text,
    wallpaperDataUrl,
  }: ScreenshotInput): Promise<void> => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#eef2ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (wallpaperDataUrl) {
      try {
        const image = await loadImage(wallpaperDataUrl);
        const sourceRatio = image.width / image.height;
        const targetRatio = canvas.width / canvas.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let drawX = 0;
        let drawY = 0;

        if (sourceRatio > targetRatio) {
          drawWidth = canvas.height * sourceRatio;
          drawX = (canvas.width - drawWidth) / 2;
        } else {
          drawHeight = canvas.width / sourceRatio;
          drawY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
      } catch {
        // Ignore image loading failures and keep the fallback background.
      }
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1f2430";
    ctx.font = "48px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    ctx.textBaseline = "top";
    drawWrappedText(ctx, text, 72, 72, canvas.width - 144, 72);

    const link = document.createElement("a");
    link.download = "diary-screenshot.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return { saveScreenshot };
}
