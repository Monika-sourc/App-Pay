// ============================================================
// APP PAY - Module d'envoi d'emails (145 langues supportées)
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
// DICTIONNAIRE DE TRADUCTION DES EMAILS
// ⚠️ ATTENTION : CHAQUE LANGUE DOIT ÊTRE SÉPARÉE PAR UNE VIRGULE
// ============================================================
const EMAIL_TRANSLATIONS = {
    // ═══════════════════════════════════════════════════════
    // LANGUE : FRANÇAIS (fr)
    // ═══════════════════════════════════════════════════════
    fr: {
        loginSubj: "Bienvenue chez App Pay – Vos identifiants de connexion",
        loginGreet: "Cher(e) {name},",
        loginIntro: "Nous avons le plaisir de vous confirmer l'ouverture de votre compte chez App Pay. Nous vous remercions de votre confiance. Voici vos identifiants de connexion :",
        loginFooter: "Pour votre sécurité, gardez ces informations confidentielles. Ne partagez jamais votre code PIN.",
        
        actSubj: "Votre code d'activation pour vos virements App Pay",
        actGreet: "Cher(e) {name},",
        actIntro: "Afin de garantir la sécurité de vos transactions, voici votre code d'activation personnel. Il vous sera demandé pour valider vos virements :",
        actFooter: "Gardez ce code en lieu sûr. Il est strictement personnel et confidentiel.",

        successSubj: "Confirmation de votre virement App Pay",
        successGreet: "Cher(e) {name},",
        successIntro: "Nous vous confirmons que votre virement a été traité avec succès. Voici le récapitulatif :",
        successFooter: "Le crédit sur le compte du bénéficiaire s'effectuera sous 24 à 48 heures ouvrées. Merci de votre confiance.",

        failedSubj: "Alerte : Votre virement App Pay a été bloqué",
        failedGreet: "Cher(e) {name},",
        failedIntro: "Une tentative de virement sur votre compte a été bloquée par nos systèmes de sécurité. Voici les détails :",
        failedFooter: "Aucun montant n'a été débité. Veuillez contacter le service client pour plus d'informations.",

        pendingSubj: "Votre virement App Pay est en attente de validation",
        pendingGreet: "Cher(e) {name},",
        pendingIntro: "Votre virement a bien été enregistré et est en attente de validation par notre service administratif.",
        pendingFooter: "Vous recevrez une notification dès que le virement sera traité.",

        validatedSubj: "Virement validé par l'administration",
        validatedGreet: "Cher(e) {name},",
        validatedIntro: "Votre virement en attente a été validé par notre service administratif et traité avec succès.",
        validatedFooter: "Le crédit sur le compte du bénéficiaire s'effectuera sous 24 à 48 heures ouvrées. Merci de votre confiance.",

        cancelledSubj: "Virement annulé par l'administration",
        cancelledGreet: "Cher(e) {name},",
        cancelledIntro: "Votre virement a été annulé par notre service administratif. Le montant a été re-crédité sur votre compte.",
        cancelledFooter: "Vous pouvez vérifier votre nouveau solde dans votre espace client.",

        refundSubj: "Virement remboursé",
        refundGreet: "Cher(e) {name},",
        refundIntro: "Nous vous informons que le montant de votre virement vous a été remboursé. Voici les détails :",
        refundFooter: "Le montant a été recrédité sur votre compte. Merci de votre compréhension.",

        userCancelledSubj: "Virement annulé",
        userCancelledGreet: "Cher(e) {name},",
        userCancelledIntro: "Nous vous confirmons que votre virement a bien été annulé. Aucun montant n'a été débité de votre compte.",
        userCancelledFooter: "Si vous n'êtes pas à l'origine de cette annulation, veuillez contacter notre service client.",

        adminConnectionSubj: "🔔 Nouvelle connexion client sur App Pay",
        adminConnectionGreet: "Bonjour Administrateur,",
        adminConnectionIntro: "Le client suivant vient de se connecter à son compte App Pay. Voici les détails :",
        adminConnectionFooter: "Cet email est envoyé automatiquement à l'administrateur à chaque connexion d'un client."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : ANGLAIS (en)
    // ═══════════════════════════════════════════════════════
    en: {
        loginSubj: "Welcome to App Pay – Your login credentials",
        loginGreet: "Dear {name},",
        loginIntro: "We are pleased to confirm the opening of your account with App Pay. Thank you for your trust. Here are your login credentials:",
        loginFooter: "For your security, keep this information confidential. Never share your PIN code.",
        
        actSubj: "Your activation code for App Pay transfers",
        actGreet: "Dear {name},",
        actIntro: "To ensure the security of your transactions, here is your personal activation code. It will be required to validate your transfers:",
        actFooter: "Keep this code safe. It is strictly personal and confidential.",

        successSubj: "Confirmation of your App Pay transfer",
        successGreet: "Dear {name},",
        successIntro: "We confirm that your transfer has been successfully processed. Here is the summary:",
        successFooter: "The funds will be credited to the beneficiary's account within 24 to 48 business hours. Thank you for your trust.",

        failedSubj: "Alert: Your App Pay transfer was blocked",
        failedGreet: "Dear {name},",
        failedIntro: "A transfer attempt on your account was blocked by our security systems. Here are the details:",
        failedFooter: "No amount was debited. Please contact customer service for more information.",

        pendingSubj: "Your App Pay transfer is pending validation",
        pendingGreet: "Dear {name},",
        pendingIntro: "Your transfer has been registered and is pending validation by our administrative service.",
        pendingFooter: "You will receive a notification as soon as the transfer is processed.",

        validatedSubj: "Transfer validated by administration",
        validatedGreet: "Dear {name},",
        validatedIntro: "Your pending transfer has been validated by our administrative service and processed successfully.",
        validatedFooter: "The funds will be credited to the beneficiary's account within 24 to 48 business hours. Thank you for your trust.",

        cancelledSubj: "Transfer cancelled by administration",
        cancelledGreet: "Dear {name},",
        cancelledIntro: "Your transfer has been cancelled by our administrative service. The amount has been re-credited to your account.",
        cancelledFooter: "You can check your new balance in your client portal.",

        refundSubj: "Transfer refunded",
        refundGreet: "Dear {name},",
        refundIntro: "We inform you that your transfer amount has been refunded to you. Here are the details:",
        refundFooter: "The amount has been re-credited to your account. Thank you for your understanding.",

        userCancelledSubj: "Transfer cancelled",
        userCancelledGreet: "Dear {name},",
        userCancelledIntro: "We confirm that your transfer has been cancelled. No amount was debited from your account.",
        userCancelledFooter: "If you did not initiate this cancellation, please contact our customer service.",

        adminConnectionSubj: "🔔 New client connection on App Pay",
        adminConnectionGreet: "Hello Administrator,",
        adminConnectionIntro: "The following client just logged into their App Pay account. Here are the details:",
        adminConnectionFooter: "This email is sent automatically to the administrator each time a client logs in."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : ESPAGNOL (es)
    // ═══════════════════════════════════════════════════════
    es: {
        loginSubj: "Bienvenido a App Pay – Sus credenciales de acceso",
        loginGreet: "Estimado/a {name},",
        loginIntro: "Nos complace confirmar la apertura de su cuenta en App Pay. Gracias por su confianza. Aquí están sus credenciales:",
        loginFooter: "Por su seguridad, mantenga esta información confidencial. Nunca comparta su código PIN.",
        
        actSubj: "Su código de activación para transferencias App Pay",
        actGreet: "Estimado/a {name},",
        actIntro: "Para garantizar la seguridad de sus transacciones, aquí está su código de activación personal. Se le pedirá para validar sus transferencias:",
        actFooter: "Guarde este código en un lugar seguro. Es estrictamente personal y confidencial.",

        successSubj: "Confirmación de su transferencia App Pay",
        successGreet: "Estimado/a {name},",
        successIntro: "Le confirmamos que su transferencia ha sido procesada con éxito. Aquí está el resumen:",
        successFooter: "Los fondos se acreditarán en la cuenta del beneficiario en un plazo de 24 a 48 horas hábiles. Gracias por su confianza.",

        failedSubj: "Alerta: Su transferencia App Pay fue bloqueada",
        failedGreet: "Estimado/a {name},",
        failedIntro: "Un intento de transferencia en su cuenta fue bloqueado por nuestros sistemas de seguridad. Aquí están los detalles:",
        failedFooter: "No se ha debitado ningún importe. Comuníquese con el servicio de atención al cliente.",

        pendingSubj: "Su transferencia App Pay está pendiente de validación",
        pendingGreet: "Estimado/a {name},",
        pendingIntro: "Su transferencia ha sido registrada y está pendiente de validación por nuestro servicio administrativo.",
        pendingFooter: "Recibirá una notificación tan pronto como se procese la transferencia.",

        validatedSubj: "Transferencia validada por la administración",
        validatedGreet: "Estimado/a {name},",
        validatedIntro: "Su transferencia pendiente ha sido validada por nuestro servicio administrativo y procesada con éxito.",
        validatedFooter: "Los fondos se acreditarán en la cuenta del beneficiario en un plazo de 24 a 48 horas hábiles. Gracias por su confianza.",

        cancelledSubj: "Transferencia cancelada por la administración",
        cancelledGreet: "Estimado/a {name},",
        cancelledIntro: "Su transferencia ha sido cancelada por nuestro servicio administrativo. El importe ha sido re-acreditado en su cuenta.",
        cancelledFooter: "Puede verificar su nuevo saldo en su área de cliente.",

        refundSubj: "Transferencia reembolsada",
        refundGreet: "Estimado/a {name},",
        refundIntro: "Le informamos que el importe de su transferencia le ha sido reembolsado. Aquí están los detalles:",
        refundFooter: "El importe ha sido re-acreditado en su cuenta. Gracias por su comprensión.",

        userCancelledSubj: "Transferencia cancelada",
        userCancelledGreet: "Estimado/a {name},",
        userCancelledIntro: "Le confirmamos que su transferencia ha sido cancelada. No se ha debitado ningún importe de su cuenta.",
        userCancelledFooter: "Si usted no ha iniciado esta cancelación, por favor contacte con nuestro servicio de atención al cliente.",

        adminConnectionSubj: "🔔 Nueva conexión de cliente en App Pay",
        adminConnectionGreet: "Hola Administrador,",
        adminConnectionIntro: "El siguiente cliente acaba de iniciar sesión en su cuenta de App Pay. Aquí están los detalles:",
        adminConnectionFooter: "Este correo se envía automáticamente al administrador cada vez que un cliente inicia sesión."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : ALLEMAND (de)
    // ═══════════════════════════════════════════════════════
    de: {
        loginSubj: "Willkommen bei App Pay – Ihre Zugangsdaten",
        loginGreet: "Sehr geehrte(r) {name},",
        loginIntro: "Wir freuen uns, die Eröffnung Ihres Kontos bei App Pay zu bestätigen. Hier sind Ihre Zugangsdaten:",
        loginFooter: "Zu Ihrer Sicherheit empfehlen wir, diese Informationen vertraulich zu behandeln. Teilen Sie Ihren PIN-Code niemals mit anderen.",
        
        actSubj: "Ihr Aktivierungscode für App Pay Überweisungen",
        actGreet: "Sehr geehrte(r) {name},",
        actIntro: "Um die Sicherheit Ihrer Transaktionen zu gewährleisten, finden Sie unten Ihren persönlichen Aktivierungscode:",
        actFooter: "Bewahren Sie diesen Code sicher auf. Er ist streng persönlich und vertraulich.",

        successSubj: "Bestätigung Ihrer App Pay Überweisung",
        successGreet: "Sehr geehrte(r) {name},",
        successIntro: "Wir bestätigen, dass Ihre Überweisung erfolgreich bearbeitet wurde. Hier ist die Zusammenfassung:",
        successFooter: "Die Gutschrift erfolgt innerhalb von 24 bis 48 Geschäftsstunden. Vielen Dank für Ihr Vertrauen.",

        failedSubj: "Warnung: Ihre App Pay Überweisung wurde blockiert",
        failedGreet: "Sehr geehrte(r) {name},",
        failedIntro: "Ein Überweisungsversuch auf Ihrem Konto wurde von unseren Sicherheitssystemen blockiert. Hier sind die Details:",
        failedFooter: "Es wurde kein Betrag abgebucht. Bitte kontaktieren Sie den Kundendienst.",

        pendingSubj: "Ihre App Pay Überweisung wartet auf Validierung",
        pendingGreet: "Sehr geehrte(r) {name},",
        pendingIntro: "Ihre Überweisung wurde registriert und wartet auf die Validierung durch unseren Verwaltungsdienst.",
        pendingFooter: "Sie erhalten eine Benachrichtigung, sobald die Überweisung bearbeitet wurde.",

        validatedSubj: "Überweisung von der Verwaltung validiert",
        validatedGreet: "Sehr geehrte(r) {name},",
        validatedIntro: "Ihre ausstehende Überweisung wurde von unserem Verwaltungsdienst validiert und erfolgreich bearbeitet.",
        validatedFooter: "Die Gutschrift erfolgt innerhalb von 24 bis 48 Geschäftsstunden. Vielen Dank für Ihr Vertrauen.",

        cancelledSubj: "Überweisung von der Verwaltung storniert",
        cancelledGreet: "Sehr geehrte(r) {name},",
        cancelledIntro: "Ihre Überweisung wurde von unserem Verwaltungsdienst storniert. Der Betrag wurde Ihrem Konto wieder gutgeschrieben.",
        cancelledFooter: "Sie können Ihr neues Guthaben in Ihrem Kundenportal überprüfen.",

        refundSubj: "Überweisung erstattet",
        refundGreet: "Sehr geehrte(r) {name},",
        refundIntro: "Der Betrag Ihrer Überweisung wurde erstattet. Hier sind die Details:",
        refundFooter: "Der Betrag wurde Ihrem Konto wieder gutgeschrieben. Vielen Dank für Ihr Verständnis.",

        userCancelledSubj: "Überweisung storniert",
        userCancelledGreet: "Sehr geehrte(r) {name},",
        userCancelledIntro: "Wir bestätigen, dass Ihre Überweisung storniert wurde. Es wurde kein Betrag von Ihrem Konto abgebucht.",
        userCancelledFooter: "Wenn Sie diese Stornierung nicht veranlasst haben, kontaktieren Sie bitte sofort unseren Kundendienst.",

        adminConnectionSubj: "🔔 Neue Kundenverbindung bei App Pay",
        adminConnectionGreet: "Hallo Administrator,",
        adminConnectionIntro: "Der folgende Kunde hat sich gerade in sein App Pay-Konto eingeloggt. Hier sind die Details:",
        adminConnectionFooter: "Diese E-Mail wird automatisch an den Administrator gesendet, wenn sich ein Kunde anmeldet."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : ITALIEN (it)
    // ═══════════════════════════════════════════════════════
    it: {
        loginSubj: "Benvenuto in App Pay – Le tue credenziali di accesso",
        loginGreet: "Gentile {name},",
        loginIntro: "Siamo lieti di confermare l'apertura del tuo conto su App Pay. Ecco le tue credenziali:",
        loginFooter: "Per la tua sicurezza, mantieni queste informazioni riservate. Non condividere mai il tuo codice PIN.",
        
        actSubj: "Il tuo codice di attivazione per i bonifici App Pay",
        actGreet: "Gentile {name},",
        actIntro: "Per garantire la sicurezza delle tue transazioni, ecco il tuo codice di attivazione personale:",
        actFooter: "Conserva questo codice in un luogo sicuro. È strettamente personale e riservato.",

        successSubj: "Conferma del tuo bonifico App Pay",
        successGreet: "Gentile {name},",
        successIntro: "Ti confermiamo che il tuo bonifico è stato elaborato con successo. Ecco il riepilogo:",
        successFooter: "Il credito sul conto del beneficiario avverrà entro 24-48 ore lavorative. Grazie per la tua fiducia.",

        failedSubj: "Avviso: Il tuo bonifico App Pay è stato bloccato",
        failedGreet: "Gentile {name},",
        failedIntro: "Un tentativo di bonifico sul tuo conto è stato bloccato dai nostri sistemi di sicurezza. Ecco i dettagli:",
        failedFooter: "Nessun importo è stato addebitato. Contatta il servizio clienti per maggiori informazioni.",

        pendingSubj: "Il tuo bonifico App Pay è in attesa di convalida",
        pendingGreet: "Gentile {name},",
        pendingIntro: "Il tuo bonifico è stato registrato ed è in attesa di convalida da parte del nostro servizio amministrativo.",
        pendingFooter: "Riceverai una notifica non appena il bonifico sarà elaborato.",

        validatedSubj: "Bonifico convalidato dall'amministrazione",
        validatedGreet: "Gentile {name},",
        validatedIntro: "Il tuo bonifico in sospeso è stato convalidato dal nostro servizio amministrativo ed elaborato con successo.",
        validatedFooter: "Il credito sul conto del beneficiario avverrà entro 24-48 ore lavorative. Grazie per la tua fiducia.",

        cancelledSubj: "Bonifico annullato dall'amministrazione",
        cancelledGreet: "Gentile {name},",
        cancelledIntro: "Il tuo bonifico è stato annullato dal nostro servizio amministrativo. L'importo è stato riaccreditato sul tuo conto.",
        cancelledFooter: "Puoi verificare il tuo nuovo saldo nel tuo portale clienti.",

        refundSubj: "Bonifico rimborsato",
        refundGreet: "Gentile {name},",
        refundIntro: "L'importo del tuo bonifico ti è stato rimborsato. Ecco i dettagli:",
        refundFooter: "L'importo è stato riaccreditato sul tuo conto. Grazie per la tua comprensione.",

        userCancelledSubj: "Bonifico annullato",
        userCancelledGreet: "Gentile {name},",
        userCancelledIntro: "Ti confermiamo che il tuo bonifico è stato annullato. Nessun importo è stato addebitato sul tuo conto.",
        userCancelledFooter: "Se non hai avviato tu questa cancellazione, contatta immediatamente il nostro servizio clienti.",

        adminConnectionSubj: "🔔 Nuova connessione cliente su App Pay",
        adminConnectionGreet: "Ciao Amministratore,",
        adminConnectionIntro: "Il seguente cliente si è appena connesso al suo conto App Pay. Ecco i dettagli:",
        adminConnectionFooter: "Questa email viene inviata automaticamente all'amministratore ogni volta che un cliente effettua l'accesso."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : PORTUGAIS (pt)
    // ═══════════════════════════════════════════════════════
    pt: {
        loginSubj: "Bem-vindo ao App Pay – As suas credenciais de acesso",
        loginGreet: "Estimado(a) {name},",
        loginIntro: "Temos o prazer de confirmar a abertura da sua conta no App Pay. Aqui estão as suas credenciais:",
        loginFooter: "Para sua segurança, mantenha estas informações confidenciais. Nunca compartilhe o seu código PIN.",
        
        actSubj: "O seu código de ativação para transferências App Pay",
        actGreet: "Estimado(a) {name},",
        actIntro: "Para garantir a segurança das suas transações, aqui está o seu código de ativação pessoal:",
        actFooter: "Guarde este código em local seguro. É estritamente pessoal e confidencial.",

        successSubj: "Confirmação da sua transferência App Pay",
        successGreet: "Estimado(a) {name},",
        successIntro: "Confirmamos que a sua transferência foi processada com sucesso. Aqui está o resumo:",
        successFooter: "Os fundos serão creditados na conta do beneficiário no prazo de 24 a 48 horas úteis. Obrigado pela sua confiança.",

        failedSubj: "Alerta: A sua transferência App Pay foi bloqueada",
        failedGreet: "Estimado(a) {name},",
        failedIntro: "Uma tentativa de transferência na sua conta foi bloqueada pelos nossos sistemas de segurança. Aqui estão os detalhes:",
        failedFooter: "Nenhum valor foi debitado. Contacte o serviço de apoio ao cliente para mais informações.",

        pendingSubj: "A sua transferência App Pay está pendente de validação",
        pendingGreet: "Estimado(a) {name},",
        pendingIntro: "A sua transferência foi registada e está pendente de validação pelo nosso serviço administrativo.",
        pendingFooter: "Receberá uma notificação assim que a transferência for processada.",

        validatedSubj: "Transferência validada pela administração",
        validatedGreet: "Estimado(a) {name},",
        validatedIntro: "A sua transferência pendente foi validada pelo nosso serviço administrativo e processada com sucesso.",
        validatedFooter: "Os fundos serão creditados na conta do beneficiário no prazo de 24 a 48 horas úteis. Obrigado pela sua confiança.",

        cancelledSubj: "Transferência cancelada pela administração",
        cancelledGreet: "Estimado(a) {name},",
        cancelledIntro: "A sua transferência foi cancelada pelo nosso serviço administrativo. O valor foi recreditado na sua conta.",
        cancelledFooter: "Pode verificar o seu novo saldo no seu portal de cliente.",

        refundSubj: "Transferência reembolsada",
        refundGreet: "Estimado(a) {name},",
        refundIntro: "O valor da sua transferência foi reembolsado. Aqui estão os detalhes:",
        refundFooter: "O valor foi recreditado na sua conta. Obrigado pela sua compreensão.",

        userCancelledSubj: "Transferência cancelada",
        userCancelledGreet: "Estimado(a) {name},",
        userCancelledIntro: "Confirmamos que a sua transferência foi cancelada. Nenhum valor foi debitado da sua conta.",
        userCancelledFooter: "Se não iniciou este cancelamento, contacte imediatamente o nosso serviço de apoio ao cliente.",

        adminConnectionSubj: "🔔 Nova conexão de cliente no App Pay",
        adminConnectionGreet: "Olá Administrador,",
        adminConnectionIntro: "O seguinte cliente acabou de iniciar sessão na sua conta App Pay. Aqui estão os detalhes:",
        adminConnectionFooter: "Este email é enviado automaticamente ao administrador sempre que um cliente inicia sessão."
    }
    // ═══════════════════════════════════════════════════════
// LANGUE : RUSSE (ru)
// ═══════════════════════════════════════════════════════
ru: {
    loginSubj: "Добро пожаловать в App Pay – Ваши учётные данные",
    loginGreet: "Уважаемый(ая) {name},",
    loginIntro: "Мы рады подтвердить открытие вашего счёта в App Pay. Вот ваши учётные данные для входа:",
    loginFooter: "В целях безопасности храните эту информацию конфиденциально. Никогда не сообщайте свой PIN-код.",
    
    actSubj: "Ваш код активации для переводов App Pay",
    actGreet: "Уважаемый(ая) {name},",
    actIntro: "Для обеспечения безопасности ваших транзакций ниже указан ваш персональный код активации:",
    actFooter: "Храните этот код в надёжном месте. Он является строго личным и конфиденциальным.",

    successSubj: "Подтверждение вашего перевода App Pay",
    successGreet: "Уважаемый(ая) {name},",
    successIntro: "Подтверждаем, что ваш перевод успешно обработан. Вот сводка операции:",
    successFooter: "Средства будут зачислены на счёт получателя в течение 24–48 рабочих часов. Благодарим за доверие.",

    failedSubj: "Внимание: Ваш перевод App Pay заблокирован",
    failedGreet: "Уважаемый(ая) {name},",
    failedIntro: "Попытка перевода с вашего счёта была заблокирована нашими системами безопасности. Вот подробности:",
    failedFooter: "Никакая сумма не была списана. Свяжитесь со службой поддержки для получения информации.",

    pendingSubj: "Ваш перевод App Pay ожидает подтверждения",
    pendingGreet: "Уважаемый(ая) {name},",
    pendingIntro: "Ваш перевод зарегистрирован и ожидает проверки нашей административной службой.",
    pendingFooter: "Вы получите уведомление, как только перевод будет обработан.",

    validatedSubj: "Перевод подтверждён администрацией",
    validatedGreet: "Уважаемый(ая) {name},",
    validatedIntro: "Ваш ожидающий перевод был подтверждён нашей административной службой и успешно обработан.",
    validatedFooter: "Средства будут зачислены на счёт получателя в течение 24–48 рабочих часов. Благодарим за доверие.",

    cancelledSubj: "Перевод отменён администрацией",
    cancelledGreet: "Уважаемый(ая) {name},",
    cancelledIntro: "Ваш перевод был отменён нашей административной службой. Сумма была возвращена на ваш счёт.",
    cancelledFooter: "Вы можете проверить свой новый баланс в личном кабинете.",

    refundSubj: "Перевод возвращён",
    refundGreet: "Уважаемый(ая) {name},",
    refundIntro: "Сумма вашего перевода была вам возвращена. Вот подробности:",
    refundFooter: "Сумма была возвращена на ваш счёт. Благодарим за понимание.",

    userCancelledSubj: "Перевод отменён",
    userCancelledGreet: "Уважаемый(ая) {name},",
    userCancelledIntro: "Подтверждаем, что ваш перевод был отменён. Никакая сумма не была списана с вашего счёта.",
    userCancelledFooter: "Если вы не инициировали эту отмену, немедленно свяжитесь с нашей службой поддержки.",

    adminConnectionSubj: "Новое подключение клиента в App Pay",
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
    loginIntro: "يسعدنا تأكيد فتح حسابك لدى App Pay. إليك بيانات تسجيل الدخول الخاصة بك:",
    loginFooter: "من أجل سلامتك، نوصيك بالحفاظ على سرية هذه المعلومات. لا تشارك رمز PIN الخاص بك مع أي شخص أبدًا.",
    
    actSubj: "رمز التفعيل الخاص بك لتحويلات App Pay",
    actGreet: "عزيزي/عزيزتي {name}،",
    actIntro: "لضمان أمان معاملاتك، إليك رمز التفعيل الشخصي الخاص بك:",
    actFooter: "احتفظ بهذا الرمز في مكان آمن. إنه شخصي وسري للغاية.",

    successSubj: "تأكيد تحويل App Pay الخاص بك",
    successGreet: "عزيزي/عزيزتي {name}،",
    successIntro: "نؤكد لك أن تحويلك قد تمت معالجته بنجاح. فيما يلي ملخص العملية:",
    successFooter: "سيتم إيداع المبلغ في حساب المستفيد خلال 24 إلى 48 ساعة عمل. شكرًا لثقتك.",

    failedSubj: "تنبيه: تم حظر تحويل App Pay الخاص بك",
    failedGreet: "عزيزي/عزيزتي {name}،",
    failedIntro: "تم حظر محاولة تحويل على حسابك من قِبل أنظمة الأمان لدينا. فيما يلي التفاصيل:",
    failedFooter: "لم يتم خصم أي مبلغ. يرجى الاتصال بخدمة العملاء للحصول على مزيد من المعلومات.",

    pendingSubj: "تحويل App Pay الخاص بك في انتظار التحقق",
    pendingGreet: "عزيزي/عزيزتي {name}،",
    pendingIntro: "تم تسجيل تحويلك وهو حاليًا في انتظار التحقق من قِبل خدمتنا الإدارية.",
    pendingFooter: "ستتلقى إشعارًا بمجرد معالجة التحويل.",

    validatedSubj: "تم التحقق من التحويل من قبل الإدارة",
    validatedGreet: "عزيزي/عزيزتي {name}،",
    validatedIntro: "تم التحقق من تحويلك المعلق من قِبل خدمتنا الإدارية وتمت معالجته بنجاح.",
    validatedFooter: "سيتم إيداع المبلغ في حساب المستفيد خلال 24 إلى 48 ساعة عمل. شكرًا لثقتك.",

    cancelledSubj: "تم إلغاء التحويل من قبل الإدارة",
    cancelledGreet: "عزيزي/عزيزتي {name}،",
    cancelledIntro: "تم إلغاء تحويلك من قِبل خدمتنا الإدارية. تمت إعادة إيداع المبلغ في حسابك.",
    cancelledFooter: "يمكنك التحقق من رصيدك الجديد في بوابة العملاء الخاصة بك.",

    refundSubj: "تم استرداد التحويل",
    refundGreet: "عزيزي/عزيزتي {name}،",
    refundIntro: "تم استرداد مبلغ تحويلك. فيما يلي التفاصيل:",
    refundFooter: "تمت إعادة إيداع المبلغ في حسابك. شكرًا لتفهمك.",

    userCancelledSubj: "تم إلغاء التحويل",
    userCancelledGreet: "عزيزي/عزيزتي {name}،",
    userCancelledIntro: "نؤكد لك أن تحويلك قد تم إلغاؤه. لم يتم خصم أي مبلغ من حسابك.",
    userCancelledFooter: "إذا لم تكن أنت من بدأ هذا الإلغاء، فيرجى الاتصال بخدمة العملاء لدينا على الفور.",

    adminConnectionSubj: "اتصال عميل جديد على App Pay",
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
    loginIntro: "我们很高兴确认您已成功在 App Pay 开设账户。请使用以下登录凭据：",
    loginFooter: "为了您的安全，我们建议您对此信息保密。切勿与任何人分享您的 PIN 码。",
    
    actSubj: "您的 App Pay 转账激活码",
    actGreet: "尊敬的 {name}，",
    actIntro: "为了确保您交易的安全，请在下方查看您的个人激活码：",
    actFooter: "请将此代码保存在安全的地方。它是严格个人且保密的。",

    successSubj: "您的 App Pay 转账确认",
    successGreet: "尊敬的 {name}，",
    successIntro: "我们确认您的转账已成功处理。以下是操作摘要：",
    successFooter: "资金将在 24 至 48 个工作小时内存入收款人的账户。感谢您的信任。",

    failedSubj: "警报：您的 App Pay 转账已被阻止",
    failedGreet: "尊敬的 {name}，",
    failedIntro: "您账户上的一笔转账尝试已被我们的安全系统阻止。以下是详细信息：",
    failedFooter: "未扣除任何金额。请联系客户服务以获取更多信息。",

    pendingSubj: "您的 App Pay 转账正在等待验证",
    pendingGreet: "尊敬的 {name}，",
    pendingIntro: "您的转账已登记，目前正在等待我们的行政服务部门进行验证。",
    pendingFooter: "转账处理后，您将收到通知。",

    validatedSubj: "转账已由管理员验证",
    validatedGreet: "尊敬的 {name}，",
    validatedIntro: "您待处理的转账已由我们的行政服务部门验证并成功处理。",
    validatedFooter: "资金将在 24 至 48 个工作小时内存入收款人的账户。感谢您的信任。",

    cancelledSubj: "转账已由管理员取消",
    cancelledGreet: "尊敬的 {name}，",
    cancelledIntro: "您的转账已由我们的行政服务部门取消。该金额已重新存入您的账户。",
    cancelledFooter: "您可以在客户门户中查看您的新余额。",

    refundSubj: "转账已退款",
    refundGreet: "尊敬的 {name}，",
    refundIntro: "您的转账金额已退还给您。以下是详细信息：",
    refundFooter: "该金额已重新存入您的账户。感谢您的理解。",

    userCancelledSubj: "转账已取消",
    userCancelledGreet: "尊敬的 {name}，",
    userCancelledIntro: "我们确认您的转账已被取消。未从您的账户中扣除任何金额。",
    userCancelledFooter: "如果不是您发起的此取消操作，请立即联系我们的客户服务。",

    adminConnectionSubj: "App Pay 上的新客户连接",
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
    loginIntro: "App Payへのアカウント開設を確認いたしました。ログイン情報は以下の通りです：",
    loginFooter: "セキュリティのため、この情報は厳重に管理してください。PINコードは絶対に他人と共有しないでください。",
    
    actSubj: "App Pay送金のアクティベーションコード",
    actGreet: "{name} 様,",
    actIntro: "お取引の安全を確保するため、以下にあなたの個人アクティベーションコードを記載します：",
    actFooter: "このコードは安全な場所に保管してください。これは厳密に個人専用かつ機密情報です。",

    successSubj: "App Pay送金の確認",
    successGreet: "{name} 様,",
    successIntro: "あなたの送金が正常に処理されたことを確認いたします。お取引の概要は以下の通りです：",
    successFooter: "資金は24〜48営業時間以内に受取人の口座に入金されます。ご信頼ありがとうございます。",

    failedSubj: "警告: App Payの送金がブロックされました",
    failedGreet: "{name} 様,",
    failedIntro: "あなたの口座への送金試行が、当社のセキュリティシステムによってブロックされました。詳細は以下の通りです：",
    failedFooter: "金額は引き落とされていません。詳細についてはカスタマーサービスにお問い合わせください。",

    pendingSubj: "App Payの送金は検証待ちです",
    pendingGreet: "{name} 様,",
    pendingIntro: "あなたの送金が登録され、現在当社の管理サービスによる検証待ちです。",
    pendingFooter: "送金が処理され次第、通知が届きます。",

    validatedSubj: "送金が管理者によって承認されました",
    validatedGreet: "{name} 様,",
    validatedIntro: "保留中の送金が当社の管理サービスによって承認され、正常に処理されました。",
    validatedFooter: "資金は24〜48営業時間以内に受取人の口座に入金されます。ご信頼ありがとうございます。",

    cancelledSubj: "送金が管理者によってキャンセルされました",
    cancelledGreet: "{name} 様,",
    cancelledIntro: "あなたの送金が当社の管理サービスによってキャンセルされました。金額はあなたの口座に再入金されました。",
    cancelledFooter: "新しい残高はクライアントポータルで確認できます。",

    refundSubj: "送金が返金されました",
    refundGreet: "{name} 様,",
    refundIntro: "あなたの送金額が返金されたことをお知らせします。詳細は以下の通りです：",
    refundFooter: "金額はあなたの口座に再入金されました。ご理解ありがとうございます。",

    userCancelledSubj: "送金がキャンセルされました",
    userCancelledGreet: "{name} 様,",
    userCancelledIntro: "あなたの送金がキャンセルされたことを確認いたします。あなたの口座から金額は引き落とされていません。",
    userCancelledFooter: "このキャンセルをあなたが開始していない場合は、すぐにカスタマーサービスにご連絡ください。",

    adminConnectionSubj: "App Payでの新しいクライアント接続",
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
    loginIntro: "App Pay 계정 개설을 확인하게 되어 기쁩니다. 아래의 로그인 정보를 사용하십시오:",
    loginFooter: "보안을 위해 이 정보를 기밀로 유지하시기 바랍니다. PIN 코드를 누구와도 공유하지 마십시오.",
    
    actSubj: "App Pay 송금을 위한 활성화 코드",
    actGreet: "{name} 님께,",
    actIntro: "거래의 보안을 보장하기 위해 아래에 개인 활성화 코드를 안내해 드립니다:",
    actFooter: "이 코드를 안전한 곳에 보관하십시오. 이는 엄격히 개인적이고 기밀입니다.",

    successSubj: "App Pay 송금 확인",
    successGreet: "{name} 님께,",
    successIntro: "귀하의 송금이 성공적으로 처리되었음을 확인합니다. 거래 요약은 다음과 같습니다:",
    successFooter: "자금은 영업일 기준 24~48시간 이내에 수취인 계좌로 입금됩니다. 신뢰해 주셔서 감사합니다.",

    failedSubj: "경고: App Pay 송금이 차단되었습니다",
    failedGreet: "{name} 님께,",
    failedIntro: "귀하의 계좌에서 송금 시도가 당사 보안 시스템에 의해 차단되었습니다. 세부 사항은 다음과 같습니다:",
    failedFooter: "금액은 청구되지 않았습니다. 자세한 내용은 고객 서비스에 문의하십시오.",

    pendingSubj: "App Pay 송금이 검증 대기 중입니다",
    pendingGreet: "{name} 님께,",
    pendingIntro: "귀하의 송금이 등록되었으며 현재 당사 행정 서비스의 검증을 기다리고 있습니다.",
    pendingFooter: "송금이 처리되는 즉시 알림을 받으실 수 있습니다.",

    validatedSubj: "송금이 관리자에 의해 승인되었습니다",
    validatedGreet: "{name} 님께,",
    validatedIntro: "귀하의 대기 중인 송금이 당사 행정 서비스에 의해 승인되어 성공적으로 처리되었습니다.",
    validatedFooter: "자금은 영업일 기준 24~48시간 이내에 수취인 계좌로 입금됩니다. 신뢰해 주셔서 감사합니다.",

    cancelledSubj: "송금이 관리자에 의해 취소되었습니다",
    cancelledGreet: "{name} 님께,",
    cancelledIntro: "귀하의 송금이 당사 행정 서비스에 의해 취소되었습니다. 금액이 귀하의 계좌로 다시 입금되었습니다.",
    cancelledFooter: "고객 포털에서 새 잔액을 확인하실 수 있습니다.",

    refundSubj: "송금이 환불되었습니다",
    refundGreet: "{name} 님께,",
    refundIntro: "귀하의 송금 금액이 환불되었음을 알려드립니다. 세부 사항은 다음과 같습니다:",
    refundFooter: "금액이 귀하의 계좌로 다시 입금되었습니다. 이해해 주셔서 감사합니다.",

    userCancelledSubj: "송금이 취소되었습니다",
    userCancelledGreet: "{name} 님께,",
    userCancelledIntro: "귀하의 송금이 취소되었음을 확인합니다. 귀하의 계좌에서 금액이 청구되지 않았습니다.",
    userCancelledFooter: "본인이 이 취소를 시작하지 않은 경우 즉시 고객 서비스에 문의하십시오.",

    adminConnectionSubj: "App Pay의 새로운 고객 연결",
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
    loginIntro: "App Pay'de hesabınızın açıldığını teyit etmekten memnuniyet duyarız. Giriş bilgileriniz aşağıdadır:",
    loginFooter: "Güvenliğiniz için bu bilgileri gizli tutmanızı öneririz. PIN kodunuzu asla kimseyle paylaşmayın.",
    
    actSubj: "App Pay Transferleriniz için Aktivasyon Kodunuz",
    actGreet: "Sayın {name},",
    actIntro: "İşlemlerinizin güvenliğini sağlamak için kişisel aktivasyon kodunuz aşağıda yer almaktadır:",
    actFooter: "Bu kodu güvenli bir yerde saklayın. Kesinlikle kişisel ve gizlidir.",

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

    adminConnectionSubj: "App Pay'de Yeni Müşteri Bağlantısı",
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
    loginIntro: "Chúng tôi vui mừng xác nhận việc mở tài khoản của bạn tại App Pay. Đây là thông tin đăng nhập của bạn:",
    loginFooter: "Vì sự an toàn của bạn, chúng tôi khuyên bạn nên giữ bí mật thông tin này. Không bao giờ chia sẻ mã PIN của bạn với bất kỳ ai.",
    
    actSubj: "Mã kích hoạt của bạn cho các giao dịch chuyển khoản App Pay",
    actGreet: "Kính gửi {name},",
    actIntro: "Để đảm bảo an toàn cho các giao dịch của bạn, vui lòng xem mã kích hoạt cá nhân của bạn dưới đây:",
    actFooter: "Hãy giữ mã này ở nơi an toàn. Nó hoàn toàn riêng tư và bảo mật.",

    successSubj: "Xác nhận chuyển khoản App Pay của bạn",
    successGreet: "Kính gửi {name},",
    successIntro: "Chúng tôi xác nhận rằng giao dịch chuyển khoản của bạn đã được xử lý thành công. Đây là tóm tắt của giao dịch:",
    successFooter: "Tiền sẽ được ghi có vào tài khoản của người thụ hưởng trong vòng 24 đến 48 giờ làm việc. Cảm ơn bạn đã tin tưởng.",

    failedSubj: "Cảnh báo: Chuyển khoản App Pay của bạn đã bị chặn",
    failedGreet: "Kính gửi {name},",
    failedIntro: "Một nỗ lực chuyển khoản trên tài khoản của bạn đã bị hệ thống bảo mật của chúng tôi chặn. Đây là chi tiết:",
    failedFooter: "Không có khoản tiền nào bị trừ. Vui lòng liên hệ dịch vụ khách hàng để biết thêm thông tin.",

    pendingSubj: "Chuyển khoản App Pay của bạn đang chờ xác minh",
    pendingGreet: "Kính gửi {name},",
    pendingIntro: "Giao dịch chuyển khoản của bạn đã được đăng ký và hiện đang chờ xác minh bởi bộ phận hành chính của chúng tôi.",
    pendingFooter: "Bạn sẽ nhận được thông báo ngay khi giao dịch chuyển khoản được xử lý.",

    validatedSubj: "Chuyển khoản được xác nhận bởi ban quản trị",
    validatedGreet: "Kính gửi {name},",
    validatedIntro: "Giao dịch chuyển khoản đang chờ xử lý của bạn đã được ban quản trị của chúng tôi xác nhận và xử lý thành công.",
    validatedFooter: "Tiền sẽ được ghi có vào tài khoản của người thụ hưởng trong vòng 24 đến 48 giờ làm việc. Cảm ơn bạn đã tin tưởng.",

    cancelledSubj: "Chuyển khoản bị hủy bởi ban quản trị",
    cancelledGreet: "Kính gửi {name},",
    cancelledIntro: "Giao dịch chuyển khoản của bạn đã bị ban quản trị của chúng tôi hủy bỏ. Số tiền đã được ghi lại vào tài khoản của bạn.",
    cancelledFooter: "Bạn có thể kiểm tra số dư mới của mình trong cổng thông tin khách hàng.",

    refundSubj: "Chuyển khoản đã được hoàn tiền",
    refundGreet: "Kính gửi {name},",
    refundIntro: "Số tiền chuyển khoản của bạn đã được hoàn trả cho bạn. Đây là chi tiết:",
    refundFooter: "Số tiền đã được ghi lại vào tài khoản của bạn. Cảm ơn bạn đã thông cảm.",

    userCancelledSubj: "Chuyển khoản đã bị hủy",
    userCancelledGreet: "Kính gửi {name},",
    userCancelledIntro: "Chúng tôi xác nhận rằng giao dịch chuyển khoản của bạn đã bị hủy. Không có khoản tiền nào bị trừ khỏi tài khoản của bạn.",
    userCancelledFooter: "Nếu bạn không phải là người khởi tạo việc hủy này, vui lòng liên hệ ngay với dịch vụ khách hàng của chúng tôi.",

    adminConnectionSubj: "Kết nối khách hàng mới trên App Pay",
    adminConnectionGreet: "Xin chào Quản trị viên,",
    adminConnectionIntro: "Khách hàng sau vừa đăng nhập vào tài khoản App Pay của họ. Đây là chi tiết kết nối:",
    adminConnectionFooter: "Email này được tự động gửi đến quản trị viên mỗi khi khách hàng đăng nhập."
},
// ═══════════════════════════════════════════════════════
// LANGUE : NÉERLANDAIS (nl)
// ═══════════════════════════════════════════════════════
nl: {
    loginSubj: "Welkom bij App Pay – Uw inloggegevens",
    loginGreet: "Beste {name},",
    loginIntro: "Wij zijn verheugd de opening van uw account bij App Pay te bevestigen. Hier zijn uw inloggegevens:",
    loginFooter: "Voor uw veiligheid raden wij u aan deze informatie vertrouwelijk te houden. Deel uw pincode nooit met iemand.",
    
    actSubj: "Uw activeringscode voor App Pay-overschrijvingen",
    actGreet: "Beste {name},",
    actIntro: "Om de veiligheid van uw transacties te waarborgen, vindt u hieronder uw persoonlijke activeringscode:",
    actFooter: "Bewaar deze code op een veilige plaats. Hij is strikt persoonlijk en vertrouwelijk.",

    successSubj: "Bevestiging van uw App Pay-overschrijving",
    successGreet: "Beste {name},",
    successIntro: "Wij bevestigen dat uw overschrijving met succes is verwerkt. Hier is het overzicht:",
    successFooter: "Het geld wordt binnen 24 tot 48 werkuren op de rekening van de begunstigde gestort. Bedankt voor uw vertrouwen.",

    failedSubj: "Waarschuwing: Uw App Pay-overschrijving is geblokkeerd",
    failedGreet: "Beste {name},",
    failedIntro: "Een overschrijvingspoging op uw rekening is door onze beveiligingssystemen geblokkeerd. Hier zijn de details:",
    failedFooter: "Er is geen bedrag afgeschreven. Neem contact op met de klantenservice voor meer informatie.",

    pendingSubj: "Uw App Pay-overschrijving wacht op validatie",
    pendingGreet: "Beste {name},",
    pendingIntro: "Uw overschrijving is geregistreerd en wacht momenteel op validatie door onze administratieve dienst.",
    pendingFooter: "U ontvangt een melding zodra de overschrijving is verwerkt.",

    validatedSubj: "Overschrijving gevalideerd door de administratie",
    validatedGreet: "Beste {name},",
    validatedIntro: "Uw wachtende overschrijving is door onze administratieve dienst gevalideerd en met succes verwerkt.",
    validatedFooter: "Het geld wordt binnen 24 tot 48 werkuren op de rekening van de begunstigde gestort. Bedankt voor uw vertrouwen.",

    cancelledSubj: "Overschrijving geannuleerd door de administratie",
    cancelledGreet: "Beste {name},",
    cancelledIntro: "Uw overschrijving is door onze administratieve dienst geannuleerd. Het bedrag is weer op uw rekening gestort.",
    cancelledFooter: "U kunt uw nieuwe saldo controleren in uw klantenportaal.",

    refundSubj: "Overschrijving terugbetaald",
    refundGreet: "Beste {name},",
    refundIntro: "Het bedrag van uw overschrijving is aan u terugbetaald. Hier zijn de details:",
    refundFooter: "Het bedrag is weer op uw rekening gestort. Bedankt voor uw begrip.",

    userCancelledSubj: "Overschrijving geannuleerd",
    userCancelledGreet: "Beste {name},",
    userCancelledIntro: "Wij bevestigen dat uw overschrijving is geannuleerd. Er is geen bedrag van uw rekening afgeschreven.",
    userCancelledFooter: "Als u deze annulering niet hebt geïnitieerd, neem dan onmiddellijk contact op met onze klantenservice.",

    adminConnectionSubj: "Nieuwe klantverbinding op App Pay",
    adminConnectionGreet: "Hallo Beheerder,",
    adminConnectionIntro: "De volgende klant is zojuist ingelogd op zijn App Pay-account. Hier zijn de details:",
    adminConnectionFooter: "Deze e-mail wordt automatisch naar de beheerder verzonden telkens wanneer een klant inlogt."
},

// ═══════════════════════════════════════════════════════
// LANGUE : POLONAIS (pl)
// ═══════════════════════════════════════════════════════
pl: {
    loginSubj: "Witamy w App Pay – Twoje dane logowania",
    loginGreet: "Szanowny(a) {name},",
    loginIntro: "Z przyjemnością potwierdzamy otwarcie Twojego konta w App Pay. Oto Twoje dane logowania:",
    loginFooter: "Ze względów bezpieczeństwa zalecamy zachowanie tych informacji w poufności. Nigdy nie udostępniaj swojego kodu PIN.",
    
    actSubj: "Twój kod aktywacyjny do przelewów App Pay",
    actGreet: "Szanowny(a) {name},",
    actIntro: "Aby zapewnić bezpieczeństwo Twoich transakcji, poniżej znajduje się Twój osobisty kod aktywacyjny:",
    actFooter: "Przechowuj ten kod w bezpiecznym miejscu. Jest on ściśle osobisty i poufny.",

    successSubj: "Potwierdzenie przelewu App Pay",
    successGreet: "Szanowny(a) {name},",
    successIntro: "Potwierdzamy, że Twój przelew został pomyślnie przetworzony. Oto podsumowanie:",
    successFooter: "Środki zostaną zaksięgowane na koncie odbiorcy w ciągu 24-48 godzin roboczych. Dziękujemy za zaufanie.",

    failedSubj: "Alert: Twój przelew App Pay został zablokowany",
    failedGreet: "Szanowny(a) {name},",
    failedIntro: "Próba przelewu na Twoim koncie została zablokowana przez nasze systemy bezpieczeństwa. Oto szczegóły:",
    failedFooter: "Żadna kwota nie została pobrana. Skontaktuj się z obsługą klienta, aby uzyskać więcej informacji.",

    pendingSubj: "Twój przelew App Pay oczekuje na weryfikację",
    pendingGreet: "Szanowny(a) {name},",
    pendingIntro: "Twój przelew został zarejestrowany i obecnie oczekuje na weryfikację przez nasz dział administracji.",
    pendingFooter: "Otrzymasz powiadomienie, gdy tylko przelew zostanie przetworzony.",

    validatedSubj: "Przelew zatwierdzony przez administrację",
    validatedGreet: "Szanowny(a) {name},",
    validatedIntro: "Twój oczekujący przelew został zatwierdzony przez nasz dział administracji i pomyślnie przetworzony.",
    validatedFooter: "Środki zostaną zaksięgowane na koncie odbiorcy w ciągu 24-48 godzin roboczych. Dziękujemy za zaufanie.",

    cancelledSubj: "Przelew anulowany przez administrację",
    cancelledGreet: "Szanowny(a) {name},",
    cancelledIntro: "Twój przelew został anulowany przez nasz dział administracji. Kwota została ponownie zaksięgowana na Twoim koncie.",
    cancelledFooter: "Możesz sprawdzić swoje nowe saldo w portalu klienta.",

    refundSubj: "Przelew zwrócony",
    refundGreet: "Szanowny(a) {name},",
    refundIntro: "Kwota Twojego przelewu została Ci zwrócona. Oto szczegóły:",
    refundFooter: "Kwota została ponownie zaksięgowana na Twoim koncie. Dziękujemy za zrozumienie.",

    userCancelledSubj: "Przelew anulowany",
    userCancelledGreet: "Szanowny(a) {name},",
    userCancelledIntro: "Potwierdzamy, że Twój przelew został anulowany. Żadna kwota nie została pobrana z Twojego konta.",
    userCancelledFooter: "Jeśli nie zainicjowałeś tego anulowania, natychmiast skontaktuj się z naszą obsługą klienta.",

    adminConnectionSubj: "Nowe połączenie klienta w App Pay",
    adminConnectionGreet: "Witaj Administratorze,",
    adminConnectionIntro: "Następujący klient właśnie zalogował się na swoje konto App Pay. Oto szczegóły:",
    adminConnectionFooter: "Ta wiadomość jest wysyłana automatycznie do administratora przy każdym logowaniu klienta."
},

// ═══════════════════════════════════════════════════════
// LANGUE : SUÉDOIS (sv)
// ═══════════════════════════════════════════════════════
sv: {
    loginSubj: "Välkommen till App Pay – Dina inloggningsuppgifter",
    loginGreet: "Bästa {name},",
    loginIntro: "Vi är glada att kunna bekräfta öppnandet av ditt konto hos App Pay. Här är dina inloggningsuppgifter:",
    loginFooter: "För din säkerhet rekommenderar vi att du håller denna information konfidentiell. Dela aldrig din PIN-kod med någon.",
    
    actSubj: "Din aktiveringskod för App Pay-överföringar",
    actGreet: "Bästa {name},",
    actIntro: "För att säkerställa säkerheten för dina transaktioner, vänligen se din personliga aktiveringskod nedan:",
    actFooter: "Förvara denna kod på ett säkert ställe. Den är strikt personlig och konfidentiell.",

    successSubj: "Bekräftelse av din App Pay-överföring",
    successGreet: "Bästa {name},",
    successIntro: "Vi bekräftar att din överföring har behandlats framgångsrikt. Här är sammanfattningen:",
    successFooter: "Pengarna kommer att krediteras mottagarens konto inom 24 till 48 banktimmar. Tack för ditt förtroende.",

    failedSubj: "Varning: Din App Pay-överföring blockerades",
    failedGreet: "Bästa {name},",
    failedIntro: "Ett överföringsförsök på ditt konto blockerades av våra säkerhetssystem. Här är detaljerna:",
    failedFooter: "Inget belopp drogs. Kontakta kundtjänst för mer information.",

    pendingSubj: "Din App Pay-överföring väntar på validering",
    pendingGreet: "Bästa {name},",
    pendingIntro: "Din överföring har registrerats och väntar för närvarande på validering av vår administrativa tjänst.",
    pendingFooter: "Du kommer att få ett meddelande så snart överföringen har behandlats.",

    validatedSubj: "Överföring validerad av administrationen",
    validatedGreet: "Bästa {name},",
    validatedIntro: "Din väntande överföring har validerats av vår administrativa tjänst och behandlats framgångsrikt.",
    validatedFooter: "Pengarna kommer att krediteras mottagarens konto inom 24 till 48 banktimmar. Tack för ditt förtroende.",

    cancelledSubj: "Överföring avbruten av administrationen",
    cancelledGreet: "Bästa {name},",
    cancelledIntro: "Din överföring har avbrutits av vår administrativa tjänst. Beloppet har återkrediterats till ditt konto.",
    cancelledFooter: "Du kan kontrollera ditt nya saldo i din kundportal.",

    refundSubj: "Överföring återbetald",
    refundGreet: "Bästa {name},",
    refundIntro: "Beloppet för din överföring har återbetalats till dig. Här är detaljerna:",
    refundFooter: "Beloppet har återkrediterats till ditt konto. Tack för din förståelse.",

    userCancelledSubj: "Överföring avbruten",
    userCancelledGreet: "Bästa {name},",
    userCancelledIntro: "Vi bekräftar att din överföring har avbrutits. Inget belopp drogs från ditt konto.",
    userCancelledFooter: "Om du inte initierade denna avbokning, vänligen kontakta vår kundtjänst omedelbart.",

    adminConnectionSubj: "Ny klientanslutning på App Pay",
    adminConnectionGreet: "Hej Administratör,",
    adminConnectionIntro: "Följande klient loggade precis in på sitt App Pay-konto. Här är detaljerna:",
    adminConnectionFooter: "Detta e-postmeddelande skickas automatiskt till administratören varje gång en klient loggar in."
},

// ═══════════════════════════════════════════════════════
// LANGUE : NORVÉGIEN (no)
// ═══════════════════════════════════════════════════════
no: {
    loginSubj: "Velkommen til App Pay – Dine påloggingsdetaljer",
    loginGreet: "Kjære {name},",
    loginIntro: "Vi er glade for å bekrefte åpningen av kontoen din hos App Pay. Her er påloggingsdetaljene dine:",
    loginFooter: "For din sikkerhet anbefaler vi at du holder denne informasjonen konfidensiell. Del aldri PIN-koden din med noen.",
    
    actSubj: "Din aktiveringskode for App Pay-overføringer",
    actGreet: "Kjære {name},",
    actIntro: "For å sikre sikkerheten til transaksjonene dine, vennligst se din personlige aktiveringskode nedenfor:",
    actFooter: "Oppbevar denne koden på et trygt sted. Den er strengt personlig og konfidensiell.",

    successSubj: "Bekreftelse på din App Pay-overføring",
    successGreet: "Kjære {name},",
    successIntro: "Vi bekrefter at overføringen din er behandlet. Her er sammendraget:",
    successFooter: "Pengene vil bli kreditert mottakerens konto innen 24 til 48 banktimer. Takk for din tillit.",

    failedSubj: "Advarsel: Din App Pay-overføring ble blokkert",
    failedGreet: "Kjære {name},",
    failedIntro: "Et overføringsforsøk på kontoen din ble blokkert av sikkerhetssystemene våre. Her er detaljene:",
    failedFooter: "Ingen beløp ble debitert. Vennligst kontakt kundeservice for mer informasjon.",

    pendingSubj: "Din App Pay-overføring venter på validering",
    pendingGreet: "Kjære {name},",
    pendingIntro: "Overføringen din er registrert og venter for øyeblikket på validering av vår administrative tjeneste.",
    pendingFooter: "Du vil motta et varsel så snart overføringen er behandlet.",

    validatedSubj: "Overføring validert av administrasjonen",
    validatedGreet: "Kjære {name},",
    validatedIntro: "Din ventende overføring er validert av vår administrative tjeneste og behandlet.",
    validatedFooter: "Pengene vil bli kreditert mottakerens konto innen 24 til 48 banktimer. Takk for din tillit.",

    cancelledSubj: "Overføring kansellert av administrasjonen",
    cancelledGreet: "Kjære {name},",
    cancelledIntro: "Overføringen din er kansellert av vår administrative tjeneste. Beløpet er re-kreditert til kontoen din.",
    cancelledFooter: "Du kan sjekke din nye saldo i kundeportalen din.",

    refundSubj: "Overføring refundert",
    refundGreet: "Kjære {name},",
    refundIntro: "Beløpet for overføringen din er refundert til deg. Her er detaljene:",
    refundFooter: "Beløpet er re-kreditert til kontoen din. Takk for din forståelse.",

    userCancelledSubj: "Overføring kansellert",
    userCancelledGreet: "Kjære {name},",
    userCancelledIntro: "Vi bekrefter at overføringen din er kansellert. Ingen beløp ble debitert fra kontoen din.",
    userCancelledFooter: "Hvis du ikke startet denne kanselleringen, vennligst kontakt kundeservice umiddelbart.",

    adminConnectionSubj: "Ny klienttilkobling på App Pay",
    adminConnectionGreet: "Hei Administrator,",
    adminConnectionIntro: "Følgende klient logget nettopp på sin App Pay-konto. Her er detaljene:",
    adminConnectionFooter: "Denne e-posten sendes automatisk til administratoren hver gang en klient logger på."
},

// ═══════════════════════════════════════════════════════
// LANGUE : DANOIS (da)
// ═══════════════════════════════════════════════════════
da: {
    loginSubj: "Velkommen til App Pay – Dine loginoplysninger",
    loginGreet: "Kære {name},",
    loginIntro: "Vi er glade for at kunne bekræfte åbningen af din konto hos App Pay. Her er dine loginoplysninger:",
    loginFooter: "For din sikkerhed anbefaler vi, at du holder disse oplysninger fortrolige. Del aldrig din PIN-kode med nogen.",
    
    actSubj: "Din aktiveringskode til App Pay-overførsler",
    actGreet: "Kære {name},",
    actIntro: "For at sikre sikkerheden af dine transaktioner, finder du din personlige aktiveringskode nedenfor:",
    actFooter: "Opbevar denne kode på et sikkert sted. Den er strengt personlig og fortrolig.",

    successSubj: "Bekræftelse på din App Pay-overførsel",
    successGreet: "Kære {name},",
    successIntro: "Vi bekræfter, at din overførsel er blevet behandlet med succes. Her er oversigten:",
    successFooter: "Pengene vil blive krediteret modtagerens konto inden for 24 til 48 banktimer. Tak for din tillid.",

    failedSubj: "Advarsel: Din App Pay-overførsel blev blokeret",
    failedGreet: "Kære {name},",
    failedIntro: "Et overførselsforsøg på din konto blev blokeret af vores sikkerhedssystemer. Her er detaljerne:",
    failedFooter: "Intet beløb blev debiteret. Kontakt venligst kundeservice for mere information.",

    pendingSubj: "Din App Pay-overførsel afventer validering",
    pendingGreet: "Kære {name},",
    pendingIntro: "Din overførsel er registreret og afventer i øjeblikket validering af vores administrative service.",
    pendingFooter: "Du vil modtage en meddelelse, så snart overførslen er behandlet.",

    validatedSubj: "Overførsel valideret af administrationen",
    validatedGreet: "Kære {name},",
    validatedIntro: "Din ventende overførsel er blevet valideret af vores administrative service og behandlet med succes.",
    validatedFooter: "Pengene vil blive krediteret modtagerens konto inden for 24 til 48 banktimer. Tak for din tillid.",

    cancelledSubj: "Overførsel annulleret af administrationen",
    cancelledGreet: "Kære {name},",
    cancelledIntro: "Din overførsel er blevet annulleret af vores administrative service. Beløbet er blevet genkrediteret til din konto.",
    cancelledFooter: "Du kan kontrollere din nye saldo i din kundeportal.",

    refundSubj: "Overførsel tilbagebetalt",
    refundGreet: "Kære {name},",
    refundIntro: "Beløbet for din overførsel er blevet tilbagebetalt til dig. Her er detaljerne:",
    refundFooter: "Beløbet er blevet genkrediteret til din konto. Tak for din forståelse.",

    userCancelledSubj: "Overførsel annulleret",
    userCancelledGreet: "Kære {name},",
    userCancelledIntro: "Vi bekræfter, at din overførsel er blevet annulleret. Intet beløb blev debiteret fra din konto.",
    userCancelledFooter: "Hvis du ikke igangsatte denne annullering, bedes du straks kontakte vores kundeservice.",

    adminConnectionSubj: "Ny klientforbindelse på App Pay",
    adminConnectionGreet: "Hej Administrator,",
    adminConnectionIntro: "Følgende klient loggede netop ind på sin App Pay-konto. Her er detaljerne:",
    adminConnectionFooter: "Denne e-mail sendes automatisk til administratoren, hver gang en klient logger ind."
},

// ═══════════════════════════════════════════════════════
// LANGUE : FINNOIS (fi)
// ═══════════════════════════════════════════════════════
fi: {
    loginSubj: "Tervetuloa App Payhin – Kirjautumistietosi",
    loginGreet: "Hyvä {name},",
    loginIntro: "Olemme iloisia voidessamme vahvistaa App Pay -tilisi avaamisen. Tässä ovat kirjautumistietosi:",
    loginFooter: "Turvallisuutesi vuoksi suosittelemme pitämään nämä tiedot luottamuksellisina. Älä koskaan jaa PIN-koodiasi kenellekään.",
    
    actSubj: "Aktivointikoodisi App Pay -tilisiirtoihin",
    actGreet: "Hyvä {name},",
    actIntro: "Varmistaaksesi tapahtumiesi turvallisuuden, löydät henkilökohtaisen aktivointikoodisi alta:",
    actFooter: "Säilytä tämä koodi turvallisessa paikassa. Se on ehdottoman henkilökohtainen ja luottamuksellinen.",

    successSubj: "Vahvistus App Pay -tilisiirrostasi",
    successGreet: "Hyvä {name},",
    successIntro: "Vahvistamme, että tilisiirtosi on käsitelty onnistuneesti. Tässä on yhteenveto:",
    successFooter: "Varat hyvitetään vastaanottajan tilille 24–48 pankkipäivän kuluessa. Kiitos luottamuksestasi.",

    failedSubj: "Varoitus: App Pay -tilisiirtosi estettiin",
    failedGreet: "Hyvä {name},",
    failedIntro: "Tilisiirtoyritys tililläsi estettiin turvajärjestelmiemme toimesta. Tässä ovat yksityiskohdat:",
    failedFooter: "Mitään summaa ei veloitettu. Ota yhteyttä asiakaspalveluun saadaksesi lisätietoja.",

    pendingSubj: "App Pay -tilisiirtosi odottaa vahvistusta",
    pendingGreet: "Hyvä {name},",
    pendingIntro: "Tilisiirtosi on rekisteröity ja odottaa tällä hetkellä hallinnollisen palvelumme vahvistusta.",
    pendingFooter: "Saat ilmoituksen heti, kun tilisiirto on käsitelty.",

    validatedSubj: "Siirto vahvistettu hallinnon toimesta",
    validatedGreet: "Hyvä {name},",
    validatedIntro: "Odottava tilisiirtosi on vahvistettu hallinnollisen palvelumme toimesta ja käsitelty onnistuneesti.",
    validatedFooter: "Varat hyvitetään vastaanottajan tilille 24–48 pankkipäivän kuluessa. Kiitos luottamuksestasi.",

    cancelledSubj: "Siirto peruutettu hallinnon toimesta",
    cancelledGreet: "Hyvä {name},",
    cancelledIntro: "Tilisiirtosi on peruutettu hallinnollisen palvelumme toimesta. Summa on hyvitetty takaisin tilillesi.",
    cancelledFooter: "Voit tarkistaa uuden saldosi asiakasportaalistasi.",

    refundSubj: "Siirto hyvitetty",
    refundGreet: "Hyvä {name},",
    refundIntro: "Tilisiirtosi summa on hyvitetty sinulle takaisin. Tässä ovat yksityiskohdat:",
    refundFooter: "Summa on hyvitetty takaisin tilillesi. Kiitos ymmärryksestäsi.",

    userCancelledSubj: "Siirto peruutettu",
    userCancelledGreet: "Hyvä {name},",
    userCancelledIntro: "Vahvistamme, että tilisiirtosi on peruutettu. Tililtäsi ei veloitettu mitään summaa.",
    userCancelledFooter: "Jos et aloittanut tätä peruutusta, ota välittömästi yhteyttä asiakaspalveluumme.",

    adminConnectionSubj: "Uusi asiakasyhteys App Payssa",
    adminConnectionGreet: "Hei Ylläpitäjä,",
    adminConnectionIntro: "Seuraava asiakas kirjautui juuri sisään App Pay -tiliinsä. Tässä ovat yhteyden tiedot:",
    adminConnectionFooter: "Tämä sähköposti lähetetään automaattisesti ylläpitäjälle aina, kun asiakas kirjautuu sisään."
},
// ═══════════════════════════════════════════════════════
// LANGUE : TCHÈQUE (cs)
// ═══════════════════════════════════════════════════════
cs: {
    loginSubj: "Vítejte v App Pay – Vaše přihlašovací údaje",
    loginGreet: "Vážený/á {name},",
    loginIntro: "S potěšením potvrzujeme otevření vašeho účtu v App Pay. Zde jsou vaše přihlašovací údaje:",
    loginFooter: "Pro vaši bezpečnost doporučujeme uchovávat tyto informace v tajnosti. Nikdy nesdílejte svůj PIN kód.",
    
    actSubj: "Váš aktivační kód pro převody App Pay",
    actGreet: "Vážený/á {name},",
    actIntro: "Pro zajištění bezpečnosti vašich transakcí naleznete níže svůj osobní aktivační kód:",
    actFooter: "Uchovávejte tento kód na bezpečném místě. Je přísně osobní a důvěrný.",

    successSubj: "Potvrzení vašeho převodu App Pay",
    successGreet: "Vážený/á {name},",
    successIntro: "Potvrzujeme, že váš převod byl úspěšně zpracován. Zde je shrnutí:",
    successFooter: "Prostředky budou připsány na účet příjemce do 24 až 48 pracovních hodin. Děkujeme za vaši důvěru.",

    failedSubj: "Upozornění: Váš převod App Pay byl zablokován",
    failedGreet: "Vážený/á {name},",
    failedIntro: "Pokus o převod na vašem účtu byl zablokován našimi bezpečnostními systémy. Zde jsou podrobnosti:",
    failedFooter: "Nebyla odečtena žádná částka. Pro více informací kontaktujte zákaznickou podporu.",

    pendingSubj: "Váš převod App Pay čeká na ověření",
    pendingGreet: "Vážený/á {name},",
    pendingIntro: "Váš převod byl zaregistrován a v současné době čeká na ověření naší administrativní službou.",
    pendingFooter: "Jakmile bude převod zpracován, obdržíte oznámení.",

    validatedSubj: "Převod schválen administrací",
    validatedGreet: "Vážený/á {name},",
    validatedIntro: "Váš čekající převod byl schválen naší administrativní službou a úspěšně zpracován.",
    validatedFooter: "Prostředky budou připsány na účet příjemce do 24 až 48 pracovních hodin. Děkujeme za vaši důvěru.",

    cancelledSubj: "Převod zrušen administrací",
    cancelledGreet: "Vážený/á {name},",
    cancelledIntro: "Váš převod byl zrušen naší administrativní službou. Částka byla znovu připsána na váš účet.",
    cancelledFooter: "Svůj nový zůstatek si můžete ověřit ve svém klientském portálu.",

    refundSubj: "Převod vrácen",
    refundGreet: "Vážený/á {name},",
    refundIntro: "Částka vašeho převodu vám byla vrácena. Zde jsou podrobnosti:",
    refundFooter: "Částka byla znovu připsána na váš účet. Děkujeme za pochopení.",

    userCancelledSubj: "Převod zrušen",
    userCancelledGreet: "Vážený/á {name},",
    userCancelledIntro: "Potvrzujeme, že váš převod byl zrušen. Z vašeho účtu nebyla odečtena žádná částka.",
    userCancelledFooter: "Pokud jste toto zrušení neiniciovali vy, okamžitě kontaktujte naši zákaznickou podporu.",

    adminConnectionSubj: "Nové klientské připojení v App Pay",
    adminConnectionGreet: "Dobrý den, administrátore,",
    adminConnectionIntro: "Následující klient se právě přihlásil ke svému účtu App Pay. Zde jsou podrobnosti:",
    adminConnectionFooter: "Tento e-mail je automaticky odeslán administrátorovi při každém přihlášení klienta."
},

// ═══════════════════════════════════════════════════════
// LANGUE : SLOVAQUE (sk)
// ═══════════════════════════════════════════════════════
sk: {
    loginSubj: "Vitajte v App Pay – Vaše prihlasovacie údaje",
    loginGreet: "Vážený/á {name},",
    loginIntro: "S potešením potvrdzujeme otvorenie vášho účtu v App Pay. Tu sú vaše prihlasovacie údaje:",
    loginFooter: "Pre vašu bezpečnosť odporúčame uchovávať tieto informácie v tajnosti. Nikdy nezdieľajte svoj PIN kód.",
    
    actSubj: "Váš aktivačný kód pre prevody App Pay",
    actGreet: "Vážený/á {name},",
    actIntro: "Pre zabezpečenie bezpečnosti vašich transakcií nájdete nižšie svoj osobný aktivačný kód:",
    actFooter: "Uchovávajte tento kód na bezpečnom mieste. Je prísne osobný a dôverný.",

    successSubj: "Potvrdenie vášho prevodu App Pay",
    successGreet: "Vážený/á {name},",
    successIntro: "Potvrdzujeme, že váš prevod bol úspešne spracovaný. Tu je zhrnutie:",
    successFooter: "Prostriedky budú pripísané na účet príjemcu do 24 až 48 pracovných hodín. Ďakujeme za vašu dôveru.",

    failedSubj: "Upozornenie: Váš prevod App Pay bol zablokovaný",
    failedGreet: "Vážený/á {name},",
    failedIntro: "Pokus o prevod na vašom účte bol zablokovaný našimi bezpečnostnými systémami. Tu sú podrobnosti:",
    failedFooter: "Nebola odpísaná žiadna suma. Pre viac informácií kontaktujte zákaznícku podporu.",

    pendingSubj: "Váš prevod App Pay čaká na overenie",
    pendingGreet: "Vážený/á {name},",
    pendingIntro: "Váš prevod bol zaregistrovaný a v súčasnosti čaká na overenie našou administratívnou službou.",
    pendingFooter: "Hneď ako bude prevod spracovaný, dostanete oznámenie.",

    validatedSubj: "Prevod schválený administráciou",
    validatedGreet: "Vážený/á {name},",
    validatedIntro: "Váš čakajúci prevod bol schválený našou administratívnou službou a úspešne spracovaný.",
    validatedFooter: "Prostriedky budú pripísané na účet príjemcu do 24 až 48 pracovných hodín. Ďakujeme za vašu dôveru.",

    cancelledSubj: "Prevod zrušený administráciou",
    cancelledGreet: "Vážený/á {name},",
    cancelledIntro: "Váš prevod bol zrušený našou administratívnou službou. Suma bola znovu pripísaná na váš účet.",
    cancelledFooter: "Svoj nový zostatok si môžete overiť vo svojom klientskom portáli.",

    refundSubj: "Prevod vrátený",
    refundGreet: "Vážený/á {name},",
    refundIntro: "Suma vášho prevodu vám bola vrátená. Tu sú podrobnosti:",
    refundFooter: "Suma bola znovu pripísaná na váš účet. Ďakujeme za pochopenie.",

    userCancelledSubj: "Prevod zrušený",
    userCancelledGreet: "Vážený/á {name},",
    userCancelledIntro: "Potvrdzujeme, že váš prevod bol zrušený. Z vášho účtu nebola odpísaná žiadna suma.",
    userCancelledFooter: "Ak ste toto zrušenie neiniciovali vy, okamžite kontaktujte našu zákaznícku podporu.",

    adminConnectionSubj: "Nové klientske pripojenie v App Pay",
    adminConnectionGreet: "Dobrý deň, administrátor,",
    adminConnectionIntro: "Nasledujúci klient sa práve prihlásil do svojho účtu App Pay. Tu sú podrobnosti:",
    adminConnectionFooter: "Tento e-mail je automaticky odoslaný administrátorovi pri každom prihlásení klienta."
},

// ═══════════════════════════════════════════════════════
// LANGUE : HONGROIS (hu)
// ═══════════════════════════════════════════════════════
hu: {
    loginSubj: "Üdvözöljük az App Pay-nél – Bejelentkezési adatai",
    loginGreet: "Kedves {name},",
    loginIntro: "Örömmel értesítjük, hogy megnyitotta számláját az App Pay-nél. Itt vannak bejelentkezési adatai:",
    loginFooter: "Biztonsága érdekében javasoljuk, hogy ezeket az információkat bizalmasan kezelje. Soha ne ossza meg PIN-kódját senkivel.",
    
    actSubj: "Az App Pay átutalásokhoz szükséges aktiváló kódja",
    actGreet: "Kedves {name},",
    actIntro: "Tranzakciói biztonságának garantálása érdekében alább találja személyes aktiváló kódját:",
    actFooter: "Tartsa ezt a kódot biztonságos helyen. Ez szigorúan személyes és bizalmas.",

    successSubj: "App Pay átutalásának visszaigazolása",
    successGreet: "Kedves {name},",
    successIntro: "Megerősítjük, hogy átutalását sikeresen feldolgoztuk. Íme az összefoglaló:",
    successFooter: "Az összeget 24-48 banki munkaórán belül jóváírjuk a kedvezményezett számláján. Köszönjük bizalmát.",

    failedSubj: "Figyelmeztetés: App Pay átutalása blokkolva lett",
    failedGreet: "Kedves {name},",
    failedIntro: "A számláján végrehajtott átutalási kísérletet biztonsági rendszereink blokkolták. Íme a részletek:",
    failedFooter: "Nem került sor összeg levonására. További információért forduljon ügyfélszolgálatunkhoz.",

    pendingSubj: "App Pay átutalása jóváhagyásra vár",
    pendingGreet: "Kedves {name},",
    pendingIntro: "Átutalása regisztrálásra került, és jelenleg adminisztratív szolgálatunk jóváhagyására vár.",
    pendingFooter: "Amint az átutalás feldolgozásra kerül, értesítést kap.",

    validatedSubj: "Átutalás adminisztráció által jóváhagyva",
    validatedGreet: "Kedves {name},",
    validatedIntro: "Függőben lévő átutalását adminisztratív szolgálatunk jóváhagyta és sikeresen feldolgozta.",
    validatedFooter: "Az összeget 24-48 banki munkaórán belül jóváírjuk a kedvezményezett számláján. Köszönjük bizalmát.",

    cancelledSubj: "Átutalás adminisztráció által törölve",
    cancelledGreet: "Kedves {name},",
    cancelledIntro: "Átutalását adminisztratív szolgálatunk törölte. Az összeget visszajóváírták számlájára.",
    cancelledFooter: "Új egyenlegét ügyfélportálján ellenőrizheti.",

    refundSubj: "Átutalás visszatérítve",
    refundGreet: "Kedves {name},",
    refundIntro: "Átutalásának összegét visszatérítettük Önnek. Íme a részletek:",
    refundFooter: "Az összeget visszajóváírták számlájára. Köszönjük megértését.",

    userCancelledSubj: "Átutalás törölve",
    userCancelledGreet: "Kedves {name},",
    userCancelledIntro: "Megerősítjük, hogy átutalása törlésre került. Számlájáról nem került sor összeg levonására.",
    userCancelledFooter: "Ha nem Ön kezdeményezte ezt a törlést, kérjük, azonnal lépjen kapcsolatba ügyfélszolgálatunkkal.",

    adminConnectionSubj: "Új ügyfélkapcsolat az App Pay-en",
    adminConnectionGreet: "Üdvözöljük, Adminisztrátor,",
    adminConnectionIntro: "A következő ügyfél éppen most jelentkezett be App Pay fiókjába. Íme a részletek:",
    adminConnectionFooter: "Ez az e-mail automatikusan elküldésre kerül az adminisztrátornak minden ügyfél bejelentkezésekor."
},

// ═══════════════════════════════════════════════════════
// LANGUE : ROUMAIN (ro)
// ═══════════════════════════════════════════════════════
ro: {
    loginSubj: "Bine ați venit la App Pay – Datele dumneavoastră de conectare",
    loginGreet: "Stimate/Stimată {name},",
    loginIntro: "Suntem încântați să confirmăm deschiderea contului dumneavoastră la App Pay. Iată datele de conectare:",
    loginFooter: "Pentru siguranța dumneavoastră, vă recomandăm să păstrați aceste informații confidențiale. Nu împărtășiți niciodată codul PIN.",
    
    actSubj: "Codul dumneavoastră de activare pentru transferurile App Pay",
    actGreet: "Stimate/Stimată {name},",
    actIntro: "Pentru a asigura securitatea tranzacțiilor dumneavoastră, mai jos găsiți codul de activare personal:",
    actFooter: "Păstrați acest cod într-un loc sigur. Este strict personal și confidențial.",

    successSubj: "Confirmarea transferului dumneavoastră App Pay",
    successGreet: "Stimate/Stimată {name},",
    successIntro: "Vă confirmăm că transferul dumneavoastră a fost procesat cu succes. Iată rezumatul:",
    successFooter: "Fondurile vor fi creditate în contul beneficiarului în termen de 24 până la 48 de ore lucrătoare. Vă mulțumim pentru încredere.",

    failedSubj: "Alertă: Transferul dumneavoastră App Pay a fost blocat",
    failedGreet: "Stimate/Stimată {name},",
    failedIntro: "O încercare de transfer în contul dumneavoastră a fost blocată de sistemele noastre de securitate. Iată detaliile:",
    failedFooter: "Nu a fost debitată nicio sumă. Vă rugăm să contactați serviciul clienți.",

    pendingSubj: "Transferul dumneavoastră App Pay este în așteptare pentru validare",
    pendingGreet: "Stimate/Stimată {name},",
    pendingIntro: "Transferul dumneavoastră a fost înregistrat și este în așteptarea validării de către serviciul nostru administrativ.",
    pendingFooter: "Veți primi o notificare imediat ce transferul va fi procesat.",

    validatedSubj: "Transfer validat de administrație",
    validatedGreet: "Stimate/Stimată {name},",
    validatedIntro: "Transferul dumneavoastră în așteptare a fost validat de serviciul nostru administrativ și procesat cu succes.",
    validatedFooter: "Fondurile vor fi creditate în contul beneficiarului în termen de 24 până la 48 de ore lucrătoare. Vă mulțumim pentru încredere.",

    cancelledSubj: "Transfer anulat de administrație",
    cancelledGreet: "Stimate/Stimată {name},",
    cancelledIntro: "Transferul dumneavoastră a fost anulat de serviciul nostru administrativ. Suma a fost recreditată în contul dumneavoastră.",
    cancelledFooter: "Puteți verifica noul dumneavoastră sold în portalul de clienți.",

    refundSubj: "Transfer rambursat",
    refundGreet: "Stimate/Stimată {name},",
    refundIntro: "Suma transferului dumneavoastră v-a fost rambursată. Iată detaliile:",
    refundFooter: "Suma a fost recreditată în contul dumneavoastră. Vă mulțumim pentru înțelegere.",

    userCancelledSubj: "Transfer anulat",
    userCancelledGreet: "Stimate/Stimată {name},",
    userCancelledIntro: "Vă confirmăm că transferul dumneavoastră a fost anulat. Nu a fost debitată nicio sumă.",
    userCancelledFooter: "Dacă nu ați inițiat această anulare, vă rugăm să contactați imediat serviciul nostru clienți.",

    adminConnectionSubj: "Conexiune nouă de client pe App Pay",
    adminConnectionGreet: "Bună ziua, Administrator,",
    adminConnectionIntro: "Următorul client tocmai s-a conectat la contul său App Pay. Iată detaliile:",
    adminConnectionFooter: "Acest e-mail este trimis automat administratorului de fiecare dată când un client se conectează."
},

// ═══════════════════════════════════════════════════════
// LANGUE : BULGARE (bg)
// ═══════════════════════════════════════════════════════
bg: {
    loginSubj: "Добре дошли в App Pay – Вашите данни за вход",
    loginGreet: "Уважаеми/а {name},",
    loginIntro: "С удоволствие потвърждаваме откриването на вашата сметка в App Pay. Ето вашите данни за вход:",
    loginFooter: "За вашата сигурност ви препоръчваме да пазите тази информация поверителна. Никога не споделяйте вашия PIN код.",
    
    actSubj: "Вашият код за активиране на преводите App Pay",
    actGreet: "Уважаеми/а {name},",
    actIntro: "За да гарантираме сигурността на вашите транзакции, по-долу намерете вашия личен код за активиране:",
    actFooter: "Съхранявайте този код на сигурно място. Той е строго личен и поверителен.",

    successSubj: "Потвърждение на вашия превод App Pay",
    successGreet: "Уважаеми/а {name},",
    successIntro: "Потвърждаваме, че вашият превод е обработен успешно. Ето резюме:",
    successFooter: "Средствата ще бъдат кредитирани по сметката на получателя в рамките на 24 до 48 работни часа. Благодарим ви за доверието.",

    failedSubj: "Предупреждение: Вашият превод App Pay беше блокиран",
    failedGreet: "Уважаеми/а {name},",
    failedIntro: "Опит за превод по вашата сметка беше блокиран от нашите системи за сигурност. Ето подробностите:",
    failedFooter: "Не е дебитирана сума. Моля, свържете се с обслужването на клиенти.",

    pendingSubj: "Вашият превод App Pay очаква потвърждение",
    pendingGreet: "Уважаеми/а {name},",
    pendingIntro: "Вашият превод е регистриран и в момента очаква потвърждение от нашата административна служба.",
    pendingFooter: "Ще получите известие веднага щом преводът бъде обработен.",

    validatedSubj: "Преводът е потвърден от администрацията",
    validatedGreet: "Уважаеми/а {name},",
    validatedIntro: "Вашият чакащ превод беше потвърден от нашата административна служба и обработен успешно.",
    validatedFooter: "Средствата ще бъдат кредитирани по сметката на получателя в рамките на 24 до 48 работни часа. Благодарим ви за доверието.",

    cancelledSubj: "Преводът е отменен от администрацията",
    cancelledGreet: "Уважаеми/а {name},",
    cancelledIntro: "Вашият превод беше отменен от нашата административна служба. Сумата е кредитирана отново по вашата сметка.",
    cancelledFooter: "Можете да проверите новото си салдо в клиентския портал.",

    refundSubj: "Преводът е възстановен",
    refundGreet: "Уважаеми/а {name},",
    refundIntro: "Сумата на вашия превод ви беше възстановена. Ето подробностите:",
    refundFooter: "Сумата е кредитирана отново по вашата сметка. Благодарим ви за разбирането.",

    userCancelledSubj: "Преводът е отменен",
    userCancelledGreet: "Уважаеми/а {name},",
    userCancelledIntro: "Потвърждаваме, че вашият превод беше отменен. Не е дебитирана сума от вашата сметка.",
    userCancelledFooter: "Ако не сте инициирали тази отмяна, моля, свържете се незабавно с нашето обслужване.",

    adminConnectionSubj: "Нова клиентска връзка в App Pay",
    adminConnectionGreet: "Здравейте, Администратор,",
    adminConnectionIntro: "Следният клиент току-що влезе в своя акаунт в App Pay. Ето подробностите:",
    adminConnectionFooter: "Този имейл се изпраща автоматично на администратора при всяко влизане на клиент."
},

// ═══════════════════════════════════════════════════════
// LANGUE : CROATE (hr)
// ═══════════════════════════════════════════════════════
hr: {
    loginSubj: "Dobro došli u App Pay – Vaši podaci za prijavu",
    loginGreet: "Poštovani/a {name},",
    loginIntro: "Sa zadovoljstvom potvrđujemo otvaranje vašeg računa u App Pay. Evo vaših podataka za prijavu:",
    loginFooter: "Za vašu sigurnost preporučujemo da ove podatke držite povjerljivima. Nikada nemojte dijeliti svoj PIN kod.",
    
    actSubj: "Vaš aktivacijski kod za App Pay transfere",
    actGreet: "Poštovani/a {name},",
    actIntro: "Kako biste osigurali sigurnost vaših transakcija, u nastavku pronađite svoj osobni aktivacijski kod:",
    actFooter: "Čuvajte ovaj kod na sigurnom mjestu. Strogo je osoban i povjerljiv.",

    successSubj: "Potvrda vašeg App Pay transfera",
    successGreet: "Poštovani/a {name},",
    successIntro: "Potvrđujemo da je vaš transfer uspješno obrađen. Evo sažetka:",
    successFooter: "Sredstva će biti odobrena na račun primatelja u roku od 24 do 48 radnih sati. Zahvaljujemo na povjerenju.",

    failedSubj: "Upozorenje: Vaš App Pay transfer je blokiran",
    failedGreet: "Poštovani/a {name},",
    failedIntro: "Pokušaj transfera na vašem računu blokiran je od strane naših sigurnosnih sustava. Evo detalja:",
    failedFooter: "Nijedan iznos nije zadužen. Molimo kontaktirajte korisničku podršku.",

    pendingSubj: "Vaš App Pay transfer čeka validaciju",
    pendingGreet: "Poštovani/a {name},",
    pendingIntro: "Vaš transfer je registriran i trenutno čeka validaciju naše administrativne službe.",
    pendingFooter: "Primit ćete obavijest čim transfer bude obrađen.",

    validatedSubj: "Transfer odobren od strane administracije",
    validatedGreet: "Poštovani/a {name},",
    validatedIntro: "Vaš transfer na čekanju odobren je od strane naše administrativne službe i uspješno obrađen.",
    validatedFooter: "Sredstva će biti odobrena na račun primatelja u roku od 24 do 48 radnih sati. Zahvaljujemo na povjerenju.",

    cancelledSubj: "Transfer otkazan od strane administracije",
    cancelledGreet: "Poštovani/a {name},",
    cancelledIntro: "Vaš transfer otkazan je od strane naše administrativne službe. Iznos je ponovno odobren na vaš račun.",
    cancelledFooter: "Svoj novi saldo možete provjeriti u svom klijentskom portalu.",

    refundSubj: "Transfer refundiran",
    refundGreet: "Poštovani/a {name},",
    refundIntro: "Iznos vašeg transfera vam je refundiran. Evo detalja:",
    refundFooter: "Iznos je ponovno odobren na vaš račun. Zahvaljujemo na razumijevanju.",

    userCancelledSubj: "Transfer otkazan",
    userCancelledGreet: "Poštovani/a {name},",
    userCancelledIntro: "Potvrđujemo da je vaš transfer otkazan. Nijedan iznos nije zadužen s vašeg računa.",
    userCancelledFooter: "Ako vi niste pokrenuli ovo otkazivanje, molimo odmah kontaktirajte našu korisničku podršku.",

    adminConnectionSubj: "Nova veza klijenta na App Pay",
    adminConnectionGreet: "Pozdrav Administratoru,",
    adminConnectionIntro: "Sljedeći klijent se upravo prijavio na svoj App Pay račun. Evo detalja:",
    adminConnectionFooter: "Ovaj e-mail se automatski šalje administratoru svaki put kada se klijent prijavi."
},

// ═══════════════════════════════════════════════════════
// LANGUE : SERBE (sr)
// ═══════════════════════════════════════════════════════
sr: {
    loginSubj: "Добро дошли у App Pay – Ваши подаци за пријаву",
    loginGreet: "Поштовани/а {name},",
    loginIntro: "Са задовољством потврђујемо отварање вашег рачуна у App Pay. Ево ваших података за пријаву:",
    loginFooter: "За вашу сигурност препоручујемо да ове податке држите поверљивима. Никада немојте делити свој PIN код.",
    
    actSubj: "Ваш активациони код за App Pay трансфере",
    actGreet: "Поштовани/а {name},",
    actIntro: "Како бисте осигурали сигурност ваших трансакција, у наставку пронађите свој лични активациони код:",
    actFooter: "Чувајте овај код на сигурном месту. Строго је личан и поверљив.",

    successSubj: "Потврда вашег App Pay трансфера",
    successGreet: "Поштовани/а {name},",
    successIntro: "Потврђујемо да је ваш трансфер успешно обрађен. Ево резимеа:",
    successFooter: "Средства ће бити одобрена на рачун примаоца у року од 24 до 48 радних сати. Захваљујемо на поверењу.",

    failedSubj: "Упозорење: Ваш App Pay трансфер је блокиран",
    failedGreet: "Поштовани/а {name},",
    failedIntro: "Покушај трансфера на вашем рачуну блокиран је од стране наших безбедносних система. Ево детаља:",
    failedFooter: "Ниједан износ није задужен. Молимо контактирајте корисничку подршку.",

    pendingSubj: "Ваш App Pay трансфер чека валидацију",
    pendingGreet: "Поштовани/а {name},",
    pendingIntro: "Ваш трансфер је регистрован и тренутно чека валидацију наше административне службе.",
    pendingFooter: "Примићете обавештење чим трансфер буде обрађен.",

    validatedSubj: "Трансфер одобрен од стране администрације",
    validatedGreet: "Поштовани/а {name},",
    validatedIntro: "Ваш трансфер на чекању одобрен је од стране наше административне службе и успешно обрађен.",
    validatedFooter: "Средства ће бити одобрена на рачун примаоца у року од 24 до 48 радних сати. Захваљујемо на поверењу.",

    cancelledSubj: "Трансфер отказан од стране администрације",
    cancelledGreet: "Поштовани/а {name},",
    cancelledIntro: "Ваш трансфер отказан је од стране наше административне службе. Износ је поново одобрен на ваш рачун.",
    cancelledFooter: "Свој нови салдо можете проверити у свом клијентском порталу.",

    refundSubj: "Трансфер рефундиран",
    refundGreet: "Поштовани/а {name},",
    refundIntro: "Износ вашег трансфера вам је рефундиран. Ево детаља:",
    refundFooter: "Износ је поново одобрен на ваш рачун. Захваљујемо на разумевању.",

    userCancelledSubj: "Трансфер отказан",
    userCancelledGreet: "Поштовани/а {name},",
    userCancelledIntro: "Потврђујемо да је ваш трансфер отказан. Ниједан износ није задужен са вашег рачуна.",
    userCancelledFooter: "Ако ви нисте покренули ово отказивање, молимо одмах контактирајте нашу корисничку подршку.",

    adminConnectionSubj: "Нова веза клијента на App Pay",
    adminConnectionGreet: "Поздрав Администратору,",
    adminConnectionIntro: "Следећи клијент се управо пријавио на свој App Pay рачун. Ево детаља:",
    adminConnectionFooter: "Овај е-маил се аутоматски шаље администратору сваки пут када се клијент пријави."
},

// ═══════════════════════════════════════════════════════
// LANGUE : SLOVÈNE (sl)
// ═══════════════════════════════════════════════════════
sl: {
    loginSubj: "Dobrodošli v App Pay – Vaši podatki za prijavo",
    loginGreet: "Spoštovani/a {name},",
    loginIntro: "Z veseljem potrjujemo odprtje vašega računa pri App Pay. Tukaj so vaši podatki za prijavo:",
    loginFooter: "Za vašo varnost priporočamo, da te podatke hranite zaupno. Nikoli ne delite svoje kode PIN.",
    
    actSubj: "Vaša aktivacijska koda za App Pay nakazila",
    actGreet: "Spoštovani/a {name},",
    actIntro: "Za zagotavljanje varnosti vaših transakcij v nadaljevanju najdete svojo osebno aktivacijsko kodo:",
    actFooter: "To kodo shranite na varnem mestu. Je strogo osebna in zaupna.",

    successSubj: "Potrditev vašega App Pay nakazila",
    successGreet: "Spoštovani/a {name},",
    successIntro: "Potrjujemo, da je bilo vaše nakazilo uspešno obdelano. Tukaj je povzetek:",
    successFooter: "Sredstva bodo knjižena v dobro prejemnikovega računa v 24 do 48 delovnih urah. Hvala za zaupanje.",

    failedSubj: "Opozorilo: Vaše App Pay nakazilo je bilo blokirano",
    failedGreet: "Spoštovani/a {name},",
    failedIntro: "Poskus nakazila na vaš račun je bil blokiran s strani naših varnostnih sistemov. Tukaj so podrobnosti:",
    failedFooter: "Noben znesek ni bil bremenjen. Za več informacij se obrnite na službo za pomoč strankam.",

    pendingSubj: "Vaše App Pay nakazilo čaka na preverjanje",
    pendingGreet: "Spoštovani/a {name},",
    pendingIntro: "Vaše nakazilo je bilo registrirano in trenutno čaka na preverjanje s strani naše upravne službe.",
    pendingFooter: "Obvestilo boste prejeli takoj, ko bo nakazilo obdelano.",

    validatedSubj: "Nakazilo potrjeno s strani uprave",
    validatedGreet: "Spoštovani/a {name},",
    validatedIntro: "Vaše čakajoče nakazilo je bilo potrjeno s strani naše upravne službe in uspešno obdelano.",
    validatedFooter: "Sredstva bodo knjižena v dobro prejemnikovega računa v 24 do 48 delovnih urah. Hvala za zaupanje.",

    cancelledSubj: "Nakazilo preklicano s strani uprave",
    cancelledGreet: "Spoštovani/a {name},",
    cancelledIntro: "Vaše nakazilo je bilo preklicano s strani naše upravne službe. Znesek je bil ponovno knjižen v dobro vašega računa.",
    cancelledFooter: "Svoje novo stanje lahko preverite v svojem portalu za stranke.",

    refundSubj: "Nakazilo povrnjeno",
    refundGreet: "Spoštovani/a {name},",
    refundIntro: "Znesek vašega nakazila vam je bil povrnjen. Tukaj so podrobnosti:",
    refundFooter: "Znesek je bil ponovno knjižen v dobro vašega računa. Hvala za razumevanje.",

    userCancelledSubj: "Nakazilo preklicano",
    userCancelledGreet: "Spoštovani/a {name},",
    userCancelledIntro: "Potrjujemo, da je bilo vaše nakazilo preklicano. Z vašega računa ni bil bremenjen noben znesek.",
    userCancelledFooter: "Če tega preklica niste sprožili vi, se takoj obrnite na našo službo za pomoč strankam.",

    adminConnectionSubj: "Nova povezava stranke na App Pay",
    adminConnectionGreet: "Pozdravljeni, skrbnik,",
    adminConnectionIntro: "Naslednja stranka se je pravkar prijavila v svoj App Pay račun. Tukaj so podrobnosti:",
    adminConnectionFooter: "To e-poštno sporočilo se samodejno pošlje skrbniku vsakič, ko se stranka prijavi."
},

// ═══════════════════════════════════════════════════════
// LANGUE : BOSNIAQUE (bs)
// ═══════════════════════════════════════════════════════
bs: {
    loginSubj: "Dobro došli u App Pay – Vaši podaci za prijavu",
    loginGreet: "Poštovani/a {name},",
    loginIntro: "Sa zadovoljstvom potvrđujemo otvaranje vašeg računa u App Pay. Evo vaših podataka za prijavu:",
    loginFooter: "Za vašu sigurnost preporučujemo da ove podatke držite povjerljivima. Nikada nemojte dijeliti svoj PIN kod.",
    
    actSubj: "Vaš aktivacijski kod za App Pay transfere",
    actGreet: "Poštovani/a {name},",
    actIntro: "Kako biste osigurali sigurnost vaših transakcija, u nastavku pronađite svoj lični aktivacijski kod:",
    actFooter: "Čuvajte ovaj kod na sigurnom mjestu. Strogo je lični i povjerljiv.",

    successSubj: "Potvrda vašeg App Pay transfera",
    successGreet: "Poštovani/a {name},",
    successIntro: "Potvrđujemo da je vaš transfer uspješno obrađen. Evo sažetka:",
    successFooter: "Sredstva će biti odobrena na račun primaoca u roku od 24 do 48 radnih sati. Zahvaljujemo na povjerenju.",

    failedSubj: "Upozorenje: Vaš App Pay transfer je blokiran",
    failedGreet: "Poštovani/a {name},",
    failedIntro: "Pokušaj transfera na vašem računu blokiran je od strane naših sigurnosnih sistema. Evo detalja:",
    failedFooter: "Nijedan iznos nije zadužen. Molimo kontaktirajte korisničku podršku.",

    pendingSubj: "Vaš App Pay transfer čeka validaciju",
    pendingGreet: "Poštovani/a {name},",
    pendingIntro: "Vaš transfer je registrovan i trenutno čeka validaciju naše administrativne službe.",
    pendingFooter: "Primit ćete obavijest čim transfer bude obrađen.",

    validatedSubj: "Transfer odobren od strane administracije",
    validatedGreet: "Poštovani/a {name},",
    validatedIntro: "Vaš transfer na čekanju odobren je od strane naše administrativne službe i uspješno obrađen.",
    validatedFooter: "Sredstva će biti odobrena na račun primaoca u roku od 24 do 48 radnih sati. Zahvaljujemo na povjerenju.",

    cancelledSubj: "Transfer otkazan od strane administracije",
    cancelledGreet: "Poštovani/a {name},",
    cancelledIntro: "Vaš transfer otkazan je od strane naše administrativne službe. Iznos je ponovo odobren na vaš račun.",
    cancelledFooter: "Svoj novi saldo možete provjeriti u svom klijentskom portalu.",

    refundSubj: "Transfer refundiran",
    refundGreet: "Poštovani/a {name},",
    refundIntro: "Iznos vašeg transfera vam je refundiran. Evo detalja:",
    refundFooter: "Iznos je ponovo odobren na vaš račun. Zahvaljujemo na razumijevanju.",

    userCancelledSubj: "Transfer otkazan",
    userCancelledGreet: "Poštovani/a {name},",
    userCancelledIntro: "Potvrđujemo da je vaš transfer otkazan. Nijedan iznos nije zadužen s vašeg računa.",
    userCancelledFooter: "Ako vi niste pokrenuli ovo otkazivanje, molimo odmah kontaktirajte našu korisničku podršku.",

    adminConnectionSubj: "Nova veza klijenta na App Pay",
    adminConnectionGreet: "Pozdrav Administratoru,",
    adminConnectionIntro: "Sljedeći klijent se upravo prijavio na svoj App Pay račun. Evo detalja:",
    adminConnectionFooter: "Ovaj e-mail se automatski šalje administratoru svaki put kada se klijent prijavi."
},

// ═══════════════════════════════════════════════════════
// LANGUE : ALBANAIS (sq)
// ═══════════════════════════════════════════════════════
sq: {
    loginSubj: "Mirë se vini në App Pay – Kredencialet tuaja të hyrjes",
    loginGreet: "I nderuar/I nderuara {name},",
    loginIntro: "Jemi të kënaqur të konfirmojmë hapjen e llogarisë tuaj në App Pay. Këto janë kredencialet tuaja të hyrjes:",
    loginFooter: "Për sigurinë tuaj, ju rekomandojmë të mbani këtë informacion konfidencial. Mos e ndani kurrë kodin tuaj PIN.",
    
    actSubj: "Kodi juaj i aktivizimit për transfertat App Pay",
    actGreet: "I nderuar/I nderuara {name},",
    actIntro: "Për të garantuar sigurinë e transaksioneve tuaja, ju lutemi gjeni më poshtë kodin tuaj personal të aktivizimit:",
    actFooter: "Mbajeni këtë kod në një vend të sigurt. Është rreptësisht personal dhe konfidencial.",

    successSubj: "Konfirmimi i transfertës tuaj App Pay",
    successGreet: "I nderuar/I nderuara {name},",
    successIntro: "Konfirmojmë që transferta juaj është përpunuar me sukses. Këtu është përmbledhja:",
    successFooter: "Fondet do të kreditohen në llogarinë e përfituesit brenda 24 deri në 48 orëve pune. Faleminderit për besimin tuaj.",

    failedSubj: "Alarm: Transferta juaj App Pay u bllokua",
    failedGreet: "I nderuar/I nderuara {name},",
    failedIntro: "Një përpjekje për transfertë në llogarinë tuaj u bllokua nga sistemet tona të sigurisë. Këtu janë detajet:",
    failedFooter: "Asnjë shumë nuk u debit ua. Ju lutemi kontaktoni shërbimin e klientit.",

    pendingSubj: "Transferta juaj App Pay është në pritje të vërtetimit",
    pendingGreet: "I nderuar/I nderuara {name},",
    pendingIntro: "Transferta juaj është regjistruar dhe aktualisht është në pritje të vërtetimit nga shërbimi ynë administrativ.",
    pendingFooter: "Do të merrni një njoftim sapo transferta të përpunohet.",

    validatedSubj: "Transferta u vërtetua nga administrata",
    validatedGreet: "I nderuar/I nderuara {name},",
    validatedIntro: "Transferta juaj në pritje u vërtetua nga shërbimi ynë administrativ dhe u përpunua me sukses.",
    validatedFooter: "Fondet do të kreditohen në llogarinë e përfituesit brenda 24 deri në 48 orëve pune. Faleminderit për besimin tuaj.",

    cancelledSubj: "Transferta u anulua nga administrata",
    cancelledGreet: "I nderuar/I nderuara {name},",
    cancelledIntro: "Transferta juaj u anulua nga shërbimi ynë administrativ. Shuma u rikreditua në llogarinë tuaj.",
    cancelledFooter: "Mund të kontrolloni bilancin tuaj të ri në portalin tuaj të klientit.",

    refundSubj: "Transferta u rimbursua",
    refundGreet: "I nderuar/I nderuara {name},",
    refundIntro: "Shuma e transfertës tuaj ju është rimbursuar. Këtu janë detajet:",
    refundFooter: "Shuma u rikreditua në llogarinë tuaj. Faleminderit për mirëkuptimin tuaj.",

    userCancelledSubj: "Transferta u anulua",
    userCancelledGreet: "I nderuar/I nderuara {name},",
    userCancelledIntro: "Konfirmojmë që transferta juaj u anulua. Asnjë shumë nuk u debit ua nga llogaria juaj.",
    userCancelledFooter: "Nëse nuk e keni iniciuar ju këtë anulim, ju lutemi kontaktoni menjëherë shërbimin tonë të klientit.",

    adminConnectionSubj: "Lidhje e re klienti në App Pay",
    adminConnectionGreet: "Përshëndetje Administrator,",
    adminConnectionIntro: "Klienti i mëposhtëm sapo u identifikua në llogarinë e tij App Pay. Këtu janë detajet:",
    adminConnectionFooter: "Ky email i dërgohet automatikisht administratorit sa herë që një klient identifikohet."
},
// ═══════════════════════════════════════════════════════
// LANGUE : GREC (el)
// ═══════════════════════════════════════════════════════
el: {
    loginSubj: "Καλώς ήρθατε στο App Pay – Τα διαπιστευτήρια σύνδεσής σας",
    loginGreet: "Αξιότιμε/η {name},",
    loginIntro: "Χαιρόμαστε που επιβεβαιώνουμε το άνοιγμα του λογαριασμού σας στο App Pay. Ακολουθούν τα διαπιστευτήρια σύνδεσής σας:",
    loginFooter: "Για την ασφάλειά σας, διατηρήστε αυτές τις πληροφορίες εμπιστευτικές. Μην μοιράζεστε ποτέ τον κωδικό PIN σας.",
    
    actSubj: "Ο κωδικός ενεργοποίησης για τα εμβάσματά σας στο App Pay",
    actGreet: "Αξιότιμε/η {name},",
    actIntro: "Για να διασφαλίσουμε την ασφάλεια των συναλλαγών σας, παρακαλούμε βρείτε παρακάτω τον προσωπικό σας κωδικό ενεργοποίησης:",
    actFooter: "Φυλάξτε αυτόν τον κωδικό σε ασφαλές μέρος. Είναι αυστηρά προσωπικός και εμπιστευτικός.",

    successSubj: "Επιβεβαίωση του εμβάσματός σας στο App Pay",
    successGreet: "Αξιότιμε/η {name},",
    successIntro: "Επιβεβαιώνουμε ότι το έμβασμά σας υποβλήθηκε σε επεξεργασία με επιτυχία. Ακολουθεί η σύνοψη:",
    successFooter: "Τα κεφάλαια θα πιστωθούν στον λογαριασμό του δικαιούχου εντός 24 έως 48 εργάσιμων ωρών. Ευχαριστούμε για την εμπιστοσύνη σας.",

    failedSubj: "Προειδοποίηση: Το έμβασμά σας στο App Pay αποκλείστηκε",
    failedGreet: "Αξιότιμε/η {name},",
    failedIntro: "Μια προσπάθεια εμβάσματος στον λογαριασμό σας αποκλείστηκε από τα συστήματα ασφαλείας μας. Ακολουθούν οι λεπτομέρειες:",
    failedFooter: "Κανένα ποσό δεν χρεώθηκε. Παρακαλούμε επικοινωνήστε με την εξυπηρέτηση πελατών.",

    pendingSubj: "Το έμβασμά σας στο App Pay εκκρεμεί για επικύρωση",
    pendingGreet: "Αξιότιμε/η {name},",
    pendingIntro: "Το έμβασμά σας καταχωρήθηκε και εκκρεμεί η επικύρωσή του από την υπηρεσία διαχείρισής μας.",
    pendingFooter: "Θα λάβετε ειδοποίηση μόλις το έμβασμα διεκπεραιωθεί.",

    validatedSubj: "Το έμβασμα επικυρώθηκε από τη διαχείριση",
    validatedGreet: "Αξιότιμε/η {name},",
    validatedIntro: "Το εκκρεμές έμβασμά σας επικυρώθηκε από την υπηρεσία διαχείρισής μας και διεκπεραιώθηκε με επιτυχία.",
    validatedFooter: "Τα κεφάλαια θα πιστωθούν στον λογαριασμό του δικαιούχου εντός 24 έως 48 εργάσιμων ωρών. Ευχαριστούμε για την εμπιστοσύνη σας.",

    cancelledSubj: "Το έμβασμα ακυρώθηκε από τη διαχείριση",
    cancelledGreet: "Αξιότιμε/η {name},",
    cancelledIntro: "Το έμβασμά σας ακυρώθηκε από την υπηρεσία διαχείρισής μας. Το ποσό πιστώθηκε εκ νέου στον λογαριασμό σας.",
    cancelledFooter: "Μπορείτε να ελέγξετε το νέο σας υπόλοιπο στην πύλη πελατών σας.",

    refundSubj: "Το έμβασμα επιστράφηκε",
    refundGreet: "Αξιότιμε/η {name},",
    refundIntro: "Το ποσό του εμβάσματός σας σάς επιστράφηκε. Ακολουθούν οι λεπτομέρειες:",
    refundFooter: "Το ποσό πιστώθηκε εκ νέου στον λογαριασμό σας. Ευχαριστούμε για την κατανόησή σας.",

    userCancelledSubj: "Το έμβασμα ακυρώθηκε",
    userCancelledGreet: "Αξιότιμε/η {name},",
    userCancelledIntro: "Επιβεβαιώνουμε ότι το έμβασμά σας ακυρώθηκε. Κανένα ποσό δεν χρεώθηκε από τον λογαριασμό σας.",
    userCancelledFooter: "Αν δεν ξεκινήσατε εσείς αυτήν την ακύρωση, επικοινωνήστε αμέσως με την εξυπηρέτηση πελατών μας.",

    adminConnectionSubj: "Νέα σύνδεση πελάτη στο App Pay",
    adminConnectionGreet: "Γεια σας Διαχειριστή,",
    adminConnectionIntro: "Ο ακόλουθος πελάτης συνδέθηκε πρόσφατα στον λογαριασμό του App Pay. Ακολουθούν οι λεπτομέρειες:",
    adminConnectionFooter: "Αυτό το email αποστέλλεται αυτόματα στον διαχειριστή κάθε φορά που συνδέεται ένας πελάτης."
},

// ═══════════════════════════════════════════════════════
// LANGUE : HÉBREU (he)
// ═══════════════════════════════════════════════════════
he: {
    loginSubj: "ברוכים הבאים ל-App Pay – פרטי ההתחברות שלך",
    loginGreet: "שלום {name},",
    loginIntro: "אנו שמחים לאשר את פתיחת החשבון שלך ב-App Pay. להלן פרטי ההתחברות שלך:",
    loginFooter: "למען ביטחונך, אנא שמור מידע זה חסוי. לעולם אל תשתף את קוד ה-PIN שלך.",
    
    actSubj: "קוד ההפעלה שלך להעברות App Pay",
    actGreet: "שלום {name},",
    actIntro: "כדי להבטיח את אבטחת העסקאות שלך, אנא מצא להלן את קוד ההפעלה האישי שלך:",
    actFooter: "שמור קוד זה במקום בטוח. הוא אישי וסודי לחלוטין.",

    successSubj: "אישור ההעברה שלך ב-App Pay",
    successGreet: "שלום {name},",
    successIntro: "אנו מאשרים שההעברה שלך עובדה בהצלחה. להלן סיכום הפעולה:",
    successFooter: "הכספים יזוכו לחשבון המוטב בתוך 24 עד 48 שעות עסקים. תודה על אמונך.",

    failedSubj: "אזהרה: ההעברה שלך ב-App Pay נחסמה",
    failedGreet: "שלום {name},",
    failedIntro: "ניסיון העברה בחשבונך נחסם על ידי מערכות האבטחה שלנו. להלן הפרטים:",
    failedFooter: "לא חויב סכום. אנא צור קשר עם שירות הלקוחות למידע נוסף.",

    pendingSubj: "ההעברה שלך ב-App Pay ממתינה לאימות",
    pendingGreet: "שלום {name},",
    pendingIntro: "ההעברה שלך נרשמה והיא ממתינה כעת לאימות על ידי שירות הניהול שלנו.",
    pendingFooter: "תקבל הודעה ברגע שההעברה תעובד.",

    validatedSubj: "ההעברה אושרה על ידי ההנהלה",
    validatedGreet: "שלום {name},",
    validatedIntro: "ההעברה הממתינה שלך אושרה על ידי שירות הניהול שלנו ועובדה בהצלחה.",
    validatedFooter: "הכספים יזוכו לחשבון המוטב בתוך 24 עד 48 שעות עסקים. תודה על אמונך.",

    cancelledSubj: "ההעברה בוטלה על ידי ההנהלה",
    cancelledGreet: "שלום {name},",
    cancelledIntro: "ההעברה שלך בוטלה על ידי שירות הניהול שלנו. הסכום זוכה מחדש לחשבונך.",
    cancelledFooter: "תוכל לבדוק את היתרה החדשה שלך בפורטל הלקוחות.",

    refundSubj: "ההעברה הוחזרה",
    refundGreet: "שלום {name},",
    refundIntro: "סכום ההעברה שלך הוחזר לך. להלן הפרטים:",
    refundFooter: "הסכום זוכה מחדש לחשבונך. תודה על הבנתך.",

    userCancelledSubj: "ההעברה בוטלה",
    userCancelledGreet: "שלום {name},",
    userCancelledIntro: "אנו מאשרים שההעברה שלך בוטלה. לא חויב סכום מחשבונך.",
    userCancelledFooter: "אם לא יזמת ביטול זה, אנא צור קשר עם שירות הלקוחות שלנו מיד.",

    adminConnectionSubj: "חיבור לקוח חדש ב-App Pay",
    adminConnectionGreet: "שלום מנהל,",
    adminConnectionIntro: "הלקוח הבא התחבר זה עתה לחשבון ה-App Pay שלו. להלן פרטי החיבור:",
    adminConnectionFooter: "דוא\"ל זה נשלח אוטומטית למנהל בכל פעם שלקוח מתחבר."
},

// ═══════════════════════════════════════════════════════
// LANGUE : UKRAINIEN (uk)
// ═══════════════════════════════════════════════════════
uk: {
    loginSubj: "Ласкаво просимо до App Pay – Ваші облікові дані",
    loginGreet: "Шановний(а) {name},",
    loginIntro: "Ми раді підтвердити відкриття вашого рахунку в App Pay. Ось ваші дані для входу:",
    loginFooter: "Для вашої безпеки зберігайте цю інформацію конфіденційною. Ніколи не повідомляйте свій PIN-код.",
    
    actSubj: "Ваш код активації для переказів App Pay",
    actGreet: "Шановний(а) {name},",
    actIntro: "Щоб забезпечити безпеку ваших транзакцій, нижче вказано ваш особистий код активації:",
    actFooter: "Зберігайте цей код у безпечному місці. Він є суворо особистим і конфіденційним.",

    successSubj: "Підтвердження вашого переказу App Pay",
    successGreet: "Шановний(а) {name},",
    successIntro: "Підтверджуємо, що ваш переказ успішно оброблено. Ось підсумок операції:",
    successFooter: "Кошти будуть зараховані на рахунок отримувача протягом 24–48 робочих годин. Дякуємо за довіру.",

    failedSubj: "Увага: Ваш переказ App Pay заблоковано",
    failedGreet: "Шановний(а) {name},",
    failedIntro: "Спроба переказу з вашого рахунку була заблокована нашими системами безпеки. Ось подробиці:",
    failedFooter: "Жодна сума не була списана. Зв'яжіться зі службою підтримки для отримання інформації.",

    pendingSubj: "Ваш переказ App Pay очікує підтвердження",
    pendingGreet: "Шановний(а) {name},",
    pendingIntro: "Ваш переказ зареєстровано, і він очікує перевірки нашою адміністративною службою.",
    pendingFooter: "Ви отримаєте повідомлення, щойно переказ буде оброблено.",

    validatedSubj: "Переказ підтверджено адміністрацією",
    validatedGreet: "Шановний(а) {name},",
    validatedIntro: "Ваш очікуваний переказ було підтверджено нашою адміністративною службою та успішно оброблено.",
    validatedFooter: "Кошти будуть зараховані на рахунок отримувача протягом 24–48 робочих годин. Дякуємо за довіру.",

    cancelledSubj: "Переказ скасовано адміністрацією",
    cancelledGreet: "Шановний(а) {name},",
    cancelledIntro: "Ваш переказ було скасовано нашою адміністративною службою. Суму повернено на ваш рахунок.",
    cancelledFooter: "Ви можете перевірити свій новий баланс у клієнтському порталі.",

    refundSubj: "Переказ повернено",
    refundGreet: "Шановний(а) {name},",
    refundIntro: "Суму вашого переказу було повернено вам. Ось подробиці:",
    refundFooter: "Суму повернено на ваш рахунок. Дякуємо за розуміння.",

    userCancelledSubj: "Переказ скасовано",
    userCancelledGreet: "Шановний(а) {name},",
    userCancelledIntro: "Підтверджуємо, що ваш переказ було скасовано. Жодна сума не була списана з вашого рахунку.",
    userCancelledFooter: "Якщо ви не ініціювали це скасування, негайно зв'яжіться з нашою службою підтримки.",

    adminConnectionSubj: "Нове підключення клієнта в App Pay",
    adminConnectionGreet: "Вітаю, Адміністраторе,",
    adminConnectionIntro: "Наступний клієнт щойно увійшов до свого акаунта App Pay. Ось деталі підключення:",
    adminConnectionFooter: "Цей лист автоматично надсилається адміністратору щоразу, коли клієнт входить у систему."
},

// ═══════════════════════════════════════════════════════
// LANGUE : MACÉDONIEN (mk)
// ═══════════════════════════════════════════════════════
mk: {
    loginSubj: "Добредојдовте во App Pay – Ваши податоци за најава",
    loginGreet: "Почитуван/а {name},",
    loginIntro: "Со задоволство потврдуваме отворање на вашата сметка во App Pay. Еве ги вашите податоци за најава:",
    loginFooter: "За ваша безбедност, чувајте ги овие информации доверливи. Никогаш не го споделувајте вашиот PIN код.",
    
    actSubj: "Вашиот код за активација за трансфери App Pay",
    actGreet: "Почитуван/а {name},",
    actIntro: "За да ја осигураме безбедноста на вашите трансакции, ве молиме најдете го вашиот личен код за активација подолу:",
    actFooter: "Чувајте го овој код на безбедно место. Тој е строго личен и доверлив.",

    successSubj: "Потврда за вашиот трансфер App Pay",
    successGreet: "Почитуван/а {name},",
    successIntro: "Потврдуваме дека вашиот трансфер е успешно обработен. Еве го резимето:",
    successFooter: "Средствата ќе бидат одобрени на сметката на примачот во рок од 24 до 48 работни часови. Ви благодариме за довербата.",

    failedSubj: "Предупредување: Вашиот трансфер App Pay е блокиран",
    failedGreet: "Почитуван/а {name},",
    failedIntro: "Обид за трансфер на вашата сметка беше блокиран од нашите безбедносни системи. Еве ги деталите:",
    failedFooter: "Ниту еден износ не е задолжен. Ве молиме контактирајте ја корисничката поддршка.",

    pendingSubj: "Вашиот трансфер App Pay чека валидација",
    pendingGreet: "Почитуван/а {name},",
    pendingIntro: "Вашиот трансфер е регистриран и моментално чека валидација од нашата административна служба.",
    pendingFooter: "Ќе добиете известување штом трансферот биде обработен.",

    validatedSubj: "Трансферот е одобрен од администрацијата",
    validatedGreet: "Почитуван/а {name},",
    validatedIntro: "Вашиот трансфер што чекаше е одобрен од нашата административна служба и успешно обработен.",
    validatedFooter: "Средствата ќе бидат одобрени на сметката на примачот во рок од 24 до 48 работни часови. Ви благодариме за довербата.",

    cancelledSubj: "Трансферот е откажан од администрацијата",
    cancelledGreet: "Почитуван/а {name},",
    cancelledIntro: "Вашиот трансфер е откажан од нашата административна служба. Износот е повторно одобрен на вашата сметка.",
    cancelledFooter: "Можете да го проверите вашето ново салдо во клиентскиот портал.",

    refundSubj: "Трансферот е вратен",
    refundGreet: "Почитуван/а {name},",
    refundIntro: "Износот на вашиот трансфер ви е вратен. Еве ги деталите:",
    refundFooter: "Износот е повторно одобрен на вашата сметка. Ви благодариме за разбирањето.",

    userCancelledSubj: "Трансферот е откажан",
    userCancelledGreet: "Почитуван/а {name},",
    userCancelledIntro: "Потврдуваме дека вашиот трансфер е откажан. Ниту еден износ не е задолжен од вашата сметка.",
    userCancelledFooter: "Ако вие не го инициравте ова откажување, ве молиме веднаш контактирајте ја нашата корисничка поддршка.",

    adminConnectionSubj: "Нова врска со клиент на App Pay",
    adminConnectionGreet: "Здраво Администраторе,",
    adminConnectionIntro: "Следниот клиент штотуку се најави на својата сметка на App Pay. Еве ги деталите:",
    adminConnectionFooter: "Оваа е-пошта автоматски се испраќа до администраторот секој пат кога клиент ќе се најави."
},

// ═══════════════════════════════════════════════════════
// LANGUE : MALTAIS (mt)
// ═══════════════════════════════════════════════════════
mt: {
    loginSubj: "Merħba f'App Pay – Il-kredenzjali tal-login tiegħek",
    loginGreet: "Għażiż/a {name},",
    loginIntro: "Aħna kuntenti li nikkonfermaw il-ftuħ tal-kont tiegħek f'App Pay. Hawn huma l-kredenzjali tal-login tiegħek:",
    loginFooter: "Għas-sigurtà tiegħek, żomm din l-informazzjoni kunfidenzjali. Qatt taqsam il-kodiċi PIN tiegħek.",
    
    actSubj: "Il-kodiċi tal-attivazzjoni tiegħek għat-trasferimenti ta' App Pay",
    actGreet: "Għażiż/a {name},",
    actIntro: "Biex niżguraw is-sigurtà tat-transazzjonijiet tiegħek, jekk jogħġbok sib il-kodiċi tal-attivazzjoni personali tiegħek hawn taħt:",
    actFooter: "Żomm dan il-kodiċi f'post sigur. Huwa strettament personali u kunfidenzjali.",

    successSubj: "Konferma tat-trasferiment tiegħek ta' App Pay",
    successGreet: "Għażiż/a {name},",
    successIntro: "Nikkonfermaw li t-trasferiment tiegħek ġie pproċessat b'suċċess. Hawn hu s-sommarju:",
    successFooter: "Il-fondi se jiġu kkreditati fil-kont tal-benefiċjarju fi żmien 24 sa 48 siegħa tax-xogħol. Grazzi tal-fiduċja tiegħek.",

    failedSubj: "Twissija: It-trasferiment tiegħek ta' App Pay ġie mblukkat",
    failedGreet: "Għażiż/a {name},",
    failedIntro: "Tentattiv ta' trasferiment fil-kont tiegħek ġie mblukkat mis-sistemi tas-sigurtà tagħna. Hawn huma d-dettalji:",
    failedFooter: "L-ebda ammont ma ġie debit at. Jekk jogħġbok ikkuntattja lill-klijent service għal aktar informazzjoni.",

    pendingSubj: "It-trasferiment tiegħek ta' App Pay qed jistenna l-validazzjoni",
    pendingGreet: "Għażiż/a {name},",
    pendingIntro: "It-trasferiment tiegħek ġie rreġistrat u bħalissa qed jistenna l-validazzjoni mis-servizz amministrattiv tagħna.",
    pendingFooter: "Se tirċievi notifika hekk kif it-trasferiment jiġi pproċessat.",

    validatedSubj: "Trasferiment ivvalidat mill-amministrazzjoni",
    validatedGreet: "Għażiż/a {name},",
    validatedIntro: "It-trasferiment pendenti tiegħek ġie vvalidat mis-servizz amministrattiv tagħna u pproċessat b'suċċess.",
    validatedFooter: "Il-fondi se jiġu kkreditati fil-kont tal-benefiċjarju fi żmien 24 sa 48 siegħa tax-xogħol. Grazzi tal-fiduċja tiegħek.",

    cancelledSubj: "Trasferiment ikkanċellat mill-amministrazzjoni",
    cancelledGreet: "Għażiż/a {name},",
    cancelledIntro: "It-trasferiment tiegħek ġie kkanċellat mis-servizz amministrattiv tagħna. L-ammont ġie rrikreditat fil-kont tiegħek.",
    cancelledFooter: "Tista' tivverifika l-bilanċ il-ġdid tiegħek fil-portal tal-klijent tiegħek.",

    refundSubj: "Trasferiment rimborsat",
    refundGreet: "Għażiż/a {name},",
    refundIntro: "L-ammont tat-trasferiment tiegħek ġie rrimborsat lilek. Hawn huma d-dettalji:",
    refundFooter: "L-ammont ġie rrikreditat fil-kont tiegħek. Grazzi tal-fehim tiegħek.",

    userCancelledSubj: "Trasferiment ikkanċellat",
    userCancelledGreet: "Għażiż/a {name},",
    userCancelledIntro: "Nikkonfermaw li t-trasferiment tiegħek ġie kkanċellat. L-ebda ammont ma ġie debit at mill-kont tiegħek.",
    userCancelledFooter: "Jekk int ma bdejtx dan il-kanċellament, jekk jogħġbok ikkuntattja lill-klijent service tagħna immedjatament.",

    adminConnectionSubj: "Konnessjoni ġdida ta' klijent fuq App Pay",
    adminConnectionGreet: "Bongu Amministratur,",
    adminConnectionIntro: "Il-klijent li ġej għadu kemm illoggja fil-kont tiegħu ta' App Pay. Hawn huma d-dettalji tal-konnessjoni:",
    adminConnectionFooter: "Dan l-email jintbagħat awtomatikament lill-amministratur kull darba li klijent jilloggja."
},

// ═══════════════════════════════════════════════════════
// LANGUE : ISLANDAIS (is)
// ═══════════════════════════════════════════════════════
is: {
    loginSubj: "Velkomin í App Pay – Innskráningarupplýsingar þínar",
    loginGreet: "Kæri/Kæra {name},",
    loginIntro: "Við erum ánægð að staðfesta opnun reikningsins þíns hjá App Pay. Hér eru innskráningarupplýsingarnar þínar:",
    loginFooter: "Fyrir öryggi þitt mælum við með að halda þessum upplýsingum trúnaði. Deildu aldrei PIN-kóðanum þínum.",
    
    actSubj: "Virkjunarkóðinn þinn fyrir App Pay millifærslur",
    actGreet: "Kæri/Kæra {name},",
    actIntro: "Til að tryggja öryggi viðskipta þinna, vinsamlegast sjáðu persónulega virkjunarkóðann þinn hér að neðan:",
    actFooter: "Geymdu þennan kóða á öruggum stað. Hann er stranglega persónulegur og trúnaðarmál.",

    successSubj: "Staðfesting á App Pay millifærslunni þinni",
    successGreet: "Kæri/Kæra {name},",
    successIntro: "Við staðfestum að millifærslan þín hefur verið unnin með góðum árangri. Hér er samantektin:",
    successFooter: "Fjármunirnir verða lagðir inn á reikning viðtakandans innan 24 til 48 bankadaga. Takk fyrir traustið.",

    failedSubj: "Viðvörun: App Pay millifærslan þín var lokuð",
    failedGreet: "Kæri/Kæra {name},",
    failedIntro: "Tilraun til millifærslu á reikninginn þinn var lokuð af öryggiskerfum okkar. Hér eru upplýsingarnar:",
    failedFooter: "Ekkert upphæð var dregin. Vinsamlegast hafðu samband við þjónustuver.",

    pendingSubj: "App Pay millifærslan þín bíður staðfestingar",
    pendingGreet: "Kæri/Kæra {name},",
    pendingIntro: "Millifærslan þín hefur verið skráð og bíður nú staðfestingar frá stjórnsýsluþjónustu okkar.",
    pendingFooter: "Þú munt fá tilkynningu um leið og millifærslan hefur verið unnin.",

    validatedSubj: "Millifærsla staðfest af stjórnendum",
    validatedGreet: "Kæri/Kæra {name},",
    validatedIntro: "Millifærslan þín í bið hefur verið staðfest af stjórnsýsluþjónustu okkar og unnin með góðum árangri.",
    validatedFooter: "Fjármunirnir verða lagðir inn á reikning viðtakandans innan 24 til 48 bankadaga. Takk fyrir traustið.",

    cancelledSubj: "Millifærsla afturkölluð af stjórnendum",
    cancelledGreet: "Kæri/Kæra {name},",
    cancelledIntro: "Millifærslan þín hefur verið afturkölluð af stjórnsýsluþjónustu okkar. Upphæðin hefur verið lögð aftur inn á reikninginn þinn.",
    cancelledFooter: "Þú getur athugað nýja stöðu þína í viðskiptavinagáttinni þinni.",

    refundSubj: "Millifærsla endurgreidd",
    refundGreet: "Kæri/Kæra {name},",
    refundIntro: "Upphæð millifærslunnar þinnar hefur verið endurgreidd til þín. Hér eru upplýsingarnar:",
    refundFooter: "Upphæðin hefur verið lögð aftur inn á reikninginn þinn. Takk fyrir skilninginn.",

    userCancelledSubj: "Millifærsla afturkölluð",
    userCancelledGreet: "Kæri/Kæra {name},",
    userCancelledIntro: "Við staðfestum að millifærslan þín hefur verið afturkölluð. Ekkert upphæð var dregin af reikningnum þínum.",
    userCancelledFooter: "Ef þú hófst ekki þessa afturköllun, vinsamlegast hafðu strax samband við þjónustuver okkar.",

    adminConnectionSubj: "Ný tenging viðskiptavinar á App Pay",
    adminConnectionGreet: "Halló Stjórnandi,",
    adminConnectionIntro: "Eftirfarandi viðskiptavinur skráði sig rétt í þessu inn á App Pay reikninginn sinn. Hér eru upplýsingar um tenginguna:",
    adminConnectionFooter: "Þetta tölvupóstur er sjálfkrafa sent til stjórnandans í hvert skipti sem viðskiptavinur skráir sig inn."
},

// ═══════════════════════════════════════════════════════
// LANGUE : IRLANDAIS (ga)
// ═══════════════════════════════════════════════════════
ga: {
    loginSubj: "Fáilte go App Pay – Do dhintiúir logála isteach",
    loginGreet: "A {name},",
    loginIntro: "Tá áthas orainn oscailt do chuntais le App Pay a dheimhniú. Seo iad do dhintiúir logála isteach:",
    loginFooter: "Ar mhaithe le do shlándáil, coinnigh an fhaisnéis seo faoi rún. Ná roinn do chód PIN le duine ar bith.",
    
    actSubj: "Do chód gníomhachtaithe d'aistrithe App Pay",
    actGreet: "A {name},",
    actIntro: "Chun slándáil do n-idirbheart a chinntiú, féach do chód gníomhachtaithe pearsanta thíos:",
    actFooter: "Coinnigh an cód seo in áit shábháilte. Tá sé go hiomlán pearsanta agus rúnda.",

    successSubj: "Deimhniú d'aistriú App Pay",
    successGreet: "A {name},",
    successIntro: "Deimhnímid gur próiseáladh d'aistriú go rathúil. Seo achoimre ar an idirbheart:",
    successFooter: "Cuirfear na cistí chun sochair chuntas an tairbhí laistigh de 24 go 48 uair an chloig oibre. Go raibh maith agat as do mhuinín.",

    failedSubj: "Rabhadh: Cuireadh bac ar d'aistriú App Pay",
    failedGreet: "A {name},",
    failedIntro: "Chuir ár gcórais slándála bac ar iarracht aistrithe ar do chuntas. Seo na sonraí:",
    failedFooter: "Níor déanadh aon mhéid a dhíochúiteamh. Déan teagmháil le seirbhís do chustaiméirí le haghaidh tuilleadh eolais.",

    pendingSubj: "Tá d'aistriú App Pay ar feitheamh bailíochtaithe",
    pendingGreet: "A {name},",
    pendingIntro: "Tá d'aistriú cláraithe agus tá sé ar feitheamh bailíochtaithe ag ár seirbhís riaracháin.",
    pendingFooter: "Gheobhaidh tú fógra chomh luath agus a phróiseálfar an t-aistriú.",

    validatedSubj: "Aistriú bailíochtaithe ag an riarachán",
    validatedGreet: "A {name},",
    validatedIntro: "Tá d'aistriú atá ar feitheamh bailíochtaithe ag ár seirbhís riaracháin agus próiseáilte go rathúil.",
    validatedFooter: "Cuirfear na cistí chun sochair chuntas an tairbhí laistigh de 24 go 48 uair an chloig oibre. Go raibh maith agat as do mhuinín.",

    cancelledSubj: "Aistriú cealaithe ag an riarachán",
    cancelledGreet: "A {name},",
    cancelledIntro: "Tá d'aistriú cealaithe ag ár seirbhís riaracháin. Tá an méid curtha chun sochair do chuntas arís.",
    cancelledFooter: "Is féidir leat d'iarmhéid nua a sheiceáil i do thairseach chliant.",

    refundSubj: "Aistriú aisíoctha",
    refundGreet: "A {name},",
    refundIntro: "Tá méid d'aistriú aisíoctha chugat. Seo na sonraí:",
    refundFooter: "Tá an méid curtha chun sochair do chuntas arís. Go raibh maith agat as do thuiscint.",

    userCancelledSubj: "Aistriú cealaithe",
    userCancelledGreet: "A {name},",
    userCancelledIntro: "Deimhnímid gur cealaíodh d'aistriú. Níor díochúiteamh aon mhéid ó do chuntas.",
    userCancelledFooter: "Mura tusa a chuir tús leis an gcealú seo, déan teagmháil lenár seirbhís chustaiméirí láithreach.",

    adminConnectionSubj: "Nasc cliant nua ar App Pay",
    adminConnectionGreet: "Dia duit a Riarthóir,",
    adminConnectionIntro: "Logáil an cliant seo a leanas isteach ina chuntas App Pay díreach anois. Seo na sonraí naisc:",
    adminConnectionFooter: "Seoltar an ríomhphost seo go huathoibríoch chuig an riarthóir gach uair a logálann cliant isteach."
},

// ═══════════════════════════════════════════════════════
// LANGUE : GALLOIS (cy)
// ═══════════════════════════════════════════════════════
cy: {
    loginSubj: "Croeso i App Pay – Eich manylion mewngofnodi",
    loginGreet: "Annwyl {name},",
    loginIntro: "Rydym yn falch o gadarnhau agor eich cyfrif gyda App Pay. Dyma eich manylion mewngofnodi:",
    loginFooter: "Er eich diogelwch, cadwch y wybodaeth hon yn gyfrinachol. Peidiwch byth â rhannu eich cod PIN.",
    
    actSubj: "Eich cod actifadu ar gyfer trosglwyddiadau App Pay",
    actGreet: "Annwyl {name},",
    actIntro: "I sicrhau diogelwch eich trafodion, gwelwch eich cod actifadu personol isod:",
    actFooter: "Cadwch y cod hwn mewn man diogel. Mae'n gwbl bersonol a chyfrinachol.",

    successSubj: "Cadarnhad o'ch trosglwyddiad App Pay",
    successGreet: "Annwyl {name},",
    successIntro: "Rydym yn cadarnhau bod eich trosglwyddiad wedi'i brosesu'n llwyddiannus. Dyma'r crynodeb:",
    successFooter: "Bydd yr arian yn cael ei gredydu i gyfrif y buddiolwr o fewn 24 i 48 awr waith. Diolch am eich ymddiriedaeth.",

    failedSubj: "Rhybudd: Rhwystrwyd eich trosglwyddiad App Pay",
    failedGreet: "Annwyl {name},",
    failedIntro: "Rhwystrwyd ymgais i drosglwyddo ar eich cyfrif gan ein systemau diogelwch. Dyma'r manylion:",
    failedFooter: "Ni chodwyd unrhyw swm. Cysylltwch â'r gwasanaeth cwsmeriaid am ragor o wybodaeth.",

    pendingSubj: "Mae eich trosglwyddiad App Pay yn aros am ddilysu",
    pendingGreet: "Annwyl {name},",
    pendingIntro: "Mae eich trosglwyddiad wedi'i gofrestru ac mae'n aros am ddilysu gan ein gwasanaeth gweinyddol.",
    pendingFooter: "Byddwch yn derbyn hysbysiad cyn gynted ag y bydd y trosglwyddiad wedi'i brosesu.",

    validatedSubj: "Trosglwyddiad wedi'i ddilysu gan y weinyddiaeth",
    validatedGreet: "Annwyl {name},",
    validatedIntro: "Mae eich trosglwyddiad sy'n aros wedi'i ddilysu gan ein gwasanaeth gweinyddol ac wedi'i brosesu'n llwyddiannus.",
    validatedFooter: "Bydd yr arian yn cael ei gredydu i gyfrif y buddiolwr o fewn 24 i 48 awr waith. Diolch am eich ymddiriedaeth.",

    cancelledSubj: "Trosglwyddiad wedi'i ganslo gan y weinyddiaeth",
    cancelledGreet: "Annwyl {name},",
    cancelledIntro: "Mae eich trosglwyddiad wedi'i ganslo gan ein gwasanaeth gweinyddol. Mae'r swm wedi'i ail-gredydu i'ch cyfrif.",
    cancelledFooter: "Gallwch wirio eich balans newydd yn eich porth cleient.",

    refundSubj: "Trosglwyddiad wedi'i ad-dalu",
    refundGreet: "Annwyl {name},",
    refundIntro: "Mae swm eich trosglwyddiad wedi'i ad-dalu i chi. Dyma'r manylion:",
    refundFooter: "Mae'r swm wedi'i ail-gredydu i'ch cyfrif. Diolch am eich dealltwriaeth.",

    userCancelledSubj: "Trosglwyddiad wedi'i ganslo",
    userCancelledGreet: "Annwyl {name},",
    userCancelledIntro: "Rydym yn cadarnhau bod eich trosglwyddiad wedi'i ganslo. Ni chodwyd unrhyw swm o'ch cyfrif.",
    userCancelledFooter: "Os nad chi a gychwynnodd y canslo hwn, cysylltwch â'n gwasanaeth cwsmeriaid ar unwaith.",

    adminConnectionSubj: "Cysylltiad cleient newydd ar App Pay",
    adminConnectionGreet: "Helo Gweinyddwr,",
    adminConnectionIntro: "Mewngofnododd y cleient canlynol i'w gyfrif App Pay ychydig funudau'n ôl. Dyma'r manylion:",
    adminConnectionFooter: "Anfonir yr e-bost hwn yn awtomatig at y gweinyddwr bob tro y bydd cleient yn mewngofnodi."
},

// ═══════════════════════════════════════════════════════
// LANGUE : AFRIKAANS (af)
// ═══════════════════════════════════════════════════════
af: {
    loginSubj: "Welkom by App Pay – Jou aanmeldingsbesonderhede",
    loginGreet: "Beste {name},",
    loginIntro: "Ons is verheug om die opening van jou rekening by App Pay te bevestig. Hier is jou aanmeldingsbesonderhede:",
    loginFooter: "Vir jou veiligheid, hou hierdie inligting vertroulik. Moet nooit jou PIN-kode deel nie.",
    
    actSubj: "Jou aktiveringskode vir App Pay-oordragte",
    actGreet: "Beste {name},",
    actIntro: "Om die veiligheid van jou transaksies te verseker, vind asseblief jou persoonlike aktiveringskode hieronder:",
    actFooter: "Hou hierdie kode op 'n veilige plek. Dit is streng persoonlik en vertroulik.",

    successSubj: "Bevestiging van jou App Pay-oordrag",
    successGreet: "Beste {name},",
    successIntro: "Ons bevestig dat jou oordrag suksesvol verwerk is. Hier is die opsomming:",
    successFooter: "Die fondse sal binne 24 tot 48 werksure in die begunstigde se rekening gekrediteer word. Dankie vir jou vertroue.",

    failedSubj: "Waarskuwing: Jou App Pay-oordrag is geblokkeer",
    failedGreet: "Beste {name},",
    failedIntro: "'n Oordragpoging op jou rekening is deur ons sekuriteitstelsels geblokkeer. Hier is die besonderhede:",
    failedFooter: "Geen bedrag is gedebiteer nie. Kontak asseblief kliëntediens vir meer inligting.",

    pendingSubj: "Jou App Pay-oordrag wag op validering",
    pendingGreet: "Beste {name},",
    pendingIntro: "Jou oordrag is geregistreer en wag tans op validering deur ons administratiewe diens.",
    pendingFooter: "Jy sal 'n kennisgewing ontvang sodra die oordrag verwerk is.",

    validatedSubj: "Oordrag gevalideer deur administrasie",
    validatedGreet: "Beste {name},",
    validatedIntro: "Jou hangende oordrag is deur ons administratiewe diens gevalideer en suksesvol verwerk.",
    validatedFooter: "Die fondse sal binne 24 tot 48 werksure in die begunstigde se rekening gekrediteer word. Dankie vir jou vertroue.",

    cancelledSubj: "Oordrag gekanselleer deur administrasie",
    cancelledGreet: "Beste {name},",
    cancelledIntro: "Jou oordrag is deur ons administratiewe diens gekanselleer. Die bedrag is weer in jou rekening gekrediteer.",
    cancelledFooter: "Jy kan jou nuwe balans in jou kliëntportaal nagaan.",

    refundSubj: "Oordrag terugbetaal",
    refundGreet: "Beste {name},",
    refundIntro: "Die bedrag van jou oordrag is aan jou terugbetaal. Hier is die besonderhede:",
    refundFooter: "Die bedrag is weer in jou rekening gekrediteer. Dankie vir jou begrip.",

    userCancelledSubj: "Oordrag gekanselleer",
    userCancelledGreet: "Beste {name},",
    userCancelledIntro: "Ons bevestig dat jou oordrag gekanselleer is. Geen bedrag is van jou rekening gedebiteer nie.",
    userCancelledFooter: "As jy nie hierdie kansellasie geïnisieer het nie, kontak asseblief ons kliëntediens onmiddellik.",

    adminConnectionSubj: "Nuwe kliëntverbinding op App Pay",
    adminConnectionGreet: "Hallo Administrateur,",
    adminConnectionIntro: "Die volgende kliënt het pas by sy App Pay-rekening aangemeld. Hier is die besonderhede:",
    adminConnectionFooter: "Hierdie e-pos word outomaties aan die administrateur gestuur elke keer wanneer 'n kliënt aanmeld."
},

// ═══════════════════════════════════════════════════════
// LANGUE : ZOULOU (zu)
// ═══════════════════════════════════════════════════════
zu: {
    loginSubj: "Wamukelekile ku-App Pay – Imininingwane yakho yokungena",
    loginGreet: "Othandekayo {name},",
    loginIntro: "Sijabule ukukuqinisekisa ukuvulwa kwe-akhawunti yakho ku-App Pay. Nayi imininingwane yakho yokungena:",
    loginFooter: "Ngokuphepha kwakho, gcina lolu lwazi luyimfihlo. Ungalokothi wabelane ngekhodi yakho ye-PIN nanoma ubani.",
    
    actSubj: "Ikhodi yakho yokusebenza yokudlulisa ku-App Pay",
    actGreet: "Othandekayo {name},",
    actIntro: "Ukuqinisekisa ukuphepha kwezokuhweba kwakho, sicela uthole ikhodi yakho yokusebenza yomuntu siqu ngezansi:",
    actFooter: "Gcina le khodi endaweni ephephile. Ingena ngokuphelele futhi iyimfihlo.",

    successSubj: "Ukuqinisekiswa kokudlulisa kwakho ku-App Pay",
    successGreet: "Othandekayo {name},",
    successIntro: "Siqinisekisa ukuthi ukudlulisa kwakho kucutshungulwe ngempumelelo. Nakhu ukufingqa:",
    successFooter: "Izimali zizokwengezwa ku-akhawunti yomamukeli phakathi kwamahora angu-24 kuya kwangu-48 okusebenza. Siyabonga ngokuthemba kwakho.",

    failedSubj: "Isexwayiso: Ukudlulisa kwakho ku-App Pay kuvinjelwe",
    failedGreet: "Othandekayo {name},",
    failedIntro: "Umzamo wokudlulisa ku-akhawunti yakho uvinjelwe izinhlelo zethu zokuphepha. Nansi imininingwane:",
    failedFooter: "Akukho mali ekhishiwe. Sicela uxhumane nesevisi yamakhasimende ukuze uthole ulwazi olwengeziwe.",

    pendingSubj: "Ukudlulisa kwakho ku-App Pay kulindele ukuqinisekiswa",
    pendingGreet: "Othandekayo {name},",
    pendingIntro: "Ukudlulisa kwakho kubhalisiwe futhi okwamanje kulindele ukuqinisekiswa yisevisi yethu yokuphatha.",
    pendingFooter: "Uzothola isaziso ngokushesha uma ukudlulisa sekucutshungulwe.",

    validatedSubj: "Ukudlulisa kuqinisekisiwe ngabaphathi",
    validatedGreet: "Othandekayo {name},",
    validatedIntro: "Ukudlulisa kwakho obekulindile kuqinisekisiwe yisevisi yethu yokuphatha futhi kwacutshungulwa ngempumelelo.",
    validatedFooter: "Izimali zizokwengezwa ku-akhawunti yomamukeli phakathi kwamahora angu-24 kuya kwangu-48 okusebenza. Siyabonga ngokuthemba kwakho.",

    cancelledSubj: "Ukudlulisa kukhanseliwe ngabaphathi",
    cancelledGreet: "Othandekayo {name},",
    cancelledIntro: "Ukudlulisa kwakho kukhanseliwe yisevisi yethu yokuphatha. Inani lifakwe kabusha ku-akhawunti yakho.",
    cancelledFooter: "Ungabheka ibhalansi yakho entsha kuphothali yakho yeklayenti.",

    refundSubj: "Ukudlulisa kubuyiselwe",
    refundGreet: "Othandekayo {name},",
    refundIntro: "Inani lokudlulisa kwakho libuyiselwe kuwe. Nansi imininingwane:",
    refundFooter: "Inani lifakwe kabusha ku-akhawunti yakho. Siyabonga ngokuqonda kwakho.",

    userCancelledSubj: "Ukudlulisa kukhanseliwe",
    userCancelledGreet: "Othandekayo {name},",
    userCancelledIntro: "Siqinisekisa ukuthi ukudlulisa kwakho kukhanseliwe. Akukho mali ekhishiwe ku-akhawunti yakho.",
    userCancelledFooter: "Uma kunguwe ongaqalanga lokhu kukhansela, sicela uxhumane nesevisi yethu yamakhasimende ngokushesha.",

    adminConnectionSubj: "Ukuxhumana okusha kweklayenti ku-App Pay",
    adminConnectionGreet: "Sawubona Administrator,",
    adminConnectionIntro: "Iklayenti elilandelayo lisanda kungena ku-akhawunti yalo ye-App Pay. Nansi imininingwane yokuxhumana:",
    adminConnectionFooter: "Le imeyili ithunyelwa ngokuzenzekelayo kumlawuli njalo lapho iklayenti lingena."
},
// ═══════════════════════════════════════════════════════
// LANGUE : AMHARIQUE (am)
// ═══════════════════════════════════════════════════════
am: {
    loginSubj: "እንኳን ወደ App Pay በደህና መጡ – የመግቢያ ማረጋገጫዎችዎ",
    loginGreet: "ውድ {name}፣",
    loginIntro: "በApp Pay የእርስዎ አካውንት መከፈቱን በማረጋገጥ ደስተኞች ነን። እነሆ የመግቢያ ማረጋገጫዎችዎ፡",
    loginFooter: "ለደህንነትዎ ይህንን መረጃ ሚስጥራዊ ያድርጉት። የPIN ኮድዎን ለማንም አያጋሩ።",
    
    actSubj: "ለApp Pay ዝውውሮችዎ የማነቃቂያ ኮድዎ",
    actGreet: "ውድ {name}፣",
    actIntro: "የግብይቶችዎን ደህንነት ለማረጋገጥ፣ እባክዎ የግል ማነቃቂያ ኮድዎን ከዚህ በታች ይመልከቱ፡",
    actFooter: "ይህንን ኮድ ደህንነቱ በተጠበቀ ቦታ ያስቀምጡ። ሙሉ በሙሉ የግል እና ሚስጥራዊ ነው።",

    successSubj: "የApp Pay ዝውውርዎ ማረጋገጫ",
    successGreet: "ውድ {name}፣",
    successIntro: "ዝውውርዎ በተሳካ ሁኔታ መከናወኑን እናረጋግጣለን። እነሆ ማጠቃለያው፡",
    successFooter: "ገንዘቡ በ24 እስከ 48 የስራ ሰዓታት ውስጥ ወደ ተጠቃሚው ሂሳብ ይገባል። ስለ እምነትዎ እናመሰግናለን።",

    failedSubj: "ማስጠንቀቂያ፡ የApp Pay ዝውውርዎ ተዘግቷል",
    failedGreet: "ውድ {name}፣",
    failedIntro: "በሂሳብዎ ላይ የተደረገ የዝውውር ሙከራ በደህንነት ስርዓታችን ተዘግቷል። እነሆ ዝርዝሩ፡",
    failedFooter: "ምንም መጠን አልተቀነሰም። ለተጨማሪ መረጃ እባክዎ የደንበኞች አገልግሎትን ያግኙ።",

    pendingSubj: "የApp Pay ዝውውርዎ ማረጋገጫ በመጠባበቅ ላይ ነው",
    pendingGreet: "ውድ {name}፣",
    pendingIntro: "ዝውውርዎ ተመዝግቧል እና በአሁኑ ጊዜ በአስተዳደር አገልግሎታችን ማረጋገጫ በመጠባበቅ ላይ ነው።",
    pendingFooter: "ዝውውሩ እንደተጠናቀቀ ማሳወቂያ ይደርስዎታል።",

    validatedSubj: "ዝውውር በአስተዳደሩ ተረጋግጧል",
    validatedGreet: "ውድ {name}፣",
    validatedIntro: "በመጠባበቅ ላይ የነበረው ዝውውርዎ በአስተዳደር አገልግሎታችን ተረጋግጦ በተሳካ ሁኔታ ተጠናቅቋል።",
    validatedFooter: "ገንዘቡ በ24 እስከ 48 የስራ ሰዓታት ውስጥ ወደ ተጠቃሚው ሂሳብ ይገባል። ስለ እምነትዎ እናመሰግናለን።",

    cancelledSubj: "ዝውውር በአስተዳደሩ ተሰርዟል",
    cancelledGreet: "ውድ {name}፣",
    cancelledIntro: "ዝውውርዎ በአስተዳደር አገልግሎታችን ተሰርዟል። መጠኑ ወደ ሂሳብዎ እንደገና ገብቷል።",
    cancelledFooter: "አዲሱን ቀሪ ሂሳብዎን በደንበኛ ፖርታልዎ ማረጋገጥ ይችላሉ።",

    refundSubj: "ዝውውር ተመላሽ ተደርጓል",
    refundGreet: "ውድ {name}፣",
    refundIntro: "የዝውውርዎ መጠን ለእርስዎ ተመላሽ መደረጉን እናሳውቅዎታለን። እነሆ ዝርዝሩ፡",
    refundFooter: "መጠኑ ወደ ሂሳብዎ እንደገና ገብቷል። ስለ መረዳትዎ እናመሰግናለን።",

    userCancelledSubj: "ዝውውር ተሰርዟል",
    userCancelledGreet: "ውድ {name}፣",
    userCancelledIntro: "ዝውውርዎ መሰረዙን እናረጋግጣለን። ከሂሳብዎ ምንም መጠን አልተቀነሰም።",
    userCancelledFooter: "ይህንን ስረዛ ያልጀመሩት እርስዎ ካልሆኑ፣ እባክዎ ወዲያውኑ የደንበኞች አገልግሎታችንን ያግኙ።",

    adminConnectionSubj: "አዲስ የደንበኛ ግንኙነት በApp Pay",
    adminConnectionGreet: "ሰላም አስተዳዳሪ፣",
    adminConnectionIntro: "የሚከተለው ደንበኛ አሁን ወደ App Pay አካውንቱ ገብቷል። እነሆ የግንኙነቱ ዝርዝር፡",
    adminConnectionFooter: "ይህ ኢሜይል ደንበኛ በሚገባ ቁጥር ለአስተዳዳሪው በራስ-ሰር ይላካል።"
},

// ═══════════════════════════════════════════════════════
// LANGUE : HAOUSSA (ha)
// ═══════════════════════════════════════════════════════
ha: {
    loginSubj: "Barka da zuwa App Pay – Bayanan shigarka",
    loginGreet: "Masoyi {name},",
    loginIntro: "Muna farin cikin tabbatar da buɗe asusunka a App Pay. Ga bayanan shigarka:",
    loginFooter: "Don amincinka, ka riƙe wannan bayanin a asirce. Kada ka taɓa raba lambar PIN ɗinka da kowa.",
    
    actSubj: "Lambar kunnawa don canja wurin App Pay",
    actGreet: "Masoyi {name},",
    actIntro: "Don tabbatar da amincin ma'amalolinka, da fatan za a sami lambar kunnawa ta sirri a ƙasa:",
    actFooter: "Ajiye wannan lambar a wuri mai aminci. Ita ce ta sirri kuma ta asirce.",

    successSubj: "Tabbatar da canja wurin App Pay",
    successGreet: "Masoyi {name},",
    successIntro: "Muna tabbatar da cewa an aiwatar da canja wurinka cikin nasara. Ga taƙaitawa:",
    successFooter: "Za a saka kuɗin a asusun mai karɓa cikin awanni 24 zuwa 48 na aiki. Na gode da amincewarka.",

    failedSubj: "Faɗakarwa: An toshe canja wurin App Pay",
    failedGreet: "Masoyi {name},",
    failedIntro: "An toshe yunƙurin canja wuri a asusunka ta tsarin tsaron mu. Ga cikakkun bayanai:",
    failedFooter: "Ba a cire wani adadi ba. Da fatan za a tuntuɓi sabis ɗin abokin ciniki don ƙarin bayani.",

    pendingSubj: "Canja wurin App Pay yana jiran tabbatarwa",
    pendingGreet: "Masoyi {name},",
    pendingIntro: "An yi rijistar canja wurinka kuma yana jiran tabbatarwa daga sashin gudanarwa na mu.",
    pendingFooter: "Za ka sami sanarwa da zarar an aiwatar da canja wurin.",

    validatedSubj: "An tabbatar da canja wuri daga gudanarwa",
    validatedGreet: "Masoyi {name},",
    validatedIntro: "An tabbatar da canja wurinka da ke jira daga sashin gudanarwa na mu kuma an aiwatar da shi cikin nasara.",
    validatedFooter: "Za a saka kuɗin a asusun mai karɓa cikin awanni 24 zuwa 48 na aiki. Na gode da amincewarka.",

    cancelledSubj: "An soke canja wuri daga gudanarwa",
    cancelledGreet: "Masoyi {name},",
    cancelledIntro: "An soke canja wurinka daga sashin gudanarwa na mu. An mayar da adadin zuwa asusunka.",
    cancelledFooter: "Kana iya duba sabon ma'auninka a cikin tashar abokin ciniki.",

    refundSubj: "An mayar da kuɗin canja wuri",
    refundGreet: "Masoyi {name},",
    refundIntro: "An mayar da adadin canja wurinka gare ka. Ga cikakkun bayanai:",
    refundFooter: "An mayar da adadin zuwa asusunka. Na gode da fahimtarka.",

    userCancelledSubj: "An soke canja wuri",
    userCancelledGreet: "Masoyi {name},",
    userCancelledIntro: "Muna tabbatar da cewa an soke canja wurinka. Ba a cire wani adadi daga asusunka ba.",
    userCancelledFooter: "Idan ba kai ne ka fara wannan sokewar ba, da fatan za a tuntuɓi sabis ɗin abokin ciniki nan take.",

    adminConnectionSubj: "Sabuwar hanyar haɗi ta abokin ciniki a App Pay",
    adminConnectionGreet: "Sannu Mai Gudanarwa,",
    adminConnectionIntro: "Abokin ciniki mai zuwa ya shiga asusunsa na App Pay. Ga cikakkun bayanan haɗin:",
    adminConnectionFooter: "Ana aika wannan imel ɗin kai tsaye ga mai gudanarwa duk lokacin da abokin ciniki ya shiga."
},

// ═══════════════════════════════════════════════════════
// LANGUE : YORUBA (yo)
// ═══════════════════════════════════════════════════════
yo: {
    loginSubj: "Káàbọ̀ sí App Pay – Àwọn ìwé-ẹ̀rí ìwọlé rẹ",
    loginGreet: "Olólùfẹ́ {name},",
    loginIntro: "Inú wa dùn láti jẹ́rìí sí ṣíṣí àkọọ́lẹ̀ rẹ ní App Pay. Èyí ni àwọn ìwé-ẹ̀rí ìwọlé rẹ:",
    loginFooter: "Fún ààbò rẹ, jọ̀wọ́ pa àlàyé yìí mọ́ ní àṣírí. Má ṣe pín kóòdù PIN rẹ pẹ̀lú ẹnikẹ́ni.",
    
    actSubj: "Kóòdù ìṣílẹ̀ rẹ fún àwọn ìfiránṣẹ́ App Pay",
    actGreet: "Olólùfẹ́ {name},",
    actIntro: "Láti rí i dájú ààbò àwọn ìgbésẹ̀ rẹ, jọ̀wọ́ rí kóòdù ìṣílẹ̀ àdáni rẹ nísàlẹ̀:",
    actFooter: "Fi kóòdù yìí pamọ́ sí ibi ààbò. Ó jẹ́ ti ara ẹni pátápátá àti àṣírí.",

    successSubj: "Ìjẹ́rìí ìfiránṣẹ́ App Pay rẹ",
    successGreet: "Olólùfẹ́ {name},",
    successIntro: "A jẹ́rìí sí i pé a ti ṣe ìfiránṣẹ́ rẹ ní àṣeyọrí. Èyí ni àkópọ̀:",
    successFooter: "A óò fi owó náà sínú àkọọ́lẹ̀ olùgbà láàárín wákàtí 24 sí 48 iṣẹ́. Ẹ ṣé fún ìgbẹ́kẹ̀lé yín.",

    failedSubj: "Ìkìlọ̀: A ti dí ìfiránṣẹ́ App Pay rẹ lọ́nà",
    failedGreet: "Olólùfẹ́ {name},",
    failedIntro: "A fún ọ létòótọ́ pé àwọn ètò ààbò wa ti dí ìgbìyànjú ìfiránṣẹ́ kan lórí àkọọ́lẹ̀ rẹ lọ́nà. Èyí ni àwọn àlàyé:",
    failedFooter: "A kò gbẹ́ owó kankan. Jọ̀wọ́ kàn sí iṣẹ́ àbójútó ọ̀rẹ́ fún àlàyé síi.",

    pendingSubj: "Ìfiránṣẹ́ App Pay rẹ ń dúró de ìjẹ́rìí",
    pendingGreet: "Olólùfẹ́ {name},",
    pendingIntro: "A ti forúkọsílẹ̀ ìfiránṣẹ́ rẹ, ó sì ń dúró de ìjẹ́rìí láti ọ̀dọ̀ iṣẹ́ ìṣàkóso wa.",
    pendingFooter: "Ìwọ yóò gba ìkìlọ̀ ní kété tí a bá ti ṣe ìfiránṣẹ́ náà.",

    validatedSubj: "A ti jẹ́rìí ìfiránṣẹ́ nípasẹ̀ ìṣàkóso",
    validatedGreet: "Olólùfẹ́ {name},",
    validatedIntro: "A ti jẹ́rìí ìfiránṣẹ́ rẹ tí ó ń dúró nípasẹ̀ iṣẹ́ ìṣàkóso wa, a sì ti ṣe é ní àṣeyọrí.",
    validatedFooter: "A óò fi owó náà sínú àkọọ́lẹ̀ olùgbà láàárín wákàtí 24 sí 48 iṣẹ́. Ẹ ṣé fún ìgbẹ́kẹ̀lé yín.",

    cancelledSubj: "A ti fagi lé ìfiránṣẹ́ nípasẹ̀ ìṣàkóso",
    cancelledGreet: "Olólùfẹ́ {name},",
    cancelledIntro: "A ti fagi lé ìfiránṣẹ́ rẹ nípasẹ̀ iṣẹ́ ìṣàkóso wa. A ti dá owó náà padà sínú àkọọ́lẹ̀ rẹ.",
    cancelledFooter: "O lè yẹ ìdọ̀gba tuntun rẹ wò nínú ẹ̀báti ọ̀rẹ́ rẹ.",

    refundSubj: "A ti dá owó ìfiránṣẹ́ padà",
    refundGreet: "Olólùfẹ́ {name},",
    refundIntro: "A fún ọ létòótọ́ pé a ti dá owó ìfiránṣẹ́ rẹ padà fún ọ. Èyí ni àwọn àlàyé:",
    refundFooter: "A ti dá owó náà padà sínú àkọọ́lẹ̀ rẹ. Ẹ ṣé fún òye yín.",

    userCancelledSubj: "A ti fagi lé ìfiránṣẹ́",
    userCancelledGreet: "Olólùfẹ́ {name},",
    userCancelledIntro: "A jẹ́rìí sí i pé a ti fagi lé ìfiránṣẹ́ rẹ. A kò gbẹ́ owó kankan láti inú àkọọ́lẹ̀ rẹ.",
    userCancelledFooter: "Bí kì í bá ṣe ìwọ ló bẹ̀rẹ̀ ìfagilé yìí, jọ̀wọ́ kàn sí iṣẹ́ àbójútó ọ̀rẹ́ wa lẹ́sẹ̀kẹsẹ̀.",

    adminConnectionSubj: "Ìsopọ̀ ọ̀rẹ́ tuntun lórí App Pay",
    adminConnectionGreet: "Báwo Olùdarí,",
    adminConnectionIntro: "Ọ̀rẹ́ tó tẹ̀le yìí ṣẹ̀ṣẹ̀ wọlé sí àkọọ́lẹ̀ App Pay rẹ̀. Èyí ni àwọn àlàyé ìsopọ̀:",
    adminConnectionFooter: "A máa ń fi í-meèlì yìí ránṣẹ́ sí olùdarí ní àkọ́kọ́ nígbà gbogbo tí ọ̀rẹ́ bá wọlé."
},

// ═══════════════════════════════════════════════════════
// LANGUE : IGBO (ig)
// ═══════════════════════════════════════════════════════
ig: {
    loginSubj: "Nnọọ na App Pay – Njirimara nbanye gị",
    loginGreet: "Onye ọ hụrụ n'anya {name},",
    loginIntro: "Anyị nwere obi ụtọ ikwupụta na emeghere gị akaụntụ na App Pay. Nke a bụ njirimara nbanye gị:",
    loginFooter: "Maka nchekwa gị, debe ozi a na nzuzo. Ekwela ka onye ọ bụla mara koodu PIN gị.",
    
    actSubj: "Koodu ntinye gị maka nnyefe App Pay",
    actGreet: "Onye ọ hụrụ n'anya {name},",
    actIntro: "Iji hụ na nchekwa azụmahịa gị, biko lee koodu ntinye nkeonwe gị n'okpuru:",
    actFooter: "Debe koodu a ebe nchekwa. Ọ bụ naanị nkeonwe yana nzuzo.",

    successSubj: "Nkwenye nnyefe App Pay gị",
    successGreet: "Onye ọ hụrụ n'anya {name},",
    successIntro: "Anyị na-akwado na ahaziri nnyefe gị nke ọma. Nke a bụ nchịkọta:",
    successFooter: "A ga-etinye ego ahụ na akaụntụ onye nnata n'ime awa 24 ruo 48 azụmahịa. Daalụ maka ntụkwasị obi gị.",

    failedSubj: "Ịdọ aka ná ntị: Egbochiri nnyefe App Pay gị",
    failedGreet: "Onye ọ hụrụ n'anya {name},",
    failedIntro: "Usoro nchekwa anyị egbochila mbọ nnyefe na akaụntụ gị. Nke a bụ nkọwa:",
    failedFooter: "Enweghị ego ewepụtara. Biko kpọtụrụ ndị ọrụ ahịa maka ozi ndị ọzọ.",

    pendingSubj: "Nnyefe App Pay gị na-echere nkwenye",
    pendingGreet: "Onye ọ hụrụ n'anya {name},",
    pendingIntro: "Edebara nnyefe gị, ọ na-echere nkwenye site n'aka ngalaba nhazi anyị.",
    pendingFooter: "Ị ga-enweta ọkwa ozugbo ahaziri nnyefe ahụ.",

    validatedSubj: "Nnyefe akwadoro site n'aka ndị nchịkwa",
    validatedGreet: "Onye ọ hụrụ n'anya {name},",
    validatedIntro: "Ngalaba nhazi anyị akwadola nnyefe gị na-echere ma hazie ya nke ọma.",
    validatedFooter: "A ga-etinye ego ahụ na akaụntụ onye nnata n'ime awa 24 ruo 48 azụmahịa. Daalụ maka ntụkwasị obi gị.",

    cancelledSubj: "Nnyefe kagburu site n'aka ndị nchịkwa",
    cancelledGreet: "Onye ọ hụrụ n'anya {name},",
    cancelledIntro: "Ngalaba nhazi anyị kagburu nnyefe gị. E weghachiri ego ahụ na akaụntụ gị.",
    cancelledFooter: "Ị nwere ike lelee nguzozi ọhụrụ gị na ọnụ ụzọ ahịa gị.",

    refundSubj: "Nnyefe eweghachiri",
    refundGreet: "Onye ọ hụrụ n'anya {name},",
    refundIntro: "E weghachiri gị ego nnyefe gị. Nke a bụ nkọwa:",
    refundFooter: "E weghachiri ego ahụ na akaụntụ gị. Daalụ maka nghọta gị.",

    userCancelledSubj: "Nnyefe kagburu",
    userCancelledGreet: "Onye ọ hụrụ n'anya {name},",
    userCancelledIntro: "Anyị na-akwado na akagburu nnyefe gị. Enweghị ego ewepụtara na akaụntụ gị.",
    userCancelledFooter: "Ọ bụrụ na ọ bụghị gị bidoro mkagbu a, biko kpọtụrụ ndị ọrụ ahịa anyị ozugbo.",

    adminConnectionSubj: "Njikọ onye ahịa ọhụrụ na App Pay",
    adminConnectionGreet: "Ndeewo Onye Nchịkwa,",
    adminConnectionIntro: "Onye ahịa na-esote abanyela na akaụntụ App Pay ya. Nke a bụ nkọwa njikọ:",
    adminConnectionFooter: "A na-eziga email a na-akpaghị aka nye onye nchịkwa oge ọ bụla onye ahịa banyere."
},

// ═══════════════════════════════════════════════════════
// LANGUE : WOLOF (wo)
// ═══════════════════════════════════════════════════════
wo: {
    loginSubj: "Dalal ak jàmm ci App Pay – Say xibaar yu jëm ci duggu",
    loginGreet: "Sama xarit {name},",
    loginIntro: "Nungi bég ci wàll gi ñu ubbe sa kont ci App Pay. Ñooñu say xibaar yu jëm ci duggu:",
    loginFooter: "Ngir sa kaaraange, denc xibaar yii ci sekke. Bul baña kenn sa kood PIN.",
    
    actSubj: "Sa kood u ubbe ngir yónnee xaalis App Pay",
    actGreet: "Sama xarit {name},",
    actIntro: "Ngir wàllu kaaraange sa yónnee, jërëjëf xool sa kood u ubbe bu bopp ci suuf:",
    actFooter: "Denc kood bii ci barab bu wóor. Moom du ku bopp rekk te sekke.",

    successSubj: "Dëggal sa yónnee App Pay",
    successGreet: "Sama xarit {name},",
    successIntro: "Nungi dëggal ne sa yónnee dox na ba baax. Lii mooy ndoorte:",
    successFooter: "Xaalis bi dina ñëw ci kont u jotaale bi ci 24 ba 48 waxtu liggéey. Jërëjëf ci sa yaakaar.",

    failedSubj: "Màndarga: Sa yónnee App Pay ñu tëj na ko",
    failedGreet: "Sama xarit {name},",
    failedIntro: "Sunu sistemu kaaraange tëj na jëf bu ñu jéem ci sa kont. Lii mooy ndoorte:",
    failedFooter: "Amul xaalis bu ñu jël. Jërëjëf jokkoo ak sarwiis kiliyaan bi ngir yeneen xibaar.",

    pendingSubj: "Sa yónnee App Pay mungi xaar dëggal",
    pendingGreet: "Sama xarit {name},",
    pendingIntro: "Sa yónnee ñu bind na ko, te léegi mu ngi xaar dëggal ci loxo sunu sarwiis admin.",
    pendingFooter: "Dina ñëw sa màndarga bu gaaw bu ñu doxal yónnee bi.",

    validatedSubj: "Yónnee ñu dëggal na ko ci loxo admin",
    validatedGreet: "Sama xarit {name},",
    validatedIntro: "Sa yónnee bu xaaroon ñu dëggal na ko ci loxo sunu sarwiis admin te dox na ba baax.",
    validatedFooter: "Xaalis bi dina ñëw ci kont u jotaale bi ci 24 ba 48 waxtu liggéey. Jërëjëf ci sa yaakaar.",

    cancelledSubj: "Yónnee ñu neenal na ko ci loxo admin",
    cancelledGreet: "Sama xarit {name},",
    cancelledIntro: "Sa yónnee ñu neenal na ko ci loxo sunu sarwiis admin. Xaalis bi ñu delloo na ko ci sa kont.",
    cancelledFooter: "Man nga xool sa balans bu bees ci sa portal kiliyaan.",

    refundSubj: "Yónnee ñu delloo na xaalis bi",
    refundGreet: "Sama xarit {name},",
    refundIntro: "Xaalis u sa yónnee ñu delloo na ko la. Lii mooy ndoorte:",
    refundFooter: "Xaalis bi ñu delloo na ko ci sa kont. Jërëjëf ci sa fàttali.",

    userCancelledSubj: "Yónnee ñu neenal na ko",
    userCancelledGreet: "Sama xarit {name},",
    userCancelledIntro: "Nungi dëggal ne sa yónnee ñu neenal na ko. Amul xaalis bu ñu jël ci sa kont.",
    userCancelledFooter: "Su fekkee ne du yaw la tàmbaliyal neenal bii, jërëjëf jokkoo ak sunu sarwiis kiliyaan léegi.",

    adminConnectionSubj: "Jokkoo bu bees bu kiliyaan ci App Pay",
    adminConnectionGreet: "Salaam Admin,",
    adminConnectionIntro: "Kiliyaan bii ci topp duggu na léegi ci sa kont App Pay. Lii mooy ndoorte jokkoo bi:",
    adminConnectionFooter: "Bii email dees koy yónnee boppam ci admin bu kiliyaan dugge."
},

// ═══════════════════════════════════════════════════════
// LANGUE : SWAHILI (sw)
// ═══════════════════════════════════════════════════════
sw: {
    loginSubj: "Karibu App Pay – Vitambulisho vyako vya kuingia",
    loginGreet: "Mpendwa {name},",
    loginIntro: "Tuna furaha kuthibitisha kufunguliwa kwa akaunti yako katika App Pay. Hivi hapa ni vitambulisho vyako vya kuingia:",
    loginFooter: "Kwa usalama wako, tafadhali weka habari hii kwa siri. Usishiriki msimbo wako wa PIN na mtu yeyote.",
    
    actSubj: "Msimbo wako wa kuwezesha kwa uhamisho wa App Pay",
    actGreet: "Mpendwa {name},",
    actIntro: "Ili kuhakikisha usalama wa miamala yako, tafadhali pata msimbo wako wa kuwezesha binafsi hapa chini:",
    actFooter: "Weka msimbo huu mahali salama. Ni wa kibinafsi na wa siri kabisa.",

    successSubj: "Uthibitisho wa uhamisho wako wa App Pay",
    successGreet: "Mpendwa {name},",
    successIntro: "Tunathibitisha kuwa uhamisho wako umefanikiwa kushughulikiwa. Hapa kuna muhtasari:",
    successFooter: "Fedha zitawekwa kwenye akaunti ya mnufaika ndani ya masaa 24 hadi 48 ya kazi. Asante kwa imani yako.",

    failedSubj: "Tahadhari: Uhamisho wako wa App Pay umezuiwa",
    failedGreet: "Mpendwa {name},",
    failedIntro: "Jaribio la uhamisho kwenye akaunti yako limesimamishwa na mifumo yetu ya usalama. Hapa kuna maelezo:",
    failedFooter: "Hakuna kiasi kilichotolewa. Tafadhali wasiliana na huduma kwa wateja kwa maelezo zaidi.",

    pendingSubj: "Uhamisho wako wa App Pay unasubiri uthibitisho",
    pendingGreet: "Mpendwa {name},",
    pendingIntro: "Uhamisho wako umesajiliwa na kwa sasa unasubiri uthibitisho kutoka kwa huduma yetu ya utawala.",
    pendingFooter: "Utapokea arifa mara tu uhamisho utakaposhughulikiwa.",

    validatedSubj: "Uhamisho umethibitishwa na utawala",
    validatedGreet: "Mpendwa {name},",
    validatedIntro: "Uhamisho wako uliosubiri umethibitishwa na huduma yetu ya utawala na kushughulikiwa kwa mafanikio.",
    validatedFooter: "Fedha zitawekwa kwenye akaunti ya mnufaika ndani ya masaa 24 hadi 48 ya kazi. Asante kwa imani yako.",

    cancelledSubj: "Uhamisho umefutwa na utawala",
    cancelledGreet: "Mpendwa {name},",
    cancelledIntro: "Uhamisho wako umefutwa na huduma yetu ya utawala. Kiasi hicho kimerudishwa kwenye akaunti yako.",
    cancelledFooter: "Unaweza kuangalia salio lako jipya kwenye tovuti yako ya mteja.",

    refundSubj: "Uhamisho umerudishwa",
    refundGreet: "Mpendwa {name},",
    refundIntro: "Kiasi cha uhamisho wako kimerudishwa kwako. Hapa kuna maelezo:",
    refundFooter: "Kiasi hicho kimerudishwa kwenye akaunti yako. Asante kwa uelewa wako.",

    userCancelledSubj: "Uhamisho umefutwa",
    userCancelledGreet: "Mpendwa {name},",
    userCancelledIntro: "Tunathibitisha kuwa uhamisho wako umefutwa. Hakuna kiasi kilichotolewa kwenye akaunti yako.",
    userCancelledFooter: "Ikiwa wewe si uliyeanzisha ufutaji huu, tafadhali wasiliana na huduma yetu kwa wateja mara moja.",

    adminConnectionSubj: "Muunganisho mpya wa mteja kwenye App Pay",
    adminConnectionGreet: "Habari Msimamizi,",
    adminConnectionIntro: "Mteja anayefuata ameingia tu kwenye akaunti yake ya App Pay. Hapa kuna maelezo ya muunganisho:",
    adminConnectionFooter: "Barua pepe hii inatumwa kiotomatiki kwa msimamizi kila mteja anapoingia."
},

// ═══════════════════════════════════════════════════════
// LANGUE : XHOSA (xh)
// ═══════════════════════════════════════════════════════
xh: {
    loginSubj: "Wamkelekile kwi-App Pay – Iinkcukacha zakho zokungena",
    loginGreet: "Othandekayo {name},",
    loginIntro: "Siyavuya ukuqinisekisa ukuvulwa kwe-akhawunti yakho kwi-App Pay. Nazi iinkcukacha zakho zokungena:",
    loginFooter: "Ngenxa yokhuseleko lwakho, gcina olu lwazi luyimfihlo. Ungaze wabelane ngekhowudi yakho ye-PIN nomntu.",
    
    actSubj: "Ikhowudi yakho yokuvula yokudlulisa kwi-App Pay",
    actGreet: "Othandekayo {name},",
    actIntro: "Ukuqinisekisa ukhuseleko lwentengiselwano yakho, nceda ufumane ikhowudi yakho yokuvula yobuqu apha ngezantsi:",
    actFooter: "Gcina le khowudi kwindawo ekhuselekileyo. Yeyobuqu ngokungqongqo kwaye iyimfihlo.",

    successSubj: "Ukuqinisekiswa kokudlulisa kwakho kwi-App Pay",
    successGreet: "Othandekayo {name},",
    successIntro: "Siqinisekisa ukuba ukudlulisa kwakho kuqhutywe ngempumelelo. Nantsi isishwankathelo:",
    successFooter: "Imali iya kufakwa kwi-akhawunti yomamkeli kwiiyure ezingama-24 ukuya kwangama-48 zokusebenza. Enkosi ngokuthemba kwakho.",

    failedSubj: "Isilumkiso: Ukudlulisa kwakho kwi-App Pay kuvaliwe",
    failedGreet: "Othandekayo {name},",
    failedIntro: "Umzamo wokudlulisa kwi-akhawunti yakho uvaliwe ziinkqubo zethu zokhuseleko. Nazi iinkcukacha:",
    failedFooter: "Akukho mali itsaliweyo. Nceda uqhagamshelane nenkonzo yabathengi ukufumana ulwazi oluthe kratya.",

    pendingSubj: "Ukudlulisa kwakho kwi-App Pay kulindele ukuqinisekiswa",
    pendingGreet: "Othandekayo {name},",
    pendingIntro: "Ukudlulisa kwakho kubhalisiwe kwaye ngoku kulindele ukuqinisekiswa yinkonzo yethu yolawulo.",
    pendingFooter: "Uya kufumana isaziso ngokukhawuleza nje ukuba ukudlulisa kuqhutyiwe.",

    validatedSubj: "Ukudlulisa kuqinisekisiwe ngabalawuli",
    validatedGreet: "Othandekayo {name},",
    validatedIntro: "Ukudlulisa kwakho obekulindile kuqinisekisiwe yinkonzo yethu yolawulo kwaye kwaqhutywa ngempumelelo.",
    validatedFooter: "Imali iya kufakwa kwi-akhawunti yomamkeli kwiiyure ezingama-24 ukuya kwangama-48 zokusebenza. Enkosi ngokuthemba kwakho.",

    cancelledSubj: "Ukudlulisa kurhoxisiwe ngabalawuli",
    cancelledGreet: "Othandekayo {name},",
    cancelledIntro: "Ukudlulisa kwakho kurhoxisiwe yinkonzo yethu yolawulo. Isixa semali sibuyiselwe kwi-akhawunti yakho.",
    cancelledFooter: "Ungajonga ibhalansi yakho entsha kwipothali yakho yomthengi.",

    refundSubj: "Ukudlulisa kubuyiselwe",
    refundGreet: "Othandekayo {name},",
    refundIntro: "Isixa sokudlulisa kwakho sibuyiselwe kuwe. Nazi iinkcukacha:",
    refundFooter: "Isixa semali sibuyiselwe kwi-akhawunti yakho. Enkosi ngokuqonda kwakho.",

    userCancelledSubj: "Ukudlulisa kurhoxisiwe",
    userCancelledGreet: "Othandekayo {name},",
    userCancelledIntro: "Siqinisekisa ukuba ukudlulisa kwakho kurhoxisiwe. Akukho mali itsaliweyo kwi-akhawunti yakho.",
    userCancelledFooter: "Ukuba asinguwe oqalise oku kurhoxiswa, nceda uqhagamshelane nenkonzo yethu yabathengi ngokukhawuleza.",

    adminConnectionSubj: "Uqhagamshelwano olutsha lomthengi kwi-App Pay",
    adminConnectionGreet: "Molo Mlawuli,",
    adminConnectionIntro: "Umthengi olandelayo ungenile kwiiyure nje ezimbalwa kwi-akhawunti yakhe ye-App Pay. Nazi iinkcukacha zoqhagamshelwano:",
    adminConnectionFooter: "Le imeyili ithunyelwa ngokuzenzekelayo kumlawuli ngalo lonke ixesha umthengi engena."
},

// ═══════════════════════════════════════════════════════
// LANGUE : HINDI (hi)
// ═══════════════════════════════════════════════════════
hi: {
    loginSubj: "App Pay में आपका स्वागत है – आपके लॉगिन क्रेडेंशियल",
    loginGreet: "प्रिय {name},",
    loginIntro: "हमें App Pay में आपका खाता खोलने की पुष्टि करते हुए खुशी हो रही है। यहाँ आपके लॉगिन क्रेडेंशियल हैं:",
    loginFooter: "आपकी सुरक्षा के लिए, इस जानकारी को गोपनीय रखें। अपना PIN कोड कभी किसी के साथ साझा न करें।",
    
    actSubj: "App Pay स्थानांतरण के लिए आपका सक्रियण कोड",
    actGreet: "प्रिय {name},",
    actIntro: "आपके लेन-देन की सुरक्षा सुनिश्चित करने के लिए, कृपया नीचे अपना व्यक्तिगत सक्रियण कोड देखें:",
    actFooter: "इस कोड को सुरक्षित स्थान पर रखें। यह पूरी तरह से व्यक्तिगत और गोपनीय है।",

    successSubj: "आपके App Pay स्थानांतरण की पुष्टि",
    successGreet: "प्रिय {name},",
    successIntro: "हम पुष्टि करते हैं कि आपका स्थानांतरण सफलतापूर्वक संसाधित हो गया है। यहाँ सारांश है:",
    successFooter: "धनराशि 24 से 48 कार्य घंटों के भीतर लाभार्थी के खाते में जमा कर दी जाएगी। आपके भरोसे के लिए धन्यवाद।",

    failedSubj: "चेतावनी: आपका App Pay स्थानांतरण अवरुद्ध कर दिया गया",
    failedGreet: "प्रिय {name},",
    failedIntro: "आपके खाते पर एक स्थानांतरण प्रयास हमारे सुरक्षा प्रणालियों द्वारा अवरुद्ध कर दिया गया था। यहाँ विवरण हैं:",
    failedFooter: "कोई राशि डेबिट नहीं की गई। अधिक जानकारी के लिए कृपया ग्राहक सेवा से संपर्क करें।",

    pendingSubj: "आपका App Pay स्थानांतरण सत्यापन की प्रतीक्षा में है",
    pendingGreet: "प्रिय {name},",
    pendingIntro: "आपका स्थानांतरण पंजीकृत हो गया है और वर्तमान में हमारी प्रशासनिक सेवा द्वारा सत्यापन की प्रतीक्षा कर रहा है।",
    pendingFooter: "स्थानांतरण संसाधित होते ही आपको एक अधिसूचना प्राप्त होगी।",

    validatedSubj: "प्रशासन द्वारा स्थानांतरण सत्यापित किया गया",
    validatedGreet: "प्रिय {name},",
    validatedIntro: "आपके लंबित स्थानांतरण को हमारी प्रशासनिक सेवा द्वारा सत्यापित कर लिया गया है और सफलतापूर्वक संसाधित कर दिया गया है।",
    validatedFooter: "धनराशि 24 से 48 कार्य घंटों के भीतर लाभार्थी के खाते में जमा कर दी जाएगी। आपके भरोसे के लिए धन्यवाद।",

    cancelledSubj: "प्रशासन द्वारा स्थानांतरण रद्द कर दिया गया",
    cancelledGreet: "प्रिय {name},",
    cancelledIntro: "आपके स्थानांतरण को हमारी प्रशासनिक सेवा द्वारा रद्द कर दिया गया है। राशि आपके खाते में दोबारा जमा कर दी गई है।",
    cancelledFooter: "आप अपना नया बैलेंस अपने क्लाइंट पोर्टल में देख सकते हैं।",

    refundSubj: "स्थानांतरण रिफंड किया गया",
    refundGreet: "प्रिय {name},",
    refundIntro: "आपके स्थानांतरण की राशि आपको रिफंड कर दी गई है। यहाँ विवरण हैं:",
    refundFooter: "राशि आपके खाते में दोबारा जमा कर दी गई है। आपकी समझ के लिए धन्यवाद।",

    userCancelledSubj: "स्थानांतरण रद्द किया गया",
    userCancelledGreet: "प्रिय {name},",
    userCancelledIntro: "हम पुष्टि करते हैं कि आपका स्थानांतरण रद्द कर दिया गया है। आपके खाते से कोई राशि डेबिट नहीं की गई है।",
    userCancelledGreet: "यदि आपने यह रद्दीकरण शुरू नहीं किया है, तो कृपया तुरंत हमारी ग्राहक सेवा से संपर्क करें।",

    adminConnectionSubj: "App Pay पर नया क्लाइंट कनेक्शन",
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
    loginIntro: "আমরা App Pay-তে আপনার অ্যাকাউন্ট খোলার বিষয়টি নিশ্চিত করতে পেরে আনন্দিত। এখানে আপনার লগইন শংসাপত্র রয়েছে:",
    loginFooter: "আপনার নিরাপত্তার জন্য, এই তথ্যটি গোপন রাখুন। আপনার PIN কোড কারও সাথে শেয়ার করবেন না।",
    
    actSubj: "App Pay স্থানান্তরের জন্য আপনার সক্রিয়করণ কোড",
    actGreet: "প্রিয় {name},",
    actIntro: "আপনার লেনদেনের নিরাপত্তা নিশ্চিত করতে, অনুগ্রহ করে নীচে আপনার ব্যক্তিগত সক্রিয়করণ কোডটি দেখুন:",
    actFooter: "এই কোডটি নিরাপদ স্থানে রাখুন। এটি কঠোরভাবে ব্যক্তিগত এবং গোপনীয়।",

    successSubj: "আপনার App Pay স্থানান্তরের নিশ্চিতকরণ",
    successGreet: "প্রিয় {name},",
    successIntro: "আমরা নিশ্চিত করছি যে আপনার স্থানান্তর সফলভাবে প্রক্রিয়া করা হয়েছে। এখানে সারাংশ:",
    successFooter: "তহবিল 24 থেকে 48 কর্মঘণ্টার মধ্যে প্রাপকের অ্যাকাউন্টে জমা হবে। আপনার বিশ্বাসের জন্য ধন্যবাদ।",

    failedSubj: "সতর্কতা: আপনার App Pay স্থানান্তর অবরুদ্ধ করা হয়েছে",
    failedGreet: "প্রিয় {name},",
    failedIntro: "আপনার অ্যাকাউন্টে একটি স্থানান্তরের চেষ্টা আমাদের নিরাপত্তা সিস্টেম দ্বারা অবরুদ্ধ করা হয়েছে। এখানে বিশদ রয়েছে:",
    failedFooter: "কোনও পরিমাণ ডেবিট করা হয়নি। আরও তথ্যের জন্য গ্রাহক পরিষেবার সাথে যোগাযোগ করুন।",

    pendingSubj: "আপনার App Pay স্থানান্তর যাচাইয়ের অপেক্ষায় রয়েছে",
    pendingGreet: "প্রিয় {name},",
    pendingIntro: "আপনার স্থানান্তর নিবন্ধিত হয়েছে এবং বর্তমানে আমাদের প্রশাসনিক পরিষেবা দ্বারা যাচাইয়ের অপেক্ষায় রয়েছে।",
    pendingFooter: "স্থানান্তর প্রক্রিয়া করা হলে আপনি একটি বিজ্ঞপ্তি পাবেন।",

    validatedSubj: "প্রশাসন দ্বারা স্থানান্তর যাচাই করা হয়েছে",
    validatedGreet: "প্রিয় {name},",
    validatedIntro: "আপনার অপেক্ষমাণ স্থানান্তরটি আমাদের প্রশাসনিক পরিষেবা দ্বারা যাচাই করা হয়েছে এবং সফলভাবে প্রক্রিয়া করা হয়েছে।",
    validatedFooter: "তহবিল 24 থেকে 48 কর্মঘণ্টার মধ্যে প্রাপকের অ্যাকাউন্টে জমা হবে। আপনার বিশ্বাসের জন্য ধন্যবাদ।",

    cancelledSubj: "প্রশাসন দ্বারা স্থানান্তর বাতিল করা হয়েছে",
    cancelledGreet: "প্রিয় {name},",
    cancelledIntro: "আপনার স্থানান্তরটি আমাদের প্রশাসনিক পরিষেবা দ্বারা বাতিল করা হয়েছে। পরিমাণটি আপনার অ্যাকাউন্টে পুনরায় জমা করা হয়েছে।",
    cancelledFooter: "আপনি আপনার ক্লায়েন্ট পোর্টালে আপনার নতুন ব্যালেন্স পরীক্ষা করতে পারেন।",

    refundSubj: "স্থানান্তর ফেরত দেওয়া হয়েছে",
    refundGreet: "প্রিয় {name},",
    refundIntro: "আপনার স্থানান্তরের পরিমাণ আপনাকে ফেরত দেওয়া হয়েছে। এখানে বিশদ রয়েছে:",
    refundFooter: "পরিমাণটি আপনার অ্যাকাউন্টে পুনরায় জমা করা হয়েছে। আপনার বোঝার জন্য ধন্যবাদ।",

    userCancelledSubj: "স্থানান্তর বাতিল করা হয়েছে",
    userCancelledGreet: "প্রিয় {name},",
    userCancelledIntro: "আমরা নিশ্চিত করছি যে আপনার স্থানান্তর বাতিল করা হয়েছে। আপনার অ্যাকাউন্ট থেকে কোনও পরিমাণ ডেবিট করা হয়নি।",
    userCancelledFooter: "আপনি যদি এই বাতিলকরণ শুরু না করে থাকেন, তাহলে অনুগ্রহ করে অবিলম্বে আমাদের গ্রাহক পরিষেবার সাথে যোগাযোগ করুন।",

    adminConnectionSubj: "App Pay-তে নতুন ক্লায়েন্ট সংযোগ",
    adminConnectionGreet: "হ্যালো অ্যাডমিনিস্ট্রেটর,",
    adminConnectionIntro: "নিম্নলিখিত ক্লায়েন্ট এইমাত্র তার App Pay অ্যাকাউন্টে লগ ইন করেছেন। এখানে সংযোগের বিশদ রয়েছে:",
    adminConnectionFooter: "প্রতিবার কোনও ক্লায়েন্ট লগ ইন করলে এই ইমেলটি স্বয়ংক্রিয়ভাবে অ্যাডমিনিস্ট্রেটরকে পাঠানো হয়।"
},

// ═══════════════════════════════════════════════════════
// LANGUE : TAMOUL (ta)
// ═══════════════════════════════════════════════════════
ta: {
    loginSubj: "App Pay-க்கு வருக – உங்கள் உள்நுழைவு விவரங்கள்",
    loginGreet: "அன்புள்ள {name},",
    loginIntro: "App Pay-ல் உங்கள் கணக்கு திறக்கப்பட்டதை உறுதிப்படுத்துவதில் நாங்கள் மகிழ்ச்சியடைகிறோம். உங்கள் உள்நுழைவு விவரங்கள் இங்கே:",
    loginFooter: "உங்கள் பாதுகாப்பிற்காக, இந்த தகவலை ரகசியமாக வைத்திருங்கள். உங்கள் PIN குறியீட்டை யாருடனும் பகிர வேண்டாம்.",
    
    actSubj: "App Pay பணப் பரிமாற்றங்களுக்கான உங்கள் செயல்படுத்தல் குறியீடு",
    actGreet: "அன்புள்ள {name},",
    actIntro: "உங்கள் பரிவர்த்தனைகளின் பாதுகாப்பை உறுதிப்படுத்த, கீழே உங்கள் தனிப்பட்ட செயல்படுத்தல் குறியீட்டைக் காணலாம்:",
    actFooter: "இந்தக் குறியீட்டை பாதுகாப்பான இடத்தில் வைத்திருங்கள். இது கண்டிப்பாக தனிப்பட்டது மற்றும் ரகசியமானது.",

    successSubj: "உங்கள் App Pay பணப் பரிமாற்றத்தின் உறுதிப்படுத்தல்",
    successGreet: "அன்புள்ள {name},",
    successIntro: "உங்கள் பணப் பரிமாற்றம் வெற்றிகரமாக செயலாக்கப்பட்டதை உறுதிப்படுத்துகிறோம். சுருக்கம் இங்கே:",
    successFooter: "நிதி 24 முதல் 48 வேலை நேரங்களுக்குள் பயனாளியின் கணக்கில் வரவு வைக்கப்படும். உங்கள் நம்பிக்கைக்கு நன்றி.",

    failedSubj: "எச்சரிக்கை: உங்கள் App Pay பணப் பரிமாற்றம் தடுக்கப்பட்டது",
    failedGreet: "அன்புள்ள {name},",
    failedIntro: "உங்கள் கணக்கில் பணப் பரிமாற்ற முயற்சி எங்கள் பாதுகாப்பு அமைப்புகளால் தடுக்கப்பட்டது. விவரங்கள் இங்கே:",
    failedFooter: "எந்தத் தொகையும் பற்று வைக்கப்படவில்லை. மேலும் தகவலுக்கு வாடிக்கையாளர் சேவையைத் தொடர்பு கொள்ளவும்.",

    pendingSubj: "உங்கள் App Pay பணப் பரிமாற்றம் சரிபார்ப்புக்காக காத்திருக்கிறது",
    pendingGreet: "அன்புள்ள {name},",
    pendingIntro: "உங்கள் பணப் பரிமாற்றம் பதிவு செய்யப்பட்டு, தற்போது எங்கள் நிர்வாக சேவையின் சரிபார்ப்புக்காக காத்திருக்கிறது.",
    pendingFooter: "பணப் பரிமாற்றம் செயலாக்கப்பட்டதும் உங்களுக்கு அறிவிப்பு வரும்.",

    validatedSubj: "பணப் பரிமாற்றம் நிர்வாகத்தால் சரிபார்க்கப்பட்டது",
    validatedGreet: "அன்புள்ள {name},",
    validatedIntro: "உங்கள் நிலுவையில் உள்ள பணப் பரிமாற்றம் எங்கள் நிர்வாக சேவையால் சரிபார்க்கப்பட்டு வெற்றிகரமாக செயலாக்கப்பட்டது.",
    validatedFooter: "நிதி 24 முதல் 48 வேலை நேரங்களுக்குள் பயனாளியின் கணக்கில் வரவு வைக்கப்படும். உங்கள் நம்பிக்கைக்கு நன்றி.",

    cancelledSubj: "பணப் பரிமாற்றம் நிர்வாகத்தால் ரத்து செய்யப்பட்டது",
    cancelledGreet: "அன்புள்ள {name},",
    cancelledIntro: "உங்கள் பணப் பரிமாற்றம் எங்கள் நிர்வாக சேவையால் ரத்து செய்யப்பட்டது. தொகை உங்கள் கணக்கில் மீண்டும் வரவு வைக்கப்பட்டுள்ளது.",
    cancelledFooter: "உங்கள் புதிய இருப்பை உங்கள் வாடிக்கையாளர் போர்ட்டலில் சரிபார்க்கலாம்.",

    refundSubj: "பணப் பரிமாற்றம் திருப்பிச் செலுத்தப்பட்டது",
    refundGreet: "அன்புள்ள {name},",
    refundIntro: "உங்கள் பணப் பரிமாற்றத்தின் தொகை உங்களுக்குத் திருப்பிச் செலுத்தப்பட்டது. விவரங்கள் இங்கே:",
    refundFooter: "தொகை உங்கள் கணக்கில் மீண்டும் வரவு வைக்கப்பட்டுள்ளது. உங்கள் புரிதலுக்கு நன்றி.",

    userCancelledSubj: "பணப் பரிமாற்றம் ரத்து செய்யப்பட்டது",
    userCancelledGreet: "அன்புள்ள {name},",
    userCancelledIntro: "உங்கள் பணப் பரிமாற்றம் ரத்து செய்யப்பட்டதை உறுதிப்படுத்துகிறோம். உங்கள் கணக்கிலிருந்து எந்தத் தொகையும் பற்று வைக்கப்படவில்லை.",
    userCancelledFooter: "இந்த ரத்தை நீங்கள் தொடங்கவில்லை என்றால், உடனடியாக எங்கள் வாடிக்கையாளர் சேவையைத் தொடர்பு கொள்ளவும்.",

    adminConnectionSubj: "App Pay-ல் புதிய வாடிக்கையாளர் இணைப்பு",
    adminConnectionGreet: "வணக்கம் நிர்வாகி,",
    adminConnectionIntro: "பின்வரும் வாடிக்கையாளர் தற்போது தனது App Pay கணக்கில் உள்நுழைந்தார். இணைப்பு விவரங்கள் இங்கே:",
    adminConnectionFooter: "ஒரு வாடிக்கையாளர் உள்நுழையும் ஒவ்வொரு முறையும் இந்த மின்னஞ்சல் நிர்வாகிக்கு தானாகவே அனுப்பப்படும்."
},

// ═══════════════════════════════════════════════════════
// LANGUE : OURDOU (ur)
// ═══════════════════════════════════════════════════════
ur: {
    loginSubj: "App Pay میں خوش آمدید – آپ کے لاگ ان کی اسناد",
    loginGreet: "محترم {name}،",
    loginIntro: "ہمیں App Pay میں آپ کا اکاؤنٹ کھولنے کی تصدیق کرتے ہوئے خوشی ہو رہی ہے۔ یہ ہیں آپ کے لاگ ان کی اسناد:",
    loginFooter: "آپ کی سلامتی کے لیے، اس معلومات کو خفیہ رکھیں۔ اپنا PIN کوڈ کبھی کسی کے ساتھ شیئر نہ کریں۔",
    
    actSubj: "App Pay منتقلی کے لیے آپ کا ایکٹیویشن کوڈ",
    actGreet: "محترم {name}،",
    actIntro: "اپنے لین دین کی سلامتی کو یقینی بنانے کے لیے، براہ کرم نیچے اپنا ذاتی ایکٹیویشن کوڈ دیکھیں:",
    actFooter: "اس کوڈ کو محفوظ جگہ پر رکھیں۔ یہ سختی سے ذاتی اور خفیہ ہے۔",

    successSubj: "آپ کی App Pay منتقلی کی تصدیق",
    successGreet: "محترم {name}،",
    successIntro: "ہم تصدیق کرتے ہیں کہ آپ کی منتقلی کامیابی سے مکمل کر لی گئی ہے۔ یہ ہے خلاصہ:",
    successFooter: "رقم 24 سے 48 کاروباری گھنٹوں کے اندر مستفید ہونے والے کے اکاؤنٹ میں جمع کر دی جائے گی۔ آپ کے اعتماد کا شکریہ۔",

    failedSubj: "انتباہ: آپ کی App Pay منتقلی مسدود کر دی گئی",
    failedGreet: "محترم {name}،",
    failedIntro: "آپ کے اکاؤنٹ پر منتقلی کی کوشش ہمارے سیکیورٹی سسٹمز نے مسدود کر دی ہے۔ یہ ہیں تفصیلات:",
    failedFooter: "کوئی رقم ڈیبٹ نہیں کی گئی۔ مزید معلومات کے لیے کسٹمر سروس سے رابطہ کریں۔",

    pendingSubj: "آپ کی App Pay منتقلی تصدیق کے انتظار میں ہے",
    pendingGreet: "محترم {name}،",
    pendingIntro: "آپ کی منتقلی رجسٹر ہو گئی ہے اور فی الحال ہماری انتظامی سروس کی تصدیق کے انتظار میں ہے۔",
    pendingFooter: "منتقلی مکمل ہوتے ہی آپ کو ایک اطلاع موصول ہوگی۔",

    validatedSubj: "منتقلی انتظامیہ کی طرف سے تصدیق شدہ",
    validatedGreet: "محترم {name}،",
    validatedIntro: "آپ کی زیر التواء منتقلی کو ہماری انتظامی سروس نے تصدیق کر دیا ہے اور کامیابی سے مکمل کر لیا گیا ہے۔",
    validatedFooter: "رقم 24 سے 48 کاروباری گھنٹوں کے اندر مستفید ہونے والے کے اکاؤنٹ میں جمع کر دی جائے گی۔ آپ کے اعتماد کا شکریہ۔",

    cancelledSubj: "منتقلی انتظامیہ کی طرف سے منسوخ",
    cancelledGreet: "محترم {name}،",
    cancelledIntro: "آپ کی منتقلی ہماری انتظامی سروس نے منسوخ کر دی ہے۔ رقم آپ کے اکاؤنٹ میں دوبارہ جمع کر دی گئی ہے۔",
    cancelledFooter: "آپ اپنے کلائنٹ پورٹل میں اپنا نیا بیلنس چیک کر سکتے ہیں۔",

    refundSubj: "منتقلی کی رقم واپس",
    refundGreet: "محترم {name}،",
    refundIntro: "آپ کی منتقلی کی رقم آپ کو واپس کر دی گئی ہے۔ یہ ہیں تفصیلات:",
    refundFooter: "رقم آپ کے اکاؤنٹ میں دوبارہ جمع کر دی گئی ہے۔ آپ کی سمجھ کے لیے شکریہ۔",

    userCancelledSubj: "منتقلی منسوخ",
    userCancelledGreet: "محترم {name}،",
    userCancelledIntro: "ہم تصدیق کرتے ہیں کہ آپ کی منتقلی منسوخ کر دی گئی ہے۔ آپ کے اکاؤنٹ سے کوئی رقم ڈیبٹ نہیں کی گئی۔",
    userCancelledFooter: "اگر آپ نے یہ منسوخی شروع نہیں کی، تو براہ کرم فوری طور پر ہماری کسٹمر سروس سے رابطہ کریں۔",

    adminConnectionSubj: "App Pay پر نئی کلائنٹ کنکشن",
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
    loginIntro: "ما خوشحالیم که افتتاح حساب شما را در App Pay تأیید می‌کنیم. اطلاعات ورود شما به شرح زیر است:",
    loginFooter: "برای امنیت شما، این اطلاعات را محرمانه نگه دارید. هرگز کد PIN خود را با کسی به اشتراک نگذارید.",
    
    actSubj: "کد فعال‌سازی شما برای حواله‌های App Pay",
    actGreet: "کاربر گرامی {name}،",
    actIntro: "برای تضمین امنیت تراکنش‌های شما، لطفاً کد فعال‌سازی شخصی خود را در زیر ببینید:",
    actFooter: "این کد را در جای امنی نگه دارید. این کد کاملاً شخصی و محرمانه است.",

    successSubj: "تأیید حواله App Pay شما",
    successGreet: "کاربر گرامی {name}،",
    successIntro: "ما تأیید می‌کنیم که حواله شما با موفقیت پردازش شده است. در اینجا خلاصه آمده است:",
    successFooter: "وجه ظرف ۲۴ تا ۴۸ ساعت کاری به حساب ذینفع واریز می‌شود. از اعتماد شما سپاسگزاریم.",

    failedSubj: "هشدار: حواله App Pay شما مسدود شد",
    failedGreet: "کاربر گرامی {name}،",
    failedIntro: "تلاش برای حواله از حساب شما توسط سیستم‌های امنیتی ما مسدود شده است. در اینجا جزئیات آمده است:",
    failedFooter: "هیچ مبلغی کسر نشده است. لطفاً برای اطلاعات بیشتر با خدمات مشتریان تماس بگیرید.",

    pendingSubj: "حواله App Pay شما در انتظار تأیید است",
    pendingGreet: "کاربر گرامی {name}،",
    pendingIntro: "حواله شما ثبت شده و در حال حاضر در انتظار تأیید توسط سرویس اداری ما است.",
    pendingFooter: "به محض پردازش حواله، اعلانی دریافت خواهید کرد.",

    validatedSubj: "حواله توسط مدیریت تأیید شد",
    validatedGreet: "کاربر گرامی {name}،",
    validatedIntro: "حواله در انتظار شما توسط سرویس اداری ما تأیید و با موفقیت پردازش شد.",
    validatedFooter: "وجه ظرف ۲۴ تا ۴۸ ساعت کاری به حساب ذینفع واریز می‌شود. از اعتماد شما سپاسگزاریم.",

    cancelledSubj: "حواله توسط مدیریت لغو شد",
    cancelledGreet: "کاربر گرامی {name}،",
    cancelledIntro: "حواله شما توسط سرویس اداری ما لغو شده است. مبلغ مجدداً به حساب شما واریز شده است.",
    cancelledFooter: "می‌توانید موجودی جدید خود را در پورتال مشتری خود بررسی کنید.",

    refundSubj: "حواله بازپرداخت شد",
    refundGreet: "کاربر گرامی {name}،",
    refundIntro: "مبلغ حواله شما به شما بازپرداخت شده است. در اینجا جزئیات آمده است:",
    refundFooter: "مبلغ مجدداً به حساب شما واریز شده است. از درک شما سپاسگزاریم.",

    userCancelledSubj: "حواله لغو شد",
    userCancelledGreet: "کاربر گرامی {name}،",
    userCancelledIntro: "ما تأیید می‌کنیم که حواله شما لغو شده است. هیچ مبلغی از حساب شما کسر نشده است.",
    userCancelledFooter: "اگر شما این لغو را آغاز نکرده‌اید، لطفاً فوراً با خدمات مشتریان ما تماس بگیرید.",

    adminConnectionSubj: "اتصال مشتری جدید در App Pay",
    adminConnectionGreet: "سلام مدیر،",
    adminConnectionIntro: "مشتری زیر همین حالا وارد حساب App Pay خود شد. در اینجا جزئیات اتصال آمده است:",
    adminConnectionFooter: "این ایمیل هر بار که مشتری وارد می‌شود به طور خودکار برای مدیر ارسال می‌شود."
}
// ═══════════════════════════════════════════════════════
// LANGUE : INDONÉSIEN (id)
// ═══════════════════════════════════════════════════════
id: {
    loginSubj: "Selamat datang di App Pay – Kredensial login Anda",
    loginGreet: "Yang terhormat {name},",
    loginIntro: "Kami dengan senang hati mengonfirmasi pembukaan akun Anda di App Pay. Berikut adalah kredensial login Anda:",
    loginFooter: "Demi keamanan Anda, jaga kerahasiaan informasi ini. Jangan pernah membagikan kode PIN Anda.",
    
    actSubj: "Kode aktivasi Anda untuk transfer App Pay",
    actGreet: "Yang terhormat {name},",
    actIntro: "Untuk memastikan keamanan transaksi Anda, silakan temukan kode aktivasi pribadi Anda di bawah ini:",
    actFooter: "Simpan kode ini di tempat yang aman. Kode ini bersifat pribadi dan rahasia.",

    successSubj: "Konfirmasi transfer App Pay Anda",
    successGreet: "Yang terhormat {name},",
    successIntro: "Kami mengonfirmasi bahwa transfer Anda telah berhasil diproses. Berikut adalah ringkasan:",
    successFooter: "Dana akan dikreditkan ke rekening penerima dalam waktu 24 hingga 48 jam kerja. Terima kasih atas kepercayaan Anda.",

    failedSubj: "Peringatan: Transfer App Pay Anda diblokir",
    failedGreet: "Yang terhormat {name},",
    failedIntro: "Upaya transfer pada akun Anda diblokir oleh sistem keamanan kami. Berikut adalah detailnya:",
    failedFooter: "Tidak ada jumlah yang didebit. Silakan hubungi layanan pelanggan untuk informasi lebih lanjut.",

    pendingSubj: "Transfer App Pay Anda menunggu validasi",
    pendingGreet: "Yang terhormat {name},",
    pendingIntro: "Transfer Anda telah terdaftar dan saat ini menunggu validasi oleh layanan administrasi kami.",
    pendingFooter: "Anda akan menerima notifikasi segera setelah transfer diproses.",

    validatedSubj: "Transfer divalidasi oleh administrasi",
    validatedGreet: "Yang terhormat {name},",
    validatedIntro: "Transfer tertunda Anda telah divalidasi oleh layanan administrasi kami dan berhasil diproses.",
    validatedFooter: "Dana akan dikreditkan ke rekening penerima dalam waktu 24 hingga 48 jam kerja. Terima kasih atas kepercayaan Anda.",

    cancelledSubj: "Transfer dibatalkan oleh administrasi",
    cancelledGreet: "Yang terhormat {name},",
    cancelledIntro: "Transfer Anda telah dibatalkan oleh layanan administrasi kami. Jumlah tersebut telah dikreditkan kembali ke akun Anda.",
    cancelledFooter: "Anda dapat memeriksa saldo baru Anda di portal klien Anda.",

    refundSubj: "Transfer dikembalikan",
    refundGreet: "Yang terhormat {name},",
    refundIntro: "Jumlah transfer Anda telah dikembalikan kepada Anda. Berikut adalah detailnya:",
    refundFooter: "Jumlah tersebut telah dikreditkan kembali ke akun Anda. Terima kasih atas pengertiannya.",

    userCancelledSubj: "Transfer dibatalkan",
    userCancelledGreet: "Yang terhormat {name},",
    userCancelledIntro: "Kami mengonfirmasi bahwa transfer Anda telah dibatalkan. Tidak ada jumlah yang didebit dari akun Anda.",
    userCancelledFooter: "Jika Anda tidak memulai pembatalan ini, silakan hubungi layanan pelanggan kami segera.",

    adminConnectionSubj: "Koneksi klien baru di App Pay",
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
    loginIntro: "Kami dengan sukacitanya mengesahkan pembukaan akaun anda di App Pay. Berikut adalah kelayakan log masuk anda:",
    loginFooter: "Untuk keselamatan anda, rahsiakan maklumat ini. Jangan sekali-kali berkongsi kod PIN anda.",
    
    actSubj: "Kod pengaktifan anda untuk pemindahan App Pay",
    actGreet: "Yang dihormati {name},",
    actIntro: "Untuk memastikan keselamatan transaksi anda, sila cari kod pengaktifan peribadi anda di bawah:",
    actFooter: "Simpan kod ini di tempat yang selamat. Ia adalah peribadi dan sulit.",

    successSubj: "Pengesahan pemindahan App Pay anda",
    successGreet: "Yang dihormati {name},",
    successIntro: "Kami mengesahkan bahawa pemindahan anda telah berjaya diproses. Berikut adalah ringkasan:",
    successFooter: "Dana akan dikreditkan ke akaun penerima dalam masa 24 hingga 48 jam bekerja. Terima kasih atas kepercayaan anda.",

    failedSubj: "Amaran: Pemindahan App Pay anda telah disekat",
    failedGreet: "Yang dihormati {name},",
    failedIntro: "Percubaan pemindahan pada akaun anda telah disekat oleh sistem keselamatan kami. Berikut adalah butirannya:",
    failedFooter: "Tiada jumlah yang didebitkan. Sila hubungi perkhidmatan pelanggan untuk maklumat lanjut.",

    pendingSubj: "Pemindahan App Pay anda menunggu pengesahan",
    pendingGreet: "Yang dihormati {name},",
    pendingIntro: "Pemindahan anda telah didaftarkan dan kini menunggu pengesahan oleh perkhidmatan pentadbiran kami.",
    pendingFooter: "Anda akan menerima pemberitahuan sebaik sahaja pemindahan diproses.",

    validatedSubj: "Pemindahan disahkan oleh pentadbiran",
    validatedGreet: "Yang dihormati {name},",
    validatedIntro: "Pemindahan tertunda anda telah disahkan oleh perkhidmatan pentadbiran kami dan berjaya diproses.",
    validatedFooter: "Dana akan dikreditkan ke akaun penerima dalam masa 24 hingga 48 jam bekerja. Terima kasih atas kepercayaan anda.",

    cancelledSubj: "Pemindahan dibatalkan oleh pentadbiran",
    cancelledGreet: "Yang dihormati {name},",
    cancelledIntro: "Pemindahan anda telah dibatalkan oleh perkhidmatan pentadbiran kami. Jumlah tersebut telah dikreditkan semula ke akaun anda.",
    cancelledFooter: "Anda boleh menyemak baki baharu anda dalam portal klien anda.",

    refundSubj: "Pemindahan dipulangkan",
    refundGreet: "Yang dihormati {name},",
    refundIntro: "Jumlah pemindahan anda telah dipulangkan kepada anda. Berikut adalah butirannya:",
    refundFooter: "Jumlah tersebut telah dikreditkan semula ke akaun anda. Terima kasih atas pemahaman anda.",

    userCancelledSubj: "Pemindahan dibatalkan",
    userCancelledGreet: "Yang dihormati {name},",
    userCancelledIntro: "Kami mengesahkan bahawa pemindahan anda telah dibatalkan. Tiada jumlah yang didebitkan daripada akaun anda.",
    userCancelledFooter: "Jika anda tidak memulakan pembatalan ini, sila hubungi perkhidmatan pelanggan kami dengan segera.",

    adminConnectionSubj: "Sambungan klien baharu di App Pay",
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
    loginIntro: "เรายินดีที่จะยืนยันการเปิดบัญชีของคุณกับ App Pay ข้อมูลการเข้าสู่ระบบของคุณมีดังนี้:",
    loginFooter: "เพื่อความปลอดภัยของคุณ โปรดเก็บข้อมูลนี้เป็นความลับ ห้ามแชร์รหัส PIN ของคุณกับ任何人โดยเด็ดขาด",
    
    actSubj: "รหัสเปิดใช้งานของคุณสำหรับการโอนเงิน App Pay",
    actGreet: "เรียนคุณ {name},",
    actIntro: "เพื่อให้มั่นใจในความปลอดภัยของธุรกรรมของคุณ โปรดดูรหัสเปิดใช้งานส่วนตัวของคุณด้านล่าง:",
    actFooter: "เก็บรหัสนี้ไว้ในที่ปลอดภัย รหัสนี้เป็นความลับส่วนบุคคลอย่างเคร่งครัด",

    successSubj: "การยืนยันการโอนเงิน App Pay ของคุณ",
    successGreet: "เรียนคุณ {name},",
    successIntro: "เราขอยืนยันว่าการโอนเงินของคุณได้รับการประมวลผลเรียบร้อยแล้ว นี่คือสรุป:",
    successFooter: "เงินจะถูกโอนเข้าบัญชีของผู้รับภายใน 24 ถึง 48 ชั่วโมงทำการ ขอบคุณสำหรับความไว้วางใจของคุณ",

    failedSubj: "คำเตือน: การโอนเงิน App Pay ของคุณถูกบล็อก",
    failedGreet: "เรียนคุณ {name},",
    failedIntro: "ความพยายามโอนเงินในบัญชีของคุณถูกบล็อกโดยระบบรักษาความปลอดภัยของเรา นี่คือรายละเอียด:",
    failedFooter: "ไม่มีจำนวนเงินใดถูกหักออก โปรดติดต่อฝ่ายบริการลูกค้าเพื่อรับข้อมูลเพิ่มเติม",

    pendingSubj: "การโอนเงิน App Pay ของคุณอยู่ระหว่างรอการตรวจสอบ",
    pendingGreet: "เรียนคุณ {name},",
    pendingIntro: "การโอนเงินของคุณได้รับการลงทะเบียนแล้วและขณะนี้อยู่ระหว่างรอการตรวจสอบโดยฝ่ายบริการธุรการของเรา",
    pendingFooter: "คุณจะได้รับ通知เมื่อการโอนเงินได้รับการประมวลผล",

    validatedSubj: "การโอนเงินได้รับการตรวจสอบโดยฝ่ายบริหาร",
    validatedGreet: "เรียนคุณ {name},",
    validatedIntro: "การโอนเงินที่รอดำเนินการของคุณได้รับการตรวจสอบโดยฝ่ายบริการธุรการของเราและประมวลผลเรียบร้อยแล้ว",
    validatedFooter: "เงินจะถูกโอนเข้าบัญชีของผู้รับภายใน 24 ถึง 48 ชั่วโมงทำการ ขอบคุณสำหรับความไว้วางใจของคุณ",

    cancelledSubj: "การโอนเงินถูกยกเลิกโดยฝ่ายบริหาร",
    cancelledGreet: "เรียนคุณ {name},",
    cancelledIntro: "การโอนเงินของคุณถูกยกเลิกโดยฝ่ายบริการธุรการของเรา จำนวนเงินได้รับการโอนกลับเข้าบัญชีของคุณแล้ว",
    cancelledFooter: "คุณสามารถตรวจสอบยอดคงเหลือใหม่ของคุณได้ในพอร์ทัลลูกค้าของคุณ",

    refundSubj: "การโอนเงินได้รับการคืนเงิน",
    refundGreet: "เรียนคุณ {name},",
    refundIntro: "จำนวนเงินโอนของคุณได้รับการคืนเงินให้คุณแล้ว นี่คือรายละเอียด:",
    refundFooter: "จำนวนเงินได้รับการโอนกลับเข้าบัญชีของคุณแล้ว ขอบคุณสำหรับความเข้าใจของคุณ",

    userCancelledSubj: "การโอนเงินถูกยกเลิก",
    userCancelledGreet: "เรียนคุณ {name},",
    userCancelledIntro: "เราขอยืนยันว่าการโอนเงินของคุณถูกยกเลิกแล้ว ไม่มีจำนวนเงินใดถูกหักออกจากบัญชีของคุณ",
    userCancelledFooter: "หากคุณไม่ได้เป็นผู้เริ่มการยกเลิกนี้ โปรดติดต่อฝ่ายบริการลูกค้าของเราทันที",

    adminConnectionSubj: "การเชื่อมต่อลูกค้าใหม่บน App Pay",
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
    loginIntro: "Ikinalulugod naming kumpirmahin ang pagbubukas ng iyong account sa App Pay. Narito ang iyong mga kredensyal sa pag-login:",
    loginFooter: "Para sa iyong seguridad, itago ang impormasyong ito nang kumpidensyal. Huwag kailanman ibahagi ang iyong PIN code.",
    
    actSubj: "Ang iyong activation code para sa mga paglilipat ng App Pay",
    actGreet: "Mahal na {name},",
    actIntro: "Upang matiyak ang seguridad ng iyong mga transaksyon, paki-tingnan ang iyong personal na activation code sa ibaba:",
    actFooter: "Itago ang code na ito sa isang ligtas na lugar. Ito ay mahigpit na personal at kumpidensyal.",

    successSubj: "Kumpirmasyon ng iyong paglilipat sa App Pay",
    successGreet: "Mahal na {name},",
    successIntro: "Kinukumpirma namin na ang iyong paglilipat ay matagumpay na naproseso. Narito ang buod:",
    successFooter: "Ang mga pondo ay ikredito sa account ng benepisyaryo sa loob ng 24 hanggang 48 oras ng negosyo. Salamat sa iyong tiwala.",

    failedSubj: "Babala: Ang iyong paglilipat sa App Pay ay na-block",
    failedGreet: "Mahal na {name},",
    failedIntro: "Ang isang pagtatangkang paglilipat sa iyong account ay na-block ng aming mga sistema ng seguridad. Narito ang mga detalye:",
    failedFooter: "Walang halagang na-debit. Mangyaring makipag-ugnayan sa customer service para sa karagdagang impormasyon.",

    pendingSubj: "Ang iyong paglilipat sa App Pay ay nakabinbin para sa validation",
    pendingGreet: "Mahal na {name},",
    pendingIntro: "Ang iyong paglilipat ay nairehistro at kasalukuyang nakabinbin para sa validation ng aming serbisyong administratibo.",
    pendingFooter: "Makakatanggap ka ng notification sa sandaling maproseso ang paglilipat.",

    validatedSubj: "Ang paglilipat ay na-validate ng administrasyon",
    validatedGreet: "Mahal na {name},",
    validatedIntro: "Ang iyong nakabinbing paglilipat ay na-validate ng aming serbisyong administratibo at matagumpay na naproseso.",
    validatedFooter: "Ang mga pondo ay ikredito sa account ng benepisyaryo sa loob ng 24 hanggang 48 oras ng negosyo. Salamat sa iyong tiwala.",

    cancelledSubj: "Ang paglilipat ay kinansela ng administrasyon",
    cancelledGreet: "Mahal na {name},",
    cancelledIntro: "Ang iyong paglilipat ay kinansela ng aming serbisyong administratibo. Ang halaga ay naikredito pabalik sa iyong account.",
    cancelledFooter: "Maaari mong suriin ang iyong bagong balanse sa iyong portal ng kliyente.",

    refundSubj: "Ang paglilipat ay naibalik",
    refundGreet: "Mahal na {name},",
    refundIntro: "Ang halaga ng iyong paglilipat ay naibalik sa iyo. Narito ang mga detalye:",
    refundFooter: "Ang halaga ay naikredito pabalik sa iyong account. Salamat sa iyong pag-unawa.",

    userCancelledSubj: "Kinansela ang paglilipat",
    userCancelledGreet: "Mahal na {name},",
    userCancelledIntro: "Kinukumpirma namin na ang iyong paglilipat ay kinansela. Walang halagang na-debit mula sa iyong account.",
    userCancelledFooter: "Kung hindi ikaw ang nagpasimula ng pagkanselang ito, mangyaring makipag-ugnayan kaagad sa aming customer service.",

    adminConnectionSubj: "Bagong koneksyon ng kliyente sa App Pay",
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
    loginIntro: "App Pay တွင် သင့်အကောင့်ဖွင့်လှစ်ပြီးဖြစ်ကြောင်း အတည်ပြုပေးရခြင်းအတွက် ကျွန်ုပ်တို့ ဝမ်းမြောက်ပါသည်။ သင့်အကောင့်ဝင်ရောက်ရန် အထောက်အထားများမှာ အောက်ပါအတိုင်းဖြစ်ပါသည်:",
    loginFooter: "သင့်လုံခြုံရေးအတွက် ဤအချက်အလက်များကို လျှို့ဝှက်ထားပါ။ သင့် PIN ကုဒ်ကို မည်သူ့ကိုမျှ မမျှဝေပါနှင့်။",
    
    actSubj: "App Pay ငွေလွှဲမှုများအတွက် သင့်သက်ဝင်ကုဒ်",
    actGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    actIntro: "သင့်ငွေရေးကြေးရေးလုပ်ငန်းများ၏ လုံခြုံရေးကို သေချာစေရန်၊ သင့်ကိုယ်ပိုင်သက်ဝင်ကုဒ်ကို အောက်တွင် ကြည့်ပါ:",
    actFooter: "ဤကုဒ်ကို လုံခြုံသောနေရာတွင် သိမ်းဆည်းထားပါ။ ၎င်းသည် ကိုယ်ပိုင်နှင့် လျှို့ဝှက်အပ်ပါသည်။",

    successSubj: "သင့် App Pay ငွေလွှဲမှု အတည်ပြုချက်",
    successGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    successIntro: "သင့်ငွေလွှဲမှုကို အောင်မြင်စွာ ဆောင်ရွက်ပြီးဖြစ်ကြောင်း ကျွန်ုပ်တို့ အတည်ပြုပါသည်။ အနှစ်ချုပ်မှာ အောက်ပါအတိုင်းဖြစ်ပါသည်:",
    successFooter: "ငွေများကို ၂၄ နာရီမှ ၄၈ နာရီအတွင်း အကျိုးခံစားခွင့်ရှိသူ၏ အကောင့်ထဲသို့ လွှဲပြောင်းပေးပါမည်။ သင့်ယုံကြည်မှုအတွက် ကျေးဇူးတင်ပါသည်။",

    failedSubj: "သတိပေးချက်: သင့် App Pay ငွေလွှဲမှုကို ပိတ်ဆို့ထားပါသည်",
    failedGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    failedIntro: "သင့်အကောင့်တွင် ငွေလွှဲရန် ကြိုးပမ်းမှုကို ကျွန်ုပ်တို့၏ လုံခြုံရေးစနစ်များက ပိတ်ဆို့ထားပါသည်။ အသေးစိတ်မှာ အောက်ပါအတိုင်းဖြစ်ပါသည်:",
    failedFooter: "မည်သည့်ငွေပမာဏမျှ နုတ်ယူခြင်းမပြုပါ။ နောက်ထပ်အချက်အလက်များအတွက် ဖောက်သည်ဝန်ဆောင်မှုကို ဆက်သွယ်ပါ။",

    pendingSubj: "သင့် App Pay ငွေလွှဲမှုသည် အတည်ပြုရန် စောင့်ဆိုင်းနေပါသည်",
    pendingGreet: "လေးစားအပ်ပါသော {name} ခင်ဗျာ၊",
    pendingIntro: "သင့်ငွေလွှဲမှုကို မှတ်ပုံတင်ပြီးဖြစ်ကြောင်းနှင့် လက်ရှိတွင် ကျွန်ုပ်တို့၏ အုပ်ချုပ်ရေးဝန်ဆောင်မှုမှ အတည်ပြုရန် စောင့်ဆိုင်းနေပါသည်။",
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

    adminConnectionSubj: "App Pay တွင် ကလိုင်းရင်း ချိတ်ဆက်မှုအသစ်",
    adminConnectionGreet: "မင်္ဂလာပါ အုပ်ချုပ်သူ၊",
    adminConnectionIntro: "အောက်ပါကလိုင်းရင်းသည် ၎င်းတို့၏ App Pay အကောင့်သို့ ယခုလေးတင် ဝင်ရောက်ခဲ့ပါသည်။ ချိတ်ဆက်မှု အသေးစိတ်မှာ အောက်ပါအတိုင်းဖြစ်ပါသည်:",
    adminConnectionFooter: "ကလိုင်းရင်းတစ်ဦး အကောင့်ဝင်ရောက်တိုင်း ဤအီးမေးလ်ကို အုပ်ချုပ်သူထံ အလိုအလျောက် ပေးပို့ပါသည်။"
},

// ═══════════════════════════════════════════════════════
// LANGUE : KHMER (km)
// ═══════════════════════════════════════════════════════
km: {
    loginSubj: "សូមស្វាគមន៍មកកាន់ App Pay – ព័ត៌មានចូលរបស់អ្នក",
    loginGreet: "ជូនចំពោះ {name},",
    loginIntro: "យើងខ្ញុំរីករាយក្នុងការបញ្ជាក់ពីការបើកគណនីរបស់អ្នកនៅ App Pay។ នេះជាព័ត៌មានចូលរបស់អ្នក:",
    loginFooter: "សម្រាប់សុវត្ថិភាពរបស់អ្នក សូមរក្សាព័ត៌មាននេះជាការសម្ងាត់។ កុំចែករំលែកកូដ PIN របស់អ្នកជាដាច់ខាត។",
    
    actSubj: "កូដសកម្មភាពរបស់អ្នកសម្រាប់ការផ្ទេរប្រាក់ App Pay",
    actGreet: "ជូនចំពោះ {name},",
    actIntro: "ដើម្បីធានាសុវត្ថិភាពនៃប្រតិបត្តិការរបស់អ្នក សូមមើលកូដសកម្មភាពផ្ទាល់ខ្លួនរបស់អ្នកខាងក្រោម:",
    actFooter: "រក្សាកូដនេះឱ្យបានល្អ។ វាជាកូដផ្ទាល់ខ្លួន និងសម្ងាត់យ៉ាងតឹងរ៉ឹង។",

    successSubj: "ការបញ្ជាក់ពីការផ្ទេរប្រាក់ App Pay របស់អ្នក",
    successGreet: "ជូនចំពោះ {name},",
    successIntro: "យើងខ្ញុំបញ្ជាក់ថាការផ្ទេរប្រាក់របស់អ្នកត្រូវបានដំណើរការដោយជោគជ័យ។ នេះជាសេចក្តីសង្ខេប:",
    successFooter: "ប្រាក់នឹងត្រូវបានផ្ទេរចូលគណនីរបស់អ្នកទទួលក្នុងរយៈពេល 24 ទៅ 48 ម៉ោងធ្វើការ។ សូមអរគុណចំពោះការជឿទុកចិត្តរបស់អ្នក។",

    failedSubj: "ការព្រមាន៖ ការផ្ទេរប្រាក់ App Pay របស់អ្នកត្រូវបានទប់ស្កាត់",
    failedGreet: "ជូនចំពោះ {name},",
    failedIntro: "ការប៉ុនប៉ងផ្ទេរប្រាក់នៅក្នុងគណនីរបស់អ្នកត្រូវបានទប់ស្កាត់ដោយប្រព័ន្ធសុវត្ថិភាពរបស់យើង។ នេះជាព័ត៌មានលម្អិត:",
    failedFooter: "គ្មានចំនួនទឹកប្រាក់ណាមួយត្រូវបានកាត់ទេ។ សូមទាក់ទងសេវាអតិថិជនសម្រាប់ព័ត៌មានបន្ថែម។",

    pendingSubj: "ការផ្ទេរប្រាក់ App Pay របស់អ្នកកំពុងរង់ចាំការផ្ទៀងផ្ទាត់",
    pendingGreet: "ជូនចំពោះ {name},",
    pendingIntro: "ការផ្ទេរប្រាក់របស់អ្នកត្រូវបានចុះឈ្មោះ ហើយបច្ចុប្បន្នកំពុងរង់ចាំការផ្ទៀងផ្ទាត់ពីសេវារដ្ឋបាលរបស់យើង។",
    pendingFooter: "អ្នកនឹងទទួលបានការជូនដំណឹងភ្លាមៗនៅពេលដែលការផ្ទេរប្រាក់ត្រូវបានដំណើរការ។",

    validatedSubj: "ការផ្ទេរប្រាក់ត្រូវបានផ្ទៀងផ្ទាត់ដោយរដ្ឋបាល",
    validatedGreet: "ជូនចំពោះ {name},",
    validatedIntro: "ការផ្ទេរប្រាក់ដែលកំពុងរង់ចាំរបស់អ្នកត្រូវបានផ្ទៀងផ្ទាត់ដោយសេវារដ្ឋបាលរបស់យើង ហើយបានដំណើរការដោយជោគជ័យ។",
    validatedFooter: "ប្រាក់នឹងត្រូវបានផ្ទេរចូលគណនីរបស់អ្នកទទួលក្នុងរយៈពេល 24 ទៅ 48 ម៉ោងធ្វើការ។ សូមអរគុណចំពោះការជឿទុកចិត្តរបស់អ្នក។",

    cancelledSubj: "ការផ្ទេរប្រាក់ត្រូវបានបោះបង់ដោយរដ្ឋបាល",
    cancelledGreet: "ជូនចំពោះ {name},",
    cancelledIntro: "ការផ្ទេរប្រាក់របស់អ្នកត្រូវបានបោះបង់ដោយសេវារដ្ឋបាលរបស់យើង។ ចំនួនទឹកប្រាក់ត្រូវបានផ្ទេរត្រឡប់ចូលគណនីរបស់អ្នកវិញ។",
    cancelledFooter: "អ្នកអាចពិនិត្យមើលសមតុល្យថ្មីរបស់អ្នកនៅក្នុងផតថលអតិថិជនរបស់អ្នក។",

    refundSubj: "ការផ្ទេរប្រាក់ត្រូវបានសងវិញ",
    refundGreet: "ជូនចំពោះ {name},",
    refundIntro: "ចំនួនទឹកប្រាក់នៃការផ្ទេរប្រាក់របស់អ្នកត្រូវបានសងវិញឱ្យអ្នក។ នេះជាព័ត៌មានលម្អិត:",
    refundFooter: "ចំនួនទឹកប្រាក់ត្រូវបានផ្ទេរត្រឡប់ចូលគណនីរបស់អ្នកវិញ។ សូមអរគុណចំពោះការយោគយល់របស់អ្នក។",

    userCancelledSubj: "ការផ្ទេរប្រាក់ត្រូវបានបោះបង់",
    userCancelledGreet: "ជូនចំពោះ {name},",
    userCancelledIntro: "យើងខ្ញុំបញ្ជាក់ថាការផ្ទេរប្រាក់របស់អ្នកត្រូវបានបោះបង់។ គ្មានចំនួនទឹកប្រាក់ណាមួយត្រូវបានកាត់ពីគណនីរបស់អ្នកទេ។",
    userCancelledFooter: "ប្រសិនបើអ្នកមិនមែនជាអ្នកចាប់ផ្តើមការបោះបង់នេះទេ សូមទាក់ទងសេវាអតិថិជនរបស់យើងភ្លាមៗ។",

    adminConnectionSubj: "ការតភ្ជាប់អតិថិជនថ្មីនៅលើ App Pay",
    adminConnectionGreet: "សូមស្វាគមន៍ អ្នកគ្រប់គ្រង,",
    adminConnectionIntro: "អតិថិជនខាងក្រោមទើបតែបានចូលទៅក្នុងគណនី App Pay របស់ពួកគេ។ នេះជាព័ត៌មានលម្អិតនៃការតភ្ជាប់:",
    adminConnectionFooter: "អ៊ីមែលនេះត្រូវបានផ្ញើដោយស្វ័យប្រវត្តិទៅអ្នកគ្រប់គ្រងរាល់ពេលដែលអតិថិជនចូល។"
},

// ═══════════════════════════════════════════════════════
// LANGUE : LAO (lo)
// ═══════════════════════════════════════════════════════
lo: {
    loginSubj: "ຍິນດີຕ້ອນຮັບສູ່ App Pay – ຂໍ້ມູນການເຂົ້າສູ່ລະບົບຂອງທ່ານ",
    loginGreet: "ທ່ານ {name},",
    loginIntro: "ພວກເຮົາມີຄວາມຍິນດີທີ່ຈະຢືນຢັນການເປີດບັນຊີຂອງທ່ານກັບ App Pay. ນີ້ແມ່ນຂໍ້ມູນການເຂົ້າສູ່ລະບົບຂອງທ່ານ:",
    loginFooter: "ເພື່ອຄວາມປອດໄພຂອງທ່ານ, ກະລຸນາເກັບຂໍ້ມູນນີ້ເປັນຄວາມລັບ. ຢ່າແບ່ງປັນລະຫັດ PIN ຂອງທ່ານກັບໃຜ.",
    
    actSubj: "ລະຫັດການເປີດໃຊ້ຂອງທ່ານສຳລັບການໂອນເງິນ App Pay",
    actGreet: "ທ່ານ {name},",
    actIntro: "ເພື່ອຮັບປະກັນຄວາມປອດໄພຂອງທຸລະກຳຂອງທ່ານ, ກະລຸນາເບິ່ງລະຫັດການເປີດໃຊ້ສ່ວນຕົວຂອງທ່ານຂ້າງລຸ່ມນີ້:",
    actFooter: "ເກັບລະຫັດນີ້ໄວ້ໃນບ່ອນທີ່ປອດໄພ. ມັນເປັນສ່ວນຕົວແລະເປັນຄວາມລັບຢ່າງເຂັ້ມງວດ.",

    successSubj: "ການຢືນຢັນການໂອນເງິນ App Pay ຂອງທ່ານ",
    successGreet: "ທ່ານ {name},",
    successIntro: "ພວກເຮົາຢືນຢັນວ່າການໂອນເງິນຂອງທ່ານໄດ້ຮັບການປະມວນຜົນຢ່າງສຳເລັດຜົນ. ນີ້ແມ່ນສະຫຼຸບ:",
    successFooter: "ເງິນຈະຖືກໂອນເຂົ້າບັນຊີຂອງຜູ້ຮັບພາຍໃນ 24 ຫາ 48 ຊົ່ວໂມງເຮັດວຽກ. ຂອບໃຈສຳລັບຄວາມໄວ້ວາງໃຈຂອງທ່ານ.",

    failedSubj: "ຄຳເຕືອນ: ການໂອນເງິນ App Pay ຂອງທ່ານຖືກບລັອກ",
    failedGreet: "ທ່ານ {name},",
    failedIntro: "ຄວາມພະຍາຍາມໃນການໂອນເງິນໃນບັນຊີຂອງທ່ານຖືກບລັອກໂດຍລະບົບຄວາມປອດໄພຂອງພວກເຮົາ. ນີ້ແມ່ນລາຍລະອຽດ:",
    failedFooter: "ບໍ່ມີຈຳນວນເງິນໃດຖືກຫັກ. ກະລຸນາຕິດຕໍ່ຝ່າຍບໍລິການລູກຄ້າສຳລັບຂໍ້ມູນເພີ່ມເຕີມ.",

    pendingSubj: "ການໂອນເງິນ App Pay ຂອງທ່ານກຳລັງລໍຖ້າການຢືນຢັນ",
    pendingGreet: "ທ່ານ {name},",
    pendingIntro: "ການໂອນເງິນຂອງທ່ານໄດ້ຮັບການລົງທະບຽນແລ້ວ ແລະ ປັດຈຸບັນກຳລັງລໍຖ້າການຢືນຢັນຈາກຝ່າຍບໍລິຫານຂອງພວກເຮົາ.",
    pendingFooter: "ທ່ານຈະໄດ້ຮັບການແຈ້ງເຕືອນເມື່ອການໂອນເງິນໄດ້ຮັບການປະມວນຜົນ.",

    validatedSubj: "ການໂອນເງິນໄດ້ຮັບການຢືນຢັນໂດຍຝ່າຍບໍລິຫານ",
    validatedGreet: "ທ່ານ {name},",
    validatedIntro: "ການໂອນເງິນທີ່ລໍຖ້າຂອງທ່ານໄດ້ຮັບການຢືນຢັນໂດຍຝ່າຍບໍລິຫານຂອງພວກເຮົາ ແລະ ປະມວນຜົນຢ່າງສຳເລັດຜົນ.",
    validatedFooter: "ເງິນຈະຖືກໂອນເຂົ້າບັນຊີຂອງຜູ້ຮັບພາຍໃນ 24 ຫາ 48 ຊົ່ວໂມງເຮັດວຽກ. ຂອບໃຈສຳລັບຄວາມໄວ້ວາງໃຈຂອງທ່ານ.",

    cancelledSubj: "ການໂອນເງິນຖືກຍົກເລີກໂດຍຝ່າຍບໍລິຫານ",
    cancelledGreet: "ທ່ານ {name},",
    cancelledIntro: "ການໂອນເງິນຂອງທ່ານຖືກຍົກເລີກໂດຍຝ່າຍບໍລິຫານຂອງພວກເຮົາ. ຈຳນວນເງິນໄດ້ຖືກໂອນກັບເຂົ້າບັນຊີຂອງທ່ານແລ້ວ.",
    cancelledFooter: "ທ່ານສາມາດກວດສອບຍອດເງິນໃໝ່ຂອງທ່ານໃນພອດທານລູກຄ້າຂອງທ່ານ.",

    refundSubj: "ການໂອນເງິນໄດ້ຮັບການຄືນເງິນ",
    refundGreet: "ທ່ານ {name},",
    refundIntro: "ຈຳນວນເງິນໃນການໂອນເງິນຂອງທ່ານໄດ້ຮັບການຄືນເງິນໃຫ້ທ່ານແລ້ວ. ນີ້ແມ່ນລາຍລະອຽດ:",
    refundFooter: "ຈຳນວນເງິນໄດ້ຖືກໂອນກັບເຂົ້າບັນຊີຂອງທ່ານແລ້ວ. ຂອບໃຈສຳລັບຄວາມເຂົ້າໃຈຂອງທ່ານ.",

    userCancelledSubj: "ການໂອນເງິນຖືກຍົກເລີກ",
    userCancelledGreet: "ທ່ານ {name},",
    userCancelledIntro: "ພວກເຮົາຢືນຢັນວ່າການໂອນເງິນຂອງທ່ານຖືກຍົກເລີກແລ້ວ. ບໍ່ມີຈຳນວນເງິນໃດຖືກຫັກຈາກບັນຊີຂອງທ່ານ.",
    userCancelledFooter: "ຖ້າທ່ານບໍ່ແມ່ນຜູ້ເລີ່ມການຍົກເລີກນີ້, ກະລຸນາຕິດຕໍ່ຝ່າຍບໍລິການລູກຄ້າຂອງພວກເຮົາທັນທີ.",

    adminConnectionSubj: "ການເຊື່ອມຕໍ່ລູກຄ້າໃໝ່ໃນ App Pay",
    adminConnectionGreet: "ສະບາຍດີ ຜູ້ດູແລລະບົບ,",
    adminConnectionIntro: "ລູກຄ້າຕໍ່ໄປນີ້ຫາກໍ່ເຂົ້າສູ່ບັນຊີ App Pay ຂອງພວກເຂົາແລ້ວ. ນີ້ແມ່ນລາຍລະອຽດການເຊື່ອມຕໍ່:",
    adminConnectionFooter: "ອີເມວນີ້ຖືກສົ່ງໄປຫາຜູ້ດູແລລະບົບໂດຍອັດຕະໂນມັດທຸກຄັ້ງທີ່ລູກຄ້າເຂົ້າສູ່ລະບົບ."
},

// ═══════════════════════════════════════════════════════
// LANGUE : NÉPALAIS (ne)
// ═══════════════════════════════════════════════════════
ne: {
    loginSubj: "App Pay मा स्वागत छ – तपाईंको लगइन प्रमाणहरू",
    loginGreet: "प्रिय {name},",
    loginIntro: "हामी App Pay मा तपाईंको खाता खोलिएको पुष्टि गर्न पाउँदा खुसी छौं। यहाँ तपाईंको लगइन प्रमाणहरू छन्:",
    loginFooter: "तपाईंको सुरक्षाको लागि, यो जानकारी गोप्य राख्नुहोस्। आफ्नो PIN कोड कहिल्यै कसैसँग साझा नगर्नुहोस्।",
    
    actSubj: "App Pay स्थानान्तरणको लागि तपाईंको सक्रियण कोड",
    actGreet: "प्रिय {name},",
    actIntro: "तपाईंको लेनदेनको सुरक्षा सुनिश्चित गर्न, कृपया तल आफ्नो व्यक्तिगत सक्रियण कोड हेर्नुहोस्:",
    actFooter: "यो कोड सुरक्षित ठाउँमा राख्नुहोस्। यो पूर्ण रूपमा व्यक्तिगत र गोप्य छ।",

    successSubj: "तपाईंको App Pay स्थानान्तरणको पुष्टि",
    successGreet: "प्रिय {name},",
    successIntro: "हामी पुष्टि गर्छौं कि तपाईंको स्थानान्तरण सफलतापूर्वक प्रशोधन भएको छ। यहाँ सारांश छ:",
    successFooter: "रकम 24 देखि 48 कार्य घण्टा भित्र लाभग्राहीको खातामा जम्मा गरिनेछ। तपाईंको विश्वासको लागि धन्यवाद।",

    failedSubj: "चेतावनी: तपाईंको App Pay स्थानान्तरण अवरुद्ध गरियो",
    failedGreet: "प्रिय {name},",
    failedIntro: "तपाईंको खातामा स्थानान्तरण प्रयास हाम्रो सुरक्षा प्रणालीहरूले अवरुद्ध गरेको छ। यहाँ विवरण छ:",
    failedFooter: "कुनै रकम डेबिट गरिएको छैन। थप जानकारीको लागि कृपया ग्राहक सेवामा सम्पर्क गर्नुहोस्।",

    pendingSubj: "तपाईंको App Pay स्थानान्तरण प्रमाणीकरणको प्रतीक्षामा छ",
    pendingGreet: "प्रिय {name},",
    pendingIntro: "तपाईंको स्थानान्तरण दर्ता भएको छ र हाल हाम्रो प्रशासनिक सेवाद्वारा प्रमाणीकरणको प्रतीक्षामा छ।",
    pendingFooter: "स्थानान्तरण प्रशोधन भएपछि तपाईंले सूचना प्राप्त गर्नुहुनेछ।",

    validatedSubj: "प्रशासनद्वारा स्थानान्तरण प्रमाणित गरियो",
    validatedGreet: "प्रिय {name},",
    validatedIntro: "तपाईंको पर्खाइमा रहेको स्थानान्तरण हाम्रो प्रशासनिक सेवाद्वारा प्रमाणित भयो र सफलतापूर्वक प्रशोधन गरियो।",
    validatedFooter: "रकम 24 देखि 48 कार्य घण्टा भित्र लाभग्राहीको खातामा जम्मा गरिनेछ। तपाईंको विश्वासको लागि धन्यवाद।",

    cancelledSubj: "प्रशासनद्वारा स्थानान्तरण रद्द गरियो",
    cancelledGreet: "प्रिय {name},",
    cancelledIntro: "तपाईंको स्थानान्तरण हाम्रो प्रशासनिक सेवाद्वारा रद्द गरियो। रकम तपाईंको खातामा पुनः जम्मा गरियो।",
    cancelledFooter: "तपाईं आफ्नो ग्राहक पोर्टलमा नयाँ ब्यालेन्स जाँच गर्न सक्नुहुन्छ।",

    refundSubj: "स्थानान्तरण फिर्ता गरियो",
    refundGreet: "प्रिय {name},",
    refundIntro: "तपाईंको स्थानान्तरणको रकम तपाईंलाई फिर्ता गरियो। यहाँ विवरण छ:",
    refundFooter: "रकम तपाईंको खातामा पुनः जम्मा गरियो। तपाईंको बुझाइको लागि धन्यवाद।",

    userCancelledSubj: "स्थानान्तरण रद्द गरियो",
    userCancelledGreet: "प्रिय {name},",
    userCancelledIntro: "हामी पुष्टि गर्छौं कि तपाईंको स्थानान्तरण रद्द गरियो। तपाईंको खाताबाट कुनै रकम डेबिट गरिएको छैन।",
    userCancelledFooter: "यदि तपाईंले यो रद्दीकरण सुरु गर्नुभएको छैन भने, कृपया तुरुन्तै हाम्रो ग्राहक सेवामा सम्पर्क गर्नुहोस्।",

    adminConnectionSubj: "App Pay मा नयाँ ग्राहक जडान",
    adminConnectionGreet: "नमस्ते प्रशासक,",
    adminConnectionIntro: "निम्न ग्राहकले भर्खरै आफ्नो App Pay खातामा लगइन गरेको छ। यहाँ जडान विवरण छ:",
    adminConnectionFooter: "ग्राहक लगइन गर्दा हरेक पटक यो इमेल स्वचालित रूपमा प्रशासकलाई पठाइन्छ।"
},
    // ═══════════════════════════════════════════════════════
    // LANGUE : MALGACHE (mg)
    // ═══════════════════════════════════════════════════════
    mg: {
        loginSubj: "Tongasoa eto App Pay – Ny mombamomba anao hiditra",
        loginGreet: "Malala {name},",
        loginIntro: "Faly izahay manamarina ny fisokafan'ny kaontinao ao amin'ny App Pay. Ireto ny mombamomba anao hiditra:",
        loginFooter: "Ho fiarovana anao, tazony ho tsiambaratelo ity vaovao ity. Aza mizara ny kaody PIN-nao amin'iza na iza.",
        
        actSubj: "Ny kaody fanokafana anao ho an'ny famindrana App Pay",
        actGreet: "Malala {name},",
        actIntro: "Mba hiantohana ny fiarovana ny fifanakalozanao, jereo etsy ambany ny kaody fanokafana manokana anao:",
        actFooter: "Tazony ao amin'ny toerana azo antoka ity kaody ity. Izy io dia manokana sy tsiambaratelo.",

        successSubj: "Fanamarinana ny famindrana App Pay",
        successGreet: "Malala {name},",
        successIntro: "Manamarina izahay fa vita soa aman-tsara ny famindranao. Ity ny topi-maso:",
        successFooter: "Hampidirina ao amin'ny kaontin'ny mpandray ny vola ao anatin'ny 24 ka hatramin'ny 48 ora fiasana. Misaotra anao tamin'ny fitokisanao.",

        failedSubj: "Fampitandremana: Nosakanana ny famindrana App Pay",
        failedGreet: "Malala {name},",
        failedIntro: "Nisy fikasana famindrana tao amin'ny kaontinao no nosakanan'ny rafitra fiarovana anay. Ity ny antsipiriany:",
        failedFooter: "Tsy nisy vola nalaina. Mifandraisa amin'ny serivisy ho an'ny mpanjifa raha mila fanazavana fanampiny.",

        pendingSubj: "Miandry fanamarinana ny famindrana App Pay",
        pendingGreet: "Malala {name},",
        pendingIntro: "Voasoratra ny famindranao ary miandry fanamarinana avy amin'ny serivisy fitantanana anay izao.",
        pendingFooter: "Hahazo fampandrenesana ianao rehefa vita ny famindrana.",

        validatedSubj: "Nohamarinin'ny fitantanana ny famindrana",
        validatedGreet: "Malala {name},",
        validatedIntro: "Ny famindrana miandry anao dia nohamarinin'ny serivisy fitantanana anay ary vita soa aman-tsara.",
        validatedFooter: "Hampidirina ao amin'ny kaontin'ny mpandray ny vola ao anatin'ny 24 ka hatramin'ny 48 ora fiasana. Misaotra anao tamin'ny fitokisanao.",

        cancelledSubj: "Nofoanana ny famindrana",
        cancelledGreet: "Malala {name},",
        cancelledIntro: "Nofoanana ny famindranao. Naverina tao amin'ny kaontinao ny vola.",
        cancelledFooter: "Azonao jerena ao amin'ny portal mpanjifanao ny fifandanjana vaovao.",

        refundSubj: "Naverina ny vola famindrana",
        refundGreet: "Malala {name},",
        refundIntro: "Naverina taminao ny vola famindranao. Ity ny antsipiriany:",
        refundFooter: "Naverina tao amin'ny kaontinao ny vola. Misaotra anao tamin'ny fahatakaranao.",

        userCancelledSubj: "Nofoanana ny famindrana",
        userCancelledGreet: "Malala {name},",
        userCancelledIntro: "Manamarina izahay fa nofoanana ny famindranao. Tsy nisy vola nalaina tao amin'ny kaontinao.",
        userCancelledFooter: "Raha tsy ianao no nanomboka izao fanafoanana izao, mifandraisa avy hatrany amin'ny serivisy mpanjifanay.",

        adminConnectionSubj: "Fifandraisana mpanjifa vaovao ao amin'ny App Pay",
        adminConnectionGreet: "Salama ry Admin,",
        adminConnectionIntro: "Vao niditra tao amin'ny kaontiny App Pay ilay mpanjifa manaraka. Ity ny antsipiriany:",
        adminConnectionFooter: "Alefa ho azy any amin'ny admin ity mailaka ity isaky ny miditra ny mpanjifa."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : CHICHEWA (ny)
    // ═══════════════════════════════════════════════════════
    ny: {
        loginSubj: "Takulandirani ku App Pay – Chidziwitso chanu cholowera",
        loginGreet: "Wokondedwa {name},",
        loginIntro: "Tili okondwa kutsimikizira kutsegulidwa kwa akaunti yanu ku App Pay. Nayi chidziwitso chanu cholowera:",
        loginFooter: "Kuti mutetezeke, sungani chidziwitso ichi mwachinsinsi. Musagawane PIN yanu ndi aliyense.",
        
        actSubj: "Khodi yanu yoyambitsa yolumikizira ku App Pay",
        actGreet: "Wokondedwa {name},",
        actIntro: "Kuti titsimikizire chitetezo cha malonda anu, chonde onani khodi yanu yoyambitsa pansipa:",
        actFooter: "Sungani khodi iyi pamalo otetezeka. Ndi yanu nokha komanso yachinsinsi.",

        successSubj: "Kutsimikizira kutumiza kwanu kwa App Pay",
        successGreet: "Wokondedwa {name},",
        successIntro: "Tikutsimikizira kuti kutumiza kwanu kwayenda bwino. Nayi chidule:",
        successFooter: "Ndalama zidzayikidwa mu akaunti ya wolandira mkati mwa maola 24 mpaka 48 a ntchito. Zikomo chifukwa cha chikhulupiriro chanu.",

        failedSubj: "Chenjezo: Kutumiza kwanu kwa App Pay kwayimitsidwa",
        failedGreet: "Wokondedwa {name},",
        failedIntro: "Kuyesa kutumiza mu akaunti yanu kwayimitsidwa ndi machitidwe athu achitetezo. Nayi tsatanetsatane:",
        failedFooter: "Palibe ndalama zomwe zachotsedwa. Chonde lumikizanani ndi kasitomala kuti mudziwe zambiri.",

        pendingSubj: "Kutumiza kwanu kwa App Pay kukudikira kutsimikizika",
        pendingGreet: "Wokondedwa {name},",
        pendingIntro: "Kutumiza kwanu kwalembedwa ndipo pakadali pano kukudikira kutsimikizidwa ndi ntchito yathu yoyang'anira.",
        pendingFooter: "Mudzalandira chidziwitso kutumiza kwanu mukatha kukonzedwa.",

        validatedSubj: "Kutumiza kwatsimikizidwa ndi oyang'anira",
        validatedGreet: "Wokondedwa {name},",
        validatedIntro: "Kutumiza kwanu komwe kunali kudikira kwatsimikizidwa ndi ntchito yathu yoyang'anira ndipo kwayenda bwino.",
        validatedFooter: "Ndalama zidzayikidwa mu akaunti ya wolandira mkati mwa maola 24 mpaka 48 a ntchito. Zikomo chifukwa cha chikhulupiriro chanu.",

        cancelledSubj: "Kutumiza kwaletsedwa ndi oyang'anira",
        cancelledGreet: "Wokondedwa {name},",
        cancelledIntro: "Kutumiza kwanu kwaletsedwa ndi ntchito yathu yoyang'anira. Ndalama zobwezeredwa ku akaunti yanu.",
        cancelledFooter: "Mutha kuyang'ana ndalama zanu zatsopano mu malo anu amakasitomala.",

        refundSubj: "Kutumiza kwabwezeredwa",
        refundGreet: "Wokondedwa {name},",
        refundIntro: "Ndalama zomwe mudatumiza zabwezeredwa kwa inu. Nayi tsatanetsatane:",
        refundFooter: "Ndalama zobwezeredwa ku akaunti yanu. Zikomo chifukwa chomvetsa chisoni.",

        userCancelledSubj: "Kutumiza kwaletsedwa",
        userCancelledGreet: "Wokondedwa {name},",
        userCancelledIntro: "Tikutsimikizira kuti kutumiza kwanu kwaletsedwa. Palibe ndalama zomwe zachotsedwa mu akaunti yanu.",
        userCancelledFooter: "Ngati simunayambitse kuletsa uku, chonde lumikizanani ndi kasitomala wathu nthawi yomweyo.",

        adminConnectionSubj: "Kulumikizana kwatsopano kwa kasitomala pa App Pay",
        adminConnectionGreet: "Moni Admin,",
        adminConnectionIntro: "Kasitomala wotsatira walowa kumene mu akaunti yake ya App Pay. Nayi tsatanetsatane:",
        adminConnectionFooter: "Imelo iyi imatumizidwa mwachindunji kwa admin nthawi iliyonse kasitomala akalowa."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : OROMO (om)
    // ═══════════════════════════════════════════════════════
    om: {
        loginSubj: "Baga nagaan dhuftan App Pay – Odeeffannoo seenaa keessan",
        loginGreet: "Kabajamaa {name},",
        loginIntro: "App Pay irratti herregni keessan banamuu isaa mirkaneessuuf gammachuu qabna. Kunis odeeffannoo seenaa keessan:",
        loginFooter: "Nageenya keessaniif, odeeffannoo kana iccitiin qabadhaa. Koodii PIN keessan nama kamiin iyyuu hin qoodinaa.",
        
        actSubj: "Koodii aktiveeshinii ergaa App Pay keessan",
        actGreet: "Kabajamaa {name},",
        actIntro: "Nageenya daldala keessan mirkaneessuuf, maaloo koodii aktiveeshinii dhuunfaa keessan gadii ilaalaa:",
        actFooter: "Koodii kana bakka nagaan qabadhaa. Dhuunfaa fi iccitiidha.",

        successSubj: "Mirkaneessa ergaa App Pay keessan",
        successGreet: "Kabajamaa {name},",
        successIntro: "Ergaan keessan milkaa'inaan hojjetamuu isaa mirkaneessina. Kunis cuunfaa:",
        successFooter: "Maallaqni sa'aatii hojii 24 hanga 48 keessatti herrega fudhataa keessa galcha. Amanamummaa keessaniif galatoomaa.",

        failedSubj: "Akeekkachiisa: Ergaan App Pay keessan dhorkameera",
        failedGreet: "Kabajamaa {name},",
        failedIntro: "Yaaliin ergaa herrega keessan irratti godhame sirna nageenya keenyaan dhorkameera. Kunis bal'ina:",
        failedFooter: "Maallaqni hin hir'ifamne. Odeeffannoo dabalataaf maaloo tajaajila maamiltootaa qunnamaa.",

        pendingSubj: "Ergaan App Pay keessan mirkaneessa eegaa jira",
        pendingGreet: "Kabajamaa {name},",
        pendingIntro: "Ergaan keessan galmeeffameera akkasumas tajaajila bulchiinsa keenyaan mirkaneessa eegaa jira.",
        pendingFooter: "Ergaan keessan yeroo hojjetamu beeksisa argattu.",

        validatedSubj: "Ergaan bulchiinsaan mirkanaa'e",
        validatedGreet: "Kabajamaa {name},",
        validatedIntro: "Ergaan keessan eegaa ture tajaajila bulchiinsa keenyaan mirkanaa'ee milkaa'inaan hojjetameera.",
        validatedFooter: "Maallaqni sa'aatii hojii 24 hanga 48 keessatti herrega fudhataa keessa galcha. Amanamummaa keessaniif galatoomaa.",

        cancelledSubj: "Ergaan bulchiinsaan haqame",
        cancelledGreet: "Kabajamaa {name},",
        cancelledIntro: "Ergaan keessan tajaajila bulchiinsa keenyaan haqameera. Maallaqni herrega keessanitti deebi'ee galmeeffameera.",
        cancelledFooter: "Haqaa haaraa keessan poortaalii maamilaa keessan irratti ilaaluu dandeessu.",

        refundSubj: "Ergaan deebi'ee kaffalame",
        refundGreet: "Kabajamaa {name},",
        refundIntro: "Maallaqni ergaa keessan isiniif deebi'ee kaffalameera. Kunis bal'ina:",
        refundFooter: "Maallaqni herrega keessanitti deebi'ee galmeeffameera. Hubannoo keessaniif galatoomaa.",

        userCancelledSubj: "Ergaan haqame",
        userCancelledGreet: "Kabajamaa {name},",
        userCancelledIntro: "Ergaan keessan haqamuu isaa mirkaneessina. Herrega keessan irraa maallaqni hin hir'ifamne.",
        userCancelledFooter: "Yoo haquun kun isin hin taane, maaloo tajaajila maamiltootaa keenya battalumatti qunnamaa.",

        adminConnectionSubj: "Walqunnamtii maamilaa haaraa App Pay irratti",
        adminConnectionGreet: "Akkam Bulchaa,",
        adminConnectionIntro: "Maamilli armaan gadii amma herrega App Pay isaatti seenee jira. Kunis bal'ina walqunnamtii:",
        adminConnectionFooter: "Imeeliin kun yeroo maamilli seenu hundaaf bulchaaf ofumaan ergama."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : KIRUNDI (rn)
    // ═══════════════════════════════════════════════════════
    rn: {
        loginSubj: "Ikaze kuri App Pay – Uburyo bwo kwinjira",
        loginGreet: "Ndaragiwe {name},",
        loginIntro: "Tunezerewe no kwemeza ko konti yawe yafunguwe kuri App Pay. Dore uburyo bwo kwinjira:",
        loginFooter: "Ku bw'umutekano wawe, guma ufise aya makuru mu ibanga. Ntukigere usangiza umuntu uwo ari we wese kode yawe ya PIN.",
        
        actSubj: "Kode yawe yo kwemeza amafaranga yoherejwe kuri App Pay",
        actGreet: "Ndaragiwe {name},",
        actIntro: "Kugira ngo turinde umutekano w'ubudandaji bwawe, reba kode yawe bwite yo kwemeza hepfo:",
        actFooter: "Bika iyi kode ahantu heza. Ni iyawe bwite kandi ni ibanga.",

        successSubj: "Kwemeza ko amafaranga yoherejwe kuri App Pay",
        successGreet: "Ndaragiwe {name},",
        successIntro: "Turakumenyesha ko amafaranga watanze yoherejwe neza. Dore incamake:",
        successFooter: "Amafaranga azinjira kuri konti y'uwakiriye mu masaha 24 kugeza kuri 48 y'akazi. Urakoze ku kwizera kwawe.",

        failedSubj: "Iburira: Amafaranga wohereje kuri App Pay yahagaritswe",
        failedGreet: "Ndaragiwe {name},",
        failedIntro: "Ugerageza kohereza amafaranga kuri konti yawe yahagaritswe n'uburyo bwacu bwo kurinda umutekano. Dore amakuru:",
        failedFooter: "Nta mafaranga yakuwe. Uramutse ukeneye ayandi makuru, hamagara abajejwe abakiriya.",

        pendingSubj: "Amafaranga wohereje kuri App Pay arindiriye kwemezwa",
        pendingGreet: "Ndaragiwe {name},",
        pendingIntro: "Amafaranga wohereje yanditswe kandi arindiriye kwemezwa n'ishami ryacu ry'ubutegetsi.",
        pendingFooter: "Uzoronka ubutumwa igihe amafaranga azoba yemejwe.",

        validatedSubj: "Amafaranga yemejwe n'ubutegetsi",
        validatedGreet: "Ndaragiwe {name},",
        validatedIntro: "Amafaranga wari urindiriye yemejwe n'ishami ryacu ry'ubutegetsi kandi yoherejwe neza.",
        validatedFooter: "Amafaranga azinjira kuri konti y'uwakiriye mu masaha 24 kugeza kuri 48 y'akazi. Urakoze ku kwizera kwawe.",

        cancelledSubj: "Amafaranga yahagaritswe n'ubutegetsi",
        cancelledGreet: "Ndaragiwe {name},",
        cancelledIntro: "Amafaranga wohereje yahagaritswe n'ishami ryacu ry'ubutegetsi. Amafaranga asubijwe kuri konti yawe.",
        cancelledFooter: "Ushobora kuraba amafaranga asigaye kuri portal yawe y'abakiriya.",

        refundSubj: "Amafaranga yasubijwe",
        refundGreet: "Ndaragiwe {name},",
        refundIntro: "Amafaranga wari wohereje yasubijwe kuri wewe. Dore amakuru:",
        refundFooter: "Amafaranga asubijwe kuri konti yawe. Urakoze ku kwumva.",

        userCancelledSubj: "Amafaranga yahagaritswe",
        userCancelledGreet: "Ndaragiwe {name},",
        userCancelledIntro: "Turakumenyesha ko amafaranga wohereje yahagaritswe. Nta mafaranga yakuwe kuri konti yawe.",
        userCancelledFooter: "Nimba atari wewe watangije uku guhagarika, hamagara abajejwe abakiriya bwangu.",

        adminConnectionSubj: "Ihuza rishasha ry'umukiriya kuri App Pay",
        adminConnectionGreet: "Muraho Mugenga,",
        adminConnectionIntro: "Umukiriya akurikira aherutse kwinjira kuri konti ye ya App Pay. Dore amakuru y'ihuza:",
        adminConnectionFooter: "Iyi imeyili yoherezwa kuri wewe mu buryo bwikora igihe umukiriya wese yinjiye."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : KINYARWANDA (rw)
    // ═══════════════════════════════════════════════════════
    rw: {
        loginSubj: "Murakaza neza kuri App Pay – Uburyo bwo kwinjira",
        loginGreet: "Mubyeyi {name},",
        loginIntro: "Twishimye kwemeza ko konti yawe yafunguwe kuri App Pay. Dore uburyo bwo kwinjira:",
        loginFooter: "Ku bw'umutekano wawe, komeza ufite aya makuru mu ibanga. Ntukigere usangiza umuntu uwo ari we wese kode yawe ya PIN.",
        
        actSubj: "Kode yawe yo kwemeza amafaranga yoherejwe kuri App Pay",
        actGreet: "Mubyeyi {name},",
        actIntro: "Kugira ngo turinde umutekano w'ubucuruzi bwawe, reba kode yawe bwite yo kwemeza hepfo:",
        actFooter: "Bika iyi kode ahantu heza. Ni iyawe bwite kandi ni ibanga.",

        successSubj: "Kwemeza ko amafaranga yoherejwe kuri App Pay",
        successGreet: "Mubyeyi {name},",
        successIntro: "Turakumenyesha ko amafaranga watanze yoherejwe neza. Dore incamake:",
        successFooter: "Amafaranga azinjira kuri konti y'uwakiriye mu masaha 24 kugeza kuri 48 y'akazi. Urakoze ku kwizera kwawe.",

        failedSubj: "Iburira: Amafaranga wohereje kuri App Pay yahagaritswe",
        failedGreet: "Mubyeyi {name},",
        failedIntro: "Ugerageza kohereza amafaranga kuri konti yawe yahagaritswe n'uburyo bwacu bwo kurinda umutekano. Dore amakuru:",
        failedFooter: "Nta mafaranga yakuwe. Uramutse ukeneye ayandi makuru, hamagara abajejwe abakiriya.",

        pendingSubj: "Amafaranga wohereje kuri App Pay arindiriye kwemezwa",
        pendingGreet: "Mubyeyi {name},",
        pendingIntro: "Amafaranga wohereje yanditswe kandi arindiriye kwemezwa n'ishami ryacu ry'ubutegetsi.",
        pendingFooter: "Uzahabwa ubutumwa igihe amafaranga azoba yemejwe.",

        validatedSubj: "Amafaranga yemejwe n'ubutegetsi",
        validatedGreet: "Mubyeyi {name},",
        validatedIntro: "Amafaranga wari urindiriye yemejwe n'ishami ryacu ry'ubutegetsi kandi yoherejwe neza.",
        validatedFooter: "Amafaranga azinjira kuri konti y'uwakiriye mu masaha 24 kugeza kuri 48 y'akazi. Urakoze ku kwizera kwawe.",

        cancelledSubj: "Amafaranga yahagaritswe n'ubutegetsi",
        cancelledGreet: "Mubyeyi {name},",
        cancelledIntro: "Amafaranga wohereje yahagaritswe n'ishami ryacu ry'ubutegetsi. Amafaranga asubijwe kuri konti yawe.",
        cancelledFooter: "Ushobora kuraba amafaranga asigaye kuri portal yawe y'abakiriya.",

        refundSubj: "Amafaranga yasubijwe",
        refundGreet: "Mubyeyi {name},",
        refundIntro: "Amafaranga wari wohereje yasubijwe kuri wewe. Dore amakuru:",
        refundFooter: "Amafaranga asubijwe kuri konti yawe. Urakoze ku kwumva.",

        userCancelledSubj: "Amafaranga yahagaritswe",
        userCancelledGreet: "Mubyeyi {name},",
        userCancelledIntro: "Turakumenyesha ko amafaranga wohereje yahagaritswe. Nta mafaranga yakuwe kuri konti yawe.",
        userCancelledFooter: "Niba atari wowe watangije uku guhagarika, hamagara abajejwe abakiriya bwangu.",

        adminConnectionSubj: "Ihuza rishya ry'umukiriya kuri App Pay",
        adminConnectionGreet: "Muraho Mugenga,",
        adminConnectionIntro: "Umukiriya ukurikira aherutse kwinjira kuri konti ye ya App Pay. Dore amakuru y'ihuza:",
        adminConnectionFooter: "Iyi imeyili yoherezwa kuri wewe mu buryo bwikora igihe umukiriya wese yinjiye."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : SANGO (sg)
    // ═══════════════════════════════════════════════════════
    sg: {
        loginSubj: "Nde tënë na App Pay – Sango ti lëkëngö",
        loginGreet: "Koli ti {name},",
        loginIntro: "Nde tënë na yâ ti App Pay. Azo ti lëkëngö ni la:",
        loginFooter: "Ti tene a yeke na siriri, zia sango so na yâ ti siriri. Zia kode ti PIN ti mo na zo oko pëpe.",
        
        actSubj: "Kode ti lëkëngö ti mo ti kua ti App Pay",
        actGreet: "Koli ti {name},",
        actIntro: "Ti bata siriri ti kua ti mo, bâ kode ti mo ti lëkëngö na gbe ni:",
        actFooter: "Zia kode so na ndo ti siriri. A yeke ti mo mveni na yâ ti siriri.",

        successSubj: "Gbegberê ti maboko ti App Pay ti mo",
        successGreet: "Koli ti {name},",
        successIntro: "Maboko ti mo asigigi na lege ni. Tënë ti aye so la:",
        successFooter: "Nginza a yeke kâ na yâ ti konti ti wande yamba na yâ ti ngbonga 24 si na 48 ti kua. Mbi yeke kâ na maboko ti mo ndali ti maboko ti mo.",
        
        failedSubj: "Nzenge: A bâ maboko ti mo ti App Pay",
        failedGreet: "Koli ti {name},",
        failedIntro: "A bâ maboko ti mo na lege ti siriri ti e. Tënë ti aye so la:",
        failedFooter: "A zö nginza oko pëpe. Iri a wakua ti e ti wâli tënë.",

        pendingSubj: "Maboko ti mo ti App Pay ayeke kâ",
        pendingGreet: "Koli ti {name},",
        pendingIntro: "A sû maboko ti mo na yâ ti kua ti e. Ayeke kâ ti bâ tënë ti a wakua ti e.",
        pendingFooter: "Mo yeke bâ maboko ti mo na pekoni ti kua ti mo.",

        validatedSubj: "A hinga maboko ti mo na lege ti a wakua",
        validatedGreet: "Koli ti {name},",
        validatedIntro: "A hinga maboko ti mo so a yeke kâ. A sigigi na lege ni.",
        validatedFooter: "Nginza a yeke kâ na yâ ti konti ti wande yamba. Mbi yeke kâ na maboko ti mo ndali ti maboko ti mo.",

        cancelledSubj: "A leke maboko ti mo na lege ti a wakua",
        cancelledGreet: "Koli ti {name},",
        cancelledIntro: "A leke maboko ti mo. A zî nginza so na yâ ti konti ti mo.",
        cancelledFooter: "Mo yeke bâ nginza ti mo na yâ ti kua ti mo.",

        refundSubj: "A zî maboko ti mo",
        refundGreet: "Koli ti {name},",
        refundIntro: "A zî nginza ti maboko ti mo na ndö ti mo. Tënë ti aye so la:",
        refundFooter: "A zî nginza na yâ ti konti ti mo. Mbi yeke kâ na maboko ti mo ndali ti maboko ti mo.",

        userCancelledSubj: "A leke maboko ti mo",
        userCancelledGreet: "Koli ti {name},",
        userCancelledIntro: "A leke maboko ti mo. A zö nginza oko pëpe na yâ ti konti ti mo.",
        userCancelledFooter: "Kâ ti mo nde, iri a wakua ti e ti wâli tënë.",

        adminConnectionSubj: "Maboko ti koli ti App Pay",
        adminConnectionGreet: "Bara na mo Mbi,",
        adminConnectionIntro: "Koli so la a luti na kua ti App Pay ti lo. Tënë ti aye so la:",
        adminConnectionFooter: "A yeke kâ na maboko ti mo na lege ti a wakua."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : SHONA (sn)
    // ═══════════════════════════════════════════════════════
    sn: {
        loginSubj: "Tinokugamuchirai ku App Pay – Ruzivo rwenyu rwekupinda",
        loginGreet: "Wadiwa {name},",
        loginIntro: "Tinofara kusimbisa kuvhurwa kweakaundi yenyu ku App Pay. Heano ruzivo rwenyu rwekupinda:",
        loginFooter: "Kuti muve vakachengeteka, chengetedzai ruzivo urwu muchiviga. Musambofa mukagovana PIN yenyu nemunhu.",
        
        actSubj: "Kodhi yenyu yekuvhura yekutumira ku App Pay",
        actGreet: "Wadiwa {name},",
        actIntro: "Kuti tive nechokwadi chekuchengetedzeka kwekutengeserana kwenyu, ndapota onai kodhi yenyu yekuvhura pasi apa:",
        actFooter: "Chengetedzai kodhi iyi panzvimbo yakachengeteka. Ndeyenyu mega uye ndeyekuviga.",

        successSubj: "Kusimbiswa kwekutumira kwenyu ku App Pay",
        successGreet: "Wadiwa {name},",
        successIntro: "Tinosimbisa kuti kutumira kwenyu kwakaitwa nemufaro. Heino pfupiso:",
        successFooter: "Mari ichaiswa muakaundi yemugamuchiri mukati memaawa 24 kusvika 48 ebasa. Tinokutendai nekutenda kwenyu.",

        failedSubj: "Yambiro: Kutumira kwenyu ku App Pay kwakavharwa",
        failedGreet: "Wadiwa {name},",
        failedIntro: "Kuedza kutumira muakaundi yenyu kwakavharwa nemasisitimu edu ekuchengetedza. Heano ruzivo:",
        failedFooter: "Hapana mari yakabviswa. Ndapota taurai nevevatengi kuti muwane rumwe ruzivo.",

        pendingSubj: "Kutumira kwenyu ku App Pay kwakamirira kusimbiswa",
        pendingGreet: "Wadiwa {name},",
        pendingIntro: "Kutumira kwenyu kwakanyorwa uye parizvino kwakamirira kusimbiswa nedhipatimendi redu rekutonga.",
        pendingFooter: "Muchawana chiziviso kana kutumira kwacho kwaitwa.",

        validatedSubj: "Kutumira kwakasimbiswa nevatongi",
        validatedGreet: "Wadiwa {name},",
        validatedIntro: "Kutumira kwenyu kwaimirira kwakasimbiswa nedhipatimendi redu rekutonga uye kwakaitwa nemufaro.",
        validatedFooter: "Mari ichaiswa muakaundi yemugamuchiri mukati memaawa 24 kusvika 48 ebasa. Tinokutendai nekutenda kwenyu.",

        cancelledSubj: "Kutumira kwakamiswa nevatongi",
        cancelledGreet: "Wadiwa {name},",
        cancelledIntro: "Kutumira kwenyu kwakamiswa nedhipatimendi redu rekutonga. Mari yadzorerwa muakaundi yenyu.",
        cancelledFooter: "Munogona kutarisa mari yenyu itsva muportal yevatengi.",

        refundSubj: "Kutumira kwadzoserwa",
        refundGreet: "Wadiwa {name},",
        refundIntro: "Mari yekutumira kwenyu yadzoserwa kwamuri. Heano ruzivo:",
        refundFooter: "Mari yadzorerwa muakaundi yenyu. Tinokutendai nekunzwisisa kwenyu.",

        userCancelledSubj: "Kutumira kwamiswa",
        userCancelledGreet: "Wadiwa {name},",
        userCancelledIntro: "Tinosimbisa kuti kutumira kwenyu kwamiswa. Hapana mari yakabviswa muakaundi yenyu.",
        userCancelledFooter: "Kana musiri imi makatanga kumisa uku, ndapota taurai nevatengi vedu nekukasira.",

        adminConnectionSubj: "Kubatana kutsva kwemutengi pa App Pay",
        adminConnectionGreet: "Mhoro Mutongi,",
        adminConnectionIntro: "Mutengi anotevera apinda mune yake App Pay akaundi. Heano ruzivo rwekubatana:",
        adminConnectionFooter: "Imeyili iyi inotumirwa kwauri nekukasira pese mutengi apinda."
    },

    // ═══════════════════════════════════════════════════════
    // LANGUE : SOMALI (so)
    // ═══════════════════════════════════════════════════════
    so: {
        loginSubj: "Ku soo dhawoow App Pay – Aqoonsigaaga gelitaanka",
        loginGreet: "Gacaliye {name},",
        loginIntro: "Waxaan ku faraxsanahay inaan xaqiijino furitaanka akoonkaaga App Pay. Waa kuwan aqoonsigaaga gelitaanka:",
        loginFooter: "Ammaankaaga, hayso macluumaadkan si qarsoodi ah. Weligaa ha la wadaagin koodkaaga PIN qofna.",
        
        actSubj: "Koodkaaga hawlgelinta wareejinta App Pay",
        actGreet: "Gacaliye {name},",
        actIntro: "Si loo xaqiijiyo ammaanka macaamiladaada, fadlan hoos ka eeg koodkaaga hawlgelinta gaarka ah:",
        actFooter: "Koodkan ku hayso meel ammaan ah. Waa mid shaqsi ah oo qarsoodi ah.",

        successSubj: "Xaqiijinta wareejintaada App Pay",
        successGreet: "Gacaliye {name},",
        successIntro: "Waxaan xaqiijinaynaa in wareejintaada si guul leh loo habeeyay. Waa kan soo koobidda:",
        successFooter: "Lacagta waxaa lagu shubi doonaa akoonka qaataha gudaha 24 ilaa 48 saacadood shaqo. Waad ku mahadsan tahay kalsoonidaada.",

        failedSubj: "Digniin: Wareejintaada App Pay waa la xannibay",
        failedGreet: "Gacaliye {name},",
        failedIntro: "Isku dayga wareejin akoonkaaga waxaa xannibay nidaamyadeena ammaanka. Waa kuwan faahfaahinta:",
        failedFooter: "Lacag lama jarin. Fadlan la xiriir adeegga macaamiisha macluumaad dheeraad ah.",

        pendingSubj: "Wareejintaada App Pay waxay sugaysaa xaqiijin",
        pendingGreet: "Gacaliye {name},",
        pendingIntro: "Wareejintaada waa la diiwaangeliyay waxayna hadda sugaysaa xaqiijin ka timid adeegga maamulkeena.",
        pendingFooter: "Waxaad heli doontaa ogeysiis isla marka wareejinta la habeeyo.",

        validatedSubj: "Wareejinta waxaa xaqiijiyay maamulka",
        validatedGreet: "Gacaliye {name},",
        validatedIntro: "Wareejintaada sugaysay waxaa xaqiijiyay adeegga maamulkeena waxaana si guul leh loo habeeyay.",
        validatedFooter: "Lacagta waxaa lagu shubi doonaa akoonka qaataha gudaha 24 ilaa 48 saacadood shaqo. Waad ku mahadsan tahay kalsoonidaada.",

        cancelledSubj: "Wareejinta waxaa joojiyay maamulka",
        cancelledGreet: "Gacaliye {name},",
        cancelledIntro: "Wareejintaada waxaa joojiyay adeegga maamulkeena. Lacagta dib ayaa loo shubay akoonkaaga.",
        cancelledFooter: "Waxaad ka hubin kartaa hadhaagaaga cusub bogga macaamiisha.",

        refundSubj: "Wareejinta waa la celiyay",
        refundGreet: "Gacaliye {name},",
        refundIntro: "Lacagta wareejintaada waa lagu celiyay. Waa kuwan faahfaahinta:",
        refundFooter: "Lacagta dib ayaa loo shubay akoonkaaga. Waad ku mahadsan tahay fahamkaaga.",

        userCancelledSubj: "Wareejinta waa la joojiyay",
        userCancelledGreet: "Gacaliye {name},",
        userCancelledIntro: "Waxaan xaqiijinaynaa in wareejintaada la joojiyay. Lacag lama jarin akoonkaaga.",
        userCancelledFooter: "Haddii aanad adiga bilaabin joojintan, fadlan isla markiiba la xiriir adeegga macaamiisheena.",

        adminConnectionSubj: "Xiriir macmiil cusub oo ku yimid App Pay",
        adminConnectionGreet: "Salaan Maamule,",
        adminConnectionIntro: "Macmiilkan soo socda ayaa hadda soo galay akoonkiisa App Pay. Waa kuwan faahfaahinta xiriirka:",
        adminConnectionFooter: "Iimaylkan si otomaatig ah ayaa loogu diraa maamulaha markasta oo macmiil soo galo."
    }
};

// ============================================================
// OUTILS ET FONCTIONS EXPORTÉES
// ============================================================
function getT(lang) {
    return EMAIL_TRANSLATIONS[lang] || EMAIL_TRANSLATIONS['fr'];
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
    if (!client?.email) return { success: false, error: 'MISSING_EMAIL' };

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
            { label: `<strong>${t.email_address || 'Email'}</strong>`, value: `<a href="mailto:${client.email}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">${client.email}</a>` },
            { label: `<strong>${t.pin_code || 'PIN'}</strong>`, value: `<strong style="color: #111; font-family: monospace; font-size: 16px; letter-spacing: 1px;">${client.pin}</strong>` }
        ],
        buttonText: t.login_btn || 'Login',
        buttonLink: loginLink,
        warning: t.loginFooter,
        footer: t.loginFooter,
        boxStyle: 'background-color: #f9f9f9; border: 1px solid #eeeeee;' 
    });

    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.loginSubj, html: html });
}

// ============================================================
// 📧 FONCTION 2 : Envoyer le code d'activation
// ============================================================
export async function sendActivationCode(client) {
    if (!client?.email) return { success: false, error: 'MISSING_EMAIL' };

    const lang = client.language || 'fr';
    const t = getT(lang);
    const prenom = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.actSubj,
        greeting: replaceVars(t.actGreet, { name: prenom }),
        intro: t.actIntro,
        listItems: [
            { label: `<strong>${t.activation_code || 'Activation Code'}</strong>`, value: `<strong style="color: #ff7a00; font-family: monospace; font-size: 18px; letter-spacing: 2px;">${client.activationCode}</strong>` }
        ],
        warning: t.actFooter,
        footer: t.actFooter,
        boxStyle: 'background-color: #f9f9f9; border: 1px solid #eeeeee;'
    });

    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.actSubj, html: html });
}

// ============================================================
// 📧 FONCTION 3 : Virement réussi
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
            { label: `<strong>${t.amount || 'Amount'}</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>${t.beneficiary || 'Beneficiary'}</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>${t.iban || 'IBAN'}</strong>`, value: `<span style="font-family: monospace;">${transfer.iban || '—'}</span>` },
            { label: `<strong>${t.date || 'Date'}</strong>`, value: `${transfer.date || new Date().toLocaleString('fr-FR')}` },
            { label: `<strong>${t.reference || 'Reference'}</strong>`, value: `${transfer.reference || '—'}` }
        ],
        footer: t.successFooter,
        boxStyle: 'background-color: #f0fdf4; border: 1px solid #bbf7d0;'
    });
    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.successSubj, html: html });
}

