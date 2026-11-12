import { db, collection, doc, setDoc, onSnapshot, serverTimestamp, authPromise } from './firebase-config.js';

const CLOUD_URL = "https://orange-disk-17b1.avogofidelia604.workers.dev";
const urlId = new URLSearchParams(window.location.search).get('id');

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

const browserLang = (navigator.language || 'fr').split('-')[0].toLowerCase();
const currentGreetingText = GREETINGS[browserLang] || GREETINGS['fr'];

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ai-chat-input');
    const btn = document.getElementById('ai-chat-send');
    const body = document.getElementById('ai-chat-body');
    
    if (!input || !btn || !body || !urlId) return;

    // Message de bienvenue immédiat
    body.innerHTML = `<div class="ai-message assistant"><div class="ai-message-bubble">${currentGreetingText}</div></div>`;

    let messagesRef = null;
    
    // Chargement de l'historique
    authPromise.then(() => {
        messagesRef = collection(db, 'ai_conversations', urlId, 'messages');
        
        onSnapshot(messagesRef, (snapshot) => {
            if (snapshot.empty) return;
            
            body.innerHTML = ''; 
            let messages = [];
            
            snapshot.forEach(d => messages.push(d.data()));
            
            messages.sort((a, b) => {
                const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
                const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
                return timeA - timeB;
            });

            messages.forEach(msg => {
                if (msg.content) afficherMessage(msg.role, msg.content);
            });
        }, (error) => {
            console.error("Erreur de synchronisation Firebase :", error);
        });
    }).catch(e => console.error("Erreur auth :", e));

    // Envoi de message
    const send = async () => {
        const txt = input.value.trim();
        if (!txt) return;
        input.value = '';
        input.disabled = btn.disabled = true;

        afficherMessage('user', txt);
        
        // 🆕 Affichage des 3 petits points
        showTyping();

        try {
            if (messagesRef) {
                const newMsgRef = doc(messagesRef);
                await setDoc(newMsgRef, { 
                    role: 'user', 
                    content: txt, 
                    timestamp: serverTimestamp() 
                });
            }

            const res = await fetch(CLOUD_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message: txt })
            });
            
            const data = await res.json();
            
            // 🆕 On enlève les 3 petits points dès que la réponse arrive
            removeTyping();

            if (data.reply) {
                afficherMessage('assistant', data.reply);
                
                if (messagesRef) {
                    const newReplyRef = doc(messagesRef);
                    await setDoc(newReplyRef, { 
                        role: 'assistant', 
                        content: data.reply, 
                        timestamp: serverTimestamp() 
                    });
                }
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

    // Bulle de bienvenue
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
    // Supprimer un éventuel indicateur existant
    const existing = document.getElementById('typing');
    if (existing) existing.remove();

    const d = document.createElement('div');
    d.id = 'typing'; 
    d.className = 'ai-message assistant';
    // 3 petits points animés
    d.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById('typing');
    if (t) t.remove();
}
