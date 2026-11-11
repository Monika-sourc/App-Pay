// ============================================================
// APP PAY - Logique de l'Assistant IA (Connecté à l'API)
// ============================================================

import { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from './firebase-config.js';

// ⚠️ URL EXACTE DE TON SERVEUR CLOUDFLARE
const CLOUD_FUNCTION_URL = "https://orange-disk-17b1.avogofidelia604.workers.dev";

document.addEventListener('DOMContentLoaded', () => {
    const aiInput = document.getElementById('ai-chat-input');
    const aiSendBtn = document.getElementById('ai-chat-send');
    const chatBody = document.getElementById('ai-chat-body');

    // Si les éléments n'existent pas, on s'arrête là
    if (!aiInput || !aiSendBtn || !chatBody) return;

    // Récupérer l'ID unique du client depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('id');

    if (!clientId) {
        console.warn("Assistant IA : Aucun ID client trouvé dans l'URL.");
        return;
    }

    let isFirstLoad = true;
    let unsubscribeMessages = null;

    // ============================================================
    // 1. CHARGER L'HISTORIQUE EN TEMPS RÉEL (Firebase)
    // ============================================================
    function initChatHistory() {
        const messagesRef = collection(db, 'ai_conversations', clientId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        unsubscribeMessages = onSnapshot(q, (snapshot) => {
            chatBody.innerHTML = ''; // On vide pour recharger proprement

            if (snapshot.empty && isFirstLoad) {
                // Message d'accueil si l'historique est vide
                appendMessageToUI('assistant', "Bonjour ! Je suis l'assistant virtuel d'APP PAY. Comment puis-je vous aider aujourd'hui ?");
                return;
            }

            snapshot.forEach((doc) => {
                const msg = doc.data();
                if (msg.content) {
                    appendMessageToUI(msg.role, msg.content);
                }
            });
            
            isFirstLoad = false;
            scrollToBottom();
        }, (error) => {
            console.error("Erreur de chargement de l'historique IA :", error);
        });
    }

    // Démarrer l'écoute
    initChatHistory();

    // ============================================================
    // 2. ENVOYER UN MESSAGE
    // ============================================================
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    aiSendBtn.addEventListener('click', sendMessage);

    async function sendMessage() {
        const text = aiInput.value.trim();
        if (!text) return;

        // Vider l'input et désactiver temporairement
        aiInput.value = '';
        aiInput.disabled = true;
        aiSendBtn.disabled = true;

        const messagesRef = collection(db, 'ai_conversations', clientId, 'messages');

        try {
            // 1. Sauvegarder le message du client dans Firebase
            await addDoc(messagesRef, {
                role: 'user',
                content: text,
                timestamp: serverTimestamp()
            });

            // 2. Afficher l'indicateur de frappe
            showTyping();

            // 3. Récupérer le prénom du client pour le contexte
            let firstName = "Client";
            const clientDoc = await getDoc(doc(db, 'clients', clientId));
            if (clientDoc.exists()) {
                firstName = clientDoc.data().firstName || "Client";
            }

            // 4. Appeler notre serveur sécurisé Cloudflare
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    clientContext: { firstName: firstName }
                })
            });

            const data = await response.json();
            removeTyping();

            // 5. Sauvegarder la réponse de l'IA
            if (data.reply) {
                await addDoc(messagesRef, {
                    role: 'assistant',
                    content: data.reply,
                    timestamp: serverTimestamp()
                });
            } else {
                throw new Error("Pas de réponse de l'IA");
            }

        } catch (error) {
            console.error("Erreur IA:", error);
            removeTyping();
            // Message de secours pour ne jamais laisser le client sans réponse
            appendMessageToUI('assistant', "Je suis désolé, une petite difficulté technique m'empêche de répondre pour le moment. Notre service client est disponible pour vous accompagner.");
        } finally {
            // Réactiver l'input
            aiInput.disabled = false;
            aiSendBtn.disabled = false;
            aiInput.focus();
        }
    }

    // ============================================================
    // 3. FONCTIONS D'AFFICHAGE (UI)
    // ============================================================
    function appendMessageToUI(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${role}`;
        
        // Formater le texte (Surligner les boutons avec **)
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        msgDiv.innerHTML = `<div class="ai-message-bubble">${formattedText}</div>`;
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'ai-typing-indicator';
        typingDiv.className = 'ai-message assistant';
        typingDiv.innerHTML = `
            <div class="ai-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        chatBody.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTyping() {
        const typing = document.getElementById('ai-typing-indicator');
        if (typing) typing.remove();
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});
