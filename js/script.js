// ============================================================
// APP PAY - Logique client (Firebase + i18n + temps réel)
// ============================================================

import {
    db,
    authPromise,
    collection,
    doc,
    getDoc,
    getDocFromServer,
    updateDoc,
    onSnapshot
} from './firebase-config.js';

import { getBankLogoUrls } from './banks.js';
import { sendTransferSuccess, sendTransferFailed, sendPendingTransferNotification, sendAdminConnectionAlert } from './emails.js';

import { TRANSLATIONS } from './i18n/translations.js';

const appState = {
    client: null,
    clientId: null,
    balance: 0,
    currency: 'zł',
    transactions: [],
    pendingTransfer: null,
    lang: 'fr',
    unsubSnapshot: null
};

const SESSION_KEY = 'apppay_session_v2';
const DEVICE_ID_KEY = 'apppay_device_id';
const ADMIN_ALERT_SENT_KEY = 'apppay_admin_alert_sent'; // Évite le double envoi

// ============================================================
// TRADUCTION
// ============================================================
function t(key, vars = {}) {
    const dict = TRANSLATIONS[appState.lang] || TRANSLATIONS['en'];
    let text = dict[key] || TRANSLATIONS['en'][key] || key;
    Object.keys(vars).forEach(k => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
    });
    return text;
}

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        el.placeholder = t(key);
    });
}

// ============================================================
// CONVERSION SYMBOLE -> CODE DEVISE
// ============================================================
function getCurrencyCode(symbol) {
    const map = {
        'zł': 'PLN', '€': 'EUR', '$': 'USD', '£': 'GBP', 'CHF': 'CHF', '¥': 'JPY',
        'FCFA': 'XOF', 'NGN': 'NGN', 'GHS': 'GHS', 'KES': 'KES', 'ZAR': 'ZAR',
        'MAD': 'MAD', 'CAD': 'CAD', 'AUD': 'AUD', '¥ CNY': 'CNY', 'CNY': 'CNY',
        'RUB': 'RUB', 'UAH': 'UAH', 'BYN': 'BYN', 'TRY': 'TRY', 'SEK': 'SEK',
        'NOK': 'NOK', 'DKK': 'DKK', 'ISK': 'ISK', 'CZK': 'CZK', 'HUF': 'HUF',
        'RON': 'RON', 'BGN': 'BGN', 'RSD': 'RSD', 'BAM': 'BAM', 'MKD': 'MKD',
        'ALL': 'ALL', 'MDL': 'MDL', 'GEL': 'GEL', 'AMD': 'AMD', 'AZN': 'AZN',
        'MXN': 'MXN', 'BRL': 'BRL', 'ARS': 'ARS', 'CLP': 'CLP', 'COP': 'COP',
        'PEN': 'PEN', 'BOB': 'BOB', 'PYG': 'PYG', 'UYU': 'UYU', 'VES': 'VES',
        'CRC': 'CRC', 'GTQ': 'GTQ', 'HNL': 'HNL', 'NIO': 'NIO', 'PAB': 'PAB',
        'DOP': 'DOP', 'CUP': 'CUP', 'HTG': 'HTG', 'JMD': 'JMD', 'TTD': 'TTD',
        'BBD': 'BBD', 'BSD': 'BSD', 'BZD': 'BZD', 'XCD': 'XCD', 'SRD': 'SRD',
        'GYD': 'GYD', 'NZD': 'NZD', 'INR': 'INR', 'PKR': 'PKR', 'BDT': 'BDT',
        'LKR': 'LKR', 'NPR': 'NPR', 'BTN': 'BTN', 'MMK': 'MMK', 'THB': 'THB',
        'VND': 'VND', 'PHP': 'PHP', 'IDR': 'IDR', 'MYR': 'MYR', 'SGD': 'SGD',
        'HKD': 'HKD', 'TWD': 'TWD', 'MOP': 'MOP', 'KRW': 'KRW', 'KHR': 'KHR',
        'LAK': 'LAK', 'BND': 'BND', 'MVR': 'MVR', 'MNT': 'MNT', 'KZT': 'KZT',
        'UZS': 'UZS', 'SAR': 'SAR', 'AED': 'AED', 'QAR': 'QAR', 'KWD': 'KWD',
        'BHD': 'BHD', 'OMR': 'OMR', 'JOD': 'JOD', 'LBP': 'LBP', 'ILS': 'ILS',
        'IQD': 'IQD', 'SYP': 'SYP', 'YER': 'YER', 'IRR': 'IRR', 'AFN': 'AFN',
        'ETB': 'ETB', 'UGX': 'UGX', 'TZS': 'TZS', 'RWF': 'RWF', 'BIF': 'BIF',
        'CDF': 'CDF', 'AOA': 'AOA', 'MZN': 'MZN', 'ZMW': 'ZMW', 'ZWL': 'ZWL',
        'BWP': 'BWP', 'NAD': 'NAD', 'SZL': 'SZL', 'LSL': 'LSL', 'MWK': 'MWK',
        'MGA': 'MGA', 'MUR': 'MUR', 'SCR': 'SCR', 'KMF': 'KMF', 'DJF': 'DJF',
        'SOS': 'SOS', 'SDG': 'SDG', 'LYD': 'LYD', 'MRU': 'MRU', 'GMD': 'GMD',
        'GNF': 'GNF', 'SLE': 'SLE', 'LRD': 'LRD', 'CVE': 'CVE', 'STN': 'STN',
        'ERN': 'ERN', 'SSP': 'SSP', 'DZD': 'DZD', 'TND': 'TND', 'EGP': 'EGP',
        'FJD': 'FJD', 'PGK': 'PGK', 'WST': 'WST', 'TOP': 'TOP', 'VUV': 'VUV',
        'SBD': 'SBD', 'XPF': 'XPF'
    };
    return map[symbol] || symbol;
}

