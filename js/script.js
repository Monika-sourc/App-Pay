// ============================================================
// VANTEX - Application bancaire (script principal client)
// ============================================================

// ---------- ÉTAT GLOBAL ----------
const appState = {
    user: {
        name: 'KWIATKOWSKI PW',
        initials: 'KP',
        email: 'kwiatkowski@vantex.pl'
    },
    balance: 8000.00,
    currency: 'zł',
    transactions: [
        { type: 'debit', title: 'Virement envoyé à Emmanu...', date: '23/09/2026 • 01:24', amount: -2000 },
        { type: 'credit', title: 'Virement reçu de Mbank', date: '23/09/2026 • 01:21', amount: 10000 }
    ],
    pendingTransfer: null,
    currentClient: null
};

// ---------- LECTURE DU CLIENT DEPUIS L'URL ----------
function getClientFromURL() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('c');
    if (!encoded) return null;
    try {
        const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(escape(atob(normalized)));
        return JSON.parse(json);
    } catch (e) {
        console.error('Erreur décodage client', e);
        return null;
    }
}

// ---------- UTILITAIRES ----------
function formatMoney(amount) {
    return amount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + appState.currency;
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

// ---------- CONNEXION ----------
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value.trim();
    const errorEl = document.getElementById('login-error');

    const client = getClientFromURL();

    // Mode lien unique (client créé via admin)
    if (client) {
        if (email !== (client.email || '').toLowerCase()) {
            errorEl.textContent = 'Adresse e-mail incorrecte.';
            return;
        }
        if (password !== client.pin) {
            errorEl.textContent = 'Code PIN incorrect.';
            return;
        }

        // Charger les données du client
        appState.currentClient = client;
        appState.balance = parseFloat(client.balance) || 0;
        appState.currency = client.currency || 'zł';
        appState.user.name = `${client.lastName} ${client.firstName}`;
        appState.user.initials = ((client.firstName || 'X')[0] + (client.lastName || 'X')[0]).toUpperCase();

        errorEl.textContent = '';
        document.getElementById('login-screen').classList.remove('active');
        setTimeout(() => {
            document.getElementById('app-screen').classList.add('active');
            document.getElementById('header-avatar').textContent = appState.user.initials;
            navigateTo('dashboard');
            showToast(`Bienvenue, ${client.firstName} !`, 'success');
        }, 200);
        return;
    }

    // Mode démo (sans lien unique)
    if (!email || !password) {
        errorEl.textContent = 'Veuillez remplir tous les champs.';
        return;
    }
    if (password.length < 4) {
        errorEl.textContent = "Le code d'accès doit contenir au moins 4 caractères.";
        return;
    }

    errorEl.textContent = '';
    document.getElementById('login-screen').classList.remove('active');
    setTimeout(() => {
        document.getElementById('app-screen').classList.add('active');
        navigateTo('dashboard');
        showToast('Connexion réussie. Bienvenue !', 'success');
    }, 200);
}

function handleLogout() {
    if (!confirm('Voulez-vous vraiment vous déconnecter ?')) return;
    document.getElementById('app-screen').classList.remove('active');
    setTimeout(() => {
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('login-form').reset();
        document.getElementById('login-error').textContent = '';
        appState.pendingTransfer = null;
    }, 200);
}

// ---------- NAVIGATION ----------
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

    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'transfer') renderTransferView();
    if (viewName === 'verification') renderVerificationView(data);
    if (viewName === 'progress') renderProgressView(data);
    if (viewName === 'success') renderSuccessView(data);

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- VUE : DASHBOARD ----------
function renderDashboard() {
    document.getElementById('balance-display').textContent = formatMoney(appState.balance);

    // Nom de bienvenue
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) {
        welcomeName.textContent = appState.currentClient
            ? `${appState.currentClient.lastName} ${appState.currentClient.firstName}`.toUpperCase()
            : 'KWIATKOWSKI PW';
    }

    // Historique transactions
    const txList = document.getElementById('tx-list');
    txList.innerHTML = '';
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

    // Remplir la page Mon Compte (même si pas encore affichée)
    renderAccountView();
}

// ---------- VUE : MON COMPTE ----------
function renderAccountView() {
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    if (appState.currentClient) {
        const c = appState.currentClient;
        const fullName = `${c.lastName} ${c.firstName}`.toUpperCase();
        const initials = ((c.firstName || 'X')[0] + (c.lastName || 'X')[0]).toUpperCase();
        setEl('account-initials', initials);
        setEl('account-fullname', fullName);
        setEl('account-name', fullName);
        setEl('account-email', c.email);
        setEl('account-phone', c.phone || '—');
        setEl('account-iban', (c.id || '').toUpperCase());
        setEl('account-created', new Date(c.createdAt).toLocaleDateString('fr-FR'));
        setEl('vc-holder', fullName);
    }
}

// ---------- VUE : VIREMENT ----------
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

    if (!amount || amount <= 0) return showToast('Montant invalide.', 'error');
    if (amount > appState.balance) return showToast('Solde insuffisant.', 'error');
    if (!beneficiary || !iban || !bic || !bank || !reason) {
        return showToast('Veuillez remplir tous les champs.', 'error');
    }

    appState.pendingTransfer = { amount, beneficiary, iban, bic, bank, reason };
    navigateTo('verification', appState.pendingTransfer);
}

