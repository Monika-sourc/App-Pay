// ============================================================
// APP PAY - Module d'envoi d'emails
// Format spécifique : { email, prenom, sujet, html, text }
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
// TRADUCTIONS DES EMAILS (12 langues)
// ============================================================
const EMAIL_TRANSLATIONS = {
    fr: {
        loginSubject: "Bienvenue chez App Pay – Vos identifiants de connexion",
        loginGreeting: "Cher(e) {name},",
        loginIntro: "Nous avons le plaisir de vous confirmer l'ouverture de votre compte chez App Pay. Nous vous remercions de votre confiance et sommes ravis de pouvoir vous accompagner. Afin d'accéder à votre espace client en ligne, voici vos identifiants de connexion :",
        loginEmailLabel: "Identifiant",
        loginPinLabel: "Code PIN",
        loginButton: "Accéder à mon compte en ligne",
        loginFooter: "Pour votre sécurité, nous vous recommandons de conserver ces informations de manière confidentielle. Ne partagez jamais votre code PIN avec qui que ce soit.",
        loginSecurity: "L'équipe de sécurité App Pay",

        activationSubject: "Votre code d'activation pour vos virements App Pay",
        activationGreeting: "Cher(e) {name},",
        activationIntro: "Afin de garantir la sécurité de vos transactions, veuillez trouver ci-dessous votre code d'activation personnel. Ce code vous sera demandé pour valider chacun de vos virements :",
        activationCodeLabel: "Votre code d'activation",
        activationFooter: "Gardez ce code en lieu sûr. Il est strictement personnel et confidentiel.",
        activationWarning: "Ne partagez jamais ce code avec un tiers, même s'il prétend être un conseiller App Pay.",

        transferSuccessSubject: "Confirmation de votre virement App Pay",
        transferSuccessGreeting: "Cher(e) {name},",
        transferSuccessIntro: "Nous vous confirmons que votre virement a été traité avec succès par nos services. Voici le récapitulatif de l'opération :",
        transferAmountLabel: "Montant transféré",
        transferBeneficiaryLabel: "Bénéficiaire",
        transferIbanLabel: "IBAN / Compte destinataire",
        transferDateLabel: "Date de l'opération",
        transferReferenceLabel: "Référence unique",
        transferStatusLabel: "Statut",
        transferStatusSuccess: "Effectué avec succès",
        transferSuccessFooter: "Le crédit sur le compte du bénéficiaire s'effectuera sous 24 à 48 heures ouvrées. Merci de votre confiance.",

        transferFailedSubject: "Alerte : Votre virement App Pay a été bloqué",
        transferFailedGreeting: "Cher(e) {name},",
        transferFailedIntro: "Nous vous informons qu'une tentative de virement sur votre compte a été bloquée par nos systèmes de sécurité. Voici les détails :",
        transferFailedReason: "Motif du blocage",
        transferFailedReasonBank: "Le compte bancaire du bénéficiaire n'a pas été reconnu par le système bancaire.",
        transferFailedAmountLabel: "Montant tenté",
        transferFailedLimitLabel: "Limite autorisée",
        transferStatusFailed: "Bloqué",
        transferFailedFooter: "Aucun montant n'a été débité. Veuillez contacter le service client pour plus d'informations.",

        pendingSubject: "Votre virement App Pay est en attente de validation",
        pendingGreeting: "Cher(e) {name},",
        pendingIntro: "Nous vous informons que votre virement a bien été enregistré et est actuellement en attente de validation par notre service administratif.",
        pendingAmountLabel: "Montant",
        pendingBeneficiaryLabel: "Bénéficiaire",
        pendingStatusLabel: "Statut",
        pendingStatusPending: "En attente",
        pendingFooter: "Vous recevrez une notification dès que le virement sera traité.",

        adminCancelledSubject: "Virement annulé par l'administration",
        adminCancelledGreeting: "Cher(e) {name},",
        adminCancelledIntro: "Nous vous informons que votre virement a été annulé par notre service administratif. Le montant a été re-crédité sur votre compte.",
        adminValidatedSubject: "Virement validé par l'administration",
        adminValidatedGreeting: "Cher(e) {name},",
        adminValidatedIntro: "Nous vous informons que votre virement en attente a été validé par notre service administratif et a été traité avec succès.",

        // 🆕 Traductions pour l'alerte de connexion admin
        adminConnectionSubject: "🔔 Nouvelle connexion client sur App Pay",
        adminConnectionGreeting: "Bonjour Administrateur,",
        adminConnectionIntro: "Le client suivant vient de se connecter à son compte App Pay. Voici les détails de la connexion :",
        adminClientNameLabel: "Nom du client",
        adminDeviceLabel: "Appareil / Navigateur",
        adminLocationLabel: "Localisation (Pays / Ville)",
        adminDateLabel: "Date et heure",
        adminConnectionFooter: "Cet email est envoyé automatiquement à l'administrateur à chaque connexion d'un client.",

        footer: "Cet email a été généré automatiquement par App Pay.",
        footerDoNotReply: "Merci de ne pas répondre directement à cet email.",
        greeting: "Cordialement,",
        teamName: "L'équipe App Pay"
    },
    en: {
        loginSubject: "Welcome to App Pay – Your login credentials",
        loginGreeting: "Dear {name},",
        loginIntro: "We are pleased to confirm the opening of your account with App Pay. Thank you for your trust. To access your online client portal, here are your login credentials:",
        loginEmailLabel: "Username",
        loginPinLabel: "PIN code",
        loginButton: "Access my online account",
        loginFooter: "For your security, we recommend keeping this information confidential. Never share your PIN code with anyone.",
        loginSecurity: "The App Pay Security Team",
        activationSubject: "Your activation code for App Pay transfers",
        activationGreeting: "Dear {name},",
        activationIntro: "To ensure the security of your transactions, please find your personal activation code below. This code will be required to validate each of your transfers:",
        activationCodeLabel: "Your activation code",
        activationFooter: "Keep this code safe. It is strictly personal and confidential.",
        activationWarning: "Never share this code with a third party, even if they claim to be an App Pay advisor.",
        
        transferSuccessSubject: "Confirmation of your App Pay transfer",
        transferSuccessGreeting: "Dear {name},",
        transferSuccessIntro: "We confirm that your transfer has been successfully processed. Here is the summary of the operation:",
        transferAmountLabel: "Amount transferred",
        transferBeneficiaryLabel: "Beneficiary",
        transferIbanLabel: "IBAN / Destination account",
        transferDateLabel: "Operation date",
        transferReferenceLabel: "Unique reference",
        transferStatusLabel: "Status",
        transferStatusSuccess: "Completed successfully",
        transferSuccessFooter: "The funds will be credited to the beneficiary's account within 24 to 48 business hours. Thank you for your trust.",
        
        transferFailedSubject: "Alert: Your App Pay transfer was blocked",
        transferFailedGreeting: "Dear {name},",
        transferFailedIntro: "We inform you that a transfer attempt on your account was blocked by our security systems. Here are the details:",
        transferFailedReason: "Blocking reason",
        transferFailedReasonBank: "The beneficiary's bank account was not recognized by the banking system.",
        transferFailedAmountLabel: "Attempted amount",
        transferFailedLimitLabel: "Allowed limit",
        transferStatusFailed: "Blocked",
        transferFailedFooter: "No amount was debited. Please contact customer service for more information.",
        
        pendingSubject: "Your App Pay transfer is pending validation",
        pendingGreeting: "Dear {name},",
        pendingIntro: "We inform you that your transfer has been registered and is currently pending validation by our administrative service.",
        pendingAmountLabel: "Amount",
        pendingBeneficiaryLabel: "Beneficiary",
        pendingStatusLabel: "Status",
        pendingStatusPending: "Pending",
        pendingFooter: "You will receive a notification as soon as the transfer is processed.",

        adminCancelledSubject: "Transfer cancelled by administration",
        adminCancelledGreeting: "Dear {name},",
        adminCancelledIntro: "We inform you that your transfer has been cancelled by our administrative service. The amount has been re-credited to your account.",
        adminValidatedSubject: "Transfer validated by administration",
        adminValidatedGreeting: "Dear {name},",
        adminValidatedIntro: "We inform you that your pending transfer has been validated by our administrative service and processed successfully.",

        adminConnectionSubject: "🔔 New client connection on App Pay",
        adminConnectionGreeting: "Hello Administrator,",
        adminConnectionIntro: "The following client just logged into their App Pay account. Here are the connection details:",
        adminClientNameLabel: "Client name",
        adminDeviceLabel: "Device / Browser",
        adminLocationLabel: "Location (Country / City)",
        adminDateLabel: "Date and time",
        adminConnectionFooter: "This email is sent automatically to the administrator each time a client logs in.",

        footer: "This email was generated automatically by App Pay.",
        footerDoNotReply: "Please do not reply directly to this email.",
        greeting: "Best regards,",
        teamName: "The App Pay team"
    },
    es: {
        loginSubject: "Bienvenido a App Pay – Sus credenciales de acceso",
        loginGreeting: "Estimado/a {name},",
        loginIntro: "Nos complace confirmar la apertura de su cuenta en App Pay. Gracias por su confianza. Para acceder a su área de cliente en línea, aquí están sus credenciales de acceso:",
        loginEmailLabel: "Usuario",
        loginPinLabel: "Código PIN",
        loginButton: "Acceder a mi cuenta en línea",
        loginFooter: "Por su seguridad, le recomendamos mantener esta información confidencial. Nunca comparta su código PIN con nadie.",
        loginSecurity: "El equipo de seguridad de App Pay",
        activationSubject: "Su código de activación para transferencias App Pay",
        activationGreeting: "Estimado/a {name},",
        activationIntro: "Para garantizar la seguridad de sus transacciones, a continuación encontrará su código de activación personal. Se le pedirá para validar cada una de sus transferencias:",
        activationCodeLabel: "Su código de activación",
        activationFooter: "Guarde este código en un lugar seguro. Es estrictamente personal y confidencial.",
        activationWarning: "Nunca comparta este código con terceros.",
        
        transferSuccessSubject: "Confirmación de su transferencia App Pay",
        transferSuccessGreeting: "Estimado/a {name},",
        transferSuccessIntro: "Le confirmamos que su transferencia ha sido procesada con éxito. Aquí está el resumen de la operación:",
        transferAmountLabel: "Importe transferido",
        transferBeneficiaryLabel: "Beneficiario",
        transferIbanLabel: "IBAN / Cuenta de destino",
        transferDateLabel: "Fecha de la operación",
        transferReferenceLabel: "Referencia única",
        transferStatusLabel: "Estado",
        transferStatusSuccess: "Completado con éxito",
        transferSuccessFooter: "Los fondos se acreditarán en la cuenta del beneficiario en un plazo de 24 a 48 horas hábiles. Gracias por su confianza.",
        
        transferFailedSubject: "Alerta: Su transferencia App Pay fue bloqueada",
        transferFailedGreeting: "Estimado/a {name},",
        transferFailedIntro: "Le informamos que un intento de transferencia en su cuenta fue bloqueado por nuestros sistemas de seguridad. Aquí están los detalles:",
        transferFailedReason: "Motivo del bloqueo",
        transferFailedReasonBank: "La cuenta bancaria del beneficiario no fue reconocida por el sistema bancario.",
        transferFailedAmountLabel: "Importe intentado",
        transferFailedLimitLabel: "Límite permitido",
        transferStatusFailed: "Bloqueado",
        transferFailedFooter: "No se ha debitado ningún importe. Comuníquese con el servicio de atención al cliente para obtener más información.",
        
        pendingSubject: "Su transferencia App Pay está pendiente de validación",
        pendingGreeting: "Estimado/a {name},",
        pendingIntro: "Le informamos que su transferencia ha sido registrada y actualmente está pendiente de validación por nuestro servicio administrativo.",
        pendingAmountLabel: "Importe",
        pendingBeneficiaryLabel: "Beneficiario",
        pendingStatusLabel: "Estado",
        pendingStatusPending: "Pendiente",
        pendingFooter: "Recibirá una notificación tan pronto como se procese la transferencia.",

        adminCancelledSubject: "Transferencia cancelada por la administración",
        adminCancelledGreeting: "Estimado/a {name},",
        adminCancelledIntro: "Le informamos que su transferencia ha sido cancelada por nuestro servicio administrativo. El importe ha sido re-acreditado en su cuenta.",
        adminValidatedSubject: "Transferencia validada por la administración",
        adminValidatedGreeting: "Estimado/a {name},",
        adminValidatedIntro: "Le informamos que su transferencia pendiente ha sido validada por nuestro servicio administrativo y procesada con éxito.",

        adminConnectionSubject: "🔔 Nueva conexión de cliente en App Pay",
        adminConnectionGreeting: "Hola Administrador,",
        adminConnectionIntro: "El siguiente cliente acaba de iniciar sesión en su cuenta de App Pay. Aquí están los detalles de la conexión:",
        adminClientNameLabel: "Nombre del cliente",
        adminDeviceLabel: "Dispositivo / Navegador",
        adminLocationLabel: "Ubicación (País / Ciudad)",
        adminDateLabel: "Fecha y hora",
        adminConnectionFooter: "Este correo se envía automáticamente al administrador cada vez que un cliente inicia sesión.",

        footer: "Este correo fue generado automáticamente por App Pay.",
        footerDoNotReply: "Por favor, no responda directamente a este correo.",
        greeting: "Atentamente,",
        teamName: "El equipo de App Pay"
    },
    de: {
        loginSubject: "Willkommen bei App Pay – Ihre Zugangsdaten",
        loginGreeting: "Sehr geehrte(r) {name},",
        loginIntro: "Wir freuen uns, die Eröffnung Ihres Kontos bei App Pay zu bestätigen. Vielen Dank für Ihr Vertrauen. Hier sind Ihre Zugangsdaten für Ihr Kundenportal:",
        loginEmailLabel: "Benutzername",
        loginPinLabel: "PIN-Code",
        loginButton: "Zugang zu meinem Online-Konto",
        loginFooter: "Zu Ihrer Sicherheit empfehlen wir, diese Informationen vertraulich zu behandeln. Teilen Sie Ihren PIN-Code niemals mit anderen.",
        loginSecurity: "Das App Pay Sicherheitsteam",
        activationSubject: "Ihr Aktivierungscode für App Pay Überweisungen",
        activationGreeting: "Sehr geehrte(r) {name},",
        activationIntro: "Um die Sicherheit Ihrer Transaktionen zu gewährleisten, finden Sie unten Ihren persönlichen Aktivierungscode. Dieser Code wird benötigt, um jede Ihrer Überweisungen zu validieren:",
        activationCodeLabel: "Ihr Aktivierungscode",
        activationFooter: "Bewahren Sie diesen Code sicher auf. Er ist streng persönlich und vertraulich.",
        activationWarning: "Teilen Sie diesen Code niemals mit Dritten.",
        
        transferSuccessSubject: "Bestätigung Ihrer App Pay Überweisung",
        transferSuccessGreeting: "Sehr geehrte(r) {name},",
        transferSuccessIntro: "Wir bestätigen, dass Ihre Überweisung erfolgreich bearbeitet wurde. Hier ist die Zusammenfassung:",
        transferAmountLabel: "Überwiesener Betrag",
        transferBeneficiaryLabel: "Begünstigter",
        transferIbanLabel: "IBAN / Zielkonto",
        transferDateLabel: "Datum der Operation",
        transferReferenceLabel: "Eindeutige Referenz",
        transferStatusLabel: "Status",
        transferStatusSuccess: "Erfolgreich abgeschlossen",
        transferSuccessFooter: "Die Gutschrift erfolgt innerhalb von 24 bis 48 Geschäftsstunden. Vielen Dank für Ihr Vertrauen.",
        
        transferFailedSubject: "Warnung: Ihre App Pay Überweisung wurde blockiert",
        transferFailedGreeting: "Sehr geehrte(r) {name},",
        transferFailedIntro: "Wir informieren Sie, dass ein Überweisungsversuch auf Ihrem Konto von unseren Sicherheitssystemen blockiert wurde. Hier sind die Details:",
        transferFailedReason: "Grund der Blockierung",
        transferFailedReasonBank: "Das Bankkonto des Begünstigten wurde vom Bankensystem nicht erkannt.",
        transferFailedAmountLabel: "Versuchter Betrag",
        transferFailedLimitLabel: "Zulässiges Limit",
        transferStatusFailed: "Blockiert",
        transferFailedFooter: "Es wurde kein Betrag abgebucht. Bitte kontaktieren Sie den Kundendienst für weitere Informationen.",
        
        pendingSubject: "Ihre App Pay Überweisung wartet auf Validierung",
        pendingGreeting: "Sehr geehrte(r) {name},",
        pendingIntro: "Wir informieren Sie, dass Ihre Überweisung registriert wurde und derzeit auf die Validierung durch unseren Verwaltungsdienst wartet.",
        pendingAmountLabel: "Betrag",
        pendingBeneficiaryLabel: "Begünstigter",
        pendingStatusLabel: "Status",
        pendingStatusPending: "Ausstehend",
        pendingFooter: "Sie erhalten eine Benachrichtigung, sobald die Überweisung bearbeitet wurde.",

        adminCancelledSubject: "Überweisung von der Verwaltung storniert",
        adminCancelledGreeting: "Sehr geehrte(r) {name},",
        adminCancelledIntro: "Wir informieren Sie, dass Ihre Überweisung von unserem Verwaltungsdienst storniert wurde. Der Betrag wurde Ihrem Konto wieder gutgeschrieben.",
        adminValidatedSubject: "Überweisung von der Verwaltung validiert",
        adminValidatedGreeting: "Sehr geehrte(r) {name},",
        adminValidatedIntro: "Wir informieren Sie, dass Ihre ausstehende Überweisung von unserem Verwaltungsdienst validiert und erfolgreich bearbeitet wurde.",

        adminConnectionSubject: "🔔 Neue Kundenverbindung bei App Pay",
        adminConnectionGreeting: "Hallo Administrator,",
        adminConnectionIntro: "Der folgende Kunde hat sich gerade in sein App Pay-Konto eingeloggt. Hier sind die Verbindungsdetails:",
        adminClientNameLabel: "Kundenname",
        adminDeviceLabel: "Gerät / Browser",
        adminLocationLabel: "Standort (Land / Stadt)",
        adminDateLabel: "Datum und Uhrzeit",
        adminConnectionFooter: "Diese E-Mail wird automatisch an den Administrator gesendet, wenn sich ein Kunde anmeldet.",

        footer: "Diese E-Mail wurde automatisch von App Pay generiert.",
        footerDoNotReply: "Bitte antworten Sie nicht direkt auf diese E-Mail.",
        greeting: "Mit freundlichen Grüßen,",
        teamName: "Das App Pay Team"
    },
    pl: {
        loginSubject: "Witamy w App Pay – Twoje dane logowania",
        loginGreeting: "Szanowny(a) {name},",
        loginIntro: "Z przyjemnością potwierdzamy otwarcie Twojego konta w App Pay. Dziękujemy za zaufanie. Aby uzyskać dostęp do portalu klienta, oto Twoje dane logowania:",
        loginEmailLabel: "Identyfikator",
        loginPinLabel: "Kod PIN",
        loginButton: "Uzyskaj dostęp do konta online",
        loginFooter: "Ze względów bezpieczeństwa zalecamy zachowanie tych informacji w poufności. Nigdy nie udostępniaj swojego kodu PIN.",
        loginSecurity: "Zespół ds. bezpieczeństwa App Pay",
        activationSubject: "Twój kod aktywacyjny do przelewów App Pay",
        activationGreeting: "Szanowny(a) {name},",
        activationIntro: "Aby zapewnić bezpieczeństwo Twoich transakcji, poniżej znajduje się Twój osobisty kod aktywacyjny. Będzie on wymagany do zatwierdzenia każdego przelewu:",
        activationCodeLabel: "Twój kod aktywacyjny",
        activationFooter: "Przechowuj ten kod w bezpiecznym miejscu. Jest on ściśle osobisty i poufny.",
        activationWarning: "Nigdy nie udostępniaj tego kodu osobom trzecim.",
        
        transferSuccessSubject: "Potwierdzenie przelewu App Pay",
        transferSuccessGreeting: "Szanowny(a) {name},",
        transferSuccessIntro: "Potwierdzamy, że Twój przelew został pomyślnie przetworzony. Oto podsumowanie operacji:",
        transferAmountLabel: "Przelana kwota",
        transferBeneficiaryLabel: "Odbiorca",
        transferIbanLabel: "IBAN / Konto docelowe",
        transferDateLabel: "Data operacji",
        transferReferenceLabel: "Unikalna referencja",
        transferStatusLabel: "Status",
        transferStatusSuccess: "Zrealizowano pomyślnie",
        transferSuccessFooter: "Środki zostaną zaksięgowane na koncie odbiorcy w ciągu 24-48 godzin roboczych. Dziękujemy za zaufanie.",
        
        transferFailedSubject: "Alert: Twój przelew App Pay został zablokowany",
        transferFailedGreeting: "Szanowny(a) {name},",
        transferFailedIntro: "Informujemy, że próba przelewu na Twoim koncie została zablokowana przez nasze systemy bezpieczeństwa. Oto szczegóły:",
        transferFailedReason: "Powód blokady",
        transferFailedReasonBank: "Konto bankowe odbiorcy nie zostało rozpoznane przez system bankowy.",
        transferFailedAmountLabel: "Próbowana kwota",
        transferFailedLimitLabel: "Dozwolony limit",
        transferStatusFailed: "Zablokowany",
        transferFailedFooter: "Żadna kwota nie została pobrana. Skontaktuj się z obsługą klienta, aby uzyskać więcej informacji.",
        
        pendingSubject: "Twój przelew App Pay oczekuje na weryfikację",
        pendingGreeting: "Szanowny(a) {name},",
        pendingIntro: "Informujemy, że Twój przelew został zarejestrowany i obecnie oczekuje na weryfikację przez nasz dział administracji.",
        pendingAmountLabel: "Kwota",
        pendingBeneficiaryLabel: "Odbiorca",
        pendingStatusLabel: "Status",
        pendingStatusPending: "Oczekujący",
        pendingFooter: "Otrzymasz powiadomienie, gdy tylko przelew zostanie przetworzony.",

        adminCancelledSubject: "Przelew anulowany przez administrację",
        adminCancelledGreeting: "Szanowny(a) {name},",
        adminCancelledIntro: "Informujemy, że Twój przelew został anulowany przez nasz dział administracji. Kwota została ponownie zaksięgowana na Twoim koncie.",
        adminValidatedSubject: "Przelew zatwierdzony przez administrację",
        adminValidatedGreeting: "Szanowny(a) {name},",
        adminValidatedIntro: "Informujemy, że Twój oczekujący przelew został zatwierdzony przez nasz dział administracji i pomyślnie przetworzony.",

        adminConnectionSubject: "🔔 Nowe połączenie klienta w App Pay",
        adminConnectionGreeting: "Witaj Administratorze,",
        adminConnectionIntro: "Następujący klient właśnie zalogował się na swoje konto App Pay. Oto szczegóły połączenia:",
        adminClientNameLabel: "Imię i nazwisko klienta",
        adminDeviceLabel: "Urządzenie / Przeglądarka",
        adminLocationLabel: "Lokalizacja (Kraj / Miasto)",
        adminDateLabel: "Data i godzina",
        adminConnectionFooter: "Ta wiadomość jest wysyłana automatycznie do administratora przy każdym logowaniu klienta.",

        footer: "Ta wiadomość została wygenerowana automatycznie przez App Pay.",
        footerDoNotReply: "Prosimy nie odpowiadać bezpośrednio na tę wiadomość.",
        greeting: "Z poważaniem,",
        teamName: "Zespół App Pay"
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

        const errorText = await res.text().catch(() => '');
        console.warn(`⚠️ Vercel a répondu ${res.status} - ${errorText}, tentative via Render...`);
    } catch (err) {
        const reason = err.name === 'AbortError' ? 'Timeout' : err.message;
        console.warn(`⚠️ Vercel échoué (${reason}), tentative via Render...`);
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
        const reason = err.name === 'AbortError' ? 'Timeout' : err.message;
        console.error(`❌ Render échoué aussi : ${reason}`);
        return { success: false, error: reason, message: reason };
    }
}