// ---------- COULEUR DYNAMIQUE ----------
function applyClientColor(color) {
    if (!color) color = '#ff7a00';
    document.getElementById('app-screen')?.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-color-light', lightenColor(color, 15));
    document.documentElement.style.setProperty('--primary-color-dark', darkenColor(color, 15));
    document.documentElement.style.setProperty('--primary-color-soft', hexToRgba(color, 0.1));

    if (appState.client?.bigCardColor) {
        document.documentElement.style.setProperty('--big-card-color', appState.client.bigCardColor);
        let textColor = '#111111';
        if (appState.client.bigCardTextColor) {
            textColor = appState.client.bigCardTextColor;
        } else {
            const hex = appState.client.bigCardColor.replace('#', '');
            if (hex.length === 6) {
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                textColor = (yiq >= 128) ? '#111111' : '#ffffff';
            }
        }
        document.documentElement.style.setProperty('--big-card-text-color', textColor);
    } else {
        document.documentElement.style.setProperty('--big-card-color', 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)');
        document.documentElement.style.setProperty('--big-card-text-color', '#111111');
    }
}

function hexToRgb(hex) { const h = hex.replace('#', ''); return { r: parseInt(h.substring(0,2),16), g: parseInt(h.substring(2,4),16), b: parseInt(h.substring(4,6),16) }; }
function rgbToHex(r, g, b) { return '#' + [r,g,b].map(x => { const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16); return hex.length === 1 ? '0'+hex : hex; }).join(''); }
function lightenColor(hex, percent) { const { r, g, b } = hexToRgb(hex); return rgbToHex(r + (255-r)*(percent/100), g + (255-g)*(percent/100), b + (255-b)*(percent/100)); }
function darkenColor(hex, percent) { const { r, g, b } = hexToRgb(hex); return rgbToHex(r*(1-percent/100), g*(1-percent/100), b*(1-percent/100)); }
function hexToRgba(hex, alpha) { const { r, g, b } = hexToRgb(hex); return `rgba(${r}, ${g}, ${b}, ${alpha})`; }

// ---------- UTILITAIRES ----------
function formatMoney(amount) {
    const num = Number(amount) || 0;
    return num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + appState.currency;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showConfirmModal({ title = '', message = '', confirmText = '', cancelText = '', type = 'danger' }) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-modal');
        const titleEl = document.getElementById('confirm-title');
        const msgEl = document.getElementById('confirm-message');
        const btnOk = document.getElementById('confirm-btn-ok');
        const btnCancel = document.getElementById('confirm-btn-cancel');

        titleEl.textContent = title || t('confirm_title_warning');
        msgEl.textContent = message;
        btnOk.textContent = confirmText || t('confirm_btn_ok');
        btnCancel.textContent = cancelText || t('confirm_btn_cancel');

        const newBtnOk = btnOk.cloneNode(true);
        const newBtnCancel = btnCancel.cloneNode(true);
        btnOk.parentNode.replaceChild(newBtnOk, btnOk);
        btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

        if (type === 'primary') newBtnOk.style.backgroundColor = 'var(--primary-color)';
        else newBtnOk.style.backgroundColor = '#e02424';

        const close = (result) => { modal.classList.remove('show'); resolve(result); };
        newBtnOk.addEventListener('click', () => close(true));
        newBtnCancel.addEventListener('click', () => close(false));
        modal.classList.add('show');
    });
}

function getClientIdFromURL() { const params = new URLSearchParams(window.location.search); return params.get('id'); }
function showScreen(screenId) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(screenId).classList.add('active'); }

function generateCardDetails() {
    const prefix = "4823"; 
    const randomDigits = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    const cardNumber = prefix + randomDigits;
    const cvv = Math.floor(Math.random() * 900 + 100).toString();
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = (now.getFullYear() + 3).toString().slice(-2);
    return { cardNumber, cvv, expiry: `${month}/${year}` };
}

function generateIbanDetails() {
    const rand = (len) => Math.floor(Math.random() * Math.pow(10, len)).toString().padStart(len, '0');
    return { iban: `PL${rand(2)} ${rand(4)} ${rand(4)} ${rand(4)} ${rand(4)} ${rand(4)} ${rand(4)}`, swift: `WBKPPLPP${rand(3)}` };
}

function getDateGroupLabel(dateStr, lang) {
    if (!dateStr) return '';
    const datePart = dateStr.split(' • ')[0].trim();
    const parts = datePart.split('/');
    if (parts.length !== 3) return datePart;
    const day = parseInt(parts[0], 10), month = parseInt(parts[1], 10) - 1, year = parseInt(parts[2], 10);
    const txDate = new Date(year, month, day);
    const today = new Date(); today.setHours(0,0,0,0); txDate.setHours(0,0,0,0);
    const diffDays = Math.floor((today - txDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t('today');
    if (diffDays === 1) return t('yesterday');
    return datePart;
}

// ============================================================
// SESSION
// ============================================================
function saveSession() { if (!appState.clientId) return; try { localStorage.setItem(SESSION_KEY, JSON.stringify({ clientId: appState.clientId, loggedIn: true, savedAt: Date.now() })); } catch {} }
function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (Date.now() - data.savedAt > 7 * 24 * 60 * 60 * 1000) { localStorage.removeItem(SESSION_KEY); return null; }
        return data;
    } catch { return null; }
}
function clearSession() { try { localStorage.removeItem(SESSION_KEY); } catch {} }

// ============================================================
// TRACKING DE CONNEXION (ALERTE ADMIN)
// ============================================================
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let os = "Inconnu", browser = "Inconnu";
    if (/windows/i.test(ua)) os = "Windows"; else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
    else if (/android/i.test(ua)) os = "Android"; else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS"; else if (/linux/i.test(ua)) os = "Linux";
    if (/edg/i.test(ua)) browser = "Edge"; else if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox"; else if (/safari/i.test(ua)) browser = "Safari"; else if (/opr|opera/i.test(ua)) browser = "Opera";
    return `${os} • ${browser} • ${window.screen.width}x${window.screen.height}`;
}

function getDeviceId() {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) { id = 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); localStorage.setItem(DEVICE_ID_KEY, id); }
    return id;
}

async function getLocationInfo() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error();
        const data = await res.json();
        return { country: data.country_name || "Inconnu", city: data.city || "Inconnue", ip: data.ip || "Inconnue" };
    } catch {
        try {
            const res = await fetch('https://ipinfo.io/json');
            const data = await res.json();
            return { country: data.country || "Inconnu", city: data.city || "Inconnue", ip: data.ip || "Inconnue" };
        } catch { return { country: "Inconnu", city: "Inconnue", ip: "Inconnue" }; }
    }
}