// ============================================================
// 📧 FONCTION 4 : Virement échoué
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
            { label: `<strong>${t.attempted_amount || 'Attempted Amount'}</strong>`, value: `${formatAmount(details.amount, client.currency)}` },
            { label: `<strong>${t.beneficiary || 'Beneficiary'}</strong>`, value: `${details.beneficiary || '—'}` },
            { label: `<strong>${t.allowed_limit || 'Allowed Limit'}</strong>`, value: `${formatAmount(details.limit, client.currency)}` },
            { label: `<strong>${t.status || 'Status'}</strong>`, value: `<strong style="color: #e02424;">${t.failed_status || 'Blocked'}</strong>` }
        ],
        footer: t.failedFooter,
        boxStyle: 'background-color: #fef2f2; border: 1px solid #fecaca;'
    });
    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.failedSubj, html: html });
}

// ============================================================
// 📧 FONCTION 5 : Virement en attente
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
            { label: `<strong>${t.amount || 'Amount'}</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>${t.beneficiary || 'Beneficiary'}</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>${t.reference || 'Reference'}</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>${t.status || 'Status'}</strong>`, value: `<strong style="color: #d97706;">${t.pending_status || 'Pending'}</strong>` }
        ],
        footer: t.pendingFooter,
        boxStyle: 'background-color: #fffbeb; border: 1px solid #fde68a;'
    });
    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.pendingSubj, html: html });
}

