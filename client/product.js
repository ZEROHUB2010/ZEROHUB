// client/product.js - ZEROHUB Product Details Page Engine
import { dbService } from '../firebase.js';

// Танзимоти забон
let currentLang = localStorage.getItem('zh_lang') || 'ru';

const i18n = {
    ru: {
        home: "Главная", apps: "Приложения", games: "Игры",
        version: "Версия", size: "Размер", date: "Обновлено",
        download: "Скачать через Telegram", mediaTitle: "Медиа и Скриншоты",
        descTitle: "Описание", loadingError: "Приложение не найдено или удалено."
    },
    en: {
        home: "Home", apps: "Apps", games: "Games",
        version: "Version", size: "Size", date: "Updated",
        download: "Download via Telegram", mediaTitle: "Media & Screenshots",
        descTitle: "Description", loadingError: "Application not found or deleted."
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    applyLanguage();
    await loadProductDetails();
});

function applyLanguage() {
    document.querySelector('.nav-home').innerText = i18n[currentLang].home;
    document.querySelector('.nav-apps').innerText = i18n[currentLang].apps;
    document.querySelector('.nav-games').innerText = i18n[currentLang].games;
    document.getElementById('mediaTitle').innerText = i18n[currentLang].mediaTitle;
    document.getElementById('descTitle').innerText = i18n[currentLang].descTitle;
}

async function loadProductDetails() {
    // Гирифтани ID аз URL (масалан: product.html?id=-O123456)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        showError();
        return;
    }

    try {
        const product = await dbService.getProductById(productId);

        if (!product) {
            showError();
            return;
        }

        // Зиёд кардани ҳисобкунаки Просмотр (Views) худкор дар база
        await dbService.incrementCounter(productId, 'views');

        // Пур кардани маълумоти статикӣ
        const title = currentLang === 'ru' ? (product.title_ru || product.title) : (product.title_en || product.title);
        const description = currentLang === 'ru' ? (product.description_ru || product.description) : (product.description_en || product.description);

        document.getElementById('appTitle').innerText = title;
        document.getElementById('appId').innerText = product.id;
        document.getElementById('appIcon').src = product.media.icon || '../assets/default-icon.png';
        
        document.getElementById('metaVersion').innerHTML = `${i18n[currentLang].version}: <strong>${product.version}</strong>`;
        document.getElementById('metaSize').innerHTML = `${i18n[currentLang].size}: <strong>${product.size}</strong>`;
        
        // Формати санаи худкор
        const formattedDate = new Date(product.createdAt).toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US');
        document.getElementById('metaDate').innerHTML = `${i18n[currentLang].date}: <strong>${formattedDate}</strong>`;

        document.getElementById('appDescription').innerText = description;

        // Танзими тугмаи Telegram ва ҳисобкунаки скачат
        const downloadBtn = document.getElementById('downloadBtn');
        document.getElementById('btnText').innerText = i18n[currentLang].download;
        downloadBtn.href = product.downloadUrl; // Линки канали Телеграми ту
        
        downloadBtn.addEventListener('click', () => {
            dbService.incrementCounter(productId, 'downloads'); // Ҳисоби худкори скачат
        });

        // Боркунии Скриншотҳо ва Видео (Агар мавҷуд бошанд)
        let hasMedia = false;
        const gallery = document.getElementById('screenshotsGallery');
        gallery.innerHTML = '';

        if (product.media && product.media.screenshots && product.media.screenshots.length > 0) {
            hasMedia = true;
            product.media.screenshots.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = "Screenshot";
                gallery.appendChild(img);
            });
        }

        // Боркунии Трейлери Видео (YouTube ё файл)
        const trailerContainer = document.getElementById('trailerContainer');
        trailerContainer.innerHTML = '';
        
        if (product.media && product.media.trailer) {
            hasMedia = true;
            trailerContainer.style.display = 'block';
            
            if (product.media.trailer.includes('youtube.com') || product.media.trailer.includes('youtu.be')) {
                // Агар линки YouTube бошад, ба iframe табдил медиҳад
                let embedUrl = product.media.trailer.replace("watch?v=", "embed/");
                if(embedUrl.includes('youtu.be/')) {
                    embedUrl = embedUrl.replace("youtu.be/", "youtube.com/embed/");
                }
                trailerContainer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
            } else {
                // Агар линки оддии файл бошад, плеери HTML5 мемонад
                trailerContainer.innerHTML = `<video src="${product.media.trailer}" controls></video>`;
            }
        }

        if (hasMedia) {
            document.getElementById('mediaSection').style.display = 'block';
        }

    } catch (error) {
        console.error("Хатогӣ дар боркунии маҳсулот:", error);
        showError();
    }
}

function showError() {
    document.getElementById('appTitle').innerText = i18n[currentLang].loadingError;
    document.getElementById('appDescription').innerText = "";
    document.querySelector('.product-main').style.opacity = "0.5";
    document.getElementById('downloadBtn').style.display = "none";
}
