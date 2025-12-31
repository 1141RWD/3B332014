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
    
    if (tabName === 'eventTab') {
        document.getElementById('eventTabContent').style.display = 'block';
        document.getElementById('memberTabContent').style.display = 'none';
    } else {
        document.getElementById('eventTabContent').style.display = 'none';
        document.getElementById('memberTabContent').style.display = 'block';
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

    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push({ region, title, location, lat: parseFloat(lat), lng: parseFloat(lng), desc, img });
    localStorage.setItem("events", JSON.stringify(events));
    
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

function goTo(p) { location.href = p; }