alert("ÉTAPE 2 : Le script commence à s'exécuter !");

document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.getElementById('ai-chat-body');
    const aiSendBtn = document.getElementById('ai-chat-send');
    const aiInput = document.getElementById('ai-chat-input');

    if (!chatBody || !aiSendBtn || !aiInput) {
        alert("ERREUR : Je ne trouve pas les éléments du chat dans le HTML.");
        return;
    }

    // On remplace le texte d'attente par un vrai message
    chatBody.innerHTML = '<div class="ai-message assistant"><div class="ai-message-bubble">Assistant prêt ! Tapez un message.</div></div>';

    aiSendBtn.addEventListener('click', async () => {
        const text = aiInput.value;
        if(!text) return;
        aiInput.value = '';

        alert("J'envoie ce message à Cloudflare : " + text);

        try {
            const response = await fetch("https://orange-disk-17b1.avogofidelia604.workers.dev", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    clientContext: { firstName: "Client" }
                })
            });
            const data = await response.json();
            alert("Réponse reçue de Cloudflare : " + data.reply);
            
            // Afficher la réponse dans le chat
            chatBody.innerHTML += '<div class="ai-message assistant"><div class="ai-message-bubble">' + data.reply + '</div></div>';

        } catch (error) {
            alert("ERREUR CLOUDFLARE : " + error.message);
        }
    });
});
