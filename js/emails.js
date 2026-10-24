// ============================================================
// APP PAY - Module d'envoi d'emails (145 langues supportées)
// ============================================================

// ============================================================
// CONFIGURATION API
// ============================================================
const API_PRIMARY = {
    url: "https://new-app-three-eta.vercel.app/api/send-email",
    headers: { "Content-Type": "application/json" }
};

const API_BACKUP = {
    url: "https://getzenpay-email-api.onrender.com/api/send-welcome",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": "GETZENPAY_2026_SECRET"
    }
};

const REQUEST_TIMEOUT = 15000;

// ============================================================
// DICTIONNAIRE DE TRADUCTION DES EMAILS (Toutes les langues)
// ============================================================
const EMAIL_TRANSLATIONS = {
    // ═══════════════════════════════════════════════════════
    // LANGUE : FRANÇAIS (fr)
    // ═══════════════════════════════════════════════════════
    fr: {
        loginSubj: "Bienvenue chez App Pay – Vos identifiants de connexion",
        loginGreet: "Cher(e) {name},",
        loginIntro: "Nous avons le plaisir de vous confirmer l'ouverture de votre compte chez App Pay. Nous vous remercions de votre confiance. Afin d'accéder à votre espace client en ligne, voici vos identifiants de connexion :",
        loginFooter: "Pour votre sécurité, nous vous recommandons de conserver ces informations de manière confidentielle. Ne partagez jamais votre code PIN avec qui que ce soit.",
        
        actSubj: "Votre code d'activation pour vos virements App Pay",
        actGreet: "Cher(e) {name},",
        actIntro: "Afin de garantir la sécurité de vos transactions, veuillez trouver ci-dessous votre code d'activation personnel. Ce code vous sera demandé pour valider chacun de vos virements :",
        actFooter: "Gardez ce code en lieu sûr. Il est strictement personnel et confidentiel. Ne partagez jamais ce code avec un tiers, même s'il prétend être un conseiller App Pay.",

        successSubj: "Confirmation de votre virement App Pay",
        successGreet: "Cher(e) {name},",
        successIntro: "Nous vous confirmons que votre virement a été traité avec succès par nos services. Voici le récapitulatif de l'opération :",
        successFooter: "Le crédit sur le compte du bénéficiaire s'effectuera sous 24 à 48 heures ouvrées. Merci de votre confiance.",

        failedSubj: "Alerte : Votre virement App Pay a été bloqué",
        failedGreet: "Cher(e) {name},",
        failedIntro: "Nous vous informons qu'une tentative de virement sur votre compte a été bloquée par nos systèmes de sécurité. Voici les détails :",
        failedFooter: "Aucun montant n'a été débité. Veuillez contacter le service client pour plus d'informations.",

        pendingSubj: "Votre virement App Pay est en attente de validation",
        pendingGreet: "Cher(e) {name},",
        pendingIntro: "Nous vous informons que votre virement a bien été enregistré et est actuellement en attente de validation par notre service administratif.",
        pendingFooter: "Vous recevrez une notification dès que le virement sera traité.",

        validatedSubj: "Virement validé par l'administration",
        validatedGreet: "Cher(e) {name},",
        validatedIntro: "Nous vous informons que votre virement en attente a été validé par notre service administratif et a été traité avec succès.",
        validatedFooter: "Le crédit sur le compte du bénéficiaire s'effectuera sous 24 à 48 heures ouvrées. Merci de votre confiance.",

        cancelledSubj: "Virement annulé par l'administration",
        cancelledGreet: "Cher(e) {name},",
        cancelledIntro: "Nous vous informons que votre virement a été annulé par notre service administratif. Le montant a été re-crédité sur votre compte.",
        cancelledFooter: "Vous pouvez vérifier votre nouveau solde dans votre espace client.",

        refundSubj: "Virement remboursé",
        refundGreet: "Cher(e) {name},",
        refundIntro: "Nous vous informons que le montant de votre virement vous a été remboursé. Voici les détails :",
        refundFooter: "Le montant a été recrédité sur votre compte. Merci de votre compréhension.",

        userCancelledSubj: "Virement annulé",
        userCancelledGreet: "Cher(e) {name},",
        userCancelledIntro: "Nous vous confirmons que votre virement a bien été annulé. Aucun montant n'a été débité de votre compte.",
        userCancelledFooter: "Si vous n'êtes pas à l'origine de cette annulation, veuillez contacter immédiatement notre service client.",

        adminConnectionSubj: " Nouvelle connexion client sur App Pay",
        adminConnectionGreet: "Bonjour Administrateur,",
        adminConnectionIntro: "Le client suivant vient de se connecter à son compte App Pay. Voici les détails de la connexion :",
        adminConnectionFooter: "Cet email est envoyé automatiquement à l'administrateur à chaque connexion d'un client."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : ANGLAIS (en)
    // ═══════════════════════════════════════════════════════
    en: {
        loginSubj: "Welcome to App Pay – Your login credentials",
        loginGreet: "Dear {name},",
        loginIntro: "We are pleased to confirm the opening of your account with App Pay. Thank you for your trust. To access your online client portal, here are your login credentials:",
        loginFooter: "For your security, we recommend keeping this information confidential. Never share your PIN code with anyone.",
        
        actSubj: "Your activation code for App Pay transfers",
        actGreet: "Dear {name},",
        actIntro: "To ensure the security of your transactions, please find your personal activation code below. This code will be required to validate each of your transfers:",
        actFooter: "Keep this code safe. It is strictly personal and confidential. Never share this code with a third party, even if they claim to be an App Pay advisor.",

        successSubj: "Confirmation of your App Pay transfer",
        successGreet: "Dear {name},",
        successIntro: "We confirm that your transfer has been successfully processed. Here is the summary of the operation:",
        successFooter: "The funds will be credited to the beneficiary's account within 24 to 48 business hours. Thank you for your trust.",

        failedSubj: "Alert: Your App Pay transfer was blocked",
        failedGreet: "Dear {name},",
        failedIntro: "We inform you that a transfer attempt on your account was blocked by our security systems. Here are the details:",
        failedFooter: "No amount was debited. Please contact customer service for more information.",

        pendingSubj: "Your App Pay transfer is pending validation",
        pendingGreet: "Dear {name},",
        pendingIntro: "We inform you that your transfer has been registered and is currently pending validation by our administrative service.",
        pendingFooter: "You will receive a notification as soon as the transfer is processed.",

        validatedSubj: "Transfer validated by administration",
        validatedGreet: "Dear {name},",
        validatedIntro: "We inform you that your pending transfer has been validated by our administrative service and processed successfully.",
        validatedFooter: "The funds will be credited to the beneficiary's account within 24 to 48 business hours. Thank you for your trust.",

        cancelledSubj: "Transfer cancelled by administration",
        cancelledGreet: "Dear {name},",
        cancelledIntro: "We inform you that your transfer has been cancelled by our administrative service. The amount has been re-credited to your account.",
        cancelledFooter: "You can check your new balance in your client portal.",

        refundSubj: "Transfer refunded",
        refundGreet: "Dear {name},",
        refundIntro: "We inform you that your transfer amount has been refunded to you. Here are the details:",
        refundFooter: "The amount has been re-credited to your account. Thank you for your understanding.",

        userCancelledSubj: "Transfer cancelled",
        userCancelledGreet: "Dear {name},",
        userCancelledIntro: "We confirm that your transfer has been cancelled. No amount was debited from your account.",
        userCancelledFooter: "If you did not initiate this cancellation, please contact our customer service immediately.",

        adminConnectionSubj: " New client connection on App Pay",
        adminConnectionGreet: "Hello Administrator,",
        adminConnectionIntro: "The following client just logged into their App Pay account. Here are the connection details:",
        adminConnectionFooter: "This email is sent automatically to the administrator each time a client logs in."
    }
};

// ============================================================
// UTILITAIRES
// ============================================================
function isValidEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function formatAmount(amount, currency = 'zł') {
    const num = Number(amount) || 0;
    return num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + currency;
}

async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

function stripHtml(html) {
    if (!html) return '';
    return html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

async function sendEmail({ email, prenom, sujet, html }) {
    if (!isValidEmail(email)) {
        console.error(`❌ Adresse email invalide : "${email}"`);
        return { success: false, error: 'INVALID_EMAIL', message: 'Adresse email invalide.' };
    }

    console.log(`📧 Envoi email à ${email} — sujet : "${sujet}"`);
    const textContent = stripHtml(html);

    const payload = JSON.stringify({ 
        email: email,
        prenom: prenom || 'Client',
        sujet: sujet,
        html: html,
        text: textContent 
    });

    try {
        const res = await fetchWithTimeout(API_PRIMARY.url, {
            method: "POST",
            headers: API_PRIMARY.headers,
            body: payload
        });

        if (res.ok) {
            console.log("✅ Email envoyé via Vercel");
            return { success: true, provider: "vercel" };
        }
        console.warn(`⚠️ Vercel a échoué (${res.status}), tentative via Render...`);
    } catch (err) {
        console.warn(`⚠️ Vercel échoué (${err.message}), tentative via Render...`);
    }

    try {
        const res = await fetchWithTimeout(API_BACKUP.url, {
            method: "POST",
            headers: API_BACKUP.headers,
            body: payload
        });

        if (res.ok) {
            console.log("✅ Email envoyé via Render (fallback)");
            return { success: true, provider: "render" };
        }
        console.error(`❌ Render a répondu ${res.status}`);
        return { success: false, error: `HTTP ${res.status}`, message: `Render HTTP ${res.status}` };
    } catch (err) {
        console.error(`❌ Render échoué aussi : ${err.message}`);
        return { success: false, error: err.message, message: err.message };
    }
}

// ============================================================
// TEMPLATE HTML PLEIN ÉCRAN (Design épuré pour Gmail)
// ============================================================
function buildEmailHTML({ title, greeting, intro, listItems = [], warning = '', buttonText = '', buttonLink = '', footer, boxStyle = 'background-color: #f9f9f9;' }) {
    const listHTML = listItems.length > 0 ? `
        <div style="margin: 20px 0; padding: 20px; border-radius: 8px; ${boxStyle}">
            <ul style="margin: 0; padding-left: 20px; color: #333; line-height: 1.6; font-size: 14px; font-family: Arial, sans-serif;">
                ${listItems.map(item => `
                    <li style="margin-bottom: 10px;">
                        ${item.label} : ${item.value}
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';

    const warningHTML = warning ? `
        <div style="background:#fff5eb; border-left:4px solid #ff7a00; padding:12px; border-radius:6px; margin:20px 0; font-size:13px; color:#8a4400; line-height:1.5; font-family: Arial, sans-serif;">
            <strong>⚠️ Attention :</strong> ${warning}
        </div>
    ` : '';

    const buttonHTML = (buttonText && buttonLink) ? `
        <div style="text-align: center; margin: 30px 0;">
            <a href="${buttonLink}" target="_blank" style="display: inline-block; background-color: #ff7a00; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 15px; font-weight: bold; box-shadow: 0 4px 12px rgba(255, 122, 0, 0.3); font-family: Arial, sans-serif;">
                ${buttonText}
            </a>
        </div>
    ` : '';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; padding:0; background-color:#f4f4f4; width: 100%; font-family: Arial, sans-serif;">
            <div style="width: 100%; max-width: 100%; background-color: #ffffff;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg,#ff7a00 0%,#ff9533 100%); padding: 30px 20px; text-align:center;">
                    <div style="font-size:24px; font-weight:900; color:white; letter-spacing:2px;">APP PAY</div>
                </div>

                <!-- Body -->
                <div style="padding: 30px 20px; max-width: 600px; margin: 0 auto;">
                    <h1 style="font-size:20px; font-weight:800; color:#111111; margin:0 0 20px 0;">${title}</h1>
                    
                    <p style="font-size:16px; color:#333333; margin:0 0 15px 0; font-weight:bold;">${greeting}</p>
                    <p style="font-size:15px; color:#555555; line-height:1.6; margin:0 0 20px 0;">${intro}</p>

                    ${listHTML}
                    ${buttonHTML}
                    ${warningHTML}

                    <p style="font-size:14px; color:#666666; line-height:1.6; margin:20px 0 0 0;">${footer}</p>

                    <div style="margin-top:30px; padding-top:20px; border-top:1px solid #eeeeee;">
                        <p style="font-size:14px; color:#888888; margin:0;">
                            Cordialement,<br>
                            <strong style="color:#ff7a00; font-size:15px;">L'équipe App Pay</strong>
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background:#f4f4f4; padding:20px; text-align:center;">
                    <p style="font-size:12px; color:#999999; margin:0; line-height:1.6;">
                        Cet email a été généré automatiquement par App Pay.<br>
                        Merci de ne pas répondre directement à cet email.
                    </p>
                </div>

            </div>
        </body>
        </html>
    `;
}

// ============================================================
// HELPER : RÉCUPÉRER LA LANGUE DU CLIENT
// ============================================================
function getT(lang) {
    return EMAIL_TRANSLATIONS[lang] || EMAIL_TRANSLATIONS['en']; // Fallback à l'anglais si la langue n'est pas encore là
}

function replaceVars(text, vars) {
    if (!text) return '';
    let result = text;
    Object.keys(vars).forEach(key => {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), vars[key] || '');
    });
    return result;
}

function getClientFirstName(client) {
    return client?.firstName || client?.lastName || 'Client';
}

// ============================================================
// 📧 FONCTION 1 : Envoyer les identifiants de connexion
// ============================================================
export async function sendLoginCredentials(client) {
    if (!client?.email) {
        return { success: false, error: 'MISSING_EMAIL', message: 'Client sans adresse email.' };
    }

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const baseUrl = window.location.origin.includes('localhost') ? 'https://app.getzenpay.com' : window.location.origin;
    const loginLink = `${baseUrl}/?id=${client.id}`;

    const html = buildEmailHTML({
        title: t.loginSubj,
        greeting: replaceVars(t.loginGreet, { name: prenom }),
        intro: t.loginIntro,
        listItems: [
            { 
                label: `<strong>Identifiant</strong>`, 
                value: `<a href="mailto:${client.email}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">${client.email}</a>` 
            },
            { 
                label: `<strong>Code PIN</strong>`, 
                value: `<strong style="color: #111; font-family: monospace; font-size: 16px; letter-spacing: 1px;">${client.pin}</strong>` 
            }
        ],
        buttonText: "Accéder à mon compte",
        buttonLink: loginLink,
        warning: t.loginFooter,
        footer: t.loginFooter,
        boxStyle: 'background-color: #f9f9f9; border: 1px solid #eeeeee;' 
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.loginSubj,
        html: html
    });
}

// ============================================================
// 📧 FONCTION 2 : Envoyer le code d'activation
// ============================================================
export async function sendActivationCode(client) {
    if (!client?.email) {
        return { success: false, error: 'MISSING_EMAIL', message: 'Client sans adresse email.' };
    }

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.actSubj,
        greeting: replaceVars(t.actGreet, { name: prenom }),
        intro: t.actIntro,
        listItems: [
            { 
                label: `<strong>Code d'activation</strong>`, 
                value: `<strong style="color: #ff7a00; font-family: monospace; font-size: 18px; letter-spacing: 2px;">${client.activationCode}</strong>` 
            }
        ],
        warning: t.actFooter,
        footer: t.actFooter,
        boxStyle: 'background-color: #f9f9f9; border: 1px solid #eeeeee;'
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.actSubj,
        html: html
    });
},
// ═══════════════════════════════════════════════════════
// LANGUE : ESPAGNOL (es)
// ═══════════════════════════════════════════════════════
es: {
    loginSubj: "Bienvenido a App Pay – Sus credenciales de acceso",
    loginGreet: "Estimado/a {name},",
    loginIntro: "Nos complace confirmar la apertura de su cuenta en App Pay. Gracias por su confianza. Para acceder a su área de cliente en línea, aquí están sus credenciales de acceso:",
    loginFooter: "Por su seguridad, le recomendamos mantener esta información confidencial. Nunca comparta su código PIN con nadie.",
    
    actSubj: "Su código de activación para transferencias App Pay",
    actGreet: "Estimado/a {name},",
    actIntro: "Para garantizar la seguridad de sus transacciones, a continuación encontrará su código de activación personal. Se le pedirá para validar cada una de sus transferencias:",
    actFooter: "Guarde este código en un lugar seguro. Es estrictamente personal y confidencial. Nunca comparta este código con terceros, incluso si dicen ser asesores de App Pay.",

    successSubj: "Confirmación de su transferencia App Pay",
    successGreet: "Estimado/a {name},",
    successIntro: "Le confirmamos que su transferencia ha sido procesada con éxito. Aquí está el resumen de la operación:",
    successFooter: "Los fondos se acreditarán en la cuenta del beneficiario en un plazo de 24 a 48 horas hábiles. Gracias por su confianza.",

    failedSubj: "Alerta: Su transferencia App Pay fue bloqueada",
    failedGreet: "Estimado/a {name},",
    failedIntro: "Le informamos que un intento de transferencia en su cuenta fue bloqueado por nuestros sistemas de seguridad. Aquí están los detalles:",
    failedFooter: "No se ha debitado ningún importe. Comuníquese con el servicio de atención al cliente para obtener más información.",

    pendingSubj: "Su transferencia App Pay está pendiente de validación",
    pendingGreet: "Estimado/a {name},",
    pendingIntro: "Le informamos que su transferencia ha sido registrada y actualmente está pendiente de validación por nuestro servicio administrativo.",
    pendingFooter: "Recibirá una notificación tan pronto como se procese la transferencia.",

    validatedSubj: "Transferencia validada por la administración",
    validatedGreet: "Estimado/a {name},",
    validatedIntro: "Le informamos que su transferencia pendiente ha sido validada por nuestro servicio administrativo y procesada con éxito.",
    validatedFooter: "Los fondos se acreditarán en la cuenta del beneficiario en un plazo de 24 a 48 horas hábiles. Gracias por su confianza.",

    cancelledSubj: "Transferencia cancelada por la administración",
    cancelledGreet: "Estimado/a {name},",
    cancelledIntro: "Le informamos que su transferencia ha sido cancelada por nuestro servicio administrativo. El importe ha sido re-acreditado en su cuenta.",
    cancelledFooter: "Puede verificar su nuevo saldo en su área de cliente.",

    refundSubj: "Transferencia reembolsada",
    refundGreet: "Estimado/a {name},",
    refundIntro: "Le informamos que el importe de su transferencia le ha sido reembolsado. Aquí están los detalles:",
    refundFooter: "El importe ha sido re-acreditado en su cuenta. Gracias por su comprensión.",

    userCancelledSubj: "Transferencia cancelada",
    userCancelledGreet: "Estimado/a {name},",
    userCancelledIntro: "Le confirmamos que su transferencia ha sido cancelada. No se ha debitado ningún importe de su cuenta.",
    userCancelledFooter: "Si usted no ha iniciado esta cancelación, por favor contacte inmediatamente con nuestro servicio de atención al cliente.",

    adminConnectionSubj: " Nueva conexión de cliente en App Pay",
    adminConnectionGreet: "Hola Administrador,",
    adminConnectionIntro: "El siguiente cliente acaba de iniciar sesión en su cuenta de App Pay. Aquí están los detalles de la conexión:",
    adminConnectionFooter: "Este correo se envía automáticamente al administrador cada vez que un cliente inicia sesión."
},

// ═══════════════════════════════════════════════════════
// LANGUE : ALLEMAND (de)
// ═══════════════════════════════════════════════════════
de: {
    loginSubj: "Willkommen bei App Pay – Ihre Zugangsdaten",
    loginGreet: "Sehr geehrte(r) {name},",
    loginIntro: "Wir freuen uns, die Eröffnung Ihres Kontos bei App Pay zu bestätigen. Vielen Dank für Ihr Vertrauen. Hier sind Ihre Zugangsdaten für Ihr Kundenportal:",
    loginFooter: "Zu Ihrer Sicherheit empfehlen wir, diese Informationen vertraulich zu behandeln. Teilen Sie Ihren PIN-Code niemals mit anderen.",
    
    actSubj: "Ihr Aktivierungscode für App Pay Überweisungen",
    actGreet: "Sehr geehrte(r) {name},",
    actIntro: "Um die Sicherheit Ihrer Transaktionen zu gewährleisten, finden Sie unten Ihren persönlichen Aktivierungscode. Dieser Code wird benötigt, um jede Ihrer Überweisungen zu validieren:",
    actFooter: "Bewahren Sie diesen Code sicher auf. Er ist streng persönlich und vertraulich. Teilen Sie diesen Code niemals mit Dritten, auch wenn diese behaupten, App Pay Berater zu sein.",

    successSubj: "Bestätigung Ihrer App Pay Überweisung",
    successGreet: "Sehr geehrte(r) {name},",
    successIntro: "Wir bestätigen, dass Ihre Überweisung erfolgreich bearbeitet wurde. Hier ist die Zusammenfassung:",
    successFooter: "Die Gutschrift erfolgt innerhalb von 24 bis 48 Geschäftsstunden. Vielen Dank für Ihr Vertrauen.",

    failedSubj: "Warnung: Ihre App Pay Überweisung wurde blockiert",
    failedGreet: "Sehr geehrte(r) {name},",
    failedIntro: "Wir informieren Sie, dass ein Überweisungsversuch auf Ihrem Konto von unseren Sicherheitssystemen blockiert wurde. Hier sind die Details:",
    failedFooter: "Es wurde kein Betrag abgebucht. Bitte kontaktieren Sie den Kundendienst für weitere Informationen.",

    pendingSubj: "Ihre App Pay Überweisung wartet auf Validierung",
    pendingGreet: "Sehr geehrte(r) {name},",
    pendingIntro: "Wir informieren Sie, dass Ihre Überweisung registriert wurde und derzeit auf die Validierung durch unseren Verwaltungsdienst wartet.",
    pendingFooter: "Sie erhalten eine Benachrichtigung, sobald die Überweisung bearbeitet wurde.",

    validatedSubj: "Überweisung von der Verwaltung validiert",
    validatedGreet: "Sehr geehrte(r) {name},",
    validatedIntro: "Wir informieren Sie, dass Ihre ausstehende Überweisung von unserem Verwaltungsdienst validiert und erfolgreich bearbeitet wurde.",
    validatedFooter: "Die Gutschrift erfolgt innerhalb von 24 bis 48 Geschäftsstunden. Vielen Dank für Ihr Vertrauen.",

    cancelledSubj: "Überweisung von der Verwaltung storniert",
    cancelledGreet: "Sehr geehrte(r) {name},",
    cancelledIntro: "Wir informieren Sie, dass Ihre Überweisung von unserem Verwaltungsdienst storniert wurde. Der Betrag wurde Ihrem Konto wieder gutgeschrieben.",
    cancelledFooter: "Sie können Ihr neues Guthaben in Ihrem Kundenportal überprüfen.",

    refundSubj: "Überweisung erstattet",
    refundGreet: "Sehr geehrte(r) {name},",
    refundIntro: "Wir informieren Sie, dass der Betrag Ihrer Überweisung erstattet wurde. Hier sind die Details:",
    refundFooter: "Der Betrag wurde Ihrem Konto wieder gutgeschrieben. Vielen Dank für Ihr Verständnis.",

    userCancelledSubj: "Überweisung storniert",
    userCancelledGreet: "Sehr geehrte(r) {name},",
    userCancelledIntro: "Wir bestätigen, dass Ihre Überweisung storniert wurde. Es wurde kein Betrag von Ihrem Konto abgebucht.",
    userCancelledFooter: "Wenn Sie diese Stornierung nicht veranlasst haben, kontaktieren Sie bitte sofort unseren Kundendienst.",

    adminConnectionSubj: " Neue Kundenverbindung bei App Pay",
    adminConnectionGreet: "Hallo Administrator,",
    adminConnectionIntro: "Der folgende Kunde hat sich gerade in sein App Pay-Konto eingeloggt. Hier sind die Verbindungsdetails:",
    adminConnectionFooter: "Diese E-Mail wird automatisch an den Administrator gesendet, wenn sich ein Kunde anmeldet."
},

