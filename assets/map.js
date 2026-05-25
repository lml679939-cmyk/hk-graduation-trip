/* ====== 景點地圖 ====== */

const DAY_COLORS = {
  1: { color: "#d4332f", label: "Day 1　旺角" },
  2: { color: "#16306e", label: "Day 2　灣仔・堅尼地城・尖沙咀" }
};

const EXCHANGE_COLOR = "#2e8b57";

const EXCHANGE_PLACES = [
  {
    name: "太子／旺角站附近找換店",
    desc: "Day 1・鄰近飯店（太子站）・下機後第一站換匯首選",
    lat: 22.3319, lng: 114.1643,
    url: "https://www.google.com/maps/search/?api=1&query=money+exchange+Prince+Edward+MTR+Hong+Kong"
  },
  {
    name: "旺角朗豪坊旁找換店",
    desc: "Day 1・彌敦道／朗豪坊逛街路線必經・多家可比較",
    lat: 22.3185, lng: 114.1686,
    url: "https://www.google.com/maps/search/?api=1&query=money+exchange+Langham+Place+Mong+Kok"
  },
  {
    name: "重慶大廈找換店",
    desc: "Day 2・全港匯率最優・鄰近九龍公園・尖沙咀行程必換",
    lat: 22.2969, lng: 114.1716,
    url: "https://www.google.com/maps/search/?api=1&query=Chungking+Mansions+money+exchange"
  },
  {
    name: "灣仔甘牌燒鵝附近找換店",
    desc: "Day 2・甘牌燒鵝（軒尼詩道）午餐前後順便換",
    lat: 22.2771, lng: 114.1740,
    url: "https://www.google.com/maps/search/?api=1&query=money+exchange+Hennessy+Road+Wan+Chai"
  },
  {
    name: "堅尼地城找換店",
    desc: "Day 2・堅尼地城站附近・籃球場／咖啡館行程一帶",
    lat: 22.2816, lng: 114.1295,
    url: "https://www.google.com/maps/search/?api=1&query=money+exchange+Kennedy+Town+Hong+Kong"
  },
  {
    name: "中環站附近找換店",
    desc: "Day 2・天星碼頭→太平山纜車路線上・搭纜車前可換",
    lat: 22.2824, lng: 114.1578,
    url: "https://www.google.com/maps/search/?api=1&query=money+exchange+Central+MTR+Hong+Kong"
  }
];

const HK_CENTER = [22.305, 114.158];

function getMapPlaces() {
  const places = [];
  ITINERARY.forEach(day => {
    if (day.status !== "done") return;
    day.items.forEach(item => {
      if (!item.places) return;
      item.places.forEach(p => {
        if (p.lat && p.lng) places.push({ ...p, day: day.day });
      });
    });
  });
  return places;
}

function makeIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;background:${color};border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.45)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -12]
  });
}

function popupHTML(p) {
  const mapLink = p.url
    ? `<br><a href="${p.url}" target="_blank" style="color:#1f4bb8;font-weight:700;font-size:12px">Google Maps →</a>`
    : "";
  return `<b style="font-size:14px;font-family:'Noto Sans TC',sans-serif">${p.name}</b><br><span style="color:#666;font-size:12px">${p.desc}</span>${mapLink}`;
}

function buildPlaceLists(map, dayMarkers, tabBtns, allDays) {
  const container = document.getElementById("placeLists");
  if (!container) return;

  const title = document.createElement("h3");
  title.className = "section-title place-list-title";
  title.textContent = "景點行程清單";
  container.appendChild(title);

  const desc = document.createElement("p");
  desc.className = "section-desc";
  desc.textContent = "點選景點跳至地圖對應位置。";
  container.appendChild(desc);

  const grid = document.createElement("div");
  grid.className = "place-list-section";
  container.appendChild(grid);

  allDays.forEach(d => {
    const items = dayMarkers[d];
    if (!items || items.length === 0) return;

    const info = DAY_COLORS[d];
    const dayObj = ITINERARY.find(it => it.day === d);
    const regionName = info?.label?.split("　")[1] || "";

    const group = document.createElement("div");
    group.className = "place-list-group";
    group.dataset.day = String(d);
    group.style.setProperty("--day-color", info?.color || "#888");

    const head = document.createElement("div");
    head.className = "place-list-head";
    head.innerHTML = `<span class="place-list-badge">Day ${d}</span><span class="place-list-region">${regionName}</span><small>${dayObj?.date || ""}</small>`;
    group.appendChild(head);

    items.forEach(({ place, marker }, idx) => {
      const item = document.createElement("div");
      item.className = "place-list-item";
      item.innerHTML = `
        <span class="place-num">${idx + 1}</span>
        <div class="place-info">
          <span class="place-name">${place.name}</span>
          <span class="place-desc">${place.desc}</span>
        </div>
        <span class="place-go">→</span>
      `;
      item.addEventListener("click", () => {
        const tabBtn = tabBtns[d];
        if (tabBtn && !tabBtn.classList.contains("active")) tabBtn.click();
        map.once("moveend", () => marker.openPopup());
        map.flyTo([place.lat, place.lng], 17, { duration: 0.8 });
      });
      group.appendChild(item);
    });

    grid.appendChild(group);
  });
}

