// --- 全域變數 ---
let map, gMarker = null, gRouteLine = null;
let gRouteMarkers = []; // 存儲地圖上的數字標記
let gRoutePoints = [];  // 存儲行程清單 {pos, name}

// 預設活動
const defaultEvents = [
    // --- 北海道 ---
    {region:"北海道", title:"札幌雪祭", location:"札幌", lat:43.0618, lng:141.3545, desc:"冬季必看雪雕活動", route:"札幌站 → 大通公園", img:"imges/札幌雪祭.jpg"},
    {region:"北海道", title:"小樽運河", location:"小樽", lat:43.1907, lng:141.0063, desc:"浪漫瓦斯燈與紅磚倉庫", route:"小樽站 → 步行10分鐘", img:"imges/otaru.jpg"},
    {region:"北海道", title:"旭山動物園", location:"旭川", lat:43.7684, lng:142.4801, desc:"看企鵝散步與北極熊", route:"旭川站 → 接駁巴士", img:"imges/旭山動物園.jpg"},

    // --- 本州 ---
    {region:"本州", title:"東京淺草雷門", location:"東京", lat:35.7148, lng:139.7967, desc:"東京下町文化", route:"淺草站 → 雷門", img:"imges/東京淺草雷門.jpg"},
    {region:"本州", title:"大阪道頓堀", location:"大阪", lat:34.6687, lng:135.5013, desc:"螃蟹道樂與跑跑人看板", route:"難波站 → 步行5分鐘", img:"imges/大阪道頓堀.jpg"},
    {region:"本州", title:"京都清水寺", location:"京都", lat:34.9949, lng:135.7850, desc:"世界文化遺產，木造舞台", route:"京都站 → 市巴士清水坂", img:"imges/京都清水寺.jpg"},
    {region:"本州", title:"奈良梅花鹿公園", location:"奈良", lat:34.6851, lng:135.8430, desc:"與可愛的小鹿近距離互動", route:"近鐵奈良站 → 步行10分鐘", img:"imges/奈良梅花鹿公園.jpg"},
    {region:"本州", title:"富士山河口湖", location:"山梨", lat:35.5050, lng:138.7667, desc:"絕美逆富士倒影", route:"河口湖站 → 區間巴士", img:"imges/富士山河口湖.jpg"},

    // --- 九州四國 ---
    {region:"九州四國", title:"福岡屋台", location:"福岡", lat:33.5902, lng:130.4017, desc:"夜晚屋台美食", route:"博多站 → 中洲", img:"imges/福岡屋台.jpg"},
    {region:"九州四國", title:"由布院溫泉", location:"大分", lat:33.2642, lng:131.3552, desc:"晨霧瀰漫的金鱗湖與溫泉街", route:"由布院站 → 步行溫泉街", img:"imges/由布院溫泉.jpg"},
    {region:"九州四國", title:"長崎原爆資料館", location:"長崎", lat:32.7725, lng:129.8643, desc:"祈禱世界和平的歷史之地", route:"長崎路面電車 → 原爆資料館站", img:"imges/長崎原爆資料館.jpg"},
    {region:"九州四國", title:"高松栗林公園", location:"香川", lat:34.3298, lng:134.0443, desc:"米其林三星級的大名庭園", route:"栗林公園北口站 → 步行3分鐘", img:"imges/高松栗林公園.jpg"}
];
// 直接拿掉 let 或 var，這樣絕對不會報 Identifier already declared 錯誤
events = JSON.parse(localStorage.getItem("events")) || defaultEvents;
// --- 3. 合併資料 (解決消失問題的關鍵) ---
// 先取得後台新增的資料，若沒有就給空陣列 []
const adminAddedEvents = JSON.parse(localStorage.getItem("events")) || [];

// 使用展開運算子 (...) 把 12 筆預設跟後台新增的合併在一起
// 這樣你的 events 永遠會包含最原始的 12 筆 + 新增的 N 筆
events = [...defaultEvents, ...adminAddedEvents];

