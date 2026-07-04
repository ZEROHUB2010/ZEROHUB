// client/client.js - ZEROHUB Client Engine (RU/EN Support)
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

const i18n = {
    ru: {
        searchPlaceholder: "Поиск приложений и игр...",
        home: "Главная",
        apps: "Приложения",
        games: "Игры",
        featured: "Рекомендуемые",
        newReleases: "Новинки",
        popular: "Популярные",
        viewAll: "Смотреть все",
        noApps: "Нет доступных приложений.",
        terms: "Условия",
        privacy: "Конфиденциальность"
    },
    en: {
        searchPlaceholder: "Search apps and games...",
        home: "Home",
        apps: "Apps",
        games: "Games",
        featured: "Featured",
        newReleases: "New Releases",
        popular: "Popular",
        viewAll: "View all",
        noApps: "No applications available.",
        terms: "Terms",
        privacy: "Privacy"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupLanguageSwitcher();
    applyLanguageStrings();
    loadMainPageProducts();
});

function setupLanguageSwitcher() {
    const headerContainer = document.querySelector('.user-actions');
    if (!headerContainer) return;

    const oldBtn = document.querySelector('.lang-toggle-btn');
    if (oldBtn) oldBtn.remove();

    const langBtn = document.createElement('button');
    langBtn.className = 'lang-toggle-btn';
    langBtn.innerText = currentLang.toUpperCase();
    langBtn.style.cssText = "background:var(--bg-hover); color:var(--text-main); border:1px solid var(--border-color); padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:600; margin-right:10px;";
    
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        localStorage.setItem('zh_lang', currentLang);
        langBtn.innerText = currentLang.toUpperCase();
        applyLanguageStrings();
        loadMainPageProducts();
    });

    headerContainer.insertBefore(langBtn, headerContainer.firstChild);
}

function applyLanguageStrings() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) searchInput.placeholder = i18n[currentLang].searchPlaceholder;

    const navHome = document.querySelector('.nav-home');
    const navApps = document.querySelector('.nav-apps');
    const navGames = document.querySelector('.nav-games');
    const linkTerms = document.getElementById('linkTerms');
    const linkPrivacy = document.getElementById('linkPrivacy');

    if (navHome) navHome.innerText = i18n[currentLang].home;
    if (navApps) navApps.innerText = i18n[currentLang].apps;
    if (navGames) navGames.innerText = i18n[currentLang].games;
    if (linkTerms) linkTerms.innerText = i18n[currentLang].terms;
    if (linkPrivacy) linkPrivacy.innerText = i18n[currentLang].privacy;

    const tFeatured = document.getElementById('titleFeatured');
    const tNew = document.getElementById('titleNew');
    const tPopular = document.getElementById('titlePopular');

    if (tFeatured) tFeatured.innerHTML = `${i18n[currentLang].featured} <a href="products.html?filter=featured">${i18n[currentLang].viewAll} <i class="fa-solid fa-arrow-right"></i></a>`;
    if (tNew) tNew.innerHTML = `${i18n[currentLang].newReleases} <a href="products.html?filter=new">${i18n[currentLang].viewAll} <i class="fa-solid fa-arrow-right"></i></a>`;
    if (tPopular) tPopular.innerHTML = `${i18n[currentLang].popular} <a href="products.html?filter=popular">${i18n[currentLang].viewAll} <i class="fa-solid fa-arrow-right"></i></a>`;
}

function loadMainPageProducts() {
    const featuredGrid = document.getElementById('featuredAppsGrid');
    const newGrid = document.getElementById('newAppsGrid');
    const popularGrid = document.getElementById('popularAppsGrid');

    if (!featuredGrid || !newGrid || !popularGrid) return;

    // 🔥 АНА ИН ҶО! Акнун мустақим аз папкаи 'products' мехонем:
    const productsRef = ref(database, 'products');

    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        
        featuredGrid.innerHTML = '';
        newGrid.innerHTML = '';
        popularGrid.innerHTML = '';

        if (!data) {
            featuredGrid.innerHTML = `<div style="color:var(--text-muted); padding:20px;">${i18n[currentLang].noApps}</div>`;
            newGrid.innerHTML = `<div style="color:var(--text-muted); padding:20px;">${i18n[currentLang].noApps}</div>`;
            popularGrid.innerHTML = `<div style="color:var(--text-muted); padding:20px;">${i18n[currentLang].noApps}</div>`;
            return;
        }

        const productsList = Object.keys(data).map(key => {
            return { id: key, ...data[key] };
        });

        // Филтр ва сорт кардани барномаҳо/бозиҳо аз папкаи products
        const featuredProducts = productsList.filter(p => p.isFeatured || p.featured).slice(0, 4);
        const newProducts = [...productsList].reverse().slice(0, 4);
        const popularProducts = [...productsList].sort((a, b) => {
            const downloadsA = a.downloads || (a.stats && a.stats.downloads) || 0;
            const downloadsB = b.downloads || (b.stats && b.stats.downloads) || 0;
            return downloadsB - downloadsA;
        }).slice(0, 4);

        renderGrid(featuredProducts, featuredGrid);
        renderGrid(newProducts, newGrid);
        renderGrid(popularProducts, popularGrid);
    });
}

function renderGrid(items, targetGrid) {
    if (items.length === 0) {
        targetGrid.innerHTML = `<div style="color:var(--text-muted); padding:20px;">${i18n[currentLang].noApps}</div>`;
        return;
    }

    items.forEach(item => {
        const title = currentLang === 'ru' ? (item.title_ru || item.title) : (item.title_en || item.title);
        // Агар линки акс дар база дар калиди 'image' ё 'media.icon' бошад, онро мехонад
        const iconSrc = item.image || (item.media && item.media.icon) || 'https://via.placeholder.com/100';
        const version = item.version || '1.0.0';

        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <div class="app-icon-wrapper">
                <img src="${iconSrc}" alt="${title}" class="app-icon">
            </div>
            <div class="app-details">
                <h3 class="app-title">${title}</h3>
                <p class="app-developer">${item.developer || 'ZEROHUB'}</p>
                <div class="app-meta">
                    <span class="app-rating"><i class="fa-solid fa-star"></i> 4.8</span>
                    <span class="app-size">${item.size || version}</span>
                </div>
            </div>
            <a href="#" class="download-btn-grid" title="Скачать"><i class="fa-solid fa-arrow-down"></i></a>
        `;
        
        card.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `product.html?id=${item.id}`;
        });
        
        targetGrid.appendChild(card);
    });
}
