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
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence
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

// ============================================================
// ✅ PERSISTANCE LOCALE EXPLICITE
// La session admin survit à la fermeture du navigateur
// ============================================================
const persistenceReady = setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("✅ Firebase : persistance locale activée");
        return true;
    })
    .catch((err) => {
        console.error("❌ Erreur persistance :", err);
        return false;
    });

// ============================================================
// CONNEXION ANONYME AUTOMATIQUE (pour la page client)
// ============================================================
const authPromise = new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("✅ Firebase : utilisateur connecté");
            resolve(user);
        } else {
            const isAdminPage = window.location.pathname.includes('admin');
            if (isAdminPage) {
                resolve(null);
            } else {
                signInAnonymously(auth)
                    .then((cred) => {
                        console.log("✅ Firebase : connexion anonyme créée");
                        resolve(cred.user);
                    })
                    .catch((err) => {
                        console.error("❌ Firebase Auth erreur :", err);
                        resolve(null);
                    });
            }
        }
    });
});

// Export
export {
    app,
    db,
    auth,
    authPromise,
    persistenceReady,
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
    serverTimestamp,
    onSnapshot,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
};
