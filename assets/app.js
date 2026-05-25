/* ====== 行程頁渲染 ====== */
function renderItinerary() {
  const tabsEl = document.getElementById("dayTabs");
  const panelsEl = document.getElementById("dayPanels");
  if (!tabsEl || !panelsEl) return;

  ITINERARY.forEach((d, i) => {
    const tab = document.createElement("button");
    tab.className = "day-tab" + (i === 0 ? " active" : "");
    tab.innerHTML = `Day ${d.day}<small>${d.date}</small>`;
    if (d.status === "soon") tab.disabled = true;
    tab.addEventListener("click", () => selectDay(i));
    tabsEl.appendChild(tab);

    const panel = document.createElement("section");
    panel.className = "day-panel" + (i === 0 ? " active" : "");
    panel.dataset.idx = i;
    panel.innerHTML = d.status === "done" ? dayHTML(d) : comingHTML(d);
    panelsEl.appendChild(panel);
  });
}

function dayHTML(d) {
  const items = d.items.map(it => {
    const places = (it.places && it.places.length)
      ? `<div class="places">${it.places.map(p =>
          p.url
            ? `<a class="place-pill" href="${p.url}" target="_blank">📍 ${p.name}<span style="opacity:.6;font-weight:500">· ${p.desc}</span></a>`
            : `<span class="place-pill">📍 ${p.name}<span style="opacity:.6;font-weight:500">· ${p.desc}</span></span>`
        ).join("")}</div>`
      : "";
    const note = it.note
      ? `<div class="t-note"><span class="lbl">備註 ·</span> ${it.note}</div>`
      : "";
    return `
      <div class="t-item">
        <div class="t-time">${it.time}</div>
        <div class="t-body">
          <div class="t-act">${it.act}</div>
          ${places}
          ${note}
        </div>
      </div>`;
  }).join("");

  return `
    <div class="day-head">
      <h3>Day ${d.day}｜${d.date}　${d.title}</h3>
      <div class="day-route">🚩 ${d.route}</div>
    </div>
    <div class="timeline">${items}</div>`;
}

function comingHTML(d) {
  return `
    <div class="coming">
      <h3>Day ${d.day}｜${d.date}</h3>
      <p>行程規劃中，敬請期待 🛫</p>
    </div>`;
}

function selectDay(idx) {
  document.querySelectorAll(".day-tab").forEach((t, i) => t.classList.toggle("active", i === idx));
  document.querySelectorAll(".day-panel").forEach((p, i) => p.classList.toggle("active", i === idx));
}

/* ====== 餐食頁渲染 ====== */
function renderFood() {
  const grid = document.getElementById("foodGrid");
  if (grid) {
    grid.innerHTML = RESTAURANTS.map(foodCardHTML).join("");
    setupFilters();
  }
  const tbody = document.getElementById("surveyBody");
  if (tbody) {
    tbody.innerHTML = SURVEY.map(s => `
      <tr>
        <td class="name">${s.name}</td>
        <td class="${s.spicy === "否" ? "spicy-no" : "spicy-yes"}">${s.spicy}</td>
        <td>${s.avoid}</td>
        <td>${s.note || "—"}</td>
      </tr>`).join("");
  }
}

function capBadge(cap) {
  if (cap === "yes") return `<span class="cap yes">13人 ⭕</span>`;
  if (cap === "no") return `<span class="cap no">13人 ❌</span>`;
  return `<span class="cap" style="background:#ddd;color:#555">待確認</span>`;
}

function row(k, v) {
  return v ? `<div class="food-row"><span class="k">${k}</span><div class="v">${v}</div></div>` : "";
}

function foodCardHTML(r) {
  return `
    <article class="food-card" data-cap="${r.cap}">
      <div class="food-card-head">
        <h3>${r.name}</h3>
        ${capBadge(r.cap)}
      </div>
      <div class="food-card-body">
        ${row("交通 / 地址", r.addr)}
        ${row("營業時間", r.hours)}
        ${row("評論 / 推薦", r.review)}
        ${row("訂位 / 電話", r.book)}
        ${row("其他", r.other)}
      </div>
    </article>`;
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      document.querySelectorAll(".food-card").forEach(card => {
        card.style.display = (f === "all" || card.dataset.cap === f) ? "" : "none";
      });
    });
  });
}

/* ====== 深色模式 ====== */
function initDarkMode() {
  const btn = document.getElementById("darkToggle");
  if (!btn) return;
  const html = document.documentElement;
  const update = () => {
    const dark = html.getAttribute("data-theme") === "dark";
    btn.textContent = dark ? "☀️" : "🌙";
  };
  update();
  btn.addEventListener("click", () => {
    const dark = html.getAttribute("data-theme") === "dark";
    if (dark) {
      html.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    update();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderItinerary();
  renderFood();
  initDarkMode();
});