// ═══════════════════════════════════════════════════════
// LANGUE : POLONAIS (pl)
// ═══════════════════════════════════════════════════════
pl: {
    loginSubj: "Witamy w App Pay – Twoje dane logowania",
    loginGreet: "Szanowny(a) {name},",
    loginIntro: "Z przyjemnością potwierdzamy otwarcie Twojego konta w App Pay. Dziękujemy za zaufanie. Aby uzyskać dostęp do portalu klienta, oto Twoje dane logowania:",
    loginFooter: "Ze względów bezpieczeństwa zalecamy zachowanie tych informacji w poufności. Nigdy nie udostępniaj swojego kodu PIN.",
    
    actSubj: "Twój kod aktywacyjny do przelewów App Pay",
    actGreet: "Szanowny(a) {name},",
    actIntro: "Aby zapewnić bezpieczeństwo Twoich transakcji, poniżej znajduje się Twój osobisty kod aktywacyjny. Będzie on wymagany do zatwierdzenia każdego przelewu:",
    actFooter: "Przechowuj ten kod w bezpiecznym miejscu. Jest on ściśle osobisty i poufny. Nigdy nie udostępniaj tego kodu osobom trzecim, nawet jeśli twierdzą, że są doradcami App Pay.",

    successSubj: "Potwierdzenie przelewu App Pay",
    successGreet: "Szanowny(a) {name},",
    successIntro: "Potwierdzamy, że Twój przelew został pomyślnie przetworzony. Oto podsumowanie operacji:",
    successFooter: "Środki zostaną zaksięgowane na koncie odbiorcy w ciągu 24-48 godzin roboczych. Dziękujemy za zaufanie.",

    failedSubj: "Alert: Twój przelew App Pay został zablokowany",
    failedGreet: "Szanowny(a) {name},",
    failedIntro: "Informujemy, że próba przelewu na Twoim koncie została zablokowana przez nasze systemy bezpieczeństwa. Oto szczegóły:",
    failedFooter: "Żadna kwota nie została pobrana. Skontaktuj się z obsługą klienta, aby uzyskać więcej informacji.",

    pendingSubj: "Twój przelew App Pay oczekuje na weryfikację",
    pendingGreet: "Szanowny(a) {name},",
    pendingIntro: "Informujemy, że Twój przelew został zarejestrowany i obecnie oczekuje na weryfikację przez nasz dział administracji.",
    pendingFooter: "Otrzymasz powiadomienie, gdy tylko przelew zostanie przetworzony.",

    validatedSubj: "Przelew zatwierdzony przez administrację",
    validatedGreet: "Szanowny(a) {name},",
    validatedIntro: "Informujemy, że Twój oczekujący przelew został zatwierdzony przez nasz dział administracji i pomyślnie przetworzony.",
    validatedFooter: "Środki zostaną zaksięgowane na koncie odbiorcy w ciągu 24-48 godzin roboczych. Dziękujemy za zaufanie.",

    cancelledSubj: "Przelew anulowany przez administrację",
    cancelledGreet: "Szanowny(a) {name},",
    cancelledIntro: "Informujemy, że Twój przelew został anulowany przez nasz dział administracji. Kwota została ponownie zaksięgowana na Twoim koncie.",
    cancelledFooter: "Możesz sprawdzić swoje nowe saldo w portalu klienta.",

    refundSubj: "Przelew zwrócony",
    refundGreet: "Szanowny(a) {name},",
    refundIntro: "Informujemy, że kwota Twojego przelewu została Ci zwrócona. Oto szczegóły:",
    refundFooter: "Kwota została ponownie zaksięgowana na Twoim koncie. Dziękujemy za zrozumienie.",

    userCancelledSubj: "Przelew anulowany",
    userCancelledGreet: "Szanowny(a) {name},",
    userCancelledIntro: "Potwierdzamy, że Twój przelew został anulowany. Żadna kwota nie została pobrana z Twojego konta.",
    userCancelledFooter: "Jeśli nie zainicjowałeś tego anulowania, natychmiast skontaktuj się z naszą obsługą klienta.",

    adminConnectionSubj: " Nowe połączenie klienta w App Pay",
    adminConnectionGreet: "Witaj Administratorze,",
    adminConnectionIntro: "Następujący klient właśnie zalogował się na swoje konto App Pay. Oto szczegóły połączenia:",
    adminConnectionFooter: "Ta wiadomość jest wysyłana automatycznie do administratora przy każdym logowaniu klienta."
},
// ═══════════════════════════════════════════════════════
// LANGUE : ITALIEN (it)
// ═══════════════════════════════════════════════════════
it: {
    loginSubj: "Benvenuto in App Pay – Le tue credenziali di accesso",
    loginGreet: "Gentile {name},",
    loginIntro: "Siamo lieti di confermare l'apertura del tuo conto su App Pay. Ti ringraziamo per la tua fiducia. Per accedere al tuo portale clienti online, ecco le tue credenziali di accesso:",
    loginFooter: "Per la tua sicurezza, ti consigliamo di mantenere queste informazioni riservate. Non condividere mai il tuo codice PIN con nessuno.",
    
    actSubj: "Il tuo codice di attivazione per i bonifici App Pay",
    actGreet: "Gentile {name},",
    actIntro: "Per garantire la sicurezza delle tue transazioni, di seguito troverai il tuo codice di attivazione personale. Questo codice ti sarà richiesto per convalidare ciascuno dei tuoi bonifici:",
    actFooter: "Conserva questo codice in un luogo sicuro. È strettamente personale e riservato. Non condividere mai questo codice con terzi, anche se affermano di essere consulenti App Pay.",

    successSubj: "Conferma del tuo bonifico App Pay",
    successGreet: "Gentile {name},",
    successIntro: "Ti confermiamo che il tuo bonifico è stato elaborato con successo. Ecco il riepilogo dell'operazione:",
    successFooter: "Il credito sul conto del beneficiario avverrà entro 24-48 ore lavorative. Grazie per la tua fiducia.",

    failedSubj: "Avviso: Il tuo bonifico App Pay è stato bloccato",
    failedGreet: "Gentile {name},",
    failedIntro: "Ti informiamo che un tentativo di bonifico sul tuo conto è stato bloccato dai nostri sistemi di sicurezza. Ecco i dettagli:",
    failedFooter: "Nessun importo è stato addebitato. Contatta il servizio clienti per maggiori informazioni.",

    pendingSubj: "Il tuo bonifico App Pay è in attesa di convalida",
    pendingGreet: "Gentile {name},",
    pendingIntro: "Ti informiamo che il tuo bonifico è stato registrato ed è attualmente in attesa di convalida da parte del nostro servizio amministrativo.",
    pendingFooter: "Riceverai una notifica non appena il bonifico sarà elaborato.",

    validatedSubj: "Bonifico convalidato dall'amministrazione",
    validatedGreet: "Gentile {name},",
    validatedIntro: "Ti informiamo che il tuo bonifico in sospeso è stato convalidato dal nostro servizio amministrativo ed elaborato con successo.",
    validatedFooter: "Il credito sul conto del beneficiario avverrà entro 24-48 ore lavorative. Grazie per la tua fiducia.",

    cancelledSubj: "Bonifico annullato dall'amministrazione",
    cancelledGreet: "Gentile {name},",
    cancelledIntro: "Ti informiamo che il tuo bonifico è stato annullato dal nostro servizio amministrativo. L'importo è stato riaccreditato sul tuo conto.",
    cancelledFooter: "Puoi verificare il tuo nuovo saldo nel tuo portale clienti.",

    refundSubj: "Bonifico rimborsato",
    refundGreet: "Gentile {name},",
    refundIntro: "Ti informiamo che l'importo del tuo bonifico ti è stato rimborsato. Ecco i dettagli:",
    refundFooter: "L'importo è stato riaccreditato sul tuo conto. Grazie per la tua comprensione.",

    userCancelledSubj: "Bonifico annullato",
    userCancelledGreet: "Gentile {name},",
    userCancelledIntro: "Ti confermiamo che il tuo bonifico è stato annullato. Nessun importo è stato addebitato sul tuo conto.",
    userCancelledFooter: "Se non hai avviato tu questa cancellazione, contatta immediatamente il nostro servizio clienti.",

    adminConnectionSubj: " Nuova connessione cliente su App Pay",
    adminConnectionGreet: "Ciao Amministratore,",
    adminConnectionIntro: "Il seguente cliente si è appena connesso al suo conto App Pay. Ecco i dettagli della connessione:",
    adminConnectionFooter: "Questa email viene inviata automaticamente all'amministratore ogni volta che un cliente effettua l'accesso."
},

// ═══════════════════════════════════════════════════════
// LANGUE : PORTUGAIS (pt)
// ═══════════════════════════════════════════════════════
pt: {
    loginSubj: "Bem-vindo ao App Pay – As suas credenciais de acesso",
    loginGreet: "Estimado(a) {name},",
    loginIntro: "Temos o prazer de confirmar a abertura da sua conta no App Pay. Agradecemos a sua confiança. Para acessar o seu portal de cliente online, aqui estão as suas credenciais de acesso:",
    loginFooter: "Para sua segurança, recomendamos que mantenha estas informações confidenciais. Nunca compartilhe o seu código PIN com ninguém.",
    
    actSubj: "O seu código de ativação para transferências App Pay",
    actGreet: "Estimado(a) {name},",
    actIntro: "Para garantir a segurança das suas transações, encontre abaixo o seu código de ativação pessoal. Este código será necessário para validar cada uma das suas transferências:",
    actFooter: "Guarde este código em local seguro. É estritamente pessoal e confidencial. Nunca compartilhe este código com terceiros, mesmo que afirmem ser consultores do App Pay.",

    successSubj: "Confirmação da sua transferência App Pay",
    successGreet: "Estimado(a) {name},",
    successIntro: "Confirmamos que a sua transferência foi processada com sucesso. Aqui está o resumo da operação:",
    successFooter: "Os fundos serão creditados na conta do beneficiário no prazo de 24 a 48 horas úteis. Obrigado pela sua confiança.",

    failedSubj: "Alerta: A sua transferência App Pay foi bloqueada",
    failedGreet: "Estimado(a) {name},",
    failedIntro: "Informamos que uma tentativa de transferência na sua conta foi bloqueada pelos nossos sistemas de segurança. Aqui estão os detalhes:",
    failedFooter: "Nenhum valor foi debitado. Contacte o serviço de apoio ao cliente para mais informações.",

    pendingSubj: "A sua transferência App Pay está pendente de validação",
    pendingGreet: "Estimado(a) {name},",
    pendingIntro: "Informamos que a sua transferência foi registada e está atualmente pendente de validação pelo nosso serviço administrativo.",
    pendingFooter: "Receberá uma notificação assim que a transferência for processada.",

    validatedSubj: "Transferência validada pela administração",
    validatedGreet: "Estimado(a) {name},",
    validatedIntro: "Informamos que a sua transferência pendente foi validada pelo nosso serviço administrativo e processada com sucesso.",
    validatedFooter: "Os fundos serão creditados na conta do beneficiário no prazo de 24 a 48 horas úteis. Obrigado pela sua confiança.",

    cancelledSubj: "Transferência cancelada pela administração",
    cancelledGreet: "Estimado(a) {name},",
    cancelledIntro: "Informamos que a sua transferência foi cancelada pelo nosso serviço administrativo. O valor foi recreditado na sua conta.",
    cancelledFooter: "Pode verificar o seu novo saldo no seu portal de cliente.",

    refundSubj: "Transferência reembolsada",
    refundGreet: "Estimado(a) {name},",
    refundIntro: "Informamos que o valor da sua transferência lhe foi reembolsado. Aqui estão os detalhes:",
    refundFooter: "O valor foi recreditado na sua conta. Obrigado pela sua compreensão.",

    userCancelledSubj: "Transferência cancelada",
    userCancelledGreet: "Estimado(a) {name},",
    userCancelledIntro: "Confirmamos que a sua transferência foi cancelada. Nenhum valor foi debitado da sua conta.",
    userCancelledFooter: "Se não iniciou este cancelamento, contacte imediatamente o nosso serviço de apoio ao cliente.",

    adminConnectionSubj: " Nova conexão de cliente no App Pay",
    adminConnectionGreet: "Olá Administrador,",
    adminConnectionIntro: "O seguinte cliente acabou de iniciar sessão na sua conta App Pay. Aqui estão os detalhes da conexão:",
    adminConnectionFooter: "Este email é enviado automaticamente ao administrador sempre que um cliente inicia sessão."
},

// ═══════════════════════════════════════════════════════
// LANGUE : NÉERLANDAIS (nl)
// ═══════════════════════════════════════════════════════
nl: {
    loginSubj: "Welkom bij App Pay – Uw inloggegevens",
    loginGreet: "Beste {name},",
    loginIntro: "Wij zijn verheugd de opening van uw account bij App Pay te bevestigen. Bedankt voor uw vertrouwen. Om toegang te krijgen tot uw online klantenportaal, vindt u hier uw inloggegevens:",
    loginFooter: "Voor uw veiligheid raden wij u aan deze informatie vertrouwelijk te houden. Deel uw pincode nooit met iemand.",
    
    actSubj: "Uw activeringscode voor App Pay-overschrijvingen",
    actGreet: "Beste {name},",
    actIntro: "Om de veiligheid van uw transacties te waarborgen, vindt u hieronder uw persoonlijke activeringscode. Deze code is vereist om elk van uw overschrijvingen te valideren:",
    actFooter: "Bewaar deze code op een veilige plaats. Hij is strikt persoonlijk en vertrouwelijk. Deel deze code nooit met derden, zelfs niet als ze beweren een App Pay-adviseur te zijn.",

    successSubj: "Bevestiging van uw App Pay-overschrijving",
    successGreet: "Beste {name},",
    successIntro: "Wij bevestigen dat uw overschrijving met succes is verwerkt. Hier is het overzicht van de transactie:",
    successFooter: "Het geld wordt binnen 24 tot 48 werkuren op de rekening van de begunstigde gestort. Bedankt voor uw vertrouwen.",

    failedSubj: "Waarschuwing: Uw App Pay-overschrijving is geblokkeerd",
    failedGreet: "Beste {name},",
    failedIntro: "Wij informeren u dat een overschrijvingspoging op uw rekening door onze beveiligingssystemen is geblokkeerd. Hier zijn de details:",
    failedFooter: "Er is geen bedrag afgeschreven. Neem contact op met de klantenservice voor meer informatie.",

    pendingSubj: "Uw App Pay-overschrijving wacht op validatie",
    pendingGreet: "Beste {name},",
    pendingIntro: "Wij informeren u dat uw overschrijving is geregistreerd en momenteel wacht op validatie door onze administratieve dienst.",
    pendingFooter: "U ontvangt een melding zodra de overschrijving is verwerkt.",

    validatedSubj: "Overschrijving gevalideerd door de administratie",
    validatedGreet: "Beste {name},",
    validatedIntro: "Wij informeren u dat uw wachtende overschrijving door onze administratieve dienst is gevalideerd en met succes is verwerkt.",
    validatedFooter: "Het geld wordt binnen 24 tot 48 werkuren op de rekening van de begunstigde gestort. Bedankt voor uw vertrouwen.",

    cancelledSubj: "Overschrijving geannuleerd door de administratie",
    cancelledGreet: "Beste {name},",
    cancelledIntro: "Wij informeren u dat uw overschrijving door onze administratieve dienst is geannuleerd. Het bedrag is weer op uw rekening gestort.",
    cancelledFooter: "U kunt uw nieuwe saldo controleren in uw klantenportaal.",

    refundSubj: "Overschrijving terugbetaald",
    refundGreet: "Beste {name},",
    refundIntro: "Wij informeren u dat het bedrag van uw overschrijving aan u is terugbetaald. Hier zijn de details:",
    refundFooter: "Het bedrag is weer op uw rekening gestort. Bedankt voor uw begrip.",

    userCancelledSubj: "Overschrijving geannuleerd",
    userCancelledGreet: "Beste {name},",
    userCancelledIntro: "Wij bevestigen dat uw overschrijving is geannuleerd. Er is geen bedrag van uw rekening afgeschreven.",
    userCancelledFooter: "Als u deze annulering niet hebt geïnitieerd, neem dan onmiddellijk contact op met onze klantenservice.",

    adminConnectionSubj: " Nieuwe klantverbinding op App Pay",
    adminConnectionGreet: "Hallo Beheerder,",
    adminConnectionIntro: "De volgende klant is zojuist ingelogd op zijn App Pay-account. Hier zijn de verbindingsgegevens:",
    adminConnectionFooter: "Deze e-mail wordt automatisch naar de beheerder verzonden telkens wanneer een klant inlogt."
},

// ═══════════════════════════════════════════════════════
// LANGUE : RUSSE (ru)
// ═══════════════════════════════════════════════════════
ru: {
    loginSubj: "Добро пожаловать в App Pay – Ваши учётные данные",
    loginGreet: "Уважаемый(ая) {name},",
    loginIntro: "Мы рады подтвердить открытие вашего счёта в App Pay. Благодарим вас за доверие. Для доступа в личный кабинет клиента вот ваши учётные данные:",
    loginFooter: "В целях безопасности рекомендуем вам хранить эту информацию конфиденциально. Никогда и никому не сообщайте свой PIN-код.",
    
    actSubj: "Ваш код активации для переводов App Pay",
    actGreet: "Уважаемый(ая) {name},",
    actIntro: "Для обеспечения безопасности ваших транзакций ниже указан ваш персональный код активации. Он потребуется для подтверждения каждого вашего перевода:",
    actFooter: "Храните этот код в надёжном месте. Он является строго личным и конфиденциальным. Никогда не сообщайте этот код третьим лицам, даже если они представляются консультантами App Pay.",

    successSubj: "Подтверждение вашего перевода App Pay",
    successGreet: "Уважаемый(ая) {name},",
    successIntro: "Подтверждаем, что ваш перевод успешно обработан. Вот сводка операции:",
    successFooter: "Средства будут зачислены на счёт получателя в течение 24–48 рабочих часов. Благодарим за доверие.",

    failedSubj: "Внимание: Ваш перевод App Pay заблокирован",
    failedGreet: "Уважаемый(ая) {name},",
    failedIntro: "Сообщаем, что попытка перевода с вашего счёта была заблокирована нашими системами безопасности. Вот подробности:",
    failedFooter: "Никакая сумма не была списана. Свяжитесь со службой поддержки для получения дополнительной информации.",

    pendingSubj: "Ваш перевод App Pay ожидает подтверждения",
    pendingGreet: "Уважаемый(ая) {name},",
    pendingIntro: "Сообщаем, что ваш перевод зарегистрирован и в настоящее время ожидает проверки нашей административной службой.",
    pendingFooter: "Вы получите уведомление, как только перевод будет обработан.",

    validatedSubj: "Перевод подтверждён администрацией",
    validatedGreet: "Уважаемый(ая) {name},",
    validatedIntro: "Сообщаем, что ваш ожидающий перевод был подтверждён нашей административной службой и успешно обработан.",
    validatedFooter: "Средства будут зачислены на счёт получателя в течение 24–48 рабочих часов. Благодарим за доверие.",

    cancelledSubj: "Перевод отменён администрацией",
    cancelledGreet: "Уважаемый(ая) {name},",
    cancelledIntro: "Сообщаем, что ваш перевод был отменён нашей административной службой. Сумма была возвращена на ваш счёт.",
    cancelledFooter: "Вы можете проверить свой новый баланс в личном кабинете.",

    refundSubj: "Перевод возвращён",
    refundGreet: "Уважаемый(ая) {name},",
    refundIntro: "Сообщаем, что сумма вашего перевода была вам возвращена. Вот подробности:",
    refundFooter: "Сумма была возвращена на ваш счёт. Благодарим за понимание.",

    userCancelledSubj: "Перевод отменён",
    userCancelledGreet: "Уважаемый(ая) {name},",
    userCancelledIntro: "Подтверждаем, что ваш перевод был отменён. Никакая сумма не была списана с вашего счёта.",
    userCancelledFooter: "Если вы не инициировали эту отмену, немедленно свяжитесь с нашей службой поддержки.",

    adminConnectionSubj: " Новое подключение клиента в App Pay",
    adminConnectionGreet: "Здравствуйте, Администратор,",
    adminConnectionIntro: "Следующий клиент только что вошёл в свой аккаунт App Pay. Вот детали подключения:",
    adminConnectionFooter: "Это письмо автоматически отправляется администратору при каждом входе клиента."
},

// ═══════════════════════════════════════════════════════
// LANGUE : ARABE (ar)
// ═══════════════════════════════════════════════════════
ar: {
    loginSubj: "مرحبًا بك في App Pay – بيانات تسجيل الدخول الخاصة بك",
    loginGreet: "عزيزي/عزيزتي {name}،",
    loginIntro: "يسعدنا تأكيد فتح حسابك لدى App Pay. نشكرك على ثقتك. للوصول إلى بوابة العملاء عبر الإنترنت، إليك بيانات تسجيل الدخول الخاصة بك:",
    loginFooter: "من أجل سلامتك، نوصيك بالحفاظ على سرية هذه المعلومات. لا تشارك رمز PIN الخاص بك مع أي شخص أبدًا.",
    
    actSubj: "رمز التفعيل الخاص بك لتحويلات App Pay",
    actGreet: "عزيزي/عزيزتي {name}،",
    actIntro: "لضمان أمان معاملاتك، تجد أدناه رمز التفعيل الشخصي الخاص بك. سيُطلب منك هذا الرمز للتحقق من صحة كل تحويل من تحويلاتك:",
    actFooter: "احتفظ بهذا الرمز في مكان آمن. إنه شخصي وسري للغاية. لا تشارك هذا الرمز مع أي طرف ثالث أبدًا، حتى لو ادّعى أنه مستشار App Pay.",

    successSubj: "تأكيد تحويل App Pay الخاص بك",
    successGreet: "عزيزي/عزيزتي {name}،",
    successIntro: "نؤكد لك أن تحويلك قد تمت معالجته بنجاح. فيما يلي ملخص العملية:",
    successFooter: "سيتم إيداع المبلغ في حساب المستفيد خلال 24 إلى 48 ساعة عمل. شكرًا لثقتك.",

    failedSubj: "تنبيه: تم حظر تحويل App Pay الخاص بك",
    failedGreet: "عزيزي/عزيزتي {name}،",
    failedIntro: "نبلغك بأن محاولة تحويل على حسابك قد تم حظرها من قِبل أنظمة الأمان لدينا. فيما يلي التفاصيل:",
    failedFooter: "لم يتم خصم أي مبلغ. يرجى الاتصال بخدمة العملاء للحصول على مزيد من المعلومات.",

    pendingSubj: "تحويل App Pay الخاص بك في انتظار التحقق",
    pendingGreet: "عزيزي/عزيزتي {name}،",
    pendingIntro: "نبلغك بأن تحويلك قد تم تسجيله وهو حاليًا في انتظار التحقق من قِبل خدمتنا الإدارية.",
    pendingFooter: "ستتلقى إشعارًا بمجرد معالجة التحويل.",

    validatedSubj: "تم التحقق من التحويل من قبل الإدارة",
    validatedGreet: "عزيزي/عزيزتي {name}،",
    validatedIntro: "نبلغك بأن تحويلك المعلق قد تم التحقق منه من قِبل خدمتنا الإدارية وتمت معالجته بنجاح.",
    validatedFooter: "سيتم إيداع المبلغ في حساب المستفيد خلال 24 إلى 48 ساعة عمل. شكرًا لثقتك.",

    cancelledSubj: "تم إلغاء التحويل من قبل الإدارة",
    cancelledGreet: "عزيزي/عزيزتي {name}،",
    cancelledIntro: "نبلغك بأن تحويلك قد تم إلغاؤه من قِبل خدمتنا الإدارية. تمت إعادة إيداع المبلغ في حسابك.",
    cancelledFooter: "يمكنك التحقق من رصيدك الجديد في بوابة العملاء الخاصة بك.",

    refundSubj: "تم استرداد التحويل",
    refundGreet: "عزيزي/عزيزتي {name}،",
    refundIntro: "نبلغك بأنه تم استرداد مبلغ تحويلك. فيما يلي التفاصيل:",
    refundFooter: "تمت إعادة إيداع المبلغ في حسابك. شكرًا لتفهمك.",

    userCancelledSubj: "تم إلغاء التحويل",
    userCancelledGreet: "عزيزي/عزيزتي {name}،",
    userCancelledIntro: "نؤكد لك أن تحويلك قد تم إلغاؤه. لم يتم خصم أي مبلغ من حسابك.",
    userCancelledFooter: "إذا لم تكن أنت من بدأ هذا الإلغاء، فيرجى الاتصال بخدمة العملاء لدينا على الفور.",

    adminConnectionSubj: " اتصال عميل جديد على App Pay",
    adminConnectionGreet: "مرحبًا أيها المسؤول،",
    adminConnectionIntro: "قام العميل التالي للتو بتسجيل الدخول إلى حساب App Pay الخاص به. فيما يلي تفاصيل الاتصال:",
    adminConnectionFooter: "يتم إرسال هذا البريد الإلكتروني تلقائيًا إلى المسؤول في كل مرة يقوم فيها العميل بتسجيل الدخول."
},
// ═══════════════════════════════════════════════════════
// LANGUE : CHINOIS (zh)
// ═══════════════════════════════════════════════════════
zh: {
    loginSubj: "欢迎来到 App Pay – 您的登录凭据",
    loginGreet: "尊敬的 {name}，",
    loginIntro: "我们很高兴确认您已成功在 App Pay 开设账户。感谢您的信任。要访问您的在线客户门户，请使用以下登录凭据：",
    loginFooter: "为了您的安全，我们建议您对此信息保密。切勿与任何人分享您的 PIN 码。",
    
    actSubj: "您的 App Pay 转账激活码",
    actGreet: "尊敬的 {name}，",
    actIntro: "为了确保您交易的安全，请在下方查看您的个人激活码。每次转账时都需要此代码进行验证：",
    actFooter: "请将此代码保存在安全的地方。它是严格个人且保密的。切勿将此代码分享给第三方，即使他们自称是 App Pay 的顾问。",

    successSubj: "您的 App Pay 转账确认",
    successGreet: "尊敬的 {name}，",
    successIntro: "我们确认您的转账已成功处理。以下是操作摘要：",
    successFooter: "资金将在 24 至 48 个工作小时内存入收款人的账户。感谢您的信任。",

    failedSubj: "警报：您的 App Pay 转账已被阻止",
    failedGreet: "尊敬的 {name}，",
    failedIntro: "我们通知您，您账户上的一笔转账尝试已被我们的安全系统阻止。以下是详细信息：",
    failedFooter: "未扣除任何金额。请联系客户服务以获取更多信息。",

    pendingSubj: "您的 App Pay 转账正在等待验证",
    pendingGreet: "尊敬的 {name}，",
    pendingIntro: "我们通知您，您的转账已登记，目前正在等待我们的行政服务部门进行验证。",
    pendingFooter: "转账处理后，您将收到通知。",

    validatedSubj: "转账已由管理员验证",
    validatedGreet: "尊敬的 {name}，",
    validatedIntro: "我们通知您，您待处理的转账已由我们的行政服务部门验证并成功处理。",
    validatedFooter: "资金将在 24 至 48 个工作小时内存入收款人的账户。感谢您的信任。",

    cancelledSubj: "转账已由管理员取消",
    cancelledGreet: "尊敬的 {name}，",
    cancelledIntro: "我们通知您，您的转账已由我们的行政服务部门取消。该金额已重新存入您的账户。",
    cancelledFooter: "您可以在客户门户中查看您的新余额。",

    refundSubj: "转账已退款",
    refundGreet: "尊敬的 {name}，",
    refundIntro: "我们通知您，您的转账金额已退还给您。以下是详细信息：",
    refundFooter: "该金额已重新存入您的账户。感谢您的理解。",

    userCancelledSubj: "转账已取消",
    userCancelledGreet: "尊敬的 {name}，",
    userCancelledIntro: "我们确认您的转账已被取消。未从您的账户中扣除任何金额。",
    userCancelledFooter: "如果不是您发起的此取消操作，请立即联系我们的客户服务。",

    adminConnectionSubj: " App Pay 上的新客户连接",
    adminConnectionGreet: "您好，管理员，",
    adminConnectionIntro: "以下客户刚刚登录了其 App Pay 账户。以下是连接详情：",
    adminConnectionFooter: "每次客户登录时，此邮件都会自动发送给管理员。"
},

