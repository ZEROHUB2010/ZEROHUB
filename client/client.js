// client/client.js - ZEROHUB Client Engine (RU/EN Support)
import { dbService } from '../firebase.js';

// Танзимоти забони пешфарз
let currentLang = localStorage.getItem('zh_lang') || 'ru';

// Луғати тарҷумаҳо барои Сайти Мардум
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

// Инициализатсияи Саҳифа
document.addEventListener('DOMContentLoaded', async () => {
    setupLanguageSwitcher();
    applyLanguageStrings();
    await loadMainPageProducts();
});

// Танзими ивазкунандаи забон
function setupLanguageSwitcher() {
    const headerContainer = document.querySelector('.user-actions');
    if (!headerContainer) return;

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

// Тарҷумаи элементҳои статикии сайт
function applyLanguageStrings() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) searchInput.placeholder = i18n[currentLang].searchPlaceholder;

    document.querySelector('.nav-home').innerText = i18n[currentLang].home;
    document.querySelector('.nav-apps').innerText = i18n[currentLang].apps;
    document.querySelector('.nav-games').innerText = i18n[currentLang].games;
    document.getElementById('linkTerms').innerText = i18n[currentLang].terms;
    document.getElementById('linkPrivacy').innerText = i18n[currentLang].privacy;

    document.getElementById('titleFeatured').innerHTML = `${i18n[currentLang].featured} <a href="products.html?filter=featured">${i18n[currentLang].viewAll} <i class="fa-solid fa-arrow-right"></i></a>`;
    document.getElementById('titleNew').innerHTML = `${i18n[currentLang].newReleases} <a href="products.html?filter=new">${i18n[currentLang].viewAll} <i class="fa-solid fa-arrow-right"></i></a>`;
    document.getElementById('titlePopular').innerHTML = `${i18n[currentLang].popular} <a href="products.html?filter=popular">${i18n[currentLang].viewAll} <i class="fa-solid fa-arrow-right"></i></a>`;
}

// Боркунии маҳсулот аз Firebase
async function loadMainPageProducts() {
    const featuredGrid = document.getElementById('featuredAppsGrid');
    const newGrid = document.getElementById('newAppsGrid');
    const popularGrid = document.getElementById('popularAppsGrid');

    if (!featuredGrid || !newGrid || !popularGrid) return;

    featuredGrid.innerHTML = '';
    newGrid.innerHTML = '';
    popularGrid.innerHTML = '';

    try {
        const products = await dbService.getAllProducts();
        
        const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
        const newProducts = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
        const popularProducts = [...products].sort((a, b) => b.stats.downloads - a.stats.downloads).slice(0, 4);

        renderGrid(featuredProducts, featuredGrid);
        renderGrid(newProducts, newGrid);
        renderGrid(popularProducts, popularGrid);
    } catch (error) {
        console.error("Хатогии боркунӣ:", error);
    }
}

// Рендери Картаҳои Маҳсулот
function renderGrid(items, targetGrid) {
    if (items.length === 0) {
        targetGrid.innerHTML = `<div style="color:var(--text-muted); padding:20px;">${i18n[currentLang].noApps}</div>`;
        return;
    }

    items.forEach(item => {
        const title = currentLang === 'ru' ? (item.title_ru || item.title) : (item.title_en || item.title);
        
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <img src="${item.media.icon || '../assets/default-icon.png'}" alt="${title}" class="app-icon">
            <div class="app-name">${title}</div>
            <div class="app-meta">
                <span>${item.version}</span>
                <span style="color:var(--primary)">${item.id}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${item.id}`;
        });
        
        targetGrid.appendChild(card);
    });
}
