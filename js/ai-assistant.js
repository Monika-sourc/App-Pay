// ============================================================
// APP PAY - Logique de l'Assistant IA (Avec Persistance Firebase)
// ============================================================

import { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from './firebase-config.js';

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
    // 1. CHARGER L'HISTORIQUE EN TEMPS RÉEL
    // ============================================================
    function initChatHistory() {
        // On écoute la sous-collection spécifique à ce client
        const messagesRef = collection(db, 'ai_conversations', clientId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        unsubscribeMessages = onSnapshot(q, (snapshot) => {
            chatBody.innerHTML = ''; // On vide pour recharger proprement

            if (snapshot.empty && isFirstLoad) {
                // Si c'est la première fois qu'il ouvre le chat
                appendMessageToUI('assistant', "Bonjour ! Je suis l'assistant virtuel d'APP PAY. Comment puis-je vous aider aujourd'hui ?");
                return;
            }

            snapshot.forEach((doc) => {
                const msg = doc.data();
                // On n'affiche que si le contenu existe
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

    // Démarrer l'écoute dès que la page est prête
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

            // 3. SIMULATION DE LA RÉPONSE (Sera remplacé à l'Étape 4)
            setTimeout(async () => {
                removeTyping();
                
                const dummyResponse = "Je comprends votre demande. Pour effectuer un virement, cliquez sur le bouton **Effectuer un virement** dans votre tableau de bord. (Mode démonstration : la vraie IA sera connectée à l'étape suivante).";
                
                // Sauvegarder la réponse de l'IA dans Firebase
                await addDoc(messagesRef, {
                    role: 'assistant',
                    content: dummyResponse,
                    timestamp: serverTimestamp()
                });

                // Réactiver l'input
                aiInput.disabled = false;
                aiSendBtn.disabled = false;
                aiInput.focus();
            }, 1500);

        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
            removeTyping();
            aiInput.disabled = false;
            aiSendBtn.disabled = false;
            alert("Une erreur est survenue lors de la connexion au serveur.");
        }
    }

    // ============================================================
    // 3. FONCTIONS D'AFFICHAGE (UI)
    // ============================================================
    function appendMessageToUI(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${role}`;
        
        // Formater le texte (surligner les boutons avec **)
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