// ═══════════════════════════════════════════════════════
// LANGUE : JAPONAIS (ja)
// ═══════════════════════════════════════════════════════
ja: {
    loginSubj: "App Payへようこそ – ログイン情報のお知らせ",
    loginGreet: "{name} 様,",
    loginIntro: "App Payへのアカウント開設を確認いたしました。ご信頼をいただきありがとうございます。オンラインクライアントポータルにアクセスするためのログイン情報は以下の通りです：",
    loginFooter: "セキュリティのため、この情報は厳重に管理してください。PINコードは絶対に他人と共有しないでください。",
    
    actSubj: "App Pay送金のアクティベーションコード",
    actGreet: "{name} 様,",
    actIntro: "お取引の安全を確保するため、以下にあなたの個人アクティベーションコードを記載します。各送金を検証する際にこのコードが必要になります：",
    actFooter: "このコードは安全な場所に保管してください。これは厳密に個人専用かつ機密情報です。たとえApp Payのアドバイザーを名乗る相手であっても、このコードを第三者と共有しないでください。",

    successSubj: "App Pay送金の確認",
    successGreet: "{name} 様,",
    successIntro: "あなたの送金が正常に処理されたことを確認いたします。お取引の概要は以下の通りです：",
    successFooter: "資金は24〜48営業時間以内に受取人の口座に入金されます。ご信頼ありがとうございます。",

    failedSubj: "警告: App Payの送金がブロックされました",
    failedGreet: "{name} 様,",
    failedIntro: "あなたの口座への送金試行が、当社のセキュリティシステムによってブロックされたことをお知らせします。詳細は以下の通りです：",
    failedFooter: "金額は引き落とされていません。詳細についてはカスタマーサービスにお問い合わせください。",

    pendingSubj: "App Payの送金は検証待ちです",
    pendingGreet: "{name} 様,",
    pendingIntro: "あなたの送金が登録され、現在当社の管理サービスによる検証待ちであることをお知らせします。",
    pendingFooter: "送金が処理され次第、通知が届きます。",

    validatedSubj: "送金が管理者によって承認されました",
    validatedGreet: "{name} 様,",
    validatedIntro: "保留中の送金が当社の管理サービスによって承認され、正常に処理されたことをお知らせします。",
    validatedFooter: "資金は24〜48営業時間以内に受取人の口座に入金されます。ご信頼ありがとうございます。",

    cancelledSubj: "送金が管理者によってキャンセルされました",
    cancelledGreet: "{name} 様,",
    cancelledIntro: "あなたの送金が当社の管理サービスによってキャンセルされたことをお知らせします。金額はあなたの口座に再入金されました。",
    cancelledFooter: "新しい残高はクライアントポータルで確認できます。",

    refundSubj: "送金が返金されました",
    refundGreet: "{name} 様,",
    refundIntro: "あなたの送金額が返金されたことをお知らせします。詳細は以下の通りです：",
    refundFooter: "金額はあなたの口座に再入金されました。ご理解ありがとうございます。",

    userCancelledSubj: "送金がキャンセルされました",
    userCancelledGreet: "{name} 様,",
    userCancelledIntro: "あなたの送金がキャンセルされたことを確認いたします。あなたの口座から金額は引き落とされていません。",
    userCancelledFooter: "このキャンセルをあなたが開始していない場合は、すぐにカスタマーサービスにご連絡ください。",

    adminConnectionSubj: " App Payでの新しいクライアント接続",
    adminConnectionGreet: "管理者様,",
    adminConnectionIntro: "以下のクライアントがApp Payアカウントにログインしました。接続の詳細は以下の通りです：",
    adminConnectionFooter: "このメールは、クライアントがログインするたびに管理者に自動送信されます。"
},

// ═══════════════════════════════════════════════════════
// LANGUE : CORÉEN (ko)
// ═══════════════════════════════════════════════════════
ko: {
    loginSubj: "App Pay에 오신 것을 환영합니다 – 로그인 정보",
    loginGreet: "{name} 님께,",
    loginIntro: "App Pay 계정 개설을 확인하게 되어 기쁩니다. 신뢰해 주셔서 감사합니다. 온라인 고객 포털에 접속하시려면 아래의 로그인 정보를 사용하십시오:",
    loginFooter: "보안을 위해 이 정보를 기밀로 유지하시기 바랍니다. PIN 코드를 누구와도 공유하지 마십시오.",
    
    actSubj: "App Pay 송금을 위한 활성화 코드",
    actGreet: "{name} 님께,",
    actIntro: "거래의 보안을 보장하기 위해 아래에 개인 활성화 코드를 안내해 드립니다. 각 송금을 검증할 때 이 코드가 필요합니다:",
    actFooter: "이 코드를 안전한 곳에 보관하십시오. 이는 엄격히 개인적이고 기밀입니다. App Pay 상담원이라고 주장하는 제3자에게도 이 코드를 절대 공유하지 마십시오.",

    successSubj: "App Pay 송금 확인",
    successGreet: "{name} 님께,",
    successIntro: "귀하의 송금이 성공적으로 처리되었음을 확인합니다. 거래 요약은 다음과 같습니다:",
    successFooter: "자금은 영업일 기준 24~48시간 이내에 수취인 계좌로 입금됩니다. 신뢰해 주셔서 감사합니다.",

    failedSubj: "경고: App Pay 송금이 차단되었습니다",
    failedGreet: "{name} 님께,",
    failedIntro: "귀하의 계좌에서 송금 시도가 당사 보안 시스템에 의해 차단되었음을 알려드립니다. 세부 사항은 다음과 같습니다:",
    failedFooter: "금액은 청구되지 않았습니다. 자세한 내용은 고객 서비스에 문의하십시오.",

    pendingSubj: "App Pay 송금이 검증 대기 중입니다",
    pendingGreet: "{name} 님께,",
    pendingIntro: "귀하의 송금이 등록되었으며 현재 당사 행정 서비스의 검증을 기다리고 있음을 알려드립니다.",
    pendingFooter: "송금이 처리되는 즉시 알림을 받으실 수 있습니다.",

    validatedSubj: "송금이 관리자에 의해 승인되었습니다",
    validatedGreet: "{name} 님께,",
    validatedIntro: "귀하의 대기 중인 송금이 당사 행정 서비스에 의해 승인되어 성공적으로 처리되었음을 알려드립니다.",
    validatedFooter: "자금은 영업일 기준 24~48시간 이내에 수취인 계좌로 입금됩니다. 신뢰해 주셔서 감사합니다.",

    cancelledSubj: "송금이 관리자에 의해 취소되었습니다",
    cancelledGreet: "{name} 님께,",
    cancelledIntro: "귀하의 송금이 당사 행정 서비스에 의해 취소되었음을 알려드립니다. 금액이 귀하의 계좌로 다시 입금되었습니다.",
    cancelledFooter: "고객 포털에서 새 잔액을 확인하실 수 있습니다.",

    refundSubj: "송금이 환불되었습니다",
    refundGreet: "{name} 님께,",
    refundIntro: "귀하의 송금 금액이 환불되었음을 알려드립니다. 세부 사항은 다음과 같습니다:",
    refundFooter: "금액이 귀하의 계좌로 다시 입금되었습니다. 이해해 주셔서 감사합니다.",

    userCancelledSubj: "송금이 취소되었습니다",
    userCancelledGreet: "{name} 님께,",
    userCancelledIntro: "귀하의 송금이 취소되었음을 확인합니다. 귀하의 계좌에서 금액이 청구되지 않았습니다.",
    userCancelledFooter: "본인이 이 취소를 시작하지 않은 경우 즉시 고객 서비스에 문의하십시오.",

    adminConnectionSubj: " App Pay의 새로운 고객 연결",
    adminConnectionGreet: "관리자님께,",
    adminConnectionIntro: "다음 고객이 방금 App Pay 계정에 로그인했습니다. 연결 세부 사항은 다음과 같습니다:",
    adminConnectionFooter: "이 이메일은 고객이 로그인할 때마다 관리자에게 자동으로 전송됩니다."
},

// ═══════════════════════════════════════════════════════
// LANGUE : TURC (tr)
// ═══════════════════════════════════════════════════════
tr: {
    loginSubj: "App Pay'e Hoş Geldiniz – Giriş Bilgileriniz",
    loginGreet: "Sayın {name},",
    loginIntro: "App Pay'de hesabınızın açıldığını teyit etmekten memnuniyet duyarız. Bize güvendiğiniz için teşekkür ederiz. Çevrimiçi müşteri portalınıza erişmek için giriş bilgileriniz aşağıdadır:",
    loginFooter: "Güvenliğiniz için bu bilgileri gizli tutmanızı öneririz. PIN kodunuzu asla kimseyle paylaşmayın.",
    
    actSubj: "App Pay Transferleriniz için Aktivasyon Kodunuz",
    actGreet: "Sayın {name},",
    actIntro: "İşlemlerinizin güvenliğini sağlamak için kişisel aktivasyon kodunuz aşağıda yer almaktadır. Her transferinizi onaylamak için bu kod istenecektir:",
    actFooter: "Bu kodu güvenli bir yerde saklayın. Kesinlikle kişisel ve gizlidir. App Pay danışmanı olduğunu iddia etseler bile bu kodu asla üçüncü şahıslarla paylaşmayın.",

    successSubj: "App Pay Transferinizin Onayı",
    successGreet: "Sayın {name},",
    successIntro: "Transferinizin başarıyla işlendiğini teyit ederiz. İşlemin özeti aşağıdadır:",
    successFooter: "Para, 24 ila 48 iş saati içinde alıcının hesabına geçecektir. Güveniniz için teşekkür ederiz.",

    failedSubj: "Uyarı: App Pay Transferiniz Engellendi",
    failedGreet: "Sayın {name},",
    failedIntro: "Hesabınızdan bir transfer girişiminin güvenlik sistemlerimiz tarafından engellendiğini bildiririz. Detaylar aşağıdadır:",
    failedFooter: "Hiçbir tutar çekilmemiştir. Daha fazla bilgi için lütfen müşteri hizmetleriyle iletişime geçin.",

    pendingSubj: "App Pay Transferiniz Doğrulama Bekliyor",
    pendingGreet: "Sayın {name},",
    pendingIntro: "Transferinizin kaydedildiğini ve şu anda idari hizmetimiz tarafından doğrulanmayı beklediğini bildiririz.",
    pendingFooter: "Transfer işlendiğinde bildirim alacaksınız.",

    validatedSubj: "Transfer Yönetim Tarafından Onaylandı",
    validatedGreet: "Sayın {name},",
    validatedIntro: "Bekleyen transferinizin idari hizmetimiz tarafından onaylandığını ve başarıyla işlendiğini bildiririz.",
    validatedFooter: "Para, 24 ila 48 iş saati içinde alıcının hesabına geçecektir. Güveniniz için teşekkür ederiz.",

    cancelledSubj: "Transfer Yönetim Tarafından İptal Edildi",
    cancelledGreet: "Sayın {name},",
    cancelledIntro: "Transferinizin idari hizmetimiz tarafından iptal edildiğini bildiririz. Tutar hesabınıza yeniden yatırıldı.",
    cancelledFooter: "Yeni bakiyenizi müşteri portalınızdan kontrol edebilirsiniz.",

    refundSubj: "Transfer İade Edildi",
    refundGreet: "Sayın {name},",
    refundIntro: "Transfer tutarınızın size iade edildiğini bildiririz. Detaylar aşağıdadır:",
    refundFooter: "Tutar hesabınıza yeniden yatırıldı. Anlayışınız için teşekkür ederiz.",

    userCancelledSubj: "Transfer İptal Edildi",
    userCancelledGreet: "Sayın {name},",
    userCancelledIntro: "Transferinizin iptal edildiğini teyit ederiz. Hesabınızdan hiçbir tutar çekilmemiştir.",
    userCancelledFooter: "Bu iptali siz başlatmadıysanız, lütfen derhal müşteri hizmetlerimizle iletişime geçin.",

    adminConnectionSubj: " App Pay'de Yeni Müşteri Bağlantısı",
    adminConnectionGreet: "Merhaba Yönetici,",
    adminConnectionIntro: "Aşağıdaki müşteri az önce App Pay hesabına giriş yaptı. Bağlantı detayları aşağıdadır:",
    adminConnectionFooter: "Bu e-posta, bir müşteri her giriş yaptığında yöneticiye otomatik olarak gönderilir."
},

// ═══════════════════════════════════════════════════════
// LANGUE : VIETNAMIEN (vi)
// ═══════════════════════════════════════════════════════
vi: {
    loginSubj: "Chào mừng đến với App Pay – Thông tin đăng nhập của bạn",
    loginGreet: "Kính gửi {name},",
    loginIntro: "Chúng tôi vui mừng xác nhận việc mở tài khoản của bạn tại App Pay. Cảm ơn bạn đã tin tưởng. Để truy cập cổng thông tin khách hàng trực tuyến, đây là thông tin đăng nhập của bạn:",
    loginFooter: "Vì sự an toàn của bạn, chúng tôi khuyên bạn nên giữ bí mật thông tin này. Không bao giờ chia sẻ mã PIN của bạn với bất kỳ ai.",
    
    actSubj: "Mã kích hoạt của bạn cho các giao dịch chuyển khoản App Pay",
    actGreet: "Kính gửi {name},",
    actIntro: "Để đảm bảo an toàn cho các giao dịch của bạn, vui lòng xem mã kích hoạt cá nhân của bạn dưới đây. Mã này sẽ được yêu cầu để xác nhận mỗi giao dịch chuyển khoản của bạn:",
    actFooter: "Hãy giữ mã này ở nơi an toàn. Nó hoàn toàn riêng tư và bảo mật. Không bao giờ chia sẻ mã này với bên thứ ba, ngay cả khi họ tự nhận là cố vấn của App Pay.",

    successSubj: "Xác nhận chuyển khoản App Pay của bạn",
    successGreet: "Kính gửi {name},",
    successIntro: "Chúng tôi xác nhận rằng giao dịch chuyển khoản của bạn đã được xử lý thành công. Đây là tóm tắt của giao dịch:",
    successFooter: "Tiền sẽ được ghi có vào tài khoản của người thụ hưởng trong vòng 24 đến 48 giờ làm việc. Cảm ơn bạn đã tin tưởng.",

    failedSubj: "Cảnh báo: Chuyển khoản App Pay của bạn đã bị chặn",
    failedGreet: "Kính gửi {name},",
    failedIntro: "Chúng tôi thông báo rằng một nỗ lực chuyển khoản trên tài khoản của bạn đã bị hệ thống bảo mật của chúng tôi chặn. Đây là chi tiết:",
    failedFooter: "Không có khoản tiền nào bị trừ. Vui lòng liên hệ dịch vụ khách hàng để biết thêm thông tin.",

    pendingSubj: "Chuyển khoản App Pay của bạn đang chờ xác minh",
    pendingGreet: "Kính gửi {name},",
    pendingIntro: "Chúng tôi thông báo rằng giao dịch chuyển khoản của bạn đã được đăng ký và hiện đang chờ xác minh bởi bộ phận hành chính của chúng tôi.",
    pendingFooter: "Bạn sẽ nhận được thông báo ngay khi giao dịch chuyển khoản được xử lý.",

    validatedSubj: "Chuyển khoản được xác nhận bởi ban quản trị",
    validatedGreet: "Kính gửi {name},",
    validatedIntro: "Chúng tôi thông báo rằng giao dịch chuyển khoản đang chờ xử lý của bạn đã được ban quản trị của chúng tôi xác nhận và xử lý thành công.",
    validatedFooter: "Tiền sẽ được ghi có vào tài khoản của người thụ hưởng trong vòng 24 đến 48 giờ làm việc. Cảm ơn bạn đã tin tưởng.",

    cancelledSubj: "Chuyển khoản bị hủy bởi ban quản trị",
    cancelledGreet: "Kính gửi {name},",
    cancelledIntro: "Chúng tôi thông báo rằng giao dịch chuyển khoản của bạn đã bị ban quản trị của chúng tôi hủy bỏ. Số tiền đã được ghi lại vào tài khoản của bạn.",
    cancelledFooter: "Bạn có thể kiểm tra số dư mới của mình trong cổng thông tin khách hàng.",

    refundSubj: "Chuyển khoản đã được hoàn tiền",
    refundGreet: "Kính gửi {name},",
    refundIntro: "Chúng tôi thông báo rằng số tiền chuyển khoản của bạn đã được hoàn trả cho bạn. Đây là chi tiết:",
    refundFooter: "Số tiền đã được ghi lại vào tài khoản của bạn. Cảm ơn bạn đã thông cảm.",

    userCancelledSubj: "Chuyển khoản đã bị hủy",
    userCancelledGreet: "Kính gửi {name},",
    userCancelledIntro: "Chúng tôi xác nhận rằng giao dịch chuyển khoản của bạn đã bị hủy. Không có khoản tiền nào bị trừ khỏi tài khoản của bạn.",
    userCancelledFooter: "Nếu bạn không phải là người khởi tạo việc hủy này, vui lòng liên hệ ngay với dịch vụ khách hàng của chúng tôi.",

    adminConnectionSubj: " Kết nối khách hàng mới trên App Pay",
    adminConnectionGreet: "Xin chào Quản trị viên,",
    adminConnectionIntro: "Khách hàng sau vừa đăng nhập vào tài khoản App Pay của họ. Đây là chi tiết kết nối:",
    adminConnectionFooter: "Email này được tự động gửi đến quản trị viên mỗi khi khách hàng đăng nhập."
},
// ═══════════════════════════════════════════════════════
// LANGUE : SUÉDOIS (sv)
// ═══════════════════════════════════════════════════════
sv: {
    loginSubj: "Välkommen till App Pay – Dina inloggningsuppgifter",
    loginGreet: "Bästa {name},",
    loginIntro: "Vi är glada att kunna bekräfta öppnandet av ditt konto hos App Pay. Tack för ditt förtroende. För att komma åt din onlinekundportal, här är dina inloggningsuppgifter:",
    loginFooter: "För din säkerhet rekommenderar vi att du håller denna information konfidentiell. Dela aldrig din PIN-kod med någon.",
    
    actSubj: "Din aktiveringskod för App Pay-överföringar",
    actGreet: "Bästa {name},",
    actIntro: "För att säkerställa säkerheten för dina transaktioner, vänligen se din personliga aktiveringskod nedan. Denna kod krävs för att validera var och en av dina överföringar:",
    actFooter: "Förvara denna kod på ett säkert ställe. Den är strikt personlig och konfidentiell. Dela aldrig denna kod med en tredje part, även om de hävdar att de är en App Pay-rådgivare.",

    successSubj: "Bekräftelse av din App Pay-överföring",
    successGreet: "Bästa {name},",
    successIntro: "Vi bekräftar att din överföring har behandlats framgångsrikt. Här är sammanfattningen av operationen:",
    successFooter: "Pengarna kommer att krediteras mottagarens konto inom 24 till 48 banktimmar. Tack för ditt förtroende.",

    failedSubj: "Varning: Din App Pay-överföring blockerades",
    failedGreet: "Bästa {name},",
    failedIntro: "Vi informerar dig om att ett överföringsförsök på ditt konto blockerades av våra säkerhetssystem. Här är detaljerna:",
    failedFooter: "Inget belopp drogs. Kontakta kundtjänst för mer information.",

    pendingSubj: "Din App Pay-överföring väntar på validering",
    pendingGreet: "Bästa {name},",
    pendingIntro: "Vi informerar dig om att din överföring har registrerats och för närvarande väntar på validering av vår administrativa tjänst.",
    pendingFooter: "Du kommer att få ett meddelande så snart överföringen har behandlats.",

    validatedSubj: "Överföring validerad av administrationen",
    validatedGreet: "Bästa {name},",
    validatedIntro: "Vi informerar dig om att din väntande överföring har validerats av vår administrativa tjänst och behandlats framgångsrikt.",
    validatedFooter: "Pengarna kommer att krediteras mottagarens konto inom 24 till 48 banktimmar. Tack för ditt förtroende.",

    cancelledSubj: "Överföring avbruten av administrationen",
    cancelledGreet: "Bästa {name},",
    cancelledIntro: "Vi informerar dig om att din överföring har avbrutits av vår administrativa tjänst. Beloppet har återkrediterats till ditt konto.",
    cancelledFooter: "Du kan kontrollera ditt nya saldo i din kundportal.",

    refundSubj: "Överföring återbetald",
    refundGreet: "Bästa {name},",
    refundIntro: "Vi informerar dig om att beloppet för din överföring har återbetalats till dig. Här är detaljerna:",
    refundFooter: "Beloppet har återkrediterats till ditt konto. Tack för din förståelse.",

    userCancelledSubj: "Överföring avbruten",
    userCancelledGreet: "Bästa {name},",
    userCancelledIntro: "Vi bekräftar att din överföring har avbrutits. Inget belopp drogs från ditt konto.",
    userCancelledFooter: "Om du inte initierade denna avbokning, vänligen kontakta vår kundtjänst omedelbart.",

    adminConnectionSubj: " Ny klientanslutning på App Pay",
    adminConnectionGreet: "Hej Administratör,",
    adminConnectionIntro: "Följande klient loggade precis in på sitt App Pay-konto. Här är anslutningsdetaljerna:",
    adminConnectionFooter: "Detta e-postmeddelande skickas automatiskt till administratören varje gång en klient loggar in."
},

