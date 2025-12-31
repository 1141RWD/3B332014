const phrases = [
    { jp: "こんにちは", romaji: "Konnichiwa", zh: "你好 / 午安", type: "greet" },
    { jp: "おはようございます", romaji: "Ohayou gozaimasu", zh: "早安", type: "greet" },
    { jp: "ありがとうございます", romaji: "Arigatou gozaimasu", zh: "謝謝", type: "greet" },
    { jp: "いくらですか？", romaji: "Ikura desu ka?", zh: "這個多少錢？", type: "shop" },
    { jp: "これください", romaji: "Kore kudasai", zh: "我要這個", type: "shop" },
    { jp: "カード使えますか？", romaji: "Kaado tsukaemasu ka?", zh: "可以刷卡嗎？", type: "shop" }
];

// 初始化顯示全部
function displayPhrases(filter = 'all') {
    const container = document.getElementById("jp-list"); // 👈 這裡要對應你的 HTML ID
    if (!container) return;

    let html = "";
    const filtered = filter === 'all' ? phrases : phrases.filter(p => p.type === filter);

    filtered.forEach(p => {
        html += `
            <div class="phrase-item">
                <div class="jp-text">${p.jp}</div>
                <div class="romaji-text">${p.romaji}</div>
                <div class="zh-text">${p.zh}</div>
            </div>
        `;
    });

    container.innerHTML = html || "<p>暫無內容</p>";
}

// 過濾器按鈕功能
function filterType(type) {
    // 1. 重新渲染資料
    displayPhrases(type);

    // 2. 切換按鈕的 active 樣式
    const buttons = document.querySelectorAll('.jp-filters button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // 找到被點擊的那個按鈕並加上 active
    event.currentTarget.classList.add('active');
}

// 導覽列跳轉
function goTo(page) {
    window.location.href = page;
}

// 頁面載入完成後立刻執行
window.onload = function() {
    displayPhrases('all');
};