async function trackConnection() {
    if (!appState.client || !appState.clientId) return;
    
    const alertSent = sessionStorage.getItem(ADMIN_ALERT_SENT_KEY);
    if (alertSent === 'true') {
        console.log("ℹ️ Alerte admin déjà envoyée pour cette session. Ignoré.");
        return;
    }

    const deviceId = getDeviceId(), deviceInfo = getDeviceInfo(), location = await getLocationInfo(), now = new Date().toISOString();
    const logs = appState.client.connectionLogs || [];
    const idx = logs.findIndex(l => l.deviceId === deviceId);
    if (idx !== -1) { logs[idx].lastSeen = now; logs[idx].country = location.country; logs[idx].city = location.city; logs[idx].ip = location.ip; }
    else { logs.push({ deviceId, deviceInfo, country: location.country, city: location.city, ip: location.ip, firstSeen: now, lastSeen: now }); }
    appState.client.connectionLogs = logs; appState.client.lastKnownLocation = location;

    try {
        await updateDoc(doc(db, 'clients', appState.clientId), { connectionLogs: logs, lastKnownLocation: location });
        
        await sendAdminConnectionAlert(appState.client, { 
            deviceInfo, 
            country: location.country, 
            city: location.city, 
            date: new Date().toLocaleString('fr-FR'),
            location: `${location.city}, ${location.country}`,
            ip: location.ip
        }).catch(()=>{});
        
        sessionStorage.setItem(ADMIN_ALERT_SENT_KEY, 'true');
    } catch (err) { 
        console.error('Erreur tracking:', err); 
    }
}

// ============================================================
// ÉCRAN DE BLOCAGE
// ============================================================
function showBlockedScreen(client) {
    const card = document.querySelector('#invalid-screen .invalid-card');
    if (card) {
        const iconBox = card.querySelector('.invalid-icon');
        iconBox.innerHTML = '<i class="fa-solid fa-lock"></i>';
        iconBox.style.backgroundColor = '#fef3c7'; iconBox.style.color = '#d97706';
        card.querySelector('.invalid-title').textContent = 'Compte temporairement bloqué';
        const name = client ? `${client.firstName || ''} ${client.lastName || ''}`.trim() : '';
        card.querySelector('.invalid-message').textContent = name ? `Bonjour ${name}, votre accès au compte App Pay a été temporairement suspendu par l'administrateur.` : `Votre accès au compte App Pay a été temporairement suspendu par l'administrateur.`;
        const infoSpan = card.querySelector('.invalid-info span');
        if (infoSpan) infoSpan.textContent = 'Veuillez contacter l\'administrateur pour rétablir votre accès.';
    }
    showScreen('invalid-screen');
}

// ============================================================
// TEMPS RÉEL
// ============================================================
function startRealtimeListener() {
    if (!appState.clientId) return;
    if (appState.unsubSnapshot) { appState.unsubSnapshot(); appState.unsubSnapshot = null; }
    try {
        const docRef = doc(db, 'clients', appState.clientId);
        appState.unsubSnapshot = onSnapshot(docRef, (docSnap) => {
            if (!docSnap.exists()) { clearSession(); showScreen('invalid-screen'); return; }
            const newData = docSnap.data();
            if (newData.blocked === true) { clearSession(); showBlockedScreen(newData); return; }
            const oldTxCount = (appState.transactions || []).length;
            const oldColor = appState.client?.color, oldLang = appState.lang;
            appState.client = newData;
            appState.balance = Number(newData.balance) || 0;
            appState.currency = newData.currency || 'zł';
            appState.transactions = newData.transactions || [];
            appState.lang = newData.language || 'fr';
            if (oldColor !== newData.color) applyClientColor(newData.color);
            if (oldLang !== appState.lang) applyLanguage();
            const appScreen = document.getElementById('app-screen');
            if (appScreen && appScreen.classList.contains('active')) {
                const activeView = document.querySelector('#nav-links li.active');
                const viewName = activeView ? activeView.dataset.view : 'dashboard';
                navigateTo(viewName);
                if (appState.transactions.length > oldTxCount) showToast(t('new_transaction_received'), 'success');
            }
        }, (err) => console.error('Erreur listener:', err));
    } catch (err) { console.error('Erreur démarrage temps réel:', err); }
}

