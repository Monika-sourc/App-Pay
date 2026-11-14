// ============================================================
// APP PAY - Gestionnaire des balises de notification (Banners)
// ============================================================

let bannerQueue = [];
let currentBannerObj = null;
let globalT = null;
let globalFormatMoney = null;
let globalClient = null;

// Initialisation des fonctions de traduction et de formatage (appelé depuis script.js)
export function initBanners(tFunc, formatMoneyFunc) {
    globalT = tFunc;
    globalFormatMoney = formatMoneyFunc;
}

// Analyse les transactions pour détecter les changements et générer les balises
export function processTransactionChanges(allTxs, client) {
    if (!globalT || !globalFormatMoney || !client || !client.id) return;
    globalClient = client;
    
    const storageKey = 'apppay_seen_txs_' + client.id;
    const isFirstLogin = localStorage.getItem(storageKey) === null;
    let seenTxs = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    const newBanners = [];
    
    if (isFirstLogin) {
        // Première connexion sur cet appareil : on cherche le solde initial
        const initialTx = [...allTxs].reverse().find(tx => tx.amount > 0 && tx.txId);
        if (initialTx) {
            newBanners.push({ type: 'received', tx: initialTx });
        }
        // On marque TOUTES les transactions existantes comme vues
        allTxs.forEach(tx => {
            if (tx.txId) {
                const txState = `${tx.status || 'completed'}_${tx.amount > 0 ? 'credit' : 'debit'}`;
                seenTxs[tx.txId] = txState;
            }
        });
    } else {
        // Traitement normal
        for (const tx of allTxs) {
            if (!tx.txId) continue;
            
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
            }
            seenTxs[tx.txId] = txState;
        }
    }
    
    localStorage.setItem(storageKey, JSON.stringify(seenTxs));
    
    if (newBanners.length > 0) {
        newBanners.reverse(); 
        newBanners.forEach(b => bannerQueue.push(b));
        processQueue();
    }
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
        bannerQueue.unshift({ type, tx }); 
        return;
    }
    
    container.innerHTML = '';
    
    const banner = document.createElement('div');
    banner.className = `transfer-banner ${type}`;
    
    // 🆕 On récupère la devise de la transaction. 
    // Si elle n'existe pas (anciennes transactions), on prend celle du compte actuel.
    const txCurrency = tx.currency || globalClient?.currency || 'zł';
    
    // 🆕 On passe la devise spécifique à la fonction de formatage
    const amountStr = globalFormatMoney(Math.abs(tx.amount), txCurrency);
    const bank = tx.bankName || '—';
    const name = tx.title || tx.beneficiary || '—';
    const clientName = globalClient?.firstName || 'Client';
    
    let message = '';
    const tKey = `banner_${type}`;
    
    if (type === 'received') {
        message = globalT(tKey, { name: clientName, amount: amountStr, bank: bank });
    } else {
        message = globalT(tKey, { amount: amountStr, name: name, bank: bank });
    }
    
    banner.innerHTML = `
        <div class="banner-text">${message}</div>
        <button class="banner-close"><i class="fa-solid fa-xmark"></i></button>
    `;
    
    container.appendChild(banner);
    
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
    
    const timer = setTimeout(finish, 5000); 
    banner.querySelector('.banner-close').addEventListener('click', finish);
    
    currentBannerObj = { banner, timer, finish };
}
