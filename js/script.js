// ============================================================
// APP PAY - Logique client (Firebase + i18n + persistance)
// ============================================================

import {
    db,
    authPromise,
    collection,
    doc,
    getDocFromServer,
    updateDoc
} from './firebase-config.js';

// ---------- ÉTAT GLOBAL ----------
const appState = {
    client: null,
    clientId: null,
    balance: 0,
    currency: 'zł',
    transactions: [],
    pendingTransfer: null,
    lang: 'fr'
};

// Clé de stockage de session (localStorage = plus fiable)
const SESSION_KEY = 'apppay_session_v2';

// ============================================================
// TRADUCTIONS (i18n)
// ============================================================
const TRANSLATIONS = {
    fr: {
        available_balance: "Solde disponible",
        account_subtitle: "Compte pour tous vos besoins",
        see_iban: "Voir mon IBAN",
        make_transfer: "Effectuer un virement",
        see_card: "Voir ma carte virtuelle",
        transactions_history: "Historique des transactions",
        total_balance: "Solde total",
        transactions_label: "Transactions",
        currency_label: "Devise",
        amount: "Montant du virement",
        beneficiary_name: "Nom du bénéficiaire",
        iban: "IBAN / Numéro de Compte",
        bic: "Code Banque (BIC / SWIFT)",
        bank_name: "Nom de la Banque",
        reason: "Raison du virement",
        continue: "Continuer",
        identity_verification: "Vérification d'identité",
        pending_transfer_details: "Détails du virement en attente",
        cancel_transfer: "Annuler le virement",
        enter_activation_code: "Veuillez saisir le code d'activation du virement",
        activation_code: "Code d'activation",
        transfer_in_progress: "Votre ordre de virement en cours...",
        identity_verified: "Vérification d'identité effectuée avec succès.",
        progress_desc: "Veuillez patienter la fin du virement des fonds vers votre banque avant d'actualiser cette page.",
        transfer_success: "Virement effectué avec succès",
        success_subtitle: "Votre virement a été traité et sera crédité sur le compte du bénéficiaire sous 24 à 48 heures.",
        amount_sent: "Montant envoyé",
        beneficiary: "Bénéficiaire",
        date: "Date",
        reference: "Référence",
        back_to_dashboard: "Retour au tableau de bord",
        my_virtual_card: "Ma carte virtuelle",
        holder: "Titulaire",
        expires: "Expire",
        show_details: "Afficher les détails",
        hide_details: "Masquer les détails",
        freeze_card: "Geler la carte",
        settings: "Paramètres",
        monthly_limit: "Plafond mensuel",
        monthly_spent: "Dépenses du mois",
        status: "Statut",
        active: "Active",
        type: "Type",
        my_account: "Mon compte",
        verified: "Vérifié",
        account_holder_premium: "Titulaire du compte • Client Premium",
        full_name: "Nom complet",
        email_address: "Adresse e-mail",
        phone_number: "Numéro de téléphone",
        country: "Pays de résidence",
        account_id: "Identifiant unique",
        opening_date: "Date d'ouverture",
        edit_profile: "Modifier le profil",
        security: "Sécurité",
        notifications: "Notifications",
        no_transactions: "Aucune transaction pour le moment",
        err_email: "Adresse e-mail incorrecte.",
        err_pin: "Code PIN incorrect.",
        err_amount: "Montant invalide.",
        err_balance: "Solde insuffisant.",
        err_fields: "Veuillez remplir tous les champs.",
        err_activation: "Code d'activation incorrect.",
        err_percent: "Le montant dépasse la limite autorisée ({limit}).",
        err_client_not_found: "Client introuvable. Lien invalide.",
        err_no_link: "Aucun lien fourni. Accès refusé.",
        welcome: "Bienvenue",
        login_success: "Connexion réussie. Bienvenue !",
        transfer_cancelled: "Virement annulé.",
        transfer_finalized: "Virement finalisé avec succès !"
    },
    en: {
        available_balance: "Available balance",
        account_subtitle: "Account for all your needs",
        see_iban: "See my IBAN",
        make_transfer: "Make a transfer",
        see_card: "See my virtual card",
        transactions_history: "Transaction history",
        total_balance: "Total balance",
        transactions_label: "Transactions",
        currency_label: "Currency",
        amount: "Transfer amount",
        beneficiary_name: "Beneficiary name",
        iban: "IBAN / Account number",
        bic: "Bank code (BIC / SWIFT)",
        bank_name: "Bank name",
        reason: "Transfer reason",
        continue: "Continue",
        identity_verification: "Identity verification",
        pending_transfer_details: "Pending transfer details",
        cancel_transfer: "Cancel transfer",
        enter_activation_code: "Please enter the transfer activation code",
        activation_code: "Activation code",
        transfer_in_progress: "Your transfer is in progress...",
        identity_verified: "Identity verification successful.",
        progress_desc: "Please wait for the funds to reach your bank before refreshing this page.",
        transfer_success: "Transfer completed successfully",
        success_subtitle: "Your transfer has been processed and will be credited to the beneficiary within 24 to 48 hours.",
        amount_sent: "Amount sent",
        beneficiary: "Beneficiary",
        date: "Date",
        reference: "Reference",
        back_to_dashboard: "Back to dashboard",
        my_virtual_card: "My virtual card",
        holder: "Holder",
        expires: "Expires",
        show_details: "Show details",
        hide_details: "Hide details",
        freeze_card: "Freeze card",
        settings: "Settings",
        monthly_limit: "Monthly limit",
        monthly_spent: "Monthly spent",
        status: "Status",
        active: "Active",
        type: "Type",
        my_account: "My account",
        verified: "Verified",
        account_holder_premium: "Account holder • Premium Client",
        full_name: "Full name",
        email_address: "Email address",
        phone_number: "Phone number",
        country: "Country of residence",
        account_id: "Unique ID",
        opening_date: "Opening date",
        edit_profile: "Edit profile",
        security: "Security",
        notifications: "Notifications",
        no_transactions: "No transactions yet",
        err_email: "Incorrect email address.",
        err_pin: "Incorrect PIN code.",
        err_amount: "Invalid amount.",
        err_balance: "Insufficient balance.",
        err_fields: "Please fill in all fields.",
        err_activation: "Incorrect activation code.",
        err_percent: "Amount exceeds allowed limit ({limit}).",
        err_client_not_found: "Client not found. Invalid link.",
        err_no_link: "No link provided. Access denied.",
        welcome: "Welcome",
        login_success: "Login successful. Welcome!",
        transfer_cancelled: "Transfer cancelled.",
        transfer_finalized: "Transfer completed successfully!"
    },
    es: {
        available_balance: "Saldo disponible",
        account_subtitle: "Cuenta para todas tus necesidades",
        see_iban: "Ver mi IBAN",
        make_transfer: "Hacer una transferencia",
        see_card: "Ver mi tarjeta virtual",
        transactions_history: "Historial de transacciones",
        total_balance: "Saldo total",
        transactions_label: "Transacciones",
        currency_label: "Moneda",
        amount: "Importe de la transferencia",
        beneficiary_name: "Nombre del beneficiario",
        iban: "IBAN / Número de cuenta",
        bic: "Código bancario (BIC / SWIFT)",
        bank_name: "Nombre del banco",
        reason: "Motivo de la transferencia",
        continue: "Continuar",
        identity_verification: "Verificación de identidad",
        pending_transfer_details: "Detalles de la transferencia pendiente",
        cancel_transfer: "Cancelar transferencia",
        enter_activation_code: "Introduzca el código de activación",
        activation_code: "Código de activación",
        transfer_in_progress: "Su transferencia está en curso...",
        identity_verified: "Verificación de identidad exitosa.",
        progress_desc: "Espere a que los fondos lleguen a su banco antes de actualizar.",
        transfer_success: "Transferencia completada con éxito",
        success_subtitle: "Su transferencia ha sido procesada y se acreditará en 24 a 48 horas.",
        amount_sent: "Importe enviado",
        beneficiary: "Beneficiario",
        date: "Fecha",
        reference: "Referencia",
        back_to_dashboard: "Volver al panel",
        my_virtual_card: "Mi tarjeta virtual",
        holder: "Titular",
        expires: "Caduca",
        show_details: "Mostrar detalles",
        hide_details: "Ocultar detalles",
        freeze_card: "Congelar tarjeta",
        settings: "Ajustes",
        monthly_limit: "Límite mensual",
        monthly_spent: "Gastos del mes",
        status: "Estado",
        active: "Activa",
        type: "Tipo",
        my_account: "Mi cuenta",
        verified: "Verificado",
        account_holder_premium: "Titular • Cliente Premium",
        full_name: "Nombre completo",
        email_address: "Correo electrónico",
        phone_number: "Número de teléfono",
        country: "País de residencia",
        account_id: "ID único",
        opening_date: "Fecha de apertura",
        edit_profile: "Editar perfil",
        security: "Seguridad",
        notifications: "Notificaciones",
        no_transactions: "Sin transacciones por ahora",
        err_email: "Correo electrónico incorrecto.",
        err_pin: "PIN incorrecto.",
        err_amount: "Importe inválido.",
        err_balance: "Saldo insuficiente.",
        err_fields: "Por favor, rellene todos los campos.",
        err_activation: "Código de activación incorrecto.",
        err_percent: "El importe supera el límite permitido ({limit}).",
        err_client_not_found: "Cliente no encontrado. Enlace inválido.",
        err_no_link: "Sin enlace. Acceso denegado.",
        welcome: "Bienvenido",
        login_success: "¡Inicio de sesión exitoso!",
        transfer_cancelled: "Transferencia cancelada.",
        transfer_finalized: "¡Transferencia completada!"
    },
    de: {
        available_balance: "Verfügbares Guthaben",
        account_subtitle: "Konto für alle Ihre Bedürfnisse",
        see_iban: "IBAN anzeigen",
        make_transfer: "Überweisung durchführen",
        see_card: "Virtuelle Karte anzeigen",
        transactions_history: "Transaktionsverlauf",
        total_balance: "Gesamtguthaben",
        transactions_label: "Transaktionen",
        currency_label: "Währung",
        amount: "Überweisungsbetrag",
        beneficiary_name: "Name des Begünstigten",
        iban: "IBAN / Kontonummer",
        bic: "Bankleitzahl (BIC / SWIFT)",
        bank_name: "Bankname",
        reason: "Überweisungsgrund",
        continue: "Weiter",
        identity_verification: "Identitätsüberprüfung",
        pending_transfer_details: "Details der ausstehenden Überweisung",
        cancel_transfer: "Überweisung abbrechen",
        enter_activation_code: "Bitte geben Sie den Aktivierungscode ein",
        activation_code: "Aktivierungscode",
        transfer_in_progress: "Ihre Überweisung wird bearbeitet...",
        identity_verified: "Identitätsprüfung erfolgreich.",
        progress_desc: "Bitte warten Sie, bis das Geld bei Ihrer Bank eingegangen ist.",
        transfer_success: "Überweisung erfolgreich abgeschlossen",
        success_subtitle: "Ihre Überweisung wurde bearbeitet und wird innerhalb von 24 bis 48 Stunden gutgeschrieben.",
        amount_sent: "Gesendeter Betrag",
        beneficiary: "Begünstigter",
        date: "Datum",
        reference: "Referenz",
        back_to_dashboard: "Zurück zum Dashboard",
        my_virtual_card: "Meine virtuelle Karte",
        holder: "Inhaber",
        expires: "Gültig bis",
        show_details: "Details anzeigen",
        hide_details: "Details verbergen",
        freeze_card: "Karte sperren",
        settings: "Einstellungen",
        monthly_limit: "Monatliches Limit",
        monthly_spent: "Diesen Monat ausgegeben",
        status: "Status",
        active: "Aktiv",
        type: "Typ",
        my_account: "Mein Konto",
        verified: "Verifiziert",
        account_holder_premium: "Kontoinhaber • Premium-Kunde",
        full_name: "Vollständiger Name",
        email_address: "E-Mail-Adresse",
        phone_number: "Telefonnummer",
        country: "Wohnsitzland",
        account_id: "Eindeutige ID",
        opening_date: "Eröffnungsdatum",
        edit_profile: "Profil bearbeiten",
        security: "Sicherheit",
        notifications: "Benachrichtigungen",
        no_transactions: "Noch keine Transaktionen",
        err_email: "Falsche E-Mail-Adresse.",
        err_pin: "Falscher PIN-Code.",
        err_amount: "Ungültiger Betrag.",
        err_balance: "Unzureichendes Guthaben.",
        err_fields: "Bitte alle Felder ausfüllen.",
        err_activation: "Falscher Aktivierungscode.",
        err_percent: "Betrag überschreitet das Limit ({limit}).",
        err_client_not_found: "Kunde nicht gefunden. Ungültiger Link.",
        err_no_link: "Kein Link. Zugriff verweigert.",
        welcome: "Willkommen",
        login_success: "Anmeldung erfolgreich. Willkommen!",
        transfer_cancelled: "Überweisung abgebrochen.",
        transfer_finalized: "Überweisung erfolgreich abgeschlossen!"
    },
    pl: {
        available_balance: "Dostępne saldo",
        account_subtitle: "Konto na wszystkie potrzeby",
        see_iban: "Zobacz moje IBAN",
        make_transfer: "Wykonaj przelew",
        see_card: "Zobacz kartę wirtualną",
        transactions_history: "Historia transakcji",
        total_balance: "Całkowite saldo",
        transactions_label: "Transakcje",
        currency_label: "Waluta",
        amount: "Kwota przelewu",
        beneficiary_name: "Nazwa odbiorcy",
        iban: "IBAN / Numer konta",
        bic: "Kod banku (BIC / SWIFT)",
        bank_name: "Nazwa banku",
        reason: "Powód przelewu",
        continue: "Kontynuuj",
        identity_verification: "Weryfikacja tożsamości",
        pending_transfer_details: "Szczegóły oczekującego przelewu",
        cancel_transfer: "Anuluj przelew",
        enter_activation_code: "Wprowadź kod aktywacyjny przelewu",
        activation_code: "Kod aktywacyjny",
        transfer_in_progress: "Twój przelew jest w trakcie realizacji...",
        identity_verified: "Weryfikacja tożsamości zakończona pomyślnie.",
        progress_desc: "Poczekaj na zaksięgowanie środków w banku.",
        transfer_success: "Przelew zakończony pomyślnie",
        success_subtitle: "Twój przelew został przetworzony i zostanie zaksięgowany w ciągu 24-48 godzin.",
        amount_sent: "Wysłana kwota",
        beneficiary: "Odbiorca",
        date: "Data",
        reference: "Referencja",
        back_to_dashboard: "Powrót do pulpitu",
        my_virtual_card: "Moja karta wirtualna",
        holder: "Posiadacz",
        expires: "Ważna do",
        show_details: "Pokaż szczegóły",
        hide_details: "Ukryj szczegóły",
        freeze_card: "Zablokuj kartę",
        settings: "Ustawienia",
        monthly_limit: "Miesięczny limit",
        monthly_spent: "Wydatki w tym miesiącu",
        status: "Status",
        active: "Aktywna",
        type: "Typ",
        my_account: "Moje konto",
        verified: "Zweryfikowany",
        account_holder_premium: "Posiadacz konta • Klient Premium",
        full_name: "Pełne imię i nazwisko",
        email_address: "Adres e-mail",
        phone_number: "Numer telefonu",
        country: "Kraj zamieszkania",
        account_id: "Unikalny identyfikator",
        opening_date: "Data otwarcia",
        edit_profile: "Edytuj profil",
        security: "Bezpieczeństwo",
        notifications: "Powiadomienia",
        no_transactions: "Brak transakcji",
        err_email: "Nieprawidłowy adres e-mail.",
        err_pin: "Nieprawidłowy kod PIN.",
        err_amount: "Nieprawidłowa kwota.",
        err_balance: "Niewystarczające saldo.",
        err_fields: "Wypełnij wszystkie pola.",
        err_activation: "Nieprawidłowy kod aktywacyjny.",
        err_percent: "Kwota przekracza dozwolony limit ({limit}).",
        err_client_not_found: "Nie znaleziono klienta. Nieprawidłowy link.",
        err_no_link: "Brak linku. Odmowa dostępu.",
        welcome: "Witaj",
        login_success: "Zalogowano pomyślnie. Witaj!",
        transfer_cancelled: "Przelew anulowany.",
        transfer_finalized: "Przelew zakończony pomyślnie!"
    }
};

