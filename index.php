<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "JapanGo";

$conn = mysqli_connect($host, $user, $password, $dbname);
mysqli_set_charset($conn, "utf8_general_ci");

if (!$conn) {
  die("資料庫連線失敗");
}
?>

<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <title>JapanGo｜日本旅遊互動平台</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
    <section class="map-area">
      <div class="section-title">日本旅遊地圖</div>
      <div class="map-placeholder">
        （此處放日本地圖｜可點擊地區）
        <script>
          function selectEvent(title, location, description, route) {
            const map = document.getElementById("map");
            map.innerHTML = `
              <strong>${title}</strong><br><br>
              📍 地點：${location}<br>
              📝 活動內容：${description}<br>
              🚆 建議路線：${route}
            `;
          }
</script>

      </div>
    </section>
  </div>
  <!--活動區塊-->
  <?php
  $sql = "SELECT * FROM events";
  $result = mysqli_query($conn, $sql);
  ?>

  <section class="event-area">
    <div class="section-title">近期推薦活動</div>
    <div class="event-list">

      <?php while($row = mysqli_fetch_assoc($result)) { ?>
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
      <?php } ?>

  </div>
</section>

  <footer>
    © 2025 JapanGo｜全端日本旅遊專題
  </footer>

  <script>
    function goTo(page) {
      window.location.href = page;
    }
  </script>

</body>
</html>
