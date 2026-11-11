// ============================================================
// APP PAY - Logique de l'Assistant IA (Interface)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const aiInput = document.getElementById('ai-chat-input');
    const aiSendBtn = document.getElementById('ai-chat-send');
    const chatBody = document.getElementById('ai-chat-body');

    // Si les éléments n'existent pas (ex: page admin), on s'arrête là
    if (!aiInput || !aiSendBtn || !chatBody) return;

    // Nettoyer le message d'attente
    chatBody.innerHTML = '';

    // Message de bienvenue au démarrage
    setTimeout(() => {
        appendMessage('assistant', "Bonjour ! Je suis l'assistant virtuel d'APP PAY. Comment puis-je vous aider aujourd'hui ?");
    }, 500);

    // Envoyer le message avec la touche "Entrée"
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // Envoyer le message avec le bouton
    aiSendBtn.addEventListener('click', sendMessage);

    function sendMessage() {
        const text = aiInput.value.trim();
        if (!text) return;

        // 1. Afficher le message du client
        appendMessage('user', text);
        aiInput.value = '';
        
        // 2. Désactiver l'input en attendant la réponse
        aiInput.disabled = true;
        aiSendBtn.disabled = true;

        // 3. Afficher l'indicateur de frappe (les 3 points)
        showTyping();

        // 4. SIMULATION (Sera remplacé par la vraie IA à l'Étape 4)
        setTimeout(() => {
            removeTyping();
            
            // Exemple de réponse avec un bouton surligné en gras (** **)
            const dummyResponse = "Je comprends votre demande. Pour effectuer un virement, cliquez sur le bouton **Effectuer un virement** dans votre tableau de bord. (Note: Je suis actuellement en mode démonstration, l'intelligence artificielle sera connectée à la prochaine étape).";
            
            appendMessage('assistant', dummyResponse);
            
            // Réactiver l'input
            aiInput.disabled = false;
            aiSendBtn.disabled = false;
            aiInput.focus();
        }, 1500);
    }

    // Fonction pour ajouter un message à l'écran
    function appendMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${role}`;
        
        // Formater le texte (transforme **texte** en <strong>texte</strong>)
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        msgDiv.innerHTML = `<div class="ai-message-bubble">${formattedText}</div>`;
        chatBody.appendChild(msgDiv);
        scrollToBottom();
    }

    // Afficher les 3 points de frappe
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

    // Retirer les 3 points de frappe
    function removeTyping() {
        const typing = document.getElementById('ai-typing-indicator');
        if (typing) typing.remove();
    }

    // Faire défiler vers le bas
    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});
