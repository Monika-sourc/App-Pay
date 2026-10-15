// ============================================================
// APP PAY ADMIN - Gestion des clients (Firebase + Banques)
// ============================================================

import {
    db,
    authPromise,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp
} from './firebase-config.js';

import { BANKS_BY_COUNTRY, getBankLogoUrl } from './banks.js';

const COLLECTION_NAME = 'clients';
let lastGeneratedLink = '';
let selectedColor = '#ff7a00';
let selectedModifyColor = '#ff7a00';
let allClients = [];
let selectedClientId = null;
let pendingTransactions = [];
let currentDetailClient = null;

// ---------- UTILITAIRES ----------
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        info: 'fa-circle-info'
    };
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

function formatDate() {
    const now = new Date();
    return now.toLocaleDateString('fr-FR') + ' • ' +
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getInitials(firstName, lastName) {
    const f = (firstName || 'X')[0] || 'X';
    const l = (lastName || 'X')[0] || 'X';
    return (f + l).toUpperCase();
}

function getClientLink(clientId) {
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
    return `${baseUrl}?id=${clientId}`;
}

// ============================================================
// GESTION DES BANQUES
// ============================================================
function populateBankSelect(clientCountry) {
    const select = document.getElementById('m-tx-bank');
    if (!select) return;

    select.innerHTML = '<option value="">-- Sélectionner une banque --</option>';

    const countryBanks = BANKS_BY_COUNTRY[clientCountry] || [];
    if (countryBanks.length > 0) {
        const group = document.createElement('optgroup');
        group.label = `⭐ Banques du pays du client (${clientCountry})`;
        countryBanks.forEach(bank => {
            const opt = document.createElement('option');
            opt.value = bank.domain;
            opt.dataset.bankName = bank.name;
            opt.dataset.bankDomain = bank.domain;
            opt.textContent = bank.name;
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
            group.appendChild(opt);
        });
        select.appendChild(group);
    });
}

// ============================================================
// SÉLECTEURS DE COULEUR
// ============================================================
function initColorPicker() {
    const picker = document.getElementById('color-picker');
    const hiddenInput = document.getElementById('c-color');

    picker.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            picker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedColor = option.dataset.color;
            hiddenInput.value = selectedColor;
        });
    });

    const defaultOption = picker.querySelector('[data-color="#ff7a00"]');
    if (defaultOption) defaultOption.classList.add('selected');
}

function initModifyColorPicker() {
    const picker = document.getElementById('m-color-picker');
    const hiddenInput = document.getElementById('m-color');

    picker.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            picker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedModifyColor = option.dataset.color;
            hiddenInput.value = selectedModifyColor;
        });
    });
}

