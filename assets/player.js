/* ====== 香港畢業旅行・港樂點唱機 ======
   功能：點歌播放、上一首／下一首、隨機播放、影片結束自動接播
   要加歌：在 PLAYLIST 對應歌手的 songs 陣列加 { t:"歌名", id:"YouTube影片ID" }
   要加歌手：照格式新增 { artist:"歌手名", songs:[…] }
   YouTube 影片 ID = 網址 watch?v= 後面那一段 */

const PLAYLIST = [
  {
    artist: "🎧 經典金曲台",
    songs: [
      { t: "香港 90 年代經典粵語金曲・30 首不間斷", id: "nvYahoAmkCQ" }
    ]
  },
  {
    artist: "Beyond",
    songs: [
      { t: "海闊天空", id: "V4GUy2EHMMs" },
      { t: "光輝歲月", id: "PrGsAMbgUh4" },
      { t: "真的愛你", id: "to7JtGUZhrQ" },
      { t: "喜歡你", id: "U-bvp_hsinw" }
    ]
  },
  {
    artist: "李克勤 Hacken Lee",
    songs: [
      { t: "紅日", id: "rkNjRZF97Sc" },
      { t: "月半小夜曲（Live 2002）", id: "6FM7kARun4w" },
      { t: "護花使者", id: "ek8cGBoAv8w" }
    ]
  },
  {
    artist: "陳奕迅 Eason",
    songs: [
      { t: "富士山下", id: "ghnT1uOwfrY" },
      { t: "浮誇", id: "0xFFGzZq75w" }
    ]
  },
  {
    artist: "張學友 / 譚詠麟",
    songs: [
      { t: "張學友 — 吻別", id: "o2Sg9WAcEWo" },
      { t: "譚詠麟 — 朋友", id: "us2AQCaG0P4" }
    ]
  }
];

/* ── 將播放清單展開成一維陣列 ── */
const FLAT_SONGS = [];
PLAYLIST.forEach(group => {
  group.songs.forEach(s => {
    FLAT_SONGS.push({ t: s.t, id: s.id, artist: group.artist });
  });
});

/* ── 播放器狀態 ── */
let currentIdx  = -1;
let shuffleOn   = false;
let shuffleQueue = [];   // 隨機順序的索引陣列
let shufflePos  = -1;    // 目前在 shuffleQueue 的位置

