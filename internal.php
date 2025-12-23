<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>日本國內 Q&A 小遊戲｜JapanGo</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="indexstyle.css">
  <style>
    .quiz-container { max-width:600px; margin:40px auto; background:#fff; padding:20px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
    .quiz-question { font-size:1.2rem; margin-bottom:15px; }
    .quiz-options button { margin:5px 0; padding:10px 15px; width:100%; border:none; border-radius:8px; background:#f0f0f0; cursor:pointer; transition:0.3s; }
    .quiz-options button:hover { background:#d32f2f; color:white; }
    .quiz-result { margin-top:15px; font-weight:bold; }
    .quiz-title { font-size:1.5rem; margin-bottom:10px; text-align:center; }
  </style>
</head>
<body>

<header>
  <h1>日本國內注意事項 Q&A 小遊戲</h1>
</header>

<nav class="navbar">
  <ul>
    <li onclick="goTo('index.php')">首頁</li>
    <li onclick="goTo('Entryquiz.php')">入境 Q&A</li>
    <li onclick="goTo('internal.php')">國內 Q&A</li>
    <li onclick="goTo('japanese.html')">日文學習</li>
  </ul>
</nav>

<div class="container">
  <section id="qa-game" class="quiz-container">
    <div class="quiz-title">日本國內 Q&A 小遊戲</div>
    <div id="quiz-question" class="quiz-question"></div>
    <div id="quiz-options" class="quiz-options"></div>
    <div id="quiz-result" class="quiz-result"></div>
    <button id="next-btn" style="margin-top:15px; display:none;">下一題</button>
  </section>
</div>

<script>
// 日本國內題目
const quizData = [
  {
    question: "在日本搭乘電車，進站時需要做什麼？",
    options: ["直接走進月台", "刷車票或IC卡", "拍照", "叫站務員"],
    answer: 1
  },
  {
    question: "在日本公共場合打電話應該？",
    options: ["大聲講話", "使用耳機或低聲", "隨意", "打電話給任何人"],
    answer: 1
  },
  {
    question: "進入日本便利商店購物時，以下哪個行為正確？",
    options: ["隨意觸摸商品", "結帳前自行拿取商品", "尊重店員指示和排隊", "搶商品"],
    answer: 2
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
