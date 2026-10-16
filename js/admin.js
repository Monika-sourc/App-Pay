// ============================================================
// APP PAY ADMIN - Gestion des clients (Firebase + Auth + Banques + Emails)
// ============================================================

import {
    db,
    auth,
    persistenceReady,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from './firebase-config.js';

import { BANKS_BY_COUNTRY, getBankLogoUrl } from './banks.js';

import {
    sendLoginCredentials,
    sendActivationCode
} from './emails.js';

const COLLECTION_NAME = 'clients';
const ADMINS_COLLECTION = 'admins';

let currentAdmin = null;
let lastGeneratedLink = '';
let selectedColor = '#ff7a00';
let allClients = [];
let selectedClientId = null;
let selectedOption = null;
let currentDetailClient = null;

// ============================================================
// DONNÉES PAYS
// ============================================================
const COUNTRY_LIST = [
    { name: "Afghanistan", flag: "🇦🇫" }, { name: "Afrique du Sud", flag: "🇿🇦" },
    { name: "Albanie", flag: "🇦🇱" }, { name: "Algérie", flag: "🇩🇿" },
    { name: "Allemagne", flag: "🇩🇪" }, { name: "Andorre", flag: "🇦🇩" },
    { name: "Angola", flag: "🇦🇴" }, { name: "Arabie Saoudite", flag: "🇸🇦" },
    { name: "Argentine", flag: "🇦🇷" }, { name: "Arménie", flag: "🇦🇲" },
    { name: "Australie", flag: "🇦🇺" }, { name: "Autriche", flag: "🇦🇹" },
    { name: "Azerbaïdjan", flag: "🇦🇿" }, { name: "Bahamas", flag: "🇧🇸" },
    { name: "Bahreïn", flag: "🇧🇭" }, { name: "Bangladesh", flag: "🇧🇩" },
    { name: "Barbade", flag: "🇧🇧" }, { name: "Belgique", flag: "🇧🇪" },
    { name: "Belize", flag: "🇧🇿" }, { name: "Bénin", flag: "🇧🇯" },
    { name: "Bhoutan", flag: "🇧🇹" }, { name: "Biélorussie", flag: "🇧🇾" },
    { name: "Birmanie", flag: "🇲🇲" }, { name: "Bolivie", flag: "🇧🇴" },
    { name: "Bosnie-Herzégovine", flag: "🇧🇦" }, { name: "Botswana", flag: "🇧🇼" },
    { name: "Brésil", flag: "🇧🇷" }, { name: "Brunei", flag: "🇧🇳" },
    { name: "Bulgarie", flag: "🇧🇬" }, { name: "Burkina Faso", flag: "🇧🇫" },
    { name: "Burundi", flag: "🇧🇮" }, { name: "Cambodge", flag: "🇰🇭" },
    { name: "Cameroun", flag: "🇨🇲" }, { name: "Canada", flag: "🇨🇦" },
    { name: "Cap-Vert", flag: "🇨🇻" }, { name: "Chili", flag: "🇨🇱" },
    { name: "Chine", flag: "🇨🇳" }, { name: "Chypre", flag: "🇨🇾" },
    { name: "Colombie", flag: "🇨🇴" }, { name: "Comores", flag: "🇰🇲" },
    { name: "Congo", flag: "🇨🇬" }, { name: "Corée du Sud", flag: "🇰🇷" },
    { name: "Costa Rica", flag: "🇨🇷" }, { name: "Côte d'Ivoire", flag: "🇨🇮" },
    { name: "Croatie", flag: "🇭🇷" }, { name: "Cuba", flag: "🇨🇺" },
    { name: "Danemark", flag: "🇩🇰" }, { name: "Djibouti", flag: "🇩🇯" },
    { name: "Égypte", flag: "🇪🇬" }, { name: "Émirats Arabes Unis", flag: "🇦🇪" },
    { name: "Équateur", flag: "🇪🇨" }, { name: "Espagne", flag: "🇪🇸" },
    { name: "Estonie", flag: "🇪🇪" }, { name: "États-Unis", flag: "🇺🇸" },
    { name: "Éthiopie", flag: "🇪🇹" }, { name: "Finlande", flag: "🇫🇮" },
    { name: "France", flag: "🇫🇷" }, { name: "Gabon", flag: "🇬🇦" },
    { name: "Gambie", flag: "🇬🇲" }, { name: "Géorgie", flag: "🇬🇪" },
    { name: "Ghana", flag: "🇬🇭" }, { name: "Grèce", flag: "🇬🇷" },
    { name: "Guatemala", flag: "🇬🇹" }, { name: "Guinée", flag: "🇬🇳" },
    { name: "Guinée-Bissau", flag: "🇬🇼" }, { name: "Haïti", flag: "🇭🇹" },
    { name: "Honduras", flag: "🇭🇳" }, { name: "Hongrie", flag: "🇭🇺" },
    { name: "Inde", flag: "🇮🇳" }, { name: "Indonésie", flag: "🇮🇩" },
    { name: "Irak", flag: "🇮🇶" }, { name: "Iran", flag: "🇮🇷" },
    { name: "Irlande", flag: "🇮🇪" }, { name: "Islande", flag: "🇮🇸" },
    { name: "Israël", flag: "🇮🇱" }, { name: "Italie", flag: "🇮🇹" },
    { name: "Jamaïque", flag: "🇯🇲" }, { name: "Japon", flag: "🇯🇵" },
    { name: "Jordanie", flag: "🇯🇴" }, { name: "Kazakhstan", flag: "🇰🇿" },
    { name: "Kenya", flag: "🇰🇪" }, { name: "Koweït", flag: "🇰🇼" },
    { name: "Laos", flag: "🇱🇦" }, { name: "Lesotho", flag: "🇱🇸" },
    { name: "Lettonie", flag: "🇱🇻" }, { name: "Liban", flag: "🇱🇧" },
    { name: "Libéria", flag: "🇱🇷" }, { name: "Libye", flag: "🇱🇾" },
    { name: "Liechtenstein", flag: "🇱🇮" }, { name: "Lituanie", flag: "🇱🇹" },
    { name: "Luxembourg", flag: "🇱🇺" }, { name: "Madagascar", flag: "🇲🇬" },
    { name: "Malaisie", flag: "🇲🇾" }, { name: "Malawi", flag: "🇲🇼" },
    { name: "Mali", flag: "🇲🇱" }, { name: "Malte", flag: "🇲🇹" },
    { name: "Maroc", flag: "🇲🇦" }, { name: "Maurice", flag: "🇲🇺" },
    { name: "Mauritanie", flag: "🇲🇷" }, { name: "Mexique", flag: "🇲🇽" },
    { name: "Moldavie", flag: "🇲🇩" }, { name: "Monaco", flag: "🇲🇨" },
    { name: "Mongolie", flag: "🇲🇳" }, { name: "Monténégro", flag: "🇲🇪" },
    { name: "Mozambique", flag: "🇲🇿" }, { name: "Namibie", flag: "🇳🇦" },
    { name: "Népal", flag: "🇳🇵" }, { name: "Nicaragua", flag: "🇳🇮" },
    { name: "Niger", flag: "🇳🇪" }, { name: "Nigéria", flag: "🇳🇬" },
    { name: "Norvège", flag: "🇳🇴" }, { name: "Nouvelle-Zélande", flag: "🇳🇿" },
    { name: "Oman", flag: "🇴🇲" }, { name: "Ouganda", flag: "🇺🇬" },
    { name: "Ouzbékistan", flag: "🇺🇿" }, { name: "Pakistan", flag: "🇵🇰" },
    { name: "Palestine", flag: "🇵🇸" }, { name: "Panama", flag: "🇵🇦" },
    { name: "Paraguay", flag: "🇵🇾" }, { name: "Pays-Bas", flag: "🇳🇱" },
    { name: "Pérou", flag: "🇵🇪" }, { name: "Philippines", flag: "🇵🇭" },
    { name: "Pologne", flag: "🇵🇱" }, { name: "Portugal", flag: "🇵🇹" },
    { name: "Qatar", flag: "🇶🇦" }, { name: "République Démocratique du Congo", flag: "🇨🇩" },
    { name: "République Dominicaine", flag: "🇩🇴" }, { name: "République Tchèque", flag: "🇨🇿" },
    { name: "Roumanie", flag: "🇷🇴" }, { name: "Royaume-Uni", flag: "🇬🇧" },
    { name: "Russie", flag: "🇷🇺" }, { name: "Rwanda", flag: "🇷🇼" },
    { name: "Sénégal", flag: "🇸🇳" }, { name: "Serbie", flag: "🇷🇸" },
    { name: "Seychelles", flag: "🇸🇨" }, { name: "Sierra Leone", flag: "🇸🇱" },
    { name: "Singapour", flag: "🇸🇬" }, { name: "Slovaquie", flag: "🇸🇰" },
    { name: "Slovénie", flag: "🇸🇮" }, { name: "Somalie", flag: "🇸🇴" },
    { name: "Soudan", flag: "🇸🇩" }, { name: "Sri Lanka", flag: "🇱🇰" },
    { name: "Suède", flag: "🇸🇪" }, { name: "Suisse", flag: "🇨🇭" },
    { name: "Suriname", flag: "🇸🇷" }, { name: "Syrie", flag: "🇸🇾" },
    { name: "Tanzanie", flag: "🇹🇿" }, { name: "Tchad", flag: "🇹🇩" },
    { name: "Thaïlande", flag: "🇹🇭" }, { name: "Togo", flag: "🇹🇬" },
    { name: "Tunisie", flag: "🇹🇳" }, { name: "Turquie", flag: "🇹🇷" },
    { name: "Ukraine", flag: "🇺🇦" }, { name: "Uruguay", flag: "🇺🇾" },
    { name: "Venezuela", flag: "🇻🇪" }, { name: "Vietnam", flag: "🇻🇳" },
    { name: "Yémen", flag: "🇾🇪" }, { name: "Zambie", flag: "🇿🇲" },
    { name: "Zimbabwe", flag: "🇿🇼" }
];

const CURRENCY_LIST = [
    { value: "zł", label: "zł - Zloty polonais" },
    { value: "€", label: "€ - Euro" },
    { value: "$", label: "$ - Dollar américain" },
    { value: "£", label: "£ - Livre sterling" },
    { value: "CHF", label: "CHF - Franc suisse" },
    { value: "¥", label: "¥ - Yen japonais" },
    { value: "FCFA", label: "FCFA - Franc CFA" },
    { value: "NGN", label: "NGN - Naira nigérian" },
    { value: "GHS", label: "GHS - Cedi ghanéen" },
    { value: "KES", label: "KES - Shilling kényan" },
    { value: "ZAR", label: "ZAR - Rand sud-africain" },
    { value: "MAD", label: "MAD - Dirham marocain" },
    { value: "CAD", label: "CAD - Dollar canadien" },
    { value: "AUD", label: "AUD - Dollar australien" }
];

const LANGUAGE_LIST = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" },
    { value: "pl", label: "Polski" },
    { value: "nl", label: "Nederlands" },
    { value: "ru", label: "Русский" },
    { value: "ar", label: "العربية" },
    { value: "zh", label: "中文" },
    { value: "ja", label: "日本語" }
];

