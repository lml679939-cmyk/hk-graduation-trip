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

function initMap() {
  const map = L.map("map").setView(HK_CENTER, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(map);

  const places = getMapPlaces();
  const layerGroups = {};

  Object.keys(DAY_COLORS).forEach(d => {
    layerGroups[d] = L.layerGroup().addTo(map);
  });

  places.forEach(p => {
    const color = DAY_COLORS[p.day]?.color || "#888";
    const marker = L.marker([p.lat, p.lng], { icon: makeIcon(color) });
    marker.bindPopup(popupHTML(p), { maxWidth: 220, className: "map-popup" });
    layerGroups[p.day].addLayer(marker);
  });

  const filtersEl = document.getElementById("mapFilters");
  const allDays = [...new Set(places.map(p => p.day))].sort();

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
    });
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
}

document.addEventListener("DOMContentLoaded", initMap);
