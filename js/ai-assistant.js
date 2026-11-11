const CLOUD_URL = "https://orange-disk-17b1.avogofidelia604.workers.dev";
const urlId = new URLSearchParams(window.location.search).get('id');
let db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc;
let isFirstLoad = true;

import('./firebase-config.js').then(fb => {
    db = fb.db; collection = fb.collection; addDoc = fb.addDoc;
    query = fb.query; orderBy = fb.orderBy; onSnapshot = fb.onSnapshot;
    serverTimestamp = fb.serverTimestamp; doc = fb.doc; getDoc = fb.getDoc;
    initFirebase();
}).catch(err => {
    console.warn("Firebase non chargé, l'IA marchera sans historique.", err);
    initChat();
});

function initFirebase() {
    if (!urlId) return initChat();
    try {
        const q = query(collection(db, 'ai_conversations', urlId, 'messages'), orderBy('timestamp', 'asc'));
        onSnapshot(q, (snap) => {
            const body = document.getElementById('ai-chat-body');
            if (!body) return;
            if (snap.empty && isFirstLoad) {
                addMsg('assistant', "Bonjour ! Je suis l'assistant virtuel d'APP PAY. Comment puis-je vous aider aujourd'hui ?");
                return;
            }
            body.innerHTML = '';
            snap.forEach(d => {
                const m = d.data();
                if (m.content) addMsg(m.role, m.content);
            });
            isFirstLoad = false;
        });
    } catch(e) {
        console.error("Firebase error:", e);
        initChat();
    }
}

function initChat() {
    const body = document.getElementById('ai-chat-body');
    if (body && isFirstLoad) {
        body.innerHTML = '';
        addMsg('assistant', "Bonjour ! Je suis l'assistant virtuel d'APP PAY. Comment puis-je vous aider aujourd'hui ?");
        isFirstLoad = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ai-chat-input');
    const btn = document.getElementById('ai-chat-send');
    if (!input || !btn) return;

    const send = async () => {
        const txt = input.value.trim();
        if (!txt) return;
        input.value = '';
        input.disabled = btn.disabled = true;
        
        const body = document.getElementById('ai-chat-body');
        if (body) body.innerHTML = ''; // Efface le texte d'attente

        addMsg('user', txt);

        let ref = null;
        if (urlId && typeof collection !== 'undefined') {
            try { ref = collection(db, 'ai_conversations', urlId, 'messages'); await addDoc(ref, { role: 'user', content: txt, timestamp: serverTimestamp() }); } catch(e){}
        }

        showTyping();

        try {
            let fn = "Client";
            if (urlId && typeof doc !== 'undefined') {
                try { const cDoc = await getDoc(doc(db, 'clients', urlId)); if(cDoc.exists()) fn = cDoc.data().firstName || "Client"; } catch(e){}
            }

            const res = await fetch(CLOUD_URL, {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message: txt, clientContext: { firstName: fn } })
            });
            const data = await res.json();
            removeTyping();

            if (data.reply) {
                addMsg('assistant', data.reply);
                if (ref) { try { await addDoc(ref, { role: 'assistant', content: data.reply, timestamp: serverTimestamp() }); } catch(e){} }
            } else throw new Error("No reply");

        } catch (e) {
            removeTyping();
            addMsg('assistant', "Je suis désolé, une petite difficulté technique m'empêche de répondre. Veuillez contacter le service client.");
        } finally {
            input.disabled = btn.disabled = false;
            input.focus();
        }
    };

    btn.onclick = send;
    input.onkeypress = (e) => { if(e.key === 'Enter') { e.preventDefault(); send(); } };
});

function addMsg(role, text) {
    const body = document.getElementById('ai-chat-body');
    if (!body) return;
    const d = document.createElement('div');
    d.className = `ai-message ${role}`;
    d.innerHTML = `<div class="ai-message-bubble">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>`;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
}

function showTyping() {
    const body = document.getElementById('ai-chat-body');
    if (!body) return;
    const d = document.createElement('div');
    d.id = 'typing'; d.className = 'ai-message assistant';
    d.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById('typing');
    if (t) t.remove();
}
