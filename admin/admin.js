// Танзимоти Firebase (Ин ҷоро баъдтар бо маълумоти худат иваз мекунем)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Ибтидои Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// === МАНТИҚИ САҲИФАИ ЛОГИН (login.html) ===
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error-message');

        if(!email || !password) {
            errorDiv.innerText = "Лутфан ҳамаи майдонҳоро пур кунед!";
            errorDiv.style.display = "block";
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = "dashboard.html";
            })
            .catch((error) => {
                errorDiv.innerText = "Email ё Пароли нодуруст!";
                errorDiv.style.display = "block";
            });
    });
}

// === МАНТИҚИ САҲИФАИ АСОСӢ (dashboard.html) ===
// Амният: Санҷиши он ки админ ворид шудааст ё не
auth.onAuthStateChanged((user) => {
    // Агар мо дар саҳифаи dashboard бошем
    if (window.location.pathname.includes('dashboard.html')) {
        if (user) {
            // Агар ворид шуда бошад, email-ашро дар экран нишон медиҳем
            document.getElementById('admin-email').innerText = user.email;
            
            // Дар ин ҷо баъдтар коди хондани статистикаро аз базаи маълумот илова мекунем
        } else {
            // Агар логин накарда бошад, ӯро ба саҳифаи लॉगिन мефиристем
            window.location.href = "login.html";
        }
    }
});

// Функсияи Хуруҷ (Logout)
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = "login.html";
        });
    });
}
