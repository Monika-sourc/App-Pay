// ============================================================
// APP PAY - Configuration Firebase
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocFromServer,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Configuration Firebase du projet App Pay
const firebaseConfig = {
    apiKey: "AIzaSyCQHmQcvTcpP15lSwIvDqKJIhjM4P8osEY",
    authDomain: "app-pay-181ae.firebaseapp.com",
    projectId: "app-pay-181ae",
    storageBucket: "app-pay-181ae.firebasestorage.app",
    messagingSenderId: "365802603081",
    appId: "1:365802603081:web:e87c746c90e092c7897598"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Connexion anonyme automatique (nécessaire pour Firestore)
const authPromise = new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("✅ Firebase : utilisateur connecté (anonyme)");
            resolve(user);
        } else {
            signInAnonymously(auth)
                .then((cred) => {
                    console.log("✅ Firebase : nouvelle connexion anonyme créée");
                    resolve(cred.user);
                })
                .catch((err) => {
                    console.error("❌ Firebase Auth erreur :", err);
                    resolve(null);
                });
        }
    });
});

// Export
export {
    app,
    db,
    auth,
    authPromise,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocFromServer,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
};
