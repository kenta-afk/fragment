import type { ChangeEventHandler } from "react";

type DiaryFormProps = {
  diaryText: string;
  onDiaryTextChange: (value: string) => void;
  onWallpaperChange: ChangeEventHandler<HTMLInputElement>;
  onSaveScreenshot: () => void;
  onPostX: () => void;
};

export function DiaryForm({
  diaryText,
  onDiaryTextChange,
  onWallpaperChange,
  onSaveScreenshot,
  onPostX,
}: DiaryFormProps) {
  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <h2>入力</h2>
        <p>下書きを書いて、壁紙を選んだら、そのまま画像とX投稿に使えます。</p>
      </div>

      <label className="field">
        <span>日記</span>
        <textarea
          value={diaryText}
          onChange={(event) => onDiaryTextChange(event.target.value)}
          placeholder="今日の出来事を書きましょう"
        />
      </label>

      <label className="field">
        <span>壁紙画像</span>
        <input type="file" accept="image/*" onChange={onWallpaperChange} />
      </label>

      <div className="actions">
        <button type="button" onClick={onSaveScreenshot}>
          スクリーンショットを保存
        </button>
        <button type="button" className="x-button" onClick={onPostX}>
          X に投稿
        </button>
      </div>
    </section>
  );
}