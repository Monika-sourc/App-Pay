// ============================================================
// APP PAY - Logique client (Firebase + i18n + temps réel)
// ============================================================

import {
    db,
    authPromise,
    collection,
    doc,
    getDocFromServer,
    getDoc,
    updateDoc,
    onSnapshot
} from './firebase-config.js';

import { getBankLogoUrls } from './banks.js';
import { sendTransferSuccess, sendTransferFailed } from './emails.js';

// ---------- ÉTAT GLOBAL ----------
const appState = {
    client: null,
    clientId: null,
    balance: 0,
    currency: 'zł',
    transactions: [],
    pendingTransfer: null,
    lang: 'fr',
    unsubSnapshot: null
};

// Clé de stockage de session
const SESSION_KEY = 'apppay_session_v2';

// ============================================================
// TRADUCTIONS (i18n)
// ============================================================
const TRANSLATIONS = {
    fr: {
        dashboard: "Portefeuille",
        personal_iban: "IBAN Personnel",
        logout: "Déconnexion",
        profile: "Profil",
        transfer_menu: "Virement",
        transfer_btn: "Effectuer un virement",
        virtual_card_btn: "Carte virtuelle",
        
        available_balance: "Solde disponible",
        account_subtitle: "Compte pour tous vos besoins",
        see_iban: "Voir mon IBAN",
        make_transfer: "Effectuer un virement",
        see_card: "Carte virtuelle",
        international_transfer: "Effectuer un virement international",
        transfer_warning: "Le traitement du transfert prend de 1 à 3 minutes après la vérification finale.",
        transactions_history: "Historique des transactions",
        total_balance: "Solde total",
        transactions_label: "Transactions",
        currency_label: "Devise",
        view_all: "Voir tout",
        today: "Aujourd'hui",
        yesterday: "Hier",
        transfer_received: "Virement reçu",
        transfer_sent: "Virement envoyé",
        completed: "Réalisé",
        amount: "Montant du virement",
        beneficiary_name: "Nom du bénéficiaire",
        iban: "IBAN / Numéro de Compte",
        bic: "Code Banque (BIC / SWIFT)",
        bank_name: "Nom de la Banque",
        reason: "Raison du virement",
        continue: "Continuer",
        identity_verification: "Vérification d'identité",
        pending_transfer_details: "Détails du virement en attente",
        cancel_transfer: "Annuler le virement",
        enter_activation_code: "Veuillez saisir le code d'activation du virement",
        activation_code: "Code d'activation",
        transfer_in_progress: "Votre ordre de virement en cours...",
        identity_verified: "Vérification d'identité effectuée avec succès.",
        progress_desc: "Veuillez patienter la fin du virement des fonds vers votre banque avant d'actualiser cette page.",
        transfer_success: "Virement effectué avec succès",
        success_subtitle: "Votre virement a été traité et sera crédité sur le compte du bénéficiaire sous 24 à 48 heures.",
        transfer_failed: "Virement échoué",
        transfer_failed_subtitle: "Le montant saisi dépasse la limite autorisée par votre compte. Veuillez contacter votre conseiller.",
        amount_sent: "Montant envoyé",
        beneficiary: "Bénéficiaire",
        date: "Date",
        reference: "Référence",
        back_to_dashboard: "Retour au tableau de bord",
        my_virtual_card: "Carte virtuelle",
        holder: "Titulaire",
        expires: "Expire",
        show_details: "Afficher les détails",
        hide_details: "Masquer les détails",
        freeze_card: "Geler la carte",
        settings: "Paramètres",
        monthly_limit: "Plafond mensuel",
        monthly_spent: "Dépenses du mois",
        status: "Statut",
        active: "Active",
        type: "Type",
        verified: "Vérifié",
        account_holder_premium: "Titulaire du compte • Client Premium",
        full_name: "Nom complet",
        email_address: "Adresse e-mail",
        phone_number: "Numéro de téléphone",
        country: "Pays de résidence",
        account_id: "Identifiant unique",
        opening_date: "Date d'ouverture",
        edit_profile: "Modifier le profil",
        security: "Sécurité",
        notifications: "Notifications",
        no_transactions: "Aucune transaction pour le moment",
        err_email: "Adresse e-mail incorrecte.",
        err_pin: "Code PIN incorrect.",
        err_amount: "Montant invalide.",
        err_balance: "Solde insuffisant.",
        err_fields: "Veuillez remplir tous les champs.",
        err_activation: "Code d'activation incorrect.",
        err_percent: "Le montant dépasse la limite autorisée ({limit}).",
        err_client_not_found: "Client introuvable. Lien invalide.",
        err_no_link: "Aucun lien fourni. Accès refusé.",
        welcome: "Bienvenue",
        login_success: "Connexion réussie. Bienvenue !",
        transfer_cancelled: "Virement annulé.",
        transfer_finalized: "Virement finalisé avec succès !",
        err_card_locked: "L'affichage des détails de la carte n'est pas autorisé par l'administrateur.",
        err_iban_locked: "L'affichage de l'IBAN complet n'est pas autorisé par l'administrateur.",
        iban_copied: "IBAN copié !",
        swift_copied: "Code SWIFT copié !",
        placeholder_email: "Votre adresse e-mail",
        placeholder_pin: "Votre code PIN",
        placeholder_activation: "Entrez votre code secret",
        card_footer: "Cette carte est la propriété exclusive d'APP PAY. Toute utilisation frauduleuse sera poursuivie.",
        card_security_note: "Les 4 derniers chiffres et le CVV ont été masqués pour des raisons de sécurité.",
        visa_premium: "Mastercard Premium",
        bank_details: "Coordonnées bancaires",
        iban_number: "Numéro IBAN",
        swift_code: "Code SWIFT / BIC",
        iban_info_note: "Utilisez ces coordonnées pour recevoir des virements. Les 4 derniers chiffres de l'IBAN sont masqués pour des raisons de sécurité.",
        show_iban: "Afficher l'IBAN complet",
        hide_iban: "Masquer l'IBAN",
        allowed_limit: "Limite autorisée :",
        limit_percentage: "Pourcentage limite :",
        current_balance: "Solde actuel :",
        attempted_amount: "Montant tenté :",
        new_transaction_received: "Nouvelle transaction reçue !",
        copied: "Copié !",
        
        // NOUVELLES TRADUCTIONS POUR LA CARTE ET LE REÇU
        tap_to_flip: "Appuyez sur la carte pour la retourner",
        view_full_card: "Voir le numéro complet",
        flip_card: "Retourner la carte",
        view_cvv: "Voir le code CVV",
        receipt_title: "REÇU DE TRANSACTION",
        receipt_sender: "Émetteur",
        receipt_thank_you: "Merci d'avoir utilisé APP PAY. Ce reçu est généré automatiquement.",
        close: "Fermer"
    },
    en: {
        dashboard: "Wallet",
        personal_iban: "Personal IBAN",
        logout: "Logout",
        profile: "Profile",
        transfer_menu: "Transfer",
        transfer_btn: "Make a transfer",
        virtual_card_btn: "Virtual Card",
        
        available_balance: "Available balance",
        account_subtitle: "Account for all your needs",
        see_iban: "See my IBAN",
        make_transfer: "Make a transfer",
        see_card: "Virtual Card",
        international_transfer: "Make an international transfer",
        transfer_warning: "Transfer processing takes 1 to 3 minutes after final verification.",
        transactions_history: "Transaction history",
        total_balance: "Total balance",
        transactions_label: "Transactions",
        currency_label: "Currency",
        view_all: "View all",
        today: "Today",
        yesterday: "Yesterday",
        transfer_received: "Transfer received",
        transfer_sent: "Transfer sent",
        completed: "Completed",
        amount: "Transfer amount",
        beneficiary_name: "Beneficiary name",
        iban: "IBAN / Account number",
        bic: "Bank code (BIC / SWIFT)",
        bank_name: "Bank name",
        reason: "Transfer reason",
        continue: "Continue",
        identity_verification: "Identity verification",
        pending_transfer_details: "Pending transfer details",
        cancel_transfer: "Cancel transfer",
        enter_activation_code: "Please enter the transfer activation code",
        activation_code: "Activation code",
        transfer_in_progress: "Your transfer is in progress...",
        identity_verified: "Identity verification successful.",
        progress_desc: "Please wait for the funds to reach your bank before refreshing this page.",
        transfer_success: "Transfer completed successfully",
        success_subtitle: "Your transfer has been processed and will be credited to the beneficiary within 24 to 48 hours.",
        transfer_failed: "Transfer failed",
        transfer_failed_subtitle: "The entered amount exceeds the limit allowed by your account. Please contact your advisor.",
        amount_sent: "Amount sent",
        beneficiary: "Beneficiary",
        date: "Date",
        reference: "Reference",
        back_to_dashboard: "Back to dashboard",
        my_virtual_card: "Virtual Card",
        holder: "Holder",
        expires: "Expires",
        show_details: "Show details",
        hide_details: "Hide details",
        freeze_card: "Freeze card",
        settings: "Settings",
        monthly_limit: "Monthly limit",
        monthly_spent: "Monthly spent",
        status: "Status",
        active: "Active",
        type: "Type",
        verified: "Verified",
        account_holder_premium: "Account holder • Premium Client",
        full_name: "Full name",
        email_address: "Email address",
        phone_number: "Phone number",
        country: "Country of residence",
        account_id: "Unique ID",
        opening_date: "Opening date",
        edit_profile: "Edit profile",
        security: "Security",
        notifications: "Notifications",
        no_transactions: "No transactions yet",
        err_email: "Incorrect email address.",
        err_pin: "Incorrect PIN code.",
        err_amount: "Invalid amount.",
        err_balance: "Insufficient balance.",
        err_fields: "Please fill in all fields.",
        err_activation: "Incorrect activation code.",
        err_percent: "Amount exceeds allowed limit ({limit}).",
        err_client_not_found: "Client not found. Invalid link.",
        err_no_link: "No link provided. Access denied.",
        welcome: "Welcome",
        login_success: "Login successful. Welcome!",
        transfer_cancelled: "Transfer cancelled.",
        transfer_finalized: "Transfer completed successfully!",
        err_card_locked: "Card details display is not authorized by the administrator.",
        err_iban_locked: "IBAN display is not authorized by the administrator.",
        iban_copied: "IBAN copied!",
        swift_copied: "SWIFT code copied!",
        placeholder_email: "Your email address",
        placeholder_pin: "Your PIN code",
        placeholder_activation: "Enter your secret code",
        card_footer: "This card is the exclusive property of APP PAY. Any fraudulent use will be prosecuted.",
        card_security_note: "The last 4 digits and CVV have been masked for security reasons.",
        visa_premium: "Mastercard Premium",
        bank_details: "Bank details",
        iban_number: "IBAN number",
        swift_code: "SWIFT / BIC code",
        iban_info_note: "Use these details to receive transfers. The last 4 digits of the IBAN are masked for security reasons.",
        show_iban: "Show full IBAN",
        hide_iban: "Hide IBAN",
        allowed_limit: "Allowed limit:",
        limit_percentage: "Limit percentage:",
        current_balance: "Current balance:",
        attempted_amount: "Attempted amount:",
        new_transaction_received: "New transaction received!",
        copied: "Copied!",
        
        tap_to_flip: "Tap the card to flip",
        view_full_card: "View full number",
        flip_card: "Flip card",
        view_cvv: "View CVV code",
        receipt_title: "TRANSACTION RECEIPT",
        receipt_sender: "Sender",
        receipt_thank_you: "Thank you for using APP PAY. This receipt is generated automatically.",
        close: "Close"
    },
    es: {
        dashboard: "Cartera",
        personal_iban: "IBAN Personal",
        logout: "Cerrar sesión",
        profile: "Perfil",
        transfer_menu: "Transferencia",
        transfer_btn: "Hacer una transferencia",
        virtual_card_btn: "Tarjeta virtual",
        
        available_balance: "Saldo disponible",
        account_subtitle: "Cuenta para todas tus necesidades",
        see_iban: "Ver mi IBAN",
        make_transfer: "Hacer una transferencia",
        see_card: "Tarjeta virtual",
        international_transfer: "Hacer una transferencia internacional",
        transfer_warning: "El procesamiento de la transferencia tarda de 1 a 3 minutos después de la verificación final.",
        transactions_history: "Historial de transacciones",
        total_balance: "Saldo total",
        transactions_label: "Transacciones",
        currency_label: "Moneda",
        view_all: "Ver todo",
        today: "Hoy",
        yesterday: "Ayer",
        transfer_received: "Transferencia recibida",
        transfer_sent: "Transferencia enviada",
        completed: "Completado",
        amount: "Importe de la transferencia",
        beneficiary_name: "Nombre del beneficiario",
        iban: "IBAN / Número de cuenta",
        bic: "Código bancario (BIC / SWIFT)",
        bank_name: "Nombre del banco",
        reason: "Motivo de la transferencia",
        continue: "Continuar",
        identity_verification: "Verificación de identidad",
        pending_transfer_details: "Detalles de la transferencia pendiente",
        cancel_transfer: "Cancelar transferencia",
        enter_activation_code: "Introduzca el código de activación",
        activation_code: "Código de activación",
        transfer_in_progress: "Su transferencia está en curso...",
        identity_verified: "Verificación de identidad exitosa.",
        progress_desc: "Espere a que los fondos lleguen a su banco antes de actualizar.",
        transfer_success: "Transferencia completada con éxito",
        success_subtitle: "Su transferencia ha sido procesada y se acreditará en 24 a 48 horas.",
        transfer_failed: "Transferencia fallida",
        transfer_failed_subtitle: "El importe introducido supera el límite permitido por su cuenta.",
        amount_sent: "Importe enviado",
        beneficiary: "Beneficiario",
        date: "Fecha",
        reference: "Referencia",
        back_to_dashboard: "Volver al panel",
        my_virtual_card: "Tarjeta virtual",
        holder: "Titular",
        expires: "Caduca",
        show_details: "Mostrar detalles",
        hide_details: "Ocultar detalles",
        freeze_card: "Congelar tarjeta",
        settings: "Ajustes",
        monthly_limit: "Límite mensual",
        monthly_spent: "Gastos del mes",
        status: "Estado",
        active: "Activa",
        type: "Tipo",
        verified: "Verificado",
        account_holder_premium: "Titular • Cliente Premium",
        full_name: "Nombre completo",
        email_address: "Correo electrónico",
        phone_number: "Número de teléfono",
        country: "País de residencia",
        account_id: "ID único",
        opening_date: "Fecha de apertura",
        edit_profile: "Editar perfil",
        security: "Seguridad",
        notifications: "Notificaciones",
        no_transactions: "Sin transacciones por ahora",
        err_email: "Correo electrónico incorrecto.",
        err_pin: "PIN incorrecto.",
        err_amount: "Importe inválido.",
        err_balance: "Saldo insuficiente.",
        err_fields: "Por favor, rellene todos los campos.",
        err_activation: "Código de activación incorrecto.",
        err_percent: "El importe supera el límite permitido ({limit}).",
        err_client_not_found: "Cliente no encontrado. Enlace inválido.",
        err_no_link: "Sin enlace. Acceso denegado.",
        welcome: "Bienvenido",
        login_success: "¡Inicio de sesión exitoso!",
        transfer_cancelled: "Transferencia cancelada.",
        transfer_finalized: "¡Transferencia completada!",
        err_card_locked: "La visualización de los detalles de la tarjeta no está autorizada por el administrador.",
        err_iban_locked: "La visualización del IBAN no está autorizada por el administrador.",
        iban_copied: "¡IBAN copiado!",
        swift_copied: "¡Código SWIFT copiado!",
        placeholder_email: "Su correo electrónico",
        placeholder_pin: "Su código PIN",
        placeholder_activation: "Introduzca su código secreto",
        card_footer: "Esta tarjeta es propiedad exclusiva de APP PAY. Cualquier uso fraudulento será procesado.",
        card_security_note: "Los últimos 4 dígitos y el CVV se han ocultado por razones de seguridad.",
        visa_premium: "Mastercard Premium",
        bank_details: "Datos bancarios",
        iban_number: "Número IBAN",
        swift_code: "Código SWIFT / BIC",
        iban_info_note: "Utilice estos datos para recibir transferencias. Los últimos 4 dígitos del IBAN están ocultos por razones de seguridad.",
        show_iban: "Mostrar IBAN completo",
        hide_iban: "Ocultar IBAN",
        allowed_limit: "Límite permitido:",
        limit_percentage: "Porcentaje límite:",
        current_balance: "Saldo actual:",
        attempted_amount: "Importe intentado:",
        new_transaction_received: "¡Nueva transacción recibida!",
        copied: "¡Copiado!",
        
        tap_to_flip: "Toca la tarjeta para voltearla",
        view_full_card: "Ver número completo",
        flip_card: "Voltear tarjeta",
        view_cvv: "Ver código CVV",
        receipt_title: "RECIBO DE TRANSACCIÓN",
        receipt_sender: "Remitente",
        receipt_thank_you: "Gracias por usar APP PAY. Este recibo se genera automáticamente.",
        close: "Cerrar"
    },
    de: {
        dashboard: "Portemonnaie",
        personal_iban: "Persönliche IBAN",
        logout: "Abmelden",
        profile: "Profil",
        transfer_menu: "Überweisung",
        transfer_btn: "Überweisung durchführen",
        virtual_card_btn: "Virtuelle Karte",
        
        available_balance: "Verfügbares Guthaben",
        account_subtitle: "Konto für alle Ihre Bedürfnisse",
        see_iban: "IBAN anzeigen",
        make_transfer: "Überweisung durchführen",
        see_card: "Virtuelle Karte",
        international_transfer: "Internationale Überweisung durchführen",
        transfer_warning: "Die Bearbeitung der Überweisung dauert nach der endgültigen Überprüfung 1 bis 3 Minuten.",
        transactions_history: "Transaktionsverlauf",
        total_balance: "Gesamtguthaben",
        transactions_label: "Transaktionen",
        currency_label: "Währung",
        view_all: "Alle anzeigen",
        today: "Heute",
        yesterday: "Gestern",
        transfer_received: "Überweisung erhalten",
        transfer_sent: "Überweisung gesendet",
        completed: "Abgeschlossen",
        amount: "Überweisungsbetrag",
        beneficiary_name: "Name des Begünstigten",
        iban: "IBAN / Kontonummer",
        bic: "Bankleitzahl (BIC / SWIFT)",
        bank_name: "Bankname",
        reason: "Überweisungsgrund",
        continue: "Weiter",
        identity_verification: "Identitätsüberprüfung",
        pending_transfer_details: "Details der ausstehenden Überweisung",
        cancel_transfer: "Überweisung abbrechen",
        enter_activation_code: "Bitte geben Sie den Aktivierungscode ein",
        activation_code: "Aktivierungscode",
        transfer_in_progress: "Ihre Überweisung wird bearbeitet...",
        identity_verified: "Identitätsprüfung erfolgreich.",
        progress_desc: "Bitte warten Sie, bis das Geld bei Ihrer Bank eingegangen ist.",
        transfer_success: "Überweisung erfolgreich abgeschlossen",
        success_subtitle: "Ihre Überweisung wurde bearbeitet und wird innerhalb von 24 bis 48 Stunden gutgeschrieben.",
        transfer_failed: "Überweisung fehlgeschlagen",
        transfer_failed_subtitle: "Der eingegebene Betrag überschreitet das von Ihrem Konto zugelassene Limit.",
        amount_sent: "Gesendeter Betrag",
        beneficiary: "Begünstigter",
        date: "Datum",
        reference: "Referenz",
        back_to_dashboard: "Zurück zum Dashboard",
        my_virtual_card: "Virtuelle Karte",
        holder: "Inhaber",
        expires: "Gültig bis",
        show_details: "Details anzeigen",
        hide_details: "Details verbergen",
        freeze_card: "Karte sperren",
        settings: "Einstellungen",
        monthly_limit: "Monatliches Limit",
        monthly_spent: "Diesen Monat ausgegeben",
        status: "Status",
        active: "Aktiv",
        type: "Typ",
        verified: "Verifiziert",
        account_holder_premium: "Kontoinhaber • Premium-Kunde",
        full_name: "Vollständiger Name",
        email_address: "E-Mail-Adresse",
        phone_number: "Telefonnummer",
        country: "Wohnsitzland",
        account_id: "Eindeutige ID",
        opening_date: "Eröffnungsdatum",
        edit_profile: "Profil bearbeiten",
        security: "Sicherheit",
        notifications: "Benachrichtigungen",
        no_transactions: "Noch keine Transaktionen",
        err_email: "Falsche E-Mail-Adresse.",
        err_pin: "Falscher PIN-Code.",
        err_amount: "Ungültiger Betrag.",
        err_balance: "Unzureichendes Guthaben.",
        err_fields: "Bitte alle Felder ausfüllen.",
        err_activation: "Falscher Aktivierungscode.",
        err_percent: "Betrag überschreitet das Limit ({limit}).",
        err_client_not_found: "Kunde nicht gefunden. Ungültiger Link.",
        err_no_link: "Kein Link. Zugriff verweigert.",
        welcome: "Willkommen",
        login_success: "Anmeldung erfolgreich. Willkommen!",
        transfer_cancelled: "Überweisung abgebrochen.",
        transfer_finalized: "Überweisung erfolgreich abgeschlossen!",
        err_card_locked: "Die Anzeige der Kartendetails ist vom Administrator nicht autorisiert.",
        err_iban_locked: "Die Anzeige der IBAN ist vom Administrator nicht autorisiert.",
        iban_copied: "IBAN kopiert!",
        swift_copied: "SWIFT-Code kopiert!",
        placeholder_email: "Ihre E-Mail-Adresse",
        placeholder_pin: "Ihr PIN-Code",
        placeholder_activation: "Geheimen Code eingeben",
        card_footer: "Diese Karte ist das ausschließliche Eigentum von APP PAY. Jede betrügerische Verwendung wird strafrechtlich verfolgt.",
        card_security_note: "Die letzten 4 Ziffern und der CVV wurden aus Sicherheitsgründen maskiert.",
        visa_premium: "Mastercard Premium",
        bank_details: "Bankverbindung",
        iban_number: "IBAN-Nummer",
        swift_code: "SWIFT / BIC-Code",
        iban_info_note: "Verwenden Sie diese Daten, um Überweisungen zu erhalten. Die letzten 4 Ziffern der IBAN sind aus Sicherheitsgründen maskiert.",
        show_iban: "Vollständige IBAN anzeigen",
        hide_iban: "IBAN ausblenden",
        allowed_limit: "Zulässiges Limit:",
        limit_percentage: "Limit-Prozentsatz:",
        current_balance: "Aktuelles Guthaben:",
        attempted_amount: "Versuchter Betrag:",
        new_transaction_received: "Neue Transaktion erhalten!",
        copied: "Kopiert!",
        
        tap_to_flip: "Tippen Sie auf die Karte, um sie umzudrehen",
        view_full_card: "Vollständige Nummer anzeigen",
        flip_card: "Karte umdrehen",
        view_cvv: "CVV-Code anzeigen",
        receipt_title: "TRANSAKTIONSBELEG",
        receipt_sender: "Absender",
        receipt_thank_you: "Vielen Dank, dass Sie APP PAY nutzen. Dieser Beleg wird automatisch generiert.",
        close: "Schließen"
    },
    pl: {
        dashboard: "Portfel",
        personal_iban: "Osobisty IBAN",
        logout: "Wyloguj",
        profile: "Profil",
        transfer_menu: "Przelew",
        transfer_btn: "Wykonaj przelew",
        virtual_card_btn: "Karta wirtualna",
        
        available_balance: "Dostępne saldo",
        account_subtitle: "Konto na wszystkie potrzeby",
        see_iban: "Zobacz moje IBAN",
        make_transfer: "Wykonaj przelew",
        see_card: "Karta wirtualna",
        international_transfer: "Wykonaj przelew międzynarodowy",
        transfer_warning: "Przetwarzanie przelewu zajmuje od 1 do 3 minut po ostatecznej weryfikacji.",
        transactions_history: "Historia transakcji",
        total_balance: "Całkowite saldo",
        transactions_label: "Transakcje",
        currency_label: "Waluta",
        view_all: "Zobacz wszystko",
        today: "Dzisiaj",
        yesterday: "Wczoraj",
        transfer_received: "Przelew otrzymany",
        transfer_sent: "Przelew wysłany",
        completed: "Zrealizowane",
        amount: "Kwota przelewu",
        beneficiary_name: "Nazwa odbiorcy",
        iban: "IBAN / Numer konta",
        bic: "Kod banku (BIC / SWIFT)",
        bank_name: "Nazwa banku",
        reason: "Powód przelewu",
        continue: "Kontynuuj",
        identity_verification: "Weryfikacja tożsamości",
        pending_transfer_details: "Szczegóły oczekującego przelewu",
        cancel_transfer: "Anuluj przelew",
        enter_activation_code: "Wprowadź kod aktywacyjny przelewu",
        activation_code: "Kod aktywacyjny",
        transfer_in_progress: "Twój przelew jest w trakcie realizacji...",
        identity_verified: "Weryfikacja tożsamości zakończona pomyślnie.",
        progress_desc: "Poczekaj na zaksięgowanie środków w banku.",
        transfer_success: "Przelew zakończony pomyślnie",
        success_subtitle: "Twój przelew został przetworzony i zostanie zaksięgowany w ciągu 24-48 godzin.",
        transfer_failed: "Przelew nieudany",
        transfer_failed_subtitle: "Wprowadzona kwota przekracza limit dozwolony dla Twojego konta.",
        amount_sent: "Wysłana kwota",
        beneficiary: "Odbiorca",
        date: "Data",
        reference: "Referencja",
        back_to_dashboard: "Powrót do pulpitu",
        my_virtual_card: "Karta wirtualna",
        holder: "Posiadacz",
        expires: "Ważna do",
        show_details: "Pokaż szczegóły",
        hide_details: "Ukryj szczegóły",
        freeze_card: "Zablokuj kartę",
        settings: "Ustawienia",
        monthly_limit: "Miesięczny limit",
        monthly_spent: "Wydatki w tym miesiącu",
        status: "Status",
        active: "Aktywna",
        type: "Typ",
        verified: "Zweryfikowany",
        account_holder_premium: "Posiadacz konta • Klient Premium",
        full_name: "Pełne imię i nazwisko",
        email_address: "Adres e-mail",
        phone_number: "Numer telefonu",
        country: "Kraj zamieszkania",
        account_id: "Unikalny identyfikator",
        opening_date: "Data otwarcia",
        edit_profile: "Edytuj profil",
        security: "Bezpieczeństwo",
        notifications: "Powiadomienia",
        no_transactions: "Brak transakcji",
        err_email: "Nieprawidłowy adres e-mail.",
        err_pin: "Nieprawidłowy kod PIN.",
        err_amount: "Nieprawidłowa kwota.",
        err_balance: "Niewystarczające saldo.",
        err_fields: "Wypełnij wszystkie pola.",
        err_activation: "Nieprawidłowy kod aktywacyjny.",
        err_percent: "Kwota przekracza dozwolony limit ({limit}).",
        err_client_not_found: "Nie znaleziono klienta. Nieprawidłowy link.",
        err_no_link: "Brak linku. Odmowa dostępu.",
        welcome: "Witaj",
        login_success: "Zalogowano pomyślnie. Witaj!",
        transfer_cancelled: "Przelew anulowany.",
        transfer_finalized: "Przelew zakończony pomyślnie!",
        err_card_locked: "Wyświetlanie szczegółów karty nie jest autoryzowane przez administratora.",
        err_iban_locked: "Wyświetlanie IBAN nie jest autoryzowane przez administratora.",
        iban_copied: "IBAN skopiowany!",
        swift_copied: "Kod SWIFT skopiowany!",
        placeholder_email: "Twój adres e-mail",
        placeholder_pin: "Twój kod PIN",
        placeholder_activation: "Wprowadź tajny kod",
        card_footer: "Ta karta jest wyłączną własnością APP PAY. Każde oszukańcze użycie będzie ścigane.",
        card_security_note: "Ostatnie 4 cyfry i CVV zostały ukryte ze względów bezpieczeństwa.",
        visa_premium: "Mastercard Premium",
        bank_details: "Dane bankowe",
        iban_number: "Numer IBAN",
        swift_code: "Kod SWIFT / BIC",
        iban_info_note: "Użyj tych danych, aby otrzymywać przelewy. Ostatnie 4 cyfry IBAN są ukryte ze względów bezpieczeństwa.",
        show_iban: "Pokaż pełny IBAN",
        hide_iban: "Ukryj IBAN",
        allowed_limit: "Dozwolony limit:",
        limit_percentage: "Procent limitu:",
        current_balance: "Obecne saldo:",
        attempted_amount: "Próbowana kwota:",
        new_transaction_received: "Otrzymano nową transakcję!",
        copied: "Skopiowano!",
        
        tap_to_flip: "Dotknij karty, aby ją odwrócić",
        view_full_card: "Pokaż pełny numer",
        flip_card: "Odwróć kartę",
        view_cvv: "Pokaż kod CVV",
        receipt_title: "POKWITOWANIE TRANSAKCJI",
        receipt_sender: "Nadawca",
        receipt_thank_you: "Dziękujemy za korzystanie z APP PAY. To pokwitowanie jest generowane automatycznie.",
        close: "Zamknij"
    }
};

