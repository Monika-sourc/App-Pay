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

// 🆕 IMPORTATION DES 105 NOUVELLES LANGUES
import { EXTRA_TRANSLATIONS } from './i18n/translations.js';

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

const SESSION_KEY = 'apppay_session_v2';
const DEVICE_ID_KEY = 'apppay_device_id';

const TRANSLATIONS = {
    fr: {
        dashboard: "Portefeuille", personal_iban: "IBAN Personnel", logout: "Déconnexion", profile: "Profil",
        transfer_menu: "Virement", transfer_btn: "Effectuer un virement", virtual_card_btn: "Carte virtuelle",
        available_balance: "Solde disponible", account_subtitle: "Compte pour tous vos besoins", see_iban: "Voir mon IBAN",
        make_transfer: "Effectuer un virement", see_card: "Carte virtuelle", international_transfer: "Effectuer un virement international",
        transfer_warning: "Le traitement du transfert prend de 1 à 3 minutes après la vérification finale.",
        transactions_history: "Historique des transactions", total_balance: "Solde total", transactions_label: "Transactions",
        currency_label: "Devise", view_all: "Voir tout", today: "Aujourd'hui", yesterday: "Hier",
        transfer_received: "Virement reçu", transfer_sent: "Virement envoyé", completed: "Réalisé",
        amount: "Montant du virement", beneficiary_name: "Nom du bénéficiaire", iban: "IBAN / Numéro de Compte",
        bic: "Code Banque (BIC / SWIFT)", bank_name: "Nom de la Banque", reason: "Raison du virement",
        continue: "Continuer", identity_verification: "Vérification d'identité", pending_transfer_details: "Détails du virement en attente",
        cancel_transfer: "Annuler le virement", enter_activation_code: "Veuillez saisir le code d'activation du virement",
        activation_code: "Code d'activation", validate_transfer: "Validé le virement",
        transfer_in_progress: "Votre ordre de virement en cours...", identity_verified: "Vérification d'identité effectuée avec succès.",
        progress_desc: "Veuillez patienter la fin du virement des fonds vers votre banque avant d'actualiser cette page.",
        progress_details_title: "Détails du virement en cours", personal_info: "Informations personnelles",
        account_details: "Détails du compte", operation_secured: "Votre opération est sécurisée et enregistrée.",
        no_amount_debited: "Aucun montant n'a été débité de votre compte.", download_receipt: "Télécharger le reçu",
        receipt_thank_you_1: "Merci d'avoir utilisé APP PAY.", receipt_thank_you_2: "Ce reçu est généré automatiquement.",
        transfer_success: "Virement effectué avec succès", receipt_subtitle: "REÇU DE VIREMENT", validated_status: "Virement confirmé",
        success_subtitle: "Votre virement a été bien enregistré et sera traité par la banque du bénéficiaire.",
        transfer_pending: "Virement en attente", pending_subtitle: "Votre virement a bien été enregistré et est en attente de validation par notre service administratif.",
        pending_status: "En attente", transfer_failed: "Virement bloqué",
        transfer_failed_subtitle: "Votre virement a été bloqué par le système. Le compte bancaire du bénéficiaire n'a pas été reconnu. Veuillez contacter le service client pour plus d'informations.",
        failed_status: "Bloqué", transfer_cancelled: "Virement annulé", cancelled_status: "Annulé", refunded_amount: "Montant recrédité",
        amount_sent: "MONTANT ENVOYÉ", beneficiary: "Bénéficiaire", date: "Date", reference: "Référence",
        back_to_dashboard: "Retour au tableau de bord", my_virtual_card: "Carte virtuelle", holder: "Titulaire",
        expires: "Expire", show_details: "Afficher les détails", hide_details: "Masquer les détails", freeze_card: "Geler la carte",
        settings: "Paramètres", monthly_limit: "Plafond mensuel", monthly_spent: "Dépenses du mois", status: "Statut",
        active: "Active", type: "Type", verified: "Vérifié", account_holder_premium: "Titulaire du compte • Client Premium",
        full_name: "Nom complet", email_address: "Adresse e-mail", phone_number: "Numéro de téléphone",
        country: "Pays de résidence", account_id: "Identifiant unique", opening_date: "Date d'ouverture",
        edit_profile: "Modifier le profil", security: "Sécurité", notifications: "Notifications",
        no_transactions: "Aucune transaction pour le moment", err_email: "Adresse e-mail incorrecte.",
        err_pin: "Code PIN incorrect.", err_amount: "Montant invalide.", err_balance: "Solde insuffisant.",
        err_fields: "Veuillez remplir tous les champs.", err_activation: "Code d'activation incorrect.",
        err_percent: "Le montant dépasse la limite autorisée ({limit}).", err_client_not_found: "Client introuvable. Lien invalide.",
        err_no_link: "Aucun lien fourni. Accès refusé.", welcome: "Bienvenue", login_success: "Connexion réussie. Bienvenue !",
        transfer_cancelled_toast: "Virement annulé.", transfer_finalized: "Virement finalisé avec succès !",
        err_card_locked: "L'affichage des détails de la carte n'est pas autorisé par l'administrateur.",
        err_iban_locked: "L'affichage de l'IBAN complet n'est pas autorisé par l'administrateur.",
        iban_copied: "IBAN copié !", swift_copied: "Code SWIFT copié !", placeholder_email: "Votre adresse e-mail",
        placeholder_pin: "Votre code PIN", placeholder_activation: "Entrez votre code secret",
        card_footer: "Cette carte est la propriété exclusive d'APP PAY. Toute utilisation frauduleuse sera poursuivie.",
        card_security_note: "Les 4 derniers chiffres et le CVV ont été masqués pour des raisons de sécurité.",
        visa_premium: "Mastercard Premium", bank_details: "Coordonnées bancaires", iban_number: "Numéro IBAN",
        swift_code: "Code SWIFT / BIC", iban_info_note: "Utilisez ces coordonnées pour recevoir des virements. Les 4 derniers chiffres de l'IBAN sont masqués pour des raisons de sécurité.",
        show_iban: "Afficher l'IBAN complet", hide_iban: "Masquer l'IBAN", allowed_limit: "Limite autorisée :",
        limit_percentage: "Pourcentage limite :", current_balance: "Solde actuel :", attempted_amount: "MONTANT TENTÉ",
        new_transaction_received: "Nouvelle transaction reçue !", copied: "Copié !",
        tap_to_flip: "Appuyez sur la carte pour la retourner", view_full_card: "Voir le numéro complet",
        flip_card: "Retourner la carte", view_cvv: "Voir le code CVV", receipt_title: "REÇU DE TRANSACTION",
        receipt_sender: "Émetteur", receipt_thank_you: "Merci d'avoir utilisé APP PAY. Ce reçu est généré automatiquement.",
        close: "Fermer", confirm_title_warning: "Attention", confirm_btn_cancel: "Annuler", confirm_btn_ok: "Confirmer"
    },
    en: {
        dashboard: "Wallet", personal_iban: "Personal IBAN", logout: "Logout", profile: "Profile",
        transfer_menu: "Transfer", transfer_btn: "Make a transfer", virtual_card_btn: "Virtual Card",
        available_balance: "Available balance", account_subtitle: "Account for all your needs", see_iban: "See my IBAN",
        make_transfer: "Make a transfer", see_card: "Virtual Card", international_transfer: "Make an international transfer",
        transfer_warning: "Transfer processing takes 1 to 3 minutes after final verification.",
        transactions_history: "Transaction history", total_balance: "Total balance", transactions_label: "Transactions",
        currency_label: "Currency", view_all: "View all", today: "Today", yesterday: "Yesterday",
        transfer_received: "Transfer received", transfer_sent: "Transfer sent", completed: "Completed",
        amount: "Transfer amount", beneficiary_name: "Beneficiary name", iban: "IBAN / Account number",
        bic: "Bank code (BIC / SWIFT)", bank_name: "Bank name", reason: "Transfer reason",
        continue: "Continue", identity_verification: "Identity verification", pending_transfer_details: "Pending transfer details",
        cancel_transfer: "Cancel transfer", enter_activation_code: "Please enter the transfer activation code",
        activation_code: "Activation code", validate_transfer: "Validate transfer",
        transfer_in_progress: "Your transfer is in progress...", identity_verified: "Identity verification successful.",
        progress_desc: "Please wait for the funds to reach your bank before refreshing this page.",
        progress_details_title: "Transfer details in progress", personal_info: "Personal information",
        account_details: "Account details", operation_secured: "Your operation is secured and registered.",
        no_amount_debited: "No amount has been debited from your account.", download_receipt: "Download receipt",
        receipt_thank_you_1: "Thank you for using APP PAY.", receipt_thank_you_2: "This receipt is generated automatically.",
        transfer_success: "Transfer completed successfully", receipt_subtitle: "TRANSFER RECEIPT", validated_status: "Transfer confirmed",
        success_subtitle: "Your transfer has been registered and will be processed by the beneficiary's bank.",
        transfer_pending: "Pending transfer", pending_subtitle: "Your transfer has been registered and is pending validation by our administrative service.",
        pending_status: "Pending", transfer_failed: "Transfer blocked",
        transfer_failed_subtitle: "Your transfer was blocked by the system. The beneficiary's bank account was not recognized. Please contact customer service for more information.",
        failed_status: "Blocked", transfer_cancelled: "Transfer cancelled", cancelled_status: "Cancelled", refunded_amount: "Refunded amount",
        amount_sent: "AMOUNT SENT", beneficiary: "Beneficiary", date: "Date", reference: "Reference",
        back_to_dashboard: "Back to dashboard", my_virtual_card: "Virtual Card", holder: "Holder",
        expires: "Expires", show_details: "Show details", hide_details: "Hide details", freeze_card: "Freeze card",
        settings: "Settings", monthly_limit: "Monthly limit", monthly_spent: "Monthly spent", status: "Status",
        active: "Active", type: "Type", verified: "Verified", account_holder_premium: "Account holder • Premium Client",
        full_name: "Full name", email_address: "Email address", phone_number: "Phone number",
        country: "Country of residence", account_id: "Unique ID", opening_date: "Opening date",
        edit_profile: "Edit profile", security: "Security", notifications: "Notifications",
        no_transactions: "No transactions yet", err_email: "Incorrect email address.",
        err_pin: "Incorrect PIN code.", err_amount: "Invalid amount.", err_balance: "Insufficient balance.",
        err_fields: "Please fill in all fields.", err_activation: "Incorrect activation code.",
        err_percent: "Amount exceeds allowed limit ({limit}).", err_client_not_found: "Client not found. Invalid link.",
        err_no_link: "No link provided. Access denied.", welcome: "Welcome", login_success: "Login successful. Welcome!",
        transfer_cancelled_toast: "Transfer cancelled.", transfer_finalized: "Transfer completed successfully!",
        err_card_locked: "Card details display is not authorized by the administrator.",
        err_iban_locked: "IBAN display is not authorized by the administrator.",
        iban_copied: "IBAN copied!", swift_copied: "SWIFT code copied!", placeholder_email: "Your email address",
        placeholder_pin: "Your PIN code", placeholder_activation: "Enter your secret code",
        card_footer: "This card is the exclusive property of APP PAY. Any fraudulent use will be prosecuted.",
        card_security_note: "The last 4 digits and CVV have been masked for security reasons.",
        visa_premium: "Mastercard Premium", bank_details: "Bank details", iban_number: "IBAN number",
        swift_code: "SWIFT / BIC code", iban_info_note: "Use these details to receive transfers. The last 4 digits of the IBAN are masked for security reasons.",
        show_iban: "Show full IBAN", hide_iban: "Hide IBAN", allowed_limit: "Allowed limit:",
        limit_percentage: "Limit percentage:", current_balance: "Current balance:", attempted_amount: "ATTEMPTED AMOUNT",
        new_transaction_received: "New transaction received!", copied: "Copied!",
        tap_to_flip: "Tap the card to flip", view_full_card: "View full number",
        flip_card: "Flip card", view_cvv: "View CVV code", receipt_title: "TRANSACTION RECEIPT",
        receipt_sender: "Sender", receipt_thank_you: "Thank you for using APP PAY. This receipt is generated automatically.",
        close: "Close", confirm_title_warning: "Warning", confirm_btn_cancel: "Cancel", confirm_btn_ok: "Confirm"
    },
    es: {
        dashboard: "Cartera", personal_iban: "IBAN Personal", logout: "Cerrar sesión", profile: "Perfil",
        transfer_menu: "Transferencia", transfer_btn: "Hacer una transferencia", virtual_card_btn: "Tarjeta virtual",
        available_balance: "Saldo disponible", account_subtitle: "Cuenta para todas tus necesidades", see_iban: "Ver mi IBAN",
        make_transfer: "Hacer una transferencia", see_card: "Tarjeta virtual", international_transfer: "Hacer una transferencia internacional",
        transfer_warning: "El procesamiento de la transferencia tarda de 1 a 3 minutos después de la verificación final.",
        transactions_history: "Historial de transacciones", total_balance: "Saldo total", transactions_label: "Transacciones",
        currency_label: "Moneda", view_all: "Ver todo", today: "Hoy", yesterday: "Ayer",
        transfer_received: "Transferencia recibida", transfer_sent: "Transferencia enviada", completed: "Completado",
        amount: "Importe de la transferencia", beneficiary_name: "Nombre del beneficiario", iban: "IBAN / Número de cuenta",
        bic: "Código bancario (BIC / SWIFT)", bank_name: "Nombre del banco", reason: "Motivo de la transferencia",
        continue: "Continuar", identity_verification: "Verificación de identidad", pending_transfer_details: "Detalles de la transferencia pendiente",
        cancel_transfer: "Cancelar transferencia", enter_activation_code: "Introduzca el código de activación",
        activation_code: "Código de activación", validate_transfer: "Validar transferencia",
        transfer_in_progress: "Su transferencia está en curso...", identity_verified: "Verificación de identidad exitosa.",
        progress_desc: "Espere a que los fondos lleguen a su banco antes de actualizar.",
        progress_details_title: "Detalles de la transferencia en curso", personal_info: "Información personal",
        account_details: "Detalles de la cuenta", operation_secured: "Su operación está segura y registrada.",
        no_amount_debited: "No se ha debitado ningún importe de su cuenta.", download_receipt: "Descargar recibo",
        receipt_thank_you_1: "Gracias por usar APP PAY.", receipt_thank_you_2: "Este recibo se genera automáticamente.",
        transfer_success: "Transferencia completada con éxito", receipt_subtitle: "RECIBO DE TRANSFERENCIA",
        validated_status: "Transferencia confirmada", success_subtitle: "Su transferencia ha sido registrada y será procesada por el banco del beneficiario.",
        transfer_pending: "Transferencia pendiente", pending_subtitle: "Su transferencia ha sido registrada y está pendiente de validación por nuestro servicio administrativo.",
        pending_status: "Pendiente", transfer_failed: "Transferencia bloqueada",
        transfer_failed_subtitle: "Su transferencia fue bloqueada por el sistema. La cuenta bancaria del beneficiario no fue reconocida. Por favor, contacte con el servicio al cliente para más información.",
        failed_status: "Bloqueado", transfer_cancelled: "Transferencia cancelada", cancelled_status: "Cancelado", refunded_amount: "Importe reembolsado",
        amount_sent: "IMPORTE ENVIADO", beneficiary: "Beneficiario", date: "Fecha", reference: "Referencia",
        back_to_dashboard: "Volver al panel", my_virtual_card: "Tarjeta virtual", holder: "Titular",
        expires: "Caduca", show_details: "Mostrar detalles", hide_details: "Ocultar detalles", freeze_card: "Congelar tarjeta",
        settings: "Ajustes", monthly_limit: "Límite mensual", monthly_spent: "Gastos del mes", status: "Estado",
        active: "Activa", type: "Tipo", verified: "Verificado", account_holder_premium: "Titular • Cliente Premium",
        full_name: "Nombre completo", email_address: "Correo electrónico", phone_number: "Número de teléfono",
        country: "País de residencia", account_id: "ID único", opening_date: "Fecha de apertura",
        edit_profile: "Editar perfil", security: "Seguridad", notifications: "Notificaciones",
        no_transactions: "Sin transacciones por ahora", err_email: "Correo electrónico incorrecto.",
        err_pin: "PIN incorrecto.", err_amount: "Importe inválido.", err_balance: "Saldo insuficiente.",
        err_fields: "Por favor, rellene todos los campos.", err_activation: "Código de activación incorrecto.",
        err_percent: "El importe supera el límite permitido ({limit}).", err_client_not_found: "Cliente no encontrado. Enlace inválido.",
        err_no_link: "Sin enlace. Acceso denegado.", welcome: "Bienvenido", login_success: "¡Inicio de sesión exitoso!",
        transfer_cancelled_toast: "Transferencia cancelada.", transfer_finalized: "¡Transferencia completada!",
        err_card_locked: "La visualización de los detalles de la tarjeta no está autorizada por el administrador.",
        err_iban_locked: "La visualización del IBAN no está autorizada por el administrador.",
        iban_copied: "¡IBAN copiado!", swift_copied: "¡Código SWIFT copiado!", placeholder_email: "Su correo electrónico",
        placeholder_pin: "Su código PIN", placeholder_activation: "Introduzca su código secreto",
        card_footer: "Esta tarjeta es propiedad exclusiva de APP PAY. Cualquier uso fraudulento será procesado.",
        card_security_note: "Los últimos 4 dígitos y el CVV se han ocultado por razones de seguridad.",
        visa_premium: "Mastercard Premium", bank_details: "Datos bancarios", iban_number: "Número IBAN",
        swift_code: "Código SWIFT / BIC", iban_info_note: "Utilice estos datos para recibir transferencias. Los últimos 4 dígitos del IBAN están ocultos.",
        show_iban: "Mostrar IBAN completo", hide_iban: "Ocultar IBAN", allowed_limit: "Límite permitido:",
        limit_percentage: "Porcentaje límite:", current_balance: "Saldo actual:", attempted_amount: "IMPORTE INTENTADO",
        new_transaction_received: "¡Nueva transacción recibida!", copied: "¡Copiado!",
        tap_to_flip: "Toca la tarjeta para voltearla", view_full_card: "Ver número completo",
        flip_card: "Voltear tarjeta", view_cvv: "Ver código CVV", receipt_title: "RECIBO DE TRANSACCIÓN",
        receipt_sender: "Remitente", receipt_thank_you: "Gracias por usar APP PAY. Este recibo se genera automáticamente.",
        close: "Cerrar", confirm_title_warning: "Atención", confirm_btn_cancel: "Cancelar", confirm_btn_ok: "Confirmar"
    },
    de: {
        dashboard: "Portemonnaie", personal_iban: "Persönliche IBAN", logout: "Abmelden", profile: "Profil",
        transfer_menu: "Überweisung", transfer_btn: "Überweisung durchführen", virtual_card_btn: "Virtuelle Karte",
        available_balance: "Verfügbares Guthaben", account_subtitle: "Konto für alle Ihre Bedürfnisse", see_iban: "IBAN anzeigen",
        make_transfer: "Überweisung durchführen", see_card: "Virtuelle Karte", international_transfer: "Internationale Überweisung durchführen",
        transfer_warning: "Die Bearbeitung dauert 1 bis 3 Minuten nach der letzten Überprüfung.",
        transactions_history: "Transaktionsverlauf", total_balance: "Gesamtguthaben", transactions_label: "Transaktionen",
        currency_label: "Währung", view_all: "Alle anzeigen", today: "Heute", yesterday: "Gestern",
        transfer_received: "Überweisung erhalten", transfer_sent: "Überweisung gesendet", completed: "Abgeschlossen",
        amount: "Überweisungsbetrag", beneficiary_name: "Name des Begünstigten", iban: "IBAN / Kontonummer",
        bic: "Bankleitzahl (BIC / SWIFT)", bank_name: "Bankname", reason: "Überweisungsgrund",
        continue: "Weiter", identity_verification: "Identitätsüberprüfung", pending_transfer_details: "Details der ausstehenden Überweisung",
        cancel_transfer: "Überweisung abbrechen", enter_activation_code: "Bitte geben Sie den Aktivierungscode ein",
        activation_code: "Aktivierungscode", validate_transfer: "Überweisung validieren",
        transfer_in_progress: "Ihre Überweisung wird bearbeitet...", identity_verified: "Identitätsprüfung erfolgreich.",
        progress_desc: "Bitte warten Sie, bis das Geld bei Ihrer Bank eingegangen ist.",
        progress_details_title: "Details der laufenden Überweisung", personal_info: "Persönliche Informationen",
        account_details: "Kontodetails", operation_secured: "Ihr Vorgang ist gesichert und registriert.",
        no_amount_debited: "Es wurde kein Betrag von Ihrem Konto abgebucht.", download_receipt: "Beleg herunterladen",
        receipt_thank_you_1: "Vielen Dank, dass Sie APP PAY nutzen.", receipt_thank_you_2: "Dieser Beleg wird automatisch generiert.",
        transfer_success: "Überweisung erfolgreich abgeschlossen", receipt_subtitle: "ÜBERWEISUNGSBELEG",
        validated_status: "Überweisung bestätigt", success_subtitle: "Ihre Überweisung wurde registriert und wird von der Bank des Begünstigten bearbeitet.",
        transfer_pending: "Überweisung ausstehend", pending_subtitle: "Ihre Überweisung wurde registriert und wartet auf die Validierung.",
        pending_status: "Ausstehend", transfer_failed: "Überweisung blockiert",
        transfer_failed_subtitle: "Ihre Überweisung wurde vom System blockiert. Bitte kontaktieren Sie den Kundendienst für weitere Informationen.",
        failed_status: "Blockiert", transfer_cancelled: "Überweisung storniert", cancelled_status: "Storniert", refunded_amount: "Erstatteter Betrag",
        amount_sent: "GESENDETER BETRAG", beneficiary: "Begünstigter", date: "Datum", reference: "Referenz",
        back_to_dashboard: "Zurück zum Dashboard", my_virtual_card: "Virtuelle Karte", holder: "Inhaber",
        expires: "Gültig bis", show_details: "Details anzeigen", hide_details: "Details verbergen", freeze_card: "Karte sperren",
        settings: "Einstellungen", monthly_limit: "Monatliches Limit", monthly_spent: "Diesen Monat ausgegeben", status: "Status",
        active: "Aktiv", type: "Typ", verified: "Verifiziert", account_holder_premium: "Kontoinhaber • Premium-Kunde",
        full_name: "Vollständiger Name", email_address: "E-Mail-Adresse", phone_number: "Telefonnummer",
        country: "Wohnsitzland", account_id: "Eindeutige ID", opening_date: "Eröffnungsdatum",
        edit_profile: "Profil bearbeiten", security: "Sicherheit", notifications: "Benachrichtigungen",
        no_transactions: "Noch keine Transaktionen", err_email: "Falsche E-Mail-Adresse.",
        err_pin: "Falscher PIN-Code.", err_amount: "Ungültiger Betrag.", err_balance: "Unzureichendes Guthaben.",
        err_fields: "Bitte alle Felder ausfüllen.", err_activation: "Falscher Aktivierungscode.",
        err_percent: "Betrag überschreitet das Limit ({limit}).", err_client_not_found: "Kunde nicht gefunden. Ungültiger Link.",
        err_no_link: "Kein Link. Zugriff verweigert.", welcome: "Willkommen", login_success: "Anmeldung erfolgreich. Willkommen!",
        transfer_cancelled_toast: "Überweisung storniert.", transfer_finalized: "Überweisung erfolgreich abgeschlossen!",
        err_card_locked: "Die Anzeige der Kartendetails ist nicht autorisiert.",
        err_iban_locked: "Die Anzeige der IBAN ist nicht autorisiert.",
        iban_copied: "IBAN kopiert!", swift_copied: "SWIFT-Code kopiert!", placeholder_email: "Ihre E-Mail-Adresse",
        placeholder_pin: "Ihr PIN-Code", placeholder_activation: "Geheimen Code eingeben",
        card_footer: "Diese Karte ist Eigentum von APP PAY. Jede betrügerische Verwendung wird verfolgt.",
        card_security_note: "Die letzten 4 Ziffern und der CVV wurden maskiert.",
        visa_premium: "Mastercard Premium", bank_details: "Bankverbindung", iban_number: "IBAN-Nummer",
        swift_code: "SWIFT / BIC-Code", iban_info_note: "Verwenden Sie diese Daten, um Überweisungen zu erhalten.",
        show_iban: "Vollständige IBAN anzeigen", hide_iban: "IBAN ausblenden", allowed_limit: "Zulässiges Limit:",
        limit_percentage: "Limit-Prozentsatz:", current_balance: "Aktuelles Guthaben:", attempted_amount: "VERSUCHTER BETRAG",
        new_transaction_received: "Neue Transaktion erhalten!", copied: "Kopiert!",
        tap_to_flip: "Tippen Sie auf die Karte", view_full_card: "Vollständige Nummer anzeigen",
        flip_card: "Karte umdrehen", view_cvv: "CVV-Code anzeigen", receipt_title: "TRANSAKTIONSBELEG",
        receipt_sender: "Absender", receipt_thank_you: "Vielen Dank, dass Sie APP PAY nutzen.",
        close: "Schließen", confirm_title_warning: "Warnung", confirm_btn_cancel: "Abbrechen", confirm_btn_ok: "Bestätigen"
    },
    pl: {
        dashboard: "Portfel", personal_iban: "Osobisty IBAN", logout: "Wyloguj", profile: "Profil",
        transfer_menu: "Przelew", transfer_btn: "Wykonaj przelew", virtual_card_btn: "Karta wirtualna",
        available_balance: "Dostępne saldo", account_subtitle: "Konto na wszystkie potrzeby", see_iban: "Zobacz moje IBAN",
        make_transfer: "Wykonaj przelew", see_card: "Karta wirtualna", international_transfer: "Wykonaj przelew międzynarodowy",
        transfer_warning: "Przetwarzanie przelewu zajmuje od 1 do 3 minut po weryfikacji.",
        transactions_history: "Historia transakcji", total_balance: "Całkowite saldo", transactions_label: "Transakcje",
        currency_label: "Waluta", view_all: "Zobacz wszystko", today: "Dzisiaj", yesterday: "Wczoraj",
        transfer_received: "Przelew otrzymany", transfer_sent: "Przelew wysłany", completed: "Zrealizowane",
        amount: "Kwota przelewu", beneficiary_name: "Nazwa odbiorcy", iban: "IBAN / Numer konta",
        bic: "Kod banku (BIC / SWIFT)", bank_name: "Nazwa banku", reason: "Powód przelewu",
        continue: "Kontynuuj", identity_verification: "Weryfikacja tożsamości", pending_transfer_details: "Szczegóły oczekującego przelewu",
        cancel_transfer: "Anuluj przelew", enter_activation_code: "Wprowadź kod aktywacyjny przelewu",
        activation_code: "Kod aktywacyjny", validate_transfer: "Zatwierdź przelew",
        transfer_in_progress: "Twój przelew jest w trakcie realizacji...", identity_verified: "Weryfikacja zakończona pomyślnie.",
        progress_desc: "Poczekaj na zaksięgowanie środków w banku.",
        progress_details_title: "Szczegóły trwającego przelewu", personal_info: "Informacje osobiste",
        account_details: "Szczegóły konta", operation_secured: "Twoja operacja jest zabezpieczona.",
        no_amount_debited: "Żadna kwota nie została pobrana z Twojego konta.", download_receipt: "Pobierz pokwitowanie",
        receipt_thank_you_1: "Dziękujemy za korzystanie z APP PAY.", receipt_thank_you_2: "To pokwitowanie jest generowane automatycznie.",
        transfer_success: "Przelew zakończony pomyślnie", receipt_subtitle: "POKWITOWANIE PRZELEWU",
        validated_status: "Przelew potwierdzony", success_subtitle: "Twój przelew został zarejestrowany i zostanie przetworzony przez bank odbiorcy.",
        transfer_pending: "Przelew oczekujący", pending_subtitle: "Twój przelew oczekuje na weryfikację przez nasz dział administracji.",
        pending_status: "Oczekujący", transfer_failed: "Przelew zablokowany",
        transfer_failed_subtitle: "Twój przelew został zablokowany. Konto bankowe odbiorcy nie zostało rozpoznane.",
        failed_status: "Zablokowany", transfer_cancelled: "Przelew anulowany", cancelled_status: "Anulowany", refunded_amount: "Zwrócona kwota",
        amount_sent: "WYSŁANA KWOTA", beneficiary: "Odbiorca", date: "Data", reference: "Referencja",
        back_to_dashboard: "Powrót do pulpitu", my_virtual_card: "Karta wirtualna", holder: "Posiadacz",
        expires: "Ważna do", show_details: "Pokaż szczegóły", hide_details: "Ukryj szczegóły", freeze_card: "Zablokuj kartę",
        settings: "Ustawienia", monthly_limit: "Miesięczny limit", monthly_spent: "Wydatki w tym miesiącu", status: "Status",
        active: "Aktywna", type: "Typ", verified: "Zweryfikowany", account_holder_premium: "Posiadacz konta • Klient Premium",
        full_name: "Pełne imię i nazwisko", email_address: "Adres e-mail", phone_number: "Numer telefonu",
        country: "Kraj zamieszkania", account_id: "Unikalny identyfikator", opening_date: "Data otwarcia",
        edit_profile: "Edytuj profil", security: "Bezpieczeństwo", notifications: "Powiadomienia",
        no_transactions: "Brak transakcji", err_email: "Nieprawidłowy adres e-mail.",
        err_pin: "Nieprawidłowy kod PIN.", err_amount: "Nieprawidłowa kwota.", err_balance: "Niewystarczające saldo.",
        err_fields: "Wypełnij wszystkie pola.", err_activation: "Nieprawidłowy kod aktywacyjny.",
        err_percent: "Kwota przekracza dozwolony limit ({limit}).", err_client_not_found: "Nie znaleziono klienta.",
        err_no_link: "Brak linku. Odmowa dostępu.", welcome: "Witaj", login_success: "Zalogowano pomyślnie. Witaj!",
        transfer_cancelled_toast: "Przelew anulowany.", transfer_finalized: "Przelew zakończony pomyślnie!",
        err_card_locked: "Wyświetlanie szczegółów karty nie jest autoryzowane.",
        err_iban_locked: "Wyświetlanie IBAN nie jest autoryzowane.",
        iban_copied: "IBAN skopiowany!", swift_copied: "Kod SWIFT skopiowany!", placeholder_email: "Twój adres e-mail",
        placeholder_pin: "Twój kod PIN", placeholder_activation: "Wprowadź tajny kod",
        card_footer: "Ta karta jest własnością APP PAY. Oszukańcze użycie będzie ścigane.",
        card_security_note: "Ostatnie 4 cyfry i CVV zostały ukryte.",
        visa_premium: "Mastercard Premium", bank_details: "Dane bankowe", iban_number: "Numer IBAN",
        swift_code: "Kod SWIFT / BIC", iban_info_note: "Użyj tych danych, aby otrzymywać przelewy.",
        show_iban: "Pokaż pełny IBAN", hide_iban: "Ukryj IBAN", allowed_limit: "Dozwolony limit:",
        limit_percentage: "Procent limitu:", current_balance: "Obecne saldo:", attempted_amount: "PRÓBOWANA KWOTA",
        new_transaction_received: "Otrzymano nową transakcję!", copied: "Skopiowano!",
        tap_to_flip: "Dotknij karty", view_full_card: "Pokaż pełny numer",
        flip_card: "Odwróć kartę", view_cvv: "Pokaż kod CVV", receipt_title: "POKWITOWANIE TRANSAKCJI",
        receipt_sender: "Nadawca", receipt_thank_you: "Dziękujemy za korzystanie z APP PAY.",
        close: "Zamknij", confirm_title_warning: "Ostrzeżenie", confirm_btn_cancel: "Anuluj", confirm_btn_ok: "Potwierdź"
    },
    it: {
        dashboard: "Portafoglio", personal_iban: "IBAN Personale", logout: "Disconnetti", profile: "Profilo",
        transfer_menu: "Bonifico", transfer_btn: "Effettua un bonifico", virtual_card_btn: "Carta virtuale",
        available_balance: "Saldo disponibile", account_subtitle: "Conto per tutte le tue esigenze", see_iban: "Vedi il mio IBAN",
        make_transfer: "Effettua un bonifico", see_card: "Carta virtuale", international_transfer: "Effettua un bonifico internazionale",
        transfer_warning: "L'elaborazione richiede da 1 a 3 minuti dopo la verifica finale.",
        transactions_history: "Cronologia transazioni", total_balance: "Saldo totale", transactions_label: "Transazioni",
        currency_label: "Valuta", view_all: "Vedi tutto", today: "Oggi", yesterday: "Ieri",
        transfer_received: "Bonifico ricevuto", transfer_sent: "Bonifico inviato", completed: "Completato",
        amount: "Importo del bonifico", beneficiary_name: "Nome del beneficiario", iban: "IBAN / Numero di conto",
        bic: "Codice bancario (BIC / SWIFT)", bank_name: "Nome della banca", reason: "Causale del bonifico",
        continue: "Continua", identity_verification: "Verifica dell'identità", pending_transfer_details: "Dettagli del bonifico in sospeso",
        cancel_transfer: "Annulla il bonifico", enter_activation_code: "Inserisci il codice di attivazione",
        activation_code: "Codice di attivazione", validate_transfer: "Valida il bonifico",
        transfer_in_progress: "Il tuo ordine di bonifico è in corso...", identity_verified: "Verifica completata con successo.",
        progress_desc: "Attendere il trasferimento dei fondi alla tua banca.",
        progress_details_title: "Dettagli del bonifico in corso", personal_info: "Informazioni personali",
        account_details: "Dettagli del conto", operation_secured: "La tua operazione è sicura.",
        no_amount_debited: "Nessun importo è stato addebitato.", download_receipt: "Scarica la ricevuta",
        receipt_thank_you_1: "Grazie per aver utilizzato APP PAY.", receipt_thank_you_2: "Questa ricevuta è generata automaticamente.",
        transfer_success: "Bonifico completato con successo", receipt_subtitle: "RICEVUTA DEL BONIFICO",
        validated_status: "Bonifico confermato", success_subtitle: "Il tuo bonifico è stato registrato.",
        transfer_pending: "Bonifico in sospeso", pending_subtitle: "Il tuo bonifico attende convalida.",
        pending_status: "In sospeso", transfer_failed: "Bonifico bloccato",
        transfer_failed_subtitle: "Il tuo bonifico è stato bloccato. Contatta il servizio clienti.",
        failed_status: "Bloccato", transfer_cancelled: "Bonifico annullato", cancelled_status: "Annullato", refunded_amount: "Importo rimborsato",
        amount_sent: "IMPORTO INVIATO", beneficiary: "Beneficiario", date: "Data", reference: "Riferimento",
        back_to_dashboard: "Torna alla dashboard", my_virtual_card: "Carta virtuale", holder: "Titolare",
        expires: "Scade", show_details: "Mostra dettagli", hide_details: "Nascondi dettagli", freeze_card: "Blocca la carta",
        settings: "Impostazioni", monthly_limit: "Limite mensile", monthly_spent: "Spese del mese", status: "Stato",
        active: "Attiva", type: "Tipo", verified: "Verificato", account_holder_premium: "Titolare • Cliente Premium",
        full_name: "Nome completo", email_address: "Indirizzo e-mail", phone_number: "Numero di telefono",
        country: "Paese di residenza", account_id: "ID univoco", opening_date: "Data di apertura",
        edit_profile: "Modifica profilo", security: "Sicurezza", notifications: "Notifiche",
        no_transactions: "Nessuna transazione", err_email: "Indirizzo e-mail errato.",
        err_pin: "Codice PIN errato.", err_amount: "Importo non valido.", err_balance: "Saldo insufficiente.",
        err_fields: "Compila tutti i campi.", err_activation: "Codice errato.",
        err_percent: "L'importo supera il limite ({limit}).", err_client_not_found: "Cliente non trovato.",
        err_no_link: "Nessun link. Accesso negato.", welcome: "Benvenuto", login_success: "Accesso riuscito. Benvenuto!",
        transfer_cancelled_toast: "Bonifico annullato.", transfer_finalized: "Bonifico completato!",
        err_card_locked: "Visualizzazione non autorizzata.", err_iban_locked: "Visualizzazione IBAN non autorizzata.",
        iban_copied: "IBAN copiato!", swift_copied: "SWIFT copiato!", placeholder_email: "Il tuo indirizzo e-mail",
        placeholder_pin: "Il tuo codice PIN", placeholder_activation: "Inserisci il codice segreto",
        card_footer: "Questa carta è di proprietà esclusiva di APP PAY.", card_security_note: "Ultime 4 cifre e CVV mascherati.",
        visa_premium: "Mastercard Premium", bank_details: "Coordinate bancarie", iban_number: "Numero IBAN",
        swift_code: "Codice SWIFT / BIC", iban_info_note: "Utilizza queste coordinate per ricevere bonifici.",
        show_iban: "Mostra IBAN completo", hide_iban: "Nascondi IBAN", allowed_limit: "Limite consentito:",
        limit_percentage: "Percentuale limite:", current_balance: "Saldo attuale:", attempted_amount: "IMPORTO TENTATO",
        new_transaction_received: "Nuova transazione ricevuta!", copied: "Copiato!",
        tap_to_flip: "Tocca la carta", view_full_card: "Vedi numero completo",
        flip_card: "Gira la carta", view_cvv: "Vedi codice CVV", receipt_title: "RICEVUTA DI TRANSAZIONE",
        receipt_sender: "Mittente", receipt_thank_you: "Grazie per aver utilizzato APP PAY.",
        close: "Chiudi", confirm_title_warning: "Attenzione", confirm_btn_cancel: "Annulla", confirm_btn_ok: "Conferma"
    },
    pt: {
        dashboard: "Carteira", personal_iban: "IBAN Pessoal", logout: "Sair", profile: "Perfil",
        transfer_menu: "Transferência", transfer_btn: "Fazer uma transferência", virtual_card_btn: "Cartão virtual",
        available_balance: "Saldo disponível", account_subtitle: "Conta para todas as suas necessidades", see_iban: "Ver meu IBAN",
        make_transfer: "Fazer uma transferência", see_card: "Cartão virtual", international_transfer: "Fazer uma transferência internacional",
        transfer_warning: "O processamento leva de 1 a 3 minutos após a verificação final.",
        transactions_history: "Histórico de transações", total_balance: "Saldo total", transactions_label: "Transações",
        currency_label: "Moeda", view_all: "Ver tudo", today: "Hoje", yesterday: "Ontem",
        transfer_received: "Transferência recebida", transfer_sent: "Transferência enviada", completed: "Concluído",
        amount: "Valor da transferência", beneficiary_name: "Nome do beneficiário", iban: "IBAN / Número da conta",
        bic: "Código bancário (BIC / SWIFT)", bank_name: "Nome do banco", reason: "Motivo da transferência",
        continue: "Continuar", identity_verification: "Verificação de identidade", pending_transfer_details: "Detalhes da transferência pendente",
        cancel_transfer: "Cancelar a transferência", enter_activation_code: "Insira o código de ativação",
        activation_code: "Código de ativação", validate_transfer: "Validar a transferência",
        transfer_in_progress: "A sua ordem de transferência está em curso...", identity_verified: "Verificação bem-sucedida.",
        progress_desc: "Aguarde a conclusão da transferência.",
        progress_details_title: "Detalhes da transferência", personal_info: "Informações pessoais",
        account_details: "Detalhes da conta", operation_secured: "A sua operação está segura.",
        no_amount_debited: "Nenhum valor foi debitado.", download_receipt: "Baixar o recibo",
        receipt_thank_you_1: "Obrigado por usar o APP PAY.", receipt_thank_you_2: "Este recibo é gerado automaticamente.",
        transfer_success: "Transferência concluída com sucesso", receipt_subtitle: "RECIBO DE TRANSFERÊNCIA",
        validated_status: "Transferência confirmada", success_subtitle: "A sua transferência foi registada.",
        transfer_pending: "Transferência pendente", pending_subtitle: "A sua transferência está pendente de validação.",
        pending_status: "Pendente", transfer_failed: "Transferência bloqueada",
        transfer_failed_subtitle: "A sua transferência foi bloqueada. Contacte o apoio ao cliente.",
        failed_status: "Bloqueado", transfer_cancelled: "Transferência cancelada", cancelled_status: "Cancelado", refunded_amount: "Valor reembolsado",
        amount_sent: "VALOR ENVIADO", beneficiary: "Beneficiário", date: "Data", reference: "Referência",
        back_to_dashboard: "Voltar ao painel", my_virtual_card: "Cartão virtual", holder: "Titular",
        expires: "Expira", show_details: "Mostrar detalhes", hide_details: "Ocultar detalhes", freeze_card: "Bloquear o cartão",
        settings: "Configurações", monthly_limit: "Limite mensal", monthly_spent: "Gastos do mês", status: "Estado",
        active: "Ativo", type: "Tipo", verified: "Verificado", account_holder_premium: "Titular • Cliente Premium",
        full_name: "Nome completo", email_address: "Endereço de e-mail", phone_number: "Número de telefone",
        country: "País de residência", account_id: "ID único", opening_date: "Data de abertura",
        edit_profile: "Editar perfil", security: "Segurança", notifications: "Notificações",
        no_transactions: "Nenhuma transação", err_email: "Endereço de e-mail incorreto.",
        err_pin: "Código PIN incorreto.", err_amount: "Valor inválido.", err_balance: "Saldo insuficiente.",
        err_fields: "Preencha todos os campos.", err_activation: "Código incorreto.",
        err_percent: "O valor excede o limite ({limit}).", err_client_not_found: "Cliente não encontrado.",
        err_no_link: "Nenhum link. Acesso negado.", welcome: "Bem-vindo", login_success: "Login bem-sucedido. Bem-vindo!",
        transfer_cancelled_toast: "Transferência cancelada.", transfer_finalized: "Transferência concluída!",
        err_card_locked: "Exibição não autorizada.", err_iban_locked: "Exibição IBAN não autorizada.",
        iban_copied: "IBAN copiado!", swift_copied: "SWIFT copiado!", placeholder_email: "O seu endereço de e-mail",
        placeholder_pin: "O seu código PIN", placeholder_activation: "Insira o código secreto",
        card_footer: "Este cartão é propriedade exclusiva da APP PAY.", card_security_note: "Últimos 4 dígitos e CVV ocultados.",
        visa_premium: "Mastercard Premium", bank_details: "Coordenadas bancárias", iban_number: "Número IBAN",
        swift_code: "Código SWIFT / BIC", iban_info_note: "Utilize estas coordenadas para receber transferências.",
        show_iban: "Mostrar IBAN completo", hide_iban: "Ocultar IBAN", allowed_limit: "Limite permitido:",
        limit_percentage: "Percentagem limite:", current_balance: "Saldo atual:", attempted_amount: "VALOR TENTADO",
        new_transaction_received: "Nova transação recebida!", copied: "Copiado!",
        tap_to_flip: "Toque no cartão", view_full_card: "Ver número completo",
        flip_card: "Virar o cartão", view_cvv: "Ver código CVV", receipt_title: "RECIBO DE TRANSAÇÃO",
        receipt_sender: "Remetente", receipt_thank_you: "Obrigado por usar o APP PAY.",
        close: "Fechar", confirm_title_warning: "Atenção", confirm_btn_cancel: "Cancelar", confirm_btn_ok: "Confirmar"
    },
    nl: {
        dashboard: "Portemonnee", personal_iban: "Persoonlijke IBAN", logout: "Uitloggen", profile: "Profiel",
        transfer_menu: "Overschrijving", transfer_btn: "Overschrijving uitvoeren", virtual_card_btn: "Virtuele kaart",
        available_balance: "Beschikbaar saldo", account_subtitle: "Rekening voor al uw behoeften", see_iban: "Mijn IBAN bekijken",
        make_transfer: "Overschrijving uitvoeren", see_card: "Virtuele kaart", international_transfer: "Internationale overschrijving uitvoeren",
        transfer_warning: "De verwerking duurt 1 tot 3 minuten na de laatste verificatie.",
        transactions_history: "Transactiegeschiedenis", total_balance: "Totaal saldo", transactions_label: "Transacties",
        currency_label: "Valuta", view_all: "Alles bekijken", today: "Vandaag", yesterday: "Gisteren",
        transfer_received: "Overschrijving ontvangen", transfer_sent: "Overschrijving verzonden", completed: "Voltooid",
        amount: "Bedrag van de overschrijving", beneficiary_name: "Naam van de begunstigde", iban: "IBAN / Rekeningnummer",
        bic: "Bankcode (BIC / SWIFT)", bank_name: "Naam van de bank", reason: "Reden van de overschrijving",
        continue: "Doorgaan", identity_verification: "Identiteitsverificatie", pending_transfer_details: "Details van de lopende overschrijving",
        cancel_transfer: "Overschrijving annuleren", enter_activation_code: "Voer de activeringscode in",
        activation_code: "Activeringscode", validate_transfer: "Overschrijving valideren",
        transfer_in_progress: "Uw overschrijving is in behandeling...", identity_verified: "Identiteitsverificatie geslaagd.",
        progress_desc: "Wacht tot het geld bij uw bank is aangekomen.",
        progress_details_title: "Details van de overschrijving", personal_info: "Persoonlijke informatie",
        account_details: "Rekeninggegevens", operation_secured: "Uw transactie is beveiligd.",
        no_amount_debited: "Er is geen bedrag afgeschreven.", download_receipt: "Bon downloaden",
        receipt_thank_you_1: "Bedankt voor het gebruik van APP PAY.", receipt_thank_you_2: "Deze bon wordt automatisch gegenereerd.",
        transfer_success: "Overschrijving succesvol", receipt_subtitle: "OVERSCHRIJVINGSBON",
        validated_status: "Overschrijving bevestigd", success_subtitle: "Uw overschrijving is geregistreerd.",
        transfer_pending: "Overschrijving in behandeling", pending_subtitle: "Uw overschrijving wacht op validatie.",
        pending_status: "In behandeling", transfer_failed: "Overschrijving geblokkeerd",
        transfer_failed_subtitle: "Uw overschrijving is geblokkeerd. Neem contact op met de klantenservice.",
        failed_status: "Geblokkeerd", transfer_cancelled: "Overschrijving geannuleerd", cancelled_status: "Geannuleerd", refunded_amount: "Terugbetaald bedrag",
        amount_sent: "VERZONDEN BEDRAG", beneficiary: "Begunstigde", date: "Datum", reference: "Referentie",
        back_to_dashboard: "Terug naar dashboard", my_virtual_card: "Virtuele kaart", holder: "Houder",
        expires: "Verloopt", show_details: "Details tonen", hide_details: "Details verbergen", freeze_card: "Kaart blokkeren",
        settings: "Instellingen", monthly_limit: "Maandlimiet", monthly_spent: "Deze maand uitgegeven", status: "Status",
        active: "Actief", type: "Type", verified: "Geverifieerd", account_holder_premium: "Rekeninghouder • Premium klant",
        full_name: "Volledige naam", email_address: "E-mailadres", phone_number: "Telefoonnummer",
        country: "Land van verblijf", account_id: "Unieke ID", opening_date: "Openingsdatum",
        edit_profile: "Profiel bewerken", security: "Beveiliging", notifications: "Meldingen",
        no_transactions: "Nog geen transacties", err_email: "Onjuist e-mailadres.",
        err_pin: "Onjuiste pincode.", err_amount: "Ongeldig bedrag.", err_balance: "Onvoldoende saldo.",
        err_fields: "Vul alle velden in.", err_activation: "Onjuiste activeringscode.",
        err_percent: "Het bedrag overschrijdt de limiet ({limit}).", err_client_not_found: "Klant niet gevonden.",
        err_no_link: "Geen link. Toegang geweigerd.", welcome: "Welkom", login_success: "Inloggen geslaagd. Welkom!",
        transfer_cancelled_toast: "Overschrijving geannuleerd.", transfer_finalized: "Overschrijving voltooid!",
        err_card_locked: "Weergave niet toegestaan.", err_iban_locked: "IBAN-weergave niet toegestaan.",
        iban_copied: "IBAN gekopieerd!", swift_copied: "SWIFT gekopieerd!", placeholder_email: "Uw e-mailadres",
        placeholder_pin: "Uw pincode", placeholder_activation: "Voer uw geheime code in",
        card_footer: "Deze kaart is eigendom van APP PAY.", card_security_note: "Laatste 4 cijfers en CVV gemaskeerd.",
        visa_premium: "Mastercard Premium", bank_details: "Bankgegevens", iban_number: "IBAN-nummer",
        swift_code: "SWIFT / BIC-code", iban_info_note: "Gebruik deze gegevens om overschrijvingen te ontvangen.",
        show_iban: "Volledige IBAN tonen", hide_iban: "IBAN verbergen", allowed_limit: "Toegestane limiet:",
        limit_percentage: "Limietpercentage:", current_balance: "Huidig saldo:", attempted_amount: "GEPROBEERD BEDRAG",
        new_transaction_received: "Nieuwe transactie ontvangen!", copied: "Gekopieerd!",
        tap_to_flip: "Tik op de kaart", view_full_card: "Volledig nummer bekijken",
        flip_card: "Kaart omdraaien", view_cvv: "CVV-code bekijken", receipt_title: "TRANSACTIEBON",
        receipt_sender: "Afzender", receipt_thank_you: "Bedankt voor het gebruik van APP PAY.",
        close: "Sluiten", confirm_title_warning: "Waarschuwing", confirm_btn_cancel: "Annuleren", confirm_btn_ok: "Bevestigen"
    },
    ru: {
        dashboard: "Кошелёк", personal_iban: "Личный IBAN", logout: "Выйти", profile: "Профиль",
        transfer_menu: "Перевод", transfer_btn: "Сделать перевод", virtual_card_btn: "Виртуальная карта",
        available_balance: "Доступный баланс", account_subtitle: "Счёт для всех ваших нужд", see_iban: "Показать мой IBAN",
        make_transfer: "Сделать перевод", see_card: "Виртуальная карта", international_transfer: "Сделать международный перевод",
        transfer_warning: "Обработка занимает от 1 до 3 минут после проверки.",
        transactions_history: "История транзакций", total_balance: "Общий баланс", transactions_label: "Транзакции",
        currency_label: "Валюта", view_all: "Показать всё", today: "Сегодня", yesterday: "Вчера",
        transfer_received: "Перевод получен", transfer_sent: "Перевод отправлен", completed: "Выполнено",
        amount: "Сумма перевода", beneficiary_name: "Имя получателя", iban: "IBAN / Номер счёта",
        bic: "Код банка (BIC / SWIFT)", bank_name: "Название банка", reason: "Причина перевода",
        continue: "Продолжить", identity_verification: "Проверка личности", pending_transfer_details: "Детали ожидающего перевода",
        cancel_transfer: "Отменить перевод", enter_activation_code: "Введите код активации",
        activation_code: "Код активации", validate_transfer: "Подтвердить перевод",
        transfer_in_progress: "Ваш перевод обрабатывается...", identity_verified: "Проверка успешно завершена.",
        progress_desc: "Дождитесь поступления средств в ваш банк.",
        progress_details_title: "Детали текущего перевода", personal_info: "Личная информация",
        account_details: "Детали счёта", operation_secured: "Ваша операция защищена.",
        no_amount_debited: "С вашего счёта не списано средств.", download_receipt: "Скачать квитанцию",
        receipt_thank_you_1: "Спасибо за использование APP PAY.", receipt_thank_you_2: "Квитанция создаётся автоматически.",
        transfer_success: "Перевод успешно выполнен", receipt_subtitle: "КВИТАНЦИЯ О ПЕРЕВОДЕ",
        validated_status: "Перевод подтверждён", success_subtitle: "Ваш перевод зарегистрирован.",
        transfer_pending: "Перевод в ожидании", pending_subtitle: "Ваш перевод ожидает проверки.",
        pending_status: "В ожидании", transfer_failed: "Перевод заблокирован",
        transfer_failed_subtitle: "Перевод заблокирован. Свяжитесь со службой поддержки.",
        failed_status: "Заблокирован", transfer_cancelled: "Перевод отменён", cancelled_status: "Отменён", refunded_amount: "Возвращённая сумма",
        amount_sent: "ОТПРАВЛЕННАЯ СУММА", beneficiary: "Получатель", date: "Дата", reference: "Ссылка",
        back_to_dashboard: "На главную", my_virtual_card: "Виртуальная карта", holder: "Владелец",
        expires: "Действует до", show_details: "Показать детали", hide_details: "Скрыть детали", freeze_card: "Заблокировать карту",
        settings: "Настройки", monthly_limit: "Месячный лимит", monthly_spent: "Потрачено за месяц", status: "Статус",
        active: "Активна", type: "Тип", verified: "Проверен", account_holder_premium: "Владелец • Премиум-клиент",
        full_name: "Полное имя", email_address: "Эл. почта", phone_number: "Телефон",
        country: "Страна", account_id: "Уникальный ID", opening_date: "Дата открытия",
        edit_profile: "Редактировать", security: "Безопасность", notifications: "Уведомления",
        no_transactions: "Транзакций нет", err_email: "Неверный адрес эл. почты.",
        err_pin: "Неверный PIN-код.", err_amount: "Неверная сумма.", err_balance: "Недостаточно средств.",
        err_fields: "Заполните все поля.", err_activation: "Неверный код активации.",
        err_percent: "Сумма превышает лимит ({limit}).", err_client_not_found: "Клиент не найден.",
        err_no_link: "Ссылка не указана.", welcome: "Добро пожаловать", login_success: "Вход выполнен. Добро пожаловать!",
        transfer_cancelled_toast: "Перевод отменён.", transfer_finalized: "Перевод завершён!",
        err_card_locked: "Отображение не разрешено.", err_iban_locked: "Отображение IBAN не разрешено.",
        iban_copied: "IBAN скопирован!", swift_copied: "SWIFT скопирован!", placeholder_email: "Ваш адрес эл. почты",
        placeholder_pin: "Ваш PIN-код", placeholder_activation: "Введите секретный код",
        card_footer: "Эта карта — собственность APP PAY.", card_security_note: "Последние 4 цифры и CVV скрыты.",
        visa_premium: "Mastercard Premium", bank_details: "Реквизиты", iban_number: "Номер IBAN",
        swift_code: "Код SWIFT / BIC", iban_info_note: "Используйте реквизиты для получения переводов.",
        show_iban: "Показать полный IBAN", hide_iban: "Скрыть IBAN", allowed_limit: "Лимит:",
        limit_percentage: "Процент лимита:", current_balance: "Текущий баланс:", attempted_amount: "ЗАПРОШЕННАЯ СУММА",
        new_transaction_received: "Новая транзакция!", copied: "Скопировано!",
        tap_to_flip: "Нажмите на карту", view_full_card: "Показать полный номер",
        flip_card: "Перевернуть карту", view_cvv: "Показать CVV", receipt_title: "КВИТАНЦИЯ",
        receipt_sender: "Отправитель", receipt_thank_you: "Спасибо за использование APP PAY.",
        close: "Закрыть", confirm_title_warning: "Внимание", confirm_btn_cancel: "Отмена", confirm_btn_ok: "Подтвердить"
    },
    ar: {
        dashboard: "المحفظة", personal_iban: "IBAN الشخصي", logout: "تسجيل الخروج", profile: "الملف الشخصي",
        transfer_menu: "تحويل", transfer_btn: "إجراء تحويل", virtual_card_btn: "بطاقة افتراضية",
        available_balance: "الرصيد المتاح", account_subtitle: "حساب لجميع احتياجاتك", see_iban: "عرض IBAN",
        make_transfer: "إجراء تحويل", see_card: "البطاقة الافتراضية", international_transfer: "إجراء تحويل دولي",
        transfer_warning: "تستغرق المعالجة من 1 إلى 3 دقائق بعد التحقق.",
        transactions_history: "سجل المعاملات", total_balance: "الرصيد الإجمالي", transactions_label: "المعاملات",
        currency_label: "العملة", view_all: "عرض الكل", today: "اليوم", yesterday: "أمس",
        transfer_received: "تحويل مستلم", transfer_sent: "تحويل مرسل", completed: "مكتمل",
        amount: "مبلغ التحويل", beneficiary_name: "اسم المستفيد", iban: "IBAN / رقم الحساب",
        bic: "رمز البنك (BIC / SWIFT)", bank_name: "اسم البنك", reason: "سبب التحويل",
        continue: "متابعة", identity_verification: "التحقق من الهوية", pending_transfer_details: "تفاصيل التحويل المعلق",
        cancel_transfer: "إلغاء التحويل", enter_activation_code: "أدخل رمز التنشيط",
        activation_code: "رمز التنشيط", validate_transfer: "تأكيد التحويل",
        transfer_in_progress: "أمر التحويل قيد المعالجة...", identity_verified: "تم التحقق بنجاح.",
        progress_desc: "انتظر حتى يتم تحويل الأموال.",
        progress_details_title: "تفاصيل التحويل", personal_info: "المعلومات الشخصية",
        account_details: "تفاصيل الحساب", operation_secured: "عمليتك آمنة.",
        no_amount_debited: "لم يتم خصم أي مبلغ.", download_receipt: "تحميل الإيصال",
        receipt_thank_you_1: "شكرًا لاستخدامك APP PAY.", receipt_thank_you_2: "يتم إنشاء الإيصال تلقائيًا.",
        transfer_success: "تم التحويل بنجاح", receipt_subtitle: "إيصال التحويل",
        validated_status: "تم تأكيد التحويل", success_subtitle: "تم تسجيل تحويلك.",
        transfer_pending: "تحويل معلق", pending_subtitle: "تحويلك في انتظار التحقق.",
        pending_status: "معلق", transfer_failed: "تحويل محظور",
        transfer_failed_subtitle: "تم حظر تحويلك. اتصل بخدمة العملاء.",
        failed_status: "محظور", transfer_cancelled: "تحويل ملغى", cancelled_status: "ملغى", refunded_amount: "المبلغ المسترد",
        amount_sent: "المبلغ المرسل", beneficiary: "المستفيد", date: "التاريخ", reference: "المرجع",
        back_to_dashboard: "العودة للوحة التحكم", my_virtual_card: "البطاقة الافتراضية", holder: "حامل البطاقة",
        expires: "تنتهي في", show_details: "عرض التفاصيل", hide_details: "إخفاء التفاصيل", freeze_card: "تجميد البطاقة",
        settings: "الإعدادات", monthly_limit: "الحد الشهري", monthly_spent: "المصروفات الشهرية", status: "الحالة",
        active: "نشط", type: "النوع", verified: "موثق", account_holder_premium: "صاحب الحساب • عميل مميز",
        full_name: "الاسم الكامل", email_address: "البريد الإلكتروني", phone_number: "رقم الهاتف",
        country: "بلد الإقامة", account_id: "معرف فريد", opening_date: "تاريخ الافتتاح",
        edit_profile: "تعديل الملف", security: "الأمان", notifications: "الإشعارات",
        no_transactions: "لا توجد معاملات", err_email: "بريد إلكتروني غير صحيح.",
        err_pin: "رمز PIN غير صحيح.", err_amount: "مبلغ غير صالح.", err_balance: "رصيد غير كافٍ.",
        err_fields: "املأ جميع الحقول.", err_activation: "رمز التنشيط غير صحيح.",
        err_percent: "المبلغ يتجاوز الحد ({limit}).", err_client_not_found: "العميل غير موجود.",
        err_no_link: "لا يوجد رابط.", welcome: "مرحبًا", login_success: "تم تسجيل الدخول. مرحبًا!",
        transfer_cancelled_toast: "تم إلغاء التحويل.", transfer_finalized: "تم إتمام التحويل!",
        err_card_locked: "العرض غير مصرح به.", err_iban_locked: "عرض IBAN غير مصرح به.",
        iban_copied: "تم نسخ IBAN!", swift_copied: "تم نسخ SWIFT!", placeholder_email: "بريدك الإلكتروني",
        placeholder_pin: "رمز PIN", placeholder_activation: "أدخل رمزك السري",
        card_footer: "هذه البطاقة ملكية حصرية لـ APP PAY.", card_security_note: "تم إخفاء آخر 4 أرقام و CVV.",
        visa_premium: "Mastercard Premium", bank_details: "التفاصيل المصرفية", iban_number: "رقم IBAN",
        swift_code: "رمز SWIFT / BIC", iban_info_note: "استخدم هذه التفاصيل لتلقي التحويلات.",
        show_iban: "عرض IBAN الكامل", hide_iban: "إخفاء IBAN", allowed_limit: "الحد:",
        limit_percentage: "نسبة الحد:", current_balance: "الرصيد الحالي:", attempted_amount: "المبلغ المطلوب",
        new_transaction_received: "معاملة جديدة!", copied: "تم النسخ!",
        tap_to_flip: "اضغط على البطاقة", view_full_card: "عرض الرقم الكامل",
        flip_card: "قلب البطاقة", view_cvv: "عرض CVV", receipt_title: "إيصال المعاملة",
        receipt_sender: "المرسل", receipt_thank_you: "شكرًا لاستخدامك APP PAY.",
        close: "إغلاق", confirm_title_warning: "تحذير", confirm_btn_cancel: "إلغاء", confirm_btn_ok: "تأكيد"
    },
    zh: {
        dashboard: "钱包", personal_iban: "个人 IBAN", logout: "退出登录", profile: "个人资料",
        transfer_menu: "转账", transfer_btn: "进行转账", virtual_card_btn: "虚拟卡",
        available_balance: "可用余额", account_subtitle: "满足您所有需求的账户", see_iban: "查看我的 IBAN",
        make_transfer: "进行转账", see_card: "虚拟卡", international_transfer: "进行国际转账",
        transfer_warning: "最终验证后转账处理需要 1 到 3 分钟。",
        transactions_history: "交易历史", total_balance: "总余额", transactions_label: "交易",
        currency_label: "货币", view_all: "查看全部", today: "今天", yesterday: "昨天",
        transfer_received: "已收到转账", transfer_sent: "已发送转账", completed: "已完成",
        amount: "转账金额", beneficiary_name: "收款人姓名", iban: "IBAN / 账号",
        bic: "银行代码（BIC / SWIFT）", bank_name: "银行名称", reason: "转账原因",
        continue: "继续", identity_verification: "身份验证", pending_transfer_details: "待处理转账详情",
        cancel_transfer: "取消转账", enter_activation_code: "请输入转账激活码",
        activation_code: "激活码", validate_transfer: "验证转账",
        transfer_in_progress: "转账订单处理中...", identity_verified: "身份验证成功。",
        progress_desc: "请等待资金转入您的银行。",
        progress_details_title: "转账详情", personal_info: "个人信息",
        account_details: "账户详情", operation_secured: "您的操作已安全记录。",
        no_amount_debited: "未从您的账户扣除任何金额。", download_receipt: "下载收据",
        receipt_thank_you_1: "感谢您使用 APP PAY。", receipt_thank_you_2: "此收据自动生成。",
        transfer_success: "转账已成功完成", receipt_subtitle: "转账收据",
        validated_status: "转账已确认", success_subtitle: "您的转账已登记。",
        transfer_pending: "转账待处理", pending_subtitle: "您的转账正在等待验证。",
        pending_status: "待处理", transfer_failed: "转账已阻止",
        transfer_failed_subtitle: "您的转账被系统阻止。请联系客服。",
        failed_status: "已阻止", transfer_cancelled: "转账已取消", cancelled_status: "已取消", refunded_amount: "已退款金额",
        amount_sent: "发送金额", beneficiary: "收款人", date: "日期", reference: "参考号",
        back_to_dashboard: "返回控制面板", my_virtual_card: "虚拟卡", holder: "持卡人",
        expires: "有效期至", show_details: "显示详情", hide_details: "隐藏详情", freeze_card: "冻结卡",
        settings: "设置", monthly_limit: "每月限额", monthly_spent: "本月消费", status: "状态",
        active: "已激活", type: "类型", verified: "已验证", account_holder_premium: "账户持有人 • 高级客户",
        full_name: "全名", email_address: "电子邮箱", phone_number: "电话号码",
        country: "居住国家", account_id: "唯一标识符", opening_date: "开户日期",
        edit_profile: "编辑个人资料", security: "安全", notifications: "通知",
        no_transactions: "暂无交易", err_email: "电子邮箱错误。",
        err_pin: "PIN 码错误。", err_amount: "无效金额。", err_balance: "余额不足。",
        err_fields: "请填写所有字段。", err_activation: "激活码错误。",
        err_percent: "金额超过限额（{limit}）。", err_client_not_found: "未找到客户。",
        err_no_link: "未提供链接。", welcome: "欢迎", login_success: "登录成功。欢迎！",
        transfer_cancelled_toast: "转账已取消。", transfer_finalized: "转账已成功完成！",
        err_card_locked: "未授权显示卡信息。", err_iban_locked: "未授权显示 IBAN。",
        iban_copied: "IBAN 已复制！", swift_copied: "SWIFT 已复制！", placeholder_email: "您的电子邮箱",
        placeholder_pin: "您的 PIN 码", placeholder_activation: "请输入密码",
        card_footer: "此卡为 APP PAY 独家财产。", card_security_note: "最后 4 位数字和 CVV 已隐藏。",
        visa_premium: "Mastercard Premium", bank_details: "银行信息", iban_number: "IBAN 号码",
        swift_code: "SWIFT / BIC 代码", iban_info_note: "使用这些信息接收转账。",
        show_iban: "显示完整 IBAN", hide_iban: "隐藏 IBAN", allowed_limit: "限额：",
        limit_percentage: "限额百分比：", current_balance: "当前余额：", attempted_amount: "尝试金额",
        new_transaction_received: "收到新交易！", copied: "已复制！",
        tap_to_flip: "点击卡片翻转", view_full_card: "查看完整号码",
        flip_card: "翻转卡片", view_cvv: "查看 CVV", receipt_title: "交易收据",
        receipt_sender: "发送方", receipt_thank_you: "感谢您使用 APP PAY。",
        close: "关闭", confirm_title_warning: "警告", confirm_btn_cancel: "取消", confirm_btn_ok: "确认"
    },
    ja: {
        dashboard: "ウォレット", personal_iban: "個人 IBAN", logout: "ログアウト", profile: "プロフィール",
        transfer_menu: "振込", transfer_btn: "振込を行う", virtual_card_btn: "バーチャルカード",
        available_balance: "利用可能残高", account_subtitle: "あらゆるニーズに対応する口座", see_iban: "IBAN を表示",
        make_transfer: "振込を行う", see_card: "バーチャルカード", international_transfer: "国際振込を行う",
        transfer_warning: "最終確認後、処理には 1～3 分かかります。",
        transactions_history: "取引履歴", total_balance: "総残高", transactions_label: "取引",
        currency_label: "通貨", view_all: "すべて表示", today: "今日", yesterday: "昨日",
        transfer_received: "振込受取", transfer_sent: "振込送金", completed: "完了",
        amount: "振込金額", beneficiary_name: "受取人名", iban: "IBAN / 口座番号",
        bic: "銀行コード（BIC / SWIFT）", bank_name: "銀行名", reason: "振込理由",
        continue: "続行", identity_verification: "本人確認", pending_transfer_details: "保留中の振込詳細",
        cancel_transfer: "振込をキャンセル", enter_activation_code: "アクティベーションコードを入力",
        activation_code: "アクティベーションコード", validate_transfer: "振込を承認",
        transfer_in_progress: "振込を処理中です...", identity_verified: "本人確認が完了しました。",
        progress_desc: "資金が銀行に振り込まれるまでお待ちください。",
        progress_details_title: "処理中の振込詳細", personal_info: "個人情報",
        account_details: "口座詳細", operation_secured: "操作は安全に記録されました。",
        no_amount_debited: "口座から金額は引き落とされていません。", download_receipt: "領収書をダウンロード",
        receipt_thank_you_1: "APP PAY をご利用いただきありがとうございます。", receipt_thank_you_2: "この領収書は自動生成されます。",
        transfer_success: "振込が完了しました", receipt_subtitle: "振込領収書",
        validated_status: "振込が確認されました", success_subtitle: "振込は登録されました。",
        transfer_pending: "振込保留中", pending_subtitle: "振込は検証を待っています。",
        pending_status: "保留中", transfer_failed: "振込がブロックされました",
        transfer_failed_subtitle: "振込はブロックされました。カスタマーサービスにお問い合わせください。",
        failed_status: "ブロック済み", transfer_cancelled: "振込がキャンセルされました", cancelled_status: "キャンセル済み", refunded_amount: "返金額",
        amount_sent: "送金額", beneficiary: "受取人", date: "日付", reference: "参照番号",
        back_to_dashboard: "ダッシュボードに戻る", my_virtual_card: "バーチャルカード", holder: "名義人",
        expires: "有効期限", show_details: "詳細を表示", hide_details: "詳細を隠す", freeze_card: "カードを凍結",
        settings: "設定", monthly_limit: "月間限度額", monthly_spent: "今月の支出", status: "ステータス",
        active: "有効", type: "タイプ", verified: "確認済み", account_holder_premium: "口座名義人 • プレミアム顧客",
        full_name: "氏名", email_address: "メールアドレス", phone_number: "電話番号",
        country: "居住国", account_id: "固有 ID", opening_date: "開設日",
        edit_profile: "プロフィールを編集", security: "セキュリティ", notifications: "通知",
        no_transactions: "取引はまだありません", err_email: "メールアドレスが正しくありません。",
        err_pin: "PIN コードが正しくありません。", err_amount: "無効な金額です。", err_balance: "残高不足です。",
        err_fields: "すべての項目を入力してください。", err_activation: "コードが正しくありません。",
        err_percent: "金額が上限（{limit}）を超えています。", err_client_not_found: "顧客が見つかりません。",
        err_no_link: "リンクがありません。", welcome: "ようこそ", login_success: "ログイン成功。ようこそ！",
        transfer_cancelled_toast: "振込がキャンセルされました。", transfer_finalized: "振込が完了しました！",
        err_card_locked: "カード詳細表示は許可されていません。", err_iban_locked: "IBAN 表示は許可されていません。",
        iban_copied: "IBAN をコピーしました！", swift_copied: "SWIFT をコピーしました！", placeholder_email: "メールアドレス",
        placeholder_pin: "PIN コード", placeholder_activation: "秘密コードを入力",
        card_footer: "このカードは APP PAY の独占財産です。", card_security_note: "下 4 桁と CVV はマスクされています。",
        visa_premium: "Mastercard Premium", bank_details: "銀行情報", iban_number: "IBAN 番号",
        swift_code: "SWIFT / BIC コード", iban_info_note: "振込の受取にはこの情報をご利用ください。",
        show_iban: "完全な IBAN を表示", hide_iban: "IBAN を隠す", allowed_limit: "上限：",
        limit_percentage: "上限パーセント：", current_balance: "現在の残高：", attempted_amount: "試行金額",
        new_transaction_received: "新しい取引を受信しました！", copied: "コピーしました！",
        tap_to_flip: "カードをタップ", view_full_card: "完全な番号を表示",
        flip_card: "カードを裏返す", view_cvv: "CVV を表示", receipt_title: "取引領収書",
        receipt_sender: "送信者", receipt_thank_you: "APP PAY をご利用いただきありがとうございます。",
        close: "閉じる", confirm_title_warning: "警告", confirm_btn_cancel: "キャンセル", confirm_btn_ok: "確認"
    },
    tr: {
        dashboard: "Cüzdan", personal_iban: "Kişisel IBAN", logout: "Çıkış Yap", profile: "Profil",
        transfer_menu: "Transfer", transfer_btn: "Transfer Yap", virtual_card_btn: "Sanal Kart",
        available_balance: "Kullanılabilir Bakiye", account_subtitle: "Tüm ihtiyaçlarınız için hesap", see_iban: "IBAN'ımı Görüntüle",
        make_transfer: "Transfer Yap", see_card: "Sanal Kart", international_transfer: "Uluslararası Transfer Yap",
        transfer_warning: "Transfer işlemi son doğrulamadan sonra 1 ila 3 dakika sürer.",
        transactions_history: "İşlem Geçmişi", total_balance: "Toplam Bakiye", transactions_label: "İşlemler",
        currency_label: "Para Birimi", view_all: "Tümünü Görüntüle", today: "Bugün", yesterday: "Dün",
        transfer_received: "Transfer Alındı", transfer_sent: "Transfer Gönderildi", completed: "Tamamlandı",
        amount: "Transfer Tutarı", beneficiary_name: "Alıcı Adı", iban: "IBAN / Hesap Numarası",
        bic: "Banka Kodu (BIC / SWIFT)", bank_name: "Banka Adı", reason: "Transfer Nedeni",
        continue: "Devam Et", identity_verification: "Kimlik Doğrulama", pending_transfer_details: "Bekleyen Transfer Detayları",
        cancel_transfer: "Transferi İptal Et", enter_activation_code: "Transfer aktivasyon kodunu girin",
        activation_code: "Aktivasyon Kodu", validate_transfer: "Transferi Onayla",
        transfer_in_progress: "Transfer talimatınız işleniyor...", identity_verified: "Kimlik doğrulaması tamamlandı.",
        progress_desc: "Paranın bankanıza ulaşmasını bekleyin.",
        progress_details_title: "Devam Eden Transfer Detayları", personal_info: "Kişisel Bilgiler",
        account_details: "Hesap Detayları", operation_secured: "İşleminiz güvenli ve kayıtlıdır.",
        no_amount_debited: "Hesabınızdan tutar çekilmedi.", download_receipt: "Makbuzu İndir",
        receipt_thank_you_1: "APP PAY kullandığınız için teşekkürler.", receipt_thank_you_2: "Bu makbuz otomatik oluşturulur.",
        transfer_success: "Transfer Başarıyla Tamamlandı", receipt_subtitle: "TRANSFER MAKBUZU",
        validated_status: "Transfer Onaylandı", success_subtitle: "Transferiniz kaydedildi.",
        transfer_pending: "Transfer Beklemede", pending_subtitle: "Transferiniz doğrulanmayı bekliyor.",
        pending_status: "Beklemede", transfer_failed: "Transfer Engellendi",
        transfer_failed_subtitle: "Transferiniz engellendi. Müşteri hizmetleriyle iletişime geçin.",
        failed_status: "Engellendi", transfer_cancelled: "Transfer İptal Edildi", cancelled_status: "İptal Edildi", refunded_amount: "İade Edilen Tutar",
        amount_sent: "GÖNDERİLEN TUTAR", beneficiary: "Alıcı", date: "Tarih", reference: "Referans",
        back_to_dashboard: "Panele Dön", my_virtual_card: "Sanal Kart", holder: "Kart Sahibi",
        expires: "Son Kullanma", show_details: "Detayları Göster", hide_details: "Detayları Gizle", freeze_card: "Kartı Dondur",
        settings: "Ayarlar", monthly_limit: "Aylık Limit", monthly_spent: "Bu Ay Harcanan", status: "Durum",
        active: "Aktif", type: "Tür", verified: "Doğrulandı", account_holder_premium: "Hesap Sahibi • Premium Müşteri",
        full_name: "Ad Soyad", email_address: "E-posta", phone_number: "Telefon",
        country: "İkamet Ülkesi", account_id: "Benzersiz Kimlik", opening_date: "Açılış Tarihi",
        edit_profile: "Profili Düzenle", security: "Güvenlik", notifications: "Bildirimler",
        no_transactions: "Henüz işlem yok", err_email: "Yanlış e-posta adresi.",
        err_pin: "Yanlış PIN kodu.", err_amount: "Geçersiz tutar.", err_balance: "Yetersiz bakiye.",
        err_fields: "Tüm alanları doldurun.", err_activation: "Yanlış aktivasyon kodu.",
        err_percent: "Tutar izin verilen limiti ({limit}) aşıyor.", err_client_not_found: "Müşteri bulunamadı.",
        err_no_link: "Bağlantı yok.", welcome: "Hoş Geldiniz", login_success: "Giriş başarılı. Hoş geldiniz!",
        transfer_cancelled_toast: "Transfer iptal edildi.", transfer_finalized: "Transfer tamamlandı!",
        err_card_locked: "Kart detayları yetkilendirilmedi.", err_iban_locked: "IBAN görüntüleme yetkilendirilmedi.",
        iban_copied: "IBAN kopyalandı!", swift_copied: "SWIFT kopyalandı!", placeholder_email: "E-posta adresiniz",
        placeholder_pin: "PIN kodunuz", placeholder_activation: "Gizli kodunuzu girin",
        card_footer: "Bu kart APP PAY'ın mülkiyetindedir.", card_security_note: "Son 4 hane ve CVV gizlendi.",
        visa_premium: "Mastercard Premium", bank_details: "Banka Bilgileri", iban_number: "IBAN Numarası",
        swift_code: "SWIFT / BIC Kodu", iban_info_note: "Transfer almak için bu bilgileri kullanın.",
        show_iban: "Tam IBAN'ı Göster", hide_iban: "IBAN'ı Gizle", allowed_limit: "İzin Verilen Limit:",
        limit_percentage: "Limit Yüzdesi:", current_balance: "Mevcut Bakiye:", attempted_amount: "DENENEN TUTAR",
        new_transaction_received: "Yeni işlem alındı!", copied: "Kopyalandı!",
        tap_to_flip: "Kartı çevirmek için dokunun", view_full_card: "Tam numarayı görüntüle",
        flip_card: "Kartı Çevir", view_cvv: "CVV Kodunu Görüntüle", receipt_title: "İŞLEM MAKBUZU",
        receipt_sender: "Gönderen", receipt_thank_you: "APP PAY kullandığınız için teşekkürler.",
        close: "Kapat", confirm_title_warning: "Uyarı", confirm_btn_cancel: "İptal", confirm_btn_ok: "Onayla"
    },
    ko: {
        dashboard: "지갑", personal_iban: "개인 IBAN", logout: "로그아웃", profile: "프로필",
        transfer_menu: "송금", transfer_btn: "송금하기", virtual_card_btn: "가상 카드",
        available_balance: "사용 가능 잔액", account_subtitle: "모든 필요를 위한 계좌", see_iban: "내 IBAN 보기",
        make_transfer: "송금하기", see_card: "가상 카드", international_transfer: "국제 송금하기",
        transfer_warning: "최종 확인 후 송금 처리에는 1~3분이 소요됩니다.",
        transactions_history: "거래 내역", total_balance: "총 잔액", transactions_label: "거래",
        currency_label: "통화", view_all: "전체 보기", today: "오늘", yesterday: "어제",
        transfer_received: "송금 수신", transfer_sent: "송금 발신", completed: "완료",
        amount: "송금 금액", beneficiary_name: "수취인 이름", iban: "IBAN / 계좌 번호",
        bic: "은행 코드 (BIC / SWIFT)", bank_name: "은행 이름", reason: "송금 사유",
        continue: "계속", identity_verification: "신원 확인", pending_transfer_details: "대기 중인 송금 세부 정보",
        cancel_transfer: "송금 취소", enter_activation_code: "활성화 코드를 입력하세요",
        activation_code: "활성화 코드", validate_transfer: "송금 확인",
        transfer_in_progress: "송금 주문이 처리 중입니다...", identity_verified: "신원 확인이 완료되었습니다.",
        progress_desc: "자금이 은행에 도착할 때까지 기다려 주세요.",
        progress_details_title: "진행 중인 송금 세부 정보", personal_info: "개인 정보",
        account_details: "계좌 세부 정보", operation_secured: "작업이 안전하게 등록되었습니다.",
        no_amount_debited: "계좌에서 금액이 차감되지 않았습니다.", download_receipt: "영수증 다운로드",
        receipt_thank_you_1: "APP PAY를 이용해 주셔서 감사합니다.", receipt_thank_you_2: "이 영수증은 자동으로 생성됩니다.",
        transfer_success: "송금이 성공적으로 완료되었습니다", receipt_subtitle: "송금 영수증",
        validated_status: "송금 확인됨", success_subtitle: "송금이 등록되었습니다.",
        transfer_pending: "송금 대기 중", pending_subtitle: "송금이 검증을 기다리고 있습니다.",
        pending_status: "대기 중", transfer_failed: "송금 차단됨",
        transfer_failed_subtitle: "송금이 차단되었습니다. 고객 서비스에 문의하십시오.",
        failed_status: "차단됨", transfer_cancelled: "송금 취소됨", cancelled_status: "취소됨", refunded_amount: "환불된 금액",
        amount_sent: "송금액", beneficiary: "수취인", date: "날짜", reference: "참조 번호",
        back_to_dashboard: "대시보드로 돌아가기", my_virtual_card: "가상 카드", holder: "소지자",
        expires: "유효기간", show_details: "세부 정보 표시", hide_details: "세부 정보 숨기기", freeze_card: "카드 정지",
        settings: "설정", monthly_limit: "월 한도", monthly_spent: "이번 달 지출", status: "상태",
        active: "활성", type: "유형", verified: "확인됨", account_holder_premium: "계좌 소유자 • 프리미엄 고객",
        full_name: "전체 이름", email_address: "이메일 주소", phone_number: "전화번호",
        country: "거주 국가", account_id: "고유 ID", opening_date: "개설 날짜",
        edit_profile: "프로필 편집", security: "보안", notifications: "알림",
        no_transactions: "아직 거래 없음", err_email: "잘못된 이메일 주소입니다.",
        err_pin: "잘못된 PIN 코드입니다.", err_amount: "유효하지 않은 금액입니다.", err_balance: "잔액 부족.",
        err_fields: "모든 필드를 작성해 주세요.", err_activation: "잘못된 활성화 코드입니다.",
        err_percent: "금액이 허용 한도({limit})를 초과합니다.", err_client_not_found: "고객을 찾을 수 없습니다.",
        err_no_link: "링크가 없습니다.", welcome: "환영합니다", login_success: "로그인 성공. 환영합니다!",
        transfer_cancelled_toast: "송금이 취소되었습니다.", transfer_finalized: "송금이 완료되었습니다!",
        err_card_locked: "카드 세부 정보 표시가 승인되지 않았습니다.", err_iban_locked: "IBAN 표시가 승인되지 않았습니다.",
        iban_copied: "IBAN이 복사되었습니다!", swift_copied: "SWIFT 코드가 복사되었습니다!", placeholder_email: "이메일 주소",
        placeholder_pin: "PIN 코드", placeholder_activation: "비밀 코드를 입력하세요",
        card_footer: "이 카드는 APP PAY의 독점 재산입니다.", card_security_note: "마지막 4자리와 CVV가 마스킹되었습니다.",
        visa_premium: "Mastercard Premium", bank_details: "은행 정보", iban_number: "IBAN 번호",
        swift_code: "SWIFT / BIC 코드", iban_info_note: "송금을 받으려면 이 정보를 사용하십시오.",
        show_iban: "전체 IBAN 표시", hide_iban: "IBAN 숨기기", allowed_limit: "허용 한도:",
        limit_percentage: "한도 비율:", current_balance: "현재 잔액:", attempted_amount: "시도 금액",
        new_transaction_received: "새 거래가 수신되었습니다!", copied: "복사되었습니다!",
        tap_to_flip: "카드를 탭하여 뒤집기", view_full_card: "전체 번호 보기",
        flip_card: "카드 뒤집기", view_cvv: "CVV 코드 보기", receipt_title: "거래 영수증",
        receipt_sender: "발신자", receipt_thank_you: "APP PAY를 이용해 주셔서 감사합니다.",
        close: "닫기", confirm_title_warning: "경고", confirm_btn_cancel: "취소", confirm_btn_ok: "확인"
    },
    vi: {
        dashboard: "Ví", personal_iban: "IBAN Cá nhân", logout: "Đăng xuất", profile: "Hồ sơ",
        transfer_menu: "Chuyển khoản", transfer_btn: "Thực hiện chuyển khoản", virtual_card_btn: "Thẻ ảo",
        available_balance: "Số dư khả dụng", account_subtitle: "Tài khoản cho mọi nhu cầu", see_iban: "Xem IBAN của tôi",
        make_transfer: "Thực hiện chuyển khoản", see_card: "Thẻ ảo", international_transfer: "Thực hiện chuyển khoản quốc tế",
        transfer_warning: "Xử lý chuyển khoản mất 1-3 phút sau khi xác minh.",
        transactions_history: "Lịch sử giao dịch", total_balance: "Tổng số dư", transactions_label: "Giao dịch",
        currency_label: "Tiền tệ", view_all: "Xem tất cả", today: "Hôm nay", yesterday: "Hôm qua",
        transfer_received: "Đã nhận chuyển khoản", transfer_sent: "Đã gửi chuyển khoản", completed: "Hoàn thành",
        amount: "Số tiền chuyển khoản", beneficiary_name: "Tên người thụ hưởng", iban: "IBAN / Số tài khoản",
        bic: "Mã ngân hàng (BIC / SWIFT)", bank_name: "Tên ngân hàng", reason: "Lý do chuyển khoản",
        continue: "Tiếp tục", identity_verification: "Xác minh danh tính", pending_transfer_details: "Chi tiết chuyển khoản đang chờ",
        cancel_transfer: "Hủy chuyển khoản", enter_activation_code: "Nhập mã kích hoạt",
        activation_code: "Mã kích hoạt", validate_transfer: "Xác nhận chuyển khoản",
        transfer_in_progress: "Lệnh chuyển khoản đang được xử lý...", identity_verified: "Xác minh thành công.",
        progress_desc: "Đợi tiền được chuyển đến ngân hàng của bạn.",
        progress_details_title: "Chi tiết chuyển khoản đang xử lý", personal_info: "Thông tin cá nhân",
        account_details: "Chi tiết tài khoản", operation_secured: "Hoạt động được bảo mật và ghi nhận.",
        no_amount_debited: "Không có số tiền nào bị trừ.", download_receipt: "Tải xuống biên lai",
        receipt_thank_you_1: "Cảm ơn bạn đã sử dụng APP PAY.", receipt_thank_you_2: "Biên lai này được tạo tự động.",
        transfer_success: "Chuyển khoản thành công", receipt_subtitle: "BIÊN LAI CHUYỂN KHOẢN",
        validated_status: "Chuyển khoản đã xác nhận", success_subtitle: "Chuyển khoản đã được ghi nhận.",
        transfer_pending: "Chuyển khoản đang chờ", pending_subtitle: "Chuyển khoản đang chờ xác nhận.",
        pending_status: "Đang chờ", transfer_failed: "Chuyển khoản bị chặn",
        transfer_failed_subtitle: "Chuyển khoản bị hệ thống chặn. Vui lòng liên hệ dịch vụ khách hàng.",
        failed_status: "Bị chặn", transfer_cancelled: "Chuyển khoản đã hủy", cancelled_status: "Đã hủy", refunded_amount: "Số tiền hoàn lại",
        amount_sent: "SỐ TIỀN ĐÃ GỬI", beneficiary: "Người thụ hưởng", date: "Ngày", reference: "Mã tham chiếu",
        back_to_dashboard: "Quay lại bảng điều khiển", my_virtual_card: "Thẻ ảo", holder: "Chủ thẻ",
        expires: "Hết hạn", show_details: "Hiển thị chi tiết", hide_details: "Ẩn chi tiết", freeze_card: "Đóng băng thẻ",
        settings: "Cài đặt", monthly_limit: "Hạn mức hàng tháng", monthly_spent: "Chi tiêu trong tháng", status: "Trạng thái",
        active: "Hoạt động", type: "Loại", verified: "Đã xác minh", account_holder_premium: "Chủ tài khoản • Khách hàng cao cấp",
        full_name: "Họ và tên", email_address: "Địa chỉ email", phone_number: "Số điện thoại",
        country: "Quốc gia cư trú", account_id: "ID duy nhất", opening_date: "Ngày mở",
        edit_profile: "Chỉnh sửa hồ sơ", security: "Bảo mật", notifications: "Thông báo",
        no_transactions: "Chưa có giao dịch", err_email: "Địa chỉ email không chính xác.",
        err_pin: "Mã PIN không chính xác.", err_amount: "Số tiền không hợp lệ.", err_balance: "Số dư không đủ.",
        err_fields: "Vui lòng điền tất cả các trường.", err_activation: "Mã kích hoạt không chính xác.",
        err_percent: "Số tiền vượt quá giới hạn ({limit}).", err_client_not_found: "Không tìm thấy khách hàng.",
        err_no_link: "Không có liên kết.", welcome: "Chào mừng", login_success: "Đăng nhập thành công. Chào mừng!",
        transfer_cancelled_toast: "Đã hủy chuyển khoản.", transfer_finalized: "Chuyển khoản đã hoàn thành!",
        err_card_locked: "Hiển thị chi tiết thẻ không được cho phép.", err_iban_locked: "Hiển thị IBAN không được cho phép.",
        iban_copied: "Đã sao chép IBAN!", swift_copied: "Đã sao chép SWIFT!", placeholder_email: "Địa chỉ email của bạn",
        placeholder_pin: "Mã PIN của bạn", placeholder_activation: "Nhập mã bí mật",
        card_footer: "Thẻ này là tài sản độc quyền của APP PAY.", card_security_note: "4 chữ số cuối và CVV đã được ẩn.",
        visa_premium: "Mastercard Premium", bank_details: "Thông tin ngân hàng", iban_number: "Số IBAN",
        swift_code: "Mã SWIFT / BIC", iban_info_note: "Sử dụng thông tin này để nhận chuyển khoản.",
        show_iban: "Hiển thị IBAN đầy đủ", hide_iban: "Ẩn IBAN", allowed_limit: "Giới hạn cho phép:",
        limit_percentage: "Phần trăm giới hạn:", current_balance: "Số dư hiện tại:", attempted_amount: "SỐ TIỀN ĐÃ THỬ",
        new_transaction_received: "Đã nhận giao dịch mới!", copied: "Đã sao chép!",
        tap_to_flip: "Nhấn vào thẻ để lật", view_full_card: "Xem số đầy đủ",
        flip_card: "Lật thẻ", view_cvv: "Xem mã CVV", receipt_title: "BIÊN LAI GIAO DỊCH",
        receipt_sender: "Người gửi", receipt_thank_you: "Cảm ơn bạn đã sử dụng APP PAY.",
        close: "Đóng", confirm_title_warning: "Cảnh báo", confirm_btn_cancel: "Hủy", confirm_btn_ok: "Xác nhận"
    }
};