// ---------- FONCTION DE TRADUCTION ----------
function t(key, vars = {}) {
    const dict = TRANSLATIONS[appState.lang] || TRANSLATIONS.fr;
    let text = dict[key] || TRANSLATIONS.fr[key] || key;
    Object.keys(vars).forEach(k => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
    });
    return text;
}

// ---------- APPLICATION DE LA LANGUE ----------
function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
}

// ---------- APPLICATION DE LA COULEUR DYNAMIQUE ----------
function applyClientColor(color) {
    if (!color) color = '#ff7a00';
    const light = lightenColor(color, 15);
    const dark = darkenColor(color, 15);
    const soft = hexToRgba(color, 0.1);

    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-color-light', light);
    document.documentElement.style.setProperty('--primary-color-dark', dark);
    document.documentElement.style.setProperty('--primary-color-soft', soft);
}

function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16)
    };
}
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}
function lightenColor(hex, percent) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r + (255 - r) * (percent / 100), g + (255 - g) * (percent / 100), b + (255 - b) * (percent / 100));
}
function darkenColor(hex, percent) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r * (1 - percent / 100), g * (1 - percent / 100), b * (1 - percent / 100));
}
function hexToRgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------- UTILITAIRES ----------
function formatMoney(amount) {
    const num = Number(amount) || 0;
    return num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + appState.currency;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        info: 'fa-circle-info'
    };
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getClientIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// ============================================================
// GESTION DE SESSION (localStorage = très fiable sur mobile)
// ============================================================
function saveSession() {
    if (!appState.clientId) return;
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            clientId: appState.clientId,
            loggedIn: true,
            savedAt: Date.now()
        }));
        console.log('✅ Session sauvegardée dans localStorage');
    } catch (e) {
        console.warn('Impossible de sauvegarder la session', e);
    }
}