// ---------- TRADUCTION ----------
function t(key, vars = {}) {
    const dict = TRANSLATIONS[appState.lang] || TRANSLATIONS.fr;
    let text = dict[key] || TRANSLATIONS.fr[key] || key;
    Object.keys(vars).forEach(k => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
    });
    return text;
}

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        el.placeholder = t(key);
    });
}

// ---------- COULEUR DYNAMIQUE ----------
function applyClientColor(color) {
    if (!color) color = '#ff7a00';
    document.getElementById('app-screen')?.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-color-light', lightenColor(color, 15));
    document.documentElement.style.setProperty('--primary-color-dark', darkenColor(color, 15));
    document.documentElement.style.setProperty('--primary-color-soft', hexToRgba(color, 0.1));
}

function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
}
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}
function lightenColor(hex, percent) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r + (255 - r) * (percent / 100), g + (255 - g) * (percent / 100), b + (255 - b) * (percent / 100));
}
function darkenColor(hex, percent) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHex(r * (1 - percent / 100), g * (1 - percent / 100), b * (1 - percent / 100));
}
function hexToRgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------- UTILITAIRES ----------
function formatMoney(amount) {
    const num = Number(amount) || 0;
    return num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + appState.currency;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getClientIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function generateCardDetails() {
    const prefix = "4823"; 
    const randomDigits = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    const cardNumber = prefix + randomDigits;
    const cvv = Math.floor(Math.random() * 900 + 100).toString();
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = (now.getFullYear() + 3).toString().slice(-2);
    const expiry = `${month}/${year}`;
    return { cardNumber, cvv, expiry };
}

function generateIbanDetails() {
    const rand = (len) => Math.floor(Math.random() * Math.pow(10, len)).toString().padStart(len, '0');
    const iban = `PL${rand(2)} ${rand(4)} ${rand(4)} ${rand(4)} ${rand(4)} ${rand(4)} ${rand(4)}`;
    const swift = `WBKPPLPP${rand(3)}`;
    return { iban, swift };
}

function getDateGroupLabel(dateStr, lang) {
    if (!dateStr) return '';
    const datePart = dateStr.split(' • ')[0].trim();
    const parts = datePart.split('/');
    if (parts.length !== 3) return datePart;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const txDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    txDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - txDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('today');
    if (diffDays === 1) return t('yesterday');
    return datePart;
}

// ============================================================
// SESSION
// ============================================================
function saveSession() {
    if (!appState.clientId) return;
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ clientId: appState.clientId, loggedIn: true, savedAt: Date.now() }));
    } catch (e) {}
}