// ============================================================
// UTILITAIRES
// ============================================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #111; color: white;
        padding: 14px 20px; border-radius: 8px; font-size: 13px; z-index: 99999;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2); display: flex; align-items: center;
        gap: 10px; animation: fadeIn 0.3s ease; max-width: 380px;
    `;
    const iconColor = type === 'error' ? '#e02424' : (type === 'success' ? '#00c853' : '#ff7a00');
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}" style="color:${iconColor}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function generateId() {
    return 'ap' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getInitials(firstName, lastName) {
    const f = (firstName || 'X')[0] || 'X';
    const l = (lastName || 'X')[0] || 'X';
    return (f + l).toUpperCase();
}

function getClientLink(clientId) {
    return `${window.location.origin}/?id=${clientId}`;
}

function buildCountryOptions(selectedCountry) {
    return COUNTRY_LIST.map(c =>
        `<option value="${c.name}" data-flag="${c.flag}" ${selectedCountry === c.name ? 'selected' : ''}>${c.flag} ${c.name}</option>`
    ).join('');
}

function buildCurrencyOptions(selectedCurrency) {
    return CURRENCY_LIST.map(c =>
        `<option value="${c.value}" ${selectedCurrency === c.value ? 'selected' : ''}>${c.label}</option>`
    ).join('');
}

function buildLanguageOptions(selectedLang) {
    return LANGUAGE_LIST.map(l =>
        `<option value="${l.value}" ${selectedLang === l.value ? 'selected' : ''}>${l.label}</option>`
    ).join('');
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
}

// ============================================================
// GESTION DES ÉCRANS
// ============================================================
function showScreen(screenId) {
    document.querySelectorAll('.auth-screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
}

function showLoginScreen() {
    showScreen('admin-login-screen');
    const err = document.getElementById('login-admin-error');
    if (err) err.textContent = '';
}

function showRegisterScreen() {
    showScreen('admin-register-screen');
    const err = document.getElementById('register-admin-error');
    if (err) err.textContent = '';
}

function showAdminPanel() {
    showScreen('admin-panel-screen');
}

// ============================================================
// AUTHENTIFICATION - INSCRIPTION
// ============================================================
async function handleAdminRegister(event) {
    event.preventDefault();

    const name = document.getElementById('register-admin-name').value.trim();
    const email = document.getElementById('register-admin-email').value.trim().toLowerCase();
    const password = document.getElementById('register-admin-password').value;
    const confirm = document.getElementById('register-admin-confirm').value;
    const errorEl = document.getElementById('register-admin-error');

    if (!name) return errorEl.textContent = 'Veuillez saisir votre nom complet.';
    if (!email.includes('@') || !email.includes('.')) return errorEl.textContent = 'Adresse e-mail invalide.';
    if (password.length < 6) return errorEl.textContent = 'Le mot de passe doit contenir au moins 6 caractères.';
    if (password !== confirm) return errorEl.textContent = 'Les mots de passe ne correspondent pas.';

    errorEl.textContent = '';

    const submitBtn = document.querySelector('#admin-register-form .auth-btn-primary');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Création...';

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        await setDoc(doc(db, ADMINS_COLLECTION, user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
            createdAtServer: serverTimestamp()
        });

        showToast('Compte créé avec succès ! Bienvenue ' + name, 'success');
        document.getElementById('admin-register-form').reset();

    } catch (err) {
        console.error('Erreur inscription :', err);
        let msg = 'Erreur lors de la création du compte.';
        if (err.code === 'auth/email-already-in-use') msg = 'Cet email est déjà utilisé.';
        else if (err.code === 'auth/invalid-email') msg = 'Adresse e-mail invalide.';
        else if (err.code === 'auth/weak-password') msg = 'Mot de passe trop faible.';
        else if (err.code === 'auth/network-request-failed') msg = 'Erreur réseau, vérifiez votre connexion.';
        errorEl.textContent = msg;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    }
}

// ============================================================
// AUTHENTIFICATION - CONNEXION
// ============================================================
async function handleAdminLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-admin-email').value.trim().toLowerCase();
    const password = document.getElementById('login-admin-password').value;
    const errorEl = document.getElementById('login-admin-error');

    if (!email || !password) return errorEl.textContent = 'Veuillez remplir tous les champs.';

    errorEl.textContent = '';

    const submitBtn = document.querySelector('#admin-login-form .auth-btn-primary');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connexion...';

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error('Erreur connexion :', err);
        let msg = 'Erreur de connexion.';
        if (err.code === 'auth/user-not-found') msg = 'Aucun compte trouvé avec cet email.';
        else if (err.code === 'auth/wrong-password') msg = 'Mot de passe incorrect.';
        else if (err.code === 'auth/invalid-credential') msg = 'Email ou mot de passe incorrect.';
        else if (err.code === 'auth/invalid-email') msg = 'Adresse e-mail invalide.';
        else if (err.code === 'auth/network-request-failed') msg = 'Erreur réseau, vérifiez votre connexion.';
        else if (err.code === 'auth/too-many-requests') msg = 'Trop de tentatives. Veuillez réessayer plus tard.';
        errorEl.textContent = msg;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    }
}

// ============================================================
// DÉCONNEXION
// ============================================================
async function handleAdminLogout() {
    if (!confirm('Voulez-vous vraiment vous déconnecter ?')) return;

    try {
        await signOut(auth);
        showToast('Déconnexion réussie.', 'info');
    } catch (err) {
        console.error('Erreur déconnexion :', err);
        showToast('Erreur lors de la déconnexion.', 'error');
    }
}

// ============================================================
// CHARGEMENT DU PROFIL ADMIN
// ============================================================
async function loadAdminProfile(user) {
    try {
        const adminDoc = await getDoc(doc(db, ADMINS_COLLECTION, user.uid));
        if (adminDoc.exists()) {
            currentAdmin = adminDoc.data();
        } else {
            currentAdmin = {
                uid: user.uid,
                name: user.displayName || 'Admin',
                email: user.email
            };
        }

        const initials = (currentAdmin.name || 'A').split(' ')
            .map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'A';
        document.getElementById('admin-avatar').textContent = initials;
        document.getElementById('admin-user-name').textContent = currentAdmin.name || 'Admin';
        document.getElementById('admin-user-email').textContent = currentAdmin.email || '';
        document.getElementById('admin-header-subtitle').textContent = `Bienvenue, ${currentAdmin.name}`;
    } catch (err) {
        console.error('Erreur chargement profil admin :', err);
    }
}

// ============================================================
// ÉCOUTE DE L'ÉTAT D'AUTHENTIFICATION
// ============================================================
function initAuthListener() {
    const cachedUser = auth.currentUser;

    if (cachedUser && !cachedUser.isAnonymous) {
        console.log('⚡ Session en cache détectée :', cachedUser.email);
        loadAdminProfile(cachedUser).then(() => {
            showAdminPanel();
            loadClients();
        });
    } else {
        console.log('🔒 Aucune session en cache → page de connexion');
        showLoginScreen();
    }

    let isFirstCall = true;
    onAuthStateChanged(auth, async (user) => {
        if (isFirstCall) {
            isFirstCall = false;

            if (user && !user.isAnonymous && !cachedUser) {
                console.log('👤 Session restaurée (async) :', user.email);
                await loadAdminProfile(user);
                showAdminPanel();
                await loadClients();
            }
            return;
        }

        if (user && !user.isAnonymous) {
            const panelActive = document.getElementById('admin-panel-screen').classList.contains('active');
            if (panelActive) return;

            console.log('👤 Admin connecté :', user.email);
            await loadAdminProfile(user);
            showAdminPanel();
            await loadClients();
        } else {
            if (!currentAdmin) return;
            console.log('🔒 Déconnexion détectée');
            currentAdmin = null;
            allClients = [];
            showLoginScreen();
        }
    });
}

// ============================================================
// GESTION DU MENU DÉROULANT PERSONNALISÉ
// ============================================================
function initCustomSelect() {
    const selectWrapper = document.getElementById('custom-option-select');
    const trigger = document.getElementById('custom-option-trigger');
    const dropdown = document.getElementById('custom-option-dropdown');
    const hiddenInput = document.getElementById('m-select-option');
    const triggerText = document.getElementById('custom-option-text');
    const triggerIcon = document.querySelector('.custom-select-icon i');

    if (!selectWrapper || !trigger || !dropdown) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        selectWrapper.classList.toggle('open');
    });

    dropdown.querySelectorAll('.custom-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();

            const value = option.dataset.value;
            const label = option.querySelector('span').textContent.trim();
            const iconClass = option.querySelector('i').className;

            triggerText.textContent = label;
            triggerText.classList.remove('placeholder');
            if (triggerIcon) {
                triggerIcon.className = iconClass;
            }

            hiddenInput.value = value;

            dropdown.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');

            selectWrapper.classList.remove('open');

            handleOptionChange();
        });
    });

    document.addEventListener('click', (e) => {
        if (!selectWrapper.contains(e.target)) {
            selectWrapper.classList.remove('open');
        }
    });
}

function resetCustomSelect() {
    const selectWrapper = document.getElementById('custom-option-select');
    const triggerText = document.getElementById('custom-option-text');
    const triggerIcon = document.querySelector('.custom-select-icon i');
    const hiddenInput = document.getElementById('m-select-option');

    if (triggerText) {
        triggerText.textContent = '-- Choisir une option --';
        triggerText.classList.add('placeholder');
    }
    if (triggerIcon) {
        triggerIcon.className = 'fa-solid fa-list';
    }
    if (hiddenInput) hiddenInput.value = '';
    if (selectWrapper) {
        selectWrapper.classList.remove('open');
        selectWrapper.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
    }
}

// ============================================================
// BANQUES
// ============================================================
function populateBankSelect(selectId, clientCountry, selectedDomain) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = '<option value="">-- Sélectionner une banque --</option>';

    const countryBanks = BANKS_BY_COUNTRY[clientCountry] || [];
    if (countryBanks.length > 0) {
        const group = document.createElement('optgroup');
        group.label = `Banques du pays (${clientCountry})`;
        countryBanks.forEach(bank => {
            const opt = document.createElement('option');
            opt.value = bank.domain;
            opt.dataset.bankName = bank.name;
            opt.dataset.bankDomain = bank.domain;
            opt.textContent = bank.name;
            if (selectedDomain === bank.domain) opt.selected = true;
            group.appendChild(opt);
        });
        select.appendChild(group);
    }

    Object.entries(BANKS_BY_COUNTRY).forEach(([country, banks]) => {
        if (country === clientCountry) return;
        const group = document.createElement('optgroup');
        group.label = country;
        banks.forEach(bank => {
            const opt = document.createElement('option');
            opt.value = bank.domain;
            opt.dataset.bankName = bank.name;
            opt.dataset.bankDomain = bank.domain;
            opt.textContent = bank.name;
            if (selectedDomain === bank.domain) opt.selected = true;
            group.appendChild(opt);
        });
        select.appendChild(group);
    });
}

// ============================================================
// CRÉATION D'UN CLIENT
// ============================================================
async function handleCreateClient(event) {
    event.preventDefault();

    if (!currentAdmin) {
        showToast('Vous devez être connecté pour créer un client.', 'error');
        return;
    }

    const lastName = document.getElementById('c-lastname').value.trim();
    const firstName = document.getElementById('c-firstname').value.trim();
    const country = document.getElementById('c-country').value;
    const countryFlag = document.querySelector('#c-country option:checked')?.dataset.flag || '';
    const address = document.getElementById('c-address').value.trim();
    const email = document.getElementById('c-email').value.trim().toLowerCase();
    const phone = document.getElementById('c-phone').value.trim();
    const language = document.getElementById('c-language').value;
    const balance = parseFloat(document.getElementById('c-balance').value) || 0;
    const currency = document.getElementById('c-currency').value;
    const bankSelect = document.getElementById('c-bank');
    const bankDomain = bankSelect.value;
    const bankOption = bankSelect.options[bankSelect.selectedIndex];
    const bankName = bankOption?.dataset.bankName || '';
    const bankLogo = bankDomain ? getBankLogoUrl(bankDomain) : '';
    const pin = document.getElementById('c-pin').value.trim();
    const activationCode = document.getElementById('c-activation').value.trim();
    const percentValue = parseInt(document.getElementById('c-percent-value').value, 10);
    const messageAfterTransfer = document.getElementById('c-message').value.trim();
    const color = document.getElementById('c-color').value;

    if (!lastName || !firstName) return showToast('Nom et prénom obligatoires.', 'error');
    if (!country) return showToast('Pays obligatoire.', 'error');
    if (!email.includes('@') || !email.includes('.')) return showToast('Adresse e-mail invalide.', 'error');
    if (!language) return showToast('Langue obligatoire.', 'error');
    if (!bankDomain || !bankName) return showToast('Veuillez sélectionner une banque.', 'error');
    if (!/^\d{4,8}$/.test(pin)) return showToast('Le code PIN doit contenir 4 à 8 chiffres.', 'error');
    if (activationCode.length < 4) return showToast("Le code d'activation doit contenir au moins 4 caractères.", 'error');
    if (isNaN(percentValue) || percentValue < 0 || percentValue > 100) {
        return showToast('Le pourcentage doit être entre 0 et 100.', 'error');
    }
    if (!messageAfterTransfer) return showToast('Le message après virement est obligatoire.', 'error');
    if (!color) return showToast('Veuillez choisir une couleur.', 'error');

    const submitBtn = document.querySelector('.btn-create');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Création...';

    try {
        const emailCheck = query(collection(db, COLLECTION_NAME), where('email', '==', email));
        const existing = await getDocs(emailCheck);
        if (!existing.empty) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            return showToast('Un client avec cet e-mail existe déjà.', 'error');
        }

        const clientId = generateId();

        const initialTransactions = [];
        if (balance > 0) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('fr-FR') + ' • ' +
                now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            initialTransactions.push({
                type: 'credit',
                title: 'Solde initial',
                date: dateStr,
                amount: balance,
                bankName: bankName,
                bankDomain: bankDomain,
                bankLogo: bankLogo
            });
        }

        const clientData = {
            id: clientId,
            lastName, firstName, country, countryFlag,
            address, email, phone, language,
            balance, currency, pin, activationCode,
            percentValue, messageAfterTransfer, color,
            bankName, bankDomain, bankLogo,
            transactions: initialTransactions,
            blocked: false,
            createdBy: currentAdmin.uid,
            createdByName: currentAdmin.name,
            createdByEmail: currentAdmin.email,
            createdAt: new Date().toISOString(),
            createdAtServer: serverTimestamp()
        };

        await setDoc(doc(db, COLLECTION_NAME, clientId), clientData);

        const link = getClientLink(clientId);
        lastGeneratedLink = link;
        document.getElementById('generated-link').value = link;
        document.getElementById('link-modal').classList.add('show');

        event.target.reset();
        document.getElementById('c-balance').value = '0.00';
        document.getElementById('c-currency').value = 'zł';
        document.getElementById('c-country').value = 'France';
        document.getElementById('c-language').value = 'fr';
        document.getElementById('c-percent-value').value = '100';
        populateBankSelect('c-bank', 'France', '');

        await loadClients();
        showToast('Client créé avec succès !', 'success');
    } catch (err) {
        console.error('Erreur création client :', err);
        showToast('Erreur : ' + (err.message || 'inconnue'), 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    }
}

// ============================================================
// CHARGEMENT DES CLIENTS
// ============================================================
async function loadClients() {
    const list = document.getElementById('clients-list');
    const countBadge = document.getElementById('client-count');

    if (!currentAdmin) {
        list.innerHTML = '<p class="empty-state">Veuillez vous connecter.</p>';
        return;
    }

    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('createdBy', '==', currentAdmin.uid)
        );
        const snapshot = await getDocs(q);
        allClients = snapshot.docs.map(d => d.data());
        allClients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        countBadge.textContent = allClients.length;
        populateModifySelect();

        if (allClients.length === 0) {
            list.innerHTML = '<p class="empty-state">Vous n\'avez créé aucun client pour le moment.</p>';
            return;
        }

        list.innerHTML = '';
        allClients.forEach(client => {
            const row = document.createElement('div');
            row.className = 'client-row' + (client.blocked ? ' blocked' : '');
            row.dataset.clientId = client.id;

            const initials = getInitials(client.firstName, client.lastName);
            const fullName = `${(client.lastName || '').toUpperCase()} ${client.firstName || ''}`;

            row.innerHTML = `
                <div class="client-row-left">
                    <div class="client-row-avatar">${initials}</div>
                    <div class="client-row-info">
                        <div class="client-row-name">${fullName}</div>
                        <div class="client-row-email">${client.email || '--'}</div>
                    </div>
                </div>
                <div class="client-row-actions">
                    <div class="client-row-status ${client.blocked ? 'blocked' : 'active'}">
                        <i class="fa-solid ${client.blocked ? 'fa-lock' : 'fa-circle-check'}"></i>
                        ${client.blocked ? 'Bloqué' : 'Actif'}
                    </div>
                    <button class="client-row-delete" title="Supprimer ce client" data-delete-id="${client.id}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <i class="fa-solid fa-chevron-right client-row-arrow"></i>
            `;

            row.addEventListener('click', () => openClientDetail(client.id));
            row.querySelector('.client-row-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteClient(client.id);
            });

            list.appendChild(row);
        });

    } catch (err) {
        console.error('Erreur chargement clients :', err);
        list.innerHTML = '<p class="empty-state" style="color:#e02424;">Erreur de chargement.</p>';
    }
}

// ============================================================
// MODAL DÉTAILS CLIENT
// ============================================================
function openClientDetail(clientId) {
    const client = allClients.find(c => c.id === clientId);
    if (!client) return;

    currentDetailClient = client;

    const initials = getInitials(client.firstName, client.lastName);
    document.getElementById('cd-avatar').textContent = initials;

    const fullName = `${client.lastName} ${client.firstName}`.toUpperCase();
    document.getElementById('cd-name').textContent = fullName;
    document.getElementById('cd-meta').textContent = client.email || '--';

    const statusEl = document.getElementById('cd-status');
    if (client.blocked) {
        statusEl.textContent = 'Bloqué';
        statusEl.className = 'client-detail-status blocked';
    } else {
        statusEl.textContent = 'Actif';
        statusEl.className = 'client-detail-status active';
    }

    document.getElementById('cd-fullname').textContent = fullName;
    document.getElementById('cd-country').textContent = (client.country || '--') + ' ' + (client.countryFlag || '');
    document.getElementById('cd-address').textContent = client.address || '—';
    document.getElementById('cd-email').textContent = client.email || '--';
    document.getElementById('cd-phone').textContent = client.phone || '—';
    document.getElementById('cd-balance').textContent = Number(client.balance || 0).toFixed(2).replace('.', ',') + ' ' + (client.currency || 'zł');
    document.getElementById('cd-currency').textContent = client.currency || 'zł';
    document.getElementById('cd-language').textContent = client.language || 'fr';
    document.getElementById('cd-bank').textContent = client.bankName || '—';
    document.getElementById('cd-percent').textContent = (client.percentValue || 100) + '%';
    document.getElementById('cd-pin').textContent = client.pin || '----';
    document.getElementById('cd-activation').textContent = client.activationCode || '----';
    document.getElementById('cd-link').value = getClientLink(client.id);

    document.getElementById('client-detail-modal').classList.add('show');
}

function closeClientDetail() {
    document.getElementById('client-detail-modal').classList.remove('show');
    currentDetailClient = null;
}

function editClientFromDetail() {
    if (!currentDetailClient) return;
    const clientId = currentDetailClient.id;
    closeClientDetail();
    selectClientForModify(clientId);
}

// ============================================================
// 📧 NOUVEAU : ENVOYER LES IDENTIFIANTS PAR EMAIL
// ============================================================
async function handleSendLoginCredentials() {
    if (!currentDetailClient) return;

    const client = currentDetailClient;

    if (!client.email) {
        return showToast('Ce client n\'a pas d\'adresse e-mail.', 'error');
    }

    const btn = document.getElementById('btn-send-credentials');
    const originalHTML = btn ? btn.innerHTML : '';

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi...';
    }

    try {
        const result = await sendLoginCredentials(client);

        if (result.success) {
            showToast('Identifiants envoyés à ' + client.email, 'success');
        } else {
            showToast('Erreur d\'envoi : ' + (result.error || 'inconnue'), 'error');
        }
    } catch (err) {
        console.error('Erreur envoi identifiants :', err);
        showToast('Erreur d\'envoi. Réessayez.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    }
}

// ============================================================
// 📧 NOUVEAU : ENVOYER LE CODE D'ACTIVATION PAR EMAIL
// ============================================================
async function handleSendActivationCode() {
    if (!currentDetailClient) return;

    const client = currentDetailClient;

    if (!client.email) {
        return showToast('Ce client n\'a pas d\'adresse e-mail.', 'error');
    }

    const btn = document.getElementById('btn-send-activation');
    const originalHTML = btn ? btn.innerHTML : '';

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi...';
    }

    try {
        const result = await sendActivationCode(client);

        if (result.success) {
            showToast('Code d\'activation envoyé à ' + client.email, 'success');
        } else {
            showToast('Erreur d\'envoi : ' + (result.error || 'inconnue'), 'error');
        }
    } catch (err) {
        console.error('Erreur envoi code d\'activation :', err);
        showToast('Erreur d\'envoi. Réessayez.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    }
}

// ============================================================
// COPIER UN CHAMP
// ============================================================
window.copyField = function (elementId, isInput = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const value = isInput ? el.value : el.textContent;

    const doCopy = () => {
        const btn = el.closest('.cd-value-copy, .cd-link-box')?.querySelector('.copy-btn');
        if (btn) {
            const original = btn.innerHTML;
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = original;
            }, 1500);
        }
        showToast('Copié !', 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(value).then(doCopy).catch(() => prompt('Copiez :', value));
    } else {
        prompt('Copiez :', value);
    }
};

// ============================================================
// SÉLECTEUR DE MODIFICATION
// ============================================================
function populateModifySelect() {
    const select = document.getElementById('m-select-client');
    const current = select.value;
    select.innerHTML = '<option value="">-- Choisir un client --</option>';
    allClients.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${(c.lastName || '').toUpperCase()} ${c.firstName || ''} — ${c.email}`;
        select.appendChild(opt);
    });
    if (current) select.value = current;
}

