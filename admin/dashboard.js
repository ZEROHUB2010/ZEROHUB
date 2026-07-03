import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_qDc-FbKjLGUF0YTJBQMiLE8sbw8mpGI",
    authDomain: "zerohub2010.firebaseapp.com",
    databaseURL: "https://zerohub2010-default-rtdb.firebaseio.com",
    projectId: "zerohub2010",
    storageBucket: "zerohub2010.firebasestorage.app",
    messagingSenderId: "10761752021",
    appId: "1:10761752021:web:891c5494e298f2c21e815c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔥 ИСЛОҲИ АСОСӢ: Санҷиши оддии сабти телефон (Бе блок кардан)
if (localStorage.getItem("admin_logged_in") !== "true") {
    window.location.replace('login.html');
}

// Бор кардани омори барномаҳо аз база
const productsRef = ref(db, 'products');
onValue(productsRef, (snapshot) => {
    if (snapshot.exists()) {
        document.getElementById('statTotalProducts').innerText = Object.keys(snapshot.val()).length;
    } else {
        document.getElementById('statTotalProducts').innerText = "0";
    }
});

// Формаи илова кардани бозӣ/барнома ба базаи Firebase
const form = document.getElementById('addProductForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProduct = {
            titleRu: document.getElementById('prodTitleRu').value,
            titleEn: document.getElementById('prodTitleEn').value,
            type: document.getElementById('prodType').value,
            category: document.getElementById('prodCategory').value,
            version: document.getElementById('prodVersion').value,
            size: document.getElementById('prodSize').value,
            downloadUrl: document.getElementById('prodDownloadUrl').value,
            iconUrl: document.getElementById('prodIconUrl').value,
            trailerUrl: document.getElementById('prodTrailerUrl').value || "",
            screenshots: document.getElementById('prodScreenshots').value ? document.getElementById('prodScreenshots').value.split(',') : [],
            descRu: document.getElementById('prodDescRu').value,
            descEn: document.getElementById('prodDescEn').value,
            isFeatured: document.getElementById('prodIsFeatured').checked,
            views: 0,
            downloads: 0,
            date: new Date().toISOString()
        };

        push(ref(db, 'products'), newProduct)
            .then(() => {
                alert("Маҳсулот бомуваффақият ба база илова шуд! 🎉");
                form.reset();
            })
            .catch((error) => {
                alert("Хатогӣ ҳангоми сабт: " + error.message);
            });
    });
}

// Тугмаи Баромад (Logout)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem("admin_logged_in");
        window.location.replace('login.html');
    });
}
