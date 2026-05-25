# 香港畢業旅行網站・專案交接文件

> 給下一個 Claude session 或其他 AI agent：這份文件涵蓋所有你需要繼續這個專案的資訊。

---

## 專案概覽

**名稱**：香港四天三夜畢業旅行網站  
**用途**：讓 13 人團體清楚掌握香港行程、餐廳資訊、飲食禁忌  
**旅行日期**：2026 年 6 月 29 日（一）至 7 月 2 日（四）  
**技術**：純靜態 HTML/CSS/JS，無需建置步驟，直接開啟檔案或部署到 GitHub Pages  
**本機預覽**：`python -m http.server 5500`（launch.json 已設好）

**GitHub Repo**：https://github.com/lml679939-cmyk/hk-graduation-trip  
**GitHub Pages（公開網址）**：https://lml679939-cmyk.github.io/hk-graduation-trip/  
（Pages 已啟用：main branch / root，設定後 1–2 分鐘生效）

---

## 檔案結構

```
/
├── index.html          行程表頁（Day 1–4，Day 3/4 目前顯示「規劃中」）
├── food.html           餐食資訊頁（餐廳卡片 + 13 人飲食禁忌表）
├── map.html            景點地圖頁（Leaflet.js + OpenStreetMap）
├── CLAUDE.md           本文件（交接 / AI agent 說明）
├── assets/
│   ├── style.css       全域樣式（港式復古海報風設計系統）
│   ├── data.js         行程資料（ITINERARY）+ 餐廳資料（RESTAURANTS）+ 飲食調查（SURVEY）
│   ├── app.js          行程頁 & 餐食頁的 DOM 渲染邏輯
│   ├── map.js          景點地圖渲染邏輯（Leaflet 初始化、標記、篩選 tab）
│   └── player.js       浮動音樂播放器（港樂點唱機）
├── .claude/
│   └── launch.json     preview server 設定（port 5500）
├── 香港去哪裡.md        原始行程規劃（Google Docs 匯出，極大檔案，勿用 Read 工具直接讀）
└── 香港行_餐食相關.xlsx 原始餐廳資料（openpyxl 可讀）
```

> ⚠️ `香港去哪裡.md` 約 550KB，單行超長，Read 工具會 token overflow。
> 用 `sed -n 'Xp' 香港去哪裡.md` 按行號讀取（Day1=line6–19, Day2=line20–29, Day3=line30–37, Day4=line38–末）。

---

## 設計系統

**風格**：香港復古海報 / 紅白藍尼龍袋感  
**字型**：Noto Serif TC（標題）+ Noto Sans TC（內文）  

| CSS 變數 | 顏色 | 用途 |
|---|---|---|
| `--navy` | `#16306e` | 主色、邊框、header |
| `--navy-2` | `#1f4bb8` | 連結 |
| `--red` | `#d4332f` | 強調、時間、按鈕 |
| `--yellow` | `#f4c01e` | 點綴、active 狀態 |
| `--cream` | `#f3ecdc` | 背景 |

**紅白藍條紋**：`.stripe-bar`（header/footer 上下分隔）

---

## 資料格式說明

### 新增 Day 3 / Day 4 行程（最重要的待辦）

開啟 `assets/data.js`，找到 ITINERARY 陣列的 Day 3 物件（`day: 3`）：

```js
// 把 status 改成 "done"，填入以下欄位：
{
  day: 3,
  date: "7/1（三）",
  status: "done",           // ← 從 "soon" 改為 "done"
  title: "地區名 → 地區名", // 當天移動路線（用 → 箭頭，勿用 ⭢ 或 ➔）
  route: "景點A → 景點B → …", // header 顯示的路線摘要
  items: [
    {
      time: "10:00",         // 時間字串
      act: "行程描述",        // 可含 HTML（<b>、<a>、<span class='route-label'>）
      places: [              // 可省略（無景點時不加）
        {
          name: "景點名",
          desc: "逛街/拍照/etc",
          url: "Google Maps 連結或空字串",
          lat: 22.3xxx,      // ← 必填！地圖頁會用到
          lng: 114.1xxx      // ← 必填！地圖頁會用到
        }
      ],
      note: "備註文字"        // 可含 HTML，可省略（空字串）
    },
    // … 更多時段
  ]
}
```

**⚠️ 箭頭符號**：一律用 `→`（U+2192），禁止使用 `⭢`（U+2BA2）或 `➔`（U+2794），後兩者在 Android 手機無法顯示。

`act` 欄位支援的 HTML class：
- `<span class='route-label'>總體路線</span>` — 路線標籤黃底
- `<span class='meal-tag'>午餐</span>` — 紅底餐種標籤
- `<a href="…" target="_blank">餐廳名</a>` — 連結
- `<b>粗體地名</b>` — 粗體強調

