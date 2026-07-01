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
// === ФУНКСИЯИ САБТ КАРДАНИ МАҲСУЛОТ БА БАЗА (FIREBASE) ===
const saveProductBtn = document.getElementById('save-product-btn');
if (saveProductBtn) {
    saveProductBtn.addEventListener('click', () => {
        // Гирифтани маълумот аз майдонҳои форма
        const title = document.getElementById('p-title').value;
        const version = document.getElementById('p-version').value;
        const size = document.getElementById('p-size').value;
        const category = document.getElementById('p-category').value;
        const imageUrl = document.getElementById('p-image').value;
        const downloadUrl = document.getElementById('p-download').value;
        const description = document.getElementById('p-desc').value;

        // Санҷиш: оё майдонҳои асосӣ пур шудаанд?
        if (!title || !downloadUrl) {
            alert("Лутфан Номи маҳсулот ва Линки боргириро ворид кунед!");
            return;
        }

        // Алоқа бо бахши танзимоти база барои гирифтани рақами ID-и охирин
        const counterRef = database.ref('settings/last_id_counter');
        
        counterRef.transaction((currentCounter) => {
            // Агар дар база ҳисобкунак набошад, онро аз 1 сар мекунем
            return (currentCounter || 0) + 1;
        }, (error, committed, snapshot) => {
            if (committed) {
                const newIdNumber = snapshot.val();
                
                // Формат кардани ID ба намуди ZH-000001
                const formattedId = "ZH-" + String(newIdNumber).padStart(6, '0');
                
                // Худкор сохтани Slug аз рӯи номи маҳсулот
                const slug = generateSlug(title);
                
                // Санаи имрӯзаи худкор (Формат: СССС-ММ-ҶҶ)
                const today = new Date().toISOString().split('T')[0];

                // Объект (маълумот)-и маҳсулот барои сабт
                const productData = {
                    id: formattedId,
                    title: title,
                    slug: slug,
                    version: version || "v1.0",
                    size: size || "Номаълум",
                    category: category,
                    image_url: imageUrl || "",
                    download_url: downloadUrl,
                    description: description || "",
                    downloads_count: 0,
                    views_count: 0,
                    created_at: today
                };

                // Сабти маҳсулот ба папкаи 'products' дар Firebase
                database.ref('products/' + formattedId).set(productData)
                    .then(() => {
                        alert("Маҳсулот бо ID-и " + formattedId + " бомуваффақият сабт шуд!");
                        // Тоза кардани майдонҳои форма пас аз сабт
                        document.getElementById('p-title').value = "";
                        document.getElementById('p-version').value = "";
                        document.getElementById('p-size').value = "";
                        document.getElementById('p-image').value = "";
                        document.getElementById('p-download').value = "";
                        document.getElementById('p-desc').value = "";
                        // Маҳкам кардани форма
                        productFormBlock.style.display = "none";
                        toggleFormBtn.innerText = "+ Иловаи нав";
                        toggleFormBtn.style.background = "#3ddc84";
                        toggleFormBtn.style.color = "black";
                    })
                    .catch((err) => {
                        alert("Хатогӣ ҳангоми сабт: " + err.message);
                    });
            }
        });
    });
}
// === ФУНКСИЯИ ХОНДАН ВА НАМОИШ ДОДАНИ МАҲСУЛОТҲО ДАР ҶАДВАЛ ===
const productsListTbody = document.getElementById('products-list-tbody');

if (productsListTbody) {
    // Хондани маълумот аз папкаи 'products' дар Firebase Realtime Database
    database.ref('products').on('value', (snapshot) => {
        // Аввал дохили ҷадвалро холӣ мекунем, то маҳсулотҳо дубор (повторно) нишон дода нашаванд
        productsListTbody.innerHTML = "";
        
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const product = childSnapshot.val();
                
                // Сохтани як сатри нав (tr) барои ҷадвал
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td><b>${product.id}</b></td>
                    <td><img src="${product.image_url || 'https://via.placeholder.com/40'}" width="40" height="40" style="border-radius: 6px; object-fit: cover;"></td>
                    <td>${product.title}</td>
                    <td><span style="background: #2b313d; padding: 4px 8px; border-radius: 6px; font-size: 13px;">${product.category}</span></td>
                    <td>${product.version}</td>
                    <td><button class="actions-btn" onclick="deleteProduct('${product.id}')">Нест кардан</button></td>
                `;
                
                // Илова кардани сатр ба дохили ҷадвал
                productsListTbody.appendChild(row);
            });
        } else {
            productsListTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #777;">Ягон маҳсулот ёфт нашуд.</td></tr>`;
        }
    });
}

// Функсияи нест кардани маҳсулот аз база
function deleteProduct(productId) {
    if (confirm("Оё шумо ҳақиқатан мехоҳед маҳсулоти " + productId + "-ро нест кунед?")) {
        database.ref('products/' + productId).remove()
            .then(() => {
                alert("Маҳсулот нест карда шуд!");
            })
            .catch((err) => {
                alert("Хатогӣ ҳангоми нест кардан: " + err.message);
            });
    }
}
