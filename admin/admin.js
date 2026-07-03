// Сабти рамзи ту ба таври "хеш" (Ин рақамҳоро ҳеҷ кас кушода наметавонад!)
const HASHED_PASSWORD = "b3c9b7405e6b72a6a2468d6e7bf7918f0cb646011c7989d2d0981977cfb9195d"; 

const errorBox = document.getElementById('errorBox');

// Функсияи махсус барои рамзгузорӣ (SHA-256)
async function hashPassword(string) {
    const utf8 = new Uint8Array(string.split('').map(c => c.charCodeAt(0)));
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Агар аллакай ворид шуда бошад, рост ба панел гузарад
if (localStorage.getItem("admin_logged_in") === "true") {
    window.location.replace('dashboard.html');
}

const loginBtn = document.getElementById('googleLoginBtn');
if (loginBtn) {
    loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Ворид шудан ба Панел';
    
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (errorBox) errorBox.style.display = 'none';

        // Пурсидани рамз аз ту
        const password = prompt("Рамзи махфии Админро ворид кунед:");

        if (password !== null) {
            // Рамзи навиштаи туро ба рамзи компютерӣ табдил медиҳад
            const userHash = await hashPassword(password);

            // Санҷиши рамзи табдилшуда бо рамзи пинҳонии GitHub
            if (userHash === HASHED_PASSWORD) {
                localStorage.setItem("admin_logged_in", "true");
                window.location.replace('dashboard.html');
            } else {
                if (errorBox) {
                    errorBox.innerText = "Рамзи махфи хато аст! Дастрасӣ рад шуд.";
                    errorBox.style.display = 'block';
                }
            }
        }
    });
}
