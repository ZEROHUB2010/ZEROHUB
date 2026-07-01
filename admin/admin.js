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

// Мантиқи пахши тугмаи "Ворид шудан"
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
