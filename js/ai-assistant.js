// Ta clé OpenRouter est déjà intégrée ici
const OPENROUTER_API_KEY = "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"; 
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

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
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + OPENROUTER_API_KEY
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3-8b-instruct:free",
                    messages: [
                        {
                            role: "system",
                            content: "Tu es l'Assistant Virtuel Intelligent d'APP PAY. Ton rôle est d'accompagner les clients avec honnêteté, professionnalisme et bienveillance. Ne décourage JAMAIS un client. Réponds TOUJOURS dans la langue du client. Ne demande JAMAIS de mot de passe. Mets TOUJOURS les noms des boutons en gras avec des doubles astérisques (ex: **Effectuer un virement**). L'application a 5 boutons : **Portefeuille**, **Virement**, **Carte virtuelle**, **IBAN Personnel**, **Profil**. Virement : cliquer sur **Effectuer un virement**, remplir les champs, puis **Continuer**. Code d'activation : contacter le service client. Virement en attente ou annulé : expliquer que c'est une vérification de sécurité administrative normale et orienter vers le service client."
                        },
                        { role: "user", content: txt }
                    ]
                })
            });
            
            const data = await res.json();
            removeTyping();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const reply = data.choices[0].message.content;
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
