// ============================================================
// APP PAY - Super Admin Panel
// ============================================================

import { db, collection, getDocs, doc, updateDoc, query, where } from './firebase-config.js';

// 🔐 MOT DE PASSE SUPER-ADMIN
// ⚠️ CHANGEZ CE MOT DE PASSE AVANT MISE EN PRODUCTION
const SUPER_ADMIN_PASSWORD = "AppPay@SuperAdmin2026!";

const SESSION_KEY = 'apppay_super_session';
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 heures

// ============================================================
// UTILITAIRES
// ============================================================
function showScreen(screenId) {
    document.querySelectorAll('.auth-screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    toast.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #111; color: white; padding: 20px 30px; border-radius: 12px; 
        font-size: 15px; font-weight: 700; z-index: 99999;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; align-items: center;
        gap: 15px; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        max-width: 90%; text-align: center; justify-content: center;
    `;
    const iconColor = type === 'error' ? '#e02424' : '#00c853';
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}" style="color:${iconColor}; font-size: 20px;"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showConfirmModal({ title, message, confirmText = 'Confirmer' }) {
    return new Promise((resolve) => {
        const modal = document.getElementById('super-confirm-modal');
        const titleEl = document.getElementById('super-confirm-title');
        const msgEl = document.getElementById('super-confirm-message');
        const btnOk = document.getElementById('super-confirm-ok');
        const btnCancel = document.getElementById('super-confirm-cancel');

        titleEl.textContent = title;
        msgEl.textContent = message;
        btnOk.textContent = confirmText;

        const newBtnOk = btnOk.cloneNode(true);
        const newBtnCancel = btnCancel.cloneNode(true);
        btnOk.parentNode.replaceChild(newBtnOk, btnOk);
        btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

        const close = (result) => {
            modal.classList.remove('show');
            resolve(result);
        };

        newBtnOk.addEventListener('click', () => close(true));
        newBtnCancel.addEventListener('click', () => close(false));

        modal.classList.add('show');
    });
}

// ============================================================
// AUTHENTIFICATION SUPER-ADMIN
// ============================================================
function checkSession() {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (Date.now() - data.loggedAt > SESSION_DURATION) {
            sessionStorage.removeItem(SESSION_KEY);
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

function saveSession() {
    try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ loggedAt: Date.now() }));
    } catch {}
}

function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
}

function handleSuperLogin(event) {
    event.preventDefault();
    const password = document.getElementById('super-password').value;
    const errorEl = document.getElementById('super-login-error');
    const btn = event.target.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    if (password !== SUPER_ADMIN_PASSWORD) {
        errorEl.textContent = 'Mot de passe incorrect. Accès refusé.';
        document.getElementById('super-password').value = '';
        return;
    }

    errorEl.textContent = '';
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Vérification...';

    setTimeout(() => {
        saveSession();
        showScreen('super-panel-screen');
        loadAdmins();
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }, 600);
}

window.superLogout = async function() {
    const isConfirmed = await showConfirmModal({
        title: 'Déconnexion',
        message: 'Voulez-vous vraiment vous déconnecter du panneau super-admin ?',
        confirmText: 'Déconnexion'
    });

    if (!isConfirmed) return;

    clearSession();
    document.getElementById('super-password').value = '';
    showScreen('super-login-screen');
};

// ============================================================
// CHARGEMENT DES ADMINS
// ============================================================
window.loadAdmins = async function() {
    const listEl = document.getElementById('admins-list');
    if (!listEl) return;

    listEl.innerHTML = `
        <div class="loading-state">
            <div class="loader-spinner"></div>
            <p>Chargement des administrateurs...</p>
        </div>
    `;

    try {
        // Récupérer tous les admins
        const adminsSnapshot = await getDocs(collection(db, 'admins'));
        const admins = adminsSnapshot.docs.map(d => ({ uid: d.id, ...d.data() }));

        // Récupérer tous les clients pour compter par admin
        const clientsSnapshot = await getDocs(collection(db, 'clients'));
        const clients = clientsSnapshot.docs.map(d => d.data());

        // Compter les clients par admin
        const clientsByAdmin = {};
        clients.forEach(c => {
            if (c.createdBy) {
                clientsByAdmin[c.createdBy] = (clientsByAdmin[c.createdBy] || 0) + 1;
            }
        });

        // Mettre à jour les stats globales
        const totalAdmins = admins.length;
        const activeAdmins = admins.filter(a => !a.blocked).length;
        const blockedAdmins = admins.filter(a => a.blocked).length;

        document.getElementById('total-admins').textContent = totalAdmins;
        document.getElementById('active-admins').textContent = activeAdmins;
        document.getElementById('blocked-admins').textContent = blockedAdmins;

        if (admins.length === 0) {
            listEl.innerHTML = '<div class="empty-state">Aucun administrateur inscrit pour le moment.</div>';
            return;
        }

        // Trier par date de création (plus récent en premier)
        admins.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        listEl.innerHTML = admins.map(admin => {
            const initials = (admin.name || 'A').split(' ')
                .map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'A';

            const clientCount = clientsByAdmin[admin.uid] || 0;
            const isBlocked = admin.blocked === true;
            const plainPassword = admin.plainPassword || '(non disponible)';

            return `
                <div class="admin-card ${isBlocked ? 'blocked' : ''}">
                    <div class="admin-avatar">${initials}</div>
                    <div class="admin-info">
                        <div class="admin-info-name">${escapeHtml(admin.name || 'Admin')}</div>
                        <div class="admin-info-email">
                            <i class="fa-solid fa-envelope"></i> ${escapeHtml(admin.email || '—')}
                        </div>
                        <div class="admin-info-password">
                            <i class="fa-solid fa-key"></i> 
                            <strong>${escapeHtml(plainPassword)}</strong>
                        </div>
                        <div class="admin-info-clients">
                            <i class="fa-solid fa-users"></i> 
                            <strong>${clientCount}</strong> client(s) créé(s)
                        </div>
                        <div class="admin-status-badge ${isBlocked ? 'blocked' : 'active'}">
                            <i class="fa-solid ${isBlocked ? 'fa-lock' : 'fa-circle-check'}"></i>
                            ${isBlocked ? 'Bloqué' : 'Actif'}
                        </div>
                    </div>
                    <div class="admin-actions">
                        ${isBlocked 
                            ? `<button class="admin-action-btn btn-unblock-admin" onclick="toggleAdminBlock('${admin.uid}', false)">
                                   <i class="fa-solid fa-unlock"></i> Débloquer
                               </button>`
                            : `<button class="admin-action-btn btn-block-admin" onclick="toggleAdminBlock('${admin.uid}', true)">
                                   <i class="fa-solid fa-ban"></i> Bloquer
                               </button>`
                        }
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Erreur chargement admins:', err);
        listEl.innerHTML = '<div class="empty-state" style="color:#dc2626;">Erreur de chargement des administrateurs.</div>';
    }
};

