# AI 文明座標

互動圖表。橫軸是時間，縱軸是這些人工智慧突破對人類文明的影響，0 到 100。

**網站：** [https://zlo-25.github.io/AI-Bot-Timeline/](https://zlo-25.github.io/AI-Bot-Timeline/)

實心圓點是已經發生的事。今天之後的空心圓點是預測：分數表示「若發生」，不是發生機率，也不跟已發生的事排在一起。分數是同一把尺下的編輯評估（觸及、能力、鎖定、後果，各 25 分），不是測量值。預測的日期是情節，不是產品時程。

## 怎麼用

- 拖曳下方的時間軸，或點「全史」「2012 起」「2022 起」「未來」
- 點圓點，看四項分數與說明
- 「沿時間播放」會依序走過這個視窗裡的節點

## 本機

需要 Node.js 22。

```bash
npm install
npm run dev
```

開發伺服器在 `http://127.0.0.1:8080`。

## GitHub Pages

網站由 `gh-pages` 分支提供，網址見上方。`main` 是原始碼。

更新網站時，在本機建置靜態頁，再把 `dist-pages/client` 裡的檔案推上 `gh-pages`：

```bash
npm run build:pages
```

網站掛在子路徑 `/AI-Bot-Timeline/`。如果倉庫改名，建置前把 `PAGES_BASE` 改成新的路徑。