function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (Date.now() - data.savedAt > 7 * 24 * 60 * 60 * 1000) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
        return data;
    } catch { return null; }
}

function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch {}
}

// ============================================================
// ÉCRAN DE BLOCAGE
// ============================================================
function showBlockedScreen(client) {
    const card = document.querySelector('#invalid-screen .invalid-card');
    if (card) {
        const iconBox = card.querySelector('.invalid-icon');
        iconBox.innerHTML = '<i class="fa-solid fa-lock"></i>';
        iconBox.style.backgroundColor = '#fef3c7';
        iconBox.style.color = '#d97706';
        card.querySelector('.invalid-title').textContent = 'Compte temporairement bloqué';
        const name = client ? `${client.firstName || ''} ${client.lastName || ''}`.trim() : '';
        card.querySelector('.invalid-message').textContent = name
            ? `Bonjour ${name}, votre accès au compte App Pay a été temporairement suspendu par l'administrateur.`
            : `Votre accès au compte App Pay a été temporairement suspendu par l'administrateur.`;
        const infoSpan = card.querySelector('.invalid-info span');
        if (infoSpan) infoSpan.textContent = 'Veuillez contacter l\'administrateur pour rétablir votre accès.';
    }
    showScreen('invalid-screen');
}

// ============================================================
// TEMPS RÉEL : ÉCOUTE DES CHANGEMENTS FIRESTORE
// ============================================================
function startRealtimeListener() {
    if (!appState.clientId) return;

    if (appState.unsubSnapshot) {
        appState.unsubSnapshot();
        appState.unsubSnapshot = null;
    }

    try {
        const docRef = doc(db, 'clients', appState.clientId);
        appState.unsubSnapshot = onSnapshot(docRef, (docSnap) => {
            if (!docSnap.exists()) {
                clearSession();
                showScreen('invalid-screen');
                return;
            }

            const newData = docSnap.data();
            if (newData.blocked === true) {
                clearSession();
                showBlockedScreen(newData);
                return;
            }

            const oldTxCount = (appState.transactions || []).length;
            const oldColor = appState.client?.color;
            const oldLang = appState.lang;

            appState.client = newData;
            appState.balance = Number(newData.balance) || 0;
            appState.currency = newData.currency || 'zł';
            appState.transactions = newData.transactions || [];
            appState.lang = newData.language || 'fr';

            if (oldColor !== newData.color) applyClientColor(newData.color);
            if (oldLang !== appState.lang) applyLanguage();

            const appScreen = document.getElementById('app-screen');
            if (appScreen && appScreen.classList.contains('active')) {
                const activeView = document.querySelector('#nav-links li.active');
                const viewName = activeView ? activeView.dataset.view : 'dashboard';
                navigateTo(viewName);

                if (appState.transactions.length > oldTxCount) {
                    showToast(t('new_transaction_received'), 'success');
                }
            }
        }, (err) => {
            console.error('Erreur listener Firestore :', err);
        });
    } catch (err) {
        console.error('Erreur démarrage temps réel :', err);
    }
}

