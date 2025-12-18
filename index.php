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
      </div>
    </section>
  </div>

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
