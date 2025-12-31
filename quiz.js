function goTo(page) {
  window.location.href = page;
}
const quiz = [
  {
    q: "在日本電車上，哪個行為是正確的？",
    c: ["大聲講電話", "吃便當", "將手機設為靜音"],
    a: 2
  },
  {
    q: "在日本餐廳用餐後，是否需要給小費？",
    c: ["一定要給", "看心情", "不需要"],
    a: 2
  },
  {
    q: "日本街道垃圾桶較少，垃圾應該？",
    c: ["隨地丟棄", "帶回家丟", "交給店員"],
    a: 1
  }
];

let index = 0;

function loadQuiz() {
  document.getElementById("result").innerText = "";
  document.getElementById("question").innerText = quiz[index].q;
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  quiz[index].c.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.onclick = () => checkAnswer(i);
    choicesDiv.appendChild(btn);
  });
}

function checkAnswer(choice) {
  const result = document.getElementById("result");
  if (choice === quiz[index].a) {
    result.innerText = "✅ 答對了！";
  } else {
    result.innerText = "❌ 答錯了，再想想看～";
  }

  setTimeout(() => {
    index = (index + 1) % quiz.length;
    loadQuiz();
  }, 1200);
}

loadQuiz();