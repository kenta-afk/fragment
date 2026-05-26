import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { DiaryForm } from "./components/DiaryForm";
import { DiaryList } from "./components/DiaryList";
import { Header } from "./components/Header";
import { useScreenshot } from "./hooks/useScreenshot";
import { useXPost } from "./hooks/useXPost";

function App() {
  const [diaryText, setDiaryText] = useState("");
  const [wallpaperDataUrl, setWallpaperDataUrl] = useState("");
  const { saveScreenshot } = useScreenshot();
  const { postToX } = useXPost();

  const previewText = useMemo(
    () => diaryText.trim() || "今日の出来事を書きましょう",
    [diaryText],
  );

  const handleWallpaperChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const [file] = event.target.files || [];
    if (!file) {
      setWallpaperDataUrl("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setWallpaperDataUrl(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveScreenshot = () => {
    saveScreenshot({
      text: previewText,
      wallpaperDataUrl,
    });
  };

  const handlePostX = () => {
    postToX(diaryText.trim() || "今日の日記");
  };

  return (
    <main className="app-shell">
      <Header />
      <section className="app-grid">
        <DiaryForm
          diaryText={diaryText}
          onDiaryTextChange={setDiaryText}
          onWallpaperChange={handleWallpaperChange}
          onSaveScreenshot={handleSaveScreenshot}
          onPostX={handlePostX}
        />
        <DiaryList previewText={previewText} wallpaperDataUrl={wallpaperDataUrl} />
      </section>
    </main>
  );
}

export default App;