// ============================================================
// CHARGEMENT INITIAL
// ============================================================
async function loadClientFromFirestore() {
    const clientId = getClientIdFromURL();
    if (!clientId) { 
        console.error("Erreur: Aucun ID client dans l'URL.");
        showScreen('invalid-screen'); 
        return null; 
    }
    appState.clientId = clientId;
    try {
        await authPromise;
        const docRef = doc(db, 'clients', clientId);
        let docSnap;
        try { 
            docSnap = await getDocFromServer(docRef); 
        } catch (e) { 
            docSnap = await getDoc(docRef); 
        }
        
        if (!docSnap.exists()) { 
            console.error("Erreur: Client introuvable dans Firestore.");
            showScreen('invalid-screen'); 
            return null; 
        }
        
        const client = docSnap.data();
        appState.client = client;
        appState.balance = Number(client.balance) || 0;
        appState.currency = client.currency || 'zł';
        appState.transactions = client.transactions || [];
        appState.lang = client.language || 'fr';
        
        if (client.blocked === true) { 
            clearSession(); 
            showBlockedScreen(client); 
            return null; 
        }

        if (!client.cardNumber || !client.cardCVV || !client.cardExpiry) {
            const newCard = generateCardDetails();
            try {
                await updateDoc(docRef, { cardNumber: newCard.cardNumber, cardCVV: newCard.cvv, cardExpiry: newCard.expiry });
            } catch (e) {
                console.warn("Impossible de sauvegarder la carte dans Firestore (non bloquant):", e);
            }
            appState.client.cardNumber = newCard.cardNumber; 
            appState.client.cardCVV = newCard.cvv; 
            appState.client.cardExpiry = newCard.expiry;
        }
        
        if (!client.iban || !client.swift) {
            const newIban = generateIbanDetails();
            try {
                await updateDoc(docRef, { iban: newIban.iban, swift: newIban.swift, canViewIban: false });
            } catch (e) {
                console.warn("Impossible de sauvegarder l'IBAN dans Firestore (non bloquant):", e);
            }
            appState.client.iban = newIban.iban; 
            appState.client.swift = newIban.swift; 
            appState.client.canViewIban = false;
        }

        applyClientColor(client.color);
        const badgeText = document.getElementById('badge-text');
        if (badgeText) badgeText.textContent = `${client.firstName} ${client.lastName}`;
        const emailInput = document.getElementById('login-email');
        if (emailInput) emailInput.value = '';
        
        const session = getSession();
        const shouldAutoLogin = session && session.loggedIn && session.clientId === clientId;
        
        if (shouldAutoLogin) {
            loginSuccess();
        } else {
            // ✅ CORRECTION : On applique la langue avant d'afficher l'écran de connexion
            applyLanguage(); 
            showScreen('login-screen');
        }
        
        return client;
    } catch (err) { 
        console.error('Erreur chargement:', err); 
        showScreen('invalid-screen'); 
        return null; 
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pin = document.getElementById('login-password').value.trim();
    const errorEl = document.getElementById('login-error');
    const client = appState.client;
    if (!client) { errorEl.textContent = t('err_client_not_found'); return; }
    if (client.blocked === true) { clearSession(); showBlockedScreen(client); return; }
    if (email !== (client.email || '').toLowerCase()) { errorEl.textContent = t('err_email'); return; }
    if (pin !== client.pin) { errorEl.textContent = t('err_pin'); return; }
    errorEl.textContent = '';
    saveSession();
    
    sessionStorage.removeItem(ADMIN_ALERT_SENT_KEY);
    
    loginSuccess();
    
    trackConnection(); 
}

function loginSuccess() {
    const client = appState.client;
    showScreen('app-screen');
    const initials = ((client.firstName || 'X')[0] + (client.lastName || 'X')[0]).toUpperCase();
    document.getElementById('header-avatar').textContent = initials;
    applyLanguage();
    startRealtimeListener();
    setTimeout(() => { navigateTo('dashboard', {}, true); }, 200);
}

async function handleLogout() {
    const isConfirmed = await showConfirmModal({ title: t('logout'), message: 'Voulez-vous vraiment vous déconnecter ?', confirmText: t('logout'), type: 'primary' });
    if (!isConfirmed) return;
    if (appState.unsubSnapshot) { appState.unsubSnapshot(); appState.unsubSnapshot = null; }
    clearSession();
    sessionStorage.removeItem(ADMIN_ALERT_SENT_KEY);
    
    showScreen('login-screen');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').textContent = '';
    const emailInput = document.getElementById('login-email');
    if (emailInput) emailInput.value = '';
    appState.pendingTransfer = null;
    appState.lang = appState.client?.language || 'fr';
    
    // ✅ CORRECTION : On applique la langue après déconnexion
    applyLanguage(); 
}

// ============================================================
// LOADER
// ============================================================
function showLoader() {
    let loader = document.getElementById('global-loader');
    if (!loader) { loader = document.createElement('div'); loader.id = 'global-loader'; loader.innerHTML = '<div class="loader-spinner"></div>'; document.body.appendChild(loader); }
    loader.classList.add('active');
}
function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.classList.remove('active');
}

// ============================================================
// NAVIGATION
// ============================================================
const viewTemplates = {
    dashboard: 'tpl-dashboard', transfer: 'tpl-transfer', verification: 'tpl-verification', progress: 'tpl-progress',
    success: 'tpl-success', failed: 'tpl-failed', pending: 'tpl-success', card: 'tpl-card', iban: 'tpl-iban', account: 'tpl-account'
};

function navigateTo(viewName, data = {}, addToHistory = true) {
    showLoader();
    if (addToHistory) history.pushState({ view: viewName, data: data }, '', `#${viewName}`);
    setTimeout(() => {
        const container = document.getElementById('views-container');
        const templateId = viewTemplates[viewName];
        if (!templateId) { hideLoader(); return; }
        const template = document.getElementById(templateId);
        if (!template) { hideLoader(); return; }
        container.innerHTML = '';
        container.appendChild(template.content.cloneNode(true));
        document.querySelectorAll('#nav-links li').forEach(li => {
            const isTransferFlow = ['transfer', 'verification', 'progress', 'success', 'failed', 'pending'].includes(viewName);
            if (isTransferFlow) li.classList.toggle('active', li.dataset.view === 'transfer');
            else li.classList.toggle('active', li.dataset.view === viewName);
        });
        applyLanguage();
        if (viewName === 'dashboard') renderDashboard();
        if (viewName === 'transfer') renderTransferView();
        if (viewName === 'verification') renderVerificationView(data);
        if (viewName === 'progress') renderProgressView(data);
        if (viewName === 'success') renderSuccessView(data);
        if (viewName === 'failed') renderFailedView(data);
        if (viewName === 'pending') renderPendingView(data);
        if (viewName === 'card') renderCardView();
        if (viewName === 'iban') renderIbanView();
        if (viewName === 'account') renderAccountView();
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        hideLoader();
    }, 300);
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view) navigateTo(event.state.view, event.state.data, false);
    else navigateTo('dashboard', {}, false);
});