function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        // Session valable 7 jours
        if (Date.now() - data.savedAt > 7 * 24 * 60 * 60 * 1000) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

function clearSession() {
    try {
        localStorage.removeItem(SESSION_KEY);
        console.log('🗑️ Session effacée');
    } catch {}
}

// ✅ Affiche l'écran de blocage si l'admin a bloqué l'accès
function showBlockedScreen(client) {
    const card = document.querySelector('#invalid-screen .invalid-card');
    if (card) {
        const iconBox = card.querySelector('.invalid-icon');
        iconBox.innerHTML = '<i class="fa-solid fa-lock"></i>';
        iconBox.style.backgroundColor = '#fef3c7';
        iconBox.style.color = '#d97706';

        card.querySelector('.invalid-title').textContent = 'Compte temporairement bloqué';

        const name = client
            ? `${client.firstName || ''} ${client.lastName || ''}`.trim()
            : '';

        card.querySelector('.invalid-message').textContent = name
            ? `Bonjour ${name}, votre accès au compte App Pay a été temporairement suspendu par l'administrateur.`
            : `Votre accès au compte App Pay a été temporairement suspendu par l'administrateur.`;

        const infoSpan = card.querySelector('.invalid-info span');
        if (infoSpan) {
            infoSpan.textContent = 'Veuillez contacter l\'administrateur pour rétablir votre accès.';
        }
    }
    showScreen('invalid-screen');
}