// ═══════════════════════════════════════════════════════
// LANGUE : NORVÉGIEN (no)
// ═══════════════════════════════════════════════════════
no: {
    loginSubj: "Velkommen til App Pay – Dine påloggingsdetaljer",
    loginGreet: "Kjære {name},",
    loginIntro: "Vi er glade for å bekrefte åpningen av kontoen din hos App Pay. Takk for din tillit. For å få tilgang til kundeportalen din på nettet, her er påloggingsdetaljene dine:",
    loginFooter: "For din sikkerhet anbefaler vi at du holder denne informasjonen konfidensiell. Del aldri PIN-koden din med noen.",
    
    actSubj: "Din aktiveringskode for App Pay-overføringer",
    actGreet: "Kjære {name},",
    actIntro: "For å sikre sikkerheten til transaksjonene dine, vennligst se din personlige aktiveringskode nedenfor. Denne koden kreves for å validere hver av overføringene dine:",
    actFooter: "Oppbevar denne koden på et trygt sted. Den er strengt personlig og konfidensiell. Del aldri denne koden med en tredjepart, selv om de hevder å være en App Pay-rådgiver.",

    successSubj: "Bekreftelse på din App Pay-overføring",
    successGreet: "Kjære {name},",
    successIntro: "Vi bekrefter at overføringen din er behandlet. Her er sammendraget av operasjonen:",
    successFooter: "Pengene vil bli kreditert mottakerens konto innen 24 til 48 banktimer. Takk for din tillit.",

    failedSubj: "Advarsel: Din App Pay-overføring ble blokkert",
    failedGreet: "Kjære {name},",
    failedIntro: "Vi informerer deg om at et overføringsforsøk på kontoen din ble blokkert av sikkerhetssystemene våre. Her er detaljene:",
    failedFooter: "Ingen beløp ble debitert. Vennligst kontakt kundeservice for mer informasjon.",

    pendingSubj: "Din App Pay-overføring venter på validering",
    pendingGreet: "Kjære {name},",
    pendingIntro: "Vi informerer deg om at overføringen din er registrert og for øyeblikket venter på validering av vår administrative tjeneste.",
    pendingFooter: "Du vil motta et varsel så snart overføringen er behandlet.",

    validatedSubj: "Overføring validert av administrasjonen",
    validatedGreet: "Kjære {name},",
    validatedIntro: "Vi informerer deg om at din ventende overføring er validert av vår administrative tjeneste og behandlet.",
    validatedFooter: "Pengene vil bli kreditert mottakerens konto innen 24 til 48 banktimer. Takk for din tillit.",

    cancelledSubj: "Overføring kansellert av administrasjonen",
    cancelledGreet: "Kjære {name},",
    cancelledIntro: "Vi informerer deg om at overføringen din er kansellert av vår administrative tjeneste. Beløpet er re-kreditert til kontoen din.",
    cancelledFooter: "Du kan sjekke din nye saldo i kundeportalen din.",

    refundSubj: "Overføring refundert",
    refundGreet: "Kjære {name},",
    refundIntro: "Vi informerer deg om at beløpet for overføringen din er refundert til deg. Her er detaljene:",
    refundFooter: "Beløpet er re-kreditert til kontoen din. Takk for din forståelse.",

    userCancelledSubj: "Overføring kansellert",
    userCancelledGreet: "Kjære {name},",
    userCancelledIntro: "Vi bekrefter at overføringen din er kansellert. Ingen beløp ble debitert fra kontoen din.",
    userCancelledFooter: "Hvis du ikke startet denne kanselleringen, vennligst kontakt kundeservice umiddelbart.",

    adminConnectionSubj: " Ny klienttilkobling på App Pay",
    adminConnectionGreet: "Hei Administrator,",
    adminConnectionIntro: "Følgende klient logget nettopp på sin App Pay-konto. Her er tilkoblingsdetaljene:",
    adminConnectionFooter: "Denne e-posten sendes automatisk til administratoren hver gang en klient logger på."
},

// ═══════════════════════════════════════════════════════
// LANGUE : DANOIS (da)
// ═══════════════════════════════════════════════════════
da: {
    loginSubj: "Velkommen til App Pay – Dine loginoplysninger",
    loginGreet: "Kære {name},",
    loginIntro: "Vi er glade for at kunne bekræfte åbningen af din konto hos App Pay. Tak for din tillid. For at få adgang til din online kundeportal, er her dine loginoplysninger:",
    loginFooter: "For din sikkerhed anbefaler vi, at du holder disse oplysninger fortrolige. Del aldrig din PIN-kode med nogen.",
    
    actSubj: "Din aktiveringskode til App Pay-overførsler",
    actGreet: "Kære {name},",
    actIntro: "For at sikre sikkerheden af dine transaktioner, finder du din personlige aktiveringskode nedenfor. Denne kode er påkrævet for at validere hver af dine overførsler:",
    actFooter: "Opbevar denne kode på et sikkert sted. Den er strengt personlig og fortrolig. Del aldrig denne kode med en tredjepart, selvom de hævder at være en App Pay-rådgiver.",

    successSubj: "Bekræftelse på din App Pay-overførsel",
    successGreet: "Kære {name},",
    successIntro: "Vi bekræfter, at din overførsel er blevet behandlet med succes. Her er oversigten over transaktionen:",
    successFooter: "Pengene vil blive krediteret modtagerens konto inden for 24 til 48 banktimer. Tak for din tillid.",

    failedSubj: "Advarsel: Din App Pay-overførsel blev blokeret",
    failedGreet: "Kære {name},",
    failedIntro: "Vi informerer dig om, at et overførselsforsøg på din konto blev blokeret af vores sikkerhedssystemer. Her er detaljerne:",
    failedFooter: "Intet beløb blev debiteret. Kontakt venligst kundeservice for mere information.",

    pendingSubj: "Din App Pay-overførsel afventer validering",
    pendingGreet: "Kære {name},",
    pendingIntro: "Vi informerer dig om, at din overførsel er registreret og i øjeblikket afventer validering af vores administrative service.",
    pendingFooter: "Du vil modtage en meddelelse, så snart overførslen er behandlet.",

    validatedSubj: "Overførsel valideret af administrationen",
    validatedGreet: "Kære {name},",
    validatedIntro: "Vi informerer dig om, at din ventende overførsel er blevet valideret af vores administrative service og behandlet med succes.",
    validatedFooter: "Pengene vil blive krediteret modtagerens konto inden for 24 til 48 banktimer. Tak for din tillid.",

    cancelledSubj: "Overførsel annulleret af administrationen",
    cancelledGreet: "Kære {name},",
    cancelledIntro: "Vi informerer dig om, at din overførsel er blevet annulleret af vores administrative service. Beløbet er blevet genkrediteret til din konto.",
    cancelledFooter: "Du kan kontrollere din nye saldo i din kundeportal.",

    refundSubj: "Overførsel tilbagebetalt",
    refundGreet: "Kære {name},",
    refundIntro: "Vi informerer dig om, at beløbet for din overførsel er blevet tilbagebetalt til dig. Her er detaljerne:",
    refundFooter: "Beløbet er blevet genkrediteret til din konto. Tak for din forståelse.",

    userCancelledSubj: "Overførsel annulleret",
    userCancelledGreet: "Kære {name},",
    userCancelledIntro: "Vi bekræfter, at din overførsel er blevet annulleret. Intet beløb blev debiteret fra din konto.",
    userCancelledFooter: "Hvis du ikke igangsatte denne annullering, bedes du straks kontakte vores kundeservice.",

    adminConnectionSubj: " Ny klientforbindelse på App Pay",
    adminConnectionGreet: "Hej Administrator,",
    adminConnectionIntro: "Følgende klient loggede netop ind på sin App Pay-konto. Her er forbindelsesdetaljerne:",
    adminConnectionFooter: "Denne e-mail sendes automatisk til administratoren, hver gang en klient logger ind."
},

// ═══════════════════════════════════════════════════════
// LANGUE : FINNOIS (fi)
// ═══════════════════════════════════════════════════════
fi: {
    loginSubj: "Tervetuloa App Payhin – Kirjautumistietosi",
    loginGreet: "Hyvä {name},",
    loginIntro: "Olemme iloisia voidessamme vahvistaa App Pay -tilisi avaamisen. Kiitos luottamuksestasi. Päästäksesi verkkoportaaliisi, tässä ovat kirjautumistietosi:",
    loginFooter: "Turvallisuutesi vuoksi suosittelemme pitämään nämä tiedot luottamuksellisina. Älä koskaan jaa PIN-koodiasi kenellekään.",
    
    actSubj: "Aktivointikoodisi App Pay -tilisiirtoihin",
    actGreet: "Hyvä {name},",
    actIntro: "Varmistaaksesi tapahtumiesi turvallisuuden, löydät henkilökohtaisen aktivointikoodisi alta. Tämä koodi vaaditaan jokaisen tilisiirtosi vahvistamiseen:",
    actFooter: "Säilytä tämä koodi turvallisessa paikassa. Se on ehdottoman henkilökohtainen ja luottamuksellinen. Älä koskaan jaa tätä koodia kolmannelle osapuolelle, vaikka he väittäisivät olevansa App Pay -neuvojia.",

    successSubj: "Vahvistus App Pay -tilisiirrostasi",
    successGreet: "Hyvä {name},",
    successIntro: "Vahvistamme, että tilisiirtosi on käsitelty onnistuneesti. Tässä on yhteenveto tapahtumasta:",
    successFooter: "Varat hyvitetään vastaanottajan tilille 24–48 pankkipäivän kuluessa. Kiitos luottamuksestasi.",

    failedSubj: "Varoitus: App Pay -tilisiirtosi estettiin",
    failedGreet: "Hyvä {name},",
    failedIntro: "Ilmoitamme, että tilisiirtoyritys tililläsi estettiin turvajärjestelmiemme toimesta. Tässä ovat yksityiskohdat:",
    failedFooter: "Mitään summaa ei veloitettu. Ota yhteyttä asiakaspalveluun saadaksesi lisätietoja.",

    pendingSubj: "App Pay -tilisiirtosi odottaa vahvistusta",
    pendingGreet: "Hyvä {name},",
    pendingIntro: "Ilmoitamme, että tilisiirtosi on rekisteröity ja odottaa tällä hetkellä hallinnollisen palvelumme vahvistusta.",
    pendingFooter: "Saat ilmoituksen heti, kun tilisiirto on käsitelty.",

    validatedSubj: "Siirto vahvistettu hallinnon toimesta",
    validatedGreet: "Hyvä {name},",
    validatedIntro: "Ilmoitamme, että odottava tilisiirtosi on vahvistettu hallinnollisen palvelumme toimesta ja käsitelty onnistuneesti.",
    validatedFooter: "Varat hyvitetään vastaanottajan tilille 24–48 pankkipäivän kuluessa. Kiitos luottamuksestasi.",

    cancelledSubj: "Siirto peruutettu hallinnon toimesta",
    cancelledGreet: "Hyvä {name},",
    cancelledIntro: "Ilmoitamme, että tilisiirtosi on peruutettu hallinnollisen palvelumme toimesta. Summa on hyvitetty takaisin tilillesi.",
    cancelledFooter: "Voit tarkistaa uuden saldosi asiakasportaalistasi.",

    refundSubj: "Siirto hyvitetty",
    refundGreet: "Hyvä {name},",
    refundIntro: "Ilmoitamme, että tilisiirtosi summa on hyvitetty sinulle takaisin. Tässä ovat yksityiskohdat:",
    refundFooter: "Summa on hyvitetty takaisin tilillesi. Kiitos ymmärryksestäsi.",

    userCancelledSubj: "Siirto peruutettu",
    userCancelledGreet: "Hyvä {name},",
    userCancelledIntro: "Vahvistamme, että tilisiirtosi on peruutettu. Tililtäsi ei veloitettu mitään summaa.",
    userCancelledFooter: "Jos et aloittanut tätä peruutusta, ota välittömästi yhteyttä asiakaspalveluumme.",

    adminConnectionSubj: " Uusi asiakasyhteys App Payssa",
    adminConnectionGreet: "Hei Ylläpitäjä,",
    adminConnectionIntro: "Seuraava asiakas kirjautui juuri sisään App Pay -tiliinsä. Tässä ovat yhteyden tiedot:",
    adminConnectionFooter: "Tämä sähköposti lähetetään automaattisesti ylläpitäjälle aina, kun asiakas kirjautuu sisään."
},

// ═══════════════════════════════════════════════════════
// LANGUE : ISLANDAIS (is)
// ═══════════════════════════════════════════════════════
is: {
    loginSubj: "Velkomin í App Pay – Innskráningarupplýsingar þínar",
    loginGreet: "Kæri/Kæra {name},",
    loginIntro: "Við erum ánægð að staðfesta opnun reikningsins þíns hjá App Pay. Takk fyrir traustið. Til að fá aðgang að viðskiptavinagáttinni þinni á netinu, hér eru innskráningarupplýsingarnar þínar:",
    loginFooter: "Fyrir öryggi þitt mælum við með að halda þessum upplýsingum trúnaði. Deildu aldrei PIN-kóðanum þínum með neinum.",
    
    actSubj: "Virkjunarkóðinn þinn fyrir App Pay millifærslur",
    actGreet: "Kæri/Kæra {name},",
    actIntro: "Til að tryggja öryggi viðskipta þinna, vinsamlegast sjáðu persónulega virkjunarkóðann þinn hér að neðan. Þessi kóði verður krafist til að staðfesta hverja millifærslu þína:",
    actFooter: "Geymdu þennan kóða á öruggum stað. Hann er stranglega persónulegur og trúnaðarmál. Deildu þessum kóða aldrei með þriðja aðila, jafnvel þótt þeir segist vera ráðgjafar App Pay.",

    successSubj: "Staðfesting á App Pay millifærslunni þinni",
    successGreet: "Kæri/Kæra {name},",
    successIntro: "Við staðfestum að millifærslan þín hefur verið unnin með góðum árangri. Hér er samantekt aðgerðarinnar:",
    successFooter: "Fjármunirnir verða lagðir inn á reikning viðtakandans innan 24 til 48 bankadaga. Takk fyrir traustið.",

    failedSubj: "Viðvörun: App Pay millifærslan þín var lokuð",
    failedGreet: "Kæri/Kæra {name},",
    failedIntro: "Við upplýsum þig um að tilraun til millifærslu á reikninginn þinn var lokuð af öryggiskerfum okkar. Hér eru upplýsingarnar:",
    failedFooter: "Ekkert upphæð var dregin. Vinsamlegast hafðu samband við þjónustuver fyrir frekari upplýsingar.",

    pendingSubj: "App Pay millifærslan þín bíður staðfestingar",
    pendingGreet: "Kæri/Kæra {name},",
    pendingIntro: "Við upplýsum þig um að millifærslan þín hefur verið skráð og bíður nú staðfestingar frá stjórnsýsluþjónustu okkar.",
    pendingFooter: "Þú munt fá tilkynningu um leið og millifærslan hefur verið unnin.",

    validatedSubj: "Millifærsla staðfest af stjórnendum",
    validatedGreet: "Kæri/Kæra {name},",
    validatedIntro: "Við upplýsum þig um að millifærslan þín í bið hefur verið staðfest af stjórnsýsluþjónustu okkar og unnin með góðum árangri.",
    validatedFooter: "Fjármunirnir verða lagðir inn á reikning viðtakandans innan 24 til 48 bankadaga. Takk fyrir traustið.",

    cancelledSubj: "Millifærsla afturkölluð af stjórnendum",
    cancelledGreet: "Kæri/Kæra {name},",
    cancelledIntro: "Við upplýsum þig um að millifærslan þín hefur verið afturkölluð af stjórnsýsluþjónustu okkar. Upphæðin hefur verið lögð aftur inn á reikninginn þinn.",
    cancelledFooter: "Þú getur athugað nýja stöðu þína í viðskiptavinagáttinni þinni.",

    refundSubj: "Millifærsla endurgreidd",
    refundGreet: "Kæri/Kæra {name},",
    refundIntro: "Við upplýsum þig um að upphæð millifærslunnar þinnar hefur verið endurgreidd til þín. Hér eru upplýsingarnar:",
    refundFooter: "Upphæðin hefur verið lögð aftur inn á reikninginn þinn. Takk fyrir skilninginn.",

    userCancelledSubj: "Millifærsla afturkölluð",
    userCancelledGreet: "Kæri/Kæra {name},",
    userCancelledIntro: "Við staðfestum að millifærslan þín hefur verið afturkölluð. Ekkert upphæð var dregin af reikningnum þínum.",
    userCancelledFooter: "Ef þú hófst ekki þessa afturköllun, vinsamlegast hafðu strax samband við þjónustuver okkar.",

    adminConnectionSubj: " Ný tenging viðskiptavinar á App Pay",
    adminConnectionGreet: "Halló Stjórnandi,",
    adminConnectionIntro: "Eftirfarandi viðskiptavinur skráði sig rétt í þessu inn á App Pay reikninginn sinn. Hér eru upplýsingar um tenginguna:",
    adminConnectionFooter: "Þetta tölvupóstur er sjálfkrafa sent til stjórnandans í hvert skipti sem viðskiptavinur skráir sig inn."
},
// ═══════════════════════════════════════════════════════
// LANGUE : TCHÈQUE (cs)
// ═══════════════════════════════════════════════════════
cs: {
    loginSubj: "Vítejte v App Pay – Vaše přihlašovací údaje",
    loginGreet: "Vážený/á {name},",
    loginIntro: "S potěšením potvrzujeme otevření vašeho účtu v App Pay. Děkujeme za vaši důvěru. Pro přístup k vašemu online klientskému portálu uvádíme vaše přihlašovací údaje:",
    loginFooter: "Pro vaši bezpečnost doporučujeme uchovávat tyto informace v tajnosti. Nikdy nesdílejte svůj PIN kód s nikým.",
    
    actSubj: "Váš aktivační kód pro převody App Pay",
    actGreet: "Vážený/á {name},",
    actIntro: "Pro zajištění bezpečnosti vašich transakcí naleznete níže svůj osobní aktivační kód. Tento kód bude vyžadován pro ověření každého vašeho převodu:",
    actFooter: "Uchovávejte tento kód na bezpečném místě. Je přísně osobní a důvěrný. Nikdy tento kód nesdílejte s třetí stranou, i kdyby tvrdila, že je poradcem App Pay.",

    successSubj: "Potvrzení vašeho převodu App Pay",
    successGreet: "Vážený/á {name},",
    successIntro: "Potvrzujeme, že váš převod byl úspěšně zpracován. Zde je shrnutí operace:",
    successFooter: "Prostředky budou připsány na účet příjemce do 24 až 48 pracovních hodin. Děkujeme za vaši důvěru.",

    failedSubj: "Upozornění: Váš převod App Pay byl zablokován",
    failedGreet: "Vážený/á {name},",
    failedIntro: "Informujeme vás, že pokus o převod na vašem účtu byl zablokován našimi bezpečnostními systémy. Zde jsou podrobnosti:",
    failedFooter: "Nebyla odečtena žádná částka. Pro více informací kontaktujte zákaznickou podporu.",

    pendingSubj: "Váš převod App Pay čeká na ověření",
    pendingGreet: "Vážený/á {name},",
    pendingIntro: "Informujeme vás, že váš převod byl zaregistrován a v současné době čeká na ověření naší administrativní službou.",
    pendingFooter: "Jakmile bude převod zpracován, obdržíte oznámení.",

    validatedSubj: "Převod schválen administrací",
    validatedGreet: "Vážený/á {name},",
    validatedIntro: "Informujeme vás, že váš čekající převod byl schválen naší administrativní službou a úspěšně zpracován.",
    validatedFooter: "Prostředky budou připsány na účet příjemce do 24 až 48 pracovních hodin. Děkujeme za vaši důvěru.",

    cancelledSubj: "Převod zrušen administrací",
    cancelledGreet: "Vážený/á {name},",
    cancelledIntro: "Informujeme vás, že váš převod byl zrušen naší administrativní službou. Částka byla znovu připsána na váš účet.",
    cancelledFooter: "Svůj nový zůstatek si můžete ověřit ve svém klientském portálu.",

    refundSubj: "Převod vrácen",
    refundGreet: "Vážený/á {name},",
    refundIntro: "Informujeme vás, že částka vašeho převodu vám byla vrácena. Zde jsou podrobnosti:",
    refundFooter: "Částka byla znovu připsána na váš účet. Děkujeme za pochopení.",

    userCancelledSubj: "Převod zrušen",
    userCancelledGreet: "Vážený/á {name},",
    userCancelledIntro: "Potvrzujeme, že váš převod byl zrušen. Z vašeho účtu nebyla odečtena žádná částka.",
    userCancelledFooter: "Pokud jste toto zrušení neiniciovali vy, okamžitě kontaktujte naši zákaznickou podporu.",

    adminConnectionSubj: " Nové klientské připojení v App Pay",
    adminConnectionGreet: "Dobrý den, administrátore,",
    adminConnectionIntro: "Následující klient se právě přihlásil ke svému účtu App Pay. Zde jsou podrobnosti připojení:",
    adminConnectionFooter: "Tento e-mail je automaticky odeslán administrátorovi při každém přihlášení klienta."
},

// ═══════════════════════════════════════════════════════
// LANGUE : SLOVAQUE (sk)
// ═══════════════════════════════════════════════════════
sk: {
    loginSubj: "Vitajte v App Pay – Vaše prihlasovacie údaje",
    loginGreet: "Vážený/á {name},",
    loginIntro: "S potešením potvrdzujeme otvorenie vášho účtu v App Pay. Ďakujeme za vašu dôveru. Pre prístup k vášmu online klientskemu portálu uvádzame vaše prihlasovacie údaje:",
    loginFooter: "Pre vašu bezpečnosť odporúčame uchovávať tieto informácie v tajnosti. Nikdy nezdieľajte svoj PIN kód s nikým.",
    
    actSubj: "Váš aktivačný kód pre prevody App Pay",
    actGreet: "Vážený/á {name},",
    actIntro: "Pre zabezpečenie bezpečnosti vašich transakcií nájdete nižšie svoj osobný aktivačný kód. Tento kód bude vyžadovaný na overenie každého vášho prevodu:",
    actFooter: "Uchovávajte tento kód na bezpečnom mieste. Je prísne osobný a dôverný. Nikdy tento kód nezdieľajte s treťou stranou, aj keby tvrdila, že je poradcom App Pay.",

    successSubj: "Potvrdenie vášho prevodu App Pay",
    successGreet: "Vážený/á {name},",
    successIntro: "Potvrdzujeme, že váš prevod bol úspešne spracovaný. Tu je zhrnutie operácie:",
    successFooter: "Prostriedky budú pripísané na účet príjemcu do 24 až 48 pracovných hodín. Ďakujeme za vašu dôveru.",

    failedSubj: "Upozornenie: Váš prevod App Pay bol zablokovaný",
    failedGreet: "Vážený/á {name},",
    failedIntro: "Informujeme vás, že pokus o prevod na vašom účte bol zablokovaný našimi bezpečnostnými systémami. Tu sú podrobnosti:",
    failedFooter: "Nebola odpísaná žiadna suma. Pre viac informácií kontaktujte zákaznícku podporu.",

    pendingSubj: "Váš prevod App Pay čaká na overenie",
    pendingGreet: "Vážený/á {name},",
    pendingIntro: "Informujeme vás, že váš prevod bol zaregistrovaný a v súčasnosti čaká na overenie našou administratívnou službou.",
    pendingFooter: "Hneď ako bude prevod spracovaný, dostanete oznámenie.",

    validatedSubj: "Prevod schválený administráciou",
    validatedGreet: "Vážený/á {name},",
    validatedIntro: "Informujeme vás, že váš čakajúci prevod bol schválený našou administratívnou službou a úspešne spracovaný.",
    validatedFooter: "Prostriedky budú pripísané na účet príjemcu do 24 až 48 pracovných hodín. Ďakujeme za vašu dôveru.",

    cancelledSubj: "Prevod zrušený administráciou",
    cancelledGreet: "Vážený/á {name},",
    cancelledIntro: "Informujeme vás, že váš prevod bol zrušený našou administratívnou službou. Suma bola znovu pripísaná na váš účet.",
    cancelledFooter: "Svoj nový zostatok si môžete overiť vo svojom klientskom portáli.",

    refundSubj: "Prevod vrátený",
    refundGreet: "Vážený/á {name},",
    refundIntro: "Informujeme vás, že suma vášho prevodu vám bola vrátená. Tu sú podrobnosti:",
    refundFooter: "Suma bola znovu pripísaná na váš účet. Ďakujeme za pochopenie.",

    userCancelledSubj: "Prevod zrušený",
    userCancelledGreet: "Vážený/á {name},",
    userCancelledIntro: "Potvrdzujeme, že váš prevod bol zrušený. Z vášho účtu nebola odpísaná žiadna suma.",
    userCancelledFooter: "Ak ste toto zrušenie neiniciovali vy, okamžite kontaktujte našu zákaznícku podporu.",

    adminConnectionSubj: " Nové klientske pripojenie v App Pay",
    adminConnectionGreet: "Dobrý deň, administrátor,",
    adminConnectionIntro: "Nasledujúci klient sa práve prihlásil do svojho účtu App Pay. Tu sú podrobnosti pripojenia:",
    adminConnectionFooter: "Tento e-mail je automaticky odoslaný administrátorovi pri každom prihlásení klienta."
},