// ============================================================
// 🆕 25 LANGUES SUPPLÉMENTAIRES (via Object.assign — aucun risque)
// → Total de base : 40 langues
// ============================================================
Object.assign(TRANSLATIONS, {
    hi: {
        dashboard: "वॉलेट", personal_iban: "व्यक्तिगत IBAN", logout: "लॉग आउट", profile: "प्रोफ़ाइल",
        transfer_menu: "स्थानांतरण", transfer_btn: "स्थानांतरण करें", virtual_card_btn: "वर्चुअल कार्ड",
        available_balance: "उपलब्ध शेष", account_subtitle: "आपकी सभी आवश्यकताओं के लिए खाता", see_iban: "मेरा IBAN देखें",
        make_transfer: "स्थानांतरण करें", see_card: "वर्चुअल कार्ड", international_transfer: "अंतर्राष्ट्रीय स्थानांतरण करें",
        transfer_warning: "अंतिम सत्यापन के बाद स्थानांतरण प्रसंस्करण में 1 से 3 मिनट लगते हैं।",
        transactions_history: "लेनदेन इतिहास", total_balance: "कुल शेष", transactions_label: "लेनदेन",
        currency_label: "मुद्रा", view_all: "सभी देखें", today: "आज", yesterday: "कल",
        transfer_received: "स्थानांतरण प्राप्त", transfer_sent: "स्थानांतरण भेजा", completed: "पूर्ण",
        amount: "स्थानांतरण राशि", beneficiary_name: "लाभार्थी का नाम", iban: "IBAN / खाता संख्या",
        bic: "बैंक कोड (BIC / SWIFT)", bank_name: "बैंक का नाम", reason: "स्थानांतरण कारण",
        continue: "जारी रखें", identity_verification: "पहचान सत्यापन", pending_transfer_details: "लंबित स्थानांतरण विवरण",
        cancel_transfer: "स्थानांतरण रद्द करें", enter_activation_code: "स्थानांतरण सक्रियण कोड दर्ज करें",
        activation_code: "सक्रियण कोड", validate_transfer: "स्थानांतरण सत्यापित करें",
        transfer_in_progress: "आपका स्थानांतरण प्रगति पर है...", identity_verified: "पहचान सत्यापन सफल।",
        progress_desc: "कृपया इस पृष्ठ को ताज़ा करने से पहले धनराशि आपके बैंक तक पहुँचने की प्रतीक्षा करें।",
        progress_details_title: "प्रगति पर स्थानांतरण विवरण", personal_info: "व्यक्तिगत जानकारी",
        account_details: "खाता विवरण", operation_secured: "आपका संचालन सुरक्षित है।",
        no_amount_debited: "आपके खाते से कोई राशि नहीं काटी गई।", download_receipt: "रसीद डाउनलोड करें",
        receipt_thank_you_1: "APP PAY का उपयोग करने के लिए धन्यवाद।", receipt_thank_you_2: "यह रसीद स्वचालित रूप से उत्पन्न होती है।",
        transfer_success: "स्थानांतरण सफलतापूर्वक पूर्ण", receipt_subtitle: "स्थानांतरण रसीद",
        validated_status: "स्थानांतरण की पुष्टि", success_subtitle: "आपका स्थानांतरण दर्ज हो गया है।",
        transfer_pending: "स्थानांतरण लंबित", pending_subtitle: "आपका स्थानांतरण सत्यापन की प्रतीक्षा में है।",
        pending_status: "लंबित", transfer_failed: "स्थानांतरण अवरुद्ध",
        transfer_failed_subtitle: "आपका स्थानांतरण सिस्टम द्वारा अवरुद्ध किया गया था। कृपया ग्राहक सेवा से संपर्क करें।",
        failed_status: "अवरुद्ध", transfer_cancelled: "स्थानांतरण रद्द", cancelled_status: "रद्द", refunded_amount: "वापस राशि",
        amount_sent: "भेजी गई राशि", beneficiary: "लाभार्थी", date: "तारीख", reference: "संदर्भ",
        back_to_dashboard: "डैशबोर्ड पर वापस", my_virtual_card: "वर्चुअल कार्ड", holder: "धारक",
        expires: "समाप्ति", show_details: "विवरण दिखाएं", hide_details: "विवरण छिपाएं", freeze_card: "कार्ड फ्रीज़ करें",
        settings: "सेटिंग्स", monthly_limit: "मासिक सीमा", monthly_spent: "इस महीने का खर्च", status: "स्थिति",
        active: "सक्रिय", type: "प्रकार", verified: "सत्यापित", account_holder_premium: "खाता धारक • प्रीमियम ग्राहक",
        full_name: "पूरा नाम", email_address: "ईमेल पता", phone_number: "फ़ोन नंबर",
        country: "निवास देश", account_id: "विशिष्ट ID", opening_date: "खोलने की तारीख",
        edit_profile: "प्रोफ़ाइल संपादित करें", security: "सुरक्षा", notifications: "सूचनाएं",
        no_transactions: "अभी तक कोई लेनदेन नहीं", err_email: "गलत ईमेल पता।",
        err_pin: "गलत PIN कोड।", err_amount: "अमान्य राशि।", err_balance: "अपर्याप्त शेष।",
        err_fields: "कृपया सभी फ़ील्ड भरें।", err_activation: "गलत सक्रियण कोड।",
        err_percent: "राशि अनुमत सीमा ({limit}) से अधिक है।", err_client_not_found: "ग्राहक नहीं मिला।",
        err_no_link: "कोई लिंक नहीं।", welcome: "स्वागत है", login_success: "लॉगिन सफल। स्वागत है!",
        transfer_cancelled_toast: "स्थानांतरण रद्द।", transfer_finalized: "स्थानांतरण पूर्ण!",
        err_card_locked: "कार्ड विवरण प्रदर्शन अधिकृत नहीं है।", err_iban_locked: "IBAN प्रदर्शन अधिकृत नहीं है।",
        iban_copied: "IBAN कॉपी हुआ!", swift_copied: "SWIFT कॉपी हुआ!", placeholder_email: "आपका ईमेल पता",
        placeholder_pin: "आपका PIN कोड", placeholder_activation: "अपना गुप्त कोड दर्ज करें",
        card_footer: "यह कार्ड APP PAY की विशेष संपत्ति है।", card_security_note: "अंतिम 4 अंक और CVV छिपाए गए हैं।",
        visa_premium: "Mastercard Premium", bank_details: "बैंक विवरण", iban_number: "IBAN नंबर",
        swift_code: "SWIFT / BIC कोड", iban_info_note: "स्थानांतरण प्राप्त करने के लिए इसका उपयोग करें।",
        show_iban: "पूरा IBAN दिखाएं", hide_iban: "IBAN छिपाएं", allowed_limit: "अनुमत सीमा:",
        limit_percentage: "सीमा प्रतिशत:", current_balance: "वर्तमान शेष:", attempted_amount: "प्रयास राशि",
        new_transaction_received: "नया लेनदेन प्राप्त!", copied: "कॉपी हुआ!",
        tap_to_flip: "कार्ड पलटने के लिए टैप करें", view_full_card: "पूरा नंबर देखें",
        flip_card: "कार्ड पलटें", view_cvv: "CVV कोड देखें", receipt_title: "लेनदेन रसीद",
        receipt_sender: "प्रेषक", receipt_thank_you: "APP PAY का उपयोग करने के लिए धन्यवाद।",
        close: "बंद करें", confirm_title_warning: "चेतावनी", confirm_btn_cancel: "रद्द करें", confirm_btn_ok: "पुष्टि करें"
    },
    bn: {
        dashboard: "ওয়ালেট", personal_iban: "ব্যক্তিগত IBAN", logout: "লগ আউট", profile: "প্রোফাইল",
        transfer_menu: "স্থানান্তর", transfer_btn: "স্থানান্তর করুন", virtual_card_btn: "ভার্চুয়াল কার্ড",
        available_balance: "উপলব্ধ ব্যালেন্স", account_subtitle: "আপনার সমস্ত প্রয়োজনের জন্য অ্যাকাউন্ট", see_iban: "আমার IBAN দেখুন",
        make_transfer: "স্থানান্তর করুন", see_card: "ভার্চুয়াল কার্ড", international_transfer: "আন্তর্জাতিক স্থানান্তর করুন",
        transfer_warning: "চূড়ান্ত যাচাইয়ের পরে স্থানান্তর প্রক্রিয়াকরণে 1 থেকে 3 মিনিট সময় লাগে।",
        transactions_history: "লেনদেনের ইতিহাস", total_balance: "মোট ব্যালেন্স", transactions_label: "লেনদেন",
        currency_label: "মুদ্রা", view_all: "সব দেখুন", today: "আজ", yesterday: "গতকাল",
        transfer_received: "স্থানান্তর প্রাপ্ত", transfer_sent: "স্থানান্তর পাঠানো", completed: "সম্পন্ন",
        amount: "স্থানান্তরের পরিমাণ", beneficiary_name: "সুবিধাভোগীর নাম", iban: "IBAN / অ্যাকাউন্ট নম্বর",
        bic: "ব্যাংক কোড (BIC / SWIFT)", bank_name: "ব্যাংকের নাম", reason: "স্থানান্তরের কারণ",
        continue: "চালিয়ে যান", identity_verification: "পরিচয় যাচাইকরণ", pending_transfer_details: "বিচারাধীন স্থানান্তরের বিবরণ",
        cancel_transfer: "স্থানান্তর বাতিল করুন", enter_activation_code: "স্থানান্তর সক্রিয়করণ কোড লিখুন",
        activation_code: "সক্রিয়করণ কোড", validate_transfer: "স্থানান্তর যাচাই করুন",
        transfer_in_progress: "আপনার স্থানান্তর চলছে...", identity_verified: "পরিচয় যাচাইকরণ সফল।",
        progress_desc: "এই পৃষ্ঠাটি রিফ্রেশ করার আগে তহবিল আপনার ব্যাংকে পৌঁছানোর জন্য অপেক্ষা করুন।",
        progress_details_title: "চলমান স্থানান্তরের বিবরণ", personal_info: "ব্যক্তিগত তথ্য",
        account_details: "অ্যাকাউন্টের বিবরণ", operation_secured: "আপনার অপারেশন সুরক্ষিত।",
        no_amount_debited: "আপনার অ্যাকাউন্ট থেকে কোনও পরিমাণ কাটা হয়নি।", download_receipt: "রসিদ ডাউনলোড করুন",
        receipt_thank_you_1: "APP PAY ব্যবহার করার জন্য ধন্যবাদ।", receipt_thank_you_2: "এই রসিদ স্বয়ংক্রিয়ভাবে তৈরি হয়।",
        transfer_success: "স্থানান্তর সফলভাবে সম্পন্ন", receipt_subtitle: "স্থানান্তর রসিদ",
        validated_status: "স্থানান্তর নিশ্চিত", success_subtitle: "আপনার স্থানান্তর নিবন্ধিত হয়েছে।",
        transfer_pending: "স্থানান্তর বিচারাধীন", pending_subtitle: "আপনার স্থানান্তর যাচাইয়ের অপেক্ষায়।",
        pending_status: "বিচারাধীন", transfer_failed: "স্থানান্তর অবরুদ্ধ",
        transfer_failed_subtitle: "আপনার স্থানান্তর সিস্টেম দ্বারা অবরুদ্ধ হয়েছে। গ্রাহক সেবায় যোগাযোগ করুন।",
        failed_status: "অবরুদ্ধ", transfer_cancelled: "স্থানান্তর বাতিল", cancelled_status: "বাতিল", refunded_amount: "ফেরত দেওয়া পরিমাণ",
        amount_sent: "পাঠানো পরিমাণ", beneficiary: "সুবিধাভোগী", date: "তারিখ", reference: "রেফারেন্স",
        back_to_dashboard: "ড্যাশবোর্ডে ফিরে যান", my_virtual_card: "ভার্চুয়াল কার্ড", holder: "ধারক",
        expires: "মেয়াদ শেষ", show_details: "বিবরণ দেখান", hide_details: "বিবরণ লুকান", freeze_card: "কার্ড ফ্রিজ করুন",
        settings: "সেটিংস", monthly_limit: "মাসিক সীমা", monthly_spent: "এই মাসে খরচ", status: "অবস্থা",
        active: "সক্রিয়", type: "ধরন", verified: "যাচাইকৃত", account_holder_premium: "অ্যাকাউন্ট ধারক • প্রিমিয়াম গ্রাহক",
        full_name: "পুরো নাম", email_address: "ইমেল ঠিকানা", phone_number: "ফোন নম্বর",
        country: "বসবাসের দেশ", account_id: "অনন্য ID", opening_date: "খোলার তারিখ",
        edit_profile: "প্রোফাইল সম্পাদনা করুন", security: "নিরাপত্তা", notifications: "বিজ্ঞপ্তি",
        no_transactions: "এখনও কোনও লেনদেন নেই", err_email: "ভুল ইমেল ঠিকানা।",
        err_pin: "ভুল PIN কোড।", err_amount: "অবৈধ পরিমাণ।", err_balance: "অপর্যাপ্ত ব্যালেন্স।",
        err_fields: "সমস্ত ক্ষেত্র পূরণ করুন।", err_activation: "ভুল সক্রিয়করণ কোড।",
        err_percent: "পরিমাণ অনুমোদিত সীমা ({limit}) ছাড়িয়ে গেছে।", err_client_not_found: "গ্রাহক পাওয়া যায়নি।",
        err_no_link: "কোনও লিঙ্ক নেই।", welcome: "স্বাগতম", login_success: "লগইন সফল। স্বাগতম!",
        transfer_cancelled_toast: "স্থানান্তর বাতিল।", transfer_finalized: "স্থানান্তর সম্পন্ন!",
        err_card_locked: "কার্ড বিবরণ প্রদর্শন অনুমোদিত নয়।", err_iban_locked: "IBAN প্রদর্শন অনুমোদিত নয়।",
        iban_copied: "IBAN কপি হয়েছে!", swift_copied: "SWIFT কপি হয়েছে!", placeholder_email: "আপনার ইমেল ঠিকানা",
        placeholder_pin: "আপনার PIN কোড", placeholder_activation: "আপনার গোপন কোড লিখুন",
        card_footer: "এই কার্ড APP PAY-এর একচেটিয়া সম্পত্তি।", card_security_note: "শেষ 4 সংখ্যা এবং CVV লুকানো হয়েছে।",
        visa_premium: "Mastercard Premium", bank_details: "ব্যাংক বিবরণ", iban_number: "IBAN নম্বর",
        swift_code: "SWIFT / BIC কোড", iban_info_note: "স্থানান্তর পেতে এই তথ্য ব্যবহার করুন।",
        show_iban: "সম্পূর্ণ IBAN দেখান", hide_iban: "IBAN লুকান", allowed_limit: "অনুমোদিত সীমা:",
        limit_percentage: "সীমা শতাংশ:", current_balance: "বর্তমান ব্যালেন্স:", attempted_amount: "চেষ্টা করা পরিমাণ",
        new_transaction_received: "নতুন লেনদেন পাওয়া গেছে!", copied: "কপি হয়েছে!",
        tap_to_flip: "কার্ড উল্টাতে ট্যাপ করুন", view_full_card: "সম্পূর্ণ নম্বর দেখুন",
        flip_card: "কার্ড উল্টান", view_cvv: "CVV কোড দেখুন", receipt_title: "লেনদেন রসিদ",
        receipt_sender: "প্রেরক", receipt_thank_you: "APP PAY ব্যবহার করার জন্য ধন্যবাদ।",
        close: "বন্ধ করুন", confirm_title_warning: "সতর্কতা", confirm_btn_cancel: "বাতিল", confirm_btn_ok: "নিশ্চিত"
    },
    ur: {
        dashboard: "والٹ", personal_iban: "ذاتی IBAN", logout: "لاگ آؤٹ", profile: "پروفائل",
        transfer_menu: "منتقلی", transfer_btn: "منتقلی کریں", virtual_card_btn: "ورچوئل کارڈ",
        available_balance: "دستیابی بیلنس", account_subtitle: "آپ کی تمام ضروریات کے لیے اکاؤنٹ", see_iban: "میرا IBAN دیکھیں",
        make_transfer: "منتقلی کریں", see_card: "ورچوئل کارڈ", international_transfer: "بین الاقوامی منتقلی کریں",
        transfer_warning: "حتمی تصدیق کے بعد منتقلی میں 1 سے 3 منٹ لگتے ہیں۔",
        transactions_history: "لین دین کی تاریخ", total_balance: "کل بیلنس", transactions_label: "لین دین",
        currency_label: "کرنسی", view_all: "سب دیکھیں", today: "آج", yesterday: "کل",
        transfer_received: "منتقلی موصول", transfer_sent: "منتقلی بھیجی گئی", completed: "مکمل",
        amount: "منتقلی کی رقم", beneficiary_name: "مستفید کا نام", iban: "IBAN / اکاؤنٹ نمبر",
        bic: "بینک کوڈ (BIC / SWIFT)", bank_name: "بینک کا نام", reason: "منتقلی کی وجہ",
        continue: "جاری رکھیں", identity_verification: "شناخت کی تصدیق", pending_transfer_details: "زیر التواء منتقلی کی تفصیلات",
        cancel_transfer: "منتقلی منسوخ کریں", enter_activation_code: "منتقلی ایکٹیویشن کوڈ درج کریں",
        activation_code: "ایکٹیویشن کوڈ", validate_transfer: "منتقلی کی تصدیق کریں",
        transfer_in_progress: "آپ کی منتقلی جاری ہے...", identity_verified: "شناخت کی تصدیق کامیاب۔",
        progress_desc: "براہ کرم اس صفحے کو ریفریش کرنے سے پہلے رقم آپ کے بینک تک پہنچنے کا انتظار کریں۔",
        progress_details_title: "جاری منتقلی کی تفصیلات", personal_info: "ذاتی معلومات",
        account_details: "اکاؤنٹ کی تفصیلات", operation_secured: "آپ کا آپریشن محفوظ ہے۔",
        no_amount_debited: "آپ کے اکاؤنٹ سے کوئی رقم نہیں کاٹی گئی۔", download_receipt: "رسید ڈاؤن لوڈ کریں",
        receipt_thank_you_1: "APP PAY استعمال کرنے کا شکریہ۔", receipt_thank_you_2: "یہ رسید خودکار طور پر بنتی ہے۔",
        transfer_success: "منتقلی کامیابی سے مکمل", receipt_subtitle: "منتقلی رسید",
        validated_status: "منتقلی کی تصدیق", success_subtitle: "آپ کی منتقلی رجسٹر ہو گئی ہے۔",
        transfer_pending: "منتقلی زیر التواء", pending_subtitle: "آپ کی منتقلی تصدیق کی منتظر ہے۔",
        pending_status: "زیر التواء", transfer_failed: "منتقلی بلاک",
        transfer_failed_subtitle: "آپ کی منتقلی سسٹم نے بلاک کر دی۔ کسٹمر سروس سے رابطہ کریں۔",
        failed_status: "بلاک", transfer_cancelled: "منتقلی منسوخ", cancelled_status: "منسوخ", refunded_amount: "واپس رقم",
        amount_sent: "بھیجی گئی رقم", beneficiary: "مستفید", date: "تاریخ", reference: "حوالہ",
        back_to_dashboard: "ڈیش بورڈ پر واپس", my_virtual_card: "ورچوئل کارڈ", holder: "حامل",
        expires: "میعاد ختم", show_details: "تفصیلات دکھائیں", hide_details: "تفصیلات چھپائیں", freeze_card: "کارڈ منجمد کریں",
        settings: "ترتیبات", monthly_limit: "ماہانہ حد", monthly_spent: "اس ماہ کا خرچ", status: "حالت",
        active: "فعال", type: "قسم", verified: "تصدیق شدہ", account_holder_premium: "اکاؤنٹ ہولڈر • پریمیم کلائنٹ",
        full_name: "پورا نام", email_address: "ای میل پتہ", phone_number: "فون نمبر",
        country: "رہائش کا ملک", account_id: "منفرد ID", opening_date: "کھولنے کی تاریخ",
        edit_profile: "پروفائل میں ترمیم", security: "سیکیورٹی", notifications: "اطلاعات",
        no_transactions: "ابھی کوئی لین دین نہیں", err_email: "غلط ای میل پتہ۔",
        err_pin: "غلط PIN کوڈ۔", err_amount: "غلط رقم۔", err_balance: "ناکافی بیلنس۔",
        err_fields: "تمام فیلڈز بھریں۔", err_activation: "غلط ایکٹیویشن کوڈ۔",
        err_percent: "رقم اجازت شدہ حد ({limit}) سے زیادہ ہے۔", err_client_not_found: "کلائنٹ نہیں ملا۔",
        err_no_link: "کوئی لنک نہیں۔", welcome: "خوش آمدید", login_success: "لاگ ان کامیاب۔ خوش آمدید!",
        transfer_cancelled_toast: "منتقلی منسوخ۔", transfer_finalized: "منتقلی مکمل!",
        err_card_locked: "کارڈ تفصیلات کی نمائش مجاز نہیں۔", err_iban_locked: "IBAN کی نمائش مجاز نہیں۔",
        iban_copied: "IBAN کاپی ہو گیا!", swift_copied: "SWIFT کاپی ہو گیا!", placeholder_email: "آپ کا ای میل پتہ",
        placeholder_pin: "آپ کا PIN کوڈ", placeholder_activation: "اپنا خفیہ کوڈ درج کریں",
        card_footer: "یہ کارڈ APP PAY کی خصوصی ملکیت ہے۔", card_security_note: "آخری 4 ہندسے اور CVV چھپائے گئے ہیں۔",
        visa_premium: "Mastercard Premium", bank_details: "بینک تفصیلات", iban_number: "IBAN نمبر",
        swift_code: "SWIFT / BIC کوڈ", iban_info_note: "منتقلی وصول کرنے کے لیے یہ استعمال کریں۔",
        show_iban: "مکمل IBAN دکھائیں", hide_iban: "IBAN چھپائیں", allowed_limit: "اجازت شدہ حد:",
        limit_percentage: "حد فیصد:", current_balance: "موجودہ بیلنس:", attempted_amount: "کوشش کی رقم",
        new_transaction_received: "نیا لین دین موصول!", copied: "کاپی ہو گیا!",
        tap_to_flip: "کارڈ پلٹنے کے لیے ٹیپ کریں", view_full_card: "مکمل نمبر دیکھیں",
        flip_card: "کارڈ پلٹیں", view_cvv: "CVV کوڈ دیکھیں", receipt_title: "لین دین رسید",
        receipt_sender: "بھیجنے والا", receipt_thank_you: "APP PAY استعمال کرنے کا شکریہ۔",
        close: "بند کریں", confirm_title_warning: "انتباہ", confirm_btn_cancel: "منسوخ", confirm_btn_ok: "تصدیق"
    },
    fa: {
        dashboard: "کیف پول", personal_iban: "IBAN شخصی", logout: "خروج", profile: "پروفایل",
        transfer_menu: "انتقال", transfer_btn: "انتقال انجام دهید", virtual_card_btn: "کارت مجازی",
        available_balance: "موجودی قابل استفاده", account_subtitle: "حساب برای تمام نیازهای شما", see_iban: "مشاهده IBAN من",
        make_transfer: "انتقال انجام دهید", see_card: "کارت مجازی", international_transfer: "انتقال بین‌المللی",
        transfer_warning: "پردازش انتقال پس از تأیید نهایی 1 تا 3 دقیقه طول می‌کشد.",
        transactions_history: "تاریخچه تراکنش‌ها", total_balance: "موجودی کل", transactions_label: "تراکنش‌ها",
        currency_label: "ارز", view_all: "مشاهده همه", today: "امروز", yesterday: "دیروز",
        transfer_received: "انتقال دریافت شد", transfer_sent: "انتقال ارسال شد", completed: "تکمیل",
        amount: "مبلغ انتقال", beneficiary_name: "نام ذی‌نفع", iban: "IBAN / شماره حساب",
        bic: "کد بانک (BIC / SWIFT)", bank_name: "نام بانک", reason: "دلیل انتقال",
        continue: "ادامه", identity_verification: "احراز هویت", pending_transfer_details: "جزئیات انتقال در انتظار",
        cancel_transfer: "لغو انتقال", enter_activation_code: "کد فعال‌سازی انتقال را وارد کنید",
        activation_code: "کد فعال‌سازی", validate_transfer: "تأیید انتقال",
        transfer_in_progress: "دستور انتقال شما در حال پردازش است...", identity_verified: "احراز هویت موفق.",
        progress_desc: "لطفاً قبل از به‌روزرسانی این صفحه منتظر انتقال وجه به بانک خود بمانید.",
        progress_details_title: "جزئیات انتقال در حال انجام", personal_info: "اطلاعات شخصی",
        account_details: "جزئیات حساب", operation_secured: "عملیات شما ایمن و ثبت شده است.",
        no_amount_debited: "هیچ مبلغی از حساب شما کسر نشده است.", download_receipt: "دانلود رسید",
        receipt_thank_you_1: "از استفاده از APP PAY متشکریم.", receipt_thank_you_2: "این رسید به‌طور خودکار ایجاد می‌شود.",
        transfer_success: "انتقال با موفقیت انجام شد", receipt_subtitle: "رسید انتقال",
        validated_status: "انتقال تأیید شد", success_subtitle: "انتقال شما ثبت شده است.",
        transfer_pending: "انتقال در انتظار", pending_subtitle: "انتقال شما در انتظار تأیید است.",
        pending_status: "در انتظار", transfer_failed: "انتقال مسدود",
        transfer_failed_subtitle: "انتقال شما توسط سیستم مسدود شد. لطفاً با خدمات مشتری تماس بگیرید.",
        failed_status: "مسدود", transfer_cancelled: "انتقال لغو شد", cancelled_status: "لغو", refunded_amount: "مبلغ بازگشتی",
        amount_sent: "مبلغ ارسالی", beneficiary: "ذی‌نفع", date: "تاریخ", reference: "مرجع",
        back_to_dashboard: "بازگشت به داشبورد", my_virtual_card: "کارت مجازی", holder: "دارنده",
        expires: "انقضا", show_details: "نمایش جزئیات", hide_details: "پنهان کردن جزئیات", freeze_card: "مسدودسازی کارت",
        settings: "تنظیمات", monthly_limit: "سقف ماهانه", monthly_spent: "هزینه این ماه", status: "وضعیت",
        active: "فعال", type: "نوع", verified: "تأیید شده", account_holder_premium: "صاحب حساب • مشتری ویژه",
        full_name: "نام کامل", email_address: "آدرس ایمیل", phone_number: "شماره تلفن",
        country: "کشور محل سکونت", account_id: "شناسه یکتا", opening_date: "تاریخ افتتاح",
        edit_profile: "ویرایش پروفایل", security: "امنیت", notifications: "اعلان‌ها",
        no_transactions: "هنوز تراکنشی نیست", err_email: "آدرس ایمیل نادرست.",
        err_pin: "کد PIN نادرست.", err_amount: "مبلغ نامعتبر.", err_balance: "موجودی ناکافی.",
        err_fields: "همه فیلدها را پر کنید.", err_activation: "کد فعال‌سازی نادرست.",
        err_percent: "مبلغ از سقف مجاز ({limit}) بیشتر است.", err_client_not_found: "مشتری یافت نشد.",
        err_no_link: "لینکی وجود ندارد.", welcome: "خوش آمدید", login_success: "ورود موفق. خوش آمدید!",
        transfer_cancelled_toast: "انتقال لغو شد.", transfer_finalized: "انتقال کامل شد!",
        err_card_locked: "نمایش جزئیات کارت مجاز نیست.", err_iban_locked: "نمایش IBAN مجاز نیست.",
        iban_copied: "IBAN کپی شد!", swift_copied: "SWIFT کپی شد!", placeholder_email: "آدرس ایمیل شما",
        placeholder_pin: "کد PIN شما", placeholder_activation: "کد مخفی را وارد کنید",
        card_footer: "این کارت دارایی اختصاصی APP PAY است.", card_security_note: "4 رقم آخر و CVV پنهان شده‌اند.",
        visa_premium: "Mastercard Premium", bank_details: "جزئیات بانکی", iban_number: "شماره IBAN",
        swift_code: "کد SWIFT / BIC", iban_info_note: "از این اطلاعات برای دریافت انتقال استفاده کنید.",
        show_iban: "نمایش IBAN کامل", hide_iban: "پنهان کردن IBAN", allowed_limit: "سقف مجاز:",
        limit_percentage: "درصد سقف:", current_balance: "موجودی فعلی:", attempted_amount: "مبلغ تلاش‌شده",
        new_transaction_received: "تراکنش جدید دریافت شد!", copied: "کپی شد!",
        tap_to_flip: "برای برگرداندن کارت ضربه بزنید", view_full_card: "مشاهده شماره کامل",
        flip_card: "برگرداندن کارت", view_cvv: "مشاهده کد CVV", receipt_title: "رسید تراکنش",
        receipt_sender: "فرستنده", receipt_thank_you: "از استفاده از APP PAY متشکریم.",
        close: "بستن", confirm_title_warning: "هشدار", confirm_btn_cancel: "لغو", confirm_btn_ok: "تأیید"
    },
    id: {
        dashboard: "Dompet", personal_iban: "IBAN Pribadi", logout: "Keluar", profile: "Profil",
        transfer_menu: "Transfer", transfer_btn: "Lakukan transfer", virtual_card_btn: "Kartu Virtual",
        available_balance: "Saldo tersedia", account_subtitle: "Akun untuk semua kebutuhan Anda", see_iban: "Lihat IBAN saya",
        make_transfer: "Lakukan transfer", see_card: "Kartu Virtual", international_transfer: "Lakukan transfer internasional",
        transfer_warning: "Pemrosesan transfer memakan waktu 1 hingga 3 menit setelah verifikasi akhir.",
        transactions_history: "Riwayat transaksi", total_balance: "Saldo total", transactions_label: "Transaksi",
        currency_label: "Mata uang", view_all: "Lihat semua", today: "Hari ini", yesterday: "Kemarin",
        transfer_received: "Transfer diterima", transfer_sent: "Transfer dikirim", completed: "Selesai",
        amount: "Jumlah transfer", beneficiary_name: "Nama penerima", iban: "IBAN / Nomor rekening",
        bic: "Kode bank (BIC / SWIFT)", bank_name: "Nama bank", reason: "Alasan transfer",
        continue: "Lanjutkan", identity_verification: "Verifikasi identitas", pending_transfer_details: "Detail transfer tertunda",
        cancel_transfer: "Batalkan transfer", enter_activation_code: "Masukkan kode aktivasi transfer",
        activation_code: "Kode aktivasi", validate_transfer: "Validasi transfer",
        transfer_in_progress: "Perintah transfer Anda sedang diproses...", identity_verified: "Verifikasi identitas berhasil.",
        progress_desc: "Harap tunggu dana masuk ke bank Anda sebelum menyegarkan halaman ini.",
        progress_details_title: "Detail transfer yang sedang berlangsung", personal_info: "Informasi pribadi",
        account_details: "Detail akun", operation_secured: "Operasi Anda aman dan tercatat.",
        no_amount_debited: "Tidak ada jumlah yang didebit dari akun Anda.", download_receipt: "Unduh bukti",
        receipt_thank_you_1: "Terima kasih telah menggunakan APP PAY.", receipt_thank_you_2: "Bukti ini dibuat secara otomatis.",
        transfer_success: "Transfer berhasil", receipt_subtitle: "BUKTI TRANSFER",
        validated_status: "Transfer dikonfirmasi", success_subtitle: "Transfer Anda telah terdaftar.",
        transfer_pending: "Transfer tertunda", pending_subtitle: "Transfer Anda menunggu validasi.",
        pending_status: "Tertunda", transfer_failed: "Transfer diblokir",
        transfer_failed_subtitle: "Transfer Anda diblokir oleh sistem. Hubungi layanan pelanggan.",
        failed_status: "Diblokir", transfer_cancelled: "Transfer dibatalkan", cancelled_status: "Dibatalkan", refunded_amount: "Jumlah dikembalikan",
        amount_sent: "JUMLAH DIKIRIM", beneficiary: "Penerima", date: "Tanggal", reference: "Referensi",
        back_to_dashboard: "Kembali ke dasbor", my_virtual_card: "Kartu Virtual", holder: "Pemegang",
        expires: "Kadaluarsa", show_details: "Tampilkan detail", hide_details: "Sembunyikan detail", freeze_card: "Bekukan kartu",
        settings: "Pengaturan", monthly_limit: "Batas bulanan", monthly_spent: "Pengeluaran bulan ini", status: "Status",
        active: "Aktif", type: "Jenis", verified: "Terverifikasi", account_holder_premium: "Pemilik akun • Klien Premium",
        full_name: "Nama lengkap", email_address: "Alamat email", phone_number: "Nomor telepon",
        country: "Negara tinggal", account_id: "ID unik", opening_date: "Tanggal pembukaan",
        edit_profile: "Edit profil", security: "Keamanan", notifications: "Notifikasi",
        no_transactions: "Belum ada transaksi", err_email: "Alamat email salah.",
        err_pin: "Kode PIN salah.", err_amount: "Jumlah tidak valid.", err_balance: "Saldo tidak cukup.",
        err_fields: "Isi semua kolom.", err_activation: "Kode aktivasi salah.",
        err_percent: "Jumlah melebihi batas yang diizinkan ({limit}).", err_client_not_found: "Klien tidak ditemukan.",
        err_no_link: "Tidak ada tautan.", welcome: "Selamat datang", login_success: "Login berhasil. Selamat datang!",
        transfer_cancelled_toast: "Transfer dibatalkan.", transfer_finalized: "Transfer selesai!",
        err_card_locked: "Tampilan detail kartu tidak diizinkan.", err_iban_locked: "Tampilan IBAN tidak diizinkan.",
        iban_copied: "IBAN disalin!", swift_copied: "SWIFT disalin!", placeholder_email: "Alamat email Anda",
        placeholder_pin: "Kode PIN Anda", placeholder_activation: "Masukkan kode rahasia Anda",
        card_footer: "Kartu ini adalah properti eksklusif APP PAY.", card_security_note: "4 digit terakhir dan CVV disembunyikan.",
        visa_premium: "Mastercard Premium", bank_details: "Detail bank", iban_number: "Nomor IBAN",
        swift_code: "Kode SWIFT / BIC", iban_info_note: "Gunakan detail ini untuk menerima transfer.",
        show_iban: "Tampilkan IBAN lengkap", hide_iban: "Sembunyikan IBAN", allowed_limit: "Batas yang diizinkan:",
        limit_percentage: "Persentase batas:", current_balance: "Saldo saat ini:", attempted_amount: "JUMLAH DICOBA",
        new_transaction_received: "Transaksi baru diterima!", copied: "Disalin!",
        tap_to_flip: "Ketuk kartu untuk membalik", view_full_card: "Lihat nomor lengkap",
        flip_card: "Balikkan kartu", view_cvv: "Lihat kode CVV", receipt_title: "BUKTI TRANSAKSI",
        receipt_sender: "Pengirim", receipt_thank_you: "Terima kasih telah menggunakan APP PAY.",
        close: "Tutup", confirm_title_warning: "Peringatan", confirm_btn_cancel: "Batal", confirm_btn_ok: "Konfirmasi"
    },
    th: {
        dashboard: "กระเป๋าเงิน", personal_iban: "IBAN ส่วนตัว", logout: "ออกจากระบบ", profile: "โปรไฟล์",
        transfer_menu: "โอนเงิน", transfer_btn: "ทำการโอนเงิน", virtual_card_btn: "บัตรเสมือน",
        available_balance: "ยอดคงเหลือที่ใช้ได้", account_subtitle: "บัญชีสำหรับทุกความต้องการของคุณ", see_iban: "ดู IBAN ของฉัน",
        make_transfer: "ทำการโอนเงิน", see_card: "บัตรเสมือน", international_transfer: "โอนเงินระหว่างประเทศ",
        transfer_warning: "การประมวลผลการโอนใช้เวลา 1 ถึง 3 นาทีหลังการยืนยันครั้งสุดท้าย",
        transactions_history: "ประวัติธุรกรรม", total_balance: "ยอดคงเหลือทั้งหมด", transactions_label: "ธุรกรรม",
        currency_label: "สกุลเงิน", view_all: "ดูทั้งหมด", today: "วันนี้", yesterday: "เมื่อวาน",
        transfer_received: "ได้รับการโอน", transfer_sent: "ส่งการโอน", completed: "เสร็จสิ้น",
        amount: "จำนวนเงินโอน", beneficiary_name: "ชื่อผู้รับ", iban: "IBAN / หมายเลขบัญชี",
        bic: "รหัสธนาคาร (BIC / SWIFT)", bank_name: "ชื่อธนาคาร", reason: "เหตุผลการโอน",
        continue: "ดำเนินการต่อ", identity_verification: "การยืนยันตัวตน", pending_transfer_details: "รายละเอียดการโอนที่รอดำเนินการ",
        cancel_transfer: "ยกเลิกการโอน", enter_activation_code: "กรุณากรอกรหัสเปิดใช้งานการโอน",
        activation_code: "รหัสเปิดใช้งาน", validate_transfer: "ยืนยันการโอน",
        transfer_in_progress: "คำสั่งโอนของคุณกำลังดำเนินการ...", identity_verified: "ยืนยันตัวตนสำเร็จ",
        progress_desc: "โปรดรอให้เงินโอนเข้าธนาคารของคุณก่อนรีเฟรชหน้านี้",
        progress_details_title: "รายละเอียดการโอนที่กำลังดำเนินการ", personal_info: "ข้อมูลส่วนตัว",
        account_details: "รายละเอียดบัญชี", operation_secured: "การดำเนินการของคุณปลอดภัยและบันทึกแล้ว",
        no_amount_debited: "ไม่มีจำนวนเงินใดถูกหักจากบัญชีของคุณ", download_receipt: "ดาวน์โหลดใบเสร็จ",
        receipt_thank_you_1: "ขอบคุณที่ใช้ APP PAY", receipt_thank_you_2: "ใบเสร็จนี้สร้างขึ้นโดยอัตโนมัติ",
        transfer_success: "โอนเงินสำเร็จ", receipt_subtitle: "ใบเสร็จการโอน",
        validated_status: "การโอนได้รับการยืนยัน", success_subtitle: "การโอนของคุณได้ลงทะเบียนแล้ว",
        transfer_pending: "การโอนรอดำเนินการ", pending_subtitle: "การโอนของคุณกำลังรอการยืนยัน",
        pending_status: "รอดำเนินการ", transfer_failed: "การโอนถูกบล็อก",
        transfer_failed_subtitle: "การโอนของคุณถูกบล็อกโดยระบบ โปรดติดต่อฝ่ายบริการลูกค้า",
        failed_status: "ถูกบล็อก", transfer_cancelled: "การโอนถูกยกเลิก", cancelled_status: "ยกเลิกแล้ว", refunded_amount: "จำนวนเงินที่คืน",
        amount_sent: "จำนวนเงินที่ส่ง", beneficiary: "ผู้รับ", date: "วันที่", reference: "อ้างอิง",
        back_to_dashboard: "กลับไปที่แดชบอร์ด", my_virtual_card: "บัตรเสมือน", holder: "ผู้ถือบัตร",
        expires: "หมดอายุ", show_details: "แสดงรายละเอียด", hide_details: "ซ่อนรายละเอียด", freeze_card: "อายัดบัตร",
        settings: "การตั้งค่า", monthly_limit: "วงเงินรายเดือน", monthly_spent: "ค่าใช้จ่ายเดือนนี้", status: "สถานะ",
        active: "ใช้งานอยู่", type: "ประเภท", verified: "ยืนยันแล้ว", account_holder_premium: "เจ้าของบัญชี • ลูกค้าพรีเมียม",
        full_name: "ชื่อเต็ม", email_address: "อีเมล", phone_number: "หมายเลขโทรศัพท์",
        country: "ประเทศที่พำนัก", account_id: "ID เฉพาะ", opening_date: "วันที่เปิด",
        edit_profile: "แก้ไขโปรไฟล์", security: "ความปลอดภัย", notifications: "การแจ้งเตือน",
        no_transactions: "ยังไม่มีธุรกรรม", err_email: "อีเมลไม่ถูกต้อง",
        err_pin: "รหัส PIN ไม่ถูกต้อง", err_amount: "จำนวนเงินไม่ถูกต้อง", err_balance: "ยอดคงเหลือไม่เพียงพอ",
        err_fields: "กรุณากรอกข้อมูลให้ครบ", err_activation: "รหัสเปิดใช้งานไม่ถูกต้อง",
        err_percent: "จำนวนเงินเกินขีดจำกัด ({limit})", err_client_not_found: "ไม่พบลูกค้า",
        err_no_link: "ไม่มีลิงก์", welcome: "ยินดีต้อนรับ", login_success: "เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ!",
        transfer_cancelled_toast: "การโอนถูกยกเลิก", transfer_finalized: "การโอนเสร็จสิ้น!",
        err_card_locked: "การแสดงรายละเอียดบัตรไม่ได้รับอนุญาต", err_iban_locked: "การแสดง IBAN ไม่ได้รับอนุญาต",
        iban_copied: "คัดลอก IBAN แล้ว!", swift_copied: "คัดลอก SWIFT แล้ว!", placeholder_email: "อีเมลของคุณ",
        placeholder_pin: "รหัส PIN ของคุณ", placeholder_activation: "กรอกรหัสลับของคุณ",
        card_footer: "บัตรนี้เป็นทรัพย์สินเฉพาะของ APP PAY", card_security_note: "4 หลักสุดท้ายและ CVV ถูกซ่อน",
        visa_premium: "Mastercard Premium", bank_details: "ข้อมูลธนาคาร", iban_number: "หมายเลข IBAN",
        swift_code: "รหัส SWIFT / BIC", iban_info_note: "ใช้ข้อมูลนี้เพื่อรับการโอน",
        show_iban: "แสดง IBAN เต็ม", hide_iban: "ซ่อน IBAN", allowed_limit: "ขีดจำกัดที่อนุญาต:",
        limit_percentage: "เปอร์เซ็นต์ขีดจำกัด:", current_balance: "ยอดคงเหลือปัจจุบัน:", attempted_amount: "จำนวนที่พยายาม",
        new_transaction_received: "ได้รับธุรกรรมใหม่!", copied: "คัดลอกแล้ว!",
        tap_to_flip: "แตะบัตรเพื่อพลิก", view_full_card: "ดูหมายเลขเต็ม",
        flip_card: "พลิกบัตร", view_cvv: "ดูรหัส CVV", receipt_title: "ใบเสร็จธุรกรรม",
        receipt_sender: "ผู้ส่ง", receipt_thank_you: "ขอบคุณที่ใช้ APP PAY",
        close: "ปิด", confirm_title_warning: "คำเตือน", confirm_btn_cancel: "ยกเลิก", confirm_btn_ok: "ยืนยัน"
    },
    ms: {
        dashboard: "Dompet", personal_iban: "IBAN Peribadi", logout: "Log Keluar", profile: "Profil",
        transfer_menu: "Pemindahan", transfer_btn: "Buat pemindahan", virtual_card_btn: "Kad Maya",
        available_balance: "Baki tersedia", account_subtitle: "Akaun untuk semua keperluan anda", see_iban: "Lihat IBAN saya",
        make_transfer: "Buat pemindahan", see_card: "Kad Maya", international_transfer: "Buat pemindahan antarabangsa",
        transfer_warning: "Pemprosesan pemindahan mengambil masa 1 hingga 3 minit selepas pengesahan akhir.",
        transactions_history: "Sejarah transaksi", total_balance: "Jumlah baki", transactions_label: "Transaksi",
        currency_label: "Mata wang", view_all: "Lihat semua", today: "Hari ini", yesterday: "Semalam",
        transfer_received: "Pemindahan diterima", transfer_sent: "Pemindahan dihantar", completed: "Selesai",
        amount: "Jumlah pemindahan", beneficiary_name: "Nama penerima", iban: "IBAN / Nombor akaun",
        bic: "Kod bank (BIC / SWIFT)", bank_name: "Nama bank", reason: "Sebab pemindahan",
        continue: "Teruskan", identity_verification: "Pengesahan identiti", pending_transfer_details: "Butiran pemindahan tertunda",
        cancel_transfer: "Batalkan pemindahan", enter_activation_code: "Masukkan kod pengaktifan pemindahan",
        activation_code: "Kod pengaktifan", validate_transfer: "Sahkan pemindahan",
        transfer_in_progress: "Pesanan pemindahan anda sedang diproses...", identity_verified: "Pengesahan identiti berjaya.",
        progress_desc: "Sila tunggu dana sampai ke bank anda sebelum memuat semula halaman ini.",
        progress_details_title: "Butiran pemindahan yang sedang berjalan", personal_info: "Maklumat peribadi",
        account_details: "Butiran akaun", operation_secured: "Operasi anda selamat dan direkodkan.",
        no_amount_debited: "Tiada jumlah didebitkan dari akaun anda.", download_receipt: "Muat turun resit",
        receipt_thank_you_1: "Terima kasih kerana menggunakan APP PAY.", receipt_thank_you_2: "Resit ini dijana secara automatik.",
        transfer_success: "Pemindahan berjaya diselesaikan", receipt_subtitle: "RESIT PEMINDAHAN",
        validated_status: "Pemindahan disahkan", success_subtitle: "Pemindahan anda telah didaftarkan.",
        transfer_pending: "Pemindahan tertunda", pending_subtitle: "Pemindahan anda menunggu pengesahan.",
        pending_status: "Tertunda", transfer_failed: "Pemindahan disekat",
        transfer_failed_subtitle: "Pemindahan anda disekat oleh sistem. Hubungi perkhidmatan pelanggan.",
        failed_status: "Disekat", transfer_cancelled: "Pemindahan dibatalkan", cancelled_status: "Dibatalkan", refunded_amount: "Jumlah dipulangkan",
        amount_sent: "JUMLAH DIHANTAR", beneficiary: "Penerima", date: "Tarikh", reference: "Rujukan",
        back_to_dashboard: "Kembali ke papan pemuka", my_virtual_card: "Kad Maya", holder: "Pemegang",
        expires: "Tamat tempoh", show_details: "Tunjuk butiran", hide_details: "Sembunyi butiran", freeze_card: "Bekukan kad",
        settings: "Tetapan", monthly_limit: "Had bulanan", monthly_spent: "Perbelanjaan bulan ini", status: "Status",
        active: "Aktif", type: "Jenis", verified: "Disahkan", account_holder_premium: "Pemegang akaun • Klien Premium",
        full_name: "Nama penuh", email_address: "Alamat e-mel", phone_number: "Nombor telefon",
        country: "Negara kediaman", account_id: "ID unik", opening_date: "Tarikh pembukaan",
        edit_profile: "Edit profil", security: "Keselamatan", notifications: "Pemberitahuan",
        no_transactions: "Tiada transaksi lagi", err_email: "Alamat e-mel salah.",
        err_pin: "Kod PIN salah.", err_amount: "Jumlah tidak sah.", err_balance: "Baki tidak mencukupi.",
        err_fields: "Sila isi semua medan.", err_activation: "Kod pengaktifan salah.",
        err_percent: "Jumlah melebihi had dibenarkan ({limit}).", err_client_not_found: "Klien tidak dijumpai.",
        err_no_link: "Tiada pautan.", welcome: "Selamat datang", login_success: "Log masuk berjaya. Selamat datang!",
        transfer_cancelled_toast: "Pemindahan dibatalkan.", transfer_finalized: "Pemindahan selesai!",
        err_card_locked: "Paparan butiran kad tidak dibenarkan.", err_iban_locked: "Paparan IBAN tidak dibenarkan.",
        iban_copied: "IBAN disalin!", swift_copied: "SWIFT disalin!", placeholder_email: "Alamat e-mel anda",
        placeholder_pin: "Kod PIN anda", placeholder_activation: "Masukkan kod rahsia anda",
        card_footer: "Kad ini adalah hak milik eksklusif APP PAY.", card_security_note: "4 digit terakhir dan CVV disembunyikan.",
        visa_premium: "Mastercard Premium", bank_details: "Butiran bank", iban_number: "Nombor IBAN",
        swift_code: "Kod SWIFT / BIC", iban_info_note: "Gunakan butiran ini untuk menerima pemindahan.",
        show_iban: "Tunjuk IBAN penuh", hide_iban: "Sembunyi IBAN", allowed_limit: "Had dibenarkan:",
        limit_percentage: "Peratusan had:", current_balance: "Baki semasa:", attempted_amount: "JUMLAH DICUBA",
        new_transaction_received: "Transaksi baharu diterima!", copied: "Disalin!",
        tap_to_flip: "Ketik kad untuk membalik", view_full_card: "Lihat nombor penuh",
        flip_card: "Balikkan kad", view_cvv: "Lihat kod CVV", receipt_title: "RESIT TRANSAKSI",
        receipt_sender: "Penghantar", receipt_thank_you: "Terima kasih kerana menggunakan APP PAY.",
        close: "Tutup", confirm_title_warning: "Amaran", confirm_btn_cancel: "Batal", confirm_btn_ok: "Sahkan"
    },
    sw: {
        dashboard: "Pochi", personal_iban: "IBAN ya Kibinafsi", logout: "Toka", profile: "Wasifu",
        transfer_menu: "Uhamisho", transfer_btn: "Fanya uhamisho", virtual_card_btn: "Kadi Pepe",
        available_balance: "Salio linalopatikana", account_subtitle: "Akaunti kwa mahitaji yote yako", see_iban: "Ona IBAN yangu",
        make_transfer: "Fanya uhamisho", see_card: "Kadi Pepe", international_transfer: "Fanya uhamisho wa kimataifa",
        transfer_warning: "Uchakataji wa uhamisho huchukua dakika 1 hadi 3 baada ya uthibitisho wa mwisho.",
        transactions_history: "Historia ya miamala", total_balance: "Salio jumla", transactions_label: "Miamala",
        currency_label: "Sarafu", view_all: "Tazama yote", today: "Leo", yesterday: "Jana",
        transfer_received: "Uhamisho umepokelewa", transfer_sent: "Uhamisho umetumwa", completed: "Imekamilika",
        amount: "Kiasi cha uhamisho", beneficiary_name: "Jina la mnufaika", iban: "IBAN / Nambari ya akaunti",
        bic: "Msimbo wa benki (BIC / SWIFT)", bank_name: "Jina la benki", reason: "Sababu ya uhamisho",
        continue: "Endelea", identity_verification: "Uthibitisho wa utambulisho", pending_transfer_details: "Maelezo ya uhamisho unaosubiri",
        cancel_transfer: "Ghairi uhamisho", enter_activation_code: "Ingiza msimbo wa uanzishaji wa uhamisho",
        activation_code: "Msimbo wa uanzishaji", validate_transfer: "Thibitisha uhamisho",
        transfer_in_progress: "Agizo lako la uhamisho linaendelea...", identity_verified: "Uthibitisho wa utambulisho umefanikiwa.",
        progress_desc: "Tafadhali subiri pesa zifikie benki yako kabla ya kuonyesha upya ukurasa huu.",
        progress_details_title: "Maelezo ya uhamisho unaoendelea", personal_info: "Taarifa binafsi",
        account_details: "Maelezo ya akaunti", operation_secured: "Operesheni yako iko salama na imesajiliwa.",
        no_amount_debited: "Hakuna kiasi kilichotolewa kwenye akaunti yako.", download_receipt: "Pakua risiti",
        receipt_thank_you_1: "Asante kwa kutumia APP PAY.", receipt_thank_you_2: "Risiti hii inatengenezwa kiotomatiki.",
        transfer_success: "Uhamisho umekamilika kwa mafanikio", receipt_subtitle: "RISITI YA UHAMISHO",
        validated_status: "Uhamisho umethibitishwa", success_subtitle: "Uhamisho wako umesajiliwa.",
        transfer_pending: "Uhamisho unasubiri", pending_subtitle: "Uhamisho wako unasubiri uthibitisho.",
        pending_status: "Unasubiri", transfer_failed: "Uhamisho umezuiwa",
        transfer_failed_subtitle: "Uhamisho wako umezuiwa na mfumo. Tafadhali wasiliana na huduma kwa wateja.",
        failed_status: "Umezuiwa", transfer_cancelled: "Uhamisho umeshafutwa", cancelled_status: "Umesitishwa", refunded_amount: "Kiasi kilichorudishwa",
        amount_sent: "KIASI KILICHOTUMWA", beneficiary: "Mnufaika", date: "Tarehe", reference: "Marejeleo",
        back_to_dashboard: "Rudi kwenye dashibodi", my_virtual_card: "Kadi Pepe", holder: "Mmiliki",
        expires: "Inaisha", show_details: "Onyesha maelezo", hide_details: "Ficha maelezo", freeze_card: "Gandisha kadi",
        settings: "Mipangilio", monthly_limit: "Kikomo cha mwezi", monthly_spent: "Matumizi ya mwezi huu", status: "Hali",
        active: "Inatumika", type: "Aina", verified: "Imethibitishwa", account_holder_premium: "Mmiliki wa akaunti • Mteja Premium",
        full_name: "Jina kamili", email_address: "Anwani ya barua pepe", phone_number: "Nambari ya simu",
        country: "Nchi ya makazi", account_id: "Kitambulisho cha kipekee", opening_date: "Tarehe ya kufungua",
        edit_profile: "Hariri wasifu", security: "Usalama", notifications: "Arifa",
        no_transactions: "Hakuna miamala bado", err_email: "Anwani ya barua pepe si sahihi.",
        err_pin: "Msimbo wa PIN si sahihi.", err_amount: "Kiasi si sahihi.", err_balance: "Salio halitoshi.",
        err_fields: "Tafadhali jaza sehemu zote.", err_activation: "Msimbo wa uanzishaji si sahihi.",
        err_percent: "Kiasi kinazidi kikomo kinachoruhusiwa ({limit}).", err_client_not_found: "Mteja hakupatikana.",
        err_no_link: "Hakuna kiungo.", welcome: "Karibu", login_success: "Umeingia kwa mafanikio. Karibu!",
        transfer_cancelled_toast: "Uhamisho umesitishwa.", transfer_finalized: "Uhamisho umekamilika!",
        err_card_locked: "Uonyeshaji wa maelezo ya kadi haujaruhusiwa.", err_iban_locked: "Uonyeshaji wa IBAN haujaruhusiwa.",
        iban_copied: "IBAN imenakiliwa!", swift_copied: "SWIFT imenakiliwa!", placeholder_email: "Anwani yako ya barua pepe",
        placeholder_pin: "Msimbo wako wa PIN", placeholder_activation: "Ingiza msimbo wako wa siri",
        card_footer: "Kadi hii ni mali ya kipekee ya APP PAY.", card_security_note: "Nambari 4 za mwisho na CVV zimefichwa.",
        visa_premium: "Mastercard Premium", bank_details: "Maelezo ya benki", iban_number: "Nambari ya IBAN",
        swift_code: "Msimbo wa SWIFT / BIC", iban_info_note: "Tumia maelezo haya kupokea uhamisho.",
        show_iban: "Onyesha IBAN kamili", hide_iban: "Ficha IBAN", allowed_limit: "Kikomo kinachoruhusiwa:",
        limit_percentage: "Asilimia ya kikomo:", current_balance: "Salio la sasa:", attempted_amount: "KIASI KILICHOJARIBIWA",
        new_transaction_received: "Muamala mpya umepokelewa!", copied: "Imenakiliwa!",
        tap_to_flip: "Gusa kadi ili kuipindua", view_full_card: "Ona nambari kamili",
        flip_card: "Pindua kadi", view_cvv: "Ona msimbo wa CVV", receipt_title: "RISITI YA MUAMALA",
        receipt_sender: "Mtumaji", receipt_thank_you: "Asante kwa kutumia APP PAY.",
        close: "Funga", confirm_title_warning: "Tahadhari", confirm_btn_cancel: "Ghairi", confirm_btn_ok: "Thibitisha"
    },
    el: {
        dashboard: "Πορτοφόλι", personal_iban: "Προσωπικό IBAN", logout: "Αποσύνδεση", profile: "Προφίλ",
        transfer_menu: "Μεταφορά", transfer_btn: "Κάντε μεταφορά", virtual_card_btn: "Εικονική κάρτα",
        available_balance: "Διαθέσιμο υπόλοιπο", account_subtitle: "Λογαριασμός για όλες τις ανάγκες σας", see_iban: "Δείτε το IBAN μου",
        make_transfer: "Κάντε μεταφορά", see_card: "Εικονική κάρτα", international_transfer: "Διεθνής μεταφορά",
        transfer_warning: "Η επεξεργασία μεταφοράς διαρκεί 1 έως 3 λεπτά μετά την τελική επαλήθευση.",
        transactions_history: "Ιστορικό συναλλαγών", total_balance: "Συνολικό υπόλοιπο", transactions_label: "Συναλλαγές",
        currency_label: "Νόμισμα", view_all: "Προβολή όλων", today: "Σήμερα", yesterday: "Χθες",
        transfer_received: "Ελήφθη μεταφορά", transfer_sent: "Εστάλη μεταφορά", completed: "Ολοκληρώθηκε",
        amount: "Ποσό μεταφοράς", beneficiary_name: "Όνομα δικαιούχου", iban: "IBAN / Αριθμός λογαριασμού",
        bic: "Τραπεζικός κωδικός (BIC / SWIFT)", bank_name: "Όνομα τράπεζας", reason: "Αιτία μεταφοράς",
        continue: "Συνέχεια", identity_verification: "Επαλήθευση ταυτότητας", pending_transfer_details: "Λεπτομέρειες εκκρεμούς μεταφοράς",
        cancel_transfer: "Ακύρωση μεταφοράς", enter_activation_code: "Εισαγάγετε τον κωδικό ενεργοποίησης",
        activation_code: "Κωδικός ενεργοποίησης", validate_transfer: "Επικύρωση μεταφοράς",
        transfer_in_progress: "Η εντολή μεταφοράς σας εκτελείται...", identity_verified: "Επαλήθευση ταυτότητας επιτυχής.",
        progress_desc: "Περιμένετε τα κεφάλαια να φτάσουν στην τράπεζά σας πριν ανανεώσετε.",
        progress_details_title: "Λεπτομέρειες τρέχουσας μεταφοράς", personal_info: "Προσωπικές πληροφορίες",
        account_details: "Στοιχεία λογαριασμού", operation_secured: "Η λειτουργία σας είναι ασφαλής.",
        no_amount_debited: "Κανένα ποσό δεν χρεώθηκε από τον λογαριασμό σας.", download_receipt: "Λήψη απόδειξης",
        receipt_thank_you_1: "Ευχαριστούμε που χρησιμοποιείτε το APP PAY.", receipt_thank_you_2: "Αυτή η απόδειξη δημιουργείται αυτόματα.",
        transfer_success: "Η μεταφορά ολοκληρώθηκε επιτυχώς", receipt_subtitle: "ΑΠΟΔΕΙΞΗ ΜΕΤΑΦΟΡΑΣ",
        validated_status: "Η μεταφορά επιβεβαιώθηκε", success_subtitle: "Η μεταφορά σας καταχωρήθηκε.",
        transfer_pending: "Μεταφορά σε εκκρεμότητα", pending_subtitle: "Η μεταφορά σας αναμένει επικύρωση.",
        pending_status: "Σε εκκρεμότητα", transfer_failed: "Η μεταφορά αποκλείστηκε",
        transfer_failed_subtitle: "Η μεταφορά σας αποκλείστηκε από το σύστημα. Επικοινωνήστε με την εξυπηρέτηση.",
        failed_status: "Αποκλείστηκε", transfer_cancelled: "Η μεταφορά ακυρώθηκε", cancelled_status: "Ακυρώθηκε", refunded_amount: "Επιστράφηκε ποσό",
        amount_sent: "ΠΟΣΟ ΠΟΥ ΕΣΤΑΛΗ", beneficiary: "Δικαιούχος", date: "Ημερομηνία", reference: "Αναφορά",
        back_to_dashboard: "Επιστροφή στον πίνακα", my_virtual_card: "Εικονική κάρτα", holder: "Κάτοχος",
        expires: "Λήγει", show_details: "Εμφάνιση λεπτομερειών", hide_details: "Απόκρυψη λεπτομερειών", freeze_card: "Πάγωμα κάρτας",
        settings: "Ρυθμίσεις", monthly_limit: "Μηνιαίο όριο", monthly_spent: "Δαπάνες μήνα", status: "Κατάσταση",
        active: "Ενεργή", type: "Τύπος", verified: "Επαληθεύτηκε", account_holder_premium: "Κάτοχος λογαριασμού • Premium πελάτης",
        full_name: "Ονοματεπώνυμο", email_address: "Διεύθυνση email", phone_number: "Αριθμός τηλεφώνου",
        country: "Χώρα διαμονής", account_id: "Μοναδικό ID", opening_date: "Ημερομηνία ανοίγματος",
        edit_profile: "Επεξεργασία προφίλ", security: "Ασφάλεια", notifications: "Ειδοποιήσεις",
        no_transactions: "Δεν υπάρχουν συναλλαγές", err_email: "Λανθασμένη διεύθυνση email.",
        err_pin: "Λανθασμένο PIN.", err_amount: "Μη έγκυρο ποσό.", err_balance: "Ανεπαρκές υπόλοιπο.",
        err_fields: "Συμπληρώστε όλα τα πεδία.", err_activation: "Λανθασμένος κωδικός ενεργοποίησης.",
        err_percent: "Το ποσό υπερβαίνει το όριο ({limit}).", err_client_not_found: "Ο πελάτης δεν βρέθηκε.",
        err_no_link: "Κανένας σύνδεσμος.", welcome: "Καλώς ήρθατε", login_success: "Επιτυχής σύνδεση. Καλώς ήρθατε!",
        transfer_cancelled_toast: "Η μεταφορά ακυρώθηκε.", transfer_finalized: "Η μεταφορά ολοκληρώθηκε!",
        err_card_locked: "Η εμφάνιση δεν είναι εξουσιοδοτημένη.", err_iban_locked: "Η εμφάνιση IBAN δεν είναι εξουσιοδοτημένη.",
        iban_copied: "Το IBAN αντιγράφηκε!", swift_copied: "Το SWIFT αντιγράφηκε!", placeholder_email: "Η διεύθυνση email σας",
        placeholder_pin: "Το PIN σας", placeholder_activation: "Εισαγάγετε τον μυστικό κωδικό",
        card_footer: "Αυτή η κάρτα είναι αποκλειστική ιδιοκτησία της APP PAY.", card_security_note: "Τα 4 τελευταία ψηφία και CVV κρύφτηκαν.",
        visa_premium: "Mastercard Premium", bank_details: "Τραπεζικά στοιχεία", iban_number: "Αριθμός IBAN",
        swift_code: "Κωδικός SWIFT / BIC", iban_info_note: "Χρησιμοποιήστε αυτά τα στοιχεία για λήψη μεταφορών.",
        show_iban: "Εμφάνιση πλήρους IBAN", hide_iban: "Απόκρυψη IBAN", allowed_limit: "Επιτρεπόμενο όριο:",
        limit_percentage: "Ποσοστό ορίου:", current_balance: "Τρέχον υπόλοιπο:", attempted_amount: "ΠΟΣΟ ΠΟΥ ΔΟΚΙΜΑΣΤΗΚΕ",
        new_transaction_received: "Νέα συναλλαγή ελήφθη!", copied: "Αντιγράφηκε!",
        tap_to_flip: "Πατήστε την κάρτα για αναστροφή", view_full_card: "Προβολή πλήρους αριθμού",
        flip_card: "Αναστροφή κάρτας", view_cvv: "Προβολή CVV", receipt_title: "ΑΠΟΔΕΙΞΗ ΣΥΝΑΛΛΑΓΗΣ",
        receipt_sender: "Αποστολέας", receipt_thank_you: "Ευχαριστούμε που χρησιμοποιείτε το APP PAY.",
        close: "Κλείσιμο", confirm_title_warning: "Προσοχή", confirm_btn_cancel: "Ακύρωση", confirm_btn_ok: "Επιβεβαίωση"
    },
    he: {
        dashboard: "ארנק", personal_iban: "IBAN אישי", logout: "התנתקות", profile: "פרופיל",
        transfer_menu: "העברה", transfer_btn: "בצע העברה", virtual_card_btn: "כרטיס וירטואלי",
        available_balance: "יתרה זמינה", account_subtitle: "חשבון לכל הצרכים שלך", see_iban: "הצג את ה-IBAN שלי",
        make_transfer: "בצע העברה", see_card: "כרטיס וירטואלי", international_transfer: "העברה בינלאומית",
        transfer_warning: "עיבוד ההעברה נמשך 1 עד 3 דקות לאחר האימות הסופי.",
        transactions_history: "היסטוריית עסקאות", total_balance: "יתרה כוללת", transactions_label: "עסקאות",
        currency_label: "מטבע", view_all: "הצג הכל", today: "היום", yesterday: "אתמול",
        transfer_received: "העברה התקבלה", transfer_sent: "העברה נשלחה", completed: "הושלם",
        amount: "סכום העברה", beneficiary_name: "שם המוטב", iban: "IBAN / מספר חשבון",
        bic: "קוד בנק (BIC / SWIFT)", bank_name: "שם הבנק", reason: "סיבת ההעברה",
        continue: "המשך", identity_verification: "אימות זהות", pending_transfer_details: "פרטי העברה ממתינה",
        cancel_transfer: "בטל העברה", enter_activation_code: "הזן קוד הפעלה של ההעברה",
        activation_code: "קוד הפעלה", validate_transfer: "אמת העברה",
        transfer_in_progress: "פקודת ההעברה שלך בעיבוד...", identity_verified: "אימות הזהות הצליח.",
        progress_desc: "המתן שהכספים יגיעו לבנק שלך לפני רענון העמוד.",
        progress_details_title: "פרטי העברה בתהליך", personal_info: "מידע אישי",
        account_details: "פרטי חשבון", operation_secured: "הפעולה שלך מאובטחת ורשומה.",
        no_amount_debited: "לא חויב סכום מהחשבון שלך.", download_receipt: "הורד קבלה",
        receipt_thank_you_1: "תודה שהשתמשת ב-APP PAY.", receipt_thank_you_2: "קבלה זו נוצרת אוטומטית.",
        transfer_success: "ההעברה הושלמה בהצלחה", receipt_subtitle: "קבלת העברה",
        validated_status: "ההעברה אושרה", success_subtitle: "ההעברה שלך נרשמה.",
        transfer_pending: "העברה ממתינה", pending_subtitle: "ההעברה שלך ממתינה לאימות.",
        pending_status: "ממתין", transfer_failed: "ההעברה חסומה",
        transfer_failed_subtitle: "ההעברה שלך נחסמה על ידי המערכת. צור קשר עם שירות הלקוחות.",
        failed_status: "חסום", transfer_cancelled: "ההעברה בוטלה", cancelled_status: "בוטל", refunded_amount: "סכום הוחזר",
        amount_sent: "סכום נשלח", beneficiary: "מוטב", date: "תאריך", reference: "אסמכתא",
        back_to_dashboard: "חזרה ללוח הבקרה", my_virtual_card: "כרטיס וירטואלי", holder: "בעלים",
        expires: "תוקף", show_details: "הצג פרטים", hide_details: "הסתר פרטים", freeze_card: "הקפא כרטיס",
        settings: "הגדרות", monthly_limit: "מגבלה חודשית", monthly_spent: "הוצאות החודש", status: "סטטוס",
        active: "פעיל", type: "סוג", verified: "מאומת", account_holder_premium: "בעל חשבון • לקוח פרימיום",
        full_name: "שם מלא", email_address: "כתובת אימייל", phone_number: "מספר טלפון",
        country: "ארץ מגורים", account_id: "מזהה ייחודי", opening_date: "תאריך פתיחה",
        edit_profile: "ערוך פרופיל", security: "אבטחה", notifications: "התראות",
        no_transactions: "אין עסקאות עדיין", err_email: "כתובת אימייל שגויה.",
        err_pin: "קוד PIN שגוי.", err_amount: "סכום לא חוקי.", err_balance: "יתרה לא מספקת.",
        err_fields: "מלא את כל השדות.", err_activation: "קוד הפעלה שגוי.",
        err_percent: "הסכום עולה על המגבלה ({limit}).", err_client_not_found: "הלקוח לא נמצא.",
        err_no_link: "אין קישור.", welcome: "ברוך הבא", login_success: "התחברות הצליחה. ברוך הבא!",
        transfer_cancelled_toast: "ההעברה בוטלה.", transfer_finalized: "ההעברה הושלמה!",
        err_card_locked: "הצגת פרטי כרטיס אינה מורשית.", err_iban_locked: "הצגת IBAN אינה מורשית.",
        iban_copied: "IBAN הועתק!", swift_copied: "SWIFT הועתק!", placeholder_email: "כתובת האימייל שלך",
        placeholder_pin: "קוד ה-PIN שלך", placeholder_activation: "הזן את הקוד הסודי שלך",
        card_footer: "כרטיס זה הוא רכוש APP PAY הבלעדי.", card_security_note: "4 הספרות האחרונות וה-CVV הוסתרו.",
        visa_premium: "Mastercard Premium", bank_details: "פרטי בנק", iban_number: "מספר IBAN",
        swift_code: "קוד SWIFT / BIC", iban_info_note: "השתמש בפרטים אלה לקבלת העברות.",
        show_iban: "הצג IBAN מלא", hide_iban: "הסתר IBAN", allowed_limit: "מגבלה מותרת:",
        limit_percentage: "אחוז מגבלה:", current_balance: "יתרה נוכחית:", attempted_amount: "סכום שנוסה",
        new_transaction_received: "עסקה חדשה התקבלה!", copied: "הועתק!",
        tap_to_flip: "הקש על הכרטיס להפיכה", view_full_card: "הצג מספר מלא",
        flip_card: "הפוך כרטיס", view_cvv: "הצג קוד CVV", receipt_title: "קבלת עסקה",
        receipt_sender: "שולח", receipt_thank_you: "תודה שהשתמשת ב-APP PAY.",
        close: "סגור", confirm_title_warning: "אזהרה", confirm_btn_cancel: "בטל", confirm_btn_ok: "אשר"
    },
    uk: {
        dashboard: "Гаманець", personal_iban: "Особистий IBAN", logout: "Вийти", profile: "Профіль",
        transfer_menu: "Переказ", transfer_btn: "Зробити переказ", virtual_card_btn: "Віртуальна картка",
        available_balance: "Доступний баланс", account_subtitle: "Рахунок для всіх ваших потреб", see_iban: "Показати мій IBAN",
        make_transfer: "Зробити переказ", see_card: "Віртуальна картка", international_transfer: "Міжнародний переказ",
        transfer_warning: "Обробка переказу займає 1-3 хвилини після фінальної перевірки.",
        transactions_history: "Історія транзакцій", total_balance: "Загальний баланс", transactions_label: "Транзакції",
        currency_label: "Валюта", view_all: "Переглянути все", today: "Сьогодні", yesterday: "Вчора",
        transfer_received: "Переказ отримано", transfer_sent: "Переказ надіслано", completed: "Виконано",
        amount: "Сума переказу", beneficiary_name: "Ім'я отримувача", iban: "IBAN / Номер рахунку",
        bic: "Код банку (BIC / SWIFT)", bank_name: "Назва банку", reason: "Причина переказу",
        continue: "Продовжити", identity_verification: "Перевірка особи", pending_transfer_details: "Деталі очікуваного переказу",
        cancel_transfer: "Скасувати переказ", enter_activation_code: "Введіть код активації переказу",
        activation_code: "Код активації", validate_transfer: "Підтвердити переказ",
        transfer_in_progress: "Ваш переказ обробляється...", identity_verified: "Перевірку особи успішно завершено.",
        progress_desc: "Дочекайтеся надходження коштів до вашого банку.",
        progress_details_title: "Деталі поточного переказу", personal_info: "Особиста інформація",
        account_details: "Деталі рахунку", operation_secured: "Ваша операція захищена та зареєстрована.",
        no_amount_debited: "З вашого рахунку не списано коштів.", download_receipt: "Завантажити квитанцію",
        receipt_thank_you_1: "Дякуємо за використання APP PAY.", receipt_thank_you_2: "Ця квитанція створюється автоматично.",
        transfer_success: "Переказ успішно виконано", receipt_subtitle: "КВИТАНЦІЯ ПРО ПЕРЕКАЗ",
        validated_status: "Переказ підтверджено", success_subtitle: "Ваш переказ зареєстровано.",
        transfer_pending: "Переказ в очікуванні", pending_subtitle: "Ваш переказ очікує перевірки.",
        pending_status: "В очікуванні", transfer_failed: "Переказ заблоковано",
        transfer_failed_subtitle: "Ваш переказ заблоковано системою. Зверніться до служби підтримки.",
        failed_status: "Заблоковано", transfer_cancelled: "Переказ скасовано", cancelled_status: "Скасовано", refunded_amount: "Повернена сума",
        amount_sent: "НАДІСЛАНА СУМА", beneficiary: "Отримувач", date: "Дата", reference: "Посилання",
        back_to_dashboard: "На головну", my_virtual_card: "Віртуальна картка", holder: "Власник",
        expires: "Діє до", show_details: "Показати деталі", hide_details: "Сховати деталі", freeze_card: "Заблокувати картку",
        settings: "Налаштування", monthly_limit: "Місячний ліміт", monthly_spent: "Витрати за місяць", status: "Статус",
        active: "Активна", type: "Тип", verified: "Перевірено", account_holder_premium: "Власник рахунку • Преміум-клієнт",
        full_name: "Повне ім'я", email_address: "Ел. пошта", phone_number: "Телефон",
        country: "Країна", account_id: "Унікальний ID", opening_date: "Дата відкриття",
        edit_profile: "Редагувати профіль", security: "Безпека", notifications: "Сповіщення",
        no_transactions: "Транзакцій ще немає", err_email: "Невірна ел. пошта.",
        err_pin: "Невірний PIN-код.", err_amount: "Невірна сума.", err_balance: "Недостатньо коштів.",
        err_fields: "Заповніть усі поля.", err_activation: "Невірний код активації.",
        err_percent: "Сума перевищує ліміт ({limit}).", err_client_not_found: "Клієнта не знайдено.",
        err_no_link: "Немає посилання.", welcome: "Вітаємо", login_success: "Вхід успішний. Вітаємо!",
        transfer_cancelled_toast: "Переказ скасовано.", transfer_finalized: "Переказ завершено!",
        err_card_locked: "Показ деталей картки не дозволено.", err_iban_locked: "Показ IBAN не дозволено.",
        iban_copied: "IBAN скопійовано!", swift_copied: "SWIFT скопійовано!", placeholder_email: "Ваша ел. пошта",
        placeholder_pin: "Ваш PIN-код", placeholder_activation: "Введіть секретний код",
        card_footer: "Ця картка — власність APP PAY.", card_security_note: "Останні 4 цифри та CVV приховано.",
        visa_premium: "Mastercard Premium", bank_details: "Реквізити", iban_number: "Номер IBAN",
        swift_code: "Код SWIFT / BIC", iban_info_note: "Використовуйте для отримання переказів.",
        show_iban: "Показати повний IBAN", hide_iban: "Сховати IBAN", allowed_limit: "Дозволений ліміт:",
        limit_percentage: "Відсоток ліміту:", current_balance: "Поточний баланс:", attempted_amount: "ЗАПРОШЕНА СУМА",
        new_transaction_received: "Отримано нову транзакцію!", copied: "Скопійовано!",
        tap_to_flip: "Торкніться картки", view_full_card: "Показати повний номер",
        flip_card: "Перевернути картку", view_cvv: "Показати CVV", receipt_title: "КВИТАНЦІЯ",
        receipt_sender: "Відправник", receipt_thank_you: "Дякуємо за використання APP PAY.",
        close: "Закрити", confirm_title_warning: "Увага", confirm_btn_cancel: "Скасувати", confirm_btn_ok: "Підтвердити"
    },
    ro: {
        dashboard: "Portofel", personal_iban: "IBAN Personal", logout: "Deconectare", profile: "Profil",
        transfer_menu: "Transfer", transfer_btn: "Efectuează transfer", virtual_card_btn: "Card Virtual",
        available_balance: "Sold disponibil", account_subtitle: "Cont pentru toate nevoile tale", see_iban: "Vezi IBAN-ul meu",
        make_transfer: "Efectuează transfer", see_card: "Card Virtual", international_transfer: "Transfer internațional",
        transfer_warning: "Procesarea transferului durează 1-3 minute după verificarea finală.",
        transactions_history: "Istoric tranzacții", total_balance: "Sold total", transactions_label: "Tranzacții",
        currency_label: "Monedă", view_all: "Vezi tot", today: "Astăzi", yesterday: "Ieri",
        transfer_received: "Transfer primit", transfer_sent: "Transfer trimis", completed: "Finalizat",
        amount: "Sumă transfer", beneficiary_name: "Nume beneficiar", iban: "IBAN / Număr cont",
        bic: "Cod bancă (BIC / SWIFT)", bank_name: "Nume bancă", reason: "Motiv transfer",
        continue: "Continuă", identity_verification: "Verificare identitate", pending_transfer_details: "Detalii transfer în așteptare",
        cancel_transfer: "Anulează transfer", enter_activation_code: "Introdu codul de activare",
        activation_code: "Cod activare", validate_transfer: "Validează transfer",
        transfer_in_progress: "Transferul tău este în curs...", identity_verified: "Verificare identitate reușită.",
        progress_desc: "Așteaptă ca fondurile să ajungă la banca ta înainte de a reîncărca pagina.",
        progress_details_title: "Detalii transfer în curs", personal_info: "Informații personale",
        account_details: "Detalii cont", operation_secured: "Operațiunea ta este securizată.",
        no_amount_debited: "Nicio sumă nu a fost debitată.", download_receipt: "Descarcă chitanța",
        receipt_thank_you_1: "Mulțumim că folosești APP PAY.", receipt_thank_you_2: "Această chitanță este generată automat.",
        transfer_success: "Transfer finalizat cu succes", receipt_subtitle: "CHITANȚĂ TRANSFER",
        validated_status: "Transfer confirmat", success_subtitle: "Transferul tău a fost înregistrat.",
        transfer_pending: "Transfer în așteptare", pending_subtitle: "Transferul tău așteaptă validare.",
        pending_status: "În așteptare", transfer_failed: "Transfer blocat",
        transfer_failed_subtitle: "Transferul a fost blocat. Contactează serviciul clienți.",
        failed_status: "Blocat", transfer_cancelled: "Transfer anulat", cancelled_status: "Anulat", refunded_amount: "Sumă rambursată",
        amount_sent: "SUMĂ TRIMISĂ", beneficiary: "Beneficiar", date: "Data", reference: "Referință",
        back_to_dashboard: "Înapoi la panou", my_virtual_card: "Card Virtual", holder: "Titular",
        expires: "Expiră", show_details: "Arată detalii", hide_details: "Ascunde detalii", freeze_card: "Blochează cardul",
        settings: "Setări", monthly_limit: "Limită lunară", monthly_spent: "Cheltuieli lună", status: "Status",
        active: "Activ", type: "Tip", verified: "Verificat", account_holder_premium: "Titular • Client Premium",
        full_name: "Nume complet", email_address: "Adresă email", phone_number: "Număr telefon",
        country: "Țara de reședință", account_id: "ID unic", opening_date: "Data deschiderii",
        edit_profile: "Editează profil", security: "Securitate", notifications: "Notificări",
        no_transactions: "Nicio tranzacție", err_email: "Adresă email incorectă.",
        err_pin: "Cod PIN incorect.", err_amount: "Sumă invalidă.", err_balance: "Sold insuficient.",
        err_fields: "Completează toate câmpurile.", err_activation: "Cod activare incorect.",
        err_percent: "Suma depășește limita ({limit}).", err_client_not_found: "Client negăsit.",
        err_no_link: "Niciun link.", welcome: "Bine ai venit", login_success: "Autentificare reușită. Bine ai venit!",
        transfer_cancelled_toast: "Transfer anulat.", transfer_finalized: "Transfer finalizat!",
        err_card_locked: "Afișare neautorizată.", err_iban_locked: "Afișare IBAN neautorizată.",
        iban_copied: "IBAN copiat!", swift_copied: "SWIFT copiat!", placeholder_email: "Adresa ta de email",
        placeholder_pin: "Codul tău PIN", placeholder_activation: "Introdu codul secret",
        card_footer: "Acest card este proprietatea exclusivă a APP PAY.", card_security_note: "Ultimele 4 cifre și CVV au fost ascunse.",
        visa_premium: "Mastercard Premium", bank_details: "Detalii bancare", iban_number: "Număr IBAN",
        swift_code: "Cod SWIFT / BIC", iban_info_note: "Folosește aceste detalii pentru a primi transferuri.",
        show_iban: "Arată IBAN complet", hide_iban: "Ascunde IBAN", allowed_limit: "Limită permisă:",
        limit_percentage: "Procent limită:", current_balance: "Sold curent:", attempted_amount: "SUMĂ ÎNCERCATĂ",
        new_transaction_received: "Tranzacție nouă primită!", copied: "Copiat!",
        tap_to_flip: "Atinge cardul pentru a-l întoarce", view_full_card: "Vezi numărul complet",
        flip_card: "Întoarce cardul", view_cvv: "Vezi codul CVV", receipt_title: "CHITANȚĂ TRANZACȚIE",
        receipt_sender: "Expeditor", receipt_thank_you: "Mulțumim că folosești APP PAY.",
        close: "Închide", confirm_title_warning: "Atenție", confirm_btn_cancel: "Anulează", confirm_btn_ok: "Confirmă"
    },
    hu: {
        dashboard: "Pénztárca", personal_iban: "Személyes IBAN", logout: "Kijelentkezés", profile: "Profil",
        transfer_menu: "Átutalás", transfer_btn: "Átutalás indítása", virtual_card_btn: "Virtuális kártya",
        available_balance: "Elérhető egyenleg", account_subtitle: "Számla minden igényedhez", see_iban: "IBAN megtekintése",
        make_transfer: "Átutalás indítása", see_card: "Virtuális kártya", international_transfer: "Nemzetközi átutalás",
        transfer_warning: "Az átutalás feldolgozása 1-3 percet vesz igénybe a végső ellenőrzés után.",
        transactions_history: "Tranzakciók előzményei", total_balance: "Teljes egyenleg", transactions_label: "Tranzakciók",
        currency_label: "Pénznem", view_all: "Összes megtekintése", today: "Ma", yesterday: "Tegnap",
        transfer_received: "Átutalás érkezett", transfer_sent: "Átutalás elküldve", completed: "Teljesítve",
        amount: "Átutalás összege", beneficiary_name: "Kedvezményezett neve", iban: "IBAN / Számlaszám",
        bic: "Bankkód (BIC / SWIFT)", bank_name: "Bank neve", reason: "Átutalás oka",
        continue: "Folytatás", identity_verification: "Személyazonosítás", pending_transfer_details: "Függőben lévő átutalás részletei",
        cancel_transfer: "Átutalás törlése", enter_activation_code: "Írd be az átutalás aktiváló kódját",
        activation_code: "Aktiváló kód", validate_transfer: "Átutalás jóváhagyása",
        transfer_in_progress: "Az átutalási megbízás feldolgozás alatt...", identity_verified: "Személyazonosítás sikeres.",
        progress_desc: "Várj, amíg a pénz megérkezik a bankodba, mielőtt frissíted az oldalt.",
        progress_details_title: "Folyamatban lévő átutalás részletei", personal_info: "Személyes adatok",
        account_details: "Számlaadatok", operation_secured: "A művelet biztonságos és rögzített.",
        no_amount_debited: "Nem került levonásra összeg.", download_receipt: "Bizonylat letöltése",
        receipt_thank_you_1: "Köszönjük, hogy az APP PAY-t használod.", receipt_thank_you_2: "Ez a bizonylat automatikusan generálódik.",
        transfer_success: "Átutalás sikeresen teljesítve", receipt_subtitle: "ÁTUTALÁSI BIZONYLAT",
        validated_status: "Átutalás megerősítve", success_subtitle: "Az átutalás rögzítésre került.",
        transfer_pending: "Átutalás függőben", pending_subtitle: "Az átutalás jóváhagyásra vár.",
        pending_status: "Függőben", transfer_failed: "Átutalás blokkolva",
        transfer_failed_subtitle: "Az átutalás blokkolásra került. Lépj kapcsolatba az ügyfélszolgálattal.",
        failed_status: "Blokkolva", transfer_cancelled: "Átutalás törölve", cancelled_status: "Törölve", refunded_amount: "Visszatérített összeg",
        amount_sent: "KÜLDÖTT ÖSSZEG", beneficiary: "Kedvezményezett", date: "Dátum", reference: "Hivatkozás",
        back_to_dashboard: "Vissza az irányítópultra", my_virtual_card: "Virtuális kártya", holder: "Tulajdonos",
        expires: "Lejárat", show_details: "Részletek mutatása", hide_details: "Részletek elrejtése", freeze_card: "Kártya zárolása",
        settings: "Beállítások", monthly_limit: "Havi limit", monthly_spent: "Havi költés", status: "Állapot",
        active: "Aktív", type: "Típus", verified: "Ellenőrzött", account_holder_premium: "Számlatulajdonos • Prémium ügyfél",
        full_name: "Teljes név", email_address: "Email cím", phone_number: "Telefonszám",
        country: "Lakóhely országa", account_id: "Egyedi ID", opening_date: "Nyitás dátuma",
        edit_profile: "Profil szerkesztése", security: "Biztonság", notifications: "Értesítések",
        no_transactions: "Még nincs tranzakció", err_email: "Hibás email cím.",
        err_pin: "Hibás PIN kód.", err_amount: "Érvénytelen összeg.", err_balance: "Elégtelen egyenleg.",
        err_fields: "Töltsd ki az összes mezőt.", err_activation: "Hibás aktiváló kód.",
        err_percent: "Az összeg meghaladja a limitet ({limit}).", err_client_not_found: "Ügyfél nem található.",
        err_no_link: "Nincs link.", welcome: "Üdvözöllek", login_success: "Sikeres bejelentkezés. Üdvözöllek!",
        transfer_cancelled_toast: "Átutalás törölve.", transfer_finalized: "Átutalás teljesítve!",
        err_card_locked: "Kártyaadat megjelenítés nem engedélyezett.", err_iban_locked: "IBAN megjelenítés nem engedélyezett.",
        iban_copied: "IBAN másolva!", swift_copied: "SWIFT másolva!", placeholder_email: "Email címed",
        placeholder_pin: "PIN kódod", placeholder_activation: "Írd be a titkos kódod",
        card_footer: "Ez a kártya az APP PAY kizárólagos tulajdona.", card_security_note: "Az utolsó 4 számjegy és a CVV elrejtve.",
        visa_premium: "Mastercard Premium", bank_details: "Bankadatok", iban_number: "IBAN szám",
        swift_code: "SWIFT / BIC kód", iban_info_note: "Használd ezeket az adatokat átutalások fogadásához.",
        show_iban: "Teljes IBAN mutatása", hide_iban: "IBAN elrejtése", allowed_limit: "Engedélyezett limit:",
        limit_percentage: "Limit százalék:", current_balance: "Jelenlegi egyenleg:", attempted_amount: "MEGKÍSÉRELT ÖSSZEG",
        new_transaction_received: "Új tranzakció érkezett!", copied: "Másolva!",
        tap_to_flip: "Koppints a kártyára a megfordításhoz", view_full_card: "Teljes szám megtekintése",
        flip_card: "Kártya megfordítása", view_cvv: "CVV kód megtekintése", receipt_title: "TRANZAKCIÓS BIZONYLAT",
        receipt_sender: "Küldő", receipt_thank_you: "Köszönjük, hogy az APP PAY-t használod.",
        close: "Bezárás", confirm_title_warning: "Figyelmeztetés", confirm_btn_cancel: "Mégse", confirm_btn_ok: "Megerősítés"
    },
    sv: {
        dashboard: "Plånbok", personal_iban: "Personligt IBAN", logout: "Logga ut", profile: "Profil",
        transfer_menu: "Överföring", transfer_btn: "Gör en överföring", virtual_card_btn: "Virtuellt kort",
        available_balance: "Tillgängligt saldo", account_subtitle: "Konto för alla dina behov", see_iban: "Se mitt IBAN",
        make_transfer: "Gör en överföring", see_card: "Virtuellt kort", international_transfer: "Gör en internationell överföring",
        transfer_warning: "Överföringen behandlas inom 1-3 minuter efter slutlig verifiering.",
        transactions_history: "Transaktionshistorik", total_balance: "Totalt saldo", transactions_label: "Transaktioner",
        currency_label: "Valuta", view_all: "Visa alla", today: "Idag", yesterday: "Igår",
        transfer_received: "Överföring mottagen", transfer_sent: "Överföring skickad", completed: "Slutförd",
        amount: "Överföringsbelopp", beneficiary_name: "Mottagarens namn", iban: "IBAN / Kontonummer",
        bic: "Bankkod (BIC / SWIFT)", bank_name: "Bankens namn", reason: "Överföringsorsak",
        continue: "Fortsätt", identity_verification: "Identitetsverifiering", pending_transfer_details: "Detaljer för väntande överföring",
        cancel_transfer: "Avbryt överföring", enter_activation_code: "Ange aktiveringskoden för överföringen",
        activation_code: "Aktiveringskod", validate_transfer: "Validera överföring",
        transfer_in_progress: "Din överföring behandlas...", identity_verified: "Identitetsverifieringen lyckades.",
        progress_desc: "Vänta tills pengarna når din bank innan du uppdaterar sidan.",
        progress_details_title: "Detaljer för pågående överföring", personal_info: "Personlig information",
        account_details: "Kontouppgifter", operation_secured: "Din åtgärd är säker och registrerad.",
        no_amount_debited: "Inget belopp har dragits från ditt konto.", download_receipt: "Ladda ner kvitto",
        receipt_thank_you_1: "Tack för att du använder APP PAY.", receipt_thank_you_2: "Detta kvitto genereras automatiskt.",
        transfer_success: "Överföringen slutfördes", receipt_subtitle: "ÖVERFÖRINGSKVITTO",
        validated_status: "Överföringen bekräftad", success_subtitle: "Din överföring har registrerats.",
        transfer_pending: "Överföring väntar", pending_subtitle: "Din överföring väntar på validering.",
        pending_status: "Väntar", transfer_failed: "Överföringen blockerad",
        transfer_failed_subtitle: "Din överföring blockerades av systemet. Kontakta kundtjänst.",
        failed_status: "Blockerad", transfer_cancelled: "Överföringen avbröts", cancelled_status: "Avbruten", refunded_amount: "Återbetalat belopp",
        amount_sent: "SKICKAT BELOPP", beneficiary: "Mottagare", date: "Datum", reference: "Referens",
        back_to_dashboard: "Tillbaka till instrumentpanelen", my_virtual_card: "Virtuellt kort", holder: "Innehavare",
        expires: "Går ut", show_details: "Visa detaljer", hide_details: "Dölj detaljer", freeze_card: "Frys kortet",
        settings: "Inställningar", monthly_limit: "Månadsgräns", monthly_spent: "Månadens utgifter", status: "Status",
        active: "Aktiv", type: "Typ", verified: "Verifierad", account_holder_premium: "Kontoinnehavare • Premiumkund",
        full_name: "Fullständigt namn", email_address: "E-postadress", phone_number: "Telefonnummer",
        country: "Bosättningsland", account_id: "Unikt ID", opening_date: "Öppningsdatum",
        edit_profile: "Redigera profil", security: "Säkerhet", notifications: "Aviseringar",
        no_transactions: "Inga transaktioner ännu", err_email: "Felaktig e-postadress.",
        err_pin: "Felaktig PIN-kod.", err_amount: "Ogiltigt belopp.", err_balance: "Otillräckligt saldo.",
        err_fields: "Fyll i alla fält.", err_activation: "Felaktig aktiveringskod.",
        err_percent: "Beloppet överstiger gränsen ({limit}).", err_client_not_found: "Kunden hittades inte.",
        err_no_link: "Ingen länk.", welcome: "Välkommen", login_success: "Inloggning lyckades. Välkommen!",
        transfer_cancelled_toast: "Överföringen avbröts.", transfer_finalized: "Överföringen slutfördes!",
        err_card_locked: "Kortuppgifter får inte visas.", err_iban_locked: "IBAN får inte visas.",
        iban_copied: "IBAN kopierat!", swift_copied: "SWIFT kopierat!", placeholder_email: "Din e-postadress",
        placeholder_pin: "Din PIN-kod", placeholder_activation: "Ange din hemliga kod",
        card_footer: "Detta kort är APP PAY:s exklusiva egendom.", card_security_note: "De sista 4 siffrorna och CVV har dolts.",
        visa_premium: "Mastercard Premium", bank_details: "Bankuppgifter", iban_number: "IBAN-nummer",
        swift_code: "SWIFT / BIC-kod", iban_info_note: "Använd dessa uppgifter för att ta emot överföringar.",
        show_iban: "Visa fullständigt IBAN", hide_iban: "Dölj IBAN", allowed_limit: "Tillåten gräns:",
        limit_percentage: "Gränsprocent:", current_balance: "Nuvarande saldo:", attempted_amount: "FÖRSÖKT BELOPP",
        new_transaction_received: "Ny transaktion mottagen!", copied: "Kopierat!",
        tap_to_flip: "Tryck på kortet för att vända", view_full_card: "Visa fullständigt nummer",
        flip_card: "Vänd kortet", view_cvv: "Visa CVV-kod", receipt_title: "TRANSAKTIONSKVITTO",
        receipt_sender: "Avsändare", receipt_thank_you: "Tack för att du använder APP PAY.",
        close: "Stäng", confirm_title_warning: "Varning", confirm_btn_cancel: "Avbryt", confirm_btn_ok: "Bekräfta"
    },
    no: {
        dashboard: "Lommebok", personal_iban: "Personlig IBAN", logout: "Logg ut", profile: "Profil",
        transfer_menu: "Overføring", transfer_btn: "Gjør en overføring", virtual_card_btn: "Virtuelt kort",
        available_balance: "Tilgjengelig saldo", account_subtitle: "Konto for alle dine behov", see_iban: "Se min IBAN",
        make_transfer: "Gjør en overføring", see_card: "Virtuelt kort", international_transfer: "Gjør en internasjonal overføring",
        transfer_warning: "Overføringen behandles innen 1-3 minutter etter endelig verifisering.",
        transactions_history: "Transaksjonshistorikk", total_balance: "Total saldo", transactions_label: "Transaksjoner",
        currency_label: "Valuta", view_all: "Se alle", today: "I dag", yesterday: "I går",
        transfer_received: "Overføring mottatt", transfer_sent: "Overføring sendt", completed: "Fullført",
        amount: "Overføringsbeløp", beneficiary_name: "Mottakers navn", iban: "IBAN / Kontonummer",
        bic: "Bankkode (BIC / SWIFT)", bank_name: "Bankens navn", reason: "Årsak til overføring",
        continue: "Fortsett", identity_verification: "Identitetsbekreftelse", pending_transfer_details: "Detaljer for ventende overføring",
        cancel_transfer: "Avbryt overføring", enter_activation_code: "Skriv inn aktiveringskoden",
        activation_code: "Aktiveringskode", validate_transfer: "Valider overføring",
        transfer_in_progress: "Overføringen din behandles...", identity_verified: "Identitetsbekreftelsen var vellykket.",
        progress_desc: "Vent til pengene når banken din før du oppdaterer siden.",
        progress_details_title: "Detaljer for pågående overføring", personal_info: "Personlig informasjon",
        account_details: "Kontodetaljer", operation_secured: "Operasjonen din er sikret og registrert.",
        no_amount_debited: "Ingen beløp er belastet kontoen din.", download_receipt: "Last ned kvittering",
        receipt_thank_you_1: "Takk for at du bruker APP PAY.", receipt_thank_you_2: "Denne kvitteringen genereres automatisk.",
        transfer_success: "Overføringen fullført", receipt_subtitle: "OVERFØRINGSKVITTERING",
        validated_status: "Overføringen bekreftet", success_subtitle: "Overføringen er registrert.",
        transfer_pending: "Overføring venter", pending_subtitle: "Overføringen venter på validering.",
        pending_status: "Venter", transfer_failed: "Overføringen blokkert",
        transfer_failed_subtitle: "Overføringen ble blokkert. Kontakt kundeservice.",
        failed_status: "Blokkert", transfer_cancelled: "Overføringen avbrutt", cancelled_status: "Avbrutt", refunded_amount: "Refundert beløp",
        amount_sent: "SENDT BELØP", beneficiary: "Mottaker", date: "Dato", reference: "Referanse",
        back_to_dashboard: "Tilbake til dashbordet", my_virtual_card: "Virtuelt kort", holder: "Innehaver",
        expires: "Utløper", show_details: "Vis detaljer", hide_details: "Skjul detaljer", freeze_card: "Frys kortet",
        settings: "Innstillinger", monthly_limit: "Månedlig grense", monthly_spent: "Månedens forbruk", status: "Status",
        active: "Aktiv", type: "Type", verified: "Verifisert", account_holder_premium: "Kontoinnehaver • Premiumkunde",
        full_name: "Fullt navn", email_address: "E-postadresse", phone_number: "Telefonnummer",
        country: "Bostedsland", account_id: "Unik ID", opening_date: "Åpningsdato",
        edit_profile: "Rediger profil", security: "Sikkerhet", notifications: "Varsler",
        no_transactions: "Ingen transaksjoner ennå", err_email: "Feil e-postadresse.",
        err_pin: "Feil PIN-kode.", err_amount: "Ugyldig beløp.", err_balance: "Utilstrekkelig saldo.",
        err_fields: "Fyll ut alle felt.", err_activation: "Feil aktiveringskode.",
        err_percent: "Beløpet overstiger grensen ({limit}).", err_client_not_found: "Kunden ble ikke funnet.",
        err_no_link: "Ingen lenke.", welcome: "Velkommen", login_success: "Innlogging vellykket. Velkommen!",
        transfer_cancelled_toast: "Overføringen avbrutt.", transfer_finalized: "Overføringen fullført!",
        err_card_locked: "Visning ikke autorisert.", err_iban_locked: "IBAN-visning ikke autorisert.",
        iban_copied: "IBAN kopiert!", swift_copied: "SWIFT kopiert!", placeholder_email: "Din e-postadresse",
        placeholder_pin: "Din PIN-kode", placeholder_activation: "Skriv inn din hemmelige kode",
        card_footer: "Dette kortet er APP PAYs eksklusive eiendom.", card_security_note: "De siste 4 sifrene og CVV er skjult.",
        visa_premium: "Mastercard Premium", bank_details: "Bankdetaljer", iban_number: "IBAN-nummer",
        swift_code: "SWIFT / BIC-kode", iban_info_note: "Bruk disse detaljene for å motta overføringer.",
        show_iban: "Vis fullstendig IBAN", hide_iban: "Skjul IBAN", allowed_limit: "Tillatt grense:",
        limit_percentage: "Grenseprosent:", current_balance: "Nåværende saldo:", attempted_amount: "FORSSØKT BELØP",
        new_transaction_received: "Ny transaksjon mottatt!", copied: "Kopiert!",
        tap_to_flip: "Trykk på kortet for å snu", view_full_card: "Vis fullstendig nummer",
        flip_card: "Snu kortet", view_cvv: "Vis CVV-kode", receipt_title: "TRANSAKSJONSKVITTERING",
        receipt_sender: "Avsender", receipt_thank_you: "Takk for at du bruker APP PAY.",
        close: "Lukk", confirm_title_warning: "Advarsel", confirm_btn_cancel: "Avbryt", confirm_btn_ok: "Bekreft"
    },
    da: {
        dashboard: "Pung", personal_iban: "Personlig IBAN", logout: "Log ud", profile: "Profil",
        transfer_menu: "Overførsel", transfer_btn: "Foretag en overførsel", virtual_card_btn: "Virtuelt kort",
        available_balance: "Tilgængelig saldo", account_subtitle: "Konto til alle dine behov", see_iban: "Se min IBAN",
        make_transfer: "Foretag en overførsel", see_card: "Virtuelt kort", international_transfer: "Foretag en international overførsel",
        transfer_warning: "Overførslen behandles inden 1-3 minutter efter endelig verifikation.",
        transactions_history: "Transaktionshistorik", total_balance: "Samlet saldo", transactions_label: "Transaktioner",
        currency_label: "Valuta", view_all: "Se alle", today: "I dag", yesterday: "I går",
        transfer_received: "Overførsel modtaget", transfer_sent: "Overførsel sendt", completed: "Fuldført",
        amount: "Overførselsbeløb", beneficiary_name: "Modtagerens navn", iban: "IBAN / Kontonummer",
        bic: "Bankkode (BIC / SWIFT)", bank_name: "Bankens navn", reason: "Årsag til overførsel",
        continue: "Fortsæt", identity_verification: "Identitetsbekræftelse", pending_transfer_details: "Detaljer for ventende overførsel",
        cancel_transfer: "Annuller overførsel", enter_activation_code: "Indtast aktiveringskoden",
        activation_code: "Aktiveringskode", validate_transfer: "Valider overførsel",
        transfer_in_progress: "Din overførsel behandles...", identity_verified: "Identitetsbekræftelse gennemført.",
        progress_desc: "Vent på, at pengene når din bank, før du genindlæser siden.",
        progress_details_title: "Detaljer for igangværende overførsel", personal_info: "Personlige oplysninger",
        account_details: "Kontooplysninger", operation_secured: "Din handling er sikker og registreret.",
        no_amount_debited: "Intet beløb er blevet debiteret.", download_receipt: "Download kvittering",
        receipt_thank_you_1: "Tak fordi du bruger APP PAY.", receipt_thank_you_2: "Denne kvittering genereres automatisk.",
        transfer_success: "Overførslen gennemført", receipt_subtitle: "OVERFØRSELSKVITTERING",
        validated_status: "Overførslen bekræftet", success_subtitle: "Din overførsel er registreret.",
        transfer_pending: "Overførsel afventer", pending_subtitle: "Din overførsel afventer validering.",
        pending_status: "Afventer", transfer_failed: "Overførsel blokeret",
        transfer_failed_subtitle: "Din overførsel blev blokeret af systemet. Kontakt kundeservice.",
        failed_status: "Blokeret", transfer_cancelled: "Overførsel annulleret", cancelled_status: "Annulleret", refunded_amount: "Refunderet beløb",
        amount_sent: "SENDT BELØB", beneficiary: "Modtager", date: "Dato", reference: "Reference",
        back_to_dashboard: "Tilbage til dashboard", my_virtual_card: "Virtuelt kort", holder: "Indehaver",
        expires: "Udløber", show_details: "Vis detaljer", hide_details: "Skjul detaljer", freeze_card: "Frys kortet",
        settings: "Indstillinger", monthly_limit: "Månedlig grænse", monthly_spent: "Månedens forbrug", status: "Status",
        active: "Aktiv", type: "Type", verified: "Verificeret", account_holder_premium: "Kontohaver • Premiumkunde",
        full_name: "Fulde navn", email_address: "E-mailadresse", phone_number: "Telefonnummer",
        country: "Bopælsland", account_id: "Unikt ID", opening_date: "Åbningsdato",
        edit_profile: "Rediger profil", security: "Sikkerhed", notifications: "Notifikationer",
        no_transactions: "Ingen transaktioner endnu", err_email: "Forkert e-mailadresse.",
        err_pin: "Forkert PIN-kode.", err_amount: "Ugyldigt beløb.", err_balance: "Utilstrækkelig saldo.",
        err_fields: "Udfyld alle felter.", err_activation: "Forkert aktiveringskode.",
        err_percent: "Beløbet overstiger grænsen ({limit}).", err_client_not_found: "Kunden blev ikke fundet.",
        err_no_link: "Ingen link.", welcome: "Velkommen", login_success: "Login gennemført. Velkommen!",
        transfer_cancelled_toast: "Overførsel annulleret.", transfer_finalized: "Overførsel gennemført!",
        err_card_locked: "Visning ikke autoriseret.", err_iban_locked: "IBAN-visning ikke autoriseret.",
        iban_copied: "IBAN kopieret!", swift_copied: "SWIFT kopieret!", placeholder_email: "Din e-mailadresse",
        placeholder_pin: "Din PIN-kode", placeholder_activation: "Indtast din hemmelige kode",
        card_footer: "Dette kort er APP PAYs eksklusive ejendom.", card_security_note: "De sidste 4 cifre og CVV er skjult.",
        visa_premium: "Mastercard Premium", bank_details: "Bankoplysninger", iban_number: "IBAN-nummer",
        swift_code: "SWIFT / BIC-kode", iban_info_note: "Brug disse oplysninger til at modtage overførsler.",
        show_iban: "Vis fuld IBAN", hide_iban: "Skjul IBAN", allowed_limit: "Tilladt grænse:",
        limit_percentage: "Grænseprocent:", current_balance: "Nuværende saldo:", attempted_amount: "FORSSØGT BELØB",
        new_transaction_received: "Ny transaktion modtaget!", copied: "Kopieret!",
        tap_to_flip: "Tryk på kortet for at vende", view_full_card: "Se fuldt nummer",
        flip_card: "Vend kortet", view_cvv: "Se CVV-kode", receipt_title: "TRANSAKTIONSKVITTERING",
        receipt_sender: "Afsender", receipt_thank_you: "Tak fordi du bruger APP PAY.",
        close: "Luk", confirm_title_warning: "Advarsel", confirm_btn_cancel: "Annuller", confirm_btn_ok: "Bekræft"
    },
    fi: {
        dashboard: "Lompakko", personal_iban: "Henkilökohtainen IBAN", logout: "Kirjaudu ulos", profile: "Profiili",
        transfer_menu: "Tilisiirto", transfer_btn: "Tee tilisiirto", virtual_card_btn: "Virtuaalikortti",
        available_balance: "Käytettävissä oleva saldo", account_subtitle: "Tili kaikkiin tarpeisiisi", see_iban: "Näytä IBAN-tilini",
        make_transfer: "Tee tilisiirto", see_card: "Virtuaalikortti", international_transfer: "Tee kansainvälinen tilisiirto",
        transfer_warning: "Tilisiirron käsittely kestää 1-3 minuuttia lopullisen vahvistuksen jälkeen.",
        transactions_history: "Tapahtumahistoria", total_balance: "Kokonaissaldo", transactions_label: "Tapahtumat",
        currency_label: "Valuutta", view_all: "Näytä kaikki", today: "Tänään", yesterday: "Eilen",
        transfer_received: "Tilisiirto vastaanotettu", transfer_sent: "Tilisiirto lähetetty", completed: "Valmis",
        amount: "Tilisiirron määrä", beneficiary_name: "Saajan nimi", iban: "IBAN / Tilinnumero",
        bic: "Pankkikoodi (BIC / SWIFT)", bank_name: "Pankin nimi", reason: "Tilisiirron syy",
        continue: "Jatka", identity_verification: "Henkilöllisyyden vahvistus", pending_transfer_details: "Odottavan tilisiirron tiedot",
        cancel_transfer: "Peruuta tilisiirto", enter_activation_code: "Syötä tilisiirron aktivointikoodi",
        activation_code: "Aktivointikoodi", validate_transfer: "Vahvista tilisiirto",
        transfer_in_progress: "Tilisiirtosi on käsittelyssä...", identity_verified: "Henkilöllisyyden vahvistus onnistui.",
        progress_desc: "Odota, että varat saapuvat pankkiisi ennen sivun päivittämistä.",
        progress_details_title: "Käynnissä olevan tilisiirron tiedot", personal_info: "Henkilötiedot",
        account_details: "Tilin tiedot", operation_secured: "Toimintosi on turvallinen ja rekisteröity.",
        no_amount_debited: "Tililtäsi ei ole veloitettu mitään.", download_receipt: "Lataa kuitti",
        receipt_thank_you_1: "Kiitos, että käytät APP PAY -palvelua.", receipt_thank_you_2: "Tämä kuitti luodaan automaattisesti.",
        transfer_success: "Tilisiirto suoritettu onnistuneesti", receipt_subtitle: "TILISIIRTOKUITTaus",
        validated_status: "Tilisiirto vahvistettu", success_subtitle: "Tilisiirtosi on rekisteröity.",
        transfer_pending: "Tilisiirto odottaa", pending_subtitle: "Tilisiirtosi odottaa vahvistusta.",
        pending_status: "Odottaa", transfer_failed: "Tilisiirto estetty",
        transfer_failed_subtitle: "Tilisiirtosi estettiin. Ota yhteyttä asiakaspalveluun.",
        failed_status: "Estetty", transfer_cancelled: "Tilisiirto peruutettu", cancelled_status: "Peruutettu", refunded_amount: "Hyvitetty summa",
        amount_sent: "LÄHETETTY MÄÄRÄ", beneficiary: "Saaja", date: "Päivämäärä", reference: "Viite",
        back_to_dashboard: "Takaisin kojelautaan", my_virtual_card: "Virtuaalikortti", holder: "Haltija",
        expires: "Vanhenee", show_details: "Näytä tiedot", hide_details: "Piilota tiedot", freeze_card: "Jäädytä kortti",
        settings: "Asetukset", monthly_limit: "Kuukausiraja", monthly_spent: "Kuukauden kulut", status: "Tila",
        active: "Aktiivinen", type: "Tyyppi", verified: "Vahvistettu", account_holder_premium: "Tilinomistaja • Premium-asiakas",
        full_name: "Koko nimi", email_address: "Sähköpostiosoite", phone_number: "Puhelinnumero",
        country: "Asuinmaa", account_id: "Yksilöllinen ID", opening_date: "Avauspäivämäärä",
        edit_profile: "Muokkaa profiilia", security: "Turvallisuus", notifications: "Ilmoitukset",
        no_transactions: "Ei tapahtumia vielä", err_email: "Virheellinen sähköpostiosoite.",
        err_pin: "Virheellinen PIN-koodi.", err_amount: "Virheellinen summa.", err_balance: "Riittämätön saldo.",
        err_fields: "Täytä kaikki kentät.", err_activation: "Virheellinen aktivointikoodi.",
        err_percent: "Summa ylittää sallitun rajan ({limit}).", err_client_not_found: "Asiakasta ei löytynyt.",
        err_no_link: "Ei linkkiä.", welcome: "Tervetuloa", login_success: "Kirjautuminen onnistui. Tervetuloa!",
        transfer_cancelled_toast: "Tilisiirto peruutettu.", transfer_finalized: "Tilisiirto suoritettu!",
        err_card_locked: "Korttitietojen näyttö ei sallittu.", err_iban_locked: "IBAN-näyttö ei sallittu.",
        iban_copied: "IBAN kopioitu!", swift_copied: "SWIFT kopioitu!", placeholder_email: "Sähköpostiosoitteesi",
        placeholder_pin: "PIN-koodisi", placeholder_activation: "Syötä salainen koodisi",
        card_footer: "Tämä kortti on APP PAY:n yksinomainen omaisuus.", card_security_note: "Viimeiset 4 numeroa ja CVV on piilotettu.",
        visa_premium: "Mastercard Premium", bank_details: "Pankkitiedot", iban_number: "IBAN-numero",
        swift_code: "SWIFT / BIC-koodi", iban_info_note: "Käytä näitä tietoja vastaanottaaksesi tilisiirtoja.",
        show_iban: "Näytä koko IBAN", hide_iban: "Piilota IBAN", allowed_limit: "Sallittu raja:",
        limit_percentage: "Rajan prosenttiosuus:", current_balance: "Nykyinen saldo:", attempted_amount: "YRITETTY MÄÄRÄ",
        new_transaction_received: "Uusi tapahtuma vastaanotettu!", copied: "Kopioitu!",
        tap_to_flip: "Napauta korttia kääntääksesi", view_full_card: "Näytä koko numero",
        flip_card: "Käännä kortti", view_cvv: "Näytä CVV-koodi", receipt_title: "TAPAHTUMAKUITTaus",
        receipt_sender: "Lähettäjä", receipt_thank_you: "Kiitos, että käytät APP PAY -palvelua.",
        close: "Sulje", confirm_title_warning: "Varoitus", confirm_btn_cancel: "Peruuta", confirm_btn_ok: "Vahvista"
    },
    cs: {
        dashboard: "Peněženka", personal_iban: "Osobní IBAN", logout: "Odhlásit se", profile: "Profil",
        transfer_menu: "Převod", transfer_btn: "Provést převod", virtual_card_btn: "Virtuální karta",
        available_balance: "Dostupný zůstatek", account_subtitle: "Účet pro všechny vaše potřeby", see_iban: "Zobrazit můj IBAN",
        make_transfer: "Provést převod", see_card: "Virtuální karta", international_transfer: "Provést mezinárodní převod",
        transfer_warning: "Zpracování převodu trvá 1-3 minuty po konečném ověření.",
        transactions_history: "Historie transakcí", total_balance: "Celkový zůstatek", transactions_label: "Transakce",
        currency_label: "Měna", view_all: "Zobrazit vše", today: "Dnes", yesterday: "Včera",
        transfer_received: "Převod přijat", transfer_sent: "Převod odeslán", completed: "Dokončeno",
        amount: "Částka převodu", beneficiary_name: "Jméno příjemce", iban: "IBAN / Číslo účtu",
        bic: "Kód banky (BIC / SWIFT)", bank_name: "Název banky", reason: "Důvod převodu",
        continue: "Pokračovat", identity_verification: "Ověření totožnosti", pending_transfer_details: "Podrobnosti čekajícího převodu",
        cancel_transfer: "Zrušit převod", enter_activation_code: "Zadejte aktivační kód převodu",
        activation_code: "Aktivační kód", validate_transfer: "Potvrdit převod",
        transfer_in_progress: "Váš převod se zpracovává...", identity_verified: "Ověření totožnosti úspěšné.",
        progress_desc: "Počkejte, až prostředky dorazí do vaší banky, než obnovíte stránku.",
        progress_details_title: "Podrobnosti probíhajícího převodu", personal_info: "Osobní údaje",
        account_details: "Údaje o účtu", operation_secured: "Vaše operace je zabezpečena a zaznamenána.",
        no_amount_debited: "Z vašeho účtu nebyla odečtena žádná částka.", download_receipt: "Stáhnout potvrzení",
        receipt_thank_you_1: "Děkujeme, že používáte APP PAY.", receipt_thank_you_2: "Toto potvrzení se generuje automaticky.",
        transfer_success: "Převod úspěšně dokončen", receipt_subtitle: "POTVRZENÍ O PŘEVODU",
        validated_status: "Převod potvrzen", success_subtitle: "Váš převod byl zaregistrován.",
        transfer_pending: "Převod čeká", pending_subtitle: "Váš převod čeká na ověření.",
        pending_status: "Čeká", transfer_failed: "Převod zablokován",
        transfer_failed_subtitle: "Váš převod byl zablokován systémem. Kontaktujte zákaznickou podporu.",
        failed_status: "Zablokováno", transfer_cancelled: "Převod zrušen", cancelled_status: "Zrušeno", refunded_amount: "Vrácená částka",
        amount_sent: "ODESLANÁ ČÁSTKA", beneficiary: "Příjemce", date: "Datum", reference: "Reference",
        back_to_dashboard: "Zpět na hlavní panel", my_virtual_card: "Virtuální karta", holder: "Držitel",
        expires: "Platnost do", show_details: "Zobrazit podrobnosti", hide_details: "Skrýt podrobnosti", freeze_card: "Zmrazit kartu",
        settings: "Nastavení", monthly_limit: "Měsíční limit", monthly_spent: "Výdaje za měsíc", status: "Stav",
        active: "Aktivní", type: "Typ", verified: "Ověřeno", account_holder_premium: "Majitel účtu • Premium klient",
        full_name: "Celé jméno", email_address: "E-mailová adresa", phone_number: "Telefonní číslo",
        country: "Země pobytu", account_id: "Unikátní ID", opening_date: "Datum otevření",
        edit_profile: "Upravit profil", security: "Zabezpečení", notifications: "Oznámení",
        no_transactions: "Zatím žádné transakce", err_email: "Nesprávná e-mailová adresa.",
        err_pin: "Nesprávný PIN kód.", err_amount: "Neplatná částka.", err_balance: "Nedostatečný zůstatek.",
        err_fields: "Vyplňte všechna pole.", err_activation: "Nesprávný aktivační kód.",
        err_percent: "Částka překračuje limit ({limit}).", err_client_not_found: "Klient nenalezen.",
        err_no_link: "Žádný odkaz.", welcome: "Vítejte", login_success: "Přihlášení úspěšné. Vítejte!",
        transfer_cancelled_toast: "Převod zrušen.", transfer_finalized: "Převod dokončen!",
        err_card_locked: "Zobrazení údajů o kartě není povoleno.", err_iban_locked: "Zobrazení IBAN není povoleno.",
        iban_copied: "IBAN zkopírován!", swift_copied: "SWIFT zkopírován!", placeholder_email: "Vaše e-mailová adresa",
        placeholder_pin: "Váš PIN kód", placeholder_activation: "Zadejte svůj tajný kód",
        card_footer: "Tato karta je výhradním vlastnictvím APP PAY.", card_security_note: "Poslední 4 číslice a CVV byly skryty.",
        visa_premium: "Mastercard Premium", bank_details: "Bankovní údaje", iban_number: "Číslo IBAN",
        swift_code: "Kód SWIFT / BIC", iban_info_note: "Použijte tyto údaje pro příjem převodů.",
        show_iban: "Zobrazit celý IBAN", hide_iban: "Skrýt IBAN", allowed_limit: "Povolený limit:",
        limit_percentage: "Procento limitu:", current_balance: "Aktuální zůstatek:", attempted_amount: "POKUS O ČÁSTKU",
        new_transaction_received: "Nová transakce přijata!", copied: "Zkopírováno!",
        tap_to_flip: "Klepnutím na kartu ji otočíte", view_full_card: "Zobrazit plné číslo",
        flip_card: "Otočit kartu", view_cvv: "Zobrazit CVV kód", receipt_title: "POTVRZENÍ TRANSAKCE",
        receipt_sender: "Odesílatel", receipt_thank_you: "Děkujeme, že používáte APP PAY.",
        close: "Zavřít", confirm_title_warning: "Upozornění", confirm_btn_cancel: "Zrušit", confirm_btn_ok: "Potvrdit"
    },
    sk: {
        dashboard: "Peňaženka", personal_iban: "Osobný IBAN", logout: "Odhlásiť sa", profile: "Profil",
        transfer_menu: "Prevod", transfer_btn: "Vykonať prevod", virtual_card_btn: "Virtuálna karta",
        available_balance: "Dostupný zostatok", account_subtitle: "Účet pre všetky vaše potreby", see_iban: "Zobraziť môj IBAN",
        make_transfer: "Vykonať prevod", see_card: "Virtuálna karta", international_transfer: "Vykonať medzinárodný prevod",
        transfer_warning: "Spracovanie prevodu trvá 1-3 minúty po konečnom overení.",
        transactions_history: "História transakcií", total_balance: "Celkový zostatok", transactions_label: "Transakcie",
        currency_label: "Mena", view_all: "Zobraziť všetko", today: "Dnes", yesterday: "Včera",
        transfer_received: "Prevod prijatý", transfer_sent: "Prevod odoslaný", completed: "Dokončené",
        amount: "Suma prevodu", beneficiary_name: "Meno príjemcu", iban: "IBAN / Číslo účtu",
        bic: "Kód banky (BIC / SWIFT)", bank_name: "Názov banky", reason: "Dôvod prevodu",
        continue: "Pokračovať", identity_verification: "Overenie totožnosti", pending_transfer_details: "Podrobnosti čakajúceho prevodu",
        cancel_transfer: "Zrušiť prevod", enter_activation_code: "Zadajte aktivačný kód prevodu",
        activation_code: "Aktivačný kód", validate_transfer: "Potvrdiť prevod",
        transfer_in_progress: "Váš prevod sa spracováva...", identity_verified: "Overenie totožnosti úspešné.",
        progress_desc: "Počkajte, kým prostriedky dorazia do vašej banky, pred obnovením stránky.",
        progress_details_title: "Podrobnosti prebiehajúceho prevodu", personal_info: "Osobné údaje",
        account_details: "Údaje o účte", operation_secured: "Vaša operácia je zabezpečená a zaznamenaná.",
        no_amount_debited: "Z vášho účtu nebola odpísaná žiadna suma.", download_receipt: "Stiahnuť potvrdenie",
        receipt_thank_you_1: "Ďakujeme, že používate APP PAY.", receipt_thank_you_2: "Toto potvrdenie sa generuje automaticky.",
        transfer_success: "Prevod úspešne dokončený", receipt_subtitle: "POTVRDENIE O PREVODE",
        validated_status: "Prevod potvrdený", success_subtitle: "Váš prevod bol zaregistrovaný.",
        transfer_pending: "Prevod čaká", pending_subtitle: "Váš prevod čaká na overenie.",
        pending_status: "Čaká", transfer_failed: "Prevod zablokovaný",
        transfer_failed_subtitle: "Váš prevod bol zablokovaný systémom. Kontaktujte zákaznícku podporu.",
        failed_status: "Zablokované", transfer_cancelled: "Prevod zrušený", cancelled_status: "Zrušené", refunded_amount: "Vrátená suma",
        amount_sent: "ODOSLANÁ SUMA", beneficiary: "Príjemca", date: "Dátum", reference: "Referencia",
        back_to_dashboard: "Späť na hlavný panel", my_virtual_card: "Virtuálna karta", holder: "Držiteľ",
        expires: "Platnosť do", show_details: "Zobraziť podrobnosti", hide_details: "Skryť podrobnosti", freeze_card: "Zmraziť kartu",
        settings: "Nastavenia", monthly_limit: "Mesačný limit", monthly_spent: "Výdavky za mesiac", status: "Stav",
        active: "Aktívna", type: "Typ", verified: "Overené", account_holder_premium: "Majiteľ účtu • Premium klient",
        full_name: "Celé meno", email_address: "E-mailová adresa", phone_number: "Telefónne číslo",
        country: "Krajina pobytu", account_id: "Unikátne ID", opening_date: "Dátum otvorenia",
        edit_profile: "Upraviť profil", security: "Zabezpečenie", notifications: "Oznámenia",
        no_transactions: "Zatiaľ žiadne transakcie", err_email: "Nesprávna e-mailová adresa.",
        err_pin: "Nesprávny PIN kód.", err_amount: "Neplatná suma.", err_balance: "Nedostatočný zostatok.",
        err_fields: "Vyplňte všetky polia.", err_activation: "Nesprávny aktivačný kód.",
        err_percent: "Suma prekračuje limit ({limit}).", err_client_not_found: "Klient nenájdený.",
        err_no_link: "Žiadny odkaz.", welcome: "Vitajte", login_success: "Prihlásenie úspešné. Vitajte!",
        transfer_cancelled_toast: "Prevod zrušený.", transfer_finalized: "Prevod dokončený!",
        err_card_locked: "Zobrazenie údajov o karte nie je povolené.", err_iban_locked: "Zobrazenie IBAN nie je povolené.",
        iban_copied: "IBAN skopírovaný!", swift_copied: "SWIFT skopírovaný!", placeholder_email: "Vaša e-mailová adresa",
        placeholder_pin: "Váš PIN kód", placeholder_activation: "Zadajte svoj tajný kód",
        card_footer: "Táto karta je výhradným vlastníctvom APP PAY.", card_security_note: "Posledné 4 číslice a CVV boli skryté.",
        visa_premium: "Mastercard Premium", bank_details: "Bankové údaje", iban_number: "Číslo IBAN",
        swift_code: "Kód SWIFT / BIC", iban_info_note: "Použite tieto údaje na prijímanie prevodov.",
        show_iban: "Zobraziť celý IBAN", hide_iban: "Skryť IBAN", allowed_limit: "Povolený limit:",
        limit_percentage: "Percento limitu:", current_balance: "Aktuálny zostatok:", attempted_amount: "POKUS O SUMU",
        new_transaction_received: "Nová transakcia prijatá!", copied: "Skopírované!",
        tap_to_flip: "Klepnite na kartu na otočenie", view_full_card: "Zobraziť plné číslo",
        flip_card: "Otočiť kartu", view_cvv: "Zobraziť CVV kód", receipt_title: "POTVRDENIE TRANSAKCIE",
        receipt_sender: "Odosielateľ", receipt_thank_you: "Ďakujeme, že používate APP PAY.",
        close: "Zavrieť", confirm_title_warning: "Upozornenie", confirm_btn_cancel: "Zrušiť", confirm_btn_ok: "Potvrdiť"
    },
    hr: {
        dashboard: "Novčanik", personal_iban: "Osobni IBAN", logout: "Odjava", profile: "Profil",
        transfer_menu: "Prijenos", transfer_btn: "Izvrši prijenos", virtual_card_btn: "Virtualna kartica",
        available_balance: "Dostupno stanje", account_subtitle: "Račun za sve vaše potrebe", see_iban: "Prikaži moj IBAN",
        make_transfer: "Izvrši prijenos", see_card: "Virtualna kartica", international_transfer: "Izvrši međunarodni prijenos",
        transfer_warning: "Obrada prijenosa traje 1-3 minute nakon konačne provjere.",
        transactions_history: "Povijest transakcija", total_balance: "Ukupno stanje", transactions_label: "Transakcije",
        currency_label: "Valuta", view_all: "Prikaži sve", today: "Danas", yesterday: "Jučer",
        transfer_received: "Prijenos primljen", transfer_sent: "Prijenos poslan", completed: "Dovršeno",
        amount: "Iznos prijenosa", beneficiary_name: "Ime primatelja", iban: "IBAN / Broj računa",
        bic: "Kod banke (BIC / SWIFT)", bank_name: "Naziv banke", reason: "Razlog prijenosa",
        continue: "Nastavi", identity_verification: "Provjera identiteta", pending_transfer_details: "Detalji prijenosa na čekanju",
        cancel_transfer: "Otkaži prijenos", enter_activation_code: "Unesite aktivacijski kod prijenosa",
        activation_code: "Aktivacijski kod", validate_transfer: "Potvrdi prijenos",
        transfer_in_progress: "Vaš prijenos se obrađuje...", identity_verified: "Provjera identiteta uspješna.",
        progress_desc: "Pričekajte da sredstva stignu u vašu banku prije osvježavanja stranice.",
        progress_details_title: "Detalji prijenosa u tijeku", personal_info: "Osobni podaci",
        account_details: "Detalji računa", operation_secured: "Vaša operacija je sigurna i zabilježena.",
        no_amount_debited: "S vašeg računa nije skinut nikakav iznos.", download_receipt: "Preuzmi potvrdu",
        receipt_thank_you_1: "Hvala što koristite APP PAY.", receipt_thank_you_2: "Ova potvrda se generira automatski.",
        transfer_success: "Prijenos uspješno dovršen", receipt_subtitle: "POTVRDA O PRIJENOSU",
        validated_status: "Prijenos potvrđen", success_subtitle: "Vaš prijenos je registriran.",
        transfer_pending: "Prijenos čeka", pending_subtitle: "Vaš prijenos čeka provjeru.",
        pending_status: "Čeka", transfer_failed: "Prijenos blokiran",
        transfer_failed_subtitle: "Vaš prijenos je blokiran. Kontaktirajte korisničku podršku.",
        failed_status: "Blokirano", transfer_cancelled: "Prijenos otkazan", cancelled_status: "Otkazano", refunded_amount: "Vraćeni iznos",
        amount_sent: "POSLANI IZNOS", beneficiary: "Primatelj", date: "Datum", reference: "Referenca",
        back_to_dashboard: "Natrag na nadzornu ploču", my_virtual_card: "Virtualna kartica", holder: "Vlasnik",
        expires: "Istječe", show_details: "Prikaži detalje", hide_details: "Sakrij detalje", freeze_card: "Zamrzni karticu",
        settings: "Postavke", monthly_limit: "Mjesečni limit", monthly_spent: "Mjesečna potrošnja", status: "Status",
        active: "Aktivna", type: "Tip", verified: "Provjereno", account_holder_premium: "Vlasnik računa • Premium klijent",
        full_name: "Puno ime", email_address: "E-mail adresa", phone_number: "Broj telefona",
        country: "Zemlja prebivališta", account_id: "Jedinstveni ID", opening_date: "Datum otvaranja",
        edit_profile: "Uredi profil", security: "Sigurnost", notifications: "Obavijesti",
        no_transactions: "Još nema transakcija", err_email: "Neispravna e-mail adresa.",
        err_pin: "Neispravan PIN.", err_amount: "Neispravan iznos.", err_balance: "Nedovoljno sredstava.",
        err_fields: "Ispunite sva polja.", err_activation: "Neispravan aktivacijski kod.",
        err_percent: "Iznos prelazi dopušteni limit ({limit}).", err_client_not_found: "Klijent nije pronađen.",
        err_no_link: "Nema poveznice.", welcome: "Dobrodošli", login_success: "Prijava uspješna. Dobrodošli!",
        transfer_cancelled_toast: "Prijenos otkazan.", transfer_finalized: "Prijenos dovršen!",
        err_card_locked: "Prikaz podataka kartice nije dopušten.", err_iban_locked: "Prikaz IBAN-a nije dopušten.",
        iban_copied: "IBAN kopiran!", swift_copied: "SWIFT kopiran!", placeholder_email: "Vaša e-mail adresa",
        placeholder_pin: "Vaš PIN", placeholder_activation: "Unesite svoj tajni kod",
        card_footer: "Ova kartica je isključivo vlasništvo APP PAY.", card_security_note: "Posljednje 4 znamenke i CVV su skriveni.",
        visa_premium: "Mastercard Premium", bank_details: "Bankovni podaci", iban_number: "IBAN broj",
        swift_code: "SWIFT / BIC kod", iban_info_note: "Koristite ove podatke za primanje prijenosa.",
        show_iban: "Prikaži cijeli IBAN", hide_iban: "Sakrij IBAN", allowed_limit: "Dopušteni limit:",
        limit_percentage: "Postotak limita:", current_balance: "Trenutno stanje:", attempted_amount: "POKUŠANI IZNOS",
        new_transaction_received: "Nova transakcija primljena!", copied: "Kopirano!",
        tap_to_flip: "Dodirnite karticu za okretanje", view_full_card: "Prikaži puni broj",
        flip_card: "Okreni karticu", view_cvv: "Prikaži CVV kod", receipt_title: "POTVRDA TRANSAKCIJE",
        receipt_sender: "Pošiljatelj", receipt_thank_you: "Hvala što koristite APP PAY.",
        close: "Zatvori", confirm_title_warning: "Upozorenje", confirm_btn_cancel: "Odustani", confirm_btn_ok: "Potvrdi"
    },
    bg: {
        dashboard: "Портфейл", personal_iban: "Личен IBAN", logout: "Изход", profile: "Профил",
        transfer_menu: "Превод", transfer_btn: "Направи превод", virtual_card_btn: "Виртуална карта",
        available_balance: "Наличен баланс", account_subtitle: "Сметка за всички ваши нужди", see_iban: "Виж моя IBAN",
        make_transfer: "Направи превод", see_card: "Виртуална карта", international_transfer: "Международен превод",
        transfer_warning: "Обработката на превода отнема 1-3 минути след окончателната проверка.",
        transactions_history: "История на транзакциите", total_balance: "Общ баланс", transactions_label: "Транзакции",
        currency_label: "Валута", view_all: "Виж всички", today: "Днес", yesterday: "Вчера",
        transfer_received: "Превод получен", transfer_sent: "Превод изпратен", completed: "Завършено",
        amount: "Сума на превода", beneficiary_name: "Име на получателя", iban: "IBAN / Номер на сметка",
        bic: "Банков код (BIC / SWIFT)", bank_name: "Име на банката", reason: "Причина за превода",
        continue: "Продължи", identity_verification: "Проверка на самоличността", pending_transfer_details: "Детайли за чакащ превод",
        cancel_transfer: "Отмени превод", enter_activation_code: "Въведете активационния код",
        activation_code: "Активационен код", validate_transfer: "Потвърди превод",
        transfer_in_progress: "Вашият превод се обработва...", identity_verified: "Проверката е успешна.",
        progress_desc: "Изчакайте средствата да достигнат до вашата банка, преди да опресните страницата.",
        progress_details_title: "Детайли на текущия превод", personal_info: "Лична информация",
        account_details: "Детайли на сметката", operation_secured: "Операцията е защитена и записана.",
        no_amount_debited: "Не е удържана сума от вашата сметка.", download_receipt: "Изтегли разписка",
        receipt_thank_you_1: "Благодарим ви, че използвате APP PAY.", receipt_thank_you_2: "Тази разписка се генерира автоматично.",
        transfer_success: "Преводът е успешно изпълнен", receipt_subtitle: "РАЗПИСКА ЗА ПРЕВОД",
        validated_status: "Преводът е потвърден", success_subtitle: "Преводът ви е регистриран.",
        transfer_pending: "Преводът чака", pending_subtitle: "Преводът ви очаква потвърждение.",
        pending_status: "Чака", transfer_failed: "Преводът е блокиран",
        transfer_failed_subtitle: "Преводът ви беше блокиран. Свържете се с обслужването на клиенти.",
        failed_status: "Блокиран", transfer_cancelled: "Преводът е отменен", cancelled_status: "Отменен", refunded_amount: "Върната сума",
        amount_sent: "ИЗПРАТЕНА СУМА", beneficiary: "Получател", date: "Дата", reference: "Референция",
        back_to_dashboard: "Обратно към таблото", my_virtual_card: "Виртуална карта", holder: "Титуляр",
        expires: "Изтича", show_details: "Покажи детайли", hide_details: "Скрий детайли", freeze_card: "Замрази карта",
        settings: "Настройки", monthly_limit: "Месечен лимит", monthly_spent: "Разходи за месеца", status: "Статус",
        active: "Активна", type: "Тип", verified: "Проверен", account_holder_premium: "Титуляр • Premium клиент",
        full_name: "Пълно име", email_address: "Имейл адрес", phone_number: "Телефонен номер",
        country: "Страна на пребиваване", account_id: "Уникален ID", opening_date: "Дата на откриване",
        edit_profile: "Редактирай профил", security: "Сигурност", notifications: "Известия",
        no_transactions: "Все още няма транзакции", err_email: "Грешен имейл адрес.",
        err_pin: "Грешен PIN код.", err_amount: "Невалидна сума.", err_balance: "Недостатъчен баланс.",
        err_fields: "Попълнете всички полета.", err_activation: "Грешен активационен код.",
        err_percent: "Сумата надвишава лимита ({limit}).", err_client_not_found: "Клиентът не е намерен.",
        err_no_link: "Няма връзка.", welcome: "Добре дошли", login_success: "Успешен вход. Добре дошли!",
        transfer_cancelled_toast: "Преводът е отменен.", transfer_finalized: "Преводът е завършен!",
        err_card_locked: "Показването на данни за картата не е разрешено.", err_iban_locked: "Показването на IBAN не е разрешено.",
        iban_copied: "IBAN копиран!", swift_copied: "SWIFT копиран!", placeholder_email: "Вашият имейл",
        placeholder_pin: "Вашият PIN", placeholder_activation: "Въведете тайния си код",
        card_footer: "Тази карта е изключителна собственост на APP PAY.", card_security_note: "Последните 4 цифри и CVV са скрити.",
        visa_premium: "Mastercard Premium", bank_details: "Банкови данни", iban_number: "IBAN номер",
        swift_code: "SWIFT / BIC код", iban_info_note: "Използвайте тези данни за получаване на преводи.",
        show_iban: "Покажи пълния IBAN", hide_iban: "Скрий IBAN", allowed_limit: "Разрешен лимит:",
        limit_percentage: "Процент на лимита:", current_balance: "Текущ баланс:", attempted_amount: "ОПИТАНА СУМА",
        new_transaction_received: "Получена нова транзакция!", copied: "Копирано!",
        tap_to_flip: "Докоснете картата, за да я обърнете", view_full_card: "Виж пълния номер",
        flip_card: "Обърни картата", view_cvv: "Виж CVV код", receipt_title: "РАЗПИСКА ЗА ТРАНЗАКЦИЯ",
        receipt_sender: "Подател", receipt_thank_you: "Благодарим ви, че използвате APP PAY.",
        close: "Затвори", confirm_title_warning: "Внимание", confirm_btn_cancel: "Отказ", confirm_btn_ok: "Потвърди"
    },
    sr: {
        dashboard: "Новчаник", personal_iban: "Лични IBAN", logout: "Одјава", profile: "Профил",
        transfer_menu: "Пренос", transfer_btn: "Изврши пренос", virtual_card_btn: "Виртуелна картица",
        available_balance: "Доступно стање", account_subtitle: "Рачун за све ваше потребе", see_iban: "Прикажи мој IBAN",
        make_transfer: "Изврши пренос", see_card: "Виртуелна картица", international_transfer: "Међународни пренос",
        transfer_warning: "Обрада преноса траје 1-3 минута након коначне провере.",
        transactions_history: "Историја трансакција", total_balance: "Укупно стање", transactions_label: "Трансакције",
        currency_label: "Валута", view_all: "Прикажи све", today: "Данас", yesterday: "Јуче",
        transfer_received: "Пренос примљен", transfer_sent: "Пренос послат", completed: "Завршено",
        amount: "Износ преноса", beneficiary_name: "Име примаоца", iban: "IBAN / Број рачуна",
        bic: "Код банке (BIC / SWIFT)", bank_name: "Назив банке", reason: "Разлог преноса",
        continue: "Настави", identity_verification: "Провера идентитета", pending_transfer_details: "Детаљи преноса на чекању",
        cancel_transfer: "Откажи пренос", enter_activation_code: "Унесите активациони код преноса",
        activation_code: "Активациони код", validate_transfer: "Потврди пренос",
        transfer_in_progress: "Ваш пренос се обрађује...", identity_verified: "Провера идентитета успешна.",
        progress_desc: "Сачекајте да средства стигну у вашу банку пре освјежавања странице.",
        progress_details_title: "Детаљи преноса у току", personal_info: "Лични подаци",
        account_details: "Детаљи рачуна", operation_secured: "Ваша операција је безбедна и забиљежена.",
        no_amount_debited: "Са вашег рачуна није скинут износ.", download_receipt: "Преузми потврду",
        receipt_thank_you_1: "Хвала што користите APP PAY.", receipt_thank_you_2: "Ова потврда се генерише аутоматски.",
        transfer_success: "Пренос успешно завршен", receipt_subtitle: "ПОТВРДА О ПРЕНОСУ",
        validated_status: "Пренос потврђен", success_subtitle: "Ваш пренос је регистрован.",
        transfer_pending: "Пренос чека", pending_subtitle: "Ваш пренос чека провјеру.",
        pending_status: "Чека", transfer_failed: "Пренос блокиран",
        transfer_failed_subtitle: "Ваш пренос је блокиран. Контактирајте корисничку подршку.",
        failed_status: "Блокирано", transfer_cancelled: "Пренос отказан", cancelled_status: "Отказано", refunded_amount: "Враћени износ",
        amount_sent: "ПОСЛАТИ ИЗНОС", beneficiary: "Прималац", date: "Датум", reference: "Референца",
        back_to_dashboard: "Назад на контролну таблу", my_virtual_card: "Виртуелна картица", holder: "Власник",
        expires: "Истиче", show_details: "Прикажи детаље", hide_details: "Сакриј детаље", freeze_card: "Замрзни картицу",
        settings: "Подешавања", monthly_limit: "Мјесечни лимит", monthly_spent: "Мјесечна потрошња", status: "Статус",
        active: "Активна", type: "Тип", verified: "Провјерен", account_holder_premium: "Власник рачуна • Premium клијент",
        full_name: "Пуно име", email_address: "Е-маил адреса", phone_number: "Број телефона",
        country: "Земља пребивалишта", account_id: "Јединствени ID", opening_date: "Датум отварања",
        edit_profile: "Уреди профил", security: "Безбједност", notifications: "Обавјештења",
        no_transactions: "Још нема трансакција", err_email: "Неисправна е-маил адреса.",
        err_pin: "Неисправан PIN.", err_amount: "Неисправан износ.", err_balance: "Недовољно средстава.",
        err_fields: "Попуните сва поља.", err_activation: "Неисправан активациони код.",
        err_percent: "Износ прелази дозвољени лимит ({limit}).", err_client_not_found: "Клијент није пронађен.",
        err_no_link: "Нема линка.", welcome: "Добродошли", login_success: "Пријава успјешна. Добродошли!",
        transfer_cancelled_toast: "Пренос отказан.", transfer_finalized: "Пренос завршен!",
        err_card_locked: "Приказ података картице није дозвољен.", err_iban_locked: "Приказ IBAN-а није дозвољен.",
        iban_copied: "IBAN копиран!", swift_copied: "SWIFT копиран!", placeholder_email: "Ваша е-маил адреса",
        placeholder_pin: "Ваш PIN", placeholder_activation: "Унесите свој тајни код",
        card_footer: "Ова картица је искључиво власништво APP PAY.", card_security_note: "Последње 4 цифре и CVV су скривене.",
        visa_premium: "Mastercard Premium", bank_details: "Банковни подаци", iban_number: "IBAN број",
        swift_code: "SWIFT / BIC код", iban_info_note: "Користите ове податке за примање преноса.",
        show_iban: "Прикажи цијели IBAN", hide_iban: "Сакриј IBAN", allowed_limit: "Дозвољени лимит:",
        limit_percentage: "Проценат лимита:", current_balance: "Тренутно стање:", attempted_amount: "ПОКУШАНИ ИЗНОС",
        new_transaction_received: "Нова трансакција примљена!", copied: "Копирано!",
        tap_to_flip: "Додирните картицу за окретање", view_full_card: "Прикажи пун број",
        flip_card: "Окрени картицу", view_cvv: "Прикажи CVV код", receipt_title: "ПОТВРДА ТРАНСАКЦИЈЕ",
        receipt_sender: "Пошиљалац", receipt_thank_you: "Хвала што користите APP PAY.",
        close: "Затвори", confirm_title_warning: "Упозорење", confirm_btn_cancel: "Одустани", confirm_btn_ok: "Потврди"
    },
    af: {
        dashboard: "Beursie", personal_iban: "Persoonlike IBAN", logout: "Teken uit", profile: "Profiel",
        transfer_menu: "Oordrag", transfer_btn: "Maak 'n oordrag", virtual_card_btn: "Virtuele kaart",
        available_balance: "Beskikbare saldo", account_subtitle: "Rekening vir al jou behoeftes", see_iban: "Sien my IBAN",
        make_transfer: "Maak 'n oordrag", see_card: "Virtuele kaart", international_transfer: "Internasionale oordrag",
        transfer_warning: "Oordragverwerking neem 1 tot 3 minute na finale verifikasie.",
        transactions_history: "Transaksiegeskiedenis", total_balance: "Totale saldo", transactions_label: "Transaksies",
        currency_label: "Geldeenheid", view_all: "Sien alles", today: "Vandag", yesterday: "Gister",
        transfer_received: "Oordrag ontvang", transfer_sent: "Oordrag gestuur", completed: "Voltooi",
        amount: "Oordragbedrag", beneficiary_name: "Begunstigde se naam", iban: "IBAN / Rekeningnommer",
        bic: "Bankkode (BIC / SWIFT)", bank_name: "Bank se naam", reason: "Oordragrede",
        continue: "Gaan voort", identity_verification: "Identiteitsverifikasie", pending_transfer_details: "Besonderhede van hangende oordrag",
        cancel_transfer: "Kanselleer oordrag", enter_activation_code: "Voer die aktiveringskode in",
        activation_code: "Aktiveringskode", validate_transfer: "Valideer oordrag",
        transfer_in_progress: "Jou oordrag word verwerk...", identity_verified: "Identiteitsverifikasie suksesvol.",
        progress_desc: "Wag tot die fondse jou bank bereik voordat jy die bladsy herlaai.",
        progress_details_title: "Besonderhede van lopende oordrag", personal_info: "Persoonlike inligting",
        account_details: "Rekeningbesonderhede", operation_secured: "Jou operasie is veilig en geregistreer.",
        no_amount_debited: "Geen bedrag is van jou rekening gedebiteer nie.", download_receipt: "Laai kwitansie af",
        receipt_thank_you_1: "Dankie dat jy APP PAY gebruik.", receipt_thank_you_2: "Hierdie kwitansie word outomaties gegenereer.",
        transfer_success: "Oordrag suksesvol voltooi", receipt_subtitle: "OORDRAGKWITANSIE",
        validated_status: "Oordrag bevestig", success_subtitle: "Jou oordrag is geregistreer.",
        transfer_pending: "Oordrag hangende", pending_subtitle: "Jou oordrag wag op validering.",
        pending_status: "Hangende", transfer_failed: "Oordrag geblokkeer",
        transfer_failed_subtitle: "Jou oordrag is deur die stelsel geblokkeer. Kontak kliëntediens.",
        failed_status: "Geblokkeer", transfer_cancelled: "Oordrag gekanselleer", cancelled_status: "Gekanselleer", refunded_amount: "Terugbetaalde bedrag",
        amount_sent: "GESTUURDE BEDRAG", beneficiary: "Begunstigde", date: "Datum", reference: "Verwysing",
        back_to_dashboard: "Terug na paneelbord", my_virtual_card: "Virtuele kaart", holder: "Houer",
        expires: "Verval", show_details: "Wys besonderhede", hide_details: "Versteek besonderhede", freeze_card: "Vries kaart",
        settings: "Instellings", monthly_limit: "Maandelikse limiet", monthly_spent: "Maandelikse besteding", status: "Status",
        active: "Aktief", type: "Tipe", verified: "Geverifieer", account_holder_premium: "Rekeninghouer • Premium kliënt",
        full_name: "Volle naam", email_address: "E-posadres", phone_number: "Telefoonnommer",
        country: "Land van verblyf", account_id: "Unieke ID", opening_date: "Openingsdatum",
        edit_profile: "Wysig profiel", security: "Sekuriteit", notifications: "Kennisgewings",
        no_transactions: "Nog geen transaksies nie", err_email: "Verkeerde e-posadres.",
        err_pin: "Verkeerde PIN-kode.", err_amount: "Ongeldige bedrag.", err_balance: "Onvoldoende saldo.",
        err_fields: "Vul asseblief alle velde in.", err_activation: "Verkeerde aktiveringskode.",
        err_percent: "Bedrag oorskry die limiet ({limit}).", err_client_not_found: "Kliënt nie gevind nie.",
        err_no_link: "Geen skakel nie.", welcome: "Welkom", login_success: "Teken aan suksesvol. Welkom!",
        transfer_cancelled_toast: "Oordrag gekanselleer.", transfer_finalized: "Oordrag voltooi!",
        err_card_locked: "Kaartbesonderhede vertoon nie gemagtig nie.", err_iban_locked: "IBAN-vertoning nie gemagtig nie.",
        iban_copied: "IBAN gekopieer!", swift_copied: "SWIFT gekopieer!", placeholder_email: "Jou e-posadres",
        placeholder_pin: "Jou PIN-kode", placeholder_activation: "Voer jou geheime kode in",
        card_footer: "Hierdie kaart is die eksklusiewe eiendom van APP PAY.", card_security_note: "Die laaste 4 syfers en CVV is versteek.",
        visa_premium: "Mastercard Premium", bank_details: "Bankbesonderhede", iban_number: "IBAN-nommer",
        swift_code: "SWIFT / BIC-kode", iban_info_note: "Gebruik hierdie besonderhede om oordragte te ontvang.",
        show_iban: "Wys volle IBAN", hide_iban: "Versteek IBAN", allowed_limit: "Toegelate limiet:",
        limit_percentage: "Limietpersentasie:", current_balance: "Huidige saldo:", attempted_amount: "GEPROBEERDE BEDRAG",
        new_transaction_received: "Nuwe transaksie ontvang!", copied: "Gekopieer!",
        tap_to_flip: "Tik op die kaart om te draai", view_full_card: "Sien volle nommer",
        flip_card: "Draai kaart", view_cvv: "Sien CVV-kode", receipt_title: "TRANSAKSIEKWITANSIE",
        receipt_sender: "Afsender", receipt_thank_you: "Dankie dat jy APP PAY gebruik.",
        close: "Sluit", confirm_title_warning: "Waarskuwing", confirm_btn_cancel: "Kanselleer", confirm_btn_ok: "Bevestig"
    },
    am: {
        dashboard: "የኪስ ቦርሳ", personal_iban: "የግል IBAN", logout: "ውጣ", profile: "መገለጫ",
        transfer_menu: "ዝውውር", transfer_btn: "ዝውውር አድርግ", virtual_card_btn: "ምናባዊ ካርድ",
        available_balance: "ያለ ቀሪ ሂሳብ", account_subtitle: "ለሁሉም ፍላጎቶችዎ ሂሳብ", see_iban: "IBANዬን ተመልከት",
        make_transfer: "ዝውውር አድርግ", see_card: "ምናባዊ ካርድ", international_transfer: "ዓለም አቀፍ ዝውውር",
        transfer_warning: "የዝውውር ሂደት ከመጨረሻ ማረጋገጫ በኋላ 1-3 ደቂቃ ይወስዳል።",
        transactions_history: "የግብይት ታሪክ", total_balance: "አጠቃላይ ቀሪ ሂሳብ", transactions_label: "ግብይቶች",
        currency_label: "ምንዛሬ", view_all: "ሁሉንም ተመልከት", today: "ዛሬ", yesterday: "ትናንት",
        transfer_received: "ዝውውር ተቀብሏል", transfer_sent: "ዝውውር ተልኳል", completed: "ተጠናቋል",
        amount: "የዝውውር መጠን", beneficiary_name: "የተጠቃሚ ስም", iban: "IBAN / የሂሳብ ቁጥር",
        bic: "የባንክ ኮድ (BIC / SWIFT)", bank_name: "የባንክ ስም", reason: "የዝውውር ምክንያት",
        continue: "ቀጥል", identity_verification: "የማንነት ማረጋገጫ", pending_transfer_details: "በመጠባበቅ ላይ ያለ ዝውውር ዝርዝሮች",
        cancel_transfer: "ዝውውሩን ሰርዝ", enter_activation_code: "የዝውውር ማነቃቂያ ኮድ ያስገቡ",
        activation_code: "ማነቃቂያ ኮድ", validate_transfer: "ዝውውሩን አረጋግጥ",
        transfer_in_progress: "ዝውውርዎ በሂደት ላይ ነው...", identity_verified: "የማንነት ማረጋገጫ ተሳክቷል።",
        progress_desc: "ገንዘቡ ወደ ባንክዎ እስኪደርስ ድረስ ገጹን ከማደስዎ በፊት ይጠብቁ።",
        progress_details_title: "በሂደት ላይ ያለ ዝውውር ዝርዝሮች", personal_info: "የግል መረጃ",
        account_details: "የሂሳብ ዝርዝሮች", operation_secured: "ክዋኔዎ ደህንነቱ የተጠበቀ እና የተመዘገበ ነው።",
        no_amount_debited: "ከሂሳብዎ ምንም መጠን አልተቀነሰም።", download_receipt: "ደረሰኝ አውርድ",
        receipt_thank_you_1: "APP PAY ስለተጠቀሙ እናመሰግናለን።", receipt_thank_you_2: "ይህ ደረሰኝ በራስ-ሰር ይፈጠራል።",
        transfer_success: "ዝውውር በተሳካ ሁኔታ ተጠናቅቋል", receipt_subtitle: "የዝውውር ደረሰኝ",
        validated_status: "ዝውውር ተረጋግጧል", success_subtitle: "ዝውውርዎ ተመዝግቧል።",
        transfer_pending: "ዝውውር በመጠባበቅ ላይ", pending_subtitle: "ዝውውርዎ ማረጋገጫ በመጠባበቅ ላይ ነው።",
        pending_status: "በመጠባበቅ ላይ", transfer_failed: "ዝውውር ተዘግቷል",
        transfer_failed_subtitle: "ዝውውርዎ በስርዓቱ ተዘግቷል። እባክዎ የደንበኞች አገልግሎትን ያግኙ።",
        failed_status: "ተዘግቷል", transfer_cancelled: "ዝውውር ተሰርዟል", cancelled_status: "ተሰርዟል", refunded_amount: "የተመላሽ መጠን",
        amount_sent: "የተላከ መጠን", beneficiary: "ተጠቃሚ", date: "ቀን", reference: "ማጣቀሻ",
        back_to_dashboard: "ወደ ዳሽቦርድ ተመለስ", my_virtual_card: "ምናባዊ ካርድ", holder: "ባለቤት",
        expires: "ያበቃል", show_details: "ዝርዝሮችን አሳይ", hide_details: "ዝርዝሮችን ደብቅ", freeze_card: "ካርዱን አቀዝቅዝ",
        settings: "ቅንብሮች", monthly_limit: "ወርሃዊ ገደብ", monthly_spent: "የዚህ ወር ወጪ", status: "ሁኔታ",
        active: "ንቁ", type: "አይነት", verified: "የተረጋገጠ", account_holder_premium: "የሂሳብ ባለቤት • ፕሪሚየም ደንበኛ",
        full_name: "ሙሉ ስም", email_address: "የኢሜል አድራሻ", phone_number: "የስልክ ቁጥር",
        country: "የመኖሪያ ሀገር", account_id: "ልዩ ID", opening_date: "የመክፈቻ ቀን",
        edit_profile: "መገለጫ አርትዕ", security: "ደህንነት", notifications: "ማሳወቂያዎች",
        no_transactions: "እስካሁን ግብይቶች የሉም", err_email: "የተሳሳተ የኢሜል አድራሻ።",
        err_pin: "የተሳሳተ PIN ኮድ።", err_amount: "ልክ ያልሆነ መጠን።", err_balance: "በቂ ያልሆነ ቀሪ ሂሳብ።",
        err_fields: "እባክዎ ሁሉንም መስኮች ይሙሉ።", err_activation: "የተሳሳተ ማነቃቂያ ኮድ።",
        err_percent: "መጠኑ ከገደቡ ({limit}) ይበልጣል።", err_client_not_found: "ደንበኛ አልተገኘም።",
        err_no_link: "አገናኝ የለም።", welcome: "እንኳን ደህና መጡ", login_success: "መግቢያ ተሳክቷል። እንኳን ደህና መጡ!",
        transfer_cancelled_toast: "ዝውውር ተሰርዟል።", transfer_finalized: "ዝውውር ተጠናቅቋል!",
        err_card_locked: "የካርድ ዝርዝር ማሳየት አልተፈቀደም።", err_iban_locked: "IBAN ማሳየት አልተፈቀደም።",
        iban_copied: "IBAN ተቀድቷል!", swift_copied: "SWIFT ተቀድቷል!", placeholder_email: "የእርስዎ የኢሜል አድራሻ",
        placeholder_pin: "የእርስዎ PIN ኮድ", placeholder_activation: "ሚስጥራዊ ኮድዎን ያስገቡ",
        card_footer: "ይህ ካርድ የAPP PAY ልዩ ንብረት ነው።", card_security_note: "የመጨረሻዎቹ 4 አሃዞች እና CVV ተደብቀዋል።",
        visa_premium: "Mastercard Premium", bank_details: "የባንክ ዝርዝሮች", iban_number: "የIBAN ቁጥር",
        swift_code: "SWIFT / BIC ኮድ", iban_info_note: "ዝውውሮችን ለመቀበል ይህን ይጠቀሙ።",
        show_iban: "ሙሉ IBAN አሳይ", hide_iban: "IBAN ደብቅ", allowed_limit: "የተፈቀደ ገደብ:",
        limit_percentage: "የገደብ በመቶኛ:", current_balance: "የአሁኑ ቀሪ ሂሳብ:", attempted_amount: "የተሞከረ መጠን",
        new_transaction_received: "አዲስ ግብይት ተቀብሏል!", copied: "ተቀድቷል!",
        tap_to_flip: "ካርዱን ለመገልበጥ ይንኩ", view_full_card: "ሙሉ ቁጥር ተመልከት",
        flip_card: "ካርድ ገልብጥ", view_cvv: "CVV ኮድ ተመልከት", receipt_title: "የግብይት ደረሰኝ",
        receipt_sender: "ላኪ", receipt_thank_you: "APP PAY ስለተጠቀሙ እናመሰግናለን።",
        close: "ዝጋ", confirm_title_warning: "ማስጠንቀቂያ", confirm_btn_cancel: "ሰርዝ", confirm_btn_ok: "አረጋግጥ"
    },
    ha: {
        dashboard: "Walat", personal_iban: "IBAN na sirri", logout: "Fita", profile: "Bayanan martaba",
        transfer_menu: "Canja wuri", transfer_btn: "Yi canja wuri", virtual_card_btn: "Katin kama-da-wane",
        available_balance: "Ma'auni mai samuwa", account_subtitle: "Asusu don duk bukatunku", see_iban: "Duba IBAN na",
        make_transfer: "Yi canja wuri", see_card: "Katin kama-da-wane", international_transfer: "Yi canja wurin ƙasa da ƙasa",
        transfer_warning: "Aikin canja wuri yana ɗaukar minti 1 zuwa 3 bayan tabbatarwa ta ƙarshe.",
        transactions_history: "Tarihin ma'amaloli", total_balance: "Jimillar ma'auni", transactions_label: "Ma'amaloli",
        currency_label: "Kuɗi", view_all: "Duba duka", today: "Yau", yesterday: "Jiya",
        transfer_received: "An karɓi canja wuri", transfer_sent: "An aika canja wuri", completed: "An kammala",
        amount: "Adadin canja wuri", beneficiary_name: "Sunan mai karɓa", iban: "IBAN / Lambar asusu",
        bic: "Lambar banki (BIC / SWIFT)", bank_name: "Sunan banki", reason: "Dalilin canja wuri",
        continue: "Ci gaba", identity_verification: "Tabbatar da ainihi", pending_transfer_details: "Bayanan canja wurin da ke jira",
        cancel_transfer: "Soke canja wuri", enter_activation_code: "Shigar da lambar kunnawa ta canja wuri",
        activation_code: "Lambar kunnawa", validate_transfer: "Tabbatar da canja wuri",
        transfer_in_progress: "Umarnin canja wurinku yana kan hanya...", identity_verified: "An tabbatar da ainihi cikin nasara.",
        progress_desc: "Da fatan za a jira kuɗin ya isa bankinku kafin sabunta wannan shafin.",
        progress_details_title: "Bayanan canja wuri da ke gudana", personal_info: "Bayanan sirri",
        account_details: "Bayanan asusu", operation_secured: "Aikinku yana da tsaro kuma an yi rikodin sa.",
        no_amount_debited: "Ba a cire wani adadi daga asusunku ba.", download_receipt: "Sauke rasit",
        receipt_thank_you_1: "Na gode da yin amfani da APP PAY.", receipt_thank_you_2: "Ana ƙirƙirar wannan rasit ta atomatik.",
        transfer_success: "An kammala canja wuri cikin nasara", receipt_subtitle: "RASIT ɗIN CANJA WURI",
        validated_status: "An tabbatar da canja wuri", success_subtitle: "An yi rikodin canja wurinku.",
        transfer_pending: "Canja wuri yana jira", pending_subtitle: "Canja wurinku yana jiran tabbatarwa.",
        pending_status: "Yana jira", transfer_failed: "An toshe canja wuri",
        transfer_failed_subtitle: "An toshe canja wurinku da tsarin. Da fatan za a tuntuɓi sabis ɗin abokin ciniki.",
        failed_status: "An toshe", transfer_cancelled: "An soke canja wuri", cancelled_status: "An soke", refunded_amount: "Adadin da aka mayar",
        amount_sent: "ADADIN DA AKA AIKA", beneficiary: "Mai karɓa", date: "Kwanan wata", reference: "Magana",
        back_to_dashboard: "Koma zuwa allon kulawa", my_virtual_card: "Katin kama-da-wane", holder: "Mai riƙewa",
        expires: "Yana ƙarewa", show_details: "Nuna bayanai", hide_details: "Ɓoye bayanai", freeze_card: "Daskare kati",
        settings: "Saituna", monthly_limit: "Iyakar wata", monthly_spent: "Kashe kuɗin wannan watan", status: "Matsayi",
        active: "Aiki", type: "Nau'i", verified: "An tabbatar", account_holder_premium: "Mai asusu • Abokin ciniki Premium",
        full_name: "Cikakken suna", email_address: "Adireshin imel", phone_number: "Lambar waya",
        country: "Ƙasar zama", account_id: "ID na musamman", opening_date: "Ranar buɗewa",
        edit_profile: "Gyara bayanan martaba", security: "Tsaro", notifications: "Sanarwa",
        no_transactions: "Babu ma'amaloli tukuna", err_email: "Adireshin imel mara inganci.",
        err_pin: "Lambar PIN mara inganci.", err_amount: "Adadi mara inganci.", err_balance: "Ma'auni bai isa ba.",
        err_fields: "Da fatan za a cika duk filayen.", err_activation: "Lambar kunnawa mara inganci.",
        err_percent: "Adadin ya wuce iyaka ({limit}).", err_client_not_found: "Ba a sami abokin ciniki ba.",
        err_no_link: "Babu hanyar haɗi.", welcome: "Barka da zuwa", login_success: "An shiga cikin nasara. Barka da zuwa!",
        transfer_cancelled_toast: "An soke canja wuri.", transfer_finalized: "An kammala canja wuri!",
        err_card_locked: "Ba a ba da izinin nuna bayanan kati ba.", err_iban_locked: "Ba a ba da izinin nuna IBAN ba.",
        iban_copied: "An kwafi IBAN!", swift_copied: "An kwafi SWIFT!", placeholder_email: "Adireshin imel ɗinku",
        placeholder_pin: "Lambar PIN ɗinku", placeholder_activation: "Shigar da lambar sirrinku",
        card_footer: "Wannan kati mallakar APP PAY ce ta musamman.", card_security_note: "An ɓoye lambobi 4 na ƙarshe da CVV.",
        visa_premium: "Mastercard Premium", bank_details: "Bayanan banki", iban_number: "Lambar IBAN",
        swift_code: "Lambar SWIFT / BIC", iban_info_note: "Yi amfani da waɗannan bayanan don karɓar canja wuri.",
        show_iban: "Nuna cikakken IBAN", hide_iban: "Ɓoye IBAN", allowed_limit: "Iyakar da aka yarda:",
        limit_percentage: "Kashi na iyaka:", current_balance: "Ma'aunin yanzu:", attempted_amount: "ADADIN DA AKA YI ƘOƘARI",
        new_transaction_received: "An karɓi sabon ma'amala!", copied: "An kwafa!",
        tap_to_flip: "Taɓa katin don jujjuya", view_full_card: "Duba cikakken lambar",
        flip_card: "Juya kati", view_cvv: "Duba lambar CVV", receipt_title: "RASIT ɗIN MA'AMALA",
        receipt_sender: "Mai aikawa", receipt_thank_you: "Na gode da yin amfani da APP PAY.",
        close: "Rufe", confirm_title_warning: "Gargadi", confirm_btn_cancel: "Soke", confirm_btn_ok: "Tabbatar"
    }
});

