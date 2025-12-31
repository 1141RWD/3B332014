// --- 全域變數 ---
let events = JSON.parse(localStorage.getItem("events")) || defaultEvents;
let map, gMarker = null, gRouteLine = null;
let gRouteMarkers = []; // 存儲地圖上的數字標記
let gRoutePoints = [];  // 存儲行程清單 {pos, name}

// 預設活動
const defaultEvents = [
    {region:"北海道", title:"札幌雪祭", location:"札幌", lat:43.0618, lng:141.3545, desc:"冬季必看雪雕活動", route:"札幌站 → 大通公園", img:"imges/札幌雪祭.jpg"},
    {region:"本州", title:"東京淺草雷門", location:"東京", lat:35.7148, lng:139.7967, desc:"東京下町文化", route:"淺草站 → 雷門", img:"imges/東京淺草雷門.jpg"},
    {region:"九州四國", title:"福岡屋台", location:"福岡", lat:33.5902, lng:130.4017, desc:"夜晚屋台美食", route:"博多站 → 中洲", img:"imges/福岡屋台.jpg"}
];
let events = JSON.parse(localStorage.getItem("events")) || defaultEvents;

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
    b.style.display = b.style.display === "none" ? "block" : "none";
}