// ============================================================
// ICÔNE DE TRANSACTION
// ============================================================
function buildTransactionIcon(tx) {
    const isDebit = tx.amount < 0, isPending = tx.status === 'pending', isCancelled = tx.status === 'cancelled', isFailed = tx.status === 'failed';
    if (isPending) return `<div class="tx-icon orange"><i class="fa-solid fa-clock"></i></div>`;
    if (isCancelled) return `<div class="tx-icon blue"><i class="fa-solid fa-rotate-left"></i></div>`;
    if (isFailed) return `<div class="tx-icon red"><i class="fa-solid fa-ban"></i></div>`;
    if (tx.bankDomain && !isDebit) {
        const urls = getBankLogoUrls(tx.bankDomain);
        const urlsJson = JSON.stringify(urls).replace(/"/g, '&quot;');
        return `<div class="tx-icon-bank" data-urls='${urlsJson}' data-idx="0"><img src="${urls[0]}" alt="${tx.bankName || 'Bank'}" loading="lazy" onerror="handleBankLogoError(this);"></div>`;
    }
    return `<div class="tx-icon ${isDebit ? 'red' : 'green'}"><i class="fa-solid fa-user"></i></div>`;
}

window.handleBankLogoError = function (img) {
    const parent = img.parentNode;
    if (!parent) return;
    try {
        const urls = JSON.parse(parent.dataset.urls || '[]');
        let idx = parseInt(parent.dataset.idx || '0', 10); idx++;
        if (idx < urls.length) { parent.dataset.idx = idx; img.src = urls[idx]; return; }
    } catch {}
    parent.classList.add('fallback');
    parent.innerHTML = '<i class="fa-solid fa-building-columns"></i>';
};

// ============================================================
// VUE : DASHBOARD
// ============================================================
function renderDashboard() {
    document.getElementById('balance-display').textContent = formatMoney(appState.balance);
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName && appState.client) welcomeName.textContent = `${appState.client.firstName} ${appState.client.lastName}`;
    const statBalance = document.getElementById('stat-balance'), statTx = document.getElementById('stat-transactions'), statCurr = document.getElementById('stat-currency');
    if (statBalance) statBalance.textContent = formatMoney(appState.balance);
    if (statTx) statTx.textContent = (appState.transactions || []).length;
    if (statCurr) statCurr.textContent = getCurrencyCode(appState.currency);
    const historyCount = document.getElementById('history-count');
    if (historyCount) historyCount.textContent = (appState.transactions || []).length;
    const btnGoTransfer = document.getElementById('btn-go-transfer');
    if (btnGoTransfer) btnGoTransfer.addEventListener('click', () => navigateTo('transfer'));
    const btnGoCard = document.getElementById('btn-go-card');
    if (btnGoCard) btnGoCard.addEventListener('click', () => navigateTo('card'));
    const txList = document.getElementById('tx-list');
    if (!txList) return;
    txList.innerHTML = '';
    if (!appState.transactions || appState.transactions.length === 0) { txList.innerHTML = `<p class="tx-empty">${t('no_transactions')}</p>`; return; }
    const grouped = {};
    appState.transactions.forEach(tx => {
        const datePart = (tx.date || '').split(' • ')[0].trim() || '—';
        if (!grouped[datePart]) grouped[datePart] = [];
        grouped[datePart].push(tx);
    });
    Object.entries(grouped).forEach(([datePart, txs]) => {
        const separator = document.createElement('div');
        separator.className = 'history-date-separator';
        separator.textContent = getDateGroupLabel(datePart + ' • 00:00', appState.lang);
        txList.appendChild(separator);
        txs.forEach(tx => {
            const isDebit = tx.amount < 0, isPending = tx.status === 'pending', isCancelled = tx.status === 'cancelled', isFailed = tx.status === 'failed';
            const timePart = (tx.date || '').split(' • ')[1] || '';
            let txLabel = isDebit ? t('transfer_sent') : t('transfer_received');
            let statusLabel = t('completed');
            let amountColor = isDebit ? '#e02424' : '#00a04a';
            let statusColor = isDebit ? '#c0392b' : '#00a04a';
            let bgColor = isDebit ? 'rgba(224, 36, 36, 0.06)' : 'rgba(0, 200, 83, 0.06)';
            if (isPending) { txLabel = t('transfer_pending'); statusLabel = t('pending_status'); amountColor = '#d97706'; statusColor = '#d97706'; bgColor = 'rgba(245, 158, 11, 0.06)'; }
            else if (isCancelled) { txLabel = t('transfer_cancelled'); statusLabel = t('cancelled_status'); amountColor = '#3b82f6'; statusColor = '#3b82f6'; bgColor = 'rgba(59, 130, 246, 0.06)'; }
            else if (isFailed) { txLabel = t('transfer_failed'); statusLabel = t('failed_status'); amountColor = '#e02424'; statusColor = '#e02424'; bgColor = 'rgba(239, 68, 68, 0.06)'; }
            const displaySubtitle = tx.bankName || tx.title || '';
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.style.background = `linear-gradient(90deg, ${bgColor} 0%, transparent 100%)`;
            item.innerHTML = `
                <div class="transaction-left">${buildTransactionIcon(tx)}
                    <div class="tx-details"><h4>${txLabel}</h4><p>${displaySubtitle}</p><span class="tx-time">${timePart}</span></div>
                </div>
                <div class="tx-right">
                    <div class="tx-amount" style="color: ${amountColor};">${isDebit ? '−' : '+'}${formatMoney(Math.abs(tx.amount))}</div>
                    <div class="tx-status" style="color: ${statusColor};">${statusLabel}</div>
                </div>`;
            item.addEventListener('click', () => openReceipt(tx));
            txList.appendChild(item);
        });
    });
}

// ============================================================
// VUE : VIREMENT
// ============================================================
function renderTransferView() {
    const balEl = document.getElementById('transfer-balance');
    if (balEl) balEl.textContent = formatMoney(appState.balance);
    const currEl = document.getElementById('tf-currency');
    if (currEl) currEl.textContent = appState.currency;
}

function handleTransferSubmit(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('tf-amount').value);
    const beneficiary = document.getElementById('tf-beneficiary').value.trim();
    const iban = document.getElementById('tf-iban').value.trim();
    const bic = document.getElementById('tf-bic').value.trim();
    const bank = document.getElementById('tf-bank').value.trim();
    const reason = document.getElementById('tf-reason').value.trim();
    if (!amount || amount <= 0) return showToast(t('err_amount'), 'error');
    if (amount > appState.balance) return showToast(t('err_balance'), 'error');
    if (!beneficiary || !iban || !bic || !bank || !reason) return showToast(t('err_fields'), 'error');
    appState.pendingTransfer = { amount, beneficiary, iban, bic, bank, reason };
    navigateTo('verification', appState.pendingTransfer);
}

// ============================================================
// VUE : VÉRIFICATION
// ============================================================
function renderVerificationView(data) {
    const tr = appState.pendingTransfer || data;
    if (!tr) return navigateTo('dashboard');
    document.getElementById('vf-amount').textContent = formatMoney(tr.amount);
    document.getElementById('vf-beneficiary').textContent = tr.beneficiary;
    document.getElementById('vf-iban').textContent = tr.iban;
    document.getElementById('vf-bic').textContent = tr.bic;
    document.getElementById('vf-bank').textContent = tr.bank;
    document.getElementById('vf-reason').textContent = tr.reason;
}

function handleVerifySubmit(event) {
    event.preventDefault();
    const code = document.getElementById('vf-code').value.trim();
    if (!appState.client) return showToast(t('err_client_not_found'), 'error');
    if (code !== appState.client.activationCode) return showToast(t('err_activation'), 'error');
    navigateTo('progress', appState.pendingTransfer);
}

