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
        transferDateLabel: "Date de l'opération",
        transferReferenceLabel: "Référence unique",
        transferSuccessFooter: "Le crédit sur le compte du bénéficiaire s'effectuera sous 24 à 48 heures ouvrées. Merci de votre confiance.",

        transferFailedSubject: "Alerte : Votre virement App Pay n'a pas pu être traité",
        transferFailedGreeting: "Cher(e) {name},",
        transferFailedIntro: "Nous vous informons qu'une tentative de virement sur votre compte a été bloquée par nos systèmes de sécurité. Voici les détails :",
        transferFailedReason: "Motif du blocage",
        transferFailedReasonPercent: "Le montant demandé dépasse la limite autorisée pour votre compte.",
        transferFailedAmountLabel: "Montant tenté",
        transferFailedLimitLabel: "Limite autorisée",
        transferFailedFooter: "Si vous êtes à l'origine de cette demande, veuillez contacter votre conseiller pour augmenter vos plafonds.",

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
        transferDateLabel: "Operation date",
        transferReferenceLabel: "Unique reference",
        transferSuccessFooter: "The funds will be credited to the beneficiary's account within 24 to 48 business hours. Thank you for your trust.",
        transferFailedSubject: "Alert: Your App Pay transfer could not be processed",
        transferFailedGreeting: "Dear {name},",
        transferFailedIntro: "We inform you that a transfer attempt on your account was blocked by our security systems. Here are the details:",
        transferFailedReason: "Blocking reason",
        transferFailedReasonPercent: "The requested amount exceeds the limit allowed for your account.",
        transferFailedAmountLabel: "Attempted amount",
        transferFailedLimitLabel: "Allowed limit",
        transferFailedFooter: "If you initiated this request, please contact your advisor to increase your limits.",
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
        transferDateLabel: "Fecha de la operación",
        transferReferenceLabel: "Referencia única",
        transferSuccessFooter: "Los fondos se acreditarán en la cuenta del beneficiario en un plazo de 24 a 48 horas hábiles. Gracias por su confianza.",
        transferFailedSubject: "Alerta: Su transferencia App Pay no pudo ser procesada",
        transferFailedGreeting: "Estimado/a {name},",
        transferFailedIntro: "Le informamos que un intento de transferencia en su cuenta fue bloqueado por nuestros sistemas de seguridad. Aquí están los detalles:",
        transferFailedReason: "Motivo del bloqueo",
        transferFailedReasonPercent: "El importe solicitado supera el límite permitido para su cuenta.",
        transferFailedAmountLabel: "Importe intentado",
        transferFailedLimitLabel: "Límite permitido",
        transferFailedFooter: "Si usted inició esta solicitud, comuníquese con su asesor.",
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
        transferDateLabel: "Datum der Operation",
        transferReferenceLabel: "Eindeutige Referenz",
        transferSuccessFooter: "Die Gutschrift erfolgt innerhalb von 24 bis 48 Geschäftsstunden. Vielen Dank für Ihr Vertrauen.",
        transferFailedSubject: "Warnung: Ihre App Pay Überweisung konnte nicht bearbeitet werden",
        transferFailedGreeting: "Sehr geehrte(r) {name},",
        transferFailedIntro: "Wir informieren Sie, dass ein Überweisungsversuch auf Ihrem Konto von unseren Sicherheitssystemen blockiert wurde. Hier sind die Details:",
        transferFailedReason: "Grund der Blockierung",
        transferFailedReasonPercent: "Der angeforderte Betrag überschreitet das für Ihr Konto zulässige Limit.",
        transferFailedAmountLabel: "Versuchter Betrag",
        transferFailedLimitLabel: "Zulässiges Limit",
        transferFailedFooter: "Wenn Sie diese Anfrage initiiert haben, kontaktieren Sie bitte Ihren Berater.",
        footer: "Diese E-Mail wurde automatisch von App Pay generiert.",
        footerDoNotReply: "Bitte antworten Sie nicht direkt auf diese E-Mail.",
        greeting: "Mit freundlichen Grüßen,",
        teamName: "Das App Pay Team"
    },
    it: {
        loginSubject: "Benvenuto in App Pay – Le tue credenziali di accesso",
        loginGreeting: "Gentile {name},",
        loginIntro: "Siamo lieti di confermare l'apertura del tuo conto su App Pay. Grazie per la tua fiducia. Per accedere alla tua area clienti online, ecco le tue credenziali di accesso:",
        loginEmailLabel: "Nome utente",
        loginPinLabel: "Codice PIN",
        loginButton: "Accedi al mio conto online",
        loginFooter: "Per la tua sicurezza, ti consigliamo di mantenere queste informazioni riservate. Non condividere mai il tuo codice PIN con nessuno.",
        loginSecurity: "Il team di sicurezza di App Pay",
        activationSubject: "Il tuo codice di attivazione per i bonifici App Pay",
        activationGreeting: "Gentile {name},",
        activationIntro: "Per garantire la sicurezza delle tue transazioni, di seguito trovi il tuo codice di attivazione personale. Questo codice ti sarà richiesto per convalidare ciascuno dei tuoi bonifici:",
        activationCodeLabel: "Il tuo codice di attivazione",
        activationFooter: "Conserva questo codice in un luogo sicuro. È strettamente personale e riservato.",
        activationWarning: "Non condividere mai questo codice con terzi.",
        transferSuccessSubject: "Conferma del tuo bonifico App Pay",
        transferSuccessGreeting: "Gentile {name},",
        transferSuccessIntro: "Ti confermiamo che il tuo bonifico è stato elaborato con successo. Ecco il riepilogo dell'operazione:",
        transferAmountLabel: "Importo trasferito",
        transferBeneficiaryLabel: "Beneficiario",
        transferDateLabel: "Data dell'operazione",
        transferReferenceLabel: "Riferimento univoco",
        transferSuccessFooter: "I fondi saranno accreditati sul conto del beneficiario entro 24-48 ore lavorative. Grazie per la tua fiducia.",
        transferFailedSubject: "Avviso: Il tuo bonifico App Pay non è stato elaborato",
        transferFailedGreeting: "Gentile {name},",
        transferFailedIntro: "Ti informiamo che un tentativo di bonifico sul tuo conto è stato bloccato dai nostri sistemi di sicurezza. Ecco i dettagli:",
        transferFailedReason: "Motivo del blocco",
        transferFailedReasonPercent: "L'importo richiesto supera il limite consentito per il tuo conto.",
        transferFailedAmountLabel: "Importo tentato",
        transferFailedLimitLabel: "Limite consentito",
        transferFailedFooter: "Se hai avviato tu questa richiesta, contatta il tuo consulente.",
        footer: "Questa email è stata generata automaticamente da App Pay.",
        footerDoNotReply: "Si prega di non rispondere direttamente a questa email.",
        greeting: "Cordiali saluti,",
        teamName: "Il team App Pay"
    },
    pt: {
        loginSubject: "Bem-vindo ao App Pay – As suas credenciais de acesso",
        loginGreeting: "Caro(a) {name},",
        loginIntro: "Temos o prazer de confirmar a abertura da sua conta na App Pay. Obrigado pela sua confiança. Para aceder à sua área de cliente online, aqui estão as suas credenciais de acesso:",
        loginEmailLabel: "Nome de utilizador",
        loginPinLabel: "Código PIN",
        loginButton: "Aceder à minha conta online",
        loginFooter: "Para sua segurança, recomendamos que mantenha estas informações confidenciais. Nunca partilhe o seu código PIN com ninguém.",
        loginSecurity: "A equipa de segurança da App Pay",
        activationSubject: "O seu código de ativação para transferências App Pay",
        activationGreeting: "Caro(a) {name},",
        activationIntro: "Para garantir a segurança das suas transações, encontre abaixo o seu código de ativação pessoal. Este código será solicitado para validar cada uma das suas transferências:",
        activationCodeLabel: "O seu código de ativação",
        activationFooter: "Guarde este código num local seguro. É estritamente pessoal e confidencial.",
        activationWarning: "Nunca partilhe este código com terceiros.",
        transferSuccessSubject: "Confirmação da sua transferência App Pay",
        transferSuccessGreeting: "Caro(a) {name},",
        transferSuccessIntro: "Confirmamos que a sua transferência foi processada com sucesso. Aqui está o resumo da operação:",
        transferAmountLabel: "Montante transferido",
        transferBeneficiaryLabel: "Beneficiário",
        transferDateLabel: "Data da operação",
        transferReferenceLabel: "Referência única",
        transferSuccessFooter: "Os fundos serão creditados na conta do beneficiário no prazo de 24 a 48 horas úteis. Obrigado pela sua confiança.",
        transferFailedSubject: "Alerta: A sua transferência App Pay não pôde ser processada",
        transferFailedGreeting: "Caro(a) {name},",
        transferFailedIntro: "Informamos que uma tentativa de transferência na sua conta foi bloqueada pelos nossos sistemas de segurança. Aqui estão os detalhes:",
        transferFailedReason: "Motivo do bloqueio",
        transferFailedReasonPercent: "O montante solicitado excede o limite permitido para a sua conta.",
        transferFailedAmountLabel: "Montante tentado",
        transferFailedLimitLabel: "Limite permitido",
        transferFailedFooter: "Se iniciou este pedido, contacte o seu consultor.",
        footer: "Este e-mail foi gerado automaticamente pela App Pay.",
        footerDoNotReply: "Por favor, não responda diretamente a este e-mail.",
        greeting: "Atenciosamente,",
        teamName: "A equipa App Pay"
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
        transferDateLabel: "Data operacji",
        transferReferenceLabel: "Unikalna referencja",
        transferSuccessFooter: "Środki zostaną zaksięgowane na koncie odbiorcy w ciągu 24-48 godzin roboczych. Dziękujemy za zaufanie.",
        transferFailedSubject: "Alert: Twój przelew App Pay nie mógł zostać przetworzony",
        transferFailedGreeting: "Szanowny(a) {name},",
        transferFailedIntro: "Informujemy, że próba przelewu na Twoim koncie została zablokowana przez nasze systemy bezpieczeństwa. Oto szczegóły:",
        transferFailedReason: "Powód blokady",
        transferFailedReasonPercent: "Żądana kwota przekracza limit dozwolony dla Twojego konta.",
        transferFailedAmountLabel: "Próbowana kwota",
        transferFailedLimitLabel: "Dozwolony limit",
        transferFailedFooter: "Jeśli to Ty zainicjowałeś tę prośbę, skontaktuj się ze swoim doradcą.",
        footer: "Ta wiadomość została wygenerowana automatycznie przez App Pay.",
        footerDoNotReply: "Prosimy nie odpowiadać bezpośrednio na tę wiadomość.",
        greeting: "Z poważaniem,",
        teamName: "Zespół App Pay"
    },
    nl: {
        loginSubject: "Welkom bij App Pay – Uw inloggegevens",
        loginGreeting: "Beste {name},",
        loginIntro: "We zijn verheugd de opening van uw account bij App Pay te bevestigen. Bedankt voor uw vertrouwen. Hier zijn uw inloggegevens voor uw klantenportaal:",
        loginEmailLabel: "Gebruikersnaam",
        loginPinLabel: "Pincode",
        loginButton: "Toegang tot mijn online account",
        loginFooter: "Voor uw veiligheid raden we u aan deze informatie vertrouwelijk te houden. Deel uw pincode nooit met iemand.",
        loginSecurity: "Het App Pay Security Team",
        activationSubject: "Uw activeringscode voor App Pay overschrijvingen",
        activationGreeting: "Beste {name},",
        activationIntro: "Om de veiligheid van uw transacties te garanderen, vindt u hieronder uw persoonlijke activeringscode. Deze code is vereist om al uw overschrijvingen te valideren:",
        activationCodeLabel: "Uw activeringscode",
        activationFooter: "Bewaar deze code veilig. Het is strikt persoonlijk en vertrouwelijk.",
        activationWarning: "Deel deze code nooit met een derde partij.",
        transferSuccessSubject: "Bevestiging van uw App Pay overschrijving",
        transferSuccessGreeting: "Beste {name},",
        transferSuccessIntro: "We bevestigen dat uw overschrijving met succes is verwerkt. Hier is de samenvatting van de transactie:",
        transferAmountLabel: "Overgemaakt bedrag",
        transferBeneficiaryLabel: "Begunstigde",
        transferDateLabel: "Datum van de transactie",
        transferReferenceLabel: "Unieke referentie",
        transferSuccessFooter: "De fondsen worden binnen 24 tot 48 werkuren op de rekening van de begunstigde gestort. Bedankt voor uw vertrouwen.",
        transferFailedSubject: "Waarschuwing: Uw App Pay overschrijving kon niet worden verwerkt",
        transferFailedGreeting: "Beste {name},",
        transferFailedIntro: "Wij informeren u dat een poging tot overschrijving op uw rekening is geblokkeerd door onze beveiligingssystemen. Hier zijn de details:",
        transferFailedReason: "Reden van blokkering",
        transferFailedReasonPercent: "Het gevraagde bedrag overschrijdt de limiet die voor uw account is toegestaan.",
        transferFailedAmountLabel: "Geprobeerd bedrag",
        transferFailedLimitLabel: "Toegestane limiet",
        transferFailedFooter: "Als u dit verzoek heeft geïnitieerd, neem dan contact op met uw adviseur.",
        footer: "Deze e-mail is automatisch gegenereerd door App Pay.",
        footerDoNotReply: "Reageer alstublieft niet rechtstreeks op deze e-mail.",
        greeting: "Met vriendelijke groet,",
        teamName: "Het App Pay team"
    },
    ru: {
        loginSubject: "Добро пожаловать в App Pay – Ваши данные для входа",
        loginGreeting: "Уважаемый(ая) {name},",
        loginIntro: "Мы рады подтвердить открытие вашей учетной записи в App Pay. Благодарим вас за доверие. Вот ваши данные для входа в клиентский портал:",
        loginEmailLabel: "Имя пользователя",
        loginPinLabel: "PIN-код",
        loginButton: "Войти в личный кабинет",
        loginFooter: "В целях вашей безопасности мы рекомендуем хранить эту информацию в тайне. Никогда и никому не сообщайте свой PIN-код.",
        loginSecurity: "Служба безопасности App Pay",
        activationSubject: "Ваш код активации для переводов App Pay",
        activationGreeting: "Уважаемый(ая) {name},",
        activationIntro: "Для обеспечения безопасности ваших транзакций ниже приведен ваш личный код активации. Он потребуется для подтверждения каждого перевода:",
        activationCodeLabel: "Ваш код активации",
        activationFooter: "Храните этот код в надежном месте. Он строго конфиденциален.",
        activationWarning: "Никогда не передавайте этот код третьим лицам.",
        transferSuccessSubject: "Подтверждение вашего перевода App Pay",
        transferSuccessGreeting: "Уважаемый(ая) {name},",
        transferSuccessIntro: "Подтверждаем, что ваш перевод был успешно обработан. Вот сводка операции:",
        transferAmountLabel: "Сумма перевода",
        transferBeneficiaryLabel: "Получатель",
        transferDateLabel: "Дата операции",
        transferReferenceLabel: "Уникальный номер",
        transferSuccessFooter: "Средства будут зачислены на счет получателя в течение 24-48 рабочих часов. Спасибо за доверие.",
        transferFailedSubject: "Внимание: Ваш перевод App Pay не может быть обработан",
        transferFailedGreeting: "Уважаемый(ая) {name},",
        transferFailedIntro: "Сообщаем вам, что попытка перевода с вашего счета была заблокирована нашими системами безопасности. Вот детали:",
        transferFailedReason: "Причина блокировки",
        transferFailedReasonPercent: "Запрошенная сумма превышает допустимый лимит для вашего счета.",
        transferFailedAmountLabel: "Попытка перевода",
        transferFailedLimitLabel: "Допустимый лимит",
        transferFailedFooter: "Если вы инициировали этот запрос, свяжитесь с вашим консультантом.",
        footer: "Это письмо сгенерировано автоматически сервисом App Pay.",
        footerDoNotReply: "Пожалуйста, не отвечайте на это письмо.",
        greeting: "С уважением,",
        teamName: "Команда App Pay"
    },
    ar: {
        loginSubject: "مرحبًا بك في App Pay – بيانات تسجيل الدخول الخاصة بك",
        loginGreeting: "عزيزي/عزيزتي {name}،",
        loginIntro: "يسعدنا أن نؤكد لك فتح حسابك لدى App Pay. نشكرك على ثقتك. للوصول إلى بوابة العملاء عبر الإنترنت، إليك بيانات تسجيل الدخول الخاصة بك:",
        loginEmailLabel: "اسم المستخدم",
        loginPinLabel: "رمز PIN",
        loginButton: "الوصول إلى حسابي عبر الإنترنت",
        loginFooter: "من أجل أمنك، نوصي بالحفاظ على سرية هذه المعلومات. لا تشارك رمز PIN الخاص بك مع أي شخص.",
        loginSecurity: "فريق أمن App Pay",
        activationSubject: "رمز التفعيل الخاص بك لتحويلات App Pay",
        activationGreeting: "عزيزي/عزيزتي {name}،",
        activationIntro: "لضمان أمان معاملاتك، يرجى العثور أدناه على رمز التفعيل الشخصي الخاص بك. سيُطلب منك هذا الرمز للتحقق من صحة كل تحويل:",
        activationCodeLabel: "رمز التفعيل الخاص بك",
        activationFooter: "احتفظ بهذا الرمز في مكان آمن. إنه شخصي وسري للغاية.",
        activationWarning: "لا تشارك هذا الرمز مع طرف ثالث أبداً.",
        transferSuccessSubject: "تأكيد تحويل App Pay الخاص بك",
        transferSuccessGreeting: "عزيزي/عزيزتي {name}،",
        transferSuccessIntro: "نؤكد لك أن تحويلك قد تمت معالجته بنجاح. إليك ملخص العملية:",
        transferAmountLabel: "المبلغ المحول",
        transferBeneficiaryLabel: "المستفيد",
        transferDateLabel: "تاريخ العملية",
        transferReferenceLabel: "مرجع فريد",
        transferSuccessFooter: "سيتم إيداع الأموال في حساب المستفيد في غضون 24 إلى 48 ساعة عمل. شكراً لثقتك.",
        transferFailedSubject: "تنبيه: تعذرت معالجة تحويل App Pay الخاص بك",
        transferFailedGreeting: "عزيزي/عزيزتي {name}،",
        transferFailedIntro: "نبلغك بأن محاولة تحويل على حسابك قد تم حظرها من قبل أنظمة الأمان لدينا. إليك التفاصيل:",
        transferFailedReason: "سبب الحظر",
        transferFailedReasonPercent: "المبلغ المطلوب يتجاوز الحد المسموح به لحسابك.",
        transferFailedAmountLabel: "المبلغ المطلوب",
        transferFailedLimitLabel: "الحد المسموح",
        transferFailedFooter: "إذا كنت قد بدأت هذا الطلب، يرجى الاتصال بالمستشار الخاص بك.",
        footer: "تم إنشاء هذا البريد الإلكتروني تلقائياً بواسطة App Pay.",
        footerDoNotReply: "يرجى عدم الرد مباشرة على هذا البريد الإلكتروني.",
        greeting: "مع أطيب التحيات،",
        teamName: "فريق App Pay"
    },
    zh: {
        loginSubject: "欢迎来到 App Pay – 您的登录凭据",
        loginGreeting: "尊敬的 {name}，",
        loginIntro: "我们很高兴确认您在 App Pay 的账户已开通。感谢您的信任。以下是您访问客户门户的登录凭据：",
        loginEmailLabel: "用户名",
        loginPinLabel: "PIN 码",
        loginButton: "访问我的在线账户",
        loginFooter: "为了您的安全，我们建议您对这些信息保密。切勿与任何人分享您的 PIN 码。",
        loginSecurity: "App Pay 安全团队",
        activationSubject: "您的 App Pay 转账激活码",
        activationGreeting: "尊敬的 {name}，",
        activationIntro: "为确保您的交易安全，请在下方找到您的个人激活码。验证每笔转账时都需要输入此代码：",
        activationCodeLabel: "您的激活码",
        activationFooter: "请妥善保管此代码。它是严格个人且机密的。",
        activationWarning: "切勿与第三方分享此代码。",
        transferSuccessSubject: "您的 App Pay 转账确认",
        transferSuccessGreeting: "尊敬的 {name}，",
        transferSuccessIntro: "我们确认您的转账已成功处理。以下是操作摘要：",
        transferAmountLabel: "转账金额",
        transferBeneficiaryLabel: "收款人",
        transferDateLabel: "操作日期",
        transferReferenceLabel: "唯一参考号",
        transferSuccessFooter: "资金将在 24 至 48 个工作小时内存入收款人账户。感谢您的信任。",
        transferFailedSubject: "警报：您的 App Pay 转账无法处理",
        transferFailedGreeting: "尊敬的 {name}，",
        transferFailedIntro: "我们通知您，您账户上的一笔转账尝试被我们的安全系统拦截。详情如下：",
        transferFailedReason: "拦截原因",
        transferFailedReasonPercent: "请求金额超过了您账户允许的限额。",
        transferFailedAmountLabel: "尝试金额",
        transferFailedLimitLabel: "允许限额",
        transferFailedFooter: "如果是您发起的此请求，请联系您的顾问。",
        footer: "此邮件由 App Pay 自动生成。",
        footerDoNotReply: "请勿直接回复此邮件。",
        greeting: "此致，",
        teamName: "App Pay 团队"
    },
    ja: {
        loginSubject: "App Pay へようこそ – ログイン情報",
        loginGreeting: "{name} 様,",
        loginIntro: "App Pay のアカウント開設を確認いたしました。ご信頼いただきありがとうございます。クライアントポータルにアクセスするためのログイン情報は以下の通りです：",
        loginEmailLabel: "ユーザー名",
        loginPinLabel: "PIN コード",
        loginButton: "オンライン口座にアクセスする",
        loginFooter: "セキュリティのため、この情報は機密に保つことをお勧めします。PIN コードは絶対に他人と共有しないでください。",
        loginSecurity: "App Pay セキュリティチーム",
        activationSubject: "App Pay 送金のためのアクティベーションコード",
        activationGreeting: "{name} 様,",
        activationIntro: "取引のセキュリティを確保するため、以下に個人用アクティベーションコードを記載します。このコードは各送金を承認するために必要です：",
        activationCodeLabel: "アクティベーションコード",
        activationFooter: "このコードは安全な場所に保管してください。厳重に個人かつ機密の情報です。",
        activationWarning: "このコードは絶対に第三者と共有しないでください。",
        transferSuccessSubject: "App Pay 送金の確認",
        transferSuccessGreeting: "{name} 様,",
        transferSuccessIntro: "送金が正常に処理されたことを確認いたします。操作の概要は以下の通りです：",
        transferAmountLabel: "送金額",
        transferBeneficiaryLabel: "受取人",
        transferDateLabel: "操作日",
        transferReferenceLabel: "固有の参照番号",
        transferSuccessFooter: "資金は 24〜48 営業時間以内に受取人の口座に入金されます。ご信頼ありがとうございます。",
        transferFailedSubject: "警告：App Pay 送金を処理できませんでした",
        transferFailedGreeting: "{name} 様,",
        transferFailedIntro: "お客様の口座での送金試行が、当社のセキュリティシステムによってブロックされたことをお知らせします。詳細は以下の通りです：",
        transferFailedReason: "ブロックの理由",
        transferFailedReasonPercent: "要求された金額が口座で許可されている限度額を超えています。",
        transferFailedAmountLabel: "試行金額",
        transferFailedLimitLabel: "許可限度額",
        transferFailedFooter: "お客様がこのリクエストを開始した場合は、アドバイザーにご連絡ください。",
        footer: "このメールは App Pay によって自動的に生成されました。",
        footerDoNotReply: "このメールに直接返信しないでください。",
        greeting: "よろしくお願いいたします。",
        teamName: "App Pay チーム"
    }
};

