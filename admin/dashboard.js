const firebaseConfig = { /* (Танзимоти худро инҷо монед) */ };
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // ID-и худкор аз номи маҳсулот сохта мешавад (фосилаҳо тоза карда мешаванд)
    const rawName = document.getElementById('nameEn').value.trim();
    const appId = rawName.toLowerCase().replace(/\s+/g, '_');

    const productData = {
        nameRu: document.getElementById('nameRu').value,
        nameEn: rawName,
        type: document.getElementById('appType').value,
        category: document.getElementById('category').value,
        version: document.getElementById('version').value,
        size: document.getElementById('size').value,
        downloadLink: document.getElementById('downloadLink').value,
        iconUrl: document.getElementById('iconUrl').value,
        descRu: document.getElementById('descRu').value,
        isRecommended: document.getElementById('isRecommended').checked
    };

    db.ref('apps/' + appId).set(productData)
        .then(() => {
            alert("Бомуваффақият сабт шуд! ID: " + appId);
            document.getElementById('addProductForm').reset();
        })
        .catch(err => alert("Хатогӣ: " + err.message));
});

// Ҳисобкунӣ
db.ref('apps').on('value', snap => {
    document.getElementById('statTotalProducts').innerText = snap.exists() ? Object.keys(snap.val()).length : 0;
});
