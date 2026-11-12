import { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from './firebase-config.js';

const CLOUD_URL = "https://orange-disk-17b1.avogofidelia604.workers.dev";
const urlId = new URLSearchParams(window.location.search).get('id');

// Message de base
const BASE_GREETING = "Bonjour ! Je suis votre assistante. Prête à vous aider ?";

// Dictionnaire de salutations pour les langues les plus courantes
const LOCAL_GREETINGS = {
    'fr': BASE_GREETING,
    'en': "Hello! I am your assistant. Ready to help?",
    'pl': "Witam! Jestem Twoim asystentem. Gotowy do pomocy?",
    'es': "¡Hola! Soy tu asistente. ¿Listo para ayudarte?",
    'de': "Hallo! Ich bin dein Assistent. Bereit zu helfen?",
    'it': "Ciao! Sono il tuo assistente. Pronto ad aiutarti?",
    'pt': "Olá! Sou o seu assistente. Pronto para ajudar?",
    'ar': "مرحبا! أنا مساعدك. جاهز لمساعدتك؟",
    'zh': "你好！我是您的助手。随时准备为您服务！",
    'ru': "Привет! Я ваш помощник. Готов помочь!",
    'tr': "Merhaba! Ben senin asistanınım. Yardıma hazırım?",
    'nl': "Hallo! Ik ben je assistent. Klaar om te helpen?",
    'sv': "Hej! Jag är din assistent. Redo att hjälpa till?",
    'ha': "Sannu! Ni ne mataimakin ku. A shirye nake in taimaka?",
    'yo': "Bawo! Emi ni oluranlowo re. Setan lati ran o lowo?"
};

let currentGreetingText = BASE_GREETING;

// Détecter la langue du téléphone (ex: "pl-PL" devient "pl")
const browserLang = (navigator.language || 'fr').split('-')[0].toLowerCase();

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ai-chat-input');
    const btn = document.getElementById('ai-chat-send');
    const body = document.getElementById('ai-chat-body');
    
    if (!input || !btn || !body || !urlId) return;

    // Initialiser le message de bienvenue
    currentGreetingText = LOCAL_GREETINGS[browserLang] || BASE_GREETING;

    // 1. Logique de l'historique du chat
    let isFirstLoad = true;
    const messagesRef = collection(db, 'ai_conversations', urlId, 'messages');

    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    onSnapshot(q, (snapshot) => {
        body.innerHTML = ''; 

        if (snapshot.empty && isFirstLoad) {
            body.innerHTML = `<div class="ai-message assistant"><div class="ai-message-bubble">${currentGreetingText}</div></div>`;
            return;
        }

        snapshot.forEach((doc) => {
            const msg = doc.data();
            if (msg.content) afficherMessage(msg.role, msg.content);
        });
        isFirstLoad = false;
    });

    // 2. Envoi de message
    const send = async () => {
        const txt = input.value.trim();
        if (!txt) return;
        input.value = '';
        input.disabled = btn.disabled = true;

        showTyping();

        try {
            await addDoc(messagesRef, { role: 'user', content: txt, timestamp: serverTimestamp() });

            const res = await fetch(CLOUD_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message: txt })
            });
            
            const data = await res.json();
            removeTyping();

            if (data.reply) {
                await addDoc(messagesRef, { role: 'assistant', content: data.reply, timestamp: serverTimestamp() });
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

    // 3. Affichage de la bulle sur la page d'accueil
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
