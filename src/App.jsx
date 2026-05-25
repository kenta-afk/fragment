import { useMemo, useState } from 'react'
import './App.css'

function App() {
  const [diaryText, setDiaryText] = useState('')
  const [wallpaperDataUrl, setWallpaperDataUrl] = useState('')
  const previewText = useMemo(
    () => diaryText.trim() || '今日の出来事を書きましょう',
    [diaryText],
  )

  const onWallpaperChange = (event) => {
    const [file] = event.target.files || []
    if (!file) {
      setWallpaperDataUrl('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setWallpaperDataUrl(String(reader.result || ''))
    }
    reader.readAsDataURL(file)
  }

  const loadImage = (source) =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = source
    })

  const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const lines = []
    const paragraphs = text.split('\n')

    paragraphs.forEach((paragraph) => {
      if (!paragraph) {
        lines.push('')
        return
      }

      let line = ''
      for (const char of paragraph) {
        const testLine = line + char
        if (ctx.measureText(testLine).width > maxWidth && line) {
          lines.push(line)
          line = char
        } else {
          line = testLine
        }
      }
      lines.push(line)
    })

    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight)
    })
  }

  const onSaveScreenshot = async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1080

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#eef2ff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (wallpaperDataUrl) {
      try {
        const image = await loadImage(wallpaperDataUrl)
        const sourceRatio = image.width / image.height
        const targetRatio = canvas.width / canvas.height
        let drawWidth = canvas.width
        let drawHeight = canvas.height
        let drawX = 0
        let drawY = 0

        if (sourceRatio > targetRatio) {
          drawWidth = canvas.height * sourceRatio
          drawX = (canvas.width - drawWidth) / 2
        } else {
          drawHeight = canvas.width / sourceRatio
          drawY = (canvas.height - drawHeight) / 2
        }

        ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
      } catch {
        // noop
      }
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#1f2430'
    ctx.font = '48px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
    ctx.textBaseline = 'top'
    drawWrappedText(ctx, previewText, 72, 72, canvas.width - 144, 72)

    const link = document.createElement('a')
    link.download = 'diary-screenshot.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const onPostX = () => {
    const text = diaryText.trim() || '今日の日記'
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="container">
      <section className="panel">
        <h1>fragment diary</h1>
        <label className="field">
          <span>日記</span>
          <textarea
            value={diaryText}
            onChange={(event) => setDiaryText(event.target.value)}
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

      <section className="panel">
        <h2>プレビュー</h2>
        <article
          className="diary-card"
          style={{ backgroundImage: wallpaperDataUrl ? `url("${wallpaperDataUrl}")` : 'none' }}
        >
          <p>{previewText}</p>
        </article>
      </section>
    </main>
  )
}

export default App
