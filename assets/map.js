/* ====== 景點地圖 ====== */

const DAY_COLORS = {
  1: { color: "#d4332f", label: "Day 1　旺角" },
  2: { color: "#16306e", label: "Day 2　灣仔・堅尼地城・尖沙咀" }
};

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

  const filtersEl = document.getElementById("mapFilters");
  const allDays = [...new Set(places.map(p => p.day))].sort();
  const tabBtns = {};

  const makeTab = (label, dayKey, small) => {
    const btn = document.createElement("button");
    btn.className = "day-tab" + (dayKey === "all" ? " active" : "");
    btn.innerHTML = label + (small ? `<small>${small}</small>` : "");
    btn.addEventListener("click", () => {
      document.querySelectorAll("#mapFilters .day-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
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
    });
    tabBtns[dayKey] = btn;
    return btn;
  };

  filtersEl.appendChild(makeTab("全部", "all"));
  allDays.forEach(d => {
    const day = ITINERARY.find(it => it.day === d);
    filtersEl.appendChild(makeTab(`Day ${d}`, d, day?.date || ""));
  });

  const legendEl = document.getElementById("mapLegend");
  allDays.forEach(d => {
    const info = DAY_COLORS[d];
    if (!info) return;
    const span = document.createElement("span");
    span.innerHTML = `<i style="background:${info.color}"></i>${info.label}`;
    legendEl.appendChild(span);
  });

  buildPlaceLists(map, dayMarkers, tabBtns, allDays);
  document.getElementById("placeLists").style.display = "none";
}

document.addEventListener("DOMContentLoaded", initMap);
