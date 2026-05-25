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
├── map.html            景點地圖頁（Leaflet.js + OpenStreetMap + 景點清單 + 換港幣篩選）
├── split.html          旅費分帳頁（Google 登入 + Google Sheets 同步）
├── apps-script.js      Google Apps Script 後端原始碼備份（已部署，勿直接執行）
├── CLAUDE.md           本文件（交接 / AI agent 說明）
├── assets/
│   ├── style.css       全域樣式（港式復古海報風設計系統）
│   ├── data.js         行程資料（ITINERARY）+ 餐廳資料（RESTAURANTS）+ 飲食調查（SURVEY）
│   ├── app.js          行程頁 & 餐食頁的 DOM 渲染邏輯
│   ├── map.js          景點地圖渲染邏輯（Leaflet、標記、Day 篩選、景點清單、換港幣篩選）
│   ├── split.js        旅費分帳邏輯（表單、Google API、最少轉帳結算、實時匯率）
│   └── player.js       浮動音樂播放器（港樂點唱機、跨頁狀態保存）
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
**小標籤連結**：`.sheet-link`（藍色邊框標籤，用於 Google Sheets、Notion 等外部連結）

---

## 資料格式說明

### 新增 Day 3 / Day 4 行程（最重要的待辦）

開啟 `assets/data.js`，找到 ITINERARY 陣列的 Day 3 物件（`day: 3`）：