async function cancelTransfer() {
    const isConfirmed = await showConfirmModal({ title: t('cancel_transfer'), message: 'Voulez-vous vraiment annuler ce virement ?', confirmText: t('cancel_transfer'), type: 'danger' });
    if (!isConfirmed) return;
    appState.pendingTransfer = null;
    navigateTo('dashboard');
    showToast(t('transfer_cancelled_toast'), 'info');
}

// ============================================================
// VUE : PROGRESSION
// ============================================================
function renderProgressView(data) {
    const tr = appState.pendingTransfer || data;
    if (!tr) return navigateTo('dashboard');
    document.getElementById('pf-amount').textContent = formatMoney(tr.amount);
    document.getElementById('pf-beneficiary').textContent = tr.beneficiary;
    document.getElementById('pf-iban').textContent = tr.iban;
    document.getElementById('pf-bank').textContent = tr.bank;
    const isPendingEnabled = appState.client?.pendingTransferEnabled === true;
    const percentLimit = Number(appState.client?.percentValue ?? 100);
    const targetProgress = isPendingEnabled ? 100 : Math.min(100, Math.max(0, percentLimit));
    let progress = 0;
    const fill = document.getElementById('progress-fill');
    fill.style.width = '0%'; fill.textContent = '0%';
    const interval = setInterval(() => {
        progress += 1;
        if (progress >= targetProgress) {
            progress = targetProgress;
            fill.style.width = progress + '%'; fill.textContent = progress + '%';
            clearInterval(interval);
            setTimeout(() => {
                if (targetProgress >= 100) {
                    if (isPendingEnabled) finalizePendingTransfer();
                    else finalizeTransfer();
                } else finalizeFailedTransfer();
            }, 1500);
        } else {
            fill.style.width = progress + '%'; fill.textContent = progress + '%';
        }
    }, 60);
}

// ============================================================
// FINALISATION SUCCÈS
// ============================================================
async function finalizeTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;
    appState.balance -= tr.amount;
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    appState.transactions.unshift({ type: 'debit', title: tr.beneficiary, date: dateStr, amount: -tr.amount, bankName: tr.bank, iban: tr.iban, bic: tr.bic, reason: tr.reason, status: 'completed' });
    const ref = 'AP' + Date.now().toString().slice(-8);
    try {
        await authPromise;
        await updateDoc(doc(db, 'clients', appState.clientId), { balance: appState.balance, transactions: appState.transactions });
        sendTransferSuccess(appState.client, { amount: tr.amount, beneficiary: tr.beneficiary, date: dateStr, reference: ref, iban: tr.iban }).catch(()=>{});
    } catch (err) { console.error('Erreur sauvegarde virement:', err); }
    navigateTo('success', { amount: tr.amount, beneficiary: tr.beneficiary, date: dateStr, reference: ref, bank: tr.bank, iban: tr.iban, bic: tr.bic, reason: tr.reason });
    showToast(t('transfer_finalized'), 'success');
    appState.pendingTransfer = null;
}

// ============================================================
// FINALISATION EN ATTENTE
// ============================================================
async function finalizePendingTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;
    appState.balance -= tr.amount;
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    appState.transactions.unshift({ type: 'debit', title: tr.beneficiary, date: dateStr, amount: -tr.amount, bankName: tr.bank, iban: tr.iban, bic: tr.bic, reason: tr.reason, status: 'pending' });
    const ref = 'AP' + Date.now().toString().slice(-8);
    try {
        await authPromise;
        await updateDoc(doc(db, 'clients', appState.clientId), { balance: appState.balance, transactions: appState.transactions });
        sendPendingTransferNotification(appState.client, { amount: tr.amount, beneficiary: tr.beneficiary, date: dateStr, reference: ref, iban: tr.iban }).catch(()=>{});
    } catch (err) { console.error('Erreur sauvegarde virement en attente:', err); }
    navigateTo('pending', { amount: tr.amount, beneficiary: tr.beneficiary, date: dateStr, reference: ref, bank: tr.bank, iban: tr.iban, bic: tr.bic, reason: tr.reason });
    showToast(t('transfer_pending'), 'info');
    appState.pendingTransfer = null;
}

// ============================================================
// FINALISATION ÉCHEC
// ============================================================
function finalizeFailedTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const ref = 'AP' + Date.now().toString().slice(-8);
    const percentLimit = Number(appState.client?.percentValue ?? 100);
    const maxAllowed = appState.balance * (percentLimit / 100);
    sendTransferFailed(appState.client, { amount: tr.amount, limit: maxAllowed }).catch(()=>{});
    navigateTo('failed', { amount: tr.amount, beneficiary: tr.beneficiary, bank: tr.bank, iban: tr.iban, bic: tr.bic, reason: tr.reason, date: dateStr, reference: ref });
    showToast(t('transfer_failed'), 'error');
    appState.pendingTransfer = null;
}

// ============================================================
// VUE : SUCCÈS
// ============================================================
function renderSuccessView(data) {
    document.getElementById('sf-amount').textContent = formatMoney(data.amount);
    document.getElementById('sf-beneficiary').textContent = data.beneficiary || '—';
    document.getElementById('sf-bank').textContent = data.bank || '—';
    document.getElementById('sf-iban').textContent = data.iban || '—';
    document.getElementById('sf-bic').textContent = data.bic || '—';
    document.getElementById('sf-reason').textContent = data.reason || '—';
    document.getElementById('sf-date').textContent = data.date;
    document.getElementById('sf-ref').textContent = data.reference;
    const customMsg = appState.client?.messageAfterTransfer;
    const msgEl = document.getElementById('sf-custom-message');
    if (msgEl && customMsg) msgEl.textContent = customMsg;
}