// ============================================================
// CHARGEMENT INITIAL DU CLIENT
// ============================================================
async function loadClientFromFirestore() {
    const clientId = getClientIdFromURL();

    if (!clientId) {
        showScreen('invalid-screen');
        return null;
    }

    appState.clientId = clientId;

    try {
        await authPromise;
        const docRef = doc(db, 'clients', clientId);
        let docSnap;
        try {
            docSnap = await getDocFromServer(docRef);
        } catch (err) {
            docSnap = await getDoc(docRef);
        }

        if (!docSnap.exists()) {
            showScreen('invalid-screen');
            return null;
        }

        const client = docSnap.data();
        appState.client = client;
        appState.balance = Number(client.balance) || 0;
        appState.currency = client.currency || 'zł';
        appState.transactions = client.transactions || [];
        appState.lang = client.language || 'fr';

        if (client.blocked === true) {
            clearSession();
            showBlockedScreen(client);
            return null;
        }

        if (!client.cardNumber || !client.cardCVV || !client.cardExpiry) {
            console.log("🆕 Génération automatique des détails de la carte virtuelle...");
            const newCard = generateCardDetails();
            
            await updateDoc(docRef, {
                cardNumber: newCard.cardNumber,
                cardCVV: newCard.cvv,
                cardExpiry: newCard.expiry
            });

            appState.client.cardNumber = newCard.cardNumber;
            appState.client.cardCVV = newCard.cvv;
            appState.client.cardExpiry = newCard.expiry;
        }

        if (!client.iban || !client.swift) {
            console.log("🆕 Génération automatique des détails de l'IBAN...");
            const newIban = generateIbanDetails();
            
            await updateDoc(docRef, {
                iban: newIban.iban,
                swift: newIban.swift,
                canViewIban: false 
            });

            appState.client.iban = newIban.iban;
            appState.client.swift = newIban.swift;
            appState.client.canViewIban = false;
        }

        applyClientColor(client.color);

        const badgeText = document.getElementById('badge-text');
        if (badgeText) badgeText.textContent = `${client.firstName} ${client.lastName}`.toUpperCase();

        const emailInput = document.getElementById('login-email');
        if (emailInput) emailInput.value = client.email;

        const session = getSession();
        const shouldAutoLogin = session && session.loggedIn && session.clientId === clientId;

        if (shouldAutoLogin) {
            loginSuccess();
        } else {
            showScreen('login-screen');
        }

        return client;

    } catch (err) {
        console.error('Erreur chargement client :', err);
        showScreen('invalid-screen');
        return null;
    }
}
// ---------- CONNEXION ----------
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pin = document.getElementById('login-password').value.trim();
    const errorEl = document.getElementById('login-error');
    const client = appState.client;

    if (!client) {
        errorEl.textContent = t('err_client_not_found');
        return;
    }

    if (client.blocked === true) {
        clearSession();
        showBlockedScreen(client);
        return;
    }

    if (email !== (client.email || '').toLowerCase()) {
        errorEl.textContent = t('err_email');
        return;
    }

    if (pin !== client.pin) {
        errorEl.textContent = t('err_pin');
        return;
    }

    errorEl.textContent = '';
    saveSession();
    loginSuccess();
}