// ============================================================
// 🆕 FUSION DES 105 NOUVELLES LANGUES (fichier extrait)
// ============================================================
Object.assign(TRANSLATIONS, EXTRA_TRANSLATIONS);
// ============================================================
// CONVERSION SYMBOLE -> CODE DEVISE
// ============================================================
function getCurrencyCode(symbol) {
    const map = {
        'zł': 'PLN', '€': 'EUR', '$': 'USD', '£': 'GBP', 'CHF': 'CHF', '¥': 'JPY',
        'FCFA': 'XOF', 'NGN': 'NGN', 'GHS': 'GHS', 'KES': 'KES', 'ZAR': 'ZAR',
        'MAD': 'MAD', 'CAD': 'CAD', 'AUD': 'AUD', '¥ CNY': 'CNY', 'CNY': 'CNY',
        'RUB': 'RUB', 'UAH': 'UAH', 'BYN': 'BYN', 'TRY': 'TRY', 'SEK': 'SEK',
        'NOK': 'NOK', 'DKK': 'DKK', 'ISK': 'ISK', 'CZK': 'CZK', 'HUF': 'HUF',
        'RON': 'RON', 'BGN': 'BGN', 'RSD': 'RSD', 'BAM': 'BAM', 'MKD': 'MKD',
        'ALL': 'ALL', 'MDL': 'MDL', 'GEL': 'GEL', 'AMD': 'AMD', 'AZN': 'AZN',
        'MXN': 'MXN', 'BRL': 'BRL', 'ARS': 'ARS', 'CLP': 'CLP', 'COP': 'COP',
        'PEN': 'PEN', 'BOB': 'BOB', 'PYG': 'PYG', 'UYU': 'UYU', 'VES': 'VES',
        'CRC': 'CRC', 'GTQ': 'GTQ', 'HNL': 'HNL', 'NIO': 'NIO', 'PAB': 'PAB',
        'DOP': 'DOP', 'CUP': 'CUP', 'HTG': 'HTG', 'JMD': 'JMD', 'TTD': 'TTD',
        'BBD': 'BBD', 'BSD': 'BSD', 'BZD': 'BZD', 'XCD': 'XCD', 'SRD': 'SRD',
        'GYD': 'GYD', 'NZD': 'NZD', 'INR': 'INR', 'PKR': 'PKR', 'BDT': 'BDT',
        'LKR': 'LKR', 'NPR': 'NPR', 'BTN': 'BTN', 'MMK': 'MMK', 'THB': 'THB',
        'VND': 'VND', 'PHP': 'PHP', 'IDR': 'IDR', 'MYR': 'MYR', 'SGD': 'SGD',
        'HKD': 'HKD', 'TWD': 'TWD', 'MOP': 'MOP', 'KRW': 'KRW', 'KHR': 'KHR',
        'LAK': 'LAK', 'BND': 'BND', 'MVR': 'MVR', 'MNT': 'MNT', 'KZT': 'KZT',
        'UZS': 'UZS', 'SAR': 'SAR', 'AED': 'AED', 'QAR': 'QAR', 'KWD': 'KWD',
        'BHD': 'BHD', 'OMR': 'OMR', 'JOD': 'JOD', 'LBP': 'LBP', 'ILS': 'ILS',
        'IQD': 'IQD', 'SYP': 'SYP', 'YER': 'YER', 'IRR': 'IRR', 'AFN': 'AFN',
        'ETB': 'ETB', 'UGX': 'UGX', 'TZS': 'TZS', 'RWF': 'RWF', 'BIF': 'BIF',
        'CDF': 'CDF', 'AOA': 'AOA', 'MZN': 'MZN', 'ZMW': 'ZMW', 'ZWL': 'ZWL',
        'BWP': 'BWP', 'NAD': 'NAD', 'SZL': 'SZL', 'LSL': 'LSL', 'MWK': 'MWK',
        'MGA': 'MGA', 'MUR': 'MUR', 'SCR': 'SCR', 'KMF': 'KMF', 'DJF': 'DJF',
        'SOS': 'SOS', 'SDG': 'SDG', 'LYD': 'LYD', 'MRU': 'MRU', 'GMD': 'GMD',
        'GNF': 'GNF', 'SLE': 'SLE', 'LRD': 'LRD', 'CVE': 'CVE', 'STN': 'STN',
        'ERN': 'ERN', 'SSP': 'SSP', 'DZD': 'DZD', 'TND': 'TND', 'EGP': 'EGP',
        'FJD': 'FJD', 'PGK': 'PGK', 'WST': 'WST', 'TOP': 'TOP', 'VUV': 'VUV',
        'SBD': 'SBD', 'XPF': 'XPF'
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

function hexToRgb(hex) { const h = hex.replace('#', ''); return { r: parseInt(h.substring(0,2),16), g: parseInt(h.substring(2,4),16), b: parseInt(h.substring(4,6),16) }; }
function rgbToHex(r, g, b) { return '#' + [r,g,b].map(x => { const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16); return hex.length === 1 ? '0'+hex : hex; }).join(''); }
function lightenColor(hex, percent) { const { r, g, b } = hexToRgb(hex); return rgbToHex(r + (255-r)*(percent/100), g + (255-g)*(percent/100), b + (255-b)*(percent/100)); }
function darkenColor(hex, percent) { const { r, g, b } = hexToRgb(hex); return rgbToHex(r*(1-percent/100), g*(1-percent/100), b*(1-percent/100)); }
function hexToRgba(hex, alpha) { const { r, g, b } = hexToRgb(hex); return `rgba(${r}, ${g}, ${b}, ${alpha})`; }

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
        toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s';
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

        if (type === 'primary') newBtnOk.style.backgroundColor = 'var(--primary-color)';
        else newBtnOk.style.backgroundColor = '#e02424';

        const close = (result) => { modal.classList.remove('show'); resolve(result); };
        newBtnOk.addEventListener('click', () => close(true));
        newBtnCancel.addEventListener('click', () => close(false));
        modal.classList.add('show');
    });
}

