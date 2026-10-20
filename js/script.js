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

function loginSuccess() {
    const client = appState.client;
    showScreen('app-screen');

    const initials = ((client.firstName || 'X')[0] + (client.lastName || 'X')[0]).toUpperCase();
    document.getElementById('header-avatar').textContent = initials;

    applyLanguage();

    startRealtimeListener();

    setTimeout(() => {
        navigateTo('dashboard', {}, true);
    }, 200);
}

// ---------- DÉCONNEXION ----------
function handleLogout() {
    if (!confirm(t('logout') + ' ?')) return;

    if (appState.unsubSnapshot) {
        appState.unsubSnapshot();
        appState.unsubSnapshot = null;
    }

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
// LOADER GLOBAL
// ============================================================
function showLoader() {
    let loader = document.getElementById('global-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);
    }
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
    dashboard: 'tpl-dashboard',
    transfer: 'tpl-transfer',
    verification: 'tpl-verification',
    progress: 'tpl-progress',
    success: 'tpl-success',
    failed: 'tpl-failed',
    card: 'tpl-card',
    iban: 'tpl-iban',
    account: 'tpl-account'
};

function navigateTo(viewName, data = {}, addToHistory = true) {
    showLoader();

    if (addToHistory) {
        history.pushState({ view: viewName, data: data }, '', `#${viewName}`);
    }

    setTimeout(() => {
        const container = document.getElementById('views-container');
        const templateId = viewTemplates[viewName];
        if (!templateId) {
            hideLoader();
            return;
        }

        const template = document.getElementById(templateId);
        if (!template) {
            hideLoader();
            return;
        }

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
        if (viewName === 'failed') renderFailedView(data);
        if (viewName === 'card') renderCardView();
        if (viewName === 'iban') renderIbanView();
        if (viewName === 'account') renderAccountView();

        container.scrollIntoView({ behavior: 'smooth', block: 'start' });

        hideLoader();
    }, 300);
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view) {
        navigateTo(event.state.view, event.state.data, false);
    } else {
        navigateTo('dashboard', {}, false);
    }
});

