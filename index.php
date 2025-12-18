<?php
$host = "localhost";
$user = "root";
$password = "1234";
$dbname = "JapanGo";

$conn = mysqli_connect($host, $user, $password, $dbname);
if (!$conn) {
    die("資料庫連線失敗：" . mysqli_connect_error());
}
mysqli_set_charset($conn, "utf8mb4");

$sql = "SELECT * FROM events";
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

  <!-- Leaflet 地圖樣式 -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

  <link rel="stylesheet" href="indexstyle.css">
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
    <li onclick="goTo('quiz.html')">QA 小遊戲</li>
    <li onclick="goTo('japanese.html')">日文學習</li>
  </ul>
</nav>

<div class="container">

  <!-- 地圖區 -->
  <section class="map-area">
    <div class="section-title">日本旅遊地圖</div>
    <div id="map" class="map-placeholder"></div>  
  </section>

  <!-- 活動區塊 -->
  <section class="event-area">
    <div class="section-title">近期推薦活動</div>
    <div class="event-list">

      <?php while ($row = mysqli_fetch_assoc($result)) { ?>
        <div class="event-card"
          onclick='selectEvent(
            <?= json_encode($row["title"]) ?>,
            <?= json_encode($row["location"]) ?>,
            <?= json_encode($row["description"]) ?>,
            <?= json_encode($row["route"]) ?>,
            <?= $row["lat"] ?>,
            <?= $row["lng"] ?>
          )'>

          <h3><?= htmlspecialchars($row["title"]) ?></h3>
          <p>地點：<?= htmlspecialchars($row["location"]) ?></p>
          <p>時間：<?= htmlspecialchars($row["start_date"]) ?></p>
        </div>
      <?php } ?>

    </div>
  </section>

</div>

<footer>
  © 2025 JapanGo｜全端日本旅遊專題
</footer>

<!-- Leaflet JS -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- 地圖邏輯 -->
<script src="map.js"></script>

<script>
  function goTo(page) {
    window.location.href = page;
  }
</script>

</body>
</html>