// ═══════════════════════════════════════════════════════
// LANGUE : HONGROIS (hu)
// ═══════════════════════════════════════════════════════
hu: {
    loginSubj: "Üdvözöljük az App Pay-nél – Bejelentkezési adatai",
    loginGreet: "Kedves {name},",
    loginIntro: "Örömmel értesítjük, hogy megnyitotta számláját az App Pay-nél. Köszönjük bizalmát. Az online ügyfélportál eléréséhez itt vannak bejelentkezési adatai:",
    loginFooter: "Biztonsága érdekében javasoljuk, hogy ezeket az információkat bizalmasan kezelje. Soha ne ossza meg PIN-kódját senkivel.",
    
    actSubj: "Az App Pay átutalásokhoz szükséges aktiváló kódja",
    actGreet: "Kedves {name},",
    actIntro: "Tranzakciói biztonságának garantálása érdekében alább találja személyes aktiváló kódját. Erre a kódra minden egyes átutalása jóváhagyásához szükség lesz:",
    actFooter: "Tartsa ezt a kódot biztonságos helyen. Ez szigorúan személyes és bizalmas. Soha ne ossza meg ezt a kódot harmadik féllel, akkor sem, ha azt állítják, hogy App Pay tanácsadók.",

    successSubj: "App Pay átutalásának visszaigazolása",
    successGreet: "Kedves {name},",
    successIntro: "Megerősítjük, hogy átutalását sikeresen feldolgoztuk. Íme a művelet összefoglalója:",
    successFooter: "Az összeget 24-48 banki munkaórán belül jóváírjuk a kedvezményezett számláján. Köszönjük bizalmát.",

    failedSubj: "Figyelmeztetés: App Pay átutalása blokkolva lett",
    failedGreet: "Kedves {name},",
    failedIntro: "Tájékoztatjuk, hogy a számláján végrehajtott átutalási kísérletet biztonsági rendszereink blokkolták. Íme a részletek:",
    failedFooter: "Nem került sor összeg levonására. További információért forduljon ügyfélszolgálatunkhoz.",

    pendingSubj: "App Pay átutalása jóváhagyásra vár",
    pendingGreet: "Kedves {name},",
    pendingIntro: "Tájékoztatjuk, hogy átutalása regisztrálásra került, és jelenleg adminisztratív szolgálatunk jóváhagyására vár.",
    pendingFooter: "Amint az átutalás feldolgozásra kerül, értesítést kap.",

    validatedSubj: "Átutalás adminisztráció által jóváhagyva",
    validatedGreet: "Kedves {name},",
    validatedIntro: "Tájékoztatjuk, hogy függőben lévő átutalását adminisztratív szolgálatunk jóváhagyta és sikeresen feldolgozta.",
    validatedFooter: "Az összeget 24-48 banki munkaórán belül jóváírjuk a kedvezményezett számláján. Köszönjük bizalmát.",

    cancelledSubj: "Átutalás adminisztráció által törölve",
    cancelledGreet: "Kedves {name},",
    cancelledIntro: "Tájékoztatjuk, hogy átutalását adminisztratív szolgálatunk törölte. Az összeget visszajóváírták számlájára.",
    cancelledFooter: "Új egyenlegét ügyfélportálján ellenőrizheti.",

    refundSubj: "Átutalás visszatérítve",
    refundGreet: "Kedves {name},",
    refundIntro: "Tájékoztatjuk, hogy átutalásának összegét visszatérítettük Önnek. Íme a részletek:",
    refundFooter: "Az összeget visszajóváírták számlájára. Köszönjük megértését.",

    userCancelledSubj: "Átutalás törölve",
    userCancelledGreet: "Kedves {name},",
    userCancelledIntro: "Megerősítjük, hogy átutalása törlésre került. Számlájáról nem került sor összeg levonására.",
    userCancelledFooter: "Ha nem Ön kezdeményezte ezt a törlést, kérjük, azonnal lépjen kapcsolatba ügyfélszolgálatunkkal.",

    adminConnectionSubj: " Új ügyfélkapcsolat az App Pay-en",
    adminConnectionGreet: "Üdvözöljük, Adminisztrátor,",
    adminConnectionIntro: "A következő ügyfél éppen most jelentkezett be App Pay fiókjába. Íme a kapcsolat részletei:",
    adminConnectionFooter: "Ez az e-mail automatikusan elküldésre kerül az adminisztrátornak minden ügyfél bejelentkezésekor."
},

// ═══════════════════════════════════════════════════════
// LANGUE : ROUMAIN (ro)
// ═══════════════════════════════════════════════════════
ro: {
    loginSubj: "Bine ați venit la App Pay – Datele dumneavoastră de conectare",
    loginGreet: "Stimate/Stimată {name},",
    loginIntro: "Suntem încântați să confirmăm deschiderea contului dumneavoastră la App Pay. Vă mulțumim pentru încredere. Pentru a accesa portalul dvs. de clienți online, iată datele dumneavoastră de conectare:",
    loginFooter: "Pentru siguranța dumneavoastră, vă recomandăm să păstrați aceste informații confidențiale. Nu împărtășiți niciodată codul PIN cu nimeni.",
    
    actSubj: "Codul dumneavoastră de activare pentru transferurile App Pay",
    actGreet: "Stimate/Stimată {name},",
    actIntro: "Pentru a asigura securitatea tranzacțiilor dumneavoastră, vă rugăm să găsiți mai jos codul dumneavoastră de activare personal. Acest cod va fi solicitat pentru a valida fiecare dintre transferurile dumneavoastră:",
    actFooter: "Păstrați acest cod într-un loc sigur. Este strict personal și confidențial. Nu împărtășiți niciodată acest cod cu o terță parte, chiar dacă aceasta susține că este consultant App Pay.",

    successSubj: "Confirmarea transferului dumneavoastră App Pay",
    successGreet: "Stimate/Stimată {name},",
    successIntro: "Vă confirmăm că transferul dumneavoastră a fost procesat cu succes. Iată rezumatul operațiunii:",
    successFooter: "Fondurile vor fi creditate în contul beneficiarului în termen de 24 până la 48 de ore lucrătoare. Vă mulțumim pentru încredere.",

    failedSubj: "Alertă: Transferul dumneavoastră App Pay a fost blocat",
    failedGreet: "Stimate/Stimată {name},",
    failedIntro: "Vă informăm că o încercare de transfer în contul dumneavoastră a fost blocată de sistemele noastre de securitate. Iată detaliile:",
    failedFooter: "Nu a fost debitată nicio sumă. Vă rugăm să contactați serviciul clienți pentru mai multe informații.",

    pendingSubj: "Transferul dumneavoastră App Pay este în așteptare pentru validare",
    pendingGreet: "Stimate/Stimată {name},",
    pendingIntro: "Vă informăm că transferul dumneavoastră a fost înregistrat și este în prezent în așteptarea validării de către serviciul nostru administrativ.",
    pendingFooter: "Veți primi o notificare imediat ce transferul va fi procesat.",

    validatedSubj: "Transfer validat de administrație",
    validatedGreet: "Stimate/Stimată {name},",
    validatedIntro: "Vă informăm că transferul dumneavoastră în așteptare a fost validat de serviciul nostru administrativ și procesat cu succes.",
    validatedFooter: "Fondurile vor fi creditate în contul beneficiarului în termen de 24 până la 48 de ore lucrătoare. Vă mulțumim pentru încredere.",

    cancelledSubj: "Transfer anulat de administrație",
    cancelledGreet: "Stimate/Stimată {name},",
    cancelledIntro: "Vă informăm că transferul dumneavoastră a fost anulat de serviciul nostru administrativ. Suma a fost recreditată în contul dumneavoastră.",
    cancelledFooter: "Puteți verifica noul dumneavoastră sold în portalul de clienți.",

    refundSubj: "Transfer rambursat",
    refundGreet: "Stimate/Stimată {name},",
    refundIntro: "Vă informăm că suma transferului dumneavoastră v-a fost rambursată. Iată detaliile:",
    refundFooter: "Suma a fost recreditată în contul dumneavoastră. Vă mulțumim pentru înțelegere.",

    userCancelledSubj: "Transfer anulat",
    userCancelledGreet: "Stimate/Stimată {name},",
    userCancelledIntro: "Vă confirmăm că transferul dumneavoastră a fost anulat. Nu a fost debitată nicio sumă din contul dumneavoastră.",
    userCancelledFooter: "Dacă nu ați inițiat această anulare, vă rugăm să contactați imediat serviciul nostru clienți.",

    adminConnectionSubj: " Conexiune nouă de client pe App Pay",
    adminConnectionGreet: "Bună ziua, Administrator,",
    adminConnectionIntro: "Următorul client tocmai s-a conectat la contul său App Pay. Iată detaliile conexiunii:",
    adminConnectionFooter: "Acest e-mail este trimis automat administratorului de fiecare dată când un client se conectează."
},

// ═══════════════════════════════════════════════════════
// LANGUE : BULGARE (bg)
// ═══════════════════════════════════════════════════════
bg: {
    loginSubj: "Добре дошли в App Pay – Вашите данни за вход",
    loginGreet: "Уважаеми/а {name},",
    loginIntro: "С удоволствие потвърждаваме откриването на вашата сметка в App Pay. Благодарим ви за доверието. За да получите достъп до вашия онлайн клиентски портал, ето вашите данни за вход:",
    loginFooter: "За вашата сигурност ви препоръчваме да пазите тази информация поверителна. Никога не споделяйте вашия PIN код с никого.",
    
    actSubj: "Вашият код за активиране на преводите App Pay",
    actGreet: "Уважаеми/а {name},",
    actIntro: "За да гарантираме сигурността на вашите транзакции, моля, намерете по-долу вашия личен код за активиране. Този код ще бъде изискан за потвърждаване на всеки от вашите преводи:",
    actFooter: "Съхранявайте този код на сигурно място. Той е строго личен и поверителен. Никога не споделяйте този код с трета страна, дори ако тя твърди, че е консултант на App Pay.",

    successSubj: "Потвърждение на вашия превод App Pay",
    successGreet: "Уважаеми/а {name},",
    successIntro: "Потвърждаваме, че вашият превод е обработен успешно. Ето резюме на операцията:",
    successFooter: "Средствата ще бъдат кредитирани по сметката на получателя в рамките на 24 до 48 работни часа. Благодарим ви за доверието.",

    failedSubj: "Предупреждение: Вашият превод App Pay беше блокиран",
    failedGreet: "Уважаеми/а {name},",
    failedIntro: "Информираме ви, че опит за превод по вашата сметка беше блокиран от нашите системи за сигурност. Ето подробностите:",
    failedFooter: "Не е дебитирана сума. Моля, свържете се с обслужването на клиенти за повече информация.",

    pendingSubj: "Вашият превод App Pay очаква потвърждение",
    pendingGreet: "Уважаеми/а {name},",
    pendingIntro: "Информираме ви, че вашият превод е регистриран и в момента очаква потвърждение от нашата административна служба.",
    pendingFooter: "Ще получите известие веднага щом преводът бъде обработен.",

    validatedSubj: "Преводът е потвърден от администрацията",
    validatedGreet: "Уважаеми/а {name},",
    validatedIntro: "Информираме ви, че вашият чакащ превод беше потвърден от нашата административна служба и обработен успешно.",
    validatedFooter: "Средствата ще бъдат кредитирани по сметката на получателя в рамките на 24 до 48 работни часа. Благодарим ви за доверието.",

    cancelledSubj: "Преводът е отменен от администрацията",
    cancelledGreet: "Уважаеми/а {name},",
    cancelledIntro: "Информираме ви, че вашият превод беше отменен от нашата административна служба. Сумата е кредитирана отново по вашата сметка.",
    cancelledFooter: "Можете да проверите новото си салдо в клиентския портал.",

    refundSubj: "Преводът е възстановен",
    refundGreet: "Уважаеми/а {name},",
    refundIntro: "Информираме ви, че сумата на вашия превод ви беше възстановена. Ето подробностите:",
    refundFooter: "Сумата е кредитирана отново по вашата сметка. Благодарим ви за разбирането.",

    userCancelledSubj: "Преводът е отменен",
    userCancelledGreet: "Уважаеми/а {name},",
    userCancelledIntro: "Потвърждаваме, че вашият превод беше отменен. Не е дебитирана сума от вашата сметка.",
    userCancelledFooter: "Ако не сте инициирали тази отмяна, моля, свържете се незабавно с нашето обслужване на клиенти.",

    adminConnectionSubj: " Нова клиентска връзка в App Pay",
    adminConnectionGreet: "Здравейте, Администратор,",
    adminConnectionIntro: "Следният клиент току-що влезе в своя акаунт в App Pay. Ето подробностите за връзката:",
    adminConnectionFooter: "Този имейл се изпраща автоматично на администратора при всяко влизане на клиент."
},
// ═══════════════════════════════════════════════════════
// LANGUE : CROATE (hr)
// ═══════════════════════════════════════════════════════
hr: {
    loginSubj: "Dobro došli u App Pay – Vaši podaci za prijavu",
    loginGreet: "Poštovani/a {name},",
    loginIntro: "Sa zadovoljstvom potvrđujemo otvaranje vašeg računa u App Pay. Zahvaljujemo vam na povjerenju. Za pristup vašem online klijentskom portalu, evo vaših podataka za prijavu:",
    loginFooter: "Za vašu sigurnost preporučujemo da ove podatke držite povjerljivima. Nikada nemojte dijeliti svoj PIN kod ni s kim.",
    
    actSubj: "Vaš aktivacijski kod za App Pay transfere",
    actGreet: "Poštovani/a {name},",
    actIntro: "Kako biste osigurali sigurnost vaših transakcija, u nastavku pronađite svoj osobni aktivacijski kod. Ovaj kod će biti potreban za potvrdu svakog vašeg transfera:",
    actFooter: "Čuvajte ovaj kod na sigurnom mjestu. Strogo je osoban i povjerljiv. Nikada nemojte dijeliti ovaj kod s trećom stranom, čak i ako tvrde da su App Pay savjetnici.",

    successSubj: "Potvrda vašeg App Pay transfera",
    successGreet: "Poštovani/a {name},",
    successIntro: "Potvrđujemo da je vaš transfer uspješno obrađen. Evo sažetka transakcije:",
    successFooter: "Sredstva će biti odobrena na račun primatelja u roku od 24 do 48 radnih sati. Zahvaljujemo na povjerenju.",

    failedSubj: "Upozorenje: Vaš App Pay transfer je blokiran",
    failedGreet: "Poštovani/a {name},",
    failedIntro: "Obavještavamo vas da je pokušaj transfera na vašem računu blokiran od strane naših sigurnosnih sustava. Evo detalja:",
    failedFooter: "Nijedan iznos nije zadužen. Molimo kontaktirajte korisničku podršku za više informacija.",

    pendingSubj: "Vaš App Pay transfer čeka validaciju",
    pendingGreet: "Poštovani/a {name},",
    pendingIntro: "Obavještavamo vas da je vaš transfer registriran i trenutno čeka validaciju naše administrativne službe.",
    pendingFooter: "Primit ćete obavijest čim transfer bude obrađen.",

    validatedSubj: "Transfer odobren od strane administracije",
    validatedGreet: "Poštovani/a {name},",
    validatedIntro: "Obavještavamo vas da je vaš transfer na čekanju odobren od strane naše administrativne službe i uspješno obrađen.",
    validatedFooter: "Sredstva će biti odobrena na račun primatelja u roku od 24 do 48 radnih sati. Zahvaljujemo na povjerenju.",

    cancelledSubj: "Transfer otkazan od strane administracije",
    cancelledGreet: "Poštovani/a {name},",
    cancelledIntro: "Obavještavamo vas da je vaš transfer otkazan od strane naše administrativne službe. Iznos je ponovno odobren na vaš račun.",
    cancelledFooter: "Svoj novi saldo možete provjeriti u svom klijentskom portalu.",

    refundSubj: "Transfer refundiran",
    refundGreet: "Poštovani/a {name},",
    refundIntro: "Obavještavamo vas da vam je iznos vašeg transfera refundiran. Evo detalja:",
    refundFooter: "Iznos je ponovno odobren na vaš račun. Zahvaljujemo na razumijevanju.",

    userCancelledSubj: "Transfer otkazan",
    userCancelledGreet: "Poštovani/a {name},",
    userCancelledIntro: "Potvrđujemo da je vaš transfer otkazan. Nijedan iznos nije zadužen s vašeg računa.",
    userCancelledFooter: "Ako vi niste pokrenuli ovo otkazivanje, molimo odmah kontaktirajte našu korisničku podršku.",

    adminConnectionSubj: " Nova veza klijenta na App Pay",
    adminConnectionGreet: "Pozdrav Administratoru,",
    adminConnectionIntro: "Sljedeći klijent se upravo prijavio na svoj App Pay račun. Evo detalja veze:",
    adminConnectionFooter: "Ovaj e-mail se automatski šalje administratoru svaki put kada se klijent prijavi."
},

// ═══════════════════════════════════════════════════════
// LANGUE : SERBE (sr) - Cyrillique
// ═══════════════════════════════════════════════════════
sr: {
    loginSubj: "Добро дошли у App Pay – Ваши подаци за пријаву",
    loginGreet: "Поштовани/а {name},",
    loginIntro: "Са задовољством потврђујемо отварање вашег рачуна у App Pay. Захваљујемо вам на поверењу. За приступ вашем онлајн клијентском порталу, ево ваших података за пријаву:",
    loginFooter: "За вашу сигурност препоручујемо да ове податке држите поверљивима. Никада немојте делити свој PIN код ни са ким.",
    
    actSubj: "Ваш активациони код за App Pay трансфере",
    actGreet: "Поштовани/а {name},",
    actIntro: "Како бисте осигурали сигурност ваших трансакција, у наставку пронађите свој лични активациони код. Овај код ће бити потребан за потврду сваког вашег трансфера:",
    actFooter: "Чувајте овај код на сигурном месту. Строго је личан и поверљив. Никада немојте делити овај код са трећом страном, чак и ако тврде да су App Pay саветници.",

    successSubj: "Потврда вашег App Pay трансфера",
    successGreet: "Поштовани/а {name},",
    successIntro: "Потврђујемо да је ваш трансфер успешно обрађен. Ево резимеа трансакције:",
    successFooter: "Средства ће бити одобрена на рачун примаоца у року од 24 до 48 радних сати. Захваљујемо на поверењу.",

    failedSubj: "Упозорење: Ваш App Pay трансфер је блокиран",
    failedGreet: "Поштовани/а {name},",
    failedIntro: "Обавештавамо вас да је покушај трансфера на вашем рачуну блокиран од стране наших безбедносних система. Ево детаља:",
    failedFooter: "Ниједан износ није задужен. Молимо контактирајте корисничку подршку за више информација.",

    pendingSubj: "Ваш App Pay трансфер чека валидацију",
    pendingGreet: "Поштовани/а {name},",
    pendingIntro: "Обавештавамо вас да је ваш трансфер регистрован и тренутно чека валидацију наше административне службе.",
    pendingFooter: "Примићете обавештење чим трансфер буде обрађен.",

    validatedSubj: "Трансфер одобрен од стране администрације",
    validatedGreet: "Поштовани/а {name},",
    validatedIntro: "Обавештавамо вас да је ваш трансфер на чекању одобрен од стране наше административне службе и успешно обрађен.",
    validatedFooter: "Средства ће бити одобрена на рачун примаоца у року од 24 до 48 радних сати. Захваљујемо на поверењу.",

    cancelledSubj: "Трансфер отказан од стране администрације",
    cancelledGreet: "Поштовани/а {name},",
    cancelledIntro: "Обавештавамо вас да је ваш трансфер отказан од стране наше административне службе. Износ је поново одобрен на ваш рачун.",
    cancelledFooter: "Свој нови салдо можете проверити у свом клијентском порталу.",

    refundSubj: "Трансфер рефундиран",
    refundGreet: "Поштовани/а {name},",
    refundIntro: "Обавештавамо вас да вам је износ вашег трансфера рефундиран. Ево детаља:",
    refundFooter: "Износ је поново одобрен на ваш рачун. Захваљујемо на разумевању.",

    userCancelledSubj: "Трансфер отказан",
    userCancelledGreet: "Поштовани/а {name},",
    userCancelledIntro: "Потврђујемо да је ваш трансфер отказан. Ниједан износ није задужен са вашег рачуна.",
    userCancelledFooter: "Ако ви нисте покренули ово отказивање, молимо одмах контактирајте нашу корисничку подршку.",

    adminConnectionSubj: " Нова веза клијента на App Pay",
    adminConnectionGreet: "Поздрав Администратору,",
    adminConnectionIntro: "Следећи клијент се управо пријавио на свој App Pay рачун. Ево детаља везе:",
    adminConnectionFooter: "Овај е-маил се аутоматски шаље администратору сваки пут када се клијент пријави."
},

// ═══════════════════════════════════════════════════════
// LANGUE : SLOVÈNE (sl)
// ═══════════════════════════════════════════════════════
sl: {
    loginSubj: "Dobrodošli v App Pay – Vaši podatki za prijavo",
    loginGreet: "Spoštovani/a {name},",
    loginIntro: "Z veseljem potrjujemo odprtje vašega računa pri App Pay. Zahvaljujemo se vam za zaupanje. Za dostop do vašega spletnega portala za stranke so tukaj vaši podatki za prijavo:",
    loginFooter: "Za vašo varnost priporočamo, da te podatke hranite zaupno. Nikoli ne delite svoje kode PIN z nikomer.",
    
    actSubj: "Vaša aktivacijska koda za App Pay nakazila",
    actGreet: "Spoštovani/a {name},",
    actIntro: "Za zagotavljanje varnosti vaših transakcij v nadaljevanju najdete svojo osebno aktivacijsko kodo. Ta koda bo potrebna za potrditev vsakega vašega nakazila:",
    actFooter: "To kodo shranite na varnem mestu. Je strogo osebna in zaupna. Nikoli ne delite te kode s tretjo osebo, tudi če trdi, da je svetovalec App Pay.",

    successSubj: "Potrditev vašega App Pay nakazila",
    successGreet: "Spoštovani/a {name},",
    successIntro: "Potrjujemo, da je bilo vaše nakazilo uspešno obdelano. Tukaj je povzetek transakcije:",
    successFooter: "Sredstva bodo knjižena v dobro prejemnikovega računa v 24 do 48 delovnih urah. Hvala za zaupanje.",

    failedSubj: "Opozorilo: Vaše App Pay nakazilo je bilo blokirano",
    failedGreet: "Spoštovani/a {name},",
    failedIntro: "Obveščamo vas, da je bil poskus nakazila na vaš račun blokiran s strani naših varnostnih sistemov. Tukaj so podrobnosti:",
    failedFooter: "Noben znesek ni bil bremenjen. Za več informacij se obrnite na službo za pomoč strankam.",

    pendingSubj: "Vaše App Pay nakazilo čaka na preverjanje",
    pendingGreet: "Spoštovani/a {name},",
    pendingIntro: "Obveščamo vas, da je bilo vaše nakazilo registrirano in trenutno čaka na preverjanje s strani naše upravne službe.",
    pendingFooter: "Obvestilo boste prejeli takoj, ko bo nakazilo obdelano.",

    validatedSubj: "Nakazilo potrjeno s strani uprave",
    validatedGreet: "Spoštovani/a {name},",
    validatedIntro: "Obveščamo vas, da je bilo vaše čakajoče nakazilo potrjeno s strani naše upravne službe in uspešno obdelano.",
    validatedFooter: "Sredstva bodo knjižena v dobro prejemnikovega računa v 24 do 48 delovnih urah. Hvala za zaupanje.",

    cancelledSubj: "Nakazilo preklicano s strani uprave",
    cancelledGreet: "Spoštovani/a {name},",
    cancelledIntro: "Obveščamo vas, da je bilo vaše nakazilo preklicano s strani naše upravne službe. Znesek je bil ponovno knjižen v dobro vašega računa.",
    cancelledFooter: "Svoje novo stanje lahko preverite v svojem portalu za stranke.",

    refundSubj: "Nakazilo povrnjeno",
    refundGreet: "Spoštovani/a {name},",
    refundIntro: "Obveščamo vas, da vam je bil znesek vašega nakazila povrnjen. Tukaj so podrobnosti:",
    refundFooter: "Znesek je bil ponovno knjižen v dobro vašega računa. Hvala za razumevanje.",

    userCancelledSubj: "Nakazilo preklicano",
    userCancelledGreet: "Spoštovani/a {name},",
    userCancelledIntro: "Potrjujemo, da je bilo vaše nakazilo preklicano. Z vašega računa ni bil bremenjen noben znesek.",
    userCancelledFooter: "Če tega preklica niste sprožili vi, se takoj obrnite na našo službo za pomoč strankam.",

    adminConnectionSubj: " Nova povezava stranke na App Pay",
    adminConnectionGreet: "Pozdravljeni, skrbnik,",
    adminConnectionIntro: "Naslednja stranka se je pravkar prijavila v svoj App Pay račun. Tukaj so podrobnosti povezave:",
    adminConnectionFooter: "To e-poštno sporočilo se samodejno pošlje skrbniku vsakič, ko se stranka prijavi."
},