// ---------- VUE : VÉRIFICATION ----------
function renderVerificationView(data) {
    const t = appState.pendingTransfer || data;
    if (!t) return navigateTo('dashboard');

    document.getElementById('vf-amount').textContent = formatMoney(t.amount);
    document.getElementById('vf-beneficiary').textContent = t.beneficiary;
    document.getElementById('vf-iban').textContent = t.iban;
    document.getElementById('vf-bic').textContent = t.bic;
    document.getElementById('vf-bank').textContent = t.bank;
    document.getElementById('vf-reason').textContent = t.reason;
}

function handleVerifySubmit(event) {
    event.preventDefault();
    const code = document.getElementById('vf-code').value.trim();

    // Si un client est connecté via un lien unique → vérifier son code d'activation
    if (appState.currentClient) {
        if (code !== appState.currentClient.activationCode) {
            return showToast("Code d'activation incorrect.", 'error');
        }
    } else {
        // Mode démo : au moins 4 caractères
        if (code.length < 4) {
            return showToast("Le code d'activation doit contenir au moins 4 caractères.", 'error');
        }
    }

    navigateTo('progress', appState.pendingTransfer);
}

function cancelTransfer() {
    if (!confirm('Voulez-vous vraiment annuler ce virement ?')) return;
    appState.pendingTransfer = null;
    navigateTo('dashboard');
    showToast('Virement annulé.', 'info');
}

// ---------- VUE : PROGRESSION ----------
function renderProgressView(data) {
    const t = appState.pendingTransfer || data;
    document.getElementById('pf-amount').textContent = formatMoney(t.amount);
    document.getElementById('pf-beneficiary').textContent = t.beneficiary;
    document.getElementById('pf-iban').textContent = t.iban;
    document.getElementById('pf-bank').textContent = t.bank;

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

function finalizeTransfer() {
    const t = appState.pendingTransfer;
    if (!t) return;

    appState.balance -= t.amount;

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' +
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    appState.transactions.unshift({
        type: 'debit',
        title: 'Virement envoyé à ' + t.beneficiary,
        date: dateStr,
        amount: -t.amount
    });

    // Mettre à jour le localStorage si client connecté via lien unique
    if (appState.currentClient) {
        try {
            const clients = JSON.parse(localStorage.getItem('vantex_clients') || '[]');
            const idx = clients.findIndex(c => c.id === appState.currentClient.id);
            if (idx !== -1) {
                clients[idx].balance = appState.balance;
                clients[idx].transactions = appState.transactions;
                localStorage.setItem('vantex_clients', JSON.stringify(clients));
            }
        } catch (e) { console.warn('Sync localStorage impossible', e); }
    }

    const ref = 'VX' + Date.now().toString().slice(-8);

    navigateTo('success', {
        amount: t.amount,
        beneficiary: t.beneficiary,
        date: dateStr,
        reference: ref
    });

    showToast('Virement finalisé avec succès !', 'success');
    appState.pendingTransfer = null;
}

// ---------- VUE : SUCCÈS ----------
function renderSuccessView(data) {
    document.getElementById('sf-amount').textContent = formatMoney(data.amount);
    document.getElementById('sf-beneficiary').textContent = data.beneficiary;
    document.getElementById('sf-date').textContent = data.date;
    document.getElementById('sf-ref').textContent = data.reference;
}

// ---------- CARTE VIRTUELLE ----------
let cardNumberVisible = false;
function toggleCardNumber() {
    cardNumberVisible = !cardNumberVisible;
    const display = document.getElementById('vc-number-display');
    const label = document.getElementById('vc-toggle-label');
    if (cardNumberVisible) {
        display.textContent = '4021 5580 7412 4823';
        label.textContent = 'Masquer les détails';
    } else {
        display.textContent = '•••• •••• •••• 4823';
        label.textContent = 'Afficher les détails';
    }
}

// ---------- NOTIFICATIONS ----------
function toggleNotifications(event) {
    event.stopPropagation();
    document.getElementById('notif-dropdown').classList.toggle('show');
}

// ---------- INITIALISATION ----------
document.addEventListener('DOMContentLoaded', () => {
    // Préremplir les infos du client depuis l'URL
    const client = getClientFromURL();
    if (client) {
        const badgeText = document.getElementById('badge-text');
        if (badgeText) {
            badgeText.textContent = `${client.firstName} ${client.lastName}`.toUpperCase();
        }
        const emailInput = document.getElementById('login-email');
        if (emailInput) emailInput.value = client.email;
        appState.currentClient = client;
    }

    // Formulaire de connexion
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Bouton notifications
    document.getElementById('notif-btn').addEventListener('click', toggleNotifications);

    // Fermer le dropdown notifications au clic extérieur
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('notif-dropdown');
        const btn = document.getElementById('notif-btn');
        if (dropdown && !dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    // Navigation latérale
    document.querySelectorAll('#nav-links li').forEach(li => {
        li.addEventListener('click', () => navigateTo(li.dataset.view));
    });

    // Délégation d'événements pour les formulaires créés dynamiquement
    document.getElementById('views-container').addEventListener('submit', (e) => {
        if (e.target.id === 'transfer-form') {
            handleTransferSubmit(e);
        } else if (e.target.id === 'verify-form') {
            handleVerifySubmit(e);
        }
    });
});