// ============================================================
// CRÉATION D'UN CLIENT
// ============================================================
async function handleCreateClient(event) {
    event.preventDefault();

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
    const pin = document.getElementById('c-pin').value.trim();
    const activationCode = document.getElementById('c-activation').value.trim();
    const percentValue = parseInt(document.getElementById('c-percent-value').value, 10);
    const messageAfterTransfer = document.getElementById('c-message').value.trim();
    const color = document.getElementById('c-color').value;

    if (!lastName || !firstName) return showToast('Nom et prénom obligatoires.', 'error');
    if (!country) return showToast('Pays obligatoire.', 'error');
    if (!email.includes('@') || !email.includes('.')) return showToast('Adresse e-mail invalide.', 'error');
    if (!language) return showToast('Langue obligatoire.', 'error');
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
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Création en cours...';

    try {
        await authPromise;

        const emailCheck = query(collection(db, COLLECTION_NAME), where('email', '==', email));
        const existing = await getDocs(emailCheck);
        if (!existing.empty) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            return showToast('Un client avec cet e-mail existe déjà.', 'error');
        }

        const clientId = generateId();
        const clientData = {
            id: clientId,
            lastName, firstName, country, countryFlag,
            address, email, phone, language,
            balance, currency, pin, activationCode,
            percentValue, messageAfterTransfer, color,
            transactions: [],
            blocked: false,
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
        selectedColor = '#ff7a00';
        document.getElementById('c-color').value = '#ff7a00';
        const picker = document.getElementById('color-picker');
        picker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
        picker.querySelector('[data-color="#ff7a00"]').classList.add('selected');

        await loadClients();
        showToast('Client créé avec succès !', 'success');
    } catch (err) {
        console.error('Erreur création client :', err);
        showToast('Erreur lors de la création : ' + (err.message || 'inconnue'), 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    }
}

// ============================================================
// CHARGEMENT DE LA LISTE CLIENTS
// ============================================================
async function loadClients() {
    const list = document.getElementById('clients-list');
    const countBadge = document.getElementById('client-count');

    try {
        await authPromise;
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        allClients = snapshot.docs.map(d => d.data());
        allClients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        countBadge.textContent = allClients.length;

        populateModifySelect();

        if (allClients.length === 0) {
            list.innerHTML = '<p class="empty-state">Aucun client créé pour le moment.</p>';
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
                <div class="client-row-status ${client.blocked ? 'blocked' : 'active'}">
                    <i class="fa-solid ${client.blocked ? 'fa-lock' : 'fa-circle-check'}"></i>
                    ${client.blocked ? 'Bloqué' : 'Actif'}
                </div>
                <i class="fa-solid fa-chevron-right client-row-arrow"></i>
            `;

            row.addEventListener('click', () => openClientDetail(client.id));
            list.appendChild(row);
        });

    } catch (err) {
        console.error('Erreur chargement clients :', err);
        list.innerHTML = '<p class="empty-state" style="color:#e02424;">Erreur de chargement : ' + err.message + '</p>';
    }
}

// ============================================================
// MODAL DÉTAILS CLIENT
// ============================================================
function openClientDetail(clientId) {
    const client = allClients.find(c => c.id === clientId);
    if (!client) return;

    currentDetailClient = client;

    // Avatar
    const initials = getInitials(client.firstName, client.lastName);
    document.getElementById('cd-avatar').textContent = initials;

    // Nom complet
    const fullName = `${client.lastName} ${client.firstName}`.toUpperCase();
    document.getElementById('cd-name').textContent = fullName;

    // Meta (email)
    document.getElementById('cd-meta').textContent = client.email || '--';

    // Statut
    const statusEl = document.getElementById('cd-status');
    if (client.blocked) {
        statusEl.textContent = 'Bloqué';
        statusEl.className = 'client-detail-status blocked';
    } else {
        statusEl.textContent = 'Actif';
        statusEl.className = 'client-detail-status active';
    }

    // Identité
    document.getElementById('cd-fullname').textContent = fullName;
    document.getElementById('cd-country').textContent = (client.country || '--') + ' ' + (client.countryFlag || '');
    document.getElementById('cd-address').textContent = client.address || '—';

    // Contact
    document.getElementById('cd-email').textContent = client.email || '--';
    document.getElementById('cd-phone').textContent = client.phone || '—';

    // Compte
    document.getElementById('cd-balance').textContent = Number(client.balance || 0).toFixed(2).replace('.', ',') + ' ' + (client.currency || 'zł');
    document.getElementById('cd-currency').textContent = client.currency || 'zł';
    document.getElementById('cd-language').textContent = client.language || 'fr';
    document.getElementById('cd-percent').textContent = (client.percentValue || 100) + '%';

    // Sécurité
    document.getElementById('cd-pin').textContent = client.pin || '----';
    document.getElementById('cd-activation').textContent = client.activationCode || '----';

    // Lien
    document.getElementById('cd-link').value = getClientLink(client.id);

    // Ouvrir le modal
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
// COPIER UN CHAMP
// ============================================================
window.copyField = function (elementId, isInput = false) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const value = isInput ? el.value : el.textContent;

    const doCopy = () => {
        // Feedback visuel sur le bouton
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
        showToast('Copié dans le presse-papiers !', 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(value).then(doCopy).catch(() => {
            prompt('Copiez manuellement :', value);
        });
    } else {
        prompt('Copiez manuellement :', value);
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
    const fields = document.getElementById('modify-fields');

    if (!clientId) {
        fields.classList.add('hidden');
        selectedClientId = null;
        return;
    }

    const client = allClients.find(c => c.id === clientId);
    if (!client) return;

    selectedClientId = clientId;
    fields.classList.remove('hidden');

    document.getElementById('m-lastname').value = client.lastName || '';
    document.getElementById('m-firstname').value = client.firstName || '';
    document.getElementById('m-country').value = client.country || '';
    document.getElementById('m-address').value = client.address || '';
    document.getElementById('m-email').value = client.email || '';
    document.getElementById('m-phone').value = client.phone || '';
    document.getElementById('m-language').value = client.language || 'fr';
    document.getElementById('m-balance').value = client.balance || 0;
    document.getElementById('m-currency').value = client.currency || 'zł';
    document.getElementById('m-pin').value = client.pin || '';
    document.getElementById('m-activation').value = client.activationCode || '';
    document.getElementById('m-percent-value').value = client.percentValue || 100;
    document.getElementById('m-message').value = client.messageAfterTransfer || '';

    selectedModifyColor = client.color || '#ff7a00';
    document.getElementById('m-color').value = selectedModifyColor;
    const picker = document.getElementById('m-color-picker');
    picker.querySelectorAll('.color-option').forEach(o => {
        o.classList.toggle('selected', o.dataset.color === selectedModifyColor);
    });

    document.getElementById('m-tx-currency-display').textContent = client.currency || 'zł';

    populateBankSelect(client.country);
    updateAccessStatus(client.blocked);

    pendingTransactions = (client.transactions || []).slice();
    renderModifyTransactions();
}

function updateAccessStatus(blocked) {
    const info = document.getElementById('access-status-info');
    if (blocked) {
        info.innerHTML = 'Statut actuel : <strong style="color:#e02424;">Bloqué</strong>';
    } else {
        info.innerHTML = 'Statut actuel : <strong style="color:#03543f;">Actif</strong>';
    }
}

// ============================================================
// HISTORIQUE DES VIREMENTS (section Modifier)
// ============================================================
function renderModifyTransactions() {
    const list = document.getElementById('m-tx-list');
    if (!pendingTransactions || pendingTransactions.length === 0) {
        list.innerHTML = '<p class="empty-state">Aucun virement pour le moment.</p>';
        return;
    }

    list.innerHTML = '';
    pendingTransactions.forEach((tx, idx) => {
        const isDebit = tx.amount < 0;
        const item = document.createElement('div');
        item.className = 'm-tx-item ' + (isDebit ? 'debit' : 'credit');

        const logoHtml = tx.bankLogo
            ? `<div class="m-tx-logo-box">
                   <img src="${tx.bankLogo}"
                        alt="${tx.bankName || ''}"
                        onerror="this.parentNode.classList.add('fallback'); this.parentNode.innerHTML='<i class=\\'fa-solid fa-building-columns\\'></i>';">
               </div>`
            : '';

        item.innerHTML = `
            ${logoHtml}
            <div class="m-tx-item-info">
                <div class="m-tx-item-title">${tx.title || 'Virement'}</div>
                <div class="m-tx-item-date">${tx.date || ''}${tx.bankName ? ' • ' + tx.bankName : ''}</div>
            </div>
            <div class="m-tx-item-amount ${isDebit ? 'debit' : 'credit'}">
                ${isDebit ? '' : '+'}${Number(tx.amount).toFixed(2)}
            </div>
            <button class="m-tx-item-delete" title="Supprimer" data-idx="${idx}">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;
        list.appendChild(item);
    });

    list.querySelectorAll('.m-tx-item-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx, 10);
            if (confirm('Supprimer ce virement ?')) {
                const removed = pendingTransactions.splice(idx, 1)[0];
                const balanceInput = document.getElementById('m-balance');
                const currentBalance = parseFloat(balanceInput.value) || 0;
                balanceInput.value = (currentBalance - removed.amount).toFixed(2);
                renderModifyTransactions();
                showToast('Virement retiré. N\'oubliez pas d\'enregistrer.', 'info');
            }
        });
    });
}

