const ADMIN_EMAIL = "azizzodavalijon2010@gmail.com";
const ADMIN_PASSWORD = "zerohub2026"; // 🔥 ИН ҶО РАМЗИ МАХФИИ ТУСТ!

const errorBox = document.getElementById('errorBox');

// Агар аллакай ворид шуда бошад, рост ба панел гузарад
if (localStorage.getItem("admin_logged_in") === "true") {
    window.location.replace('dashboard.html');
}

const loginBtn = document.getElementById('googleLoginBtn');
if (loginBtn) {
    // Текст ва намуди тугмаро дигар мекунем, то бо имейл шавад
    loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Ворид шудан ба Панел';
    
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (errorBox) errorBox.style.display = 'none';

        // Як тирезаи хурд кушода мешавад ва рамзро мепурсад
        const password = prompt("Рамзи махфии Админро ворид кунед:");

        if (password === ADMIN_PASSWORD) {
            localStorage.setItem("admin_logged_in", "true");
            window.location.replace('dashboard.html');
        } else if (password !== null) {
            if (errorBox) {
                errorBox.innerText = "Рамзи махфи хато аст! Дастрасӣ рад шуд.";
                errorBox.style.display = 'block';
            }
        }
    });
}
