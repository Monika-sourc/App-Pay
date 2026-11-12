// Ta clé API Gemini
const GEMINI_API_KEY = "AQ.Ab8RN6KPexBjY6HalJereMMDDgwIg-ro8t4TveEK0rzKVjRS6Q"; 

// Le code va essayer ces 4 adresses l'une après l'autre jusqu'à ce que ça marche
const ENDPOINTS = [
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
];

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ai-chat-input');
    const btn = document.getElementById('ai-chat-send');
    const body = document.getElementById('ai-chat-body');
    
    if (!input || !btn || !body) return;

    // Message de bienvenue
    body.innerHTML = '<div class="ai-message assistant"><div class="ai-message-bubble">Bonjour ! Je suis l\'assistant APP PAY. Comment puis-je vous aider aujourd\'hui ?</div></div>';

    const send = async () => {
        const txt = input.value.trim();
        if (!txt) return;
        input.value = '';
        input.disabled = btn.disabled = true;

        addMsg('user', txt);
        showTyping();

        let replyFound = false;
        let lastError = "";

        // On essaie les différentes méthodes de connexion à Google
        for (let url of ENDPOINTS) {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': GEMINI_API_KEY 
                    },
                    body: JSON.stringify({
                        system_instruction: {
                            parts: [{
                                text: "Tu es l'Assistant Virtuel Intelligent d'APP PAY. Ton rôle est d'accompagner les clients avec honnêteté, professionnalisme et bienveillance. Ne décourage JAMAIS un client. Réponds TOUJOURS dans la langue du client. Ne demande JAMAIS de mot de passe. Mets TOUJOURS les noms des boutons en gras avec des doubles astérisques (ex: **Effectuer un virement**). L'application a 5 boutons : **Portefeuille**, **Virement**, **Carte virtuelle**, **IBAN Personnel**, **Profil**. Virement : cliquer sur **Effectuer un virement**, remplir les champs, puis **Continuer**. Code d'activation : contacter le service client. Virement en attente ou annulé : expliquer que c'est une vérification de sécurité administrative normale et orienter vers le service client."
                            }]
                        },
                        contents: [{role: "user", parts: [{text: txt}]}]
                    })
                });
                
                const data = await res.json();
                
                // Si Google répond avec succès
                if (data.candidates && data.candidates[0].content.parts[0].text) {
                    removeTyping();
                    addMsg('assistant', data.candidates[0].content.parts[0].text);
                    replyFound = true;
                    break; // On arrête de chercher, on a la réponse !
                } else if (data.error) {
                    lastError = data.error.message;
                }
            } catch (e) {
                lastError = e.message;
            }
        }

        // Si aucune adresse n'a fonctionné
        if (!replyFound) {
            removeTyping();
            addMsg('assistant', "⚠️ Erreur Google : " + lastError);
        }

        input.disabled = btn.disabled = false;
        input.focus();
    };

    btn.onclick = send;
    input.onkeypress = (e) => { 
        if(e.key === 'Enter') { 
            e.preventDefault(); 
            send(); 
        } 
    };
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
    d.id = 'typing'; 
    d.className = 'ai-message assistant';
    d.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById('typing');
    if (t) t.remove();
}
