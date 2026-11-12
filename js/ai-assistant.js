import { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from './firebase-config.js';

const CLOUD_URL = "https://orange-disk-17b1.avogofidelia604.workers.dev";
const urlId = new URLSearchParams(window.location.search).get('id');

// Dictionnaire de salutations
const GREETINGS = {
    'fr': "Bonjour ! Je suis votre assistante. Prête à vous aider ?",
    'en': "Hello! I am your assistant. Ready to help?",
    'pl': "Witam! Jestem Twoim asystentem. Gotowy do pomocy?",
    'es': "¡Hola! Soy tu asistente. ¿Listo para ayudarte?",
    'de': "Hallo! Ich bin dein Assistent. Bereit zu helfen?",
    'it': "Ciao! Sono il tuo assistente. Pronto ad aiutarti?",
    'pt': "Olá! Sou o seu assistente. Pronto para ajudar?",
    'ar': "مرحبا! أنا مساعدك. جاهز لمساعدتك؟",
    'zh': "你好！我是您的助手。随时准备为您服务！",
    'ru': "Привет! Я ваш помощник. Готов помочь!",
    'tr': "Merhaba! Ben senin asistanınım. Yardıma hazırım?"
};

// Détecter la langue du téléphone
const browserLang = (navigator.language || 'fr').split('-')[0].toLowerCase();
const currentGreetingText = GREETINGS[browserLang] || GREETINGS['fr'];

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ai-chat-input');
    const btn = document.getElementById('ai-chat-send');
    const body = document.getElementById('ai-chat-body');
    
    if (!input || !btn || !body || !urlId) return;

    // 1. On vide le texte d'attente pour afficher le chat immédiatement
    body.innerHTML = `<div class="ai-message assistant"><div class="ai-message-bubble">${currentGreetingText}</div></div>`;

    // 2. Connexion à Firebase pour l'historique en temps réel
    let isFirstLoad = true;
    const messagesRef = collection(db, 'ai_conversations', urlId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    // On écoute les changements (si un message est ajouté depuis un autre appareil, il apparaîtra ici)
    onSnapshot(q, (snapshot) => {
        if (snapshot.empty && isFirstLoad) {
            isFirstLoad = false;
            return; // On garde le message de bienvenue
        }

        body.innerHTML = ''; // On nettoie pour réafficher l'historique complet
        snapshot.forEach((doc) => {
            const msg = doc.data();
            if (msg.content) afficherMessage(msg.role, msg.content);
        });
        isFirstLoad = false;
    }, (error) => {
        console.error("Erreur de synchronisation Firebase :", error);
    });

    // 3. Envoi de message
    const send = async () => {
        const txt = input.value.trim();
        if (!txt) return;
        input.value = '';
        input.disabled = btn.disabled = true;

        // On affiche le message immédiatement (sans attendre la base de données)
        afficherMessage('user', txt);
        showTyping();

        try {
            // Sauvegarde du message du client dans Firebase
            await addDoc(messagesRef, { 
                role: 'user', 
                content: txt, 
                timestamp: serverTimestamp() 
            });

            // Appel à l'IA
            const res = await fetch(CLOUD_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message: txt })
            });
            
            const data = await res.json();
            removeTyping();

            if (data.reply) {
                // Sauvegarde de la réponse de l'IA dans Firebase
                await addDoc(messagesRef, { 
                    role: 'assistant', 
                    content: data.reply, 
                    timestamp: serverTimestamp() 
                });
            } else {
                throw new Error("Pas de réponse");
            }

        } catch (e) {
            removeTyping();
            afficherMessage('assistant', "⚠️ ERREUR : " + e.message);
        } finally {
            input.disabled = btn.disabled = false;
            input.focus();
        }
    };

    btn.onclick = send;
    input.onkeypress = (e) => { if(e.key === 'Enter') { e.preventDefault(); send(); } };

    // 4. Bulle de bienvenue sur le tableau de bord
    const observer = new MutationObserver(() => {
        if (document.getElementById('balance-display')) {
            afficherBulleBienvenue(currentGreetingText);
        }
    });

    const viewsContainer = document.getElementById('views-container');
    if (viewsContainer) observer.observe(viewsContainer, { childList: true, subtree: true });
});

function afficherBulleBienvenue(text) {
    const existing = document.querySelector('.ai-greeting-bubble');
    if (existing) existing.remove();

    const bubble = document.createElement('div');
    bubble.className = 'ai-greeting-bubble';
    bubble.textContent = text;
    document.body.appendChild(bubble);

    setTimeout(() => bubble.classList.add('show'), 100);
    setTimeout(() => {
        bubble.classList.remove('show');
        setTimeout(() => bubble.remove(), 400);
    }, 4000); 
}

function afficherMessage(role, text) {
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
