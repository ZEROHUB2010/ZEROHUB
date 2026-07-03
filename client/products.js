// client/products.js - Catalog Filter & Live Search Engine
import { dbService } from '../firebase.js';

let currentLang = localStorage.getItem('zh_lang') || 'ru';
let allProducts = [];

const i18n = {
    ru: { home: "Главная", apps: "Приложения", games: "Игры", all: "Все приложения и игры", search: "Поиск в каталоге...", noResult: "Ничего не найдено." },
    en: { home: "Home", apps: "Apps", games: "Games", all: "All Apps & Games", search: "Search in catalog...", noResult: "No results found." }
};

document.addEventListener('DOMContentLoaded', async () => {
    applyLanguage();
    await loadCatalog();
    
    // Ҷустуҷӯи зинда (Живой Поиск)
    document.getElementById('catalogSearch').addEventListener('input', (e) => {
        filterAndRender(e.target.value.trim().toLowerCase());
    });
});

function applyLanguage() {
    document.getElementById('catalogSearch').placeholder = i18n[currentLang].search;
    document.getElementById('catalogTitle').innerText = i18n[currentLang].all;
}

async function loadCatalog() {
    try {
        allProducts = await dbService.getAllProducts();
        filterAndRender('');
    } catch (error) {
        console.error(error);
    }
}

function filterAndRender(searchTerm) {
    const grid = document.getElementById('catalogGrid');
    grid.innerHTML = '';

    const urlParams = new URLSearchParams(window.location.search);
    const typeFilter = urlParams.get('type'); // apps ё games
    const filterTag = urlParams.get('filter'); // featured, new, popular

    // Филтратсияи худкор
    let filtered = allProducts.filter(item => {
        const title = currentLang === 'ru' ? (item.title_ru || item.title) : (item.title_en || item.title);
        const matchesSearch = title.toLowerCase().includes(searchTerm);
        
        if (typeFilter && item.type !== typeFilter) return false;
        if (filterTag === 'featured' && !item.isFeatured) return false;
        
        return matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="color:var(--text-muted); padding:20px;">${i18n[currentLang].noResult}</div>`;
        return;
    }

    filtered.forEach(item => {
        const title = currentLang === 'ru' ? (item.title_ru || item.title) : (item.title_en || item.title);
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <img src="${item.media.icon || '../assets/default-icon.png'}" alt="${title}" class="app-icon">
            <div class="app-name">${title}</div>
            <div class="app-meta"><span>${item.version}</span><span style="color:var(--primary)">${item.id}</span></div>
        `;
        card.addEventListener('click', () => window.location.href = `product.html?id=${item.id}`);
        grid.appendChild(card);
    });
}
