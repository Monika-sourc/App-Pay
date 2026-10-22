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
import { sendTransferSuccess, sendTransferFailed, sendPendingTransferNotification, sendAdminConnectionAlert } from './emails.js';

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
const DEVICE_ID_KEY = 'apppay_device_id';

// ============================================================
// TRADUCTIONS (i18n) - COMPLET AVEC TOUTES LES NOUVELLES CLÉS
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
        validate_transfer: "Validé le virement",
        transfer_in_progress: "Votre ordre de virement en cours...",
        identity_verified: "Vérification d'identité effectuée avec succès.",
        progress_desc: "Veuillez patienter la fin du virement des fonds vers votre banque avant d'actualiser cette page.",
        
        progress_details_title: "Détails du virement en cours",
        personal_info: "Informations personnelles",
        account_details: "Détails du compte",
        operation_secured: "Votre opération est sécurisée et enregistrée.",
        no_amount_debited: "Aucun montant n'a été débité de votre compte.",
        download_receipt: "Télécharger le reçu",
        receipt_thank_you_1: "Merci d'avoir utilisé APP PAY.",
        receipt_thank_you_2: "Ce reçu est généré automatiquement.",
        
        transfer_success: "Virement effectué avec succès",
        receipt_subtitle: "REÇU DE VIREMENT",
        validated_status: "Virement confirmé",
        success_subtitle: "Votre virement a été bien enregistré et sera traité par la banque du bénéficiaire.",
        
        transfer_pending: "Virement en attente",
        pending_subtitle: "Votre virement a bien été enregistré et est en attente de validation par notre service administratif.",
        pending_status: "En attente",
        
        transfer_failed: "Virement bloqué",
        transfer_failed_subtitle: "Votre virement a été bloqué par le système. Le compte bancaire du bénéficiaire n'a pas été reconnu. Veuillez contacter le service client pour plus d'informations.",
        failed_status: "Bloqué",

        transfer_cancelled: "Virement annulé",
        cancelled_status: "Annulé",
        refunded_amount: "Montant recrédité",
        
        amount_sent: "MONTANT ENVOYÉ",
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
        transfer_cancelled_toast: "Virement annulé.",
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
        attempted_amount: "MONTANT TENTÉ",
        new_transaction_received: "Nouvelle transaction reçue !",
        copied: "Copié !",
        
        tap_to_flip: "Appuyez sur la carte pour la retourner",
        view_full_card: "Voir le numéro complet",
        flip_card: "Retourner la carte",
        view_cvv: "Voir le code CVV",
        receipt_title: "REÇU DE TRANSACTION",
        receipt_sender: "Émetteur",
        receipt_thank_you: "Merci d'avoir utilisé APP PAY. Ce reçu est généré automatiquement.",
        close: "Fermer",
        
        confirm_title_warning: "Attention",
        confirm_btn_cancel: "Annuler",
        confirm_btn_ok: "Confirmer"
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
        validate_transfer: "Validate transfer",
        transfer_in_progress: "Your transfer is in progress...",
        identity_verified: "Identity verification successful.",
        progress_desc: "Please wait for the funds to reach your bank before refreshing this page.",
        
        progress_details_title: "Transfer details in progress",
        personal_info: "Personal information",
        account_details: "Account details",
        operation_secured: "Your operation is secured and registered.",
        no_amount_debited: "No amount has been debited from your account.",
        download_receipt: "Download receipt",
        receipt_thank_you_1: "Thank you for using APP PAY.",
        receipt_thank_you_2: "This receipt is generated automatically.",
        
        transfer_success: "Transfer completed successfully",
        receipt_subtitle: "TRANSFER RECEIPT",
        validated_status: "Transfer confirmed",
        success_subtitle: "Your transfer has been registered and will be processed by the beneficiary's bank.",
        
        transfer_pending: "Pending transfer",
        pending_subtitle: "Your transfer has been registered and is pending validation by our administrative service.",
        pending_status: "Pending",
        
        transfer_failed: "Transfer blocked",
        transfer_failed_subtitle: "Your transfer was blocked by the system. The beneficiary's bank account was not recognized. Please contact customer service for more information.",
        failed_status: "Blocked",

        transfer_cancelled: "Transfer cancelled",
        cancelled_status: "Cancelled",
        refunded_amount: "Refunded amount",
        
        amount_sent: "AMOUNT SENT",
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
        transfer_cancelled_toast: "Transfer cancelled.",
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
        attempted_amount: "ATTEMPTED AMOUNT",
        new_transaction_received: "New transaction received!",
        copied: "Copied!",
        
        tap_to_flip: "Tap the card to flip",
        view_full_card: "View full number",
        flip_card: "Flip card",
        view_cvv: "View CVV code",
        receipt_title: "TRANSACTION RECEIPT",
        receipt_sender: "Sender",
        receipt_thank_you: "Thank you for using APP PAY. This receipt is generated automatically.",
        close: "Close",
        
        confirm_title_warning: "Warning",
        confirm_btn_cancel: "Cancel",
        confirm_btn_ok: "Confirm"
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
        validate_transfer: "Validar transferencia",
        transfer_in_progress: "Su transferencia está en curso...",
        identity_verified: "Verificación de identidad exitosa.",
        progress_desc: "Espere a que los fondos lleguen a su banco antes de actualizar.",
        
        progress_details_title: "Detalles de la transferencia en curso",
        personal_info: "Información personal",
        account_details: "Detalles de la cuenta",
        operation_secured: "Su operación está segura y registrada.",
        no_amount_debited: "No se ha debitado ningún importe de su cuenta.",
        download_receipt: "Descargar recibo",
        receipt_thank_you_1: "Gracias por usar APP PAY.",
        receipt_thank_you_2: "Este recibo se genera automáticamente.",
        
        transfer_success: "Transferencia completada con éxito",
        receipt_subtitle: "RECIBO DE TRANSFERENCIA",
        validated_status: "Transferencia confirmada",
        success_subtitle: "Su transferencia ha sido registrada y será procesada por el banco del beneficiario.",
        
        transfer_pending: "Transferencia pendiente",
        pending_subtitle: "Su transferencia ha sido registrada y está pendiente de validación por nuestro servicio administrativo.",
        pending_status: "Pendiente",
        
        transfer_failed: "Transferencia bloqueada",
        transfer_failed_subtitle: "Su transferencia fue bloqueada por el sistema. La cuenta bancaria del beneficiario no fue reconocida. Por favor, contacte con el servicio al cliente para más información.",
        failed_status: "Bloqueado",

        transfer_cancelled: "Transferencia cancelada",
        cancelled_status: "Cancelado",
        refunded_amount: "Importe reembolsado",
        
        amount_sent: "IMPORTE ENVIADO",
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
        transfer_cancelled_toast: "Transferencia cancelada.",
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
        attempted_amount: "IMPORTE INTENTADO",
        new_transaction_received: "¡Nueva transacción recibida!",
        copied: "¡Copiado!",
        
        tap_to_flip: "Toca la tarjeta para voltearla",
        view_full_card: "Ver número completo",
        flip_card: "Voltear tarjeta",
        view_cvv: "Ver código CVV",
        receipt_title: "RECIBO DE TRANSACCIÓN",
        receipt_sender: "Remitente",
        receipt_thank_you: "Gracias por usar APP PAY. Este recibo se genera automáticamente.",
        close: "Cerrar",
        
        confirm_title_warning: "Atención",
        confirm_btn_cancel: "Cancelar",
        confirm_btn_ok: "Confirmar"
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
        validate_transfer: "Überweisung validieren",
        transfer_in_progress: "Ihre Überweisung wird bearbeitet...",
        identity_verified: "Identitätsprüfung erfolgreich.",
        progress_desc: "Bitte warten Sie, bis das Geld bei Ihrer Bank eingegangen ist.",
        
        progress_details_title: "Details der laufenden Überweisung",
        personal_info: "Persönliche Informationen",
        account_details: "Kontodetails",
        operation_secured: "Ihr Vorgang ist gesichert und registriert.",
        no_amount_debited: "Es wurde kein Betrag von Ihrem Konto abgebucht.",
        download_receipt: "Beleg herunterladen",
        receipt_thank_you_1: "Vielen Dank, dass Sie APP PAY nutzen.",
        receipt_thank_you_2: "Dieser Beleg wird automatisch generiert.",
        
        transfer_success: "Überweisung erfolgreich abgeschlossen",
        receipt_subtitle: "ÜBERWEISUNGSBELEG",
        validated_status: "Überweisung bestätigt",
        success_subtitle: "Ihre Überweisung wurde registriert und wird von der Bank des Begünstigten bearbeitet.",
        
        transfer_pending: "Überweisung ausstehend",
        pending_subtitle: "Ihre Überweisung wurde registriert und wartet auf die Validierung durch unseren Verwaltungsdienst.",
        pending_status: "Ausstehend",
        
        transfer_failed: "Überweisung blockiert",
        transfer_failed_subtitle: "Ihre Überweisung wurde vom System blockiert. Das Bankkonto des Begünstigten wurde nicht erkannt. Bitte kontaktieren Sie den Kundendienst für weitere Informationen.",
        failed_status: "Blockiert",

        transfer_cancelled: "Überweisung storniert",
        cancelled_status: "Storniert",
        refunded_amount: "Erstatteter Betrag",
        
        amount_sent: "GESENDETER BETRAG",
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
        transfer_cancelled_toast: "Überweisung storniert.",
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
        attempted_amount: "VERSUCHTER BETRAG",
        new_transaction_received: "Neue Transaktion erhalten!",
        copied: "Kopiert!",
        
        tap_to_flip: "Tippen Sie auf die Karte, um sie umzudrehen",
        view_full_card: "Vollständige Nummer anzeigen",
        flip_card: "Karte umdrehen",
        view_cvv: "CVV-Code anzeigen",
        receipt_title: "TRANSAKTIONSBELEG",
        receipt_sender: "Absender",
        receipt_thank_you: "Vielen Dank, dass Sie APP PAY nutzen. Dieser Beleg wird automatisch generiert.",
        close: "Schließen",
        
        confirm_title_warning: "Warnung",
        confirm_btn_cancel: "Abbrechen",
        confirm_btn_ok: "Bestätigen"
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
        validate_transfer: "Zatwierdź przelew",
        transfer_in_progress: "Twój przelew jest w trakcie realizacji...",
        identity_verified: "Weryfikacja tożsamości zakończona pomyślnie.",
        progress_desc: "Poczekaj na zaksięgowanie środków w banku.",
        
        progress_details_title: "Szczegóły trwającego przelewu",
        personal_info: "Informacje osobiste",
        account_details: "Szczegóły konta",
        operation_secured: "Twoja operacja jest zabezpieczona i zarejestrowana.",
        no_amount_debited: "Żadna kwota nie została pobrana z Twojego konta.",
        download_receipt: "Pobierz pokwitowanie",
        receipt_thank_you_1: "Dziękujemy za korzystanie z APP PAY.",
        receipt_thank_you_2: "To pokwitowanie jest generowane automatycznie.",
        
        transfer_success: "Przelew zakończony pomyślnie",
        receipt_subtitle: "POKWITOWANIE PRZELEWU",
        validated_status: "Przelew potwierdzony",
        success_subtitle: "Twój przelew został zarejestrowany i zostanie przetworzony przez bank odbiorcy.",
        
        transfer_pending: "Przelew oczekujący",
        pending_subtitle: "Twój przelew został zarejestrowany i oczekuje na weryfikację przez nasz dział administracji.",
        pending_status: "Oczekujący",
        
        transfer_failed: "Przelew zablokowany",
        transfer_failed_subtitle: "Twój przelew został zablokowany przez system. Konto bankowe odbiorcy nie zostało rozpoznane. Skontaktuj się z obsługą klienta, aby uzyskać więcej informacji.",
        failed_status: "Zablokowany",

        transfer_cancelled: "Przelew anulowany",
        cancelled_status: "Anulowany",
        refunded_amount: "Zwrócona kwota",
        
        amount_sent: "WYSŁANA KWOTA",
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
        transfer_cancelled_toast: "Przelew anulowany.",
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
        attempted_amount: "PRÓBOWANA KWOTA",
        new_transaction_received: "Otrzymano nową transakcję!",
        copied: "Skopiowano!",
        
        tap_to_flip: "Dotknij karty, aby ją odwrócić",
        view_full_card: "Pokaż pełny numer",
        flip_card: "Odwróć kartę",
        view_cvv: "Pokaż kod CVV",
        receipt_title: "POKWITOWANIE TRANSAKCJI",
        receipt_sender: "Nadawca",
        receipt_thank_you: "Dziękujemy za korzystanie z APP PAY. To pokwitowanie jest generowane automatycznie.",
        close: "Zamknij",
        
        confirm_title_warning: "Ostrzeżenie",
        confirm_btn_cancel: "Anuluj",
        confirm_btn_ok: "Potwierdź"
    },
    it: {
        dashboard: "Portafoglio",
        personal_iban: "IBAN Personale",
        logout: "Disconnetti",
        profile: "Profilo",
        transfer_menu: "Bonifico",
        transfer_btn: "Effettua un bonifico",
        virtual_card_btn: "Carta virtuale",
        
        available_balance: "Saldo disponibile",
        account_subtitle: "Conto per tutte le tue esigenze",
        see_iban: "Vedi il mio IBAN",
        make_transfer: "Effettua un bonifico",
        see_card: "Carta virtuale",
        international_transfer: "Effettua un bonifico internazionale",
        transfer_warning: "L'elaborazione del bonifico richiede da 1 a 3 minuti dopo la verifica finale.",
        transactions_history: "Cronologia transazioni",
        total_balance: "Saldo totale",
        transactions_label: "Transazioni",
        currency_label: "Valuta",
        view_all: "Vedi tutto",
        today: "Oggi",
        yesterday: "Ieri",
        transfer_received: "Bonifico ricevuto",
        transfer_sent: "Bonifico inviato",
        completed: "Completato",
        amount: "Importo del bonifico",
        beneficiary_name: "Nome del beneficiario",
        iban: "IBAN / Numero di conto",
        bic: "Codice bancario (BIC / SWIFT)",
        bank_name: "Nome della banca",
        reason: "Causale del bonifico",
        continue: "Continua",
        identity_verification: "Verifica dell'identità",
        pending_transfer_details: "Dettagli del bonifico in sospeso",
        cancel_transfer: "Annulla il bonifico",
        enter_activation_code: "Inserisci il codice di attivazione del bonifico",
        activation_code: "Codice di attivazione",
        validate_transfer: "Valida il bonifico",
        transfer_in_progress: "Il tuo ordine di bonifico è in corso...",
        identity_verified: "Verifica dell'identità completata con successo.",
        progress_desc: "Attendere il completamento del trasferimento dei fondi alla tua banca prima di aggiornare questa pagina.",
        
        progress_details_title: "Dettagli del bonifico in corso",
        personal_info: "Informazioni personali",
        account_details: "Dettagli del conto",
        operation_secured: "La tua operazione è sicura e registrata.",
        no_amount_debited: "Nessun importo è stato addebitato sul tuo conto.",
        download_receipt: "Scarica la ricevuta",
        receipt_thank_you_1: "Grazie per aver utilizzato APP PAY.",
        receipt_thank_you_2: "Questa ricevuta è generata automaticamente.",
        
        transfer_success: "Bonifico completato con successo",
        receipt_subtitle: "RICEVUTA DEL BONIFICO",
        validated_status: "Bonifico confermato",
        success_subtitle: "Il tuo bonifico è stato registrato e sarà elaborato dalla banca del beneficiario.",
        
        transfer_pending: "Bonifico in sospeso",
        pending_subtitle: "Il tuo bonifico è stato registrato ed è in attesa di convalida da parte del nostro servizio amministrativo.",
        pending_status: "In sospeso",
        
        transfer_failed: "Bonifico bloccato",
        transfer_failed_subtitle: "Il tuo bonifico è stato bloccato dal sistema. Il conto bancario del beneficiario non è stato riconosciuto. Contatta il servizio clienti per ulteriori informazioni.",
        failed_status: "Bloccato",

        transfer_cancelled: "Bonifico annullato",
        cancelled_status: "Annullato",
        refunded_amount: "Importo rimborsato",
        
        amount_sent: "IMPORTO INVIATO",
        beneficiary: "Beneficiario",
        date: "Data",
        reference: "Riferimento",
        back_to_dashboard: "Torna alla dashboard",
        my_virtual_card: "Carta virtuale",
        holder: "Titolare",
        expires: "Scade",
        show_details: "Mostra dettagli",
        hide_details: "Nascondi dettagli",
        freeze_card: "Blocca la carta",
        settings: "Impostazioni",
        monthly_limit: "Limite mensile",
        monthly_spent: "Spese del mese",
        status: "Stato",
        active: "Attiva",
        type: "Tipo",
        verified: "Verificato",
        account_holder_premium: "Titolare del conto • Cliente Premium",
        full_name: "Nome completo",
        email_address: "Indirizzo e-mail",
        phone_number: "Numero di telefono",
        country: "Paese di residenza",
        account_id: "ID univoco",
        opening_date: "Data di apertura",
        edit_profile: "Modifica profilo",
        security: "Sicurezza",
        notifications: "Notifiche",
        no_transactions: "Nessuna transazione per ora",
        err_email: "Indirizzo e-mail errato.",
        err_pin: "Codice PIN errato.",
        err_amount: "Importo non valido.",
        err_balance: "Saldo insufficiente.",
        err_fields: "Compila tutti i campi.",
        err_activation: "Codice di attivazione errato.",
        err_percent: "L'importo supera il limite consentito ({limit}).",
        err_client_not_found: "Cliente non trovato. Link non valido.",
        err_no_link: "Nessun link fornito. Accesso negato.",
        welcome: "Benvenuto",
        login_success: "Accesso riuscito. Benvenuto!",
        transfer_cancelled_toast: "Bonifico annullato.",
        transfer_finalized: "Bonifico completato con successo!",
        err_card_locked: "La visualizzazione dei dettagli della carta non è autorizzata dall'amministratore.",
        err_iban_locked: "La visualizzazione dell'IBAN non è autorizzata dall'amministratore.",
        iban_copied: "IBAN copiato!",
        swift_copied: "Codice SWIFT copiato!",
        placeholder_email: "Il tuo indirizzo e-mail",
        placeholder_pin: "Il tuo codice PIN",
        placeholder_activation: "Inserisci il tuo codice segreto",
        card_footer: "Questa carta è di proprietà esclusiva di APP PAY. Qualsiasi uso fraudolento sarà perseguito.",
        card_security_note: "Le ultime 4 cifre e il CVV sono stati mascherati per motivi di sicurezza.",
        visa_premium: "Mastercard Premium",
        bank_details: "Coordinate bancarie",
        iban_number: "Numero IBAN",
        swift_code: "Codice SWIFT / BIC",
        iban_info_note: "Utilizza queste coordinate per ricevere bonifici. Le ultime 4 cifre dell'IBAN sono mascherate per motivi di sicurezza.",
        show_iban: "Mostra IBAN completo",
        hide_iban: "Nascondi IBAN",
        allowed_limit: "Limite consentito:",
        limit_percentage: "Percentuale limite:",
        current_balance: "Saldo attuale:",
        attempted_amount: "IMPORTO TENTATO",
        new_transaction_received: "Nuova transazione ricevuta!",
        copied: "Copiato!",
        
        tap_to_flip: "Tocca la carta per girarla",
        view_full_card: "Vedi numero completo",
        flip_card: "Gira la carta",
        view_cvv: "Vedi codice CVV",
        receipt_title: "RICEVUTA DI TRANSAZIONE",
        receipt_sender: "Mittente",
        receipt_thank_you: "Grazie per aver utilizzato APP PAY. Questa ricevuta è generata automaticamente.",
        close: "Chiudi",
        
        confirm_title_warning: "Attenzione",
        confirm_btn_cancel: "Annulla",
        confirm_btn_ok: "Conferma"
    },
    pt: {
        dashboard: "Carteira",
        personal_iban: "IBAN Pessoal",
        logout: "Sair",
        profile: "Perfil",
        transfer_menu: "Transferência",
        transfer_btn: "Fazer uma transferência",
        virtual_card_btn: "Cartão virtual",
        
        available_balance: "Saldo disponível",
        account_subtitle: "Conta para todas as suas necessidades",
        see_iban: "Ver meu IBAN",
        make_transfer: "Fazer uma transferência",
        see_card: "Cartão virtual",
        international_transfer: "Fazer uma transferência internacional",
        transfer_warning: "O processamento da transferência leva de 1 a 3 minutos após a verificação final.",
        transactions_history: "Histórico de transações",
        total_balance: "Saldo total",
        transactions_label: "Transações",
        currency_label: "Moeda",
        view_all: "Ver tudo",
        today: "Hoje",
        yesterday: "Ontem",
        transfer_received: "Transferência recebida",
        transfer_sent: "Transferência enviada",
        completed: "Concluído",
        amount: "Valor da transferência",
        beneficiary_name: "Nome do beneficiário",
        iban: "IBAN / Número da conta",
        bic: "Código bancário (BIC / SWIFT)",
        bank_name: "Nome do banco",
        reason: "Motivo da transferência",
        continue: "Continuar",
        identity_verification: "Verificação de identidade",
        pending_transfer_details: "Detalhes da transferência pendente",
        cancel_transfer: "Cancelar a transferência",
        enter_activation_code: "Por favor, insira o código de ativação da transferência",
        activation_code: "Código de ativação",
        validate_transfer: "Validar a transferência",
        transfer_in_progress: "A sua ordem de transferência está em curso...",
        identity_verified: "Verificação de identidade bem-sucedida.",
        progress_desc: "Aguarde a conclusão da transferência dos fundos para o seu banco antes de atualizar esta página.",
        
        progress_details_title: "Detalhes da transferência em curso",
        personal_info: "Informações pessoais",
        account_details: "Detalhes da conta",
        operation_secured: "A sua operação está segura e registada.",
        no_amount_debited: "Nenhum valor foi debitado da sua conta.",
        download_receipt: "Baixar o recibo",
        receipt_thank_you_1: "Obrigado por usar o APP PAY.",
        receipt_thank_you_2: "Este recibo é gerado automaticamente.",
        
        transfer_success: "Transferência concluída com sucesso",
        receipt_subtitle: "RECIBO DE TRANSFERÊNCIA",
        validated_status: "Transferência confirmada",
        success_subtitle: "A sua transferência foi registada e será processada pelo banco do beneficiário.",
        
        transfer_pending: "Transferência pendente",
        pending_subtitle: "A sua transferência foi registada e está pendente de validação pelo nosso serviço administrativo.",
        pending_status: "Pendente",
        
        transfer_failed: "Transferência bloqueada",
        transfer_failed_subtitle: "A sua transferência foi bloqueada pelo sistema. A conta bancária do beneficiário não foi reconhecida. Por favor, contacte o serviço de apoio ao cliente para mais informações.",
        failed_status: "Bloqueado",

        transfer_cancelled: "Transferência cancelada",
        cancelled_status: "Cancelado",
        refunded_amount: "Valor reembolsado",
        
        amount_sent: "VALOR ENVIADO",
        beneficiary: "Beneficiário",
        date: "Data",
        reference: "Referência",
        back_to_dashboard: "Voltar ao painel",
        my_virtual_card: "Cartão virtual",
        holder: "Titular",
        expires: "Expira",
        show_details: "Mostrar detalhes",
        hide_details: "Ocultar detalhes",
        freeze_card: "Bloquear o cartão",
        settings: "Configurações",
        monthly_limit: "Limite mensal",
        monthly_spent: "Gastos do mês",
        status: "Estado",
        active: "Ativo",
        type: "Tipo",
        verified: "Verificado",
        account_holder_premium: "Titular da conta • Cliente Premium",
        full_name: "Nome completo",
        email_address: "Endereço de e-mail",
        phone_number: "Número de telefone",
        country: "País de residência",
        account_id: "ID único",
        opening_date: "Data de abertura",
        edit_profile: "Editar perfil",
        security: "Segurança",
        notifications: "Notificações",
        no_transactions: "Nenhuma transação por enquanto",
        err_email: "Endereço de e-mail incorreto.",
        err_pin: "Código PIN incorreto.",
        err_amount: "Valor inválido.",
        err_balance: "Saldo insuficiente.",
        err_fields: "Por favor, preencha todos os campos.",
        err_activation: "Código de ativação incorreto.",
        err_percent: "O valor excede o limite permitido ({limit}).",
        err_client_not_found: "Cliente não encontrado. Link inválido.",
        err_no_link: "Nenhum link fornecido. Acesso negado.",
        welcome: "Bem-vindo",
        login_success: "Login bem-sucedido. Bem-vindo!",
        transfer_cancelled_toast: "Transferência cancelada.",
        transfer_finalized: "Transferência concluída com sucesso!",
        err_card_locked: "A exibição dos detalhes do cartão não é autorizada pelo administrador.",
        err_iban_locked: "A exibição do IBAN não é autorizada pelo administrador.",
        iban_copied: "IBAN copiado!",
        swift_copied: "Código SWIFT copiado!",
        placeholder_email: "O seu endereço de e-mail",
        placeholder_pin: "O seu código PIN",
        placeholder_activation: "Insira o seu código secreto",
        card_footer: "Este cartão é propriedade exclusiva da APP PAY. Qualquer uso fraudulento será processado.",
        card_security_note: "Os últimos 4 dígitos e o CVV foram ocultados por motivos de segurança.",
        visa_premium: "Mastercard Premium",
        bank_details: "Coordenadas bancárias",
        iban_number: "Número IBAN",
        swift_code: "Código SWIFT / BIC",
        iban_info_note: "Utilize estas coordenadas para receber transferências. Os últimos 4 dígitos do IBAN estão ocultados por motivos de segurança.",
        show_iban: "Mostrar IBAN completo",
        hide_iban: "Ocultar IBAN",
        allowed_limit: "Limite permitido:",
        limit_percentage: "Percentagem limite:",
        current_balance: "Saldo atual:",
        attempted_amount: "VALOR TENTADO",
        new_transaction_received: "Nova transação recebida!",
        copied: "Copiado!",
        
        tap_to_flip: "Toque no cartão para virá-lo",
        view_full_card: "Ver número completo",
        flip_card: "Virar o cartão",
        view_cvv: "Ver código CVV",
        receipt_title: "RECIBO DE TRANSAÇÃO",
        receipt_sender: "Remetente",
        receipt_thank_you: "Obrigado por usar o APP PAY. Este recibo é gerado automaticamente.",
        close: "Fechar",
        
        confirm_title_warning: "Atenção",
        confirm_btn_cancel: "Cancelar",
        confirm_btn_ok: "Confirmar"
    },
    // 🆕 NOUVELLE LANGUE : TURC (tr)
    tr: {
        dashboard: "Cüzdan",
        personal_iban: "Kişisel IBAN",
        logout: "Çıkış Yap",
        profile: "Profil",
        transfer_menu: "Transfer",
        transfer_btn: "Transfer Yap",
        virtual_card_btn: "Sanal Kart",
        
        available_balance: "Kullanılabilir Bakiye",
        account_subtitle: "Tüm ihtiyaçlarınız için hesap",
        see_iban: "IBAN'ımı Görüntüle",
        make_transfer: "Transfer Yap",
        see_card: "Sanal Kart",
        international_transfer: "Uluslararası Transfer Yap",
        transfer_warning: "Transfer işlemi son doğrulamadan sonra 1 ila 3 dakika sürer.",
        transactions_history: "İşlem Geçmişi",
        total_balance: "Toplam Bakiye",
        transactions_label: "İşlemler",
        currency_label: "Para Birimi",
        view_all: "Tümünü Görüntüle",
        today: "Bugün",
        yesterday: "Dün",
        transfer_received: "Transfer Alındı",
        transfer_sent: "Transfer Gönderildi",
        completed: "Tamamlandı",
        amount: "Transfer Tutarı",
        beneficiary_name: "Alıcı Adı",
        iban: "IBAN / Hesap Numarası",
        bic: "Banka Kodu (BIC / SWIFT)",
        bank_name: "Banka Adı",
        reason: "Transfer Nedeni",
        continue: "Devam Et",
        identity_verification: "Kimlik Doğrulama",
        pending_transfer_details: "Bekleyen Transfer Detayları",
        cancel_transfer: "Transferi İptal Et",
        enter_activation_code: "Lütfen transfer aktivasyon kodunu girin",
        activation_code: "Aktivasyon Kodu",
        validate_transfer: "Transferi Onayla",
        transfer_in_progress: "Transfer talimatınız işleniyor...",
        identity_verified: "Kimlik doğrulaması başarıyla tamamlandı.",
        progress_desc: "Bu sayfayı yenilemeden önce paranın bankanıza ulaşmasını bekleyin.",
        
        progress_details_title: "Devam Eden Transfer Detayları",
        personal_info: "Kişisel Bilgiler",
        account_details: "Hesap Detayları",
        operation_secured: "İşleminiz güvenli ve kayıtlıdır.",
        no_amount_debited: "Hesabınızdan hiçbir tutar çekilmedi.",
        download_receipt: "Makbuzu İndir",
        receipt_thank_you_1: "APP PAY kullandığınız için teşekkür ederiz.",
        receipt_thank_you_2: "Bu makbuz otomatik olarak oluşturulur.",
        
        transfer_success: "Transfer Başarıyla Tamamlandı",
        receipt_subtitle: "TRANSFER MAKBUZU",
        validated_status: "Transfer Onaylandı",
        success_subtitle: "Transferiniz kaydedildi ve alıcının bankası tarafından işlenecek.",
        
        transfer_pending: "Transfer Beklemede",
        pending_subtitle: "Transferiniz kaydedildi ve yönetim servisimiz tarafından doğrulanmayı bekliyor.",
        pending_status: "Beklemede",
        
        transfer_failed: "Transfer Engellendi",
        transfer_failed_subtitle: "Transferiniz sistem tarafından engellendi. Alıcının banka hesabı tanınmadı. Daha fazla bilgi için lütfen müşteri hizmetleriyle iletişime geçin.",
        failed_status: "Engellendi",

        transfer_cancelled: "Transfer İptal Edildi",
        cancelled_status: "İptal Edildi",
        refunded_amount: "İade Edilen Tutar",
        
        amount_sent: "GÖNDERİLEN TUTAR",
        beneficiary: "Alıcı",
        date: "Tarih",
        reference: "Referans",
        back_to_dashboard: "Panele Dön",
        my_virtual_card: "Sanal Kart",
        holder: "Kart Sahibi",
        expires: "Son Kullanma",
        show_details: "Detayları Göster",
        hide_details: "Detayları Gizle",
        freeze_card: "Kartı Dondur",
        settings: "Ayarlar",
        monthly_limit: "Aylık Limit",
        monthly_spent: "Bu Ay Harcanan",
        status: "Durum",
        active: "Aktif",
        type: "Tür",
        verified: "Doğrulandı",
        account_holder_premium: "Hesap Sahibi • Premium Müşteri",
        full_name: "Ad Soyad",
        email_address: "E-posta Adresi",
        phone_number: "Telefon Numarası",
        country: "İkamet Ülkesi",
        account_id: "Benzersiz Kimlik",
        opening_date: "Açılış Tarihi",
        edit_profile: "Profili Düzenle",
        security: "Güvenlik",
        notifications: "Bildirimler",
        no_transactions: "Henüz işlem yok",
        err_email: "Yanlış e-posta adresi.",
        err_pin: "Yanlış PIN kodu.",
        err_amount: "Geçersiz tutar.",
        err_balance: "Yetersiz bakiye.",
        err_fields: "Lütfen tüm alanları doldurun.",
        err_activation: "Yanlış aktivasyon kodu.",
        err_percent: "Tutar izin verilen limiti ({limit}) aşıyor.",
        err_client_not_found: "Müşteri bulunamadı. Geçersiz bağlantı.",
        err_no_link: "Bağlantı sağlanmadı. Erişim reddedildi.",
        welcome: "Hoş Geldiniz",
        login_success: "Giriş başarılı. Hoş geldiniz!",
        transfer_cancelled_toast: "Transfer iptal edildi.",
        transfer_finalized: "Transfer başarıyla tamamlandı!",
        err_card_locked: "Kart detaylarının görüntülenmesi yönetici tarafından yetkilendirilmemiştir.",
        err_iban_locked: "IBAN görüntülemesi yönetici tarafından yetkilendirilmemiştir.",
        iban_copied: "IBAN kopyalandı!",
        swift_copied: "SWIFT kodu kopyalandı!",
        placeholder_email: "E-posta adresiniz",
        placeholder_pin: "PIN kodunuz",
        placeholder_activation: "Gizli kodunuzu girin",
        card_footer: "Bu kart APP PAY'ın münhasır mülkiyetindedir. Her türlü kötüye kullanım yasal işlem görecektir.",
        card_security_note: "Son 4 hane ve CVV güvenlik nedeniyle gizlenmiştir.",
        visa_premium: "Mastercard Premium",
        bank_details: "Banka Bilgileri",
        iban_number: "IBAN Numarası",
        swift_code: "SWIFT / BIC Kodu",
        iban_info_note: "Transfer almak için bu bilgileri kullanın. IBAN'ın son 4 hanesi güvenlik nedeniyle gizlenmiştir.",
        show_iban: "Tam IBAN'ı Göster",
        hide_iban: "IBAN'ı Gizle",
        allowed_limit: "İzin Verilen Limit:",
        limit_percentage: "Limit Yüzdesi:",
        current_balance: "Mevcut Bakiye:",
        attempted_amount: "DENENEN TUTAR",
        new_transaction_received: "Yeni işlem alındı!",
        copied: "Kopyalandı!",
        
        tap_to_flip: "Kartı çevirmek için dokunun",
        view_full_card: "Tam numarayı görüntüle",
        flip_card: "Kartı Çevir",
        view_cvv: "CVV Kodunu Görüntüle",
        receipt_title: "İŞLEM MAKBUZU",
        receipt_sender: "Gönderen",
        receipt_thank_you: "APP PAY kullandığınız için teşekkür ederiz. Bu makbuz otomatik olarak oluşturulur.",
        close: "Kapat",
        
        confirm_title_warning: "Uyarı",
        confirm_btn_cancel: "İptal",
        confirm_btn_ok: "Onayla"
    },
    // 🆕 NOUVELLE LANGUE : CORÉEN (ko)
    ko: {
        dashboard: "지갑",
        personal_iban: "개인 IBAN",
        logout: "로그아웃",
        profile: "프로필",
        transfer_menu: "송금",
        transfer_btn: "송금하기",
        virtual_card_btn: "가상 카드",
        
        available_balance: "사용 가능 잔액",
        account_subtitle: "모든 필요를 위한 계좌",
        see_iban: "내 IBAN 보기",
        make_transfer: "송금하기",
        see_card: "가상 카드",
        international_transfer: "국제 송금하기",
        transfer_warning: "최종 확인 후 송금 처리에는 1~3분이 소요됩니다.",
        transactions_history: "거래 내역",
        total_balance: "총 잔액",
        transactions_label: "거래",
        currency_label: "통화",
        view_all: "전체 보기",
        today: "오늘",
        yesterday: "어제",
        transfer_received: "송금 수신",
        transfer_sent: "송금 발신",
        completed: "완료",
        amount: "송금 금액",
        beneficiary_name: "수취인 이름",
        iban: "IBAN / 계좌 번호",
        bic: "은행 코드 (BIC / SWIFT)",
        bank_name: "은행 이름",
        reason: "송금 사유",
        continue: "계속",
        identity_verification: "신원 확인",
        pending_transfer_details: "대기 중인 송금 세부 정보",
        cancel_transfer: "송금 취소",
        enter_activation_code: "송금 활성화 코드를 입력하세요",
        activation_code: "활성화 코드",
        validate_transfer: "송금 확인",
        transfer_in_progress: "송금 주문이 처리 중입니다...",
        identity_verified: "신원 확인이 성공적으로 완료되었습니다.",
        progress_desc: "이 페이지를 새로 고치기 전에 자금이 은행에 도착할 때까지 기다려 주세요.",
        
        progress_details_title: "진행 중인 송금 세부 정보",
        personal_info: "개인 정보",
        account_details: "계좌 세부 정보",
        operation_secured: "귀하의 작업은 안전하게 등록되었습니다.",
        no_amount_debited: "귀하의 계좌에서 금액이 차감되지 않았습니다.",
        download_receipt: "영수증 다운로드",
        receipt_thank_you_1: "APP PAY를 이용해 주셔서 감사합니다.",
        receipt_thank_you_2: "이 영수증은 자동으로 생성됩니다.",
        
        transfer_success: "송금이 성공적으로 완료되었습니다",
        receipt_subtitle: "송금 영수증",
        validated_status: "송금 확인됨",
        success_subtitle: "귀하의 송금이 등록되었으며 수취인의 은행에서 처리될 것입니다.",
        
        transfer_pending: "송금 대기 중",
        pending_subtitle: "귀하의 송금이 등록되었으며 당사 행정 부서의 검증을 기다리고 있습니다.",
        pending_status: "대기 중",
        
        transfer_failed: "송금 차단됨",
        transfer_failed_subtitle: "귀하의 송금이 시스템에 의해 차단되었습니다. 수취인의 은행 계좌를 인식할 수 없습니다. 자세한 내용은 고객 서비스에 문의하십시오.",
        failed_status: "차단됨",

        transfer_cancelled: "송금 취소됨",
        cancelled_status: "취소됨",
        refunded_amount: "환불된 금액",
        
        amount_sent: "송금액",
        beneficiary: "수취인",
        date: "날짜",
        reference: "참조 번호",
        back_to_dashboard: "대시보드로 돌아가기",
        my_virtual_card: "가상 카드",
        holder: "소지자",
        expires: "유효기간",
        show_details: "세부 정보 표시",
        hide_details: "세부 정보 숨기기",
        freeze_card: "카드 정지",
        settings: "설정",
        monthly_limit: "월 한도",
        monthly_spent: "이번 달 지출",
        status: "상태",
        active: "활성",
        type: "유형",
        verified: "확인됨",
        account_holder_premium: "계좌 소유자 • 프리미엄 고객",
        full_name: "전체 이름",
        email_address: "이메일 주소",
        phone_number: "전화번호",
        country: "거주 국가",
        account_id: "고유 ID",
        opening_date: "개설 날짜",
        edit_profile: "프로필 편집",
        security: "보안",
        notifications: "알림",
        no_transactions: "아직 거래 없음",
        err_email: "잘못된 이메일 주소입니다.",
        err_pin: "잘못된 PIN 코드입니다.",
        err_amount: "유효하지 않은 금액입니다.",
        err_balance: "잔액 부족.",
        err_fields: "모든 필드를 작성해 주세요.",
        err_activation: "잘못된 활성화 코드입니다.",
        err_percent: "금액이 허용 한도({limit})를 초과합니다.",
        err_client_not_found: "고객을 찾을 수 없습니다. 잘못된 링크입니다.",
        err_no_link: "링크가 제공되지 않았습니다. 액세스 거부.",
        welcome: "환영합니다",
        login_success: "로그인 성공. 환영합니다!",
        transfer_cancelled_toast: "송금이 취소되었습니다.",
        transfer_finalized: "송금이 성공적으로 완료되었습니다!",
        err_card_locked: "카드 세부 정보 표시는 관리자가 승인하지 않았습니다.",
        err_iban_locked: "IBAN 표시는 관리자가 승인하지 않았습니다.",
        iban_copied: "IBAN이 복사되었습니다!",
        swift_copied: "SWIFT 코드가 복사되었습니다!",
        placeholder_email: "이메일 주소",
        placeholder_pin: "PIN 코드",
        placeholder_activation: "비밀 코드를 입력하세요",
        card_footer: "이 카드는 APP PAY의 독점 재산입니다. 모든 사기적 사용은 법적 조치를 받게 됩니다.",
        card_security_note: "보안상의 이유로 마지막 4자리와 CVV가 마스킹되었습니다.",
        visa_premium: "Mastercard Premium",
        bank_details: "은행 정보",
        iban_number: "IBAN 번호",
        swift_code: "SWIFT / BIC 코드",
        iban_info_note: "송금을 받으려면 이 정보를 사용하십시오. IBAN의 마지막 4자리는 보안상의 이유로 마스킹되었습니다.",
        show_iban: "전체 IBAN 표시",
        hide_iban: "IBAN 숨기기",
        allowed_limit: "허용 한도:",
        limit_percentage: "한도 비율:",
        current_balance: "현재 잔액:",
        attempted_amount: "시도 금액",
        new_transaction_received: "새 거래가 수신되었습니다!",
        copied: "복사되었습니다!",
        
        tap_to_flip: "카드를 탭하여 뒤집기",
        view_full_card: "전체 번호 보기",
        flip_card: "카드 뒤집기",
        view_cvv: "CVV 코드 보기",
        receipt_title: "거래 영수증",
        receipt_sender: "발신자",
        receipt_thank_you: "APP PAY를 이용해 주셔서 감사합니다. 이 영수증은 자동으로 생성됩니다.",
        close: "닫기",
        
        confirm_title_warning: "경고",
        confirm_btn_cancel: "취소",
        confirm_btn_ok: "확인"
    }
