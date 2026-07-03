// firebase.js - Core Firebase Module for ZEROHUB
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, push, update, remove, get, child, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Конфигуратсияи Firebase - API-key-ҳои худро инҷо мегузорӣ
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
const auth = getAuth(app);
const db = getDatabase(app);

export const authService = {
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
    onAuthStateCheck: (callback) => onAuthStateChanged(auth, callback)
};

export const dbService = {
    createProduct: async (productData) => {
        const productRef = ref(db, 'products');
        const newProductRef = push(productRef);
        const data = {
            id: newProductRef.key,
            ...productData,
            views: 0,
            downloads: 0,
            createdAt: Date.now()
        };
        await set(newProductRef, data);
        return data.id;
    },
    
    getAllProducts: async () => {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'products'));
        if (snapshot.exists()) {
            return Object.values(snapshot.val());
        }
        return [];
    },

    getProductById: async (id) => {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `products/${id}`));
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    },

    updateProduct: async (id, updatedData) => {
        const productRef = ref(db, `products/${id}`);
        await update(productRef, updatedData);
    },

    deleteProduct: async (id) => {
        const productRef = ref(db, `products/${id}`);
        await remove(productRef);
    },

    incrementCounter: async (id, field) => {
        if (field !== 'views' && field !== 'downloads') return;
        const counterRef = ref(db, `products/${id}/${field}`);
        const snapshot = await get(counterRef);
        let currentCount = snapshot.exists() ? snapshot.val() : 0;
        await set(counterRef, currentCount + 1);
    },

    listenToStats: (callback) => {
        const productsRef = ref(db, 'products');
        onValue(productsRef, (snapshot) => {
            const data = snapshot.val() || {};
            let totalProducts = Object.keys(data).length;
            let totalViews = 0;
            let totalDownloads = 0;
            
            Object.values(data).forEach(item => {
                totalViews += (item.views || 0);
                totalDownloads += (item.downloads || 0);
            });

            callback({ totalProducts, totalViews, totalDownloads, rawData: Object.values(data) });
        });
    }
};