// ============================================================
// TRADUCTION & HELPERS
// ============================================================
function getT(lang) {
    return EMAIL_TRANSLATIONS[lang] || EMAIL_TRANSLATIONS.fr;
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
// TEMPLATE HTML PLEIN ÉCRAN
// ============================================================
function buildEmailHTML({ title, greeting, intro, listItems = [], warning = '', buttonText = '', buttonLink = '', footer, boxStyle = 'background-color: #f9f9f9;' }) {
    const listHTML = listItems.length > 0 ? `
        <div style="margin: 20px 0; padding: 20px; border-radius: 8px; ${boxStyle}">
            <ul style="margin: 0; padding-left: 20px; color: #333; line-height: 1.6; font-size: 14px;">
                ${listItems.map(item => `
                    <li style="margin-bottom: 8px;">
                        ${item.label} : ${item.value}
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';

    const warningHTML = warning ? `
        <div style="background:#fff5eb; border-left:4px solid #ff7a00; padding:12px; border-radius:6px; margin:20px 0; font-size:13px; color:#8a4400; line-height:1.5;">
            <strong>⚠️ Attention :</strong> ${warning}
        </div>
    ` : '';

    const buttonHTML = (buttonText && buttonLink) ? `
        <div style="text-align: center; margin: 30px 0;">
            <a href="${buttonLink}" target="_blank" style="display: inline-block; background-color: #ff7a00; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 15px; font-weight: bold; box-shadow: 0 4px 12px rgba(255, 122, 0, 0.3);">
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
        <body style="margin:0; padding:0; background-color:#ffffff; width: 100%; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <div style="width: 100%; max-width: 100%; background-color: #ffffff;">
                
                <!-- Header -->
                <div style="background:linear-gradient(135deg,#ff7a00 0%,#ff9533 100%); padding:25px 20px; text-align:center;">
                    <div style="font-size:22px; font-weight:900; color:white; letter-spacing:2px;">APP PAY</div>
                </div>

                <!-- Body -->
                <div style="padding:25px 20px; max-width: 600px; margin: 0 auto;">
                    <h1 style="font-size:18px; font-weight:800; color:#111111; margin:0 0 15px 0;">${title}</h1>
                    
                    <p style="font-size:15px; color:#333333; margin:0 0 15px 0; font-weight:600;">${greeting}</p>
                    <p style="font-size:14px; color:#555555; line-height:1.5; margin:0 0 20px 0;">${intro}</p>

                    ${listHTML}

                    ${buttonHTML}
                    ${warningHTML}

                    <p style="font-size:13px; color:#666666; line-height:1.5; margin:20px 0 0 0;">${footer}</p>

                    <div style="margin-top:30px; padding-top:15px; border-top:1px solid #eeeeee;">
                        <p style="font-size:13px; color:#888888; margin:0;">
                            ${EMAIL_TRANSLATIONS.fr.greeting}<br>
                            <strong style="color:#ff7a00; font-size:14px;">${EMAIL_TRANSLATIONS.fr.teamName}</strong>
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background:#f4f4f4; padding:15px; text-align:center;">
                    <p style="font-size:11px; color:#999999; margin:0; line-height:1.5;">
                        ${EMAIL_TRANSLATIONS.fr.footer}<br>
                        ${EMAIL_TRANSLATIONS.fr.footerDoNotReply}
                    </p>
                </div>

            </div>
        </body>
        </html>
    `;
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
        title: t.loginSubject,
        greeting: replaceVars(t.loginGreeting, { name: prenom }),
        intro: t.loginIntro,
        listItems: [
            { 
                label: `<strong>${t.loginEmailLabel}</strong>`, 
                value: `<a href="mailto:${client.email}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">${client.email}</a>` 
            },
            { 
                label: `<strong>${t.loginPinLabel}</strong>`, 
                value: `<strong style="color: #111; font-family: monospace; font-size: 15px; letter-spacing: 1px;">${client.pin}</strong>` 
            }
        ],
        buttonText: t.loginButton,
        buttonLink: loginLink,
        warning: t.loginSecurity,
        footer: t.loginFooter,
        boxStyle: 'background-color: #f9f9f9; border: 1px solid #eeeeee;' 
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.loginSubject,
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
        title: t.activationSubject,
        greeting: replaceVars(t.activationGreeting, { name: prenom }),
        intro: t.activationIntro,
        listItems: [
            { 
                label: `<strong>${t.activationCodeLabel}</strong>`, 
                value: `<strong style="color: #ff7a00; font-family: monospace; font-size: 16px; letter-spacing: 2px;">${client.activationCode}</strong>` 
            }
        ],
        warning: t.activationWarning,
        footer: t.activationFooter,
        boxStyle: 'background-color: #f9f9f9; border: 1px solid #eeeeee;'
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.activationSubject,
        html: html
    });
}

