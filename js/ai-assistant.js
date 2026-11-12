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

let isTyping = false; // 🆕 Variable pour savoir si l'IA écrit

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ai-chat-input');
    const btn = document.getElementById('ai-chat-send');
    const body = document.getElementById('ai-chat-body');
    
    if (!input || !btn || !body || !urlId) return;

    body.innerHTML = `<div class="ai-message assistant"><div class="ai-message-bubble">${currentGreetingText}</div></div>`;

    let messagesRef = null;
    
    authPromise.then(() => {
        messagesRef = collection(db, 'ai_conversations', urlId, 'messages');
        
        onSnapshot(messagesRef, (snapshot) => {
            if (snapshot.empty) return;
            
            body.innerHTML = ''; // On efface tout
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

            // 🆕 Si l'IA est en train d'écrire, on remet les 3 points après la mise à jour de Firebase
            if (isTyping) {
                afficherTroisPoints();
            }
        }, (error) => {
            console.error("Erreur de synchronisation Firebase :", error);
        });
    }).catch(e => console.error("Erreur auth :", e));

    const send = async () => {
        const txt = input.value.trim();
        if (!txt) return;
        input.value = '';
        input.disabled = btn.disabled = true;

        afficherMessage('user', txt);
        
        // 🆕 On active l'indicateur de frappe
        isTyping = true;
        afficherTroisPoints();

        try {
            if (messagesRef) {
                const newMsgRef = doc(messagesRef);
                await setDoc(newMsgRef, { role: 'user', content: txt, timestamp: serverTimestamp() });
            }

            const res = await fetch(CLOUD_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message: txt })
            });
            
            const data = await res.json();
            
            // 🆕 On désactive l'indicateur de frappe
            isTyping = false;
            retirerTroisPoints();

            if (data.reply) {
                afficherMessage('assistant', data.reply);
                
                if (messagesRef) {
                    const newReplyRef = doc(messagesRef);
                    await setDoc(newReplyRef, { role: 'assistant', content: data.reply, timestamp: serverTimestamp() });
                }
            } else {
                throw new Error("Pas de réponse");
            }

        } catch (e) {
            isTyping = false;
            retirerTroisPoints();
            afficherMessage('assistant', "⚠️ ERREUR : " + e.message);
        } finally {
            input.disabled = btn.disabled = false;
            input.focus();
        }
    };

    btn.onclick = send;
    input.onkeypress = (e) => { if(e.key === 'Enter') { e.preventDefault(); send(); } };

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

// 🆕 Fonction pour afficher les 3 points
function afficherTroisPoints() {
    const body = document.getElementById('ai-chat-body');
    if (!body) return;
    if (document.getElementById('typing')) return; // S'ils sont déjà là, on ne les duplique pas

    const d = document.createElement('div');
    d.id = 'typing'; 
    d.className = 'ai-message assistant';
    d.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
}

// 🆕 Fonction pour retirer les 3 points
function retirerTroisPoints() {
    const t = document.getElementById('typing');
    if (t) t.remove();
}