// --- 1. 初始化 Google Maps ---
async function initMap() {
    // 讀取本地快取資料
    const savedData = localStorage.getItem("gRoutePoints");
    gRoutePoints = savedData ? JSON.parse(savedData) : [];

    // 載入必要的函式庫
    const { Map } = await google.maps.importLibrary("maps");
    const { Autocomplete } = await google.maps.importLibrary("places");

    // 初始化地圖
    const center = { lat: 36.2048, lng: 138.2529 };
    map = new Map(document.getElementById("map"), {
        zoom: 5,
        center: center,
        mapId: "DEMO_MAP_ID", 
        mapTypeControl: false,
        streetViewControl: true
    });

    // 搜尋功能初始化
    const input = document.getElementById("startPointInput");
    if (input) {
        const autocomplete = new Autocomplete(input, {
            componentRestrictions: { country: "jp" },
            fields: ["geometry", "name"]
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place || !place.geometry) return;
            addStopToItinerary(place.geometry.location.lat(), place.geometry.location.lng(), "🏠 " + place.name);
            input.value = "";
        });
    }

    // 渲染 UI
    renderEvents();
    renderItineraryUI();
    drawGRoute();
    updateUI();
}

// 渲染活動小卡
function renderEvents() {
    const keyword = (document.getElementById("searchInput")?.value || "").toLowerCase();
    const regionFilter = document.getElementById("regionFilter")?.value || "全部";
    
    const lists = { 
        "北海道": document.getElementById("hokkaido"), 
        "本州": document.getElementById("honshu"), 
        "九州四國": document.getElementById("kyushu") 
    };

    Object.values(lists).forEach(el => { if(el) el.innerHTML = ""; });

    events.filter(e => {
        const mText = e.title.toLowerCase().includes(keyword) || e.location.toLowerCase().includes(keyword);
        const mRegion = regionFilter === "全部" || e.region === regionFilter;
        return mText && mRegion;
    }).forEach(e => {
        const card = `
            <div class="event-card" onclick="selectEvent(${e.lat},${e.lng},'${e.title}','${e.location}','${e.desc}','${e.route}','${e.img}')">
                <div class="event-img" style="background-image:url('${e.img || 'imges/default.jpg'}')"></div>
                <div class="event-info"><h3>${e.title}</h3><p>📍 ${e.location}</p></div>
            </div>`;
        if (lists[e.region]) lists[e.region].innerHTML += card;
    });
}

// 加入行程點
async function addStopToItinerary(lat, lng, name) {
    const pos = { lat: Number(lat), lng: Number(lng) };
    gRoutePoints.push({ pos, name });
    localStorage.setItem("gRoutePoints", JSON.stringify(gRoutePoints));
    renderItineraryUI();
    drawGRoute();
}