// ============================================================
// 📧 FONCTION 3 : Confirmation de virement réussi (Vert)
// ============================================================
export async function sendTransferSuccess(client, transfer) {
    if (!client?.email) {
        return { success: false, error: 'MISSING_EMAIL', message: 'Client sans adresse email.' };
    }

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.transferSuccessSubject,
        greeting: replaceVars(t.transferSuccessGreeting, { name: prenom }),
        intro: t.transferSuccessIntro,
        listItems: [
            { label: `<strong>${t.transferAmountLabel}</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>${t.transferBeneficiaryLabel}</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>${t.transferIbanLabel}</strong>`, value: `<span style="font-family: monospace; word-break: break-all;">${transfer.iban || '—'}</span>` },
            { label: `<strong>${t.transferDateLabel}</strong>`, value: `${transfer.date || new Date().toLocaleString('fr-FR')}` },
            { label: `<strong>${t.transferReferenceLabel}</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>${t.transferStatusLabel}</strong>`, value: `<strong style="color: #00a04a;">${t.transferStatusSuccess}</strong>` }
        ],
        footer: t.transferSuccessFooter,
        boxStyle: 'background-color: #f0fdf4; border: 1px solid #bbf7d0;'
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.transferSuccessSubject,
        html: html
    });
}

// ============================================================
// 📧 FONCTION 4 : Notification de virement bloqué (Rouge)
// ============================================================
export async function sendTransferFailed(client, details = {}) {
    if (!client?.email) {
        return { success: false, error: 'MISSING_EMAIL', message: 'Client sans adresse email.' };
    }

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.transferFailedSubject,
        greeting: replaceVars(t.transferFailedGreeting, { name: prenom }),
        intro: t.transferFailedIntro,
        listItems: [
            { label: `<strong>${t.transferFailedReason}</strong>`, value: `${t.transferFailedReasonBank}` },
            { label: `<strong>${t.transferFailedAmountLabel}</strong>`, value: `${formatAmount(details.amount, client.currency)}` },
            { label: `<strong>${t.transferStatusLabel}</strong>`, value: `<strong style="color: #e02424;">${t.transferStatusFailed}</strong>` }
        ],
        footer: t.transferFailedFooter,
        boxStyle: 'background-color: #fef2f2; border: 1px solid #fecaca;'
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.transferFailedSubject,
        html: html
    });
}