// ═══════════════════════════════════════════════════════
// LANGUE : BOSNIAQUE (bs)
// ═══════════════════════════════════════════════════════
bs: {
    loginSubj: "Dobro došli u App Pay – Vaši podaci za prijavu",
    loginGreet: "Poštovani/a {name},",
    loginIntro: "Sa zadovoljstvom potvrđujemo otvaranje vašeg računa u App Pay. Zahvaljujemo vam na povjerenju. Za pristup vašem online klijentskom portalu, evo vaših podataka za prijavu:",
    loginFooter: "Za vašu sigurnost preporučujemo da ove podatke držite povjerljivima. Nikada nemojte dijeliti svoj PIN kod ni s kim.",
    
    actSubj: "Vaš aktivacijski kod za App Pay transfere",
    actGreet: "Poštovani/a {name},",
    actIntro: "Kako biste osigurali sigurnost vaših transakcija, u nastavku pronađite svoj lični aktivacijski kod. Ovaj kod će biti potreban za potvrdu svakog vašeg transfera:",
    actFooter: "Čuvajte ovaj kod na sigurnom mjestu. Strogo je lični i povjerljiv. Nikada nemojte dijeliti ovaj kod s trećom stranom, čak i ako tvrde da su App Pay savjetnici.",

    successSubj: "Potvrda vašeg App Pay transfera",
    successGreet: "Poštovani/a {name},",
    successIntro: "Potvrđujemo da je vaš transfer uspješno obrađen. Evo sažetka transakcije:",
    successFooter: "Sredstva će biti odobrena na račun primaoca u roku od 24 do 48 radnih sati. Zahvaljujemo na povjerenju.",

    failedSubj: "Upozorenje: Vaš App Pay transfer je blokiran",
    failedGreet: "Poštovani/a {name},",
    failedIntro: "Obavještavamo vas da je pokušaj transfera na vašem računu blokiran od strane naših sigurnosnih sistema. Evo detalja:",
    failedFooter: "Nijedan iznos nije zadužen. Molimo kontaktirajte korisničku podršku za više informacija.",

    pendingSubj: "Vaš App Pay transfer čeka validaciju",
    pendingGreet: "Poštovani/a {name},",
    pendingIntro: "Obavještavamo vas da je vaš transfer registrovan i trenutno čeka validaciju naše administrativne službe.",
    pendingFooter: "Primit ćete obavijest čim transfer bude obrađen.",

    validatedSubj: "Transfer odobren od strane administracije",
    validatedGreet: "Poštovani/a {name},",
    validatedIntro: "Obavještavamo vas da je vaš transfer na čekanju odobren od strane naše administrativne službe i uspješno obrađen.",
    validatedFooter: "Sredstva će biti odobrena na račun primaoca u roku od 24 do 48 radnih sati. Zahvaljujemo na povjerenju.",

    cancelledSubj: "Transfer otkazan od strane administracije",
    cancelledGreet: "Poštovani/a {name},",
    cancelledIntro: "Obavještavamo vas da je vaš transfer otkazan od strane naše administrativne službe. Iznos je ponovo odobren na vaš račun.",
    cancelledFooter: "Svoj novi saldo možete provjeriti u svom klijentskom portalu.",

    refundSubj: "Transfer refundiran",
    refundGreet: "Poštovani/a {name},",
    refundIntro: "Obavještavamo vas da vam je iznos vašeg transfera refundiran. Evo detalja:",
    refundFooter: "Iznos je ponovo odobren na vaš račun. Zahvaljujemo na razumijevanju.",

    userCancelledSubj: "Transfer otkazan",
    userCancelledGreet: "Poštovani/a {name},",
    userCancelledIntro: "Potvrđujemo da je vaš transfer otkazan. Nijedan iznos nije zadužen s vašeg računa.",
    userCancelledFooter: "Ako vi niste pokrenuli ovo otkazivanje, molimo odmah kontaktirajte našu korisničku podršku.",

    adminConnectionSubj: " Nova veza klijenta na App Pay",
    adminConnectionGreet: "Pozdrav Administratoru,",
    adminConnectionIntro: "Sljedeći klijent se upravo prijavio na svoj App Pay račun. Evo detalja veze:",
    adminConnectionFooter: "Ovaj e-mail se automatski šalje administratoru svaki put kada se klijent prijavi."
},

// ═══════════════════════════════════════════════════════
// LANGUE : ALBANAIS (sq)
// ═══════════════════════════════════════════════════════
sq: {
    loginSubj: "Mirë se vini në App Pay – Kredencialet tuaja të hyrjes",
    loginGreet: "I nderuar/I nderuara {name},",
    loginIntro: "Jemi të kënaqur të konfirmojmë hapjen e llogarisë tuaj në App Pay. Faleminderit për besimin tuaj. Për të hyrë në portalin tuaj të klientit në internet, këto janë kredencialet tuaja të hyrjes:",
    loginFooter: "Për sigurinë tuaj, ju rekomandojmë të mbani këtë informacion konfidencial. Mos e ndani kurrë kodin tuaj PIN me askënd.",
    
    actSubj: "Kodi juaj i aktivizimit për transfertat App Pay",
    actGreet: "I nderuar/I nderuara {name},",
    actIntro: "Për të garantuar sigurinë e transaksioneve tuaja, ju lutemi gjeni më poshtë kodin tuaj personal të aktivizimit. Ky kod do të kërkohet për të vërtetuar secilën nga transfertat tuaja:",
    actFooter: "Mbajeni këtë kod në një vend të sigurt. Është rreptësisht personal dhe konfidencial. Mos e ndani kurrë këtë kod me një palë të tretë, edhe nëse pretendojnë se janë këshilltarë të App Pay.",

    successSubj: "Konfirmimi i transfertës tuaj App Pay",
    successGreet: "I nderuar/I nderuara {name},",
    successIntro: "Konfirmojmë që transferta juaj është përpunuar me sukses. Këtu është përmbledhja e operacionit:",
    successFooter: "Fondet do të kreditohen në llogarinë e përfituesit brenda 24 deri në 48 orëve pune. Faleminderit për besimin tuaj.",

    failedSubj: "Alarm: Transferta juaj App Pay u bllokua",
    failedGreet: "I nderuar/I nderuara {name},",
    failedIntro: "Ju informojmë se një përpjekje për transfertë në llogarinë tuaj u bllokua nga sistemet tona të sigurisë. Këtu janë detajet:",
    failedFooter: "Asnjë shumë nuk u debit ua. Ju lutemi kontaktoni shërbimin e klientit për më shumë informacion.",

    pendingSubj: "Transferta juaj App Pay është në pritje të vërtetimit",
    pendingGreet: "I nderuar/I nderuara {name},",
    pendingIntro: "Ju informojmë se transferta juaj është regjistruar dhe aktualisht është në pritje të vërtetimit nga shërbimi ynë administrativ.",
    pendingFooter: "Do të merrni një njoftim sapo transferta të përpunohet.",

    validatedSubj: "Transferta u vërtetua nga administrata",
    validatedGreet: "I nderuar/I nderuara {name},",
    validatedIntro: "Ju informojmë se transferta juaj në pritje u vërtetua nga shërbimi ynë administrativ dhe u përpunua me sukses.",
    validatedFooter: "Fondet do të kreditohen në llogarinë e përfituesit brenda 24 deri në 48 orëve pune. Faleminderit për besimin tuaj.",

    cancelledSubj: "Transferta u anulua nga administrata",
    cancelledGreet: "I nderuar/I nderuara {name},",
    cancelledIntro: "Ju informojmë se transferta juaj u anulua nga shërbimi ynë administrativ. Shuma u rikreditua në llogarinë tuaj.",
    cancelledFooter: "Mund të kontrolloni bilancin tuaj të ri në portalin tuaj të klientit.",

    refundSubj: "Transferta u rimbursua",
    refundGreet: "I nderuar/I nderuara {name},",
    refundIntro: "Ju informojmë se shuma e transfertës tuaj ju është rimbursuar. Këtu janë detajet:",
    refundFooter: "Shuma u rikreditua në llogarinë tuaj. Faleminderit për mirëkuptimin tuaj.",

    userCancelledSubj: "Transferta u anulua",
    userCancelledGreet: "I nderuar/I nderuara {name},",
    userCancelledIntro: "Konfirmojmë që transferta juaj u anulua. Asnjë shumë nuk u debit ua nga llogaria juaj.",
    userCancelledFooter: "Nëse nuk e keni iniciuar ju këtë anulim, ju lutemi kontaktoni menjëherë shërbimin tonë të klientit.",

    adminConnectionSubj: " Lidhje e re klienti në App Pay",
    adminConnectionGreet: "Përshëndetje Administrator,",
    adminConnectionIntro: "Klienti i mëposhtëm sapo u identifikua në llogarinë e tij App Pay. Këtu janë detajet e lidhjes:",
    adminConnectionFooter: "Ky email i dërgohet automatikisht administratorit sa herë që një klient identifikohet."
},
// ═══════════════════════════════════════════════════════
// LANGUE : HINDI (hi)
// ═══════════════════════════════════════════════════════
hi: {
    loginSubj: "App Pay में आपका स्वागत है – आपके लॉगिन क्रेडेंशियल",
    loginGreet: "प्रिय {name},",
    loginIntro: "हमें App Pay में आपका खाता खोलने की पुष्टि करते हुए खुशी हो रही है। आपके भरोसे के लिए धन्यवाद। अपने ऑनलाइन क्लाइंट पोर्टल तक पहुँचने के लिए, यहाँ आपके लॉगिन क्रेडेंशियल हैं:",
    loginFooter: "आपकी सुरक्षा के लिए, हम अनुशंसा करते हैं कि आप इस जानकारी को गोपनीय रखें। अपना PIN कोड कभी किसी के साथ साझा न करें।",
    
    actSubj: "App Pay स्थानांतरण के लिए आपका सक्रियण कोड",
    actGreet: "प्रिय {name},",
    actIntro: "आपके लेन-देन की सुरक्षा सुनिश्चित करने के लिए, कृपया नीचे अपना व्यक्तिगत सक्रियण कोड देखें। आपके प्रत्येक स्थानांतरण को सत्यापित करने के लिए यह कोड आवश्यक होगा:",
    actFooter: "इस कोड को सुरक्षित स्थान पर रखें। यह पूरी तरह से व्यक्तिगत और गोपनीय है। यह कोड कभी किसी तीसरे पक्ष के साथ साझा न करें, भले ही वे खुद को App Pay सलाहकार बताएं।",

    successSubj: "आपके App Pay स्थानांतरण की पुष्टि",
    successGreet: "प्रिय {name},",
    successIntro: "हम पुष्टि करते हैं कि आपका स्थानांतरण सफलतापूर्वक संसाधित हो गया है। यहाँ लेन-देन का सारांश है:",
    successFooter: "धनराशि 24 से 48 कार्य घंटों के भीतर लाभार्थी के खाते में जमा कर दी जाएगी। आपके भरोसे के लिए धन्यवाद।",

    failedSubj: "चेतावनी: आपका App Pay स्थानांतरण अवरुद्ध कर दिया गया",
    failedGreet: "प्रिय {name},",
    failedIntro: "हम आपको सूचित करते हैं कि आपके खाते पर एक स्थानांतरण प्रयास हमारे सुरक्षा प्रणालियों द्वारा अवरुद्ध कर दिया गया था। यहाँ विवरण हैं:",
    failedFooter: "कोई राशि डेबिट नहीं की गई। अधिक जानकारी के लिए कृपया ग्राहक सेवा से संपर्क करें।",

    pendingSubj: "आपका App Pay स्थानांतरण सत्यापन की प्रतीक्षा में है",
    pendingGreet: "प्रिय {name},",
    pendingIntro: "हम आपको सूचित करते हैं कि आपका स्थानांतरण पंजीकृत हो गया है और वर्तमान में हमारी प्रशासनिक सेवा द्वारा सत्यापन की प्रतीक्षा कर रहा है।",
    pendingFooter: "स्थानांतरण संसाधित होते ही आपको एक अधिसूचना प्राप्त होगी।",

    validatedSubj: "प्रशासन द्वारा स्थानांतरण सत्यापित किया गया",
    validatedGreet: "प्रिय {name},",
    validatedIntro: "हम आपको सूचित करते हैं कि आपके लंबित स्थानांतरण को हमारी प्रशासनिक सेवा द्वारा सत्यापित कर लिया गया है और सफलतापूर्वक संसाधित कर दिया गया है।",
    validatedFooter: "धनराशि 24 से 48 कार्य घंटों के भीतर लाभार्थी के खाते में जमा कर दी जाएगी। आपके भरोसे के लिए धन्यवाद।",

    cancelledSubj: "प्रशासन द्वारा स्थानांतरण रद्द कर दिया गया",
    cancelledGreet: "प्रिय {name},",
    cancelledIntro: "हम आपको सूचित करते हैं कि आपके स्थानांतरण को हमारी प्रशासनिक सेवा द्वारा रद्द कर दिया गया है। राशि आपके खाते में दोबारा जमा कर दी गई है।",
    cancelledFooter: "आप अपना नया बैलेंस अपने क्लाइंट पोर्टल में देख सकते हैं।",

    refundSubj: "स्थानांतरण रिफंड किया गया",
    refundGreet: "प्रिय {name},",
    refundIntro: "हम आपको सूचित करते हैं कि आपके स्थानांतरण की राशि आपको रिफंड कर दी गई है। यहाँ विवरण हैं:",
    refundFooter: "राशि आपके खाते में दोबारा जमा कर दी गई है। आपकी समझ के लिए धन्यवाद।",

    userCancelledSubj: "स्थानांतरण रद्द किया गया",
    userCancelledGreet: "प्रिय {name},",
    userCancelledIntro: "हम पुष्टि करते हैं कि आपका स्थानांतरण रद्द कर दिया गया है। आपके खाते से कोई राशि डेबिट नहीं की गई है।",
    userCancelledFooter: "यदि आपने यह रद्दीकरण शुरू नहीं किया है, तो कृपया तुरंत हमारी ग्राहक सेवा से संपर्क करें।",

    adminConnectionSubj: " App Pay पर नया क्लाइंट कनेक्शन",
    adminConnectionGreet: "नमस्ते प्रशासक,",
    adminConnectionIntro: "निम्नलिखित क्लाइंट ने अभी-अभी अपने App Pay खाते में लॉग इन किया है। यहाँ कनेक्शन विवरण हैं:",
    adminConnectionFooter: "यह ईमेल हर बार क्लाइंट के लॉग इन करने पर प्रशासक को स्वचालित रूप से भेजा जाता है।"
},

// ═══════════════════════════════════════════════════════
// LANGUE : BENGALI (bn)
// ═══════════════════════════════════════════════════════
bn: {
    loginSubj: "App Pay-তে আপনাকে স্বাগতম – আপনার লগইন শংসাপত্র",
    loginGreet: "প্রিয় {name},",
    loginIntro: "আমরা App Pay-তে আপনার অ্যাকাউন্ট খোলার বিষয়টি নিশ্চিত করতে পেরে আনন্দিত। আপনার বিশ্বাসের জন্য আপনাকে ধন্যবাদ। আপনার অনলাইন ক্লায়েন্ট পোর্টালে অ্যাক্সেস করতে, এখানে আপনার লগইন শংসাপত্র রয়েছে:",
    loginFooter: "আপনার নিরাপত্তার জন্য, আমরা এই তথ্যটি গোপন রাখার পরামর্শ দিচ্ছি। আপনার PIN কোড কারও সাথে শেয়ার করবেন না।",
    
    actSubj: "App Pay স্থানান্তরের জন্য আপনার সক্রিয়করণ কোড",
    actGreet: "প্রিয় {name},",
    actIntro: "আপনার লেনদেনের নিরাপত্তা নিশ্চিত করতে, অনুগ্রহ করে নীচে আপনার ব্যক্তিগত সক্রিয়করণ কোডটি দেখুন। আপনার প্রতিটি স্থানান্তর যাচাই করতে এই কোডটি প্রয়োজন হবে:",
    actFooter: "এই কোডটি নিরাপদ স্থানে রাখুন। এটি কঠোরভাবে ব্যক্তিগত এবং গোপনীয়। তৃতীয় পক্ষের সাথে এই কোডটি কখনও শেয়ার করবেন না, এমনকি তারা নিজেদের App Pay উপদেষ্টা বলে দাবি করলেও।",

    successSubj: "আপনার App Pay স্থানান্তরের নিশ্চিতকরণ",
    successGreet: "প্রিয় {name},",
    successIntro: "আমরা নিশ্চিত করছি যে আপনার স্থানান্তর সফলভাবে প্রক্রিয়া করা হয়েছে। এখানে লেনদেনের সারাংশ রয়েছে:",
    successFooter: "তহবিল 24 থেকে 48 কর্মঘণ্টার মধ্যে প্রাপকের অ্যাকাউন্টে জমা হবে। আপনার বিশ্বাসের জন্য ধন্যবাদ।",

    failedSubj: "সতর্কতা: আপনার App Pay স্থানান্তর অবরুদ্ধ করা হয়েছে",
    failedGreet: "প্রিয় {name},",
    failedIntro: "আমরা আপনাকে জানাচ্ছি যে আপনার অ্যাকাউন্টে একটি স্থানান্তরের চেষ্টা আমাদের নিরাপত্তা সিস্টেম দ্বারা অবরুদ্ধ করা হয়েছে। এখানে বিশদ রয়েছে:",
    failedFooter: "কোনও পরিমাণ ডেবিট করা হয়নি। আরও তথ্যের জন্য অনুগ্রহ করে গ্রাহক পরিষেবার সাথে যোগাযোগ করুন।",

    pendingSubj: "আপনার App Pay স্থানান্তর যাচাইয়ের অপেক্ষায় রয়েছে",
    pendingGreet: "প্রিয় {name},",
    pendingIntro: "আমরা আপনাকে জানাচ্ছি যে আপনার স্থানান্তর নিবন্ধিত হয়েছে এবং বর্তমানে আমাদের প্রশাসনিক পরিষেবা দ্বারা যাচাইয়ের অপেক্ষায় রয়েছে।",
    pendingFooter: "স্থানান্তর প্রক্রিয়া করা হলে আপনি একটি বিজ্ঞপ্তি পাবেন।",

    validatedSubj: "প্রশাসন দ্বারা স্থানান্তর যাচাই করা হয়েছে",
    validatedGreet: "প্রিয় {name},",
    validatedIntro: "আমরা আপনাকে জানাচ্ছি যে আপনার অপেক্ষমাণ স্থানান্তরটি আমাদের প্রশাসনিক পরিষেবা দ্বারা যাচাই করা হয়েছে এবং সফলভাবে প্রক্রিয়া করা হয়েছে।",
    validatedFooter: "তহবিল 24 থেকে 48 কর্মঘণ্টার মধ্যে প্রাপকের অ্যাকাউন্টে জমা হবে। আপনার বিশ্বাসের জন্য ধন্যবাদ।",

    cancelledSubj: "প্রশাসন দ্বারা স্থানান্তর বাতিল করা হয়েছে",
    cancelledGreet: "প্রিয় {name},",
    cancelledIntro: "আমরা আপনাকে জানাচ্ছি যে আপনার স্থানান্তরটি আমাদের প্রশাসনিক পরিষেবা দ্বারা বাতিল করা হয়েছে। পরিমাণটি আপনার অ্যাকাউন্টে পুনরায় জমা করা হয়েছে।",
    cancelledFooter: "আপনি আপনার ক্লায়েন্ট পোর্টালে আপনার নতুন ব্যালেন্স পরীক্ষা করতে পারেন।",

    refundSubj: "স্থানান্তর ফেরত দেওয়া হয়েছে",
    refundGreet: "প্রিয় {name},",
    refundIntro: "আমরা আপনাকে জানাচ্ছি যে আপনার স্থানান্তরের পরিমাণ আপনাকে ফেরত দেওয়া হয়েছে। এখানে বিশদ রয়েছে:",
    refundFooter: "পরিমাণটি আপনার অ্যাকাউন্টে পুনরায় জমা করা হয়েছে। আপনার বোঝার জন্য ধন্যবাদ।",

    userCancelledSubj: "স্থানান্তর বাতিল করা হয়েছে",
    userCancelledGreet: "প্রিয় {name},",
    userCancelledIntro: "আমরা নিশ্চিত করছি যে আপনার স্থানান্তর বাতিল করা হয়েছে। আপনার অ্যাকাউন্ট থেকে কোনও পরিমাণ ডেবিট করা হয়নি।",
    userCancelledFooter: "আপনি যদি এই বাতিলকরণ শুরু না করে থাকেন, তাহলে অনুগ্রহ করে অবিলম্বে আমাদের গ্রাহক পরিষেবার সাথে যোগাযোগ করুন।",

    adminConnectionSubj: " App Pay-তে নতুন ক্লায়েন্ট সংযোগ",
    adminConnectionGreet: "হ্যালো অ্যাডমিনিস্ট্রেটর,",
    adminConnectionIntro: "নিম্নলিখিত ক্লায়েন্ট এইমাত্র তার App Pay অ্যাকাউন্টে লগ ইন করেছেন। এখানে সংযোগের বিশদ রয়েছে:",
    adminConnectionFooter: "প্রতিবার কোনও ক্লায়েন্ট লগ ইন করলে এই ইমেলটি স্বয়ংক্রিয়ভাবে অ্যাডমিনিস্ট্রেটরকে পাঠানো হয়।"
},

// ═══════════════════════════════════════════════════════
// LANGUE : OURDOU (ur)
// ═══════════════════════════════════════════════════════
ur: {
    loginSubj: "App Pay میں خوش آمدید – آپ کے لاگ ان کی اسناد",
    loginGreet: "محترم {name}،",
    loginIntro: "ہمیں App Pay میں آپ کا اکاؤنٹ کھولنے کی تصدیق کرتے ہوئے خوشی ہو رہی ہے۔ آپ کے اعتماد کا شکریہ۔ اپنے آن لائن کلائنٹ پورٹل تک رسائی کے لیے، یہ ہیں آپ کے لاگ ان کی اسناد:",
    loginFooter: "آپ کی سلامتی کے لیے، ہم تجویز کرتے ہیں کہ آپ اس معلومات کو خفیہ رکھیں۔ اپنا PIN کوڈ کبھی کسی کے ساتھ شیئر نہ کریں۔",
    
    actSubj: "App Pay منتقلی کے لیے آپ کا ایکٹیویشن کوڈ",
    actGreet: "محترم {name}،",
    actIntro: "اپنے لین دین کی سلامتی کو یقینی بنانے کے لیے، براہ کرم نیچے اپنا ذاتی ایکٹیویشن کوڈ دیکھیں۔ آپ کی ہر منتقلی کی تصدیق کے لیے یہ کوڈ درکار ہوگا:",
    actFooter: "اس کوڈ کو محفوظ جگہ پر رکھیں۔ یہ سختی سے ذاتی اور خفیہ ہے۔ یہ کوڈ کبھی کسی تیسرے فریق کے ساتھ شیئر نہ کریں، چاہے وہ خود کو App Pay مشیر بتائیں۔",

    successSubj: "آپ کی App Pay منتقلی کی تصدیق",
    successGreet: "محترم {name}،",
    successIntro: "ہم تصدیق کرتے ہیں کہ آپ کی منتقلی کامیابی سے مکمل کر لی گئی ہے۔ یہ ہے لین دین کا خلاصہ:",
    successFooter: "رقم 24 سے 48 کاروباری گھنٹوں کے اندر مستفید ہونے والے کے اکاؤنٹ میں جمع کر دی جائے گی۔ آپ کے اعتماد کا شکریہ۔",

    failedSubj: "انتباہ: آپ کی App Pay منتقلی مسدود کر دی گئی",
    failedGreet: "محترم {name}،",
    failedIntro: "ہم آپ کو مطلع کرتے ہیں کہ آپ کے اکاؤنٹ پر منتقلی کی کوشش ہمارے سیکیورٹی سسٹمز نے مسدود کر دی ہے۔ یہ ہیں تفصیلات:",
    failedFooter: "کوئی رقم ڈیبٹ نہیں کی گئی۔ مزید معلومات کے لیے براہ کرم کسٹمر سروس سے رابطہ کریں۔",

    pendingSubj: "آپ کی App Pay منتقلی تصدیق کے انتظار میں ہے",
    pendingGreet: "محترم {name}،",
    pendingIntro: "ہم آپ کو مطلع کرتے ہیں کہ آپ کی منتقلی رجسٹر ہو گئی ہے اور فی الحال ہماری انتظامی سروس کی تصدیق کے انتظار میں ہے۔",
    pendingFooter: "منتقلی مکمل ہوتے ہی آپ کو ایک اطلاع موصول ہوگی۔",

    validatedSubj: "منتقلی انتظامیہ کی طرف سے تصدیق شدہ",
    validatedGreet: "محترم {name}،",
    validatedIntro: "ہم آپ کو مطلع کرتے ہیں کہ آپ کی زیر التواء منتقلی کو ہماری انتظامی سروس نے تصدیق کر دیا ہے اور کامیابی سے مکمل کر لیا گیا ہے۔",
    validatedFooter: "رقم 24 سے 48 کاروباری گھنٹوں کے اندر مستفید ہونے والے کے اکاؤنٹ میں جمع کر دی جائے گی۔ آپ کے اعتماد کا شکریہ۔",

    cancelledSubj: "منتقلی انتظامیہ کی طرف سے منسوخ",
    cancelledGreet: "محترم {name}،",
    cancelledIntro: "ہم آپ کو مطلع کرتے ہیں کہ آپ کی منتقلی ہماری انتظامی سروس نے منسوخ کر دی ہے۔ رقم آپ کے اکاؤنٹ میں دوبارہ جمع کر دی گئی ہے۔",
    cancelledFooter: "آپ اپنے کلائنٹ پورٹل میں اپنا نیا بیلنس چیک کر سکتے ہیں۔",

    refundSubj: "منتقلی کی رقم واپس",
    refundGreet: "محترم {name}،",
    refundIntro: "ہم آپ کو مطلع کرتے ہیں کہ آپ کی منتقلی کی رقم آپ کو واپس کر دی گئی ہے۔ یہ ہیں تفصیلات:",
    refundFooter: "رقم آپ کے اکاؤنٹ میں دوبارہ جمع کر دی گئی ہے۔ آپ کی سمجھ کے لیے شکریہ۔",

    userCancelledSubj: "منتقلی منسوخ",
    userCancelledGreet: "محترم {name}،",
    userCancelledIntro: "ہم تصدیق کرتے ہیں کہ آپ کی منتقلی منسوخ کر دی گئی ہے۔ آپ کے اکاؤنٹ سے کوئی رقم ڈیبٹ نہیں کی گئی۔",
    userCancelledFooter: "اگر آپ نے یہ منسوخی شروع نہیں کی، تو براہ کرم فوری طور پر ہماری کسٹمر سروس سے رابطہ کریں۔",

    adminConnectionSubj: " App Pay پر نئی کلائنٹ کنکشن",
    adminConnectionGreet: "ہیلو ایڈمنسٹریٹر،",
    adminConnectionIntro: "درج ذیل کلائنٹ نے ابھی اپنے App Pay اکاؤنٹ میں لاگ ان کیا ہے۔ یہ ہیں کنکشن کی تفصیلات:",
    adminConnectionFooter: "یہ ای میل ہر بار کلائنٹ کے لاگ ان کرنے پر ایڈمنسٹریٹر کو خودکار طور پر بھیجی جاتی ہے۔"
},