// ============================================================
// CHARGEMENT DU CLIENT DEPUIS FIRESTORE (FORCÉ DEPUIS LE SERVEUR)
// ============================================================
async function loadClientFromFirestore(options = {}) {
    const { autoLogin = false } = options;
    const clientId = getClientIdFromURL();

    if (!clientId) {
        console.warn('Aucun ID dans l\'URL');
        showScreen('invalid-screen');
        return null;
    }

    appState.clientId = clientId;

    try {
        await authPromise;

        // ✅ FORCER la lecture depuis le serveur (pas de cache)
        const docRef = doc(db, 'clients', clientId);
        let docSnap;
        try {
            docSnap = await getDocFromServer(docRef);
            console.log('✅ Données lues depuis le SERVEUR');
        } catch (err) {
            console.warn('⚠️ Lecture serveur échouée, utilisation du cache', err);
            const { getDoc } = await import('./firebase-config.js');
            docSnap = await getDoc(docRef);
        }

        if (!docSnap.exists()) {
            console.warn('Client introuvable :', clientId);
            showScreen('invalid-screen');
            return null;
        }

        const client = docSnap.data();
        appState.client = client;
        appState.balance = Number(client.balance) || 0;
        appState.currency = client.currency || 'zł';
        appState.transactions = client.transactions || [];
        appState.lang = client.language || 'fr';

        // ✅ Debug : log du nombre de transactions
        console.log(`📊 Client chargé : ${client.firstName} ${client.lastName}`);
        console.log(`💰 Solde : ${appState.balance} ${appState.currency}`);
        console.log(`📜 Transactions : ${appState.transactions.length}`);

        // Vérification si l'accès est bloqué
        if (client.blocked === true) {
            clearSession();
            showBlockedScreen(client);
            return null;
        }

        applyClientColor(client.color);

        const badgeText = document.getElementById('badge-text');
        if (badgeText) {
            badgeText.textContent = `${client.firstName} ${client.lastName}`.toUpperCase();
        }
        const emailInput = document.getElementById('login-email');
        if (emailInput) emailInput.value = client.email;

        // ✅ Vérifier si une session existe déjà
        const session = getSession();
        const shouldAutoLogin = autoLogin || (session && session.loggedIn && session.clientId === clientId);

        if (shouldAutoLogin) {
            console.log('✅ Session restaurée : connexion automatique');
            loginSuccess();
            return client;
        }

        showScreen('login-screen');
        return client;

    } catch (err) {
        console.error('Erreur chargement client :', err);
        showScreen('invalid-screen');
        return null;
    }
}

