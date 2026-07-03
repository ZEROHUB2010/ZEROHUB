// Ин коди пинҳоншудаи "zerohub2026" аст, ки дар GitHub ҳамин хел меистад:
const ENCRYPTED_PASSWORD =zerohub2010

const errorBox = document.getElementById('errorBox');

if (localStorage.getItem("admin_logged_in") === "true") {
    window.location.replace('dashboard.html');
}

const loginBtn = document.getElementById('googleLoginBtn');
if (loginBtn) {
    loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Ворид шудан ба Панел';
    
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (errorBox) errorBox.style.display = 'none';

        const password = prompt("Рамзи махфии Админро ворид кунед:");

        if (password !== null) {
            // Рамзи навиштаи туро бо усули оддӣ ва устувор кодгузорӣ мекунад
            const userEncoded = btoa(password);

            // Санҷиш бо коди GitHub
            if (userEncoded === ENCRYPTED_PASSWORD) {
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
