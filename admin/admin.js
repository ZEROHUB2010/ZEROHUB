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

// Агар аллакай сабт бошад, рост гузарад
if (localStorage.getItem("admin_logged_in") === "true") {
    window.location.replace('dashboard.html');
}

getRedirectResult(auth)
    .then((result) => {
        if (result && result.user) {
            if (result.user.email === ADMIN_EMAIL) {
                localStorage.setItem("admin_logged_in", "true");
                window.location.replace('dashboard.html');
            } else {
                alert("Рад шуд! Почтаи бегона.");
                signOut(auth);
            }
        }
    })
    .catch((error) => {
        alert("Хатогии редирект: " + error.message);
    });

const loginBtn = document.getElementById('googleLoginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signInWithRedirect(auth, provider);
    });
}