// ---------- CONNEXION ----------
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pin = document.getElementById('login-password').value.trim();
    const errorEl = document.getElementById('login-error');
    const client = appState.client;

    if (!client) {
        errorEl.textContent = t('err_client_not_found');
        return;
    }

    if (client.blocked === true) {
        clearSession();
        showBlockedScreen(client);
        return;
    }

    if (email !== (client.email || '').toLowerCase()) {
        errorEl.textContent = t('err_email');
        return;
    }

    if (pin !== client.pin) {
        errorEl.textContent = t('err_pin');
        return;
    }

    errorEl.textContent = '';
    saveSession();
    loginSuccess();
}

// ✅ Fonction centrale : affiche l'app après connexion
function loginSuccess() {
    const client = appState.client;
    showScreen('app-screen');

    const initials = ((client.firstName || 'X')[0] + (client.lastName || 'X')[0]).toUpperCase();
    document.getElementById('header-avatar').textContent = initials;

    applyLanguage();

    setTimeout(() => {
        navigateTo('dashboard');
    }, 200);
}

// ---------- DÉCONNEXION ----------
function handleLogout() {
    if (!confirm('Voulez-vous vraiment vous déconnecter ?')) return;
    clearSession();
    showScreen('login-screen');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').textContent = '';
    if (appState.client) {
        document.getElementById('login-email').value = appState.client.email;
    }
    appState.pendingTransfer = null;
    appState.lang = appState.client?.language || 'fr';
}