function getClientIdFromURL() { const params = new URLSearchParams(window.location.search); return params.get('id'); }
function showScreen(screenId) { document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById(screenId).classList.add('active'); }

function generateCardDetails() {
    const prefix = "4823"; 
    const randomDigits = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    const cardNumber = prefix + randomDigits;
    const cvv = Math.floor(Math.random() * 900 + 100).toString();
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = (now.getFullYear() + 3).toString().slice(-2);
    return { cardNumber, cvv, expiry: `${month}/${year}` };
}

function generateIbanDetails() {
    const rand = (len) => Math.floor(Math.random() * Math.pow(10, len)).toString().padStart(len, '0');
    return { iban: `PL${rand(2)} ${rand(4)} ${rand(4)} ${rand(4)} ${rand(4)} ${rand(4)} ${rand(4)}`, swift: `WBKPPLPP${rand(3)}` };
}

function getDateGroupLabel(dateStr, lang) {
    if (!dateStr) return '';
    const datePart = dateStr.split(' • ')[0].trim();
    const parts = datePart.split('/');
    if (parts.length !== 3) return datePart;
    const day = parseInt(parts[0], 10), month = parseInt(parts[1], 10) - 1, year = parseInt(parts[2], 10);
    const txDate = new Date(year, month, day);
    const today = new Date(); today.setHours(0,0,0,0); txDate.setHours(0,0,0,0);
    const diffDays = Math.floor((today - txDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t('today');
    if (diffDays === 1) return t('yesterday');
    return datePart;
}

// ============================================================
// SESSION
// ============================================================
function saveSession() { if (!appState.clientId) return; try { localStorage.setItem(SESSION_KEY, JSON.stringify({ clientId: appState.clientId, loggedIn: true, savedAt: Date.now() })); } catch {} }
function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (Date.now() - data.savedAt > 7 * 24 * 60 * 60 * 1000) { localStorage.removeItem(SESSION_KEY); return null; }
        return data;
    } catch { return null; }
}
function clearSession() { try { localStorage.removeItem(SESSION_KEY); } catch {} }