// ============================================================
// AJOUTER UN VIREMENT (Banque obligatoire)
// ============================================================
function handleAddTransaction() {
    if (!selectedClientId) return showToast('Aucun client sélectionné.', 'error');

    const amount = parseFloat(document.getElementById('m-tx-amount').value);
    const type = document.getElementById('m-tx-type').value;
    const dateInput = document.getElementById('m-tx-date').value.trim();
    const bankSelect = document.getElementById('m-tx-bank');
    const bankDomain = bankSelect.value;
    const selectedOption = bankSelect.options[bankSelect.selectedIndex];
    const bankName = selectedOption?.dataset.bankName || '';

    if (!amount || amount <= 0) return showToast('Montant invalide.', 'error');
    if (!bankDomain || !bankName) {
        return showToast('Veuillez sélectionner une banque (obligatoire).', 'error');
    }

    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    const finalAmount = type === 'credit' ? amount : -amount;
    const dateStr = dateInput || formatDate();

    const tx = {
        type: type,
        title: bankName,
        date: dateStr,
        amount: finalAmount,
        bankName: bankName,
        bankDomain: bankDomain,
        bankLogo: getBankLogoUrl(bankDomain)
    };

    pendingTransactions.unshift(tx);
    renderModifyTransactions();

    const balanceInput = document.getElementById('m-balance');
    const currentBalance = parseFloat(balanceInput.value) || 0;
    balanceInput.value = (currentBalance + finalAmount).toFixed(2);

    document.getElementById('m-tx-amount').value = '';
    document.getElementById('m-tx-date').value = '';
    document.getElementById('m-tx-type').value = 'credit';
    document.getElementById('m-tx-bank').value = '';

    showToast('Virement ajouté. Cliquez sur "Enregistrer" pour valider.', 'success');
}

