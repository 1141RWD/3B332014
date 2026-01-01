// --- 安全檢查：未登入管理者跳回首頁 ---
if (localStorage.getItem("admin") !== "true") {
    alert("請先從首頁登入管理員帳號！");
    location.href = "index.html";
}

let adminMap;
let adminMarker;

// --- 1. 初始化管理員地圖 ---
function initAdminMap() {
    adminMap = new google.maps.Map(document.getElementById("adminMap"), {
        center: { lat: 36.2048, lng: 138.2529 },
        zoom: 5,
    });

    // 點擊地圖自動填入經緯度
    adminMap.addListener("click", (e) => {
        const lat = e.latLng.lat().toFixed(6);
        const lng = e.latLng.lng().toFixed(6);
        document.getElementById("evLat").value = lat;
        document.getElementById("evLng").value = lng;

        if (adminMarker) adminMarker.setMap(null);
        adminMarker = new google.maps.Marker({
            position: e.latLng,
            map: adminMap,
            animation: google.maps.Animation.DROP
        });
    });

    renderAdminEvents();
    renderMemberList();
}

// --- 2. 切換標籤頁 ---
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // 先隱藏所有內容
    document.getElementById('eventTabContent').style.display = 'none';
    document.getElementById('memberTabContent').style.display = 'none';
    document.getElementById('recordTabContent').style.display = 'none';

    // 顯示指定內容
    if (tabName === 'eventTab') {
        document.getElementById('eventTabContent').style.display = 'block';
    } else if (tabName === 'memberTab') {
        document.getElementById('memberTabContent').style.display = 'block';
        renderMemberList(); // 確保會員名單有更新
    } else if (tabName === 'recordTab') {
        document.getElementById('recordTabContent').style.display = 'block';
        renderCustomerRecords(); // 【關鍵】切換到此分頁時載入紀錄
    }
}

// --- 3. 景點 CRUD 邏輯 ---
function addEvent() {
    const title = document.getElementById("evTitle").value;
    const region = document.getElementById("evRegion").value;
    const location = document.getElementById("evLocation").value;
    const lat = document.getElementById("evLat").value;
    const lng = document.getElementById("evLng").value;
    const desc = document.getElementById("evDesc").value;
    const img = document.getElementById("evImg").value;

    if (!title || !lat || !lng) { alert("請填寫活動名稱並在地圖上選取位置！"); return; }

    // 【修改點】不要用 const events，直接讀取或初始化
    let currentEvents = JSON.parse(localStorage.getItem("events")) || [];
    
    // 如果 localstorage 還是空的（第一次使用後台），記得把 indexjs.js 裡的預設 12 個補進去，否則首頁會變空白
    // 但如果你已經 clear 過了，這裡直接 push 就好
    currentEvents.push({ region, title, location, lat: parseFloat(lat), lng: parseFloat(lng), desc, img });
    
    localStorage.setItem("events", JSON.stringify(currentEvents));
    
    alert("活動已成功新增！");
    clearForm();
    renderAdminEvents();
}

function renderAdminEvents() {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    const tbody = document.getElementById("eventTableBody");
    tbody.innerHTML = events.map((e, index) => `
        <tr>
            <td>${e.region}</td>
            <td>${e.title}</td>
            <td>${e.lat}, ${e.lng}</td>
            <td><span class="delete-link" onclick="deleteEvent(${index})">刪除</span></td>
        </tr>
    `).join('');
}

function deleteEvent(index) {
    if (confirm("確定要刪除這個景點嗎？")) {
        let events = JSON.parse(localStorage.getItem("events")) || [];
        events.splice(index, 1);
        localStorage.setItem("events", JSON.stringify(events));
        renderAdminEvents();
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

// --- 4. 會員名單邏輯 ---
function renderMemberList() {
    let users = JSON.parse(localStorage.getItem("memberUsers")) || [];
    const tbody = document.getElementById("memberTableBody");
    tbody.innerHTML = users.map((u, index) => `
        <tr>
            <td>${u.username}</td>
            <td>${u.realName}</td>
            <td>${u.phone}</td>
            <td>${u.email}</td>
            <td><span class="delete-link" onclick="deleteMember(${index})">停權</span></td>
        </tr>
    `).join('');
}

function deleteMember(index) {
    if (confirm("確定要刪除該會員嗎？這將導致其無法登入。")) {
        let users = JSON.parse(localStorage.getItem("memberUsers")) || [];
        users.splice(index, 1);
        localStorage.setItem("memberUsers", JSON.stringify(users));
        renderMemberList();
    }
}

function clearForm() {
    ["evTitle", "evLocation", "evImg", "evLat", "evLng", "evDesc"].forEach(id => document.getElementById(id).value = "");
}

function adminLogout() {
    localStorage.removeItem("admin");
    location.href = "index.html";
}

// --- 渲染使用者行程紀錄 (admin 專用) ---
function renderCustomerRecords() {
    const tbody = document.getElementById("recordTableBody");
    if (!tbody) return;

    // 讀取所有使用者的儲存紀錄
    const records = JSON.parse(localStorage.getItem("customerRecords")) || [];

    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">目前尚無任何行程預約紀錄</td></tr>';
        return;
    }

    tbody.innerHTML = records.map((r, index) => {
        // 將 itinerary 陣列轉為文字列表
        const itineraryList = r.itinerary.map(item => item.name).join(' → ');
        
        return `
            <tr>
                <td>${r.createdAt}</td>
                <td style="font-weight:bold; color:#2c3e50;">${r.userName}</td>
                <td>${r.totalStops}</td>
                <td style="font-size:12px; max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${itineraryList}">
                    ${itineraryList}
                </td>
                <td>
                    <button class="delete-link" onclick="deleteRecord(${index})" style="background:none; border:none; text-decoration:underline;">刪除</button>
                </td>
            </tr>
        `;
    }).join('');
}

// 刪除紀錄函式
function deleteRecord(index) {
    if (confirm("確定要刪除這筆預約紀錄嗎？")) {
        let records = JSON.parse(localStorage.getItem("customerRecords")) || [];
        records.splice(index, 1);
        localStorage.setItem("customerRecords", JSON.stringify(records));
        renderCustomerRecords(); // 刷新表格
    }
}

function goTo(p) { location.href = p; }