// ============================================================
// VUE : EN ATTENTE
// ============================================================
function renderPendingView(data) {
    const headerIcon = document.querySelector('.success-icon-circle');
    if (headerIcon) { headerIcon.style.backgroundColor = '#f59e0b'; headerIcon.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)'; headerIcon.innerHTML = '<i class="fa-solid fa-clock"></i>'; }
    const mainTitle = document.querySelector('.success-main-title');
    if (mainTitle) { mainTitle.textContent = t('transfer_pending'); mainTitle.style.color = '#b45309'; }
    const subtitle = document.querySelector('.success-subtitle');
    if (subtitle) subtitle.textContent = t('pending_subtitle');
    const amountCard = document.querySelector('.success-amount-card');
    if (amountCard) amountCard.style.backgroundColor = '#fffbeb';
    const amountIcon = document.querySelector('.success-amount-icon');
    if (amountIcon) { amountIcon.style.backgroundColor = '#fef3c7'; amountIcon.style.color = '#d97706'; amountIcon.innerHTML = '<i class="fa-solid fa-hourglass-half"></i>'; }
    const amountLabel = document.querySelector('.success-amount-label');
    if (amountLabel) amountLabel.style.color = '#92400e';
    const amountValue = document.querySelector('.success-amount-value');
    if (amountValue) amountValue.style.color = '#78350f';
    const statusCard = document.querySelector('.success-status-card');
    if (statusCard) { statusCard.style.backgroundColor = '#fffbeb'; statusCard.style.border = '1px solid #fde68a'; }
    const ssTextStrong = document.querySelector('.ss-text strong');
    if (ssTextStrong) { ssTextStrong.textContent = t('pending_status'); ssTextStrong.style.color = '#92400e'; }
    const ssTextSmall = document.querySelector('.ss-text small');
    if (ssTextSmall) { ssTextSmall.textContent = t('pending_status'); ssTextSmall.style.color = '#b45309'; }
    document.getElementById('sf-amount').textContent = formatMoney(data.amount);
    document.getElementById('sf-beneficiary').textContent = data.beneficiary || '—';
    document.getElementById('sf-bank').textContent = data.bank || '—';
    document.getElementById('sf-iban').textContent = data.iban || '—';
    document.getElementById('sf-bic').textContent = data.bic || '—';
    document.getElementById('sf-reason').textContent = data.reason || '—';
    document.getElementById('sf-date').textContent = data.date;
    document.getElementById('sf-ref').textContent = data.reference;
}

// ============================================================
// VUE : ÉCHEC
// ============================================================
function renderFailedView(data) {
    const d = data || {};
    document.getElementById('ff-amount').textContent = formatMoney(d.amount || 0);
    document.getElementById('ff-beneficiary').textContent = d.beneficiary || '—';
    document.getElementById('ff-bank').textContent = d.bank || '—';
    document.getElementById('ff-iban').textContent = d.iban || '—';
    document.getElementById('ff-bic').textContent = d.bic || '—';
    document.getElementById('ff-reason').textContent = d.reason || '—';
    document.getElementById('ff-date').textContent = d.date || '—';
}

// ============================================================
// VUE : CARTE VIRTUELLE
// ============================================================
let cardNumberVisible = false;

function renderCardView() {
    if (!appState.client) return;
    const holder = document.getElementById('vc-holder');
    if (holder) holder.textContent = `${appState.client.firstName || ''} ${appState.client.lastName || ''}`.toUpperCase();
    const numberDisplay = document.getElementById('vc-number-display');
    if (numberDisplay) {
        const realNumber = appState.client.cardNumber || '4823000000000000';
        const visiblePart = realNumber.substring(0, 12).replace(/(\d{4})/g, '$1 ').trim();
        numberDisplay.textContent = visiblePart + ' ••••';
    }
    const expiryEl = document.getElementById('vc-expiry');
    if (expiryEl) expiryEl.textContent = appState.client.cardExpiry || '12/28';
    const cvvEl = document.getElementById('vc-cvv');
    if (cvvEl) cvvEl.textContent = '•••';
    const percentLimit = Number(appState.client.percentValue ?? 100);
    const limit = appState.balance * (percentLimit / 100);
    const limitEl = document.getElementById('card-limit');
    if (limitEl) limitEl.textContent = formatMoney(limit);
    cardNumberVisible = false;
    const flipCard = document.getElementById('flip-card');
    if (flipCard) flipCard.classList.remove('flipped');
    const label = document.getElementById('vc-toggle-label');
    if (label) label.textContent = t('show_details');
}

function toggleCardNumber() {
    if (!appState.client) return;
    if (appState.client.canViewCardDetails !== true) { showToast(t('err_card_locked'), 'error'); return; }
    cardNumberVisible = !cardNumberVisible;
    const display = document.getElementById('vc-number-display');
    const cvvEl = document.getElementById('vc-cvv');
    const label = document.getElementById('vc-toggle-label');
    const realNumber = appState.client?.cardNumber || '4823000000000000';
    const realCvv = appState.client?.cardCVV || '123';
    const visiblePart = realNumber.substring(0, 12).replace(/(\d{4})/g, '$1 ').trim();
    if (cardNumberVisible) {
        display.textContent = realNumber.replace(/(\d{4})/g, '$1 ').trim();
        if (cvvEl) cvvEl.textContent = realCvv;
        if (label) label.textContent = t('hide_details');
    } else {
        display.textContent = visiblePart + ' ••••';
        if (cvvEl) cvvEl.textContent = '•••';
        if (label) label.textContent = t('show_details');
    }
}

window.copyCardInfo = function(type) {
    if (!appState.client) return;
    if (appState.client.canViewCardDetails !== true) { showToast(t('err_card_locked'), 'error'); return; }
    let textToCopy = type === 'number' ? appState.client.cardNumber || '' : appState.client.cardCVV || '';
    if (!textToCopy) return;
    const doCopy = () => showToast(t('copied'), 'success');
    if (navigator.clipboard) navigator.clipboard.writeText(textToCopy).then(doCopy).catch(() => prompt('Copiez :', textToCopy));
    else prompt('Copiez :', textToCopy);
};

// ============================================================
// VUE : IBAN
// ============================================================
let ibanVisible = false;

function renderIbanView() {
    if (!appState.client) return;
    const ibanDisplay = document.getElementById('client-iban-display');
    const swiftDisplay = document.getElementById('client-swift-display');
    const rawIban = appState.client.iban || 'PL00 0000 0000 0000 0000 0000 0000';
    const swift = appState.client.swift || '--------';
    const maskedIban = rawIban.substring(0, rawIban.length - 4) + '••••';
    if (ibanDisplay) ibanDisplay.textContent = maskedIban;
    if (swiftDisplay) swiftDisplay.textContent = swift;
    ibanVisible = false;
    const label = document.getElementById('iban-toggle-label');
    if (label) label.textContent = t('show_iban');
}

