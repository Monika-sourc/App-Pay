// ============================================================
// APP PAY - Configuration Firebase
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
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
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Configuration Firebase
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

const persistenceReady = Promise.resolve(true);

// ============================================================
// CONNEXION ANONYME AUTOMATIQUE (page client uniquement)
// ============================================================
const authPromise = new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            resolve(user);
        } else {
            const isAdminPage = window.location.pathname.includes('admin');
            if (isAdminPage) {
                resolve(null);
            } else {
                signInAnonymously(auth)
                    .then((cred) => resolve(cred.user))
                    .catch((err) => {
                        console.error("❌ Auth anonyme erreur :", err);
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
    onAuthStateChanged
};