```js
{
  day: 3,
  date: "7/1（三）",
  status: "done",           // ← 從 "soon" 改為 "done"
  title: "地區名 → 地區名",
  route: "景點A → 景點B → …",
  items: [
    {
      time: "10:00",
      act: "行程描述",        // 可含 HTML（<b>、<a>、<span class='route-label'>）
      places: [
        {
          name: "景點名",
          desc: "逛街/拍照/etc",
          url: "Google Maps 連結或空字串",
          lat: 22.3xxx,      // ← 必填！地圖頁會用到
          lng: 114.1xxx      // ← 必填！地圖頁會用到
        }
      ],
      note: "備註文字"        // 可含 HTML，可省略（空字串）
    }
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

---

## 功能清單

### ✅ 已完成

| 功能 | 說明 |
|---|---|
| 行程頁 | Day 1、Day 2 完整時間軸；Day 3/4 預留「規劃中」 |
| Day tab 切換 | 點標籤切換天數；Day 3/4 按鈕灰階 disabled |
| 攜帶清單連結 | 行程頁標題旁「🧳 攜帶清單」連結（Notion） |
| 景點地圖連結（膠囊） | 行程頁膠囊樣式，點擊開 Google Maps |
| 景點地圖頁 | `map.html`：Leaflet.js + OpenStreetMap，Day 1 紅標、Day 2 深藍標，Day tab 篩選 |
| 換港幣篩選 | 地圖頁「💱 換港幣」tab，顯示 6 處貼近行程路線的找換店（綠色標記） |
| 景點行程清單 | 地圖下方按天顯示景點清單，點擊跳至地圖；「全部」時隱藏 |
| Day 1、Day 2 GPS 座標 | 共 17 個景點已填入 `lat`/`lng` |
| 餐食分頁 | 15 間餐廳卡片，含所有欄位資訊 |
| 餐廳訂位連結 | 金華冰廳（AutoReserve）、蓮香樓（inline.app）已加入線上訂位連結 |
| 容納人數篩選 | 按 ⭕/❌ 篩選適合 13 人的餐廳 |
| 飲食禁忌速查表 | 12 人的吃辣 + 禁忌食材 |
| 浮動音樂播放器 | 12 首港樂（Beyond / 李克勤 / 陳奕迅 / 張學友 / 譚詠麟）|
| 上一首 / 下一首 | 順序播放 |
| 隨機播放 | Fisher–Yates 洗牌，記憶隨機佇列可回上一首 |
| 自動接播 | YouTube `postMessage`（`onStateChange: 0`）偵測影片結束自動播下一首 |
| **跨頁持續播放** | 切換分頁時用 `localStorage('hkPlayer_v1')` 儲存狀態，新頁面載入後自動恢復並嘗試 autoplay |
| 響應式設計 | 手機友善（560px 斷點）；nav 等寬對齊（`flex: 1 1 0`） |
| **旅費分帳頁** | `split.html`：Google Sign-In 登入，費用記錄即時同步 Google Sheets |
| 新增費用 | 費用說明、金額（HKD/TWD 幣別切換自動換算）、複選付款人、分攤成員、日期、上傳收據圖片 |
| 費用明細 | 按日期分組顯示，含收據縮圖（點擊放大）；Google Sheets 後台連結放在標題旁 |
| **編輯費用** | 所有已登入成員皆可編輯任何一筆（modal 表單）；刪除仍限記帳人本人 |
| 自動結算 | 最少轉帳筆數貪婪演算法，顯示 HKD + TWD 換算金額 |
| **實時匯率** | 登入後從 `fawazahmed0/currency-api`（jsDelivr CDN）抓取當日 HKD→TWD，失敗降回預設 4.2 |
| Notion 換算表連結 | 匯率列旁「📒 換算表」連結（Notion） |
| 記帳人顯示名稱 | `EMAIL_TO_NAME` 對照表，Google 帳號顯示名自動轉換為中文姓名 |

### 🔲 尚未完成 / 規劃中

| 功能 | 優先度 | 說明 |
|---|---|---|
| Day 3 行程 | ⭐⭐⭐ | 格式見上方；記得同步補 GPS 座標 + map.js DAY_COLORS |
| Day 4 行程 | ⭐⭐⭐ | 同上 |
| 第 13 位成員 | ⭐⭐ | MEMBERS 陣列目前 12 人，待確認姓名 + Gmail 後補入 `assets/split.js` 的 MEMBERS、ALLOWED_EMAILS、EMAIL_TO_NAME，以及 `apps-script.js` 的 ALLOWED_EMAILS（需重新部署） |
| 餐廳卡片照片 | ⭐ | 待用戶提供照片 |

---

## 景點地圖（map.html）技術說明

- **Library**：Leaflet 1.9.4（CDN），OpenStreetMap tiles
- **資料來源**：讀取 `ITINERARY` 中各 `items[].places[]` 有 `lat`/`lng` 的物件
- **標記顏色**：由 `map.js` 的 `DAY_COLORS` 物件控制（補 Day 3/4 時需更新）
- **換港幣標記**：`EXCHANGE_PLACES` 陣列（map.js 頂部），綠色（`#2e8b57`），共 6 處，貼近 Day 1/2 行程路線
- **Popup**：景點名 + 描述 + Google Maps 連結
- **篩選**：「全部 / Day 1 / Day 2 / 💱換港幣」tab，Day tab 自動從 ITINERARY 生成

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

## 旅費分帳（split.html）技術說明

### 架構

純靜態前端 + Google Apps Script Web App（GET-only API）+ Google Sheets 儲存

- **登入**：Google Identity Services（GIS）declarative sign-in，JWT 由前端 base64url 解碼，不做 signature 驗證
- **API 模式**：所有請求用 GET，繞過 Apps Script POST redirect 的 CORS 問題
- **Session 保存**：`localStorage('split_user')` 存使用者資料，重新整理不需再登入

### 關鍵設定（assets/split.js）