// ============================================================
// 📧 FONCTION 5 : Notification de virement en attente (Orange)
// ============================================================
export async function sendPendingTransferNotification(client, transfer) {
    if (!client?.email) {
        return { success: false, error: 'MISSING_EMAIL', message: 'Client sans adresse email.' };
    }

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.pendingSubject,
        greeting: replaceVars(t.pendingGreeting, { name: prenom }),
        intro: t.pendingIntro,
        listItems: [
            { label: `<strong>${t.pendingAmountLabel}</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>${t.pendingBeneficiaryLabel}</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>${t.transferReferenceLabel}</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>${t.pendingStatusLabel}</strong>`, value: `<strong style="color: #d97706;">${t.pendingStatusPending}</strong>` }
        ],
        footer: t.pendingFooter,
        boxStyle: 'background-color: #fffbeb; border: 1px solid #fde68a;'
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.pendingSubject,
        html: html
    });
}

// ============================================================
// 📧 FONCTION 6 : Virement annulé par l'administration (Violet)
// ============================================================
export async function sendTransferAdminCancelled(client, transfer) {
    if (!client?.email) {
        return { success: false, error: 'MISSING_EMAIL', message: 'Client sans adresse email.' };
    }

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.adminCancelledSubject,
        greeting: replaceVars(t.adminCancelledGreeting, { name: prenom }),
        intro: t.adminCancelledIntro,
        listItems: [
            { label: `<strong>${t.transferAmountLabel}</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>${t.transferBeneficiaryLabel}</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>${t.transferReferenceLabel}</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>${t.transferStatusLabel}</strong>`, value: `<strong style="color: #8b5cf6;">Annulé</strong>` }
        ],
        footer: t.transferFailedFooter,
        boxStyle: 'background-color: #f5f3ff; border: 1px solid #ddd6fe;'
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.adminCancelledSubject,
        html: html
    });
}