### Day 3 / Day 4 補完後還需做：地圖顏色設定

開啟 `assets/map.js`，在 `DAY_COLORS` 物件加入新天數：

```js
const DAY_COLORS = {
  1: { color: "#d4332f", label: "Day 1　旺角" },
  2: { color: "#16306e", label: "Day 2　灣仔・堅尼地城・尖沙咀" },
  3: { color: "#c87c00", label: "Day 3　XXX" },   // ← 補充
  4: { color: "#2e7d32", label: "Day 4　XXX" },   // ← 補充
};
```

顏色建議：Day 3 用橘棕色、Day 4 用深綠色（與 Day 1 紅、Day 2 深藍區隔）。

### 新增餐廳

在 `RESTAURANTS` 陣列加一個物件：

```js
{
  name: "餐廳名",
  cap: "yes",   // "yes"=可容13人⭕ / "no"=不行❌ / "?"=待確認
  addr: "🚇 地鐵站\n地址",
  hours: "星期一至日 HH:MM–HH:MM",
  review: "評論 / 推薦品項",
  book: "+852 XXXX XXXX\t訂位方式",
  other: "其他注意事項"
}
```

### 新增播放器歌曲

在 `assets/player.js` 的 `PLAYLIST` 陣列中對應歌手加：

```js
{ t: "歌名", id: "YouTube影片ID" }
```

YouTube 影片 ID = `https://www.youtube.com/watch?v=` 後面那段（11 個字元）。

新歌手格式：
```js
{ artist: "歌手名", songs: [ { t: "歌名", id: "ID" } ] }
```

---

## 功能清單

### ✅ 已完成

| 功能 | 說明 |
|---|---|
| 行程頁 | Day 1、Day 2 完整時間軸；Day 3/4 預留「規劃中」 |
| Day tab 切換 | 點標籤切換天數；Day 3/4 按鈕灰階 disabled |
| 景點地圖連結（膠囊） | 行程頁膠囊樣式，點擊開 Google Maps |
| 景點地圖頁 | `map.html`：Leaflet.js + OpenStreetMap，Day 1 紅標、Day 2 深藍標，Day tab 篩選，點標記顯示 popup |
| Day 1、Day 2 GPS 座標 | 共 17 個景點已填入 `lat`/`lng`（在 data.js 的 places 陣列） |
| 餐食分頁 | 15 間餐廳卡片，含所有欄位資訊 |
| 容納人數篩選 | 按 ⭕/❌ 篩選適合 13 人的餐廳 |
| 飲食禁忌速查表 | 12 人的吃辣 + 禁忌食材 |
| 浮動音樂播放器 | 12 首港樂（Beyond / 李克勤 / 陳奕迅 / 張學友 / 譚詠麟）|
| 上一首 / 下一首 | 順序播放 |
| 隨機播放 | Fisher–Yates 洗牌，記憶隨機佇列可回上一首 |
| 自動接播 | YouTube `postMessage`（`onStateChange: 0`）偵測影片結束自動播下一首 |
| 響應式設計 | 手機友善（560px 斷點），標題最小 44px 確保白紅重疊效果 |

### 🔲 尚未完成 / 規劃中

| 功能 | 優先度 | 說明 |
|---|---|---|
| Day 3 行程 | ⭐⭐⭐ | 用戶說之後會補；格式見上方；記得同步補 GPS 座標 + map.js DAY_COLORS |
| Day 4 行程 | ⭐⭐⭐ | 同上 |
| 經費試算 | ⭐⭐ | 已規劃：新頁面，匯率換算 + 人均費用，資料待用戶提供 |
| 餐廳卡片照片 | ⭐ | 待用戶提供照片 |

---

## 景點地圖（map.html）技術說明

- **Library**：Leaflet 1.9.4（CDN），OpenStreetMap tiles
- **資料來源**：讀取 `ITINERARY` 中各 `items[].places[]` 有 `lat`/`lng` 的物件
- **標記顏色**：由 `map.js` 的 `DAY_COLORS` 物件控制（補 Day 3/4 時需更新）
- **Popup**：景點名 + 描述 + Google Maps 連結（用 places 的 `url` 欄位）
- **篩選**：「全部 / Day 1 / Day 2」tab，自動從 ITINERARY 生成（補 Day 3/4 自動出現）

### Day 1、Day 2 已填入座標的景點

