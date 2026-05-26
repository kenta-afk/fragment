import type { CSSProperties } from "react";

type DiaryListProps = {
  previewText: string;
  wallpaperDataUrl: string;
};

export function DiaryList({ previewText, wallpaperDataUrl }: DiaryListProps) {
  const backgroundStyle: CSSProperties = {
    backgroundImage: wallpaperDataUrl ? `url("${wallpaperDataUrl}")` : "none",
  };

  return (
    <section className="panel preview-panel">
      <div className="panel-heading">
        <h2>プレビュー</h2>
        <p>保存するとこの見た目をベースに 1080px の画像を生成します。</p>
      </div>

      <article
        className="diary-card"
        style={backgroundStyle}
      >
        <p>{previewText}</p>
      </article>
    </section>
  );
}