// ============================================================
// TRACKING DE CONNEXION
// ============================================================
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let os = "Inconnu", browser = "Inconnu";
    if (/windows/i.test(ua)) os = "Windows"; else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
    else if (/android/i.test(ua)) os = "Android"; else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS"; else if (/linux/i.test(ua)) os = "Linux";
    if (/edg/i.test(ua)) browser = "Edge"; else if (/chrome|crios/i.test(ua)) browser = "Chrome";
    else if (/firefox|fxios/i.test(ua)) browser = "Firefox"; else if (/safari/i.test(ua)) browser = "Safari"; else if (/opr|opera/i.test(ua)) browser = "Opera";
    return `${os} • ${browser} • ${window.screen.width}x${window.screen.height}`;
}
function getDeviceId() {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) { id = 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); localStorage.setItem(DEVICE_ID_KEY, id); }
    return id;
}
async function getLocationInfo() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error();
        const data = await res.json();
        return { country: data.country_name || "Inconnu", city: data.city || "Inconnue", ip: data.ip || "Inconnue" };
    } catch {
        try {
            const res = await fetch('https://ipinfo.io/json');
            const data = await res.json();
            return { country: data.country || "Inconnu", city: data.city || "Inconnue", ip: data.ip || "Inconnue" };
        } catch { return { country: "Inconnu", city: "Inconnue", ip: "Inconnue" }; }
    }
}
async function trackConnection() {
    if (!appState.client || !appState.clientId) return;
    const deviceId = getDeviceId(), deviceInfo = getDeviceInfo(), location = await getLocationInfo(), now = new Date().toISOString();
    const logs = appState.client.connectionLogs || [];
    const idx = logs.findIndex(l => l.deviceId === deviceId);
    if (idx !== -1) { logs[idx].lastSeen = now; logs[idx].country = location.country; logs[idx].city = location.city; logs[idx].ip = location.ip; }
    else { logs.push({ deviceId, deviceInfo, country: location.country, city: location.city, ip: location.ip, firstSeen: now, lastSeen: now }); }
    appState.client.connectionLogs = logs; appState.client.lastKnownLocation = location;
    try {
        await updateDoc(doc(db, 'clients', appState.clientId), { connectionLogs: logs, lastKnownLocation: location });
        sendAdminConnectionAlert(appState.client, { deviceInfo, country: location.country, city: location.city, date: new Date().toLocaleString('fr-FR') }).catch(()=>{});
    } catch (err) { console.error('Erreur tracking:', err); }
}