// ============================================================
// 📧 FONCTION 7 : Virement validé par l'administration (Vert)
// ============================================================
export async function sendTransferAdminValidated(client, transfer) {
    if (!client?.email) {
        return { success: false, error: 'MISSING_EMAIL', message: 'Client sans adresse email.' };
    }

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.adminValidatedSubject,
        greeting: replaceVars(t.adminValidatedGreeting, { name: prenom }),
        intro: t.adminValidatedIntro,
        listItems: [
            { label: `<strong>${t.transferAmountLabel}</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>${t.transferBeneficiaryLabel}</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>${t.transferReferenceLabel}</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>${t.transferStatusLabel}</strong>`, value: `<strong style="color: #00a04a;">${t.transferStatusSuccess}</strong>` }
        ],
        footer: t.transferSuccessFooter,
        boxStyle: 'background-color: #f0fdf4; border: 1px solid #bbf7d0;'
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.adminValidatedSubject,
        html: html
    });
}

// ============================================================
// 🆕 FONCTION 8 : Alerte de connexion client (Envoyée à l'Admin)
// ============================================================
export async function sendAdminConnectionAlert(client, details = {}) {
    const adminEmail = client?.createdByEmail;
    if (!adminEmail) {
        return { success: false, error: 'MISSING_ADMIN_EMAIL', message: 'Aucun email administrateur trouvé.' };
    }

    const lang = client.language || 'fr';
    const t = getT(lang);
    const clientName = `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Client';

    const html = buildEmailHTML({
        title: t.adminConnectionSubject,
        greeting: t.adminConnectionGreeting,
        intro: t.adminConnectionIntro,
        listItems: [
            { label: `<strong>${t.adminClientNameLabel}</strong>`, value: `${clientName} (${client.email || '—'})` },
            { label: `<strong>${t.adminDeviceLabel}</strong>`, value: `${details.deviceInfo || 'Inconnu'}` },
            { label: `<strong>${t.adminLocationLabel}</strong>`, value: `${details.country || 'Inconnu'} / ${details.city || 'Inconnue'}` },
            { label: `<strong>${t.adminDateLabel}</strong>`, value: `${details.date || new Date().toLocaleString('fr-FR')}` }
        ],
        footer: t.adminConnectionFooter,
        boxStyle: 'background-color: #f0f7ff; border: 1px solid #c5d8f5;'
    });

    return await sendEmail({
        email: adminEmail,
        prenom: client.createdByName || 'Administrateur',
        sujet: t.adminConnectionSubject,
        html: html
    });
}