function loginSuccess() {
    const client = appState.client;
    showScreen('app-screen');

    const initials = ((client.firstName || 'X')[0] + (client.lastName || 'X')[0]).toUpperCase();
    document.getElementById('header-avatar').textContent = initials;

    applyLanguage();

    startRealtimeListener();

    setTimeout(() => {
        navigateTo('dashboard', {}, true);
    }, 200);
}

// ---------- DÉCONNEXION ----------
function handleLogout() {
    if (!confirm(t('logout') + ' ?')) return;

    if (appState.unsubSnapshot) {
        appState.unsubSnapshot();
        appState.unsubSnapshot = null;
    }

    clearSession();
    showScreen('login-screen');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').textContent = '';
    if (appState.client) {
        document.getElementById('login-email').value = appState.client.email;
    }
    appState.pendingTransfer = null;
    appState.lang = appState.client?.language || 'fr';
}

// ============================================================
// LOADER GLOBAL
// ============================================================
function showLoader() {
    let loader = document.getElementById('global-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);
    }
    loader.classList.add('active');
}

function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.classList.remove('active');
}

// ============================================================
// NAVIGATION
// ============================================================
const viewTemplates = {
    dashboard: 'tpl-dashboard',
    transfer: 'tpl-transfer',
    verification: 'tpl-verification',
    progress: 'tpl-progress',
    success: 'tpl-success',
    failed: 'tpl-failed',
    card: 'tpl-card',
    iban: 'tpl-iban',
    account: 'tpl-account'
};