// ============================================================
// NAVIGATION ENTRE VUES
// ============================================================
const viewTemplates = {
    dashboard: 'tpl-dashboard',
    transfer: 'tpl-transfer',
    verification: 'tpl-verification',
    progress: 'tpl-progress',
    success: 'tpl-success',
    card: 'tpl-card',
    account: 'tpl-account'
};

function navigateTo(viewName, data = {}) {
    const container = document.getElementById('views-container');
    const templateId = viewTemplates[viewName];
    if (!templateId) return;

    const template = document.getElementById(templateId);
    container.innerHTML = '';
    container.appendChild(template.content.cloneNode(true));

    document.querySelectorAll('#nav-links li').forEach(li => {
        li.classList.toggle('active', li.dataset.view === viewName);
    });

    applyLanguage();

    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'transfer') renderTransferView();
    if (viewName === 'verification') renderVerificationView(data);
    if (viewName === 'progress') renderProgressView(data);
    if (viewName === 'success') renderSuccessView(data);
    if (viewName === 'card') renderCardView();
    if (viewName === 'account') renderAccountView();

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// VUE : DASHBOARD
// ============================================================
function renderDashboard() {
    document.getElementById('balance-display').textContent = formatMoney(appState.balance);

    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName && appState.client) {
        welcomeName.textContent = `${appState.client.lastName} ${appState.client.firstName}`.toUpperCase();
    }

    // Remplir les 3 mini-cartes
    const statBalance = document.getElementById('stat-balance');
    const statTx = document.getElementById('stat-transactions');
    const statCurr = document.getElementById('stat-currency');
    if (statBalance) statBalance.textContent = formatMoney(appState.balance);
    if (statTx) statTx.textContent = (appState.transactions || []).length;
    if (statCurr) statCurr.textContent = appState.currency;

    // Bouton "Voir mon IBAN"
    const btnIban = document.getElementById('btn-show-iban');
    if (btnIban) {
        btnIban.addEventListener('click', () => {
            const id = appState.client?.id || '--';
            if (navigator.clipboard) {
                navigator.clipboard.writeText(id).then(() => {
                    showToast('ID copié : ' + id, 'success');
                }).catch(() => {
                    showToast('ID : ' + id, 'info');
                });
            } else {
                showToast('ID : ' + id, 'info');
            }
        });
    }

    // Bouton "Effectuer un virement"
    const btnGoTransfer = document.getElementById('btn-go-transfer');
    if (btnGoTransfer) {
        btnGoTransfer.addEventListener('click', () => navigateTo('transfer'));
    }

    // Bouton "Voir ma carte virtuelle"
    const btnGoCard = document.getElementById('btn-go-card');
    if (btnGoCard) {
        btnGoCard.addEventListener('click', () => navigateTo('card'));
    }

    // Historique des transactions
    const txList = document.getElementById('tx-list');
    if (!txList) return;

    txList.innerHTML = '';

    if (!appState.transactions || appState.transactions.length === 0) {
        txList.innerHTML = `<p class="tx-empty">${t('no_transactions')}</p>`;
        return;
    }

    appState.transactions.forEach(tx => {
        const isDebit = tx.amount < 0;
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <div class="transaction-left">
                <div class="tx-icon ${isDebit ? 'red' : 'green'}">
                    <i class="fa-solid ${isDebit ? 'fa-arrow-trend-up' : 'fa-arrow-right-arrow-left'}" ${isDebit ? 'style="transform: rotate(90deg);"' : ''}></i>
                </div>
                <div class="tx-details">
                    <h4>${tx.title}</h4>
                    <p>${tx.date}</p>
                </div>
            </div>
            <div class="tx-amount ${isDebit ? 'red' : 'green'}">
                ${isDebit ? '-' : '+'} ${formatMoney(Math.abs(tx.amount))}
            </div>
        `;
        txList.appendChild(item);
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
    if (!beneficiary || !iban || !bic || !bank || !reason) {
        return showToast(t('err_fields'), 'error');
    }

    const percentLimit = Number(appState.client?.percentValue ?? 100);
    const maxAllowed = appState.balance * (percentLimit / 100);
    if (amount > maxAllowed) {
        return showToast(
            t('err_percent', { limit: formatMoney(maxAllowed) }),
            'error'
        );
    }

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

    if (!appState.client) {
        return showToast(t('err_client_not_found'), 'error');
    }

    if (code !== appState.client.activationCode) {
        return showToast(t('err_activation'), 'error');
    }

    navigateTo('progress', appState.pendingTransfer);
}

function cancelTransfer() {
    if (!confirm(t('cancel_transfer') + ' ?')) return;
    appState.pendingTransfer = null;
    navigateTo('dashboard');
    showToast(t('transfer_cancelled'), 'info');
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

    let progress = 0;
    const fill = document.getElementById('progress-fill');
    fill.style.width = '0%';
    fill.textContent = '0%';

    const interval = setInterval(() => {
        progress += 1;
        if (progress >= 90) {
            progress = 90;
            clearInterval(interval);
            setTimeout(finalizeTransfer, 1500);
        }
        fill.style.width = progress + '%';
        fill.textContent = progress + '%';
    }, 30);
}

// ============================================================
// FINALISATION DU VIREMENT
// ============================================================
async function finalizeTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;

    appState.balance -= tr.amount;

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' +
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    appState.transactions.unshift({
        type: 'debit',
        title: 'Virement envoyé à ' + tr.beneficiary,
        date: dateStr,
        amount: -tr.amount
    });

    const ref = 'AP' + Date.now().toString().slice(-8);

    try {
        await authPromise;
        await updateDoc(doc(db, 'clients', appState.clientId), {
            balance: appState.balance,
            transactions: appState.transactions
        });
        console.log('✅ Virement sauvegardé dans Firestore');
    } catch (err) {
        console.error('Erreur sauvegarde virement :', err);
        showToast('Erreur de synchronisation', 'error');
    }

    navigateTo('success', {
        amount: tr.amount,
        beneficiary: tr.beneficiary,
        date: dateStr,
        reference: ref
    });

    showToast(t('transfer_finalized'), 'success');
    appState.pendingTransfer = null;
}

// ============================================================
// VUE : SUCCÈS
// ============================================================
function renderSuccessView(data) {
    document.getElementById('sf-amount').textContent = formatMoney(data.amount);
    document.getElementById('sf-beneficiary').textContent = data.beneficiary;
    document.getElementById('sf-date').textContent = data.date;
    document.getElementById('sf-ref').textContent = data.reference;

    const customMsg = appState.client?.messageAfterTransfer;
    const msgEl = document.getElementById('sf-custom-message');
    if (msgEl && customMsg) {
        msgEl.textContent = customMsg;
    }
}

// ============================================================
// VUE : CARTE VIRTUELLE
// ============================================================
let cardNumberVisible = false;

function renderCardView() {
    if (!appState.client) return;

    const holder = document.getElementById('vc-holder');
    if (holder) {
        holder.textContent = `${appState.client.lastName} ${appState.client.firstName}`.toUpperCase();
    }

    const percentLimit = Number(appState.client.percentValue ?? 100);
    const limit = appState.balance * (percentLimit / 100);
    const limitEl = document.getElementById('card-limit');
    if (limitEl) limitEl.textContent = formatMoney(limit);

    cardNumberVisible = false;
}

function toggleCardNumber() {
    cardNumberVisible = !cardNumberVisible;
    const display = document.getElementById('vc-number-display');
    const label = document.getElementById('vc-toggle-label');
    if (cardNumberVisible) {
        display.textContent = '4021 5580 7412 4823';
        if (label) label.textContent = t('hide_details');
    } else {
        display.textContent = '•••• •••• •••• 4823';
        if (label) label.textContent = t('show_details');
    }
}

// ============================================================
// VUE : MON COMPTE
// ============================================================
function renderAccountView() {
    if (!appState.client) return;
    const c = appState.client;
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    const fullName = `${c.lastName} ${c.firstName}`.toUpperCase();
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

// ============================================================
// NOTIFICATIONS
// ============================================================
function toggleNotifications(event) {
    event.stopPropagation();
    document.getElementById('notif-dropdown').classList.toggle('show');
}

// ============================================================
// ✅ RAFRAÎCHISSEMENT AUTOMATIQUE QUAND ON REVIENT SUR L'ONGLET
// ============================================================
let isAppReady = false;

async function refreshClientData() {
    // Ne rien faire si l'utilisateur n'est pas connecté ou si on charge déjà
    if (!isAppReady || !appState.clientId) return;

    // Vérifier qu'il est bien connecté (pas sur l'écran de connexion)
    const appScreen = document.getElementById('app-screen');
    if (!appScreen || !appScreen.classList.contains('active')) return;

    try {
        console.log('🔄 Rafraîchissement des données depuis Firestore...');
        const docRef = doc(db, 'clients', appState.clientId);
        let docSnap;
        try {
            docSnap = await getDocFromServer(docRef);
        } catch {
            return; // Silence si hors ligne
        }

        if (!docSnap.exists()) return;

        const client = docSnap.data();

        // Vérifier si le client a été bloqué entretemps
        if (client.blocked === true) {
            clearSession();
            showBlockedScreen(client);
            return;
        }

        // Mettre à jour l'état
        const oldBalance = appState.balance;
        const oldTxCount = appState.transactions.length;

        appState.client = client;
        appState.balance = Number(client.balance) || 0;
        appState.currency = client.currency || 'zł';
        appState.transactions = client.transactions || [];
        appState.lang = client.language || 'fr';

        // Appliquer la couleur si elle a changé
        applyClientColor(client.color);

        // Rafraîchir la vue actuelle
        const activeView = document.querySelector('#nav-links li.active');
        const viewName = activeView ? activeView.dataset.view : 'dashboard';

        console.log(`🔄 Vue active : ${viewName}`);
        console.log(`💰 Solde : ${oldBalance} → ${appState.balance}`);
        console.log(`📜 Transactions : ${oldTxCount} → ${appState.transactions.length}`);

        // Redessiner la vue actuelle
        navigateTo(viewName);

        // Notifier l'utilisateur si nouvelles transactions
        if (appState.transactions.length > oldTxCount) {
            showToast('Nouvelle transaction reçue !', 'success');
        }
    } catch (err) {
        console.warn('Erreur rafraîchissement :', err);
    }
}

// ✅ Écoute du retour sur l'onglet (visible)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('👁️ Onglet redevenu visible');
        refreshClientData();
    }
});

// ✅ Écoute du focus de la fenêtre (au cas où)
window.addEventListener('focus', () => {
    console.log('🎯 Fenêtre focus');
    refreshClientData();
});

// ============================================================
// EXPOSITION GLOBALE (pour onclick dans le HTML)
// ============================================================
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

    if (!clientId) {
        showScreen('invalid-screen');
        return;
    }

    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('notif-btn').addEventListener('click', toggleNotifications);

    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('notif-dropdown');
        const btn = document.getElementById('notif-btn');
        if (dropdown && !dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    document.querySelectorAll('#nav-links li').forEach(li => {
        li.addEventListener('click', () => navigateTo(li.dataset.view));
    });

    document.getElementById('views-container').addEventListener('submit', (e) => {
        if (e.target.id === 'transfer-form') {
            handleTransferSubmit(e);
        } else if (e.target.id === 'verify-form') {
            handleVerifySubmit(e);
        }
    });

    await loadClientFromFirestore();

    // ✅ Marquer que l'app est prête pour le rafraîchissement auto
    isAppReady = true;
});
