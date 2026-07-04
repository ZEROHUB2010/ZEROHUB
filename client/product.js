// product.js - ZEROHUB Product Details Page Engine
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_qDc-FbKjLGUF0YTJBQMiLE8sbw8mpGI",
  authDomain: "zerohub2010.firebaseapp.com",
  databaseURL: "https://zerohub2010-default-rtdb.firebaseio.com",
  projectId: "zerohub2010",
  storageBucket: "zerohub2010.firebasestorage.app",
  messagingSenderId: "10761752021",
  appId: "1:10761752021:web:891c5494e298f2c21e815c",
  measurementId: "G-7MM70103ZZ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let currentLang = localStorage.getItem('zh_lang') || 'ru';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
    if (!productId || productId === 'undefined') {
        showError();
        return;
    }
    loadProductDetails();
});

function loadProductDetails() {
    const productRef = ref(database, `products/${productId}`);

    onValue(productRef, (snapshot) => {
        const item = snapshot.val();

        if (!item) {
            showError();
            return;
        }

        const title = currentLang === 'ru' ? (item.titleRu || item.title) : (item.titleEn || item.title);
        const description = currentLang === 'ru' ? (item.descRu || item.description) : (item.descEn || item.description);
        const iconSrc = item.iconUrl || 'https://via.placeholder.com/100';

        // Гузоштани маълумотҳо ба саҳифа
        setElementText('.app-title', title);
        setElementText('#appTitle', title);
        setElementText('.app-developer', item.developer || 'ZEROHUB');
        setElementText('#appDeveloper', item.developer || 'ZEROHUB');
        setElementText('.app-description', description || 'Описание отсутствует.');
        setElementText('#appDescription', description || 'Описание отсутствует.');

        document.querySelectorAll('.app-icon, #appIcon, .product-icon').forEach(el => {
            if (el) el.src = iconSrc;
        });

        // Навсозии таблитсаи техникӣ
        updateSpecInfo("Версия", item.version || '1.0.0');
        updateSpecInfo("Размер", item.size || '26.3 MB');
        updateSpecInfo("Обновлено", item.updated || '2026');

        // Линки тугмаи скачат
        document.querySelectorAll('.download-btn, #downloadBtn, .btn-download').forEach(btn => {
            if (btn) btn.href = item.downloadUrl || item.downloadURL || '#';
        });

        const errorBlock = document.getElementById('errorBlock') || document.querySelector('.error-container');
        if (errorBlock) errorBlock.style.display = 'none';
    });
}

function setElementText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.innerText = text;
}

function updateSpecInfo(label, value) {
    if (label === "Версия") setElementText('#appVersion', value);
    if (label === "Размер") setElementText('#appSize', value);
    if (label === "Обновлено") setElementText('#appUpdated', value);

    document.querySelectorAll('.spec-item, .info-row, tr').forEach(item => {
        if (item.innerText.includes(label)) {
            const valEl = item.querySelector('.spec-value, .info-value, td:last-child');
            if (valEl) valEl.innerText = value;
        }
    });
}

function showError() {
    const errorTitle = document.getElementById('errorTitle') || document.querySelector('.error-message') || document.querySelector('h1');
    if (errorTitle) {
        errorTitle.innerText = currentLang === 'ru' ? "Приложение не найдено или удалено." : "Application not found or deleted.";
    }
}
