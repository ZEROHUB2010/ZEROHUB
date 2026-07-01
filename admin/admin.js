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
const database = firebase.database();

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

// === МАНТИҚИ АМНИЯТӢ БАРОИ САҲИФАҲОИ АДМИНКА ===
auth.onAuthStateChanged((user) => {
    const isDashboard = window.location.pathname.includes('dashboard.html');
    const isProducts = window.location.pathname.includes('products.html');
    
    if (isDashboard || isProducts) {
        if (!user) {
            // Агар логин накарда бошад, ба саҳифаи लॉगिन пеш кун
            window.location.href = "login.html";
        } else {
            // Агар дар саҳифаи dashboard бошад ва логин дошта бошад
            const adminEmailSpan = document.getElementById('admin-email');
            if (adminEmailSpan) adminEmailSpan.innerText = user.email;
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

// === МАНТИҚИ САҲИФАИ МАҲСУЛОТҲО (products.html) ===
const toggleFormBtn = document.getElementById('toggle-form-btn');
const productFormBlock = document.getElementById('product-form-block');

if (toggleFormBtn && productFormBlock) {
    // 1. Намоиш ё пинҳон кардани формаи иловакунӣ
    toggleFormBtn.addEventListener('click', () => {
        if (productFormBlock.style.display === "none" || productFormBlock.style.display === "") {
            productFormBlock.style.display = "block";
            toggleFormBtn.innerText = "X Пинҳон кардан";
            toggleFormBtn.style.background = "#ff4a4a";
            toggleFormBtn.style.color = "white";
        } else {
            productFormBlock.style.display = "none";
            toggleFormBtn.innerText = "+ Иловаи нав";
            toggleFormBtn.style.background = "#3ddc84";
            toggleFormBtn.style.color = "black";
        }
    });
}

// Функсия барои автоматӣ сохтани Slug (Линки зебо аз рӯи ном)
function generateSlug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Иваз кардани пробелҳо ба дефис (-)
        .replace(/[^\w\-]+/g, '')       // Танҳо ҳарфҳо ва дефисро нигоҳ медорад
        .replace(/\-\-+/g, '-')         // Дефисҳои зиёдатиро нест мекунад
        .replace(/^-+/, '')             // Дефисро аз аввали матн нест мекунад
        .replace(/-+$/, '');            // Дефисро аз охири матн нест мекунад
}