// ═══════════════════════════════════════════════════════
// LANGUE : PERSAN (fa)
// ═══════════════════════════════════════════════════════
fa: {
    loginSubj: "به App Pay خوش آمدید – اطلاعات ورود شما",
    loginGreet: "کاربر گرامی {name}،",
    loginIntro: "ما خوشحالیم که افتتاح حساب شما را در App Pay تأیید می‌کنیم. از اعتماد شما سپاسگزاریم. برای دسترسی به پورتال مشتری آنلاین خود، اطلاعات ورود شما عبارتند از:",
    loginFooter: "برای امنیت شما، توصیه می‌کنیم این اطلاعات را محرمانه نگه دارید. هرگز کد PIN خود را با هیچ کس به اشتراک نگذارید.",
    
    actSubj: "کد فعال‌سازی شما برای حواله‌های App Pay",
    actGreet: "کاربر گرامی {name}،",
    actIntro: "برای تضمین امنیت تراکنش‌های شما، لطفاً کد فعال‌سازی شخصی خود را در زیر ببینید. این کد برای تأیید هر یک از حواله‌های شما لازم است:",
    actFooter: "این کد را در جای امنی نگه دارید. این کد کاملاً شخصی و محرمانه است. هرگز این کد را با شخص ثالثی به اشتراک نگذارید، حتی اگر ادعا کنند مشاور App Pay هستند.",

    successSubj: "تأیید حواله App Pay شما",
    successGreet: "کاربر گرامی {name}،",
    successIntro: "ما تأیید می‌کنیم که حواله شما با موفقیت پردازش شده است. در اینجا خلاصه عملیات آمده است:",
    successFooter: "وجه ظرف ۲۴ تا ۴۸ ساعت کاری به حساب ذینفع واریز می‌شود. از اعتماد شما سپاسگزاریم.",

    failedSubj: "هشدار: حواله App Pay شما مسدود شد",
    failedGreet: "کاربر گرامی {name}،",
    failedIntro: "به اطلاع شما می‌رسانیم که تلاش برای حواله از حساب شما توسط سیستم‌های امنیتی ما مسدود شده است. در اینجا جزئیات آمده است:",
    failedFooter: "هیچ مبلغی کسر نشده است. لطفاً برای اطلاعات بیشتر با خدمات مشتریان تماس بگیرید.",

    pendingSubj: "حواله App Pay شما در انتظار تأیید است",
    pendingGreet: "کاربر گرامی {name}،",
    pendingIntro: "به اطلاع شما می‌رسانیم که حواله شما ثبت شده و در حال حاضر در انتظار تأیید توسط سرویس اداری ما است.",
    pendingFooter: "به محض پردازش حواله، اعلانی دریافت خواهید کرد.",

    validatedSubj: "حواله توسط مدیریت تأیید شد",
    validatedGreet: "کاربر گرامی {name}،",
    validatedIntro: "به اطلاع شما می‌رسانیم که حواله در انتظار شما توسط سرویس اداری ما تأیید و با موفقیت پردازش شد.",
    validatedFooter: "وجه ظرف ۲۴ تا ۴۸ ساعت کاری به حساب ذینفع واریز می‌شود. از اعتماد شما سپاسگزاریم.",

    cancelledSubj: "حواله توسط مدیریت لغو شد",
    cancelledGreet: "کاربر گرامی {name}،",
    cancelledIntro: "به اطلاع شما می‌رسانیم که حواله شما توسط سرویس اداری ما لغو شده است. مبلغ مجدداً به حساب شما واریز شده است.",
    cancelledFooter: "می‌توانید موجودی جدید خود را در پورتال مشتری خود بررسی کنید.",

    refundSubj: "حواله بازپرداخت شد",
    refundGreet: "کاربر گرامی {name}،",
    refundIntro: "به اطلاع شما می‌رسانیم که مبلغ حواله شما به شما بازپرداخت شده است. در اینجا جزئیات آمده است:",
    refundFooter: "مبلغ مجدداً به حساب شما واریز شده است. از درک شما سپاسگزاریم.",

    userCancelledSubj: "حواله لغو شد",
    userCancelledGreet: "کاربر گرامی {name}،",
    userCancelledIntro: "ما تأیید می‌کنیم که حواله شما لغو شده است. هیچ مبلغی از حساب شما کسر نشده است.",
    userCancelledFooter: "اگر شما این لغو را آغاز نکرده‌اید، لطفاً فوراً با خدمات مشتریان ما تماس بگیرید.",

    adminConnectionSubj: " اتصال مشتری جدید در App Pay",
    adminConnectionGreet: "سلام مدیر،",
    adminConnectionIntro: "مشتری زیر همین حالا وارد حساب App Pay خود شد. در اینجا جزئیات اتصال آمده است:",
    adminConnectionFooter: "این ایمیل هر بار که مشتری وارد می‌شود به طور خودکار برای مدیر ارسال می‌شود."
},

// ═══════════════════════════════════════════════════════
// LANGUE : TAMOUL (ta)
// ═══════════════════════════════════════════════════════
ta: {
    loginSubj: "App Pay-க்கு வருக – உங்கள் உள்நுழைவு விவரங்கள்",
    loginGreet: "அன்புள்ள {name},",
    loginIntro: "App Pay-ல் உங்கள் கணக்கு திறக்கப்பட்டதை உறுதிப்படுத்துவதில் நாங்கள் மகிழ்ச்சியடைகிறோம். உங்கள் நம்பிக்கைக்கு நன்றி. உங்கள் ஆன்லைன் வாடிக்கையாளர் போர்ட்டலை அணுக, உங்கள் உள்நுழைவு விவரங்கள் இங்கே:",
    loginFooter: "உங்கள் பாதுகாப்பிற்காக, இந்த தகவலை ரகசியமாக வைத்திருக்க பரிந்துரைக்கிறோம். உங்கள் PIN குறியீட்டை யாருடனும் பகிர வேண்டாம்.",
    
    actSubj: "App Pay பணப் பரிமாற்றங்களுக்கான உங்கள் செயல்படுத்தல் குறியீடு",
    actGreet: "அன்புள்ள {name},",
    actIntro: "உங்கள் பரிவர்த்தனைகளின் பாதுகாப்பை உறுதிப்படுத்த, கீழே உங்கள் தனிப்பட்ட செயல்படுத்தல் குறியீட்டைக் காணலாம். உங்கள் ஒவ்வொரு பணப் பரிமாற்றத்தையும் சரிபார்க்க இந்தக் குறியீடு தேவைப்படும்:",
    actFooter: "இந்தக் குறியீட்டை பாதுகாப்பான இடத்தில் வைத்திருங்கள். இது கண்டிப்பாக தனிப்பட்டது மற்றும் ரகசியமானது. App Pay ஆலோசகர்கள் என்று கூறிக்கொண்டாலும், இந்தக் குறியீட்டை மூன்றாம் தரப்பினருடன் பகிர வேண்டாம்.",

    successSubj: "உங்கள் App Pay பணப் பரிமாற்றத்தின் உறுதிப்படுத்தல்",
    successGreet: "அன்புள்ள {name},",
    successIntro: "உங்கள் பணப் பரிமாற்றம் வெற்றிகரமாக செயலாக்கப்பட்டதை உறுதிப்படுத்துகிறோம். பரிவர்த்தனையின் சுருக்கம் இங்கே:",
    successFooter: "நிதி 24 முதல் 48 வேலை நேரங்களுக்குள் பயனாளியின் கணக்கில் வரவு வைக்கப்படும். உங்கள் நம்பிக்கைக்கு நன்றி.",

    failedSubj: "எச்சரிக்கை: உங்கள் App Pay பணப் பரிமாற்றம் தடுக்கப்பட்டது",
    failedGreet: "அன்புள்ள {name},",
    failedIntro: "உங்கள் கணக்கில் பணப் பரிமாற்ற முயற்சி எங்கள் பாதுகாப்பு அமைப்புகளால் தடுக்கப்பட்டதை உங்களுக்குத் தெரிவிக்கிறோம். விவரங்கள் இங்கே:",
    failedFooter: "எந்தத் தொகையும் பற்று வைக்கப்படவில்லை. மேலும் தகவலுக்கு வாடிக்கையாளர் சேவையைத் தொடர்பு கொள்ளவும்.",

    pendingSubj: "உங்கள் App Pay பணப் பரிமாற்றம் சரிபார்ப்புக்காக காத்திருக்கிறது",
    pendingGreet: "அன்புள்ள {name},",
    pendingIntro: "உங்கள் பணப் பரிமாற்றம் பதிவு செய்யப்பட்டு, தற்போது எங்கள் நிர்வாக சேவையின் சரிபார்ப்புக்காக காத்திருப்பதை உங்களுக்குத் தெரிவிக்கிறோம்.",
    pendingFooter: "பணப் பரிமாற்றம் செயலாக்கப்பட்டதும் உங்களுக்கு அறிவிப்பு வரும்.",

    validatedSubj: "பணப் பரிமாற்றம் நிர்வாகத்தால் சரிபார்க்கப்பட்டது",
    validatedGreet: "அன்புள்ள {name},",
    validatedIntro: "உங்கள் நிலுவையில் உள்ள பணப் பரிமாற்றம் எங்கள் நிர்வாக சேவையால் சரிபார்க்கப்பட்டு வெற்றிகரமாக செயலாக்கப்பட்டதை உங்களுக்குத் தெரிவிக்கிறோம்.",
    validatedFooter: "நிதி 24 முதல் 48 வேலை நேரங்களுக்குள் பயனாளியின் கணக்கில் வரவு வைக்கப்படும். உங்கள் நம்பிக்கைக்கு நன்றி.",

    cancelledSubj: "பணப் பரிமாற்றம் நிர்வாகத்தால் ரத்து செய்யப்பட்டது",
    cancelledGreet: "அன்புள்ள {name},",
    cancelledIntro: "உங்கள் பணப் பரிமாற்றம் எங்கள் நிர்வாக சேவையால் ரத்து செய்யப்பட்டதை உங்களுக்குத் தெரிவிக்கிறோம். தொகை உங்கள் கணக்கில் மீண்டும் வரவு வைக்கப்பட்டுள்ளது.",
    cancelledFooter: "உங்கள் புதிய இருப்பை உங்கள் வாடிக்கையாளர் போர்ட்டலில் சரிபார்க்கலாம்.",

    refundSubj: "பணப் பரிமாற்றம் திருப்பிச் செலுத்தப்பட்டது",
    refundGreet: "அன்புள்ள {name},",
    refundIntro: "உங்கள் பணப் பரிமாற்றத்தின் தொகை உங்களுக்குத் திருப்பிச் செலுத்தப்பட்டதை உங்களுக்குத் தெரிவிக்கிறோம். விவரங்கள் இங்கே:",
    refundFooter: "தொகை உங்கள் கணக்கில் மீண்டும் வரவு வைக்கப்பட்டுள்ளது. உங்கள் புரிதலுக்கு நன்றி.",

    userCancelledSubj: "பணப் பரிமாற்றம் ரத்து செய்யப்பட்டது",
    userCancelledGreet: "அன்புள்ள {name},",
    userCancelledIntro: "உங்கள் பணப் பரிமாற்றம் ரத்து செய்யப்பட்டதை உறுதிப்படுத்துகிறோம். உங்கள் கணக்கிலிருந்து எந்தத் தொகையும் பற்று வைக்கப்படவில்லை.",
    userCancelledFooter: "இந்த ரத்தை நீங்கள் தொடங்கவில்லை என்றால், உடனடியாக எங்கள் வாடிக்கையாளர் சேவையைத் தொடர்பு கொள்ளவும்.",

    adminConnectionSubj: " App Pay-ல் புதிய வாடிக்கையாளர் இணைப்பு",
    adminConnectionGreet: "வணக்கம் நிர்வாகி,",
    adminConnectionIntro: "பின்வரும் வாடிக்கையாளர் தற்போது தனது App Pay கணக்கில் உள்நுழைந்தார். இணைப்பு விவரங்கள் இங்கே:",
    adminConnectionFooter: "ஒரு வாடிக்கையாளர் உள்நுழையும் ஒவ்வொரு முறையும் இந்த மின்னஞ்சல் நிர்வாகிக்கு தானாகவே அனுப்பப்படும்."
},
// ═══════════════════════════════════════════════════════
// LANGUE : INDONÉSIEN (id)
// ═══════════════════════════════════════════════════════
id: {
    loginSubj: "Selamat datang di App Pay – Kredensial login Anda",
    loginGreet: "Yang terhormat {name},",
    loginIntro: "Kami dengan senang hati mengonfirmasi pembukaan akun Anda di App Pay. Terima kasih atas kepercayaan Anda. Untuk mengakses portal klien online Anda, berikut adalah kredensial login Anda:",
    loginFooter: "Demi keamanan Anda, kami menyarankan Anda menjaga kerahasiaan informasi ini. Jangan pernah membagikan kode PIN Anda kepada siapa pun.",
    
    actSubj: "Kode aktivasi Anda untuk transfer App Pay",
    actGreet: "Yang terhormat {name},",
    actIntro: "Untuk memastikan keamanan transaksi Anda, silakan temukan kode aktivasi pribadi Anda di bawah ini. Kode ini akan diminta untuk memvalidasi setiap transfer Anda:",
    actFooter: "Simpan kode ini di tempat yang aman. Kode ini bersifat pribadi dan rahasia. Jangan pernah membagikan kode ini kepada pihak ketiga, bahkan jika mereka mengaku sebagai penasihat App Pay.",

    successSubj: "Konfirmasi transfer App Pay Anda",
    successGreet: "Yang terhormat {name},",
    successIntro: "Kami mengonfirmasi bahwa transfer Anda telah berhasil diproses. Berikut adalah ringkasan transaksi:",
    successFooter: "Dana akan dikreditkan ke rekening penerima dalam waktu 24 hingga 48 jam kerja. Terima kasih atas kepercayaan Anda.",

    failedSubj: "Peringatan: Transfer App Pay Anda diblokir",
    failedGreet: "Yang terhormat {name},",
    failedIntro: "Kami menginformasikan bahwa upaya transfer pada akun Anda diblokir oleh sistem keamanan kami. Berikut adalah detailnya:",
    failedFooter: "Tidak ada jumlah yang didebit. Silakan hubungi layanan pelanggan untuk informasi lebih lanjut.",

    pendingSubj: "Transfer App Pay Anda menunggu validasi",
    pendingGreet: "Yang terhormat {name},",
    pendingIntro: "Kami menginformasikan bahwa transfer Anda telah terdaftar dan saat ini menunggu validasi oleh layanan administrasi kami.",
    pendingFooter: "Anda akan menerima notifikasi segera setelah transfer diproses.",

    validatedSubj: "Transfer divalidasi oleh administrasi",
    validatedGreet: "Yang terhormat {name},",
    validatedIntro: "Kami menginformasikan bahwa transfer tertunda Anda telah divalidasi oleh layanan administrasi kami dan berhasil diproses.",
    validatedFooter: "Dana akan dikreditkan ke rekening penerima dalam waktu 24 hingga 48 jam kerja. Terima kasih atas kepercayaan Anda.",

    cancelledSubj: "Transfer dibatalkan oleh administrasi",
    cancelledGreet: "Yang terhormat {name},",
    cancelledIntro: "Kami menginformasikan bahwa transfer Anda telah dibatalkan oleh layanan administrasi kami. Jumlah tersebut telah dikreditkan kembali ke akun Anda.",
    cancelledFooter: "Anda dapat memeriksa saldo baru Anda di portal klien Anda.",

    refundSubj: "Transfer dikembalikan",
    refundGreet: "Yang terhormat {name},",
    refundIntro: "Kami menginformasikan bahwa jumlah transfer Anda telah dikembalikan kepada Anda. Berikut adalah detailnya:",
    refundFooter: "Jumlah tersebut telah dikreditkan kembali ke akun Anda. Terima kasih atas pengertiannya.",

    userCancelledSubj: "Transfer dibatalkan",
    userCancelledGreet: "Yang terhormat {name},",
    userCancelledIntro: "Kami mengonfirmasi bahwa transfer Anda telah dibatalkan. Tidak ada jumlah yang didebit dari akun Anda.",
    userCancelledFooter: "Jika Anda tidak memulai pembatalan ini, silakan hubungi layanan pelanggan kami segera.",

    adminConnectionSubj: " Koneksi klien baru di App Pay",
    adminConnectionGreet: "Halo Administrator,",
    adminConnectionIntro: "Klien berikut baru saja masuk ke akun App Pay mereka. Berikut adalah detail koneksi:",
    adminConnectionFooter: "Email ini dikirim secara otomatis kepada administrator setiap kali klien masuk."
},

// ═══════════════════════════════════════════════════════
// LANGUE : MALAIS (ms)
// ═══════════════════════════════════════════════════════
ms: {
    loginSubj: "Selamat datang ke App Pay – Kelayakan log masuk anda",
    loginGreet: "Yang dihormati {name},",
    loginIntro: "Kami dengan sukacitanya mengesahkan pembukaan akaun anda di App Pay. Terima kasih atas kepercayaan anda. Untuk mengakses portal klien dalam talian anda, berikut adalah kelayakan log masuk anda:",
    loginFooter: "Untuk keselamatan anda, kami mengesyorkan agar anda merahsiakan maklumat ini. Jangan sekali-kali berkongsi kod PIN anda dengan sesiapa.",
    
    actSubj: "Kod pengaktifan anda untuk pemindahan App Pay",
    actGreet: "Yang dihormati {name},",
    actIntro: "Untuk memastikan keselamatan transaksi anda, sila cari kod pengaktifan peribadi anda di bawah. Kod ini akan diperlukan untuk mengesahkan setiap pemindahan anda:",
    actFooter: "Simpan kod ini di tempat yang selamat. Ia adalah peribadi dan sulit. Jangan sekali-kali berkongsi kod ini dengan pihak ketiga, walaupun mereka mendakwa sebagai penasihat App Pay.",

    successSubj: "Pengesahan pemindahan App Pay anda",
    successGreet: "Yang dihormati {name},",
    successIntro: "Kami mengesahkan bahawa pemindahan anda telah berjaya diproses. Berikut adalah ringkasan transaksi:",
    successFooter: "Dana akan dikreditkan ke akaun penerima dalam masa 24 hingga 48 jam bekerja. Terima kasih atas kepercayaan anda.",

    failedSubj: "Amaran: Pemindahan App Pay anda telah disekat",
    failedGreet: "Yang dihormati {name},",
    failedIntro: "Kami memaklumkan bahawa percubaan pemindahan pada akaun anda telah disekat oleh sistem keselamatan kami. Berikut adalah butirannya:",
    failedFooter: "Tiada jumlah yang didebitkan. Sila hubungi perkhidmatan pelanggan untuk maklumat lanjut.",

    pendingSubj: "Pemindahan App Pay anda menunggu pengesahan",
    pendingGreet: "Yang dihormati {name},",
    pendingIntro: "Kami memaklumkan bahawa pemindahan anda telah didaftarkan dan kini menunggu pengesahan oleh perkhidmatan pentadbiran kami.",
    pendingFooter: "Anda akan menerima pemberitahuan sebaik sahaja pemindahan diproses.",

    validatedSubj: "Pemindahan disahkan oleh pentadbiran",
    validatedGreet: "Yang dihormati {name},",
    validatedIntro: "Kami memaklumkan bahawa pemindahan tertunda anda telah disahkan oleh perkhidmatan pentadbiran kami dan berjaya diproses.",
    validatedFooter: "Dana akan dikreditkan ke akaun penerima dalam masa 24 hingga 48 jam bekerja. Terima kasih atas kepercayaan anda.",

    cancelledSubj: "Pemindahan dibatalkan oleh pentadbiran",
    cancelledGreet: "Yang dihormati {name},",
    cancelledIntro: "Kami memaklumkan bahawa pemindahan anda telah dibatalkan oleh perkhidmatan pentadbiran kami. Jumlah tersebut telah dikreditkan semula ke akaun anda.",
    cancelledFooter: "Anda boleh menyemak baki baharu anda dalam portal klien anda.",

    refundSubj: "Pemindahan dipulangkan",
    refundGreet: "Yang dihormati {name},",
    refundIntro: "Kami memaklumkan bahawa jumlah pemindahan anda telah dipulangkan kepada anda. Berikut adalah butirannya:",
    refundFooter: "Jumlah tersebut telah dikreditkan semula ke akaun anda. Terima kasih atas pemahaman anda.",

    userCancelledSubj: "Pemindahan dibatalkan",
    userCancelledGreet: "Yang dihormati {name},",
    userCancelledIntro: "Kami mengesahkan bahawa pemindahan anda telah dibatalkan. Tiada jumlah yang didebitkan daripada akaun anda.",
    userCancelledFooter: "Jika anda tidak memulakan pembatalan ini, sila hubungi perkhidmatan pelanggan kami dengan segera.",

    adminConnectionSubj: " Sambungan klien baharu di App Pay",
    adminConnectionGreet: "Halo Pentadbir,",
    adminConnectionIntro: "Klien berikut baru sahaja log masuk ke akaun App Pay mereka. Berikut adalah butiran sambungan:",
    adminConnectionFooter: "E-mel ini dihantar secara automatik kepada pentadbir setiap kali klien log masuk."
},