// 渲染清單 UI
function renderItineraryUI() {
    const list = document.getElementById("itineraryList");
    const hint = document.getElementById("emptyHint");
    if (!list) return;
    if (hint) hint.style.display = gRoutePoints.length > 0 ? "none" : "block";

    list.innerHTML = gRoutePoints.map((p, index) => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#f0f0f0; margin:5px 0; padding:8px; border-radius:5px; font-size:13px;">
            <span>${index + 1}. ${p.name}</span>
            <span onclick="removeStop(${index})" style="color:red; cursor:pointer; font-weight:bold;">✕</span>
        </div>
    `).join('');
}

// 在地圖上繪製路徑
async function drawGRoute() {
    if (gRouteLine) gRouteLine.setMap(null);
    gRouteMarkers.forEach(m => m.map = null);
    gRouteMarkers = [];

    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    gRoutePoints.forEach((p, index) => {
        const pin = new PinElement({ glyph: (index + 1).toString(), background: "#1e90ff", glyphColor: "white" });
        const m = new AdvancedMarkerElement({ position: p.pos, map: map, content: pin.element, title: p.name });
        gRouteMarkers.push(m);
    });

    if (gRoutePoints.length >= 2) {
        gRouteLine = new google.maps.Polyline({
            path: gRoutePoints.map(p => p.pos),
            strokeColor: "#1e90ff",
            strokeWeight: 4,
            map: map
        });
    }
}
// 管理者登入函式 (對應 HTML 裡的管理者登入框)
function login() {
    const adminUser = document.getElementById("adminUser").value;
    const adminPass = document.getElementById("adminPass").value;

    if (adminUser === "admin" && adminPass === "1234") {
        localStorage.setItem("admin", "true");
        alert("登入成功，正在前往管理頁面...");
        window.location.href = "admin.html";
    } else {
        alert("帳號或密碼錯誤！");
    }
}

function removeStop(index) {
    gRoutePoints.splice(index, 1);
    localStorage.setItem("gRoutePoints", JSON.stringify(gRoutePoints));
    renderItineraryUI();
    drawGRoute();
}

function clearItinerary() {
    if (!confirm("確定要清空行程嗎？")) return;
    gRoutePoints = [];
    localStorage.removeItem("gRoutePoints");
    renderItineraryUI();
    drawGRoute();
}

// 點擊卡片顯示詳情
async function selectEvent(lat, lng, title, loc, desc, route, img) {
    const pos = { lat: Number(lat), lng: Number(lng) };
    map.setCenter(pos);
    map.setZoom(15);

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    if (gMarker) gMarker.map = null;
    gMarker = new AdvancedMarkerElement({ map: map, position: pos, title: title });

    document.getElementById("modalImg").src = img;
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalLocation").innerText = "📍 " + loc;
    document.getElementById("modalDesc").innerText = desc;
    document.getElementById("modalRoute").innerHTML = `
        <p>🚶 推薦路線：${route}</p>
        <button onclick="addStopToItinerary(${lat}, ${lng}, '${title}')" style="background:#4caf50; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer; width:100%; margin-top:10px;">
            ➕ 加入我的行程清單
        </button>
    `;
    document.getElementById("eventModal").style.display = "flex";
}

// --- 會員與輔助功能 ---
function updateUI() {
    const isLogin = localStorage.getItem("memberLogin") === "true";
    document.getElementById("userInfoBox").style.display = isLogin ? "block" : "none";
    if (isLogin) document.getElementById("userNameDisplay").innerText = localStorage.getItem("currentUserName");
    document.getElementById("logoutNavBtn").style.display = isLogin ? "block" : "none";
}

function memberLogout() {
    localStorage.removeItem("memberLogin");
    location.reload();
}

function openRoutePlanner() {
    if (localStorage.getItem("memberLogin") !== "true") {
        document.getElementById("memberLoginModal").style.display = "flex";
        return;
    }
    document.getElementById("sideRoutePanel").classList.add("active");
}

function closeRoutePlanner() { document.getElementById("sideRoutePanel").classList.remove("active"); }
function closeModal() { 
    document.getElementById("eventModal").style.display = "none"; 
    document.getElementById("memberLoginModal").style.display = "none";
}
function goTo(p) { location.href = p; }
function openLogin() {
    const b = document.getElementById("loginBox");
    if (b) {
        b.style.display = (b.style.display === "none" ? "block" : "none");
    }
}

// --- 儲存顧客行程記錄功能 (saveCustomerRecord) ---

window.saveCustomerRecord = function() {
    // 1. 檢查登入狀態
    const isLogin = localStorage.getItem("memberLogin") === "true";
    const currentUserName = localStorage.getItem("currentUserName");
    
    if (!isLogin) {
        alert("請先登入會員，才能提交行程預約記錄！");
        return;
    }

    // 2. 檢查是否有行程點
    if (!gRoutePoints || gRoutePoints.length === 0) {
        alert("目前的行程清單是空的，請先加入景點後再儲存！");
        return;
    }

    // 3. 建立記錄物件
    const newRecord = {
        id: "REC" + Date.now(), // 產生唯一的記錄編號
        userName: currentUserName,
        itinerary: gRoutePoints, // 儲存經緯度與景點名稱陣列
        totalStops: gRoutePoints.length,
        createdAt: new Date().toLocaleString()
    };

    try {
        // 4. 讀取現有的記錄清單，並加入新記錄
        let records = JSON.parse(localStorage.getItem("customerRecords")) || [];
        records.push(newRecord);
        
        // 5. 存回 localStorage
        localStorage.setItem("customerRecords", JSON.stringify(records));
        
        // 6. 成功提示
        alert("您的行程記錄已成功提交！管理員將會為您進行後續安排。");
        
        // 可選：儲存後是否要清空目前地圖上的暫存
        // clearItinerary(); 
    } catch (error) {
        console.error("儲存記錄失敗:", error);
        alert("儲存失敗，請檢查瀏覽器空間是否充足。");
    }
};

// --- 歷史紀錄選單功能 (全域掛載版) ---

// 1. 開關歷史紀錄選單
window.toggleHistoryList = function() {
    const container = document.getElementById("historyContainer");
    if (!container) return;

    if (container.style.display === "none") {
        container.style.display = "block";
        window.renderHistoryList(); // 打開時順便刷新列表內容
    } else {
        container.style.display = "none";
    }
};

// 2. 渲染紀錄列表內容
window.renderHistoryList = function() {
    const container = document.getElementById("historyContainer");
    if (!container) return;

    // 從 localStorage 抓取 customerRecords (確保名稱與之前儲存的一致)
    const records = JSON.parse(localStorage.getItem("customerRecords")) || [];

    if (records.length === 0) {
        container.innerHTML = '<p style="font-size: 12px; color: #999; text-align: center; padding: 10px;">尚無紀錄</p>';
        return;
    }

    // 生成列表 HTML
    let html = '<ul style="list-style: none; padding: 0; margin: 0; max-height: 300px; overflow-y: auto;">';
    
    records.forEach((record, index) => {
        html += `
            <li style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1; cursor: pointer;" onclick="viewHistoryDetail(${index})">
                    <div style="font-size: 13px; font-weight: bold; color: #333;">${record.createdAt}</div>
                    <div style="font-size: 11px; color: #666;">景點數: ${record.totalStops}</div>
                </div>
                <button onclick="deleteHistory(${index})" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 12px;">刪除</button>
            </li>
        `;
    });

    html += '</ul>';
    container.innerHTML = html;
};

// 3. 查看紀錄詳情 (並在地圖上重新繪製)
window.viewHistoryDetail = function(index) {
    const records = JSON.parse(localStorage.getItem("customerRecords")) || [];
    const record = records[index];

    if (record && record.itinerary) {
        // 更新當前行程點變數 (請確認你的變數名是 gRoutePoints)
        gRoutePoints = record.itinerary;
        
        // 執行你的 UI 更新與地圖畫線函式
        if (typeof renderItineraryUI === 'function') renderItineraryUI();
        if (typeof drawGRoute === 'function') drawGRoute();
        
        alert("已載入 " + record.createdAt + " 的歷史行程！");
        // 載入後自動關閉選單
        document.getElementById("historyContainer").style.display = "none";
    }
};

// 4. 刪除紀錄
window.deleteHistory = function(index) {
    event.stopPropagation(); // 防止觸發到父層的載入詳情
    if (confirm("確定要刪除這筆歷史紀錄嗎？")) {
        let records = JSON.parse(localStorage.getItem("customerRecords")) || [];
        records.splice(index, 1);
        localStorage.setItem("customerRecords", JSON.stringify(records));
        window.renderHistoryList(); // 立即刷新列表
    }
};

// --- 會員登入/註冊 UI 互動函式 (全域掛載版) ---

// 1. 切換登入與註冊介面
window.toggleAuth = function(mode) {
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    if (!loginSection || !registerSection) return;

    if (mode === 'reg') {
        loginSection.style.display = "none";
        registerSection.style.display = "block";
    } else {
        loginSection.style.display = "block";
        registerSection.style.display = "none";
    }
};

// 2. 關閉會員登入彈窗
window.closeMemberLogin = function(event) {
    const modal = document.getElementById("memberLoginModal");
    if (!modal) return;
    
    // 如果點擊的是背景(modal)或是帶有 close-btn 類別的元素，才關閉
    if (event.target === modal || event.target.classList.contains('close-btn')) {
        modal.style.display = "none";
    }
};

// 3. 註冊功能
window.memberRegister = function() {
    const username = document.getElementById("regUser").value;
    const realName = document.getElementById("regRealName").value;
    const phone = document.getElementById("regPhone").value;
    const email = document.getElementById("regEmail").value;
    const pass = document.getElementById("regPass").value;
    const passConfirm = document.getElementById("regPassConfirm").value;

    if (!username || !pass || !realName) {
        alert("請填寫必填欄位！");
        return;
    }
    if (pass !== passConfirm) {
        alert("兩次密碼輸入不一致！");
        return;
    }

    let users = JSON.parse(localStorage.getItem("memberUsers")) || [];
    if (users.find(u => u.username === username)) {
        alert("此帳號已被註冊！");
        return;
    }

    users.push({ username, realName, phone, email, pass });
    localStorage.setItem("memberUsers", JSON.stringify(users));
    alert("註冊成功！請重新登入");
    window.toggleAuth('login');
};

// 4. 登入功能
window.memberLogin = function() {
    const user = document.getElementById("memberUser").value;
    const pass = document.getElementById("memberPass").value;

    let users = JSON.parse(localStorage.getItem("memberUsers")) || [];
    const foundUser = users.find(u => u.username === user && u.pass === pass);

    if (foundUser) {
        localStorage.setItem("memberLogin", "true");
        localStorage.setItem("currentUserName", foundUser.realName);
        alert("歡迎回來，" + foundUser.realName + "！");
        location.reload(); 
    } else {
        alert("帳號或密碼錯誤！");
    }
};

// 5. 登出功能 (補充)
window.memberLogout = function() {
    localStorage.removeItem("memberLogin");
    localStorage.removeItem("currentUserName");
    location.reload();
};
