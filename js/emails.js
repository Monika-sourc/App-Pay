// ============================================================
// APP PAY - Module d'envoi d'emails
// Toutes les traductions + fonctions d'envoi centralisées
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

// Timeout global pour chaque requête (ms)
const REQUEST_TIMEOUT = 15000;

// ============================================================
// TRADUCTIONS DES EMAILS (12 langues)
// ============================================================
const EMAIL_TRANSLATIONS = {
    fr: {
        // Connexion
        loginSubject: "Vos identifiants de connexion App Pay",
        loginGreeting: "Bonjour {name},",
        loginIntro: "Voici vos identifiants pour accéder à votre compte App Pay :",
        loginEmailLabel: "Adresse e-mail",
        loginPinLabel: "Code PIN",
        loginFooter: "Conservez ces informations en lieu sûr. Ne les partagez avec personne.",
        loginSecurity: "Pour votre sécurité, ne communiquez jamais votre code PIN.",

        // Code d'activation
        activationSubject: "Votre code d'activation App Pay",
        activationGreeting: "Bonjour {name},",
        activationIntro: "Voici votre code d'activation personnel pour valider vos virements :",
        activationCodeLabel: "Code d'activation",
        activationFooter: "Vous devrez saisir ce code chaque fois que vous effectuez un virement.",
        activationWarning: "Ne partagez jamais ce code avec qui que ce soit.",

        // Virement réussi
        transferSuccessSubject: "Confirmation de votre virement App Pay",
        transferSuccessGreeting: "Bonjour {name},",
        transferSuccessIntro: "Votre virement a été effectué avec succès.",
        transferAmountLabel: "Montant",
        transferBeneficiaryLabel: "Bénéficiaire",
        transferDateLabel: "Date",
        transferReferenceLabel: "Référence",
        transferSuccessFooter: "Merci de votre confiance. L'équipe App Pay.",

        // Virement échoué
        transferFailedSubject: "Votre virement App Pay n'a pas pu être traité",
        transferFailedGreeting: "Bonjour {name},",
        transferFailedIntro: "Nous vous informons que votre virement n'a pas pu être effectué.",
        transferFailedReason: "Raison",
        transferFailedReasonPercent: "Le montant dépasse la limite autorisée sur votre compte.",
        transferFailedAmountLabel: "Montant tenté",
        transferFailedLimitLabel: "Limite autorisée",
        transferFailedFooter: "Veuillez contacter votre conseiller pour plus d'informations.",

        // Commun
        footer: "Cet email a été envoyé automatiquement par App Pay.",
        footerDoNotReply: "Merci de ne pas répondre à cet email.",
        greeting: "Cordialement,",
        teamName: "L'équipe App Pay"
    },

    en: {
        loginSubject: "Your App Pay login credentials",
        loginGreeting: "Hello {name},",
        loginIntro: "Here are your credentials to access your App Pay account:",
        loginEmailLabel: "Email address",
        loginPinLabel: "PIN code",
        loginFooter: "Keep this information safe. Do not share it with anyone.",
        loginSecurity: "For your security, never share your PIN code.",

        activationSubject: "Your App Pay activation code",
        activationGreeting: "Hello {name},",
        activationIntro: "Here is your personal activation code to validate your transfers:",
        activationCodeLabel: "Activation code",
        activationFooter: "You will need to enter this code each time you make a transfer.",
        activationWarning: "Never share this code with anyone.",

        transferSuccessSubject: "Confirmation of your App Pay transfer",
        transferSuccessGreeting: "Hello {name},",
        transferSuccessIntro: "Your transfer was completed successfully.",
        transferAmountLabel: "Amount",
        transferBeneficiaryLabel: "Beneficiary",
        transferDateLabel: "Date",
        transferReferenceLabel: "Reference",
        transferSuccessFooter: "Thank you for your trust. The App Pay team.",

        transferFailedSubject: "Your App Pay transfer could not be processed",
        transferFailedGreeting: "Hello {name},",
        transferFailedIntro: "We inform you that your transfer could not be completed.",
        transferFailedReason: "Reason",
        transferFailedReasonPercent: "The amount exceeds the limit allowed on your account.",
        transferFailedAmountLabel: "Attempted amount",
        transferFailedLimitLabel: "Allowed limit",
        transferFailedFooter: "Please contact your advisor for more information.",

        footer: "This email was sent automatically by App Pay.",
        footerDoNotReply: "Please do not reply to this email.",
        greeting: "Best regards,",
        teamName: "The App Pay team"
    },

    es: {
        loginSubject: "Tus credenciales de acceso a App Pay",
        loginGreeting: "Hola {name},",
        loginIntro: "Aquí están tus credenciales para acceder a tu cuenta App Pay:",
        loginEmailLabel: "Correo electrónico",
        loginPinLabel: "Código PIN",
        loginFooter: "Guarda esta información en un lugar seguro. No la compartas con nadie.",
        loginSecurity: "Por tu seguridad, nunca compartas tu código PIN.",

        activationSubject: "Tu código de activación App Pay",
        activationGreeting: "Hola {name},",
        activationIntro: "Aquí está tu código de activación personal para validar tus transferencias:",
        activationCodeLabel: "Código de activación",
        activationFooter: "Deberás introducir este código cada vez que realices una transferencia.",
        activationWarning: "Nunca compartas este código con nadie.",

        transferSuccessSubject: "Confirmación de tu transferencia App Pay",
        transferSuccessGreeting: "Hola {name},",
        transferSuccessIntro: "Tu transferencia se completó con éxito.",
        transferAmountLabel: "Importe",
        transferBeneficiaryLabel: "Beneficiario",
        transferDateLabel: "Fecha",
        transferReferenceLabel: "Referencia",
        transferSuccessFooter: "Gracias por tu confianza. El equipo de App Pay.",

        transferFailedSubject: "Tu transferencia App Pay no pudo procesarse",
        transferFailedGreeting: "Hola {name},",
        transferFailedIntro: "Te informamos que tu transferencia no pudo completarse.",
        transferFailedReason: "Motivo",
        transferFailedReasonPercent: "El importe supera el límite permitido en tu cuenta.",
        transferFailedAmountLabel: "Importe intentado",
        transferFailedLimitLabel: "Límite permitido",
        transferFailedFooter: "Por favor, contacta con tu asesor para más información.",

        footer: "Este correo fue enviado automáticamente por App Pay.",
        footerDoNotReply: "Por favor, no respondas a este correo.",
        greeting: "Atentamente,",
        teamName: "El equipo de App Pay"
    },

    de: {
        loginSubject: "Ihre App Pay Zugangsdaten",
        loginGreeting: "Hallo {name},",
        loginIntro: "Hier sind Ihre Zugangsdaten für Ihr App Pay Konto:",
        loginEmailLabel: "E-Mail-Adresse",
        loginPinLabel: "PIN-Code",
        loginFooter: "Bewahren Sie diese Informationen sicher auf. Teilen Sie sie mit niemandem.",
        loginSecurity: "Teilen Sie aus Sicherheitsgründen niemals Ihren PIN-Code mit.",

        activationSubject: "Ihr App Pay Aktivierungscode",
        activationGreeting: "Hallo {name},",
        activationIntro: "Hier ist Ihr persönlicher Aktivierungscode zur Validierung Ihrer Überweisungen:",
        activationCodeLabel: "Aktivierungscode",
        activationFooter: "Sie müssen diesen Code bei jeder Überweisung eingeben.",
        activationWarning: "Teilen Sie diesen Code niemals mit jemandem.",

        transferSuccessSubject: "Bestätigung Ihrer App Pay Überweisung",
        transferSuccessGreeting: "Hallo {name},",
        transferSuccessIntro: "Ihre Überweisung wurde erfolgreich abgeschlossen.",
        transferAmountLabel: "Betrag",
        transferBeneficiaryLabel: "Begünstigter",
        transferDateLabel: "Datum",
        transferReferenceLabel: "Referenz",
        transferSuccessFooter: "Vielen Dank für Ihr Vertrauen. Das App Pay Team.",

        transferFailedSubject: "Ihre App Pay Überweisung konnte nicht verarbeitet werden",
        transferFailedGreeting: "Hallo {name},",
        transferFailedIntro: "Wir informieren Sie, dass Ihre Überweisung nicht abgeschlossen werden konnte.",
        transferFailedReason: "Grund",
        transferFailedReasonPercent: "Der Betrag überschreitet das für Ihr Konto zulässige Limit.",
        transferFailedAmountLabel: "Versuchter Betrag",
        transferFailedLimitLabel: "Zulässiges Limit",
        transferFailedFooter: "Bitte kontaktieren Sie Ihren Berater für weitere Informationen.",

        footer: "Diese E-Mail wurde automatisch von App Pay gesendet.",
        footerDoNotReply: "Bitte antworten Sie nicht auf diese E-Mail.",
        greeting: "Mit freundlichen Grüßen,",
        teamName: "Das App Pay Team"
    },

    it: {
        loginSubject: "Le tue credenziali di accesso App Pay",
        loginGreeting: "Ciao {name},",
        loginIntro: "Ecco le tue credenziali per accedere al tuo conto App Pay:",
        loginEmailLabel: "Indirizzo email",
        loginPinLabel: "Codice PIN",
        loginFooter: "Conserva queste informazioni al sicuro. Non condividerle con nessuno.",
        loginSecurity: "Per la tua sicurezza, non condividere mai il tuo codice PIN.",

        activationSubject: "Il tuo codice di attivazione App Pay",
        activationGreeting: "Ciao {name},",
        activationIntro: "Ecco il tuo codice di attivazione personale per convalidare i tuoi bonifici:",
        activationCodeLabel: "Codice di attivazione",
        activationFooter: "Dovrai inserire questo codice ogni volta che effettui un bonifico.",
        activationWarning: "Non condividere mai questo codice con nessuno.",

        transferSuccessSubject: "Conferma del tuo bonifico App Pay",
        transferSuccessGreeting: "Ciao {name},",
        transferSuccessIntro: "Il tuo bonifico è stato completato con successo.",
        transferAmountLabel: "Importo",
        transferBeneficiaryLabel: "Beneficiario",
        transferDateLabel: "Data",
        transferReferenceLabel: "Riferimento",
        transferSuccessFooter: "Grazie per la tua fiducia. Il team App Pay.",

        transferFailedSubject: "Il tuo bonifico App Pay non è stato elaborato",
        transferFailedGreeting: "Ciao {name},",
        transferFailedIntro: "Ti informiamo che il tuo bonifico non è stato completato.",
        transferFailedReason: "Motivo",
        transferFailedReasonPercent: "L'importo supera il limite consentito sul tuo conto.",
        transferFailedAmountLabel: "Importo tentato",
        transferFailedLimitLabel: "Limite consentito",
        transferFailedFooter: "Contatta il tuo consulente per ulteriori informazioni.",

        footer: "Questa email è stata inviata automaticamente da App Pay.",
        footerDoNotReply: "Si prega di non rispondere a questa email.",
        greeting: "Cordiali saluti,",
        teamName: "Il team App Pay"
    },

    pt: {
        loginSubject: "Suas credenciais de acesso App Pay",
        loginGreeting: "Olá {name},",
        loginIntro: "Aqui estão suas credenciais para acessar sua conta App Pay:",
        loginEmailLabel: "Endereço de e-mail",
        loginPinLabel: "Código PIN",
        loginFooter: "Mantenha estas informações seguras. Não as compartilhe com ninguém.",
        loginSecurity: "Para sua segurança, nunca compartilhe seu código PIN.",

        activationSubject: "Seu código de ativação App Pay",
        activationGreeting: "Olá {name},",
        activationIntro: "Aqui está seu código de ativação pessoal para validar suas transferências:",
        activationCodeLabel: "Código de ativação",
        activationFooter: "Você precisará inserir este código sempre que fizer uma transferência.",
        activationWarning: "Nunca compartilhe este código com ninguém.",

        transferSuccessSubject: "Confirmação da sua transferência App Pay",
        transferSuccessGreeting: "Olá {name},",
        transferSuccessIntro: "Sua transferência foi concluída com sucesso.",
        transferAmountLabel: "Valor",
        transferBeneficiaryLabel: "Beneficiário",
        transferDateLabel: "Data",
        transferReferenceLabel: "Referência",
        transferSuccessFooter: "Obrigado pela sua confiança. A equipe App Pay.",

        transferFailedSubject: "Sua transferência App Pay não pôde ser processada",
        transferFailedGreeting: "Olá {name},",
        transferFailedIntro: "Informamos que sua transferência não pôde ser concluída.",
        transferFailedReason: "Motivo",
        transferFailedReasonPercent: "O valor excede o limite permitido em sua conta.",
        transferFailedAmountLabel: "Valor tentado",
        transferFailedLimitLabel: "Limite permitido",
        transferFailedFooter: "Entre em contato com seu consultor para mais informações.",

        footer: "Este e-mail foi enviado automaticamente pelo App Pay.",
        footerDoNotReply: "Por favor, não responda a este e-mail.",
        greeting: "Atenciosamente,",
        teamName: "A equipe App Pay"
    },

    pl: {
        loginSubject: "Twoje dane logowania do App Pay",
        loginGreeting: "Witaj {name},",
        loginIntro: "Oto Twoje dane logowania do konta App Pay:",
        loginEmailLabel: "Adres e-mail",
        loginPinLabel: "Kod PIN",
        loginFooter: "Przechowuj te informacje w bezpiecznym miejscu. Nie udostępniaj ich nikomu.",
        loginSecurity: "Ze względów bezpieczeństwa nigdy nie udostępniaj swojego kodu PIN.",

        activationSubject: "Twój kod aktywacyjny App Pay",
        activationGreeting: "Witaj {name},",
        activationIntro: "Oto Twój osobisty kod aktywacyjny do zatwierdzania przelewów:",
        activationCodeLabel: "Kod aktywacyjny",
        activationFooter: "Będziesz musiał wprowadzić ten kod przy każdym przelewie.",
        activationWarning: "Nigdy nie udostępniaj tego kodu nikomu.",

        transferSuccessSubject: "Potwierdzenie przelewu App Pay",
        transferSuccessGreeting: "Witaj {name},",
        transferSuccessIntro: "Twój przelew został zrealizowany pomyślnie.",
        transferAmountLabel: "Kwota",
        transferBeneficiaryLabel: "Odbiorca",
        transferDateLabel: "Data",
        transferReferenceLabel: "Referencja",
        transferSuccessFooter: "Dziękujemy za zaufanie. Zespół App Pay.",

        transferFailedSubject: "Twój przelew App Pay nie mógł zostać przetworzony",
        transferFailedGreeting: "Witaj {name},",
        transferFailedIntro: "Informujemy, że Twój przelew nie mógł zostać zrealizowany.",
        transferFailedReason: "Powód",
        transferFailedReasonPercent: "Kwota przekracza limit dozwolony na Twoim koncie.",
        transferFailedAmountLabel: "Próbowana kwota",
        transferFailedLimitLabel: "Dozwolony limit",
        transferFailedFooter: "Skontaktuj się ze swoim doradcą, aby uzyskać więcej informacji.",

        footer: "Ta wiadomość została wysłana automatycznie przez App Pay.",
        footerDoNotReply: "Prosimy nie odpowiadać na tę wiadomość.",
        greeting: "Z poważaniem,",
        teamName: "Zespół App Pay"
    },

    nl: {
        loginSubject: "Uw App Pay inloggegevens",
        loginGreeting: "Hallo {name},",
        loginIntro: "Hier zijn uw inloggegevens voor uw App Pay account:",
        loginEmailLabel: "E-mailadres",
        loginPinLabel: "PIN-code",
        loginFooter: "Bewaar deze informatie veilig. Deel deze met niemand.",
        loginSecurity: "Deel om veiligheidsredenen nooit uw PIN-code.",

        activationSubject: "Uw App Pay activeringscode",
        activationGreeting: "Hallo {name},",
        activationIntro: "Hier is uw persoonlijke activeringscode om uw overschrijvingen te valideren:",
        activationCodeLabel: "Activeringscode",
        activationFooter: "U moet deze code invoeren bij elke overschrijving.",
        activationWarning: "Deel deze code nooit met iemand.",

        transferSuccessSubject: "Bevestiging van uw App Pay overschrijving",
        transferSuccessGreeting: "Hallo {name},",
        transferSuccessIntro: "Uw overschrijving is succesvol voltooid.",
        transferAmountLabel: "Bedrag",
        transferBeneficiaryLabel: "Begunstigde",
        transferDateLabel: "Datum",
        transferReferenceLabel: "Referentie",
        transferSuccessFooter: "Bedankt voor uw vertrouwen. Het App Pay team.",

        transferFailedSubject: "Uw App Pay overschrijving kon niet worden verwerkt",
        transferFailedGreeting: "Hallo {name},",
        transferFailedIntro: "Wij informeren u dat uw overschrijving niet kon worden voltooid.",
        transferFailedReason: "Reden",
        transferFailedReasonPercent: "Het bedrag overschrijdt de limiet die op uw account is toegestaan.",
        transferFailedAmountLabel: "Geprobeerd bedrag",
        transferFailedLimitLabel: "Toegestane limiet",
        transferFailedFooter: "Neem contact op met uw adviseur voor meer informatie.",

        footer: "Deze e-mail is automatisch verzonden door App Pay.",
        footerDoNotReply: "Reageer alstublieft niet op deze e-mail.",
        greeting: "Met vriendelijke groet,",
        teamName: "Het App Pay team"
    },

    ru: {
        loginSubject: "Ваши данные для входа в App Pay",
        loginGreeting: "Здравствуйте, {name}!",
        loginIntro: "Вот ваши данные для входа в аккаунт App Pay:",
        loginEmailLabel: "Адрес электронной почты",
        loginPinLabel: "PIN-код",
        loginFooter: "Храните эту информацию в безопасности. Не делитесь ею ни с кем.",
        loginSecurity: "В целях безопасности никогда не сообщайте свой PIN-код.",

        activationSubject: "Ваш код активации App Pay",
        activationGreeting: "Здравствуйте, {name}!",
        activationIntro: "Вот ваш персональный код активации для подтверждения переводов:",
        activationCodeLabel: "Код активации",
        activationFooter: "Вам нужно будет вводить этот код при каждом переводе.",
        activationWarning: "Никогда не делитесь этим кодом ни с кем.",

        transferSuccessSubject: "Подтверждение вашего перевода App Pay",
        transferSuccessGreeting: "Здравствуйте, {name}!",
        transferSuccessIntro: "Ваш перевод успешно выполнен.",
        transferAmountLabel: "Сумма",
        transferBeneficiaryLabel: "Получатель",
        transferDateLabel: "Дата",
        transferReferenceLabel: "Ссылка",
        transferSuccessFooter: "Спасибо за доверие. Команда App Pay.",

        transferFailedSubject: "Ваш перевод App Pay не был обработан",
        transferFailedGreeting: "Здравствуйте, {name}!",
        transferFailedIntro: "Сообщаем, что ваш перевод не был выполнен.",
        transferFailedReason: "Причина",
        transferFailedReasonPercent: "Сумма превышает допустимый лимит на вашем счёте.",
        transferFailedAmountLabel: "Попытка перевода",
        transferFailedLimitLabel: "Допустимый лимит",
        transferFailedFooter: "Пожалуйста, свяжитесь с вашим консультантом для получения дополнительной информации.",

        footer: "Это письмо отправлено автоматически сервисом App Pay.",
        footerDoNotReply: "Пожалуйста, не отвечайте на это письмо.",
        greeting: "С уважением,",
        teamName: "Команда App Pay"
    },

    ar: {
        loginSubject: "بيانات تسجيل الدخول إلى App Pay",
        loginGreeting: "مرحباً {name}،",
        loginIntro: "إليك بيانات الدخول إلى حساب App Pay الخاص بك:",
        loginEmailLabel: "البريد الإلكتروني",
        loginPinLabel: "رمز PIN",
        loginFooter: "احتفظ بهذه المعلومات في مكان آمن. لا تشاركها مع أي شخص.",
        loginSecurity: "من أجل أمنك، لا تشارك رمز PIN أبداً.",

        activationSubject: "رمز التفعيل الخاص بك في App Pay",
        activationGreeting: "مرحباً {name}،",
        activationIntro: "إليك رمز التفعيل الشخصي للمصادقة على تحويلاتك:",
        activationCodeLabel: "رمز التفعيل",
        activationFooter: "ستحتاج إلى إدخال هذا الرمز في كل مرة تقوم فيها بتحويل.",
        activationWarning: "لا تشارك هذا الرمز مع أي شخص أبداً.",

        transferSuccessSubject: "تأكيد التحويل في App Pay",
        transferSuccessGreeting: "مرحباً {name}،",
        transferSuccessIntro: "تم إتمام تحويلك بنجاح.",
        transferAmountLabel: "المبلغ",
        transferBeneficiaryLabel: "المستفيد",
        transferDateLabel: "التاريخ",
        transferReferenceLabel: "المرجع",
        transferSuccessFooter: "شكراً لثقتك. فريق App Pay.",

        transferFailedSubject: "لم يتم معالجة تحويلك في App Pay",
        transferFailedGreeting: "مرحباً {name}،",
        transferFailedIntro: "نبلغك أن تحويلك لم يتم إتمامه.",
        transferFailedReason: "السبب",
        transferFailedReasonPercent: "المبلغ يتجاوز الحد المسموح به في حسابك.",
        transferFailedAmountLabel: "المبلغ المطلوب",
        transferFailedLimitLabel: "الحد المسموح",
        transferFailedFooter: "يرجى الاتصال بالمستشار الخاص بك للحصول على مزيد من المعلومات.",

        footer: "تم إرسال هذا البريد تلقائياً من App Pay.",
        footerDoNotReply: "يرجى عدم الرد على هذا البريد.",
        greeting: "مع أطيب التحيات،",
        teamName: "فريق App Pay"
    },

    zh: {
        loginSubject: "您的 App Pay 登录信息",
        loginGreeting: "您好 {name}，",
        loginIntro: "以下是您登录 App Pay 账户的凭据：",
        loginEmailLabel: "电子邮箱",
        loginPinLabel: "PIN 码",
        loginFooter: "请妥善保管此信息。不要与任何人分享。",
        loginSecurity: "为了您的安全，请勿分享您的 PIN 码。",

        activationSubject: "您的 App Pay 激活码",
        activationGreeting: "您好 {name}，",
        activationIntro: "以下是您用于验证转账的个人激活码：",
        activationCodeLabel: "激活码",
        activationFooter: "每次转账时您都需要输入此激活码。",
        activationWarning: "切勿与任何人分享此激活码。",

        transferSuccessSubject: "您的 App Pay 转账确认",
        transferSuccessGreeting: "您好 {name}，",
        transferSuccessIntro: "您的转账已成功完成。",
        transferAmountLabel: "金额",
        transferBeneficiaryLabel: "收款人",
        transferDateLabel: "日期",
        transferReferenceLabel: "参考编号",
        transferSuccessFooter: "感谢您的信任。App Pay 团队。",

        transferFailedSubject: "您的 App Pay 转账无法处理",
        transferFailedGreeting: "您好 {name}，",
        transferFailedIntro: "我们通知您，您的转账未能完成。",
        transferFailedReason: "原因",
        transferFailedReasonPercent: "金额超过了您账户允许的限额。",
        transferFailedAmountLabel: "尝试金额",
        transferFailedLimitLabel: "允许限额",
        transferFailedFooter: "请联系您的顾问获取更多信息。",

        footer: "此邮件由 App Pay 自动发送。",
        footerDoNotReply: "请勿回复此邮件。",
        greeting: "此致，",
        teamName: "App Pay 团队"
    },

    ja: {
        loginSubject: "App Pay ログイン情報",
        loginGreeting: "こんにちは {name} さん、",
        loginIntro: "App Pay アカウントにアクセスするための認証情報です：",
        loginEmailLabel: "メールアドレス",
        loginPinLabel: "PIN コード",
        loginFooter: "この情報は安全な場所に保管してください。誰とも共有しないでください。",
        loginSecurity: "セキュリティのため、PIN コードは絶対に共有しないでください。",

        activationSubject: "App Pay アクティベーションコード",
        activationGreeting: "こんにちは {name} さん、",
        activationIntro: "送金を承認するための個人アクティベーションコードです：",
        activationCodeLabel: "アクティベーションコード",
        activationFooter: "送金のたびにこのコードを入力する必要があります。",
        activationWarning: "このコードは絶対に誰とも共有しないでください。",

        transferSuccessSubject: "App Pay 送金の確認",
        transferSuccessGreeting: "こんにちは {name} さん、",
        transferSuccessIntro: "送金が正常に完了しました。",
        transferAmountLabel: "金額",
        transferBeneficiaryLabel: "受取人",
        transferDateLabel: "日付",
        transferReferenceLabel: "参照番号",
        transferSuccessFooter: "ご信頼ありがとうございます。App Pay チーム。",

        transferFailedSubject: "App Pay 送金を処理できませんでした",
        transferFailedGreeting: "こんにちは {name} さん、",
        transferFailedIntro: "送金が完了できなかったことをお知らせします。",
        transferFailedReason: "理由",
        transferFailedReasonPercent: "金額がアカウントで許可されている限度額を超えています。",
        transferFailedAmountLabel: "試行金額",
        transferFailedLimitLabel: "許可限度額",
        transferFailedFooter: "詳細については、アドバイザーにお問い合わせください。",

        footer: "このメールは App Pay から自動送信されました。",
        footerDoNotReply: "このメールに返信しないでください。",
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

// ============================================================
// FONCTION CENTRALE D'ENVOI (avec fallback)
// ============================================================
async function sendEmail({ to, subject, html }) {
    if (!isValidEmail(to)) {
        console.error(`❌ Adresse email invalide : "${to}"`);
        return { success: false, error: 'INVALID_EMAIL', message: 'Adresse email invalide.' };
    }

    if (!subject || !html) {
        console.error('❌ Sujet ou contenu HTML manquant.');
        return { success: false, error: 'MISSING_FIELDS', message: 'Sujet ou contenu manquant.' };
    }

    console.log(`📧 Envoi email à ${to} — sujet : "${subject}"`);

    // 1️⃣ Essayer Vercel d'abord
    try {
        const res = await fetchWithTimeout(API_PRIMARY.url, {
            method: "POST",
            headers: API_PRIMARY.headers,
            body: JSON.stringify({ to, subject, html })
        });

        if (res.ok) {
            console.log("✅ Email envoyé via Vercel");
            return { success: true, provider: "vercel" };
        }

        console.warn(`⚠️ Vercel a répondu ${res.status}, tentative via Render...`);
    } catch (err) {
        const reason = err.name === 'AbortError' ? 'Timeout' : err.message;
        console.warn(`⚠️ Vercel échoué (${reason}), tentative via Render...`);
    }

    // 2️⃣ Fallback vers Render
    try {
        const res = await fetchWithTimeout(API_BACKUP.url, {
            method: "POST",
            headers: API_BACKUP.headers,
            body: JSON.stringify({ to, subject, html })
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
// TEMPLATE HTML
// ============================================================
function buildEmailHTML({ title, greeting, intro, rows = [], warning = '', footer }) {
    const rowsHTML = rows.map(r => `
        <tr>
            <td style="padding:8px 0;font-size:13px;color:#888;font-weight:500;">${r.label}</td>
            <td style="padding:8px 0;font-size:14px;color:#111;font-weight:700;text-align:right;font-family:'Courier New',monospace;">${r.value}</td>
        </tr>
    `).join('');

    const warningHTML = warning ? `
        <div style="background:#fff5eb;border-left:4px solid #ff7a00;padding:12px 16px;border-radius:6px;margin:20px 0;font-size:12px;color:#8a4400;line-height:1.5;">
            ⚠️ ${warning}
        </div>
    ` : '';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:20px;background:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <div style="max-width:520px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
                
                <!-- Header -->
                <div style="background:linear-gradient(135deg,#ff7a00 0%,#ff9533 100%);padding:24px 30px;text-align:center;">
                    <div style="font-size:22px;font-weight:800;color:white;letter-spacing:2px;">🏛️ APP PAY</div>
                </div>

                <!-- Body -->
                <div style="padding:30px;">
                    <h1 style="font-size:18px;font-weight:700;color:#111;margin:0 0 16px 0;">${title}</h1>
                    <p style="font-size:14px;color:#333;margin:0 0 12px 0;">${greeting}</p>
                    <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 20px 0;">${intro}</p>

                    ${rowsHTML ? `
                        <table style="width:100%;border-collapse:collapse;background:#f8f9fa;border-radius:8px;padding:8px 16px;margin:20px 0;">
                            <tbody style="display:block;padding:8px 16px;">
                                ${rowsHTML}
                            </tbody>
                        </table>
                    ` : ''}

                    ${warningHTML}

                    <p style="font-size:13px;color:#666;line-height:1.6;margin:20px 0 0 0;">${footer}</p>

                    <p style="font-size:13px;color:#888;margin:30px 0 0 0;">
                        ${EMAIL_TRANSLATIONS.fr.greeting}<br>
                        <strong style="color:#ff7a00;">${EMAIL_TRANSLATIONS.fr.teamName}</strong>
                    </p>
                </div>

                <!-- Footer -->
                <div style="background:#f8f9fa;padding:16px 30px;text-align:center;border-top:1px solid #f0f0f0;">
                    <p style="font-size:11px;color:#999;margin:0;line-height:1.5;">
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
    const name = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.loginSubject,
        greeting: replaceVars(t.loginGreeting, { name }),
        intro: t.loginIntro,
        rows: [
            { label: t.loginEmailLabel, value: client.email },
            { label: t.loginPinLabel, value: client.pin }
        ],
        warning: t.loginSecurity,
        footer: t.loginFooter
    });

    return await sendEmail({
        to: client.email,
        subject: t.loginSubject,
        html
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
    const name = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.activationSubject,
        greeting: replaceVars(t.activationGreeting, { name }),
        intro: t.activationIntro,
        rows: [
            { label: t.activationCodeLabel, value: client.activationCode }
        ],
        warning: t.activationWarning,
        footer: t.activationFooter
    });

    return await sendEmail({
        to: client.email,
        subject: t.activationSubject,
        html
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
    const name = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.transferSuccessSubject,
        greeting: replaceVars(t.transferSuccessGreeting, { name }),
        intro: t.transferSuccessIntro,
        rows: [
            { label: t.transferAmountLabel, value: formatAmount(transfer.amount, client.currency) },
            { label: t.transferBeneficiaryLabel, value: transfer.beneficiary || '—' },
            { label: t.transferDateLabel, value: transfer.date || new Date().toLocaleString('fr-FR') },
            { label: t.transferReferenceLabel, value: transfer.reference || '—' }
        ],
        footer: t.transferSuccessFooter
    });

    return await sendEmail({
        to: client.email,
        subject: t.transferSuccessSubject,
        html
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
    const name = getClientFirstName(client);

    const html = buildEmailHTML({
        title: t.transferFailedSubject,
        greeting: replaceVars(t.transferFailedGreeting, { name }),
        intro: t.transferFailedIntro,
        rows: [
            { label: t.transferFailedReason, value: t.transferFailedReasonPercent },
            { label: t.transferFailedAmountLabel, value: formatAmount(details.amount, client.currency) },
            { label: t.transferFailedLimitLabel, value: formatAmount(details.limit, client.currency) }
        ],
        footer: t.transferFailedFooter
    });

    return await sendEmail({
        to: client.email,
        subject: t.transferFailedSubject,
        html
    });
}
