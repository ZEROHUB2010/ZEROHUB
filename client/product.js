// product.js - ZEROHUB Product Details Page Engine
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Конфиги Firebase-и ту
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

// Инициализатсия
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let currentLang = localStorage.getItem('zh_lang') || 'ru';

// Гирифтани ID-и маҳсулот аз URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
    if (!productId) {
        console.error("ID-и маҳсулот дар линк ёфт нашуд!");
        showError();
        return;
    }
    loadProductDetails();
});

function loadProductDetails() {
    // Пайвастшавӣ ба папкаи products
    const productRef = ref(database, `products/${productId}`);

    onValue(productRef, (snapshot) => {
        const item = snapshot.val();

        if (!item) {
            console.error("Маҳсулот бо ин ID дар Firebase ёфт нашуд:", productId);
            showError();
            return;
        }

        // Аниқ кардани ном ва тавсиф
        const title = currentLang === 'ru' ? (item.titleRu || item.title_ru || item.title) : (item.titleEn || item.title_en || item.title);
        const description = currentLang === 'ru' ? (item.descRu || item.description_ru || item.description) : (item.descEn || item.description_en || item.description);
        const iconSrc = item.iconUrl || item.image || (item.media && item.media.icon) || '../assets/default-icon.png';
        
        const version = item.version || '1.0.0';
        const size = item.size || '26.3 MB';
        const developer = item.developer || 'ZEROHUB';
        const updated = item.updated || '2026';

        // 🚨 Навсозии элементҳо (ҳам классҳо ва ҳам ID-ҳоро месанҷад)
        setElementText('.app-title', title);
        setElementText('#appTitle', title);
        
        setElementText('.app-developer', developer);
        setElementText('#appDeveloper', developer);
        
        setElementText('.app-description', description || 'Описание отсутствует.');
        setElementText('#appDescription', description || 'Описание отсутствует.');

        // Навсозии иконка
        const iconElements = document.querySelectorAll('.app-icon, #appIcon, .product-icon');
        iconElements.forEach(el => {
            if (el) el.src = iconSrc;
        });

        // Навсозии ҷадвали техникӣ (Версия, Размер, Обновлено)
        updateSpecInfo("Версия", version);
        updateSpecInfo("Размер", size);
        updateSpecInfo("Обновлено", updated);

        // Тугмаи скачат
        const downloadButtons = document.querySelectorAll('.download-btn, #downloadBtn, .btn-download');
        downloadButtons.forEach(btn => {
            if (btn) btn.href = item.downloadUrl || item.downloadURL || '#';
        });

        // Агар блоки хатогӣ кушода бошад, онро пинҳон мекунем
        const errorBlock = document.getElementById('errorBlock') || document.querySelector('.error-container');
        if (errorBlock) errorBlock.style.display = 'none';
    });
}

// Функсияи ёрирасон барои гузоштани матн
function setElementText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.innerText = text;
}

// Функсия барои навсозии Размер ва Версия дар ҷадвалҳо
function updateSpecInfo(label, value) {
    // Кӯшиш мекунад элементҳоро аз рӯи ID ё матни дохили ҷадвал ёбад
    if (label === "Версия") setElementText('#appVersion', value);
    if (label === "Размер") setElementText('#appSize', value);
    if (label === "Обновлено") setElementText('#appUpdated', value);

    // Пайдо кардан аз рӯи матни тегҳо
    const specItems = document.querySelectorAll('.spec-item, .info-row, tr');
    specItems.forEach(item => {
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