function navigateTo(viewName, data = {}, addToHistory = true) {
    showLoader();

    if (addToHistory) {
        history.pushState({ view: viewName, data: data }, '', `#${viewName}`);
    }

    setTimeout(() => {
        const container = document.getElementById('views-container');
        const templateId = viewTemplates[viewName];
        if (!templateId) {
            hideLoader();
            return;
        }

        const template = document.getElementById(templateId);
        if (!template) {
            hideLoader();
            return;
        }

        container.innerHTML = '';
        container.appendChild(template.content.cloneNode(true));

        document.querySelectorAll('#nav-links li').forEach(li => {
            li.classList.toggle('active', li.dataset.view === viewName);
        });

        applyLanguage();

        if (viewName === 'dashboard') renderDashboard();
        if (viewName === 'transfer') renderTransferView();
        if (viewName === 'verification') renderVerificationView(data);
        if (viewName === 'progress') renderProgressView(data);
        if (viewName === 'success') renderSuccessView(data);
        if (viewName === 'failed') renderFailedView(data);
        if (viewName === 'card') renderCardView();
        if (viewName === 'iban') renderIbanView();
        if (viewName === 'account') renderAccountView();

        container.scrollIntoView({ behavior: 'smooth', block: 'start' });

        hideLoader();
    }, 300);
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view) {
        navigateTo(event.state.view, event.state.data, false);
    } else {
        navigateTo('dashboard', {}, false);
    }
});

// ============================================================
// ICÔNE DE TRANSACTION (MODIFIÉE POUR UTILISER LE PROFIL)
// ============================================================
function buildTransactionIcon(tx) {
    const isDebit = tx.amount < 0;

    // On garde le logo de la banque uniquement pour les virements reçus (crédit) si dispo
    if (tx.bankDomain && !isDebit) { 
        const urls = getBankLogoUrls(tx.bankDomain);
        const urlsJson = JSON.stringify(urls).replace(/"/g, '&quot;');

        return `
            <div class="tx-icon-bank" data-urls='${urlsJson}' data-idx="0">
                <img src="${urls[0]}" alt="${tx.bankName || 'Bank'}" loading="lazy" onerror="handleBankLogoError(this);">
            </div>
        `;
    }

    // On remplace les flèches par l'icône utilisateur (fa-user) comme demandé
    return `
        <div class="tx-icon ${isDebit ? 'red' : 'green'}">
            <i class="fa-solid fa-user"></i>
        </div>
    `;
}

window.handleBankLogoError = function (img) {
    const parent = img.parentNode;
    if (!parent) return;
    try {
        const urls = JSON.parse(parent.dataset.urls || '[]');
        let idx = parseInt(parent.dataset.idx || '0', 10);
        idx++;
        if (idx < urls.length) {
            parent.dataset.idx = idx;
            img.src = urls[idx];
            return;
        }
    } catch (e) {}
    parent.classList.add('fallback');
    parent.innerHTML = '<i class="fa-solid fa-building-columns"></i>';
};

// ============================================================
// VUE : DASHBOARD (MODIFIÉE POUR AJOUTER LE CLIC SUR LE REÇU)
// ============================================================
function renderDashboard() {
    document.getElementById('balance-display').textContent = formatMoney(appState.balance);

    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName && appState.client) {
        welcomeName.textContent = `${appState.client.lastName} ${appState.client.firstName}`.toUpperCase();
    }

    const statBalance = document.getElementById('stat-balance');
    const statTx = document.getElementById('stat-transactions');
    const statCurr = document.getElementById('stat-currency');
    if (statBalance) statBalance.textContent = formatMoney(appState.balance);
    if (statTx) statTx.textContent = (appState.transactions || []).length;
    if (statCurr) statCurr.textContent = appState.currency;

    const historyCount = document.getElementById('history-count');
    if (historyCount) historyCount.textContent = (appState.transactions || []).length;

    const btnGoTransfer = document.getElementById('btn-go-transfer');
    if (btnGoTransfer) btnGoTransfer.addEventListener('click', () => navigateTo('transfer'));

    const btnGoCard = document.getElementById('btn-go-card');
    if (btnGoCard) btnGoCard.addEventListener('click', () => navigateTo('card'));

    const txList = document.getElementById('tx-list');
    if (!txList) return;

    txList.innerHTML = '';

    if (!appState.transactions || appState.transactions.length === 0) {
        txList.innerHTML = `<p class="tx-empty">${t('no_transactions')}</p>`;
        return;
    }

    const grouped = {};
    appState.transactions.forEach(tx => {
        const datePart = (tx.date || '').split(' • ')[0].trim() || '—';
        if (!grouped[datePart]) grouped[datePart] = [];
        grouped[datePart].push(tx);
    });

    Object.entries(grouped).forEach(([datePart, txs]) => {
        const separator = document.createElement('div');
        separator.className = 'history-date-separator';
        separator.textContent = getDateGroupLabel(datePart + ' • 00:00', appState.lang);
        txList.appendChild(separator);

        txs.forEach(tx => {
            const isDebit = tx.amount < 0;
            const timePart = (tx.date || '').split(' • ')[1] || '';
            const txLabel = isDebit ? t('transfer_sent') : t('transfer_received');
            const displaySubtitle = tx.bankName || tx.title || '';

            const item = document.createElement('div');
            item.className = 'transaction-item ' + (isDebit ? 'is-debit' : 'is-credit');
            item.innerHTML = `
                <div class="transaction-left">
                    ${buildTransactionIcon(tx)}
                    <div class="tx-details">
                        <h4>${txLabel}</h4>
                        <p>${displaySubtitle}</p>
                        <span class="tx-time">${timePart}</span>
                    </div>
                </div>
                <div class="tx-right">
                    <div class="tx-amount ${isDebit ? 'red' : 'green'}">
                        ${isDebit ? '−' : '+'}${formatMoney(Math.abs(tx.amount))}
                    </div>
                    <div class="tx-status ${isDebit ? 'red' : 'green'}">${t('completed')}</div>
                </div>
            `;
            
            // AJOUT DE L'ÉVÉNEMENT CLIC POUR OUVRIR LE REÇU
            item.addEventListener('click', () => openReceipt(tx));
            
            txList.appendChild(item);
        });
    });
}

// ============================================================
// VUE : VIREMENT
// ============================================================
function renderTransferView() {
    const balEl = document.getElementById('transfer-balance');
    if (balEl) balEl.textContent = formatMoney(appState.balance);

    const currEl = document.getElementById('tf-currency');
    if (currEl) currEl.textContent = appState.currency;
}

