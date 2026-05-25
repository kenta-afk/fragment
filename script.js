const diaryInput = document.getElementById("diary-input");
const wallpaperInput = document.getElementById("wallpaper-input");
const screenshotButton = document.getElementById("screenshot-button");
const postButton = document.getElementById("post-button");
const diaryPreviewCard = document.getElementById("diary-preview-card");
const diaryPreviewText = document.getElementById("diary-preview-text");

let wallpaperDataUrl = "";

function syncPreviewText() {
  diaryPreviewText.textContent =
    diaryInput.value.trim() || "今日の出来事を書きましょう";
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = [];
  const paragraphs = text.split("\n");

  paragraphs.forEach((paragraph) => {
    if (!paragraph) {
      lines.push("");
      return;
    }

    let line = "";
    for (const char of paragraph) {
      const testLine = line + char;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
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

async function saveDiaryScreenshot() {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#eef2ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (wallpaperDataUrl) {
    try {
      const wallpaperImage = await loadImage(wallpaperDataUrl);
      const sourceRatio = wallpaperImage.width / wallpaperImage.height;
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

      ctx.drawImage(wallpaperImage, drawX, drawY, drawWidth, drawHeight);
    } catch (error) {
      console.error("壁紙の読み込みに失敗しました", error);
    }
  }

  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1f2430";
  ctx.font = "48px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.textBaseline = "top";

  const text = diaryInput.value.trim() || "今日の出来事を書きましょう";
  drawWrappedText(ctx, text, 72, 72, canvas.width - 144, 72);

  const link = document.createElement("a");
  link.download = "diary-screenshot.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function postToX() {
  const text = diaryInput.value.trim() || "今日の日記";
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(tweetUrl, "_blank", "noopener,noreferrer");
}

diaryInput.addEventListener("input", syncPreviewText);
wallpaperInput.addEventListener("change", (event) => {
  const [file] = event.target.files || [];
  if (!file) {
    wallpaperDataUrl = "";
    diaryPreviewCard.style.backgroundImage = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    wallpaperDataUrl = String(reader.result);
    diaryPreviewCard.style.backgroundImage = `url("${wallpaperDataUrl}")`;
  };
  reader.readAsDataURL(file);
});
screenshotButton.addEventListener("click", saveDiaryScreenshot);
postButton.addEventListener("click", postToX);

syncPreviewText();