function buildExchangeList(map) {
  const container = document.getElementById("placeLists");
  if (!container) return;

  const group = document.createElement("div");
  group.id = "exchangeList";
  group.className = "place-list-group";
  group.style.cssText = "display:none; --day-color:" + EXCHANGE_COLOR;

  const head = document.createElement("div");
  head.className = "place-list-head";
  head.innerHTML = `<span class="place-list-badge" style="background:${EXCHANGE_COLOR}">💱</span><span class="place-list-region">找換店推薦</span><small>點選跳至地圖</small>`;
  group.appendChild(head);

  EXCHANGE_PLACES.forEach((p, idx) => {
    const item = document.createElement("div");
    item.className = "place-list-item";
    item.innerHTML = `
      <span class="place-num" style="background:${EXCHANGE_COLOR}">${idx + 1}</span>
      <div class="place-info">
        <span class="place-name">${p.name}</span>
        <span class="place-desc">${p.desc}</span>
      </div>
      <span class="place-go">→</span>
    `;
    item.addEventListener("click", () => {
      const exchBtn = document.querySelector(".exchange-tab");
      if (exchBtn && !exchBtn.classList.contains("active")) exchBtn.click();
      map.flyTo([p.lat, p.lng], 17, { duration: 0.8 });
    });
    group.appendChild(item);
  });

  container.appendChild(group);
}

function initMap() {
  const map = L.map("map").setView(HK_CENTER, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);

  const places = getMapPlaces();
  const layerGroups = {};
  const dayMarkers = {};

  Object.keys(DAY_COLORS).forEach(d => {
    layerGroups[d] = L.layerGroup().addTo(map);
    dayMarkers[d] = [];
  });

  places.forEach(p => {
    const color = DAY_COLORS[p.day]?.color || "#888";
    const marker = L.marker([p.lat, p.lng], { icon: makeIcon(color) });
    marker.bindPopup(popupHTML(p), { maxWidth: 220, className: "map-popup" });
    layerGroups[p.day].addLayer(marker);
    if (!dayMarkers[p.day]) dayMarkers[p.day] = [];
    dayMarkers[p.day].push({ place: p, marker });
  });

  // 換港幣圖層（預設隱藏）
  const exchangeLayer = L.layerGroup();
  EXCHANGE_PLACES.forEach(p => {
    const marker = L.marker([p.lat, p.lng], { icon: makeIcon(EXCHANGE_COLOR) });
    marker.bindPopup(popupHTML(p), { maxWidth: 240, className: "map-popup" });
    exchangeLayer.addLayer(marker);
  });

  const filtersEl = document.getElementById("mapFilters");
  const allDays = [...new Set(places.map(p => p.day))].sort();
  const tabBtns = {};

  const setDayLayers = (dayKey) => {
    map.removeLayer(exchangeLayer);
    Object.keys(layerGroups).forEach(d => {
      const show = dayKey === "all" || String(d) === String(dayKey);
      show ? map.addLayer(layerGroups[d]) : map.removeLayer(layerGroups[d]);
    });
    const placeListsEl = document.getElementById("placeLists");
    if (placeListsEl) {
      if (dayKey === "all") {
        placeListsEl.style.display = "none";
      } else {
        placeListsEl.style.display = "";
        placeListsEl.querySelectorAll(".place-list-group[data-day]").forEach(g => {
          g.style.display = g.dataset.day === String(dayKey) ? "" : "none";
        });
      }
    }
  };

  const makeTab = (label, dayKey, small) => {
    const btn = document.createElement("button");
    btn.className = "day-tab" + (dayKey === "all" ? " active" : "");
    btn.innerHTML = label + (small ? `<small>${small}</small>` : "");
    btn.addEventListener("click", () => {
      document.querySelectorAll("#mapFilters .day-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setDayLayers(dayKey);
    });
    tabBtns[dayKey] = btn;
    return btn;
  };

  filtersEl.appendChild(makeTab("全部", "all"));
  allDays.forEach(d => {
    const day = ITINERARY.find(it => it.day === d);
    filtersEl.appendChild(makeTab(`Day ${d}`, d, day?.date || ""));
  });

  // 換港幣分頁
  const exchangeBtn = document.createElement("button");
  exchangeBtn.className = "day-tab exchange-tab";
  exchangeBtn.innerHTML = `💱 換港幣`;
  exchangeBtn.addEventListener("click", () => {
    document.querySelectorAll("#mapFilters .day-tab").forEach(b => b.classList.remove("active"));
    exchangeBtn.classList.add("active");
    Object.keys(layerGroups).forEach(d => map.removeLayer(layerGroups[d]));
    map.addLayer(exchangeLayer);
    const placeListsEl = document.getElementById("placeLists");
    if (placeListsEl) {
      placeListsEl.style.display = "";
      placeListsEl.querySelectorAll(".place-list-group[data-day]").forEach(g => {
        g.style.display = "none";
      });
      const exchangeListEl = document.getElementById("exchangeList");
      if (exchangeListEl) exchangeListEl.style.display = "";
    }
    map.flyTo([22.301, 114.162], 13, { duration: 0.6 });
  });
  filtersEl.appendChild(exchangeBtn);

  // 切換其他分頁時隱藏換港幣清單
  document.querySelectorAll("#mapFilters .day-tab:not(.exchange-tab)").forEach(btn => {
    btn.addEventListener("click", () => {
      const exchangeListEl = document.getElementById("exchangeList");
      if (exchangeListEl) exchangeListEl.style.display = "none";
    });
  });

  const legendEl = document.getElementById("mapLegend");
  allDays.forEach(d => {
    const info = DAY_COLORS[d];
    if (!info) return;
    const span = document.createElement("span");
    span.innerHTML = `<i style="background:${info.color}"></i>${info.label}`;
    legendEl.appendChild(span);
  });
  const exchSpan = document.createElement("span");
  exchSpan.innerHTML = `<i style="background:${EXCHANGE_COLOR}"></i>找換店`;
  legendEl.appendChild(exchSpan);

  buildPlaceLists(map, dayMarkers, tabBtns, allDays);
  document.getElementById("placeLists").style.display = "none";

  // 換港幣清單
  buildExchangeList(map);
}

document.addEventListener("DOMContentLoaded", initMap);
