// Рамзи аслии ту бо ҳарфҳои калони тоҷикӣ
const ADMIN_PASSWORD = "ВАЛИҶОН2010"; 

const errorBox = document.getElementById('errorBox');

// Агар аллакай ворид шуда бошад, рост ба панел гузарад
if (localStorage.getItem("admin_logged_in") === "true") {
    window.location.replace('dashboard.html');
}

const loginBtn = document.getElementById('googleLoginBtn');
if (loginBtn) {
    loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Ворид шудан ба Панел';
    
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (errorBox) errorBox.style.display = 'none';

        // Тиреза барои ворид кардани рамз
        const password = prompt("Рамзи махфии Админро ворид кунед:");

        if (password !== null) {
            // Санҷиши рост ва оддӣ бе ҳеҷ гуна пинҳонкунӣ
            if (password === ADMIN_PASSWORD) {
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
