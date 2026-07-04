import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_qDc-FbKjLGUF0YTJBQMiLE8sbw8mpGI",
  authDomain: "zerohub2010.firebaseapp.com",
  databaseURL: "https://zerohub2010-default-rtdb.firebaseio.com",
  projectId: "zerohub2010",
  storageBucket: "zerohub2010.firebasestorage.app",
  messagingSenderId: "10761752021",
  appId: "1:10761752021:web:891c5494e298f2c21e815c",
  measurementId: "G-7MM70103ZZ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const productsRef = ref(database, 'products');
    
    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        
        // 🚨 Ин блок маълумоти аввалин барномаро рост дар саҳифа чоп мекунад!
        const featuredGrid = document.getElementById('featuredAppsGrid');
        if (featuredGrid && data) {
            const firstKey = Object.keys(data)[0];
            const firstItem = data[firstKey];
            
            featuredGrid.innerHTML = `
                <div style="color: #fff; background: #222; padding: 20px; border-radius: 8px; grid-column: 1/-1; word-break: break-all;">
                    <h3>Бародар, сохтори базаи ту маҳз ҳамин хел аст:</h3>
                    <pre>${JSON.stringify(firstItem, null, 2)}</pre>
                </div>
            `;
        }
    });
});
