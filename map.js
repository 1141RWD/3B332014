// 初始化地圖（日本）
const map = L.map("map").setView([36.2048, 138.2529], 5);

// 載入 OpenStreetMap 圖層
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// 全域 marker（避免重複）
let currentMarker = null;

/**
 * 顯示活動位置
 * @param {string} title
 * @param {string} location
 * @param {string} description
 * @param {string} route
 * @param {number} lat
 * @param {number} lng
 */
function selectEvent(title, location, description, route, lat, lng) {
  // 移除舊標記
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // 移動地圖到活動地點
  map.setView([lat, lng], 13);

  // 新增標記
  currentMarker = L.marker([lat, lng]).addTo(map);

  // 彈出資訊視窗
  currentMarker.bindPopup(`
    <strong>${title}</strong><br>
    📍 ${location}<br>
    📝 ${description}<br>
    🚆 ${route}
  `).openPopup();
}