// ============================================================
// BLOQUER / DÉBLOQUER
// ============================================================
async function handleBlockAccess() {
    if (!selectedClientId) return showToast('Aucun client sélectionné.', 'error');
    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    if (client.blocked) return showToast('Ce client est déjà bloqué.', 'info');

    if (!confirm(`Bloquer l'accès de ${client.firstName} ${client.lastName} ?`)) return;

    try {
        await authPromise;
        await updateDoc(doc(db, COLLECTION_NAME, selectedClientId), { blocked: true });
        client.blocked = true;
        updateAccessStatus(true);
        await loadClients();
        showToast('Accès bloqué avec succès.', 'success');
    } catch (err) {
        console.error(err);
        showToast('Erreur lors du blocage.', 'error');
    }
}

async function handleUnblockAccess() {
    if (!selectedClientId) return showToast('Aucun client sélectionné.', 'error');
    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    if (!client.blocked) return showToast("Ce client n'est pas bloqué.", 'info');

    try {
        await authPromise;
        await updateDoc(doc(db, COLLECTION_NAME, selectedClientId), { blocked: false });
        client.blocked = false;
        updateAccessStatus(false);
        await loadClients();
        showToast('Accès débloqué avec succès.', 'success');
    } catch (err) {
        console.error(err);
        showToast('Erreur lors du déblocage.', 'error');
    }
}

