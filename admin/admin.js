import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithRedirect, onAuthStateChanged, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

// 🔥 ПОСБОНИ ХУДКОР: Ин қисм ҳамеша месанҷад, ки кӣ ворид шуд
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Агар почтаи ту бошад, рост ба панел мегузарӣ
        if (user.email === ADMIN_EMAIL) {
            window.location.href = 'dashboard.html';
        } else {
            if (errorBox) {
                errorBox.innerText = "Дастрасӣ рад шуд! Шумо админи ин сайт нестед.";
                errorBox.style.display = 'block';
            }
            signOut(auth);
        }
    }
});

// Пахши тугма барои гузариш ба Google
const loginBtn = document.getElementById('googleLoginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (errorBox) errorBox.style.display = 'none';
        signInWithRedirect(auth, provider);
    });
}
