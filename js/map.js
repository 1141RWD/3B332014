/* ================================
   Leaflet 地圖初始化
================================ */

let map = L.map('map').setView([36.2048, 138.2529], 5);

// OpenStreetMap 圖層
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker = null;
let routeLine = null;

/* ================================
   點活動卡片 → 地圖互動
================================ */
function selectEvent(lat, lng, title, location, description, route) {

  // 移動地圖
  map.setView([lat, lng], 12);

  // 清除舊 marker
  if (marker) {
    map.removeLayer(marker);
  }

  // 清除舊路線
  if (routeLine) {
    map.removeLayer(routeLine);
  }

  // 新 marker
  marker = L.marker([lat, lng]).addTo(map);

  marker.bindPopup(`
    <strong>${title}</strong><br>
    📍 ${location}<br>
    📝 ${description}<br>
    🚆 ${route}
  `).openPopup();

  /* === 紅色路線（示意） === */
  // 起點：東京車站（可之後改成使用者選擇）
  const startPoint = [35.681236, 139.767125];

  routeLine = L.polyline(
    [
      startPoint,
      [lat, lng]
    ],
    {
      color: 'red',
      weight: 4,
      opacity: 0.8
    }
  ).addTo(map);
}