// ============================================================
// ICÔNE DE TRANSACTION (MODIFIÉE POUR UTILISER LE PROFIL)
// ============================================================
function buildTransactionIcon(tx) {
    const isDebit = tx.amount < 0;

    // On garde le logo de la banque uniquement pour les virements reçus (crédit) si dispo
    if (tx.bankDomain && !isDebit) { 
        const urls = getBankLogoUrls(tx.bankDomain);
        const urlsJson = JSON.stringify(urls).replace(/"/g, '&quot;');

        return `
            <div class="tx-icon-bank" data-urls='${urlsJson}' data-idx="0">
                <img src="${urls[0]}" alt="${tx.bankName || 'Bank'}" loading="lazy" onerror="handleBankLogoError(this);">
            </div>
        `;
    }

    // On remplace les flèches par l'icône utilisateur (fa-user) comme demandé
    return `
        <div class="tx-icon ${isDebit ? 'red' : 'green'}">
            <i class="fa-solid fa-user"></i>
        </div>
    `;
}

window.handleBankLogoError = function (img) {
    const parent = img.parentNode;
    if (!parent) return;
    try {
        const urls = JSON.parse(parent.dataset.urls || '[]');
        let idx = parseInt(parent.dataset.idx || '0', 10);
        idx++;
        if (idx < urls.length) {
            parent.dataset.idx = idx;
            img.src = urls[idx];
            return;
        }
    } catch (e) {}
    parent.classList.add('fallback');
    parent.innerHTML = '<i class="fa-solid fa-building-columns"></i>';
};

// ============================================================
// VUE : DASHBOARD (MODIFIÉE POUR AJOUTER LE CLIC SUR LE REÇU)
// ============================================================
function renderDashboard() {
    document.getElementById('balance-display').textContent = formatMoney(appState.balance);

    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName && appState.client) {
        welcomeName.textContent = `${appState.client.lastName} ${appState.client.firstName}`.toUpperCase();
    }

    const statBalance = document.getElementById('stat-balance');
    const statTx = document.getElementById('stat-transactions');
    const statCurr = document.getElementById('stat-currency');
    if (statBalance) statBalance.textContent = formatMoney(appState.balance);
    if (statTx) statTx.textContent = (appState.transactions || []).length;
    if (statCurr) statCurr.textContent = appState.currency;

    const historyCount = document.getElementById('history-count');
    if (historyCount) historyCount.textContent = (appState.transactions || []).length;

    const btnGoTransfer = document.getElementById('btn-go-transfer');
    if (btnGoTransfer) btnGoTransfer.addEventListener('click', () => navigateTo('transfer'));

    const btnGoCard = document.getElementById('btn-go-card');
    if (btnGoCard) btnGoCard.addEventListener('click', () => navigateTo('card'));

    const txList = document.getElementById('tx-list');
    if (!txList) return;

    txList.innerHTML = '';

    if (!appState.transactions || appState.transactions.length === 0) {
        txList.innerHTML = `<p class="tx-empty">${t('no_transactions')}</p>`;
        return;
    }

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
            const isDebit = tx.amount < 0;
            const timePart = (tx.date || '').split(' • ')[1] || '';
            const txLabel = isDebit ? t('transfer_sent') : t('transfer_received');
            const displaySubtitle = tx.bankName || tx.title || '';

            const item = document.createElement('div');
            item.className = 'transaction-item ' + (isDebit ? 'is-debit' : 'is-credit');
            item.innerHTML = `
                <div class="transaction-left">
                    ${buildTransactionIcon(tx)}
                    <div class="tx-details">
                        <h4>${txLabel}</h4>
                        <p>${displaySubtitle}</p>
                        <span class="tx-time">${timePart}</span>
                    </div>
                </div>
                <div class="tx-right">
                    <div class="tx-amount ${isDebit ? 'red' : 'green'}">
                        ${isDebit ? '−' : '+'}${formatMoney(Math.abs(tx.amount))}
                    </div>
                    <div class="tx-status ${isDebit ? 'red' : 'green'}">${t('completed')}</div>
                </div>
            `;
            
            // AJOUT DE L'ÉVÉNEMENT CLIC POUR OUVRIR LE REÇU
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
    if (!beneficiary || !iban || !bic || !bank || !reason) {
        return showToast(t('err_fields'), 'error');
    }

    const percentLimit = Number(appState.client?.percentValue ?? 100);
    const maxAllowed = appState.balance * (percentLimit / 100);

    if (amount > maxAllowed) {
        sendTransferFailed(appState.client, { amount, limit: maxAllowed })
            .then(r => r.success ? console.log('✅ Email échec envoyé') : console.warn('⚠️ Email échec non envoyé'))
            .catch(e => console.warn('⚠️ Email échec erreur'));

        navigateTo('failed', {
            amount,
            limit: maxAllowed,
            percent: percentLimit,
            beneficiary
        });
        return;
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
// FINALISATION DU VIREMENT (AJOUT DES DONNÉES POUR LE REÇU)
// ============================================================
async function finalizeTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;

    appState.balance -= tr.amount;

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' +
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // ON AJOUTE LES INFOS DU BÉNÉFICIAIRE DANS L'HISTORIQUE POUR LE REÇU
    appState.transactions.unshift({
        type: 'debit',
        title: tr.beneficiary,
        date: dateStr,
        amount: -tr.amount,
        bankName: tr.bank,   // Banque du bénéficiaire
        iban: tr.iban,       // IBAN du bénéficiaire
        bic: tr.bic,
        reason: tr.reason
    });

    const ref = 'AP' + Date.now().toString().slice(-8);

    try {
        await authPromise;
        await updateDoc(doc(db, 'clients', appState.clientId), {
            balance: appState.balance,
            transactions: appState.transactions
        });

        sendTransferSuccess(appState.client, {
            amount: tr.amount,
            beneficiary: tr.beneficiary,
            date: dateStr,
            reference: ref,
            iban: tr.iban
        })
            .then(r => r.success ? console.log('✅ Email confirmation envoyé') : console.warn('⚠️ Email confirmation non envoyé'))
            .catch(e => console.warn('⚠️ Email confirmation erreur'));

    } catch (err) {
        console.error('Erreur sauvegarde virement :', err);
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
// VUE : VIREMENT ÉCHOUÉ
// ============================================================
function renderFailedView(data) {
    const d = data || {};
    const amountEl = document.getElementById('ff-amount');
    const limitEl = document.getElementById('ff-limit');
    const percentEl = document.getElementById('ff-percent');
    const balanceEl = document.getElementById('ff-balance');

    if (amountEl) amountEl.textContent = formatMoney(d.amount || 0);
    if (limitEl) limitEl.textContent = formatMoney(d.limit || 0);
    if (percentEl) percentEl.textContent = (d.percent || 0) + '%';
    if (balanceEl) balanceEl.textContent = formatMoney(appState.balance);
}

// ============================================================
// VUE : CARTE VIRTUELLE (PREMIUM)
// ============================================================
let cardNumberVisible = false;

function renderCardView() {
    if (!appState.client) return;

    const holder = document.getElementById('vc-holder');
    if (holder) {
        holder.textContent = `${appState.client.firstName || ''} ${appState.client.lastName || ''}`.toUpperCase();
    }

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

    if (appState.client.canViewCardDetails !== true) {
        showToast(t('err_card_locked'), 'error');
        return;
    }

    cardNumberVisible = !cardNumberVisible;
    const display = document.getElementById('vc-number-display');
    const cvvEl = document.getElementById('vc-cvv');
    const label = document.getElementById('vc-toggle-label');
    
    const realNumber = appState.client?.cardNumber || '4823000000000000';
    const realCvv = appState.client?.cardCVV || '123';
    
    const visiblePart = realNumber.substring(0, 12).replace(/(\d{4})/g, '$1 ').trim();
    const maskedNumber = visiblePart + ' ••••';
    const fullNumber = realNumber.replace(/(\d{4})/g, '$1 ').trim();

    if (cardNumberVisible) {
        display.textContent = fullNumber;
        if (cvvEl) cvvEl.textContent = realCvv;
        if (label) label.textContent = t('hide_details');
    } else {
        display.textContent = maskedNumber;
        if (cvvEl) cvvEl.textContent = '•••';
        if (label) label.textContent = t('show_details');
    }
}

window.copyCardInfo = function(type) {
    if (!appState.client) return;

    if (appState.client.canViewCardDetails !== true) {
        showToast(t('err_card_locked'), 'error');
        return;
    }

    let textToCopy = '';
    if (type === 'number') {
        textToCopy = appState.client.cardNumber || '';
    } else if (type === 'cvv') {
        textToCopy = appState.client.cardCVV || '';
    }

    if (!textToCopy) return;

    const doCopy = () => {
        showToast(t('copied'), 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(doCopy).catch(() => prompt('Copiez :', textToCopy));
    } else {
        prompt('Copiez :', textToCopy);
    }
};

// ============================================================
// VUE : IBAN PERSONNEL
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
    
    if (appState.client.canViewIban !== true) {
        showToast(t('err_iban_locked'), 'error');
        return;
    }

    ibanVisible = !ibanVisible;
    const ibanDisplay = document.getElementById('client-iban-display');
    const label = document.getElementById('iban-toggle-label');
    
    const rawIban = appState.client.iban || 'PL00 0000 0000 0000 0000 0000 0000';
    
    if (ibanVisible) {
        if (ibanDisplay) ibanDisplay.textContent = rawIban;
        if (label) label.textContent = t('hide_iban');
    } else {
        const maskedIban = rawIban.substring(0, rawIban.length - 4) + '••••';
        if (ibanDisplay) ibanDisplay.textContent = maskedIban;
        if (label) label.textContent = t('show_iban');
    }
};

window.copyIbanInfo = function(type) {
    if (!appState.client) return;
    
    if (appState.client.canViewIban !== true) {
        showToast(t('err_iban_locked'), 'error');
        return;
    }

    let textToCopy = '';
    if (type === 'iban') textToCopy = appState.client.iban || '';
    else if (type === 'swift') textToCopy = appState.client.swift || '';

    if (!textToCopy) return;

    const doCopy = () => {
        showToast(type === 'iban' ? t('iban_copied') : t('swift_copied'), 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(doCopy).catch(() => prompt('Copiez :', textToCopy));
    } else {
        prompt('Copiez :', textToCopy);
    }
};

// ============================================================
// VUE : PROFIL
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
// 🆕 REÇU PDF (MODALE AVEC GESTION IBAN ET BANQUE)
// ============================================================
window.openReceipt = function(tx) {
    if (!tx) return;

    const isDebit = tx.amount < 0;
    const dateStr = tx.date || '--';
    const typeStr = isDebit ? t('transfer_sent') : t('transfer_received');
    const refStr = 'REF-' + (tx.date ? tx.date.replace(/\D/g,'').slice(-8) : Date.now().toString().slice(-8));
    
    // Nom de la partie prenante (bénéficiaire ou émetteur)
    const partyLabel = isDebit ? t('beneficiary') : t('receipt_sender');
    const partyName = tx.title || '--';
    
    // 🌟 GESTION DE LA BANQUE ET DE L'IBAN SELON LE TYPE DE TRANSACTION
    let bankName = tx.bankName || 'APP PAY';
    let iban = tx.iban || '';
    
    // Si c'est un virement reçu (et que la banque est APP PAY par défaut)
    if (!isDebit && !tx.bankName) {
        bankName = 'APP PAY';
    }

    document.getElementById('rcpt-date').textContent = dateStr;
    document.getElementById('rcpt-type').textContent = typeStr;
    document.getElementById('rcpt-ref').textContent = refStr;
    document.getElementById('rcpt-party-label').textContent = partyLabel;
    document.getElementById('rcpt-party').textContent = partyName;
    document.getElementById('rcpt-bank').textContent = bankName;
    
    // GESTION DE L'AFFICHAGE DE LA LIGNE IBAN
    const ibanRow = document.getElementById('rcpt-iban-row');
    const ibanEl = document.getElementById('rcpt-iban');
    
    if (isDebit && iban) {
        // C'est un virement envoyé, on affiche l'IBAN du bénéficiaire
        ibanRow.style.display = 'flex';
        ibanEl.textContent = iban;
    } else {
        // C'est un virement reçu ou pas d'IBAN dispo, on cache la ligne
        ibanRow.style.display = 'none';
    }
    
    const amountEl = document.getElementById('rcpt-amount');
    amountEl.textContent = (isDebit ? '-' : '+') + formatMoney(Math.abs(tx.amount));
    amountEl.style.color = isDebit ? '#e02424' : '#00a04a';
    
    document.getElementById('rcpt-status').textContent = t('completed');
    document.getElementById('rcpt-title').textContent = t('receipt_title');
    
    // Traduire le bouton fermer
    const closeBtn = document.querySelector('.receipt-close-btn span');
    if(closeBtn) closeBtn.textContent = t('close');

    document.getElementById('receipt-modal').classList.add('show');
};

window.closeReceipt = function() {
    document.getElementById('receipt-modal').classList.remove('show');
};

// Fermer le reçu si on clique en dehors de la carte
document.getElementById('receipt-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'receipt-modal') {
        closeReceipt();
    }
});

// ============================================================
// EXPOSITION GLOBALE
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
});