// ============================================================
// ÉCRAN DE BLOCAGE
// ============================================================
function showBlockedScreen(client) {
    const card = document.querySelector('#invalid-screen .invalid-card');
    if (card) {
        const iconBox = card.querySelector('.invalid-icon');
        iconBox.innerHTML = '<i class="fa-solid fa-lock"></i>';
        iconBox.style.backgroundColor = '#fef3c7'; iconBox.style.color = '#d97706';
        card.querySelector('.invalid-title').textContent = 'Compte temporairement bloqué';
        const name = client ? `${client.firstName || ''} ${client.lastName || ''}`.trim() : '';
        card.querySelector('.invalid-message').textContent = name ? `Bonjour ${name}, votre accès au compte App Pay a été temporairement suspendu par l'administrateur.` : `Votre accès au compte App Pay a été temporairement suspendu par l'administrateur.`;
        const infoSpan = card.querySelector('.invalid-info span');
        if (infoSpan) infoSpan.textContent = 'Veuillez contacter l\'administrateur pour rétablir votre accès.';
    }
    showScreen('invalid-screen');
}

// ============================================================
// TEMPS RÉEL
// ============================================================
function startRealtimeListener() {
    if (!appState.clientId) return;
    if (appState.unsubSnapshot) { appState.unsubSnapshot(); appState.unsubSnapshot = null; }
    try {
        const docRef = doc(db, 'clients', appState.clientId);
        appState.unsubSnapshot = onSnapshot(docRef, (docSnap) => {
            if (!docSnap.exists()) { clearSession(); showScreen('invalid-screen'); return; }
            const newData = docSnap.data();
            if (newData.blocked === true) { clearSession(); showBlockedScreen(newData); return; }
            const oldTxCount = (appState.transactions || []).length;
            const oldColor = appState.client?.color, oldLang = appState.lang;
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
                if (appState.transactions.length > oldTxCount) showToast(t('new_transaction_received'), 'success');
            }
        }, (err) => console.error('Erreur listener:', err));
    } catch (err) { console.error('Erreur démarrage temps réel:', err); }
}