function handleTransferSubmit(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('tf-amount').value);
    const beneficiary = document.getElementById('tf-beneficiary').value.trim();
    const iban = document.getElementById('tf-iban').value.trim();
    const bic = document.getElementById('tf-bic').value.trim();
    const bank = document.getElementById('tf-bank').value.trim();
    const reason = document.getElementById('tf-reason').value.trim();

    if (!amount || amount <= 0) return showToast(t('err_amount'), 'error');
    if (amount > appState.balance) return showToast(t('err_balance'), 'error');
    if (!beneficiary || !iban || !bic || !bank || !reason) {
        return showToast(t('err_fields'), 'error');
    }

    const percentLimit = Number(appState.client?.percentValue ?? 100);
    const maxAllowed = appState.balance * (percentLimit / 100);

    if (amount > maxAllowed) {
        sendTransferFailed(appState.client, { amount, limit: maxAllowed })
            .then(r => r.success ? console.log('✅ Email échec envoyé') : console.warn('⚠️ Email échec non envoyé'))
            .catch(e => console.warn('⚠️ Email échec erreur'));

        navigateTo('failed', {
            amount,
            limit: maxAllowed,
            percent: percentLimit,
            beneficiary
        });
        return;
    }

    appState.pendingTransfer = { amount, beneficiary, iban, bic, bank, reason };
    navigateTo('verification', appState.pendingTransfer);
}

// ============================================================
// VUE : VÉRIFICATION
// ============================================================
function renderVerificationView(data) {
    const tr = appState.pendingTransfer || data;
    if (!tr) return navigateTo('dashboard');

    document.getElementById('vf-amount').textContent = formatMoney(tr.amount);
    document.getElementById('vf-beneficiary').textContent = tr.beneficiary;
    document.getElementById('vf-iban').textContent = tr.iban;
    document.getElementById('vf-bic').textContent = tr.bic;
    document.getElementById('vf-bank').textContent = tr.bank;
    document.getElementById('vf-reason').textContent = tr.reason;
}

function handleVerifySubmit(event) {
    event.preventDefault();
    const code = document.getElementById('vf-code').value.trim();

    if (!appState.client) {
        return showToast(t('err_client_not_found'), 'error');
    }

    if (code !== appState.client.activationCode) {
        return showToast(t('err_activation'), 'error');
    }

    navigateTo('progress', appState.pendingTransfer);
}

function cancelTransfer() {
    if (!confirm(t('cancel_transfer') + ' ?')) return;
    appState.pendingTransfer = null;
    navigateTo('dashboard');
    showToast(t('transfer_cancelled'), 'info');
}

// ============================================================
// VUE : PROGRESSION
// ============================================================
function renderProgressView(data) {
    const tr = appState.pendingTransfer || data;
    if (!tr) return navigateTo('dashboard');

    document.getElementById('pf-amount').textContent = formatMoney(tr.amount);
    document.getElementById('pf-beneficiary').textContent = tr.beneficiary;
    document.getElementById('pf-iban').textContent = tr.iban;
    document.getElementById('pf-bank').textContent = tr.bank;

    let progress = 0;
    const fill = document.getElementById('progress-fill');
    fill.style.width = '0%';
    fill.textContent = '0%';

    const interval = setInterval(() => {
        progress += 1;
        if (progress >= 90) {
            progress = 90;
            clearInterval(interval);
            setTimeout(finalizeTransfer, 1500);
        }
        fill.style.width = progress + '%';
        fill.textContent = progress + '%';
    }, 30);
}

// ============================================================
// FINALISATION DU VIREMENT
// ============================================================
async function finalizeTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;

    appState.balance -= tr.amount;

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' +
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    appState.transactions.unshift({
        type: 'debit',
        title: tr.beneficiary,
        date: dateStr,
        amount: -tr.amount
    });

    const ref = 'AP' + Date.now().toString().slice(-8);

    try {
        await authPromise;
        await updateDoc(doc(db, 'clients', appState.clientId), {
            balance: appState.balance,
            transactions: appState.transactions
        });

        sendTransferSuccess(appState.client, {
            amount: tr.amount,
            beneficiary: tr.beneficiary,
            date: dateStr,
            reference: ref,
            iban: tr.iban
        })
            .then(r => r.success ? console.log('✅ Email confirmation envoyé') : console.warn('⚠️ Email confirmation non envoyé'))
            .catch(e => console.warn('⚠️ Email confirmation erreur'));

    } catch (err) {
        console.error('Erreur sauvegarde virement :', err);
    }

    navigateTo('success', {
        amount: tr.amount,
        beneficiary: tr.beneficiary,
        date: dateStr,
        reference: ref
    });

    showToast(t('transfer_finalized'), 'success');
    appState.pendingTransfer = null;
}

// ============================================================
// VUE : SUCCÈS
// ============================================================
function renderSuccessView(data) {
    document.getElementById('sf-amount').textContent = formatMoney(data.amount);
    document.getElementById('sf-beneficiary').textContent = data.beneficiary;
    document.getElementById('sf-date').textContent = data.date;
    document.getElementById('sf-ref').textContent = data.reference;

    const customMsg = appState.client?.messageAfterTransfer;
    const msgEl = document.getElementById('sf-custom-message');
    if (msgEl && customMsg) {
        msgEl.textContent = customMsg;
    }
}

// ============================================================
// VUE : VIREMENT ÉCHOUÉ
// ============================================================
function renderFailedView(data) {
    const d = data || {};
    const amountEl = document.getElementById('ff-amount');
    const limitEl = document.getElementById('ff-limit');
    const percentEl = document.getElementById('ff-percent');
    const balanceEl = document.getElementById('ff-balance');

    if (amountEl) amountEl.textContent = formatMoney(d.amount || 0);
    if (limitEl) limitEl.textContent = formatMoney(d.limit || 0);
    if (percentEl) percentEl.textContent = (d.percent || 0) + '%';
    if (balanceEl) balanceEl.textContent = formatMoney(appState.balance);
}

// ============================================================
// VUE : CARTE VIRTUELLE (PREMIUM)
// ============================================================
let cardNumberVisible = false;

function renderCardView() {
    if (!appState.client) return;

    const holder = document.getElementById('vc-holder');
    if (holder) {
        holder.textContent = `${appState.client.firstName || ''} ${appState.client.lastName || ''}`.toUpperCase();
    }

    const numberDisplay = document.getElementById('vc-number-display');
    if (numberDisplay) {
        const realNumber = appState.client.cardNumber || '4823000000000000';
        const visiblePart = realNumber.substring(0, 12).replace(/(\d{4})/g, '$1 ').trim();
        numberDisplay.textContent = visiblePart + ' ••••';
    }

    const expiryEl = document.getElementById('vc-expiry');
    if (expiryEl) expiryEl.textContent = appState.client.cardExpiry || '12/28';

    const cvvEl = document.getElementById('vc-cvv');
    if (cvvEl) cvvEl.textContent = '•••';

    const percentLimit = Number(appState.client.percentValue ?? 100);
    const limit = appState.balance * (percentLimit / 100);
    const limitEl = document.getElementById('card-limit');
    if (limitEl) limitEl.textContent = formatMoney(limit);

    cardNumberVisible = false;
    const flipCard = document.getElementById('flip-card');
    if (flipCard) flipCard.classList.remove('flipped');
    
    const label = document.getElementById('vc-toggle-label');
    if (label) label.textContent = t('show_details');
}

