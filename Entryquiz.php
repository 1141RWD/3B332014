<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>入境注意｜JapanGo</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="indexstyle.css">
  <style>
    /* 小遊戲區塊 CSS */
    .quiz-container { max-width:600px; margin:20px auto; background:#fff; padding:20px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
    .quiz-question { font-size:1.2rem; margin-bottom:15px; }
    .quiz-options button { margin:5px 0; padding:10px 15px; width:100%; border:none; border-radius:8px; background:#f0f0f0; cursor:pointer; transition:0.3s; }
    .quiz-options button:hover { background:#d32f2f; color:white; }
    .quiz-result { margin-top:15px; font-weight:bold; }
    .quiz-title { font-size:1.5rem; margin-bottom:10px; text-align:center; }
  </style>
</head>
<body>

<header>
  <h1>入境注意事項</h1>
</header>

<nav class="navbar">
  <ul>
    <li onclick="goTo('index.php')">首頁</li>
    <li onclick="goTo('customs.php')">入境注意</li>
    <li onclick="document.getElementById('qa-game').scrollIntoView({behavior:'smooth'})">入境 Q&A</li>
    <li onclick="goTo('japanese.php')">日文學習</li>
  </ul>
</nav>

<div class="container">
  <section>
    <h2>海關入境須知</h2>
    <p>來日本旅遊，入境前你需要知道這些事項：例如申報現金、禁止攜帶物品、填寫入境卡等...</p>
  </section>

  <!-- Q&A 小遊戲 -->
  <section id="qa-game" class="quiz-container">
    <div class="quiz-title">入境 Q&A 小遊戲</div>
    <div id="quiz-question" class="quiz-question"></div>
    <div id="quiz-options" class="quiz-options"></div>
    <div id="quiz-result" class="quiz-result"></div>
    <button id="next-btn" style="margin-top:15px; display:none;">下一題</button>
  </section>
</div>

<script>
// 問題陣列
const quizData = [
  {
    question: "入境日本，海關可能會詢問你攜帶的現金金額，超過多少日圓需要申報？",
    options: ["10萬日圓", "50萬日圓", "100萬日圓", "200萬日圓"],
    answer: 2 // 100萬日圓
  },
  {
    question: "入境日本禁止攜帶哪種物品？",
    options: ["普通衣物", "水果或蔬菜", "手機", "書籍"],
    answer: 1
  },
  {
    question: "入境卡上必須填寫哪些資訊？",
    options: ["姓名與航班號碼", "行李顏色", "住宿地址與聯絡電話", "第一選項和第三選項都需要"],
    answer: 3
  }
];

let currentQuiz = 0;
let score = 0;

function loadQuiz() {
  document.getElementById('quiz-result').innerText = '';
  document.getElementById('next-btn').style.display = 'none';
  const q = quizData[currentQuiz];
  document.getElementById('quiz-question').innerText = q.question;

  const optionsDiv = document.getElementById('quiz-options');
  optionsDiv.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.innerText = opt;
    btn.onclick = () => selectOption(i);
    optionsDiv.appendChild(btn);
  });
}

function selectOption(selected) {
  const q = quizData[currentQuiz];
  const resultDiv = document.getElementById('quiz-result');
  if (selected === q.answer) {
    resultDiv.innerText = "✅ 答對了！";
    score++;
  } else {
    resultDiv.innerText = `❌ 答錯，正確答案是: ${q.options[q.answer]}`;
  }
  document.getElementById('next-btn').style.display = 'block';
}

document.getElementById('next-btn').onclick = () => {
  currentQuiz++;
  if(currentQuiz < quizData.length){
    loadQuiz();
  } else {
    document.getElementById('quiz-question').innerText = `遊戲結束，你答對 ${score} / ${quizData.length} 題！`;
    document.getElementById('quiz-options').innerHTML = '';
    document.getElementById('next-btn').style.display = 'none';
  }
}

// 初始化
loadQuiz();

function goTo(page) {
  window.location.href = page;
}
</script>

</body>
</html>