// ============================================================
// 📧 FONCTION 6 : Virement validé par Admin
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
            { label: `<strong>${t.amount || 'Amount'}</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>${t.beneficiary || 'Beneficiary'}</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>${t.reference || 'Reference'}</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>${t.status || 'Status'}</strong>`, value: `<strong style="color: #00a04a;">${t.completed || 'Completed'}</strong>` }
        ],
        footer: t.validatedFooter,
        boxStyle: 'background-color: #f0fdf4; border: 1px solid #bbf7d0;'
    });
    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.validatedSubj, html: html });
}

// ============================================================
// 📧 FONCTION 7 : Virement annulé par Admin
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
            { label: `<strong>${t.amount || 'Amount'}</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>${t.beneficiary || 'Beneficiary'}</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>${t.reference || 'Reference'}</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>${t.status || 'Status'}</strong>`, value: `<strong style="color: #e02424;">${t.cancelled_status || 'Cancelled'}</strong>` }
        ],
        footer: t.cancelledFooter,
        boxStyle: 'background-color: #fef2f2; border: 1px solid #fecaca;'
    });
    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.cancelledSubj, html: html });
}

// ============================================================
// 📧 FONCTION 8 : Virement remboursé
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
            { label: `<strong>${t.refunded_amount || 'Refunded Amount'}</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>${t.beneficiary || 'Beneficiary'}</strong>`, value: `${transfer.beneficiary || '—'}` },
            { label: `<strong>${t.reference || 'Reference'}</strong>`, value: `${transfer.reference || '—'}` },
            { label: `<strong>${t.status || 'Status'}</strong>`, value: `<strong style="color: #00a04a;">${t.completed || 'Completed'}</strong>` }
        ],
        footer: t.refundFooter,
        boxStyle: 'background-color: #f0fdf4; border: 1px solid #bbf7d0;'
    });
    return await sendEmail({ email: client.email, prenom: prenom, sujet: t.refundSubj, html: html });
}

// ============================================================
// 📧 FONCTION 9 : Virement annulé par l'utilisateur
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
            { label: `<strong>${t.amount || 'Amount'}</strong>`, value: `<strong>${formatAmount(transfer.amount, client.currency)}</strong>` },
            { label: `<strong>${t.beneficiary || 'Beneficiary'}</strong>`, value: `${transfer.beneficiary || '—'}` }
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
    
    // Template HTML ultra-simple sans en-tête (exactement comme demandé)
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

    const sujet = `Connexion App Pay - ${clientName}`;

    return await sendEmail({
        email: adminEmail,
        prenom: client.createdByName || 'Administrateur',
        sujet: sujet,
        html: html
    });
}