function selectClientForModify(clientId) {
    const select = document.getElementById('m-select-client');
    select.value = clientId;
    handleModifyClientChange();
    document.querySelector('.modify-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleModifyClientChange() {
    const clientId = document.getElementById('m-select-client').value;
    const optionWrapper = document.getElementById('option-select-wrapper');
    const optionContainer = document.getElementById('option-card-container');

    resetCustomSelect();
    optionContainer.innerHTML = '';

    if (!clientId) {
        selectedClientId = null;
        selectedOption = null;
        optionWrapper.style.display = 'none';
        return;
    }

    selectedClientId = clientId;
    optionWrapper.style.display = 'block';
}

// ============================================================
// GESTION DE L'OPTION SÉLECTIONNÉE
// ============================================================
function handleOptionChange() {
    const optionValue = document.getElementById('m-select-option').value;
    selectedOption = optionValue;

    const container = document.getElementById('option-card-container');
    container.innerHTML = '';

    if (!optionValue || !selectedClientId) return;

    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    renderOptionCard(optionValue, client);
}

// ============================================================
// GÉNÉRATION DES CARTES D'OPTIONS
// ============================================================
function renderOptionCard(option, client) {
    const container = document.getElementById('option-card-container');

    let headerIcon = '';
    let headerTitle = '';
    let headerSubtitle = '';
    let bodyHtml = '';

    switch (option) {

        case 'info':
            headerIcon = 'fa-user';
            headerTitle = 'Informations personnelles';
            headerSubtitle = 'Nom, prénom, pays et adresse du client';
            bodyHtml = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Nom</label>
                        <input type="text" id="opt-lastname" value="${escapeHtml(client.lastName)}" placeholder="Nom de famille">
                    </div>
                    <div class="form-group">
                        <label>Prénom(s)</label>
                        <input type="text" id="opt-firstname" value="${escapeHtml(client.firstName)}" placeholder="Prénom(s)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Pays de résidence</label>
                    <select id="opt-country">
                        <option value="">-- Sélectionner un pays --</option>
                        ${buildCountryOptions(client.country)}
                    </select>
                </div>
                <div class="form-group">
                    <label>Adresse de résidence</label>
                    <input type="text" id="opt-address" value="${escapeHtml(client.address || '')}" placeholder="Adresse complète">
                </div>
            `;
            break;

        case 'contact':
            headerIcon = 'fa-envelope';
            headerTitle = 'Coordonnées';
            headerSubtitle = 'Adresse e-mail et numéro de téléphone';
            bodyHtml = `
                <div class="form-group">
                    <label>Adresse e-mail</label>
                    <input type="email" id="opt-email" value="${escapeHtml(client.email || '')}" placeholder="client@gmail.com">
                </div>
                <div class="form-group">
                    <label>Numéro de téléphone</label>
                    <input type="tel" id="opt-phone" value="${escapeHtml(client.phone || '')}" placeholder="+229 01 23 45 67 89">
                </div>
            `;
            break;

        case 'account':
            headerIcon = 'fa-wallet';
            headerTitle = 'Compte bancaire';
            headerSubtitle = 'Solde, devise et langue d\'affichage';
            bodyHtml = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Solde actuel</label>
                        <div class="input-with-addon">
                            <input type="number" id="opt-balance" step="0.01" min="0" value="${Number(client.balance || 0).toFixed(2)}">
                            <div class="input-addon">${client.currency || 'zł'}</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Devise</label>
                        <select id="opt-currency">${buildCurrencyOptions(client.currency)}</select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Langue d'affichage</label>
                    <select id="opt-language">${buildLanguageOptions(client.language)}</select>
                </div>
            `;
            break;

        case 'bank':
            headerIcon = 'fa-building-columns';
            headerTitle = 'Banque du client';
            headerSubtitle = 'Modifier la banque affichée dans l\'historique';
            bodyHtml = `
                <div class="option-info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Le logo et le nom de cette banque seront utilisés pour les nouveaux virements.</span>
                </div>
                <div class="form-group">
                    <label>Banque actuelle</label>
                    <select id="opt-bank">
                        <option value="">-- Sélectionner une banque --</option>
                    </select>
                </div>
            `;
            break;

        case 'security':
            headerIcon = 'fa-shield-halved';
            headerTitle = 'Sécurité du compte';
            headerSubtitle = 'Code PIN de connexion et code d\'activation';
            bodyHtml = `
                <div class="form-group">
                    <label>Code PIN de connexion</label>
                    <input type="text" id="opt-pin" minlength="4" maxlength="8" pattern="[0-9]+" value="${escapeHtml(client.pin || '')}" placeholder="4 à 8 chiffres">
                    <small>Le client utilisera ce code pour se connecter.</small>
                </div>
                <div class="form-group">
                    <label>Code d'activation virement</label>
                    <input type="text" id="opt-activation" minlength="4" maxlength="20" value="${escapeHtml(client.activationCode || '')}" placeholder="Ex: ACT-8899">
                    <small>Le client utilisera ce code pour valider ses virements.</small>
                </div>
            `;
            break;

        case 'transfer_params':
            headerIcon = 'fa-percent';
            headerTitle = 'Paramètres de virement';
            headerSubtitle = 'Pourcentage limite et message après virement';
            bodyHtml = `
                <div class="form-group">
                    <label>Pourcentage appliqué</label>
                    <div class="percentage-row">
                        <span class="percentage-label">Si inférieur ou égal à</span>
                        <input type="number" id="opt-percent" min="0" max="100" value="${client.percentValue || 100}">
                        <span class="percentage-label">%</span>
                    </div>
                    <small>Le virement sera refusé si le montant dépasse ce pourcentage du solde.</small>
                </div>
                <div class="form-group">
                    <label>Message affiché après le virement</label>
                    <textarea id="opt-message" rows="3">${escapeHtml(client.messageAfterTransfer || '')}</textarea>
                </div>
            `;
            break;

        case 'color':
            headerIcon = 'fa-palette';
            headerTitle = 'Couleur du thème';
            headerSubtitle = 'Couleur principale du compte client';
            const currentColor = client.color || '#ff7a00';
            bodyHtml = `
                <div class="form-group">
                    <label>Couleur principale</label>
                    <div class="color-picker" id="opt-color-picker">
                        ${['#ff7a00', '#1a73e8', '#00c853', '#e02424', '#8e24aa', '#00838f', '#f9a825', '#37474f', '#d81b60', '#43a047']
                            .map(c => `<div class="color-option ${c === currentColor ? 'selected' : ''}" data-color="${c}" style="background-color:${c};"></div>`)
                            .join('')}
                    </div>
                    <input type="hidden" id="opt-color" value="${currentColor}">
                </div>
            `;
            break;

        case 'access':
            headerIcon = 'fa-ban';
            headerTitle = 'Accès du client';
            headerSubtitle = 'Bloquer ou débloquer le compte client';
            const statusClass = client.blocked ? 'blocked' : 'active';
            const statusText = client.blocked ? 'Bloqué' : 'Actif';
            bodyHtml = `
                <div class="option-info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Bloquez l'accès d'un client pour suspendre temporairement sa connexion.</span>
                </div>
                <div class="option-status-box">
                    <span class="option-status-box-label">Statut actuel :</span>
                    <span class="option-status-box-value ${statusClass}">${statusText}</span>
                </div>
            `;
            break;

        case 'transaction':
            headerIcon = 'fa-plus';
            headerTitle = 'Ajouter un virement';
            headerSubtitle = 'Ajouter un virement au compte client';
            bodyHtml = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Montant du virement <span class="required">. requis</span></label>
                        <div class="input-with-addon">
                            <input type="number" id="opt-tx-amount" step="0.01" placeholder="0.00">
                            <div class="input-addon">${client.currency || 'zł'}</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Type d'opération <span class="required">. requis</span></label>
                        <select id="opt-tx-type">
                            <option value="credit">Crédit (+) - Ajouter au solde</option>
                            <option value="debit">Débit (-) - Retirer du solde</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Banque <span class="required">. requis</span></label>
                    <select id="opt-tx-bank">
                        <option value="">-- Sélectionner une banque --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date et heure <span class="optional">. facultatif</span></label>
                    <input type="text" id="opt-tx-date" placeholder="Ex: 23/09/2026 • 01:24">
                </div>
            `;
            break;
    }

    let actionButtons = '';
    if (option === 'access') {
        const blockBtn = client.blocked
            ? `<button type="button" class="btn-unblock" id="opt-access-btn" style="padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:2px solid #c3e6cb;color:#03543f;background:#fff;display:inline-flex;align-items:center;gap:6px;">
                   <i class="fa-solid fa-unlock"></i> Débloquer l'accès
               </button>`
            : `<button type="button" class="btn-block" id="opt-access-btn" style="padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:2px solid #f5c6cb;color:#e02424;background:#fff;display:inline-flex;align-items:center;gap:6px;">
                   <i class="fa-solid fa-ban"></i> Bloquer l'accès
               </button>`;

        actionButtons = `
            <button type="button" class="btn-option-cancel" onclick="cancelOptionCard()">
                <i class="fa-solid fa-xmark"></i> Annuler
            </button>
            ${blockBtn}
        `;
    } else {
        actionButtons = `
            <button type="button" class="btn-option-cancel" onclick="cancelOptionCard()">
                <i class="fa-solid fa-xmark"></i> Annuler
            </button>
            <button type="button" class="btn-option-save" id="opt-save-btn">
                <i class="fa-solid fa-floppy-disk"></i> Enregistrer
            </button>
        `;
    }

    container.innerHTML = `
        <div class="option-card">
            <div class="option-card-header">
                <div class="option-card-header-icon">
                    <i class="fa-solid ${headerIcon}"></i>
                </div>
                <div>
                    <div class="option-card-header-title">${headerTitle}</div>
                    <div class="option-card-header-subtitle">${headerSubtitle}</div>
                </div>
            </div>
            <div class="option-card-body">
                ${bodyHtml}
            </div>
            <div class="option-card-actions">
                ${actionButtons}
            </div>
        </div>
    `;

    if (option === 'color') {
        const picker = document.getElementById('opt-color-picker');
        picker.querySelectorAll('.color-option').forEach(opt => {
            opt.addEventListener('click', () => {
                picker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                document.getElementById('opt-color').value = opt.dataset.color;
            });
        });
    }

    if (option === 'bank') {
        populateBankSelect('opt-bank', client.country, client.bankDomain);
    }

    if (option === 'transaction') {
        populateBankSelect('opt-tx-bank', client.country);
    }

    if (option === 'access') {
        const btn = document.getElementById('opt-access-btn');
        if (btn) btn.addEventListener('click', handleToggleAccess);
    } else {
        const saveBtn = document.getElementById('opt-save-btn');
        if (saveBtn) saveBtn.addEventListener('click', () => saveOption(option, client));
    }
}

// ============================================================
// ANNULER LA CARTE D'OPTION
// ============================================================
function cancelOptionCard() {
    resetCustomSelect();
    document.getElementById('option-card-container').innerHTML = '';
    selectedOption = null;
}

// ============================================================
// SAUVEGARDE CIBLÉE PAR OPTION
// ============================================================
async function saveOption(option, client) {
    const btn = document.getElementById('opt-save-btn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enregistrement...';

    try {
        let updatedData = { updatedAt: new Date().toISOString() };

        switch (option) {
            case 'info': {
                const lastName = document.getElementById('opt-lastname').value.trim();
                const firstName = document.getElementById('opt-firstname').value.trim();
                const country = document.getElementById('opt-country').value;
                const countryFlag = document.querySelector('#opt-country option:checked')?.dataset.flag || '';
                const address = document.getElementById('opt-address').value.trim();

                if (!lastName || !firstName) throw new Error('Nom et prénom obligatoires.');
                if (!country) throw new Error('Pays obligatoire.');

                updatedData = { ...updatedData, lastName, firstName, country, countryFlag, address };
                break;
            }

            case 'contact': {
                const email = document.getElementById('opt-email').value.trim().toLowerCase();
                const phone = document.getElementById('opt-phone').value.trim();

                if (!email.includes('@') || !email.includes('.')) throw new Error('Adresse e-mail invalide.');

                const emailCheck = query(collection(db, COLLECTION_NAME), where('email', '==', email));
                const existing = await getDocs(emailCheck);
                const taken = existing.docs.some(d => d.id !== selectedClientId);
                if (taken) throw new Error('Cet e-mail est utilisé par un autre client.');

                updatedData = { ...updatedData, email, phone };
                break;
            }

            case 'account': {
                const balance = parseFloat(document.getElementById('opt-balance').value) || 0;
                const currency = document.getElementById('opt-currency').value;
                const language = document.getElementById('opt-language').value;
                updatedData = { ...updatedData, balance, currency, language };
                break;
            }

            case 'bank': {
                const bankSelect = document.getElementById('opt-bank');
                const bankDomain = bankSelect.value;
                const bankOpt = bankSelect.options[bankSelect.selectedIndex];
                const bankName = bankOpt?.dataset.bankName || '';

                if (!bankDomain || !bankName) throw new Error('Veuillez sélectionner une banque.');

                const bankLogo = getBankLogoUrl(bankDomain);
                updatedData = { ...updatedData, bankName, bankDomain, bankLogo };
                break;
            }

            case 'security': {
                const pin = document.getElementById('opt-pin').value.trim();
                const activationCode = document.getElementById('opt-activation').value.trim();

                if (!/^\d{4,8}$/.test(pin)) throw new Error('Le code PIN doit contenir 4 à 8 chiffres.');
                if (activationCode.length < 4) throw new Error("Le code d'activation doit contenir au moins 4 caractères.");

                updatedData = { ...updatedData, pin, activationCode };
                break;
            }

            case 'transfer_params': {
                const percentValue = parseInt(document.getElementById('opt-percent').value, 10);
                const messageAfterTransfer = document.getElementById('opt-message').value.trim();

                if (isNaN(percentValue) || percentValue < 0 || percentValue > 100) {
                    throw new Error('Le pourcentage doit être entre 0 et 100.');
                }
                if (!messageAfterTransfer) throw new Error('Le message est obligatoire.');

                updatedData = { ...updatedData, percentValue, messageAfterTransfer };
                break;
            }

            case 'color': {
                const color = document.getElementById('opt-color').value;
                if (!color) throw new Error('Veuillez choisir une couleur.');
                updatedData = { ...updatedData, color };
                break;
            }

            case 'transaction': {
                const amount = parseFloat(document.getElementById('opt-tx-amount').value);
                const type = document.getElementById('opt-tx-type').value;
                const dateInput = document.getElementById('opt-tx-date').value.trim();
                const bankSelect = document.getElementById('opt-tx-bank');
                const bankDomain = bankSelect.value;
                const selectedBankOpt = bankSelect.options[bankSelect.selectedIndex];
                const bankName = selectedBankOpt?.dataset.bankName || '';

                if (!amount || amount <= 0) throw new Error('Montant invalide.');
                if (!bankDomain || !bankName) throw new Error('Veuillez sélectionner une banque.');

                const finalAmount = type === 'credit' ? amount : -amount;
                const now = new Date();
                const dateStr = dateInput || (now.toLocaleDateString('fr-FR') + ' • ' +
                    now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));

                const newTx = {
                    type: type,
                    title: bankName,
                    date: dateStr,
                    amount: finalAmount,
                    bankName: bankName,
                    bankDomain: bankDomain,
                    bankLogo: getBankLogoUrl(bankDomain)
                };

                const transactions = (client.transactions || []).slice();
                transactions.unshift(newTx);
                const newBalance = (Number(client.balance) || 0) + finalAmount;

                updatedData = { ...updatedData, balance: newBalance, transactions };
                break;
            }

            default:
                throw new Error('Option non reconnue.');
        }

        await updateDoc(doc(db, COLLECTION_NAME, selectedClientId), updatedData);

        const idx = allClients.findIndex(c => c.id === selectedClientId);
        if (idx !== -1) allClients[idx] = { ...allClients[idx], ...updatedData };

        await loadClients();
        showToast('Modifications enregistrées !', 'success');
        cancelOptionCard();

    } catch (err) {
        console.error('Erreur sauvegarde :', err);
        showToast(err.message || 'Erreur lors de l\'enregistrement.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

// ============================================================
// BLOQUER / DÉBLOQUER
// ============================================================
async function handleToggleAccess() {
    if (!selectedClientId) return;
    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    const willBlock = !client.blocked;
    const confirmMsg = willBlock
        ? `Bloquer l'accès de ${client.firstName} ${client.lastName} ?`
        : `Débloquer l'accès de ${client.firstName} ${client.lastName} ?`;

    if (!confirm(confirmMsg)) return;

    const btn = document.getElementById('opt-access-btn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Traitement...';

    try {
        await updateDoc(doc(db, COLLECTION_NAME, selectedClientId), { blocked: willBlock });

        const idx = allClients.findIndex(c => c.id === selectedClientId);
        if (idx !== -1) allClients[idx].blocked = willBlock;

        await loadClients();
        showToast(willBlock ? 'Accès bloqué.' : 'Accès débloqué.', 'success');
        cancelOptionCard();

    } catch (err) {
        console.error(err);
        showToast('Erreur lors du traitement.', 'error');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

// ============================================================
// SUPPRIMER / TOUT EFFACER
// ============================================================
async function deleteClient(id) {
    const client = allClients.find(c => c.id === id);
    if (!client) return;
    if (!confirm(`Supprimer définitivement ${client.firstName} ${client.lastName} ?`)) return;

    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        if (selectedClientId === id) {
            selectedClientId = null;
            document.getElementById('m-select-client').value = '';
            document.getElementById('option-select-wrapper').style.display = 'none';
            document.getElementById('option-card-container').innerHTML = '';
            resetCustomSelect();
        }
        await loadClients();
        showToast('Client supprimé.', 'info');
    } catch (err) {
        console.error('Erreur suppression :', err);
        showToast('Erreur lors de la suppression.', 'error');
    }
}

async function clearAllClients() {
    if (allClients.length === 0) return;
    if (!confirm(`Supprimer TOUS vos ${allClients.length} clients ? Cette action est irréversible.`)) return;

    try {
        for (const client of allClients) {
            await deleteDoc(doc(db, COLLECTION_NAME, client.id));
        }
        await loadClients();
        showToast('Tous vos clients ont été supprimés.', 'info');
    } catch (err) {
        console.error('Erreur suppression totale :', err);
        showToast('Erreur lors de la suppression.', 'error');
    }
}

// ============================================================
// MODAL LIEN
// ============================================================
function closeModal() {
    document.getElementById('link-modal').classList.remove('show');
}

function copyGeneratedLink() {
    const input = document.getElementById('generated-link');
    input.select();
    const value = input.value;

    const doCopy = () => {
        const btn = document.getElementById('copy-btn');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copié !';
        btn.style.backgroundColor = '#00c853';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.backgroundColor = '';
        }, 2000);
        showToast('Lien copié !', 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(value).then(doCopy).catch(() => prompt('Copiez :', value));
    } else {
        prompt('Copiez :', value);
    }
}

function openGeneratedLink() {
    if (lastGeneratedLink) window.open(lastGeneratedLink, '_blank');
}

// ============================================================
// EXPOSITION GLOBALE
// ============================================================
window.clearAllClients = clearAllClients;
window.closeModal = closeModal;
window.copyGeneratedLink = copyGeneratedLink;
window.openGeneratedLink = openGeneratedLink;
window.closeClientDetail = closeClientDetail;
window.editClientFromDetail = editClientFromDetail;
window.copyField = window.copyField;
window.cancelOptionCard = cancelOptionCard;
window.showLoginScreen = showLoginScreen;
window.showRegisterScreen = showRegisterScreen;
window.handleAdminLogout = handleAdminLogout;
window.handleSendLoginCredentials = handleSendLoginCredentials;
window.handleSendActivationCode = handleSendActivationCode;

// ============================================================
// INITIALISATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('admin-login-form').addEventListener('submit', handleAdminLogin);
    document.getElementById('admin-register-form').addEventListener('submit', handleAdminRegister);
    document.getElementById('create-client-form').addEventListener('submit', handleCreateClient);

    populateBankSelect('c-bank', 'France', '');
    document.getElementById('c-country').addEventListener('change', (e) => {
        populateBankSelect('c-bank', e.target.value, '');
    });

    document.getElementById('link-modal').addEventListener('click', (e) => {
        if (e.target.id === 'link-modal') closeModal();
    });
    document.getElementById('client-detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'client-detail-modal') closeClientDetail();
    });

    document.getElementById('m-select-client').addEventListener('change', handleModifyClientChange);

    initCustomSelect();

    const loginEmail = document.getElementById('login-admin-email');
    const loginPassword = document.getElementById('login-admin-password');
    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';

    const registerForm = document.getElementById('admin-register-form');
    if (registerForm) registerForm.reset();

    initAuthListener();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeClientDetail();
        const selectWrapper = document.getElementById('custom-option-select');
        if (selectWrapper) selectWrapper.classList.remove('open');
    }
});