// ============================================================
// ⏳ FIN DE LA PARTIE 1/2 — Demandez la partie 2
// ============================================================
        ,
    // 🆕 NOUVELLE LANGUE : VIETNAMIEN (vi)
    vi: {
        dashboard: "Ví",
        personal_iban: "IBAN Cá nhân",
        logout: "Đăng xuất",
        profile: "Hồ sơ",
        transfer_menu: "Chuyển khoản",
        transfer_btn: "Thực hiện chuyển khoản",
        virtual_card_btn: "Thẻ ảo",
        
        available_balance: "Số dư khả dụng",
        account_subtitle: "Tài khoản cho mọi nhu cầu của bạn",
        see_iban: "Xem IBAN của tôi",
        make_transfer: "Thực hiện chuyển khoản",
        see_card: "Thẻ ảo",
        international_transfer: "Thực hiện chuyển khoản quốc tế",
        transfer_warning: "Quá trình xử lý chuyển khoản mất từ 1 đến 3 phút sau khi xác minh cuối cùng.",
        transactions_history: "Lịch sử giao dịch",
        total_balance: "Tổng số dư",
        transactions_label: "Giao dịch",
        currency_label: "Tiền tệ",
        view_all: "Xem tất cả",
        today: "Hôm nay",
        yesterday: "Hôm qua",
        transfer_received: "Đã nhận chuyển khoản",
        transfer_sent: "Đã gửi chuyển khoản",
        completed: "Hoàn thành",
        amount: "Số tiền chuyển khoản",
        beneficiary_name: "Tên người thụ hưởng",
        iban: "IBAN / Số tài khoản",
        bic: "Mã ngân hàng (BIC / SWIFT)",
        bank_name: "Tên ngân hàng",
        reason: "Lý do chuyển khoản",
        continue: "Tiếp tục",
        identity_verification: "Xác minh danh tính",
        pending_transfer_details: "Chi tiết chuyển khoản đang chờ",
        cancel_transfer: "Hủy chuyển khoản",
        enter_activation_code: "Vui lòng nhập mã kích hoạt chuyển khoản",
        activation_code: "Mã kích hoạt",
        validate_transfer: "Xác nhận chuyển khoản",
        transfer_in_progress: "Lệnh chuyển khoản của bạn đang được xử lý...",
        identity_verified: "Xác minh danh tính thành công.",
        progress_desc: "Vui lòng đợi tiền được chuyển đến ngân hàng của bạn trước khi làm mới trang này.",
        
        progress_details_title: "Chi tiết chuyển khoản đang xử lý",
        personal_info: "Thông tin cá nhân",
        account_details: "Chi tiết tài khoản",
        operation_secured: "Hoạt động của bạn được bảo mật và ghi nhận.",
        no_amount_debited: "Không có số tiền nào bị trừ khỏi tài khoản của bạn.",
        download_receipt: "Tải xuống biên lai",
        receipt_thank_you_1: "Cảm ơn bạn đã sử dụng APP PAY.",
        receipt_thank_you_2: "Biên lai này được tạo tự động.",
        
        transfer_success: "Chuyển khoản thành công",
        receipt_subtitle: "BIÊN LAI CHUYỂN KHOẢN",
        validated_status: "Chuyển khoản đã xác nhận",
        success_subtitle: "Chuyển khoản của bạn đã được ghi nhận và sẽ được ngân hàng của người thụ hưởng xử lý.",
        
        transfer_pending: "Chuyển khoản đang chờ",
        pending_subtitle: "Chuyển khoản của bạn đã được ghi nhận và đang chờ bộ phận hành chính của chúng tôi xác nhận.",
        pending_status: "Đang chờ",
        
        transfer_failed: "Chuyển khoản bị chặn",
        transfer_failed_subtitle: "Chuyển khoản của bạn đã bị hệ thống chặn. Tài khoản ngân hàng của người thụ hưởng không được nhận diện. Vui lòng liên hệ dịch vụ khách hàng để biết thêm thông tin.",
        failed_status: "Bị chặn",

        transfer_cancelled: "Chuyển khoản đã hủy",
        cancelled_status: "Đã hủy",
        refunded_amount: "Số tiền hoàn lại",
        
        amount_sent: "SỐ TIỀN ĐÃ GỬI",
        beneficiary: "Người thụ hưởng",
        date: "Ngày",
        reference: "Mã tham chiếu",
        back_to_dashboard: "Quay lại bảng điều khiển",
        my_virtual_card: "Thẻ ảo",
        holder: "Chủ thẻ",
        expires: "Hết hạn",
        show_details: "Hiển thị chi tiết",
        hide_details: "Ẩn chi tiết",
        freeze_card: "Đóng băng thẻ",
        settings: "Cài đặt",
        monthly_limit: "Hạn mức hàng tháng",
        monthly_spent: "Chi tiêu trong tháng",
        status: "Trạng thái",
        active: "Hoạt động",
        type: "Loại",
        verified: "Đã xác minh",
        account_holder_premium: "Chủ tài khoản • Khách hàng cao cấp",
        full_name: "Họ và tên",
        email_address: "Địa chỉ email",
        phone_number: "Số điện thoại",
        country: "Quốc gia cư trú",
        account_id: "ID duy nhất",
        opening_date: "Ngày mở",
        edit_profile: "Chỉnh sửa hồ sơ",
        security: "Bảo mật",
        notifications: "Thông báo",
        no_transactions: "Chưa có giao dịch",
        err_email: "Địa chỉ email không chính xác.",
        err_pin: "Mã PIN không chính xác.",
        err_amount: "Số tiền không hợp lệ.",
        err_balance: "Số dư không đủ.",
        err_fields: "Vui lòng điền tất cả các trường.",
        err_activation: "Mã kích hoạt không chính xác.",
        err_percent: "Số tiền vượt quá giới hạn cho phép ({limit}).",
        err_client_not_found: "Không tìm thấy khách hàng. Liên kết không hợp lệ.",
        err_no_link: "Không có liên kết. Truy cập bị từ chối.",
        welcome: "Chào mừng",
        login_success: "Đăng nhập thành công. Chào mừng!",
        transfer_cancelled_toast: "Đã hủy chuyển khoản.",
        transfer_finalized: "Chuyển khoản đã hoàn thành!",
        err_card_locked: "Hiển thị chi tiết thẻ không được quản trị viên cho phép.",
        err_iban_locked: "Hiển thị IBAN không được quản trị viên cho phép.",
        iban_copied: "Đã sao chép IBAN!",
        swift_copied: "Đã sao chép mã SWIFT!",
        placeholder_email: "Địa chỉ email của bạn",
        placeholder_pin: "Mã PIN của bạn",
        placeholder_activation: "Nhập mã bí mật của bạn",
        card_footer: "Thẻ này là tài sản độc quyền của APP PAY. Mọi hành vi sử dụng gian lận sẽ bị truy tố.",
        card_security_note: "4 chữ số cuối và CVV đã được ẩn vì lý do bảo mật.",
        visa_premium: "Mastercard Premium",
        bank_details: "Thông tin ngân hàng",
        iban_number: "Số IBAN",
        swift_code: "Mã SWIFT / BIC",
        iban_info_note: "Sử dụng thông tin này để nhận chuyển khoản. 4 chữ số cuối của IBAN được ẩn vì lý do bảo mật.",
        show_iban: "Hiển thị IBAN đầy đủ",
        hide_iban: "Ẩn IBAN",
        allowed_limit: "Giới hạn cho phép:",
        limit_percentage: "Phần trăm giới hạn:",
        current_balance: "Số dư hiện tại:",
        attempted_amount: "SỐ TIỀN ĐÃ THỬ",
        new_transaction_received: "Đã nhận giao dịch mới!",
        copied: "Đã sao chép!",
        
        tap_to_flip: "Nhấn vào thẻ để lật",
        view_full_card: "Xem số đầy đủ",
        flip_card: "Lật thẻ",
        view_cvv: "Xem mã CVV",
        receipt_title: "BIÊN LAI GIAO DỊCH",
        receipt_sender: "Người gửi",
        receipt_thank_you: "Cảm ơn bạn đã sử dụng APP PAY. Biên lai này được tạo tự động.",
        close: "Đóng",
        
        confirm_title_warning: "Cảnh báo",
        confirm_btn_cancel: "Hủy",
        confirm_btn_ok: "Xác nhận"
    },
    // ============================================================
    // LANGUE : NÉERLANDAIS (nl)
    // ============================================================
    nl: {
        dashboard: "Portemonnee",
        personal_iban: "Persoonlijke IBAN",
        logout: "Uitloggen",
        profile: "Profiel",
        transfer_menu: "Overschrijving",
        transfer_btn: "Overschrijving uitvoeren",
        virtual_card_btn: "Virtuele kaart",
        
        available_balance: "Beschikbaar saldo",
        account_subtitle: "Rekening voor al uw behoeften",
        see_iban: "Mijn IBAN bekijken",
        make_transfer: "Overschrijving uitvoeren",
        see_card: "Virtuele kaart",
        international_transfer: "Internationale overschrijving uitvoeren",
        transfer_warning: "De verwerking van de overschrijving duurt 1 tot 3 minuten na de laatste verificatie.",
        transactions_history: "Transactiegeschiedenis",
        total_balance: "Totaal saldo",
        transactions_label: "Transacties",
        currency_label: "Valuta",
        view_all: "Alles bekijken",
        today: "Vandaag",
        yesterday: "Gisteren",
        transfer_received: "Overschrijving ontvangen",
        transfer_sent: "Overschrijving verzonden",
        completed: "Voltooid",
        amount: "Bedrag van de overschrijving",
        beneficiary_name: "Naam van de begunstigde",
        iban: "IBAN / Rekeningnummer",
        bic: "Bankcode (BIC / SWIFT)",
        bank_name: "Naam van de bank",
        reason: "Reden van de overschrijving",
        continue: "Doorgaan",
        identity_verification: "Identiteitsverificatie",
        pending_transfer_details: "Details van de lopende overschrijving",
        cancel_transfer: "Overschrijving annuleren",
        enter_activation_code: "Voer de activeringscode van de overschrijving in",
        activation_code: "Activeringscode",
        validate_transfer: "Overschrijving valideren",
        transfer_in_progress: "Uw overschrijvingsopdracht is in behandeling...",
        identity_verified: "Identiteitsverificatie succesvol uitgevoerd.",
        progress_desc: "Wacht tot de overdracht van de fondsen naar uw bank is voltooid voordat u deze pagina vernieuwt.",
        
        progress_details_title: "Details van de lopende overschrijving",
        personal_info: "Persoonlijke informatie",
        account_details: "Rekeninggegevens",
        operation_secured: "Uw transactie is beveiligd en geregistreerd.",
        no_amount_debited: "Er is geen bedrag van uw rekening afgeschreven.",
        download_receipt: "Bon downloaden",
        receipt_thank_you_1: "Bedankt voor het gebruik van APP PAY.",
        receipt_thank_you_2: "Deze bon wordt automatisch gegenereerd.",
        
        transfer_success: "Overschrijving succesvol uitgevoerd",
        receipt_subtitle: "OVERSCHRIJVINGSBON",
        validated_status: "Overschrijving bevestigd",
        success_subtitle: "Uw overschrijving is geregistreerd en zal worden verwerkt door de bank van de begunstigde.",
        
        transfer_pending: "Overschrijving in behandeling",
        pending_subtitle: "Uw overschrijving is geregistreerd en wacht op validatie door onze administratieve dienst.",
        pending_status: "In behandeling",
        
        transfer_failed: "Overschrijving geblokkeerd",
        transfer_failed_subtitle: "Uw overschrijving is door het systeem geblokkeerd. De bankrekening van de begunstigde is niet herkend. Neem contact op met de klantenservice voor meer informatie.",
        failed_status: "Geblokkeerd",

        transfer_cancelled: "Overschrijving geannuleerd",
        cancelled_status: "Geannuleerd",
        refunded_amount: "Terugbetaald bedrag",
        
        amount_sent: "VERZONDEN BEDRAG",
        beneficiary: "Begunstigde",
        date: "Datum",
        reference: "Referentie",
        back_to_dashboard: "Terug naar dashboard",
        my_virtual_card: "Virtuele kaart",
        holder: "Houder",
        expires: "Verloopt",
        show_details: "Details tonen",
        hide_details: "Details verbergen",
        freeze_card: "Kaart blokkeren",
        settings: "Instellingen",
        monthly_limit: "Maandlimiet",
        monthly_spent: "Deze maand uitgegeven",
        status: "Status",
        active: "Actief",
        type: "Type",
        verified: "Geverifieerd",
        account_holder_premium: "Rekeninghouder • Premium klant",
        full_name: "Volledige naam",
        email_address: "E-mailadres",
        phone_number: "Telefoonnummer",
        country: "Land van verblijf",
        account_id: "Unieke ID",
        opening_date: "Openingsdatum",
        edit_profile: "Profiel bewerken",
        security: "Beveiliging",
        notifications: "Meldingen",
        no_transactions: "Nog geen transacties",
        err_email: "Onjuist e-mailadres.",
        err_pin: "Onjuiste pincode.",
        err_amount: "Ongeldig bedrag.",
        err_balance: "Onvoldoende saldo.",
        err_fields: "Vul alstublieft alle velden in.",
        err_activation: "Onjuiste activeringscode.",
        err_percent: "Het bedrag overschrijdt de toegestane limiet ({limit}).",
        err_client_not_found: "Klant niet gevonden. Ongeldige link.",
        err_no_link: "Geen link opgegeven. Toegang geweigerd.",
        welcome: "Welkom",
        login_success: "Inloggen geslaagd. Welkom!",
        transfer_cancelled_toast: "Overschrijving geannuleerd.",
        transfer_finalized: "Overschrijving succesvol voltooid!",
        err_card_locked: "Weergave van kaartgegevens is niet toegestaan door de beheerder.",
        err_iban_locked: "Weergave van de IBAN is niet toegestaan door de beheerder.",
        iban_copied: "IBAN gekopieerd!",
        swift_copied: "SWIFT-code gekopieerd!",
        placeholder_email: "Uw e-mailadres",
        placeholder_pin: "Uw pincode",
        placeholder_activation: "Voer uw geheime code in",
        card_footer: "Deze kaart is exclusief eigendom van APP PAY. Elk frauduleus gebruik zal worden vervolgd.",
        card_security_note: "De laatste 4 cijfers en de CVV zijn om veiligheidsredenen gemaskeerd.",
        visa_premium: "Mastercard Premium",
        bank_details: "Bankgegevens",
        iban_number: "IBAN-nummer",
        swift_code: "SWIFT / BIC-code",
        iban_info_note: "Gebruik deze gegevens om overschrijvingen te ontvangen. De laatste 4 cijfers van de IBAN zijn om veiligheidsredenen gemaskeerd.",
        show_iban: "Volledige IBAN tonen",
        hide_iban: "IBAN verbergen",
        allowed_limit: "Toegestane limiet:",
        limit_percentage: "Limietpercentage:",
        current_balance: "Huidig saldo:",
        attempted_amount: "GEPROBEERD BEDRAG",
        new_transaction_received: "Nieuwe transactie ontvangen!",
        copied: "Gekopieerd!",
        
        tap_to_flip: "Tik op de kaart om deze om te draaien",
        view_full_card: "Volledig nummer bekijken",
        flip_card: "Kaart omdraaien",
        view_cvv: "CVV-code bekijken",
        receipt_title: "TRANSACTIEBON",
        receipt_sender: "Afzender",
        receipt_thank_you: "Bedankt voor het gebruik van APP PAY. Deze bon wordt automatisch gegenereerd.",
        close: "Sluiten",
        
        confirm_title_warning: "Waarschuwing",
        confirm_btn_cancel: "Annuleren",
        confirm_btn_ok: "Bevestigen"
    },
    // ============================================================
    // LANGUE : RUSSE (ru)
    // ============================================================
    ru: {
        dashboard: "Кошелёк",
        personal_iban: "Личный IBAN",
        logout: "Выйти",
        profile: "Профиль",
        transfer_menu: "Перевод",
        transfer_btn: "Сделать перевод",
        virtual_card_btn: "Виртуальная карта",
        
        available_balance: "Доступный баланс",
        account_subtitle: "Счёт для всех ваших нужд",
        see_iban: "Показать мой IBAN",
        make_transfer: "Сделать перевод",
        see_card: "Виртуальная карта",
        international_transfer: "Сделать международный перевод",
        transfer_warning: "Обработка перевода занимает от 1 до 3 минут после финальной проверки.",
        transactions_history: "История транзакций",
        total_balance: "Общий баланс",
        transactions_label: "Транзакции",
        currency_label: "Валюта",
        view_all: "Показать всё",
        today: "Сегодня",
        yesterday: "Вчера",
        transfer_received: "Перевод получен",
        transfer_sent: "Перевод отправлен",
        completed: "Выполнено",
        amount: "Сумма перевода",
        beneficiary_name: "Имя получателя",
        iban: "IBAN / Номер счёта",
        bic: "Код банка (BIC / SWIFT)",
        bank_name: "Название банка",
        reason: "Причина перевода",
        continue: "Продолжить",
        identity_verification: "Проверка личности",
        pending_transfer_details: "Детали ожидающего перевода",
        cancel_transfer: "Отменить перевод",
        enter_activation_code: "Введите код активации перевода",
        activation_code: "Код активации",
        validate_transfer: "Подтвердить перевод",
        transfer_in_progress: "Ваш перевод обрабатывается...",
        identity_verified: "Проверка личности успешно завершена.",
        progress_desc: "Пожалуйста, дождитесь поступления средств в ваш банк перед обновлением страницы.",
        
        progress_details_title: "Детали текущего перевода",
        personal_info: "Личная информация",
        account_details: "Детали счёта",
        operation_secured: "Ваша операция защищена и зарегистрирована.",
        no_amount_debited: "С вашего счёта не было списано никаких сумм.",
        download_receipt: "Скачать квитанцию",
        receipt_thank_you_1: "Спасибо за использование APP PAY.",
        receipt_thank_you_2: "Эта квитанция создаётся автоматически.",
        
        transfer_success: "Перевод успешно выполнен",
        receipt_subtitle: "КВИТАНЦИЯ О ПЕРЕВОДЕ",
        validated_status: "Перевод подтверждён",
        success_subtitle: "Ваш перевод зарегистрирован и будет обработан банком получателя.",
        
        transfer_pending: "Перевод в ожидании",
        pending_subtitle: "Ваш перевод зарегистрирован и ожидает проверки нашей административной службой.",
        pending_status: "В ожидании",
        
        transfer_failed: "Перевод заблокирован",
        transfer_failed_subtitle: "Ваш перевод был заблокирован системой. Банковский счёт получателя не был распознан. Пожалуйста, свяжитесь со службой поддержки для получения дополнительной информации.",
        failed_status: "Заблокирован",

        transfer_cancelled: "Перевод отменён",
        cancelled_status: "Отменён",
        refunded_amount: "Возвращённая сумма",
        
        amount_sent: "ОТПРАВЛЕННАЯ СУММА",
        beneficiary: "Получатель",
        date: "Дата",
        reference: "Ссылка",
        back_to_dashboard: "Вернуться на главную",
        my_virtual_card: "Виртуальная карта",
        holder: "Владелец",
        expires: "Действует до",
        show_details: "Показать детали",
        hide_details: "Скрыть детали",
        freeze_card: "Заблокировать карту",
        settings: "Настройки",
        monthly_limit: "Месячный лимит",
        monthly_spent: "Потрачено за месяц",
        status: "Статус",
        active: "Активна",
        type: "Тип",
        verified: "Проверен",
        account_holder_premium: "Владелец счёта • Премиум-клиент",
        full_name: "Полное имя",
        email_address: "Адрес эл. почты",
        phone_number: "Номер телефона",
        country: "Страна проживания",
        account_id: "Уникальный ID",
        opening_date: "Дата открытия",
        edit_profile: "Редактировать профиль",
        security: "Безопасность",
        notifications: "Уведомления",
        no_transactions: "Транзакций пока нет",
        err_email: "Неверный адрес электронной почты.",
        err_pin: "Неверный PIN-код.",
        err_amount: "Неверная сумма.",
        err_balance: "Недостаточно средств.",
        err_fields: "Пожалуйста, заполните все поля.",
        err_activation: "Неверный код активации.",
        err_percent: "Сумма превышает допустимый лимит ({limit}).",
        err_client_not_found: "Клиент не найден. Неверная ссылка.",
        err_no_link: "Ссылка не указана. Доступ запрещён.",
        welcome: "Добро пожаловать",
        login_success: "Вход выполнен. Добро пожаловать!",
        transfer_cancelled_toast: "Перевод отменён.",
        transfer_finalized: "Перевод успешно завершён!",
        err_card_locked: "Отображение данных карты не разрешено администратором.",
        err_iban_locked: "Отображение IBAN не разрешено администратором.",
        iban_copied: "IBAN скопирован!",
        swift_copied: "SWIFT-код скопирован!",
        placeholder_email: "Ваш адрес эл. почты",
        placeholder_pin: "Ваш PIN-код",
        placeholder_activation: "Введите ваш секретный код",
        card_footer: "Эта карта является исключительной собственностью APP PAY. Любое мошенническое использование будет преследоваться по закону.",
        card_security_note: "Последние 4 цифры и CVV скрыты в целях безопасности.",
        visa_premium: "Mastercard Premium",
        bank_details: "Банковские реквизиты",
        iban_number: "Номер IBAN",
        swift_code: "Код SWIFT / BIC",
        iban_info_note: "Используйте эти реквизиты для получения переводов. Последние 4 цифры IBAN скрыты в целях безопасности.",
        show_iban: "Показать полный IBAN",
        hide_iban: "Скрыть IBAN",
        allowed_limit: "Допустимый лимит:",
        limit_percentage: "Процент лимита:",
        current_balance: "Текущий баланс:",
        attempted_amount: "ЗАПРОШЕННАЯ СУММА",
        new_transaction_received: "Получена новая транзакция!",
        copied: "Скопировано!",
        
        tap_to_flip: "Нажмите на карту, чтобы перевернуть",
        view_full_card: "Показать полный номер",
        flip_card: "Перевернуть карту",
        view_cvv: "Показать CVV-код",
        receipt_title: "КВИТАНЦИЯ О ТРАНЗАКЦИИ",
        receipt_sender: "Отправитель",
        receipt_thank_you: "Спасибо за использование APP PAY. Эта квитанция создаётся автоматически.",
        close: "Закрыть",
        
        confirm_title_warning: "Внимание",
        confirm_btn_cancel: "Отмена",
        confirm_btn_ok: "Подтвердить"
    },
    // ============================================================
    // LANGUE : ARABE (ar)
    // ============================================================
    ar: {
        dashboard: "المحفظة",
        personal_iban: "IBAN الشخصي",
        logout: "تسجيل الخروج",
        profile: "الملف الشخصي",
        transfer_menu: "تحويل",
        transfer_btn: "إجراء تحويل",
        virtual_card_btn: "بطاقة افتراضية",
        
        available_balance: "الرصيد المتاح",
        account_subtitle: "حساب لجميع احتياجاتك",
        see_iban: "عرض IBAN الخاص بي",
        make_transfer: "إجراء تحويل",
        see_card: "البطاقة الافتراضية",
        international_transfer: "إجراء تحويل دولي",
        transfer_warning: "تستغرق معالجة التحويل من 1 إلى 3 دقائق بعد التحقق النهائي.",
        transactions_history: "سجل المعاملات",
        total_balance: "الرصيد الإجمالي",
        transactions_label: "المعاملات",
        currency_label: "العملة",
        view_all: "عرض الكل",
        today: "اليوم",
        yesterday: "أمس",
        transfer_received: "تحويل مستلم",
        transfer_sent: "تحويل مرسل",
        completed: "مكتمل",
        amount: "مبلغ التحويل",
        beneficiary_name: "اسم المستفيد",
        iban: "IBAN / رقم الحساب",
        bic: "رمز البنك (BIC / SWIFT)",
        bank_name: "اسم البنك",
        reason: "سبب التحويل",
        continue: "متابعة",
        identity_verification: "التحقق من الهوية",
        pending_transfer_details: "تفاصيل التحويل المعلق",
        cancel_transfer: "إلغاء التحويل",
        enter_activation_code: "يرجى إدخال رمز تنشيط التحويل",
        activation_code: "رمز التنشيط",
        validate_transfer: "تأكيد التحويل",
        transfer_in_progress: "أمر التحويل الخاص بك قيد المعالجة...",
        identity_verified: "تم التحقق من الهوية بنجاح.",
        progress_desc: "يرجى الانتظار حتى يتم تحويل الأموال إلى بنكك قبل تحديث هذه الصفحة.",
        
        progress_details_title: "تفاصيل التحويل الجاري",
        personal_info: "المعلومات الشخصية",
        account_details: "تفاصيل الحساب",
        operation_secured: "عمليتك آمنة ومسجلة.",
        no_amount_debited: "لم يتم خصم أي مبلغ من حسابك.",
        download_receipt: "تحميل الإيصال",
        receipt_thank_you_1: "شكرًا لاستخدامك APP PAY.",
        receipt_thank_you_2: "يتم إنشاء هذا الإيصال تلقائيًا.",
        
        transfer_success: "تم التحويل بنجاح",
        receipt_subtitle: "إيصال التحويل",
        validated_status: "تم تأكيد التحويل",
        success_subtitle: "تم تسجيل تحويلك وسيتم معالجته من قبل بنك المستفيد.",
        
        transfer_pending: "تحويل معلق",
        pending_subtitle: "تم تسجيل تحويلك وهو في انتظار التحقق من قبل خدمتنا الإدارية.",
        pending_status: "معلق",
        
        transfer_failed: "تحويل محظور",
        transfer_failed_subtitle: "تم حظر تحويلك من قبل النظام. لم يتم التعرف على الحساب البنكي للمستفيد. يرجى الاتصال بخدمة العملاء للحصول على مزيد من المعلومات.",
        failed_status: "محظور",

        transfer_cancelled: "تحويل ملغى",
        cancelled_status: "ملغى",
        refunded_amount: "المبلغ المسترد",
        
        amount_sent: "المبلغ المرسل",
        beneficiary: "المستفيد",
        date: "التاريخ",
        reference: "المرجع",
        back_to_dashboard: "العودة إلى لوحة التحكم",
        my_virtual_card: "البطاقة الافتراضية",
        holder: "حامل البطاقة",
        expires: "تنتهي في",
        show_details: "عرض التفاصيل",
        hide_details: "إخفاء التفاصيل",
        freeze_card: "تجميد البطاقة",
        settings: "الإعدادات",
        monthly_limit: "الحد الشهري",
        monthly_spent: "المصروفات الشهرية",
        status: "الحالة",
        active: "نشط",
        type: "النوع",
        verified: "موثق",
        account_holder_premium: "صاحب الحساب • عميل مميز",
        full_name: "الاسم الكامل",
        email_address: "البريد الإلكتروني",
        phone_number: "رقم الهاتف",
        country: "بلد الإقامة",
        account_id: "معرف فريد",
        opening_date: "تاريخ الافتتاح",
        edit_profile: "تعديل الملف الشخصي",
        security: "الأمان",
        notifications: "الإشعارات",
        no_transactions: "لا توجد معاملات حتى الآن",
        err_email: "عنوان بريد إلكتروني غير صحيح.",
        err_pin: "رمز PIN غير صحيح.",
        err_amount: "مبلغ غير صالح.",
        err_balance: "رصيد غير كافٍ.",
        err_fields: "يرجى ملء جميع الحقول.",
        err_activation: "رمز التنشيط غير صحيح.",
        err_percent: "المبلغ يتجاوز الحد المسموح به ({limit}).",
        err_client_not_found: "العميل غير موجود. رابط غير صالح.",
        err_no_link: "لم يتم تقديم رابط. تم رفض الوصول.",
        welcome: "مرحبًا",
        login_success: "تم تسجيل الدخول بنجاح. مرحبًا!",
        transfer_cancelled_toast: "تم إلغاء التحويل.",
        transfer_finalized: "تم إتمام التحويل بنجاح!",
        err_card_locked: "عرض تفاصيل البطاقة غير مصرح به من قبل المسؤول.",
        err_iban_locked: "عرض IBAN غير مصرح به من قبل المسؤول.",
        iban_copied: "تم نسخ IBAN!",
        swift_copied: "تم نسخ رمز SWIFT!",
        placeholder_email: "عنوان بريدك الإلكتروني",
        placeholder_pin: "رمز PIN الخاص بك",
        placeholder_activation: "أدخل رمزك السري",
        card_footer: "هذه البطاقة ملكية حصرية لـ APP PAY. أي استخدام احتيالي سيعرض للملاحقة القضائية.",
        card_security_note: "تم إخفاء آخر 4 أرقام ورمز CVV لأسباب أمنية.",
        visa_premium: "Mastercard Premium",
        bank_details: "التفاصيل المصرفية",
        iban_number: "رقم IBAN",
        swift_code: "رمز SWIFT / BIC",
        iban_info_note: "استخدم هذه التفاصيل لتلقي التحويلات. آخر 4 أرقام من IBAN مخفية لأسباب أمنية.",
        show_iban: "عرض IBAN الكامل",
        hide_iban: "إخفاء IBAN",
        allowed_limit: "الحد المسموح به:",
        limit_percentage: "نسبة الحد:",
        current_balance: "الرصيد الحالي:",
        attempted_amount: "المبلغ المطلوب",
        new_transaction_received: "تم استلام معاملة جديدة!",
        copied: "تم النسخ!",
        
        tap_to_flip: "اضغط على البطاقة لقلبها",
        view_full_card: "عرض الرقم الكامل",
        flip_card: "قلب البطاقة",
        view_cvv: "عرض رمز CVV",
        receipt_title: "إيصال المعاملة",
        receipt_sender: "المرسل",
        receipt_thank_you: "شكرًا لاستخدامك APP PAY. يتم إنشاء هذا الإيصال تلقائيًا.",
        close: "إغلاق",
        
        confirm_title_warning: "تحذير",
        confirm_btn_cancel: "إلغاء",
        confirm_btn_ok: "تأكيد"
    },
    // ============================================================
    // LANGUE : CHINOIS SIMPLIFIÉ (zh)
    // ============================================================
    zh: {
        dashboard: "钱包",
        personal_iban: "个人 IBAN",
        logout: "退出登录",
        profile: "个人资料",
        transfer_menu: "转账",
        transfer_btn: "进行转账",
        virtual_card_btn: "虚拟卡",
        
        available_balance: "可用余额",
        account_subtitle: "满足您所有需求的账户",
        see_iban: "查看我的 IBAN",
        make_transfer: "进行转账",
        see_card: "虚拟卡",
        international_transfer: "进行国际转账",
        transfer_warning: "最终验证后转账处理需要 1 到 3 分钟。",
        transactions_history: "交易历史",
        total_balance: "总余额",
        transactions_label: "交易",
        currency_label: "货币",
        view_all: "查看全部",
        today: "今天",
        yesterday: "昨天",
        transfer_received: "已收到转账",
        transfer_sent: "已发送转账",
        completed: "已完成",
        amount: "转账金额",
        beneficiary_name: "收款人姓名",
        iban: "IBAN / 账号",
        bic: "银行代码（BIC / SWIFT）",
        bank_name: "银行名称",
        reason: "转账原因",
        continue: "继续",
        identity_verification: "身份验证",
        pending_transfer_details: "待处理转账详情",
        cancel_transfer: "取消转账",
        enter_activation_code: "请输入转账激活码",
        activation_code: "激活码",
        validate_transfer: "验证转账",
        transfer_in_progress: "您的转账订单正在处理中...",
        identity_verified: "身份验证成功。",
        progress_desc: "请等待资金转入您的银行后再刷新此页面。",
        
        progress_details_title: "正在进行的转账详情",
        personal_info: "个人信息",
        account_details: "账户详情",
        operation_secured: "您的操作已安全并已记录。",
        no_amount_debited: "未从您的账户中扣除任何金额。",
        download_receipt: "下载收据",
        receipt_thank_you_1: "感谢您使用 APP PAY。",
        receipt_thank_you_2: "此收据自动生成。",
        
        transfer_success: "转账已成功完成",
        receipt_subtitle: "转账收据",
        validated_status: "转账已确认",
        success_subtitle: "您的转账已登记，将由收款人的银行处理。",
        
        transfer_pending: "转账待处理",
        pending_subtitle: "您的转账已登记，正在等待我们行政部门的验证。",
        pending_status: "待处理",
        
        transfer_failed: "转账已阻止",
        transfer_failed_subtitle: "您的转账被系统阻止。未识别收款人的银行账户。请联系客服以获取更多信息。",
        failed_status: "已阻止",

        transfer_cancelled: "转账已取消",
        cancelled_status: "已取消",
        refunded_amount: "已退款金额",
        
        amount_sent: "发送金额",
        beneficiary: "收款人",
        date: "日期",
        reference: "参考号",
        back_to_dashboard: "返回控制面板",
        my_virtual_card: "虚拟卡",
        holder: "持卡人",
        expires: "有效期至",
        show_details: "显示详情",
        hide_details: "隐藏详情",
        freeze_card: "冻结卡",
        settings: "设置",
        monthly_limit: "每月限额",
        monthly_spent: "本月消费",
        status: "状态",
        active: "已激活",
        type: "类型",
        verified: "已验证",
        account_holder_premium: "账户持有人 • 高级客户",
        full_name: "全名",
        email_address: "电子邮箱",
        phone_number: "电话号码",
        country: "居住国家",
        account_id: "唯一标识符",
        opening_date: "开户日期",
        edit_profile: "编辑个人资料",
        security: "安全",
        notifications: "通知",
        no_transactions: "暂无交易",
        err_email: "电子邮箱地址错误。",
        err_pin: "PIN 码错误。",
        err_amount: "无效金额。",
        err_balance: "余额不足。",
        err_fields: "请填写所有字段。",
        err_activation: "激活码错误。",
        err_percent: "金额超过允许限额（{limit}）。",
        err_client_not_found: "未找到客户。链接无效。",
        err_no_link: "未提供链接。访问被拒绝。",
        welcome: "欢迎",
        login_success: "登录成功。欢迎！",
        transfer_cancelled_toast: "转账已取消。",
        transfer_finalized: "转账已成功完成！",
        err_card_locked: "管理员未授权显示卡详细信息。",
        err_iban_locked: "管理员未授权显示 IBAN。",
        iban_copied: "IBAN 已复制！",
        swift_copied: "SWIFT 代码已复制！",
        placeholder_email: "您的电子邮箱地址",
        placeholder_pin: "您的 PIN 码",
        placeholder_activation: "请输入您的密码",
        card_footer: "此卡为 APP PAY 独家财产。任何欺诈使用将被追究法律责任。",
        card_security_note: "出于安全原因，最后 4 位数字和 CVV 已被隐藏。",
        visa_premium: "Mastercard Premium",
        bank_details: "银行信息",
        iban_number: "IBAN 号码",
        swift_code: "SWIFT / BIC 代码",
        iban_info_note: "使用这些信息接收转账。出于安全原因，IBAN 的最后 4 位数字已被隐藏。",
        show_iban: "显示完整 IBAN",
        hide_iban: "隐藏 IBAN",
        allowed_limit: "允许限额：",
        limit_percentage: "限额百分比：",
        current_balance: "当前余额：",
        attempted_amount: "尝试金额",
        new_transaction_received: "收到新交易！",
        copied: "已复制！",
        
        tap_to_flip: "点击卡片翻转",
        view_full_card: "查看完整号码",
        flip_card: "翻转卡片",
        view_cvv: "查看 CVV 码",
        receipt_title: "交易收据",
        receipt_sender: "发送方",
        receipt_thank_you: "感谢您使用 APP PAY。此收据自动生成。",
        close: "关闭",
        
        confirm_title_warning: "警告",
        confirm_btn_cancel: "取消",
        confirm_btn_ok: "确认"
    },
    // ============================================================
    // LANGUE : JAPONAIS (ja)
    // ============================================================
    ja: {
        dashboard: "ウォレット",
        personal_iban: "個人 IBAN",
        logout: "ログアウト",
        profile: "プロフィール",
        transfer_menu: "振込",
        transfer_btn: "振込を行う",
        virtual_card_btn: "バーチャルカード",
        
        available_balance: "利用可能残高",
        account_subtitle: "あらゆるニーズに対応する口座",
        see_iban: "IBAN を表示",
        make_transfer: "振込を行う",
        see_card: "バーチャルカード",
        international_transfer: "国際振込を行う",
        transfer_warning: "最終確認後、振込の処理には 1～3 分かかります。",
        transactions_history: "取引履歴",
        total_balance: "総残高",
        transactions_label: "取引",
        currency_label: "通貨",
        view_all: "すべて表示",
        today: "今日",
        yesterday: "昨日",
        transfer_received: "振込受取",
        transfer_sent: "振込送金",
        completed: "完了",
        amount: "振込金額",
        beneficiary_name: "受取人名",
        iban: "IBAN / 口座番号",
        bic: "銀行コード（BIC / SWIFT）",
        bank_name: "銀行名",
        reason: "振込理由",
        continue: "続行",
        identity_verification: "本人確認",
        pending_transfer_details: "保留中の振込詳細",
        cancel_transfer: "振込をキャンセル",
        enter_activation_code: "振込のアクティベーションコードを入力してください",
        activation_code: "アクティベーションコード",
        validate_transfer: "振込を承認",
        transfer_in_progress: "振込注文を処理中です...",
        identity_verified: "本人確認が正常に完了しました。",
        progress_desc: "このページを更新する前に、資金が銀行に振り込まれるまでお待ちください。",
        
        progress_details_title: "処理中の振込詳細",
        personal_info: "個人情報",
        account_details: "口座詳細",
        operation_secured: "お客様の操作は安全に記録されています。",
        no_amount_debited: "お客様の口座から金額は引き落とされていません。",
        download_receipt: "領収書をダウンロード",
        receipt_thank_you_1: "APP PAY をご利用いただきありがとうございます。",
        receipt_thank_you_2: "この領収書は自動的に生成されます。",
        
        transfer_success: "振込が正常に完了しました",
        receipt_subtitle: "振込領収書",
        validated_status: "振込が確認されました",
        success_subtitle: "お客様の振込は登録され、受取人の銀行によって処理されます。",
        
        transfer_pending: "振込保留中",
        pending_subtitle: "お客様の振込は登録され、当社の管理部門による検証を待っています。",
        pending_status: "保留中",
        
        transfer_failed: "振込がブロックされました",
        transfer_failed_subtitle: "お客様の振込はシステムによってブロックされました。受取人の銀行口座が認識されませんでした。詳細についてはカスタマーサービスにお問い合わせください。",
        failed_status: "ブロック済み",

        transfer_cancelled: "振込がキャンセルされました",
        cancelled_status: "キャンセル済み",
        refunded_amount: "返金額",
        
        amount_sent: "送金額",
        beneficiary: "受取人",
        date: "日付",
        reference: "参照番号",
        back_to_dashboard: "ダッシュボードに戻る",
        my_virtual_card: "バーチャルカード",
        holder: "名義人",
        expires: "有効期限",
        show_details: "詳細を表示",
        hide_details: "詳細を隠す",
        freeze_card: "カードを凍結",
        settings: "設定",
        monthly_limit: "月間限度額",
        monthly_spent: "今月の支出",
        status: "ステータス",
        active: "有効",
        type: "タイプ",
        verified: "確認済み",
        account_holder_premium: "口座名義人 • プレミアム顧客",
        full_name: "氏名",
        email_address: "メールアドレス",
        phone_number: "電話番号",
        country: "居住国",
        account_id: "固有 ID",
        opening_date: "開設日",
        edit_profile: "プロフィールを編集",
        security: "セキュリティ",
        notifications: "通知",
        no_transactions: "取引はまだありません",
        err_email: "メールアドレスが正しくありません。",
        err_pin: "PIN コードが正しくありません。",
        err_amount: "無効な金額です。",
        err_balance: "残高不足です。",
        err_fields: "すべての項目を入力してください。",
        err_activation: "アクティベーションコードが正しくありません。",
        err_percent: "金額が許可された上限（{limit}）を超えています。",
        err_client_not_found: "顧客が見つかりません。無効なリンクです。",
        err_no_link: "リンクが提供されていません。アクセス拒否。",
        welcome: "ようこそ",
        login_success: "ログインに成功しました。ようこそ！",
        transfer_cancelled_toast: "振込がキャンセルされました。",
        transfer_finalized: "振込が正常に完了しました！",
        err_card_locked: "カードの詳細表示は管理者によって許可されていません。",
        err_iban_locked: "IBAN の表示は管理者によって許可されていません。",
        iban_copied: "IBAN をコピーしました！",
        swift_copied: "SWIFT コードをコピーしました！",
        placeholder_email: "メールアドレスを入力",
        placeholder_pin: "PIN コードを入力",
        placeholder_activation: "秘密コードを入力してください",
        card_footer: "このカードは APP PAY の独占財産です。不正使用は法的措置の対象となります。",
        card_security_note: "セキュリティ上の理由により、下 4 桁と CVV はマスクされています。",
        visa_premium: "Mastercard Premium",
        bank_details: "銀行情報",
        iban_number: "IBAN 番号",
        swift_code: "SWIFT / BIC コード",
        iban_info_note: "振込の受取にはこの情報をご利用ください。IBAN の下 4 桁はセキュリティ上の理由によりマスクされています。",
        show_iban: "完全な IBAN を表示",
        hide_iban: "IBAN を隠す",
        allowed_limit: "許可された上限：",
        limit_percentage: "上限パーセント：",
        current_balance: "現在の残高：",
        attempted_amount: "試行金額",
        new_transaction_received: "新しい取引を受信しました！",
        copied: "コピーしました！",
        
        tap_to_flip: "カードをタップして裏返す",
        view_full_card: "完全な番号を表示",
        flip_card: "カードを裏返す",
        view_cvv: "CVV コードを表示",
        receipt_title: "取引領収書",
        receipt_sender: "送信者",
        receipt_thank_you: "APP PAY をご利用いただきありがとうございます。この領収書は自動的に生成されます。",
        close: "閉じる",
        
        confirm_title_warning: "警告",
        confirm_btn_cancel: "キャンセル",
        confirm_btn_ok: "確認"
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

// ============================================================
// CONVERSION SYMBOLE -> CODE DEVISE
// ============================================================
function getCurrencyCode(symbol) {
    const map = {
        'zł': 'PLN', '€': 'EUR', '$': 'USD', '£': 'GBP',
        'CHF': 'CHF', '¥': 'JPY', 'FCFA': 'XOF', 'NGN': 'NGN',
        'GHS': 'GHS', 'KES': 'KES', 'ZAR': 'ZAR', 'MAD': 'MAD',
        'CAD': 'CAD', 'AUD': 'AUD',
        '¥ CNY': 'CNY', 'CNY': 'CNY', 'RUB': 'RUB', 'UAH': 'UAH',
        'BYN': 'BYN', 'TRY': 'TRY', 'SEK': 'SEK', 'NOK': 'NOK',
        'DKK': 'DKK', 'ISK': 'ISK', 'CZK': 'CZK', 'HUF': 'HUF',
        'RON': 'RON', 'BGN': 'BGN', 'RSD': 'RSD', 'BAM': 'BAM',
        'MKD': 'MKD', 'ALL': 'ALL', 'MDL': 'MDL', 'GEL': 'GEL',
        'AMD': 'AMD', 'AZN': 'AZN',
        'MXN': 'MXN', 'BRL': 'BRL', 'ARS': 'ARS', 'CLP': 'CLP',
        'COP': 'COP', 'PEN': 'PEN', 'BOB': 'BOB', 'PYG': 'PYG',
        'UYU': 'UYU', 'VES': 'VES', 'CRC': 'CRC', 'GTQ': 'GTQ',
        'HNL': 'HNL', 'NIO': 'NIO', 'PAB': 'PAB', 'DOP': 'DOP',
        'CUP': 'CUP', 'HTG': 'HTG', 'JMD': 'JMD', 'TTD': 'TTD',
        'BBD': 'BBD', 'BSD': 'BSD', 'BZD': 'BZD', 'XCD': 'XCD',
        'SRD': 'SRD', 'GYD': 'GYD', 'NZD': 'NZD',
        'INR': 'INR', 'PKR': 'PKR', 'BDT': 'BDT', 'LKR': 'LKR',
        'NPR': 'NPR', 'BTN': 'BTN', 'MMK': 'MMK', 'THB': 'THB',
        'VND': 'VND', 'PHP': 'PHP', 'IDR': 'IDR', 'MYR': 'MYR',
        'SGD': 'SGD', 'HKD': 'HKD', 'TWD': 'TWD', 'MOP': 'MOP',
        'KRW': 'KRW', 'KHR': 'KHR', 'LAK': 'LAK', 'BND': 'BND',
        'MVR': 'MVR', 'MNT': 'MNT', 'KZT': 'KZT', 'UZS': 'UZS',
        'SAR': 'SAR', 'AED': 'AED', 'QAR': 'QAR', 'KWD': 'KWD',
        'BHD': 'BHD', 'OMR': 'OMR', 'JOD': 'JOD', 'LBP': 'LBP',
        'ILS': 'ILS', 'IQD': 'IQD', 'SYP': 'SYP', 'YER': 'YER',
        'IRR': 'IRR', 'AFN': 'AFN',
        'ETB': 'ETB', 'UGX': 'UGX', 'TZS': 'TZS', 'RWF': 'RWF',
        'BIF': 'BIF', 'CDF': 'CDF', 'AOA': 'AOA', 'MZN': 'MZN',
        'ZMW': 'ZMW', 'ZWL': 'ZWL', 'BWP': 'BWP', 'NAD': 'NAD',
        'SZL': 'SZL', 'LSL': 'LSL', 'MWK': 'MWK', 'MGA': 'MGA',
        'MUR': 'MUR', 'SCR': 'SCR', 'KMF': 'KMF', 'DJF': 'DJF',
        'SOS': 'SOS', 'SDG': 'SDG', 'LYD': 'LYD', 'MRU': 'MRU',
        'GMD': 'GMD', 'GNF': 'GNF', 'SLE': 'SLE', 'LRD': 'LRD',
        'CVE': 'CVE', 'STN': 'STN', 'ERN': 'ERN', 'SSP': 'SSP',
        'DZD': 'DZD', 'TND': 'TND', 'EGP': 'EGP',
        'FJD': 'FJD', 'PGK': 'PGK', 'WST': 'WST', 'TOP': 'TOP',
        'VUV': 'VUV', 'SBD': 'SBD', 'XPF': 'XPF'
    };
    return map[symbol] || symbol;
}

// ---------- COULEUR DYNAMIQUE ----------
function applyClientColor(color) {
    if (!color) color = '#ff7a00';
    document.getElementById('app-screen')?.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-color-light', lightenColor(color, 15));
    document.documentElement.style.setProperty('--primary-color-dark', darkenColor(color, 15));
    document.documentElement.style.setProperty('--primary-color-soft', hexToRgba(color, 0.1));

    if (appState.client?.bigCardColor) {
        document.documentElement.style.setProperty('--big-card-color', appState.client.bigCardColor);
        
        let textColor = '#111111';
        if (appState.client.bigCardTextColor) {
            textColor = appState.client.bigCardTextColor;
        } else {
            const hex = appState.client.bigCardColor.replace('#', '');
            if (hex.length === 6) {
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                textColor = (yiq >= 128) ? '#111111' : '#ffffff';
            }
        }
        document.documentElement.style.setProperty('--big-card-text-color', textColor);
    } else {
        document.documentElement.style.setProperty('--big-card-color', 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)');
        document.documentElement.style.setProperty('--big-card-text-color', '#111111');
    }
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

function showConfirmModal({ title = '', message = '', confirmText = '', cancelText = '', type = 'danger' }) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-modal');
        const titleEl = document.getElementById('confirm-title');
        const msgEl = document.getElementById('confirm-message');
        const btnOk = document.getElementById('confirm-btn-ok');
        const btnCancel = document.getElementById('confirm-btn-cancel');

        titleEl.textContent = title || t('confirm_title_warning');
        msgEl.textContent = message;
        btnOk.textContent = confirmText || t('confirm_btn_ok');
        btnCancel.textContent = cancelText || t('confirm_btn_cancel');

        const newBtnOk = btnOk.cloneNode(true);
        const newBtnCancel = btnCancel.cloneNode(true);
        btnOk.parentNode.replaceChild(newBtnOk, btnOk);
        btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

        if (type === 'primary') {
            newBtnOk.style.backgroundColor = 'var(--primary-color)';
        } else {
            newBtnOk.style.backgroundColor = '#e02424';
        }

        const close = (result) => {
            modal.classList.remove('show');
            resolve(result);
        };

        newBtnOk.addEventListener('click', () => close(true));
        newBtnCancel.addEventListener('click', () => close(false));

        modal.classList.add('show');
    });
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
// TRACKING DE CONNEXION (APPAREIL + LOCALISATION)
// ============================================================
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let os = "Inconnu";
    let browser = "Inconnu";

    if (/windows/i.test(ua)) os = "Windows";
    else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
    else if (/android/i.test(ua)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
    else if (/linux/i.test(ua)) os = "Linux";

    if (/edg/i.test(ua)) browser = "Edge";
    else if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua)) browser = "Safari";
    else if (/opr|opera/i.test(ua)) browser = "Opera";

    const screenInfo = `${window.screen.width}x${window.screen.height}`;
    return `${os} • ${browser} • ${screenInfo}`;
}

