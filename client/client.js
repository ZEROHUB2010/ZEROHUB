// client/client.js - ZEROHUB Client Engine (With Live Search)
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
let allProducts = []; // Барои нигоҳ доштани ҳамаи маҳсулот ҳангоми ҷустуҷӯ

const i18n = {
    ru: { searchPlaceholder: "Поиск приложений и игр...", home: "Главная", apps: "Приложения", games: "Игры", featured: "Рекомендуемые", newReleases: "Новинки", popular: "Популярные", viewAll: "Смотреть все", noApps: "Нет доступных приложений.", terms: "Условия", privacy: "Конфиденциальность" },
    en: { searchPlaceholder: "Search apps and games...", home: "Home", apps: "Apps", games: "Games", featured: "Featured", newReleases: "New Releases", popular: "Popular", viewAll: "View all", noApps: "No applications available.", terms: "Terms", privacy: "Privacy" }
};

document.addEventListener('DOMContentLoaded', () => {
    setupLanguageSwitcher();
    applyLanguageStrings();
    loadMainPageProducts();
    setupSearch(); // 🔥 Фаъол кардани ҷустуҷӯ
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
    if (document.querySelector('.nav-home')) document.querySelector('.nav-home').innerText = i18n[currentLang].home;
    if (document.querySelector('.nav-apps')) document.querySelector('.nav-apps').innerText = i18n[currentLang].apps;
    if (document.querySelector('.nav-games')) document.querySelector('.nav-games').innerText = i18n[currentLang].games;
    if (document.getElementById('linkTerms')) document.getElementById('linkTerms').innerText = i18n[currentLang].terms;
    if (document.getElementById('linkPrivacy')) document.getElementById('linkPrivacy').innerText = i18n[currentLang].privacy;
    if (document.getElementById('titleFeatured')) document.getElementById('titleFeatured').innerHTML = `${i18n[currentLang].featured} <a href="products.html?filter=featured">${i18n[currentLang].viewAll} <i class="fa-solid fa-arrow-right"></i></a>`;
    if (document.getElementById('titleNew')) document.getElementById('titleNew').innerHTML = `${i18n[currentLang].newReleases} <a href="products.html?filter=new">${i18n[currentLang].viewAll} <i class="fa-solid fa-arrow-right"></i></a>`;
    if (document.getElementById('titlePopular')) document.getElementById('titlePopular').innerHTML = `${i18n[currentLang].popular} <a href="products.html?filter=popular">${i18n[currentLang].viewAll} <i class="fa-solid fa-arrow-right"></i></a>`;
}

function loadMainPageProducts() {
    const featuredGrid = document.getElementById('featuredAppsGrid');
    const newGrid = document.getElementById('newAppsGrid');
    const popularGrid = document.getElementById('popularAppsGrid');
    if (!featuredGrid || !newGrid || !popularGrid) return;

    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        featuredGrid.innerHTML = '';
        newGrid.innerHTML = '';
        popularGrid.innerHTML = '';

        if (!data) {
            const noDataHtml = `<div style="color:var(--text-muted); padding:20px;">${i18n[currentLang].noApps}</div>`;
            featuredGrid.innerHTML = noDataHtml; newGrid.innerHTML = noDataHtml; popularGrid.innerHTML = noDataHtml;
            return;
        }

        // Сабти ҳамаи маҳсулот дар массив
        allProducts = Object.keys(data).map(key => {
            return { firebaseId: key, ...data[key] };
        });

        const featuredProducts = allProducts.filter(p => p.isFeatured || p.featured).slice(0, 4);
        const newProducts = [...allProducts].reverse().slice(0, 4);
        const popularProducts = [...allProducts].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 4);

        renderGrid(featuredProducts, featuredGrid);
        renderGrid(newProducts, newGrid);
        renderGrid(popularProducts, popularGrid);
    });
}

// 🔥 Функсияи нав барои ҷустуҷӯ
function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const featuredGrid = document.getElementById('featuredAppsGrid');
        const sections = document.querySelectorAll('.apps-section'); // Блокҳои Новинки ва Популярные

        if (!featuredGrid) return;

        if (query === '') {
            // Агар ҷустуҷӯ холӣ бошад, сайт ба ҳолати аввала бармегардад
            sections.forEach(s => s.style.display = 'block');
            if (document.getElementById('titleFeatured')) {
                document.getElementById('titleFeatured').style.display = 'block';
            }
            loadMainPageProducts();
            return;
        }

        // Пинҳон кардани блокҳои дигар ҳангоми ҷустуҷӯ
        sections.forEach(s => s.style.display = 'none');
        if (document.getElementById('titleFeatured')) {
            document.getElementById('titleFeatured').innerHTML = currentLang === 'ru' ? 'Результаты поиска' : 'Search Results';
        }

        // Филтр кардани маҳсулот аз рӯи номи RU ва EN
        const filtered = allProducts.filter(item => {
            const titleRu = (item.titleRu || '').toLowerCase();
            const titleEn = (item.titleEn || '').toLowerCase();
            return titleRu.includes(query) || titleEn.includes(query);
        });

        featuredGrid.innerHTML = '';
        renderGrid(filtered, featuredGrid);
    });
}

function renderGrid(items, targetGrid) {
    if (items.length === 0) {
        targetGrid.innerHTML = `<div style="color:var(--text-muted); padding:20px;">${i18n[currentLang].noApps || 'Ничего не найдено'}</div>`;
        return;
    }

    items.forEach(item => {
        const title = currentLang === 'ru' ? (item.titleRu || item.title) : (item.titleEn || item.title);
        const iconSrc = item.iconUrl || 'https://via.placeholder.com/100';
        const finalId = item.firebaseId || item.id;

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
                    <span class="app-size">${item.size || '26.3 MB'}</span>
                </div>
            </div>
            <a href="#" class="download-btn-grid" title="Скачать"><i class="fa-solid fa-arrow-down"></i></a>
        `;
        
        card.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `product.html?id=${finalId}`;
        });
        
        targetGrid.appendChild(card);
    });
}