| Day | 景點 | lat | lng |
|---|---|---|---|
| 1 | 彌敦街 | 22.3193 | 114.1694 |
| 1 | 朗豪坊 | 22.3185 | 114.1686 |
| 1 | 星際城市 | 22.3156 | 114.1677 |
| 1 | 女人街 | 22.3191 | 114.1704 |
| 1 | 波鞋街 | 22.3190 | 114.1693 |
| 1 | 花園街 | 22.3253 | 114.1723 |
| 1 | 旺角天橋 | 22.3222 | 114.1699 |
| 1 | 金魚街 | 22.3232 | 114.1711 |
| 2 | 堅尼地城籃球場 | 22.2822 | 114.1281 |
| 2 | Winstons Coffee | 22.2830 | 114.1285 |
| 2 | 叮叮老香港辦館 | 22.2831 | 114.1283 |
| 2 | % Arabica | 22.2837 | 114.1267 |
| 2 | 海濱公園 | 22.2820 | 114.1261 |
| 2 | 九龍公園 | 22.3014 | 114.1699 |
| 2 | 星光大道 | 22.2892 | 114.1715 |
| 2 | 尖沙咀鐘樓 | 22.2939 | 114.1710 |
| 2 | 天星碼頭 | 22.2940 | 114.1686 |

---

## 原始資料來源

| 檔案 | 說明 | 讀取方式 |
|---|---|---|
| `香港去哪裡.md` | Google Docs 匯出的行程表，68 行但每行極長 | `sed -n '6,19p'`（Day1）/ `sed -n '20,29p'`（Day2）/ `sed -n '30,37p'`（Day3）/ `sed -n '38,68p'`（Day4）|
| `香港行_餐食相關.xlsx` | Google Sheets 匯出，兩張工作表：餐廳資訊 + 餐食調查 | `python -c "import openpyxl…"` 或直接讀 data.js（已整理） |

---

## 已驗證的 YouTube 連結（player.js）

所有 video ID 均已透過網路搜尋驗證為官方或原版：

| 歌手 | 歌曲 | Video ID |
|---|---|---|
| （合輯） | 香港90年代經典粵語金曲30首 | `nvYahoAmkCQ` |
| Beyond | 海闊天空（Official MV） | `V4GUy2EHMMs` |
| Beyond | 光輝歲月（Official MV） | `PrGsAMbgUh4` |
| Beyond | 真的愛你（Official MV） | `to7JtGUZhrQ` |
| Beyond | 喜歡你（Official MV） | `U-bvp_hsinw` |
| 李克勤 | 紅日（Official MV） | `rkNjRZF97Sc` |
| 李克勤 | 月半小夜曲（Live 2002） | `6FM7kARun4w` |
| 李克勤 | 護花使者（原版）| `ek8cGBoAv8w` |
| 陳奕迅 | 富士山下（Official MV） | `ghnT1uOwfrY` |
| 陳奕迅 | 浮誇（UMG 官方） | `0xFFGzZq75w` |
| 張學友 | 吻別（高清音） | `o2Sg9WAcEWo` |
| 譚詠麟 | 朋友（官方 MV） | `us2AQCaG0P4` |

---

## 本機開發指引

```powershell
# 啟動 preview server（.claude/launch.json 已設定）
python -m http.server 5500
# 然後開 http://localhost:5500/index.html
```

Claude Code 裡可直接用 preview_start（name: "hk-trip"）啟動。

## 部署流程（GitHub Pages）

```bash
# 修改完後，推上 GitHub，Pages 自動更新（約 1 分鐘）
git add .
git commit -m "補充 Day 3 行程"
git push

# 查看線上網址
# https://lml679939-cmyk.github.io/hk-graduation-trip/
```

> **注意**：git push 使用 Git Credential Manager（Windows），GitHub Desktop 登入後的 token 會自動帶入，不需要另外輸入密碼。若遇到認證問題，重新開啟 GitHub Desktop 登入即可。

---

## 注意事項

- **箭頭符號**：data.js 中所有箭頭統一用 `→`（U+2192），`⭢`/`➔` 在 Android 顯示為方塊。
- 播放器的「自動接播」需要瀏覽器允許來自 `www.youtube.com` 的 `postMessage`；本機 / GitHub Pages 皆正常，其他跨域環境需確認。
- YouTube 嵌入自動播放（`autoplay=1`）需要使用者點擊觸發，瀏覽器才允許有聲音播放，這是瀏覽器安全政策，非 bug。
- `香港去哪裡.md` 的圖片（image1–image6）為 Google Docs 嵌入，匯出後失效，目前網頁不顯示；若有需要可請用戶另外提供圖片。
- 地圖頁（map.html）需要網路連線載入 OpenStreetMap tiles 和 Leaflet CDN；離線環境無法使用。
