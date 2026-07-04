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

// Гирифтани ID-и маҳсулот аз линки саҳифа (URL)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
    if (!productId) {
        showError();
        return;
    }
    loadProductDetails();
});

// Функсияи боркунии маълумоти маҳсулот
function loadProductDetails() {
    // 🔥 МУҲИМ: Пайвастшавӣ рост ба папкаи 'products' ва ID-и махсуси он
    const productRef = ref(database, `products/${productId}`);

    onValue(productRef, (snapshot) => {
        const item = snapshot.val();

        if (!item) {
            showError();
            return;
        }

        // Аниқ кардани ном ва тавсифи маҳсулот вобаста ба забон
        const title = currentLang === 'ru' ? (item.titleRu || item.title_ru || item.title) : (item.titleEn || item.title_en || item.title);
        const description = currentLang === 'ru' ? (item.descRu || item.description_ru || item.description) : (item.descEn || item.description_en || item.description);
        
        // Нишони акс (иконка)
        const iconSrc = item.iconUrl || item.image || (item.media && item.media.icon) || '../assets/default-icon.png';
        
        // Маълумоти техникӣ
        const version = item.version || '1.0.0';
        const size = item.size || '26.3 MB';
        const developer = item.developer || 'ZEROHUB';
        const updated = item.updated || '2026';

        // Элементҳои саҳифаро пайдо мекунем ва маълумотро мечаспонем
        const appTitleEl = document.querySelector('.app-title') || document.getElementById('appTitle');
        const appIconEl = document.querySelector('.app-icon') || document.getElementById('appIcon');
        const appDevEl = document.querySelector('.app-developer') || document.getElementById('appDeveloper');
        const appDescEl = document.querySelector('.app-description') || document.getElementById('appDescription');
        
        if (appTitleEl) appTitleEl.innerText = title;
        if (appIconEl) appIconEl.src = iconSrc;
        if (appDevEl) appDevEl.innerText = developer;
        if (appDescEl) appDescEl.innerText = description || (currentLang === 'ru' ? 'Описание отсутствует.' : 'No description available.');

        // Навсозии ҷадвали техникӣ (Версия, Размер, Обновлено)
        const versionEl = document.getElementById('appVersion');
        const sizeEl = document.getElementById('appSize');
        const updatedEl = document.getElementById('appUpdated');

        if (versionEl) versionEl.innerText = version;
        if (sizeEl) sizeEl.innerText = size;
        if (updatedEl) updatedEl.innerText = updated;

        // Тугмаи скачат кардан (Download URL)
        const downloadBtn = document.querySelector('.download-btn') || document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.href = item.downloadUrl || item.downloadURL || '#';
        }
    });
}

// Функсия дар ҳолати хатогӣ ё набудани маҳсулот
function showError() {
    const container = document.querySelector('.page-content') || document.body;
    // Агар блокҳои тайёри хатогӣ дар HTML бошанд, матни онҳоро иваз мекунем
    const errorTitle = document.getElementById('errorTitle') || document.querySelector('.error-message');
    if (errorTitle) {
        errorTitle.innerText = currentLang === 'ru' ? "Приложение не найдено или удалено." : "Application not found or deleted.";
    }
}