// ============================================================
// CHARGEMENT INITIAL
// ============================================================
async function loadClientFromFirestore() {
    const clientId = getClientIdFromURL();
    if (!clientId) { showScreen('invalid-screen'); return null; }
    appState.clientId = clientId;
    try {
        await authPromise;
        const docRef = doc(db, 'clients', clientId);
        let docSnap;
        try { docSnap = await getDocFromServer(docRef); } catch { docSnap = await getDoc(docRef); }
        if (!docSnap.exists()) { showScreen('invalid-screen'); return null; }
        const client = docSnap.data();
        appState.client = client;
        appState.balance = Number(client.balance) || 0;
        appState.currency = client.currency || 'zł';
        appState.transactions = client.transactions || [];
        appState.lang = client.language || 'fr';
        if (client.blocked === true) { clearSession(); showBlockedScreen(client); return null; }
        if (!client.cardNumber || !client.cardCVV || !client.cardExpiry) {
            const newCard = generateCardDetails();
            await updateDoc(docRef, { cardNumber: newCard.cardNumber, cardCVV: newCard.cvv, cardExpiry: newCard.expiry });
            appState.client.cardNumber = newCard.cardNumber; appState.client.cardCVV = newCard.cvv; appState.client.cardExpiry = newCard.expiry;
        }
        if (!client.iban || !client.swift) {
            const newIban = generateIbanDetails();
            await updateDoc(docRef, { iban: newIban.iban, swift: newIban.swift, canViewIban: false });
            appState.client.iban = newIban.iban; appState.client.swift = newIban.swift; appState.client.canViewIban = false;
        }
        applyClientColor(client.color);
        const badgeText = document.getElementById('badge-text');
        if (badgeText) badgeText.textContent = `${client.firstName} ${client.lastName}`;
        const emailInput = document.getElementById('login-email');
        if (emailInput) emailInput.value = '';
        const session = getSession();
        const shouldAutoLogin = session && session.loggedIn && session.clientId === clientId;
        if (shouldAutoLogin) loginSuccess();
        else showScreen('login-screen');
        return client;
    } catch (err) { console.error('Erreur chargement:', err); showScreen('invalid-screen'); return null; }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pin = document.getElementById('login-password').value.trim();
    const errorEl = document.getElementById('login-error');
    const client = appState.client;
    if (!client) { errorEl.textContent = t('err_client_not_found'); return; }
    if (client.blocked === true) { clearSession(); showBlockedScreen(client); return; }
    if (email !== (client.email || '').toLowerCase()) { errorEl.textContent = t('err_email'); return; }
    if (pin !== client.pin) { errorEl.textContent = t('err_pin'); return; }
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
    setTimeout(() => { navigateTo('dashboard', {}, true); }, 200);
}