```js
const SPLIT_CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx5NP0dO-Dp4JBXaPPBhmSjRuf9cCYKc-vZbGmMqtcOIkI2EhYI0mjoE8ojaysaIwph-w/exec',
  ALLOWED_EMAILS: [          // 目前 12 人，第 13 位待補
    'lml679939@gmail.com',   // 葉祐誠
    'joey930531@gmail.com',  // 吳孟剛
    'yenyingho0203@gmail.com', // 何姸穎
    'amooli99054@gmail.com', // 徐睿君
    '040116panda@gmail.com', // 鍾宜珊
    'yuxuann.0218@gmail.com',// 陳禹璇
    'ken0965453937@gmail.com',// 張旭廷
    'a0981024358@gmail.com', // 劉映彤
    'chenpotsunnnn@gmail.com',// 陳柏村
    'csy.shunyiutw@gmail.com',// 張舜堯
    'rita.happybear@gmail.com',// 陳思妤
    'linyvonne9313@gmail.com', // 林苡婕
  ],
  DEFAULT_RATE: 4.2          // 實時抓取失敗時的備用匯率
};
const MEMBERS = [
  "鍾宜珊", "陳禹璇", "吳孟剛", "林苡婕", "葉祐誠", "陳思妤",
  "陳柏村", "張舜堯", "徐睿君", "何姸穎", "劉映彤", "張旭廷"
  // ⚠️ 目前 12 人，第 13 位待確認後補入
];
// email → 中文姓名對照表（記帳人顯示用，避免 Google 帳號顯示亂名）
const EMAIL_TO_NAME = { 'lml679939@gmail.com': '葉祐誠', … };
```

### 實時匯率

登入後從 `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/hkd.min.json` 抓取 HKD→TWD。  
回應格式：`{ date: "2026-05-24", hkd: { twd: 4.02... } }`  
失敗自動降回 `DEFAULT_RATE: 4.2`，顯示「（預設值）」標示。

### 編輯費用功能

- **前端**：`split.html` 內含 `#editModal`，`assets/split.js` 的 `openEditModal(id)` / `saveEdit()` 處理
- **後端**：`apps-script.js` 的 `updateExpense(exp, email)` 處理 `action=update`
- **權限**：編輯開放給所有已登入成員；刪除仍限記帳人本人

### Google OAuth Client ID

`split.html` 的 `data-client_id`：
```
709660545333-uq8pvh6ovut69lf35j4jmgo4p4fepb58.apps.googleusercontent.com
```
已授權的 JavaScript 來源：`https://lml679939-cmyk.github.io`、`http://localhost:5500`

### Google Sheets 欄位結構（分帳記錄 工作表）

| 欄 | 內容 |
|---|---|
| A | ID（隨機字串） |
| B | 時間戳記 |
| C | 日期（YYYY-MM-DD） |
| D | 費用說明 |
| E | 金額（HKD，永遠存港幣） |
| F | 付款人（JSON array） |
| G | 分攤成員（JSON array） |
| H | 記帳人姓名 |
| I | 記帳人 Email |
| J | 收據圖片（base64 JPEG，最大 150px，可空白） |

Spreadsheet ID：`1zBVlMaw7WymQmyQx8GW2dsYZl4ds4sjfSaaTtZJ-X1Q`

### 更新 Apps Script 後需重新部署

修改 `apps-script.js` → 到 Google Apps Script 編輯器全選貼上 → 「部署」→「管理部署作業」→ 鉛筆 → 版本選「新版本」→「部署」。URL 不變。

---

## 音樂播放器（player.js）技術說明

- **跨頁持續播放**：`localStorage('hkPlayer_v1')` 儲存 `{ currentIdx, shuffleOn, shuffleQueue, shufflePos, panelOpen }`
  - `beforeunload` 事件觸發存檔
  - 每次 `playSong()` / 切換隨機模式後也存檔
  - 新頁面 `DOMContentLoaded` → `buildPlayer()` → `restorePlayerState()` 嘗試 autoplay
  - GitHub Pages 同 origin 瀏覽器通常允許 autoplay（MEI 高）；被擋時歌曲仍高亮，點擊即可繼續
- **離開瀏覽器**：無法跨視窗保持播放（瀏覽器安全限制），屬預期行為

---

## 外部連結索引