// ============================================================
// UTILITAIRES
// ============================================================

/** Valide une adresse email */
function isValidEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Formate un montant avec devise */
function formatAmount(amount, currency = 'zł') {
    const num = Number(amount) || 0;
    return num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + currency;
}

/** Fetch avec timeout (AbortController) */
async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

/** Convertit le HTML en texte brut (pour le champ "text" exigé par l'API) */
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

// ============================================================
// FONCTION CENTRALE D'ENVOI (Format exact : email, prenom, sujet, html, text)
// ============================================================
async function sendEmail({ email, prenom, sujet, html }) {
    if (!isValidEmail(email)) {
        console.error(`❌ Adresse email invalide : "${email}"`);
        return { success: false, error: 'INVALID_EMAIL', message: 'Adresse email invalide.' };
    }

    console.log(`📧 Envoi email à ${email} — sujet : "${sujet}"`);

    const textContent = stripHtml(html);

    // 🎯 FORMAT EXACT DEMANDÉ PAR L'API
    const payload = JSON.stringify({ 
        email: email,
        prenom: prenom || 'Client',
        sujet: sujet,
        html: html,
        text: textContent 
    });

    // 1️⃣ Essayer Vercel d'abord
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

    // 2️⃣ Fallback vers Render
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
// TEMPLATE HTML PLEIN ÉCRAN (Design propre et texte réduit)
// ============================================================
function buildEmailHTML({ title, greeting, intro, listItems = [], warning = '', buttonText = '', buttonLink = '', footer }) {
    // Génération de la liste des identifiants (façon image 3)
    const listHTML = listItems.map(item => `
        <li style="margin-bottom: 8px; font-size: 14px; color: #333333;">
            ${item.label} : ${item.value}
        </li>
    `).join('');

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

    // Design pleine largeur sans marges blanches
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

                    ${listHTML ? `
                        <ul style="margin: 15px 0; padding-left: 20px; color: #333; line-height: 1.6;">
                            ${listHTML}
                        </ul>
                    ` : ''}

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

    // Construction du lien unique du client
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
        footer: t.loginFooter
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
        footer: t.activationFooter
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.activationSubject,
        html: html
    });
}

// ============================================================
// 📧 FONCTION 3 : Confirmation de virement réussi
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
            { label: `<strong>${t.transferDateLabel}</strong>`, value: `${transfer.date || new Date().toLocaleString('fr-FR')}` },
            { label: `<strong>${t.transferReferenceLabel}</strong>`, value: `${transfer.reference || '—'}` }
        ],
        footer: t.transferSuccessFooter
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.transferSuccessSubject,
        html: html
    });
}

// ============================================================
// 📧 FONCTION 4 : Notification de virement échoué
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
            { label: `<strong>${t.transferFailedReason}</strong>`, value: `${t.transferFailedReasonPercent}` },
            { label: `<strong>${t.transferFailedAmountLabel}</strong>`, value: `${formatAmount(details.amount, client.currency)}` },
            { label: `<strong>${t.transferFailedLimitLabel}</strong>`, value: `${formatAmount(details.limit, client.currency)}` }
        ],
        footer: t.transferFailedFooter
    });

    return await sendEmail({
        email: client.email,
        prenom: prenom,
        sujet: t.transferFailedSubject,
        html: html
    });
}