/* ── 工具：產生隨機佇列（排除當前）── */
function buildShuffleQueue(excludeIdx) {
  const idxs = FLAT_SONGS.map((_, i) => i).filter(i => i !== excludeIdx);
  for (let i = idxs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  shuffleQueue = idxs;
  shufflePos = -1;
}

/* ── 核心：播放第 idx 首歌 ── */
function playSong(idx) {
  if (idx < 0 || idx >= FLAT_SONGS.length) return;
  currentIdx = idx;
  const song = FLAT_SONGS[idx];

  /* 更新 iframe（enablejsapi=1 讓我們可以收 postMessage 偵測播放結束） */
  const origin = encodeURIComponent(window.location.origin);
  const videoBox = document.querySelector(".mp-video");
  videoBox.innerHTML = `<iframe
    src="https://www.youtube.com/embed/${song.id}?autoplay=1&rel=0&enablejsapi=1&origin=${origin}"
    title="${song.t}"
    allow="autoplay; encrypted-media; picture-in-picture"
    allowfullscreen></iframe>`;

  /* 更新「正在播放」列 */
  const nowBox = document.querySelector(".mp-now");
  nowBox.style.display = "block";
  nowBox.textContent = `♪ 正在播放：${song.artist}｜${song.t}`;

  /* 更新歌單高亮 */
  document.querySelectorAll(".mp-song").forEach((el, i) => {
    el.classList.toggle("active", i === idx);
  });

  /* 更新浮動按鈕動畫 */
  document.querySelector(".mp-toggle").classList.remove("paused");

  /* 若開啟隨機，紀錄當前位置 */
  if (shuffleOn) {
    const pos = shuffleQueue.indexOf(idx);
    if (pos !== -1) shufflePos = pos;
  }
}

/* ── 下一首 ── */
function playNext() {
  if (FLAT_SONGS.length === 0) return;
  if (shuffleOn) {
    shufflePos++;
    if (shufflePos >= shuffleQueue.length) buildShuffleQueue(currentIdx);
    shufflePos = Math.max(0, Math.min(shufflePos, shuffleQueue.length - 1));
    playSong(shuffleQueue[shufflePos]);
  } else {
    playSong((currentIdx + 1) % FLAT_SONGS.length);
  }
}

/* ── 上一首 ── */
function playPrev() {
  if (FLAT_SONGS.length === 0) return;
  if (shuffleOn) {
    shufflePos = Math.max(0, shufflePos - 1);
    playSong(shuffleQueue[shufflePos] ?? currentIdx);
  } else {
    playSong((currentIdx - 1 + FLAT_SONGS.length) % FLAT_SONGS.length);
  }
}

/* ── 偵測 YouTube 影片結束（postMessage） ── */
window.addEventListener("message", e => {
  if (e.origin !== "https://www.youtube.com") return;
  try {
    const data = JSON.parse(e.data);
    /* playerState === 0 = 播放結束 */
    if (data.event === "onStateChange" && data.info === 0) {
      playNext();
    }
  } catch (_) { /* 非 JSON 訊息忽略 */ }
});

/* ── 建構 DOM ── */
function buildPlayer() {
  /* 浮動按鈕 */
  const toggle = document.createElement("button");
  toggle.className = "mp-toggle paused";
  toggle.setAttribute("aria-label", "開啟音樂播放器");
  toggle.innerHTML = `<span class="eq"><i></i><i></i><i></i></span> 港樂點唱`;

  /* 播放器面板 */
  const panel = document.createElement("div");
  panel.className = "mp-panel";

  /* 歌單 HTML */
  let listHTML = "";
  FLAT_SONGS.forEach((s, i) => {
    const isFirst = i === 0 || FLAT_SONGS[i - 1].artist !== s.artist;
    if (isFirst) {
      listHTML += `<div class="mp-artist">${s.artist}</div>`;
    }
    listHTML += `<div class="mp-song" data-idx="${i}">
      <span class="ic">▶</span><span>${s.t}</span></div>`;
  });

  panel.innerHTML = `
    <div class="mp-head">
      <div>
        <span class="hk">HEY HONG KONG</span>
        <h3>港樂點唱機 🎤</h3>
      </div>
      <button class="mp-close" aria-label="關閉">×</button>
    </div>
    <div class="mp-video">
      <div class="mp-empty">點下方歌曲開始播放 🎶<br>（YouTube MV，有聲音記得開喇叭）</div>
    </div>
    <div class="mp-now" style="display:none"></div>
    <div class="mp-controls">
      <button class="mp-ctrl-btn" id="mpPrev">⏮ 上一首</button>
      <button class="mp-ctrl-btn" id="mpShuffle">🔀 隨機</button>
      <button class="mp-ctrl-btn" id="mpNext">下一首 ⏭</button>
    </div>
    <div class="mp-list">${listHTML}</div>`;

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  /* 開關面板 */
  toggle.addEventListener("click", () => panel.classList.toggle("open"));
  panel.querySelector(".mp-close").addEventListener("click", () => panel.classList.remove("open"));

  /* 點歌 */
  panel.querySelectorAll(".mp-song").forEach(el => {
    el.addEventListener("click", () => {
      const idx = parseInt(el.dataset.idx, 10);
      if (shuffleOn) buildShuffleQueue(idx);
      playSong(idx);
    });
  });

  /* 上一首 */
  document.getElementById("mpPrev").addEventListener("click", playPrev);

  /* 下一首 */
  document.getElementById("mpNext").addEventListener("click", playNext);

  /* 隨機播放切換 */
  document.getElementById("mpShuffle").addEventListener("click", () => {
    shuffleOn = !shuffleOn;
    const btn = document.getElementById("mpShuffle");
    btn.classList.toggle("shuffle-on", shuffleOn);
    btn.textContent = shuffleOn ? "🔀 隨機 ON" : "🔀 隨機";
    if (shuffleOn) buildShuffleQueue(currentIdx);
  });
}

document.addEventListener("DOMContentLoaded", buildPlayer);
