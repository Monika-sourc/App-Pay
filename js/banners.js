// ============================================================
// APP PAY - Gestionnaire des balises de notification (Banners)
// ============================================================

let bannerQueue = [];
let currentBannerObj = null;
let globalT = null;
let globalFormatMoney = null;
let globalClient = null;

// 🆕 Empêche les doublons : une transaction déjà en file n'est pas re-ajoutée
const queuedTxIds = new Set();

export function initBanners(tFunc, formatMoneyFunc) {
    globalT = tFunc;
    globalFormatMoney = formatMoneyFunc;
}

// 🆕 Clé localStorage versionnée
function getSeenTxsKey(clientId) {
    return 'apppay_seen_txs_v2_' + clientId;
}

function getSeenTxs(clientId) {
    try {
        const raw = localStorage.getItem(getSeenTxsKey(clientId));
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function saveSeenTxs(clientId, seenTxs) {
    try {
        localStorage.setItem(getSeenTxsKey(clientId), JSON.stringify(seenTxs));
    } catch {}
}

// 🆕 Marquer une transaction comme vue UNIQUEMENT au moment où la balise s'affiche
function markTxAsSeen(tx) {
    if (!globalClient || !tx.txId) return;
    const seenTxs = getSeenTxs(globalClient.id) || {};
    const txState = `${tx.status || 'completed'}_${tx.amount > 0 ? 'credit' : 'debit'}`;
    seenTxs[tx.txId] = txState;
    saveSeenTxs(globalClient.id, seenTxs);
}

export function processTransactionChanges(allTxs, client) {
    if (!globalT || !globalFormatMoney || !client || !client.id) return;
    globalClient = client;
    
    let seenTxs = getSeenTxs(client.id);
    const isFirstLogin = seenTxs === null;
    
    if (isFirstLogin) {
        // Première connexion sur cet appareil : marquer toutes les anciennes txs comme vues
        // SAUF la transaction initiale (le premier virement reçu)
        seenTxs = {};
        allTxs.forEach(tx => {
            if (tx.txId) {
                const txState = `${tx.status || 'completed'}_${tx.amount > 0 ? 'credit' : 'debit'}`;
                seenTxs[tx.txId] = txState;
            }
        });
        
        // Trouver la toute première transaction crédit (le solde initial)
        const creditTxs = allTxs.filter(tx => tx.amount > 0 && tx.txId);
        const initialCreditTx = creditTxs[creditTxs.length - 1];
        if (initialCreditTx) {
            delete seenTxs[initialCreditTx.txId];
        }
        
        saveSeenTxs(client.id, seenTxs);
    }
    
    const newBanners = [];
    
    for (const tx of allTxs) {
        if (!tx.txId) continue;
        if (queuedTxIds.has(tx.txId)) continue; // Déjà dans la file
        
        const txState = `${tx.status || 'completed'}_${tx.amount > 0 ? 'credit' : 'debit'}`;
        const seenState = seenTxs[tx.txId];
        
        if (seenState === txState) continue;
        
        let bannerType = null;
        
        if (tx.amount > 0 && !seenState) {
            bannerType = 'received';
        } else if (tx.amount < 0 && !seenState) {
            if (tx.status === 'completed') bannerType = 'sent_completed';
            else if (tx.status === 'pending') bannerType = 'sent_pending';
        } else if (seenState && seenState !== txState) {
            const oldStatus = seenState.split('_')[0];
            const newStatus = tx.status || 'completed';
            
            if (oldStatus === 'completed' && newStatus === 'cancelled') bannerType = 'cancelled_completed';
            else if (oldStatus === 'pending' && newStatus === 'cancelled') bannerType = 'cancelled_pending';
            else if (oldStatus === 'pending' && newStatus === 'completed') bannerType = 'validated_pending';
        }
        
        if (bannerType) {
            newBanners.push({ type: bannerType, tx });
            queuedTxIds.add(tx.txId);
        }
    }
    
    if (newBanners.length > 0) {
        newBanners.reverse();
        newBanners.forEach(b => bannerQueue.push(b));
    }
    
    processQueue();
}

export function processQueue() {
    if (bannerQueue.length === 0 || !globalT || !globalFormatMoney) return;
    
    const container = document.getElementById('banner-container');
    if (!container) return;
    
    if (currentBannerObj) {
        clearTimeout(currentBannerObj.timer);
        if (currentBannerObj.banner.parentNode) {
            currentBannerObj.banner.remove();
        }
        currentBannerObj = null;
    }
    
    const bannerData = bannerQueue.shift();
    displayBanner(bannerData.type, bannerData.tx, () => {
        processQueue();
    });
}

function displayBanner(type, tx, onComplete) {
    const container = document.getElementById('banner-container');
    if (!container) {
        // Pas de conteneur : on remet dans la file et on libère le verrou
        bannerQueue.unshift({ type, tx });
        if (tx.txId) queuedTxIds.delete(tx.txId);
        return;
    }
    
    container.innerHTML = '';
    
    const banner = document.createElement('div');
    banner.className = `transfer-banner ${type}`;
    
    const txCurrency = tx.currency || globalClient?.currency || 'zł';
    const amountStr = globalFormatMoney(Math.abs(tx.amount), txCurrency);
    const bank = tx.bankName || '—';
    const name = tx.title || tx.beneficiary || '—';
    const clientName = globalClient?.firstName || 'Client';
    
    let message = '';
    const tKey = `banner_${type}`;
    
    // 🆕 Ajout de la phrase d'aide uniquement pour les virements reçus
    if (type === 'received') {
        const mainMsg = globalT(tKey, { name: clientName, amount: amountStr, bank: bank });
        const hintMsg = globalT('banner_received_hint');
        if (hintMsg && hintMsg !== 'banner_received_hint') {
            message = `${mainMsg}<br><span style="font-size: 0.85em; opacity: 0.8; display: inline-block; margin-top: 4px;">${hintMsg}</span>`;
        } else {
            message = mainMsg;
        }
    } else {
        message = globalT(tKey, { amount: amountStr, name: name, bank: bank });
    }
    
    banner.innerHTML = `
        <div class="banner-text">${message}</div>
        <button class="banner-close"><i class="fa-solid fa-xmark"></i></button>
    `;
    
    container.appendChild(banner);
    
    // 🆕 Marquer comme vue SEULEMENT maintenant que la balise est dans le DOM
    markTxAsSeen(tx);
    if (tx.txId) queuedTxIds.delete(tx.txId);
    
    void banner.offsetWidth;
    banner.classList.add('show');
    
    const finish = () => {
        if (currentBannerObj && currentBannerObj.timer) clearTimeout(currentBannerObj.timer);
        banner.classList.remove('show');
        setTimeout(() => {
            if (banner.parentNode) banner.remove();
            currentBannerObj = null;
            if (onComplete) onComplete();
        }, 300);
    };
    
    // 🆕 60 secondes
    const timer = setTimeout(finish, 60000);
    banner.querySelector('.banner-close').addEventListener('click', finish);
    
    currentBannerObj = { banner, timer, finish };
}
