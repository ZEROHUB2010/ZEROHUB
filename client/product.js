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

        // Аниқ кардани ном ва тавсиф аз рӯи калидҳои дақиқи дашборд (titleRu, descRu)
        const title = currentLang === 'ru' ? (item.titleRu || item.title) : (item.titleEn || item.title);
        const description = currentLang === 'ru' ? (item.descRu || item.description) : (item.descEn || item.description);
        const iconSrc = item.iconUrl || 'https://via.placeholder.com/100';

        // 1. Гузоштани маълумотҳои асосӣ
        setElementText('.app-title', title);
        setElementText('#appTitle', title);
        setElementText('.app-developer', item.developer || 'ZEROHUB');
        setElementText('#appDeveloper', item.developer || 'ZEROHUB');
        setElementText('.app-description', description || 'Описание отсутствует.');
        setElementText('#appDescription', description || 'Описание отсутствует.');

        document.querySelectorAll('.app-icon, #appIcon, .product-icon, .app-details-header img').forEach(el => {
            if (el) el.src = iconSrc;
        });

        // 2. 🔥 Калидҳои ҳақиқӣ аз коди dashboard.js-и ту
        const versionVal = item.version || '1.0.0';
        const sizeVal = item.size || '26.3 MB';
        
        // Коркарди санаи пайдоиш (Масалан: 2026-07-04)
        let updatedVal = '2026';
        if (item.date) {
            try {
                updatedVal = item.date.split('T')[0]; // Танҳо рӯз, моҳ ва солро мегирад
            } catch(e) {
                updatedVal = item.date;
            }
        }

        // 3. Навсозии қисмҳои техникӣ дар экран
        updateTechnicalInfo(versionVal, sizeVal, updatedVal);

        // 4. Линки тугмаи СКАЧАТ (Маҳз аз рӯи калиди prodDownloadUrl -> downloadUrl)
        document.querySelectorAll('.download-btn, #downloadBtn, .btn-download, a.download-link').forEach(btn => {
            if (btn) {
                btn.href = item.downloadUrl || '#';
            }
        });

        const errorBlock = document.getElementById('errorBlock') || document.querySelector('.error-container');
        if (errorBlock) errorBlock.style.display = 'none';
    });
}

function setElementText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.innerText = text;
}

// Функсияи пурқувватшуда барои ҷойгузин кардани Версия ва Размер
function updateTechnicalInfo(version, size, updated) {
    // 1-ум вариант: Агар дар саҳифа тегҳо бо ID-и махсус бошанд
    setElementText('#appVersion', version);
    setElementText('#appSize', size);
    setElementText('#appUpdated', updated);

    // 2-юм вариант: Ҷустуҷӯи матнҳои дохили блокҳо ва иваз кардани тиреҳо
    const allBlocks = document.querySelectorAll('div, p, span, td, li');
    allBlocks.forEach(el => {
        // Танҳо он блокҳоеро мекобад, ки калимаҳои лозимиро доранд
        if (el.children.length === 0 || el.children.length === 1) {
            const rawText = el.innerText;
            if (rawText.includes('Версия:')) {
                el.innerHTML = `Версия: <span style="font-weight:600; color:#fff;">${version}</span>`;
            }
            if (rawText.includes('Размер:')) {
                el.innerHTML = `Размер: <span style="font-weight:600; color:#fff;">${size}</span>`;
            }
            if (rawText.includes('Обновлено:')) {
                el.innerHTML = `Обновлено: <span style="font-weight:600; color:#fff;">${updated}</span>`;
            }
        }
    });
}

function showError() {
    const errorTitle = document.getElementById('errorTitle') || document.querySelector('.error-message') || document.querySelector('h1');
    if (errorTitle) {
        errorTitle.innerText = currentLang === 'ru' ? "Приложение не найдено или удалено." : "Application not found or deleted.";
    }
}
