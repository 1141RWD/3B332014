<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "JapanGo";

$conn = mysqli_connect($host, $user, $password, $dbname, 3307);
if (!$conn) {
    die("資料庫連線失敗：" . mysqli_connect_error());
}
mysqli_set_charset($conn, "utf8mb4");

$sql = "SELECT * FROM events ORDER BY region";
$result = mysqli_query($conn, $sql);
if (!$result) {
    die("查詢失敗：" . mysqli_error($conn));
}
?>

<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <title>JapanGo｜日本旅遊互動平台</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- 原本 CSS -->
  <link rel="stylesheet" href="indexstyle.css">

  <!-- ★新增：Leaflet CSS -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />

  <!-- ★新增：Leaflet JS -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>

<body>

<header>
  <h1>JapanGo 日本旅遊互動平台</h1>
  <p>旅遊路線 × 入境知識 × 日文學習 × 小遊戲</p>
</header>

<!-- 導覽列 -->
<nav class="navbar">
  <ul>
    <li onclick="goTo('route.html')">旅遊路線</li>
    <li onclick="goTo('customs.html')">入境注意</li>
    <li onclick="goTo('quiz.html')">Q&A 小遊戲</li>
    <li onclick="goTo('japanese.html')">日文學習</li>
  </ul>
</nav>

<div class="container">
  <section class="map-area">
    <div class="section-title">日本旅遊地圖</div>

    <!-- ★修改：原本 placeholder 改成真正地圖 -->
    <div id="map" style="height:300px;"></div>
  </section>
</div>

<!-- 活動資料 -->
<?php
$sql = "SELECT * FROM events";
$result = mysqli_query($conn, $sql);
?>

<section class="event-area">
  <div class="section-title">推薦活動（依地區）</div>

  <?php
  $regions = ['北海道', '本洲', '九州四國'];

  foreach ($regions as $region) {
    mysqli_data_seek($result, 0); // 指標重置
    echo "<h2 class='region-title'>📍 $region</h2>";
    echo "<div class='event-list'>";

    while ($row = mysqli_fetch_assoc($result)) {
      if ($row['region'] === $region) {
  ?>
        <div class="event-card"
          onclick="selectEvent(
            '<?= $row['title'] ?>',
            '<?= $row['location'] ?>',
            '<?= $row['description'] ?>',
            '<?= $row['route'] ?>'
          )">
          <h3><?= $row['title'] ?></h3>
          <p>地點：<?= $row['location'] ?></p>
          <p>時間：<?= $row['start_date'] ?></p>
        </div>
  <?php
      }
    }
    echo "</div>";
  }
  ?>
</section>


<footer>
  © 2025 JapanGo｜全端日本旅遊專題
</footer>

<script>
function goTo(page) {
  window.location.href = page;
}

/* ★新增：Leaflet 地圖程式碼 */
let map = L.map('map').setView([36.2048, 138.2529], 5);

// OpenStreetMap 圖層
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;

// 點活動 → 地圖移動 + marker
function selectEvent(lat, lng, title, location, description, route) {
  map.setView([lat, lng], 13);

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`
    <strong>${title}</strong><br>
    📍 ${location}<br>
    📝 ${description}<br>
    🚆 ${route}
  `).openPopup();
}
</script>

</body>
</html>