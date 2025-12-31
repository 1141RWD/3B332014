const quizData = [
{
    q: "入境日本時，下列哪一項需要申報？",
    options: ["個人衣物", "超過免稅額的香菸", "手機", "相機"],
    answer: 1
},
{
    q: "入境日本時，肉類食品可以攜帶嗎？",
    options: ["可以", "不可以", "只限熟食", "只限少量"],
    answer: 1
},
{
    q: "Visit Japan Web 的主要用途是？",
    options: ["訂飯店", "填寫入境資料", "買車票", "查天氣"],
    answer: 1
}
];

let current = 0;
let score = 0;

const questionEl = document.getElementById("question");
const buttons = document.querySelectorAll(".options button");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");

function loadQuestion() {
const data = quizData[current];
questionEl.textContent = data.q;
buttons.forEach((btn, index) => {
    btn.textContent = data.options[index];
});
resultEl.textContent = "";
scoreEl.textContent = `目前分數：${score}`;
}

function answer(choice) {
if (choice === quizData[current].answer) {
    resultEl.textContent = "✅ 答對了！";
    score++;
} else {
    resultEl.textContent = "❌ 答錯囉！";
}

current++;
if (current < quizData.length) {
    setTimeout(loadQuestion, 800);
} else {
    setTimeout(() => {
    questionEl.textContent = "🎉 問答完成！";
    document.querySelector(".options").style.display = "none";
    resultEl.textContent = `你的總分是 ${score} / ${quizData.length}`;
    }, 800);
}
}

function goTo(p){ location.href=p; }
loadQuestion();