// ═══════════════════════════════════════════════════════
// LANGUE : THAÏ (th)
// ═══════════════════════════════════════════════════════
th: {
    loginSubj: "ยินดีต้อนรับสู่ App Pay – ข้อมูลการเข้าสู่ระบบของคุณ",
    loginGreet: "เรียนคุณ {name},",
    loginIntro: "เรายินดีที่จะยืนยันการเปิดบัญชีของคุณกับ App Pay ขอขอบคุณสำหรับความไว้วางใจของคุณ ในการเข้าถึงพอร์ทัลลูกค้าออนไลน์ของคุณ ข้อมูลการเข้าสู่ระบบของคุณมีดังนี้:",
    loginFooter: "เพื่อความปลอดภัยของคุณ เราขอแนะนำให้เก็บข้อมูลนี้เป็นความลับ ห้ามแชร์รหัส PIN ของคุณกับ任何人โดยเด็ดขาด",
    
    actSubj: "รหัสเปิดใช้งานของคุณสำหรับการโอนเงิน App Pay",
    actGreet: "เรียนคุณ {name},",
    actIntro: "เพื่อให้มั่นใจในความปลอดภัยของธุรกรรมของคุณ โปรดดูรหัสเปิดใช้งานส่วนตัวของคุณด้านล่าง รหัสนี้จะถูกขอให้ยืนยันการโอนเงินแต่ละครั้งของคุณ:",
    actFooter: "เก็บรหัสนี้ไว้ในที่ปลอดภัย รหัสนี้เป็นความลับส่วนบุคคลอย่างเคร่งครัด ห้ามแชร์รหัสนี้กับบุคคลที่สาม แม้ว่าพวกเขาจะอ้างว่าเป็นที่ปรึกษาของ App Pay ก็ตาม",

    successSubj: "การยืนยันการโอนเงิน App Pay ของคุณ",
    successGreet: "เรียนคุณ {name},",
    successIntro: "เราขอยืนยันว่าการโอนเงินของคุณได้รับการประมวลผลเรียบร้อยแล้ว นี่คือสรุปของธุรกรรม:",
    successFooter: "เงินจะถูกโอนเข้าบัญชีของผู้รับภายใน 24 ถึง 48 ชั่วโมงทำการ ขอบคุณสำหรับความไว้วางใจของคุณ",

    failedSubj: "คำเตือน: การโอนเงิน App Pay ของคุณถูกบล็อก",
    failedGreet: "เรียนคุณ {name},",
    failedIntro: "เราขอแจ้งให้คุณทราบว่าความพยายามโอนเงินในบัญชีของคุณถูกบล็อกโดยระบบรักษาความปลอดภัยของเรา นี่คือรายละเอียด:",
    failedFooter: "ไม่มีจำนวนเงินใดถูกหักออก โปรดติดต่อฝ่ายบริการลูกค้าเพื่อรับข้อมูลเพิ่มเติม",

    pendingSubj: "การโอนเงิน App Pay ของคุณอยู่ระหว่างรอการตรวจสอบ",
    pendingGreet: "เรียนคุณ {name},",
    pendingIntro: "เราขอแจ้งให้คุณทราบว่าการโอนเงินของคุณได้รับการลงทะเบียนแล้วและขณะนี้อยู่ระหว่างรอการตรวจสอบโดยฝ่ายบริการธุรการของเรา",
    pendingFooter: "คุณจะได้รับ通知เมื่อการโอนเงินได้รับการประมวลผล",

    validatedSubj: "การโอนเงินได้รับการตรวจสอบโดยฝ่ายบริหาร",
    validatedGreet: "เรียนคุณ {name},",
    validatedIntro: "เราขอแจ้งให้คุณทราบว่าการโอนเงินที่รอดำเนินการของคุณได้รับการตรวจสอบโดยฝ่ายบริการธุรการของเราและประมวลผลเรียบร้อยแล้ว",
    validatedFooter: "เงินจะถูกโอนเข้าบัญชีของผู้รับภายใน 24 ถึง 48 ชั่วโมงทำการ ขอบคุณสำหรับความไว้วางใจของคุณ",

    cancelledSubj: "การโอนเงินถูกยกเลิกโดยฝ่ายบริหาร",
    cancelledGreet: "เรียนคุณ {name},",
    cancelledIntro: "เราขอแจ้งให้คุณทราบว่าการโอนเงินของคุณถูกยกเลิกโดยฝ่ายบริการธุรการของเรา จำนวนเงินได้รับการโอนกลับเข้าบัญชีของคุณแล้ว",
    cancelledFooter: "คุณสามารถตรวจสอบยอดคงเหลือใหม่ของคุณได้ในพอร์ทัลลูกค้าของคุณ",

    refundSubj: "การโอนเงินได้รับการคืนเงิน",
    refundGreet: "เรียนคุณ {name},",
    refundIntro: "เราขอแจ้งให้คุณทราบว่าจำนวนเงินโอนของคุณได้รับการคืนเงินให้คุณแล้ว นี่คือรายละเอียด:",
    refundFooter: "จำนวนเงินได้รับการโอนกลับเข้าบัญชีของคุณแล้ว ขอบคุณสำหรับความเข้าใจของคุณ",

    userCancelledSubj: "การโอนเงินถูกยกเลิก",
    userCancelledGreet: "เรียนคุณ {name},",
    userCancelledIntro: "เราขอยืนยันว่าการโอนเงินของคุณถูกยกเลิกแล้ว ไม่มีจำนวนเงินใดถูกหักออกจากบัญชีของคุณ",
    userCancelledFooter: "หากคุณไม่ได้เป็นผู้เริ่มการยกเลิกนี้ โปรดติดต่อฝ่ายบริการลูกค้าของเราทันที",

    adminConnectionSubj: " การเชื่อมต่อลูกค้าใหม่บน App Pay",
    adminConnectionGreet: "สวัสดีผู้ดูแลระบบ,",
    adminConnectionIntro: "ลูกค้าต่อไปนี้เพิ่งเข้าสู่ระบบบัญชี App Pay ของพวกเขา นี่คือรายละเอียดการเชื่อมต่อ:",
    adminConnectionFooter: "อีเมลนี้จะถูกส่งไปยังผู้ดูแลระบบโดยอัตโนมัติทุกครั้งที่ลูกค้าเข้าสู่ระบบ"
},

// ═══════════════════════════════════════════════════════
// LANGUE : TAGALOG (tl)
// ═══════════════════════════════════════════════════════
tl: {
    loginSubj: "Maligayang pagdating sa App Pay – Ang iyong mga kredensyal sa pag-login",
    loginGreet: "Mahal na {name},",
    loginIntro: "Ikinalulugod naming kumpirmahin ang pagbubukas ng iyong account sa App Pay. Salamat sa iyong tiwala. Upang ma-access ang iyong online na portal ng kliyente, narito ang iyong mga kredensyal sa pag-login:",
    loginFooter: "Para sa iyong seguridad, inirerekumenda namin na itago mo ang impormasyong ito nang kumpidensyal. Huwag kailanman ibahagi ang iyong PIN code sa sinuman.",
    
    actSubj: "Ang iyong activation code para sa mga paglilipat ng App Pay",
    actGreet: "Mahal na {name},",
    actIntro: "Upang matiyak ang seguridad ng iyong mga transaksyon, paki-tingnan ang iyong personal na activation code sa ibaba. Kakailanganin ang code na ito upang mapatunayan ang bawat isa sa iyong mga paglilipat:",
    actFooter: "Itago ang code na ito sa isang ligtas na lugar. Ito ay mahigpit na personal at kumpidensyal. Huwag kailanman ibahagi ang code na ito sa isang third party, kahit na sinasabi nilang sila ay isang App Pay advisor.",

    successSubj: "Kumpirmasyon ng iyong paglilipat sa App Pay",
    successGreet: "Mahal na {name},",
    successIntro: "Kinukumpirma namin na ang iyong paglilipat ay matagumpay na naproseso. Narito ang buod ng transaksyon:",
    successFooter: "Ang mga pondo ay ikredito sa account ng benepisyaryo sa loob ng 24 hanggang 48 oras ng negosyo. Salamat sa iyong tiwala.",

    failedSubj: "Babala: Ang iyong paglilipat sa App Pay ay na-block",
    failedGreet: "Mahal na {name},",
    failedIntro: "Ipinapaalam namin sa iyo na ang isang pagtatangkang paglilipat sa iyong account ay na-block ng aming mga sistema ng seguridad. Narito ang mga detalye:",
    failedFooter: "Walang halagang na-debit. Mangyaring makipag-ugnayan sa customer service para sa karagdagang impormasyon.",

    pendingSubj: "Ang iyong paglilipat sa App Pay ay nakabinbin para sa validation",
    pendingGreet: "Mahal na {name},",
    pendingIntro: "Ipinapaalam namin sa iyo na ang iyong paglilipat ay nairehistro at kasalukuyang nakabinbin para sa validation ng aming serbisyong administratibo.",
    pendingFooter: "Makakatanggap ka ng notification sa sandaling maproseso ang paglilipat.",

    validatedSubj: "Ang paglilipat ay na-validate ng administrasyon",
    validatedGreet: "Mahal na {name},",
    validatedIntro: "Ipinapaalam namin sa iyo na ang iyong nakabinbing paglilipat ay na-validate ng aming serbisyong administratibo at matagumpay na naproseso.",
    validatedFooter: "Ang mga pondo ay ikredito sa account ng benepisyaryo sa loob ng 24 hanggang 48 oras ng negosyo. Salamat sa iyong tiwala.",

    cancelledSubj: "Ang paglilipat ay kinansela ng administrasyon",
    cancelledGreet: "Mahal na {name},",
    cancelledIntro: "Ipinapaalam namin sa iyo na ang iyong paglilipat ay kinansela ng aming serbisyong administratibo. Ang halaga ay naikredito pabalik sa iyong account.",
    cancelledFooter: "Maaari mong suriin ang iyong bagong balanse sa iyong portal ng kliyente.",

    refundSubj: "Ang paglilipat ay naibalik",
    refundGreet: "Mahal na {name},",
    refundIntro: "Ipinapaalam namin sa iyo na ang halaga ng iyong paglilipat ay naibalik sa iyo. Narito ang mga detalye:",
    refundFooter: "Ang halaga ay naikredito pabalik sa iyong account. Salamat sa iyong pag-unawa.",

    userCancelledSubj: "Kinansela ang paglilipat",
    userCancelledGreet: "Mahal na {name},",
    userCancelledIntro: "Kinukumpirma namin na ang iyong paglilipat ay kinansela. Walang halagang na-debit mula sa iyong account.",
    userCancelledFooter: "Kung hindi ikaw ang nagpasimula ng pagkanselang ito, mangyaring makipag-ugnayan kaagad sa aming customer service.",

    adminConnectionSubj: " Bagong koneksyon ng kliyente sa App Pay",
    adminConnectionGreet: "Kamusta Administrator,",
    adminConnectionIntro: "Ang sumusunod na kliyente ay karapatan lang na nag-log in sa kanilang App Pay account. Narito ang mga detalye ng koneksyon:",
    adminConnectionFooter: "Ang email na ito ay awtomatikong ipinapadala sa administrator sa tuwing mag-log in ang isang kliyente."
},

// ═══════════════════════════════════════════════════════
// LANGUE : BIRMAN (my)
// ═══════════════════════════════════════════════════════
my: {
    loginSubj: "App Pay မှ ကြိုဆိုပါတယ် – သင့်အကောင့်ဝင်ရောက်ရန် အထောက်အထားများ",
    loginGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    loginIntro: "App Pay တွင် သင့်အကောင့်ဖွင့်လှစ်ပြီးဖြစ်ကြောင်း အတည်ပြုပေးရခြင်းအတွက် ကျွန်ုပ်တို့ ဝမ်းမြောက်ပါသည်။ သင့်ယုံကြည်မှုအတွက် ကျေးဇူးတင်ပါသည်။ သင့်အွန်လိုင်းဖောက်သည်ပေါ်တယ်သို့ ဝင်ရောက်ရန်၊ သင့်အကောင့်ဝင်ရောက်ရန် အထောက်အထားများမှာ အောက်ပါအတိုင်းဖြစ်ပါသည်:",
    loginFooter: "သင့်လုံခြုံရေးအတွက် ဤအချက်အလက်များကို လျှို့ဝှက်ထားရန် ကျွန်ုပ်တို့ အကြံပြုအပ်ပါသည်။ သင့် PIN ကုဒ်ကို မည်သူ့ကိုမျှ ဘယ်တော့မှ မမျှဝေပါနှင့်။",
    
    actSubj: "App Pay ငွေလွှဲမှုများအတွက် သင့်သက်ဝင်ကုဒ်",
    actGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    actIntro: "သင့်ငွေရေးကြေးရေးလုပ်ငန်းများ၏ လုံခြုံရေးကို သေချာစေရန်၊ သင့်ကိုယ်ပိုင်သက်ဝင်ကုဒ်ကို အောက်တွင် ကြည့်ပါ။ သင့်ငွေလွှဲမှုတစ်ခုစီကို အတည်ပြုရန် ဤကုဒ်ကို တောင်းခံပါမည်:",
    actFooter: "ဤကုဒ်ကို လုံခြုံသောနေရာတွင် သိမ်းဆည်းထားပါ။ ၎င်းသည် ကိုယ်ပိုင်နှင့် လျှို့ဝှက်အပ်ပါသည်။ App Pay အကြံပေးဟု ဆိုသူများဖြစ်စေ၊ တတိယပုဂ္ဂိုလ်များထံ ဤကုဒ်ကို ဘယ်တော့မှ မမျှဝေပါနှင့်။",

    successSubj: "သင့် App Pay ငွေလွှဲမှု အတည်ပြုချက်",
    successGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    successIntro: "သင့်ငွေလွှဲမှုကို အောင်မြင်စွာ ဆောင်ရွက်ပြီးဖြစ်ကြောင်း ကျွန်ုပ်တို့ အတည်ပြုပါသည်။ ငွေရေးကြေးရေးလုပ်ငန်း၏ အနှစ်ချုပ်မှာ အောက်ပါအတိုင်းဖြစ်ပါသည်:",
    successFooter: "ငွေများကို ၂၄ နာရီမှ ၄၈ နာရီအတွင်း အကျိုးခံစားခွင့်ရှိသူ၏ အကောင့်ထဲသို့ လွှဲပြောင်းပေးပါမည်။ သင့်ယုံကြည်မှုအတွက် ကျေးဇူးတင်ပါသည်။",

    failedSubj: "သတိပေးချက်: သင့် App Pay ငွေလွှဲမှုကို ပိတ်ဆို့ထားပါသည်",
    failedGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    failedIntro: "သင့်အကောင့်တွင် ငွေလွှဲရန် ကြိုးပမ်းမှုကို ကျွန်ုပ်တို့၏ လုံခြုံရေးစနစ်များက ပိတ်ဆို့ထားကြောင်း သင့်ကို အသိပေးပါသည်။ အသေးစိတ်မှာ အောက်ပါအတိုင်းဖြစ်ပါသည်:",
    failedFooter: "မည်သည့်ငွေပမာဏမျှ နုတ်ယူခြင်းမပြုပါ။ နောက်ထပ်အချက်အလက်များအတွက် ဖောက်သည်ဝန်ဆောင်မှုကို ဆက်သွယ်ပါ။",

    pendingSubj: "သင့် App Pay ငွေလွှဲမှုသည် အတည်ပြုရန် စောင့်ဆိုင်းနေပါသည်",
    pendingGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    pendingIntro: "သင့်ငွေလွှဲမှုကို မှတ်ပုံတင်ပြီးဖြစ်ကြောင်းနှင့် လက်ရှိတွင် ကျွန်ုပ်တို့၏ အုပ်ချုပ်ရေးဝန်ဆောင်မှုမှ အတည်ပြုရန် စောင့်ဆိုင်းနေကြောင်း သင့်ကို အသိပေးပါသည်။",
    pendingFooter: "ငွေလွှဲမှုကို ဆောင်ရွက်ပြီးပါက သင့်ထံသို့ အသိပေးချက် ရရှိပါမည်။",

    validatedSubj: "ငွေလွှဲမှုကို အုပ်ချုပ်ရေးမှ အတည်ပြုပြီးပါပြီ",
    validatedGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    validatedIntro: "သင့်ဆိုင်းငံ့နေသော ငွေလွှဲမှုကို ကျွန်ုပ်တို့၏ အုပ်ချုပ်ရေးဝန်ဆောင်မှုမှ အတည်ပြုပြီး အောင်မြင်စွာ ဆောင်ရွက်ပြီးဖြစ်ကြောင်း သင့်ကို အသိပေးပါသည်။",
    validatedFooter: "ငွေများကို ၂၄ နာရီမှ ၄၈ နာရီအတွင်း အကျိုးခံစားခွင့်ရှိသူ၏ အကောင့်ထဲသို့ လွှဲပြောင်းပေးပါမည်။ သင့်ယုံကြည်မှုအတွက် ကျေးဇူးတင်ပါသည်။",

    cancelledSubj: "ငွေလွှဲမှုကို အုပ်ချုပ်ရေးမှ ပယ်ဖျက်လိုက်ပါပြီ",
    cancelledGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    cancelledIntro: "သင့်ငွေလွှဲမှုကို ကျွန်ုပ်တို့၏ အုပ်ချုပ်ရေးဝန်ဆောင်မှုမှ ပယ်ဖျက်လိုက်ကြောင်း သင့်ကို အသိပေးပါသည်။ ငွေပမာဏကို သင့်အကောင့်ထဲသို့ ပြန်လည်ထည့်သွင်းပေးပြီးဖြစ်ပါသည်။",
    cancelledFooter: "သင့်လက်ကျန်ငွေအသစ်ကို သင့်ဖောက်သည်ပေါ်တယ်တွင် စစ်ဆေးနိုင်ပါသည်။",

    refundSubj: "ငွေလွှဲမှုကို ပြန်အမ်းပြီးပါပြီ",
    refundGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    refundIntro: "သင့်ငွေလွှဲမှု၏ ပမာဏကို သင့်ထံသို့ ပြန်အမ်းပေးပြီးဖြစ်ကြောင်း သင့်ကို အသိပေးပါသည်။ အသေးစိတ်မှာ အောက်ပါအတိုင်းဖြစ်ပါသည်:",
    refundFooter: "ငွေပမာဏကို သင့်အကောင့်ထဲသို့ ပြန်လည်ထည့်သွင်းပေးပြီးဖြစ်ပါသည်။ သင့်နားလည်မှုအတွက် ကျေးဇူးတင်ပါသည်။",

    userCancelledSubj: "ငွေလွှဲမှုကို ပယ်ဖျက်လိုက်ပါပြီ",
    userCancelledGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    userCancelledIntro: "သင့်ငွေလွှဲမှုကို ပယ်ဖျက်လိုက်ကြောင်း ကျွန်ုပ်တို့ အတည်ပြုပါသည်။ သင့်အကောင့်မှ မည်သည့်ငွေပမာဏမျှ နုတ်ယူခြင်းမပြုပါ။",
    userCancelledFooter: "ဤပယ်ဖျက်မှုကို သင်ကိုယ်တိုင် စတင်ခဲ့ခြင်းမဟုတ်ပါက ကျွန်ုပ်တို့၏ ဖောက်သည်ဝန်ဆောင်မှုကို ချက်ချင်း ဆက်သွယ်ပါ။",

    adminConnectionSubj: " App Pay တွင် ကလိုင်းရင်း ချိတ်ဆက်မှုအသစ်",
    adminConnectionGreet: "မင်္ဂလာပါ အုပ်ချုပ်သူ၊",
    adminConnectionIntro: "အောက်ပါကလိုင်းရင်းသည် ၎င်းတို့၏ App Pay အကောင့်သို့ ယခုလေးတင် ဝင်ရောက်ခဲ့ပါသည်။ ချိတ်ဆက်မှု အသေးစိတ်မှာ အောက်ပါအတိုင်းဖြစ်ပါသည်:",
    adminConnectionFooter: "ကလိုင်းရင်းတစ်ဦး အကောင့်ဝင်ရောက်တိုင်း ဤအီးမေးလ်ကို အုပ်ချုပ်သူထံ အလိုအလျောက် ပေးပို့ပါသည်။"
},
// ============================================================
// 📧 FONCTION 3 : Confirmation de virement réussi
// ============================================================
export async function sendTransferSuccess(client, transfer) {
    if (!client?.email) return { success: false, error: 'MISSING_EMAIL' };

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.successSubj,
        greeting: replaceVars(t.successGreet, { name: prenom }),
        intro: t.successIntro,
        listItems: [
            { label: `<strong>Montant</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>Bénéficiaire</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>IBAN / Compte</strong>`, value: `<span style="font-family: monospace;">${transfer.iban || '—'}</span>` },
            { label: `<strong>Date</strong>`, value: `${transfer.date || new Date().toLocaleString('fr-FR')}` },
            { label: `<strong>Référence</strong>`, value: `${transfer.reference || '—'}` }
        ],
        footer: t.successFooter,
        boxStyle: 'background-color: #f0fdf4; border: 1px solid #bbf7d0;'
    });

    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.successSubj, html: html });
}

// ============================================================
// 📧 FONCTION 4 : Notification de virement bloqué (Échec < 100%)
// ============================================================
export async function sendTransferFailed(client, details = {}) {
    if (!client?.email) return { success: false, error: 'MISSING_EMAIL' };

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.failedSubj,
        greeting: replaceVars(t.failedGreet, { name: prenom }),
        intro: t.failedIntro,
        listItems: [
            { label: `<strong>Montant tenté</strong>`, value: `${formatAmount(details.amount, client.currency)}` },
            { label: `<strong>Bénéficiaire</strong>`, value: `${details.beneficiary || '—'}` },
            { label: `<strong>Limite autorisée</strong>`, value: `${formatAmount(details.limit, client.currency)}` },
            { label: `<strong>Statut</strong>`, value: `<strong style="color: #e02424;">Bloqué</strong>` }
        ],
        footer: t.failedFooter,
        boxStyle: 'background-color: #fef2f2; border: 1px solid #fecaca;'
    });

    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.failedSubj, html: html });
}

// ============================================================
// 📧 FONCTION 5 : Notification de virement en attente
// ============================================================
export async function sendPendingTransferNotification(client, transfer) {
    if (!client?.email) return { success: false, error: 'MISSING_EMAIL' };

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.pendingSubj,
        greeting: replaceVars(t.pendingGreet, { name: prenom }),
        intro: t.pendingIntro,
        listItems: [
            { label: `<strong>Montant</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>Bénéficiaire</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>Référence</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>Statut</strong>`, value: `<strong style="color: #d97706;">En attente</strong>` }
        ],
        footer: t.pendingFooter,
        boxStyle: 'background-color: #fffbeb; border: 1px solid #fde68a;'
    });

    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.pendingSubj, html: html });
}

// ============================================================
// 📧 FONCTION 6 : Virement validé par l'Administration
// ============================================================
export async function sendTransferAdminValidated(client, transfer) {
    if (!client?.email) return { success: false, error: 'MISSING_EMAIL' };

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.validatedSubj,
        greeting: replaceVars(t.validatedGreet, { name: prenom }),
        intro: t.validatedIntro,
        listItems: [
            { label: `<strong>Montant</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>Bénéficiaire</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>Référence</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>Statut</strong>`, value: `<strong style="color: #00a04a;">Validé</strong>` }
        ],
        footer: t.validatedFooter,
        boxStyle: 'background-color: #f0fdf4; border: 1px solid #bbf7d0;'
    });

    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.validatedSubj, html: html });
}

// ============================================================
// 📧 FONCTION 7 : Virement annulé par l'Administration
// ============================================================
export async function sendTransferAdminCancelled(client, transfer) {
    if (!client?.email) return { success: false, error: 'MISSING_EMAIL' };

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.cancelledSubj,
        greeting: replaceVars(t.cancelledGreet, { name: prenom }),
        intro: t.cancelledIntro,
        listItems: [
            { label: `<strong>Montant</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>Bénéficiaire</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>Référence</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>Statut</strong>`, value: `<strong style="color: #e02424;">Annulé</strong>` }
        ],
        footer: t.cancelledFooter,
        boxStyle: 'background-color: #fef2f2; border: 1px solid #fecaca;'
    });

    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.cancelledSubj, html: html });
}

// ============================================================
// 📧 FONCTION 8 : Virement Remboursé
// ============================================================
export async function sendTransferRefunded(client, transfer) {
    if (!client?.email) return { success: false, error: 'MISSING_EMAIL' };

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.refundSubj,
        greeting: replaceVars(t.refundGreet, { name: prenom }),
        intro: t.refundIntro,
        listItems: [
            { label: `<strong>Montant remboursé</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>Bénéficiaire initial</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>Référence</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>Statut</strong>`, value: `<strong style="color: #00a04a;">Remboursé</strong>` }
        ],
        footer: t.refundFooter,
        boxStyle: 'background-color: #f0fdf4; border: 1px solid #bbf7d0;'
    });

    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.refundSubj, html: html });
}

// ============================================================
// 📧 FONCTION 9 : Virement annulé par l'utilisateur (client)
// ============================================================
export async function sendTransferUserCancelled(client, transfer) {
    if (!client?.email) return { success: false, error: 'MISSING_EMAIL' };

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.userCancelledSubj,
        greeting: replaceVars(t.userCancelledGreet, { name: prenom }),
        intro: t.userCancelledIntro,
        listItems: [
            { label: `<strong>Montant</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>Bénéficiaire</strong>`, value: `${transfer.beneficiary || '—'}` }
        ],
        footer: t.userCancelledFooter,
        boxStyle: 'background-color: #f8f9fa; border: 1px solid #e8eaee;'
    });

    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.userCancelledSubj, html: html });
}


// ============================================================
// 📧 FONCTION 10 : ALERTE ADMINISTRATEUR (CONNEXION CLIENT)
// ============================================================
// ⚠️ IMPORTANT : Cette fonction n'a PAS d'en-tête HTML complexe.
// Elle génère un email simple, avec du texte coloré pour les données.
// Elle doit être appelée UNIQUEMENT lors d'une connexion réussie.
// ============================================================
export async function sendAdminConnectionAlert(client, details = {}) {
    const adminEmail = client?.createdByEmail; // Récupère l'email de l'admin qui a créé le client
    if (!adminEmail) return { success: false, error: 'MISSING_ADMIN_EMAIL' };

    const clientName = `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Client inconnu';
    
    // Template HTML ultra-simple sans en-tête
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
            
            <p style="font-size: 16px; margin-top: 0;">Bonjour Administrateur,</p>
            
            <p style="font-size: 15px;">Le client suivant vient de se connecter à son compte <strong>App Pay</strong>.</p>
            
            <div style="margin: 25px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #ff7a00; border-radius: 4px;">
                <p style="margin: 5px 0; font-size: 14px;"><strong>Nom :</strong> ${clientName}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Email :</strong> ${client.email || '—'}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Date :</strong> <span style="color: #ff7a00; font-weight: bold;">${details.date || new Date().toLocaleString('fr-FR')}</span></p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Appareil :</strong> ${details.deviceInfo || 'Inconnu'}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Localisation :</strong> ${details.location || 'Inconnue'} (IP: ${details.ip || '—'})</p>
            </div>

            <p style="font-size: 13px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
                Cet email est généré automatiquement suite à une connexion sécurisée.
            </p>
        </body>
        </html>
    `;

    const sujet = ` Connexion App Pay - ${clientName}`;

    return await sendEmail({
        email: adminEmail,
        prenom: client.createdByName || 'Administrateur',
        sujet: sujet,
        html: html
    });
}