window.addEventListener('beforeunload', () => {
    if (appState.unsubSnapshot) {
        appState.unsubSnapshot();
    }
});
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

function loginSuccess() {
    const client = appState.client;
    showScreen('app-screen');

    const initials = ((client.firstName || 'X')[0] + (client.lastName || 'X')[0]).toUpperCase();
    document.getElementById('header-avatar').textContent = initials;

    applyLanguage();

    startRealtimeListener();

    setTimeout(() => {
        navigateTo('dashboard', {}, true);
    }, 200);
}

// ---------- DÉCONNEXION ----------
function handleLogout() {
    if (!confirm(t('logout') + ' ?')) return;

    if (appState.unsubSnapshot) {
        appState.unsubSnapshot();
        appState.unsubSnapshot = null;
    }

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
// LOADER GLOBAL
// ============================================================
function showLoader() {
    let loader = document.getElementById('global-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);
    }
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
    dashboard: 'tpl-dashboard',
    transfer: 'tpl-transfer',
    verification: 'tpl-verification',
    progress: 'tpl-progress',
    success: 'tpl-success',
    failed: 'tpl-failed',
    card: 'tpl-card',
    iban: 'tpl-iban',
    account: 'tpl-account'
};

function navigateTo(viewName, data = {}, addToHistory = true) {
    showLoader();

    if (addToHistory) {
        history.pushState({ view: viewName, data: data }, '', `#${viewName}`);
    }

    setTimeout(() => {
        const container = document.getElementById('views-container');
        const templateId = viewTemplates[viewName];
        if (!templateId) {
            hideLoader();
            return;
        }

        const template = document.getElementById(templateId);
        if (!template) {
            hideLoader();
            return;
        }

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
        if (viewName === 'failed') renderFailedView(data);
        if (viewName === 'card') renderCardView();
        if (viewName === 'iban') renderIbanView();
        if (viewName === 'account') renderAccountView();

        container.scrollIntoView({ behavior: 'smooth', block: 'start' });

        hideLoader();
    }, 300);
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view) {
        navigateTo(event.state.view, event.state.data, false);
    } else {
        navigateTo('dashboard', {}, false);
    }
});

