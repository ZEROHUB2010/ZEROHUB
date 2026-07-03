import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_qDc-FbKjLGUF0YTJBQMiLE8sbw8mpGI",
    authDomain: "zerohub2010.firebaseapp.com",
    databaseURL: "https://zerohub2010-default-rtdb.firebaseio.com",
    projectId: "zerohub2010",
    storageBucket: "zerohub2010.firebasestorage.app",
    messagingSenderId: "10761752021",
    appId: "1:10761752021:web:891c5494e298f2c21e815c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const ADMIN_EMAIL = "azizzodavalijon2010@gmail.com";
const errorBox = document.getElementById('errorBox');

if (localStorage.getItem("admin_logged_in") === "true") {
    window.location.replace('dashboard.html');
}

// ТЕСТ КАРДАНИ ХАТОГӢ: Ин қисм агар хатогӣ бошад, ба ту дар экран СУОЛУ ҶАВОБ медиҳад
getRedirectResult(auth)
    .then((result) => {
        if (result && result.user) {
            const user = result.user;
            alert("Шумо бомуваффақият ворид шудед: " + user.email); // Барои санҷиш
            
            if (user.email === ADMIN_EMAIL) {
                localStorage.setItem("admin_logged_in", "true");
                window.location.replace('dashboard.html');
            } else {
                alert("Почтаи хато! Шумо админ нестед.");
                signOut(auth);
            }
        }
    })
    .catch((error) => {
        // МАНА ИН ҶО: Агар Firebase ягон хатогӣ диҳад, рост дар телефони ту тирезаи калон кушода мешавад!
        alert("ХАТОГИИ АСЛӢ: " + error.code + " -> " + error.message);
        if (errorBox) {
            errorBox.innerText = "Хатогӣ: " + error.message;
            errorBox.style.display = 'block';
        }
    });

const loginBtn = document.getElementById('googleLoginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (errorBox) errorBox.style.display = 'none';
        signInWithRedirect(auth, provider);
    });
}