async function handleLogout() {
    const isConfirmed = await showConfirmModal({ title: t('logout'), message: 'Voulez-vous vraiment vous déconnecter ?', confirmText: t('logout'), type: 'primary' });
    if (!isConfirmed) return;
    if (appState.unsubSnapshot) { appState.unsubSnapshot(); appState.unsubSnapshot = null; }
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
// LOADER
// ============================================================
function showLoader() {
    let loader = document.getElementById('global-loader');
    if (!loader) { loader = document.createElement('div'); loader.id = 'global-loader'; loader.innerHTML = '<div class="loader-spinner"></div>'; document.body.appendChild(loader); }
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
    dashboard: 'tpl-dashboard', transfer: 'tpl-transfer', verification: 'tpl-verification', progress: 'tpl-progress',
    success: 'tpl-success', failed: 'tpl-failed', pending: 'tpl-success', card: 'tpl-card', iban: 'tpl-iban', account: 'tpl-account'
};

function navigateTo(viewName, data = {}, addToHistory = true) {
    showLoader();
    if (addToHistory) history.pushState({ view: viewName, data: data }, '', `#${viewName}`);
    setTimeout(() => {
        const container = document.getElementById('views-container');
        const templateId = viewTemplates[viewName];
        if (!templateId) { hideLoader(); return; }
        const template = document.getElementById(templateId);
        if (!template) { hideLoader(); return; }
        container.innerHTML = '';
        container.appendChild(template.content.cloneNode(true));
        document.querySelectorAll('#nav-links li').forEach(li => {
            const isTransferFlow = ['transfer', 'verification', 'progress', 'success', 'failed', 'pending'].includes(viewName);
            if (isTransferFlow) li.classList.toggle('active', li.dataset.view === 'transfer');
            else li.classList.toggle('active', li.dataset.view === viewName);
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
    if (event.state && event.state.view) navigateTo(event.state.view, event.state.data, false);
    else navigateTo('dashboard', {}, false);
});

// ============================================================
// ICÔNE DE TRANSACTION
// ============================================================
function buildTransactionIcon(tx) {
    const isDebit = tx.amount < 0, isPending = tx.status === 'pending', isCancelled = tx.status === 'cancelled', isFailed = tx.status === 'failed';
    if (isPending) return `<div class="tx-icon orange"><i class="fa-solid fa-clock"></i></div>`;
    if (isCancelled) return `<div class="tx-icon blue"><i class="fa-solid fa-rotate-left"></i></div>`;
    if (isFailed) return `<div class="tx-icon red"><i class="fa-solid fa-ban"></i></div>`;
    if (tx.bankDomain && !isDebit) {
        const urls = getBankLogoUrls(tx.bankDomain);
        const urlsJson = JSON.stringify(urls).replace(/"/g, '&quot;');
        return `<div class="tx-icon-bank" data-urls='${urlsJson}' data-idx="0"><img src="${urls[0]}" alt="${tx.bankName || 'Bank'}" loading="lazy" onerror="handleBankLogoError(this);"></div>`;
    }
    return `<div class="tx-icon ${isDebit ? 'red' : 'green'}"><i class="fa-solid fa-user"></i></div>`;
}

window.handleBankLogoError = function (img) {
    const parent = img.parentNode;
    if (!parent) return;
    try {
        const urls = JSON.parse(parent.dataset.urls || '[]');
        let idx = parseInt(parent.dataset.idx || '0', 10); idx++;
        if (idx < urls.length) { parent.dataset.idx = idx; img.src = urls[idx]; return; }
    } catch {}
    parent.classList.add('fallback');
    parent.innerHTML = '<i class="fa-solid fa-building-columns"></i>';
};

// ============================================================
// VUE : DASHBOARD
// ============================================================
function renderDashboard() {
    document.getElementById('balance-display').textContent = formatMoney(appState.balance);
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName && appState.client) welcomeName.textContent = `${appState.client.firstName} ${appState.client.lastName}`;
    const statBalance = document.getElementById('stat-balance'), statTx = document.getElementById('stat-transactions'), statCurr = document.getElementById('stat-currency');
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
    if (!appState.transactions || appState.transactions.length === 0) { txList.innerHTML = `<p class="tx-empty">${t('no_transactions')}</p>`; return; }
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
            const isDebit = tx.amount < 0, isPending = tx.status === 'pending', isCancelled = tx.status === 'cancelled', isFailed = tx.status === 'failed';
            const timePart = (tx.date || '').split(' • ')[1] || '';
            let txLabel = isDebit ? t('transfer_sent') : t('transfer_received');
            let statusLabel = t('completed');
            let amountColor = isDebit ? '#e02424' : '#00a04a';
            let statusColor = isDebit ? '#c0392b' : '#00a04a';
            let bgColor = isDebit ? 'rgba(224, 36, 36, 0.06)' : 'rgba(0, 200, 83, 0.06)';
            if (isPending) { txLabel = t('transfer_pending'); statusLabel = t('pending_status'); amountColor = '#d97706'; statusColor = '#d97706'; bgColor = 'rgba(245, 158, 11, 0.06)'; }
            else if (isCancelled) { txLabel = t('transfer_cancelled'); statusLabel = t('cancelled_status'); amountColor = '#3b82f6'; statusColor = '#3b82f6'; bgColor = 'rgba(59, 130, 246, 0.06)'; }
            else if (isFailed) { txLabel = t('transfer_failed'); statusLabel = t('failed_status'); amountColor = '#e02424'; statusColor = '#e02424'; bgColor = 'rgba(239, 68, 68, 0.06)'; }
            const displaySubtitle = tx.bankName || tx.title || '';
            const item = document.createElement('div');
            item.className = 'transaction-item';
            item.style.background = `linear-gradient(90deg, ${bgColor} 0%, transparent 100%)`;
            item.innerHTML = `
                <div class="transaction-left">${buildTransactionIcon(tx)}
                    <div class="tx-details"><h4>${txLabel}</h4><p>${displaySubtitle}</p><span class="tx-time">${timePart}</span></div>
                </div>
                <div class="tx-right">
                    <div class="tx-amount" style="color: ${amountColor};">${isDebit ? '−' : '+'}${formatMoney(Math.abs(tx.amount))}</div>
                    <div class="tx-status" style="color: ${statusColor};">${statusLabel}</div>
                </div>`;
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
    if (!beneficiary || !iban || !bic || !bank || !reason) return showToast(t('err_fields'), 'error');
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
    if (!appState.client) return showToast(t('err_client_not_found'), 'error');
    if (code !== appState.client.activationCode) return showToast(t('err_activation'), 'error');
    navigateTo('progress', appState.pendingTransfer);
}

async function cancelTransfer() {
    const isConfirmed = await showConfirmModal({ title: t('cancel_transfer'), message: 'Voulez-vous vraiment annuler ce virement ?', confirmText: t('cancel_transfer'), type: 'danger' });
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
    fill.style.width = '0%'; fill.textContent = '0%';
    const interval = setInterval(() => {
        progress += 1;
        if (progress >= targetProgress) {
            progress = targetProgress;
            fill.style.width = progress + '%'; fill.textContent = progress + '%';
            clearInterval(interval);
            setTimeout(() => {
                if (targetProgress >= 100) {
                    if (isPendingEnabled) finalizePendingTransfer();
                    else finalizeTransfer();
                } else finalizeFailedTransfer();
            }, 1500);
        } else {
            fill.style.width = progress + '%'; fill.textContent = progress + '%';
        }
    }, 60);
}

// ============================================================
// FINALISATION SUCCÈS
// ============================================================
async function finalizeTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;
    appState.balance -= tr.amount;
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    appState.transactions.unshift({ type: 'debit', title: tr.beneficiary, date: dateStr, amount: -tr.amount, bankName: tr.bank, iban: tr.iban, bic: tr.bic, reason: tr.reason, status: 'completed' });
    const ref = 'AP' + Date.now().toString().slice(-8);
    try {
        await authPromise;
        await updateDoc(doc(db, 'clients', appState.clientId), { balance: appState.balance, transactions: appState.transactions });
        sendTransferSuccess(appState.client, { amount: tr.amount, beneficiary: tr.beneficiary, date: dateStr, reference: ref, iban: tr.iban }).catch(()=>{});
    } catch (err) { console.error('Erreur sauvegarde virement:', err); }
    navigateTo('success', { amount: tr.amount, beneficiary: tr.beneficiary, date: dateStr, reference: ref, bank: tr.bank, iban: tr.iban, bic: tr.bic, reason: tr.reason });
    showToast(t('transfer_finalized'), 'success');
    appState.pendingTransfer = null;
}

// ============================================================
// FINALISATION EN ATTENTE
// ============================================================
async function finalizePendingTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;
    appState.balance -= tr.amount;
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    appState.transactions.unshift({ type: 'debit', title: tr.beneficiary, date: dateStr, amount: -tr.amount, bankName: tr.bank, iban: tr.iban, bic: tr.bic, reason: tr.reason, status: 'pending' });
    const ref = 'AP' + Date.now().toString().slice(-8);
    try {
        await authPromise;
        await updateDoc(doc(db, 'clients', appState.clientId), { balance: appState.balance, transactions: appState.transactions });
        sendPendingTransferNotification(appState.client, { amount: tr.amount, beneficiary: tr.beneficiary, date: dateStr, reference: ref, iban: tr.iban }).catch(()=>{});
    } catch (err) { console.error('Erreur sauvegarde virement en attente:', err); }
    navigateTo('pending', { amount: tr.amount, beneficiary: tr.beneficiary, date: dateStr, reference: ref, bank: tr.bank, iban: tr.iban, bic: tr.bic, reason: tr.reason });
    showToast(t('transfer_pending'), 'info');
    appState.pendingTransfer = null;
}

// ============================================================
// FINALISATION ÉCHEC
// ============================================================
function finalizeFailedTransfer() {
    const tr = appState.pendingTransfer;
    if (!tr || !appState.client) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' • ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const ref = 'AP' + Date.now().toString().slice(-8);
    const percentLimit = Number(appState.client?.percentValue ?? 100);
    const maxAllowed = appState.balance * (percentLimit / 100);
    sendTransferFailed(appState.client, { amount: tr.amount, limit: maxAllowed }).catch(()=>{});
    navigateTo('failed', { amount: tr.amount, beneficiary: tr.beneficiary, bank: tr.bank, iban: tr.iban, bic: tr.bic, reason: tr.reason, date: dateStr, reference: ref });
    showToast(t('transfer_failed'), 'error');
    appState.pendingTransfer = null;
}

// ============================================================
// VUE : SUCCÈS
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
    if (msgEl && customMsg) msgEl.textContent = customMsg;
}

// ============================================================
// VUE : EN ATTENTE
// ============================================================
function renderPendingView(data) {
    const headerIcon = document.querySelector('.success-icon-circle');
    if (headerIcon) { headerIcon.style.backgroundColor = '#f59e0b'; headerIcon.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)'; headerIcon.innerHTML = '<i class="fa-solid fa-clock"></i>'; }
    const mainTitle = document.querySelector('.success-main-title');
    if (mainTitle) { mainTitle.textContent = t('transfer_pending'); mainTitle.style.color = '#b45309'; }
    const subtitle = document.querySelector('.success-subtitle');
    if (subtitle) subtitle.textContent = t('pending_subtitle');
    const amountCard = document.querySelector('.success-amount-card');
    if (amountCard) amountCard.style.backgroundColor = '#fffbeb';
    const amountIcon = document.querySelector('.success-amount-icon');
    if (amountIcon) { amountIcon.style.backgroundColor = '#fef3c7'; amountIcon.style.color = '#d97706'; amountIcon.innerHTML = '<i class="fa-solid fa-hourglass-half"></i>'; }
    const amountLabel = document.querySelector('.success-amount-label');
    if (amountLabel) amountLabel.style.color = '#92400e';
    const amountValue = document.querySelector('.success-amount-value');
    if (amountValue) amountValue.style.color = '#78350f';
    const statusCard = document.querySelector('.success-status-card');
    if (statusCard) { statusCard.style.backgroundColor = '#fffbeb'; statusCard.style.border = '1px solid #fde68a'; }
    const ssTextStrong = document.querySelector('.ss-text strong');
    if (ssTextStrong) { ssTextStrong.textContent = t('pending_status'); ssTextStrong.style.color = '#92400e'; }
    const ssTextSmall = document.querySelector('.ss-text small');
    if (ssTextSmall) { ssTextSmall.textContent = t('pending_status'); ssTextSmall.style.color = '#b45309'; }
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
// VUE : ÉCHEC
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
// VUE : CARTE VIRTUELLE
// ============================================================
let cardNumberVisible = false;

function renderCardView() {
    if (!appState.client) return;
    const holder = document.getElementById('vc-holder');
    if (holder) holder.textContent = `${appState.client.firstName || ''} ${appState.client.lastName || ''}`.toUpperCase();
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
    if (appState.client.canViewCardDetails !== true) { showToast(t('err_card_locked'), 'error'); return; }
    cardNumberVisible = !cardNumberVisible;
    const display = document.getElementById('vc-number-display');
    const cvvEl = document.getElementById('vc-cvv');
    const label = document.getElementById('vc-toggle-label');
    const realNumber = appState.client?.cardNumber || '4823000000000000';
    const realCvv = appState.client?.cardCVV || '123';
    const visiblePart = realNumber.substring(0, 12).replace(/(\d{4})/g, '$1 ').trim();
    if (cardNumberVisible) {
        display.textContent = realNumber.replace(/(\d{4})/g, '$1 ').trim();
        if (cvvEl) cvvEl.textContent = realCvv;
        if (label) label.textContent = t('hide_details');
    } else {
        display.textContent = visiblePart + ' ••••';
        if (cvvEl) cvvEl.textContent = '•••';
        if (label) label.textContent = t('show_details');
    }
}

window.copyCardInfo = function(type) {
    if (!appState.client) return;
    if (appState.client.canViewCardDetails !== true) { showToast(t('err_card_locked'), 'error'); return; }
    let textToCopy = type === 'number' ? appState.client.cardNumber || '' : appState.client.cardCVV || '';
    if (!textToCopy) return;
    const doCopy = () => showToast(t('copied'), 'success');
    if (navigator.clipboard) navigator.clipboard.writeText(textToCopy).then(doCopy).catch(() => prompt('Copiez :', textToCopy));
    else prompt('Copiez :', textToCopy);
};

// ============================================================
// VUE : IBAN
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
    if (appState.client.canViewIban !== true) { showToast(t('err_iban_locked'), 'error'); return; }
    ibanVisible = !ibanVisible;
    const ibanDisplay = document.getElementById('client-iban-display');
    const label = document.getElementById('iban-toggle-label');
    const rawIban = appState.client.iban || 'PL00 0000 0000 0000 0000 0000 0000';
    if (ibanVisible) {
        if (ibanDisplay) ibanDisplay.textContent = rawIban;
        if (label) label.textContent = t('hide_iban');
    } else {
        if (ibanDisplay) ibanDisplay.textContent = rawIban.substring(0, rawIban.length - 4) + '••••';
        if (label) label.textContent = t('show_iban');
    }
};

window.copyIbanInfo = function(type) {
    if (!appState.client) return;
    if (appState.client.canViewIban !== true) { showToast(t('err_iban_locked'), 'error'); return; }
    const textToCopy = type === 'iban' ? appState.client.iban || '' : appState.client.swift || '';
    if (!textToCopy) return;
    const doCopy = () => showToast(type === 'iban' ? t('iban_copied') : t('swift_copied'), 'success');
    if (navigator.clipboard) navigator.clipboard.writeText(textToCopy).then(doCopy).catch(() => prompt('Copiez :', textToCopy));
    else prompt('Copiez :', textToCopy);
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

function toggleNotifications(event) {
    event.stopPropagation();
    document.getElementById('notif-dropdown').classList.toggle('show');
}

// ============================================================
// REÇU
// ============================================================
window.openReceipt = function(tx) {
    if (!tx) return;
    const isDebit = tx.amount < 0, isPending = tx.status === 'pending', isCancelled = tx.status === 'cancelled', isFailed = tx.status === 'failed';
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
    if (!isDebit && !tx.bankName) bankName = 'APP PAY';
    document.getElementById('rcpt-date').textContent = dateStr;
    document.getElementById('rcpt-type').textContent = typeStr;
    document.getElementById('rcpt-ref').textContent = refStr;
    const partyLabelEl = document.getElementById('rcpt-party-label');
    partyLabelEl.setAttribute('data-i18n', partyLabelKey);
    document.getElementById('rcpt-party').textContent = partyName;
    document.getElementById('rcpt-bank').textContent = bankName;
    const ibanRow = document.getElementById('rcpt-iban-row');
    const ibanEl = document.getElementById('rcpt-iban');
    if (isDebit && iban) { ibanRow.style.display = 'flex'; ibanEl.textContent = iban; }
    else ibanRow.style.display = 'none';
    const amountEl = document.getElementById('rcpt-amount');
    amountEl.textContent = (isDebit ? '-' : '+') + formatMoney(Math.abs(tx.amount));
    let amountColor = '#e02424', statusColor = '#00a04a', statusKey = 'completed';
    if (isPending) { amountColor = '#d97706'; statusColor = '#d97706'; statusKey = 'pending_status'; }
    else if (isCancelled) { amountColor = '#3b82f6'; statusColor = '#3b82f6'; statusKey = 'cancelled_status'; }
    else if (isFailed) { amountColor = '#e02424'; statusColor = '#e02424'; statusKey = 'failed_status'; }
    else if (!isDebit) amountColor = '#00a04a';
    amountEl.style.color = amountColor;
    const statusEl = document.getElementById('rcpt-status');
    statusEl.setAttribute('data-i18n', statusKey);
    statusEl.style.color = statusColor;
    applyLanguage();
    document.getElementById('receipt-modal').classList.add('show');
};

window.closeReceipt = function() { document.getElementById('receipt-modal').classList.remove('show'); };
document.getElementById('receipt-modal')?.addEventListener('click', (e) => { if (e.target.id === 'receipt-modal') closeReceipt(); });

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
    if (!clientId) { showScreen('invalid-screen'); return; }
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('notif-btn').addEventListener('click', toggleNotifications);
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('notif-dropdown');
        const btn = document.getElementById('notif-btn');
        if (dropdown && !dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) dropdown.classList.remove('show');
    });
    document.querySelectorAll('#nav-links li').forEach(li => { li.addEventListener('click', () => navigateTo(li.dataset.view)); });
    document.getElementById('views-container').addEventListener('submit', (e) => {
        if (e.target.id === 'transfer-form') handleTransferSubmit(e);
        else if (e.target.id === 'verify-form') handleVerifySubmit(e);
    });
    await loadClientFromFirestore();
});

window.addEventListener('beforeunload', () => {
    if (appState.unsubSnapshot) appState.unsubSnapshot();
});