// ============================================================
// ICÔNE DE TRANSACTION (MODIFIÉE POUR UTILISER LE PROFIL)
// ============================================================
function buildTransactionIcon(tx) {
    const isDebit = tx.amount < 0;

    // On garde le logo de la banque uniquement pour les virements reçus (crédit) si dispo
    if (tx.bankDomain && !isDebit) { 
        const urls = getBankLogoUrls(tx.bankDomain);
        const urlsJson = JSON.stringify(urls).replace(/"/g, '&quot;');

        return `
            <div class="tx-icon-bank" data-urls='${urlsJson}' data-idx="0">
                <img src="${urls[0]}" alt="${tx.bankName || 'Bank'}" loading="lazy" onerror="handleBankLogoError(this);">
            </div>
        `;
    }

    // On remplace les flèches par l'icône utilisateur (fa-user) comme demandé
    return `
        <div class="tx-icon ${isDebit ? 'red' : 'green'}">
            <i class="fa-solid fa-user"></i>
        </div>
    `;
}

window.handleBankLogoError = function (img) {
    const parent = img.parentNode;
    if (!parent) return;
    try {
        const urls = JSON.parse(parent.dataset.urls || '[]');
        let idx = parseInt(parent.dataset.idx || '0', 10);
        idx++;
        if (idx < urls.length) {
            parent.dataset.idx = idx;
            img.src = urls[idx];
            return;
        }
    } catch (e) {}
    parent.classList.add('fallback');
    parent.innerHTML = '<i class="fa-solid fa-building-columns"></i>';
};

// ============================================================
// VUE : DASHBOARD (MODIFIÉE POUR AJOUTER LE CLIC SUR LE REÇU)
// ============================================================
function renderDashboard() {
    document.getElementById('balance-display').textContent = formatMoney(appState.balance);

    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName && appState.client) {
        welcomeName.textContent = `${appState.client.lastName} ${appState.client.firstName}`.toUpperCase();
    }

    const statBalance = document.getElementById('stat-balance');
    const statTx = document.getElementById('stat-transactions');
    const statCurr = document.getElementById('stat-currency');
    if (statBalance) statBalance.textContent = formatMoney(appState.balance);
    if (statTx) statTx.textContent = (appState.transactions || []).length;
    if (statCurr) statCurr.textContent = appState.currency;

    const historyCount = document.getElementById('history-count');
    if (historyCount) historyCount.textContent = (appState.transactions || []).length;

    const btnGoTransfer = document.getElementById('btn-go-transfer');
    if (btnGoTransfer) btnGoTransfer.addEventListener('click', () => navigateTo('transfer'));

    const btnGoCard = document.getElementById('btn-go-card');
    if (btnGoCard) btnGoCard.addEventListener('click', () => navigateTo('card'));

    const txList = document.getElementById('tx-list');
    if (!txList) return;

    txList.innerHTML = '';

    if (!appState.transactions || appState.transactions.length === 0) {
        txList.innerHTML = `<p class="tx-empty">${t('no_transactions')}</p>`;
        return;
    }

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
            const isDebit = tx.amount < 0;
            const timePart = (tx.date || '').split(' • ')[1] || '';
            const txLabel = isDebit ? t('transfer_sent') : t('transfer_received');
            const displaySubtitle = tx.bankName || tx.title || '';

            const item = document.createElement('div');
            item.className = 'transaction-item ' + (isDebit ? 'is-debit' : 'is-credit');
            item.innerHTML = `
                <div class="transaction-left">
                    ${buildTransactionIcon(tx)}
                    <div class="tx-details">
                        <h4>${txLabel}</h4>
                        <p>${displaySubtitle}</p>
                        <span class="tx-time">${timePart}</span>
                    </div>
                </div>
                <div class="tx-right">
                    <div class="tx-amount ${isDebit ? 'red' : 'green'}">
                        ${isDebit ? '−' : '+'}${formatMoney(Math.abs(tx.amount))}
                    </div>
                    <div class="tx-status ${isDebit ? 'red' : 'green'}">${t('completed')}</div>
                </div>
            `;
            
            // AJOUT DE L'ÉVÉNEMENT CLIC POUR OUVRIR LE REÇU
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
    if (!beneficiary || !iban || !bic || !bank || !reason) {
        return showToast(t('err_fields'), 'error');
    }

    const percentLimit = Number(appState.client?.percentValue ?? 100);
    const maxAllowed = appState.balance * (percentLimit / 100);

    if (amount > maxAllowed) {
        sendTransferFailed(appState.client, { amount, limit: maxAllowed })
            .then(r => r.success ? console.log('✅ Email échec envoyé') : console.warn('⚠️ Email échec non envoyé'))
            .catch(e => console.warn('⚠️ Email échec erreur'));

        navigateTo('failed', {
            amount,
            limit: maxAllowed,
            percent: percentLimit,
            beneficiary
        });
        return;
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
// FINALISATION DU VIREMENT (AJOUT DES DONNÉES POUR LE REÇU)
// ============================================================
async function finalizeTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;

    appState.balance -= tr.amount;

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' +
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // ON AJOUTE LES INFOS DU BÉNÉFICIAIRE DANS L'HISTORIQUE POUR LE REÇU
    appState.transactions.unshift({
        type: 'debit',
        title: tr.beneficiary,
        date: dateStr,
        amount: -tr.amount,
        bankName: tr.bank,   // Banque du bénéficiaire
        iban: tr.iban,       // IBAN du bénéficiaire
        bic: tr.bic,
        reason: tr.reason
    });

    const ref = 'AP' + Date.now().toString().slice(-8);

    try {
        await authPromise;
        await updateDoc(doc(db, 'clients', appState.clientId), {
            balance: appState.balance,
            transactions: appState.transactions
        });

        sendTransferSuccess(appState.client, {
            amount: tr.amount,
            beneficiary: tr.beneficiary,
            date: dateStr,
            reference: ref,
            iban: tr.iban
        })
            .then(r => r.success ? console.log('✅ Email confirmation envoyé') : console.warn('⚠️ Email confirmation non envoyé'))
            .catch(e => console.warn('⚠️ Email confirmation erreur'));

    } catch (err) {
        console.error('Erreur sauvegarde virement :', err);
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
// VUE : VIREMENT ÉCHOUÉ
// ============================================================
function renderFailedView(data) {
    const d = data || {};
    const amountEl = document.getElementById('ff-amount');
    const limitEl = document.getElementById('ff-limit');
    const percentEl = document.getElementById('ff-percent');
    const balanceEl = document.getElementById('ff-balance');

    if (amountEl) amountEl.textContent = formatMoney(d.amount || 0);
    if (limitEl) limitEl.textContent = formatMoney(d.limit || 0);
    if (percentEl) percentEl.textContent = (d.percent || 0) + '%';
    if (balanceEl) balanceEl.textContent = formatMoney(appState.balance);
}

// ============================================================
// VUE : CARTE VIRTUELLE (PREMIUM)
// ============================================================
let cardNumberVisible = false;

function renderCardView() {
    if (!appState.client) return;

    const holder = document.getElementById('vc-holder');
    if (holder) {
        holder.textContent = `${appState.client.firstName || ''} ${appState.client.lastName || ''}`.toUpperCase();
    }

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

    if (appState.client.canViewCardDetails !== true) {
        showToast(t('err_card_locked'), 'error');
        return;
    }

    cardNumberVisible = !cardNumberVisible;
    const display = document.getElementById('vc-number-display');
    const cvvEl = document.getElementById('vc-cvv');
    const label = document.getElementById('vc-toggle-label');
    
    const realNumber = appState.client?.cardNumber || '4823000000000000';
    const realCvv = appState.client?.cardCVV || '123';
    
    const visiblePart = realNumber.substring(0, 12).replace(/(\d{4})/g, '$1 ').trim();
    const maskedNumber = visiblePart + ' ••••';
    const fullNumber = realNumber.replace(/(\d{4})/g, '$1 ').trim();

    if (cardNumberVisible) {
        display.textContent = fullNumber;
        if (cvvEl) cvvEl.textContent = realCvv;
        if (label) label.textContent = t('hide_details');
    } else {
        display.textContent = maskedNumber;
        if (cvvEl) cvvEl.textContent = '•••';
        if (label) label.textContent = t('show_details');
    }
}

window.copyCardInfo = function(type) {
    if (!appState.client) return;

    if (appState.client.canViewCardDetails !== true) {
        showToast(t('err_card_locked'), 'error');
        return;
    }

    let textToCopy = '';
    if (type === 'number') {
        textToCopy = appState.client.cardNumber || '';
    } else if (type === 'cvv') {
        textToCopy = appState.client.cardCVV || '';
    }

    if (!textToCopy) return;

    const doCopy = () => {
        showToast(t('copied'), 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(doCopy).catch(() => prompt('Copiez :', textToCopy));
    } else {
        prompt('Copiez :', textToCopy);
    }
};

// ============================================================
// VUE : IBAN PERSONNEL
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
    
    if (appState.client.canViewIban !== true) {
        showToast(t('err_iban_locked'), 'error');
        return;
    }

    ibanVisible = !ibanVisible;
    const ibanDisplay = document.getElementById('client-iban-display');
    const label = document.getElementById('iban-toggle-label');
    
    const rawIban = appState.client.iban || 'PL00 0000 0000 0000 0000 0000 0000';
    
    if (ibanVisible) {
        if (ibanDisplay) ibanDisplay.textContent = rawIban;
        if (label) label.textContent = t('hide_iban');
    } else {
        const maskedIban = rawIban.substring(0, rawIban.length - 4) + '••••';
        if (ibanDisplay) ibanDisplay.textContent = maskedIban;
        if (label) label.textContent = t('show_iban');
    }
};

window.copyIbanInfo = function(type) {
    if (!appState.client) return;
    
    if (appState.client.canViewIban !== true) {
        showToast(t('err_iban_locked'), 'error');
        return;
    }

    let textToCopy = '';
    if (type === 'iban') textToCopy = appState.client.iban || '';
    else if (type === 'swift') textToCopy = appState.client.swift || '';

    if (!textToCopy) return;

    const doCopy = () => {
        showToast(type === 'iban' ? t('iban_copied') : t('swift_copied'), 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(doCopy).catch(() => prompt('Copiez :', textToCopy));
    } else {
        prompt('Copiez :', textToCopy);
    }
};

// ============================================================
// VUE : PROFIL
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
// 🆕 REÇU PDF (MODALE AVEC GESTION IBAN ET BANQUE)
// ============================================================
window.openReceipt = function(tx) {
    if (!tx) return;

    const isDebit = tx.amount < 0;
    const dateStr = tx.date || '--';
    const typeStr = isDebit ? t('transfer_sent') : t('transfer_received');
    const refStr = 'REF-' + (tx.date ? tx.date.replace(/\D/g,'').slice(-8) : Date.now().toString().slice(-8));
    
    // Nom de la partie prenante (bénéficiaire ou émetteur)
    const partyLabel = isDebit ? t('beneficiary') : t('receipt_sender');
    const partyName = tx.title || '--';
    
    // 🌟 GESTION DE LA BANQUE ET DE L'IBAN SELON LE TYPE DE TRANSACTION
    let bankName = tx.bankName || 'APP PAY';
    let iban = tx.iban || '';
    
    // Si c'est un virement reçu (et que la banque est APP PAY par défaut)
    if (!isDebit && !tx.bankName) {
        bankName = 'APP PAY';
    }

    document.getElementById('rcpt-date').textContent = dateStr;
    document.getElementById('rcpt-type').textContent = typeStr;
    document.getElementById('rcpt-ref').textContent = refStr;
    document.getElementById('rcpt-party-label').textContent = partyLabel;
    document.getElementById('rcpt-party').textContent = partyName;
    document.getElementById('rcpt-bank').textContent = bankName;
    
    // GESTION DE L'AFFICHAGE DE LA LIGNE IBAN
    const ibanRow = document.getElementById('rcpt-iban-row');
    const ibanEl = document.getElementById('rcpt-iban');
    
    if (isDebit && iban) {
        // C'est un virement envoyé, on affiche l'IBAN du bénéficiaire
        ibanRow.style.display = 'flex';
        ibanEl.textContent = iban;
    } else {
        // C'est un virement reçu ou pas d'IBAN dispo, on cache la ligne
        ibanRow.style.display = 'none';
    }
    
    const amountEl = document.getElementById('rcpt-amount');
    amountEl.textContent = (isDebit ? '-' : '+') + formatMoney(Math.abs(tx.amount));
    amountEl.style.color = isDebit ? '#e02424' : '#00a04a';
    
    document.getElementById('rcpt-status').textContent = t('completed');
    document.getElementById('rcpt-title').textContent = t('receipt_title');
    
    // Traduire le bouton fermer
    const closeBtn = document.querySelector('.receipt-close-btn span');
    if(closeBtn) closeBtn.textContent = t('close');

    document.getElementById('receipt-modal').classList.add('show');
};

window.closeReceipt = function() {
    document.getElementById('receipt-modal').classList.remove('show');
};

// Fermer le reçu si on clique en dehors de la carte
document.getElementById('receipt-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'receipt-modal') {
        closeReceipt();
    }
});

// ============================================================
// EXPOSITION GLOBALE
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
});

window.addEventListener('beforeunload', () => {
    if (appState.unsubSnapshot) {
        appState.unsubSnapshot();
    }
});
