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

// Ин танзимот тирезаро маҷбур мекунад, ки аккаунтҳои Google-ро нишон диҳад
provider.setCustomParameters({
    prompt: 'select_account'
});

const ADMIN_EMAIL = "azizzodavalijon2010@gmail.com";
const errorBox = document.getElementById('errorBox');

// 1. Санҷиши худкори натиҷа пас аз бозгашт аз Google
getRedirectResult(auth)
    .then((result) => {
        if (result && result.user) {
            const user = result.user;
            
            if (user.email === ADMIN_EMAIL) {
                // Агар почтаи ту бошад, рост ба панел мегузарӣ
                window.location.replace('dashboard.html');
            } else {
                if (errorBox) {
                    errorBox.innerText = "Дастрасӣ рад шуд! Шумо админи ин сайт нестед.";
                    errorBox.style.display = 'block';
                }
                signOut(auth);
            }
        }
    })
    .catch((error) => {
        console.error("Хатогии Firebase:", error);
        if (errorBox) {
            errorBox.innerText = "Хатогӣ: " + error.message;
            errorBox.style.display = 'block';
        }
    });

// 2. Пахши тугма бе ларзиши зиёдатӣ
const loginBtn = document.getElementById('googleLoginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Аниматсия ва ларзиши тугмаро блок мекунад
        
        if (errorBox) errorBox.style.display = 'none';
        
        // Гузариши расмӣ ба Google
        signInWithRedirect(auth, provider);
    });
}
