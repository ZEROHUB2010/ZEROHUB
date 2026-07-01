// Танзимоти Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_qDc-FbKjLGUF0YTJBQMiLE8sbw8mpGI",
  authDomain: "zerohub2010.firebaseapp.com",
  databaseURL: "https://zerohub2010-default-rtdb.firebaseio.com",
  projectId: "zerohub2010",
  storageBucket: "zerohub2010.firebasestorage.app",
  messagingSenderId: "10761752021",
  appId: "1:10761752021:web:891c5494e298f2c21e815c"
};

// Оғоз
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Логин
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        auth.signInWithEmailAndPassword(email, password)
            .then(() => window.location.href = "dashboard.html")
            .catch(() => alert("Email ё Парол нодуруст!"));
    });
}

// Амният
auth.onAuthStateChanged((user) => {
    const isProtected = window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('products.html');
    if (isProtected && !user) window.location.href = "login.html";
    if (user && document.getElementById('admin-email')) document.getElementById('admin-email').innerText = user.email;
});

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) logoutBtn.addEventListener('click', () => auth.signOut().then(() => window.location.href = "login.html"));

// Формаи иловакунӣ
const toggleFormBtn = document.getElementById('toggle-form-btn');
const productFormBlock = document.getElementById('product-form-block');
if (toggleFormBtn && productFormBlock) {
    toggleFormBtn.addEventListener('click', () => {
        productFormBlock.style.display = productFormBlock.style.display === "none" ? "block" : "none";
    });
}

// Сабт ба база
const saveProductBtn = document.getElementById('save-product-btn');
if (saveProductBtn) {
    saveProductBtn.addEventListener('click', () => {
        const title = document.getElementById('p-title').value;
        database.ref('settings/last_id_counter').transaction((c) => (c || 0) + 1, (err, comm, snap) => {
            if (comm) {
                const id = "ZH-" + String(snap.val()).padStart(6, '0');
                database.ref('products/' + id).set({
                    id: id,
                    title: title,
                    category: document.getElementById('p-category').value,
                    download_url: document.getElementById('p-download').value,
                    image_url: document.getElementById('p-image').value
                }).then(() => { alert("Сабт шуд!"); location.reload(); });
            }
        });
    });
}

// Рӯйхати маҳсулотҳо
const list = document.getElementById('products-list-tbody');
if (list) {
    database.ref('products').on('value', (snap) => {
        list.innerHTML = "";
        snap.forEach((child) => {
            const p = child.val();
            list.innerHTML += `<tr><td>${p.id}</td><td>${p.title}</td><td>${p.category}</td><td><button onclick="database.ref('products/${p.id}').remove()">X</button></td></tr>`;
        });
    });
}