window.toggleIbanVisibility = function() {
    if (!appState.client) return;
    if (appState.client.canViewIban !== true) { showToast(t('err_iban_locked'), 'error'); return; }
    ibanVisible = !ibanVisible;
    const ibanDisplay = document.getElementById('client-iban-display');
    const label = document.getElementById('iban-toggle-label');
    const rawIban = appState.client.iban || 'PL00 0000 0000 0000 0000 0000 0000';
    if (ibanVisible) {
        if (ibanDisplay) ibanDisplay.textContent = rawIban;
        if (label) label.textContent = t('hide_iban');
    } else {
        if (ibanDisplay) ibanDisplay.textContent = rawIban.substring(0, rawIban.length - 4) + '••••';
        if (label) label.textContent = t('show_iban');
    }
};

window.copyIbanInfo = function(type) {
    if (!appState.client) return;
    if (appState.client.canViewIban !== true) { showToast(t('err_iban_locked'), 'error'); return; }
    const textToCopy = type === 'iban' ? appState.client.iban || '' : appState.client.swift || '';
    if (!textToCopy) return;
    const doCopy = () => showToast(type === 'iban' ? t('iban_copied') : t('swift_copied'), 'success');
    if (navigator.clipboard) navigator.clipboard.writeText(textToCopy).then(doCopy).catch(() => prompt('Copiez :', textToCopy));
    else prompt('Copiez :', textToCopy);
};

// ============================================================
// VUE : PROFIL
// ============================================================
function renderAccountView() {
    if (!appState.client) return;
    const c = appState.client;
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const fullName = `${c.firstName} ${c.lastName}`;
    const initials = ((c.firstName || 'X')[0] + (c.lastName || 'X')[0]).toUpperCase();
    setEl('account-initials', initials);
    setEl('account-fullname', fullName);
    setEl('account-name', fullName);
    setEl('account-email', c.email || '--');
    setEl('account-phone', c.phone || '—');
    setEl('account-country', (c.country || '--') + ' ' + (c.countryFlag || ''));
    setEl('account-id', c.id ? c.id.toUpperCase() : '--');
    setEl('account-created', c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : '--');
}

function toggleNotifications(event) {
    event.stopPropagation();
    document.getElementById('notif-dropdown').classList.toggle('show');
}

// ============================================================
// REÇU
// ============================================================
window.openReceipt = function(tx) {
    if (!tx) return;
    const isDebit = tx.amount < 0, isPending = tx.status === 'pending', isCancelled = tx.status === 'cancelled', isFailed = tx.status === 'failed';
    const dateStr = tx.date || '--';
    let typeStr = isDebit ? t('transfer_sent') : t('transfer_received');
    if (isPending) typeStr = t('transfer_pending');
    if (isCancelled) typeStr = t('transfer_cancelled');
    if (isFailed) typeStr = t('transfer_failed');
    const refStr = 'REF-' + (tx.date ? tx.date.replace(/\D/g,'').slice(-8) : Date.now().toString().slice(-8));
    const partyLabelKey = isDebit ? 'beneficiary' : 'receipt_sender';
    const partyName = tx.title || '--';
    let bankName = tx.bankName || 'APP PAY';
    let iban = tx.iban || '';
    if (!isDebit && !tx.bankName) bankName = 'APP PAY';
    document.getElementById('rcpt-date').textContent = dateStr;
    document.getElementById('rcpt-type').textContent = typeStr;
    document.getElementById('rcpt-ref').textContent = refStr;
    const partyLabelEl = document.getElementById('rcpt-party-label');
    partyLabelEl.setAttribute('data-i18n', partyLabelKey);
    document.getElementById('rcpt-party').textContent = partyName;
    document.getElementById('rcpt-bank').textContent = bankName;
    const ibanRow = document.getElementById('rcpt-iban-row');
    const ibanEl = document.getElementById('rcpt-iban');
    if (isDebit && iban) { ibanRow.style.display = 'flex'; ibanEl.textContent = iban; }
    else ibanRow.style.display = 'none';
    const amountEl = document.getElementById('rcpt-amount');
    amountEl.textContent = (isDebit ? '-' : '+') + formatMoney(Math.abs(tx.amount));
    let amountColor = '#e02424', statusColor = '#00a04a', statusKey = 'completed';
    if (isPending) { amountColor = '#d97706'; statusColor = '#d97706'; statusKey = 'pending_status'; }
    else if (isCancelled) { amountColor = '#3b82f6'; statusColor = '#3b82f6'; statusKey = 'cancelled_status'; }
    else if (isFailed) { amountColor = '#e02424'; statusColor = '#e02424'; statusKey = 'failed_status'; }
    else if (!isDebit) amountColor = '#00a04a';
    amountEl.style.color = amountColor;
    const statusEl = document.getElementById('rcpt-status');
    statusEl.setAttribute('data-i18n', statusKey);
    statusEl.style.color = statusColor;
    applyLanguage();
    document.getElementById('receipt-modal').classList.add('show');
};

window.closeReceipt = function() { document.getElementById('receipt-modal').classList.remove('show'); };
document.getElementById('receipt-modal')?.addEventListener('click', (e) => { if (e.target.id === 'receipt-modal') closeReceipt(); });

window.navigateTo = navigateTo;
window.handleLogout = handleLogout;
window.cancelTransfer = cancelTransfer;
window.toggleCardNumber = toggleCardNumber;
window.showToast = showToast;

// ============================================================
// INITIALISATION
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    const clientId = getClientIdFromURL();
    if (!clientId) { showScreen('invalid-screen'); return; }
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('notif-btn').addEventListener('click', toggleNotifications);
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('notif-dropdown');
        const btn = document.getElementById('notif-btn');
        if (dropdown && !dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) dropdown.classList.remove('show');
    });
    document.querySelectorAll('#nav-links li').forEach(li => { li.addEventListener('click', () => navigateTo(li.dataset.view)); });
    document.getElementById('views-container').addEventListener('submit', (e) => {
        if (e.target.id === 'transfer-form') handleTransferSubmit(e);
        else if (e.target.id === 'verify-form') handleVerifySubmit(e);
    });
    await loadClientFromFirestore();
});

window.addEventListener('beforeunload', () => {
    if (appState.unsubSnapshot) appState.unsubSnapshot();
});
