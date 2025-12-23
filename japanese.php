<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>日文學習｜JapanGo</title>
<link rel="stylesheet" href="indexstyle.css">
<style>
  .jp-container { max-width:700px; margin:40px auto; }
  .jp-card { background:#fff; padding:20px; margin:15px 0; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:space-between; }
  .jp-text { font-size:1.2rem; }
  .jp-btn { padding:8px 12px; border:none; border-radius:8px; background:#d32f2f; color:white; cursor:pointer; transition:0.3s; }
  .jp-btn:hover { background:#f44336; }
</style>
</head>
<body>

<header>
  <h1>日文學習｜JapanGo</h1>
  <p>常用日語短句互動學習</p>
</header>

<nav class="navbar">
  <ul>
    <li onclick="goTo('index.php')">首頁</li>
    <li onclick="goTo('Entryquiz.php')">入境 Q&A</li>
    <li onclick="goTo('internal.php')">國內 Q&A</li>
    <li onclick="goTo('japanese.php')">日文學習</li>
  </ul>
</nav>

<div class="container jp-container">
  <h2>常用日語短句</h2>

  <div class="jp-card">
    <div class="jp-text">
      <strong>こんにちは</strong><br>（你好 / 午安）
    </div>
    <button class="jp-btn" onclick="playAudio('konnichiwa.mp3')">🔊 聽發音</button>
  </div>

  <div class="jp-card">
    <div class="jp-text">
      <strong>ありがとうございます</strong><br>（謝謝）
    </div>
    <button class="jp-btn" onclick="playAudio('arigatou.mp3')">🔊 聽發音</button>
  </div>

  <div class="jp-card">
    <div class="jp-text">
      <strong>いくらですか？</strong><br>（這個多少錢？）
    </div>
    <button class="jp-btn" onclick="playAudio('ikura.mp3')">🔊 聽發音</button>
  </div>

  <div class="jp-card">
    <div class="jp-text">
      <strong>すみません</strong><br>（不好意思 / 打擾一下）
    </div>
    <button class="jp-btn" onclick="playAudio('sumimasen.mp3')">🔊 聽發音</button>
  </div>
</div>

<script>
function playAudio(file) {
  const audio = new Audio('audio/' + file); // audio 資料夾放 mp3
  audio.play();
}

function goTo(page) {
  window.location.href = page;
}
</script>

</body>
</html>