function getDeviceId() {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
        id = 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
}

async function getLocationInfo() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        return {
            country: data.country_name || "Inconnu",
            city: data.city || "Inconnue",
            ip: data.ip || "Inconnue"
        };
    } catch (e) {
        try {
            const res = await fetch('https://ipinfo.io/json');
            const data = await res.json();
            return {
                country: data.country || "Inconnu",
                city: data.city || "Inconnue",
                ip: data.ip || "Inconnue"
            };
        } catch (err) {
            return { country: "Inconnu", city: "Inconnue", ip: "Inconnue" };
        }
    }
}

async function trackConnection() {
    if (!appState.client || !appState.clientId) return;

    const deviceId = getDeviceId();
    const deviceInfo = getDeviceInfo();
    const location = await getLocationInfo();
    const now = new Date().toISOString();

    const logs = appState.client.connectionLogs || [];
    const existingDeviceIndex = logs.findIndex(l => l.deviceId === deviceId);

    if (existingDeviceIndex !== -1) {
        logs[existingDeviceIndex].lastSeen = now;
        logs[existingDeviceIndex].country = location.country;
        logs[existingDeviceIndex].city = location.city;
        logs[existingDeviceIndex].ip = location.ip;
    } else {
        logs.push({
            deviceId,
            deviceInfo,
            country: location.country,
            city: location.city,
            ip: location.ip,
            firstSeen: now,
            lastSeen: now
        });
    }

    appState.client.connectionLogs = logs;
    appState.client.lastKnownLocation = location;

    try {
        await updateDoc(doc(db, 'clients', appState.clientId), {
            connectionLogs: logs,
            lastKnownLocation: location
        });

        sendAdminConnectionAlert(appState.client, {
            deviceInfo,
            country: location.country,
            city: location.city,
            date: new Date().toLocaleString('fr-FR')
        }).catch(e => console.warn('Email admin connexion non envoyé', e));

        console.log('✅ Connexion trackée:', location, deviceInfo);
    } catch (err) {
        console.error('Erreur tracking connexion:', err);
    }
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
        if (badgeText) badgeText.textContent = `${client.firstName} ${client.lastName}`;

        const emailInput = document.getElementById('login-email');
        if (emailInput) emailInput.value = '';

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

    trackConnection();
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
async function handleLogout() {
    const isConfirmed = await showConfirmModal({
        title: t('logout'),
        message: 'Voulez-vous vraiment vous déconnecter de votre espace client ?',
        confirmText: t('logout'),
        type: 'primary'
    });
    
    if (!isConfirmed) return;

    if (appState.unsubSnapshot) {
        appState.unsubSnapshot();
        appState.unsubSnapshot = null;
    }

    clearSession();
    showScreen('login-screen');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').textContent = '';
    
    const emailInput = document.getElementById('login-email');
    if (emailInput) emailInput.value = '';

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
    pending: 'tpl-success', 
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
            const isTransferFlow = ['transfer', 'verification', 'progress', 'success', 'failed', 'pending'].includes(viewName);
            
            if (isTransferFlow) {
                li.classList.toggle('active', li.dataset.view === 'transfer');
            } else {
                li.classList.toggle('active', li.dataset.view === viewName);
            }
        });

        applyLanguage();

        if (viewName === 'dashboard') renderDashboard();
        if (viewName === 'transfer') renderTransferView();
        if (viewName === 'verification') renderVerificationView(data);
        if (viewName === 'progress') renderProgressView(data);
        if (viewName === 'success') renderSuccessView(data);
        if (viewName === 'failed') renderFailedView(data);
        if (viewName === 'pending') renderPendingView(data); 
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
// ICÔNE DE TRANSACTION
// ============================================================
function buildTransactionIcon(tx) {
    const isDebit = tx.amount < 0;
    const isPending = tx.status === 'pending';
    const isCancelled = tx.status === 'cancelled';
    const isFailed = tx.status === 'failed';

    if (isPending) {
        return `
            <div class="tx-icon orange">
                <i class="fa-solid fa-clock"></i>
            </div>
        `;
    }

    if (isCancelled) {
        return `
            <div class="tx-icon blue">
                <i class="fa-solid fa-rotate-left"></i>
            </div>
        `;
    }

    if (isFailed) {
        return `
            <div class="tx-icon red">
                <i class="fa-solid fa-ban"></i>
            </div>
        `;
    }

    if (tx.bankDomain && !isDebit) { 
        const urls = getBankLogoUrls(tx.bankDomain);
        const urlsJson = JSON.stringify(urls).replace(/"/g, '&quot;');

        return `
            <div class="tx-icon-bank" data-urls='${urlsJson}' data-idx="0">
                <img src="${urls[0]}" alt="${tx.bankName || 'Bank'}" loading="lazy" onerror="handleBankLogoError(this);">
            </div>
        `;
    }

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
// VUE : DASHBOARD
// ============================================================
function renderDashboard() {
    document.getElementById('balance-display').textContent = formatMoney(appState.balance);

    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName && appState.client) {
        welcomeName.textContent = `${appState.client.firstName} ${appState.client.lastName}`;
    }

    const statBalance = document.getElementById('stat-balance');
    const statTx = document.getElementById('stat-transactions');
    const statCurr = document.getElementById('stat-currency');
    if (statBalance) statBalance.textContent = formatMoney(appState.balance);
    if (statTx) statTx.textContent = (appState.transactions || []).length;
    if (statCurr) statCurr.textContent = getCurrencyCode(appState.currency);

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
            const isPending = tx.status === 'pending';
            const isCancelled = tx.status === 'cancelled';
            const isFailed = tx.status === 'failed';
            
            const timePart = (tx.date || '').split(' • ')[1] || '';
            
            let txLabel = isDebit ? t('transfer_sent') : t('transfer_received');
            let statusLabel = t('completed');
            let amountColor = isDebit ? '#e02424' : '#00a04a';
            let statusColor = isDebit ? '#c0392b' : '#00a04a';
            let bgColor = isDebit ? 'rgba(224, 36, 36, 0.06)' : 'rgba(0, 200, 83, 0.06)';

            if (isPending) {
                txLabel = t('transfer_pending');
                statusLabel = t('pending_status');
                amountColor = '#d97706';
                statusColor = '#d97706';
                bgColor = 'rgba(245, 158, 11, 0.06)';
            } else if (isCancelled) {
                txLabel = t('transfer_cancelled');
                statusLabel = t('cancelled_status');
                amountColor = '#3b82f6';
                statusColor = '#3b82f6';
                bgColor = 'rgba(59, 130, 246, 0.06)';
            } else if (isFailed) {
                txLabel = t('transfer_failed');
                statusLabel = t('failed_status');
                amountColor = '#e02424';
                statusColor = '#e02424';
                bgColor = 'rgba(239, 68, 68, 0.06)';
            }

            const displaySubtitle = tx.bankName || tx.title || '';

            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.style.background = `linear-gradient(90deg, ${bgColor} 0%, transparent 100%)`;
            
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
                    <div class="tx-amount" style="color: ${amountColor};">
                        ${isDebit ? '−' : '+'}${formatMoney(Math.abs(tx.amount))}
                    </div>
                    <div class="tx-status" style="color: ${statusColor};">
                        ${statusLabel}
                    </div>
                </div>
            `;
            
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

async function cancelTransfer() {
    const isConfirmed = await showConfirmModal({
        title: t('cancel_transfer'),
        message: 'Voulez-vous vraiment annuler ce virement en cours ?',
        confirmText: t('cancel_transfer'),
        type: 'danger'
    });

    if (!isConfirmed) return;

    appState.pendingTransfer = null;
    navigateTo('dashboard');
    showToast(t('transfer_cancelled_toast'), 'info');
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

    const isPendingEnabled = appState.client?.pendingTransferEnabled === true;
    const percentLimit = Number(appState.client?.percentValue ?? 100);
    const targetProgress = isPendingEnabled ? 100 : Math.min(100, Math.max(0, percentLimit));

    let progress = 0;
    const fill = document.getElementById('progress-fill');
    fill.style.width = '0%';
    fill.textContent = '0%';

    const interval = setInterval(() => {
        progress += 1;
        
        if (progress >= targetProgress) {
            progress = targetProgress;
            fill.style.width = progress + '%';
            fill.textContent = progress + '%';
            clearInterval(interval);
            
            setTimeout(() => {
                if (targetProgress >= 100) {
                    if (isPendingEnabled) {
                        finalizePendingTransfer(); 
                    } else {
                        finalizeTransfer(); 
                    }
                } else {
                    finalizeFailedTransfer(); 
                }
            }, 1500);
        } else {
            fill.style.width = progress + '%';
            fill.textContent = progress + '%';
        }
    }, 60); 
}

// ============================================================
// FINALISATION DU VIREMENT (SUCCÈS 100%)
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
        amount: -tr.amount,
        bankName: tr.bank,
        iban: tr.iban,
        bic: tr.bic,
        reason: tr.reason,
        status: 'completed'
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
        }).catch(e => console.warn('Email confirmation erreur', e));

    } catch (err) {
        console.error('Erreur sauvegarde virement :', err);
    }

    navigateTo('success', {
        amount: tr.amount,
        beneficiary: tr.beneficiary,
        date: dateStr,
        reference: ref,
        bank: tr.bank,
        iban: tr.iban,
        bic: tr.bic,
        reason: tr.reason
    });

    showToast(t('transfer_finalized'), 'success');
    appState.pendingTransfer = null;
}

// ============================================================
// FINALISATION DU VIREMENT (EN ATTENTE)
// ============================================================
async function finalizePendingTransfer() {
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
        amount: -tr.amount,
        bankName: tr.bank,
        iban: tr.iban,
        bic: tr.bic,
        reason: tr.reason,
        status: 'pending' 
    });

    const ref = 'AP' + Date.now().toString().slice(-8);

    try {
        await authPromise;
        await updateDoc(doc(db, 'clients', appState.clientId), {
            balance: appState.balance,
            transactions: appState.transactions
        });

        sendPendingTransferNotification(appState.client, {
            amount: tr.amount,
            beneficiary: tr.beneficiary,
            date: dateStr,
            reference: ref,
            iban: tr.iban
        }).catch(e => console.warn('Email attente erreur', e));

    } catch (err) {
        console.error('Erreur sauvegarde virement en attente :', err);
    }

    navigateTo('pending', {
        amount: tr.amount,
        beneficiary: tr.beneficiary,
        date: dateStr,
        reference: ref,
        bank: tr.bank,
        iban: tr.iban,
        bic: tr.bic,
        reason: tr.reason
    });

    showToast(t('transfer_pending'), 'info');
    appState.pendingTransfer = null;
}

// ============================================================
// FINALISATION DU VIREMENT (ÉCHEC < 100%)
// ============================================================
function finalizeFailedTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' +
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const ref = 'AP' + Date.now().toString().slice(-8);

    const percentLimit = Number(appState.client?.percentValue ?? 100);
    const maxAllowed = appState.balance * (percentLimit / 100);

    sendTransferFailed(appState.client, { amount: tr.amount, limit: maxAllowed })
        .catch(e => console.warn('Email échec erreur', e));

    navigateTo('failed', {
        amount: tr.amount,
        beneficiary: tr.beneficiary,
        bank: tr.bank,
        iban: tr.iban,
        bic: tr.bic,
        reason: tr.reason,
        date: dateStr,
        reference: ref
    });

    showToast(t('transfer_failed'), 'error');
    appState.pendingTransfer = null;
}

// ============================================================
// VUE : SUCCÈS (REÇU VERT)
// ============================================================
function renderSuccessView(data) {
    document.getElementById('sf-amount').textContent = formatMoney(data.amount);
    document.getElementById('sf-beneficiary').textContent = data.beneficiary || '—';
    document.getElementById('sf-bank').textContent = data.bank || '—';
    document.getElementById('sf-iban').textContent = data.iban || '—';
    document.getElementById('sf-bic').textContent = data.bic || '—';
    document.getElementById('sf-reason').textContent = data.reason || '—';
    document.getElementById('sf-date').textContent = data.date;
    document.getElementById('sf-ref').textContent = data.reference;

    const customMsg = appState.client?.messageAfterTransfer;
    const msgEl = document.getElementById('sf-custom-message');
    if (msgEl && customMsg) {
        msgEl.textContent = customMsg;
    }
}

// ============================================================
// VUE : EN ATTENTE (REÇU ORANGE)
// ============================================================
function renderPendingView(data) {
    const headerIcon = document.querySelector('.success-icon-circle');
    if (headerIcon) {
        headerIcon.style.backgroundColor = '#f59e0b';
        headerIcon.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
        headerIcon.innerHTML = '<i class="fa-solid fa-clock"></i>';
    }

    const mainTitle = document.querySelector('.success-main-title');
    if (mainTitle) {
        mainTitle.textContent = t('transfer_pending');
        mainTitle.style.color = '#b45309';
    }

    const subtitle = document.querySelector('.success-subtitle');
    if (subtitle) {
        subtitle.textContent = t('pending_subtitle');
    }

    const amountCard = document.querySelector('.success-amount-card');
    if (amountCard) {
        amountCard.style.backgroundColor = '#fffbeb';
    }
    
    const amountIcon = document.querySelector('.success-amount-icon');
    if (amountIcon) {
        amountIcon.style.backgroundColor = '#fef3c7';
        amountIcon.style.color = '#d97706';
        amountIcon.innerHTML = '<i class="fa-solid fa-hourglass-half"></i>';
    }

    const amountLabel = document.querySelector('.success-amount-label');
    if (amountLabel) amountLabel.style.color = '#92400e';

    const amountValue = document.querySelector('.success-amount-value');
    if (amountValue) amountValue.style.color = '#78350f';

    const statusCard = document.querySelector('.success-status-card');
    if (statusCard) {
        statusCard.style.backgroundColor = '#fffbeb';
        statusCard.style.border = '1px solid #fde68a';
    }

    const ssTextStrong = document.querySelector('.ss-text strong');
    if (ssTextStrong) {
        ssTextStrong.textContent = t('pending_status');
        ssTextStrong.style.color = '#92400e';
    }
    
    const ssTextSmall = document.querySelector('.ss-text small');
    if (ssTextSmall) {
        ssTextSmall.textContent = t('pending_status');
        ssTextSmall.style.color = '#b45309';
    }

    document.getElementById('sf-amount').textContent = formatMoney(data.amount);
    document.getElementById('sf-beneficiary').textContent = data.beneficiary || '—';
    document.getElementById('sf-bank').textContent = data.bank || '—';
    document.getElementById('sf-iban').textContent = data.iban || '—';
    document.getElementById('sf-bic').textContent = data.bic || '—';
    document.getElementById('sf-reason').textContent = data.reason || '—';
    document.getElementById('sf-date').textContent = data.date;
    document.getElementById('sf-ref').textContent = data.reference;
}

// ============================================================
// VUE : ÉCHEC (REÇU ROUGE)
// ============================================================
function renderFailedView(data) {
    const d = data || {};
    document.getElementById('ff-amount').textContent = formatMoney(d.amount || 0);
    document.getElementById('ff-beneficiary').textContent = d.beneficiary || '—';
    document.getElementById('ff-bank').textContent = d.bank || '—';
    document.getElementById('ff-iban').textContent = d.iban || '—';
    document.getElementById('ff-bic').textContent = d.bic || '—';
    document.getElementById('ff-reason').textContent = d.reason || '—';
    document.getElementById('ff-date').textContent = d.date || '—';
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

    const fullName = `${c.firstName} ${c.lastName}`;
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
// REÇU PDF (MODALE HISTORIQUE)
// ============================================================
window.openReceipt = function(tx) {
    if (!tx) return;

    const isDebit = tx.amount < 0;
    const isPending = tx.status === 'pending';
    const isCancelled = tx.status === 'cancelled';
    const isFailed = tx.status === 'failed';
    
    const dateStr = tx.date || '--';
    
    let typeStr = isDebit ? t('transfer_sent') : t('transfer_received');
    if (isPending) typeStr = t('transfer_pending');
    if (isCancelled) typeStr = t('transfer_cancelled');
    if (isFailed) typeStr = t('transfer_failed');
    
    const refStr = 'REF-' + (tx.date ? tx.date.replace(/\D/g,'').slice(-8) : Date.now().toString().slice(-8));
    
    const partyLabelKey = isDebit ? 'beneficiary' : 'receipt_sender';
    const partyName = tx.title || '--';
    
    let bankName = tx.bankName || 'APP PAY';
    let iban = tx.iban || '';
    
    if (!isDebit && !tx.bankName) {
        bankName = 'APP PAY';
    }

    document.getElementById('rcpt-date').textContent = dateStr;
    document.getElementById('rcpt-type').textContent = typeStr;
    document.getElementById('rcpt-ref').textContent = refStr;
    
    const partyLabelEl = document.getElementById('rcpt-party-label');
    partyLabelEl.setAttribute('data-i18n', partyLabelKey);
    
    document.getElementById('rcpt-party').textContent = partyName;
    document.getElementById('rcpt-bank').textContent = bankName;
    
    const ibanRow = document.getElementById('rcpt-iban-row');
    const ibanEl = document.getElementById('rcpt-iban');
    
    if (isDebit && iban) {
        ibanRow.style.display = 'flex';
        ibanEl.textContent = iban;
    } else {
        ibanRow.style.display = 'none';
    }
    
    const amountEl = document.getElementById('rcpt-amount');
    amountEl.textContent = (isDebit ? '-' : '+') + formatMoney(Math.abs(tx.amount));
    
    let amountColor = '#e02424';
    let statusColor = '#00a04a';
    let statusKey = 'completed';

    if (isPending) {
        amountColor = '#d97706';
        statusColor = '#d97706';
        statusKey = 'pending_status';
    } else if (isCancelled) {
        amountColor = '#3b82f6';
        statusColor = '#3b82f6';
        statusKey = 'cancelled_status';
    } else if (isFailed) {
        amountColor = '#e02424';
        statusColor = '#e02424';
        statusKey = 'failed_status';
    } else if (!isDebit) {
        amountColor = '#00a04a';
    }
    
    amountEl.style.color = amountColor;
    
    const statusEl = document.getElementById('rcpt-status');
    statusEl.setAttribute('data-i18n', statusKey);
    statusEl.style.color = statusColor;

    applyLanguage();

    document.getElementById('receipt-modal').classList.add('show');
};

window.closeReceipt = function() {
    document.getElementById('receipt-modal').classList.remove('show');
};

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
