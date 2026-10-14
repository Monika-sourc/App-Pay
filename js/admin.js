// ============================================================
// VANTEX ADMIN - Gestion des clients
// ============================================================

const STORAGE_KEY = 'vantex_clients';
let lastGeneratedLink = '';

// ---------- UTILITAIRES ----------
function generateId() {
    return 'vx' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function encodeClientData(data) {
    try {
        const json = JSON.stringify(data);
        return btoa(unescape(encodeURIComponent(json)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
        console.error('Erreur encodage', e);
        return '';
    }
}

function getClients() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveClients(clients) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

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
        gap: 10px; animation: fadeIn 0.3s ease;
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

// ---------- CRÉATION D'UN CLIENT ----------
function handleCreateClient(event) {
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

    // Validations
    if (!lastName || !firstName) return showToast('Nom et prénom obligatoires.', 'error');
    if (!email.includes('@')) return showToast('Adresse e-mail invalide.', 'error');
    if (!/^\d{4,8}$/.test(pin)) return showToast('Le code PIN doit contenir 4 à 8 chiffres.', 'error');
    if (activationCode.length < 4) return showToast("Le code d'activation doit contenir au moins 4 caractères.", 'error');

    const clients = getClients();
    if (clients.some(c => c.email === email)) {
        return showToast('Un client avec cet e-mail existe déjà.', 'error');
    }

    const client = {
        id: generateId(),
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
        createdAt: new Date().toISOString(),
        transactions: []
    };

    clients.push(client);
    saveClients(clients);

    // Générer le lien unique
    const encoded = encodeClientData(client);
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
    const link = `${baseUrl}?c=${encoded}`;

    lastGeneratedLink = link;
    document.getElementById('generated-link').value = link;
    document.getElementById('link-modal').classList.add('show');

    // Réinitialiser le formulaire
    event.target.reset();
    document.getElementById('c-balance').value = '0.00';
    document.getElementById('c-currency').value = 'zł';
    document.getElementById('c-country').value = 'France';
    document.getElementById('c-language').value = 'Français';

    renderClients();
    showToast('Client créé avec succès !', 'success');
}

// ---------- AFFICHAGE DES CLIENTS ----------
function renderClients() {
    const clients = getClients();
    const list = document.getElementById('clients-list');
    const countBadge = document.getElementById('client-count');

    countBadge.textContent = clients.length;

    if (clients.length === 0) {
        list.innerHTML = '<p class="empty-state">Aucun client créé pour le moment.</p>';
        return;
    }

    list.innerHTML = '';
    clients.slice().reverse().forEach(client => {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.innerHTML = `
            <div class="client-info">
                <div class="client-name">
                    <span class="flag">${client.countryFlag || '🌍'}</span>
                    ${(client.lastName || '').toUpperCase()} ${client.firstName || ''}
                </div>
                <div class="client-email">${client.email}</div>
                <div class="client-meta">
                    <span><i class="fa-solid fa-coins"></i> ${client.balance.toFixed(2)} ${client.currency}</span>
                    <span><i class="fa-solid fa-key"></i> PIN: ••••</span>
                    <span><i class="fa-solid fa-shield-halved"></i> ACT: ••••</span>
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
}

// ---------- ACTIONS SUR UN CLIENT ----------
function getClientLink(client) {
    const encoded = encodeClientData(client);
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');
    return `${baseUrl}?c=${encoded}`;
}

function copyClientLink(id) {
    const client = getClients().find(c => c.id === id);
    if (!client) return;
    const link = getClientLink(client);
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
    const client = getClients().find(c => c.id === id);
    if (!client) return;
    const info = `
DÉTAILS DU CLIENT

Nom : ${client.lastName}
Prénom : ${client.firstName}
Pays : ${client.country}
Adresse : ${client.address || '—'}
Email : ${client.email}
Téléphone : ${client.phone || '—'}
Langue : ${client.language}

Solde : ${client.balance.toFixed(2)} ${client.currency}

Code PIN : ${client.pin}
Code d'activation : ${client.activationCode}

Créé le : ${new Date(client.createdAt).toLocaleString('fr-FR')}
    `.trim();
    alert(info);
}

function deleteClient(id) {
    const client = getClients().find(c => c.id === id);
    if (!client) return;
    if (!confirm(`Supprimer définitivement ${client.firstName} ${client.lastName} ?`)) return;
    const clients = getClients().filter(c => c.id !== id);
    saveClients(clients);
    renderClients();
    showToast('Client supprimé.', 'info');
}

function clearAllClients() {
    if (getClients().length === 0) return;
    if (!confirm('Supprimer TOUS les clients ? Cette action est irréversible.')) return;
    saveClients([]);
    renderClients();
    showToast('Tous les clients ont été supprimés.', 'info');
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

// ---------- INITIALISATION ----------
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('create-client-form').addEventListener('submit', handleCreateClient);
    document.getElementById('link-modal').addEventListener('click', (e) => {
        if (e.target.id === 'link-modal') closeModal();
    });
    renderClients();
});