// ============================================================
// SAUVEGARDER LES MODIFICATIONS
// ============================================================
async function handleSaveChanges() {
    if (!selectedClientId) return showToast('Aucun client sélectionné.', 'error');

    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    const lastName = document.getElementById('m-lastname').value.trim();
    const firstName = document.getElementById('m-firstname').value.trim();
    const country = document.getElementById('m-country').value;
    const countryFlag = document.querySelector('#m-country option:checked')?.dataset.flag || client.countryFlag || '';
    const address = document.getElementById('m-address').value.trim();
    const email = document.getElementById('m-email').value.trim().toLowerCase();
    const phone = document.getElementById('m-phone').value.trim();
    const language = document.getElementById('m-language').value;
    const balance = parseFloat(document.getElementById('m-balance').value) || 0;
    const currency = document.getElementById('m-currency').value;
    const pin = document.getElementById('m-pin').value.trim();
    const activationCode = document.getElementById('m-activation').value.trim();
    const percentValue = parseInt(document.getElementById('m-percent-value').value, 10);
    const messageAfterTransfer = document.getElementById('m-message').value.trim();
    const color = document.getElementById('m-color').value;

    if (!lastName || !firstName) return showToast('Nom et prénom obligatoires.', 'error');
    if (!country) return showToast('Pays obligatoire.', 'error');
    if (!email.includes('@') || !email.includes('.')) return showToast('Adresse e-mail invalide.', 'error');
    if (!/^\d{4,8}$/.test(pin)) return showToast('Le code PIN doit contenir 4 à 8 chiffres.', 'error');
    if (activationCode.length < 4) return showToast("Le code d'activation doit contenir au moins 4 caractères.", 'error');
    if (isNaN(percentValue) || percentValue < 0 || percentValue > 100) {
        return showToast('Le pourcentage doit être entre 0 et 100.', 'error');
    }
    if (!messageAfterTransfer) return showToast('Le message après virement est obligatoire.', 'error');
    if (!color) return showToast('Veuillez choisir une couleur.', 'error');

    const emailCheck = query(collection(db, COLLECTION_NAME), where('email', '==', email));
    const existing = await getDocs(emailCheck);
    const emailTaken = existing.docs.some(d => d.id !== selectedClientId);
    if (emailTaken) return showToast('Cet e-mail est utilisé par un autre client.', 'error');

    const btn = document.getElementById('btn-save-changes');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enregistrement...';

    try {
        await authPromise;

        const updatedData = {
            lastName, firstName, country, countryFlag,
            address, email, phone, language,
            balance, currency, pin, activationCode,
            percentValue, messageAfterTransfer, color,
            transactions: pendingTransactions,
            updatedAt: new Date().toISOString()
        };

        await updateDoc(doc(db, COLLECTION_NAME, selectedClientId), updatedData);

        const idx = allClients.findIndex(c => c.id === selectedClientId);
        if (idx !== -1) {
            allClients[idx] = { ...allClients[idx], ...updatedData };
        }

        await loadClients();
        showToast('Modifications enregistrées avec succès !', 'success');
    } catch (err) {
        console.error('Erreur sauvegarde :', err);
        showToast('Erreur lors de l\'enregistrement.', 'error');
    } finally {
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
        await authPromise;
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        if (selectedClientId === id) {
            selectedClientId = null;
            document.getElementById('modify-fields').classList.add('hidden');
            document.getElementById('m-select-client').value = '';
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
    if (!confirm('Supprimer TOUS les clients ? Cette action est irréversible.')) return;

    try {
        await authPromise;
        for (const client of allClients) {
            await deleteDoc(doc(db, COLLECTION_NAME, client.id));
        }
        await loadClients();
        showToast('Tous les clients ont été supprimés.', 'info');
    } catch (err) {
        console.error('Erreur suppression totale :', err);
        showToast('Erreur lors de la suppression totale.', 'error');
    }
}

// ============================================================
// MODAL LIEN (après création)
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
        navigator.clipboard.writeText(value).then(doCopy).catch(() => {
            prompt('Copiez ce lien :', value);
        });
    } else {
        prompt('Copiez ce lien :', value);
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

// ============================================================
// INITIALISATION
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Création
    document.getElementById('create-client-form').addEventListener('submit', handleCreateClient);

    // Modal lien
    document.getElementById('link-modal').addEventListener('click', (e) => {
        if (e.target.id === 'link-modal') closeModal();
    });

    // Modal détails client — fermer en cliquant sur l'overlay
    document.getElementById('client-detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'client-detail-modal') closeClientDetail();
    });

    // Modification
    document.getElementById('m-select-client').addEventListener('change', handleModifyClientChange);
    document.getElementById('btn-block-access').addEventListener('click', handleBlockAccess);
    document.getElementById('btn-unblock-access').addEventListener('click', handleUnblockAccess);
    document.getElementById('btn-add-transaction').addEventListener('click', handleAddTransaction);
    document.getElementById('btn-save-changes').addEventListener('click', handleSaveChanges);

    initColorPicker();
    initModifyColorPicker();
    await loadClients();
});

// ============================================================
// FERMER LES MODALS AVEC LA TOUCHE ÉCHAP
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeClientDetail();
    }
});