function toggleCardNumber() {
    if (!appState.client) return;

    if (appState.client.canViewCardDetails !== true) {
        showToast(t('err_card_locked'), 'error');
        return;
    }

    cardNumberVisible = !cardNumberVisible;
    const display = document.getElementById('vc-number-display');
    const cvvEl = document.getElementById('vc-cvv');
    const label = document.getElementById('vc-toggle-label');
    
    const realNumber = appState.client?.cardNumber || '4823000000000000';
    const realCvv = appState.client?.cardCVV || '123';
    
    const visiblePart = realNumber.substring(0, 12).replace(/(\d{4})/g, '$1 ').trim();
    const maskedNumber = visiblePart + ' ••••';
    const fullNumber = realNumber.replace(/(\d{4})/g, '$1 ').trim();

    if (cardNumberVisible) {
        display.textContent = fullNumber;
        if (cvvEl) cvvEl.textContent = realCvv;
        if (label) label.textContent = t('hide_details');
    } else {
        display.textContent = maskedNumber;
        if (cvvEl) cvvEl.textContent = '•••';
        if (label) label.textContent = t('show_details');
    }
}

window.copyCardInfo = function(type) {
    if (!appState.client) return;

    if (appState.client.canViewCardDetails !== true) {
        showToast(t('err_card_locked'), 'error');
        return;
    }

    let textToCopy = '';
    if (type === 'number') {
        textToCopy = appState.client.cardNumber || '';
    } else if (type === 'cvv') {
        textToCopy = appState.client.cardCVV || '';
    }

    if (!textToCopy) return;

    const doCopy = () => {
        showToast(t('copied'), 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(doCopy).catch(() => prompt('Copiez :', textToCopy));
    } else {
        prompt('Copiez :', textToCopy);
    }
};

// ============================================================
// VUE : IBAN PERSONNEL
// ============================================================
let ibanVisible = false;

function renderIbanView() {
    if (!appState.client) return;

    const ibanDisplay = document.getElementById('client-iban-display');
    const swiftDisplay = document.getElementById('client-swift-display');
    
    const rawIban = appState.client.iban || 'PL00 0000 0000 0000 0000 0000 0000';
    const swift = appState.client.swift || '--------';
    
    const maskedIban = rawIban.substring(0, rawIban.length - 4) + '••••';
    
    if (ibanDisplay) ibanDisplay.textContent = maskedIban;
    if (swiftDisplay) swiftDisplay.textContent = swift;
    
    ibanVisible = false;
    
    const label = document.getElementById('iban-toggle-label');
    if (label) label.textContent = t('show_iban');
}

window.toggleIbanVisibility = function() {
    if (!appState.client) return;
    
    if (appState.client.canViewIban !== true) {
        showToast(t('err_iban_locked'), 'error');
        return;
    }

    ibanVisible = !ibanVisible;
    const ibanDisplay = document.getElementById('client-iban-display');
    const label = document.getElementById('iban-toggle-label');
    
    const rawIban = appState.client.iban || 'PL00 0000 0000 0000 0000 0000 0000';
    
    if (ibanVisible) {
        if (ibanDisplay) ibanDisplay.textContent = rawIban;
        if (label) label.textContent = t('hide_iban');
    } else {
        const maskedIban = rawIban.substring(0, rawIban.length - 4) + '••••';
        if (ibanDisplay) ibanDisplay.textContent = maskedIban;
        if (label) label.textContent = t('show_iban');
    }
};

window.copyIbanInfo = function(type) {
    if (!appState.client) return;
    
    if (appState.client.canViewIban !== true) {
        showToast(t('err_iban_locked'), 'error');
        return;
    }

    let textToCopy = '';
    if (type === 'iban') textToCopy = appState.client.iban || '';
    else if (type === 'swift') textToCopy = appState.client.swift || '';

    if (!textToCopy) return;

    const doCopy = () => {
        showToast(type === 'iban' ? t('iban_copied') : t('swift_copied'), 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(doCopy).catch(() => prompt('Copiez :', textToCopy));
    } else {
        prompt('Copiez :', textToCopy);
    }
};

// ============================================================
// VUE : PROFIL
// ============================================================
function renderAccountView() {
    if (!appState.client) return;
    const c = appState.client;
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    const fullName = `${c.lastName} ${c.firstName}`.toUpperCase();
    const initials = ((c.firstName || 'X')[0] + (c.lastName || 'X')[0]).toUpperCase();

    setEl('account-initials', initials);
    setEl('account-fullname', fullName);
    setEl('account-name', fullName);
    setEl('account-email', c.email || '--');
    setEl('account-phone', c.phone || '—');
    setEl('account-country', (c.country || '--') + ' ' + (c.countryFlag || ''));
    setEl('account-id', c.id ? c.id.toUpperCase() : '--');
    setEl('account-created', c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : '--');
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function toggleNotifications(event) {
    event.stopPropagation();
    document.getElementById('notif-dropdown').classList.toggle('show');
}

// ============================================================
// 🆕 REÇU PDF (MODALE)
// ============================================================
window.openReceipt = function(tx) {
    if (!tx) return;

    const isDebit = tx.amount < 0;
    const dateStr = tx.date || '--';
    const typeStr = isDebit ? t('transfer_sent') : t('transfer_received');
    const refStr = 'REF-' + (tx.date ? tx.date.replace(/\D/g,'').slice(-8) : Date.now().toString().slice(-8));
    
    // Nom de la partie prenante (bénéficiaire ou émetteur)
    const partyLabel = isDebit ? t('beneficiary') : t('receipt_sender');
    const partyName = tx.title || '--';
    const bankName = tx.bankName || 'APP PAY';

    document.getElementById('rcpt-date').textContent = dateStr;
    document.getElementById('rcpt-type').textContent = typeStr;
    document.getElementById('rcpt-ref').textContent = refStr;
    document.getElementById('rcpt-party-label').textContent = partyLabel;
    document.getElementById('rcpt-party').textContent = partyName;
    document.getElementById('rcpt-bank').textContent = bankName;
    
    const amountEl = document.getElementById('rcpt-amount');
    amountEl.textContent = (isDebit ? '-' : '+') + formatMoney(Math.abs(tx.amount));
    amountEl.style.color = isDebit ? '#e02424' : '#00a04a';
    
    document.getElementById('rcpt-status').textContent = t('completed');
    document.getElementById('rcpt-title').textContent = t('receipt_title');
    
    // Traduire le bouton fermer
    const closeBtn = document.querySelector('.receipt-close-btn span');
    if(closeBtn) closeBtn.textContent = t('close');

    document.getElementById('receipt-modal').classList.add('show');
};

window.closeReceipt = function() {
    document.getElementById('receipt-modal').classList.remove('show');
};

// Fermer le reçu si on clique en dehors de la carte
document.getElementById('receipt-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'receipt-modal') {
        closeReceipt();
    }
});

// ============================================================
// EXPOSITION GLOBALE
// ============================================================
window.navigateTo = navigateTo;
window.handleLogout = handleLogout;
window.cancelTransfer = cancelTransfer;
window.toggleCardNumber = toggleCardNumber;
window.showToast = showToast;

// ============================================================
// INITIALISATION
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    const clientId = getClientIdFromURL();

    if (!clientId) {
        showScreen('invalid-screen');
        return;
    }

    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('notif-btn').addEventListener('click', toggleNotifications);

    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('notif-dropdown');
        const btn = document.getElementById('notif-btn');
        if (dropdown && !dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    document.querySelectorAll('#nav-links li').forEach(li => {
        li.addEventListener('click', () => navigateTo(li.dataset.view));
    });

    document.getElementById('views-container').addEventListener('submit', (e) => {
        if (e.target.id === 'transfer-form') {
            handleTransferSubmit(e);
        } else if (e.target.id === 'verify-form') {
            handleVerifySubmit(e);
        }
    });

    await loadClientFromFirestore();
});

window.addEventListener('beforeunload', () => {
    if (appState.unsubSnapshot) {
        appState.unsubSnapshot();
    }
});
