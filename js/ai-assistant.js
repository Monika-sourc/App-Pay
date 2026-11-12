// Ta nouvelle clé API Gemini
const GEMINI_API_KEY = "AQ.Ab8RN6KPexBjY6HalJereMMDDgwIg-ro8t4TveEK0rzKVjRS6Q"; 
// On ajoute "-latest" à la fin du nom du modèle pour que Google le reconnaisse
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

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

        try {
            // Appel à Google Gemini
            const res = await fetch(GEMINI_URL, {
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
            removeTyping();

            // Si Google renvoie une erreur
            if (data.error) {
                throw new Error(data.error.message);
            }

            // Afficher la réponse de l'IA
            const reply = data.candidates[0].content.parts[0].text;
            addMsg('assistant', reply);

        } catch (e) {
            removeTyping();
            addMsg('assistant', "⚠️ ERREUR : " + e.message);
        } finally {
            input.disabled = btn.disabled = false;
            input.focus();
        }
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