| 位置 | 連結文字 | 目標 |
|---|---|---|
| 行程表頁標題旁 | 🧳 攜帶清單 | https://www.notion.so/58393f0fdf124d2f9c194d2466a15866 |
| 旅費分帳匯率列旁 | 📒 換算表 | https://www.notion.so/35ff327b9f7680d7af73f20838ba214e |
| 旅費分帳費用明細標題旁 | 📊 查看 Google Sheets | https://docs.google.com/spreadsheets/d/1zBVlMaw7WymQmyQx8GW2dsYZl4ds4sjfSaaTtZJ-X1Q/edit |

---

## 原始資料來源

| 檔案 | 說明 | 讀取方式 |
|---|---|---|
| `香港去哪裡.md` | Google Docs 匯出的行程表，68 行但每行極長 | `sed -n '6,19p'`（Day1）/ `sed -n '20,29p'`（Day2）/ `sed -n '30,37p'`（Day3）/ `sed -n '38,68p'`（Day4）|
| `香港行_餐食相關.xlsx` | Google Sheets 匯出，兩張工作表：餐廳資訊 + 餐食調查 | `python -c "import openpyxl…"` 或直接讀 data.js（已整理） |

---

## 已驗證的 YouTube 連結（player.js）

| 歌手 | 歌曲 | Video ID |
|---|---|---|
| （合輯） | 香港90年代經典粵語金曲30首 | `nvYahoAmkCQ` |
| Beyond | 海闊天空 | `V4GUy2EHMMs` |
| Beyond | 光輝歲月 | `PrGsAMbgUh4` |
| Beyond | 真的愛你 | `to7JtGUZhrQ` |
| Beyond | 喜歡你 | `U-bvp_hsinw` |
| 李克勤 | 紅日 | `rkNjRZF97Sc` |
| 李克勤 | 月半小夜曲（Live 2002） | `6FM7kARun4w` |
| 李克勤 | 護花使者 | `ek8cGBoAv8w` |
| 陳奕迅 | 富士山下 | `ghnT1uOwfrY` |
| 陳奕迅 | 浮誇 | `0xFFGzZq75w` |
| 張學友 | 吻別 | `o2Sg9WAcEWo` |
| 譚詠麟 | 朋友 | `us2AQCaG0P4` |

---

## 本機開發指引

```powershell
# 啟動 preview server（.claude/launch.json 已設定）
python -m http.server 5500
# 然後開 http://localhost:5500/index.html
```

Claude Code 裡可直接用 `preview_start`（name: "hk-trip"）啟動。

## 部署流程（GitHub Pages）

```bash
git add .
git commit -m "說明"
git push
# 約 1 分鐘後生效：https://lml679939-cmyk.github.io/hk-graduation-trip/
```

> **注意**：git push 使用 Git Credential Manager（Windows），GitHub Desktop 登入後的 token 會自動帶入。

---

## 注意事項

- **箭頭符號**：data.js 中所有箭頭統一用 `→`（U+2192），`⭢`/`➔` 在 Android 顯示為方塊。
- **音樂跨頁**：`localStorage('hkPlayer_v1')` 存狀態，同 origin 頁面跳轉可自動恢復；離開整個瀏覽器則無法保持（瀏覽器限制）。
- **apps-script.js 是本機備份**：實際執行以 Google Apps Script 編輯器內版本為準，兩者有差異時以 GAS 為準。
- **收據圖片**：壓縮至最大 150px JPEG，base64 約 3–7KB 透過 GET 傳送；超大圖片請改用較小的照片。
- **地圖頁**：需要網路連線載入 OpenStreetMap tiles 和 Leaflet CDN；離線環境無法使用。
- **分帳 Google Sign-In**：OAuth credential 傳播最長數小時，`invalid_client` 錯誤等待即可。
- **換港幣找換店**：座標為近似值（半徑 100m 內），Google Maps 連結用 search query 格式，實際抵達請開 Maps 確認。
