// admin/manage.js - ZEROHUB Product Management Engine
import { authService, dbService } from '../firebase.js';

const ADMIN_EMAIL = "azizzodavalijon2010@gmail.com";

// 1. САНҶИШИ АМНИЯТИ ОҲАНИН
authService.onAuthStateCheck((user) => {
    if (!user || user.email !== ADMIN_EMAIL) {
        window.location.href = 'login.html';
    } else {
        loadAdminProducts();
    }
});

// Тугмаи Баромад
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await authService.logout();
        window.location.href = 'login.html';
    });
}

// 2. БОРКУНИИ РӮЙХАТИ МАҲСУЛОТ БА ҶАДВАЛ
async function loadAdminProducts() {
    const listContainer = document.getElementById('adminProductsList');
    if (!listContainer) return;

    listContainer.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">Боркунии рӯйхат...</td></tr>`;

    try {
        // Гирифтани маҳсулот дар ҳолати зинда (Realtime)
        dbService.listenToStats((stats) => {
            const products = stats.rawData;
            listContainer.innerHTML = '';

            if (products.length === 0) {
                listContainer.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">Ягон барнома илова نشده است.</td></tr>`;
                return;
            }

            // Тартиб додани рӯйхат (Аз навтарин ба кӯҳна)
            products.sort((a, b) => b.createdAt - a.createdAt);

            products.forEach(item => {
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td><img src="${item.media.icon || '../assets/default-icon.png'}" alt="Icon"></td>
                    <td style="color:var(--primary); font-weight:600;">${item.id}</td>
                    <td><strong style="color:var(--text-main);">${item.title_ru || item.title}</strong></td>
                    <td><span style="background:var(--bg-hover); padding:4px 8px; border-radius:6px; font-size:12px;">${item.type === 'games' ? 'Бозӣ' : 'Барнома'}</span></td>
                    <td><i class="fa-solid fa-eye" style="color:var(--text-muted);"></i> ${item.views || 0}</td>
                    <td><i class="fa-solid fa-download" style="color:var(--primary);"></i> ${item.downloads || 0}</td>
                    <td><button class="btn-delete" data-id="${item.id}"><i class="fa-solid fa-trash"></i> Нест кардан</button></td>
                `;

                // Илова кардани функсияи худкори Несткунӣ ба тугма
                tr.querySelector('.btn-delete').addEventListener('click', async (e) => {
                    const productId = e.target.getAttribute('data-id');
                    const confirmDelete = confirm(`Оё дар ҳақиқат мехоҳед барномаи дорои ID-и ${productId}-ро пурра нест кунед?`);
                    
                    if (confirmDelete) {
                        try {
                            // Нест кардани маҳсулот бо ID аз Firebase
                            await dbService.deleteProduct(productId);
                            alert(`Маҳсулоти ${productId} бомуваффақият нест карда шуд!`);
                        } catch (err) {
                            alert("Хатогӣ ҳангоми нест кардан: " + err.message);
                        }
                    }
                });

                listContainer.appendChild(tr);
            });
        });

    } catch (error) {
        console.error("Хатогӣ дар панели идоракунӣ:", error);
    }
}