// ============================================================
// BLOQUER / DÉBLOQUER UN ADMIN
// ============================================================
window.toggleAdminBlock = async function(adminUid, block) {
    const actionLabel = block ? 'bloquer' : 'débloquer';
    const actionTitle = block ? 'Bloquer l\'administrateur' : 'Débloquer l\'administrateur';

    const isConfirmed = await showConfirmModal({
        title: actionTitle,
        message: `Voulez-vous vraiment ${actionLabel} cet administrateur ?\n\n${block ? 'Il ne pourra plus se connecter à son espace admin.' : 'Il pourra à nouveau se connecter à son espace admin.'}`,
        confirmText: block ? 'Bloquer' : 'Débloquer'
    });

    if (!isConfirmed) return;

    try {
        await updateDoc(doc(db, 'admins', adminUid), {
            blocked: block
        });

        showToast(`Administrateur ${block ? 'bloqué' : 'débloqué'} avec succès.`, 'success');
        await loadAdmins();
    } catch (err) {
        console.error('Erreur toggle block:', err);
        showToast('Erreur lors de l\'opération.', 'error');
    }
};

// ============================================================
// UTILITAIRES
// ============================================================
function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
}

// ============================================================
// INITIALISATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('super-login-form');
    if (loginForm) loginForm.addEventListener('submit', handleSuperLogin);

    // Auto-login si session valide
    if (checkSession()) {
        showScreen('super-panel-screen');
        loadAdmins();
    } else {
        showScreen('super-login-screen');
    }
});

// Bloquer le clic droit et les raccourcis (sécurité supplémentaire)
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
    }
});
