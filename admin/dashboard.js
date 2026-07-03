import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
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
const auth = getAuth(app);
const db = getDatabase(app);

const ADMIN_EMAIL = "azizzodavalijon2010@gmail.com";

// 🔥 ПОСБОНИ ПАНЕЛ: Агар админ ворид нашуда бошад, ба логин мепартояд
onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== ADMIN_EMAIL) {
        window.location.replace('login.html');
    }
});

// 📊 БОР КАРДАНИ ОМОР АЗ БАЗАИ FIREBASE
const productsRef = ref(db, 'products');
onValue(productsRef, (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        const total = Object.keys(data).length;
        document.getElementById('statTotalProducts').innerText = total;
    } else {
        document.getElementById('statTotalProducts').innerText = "0";
    }
});

// ➕ ФУНКСИЯИ ИЛОВА КАРДАНИ БОЗӢ/БАРНОМА БА БАЗА
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

        const newProdRef = push(ref(db, 'products'));
        set(newProdRef, newProduct)
            .then(() => {
                alert("Маҳсулот бомуваффақият ба база илова шуд! 🎉");
                form.reset();
            })
            .catch((error) => {
                alert("Хатогӣ ҳангоми сабт: " + error.message);
            });
    });
}

// 🚪 ТУГМАИ БАРОМАД (LOGOUT)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.replace('login.html');
        });
    });
}
