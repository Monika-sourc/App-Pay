// ============================================================
// APP PAY ADMIN - Gestion des clients (Firebase + Auth + Banques + Emails)
// ============================================================

import {
    db,
    auth,
    persistenceReady,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from './firebase-config.js';

import { BANKS_BY_COUNTRY, getBankLogoUrl } from './banks.js';

import {
    sendLoginCredentials,
    sendActivationCode,
    sendTransferAdminCancelled,
    sendTransferAdminValidated
} from './emails.js';

const COLLECTION_NAME = 'clients';
const ADMINS_COLLECTION = 'admins';

let currentAdmin = null;
let lastGeneratedLink = '';
let selectedColor = '#ff7a00';
let allClients = [];
let selectedClientId = null;
let selectedOption = null;
let currentDetailClient = null;
let isCardDetailsVisible = false;
let isIbanVisible = false;
let currentTransferTab = 'completed';

const COUNTRY_LIST = [
    { name: "Afghanistan", flag: "🇦🇫" }, { name: "Afrique du Sud", flag: "🇿🇦" },
    { name: "Albanie", flag: "🇦🇱" }, { name: "Algérie", flag: "🇩🇿" },
    { name: "Allemagne", flag: "🇩🇪" }, { name: "Andorre", flag: "🇦🇩" },
    { name: "Angola", flag: "🇦🇴" }, { name: "Arabie Saoudite", flag: "🇸🇦" },
    { name: "Argentine", flag: "🇦🇷" }, { name: "Arménie", flag: "🇦🇲" },
    { name: "Australie", flag: "🇦🇺" }, { name: "Autriche", flag: "🇦🇹" },
    { name: "Azerbaïdjan", flag: "🇦🇿" }, { name: "Bahamas", flag: "🇧🇸" },
    { name: "Bahreïn", flag: "🇧🇭" }, { name: "Bangladesh", flag: "🇧🇩" },
    { name: "Barbade", flag: "🇧🇧" }, { name: "Belgique", flag: "🇧🇪" },
    { name: "Belize", flag: "🇧🇿" }, { name: "Bénin", flag: "🇧🇯" },
    { name: "Bhoutan", flag: "🇧🇹" }, { name: "Biélorussie", flag: "🇧🇾" },
    { name: "Birmanie", flag: "🇲🇲" }, { name: "Bolivie", flag: "🇧🇴" },
    { name: "Bosnie-Herzégovine", flag: "🇧🇦" }, { name: "Botswana", flag: "🇧🇼" },
    { name: "Brésil", flag: "🇧🇷" }, { name: "Brunei", flag: "🇧🇳" },
    { name: "Bulgarie", flag: "🇧🇬" }, { name: "Burkina Faso", flag: "🇧🇫" },
    { name: "Burundi", flag: "🇧🇮" }, { name: "Cambodge", flag: "🇰🇭" },
    { name: "Cameroun", flag: "🇨🇲" }, { name: "Canada", flag: "🇨🇦" },
    { name: "Cap-Vert", flag: "🇨🇻" }, { name: "Chili", flag: "🇨🇱" },
    { name: "Chine", flag: "🇨🇳" }, { name: "Chypre", flag: "🇨🇾" },
    { name: "Colombie", flag: "🇨🇴" }, { name: "Comores", flag: "🇰🇲" },
    { name: "Congo", flag: "🇨🇬" }, { name: "Corée du Sud", flag: "🇰🇷" },
    { name: "Costa Rica", flag: "🇨🇷" }, { name: "Côte d'Ivoire", flag: "🇨🇮" },
    { name: "Croatie", flag: "🇭🇷" }, { name: "Cuba", flag: "🇨🇺" },
    { name: "Danemark", flag: "🇩🇰" }, { name: "Djibouti", flag: "🇩🇯" },
    { name: "Égypte", flag: "🇪🇬" }, { name: "Émirats Arabes Unis", flag: "🇦🇪" },
    { name: "Équateur", flag: "🇪🇨" }, { name: "Espagne", flag: "🇪🇸" },
    { name: "Estonie", flag: "🇪🇪" }, { name: "États-Unis", flag: "🇺🇸" },
    { name: "Éthiopie", flag: "🇪🇹" }, { name: "Finlande", flag: "🇫🇮" },
    { name: "France", flag: "🇫🇷" }, { name: "Gabon", flag: "🇬🇦" },
    { name: "Gambie", flag: "🇬🇲" }, { name: "Géorgie", flag: "🇬🇪" },
    { name: "Ghana", flag: "🇬🇭" }, { name: "Grèce", flag: "🇬🇷" },
    { name: "Guatemala", flag: "🇬🇹" }, { name: "Guinée", flag: "🇬🇳" },
    { name: "Guinée-Bissau", flag: "🇬🇼" }, { name: "Guyana", flag: "🇬🇾" },
    { name: "Haïti", flag: "🇭🇹" }, { name: "Honduras", flag: "🇭🇳" },
    { name: "Hongrie", flag: "🇭🇺" }, { name: "Inde", flag: "🇮🇳" },
    { name: "Indonésie", flag: "🇮🇩" }, { name: "Irak", flag: "🇮🇶" },
    { name: "Iran", flag: "🇮🇷" }, { name: "Irlande", flag: "🇮🇪" },
    { name: "Islande", flag: "🇮🇸" }, { name: "Israël", flag: "🇮🇱" },
    { name: "Italie", flag: "🇮🇹" }, { name: "Jamaïque", flag: "🇯🇲" },
    { name: "Japon", flag: "🇯🇵" }, { name: "Jordanie", flag: "🇯🇴" },
    { name: "Kazakhstan", flag: "🇰🇿" }, { name: "Kenya", flag: "🇰🇪" },
    { name: "Koweït", flag: "🇰🇼" }, { name: "Laos", flag: "🇱🇦" },
    { name: "Lesotho", flag: "🇱🇸" }, { name: "Lettonie", flag: "🇱🇻" },
    { name: "Liban", flag: "🇱🇧" }, { name: "Libéria", flag: "🇱🇷" },
    { name: "Libye", flag: "🇱🇾" }, { name: "Liechtenstein", flag: "🇱🇮" },
    { name: "Lituanie", flag: "🇱🇹" }, { name: "Luxembourg", flag: "🇱🇺" },
    { name: "Macédoine du Nord", flag: "🇲🇰" }, { name: "Madagascar", flag: "🇲🇬" },
    { name: "Malaisie", flag: "🇲🇾" }, { name: "Malawi", flag: "🇲🇼" },
    { name: "Mali", flag: "🇲🇱" }, { name: "Malte", flag: "🇲🇹" },
    { name: "Maroc", flag: "🇲🇦" }, { name: "Maurice", flag: "🇲🇺" },
    { name: "Mauritanie", flag: "🇲🇷" }, { name: "Mexique", flag: "🇲🇽" },
    { name: "Moldavie", flag: "🇲🇩" }, { name: "Monaco", flag: "🇲🇨" },
    { name: "Mongolie", flag: "🇲🇳" }, { name: "Monténégro", flag: "🇲🇪" },
    { name: "Mozambique", flag: "🇲🇿" }, { name: "Namibie", flag: "🇳🇦" },
    { name: "Népal", flag: "🇳🇵" }, { name: "Nicaragua", flag: "🇳🇮" },
    { name: "Niger", flag: "🇳🇪" }, { name: "Nigéria", flag: "🇳🇬" },
    { name: "Norvège", flag: "🇳🇴" }, { name: "Nouvelle-Zélande", flag: "🇳🇿" },
    { name: "Oman", flag: "🇴🇲" }, { name: "Ouganda", flag: "🇺🇬" },
    { name: "Ouzbékistan", flag: "🇺🇿" }, { name: "Pakistan", flag: "🇵🇰" },
    { name: "Palestine", flag: "🇵🇸" }, { name: "Panama", flag: "🇵🇦" },
    { name: "Paraguay", flag: "🇵🇾" }, { name: "Pays-Bas", flag: "🇳🇱" },
    { name: "Pérou", flag: "🇵🇪" }, { name: "Philippines", flag: "🇵🇭" },
    { name: "Pologne", flag: "🇵🇱" }, { name: "Portugal", flag: "🇵🇹" },
    { name: "Qatar", flag: "🇶🇦" }, { name: "République Démocratique du Congo", flag: "🇨🇩" },
    { name: "République Dominicaine", flag: "🇩🇴" }, { name: "République Tchèque", flag: "🇨🇿" },
    { name: "Roumanie", flag: "🇷🇴" }, { name: "Royaume-Uni", flag: "🇬🇧" },
    { name: "Russie", flag: "🇷🇺" }, { name: "Rwanda", flag: "🇷🇼" },
    { name: "Sénégal", flag: "🇸🇳" }, { name: "Serbie", flag: "🇷🇸" },
    { name: "Seychelles", flag: "🇸🇨" }, { name: "Sierra Leone", flag: "🇸🇱" },
    { name: "Singapour", flag: "🇸🇬" }, { name: "Slovaquie", flag: "🇸🇰" },
    { name: "Slovénie", flag: "🇸🇮" }, { name: "Somalie", flag: "🇸🇴" },
    { name: "Soudan", flag: "🇸🇩" }, { name: "Sri Lanka", flag: "🇱🇰" },
    { name: "Suède", flag: "🇸🇪" }, { name: "Suisse", flag: "🇨🇭" },
    { name: "Suriname", flag: "🇸🇷" }, { name: "Syrie", flag: "🇸🇾" },
    { name: "Tanzanie", flag: "🇹🇿" }, { name: "Tchad", flag: "🇹🇩" },
    { name: "Thaïlande", flag: "🇹🇭" }, { name: "Togo", flag: "🇹🇬" },
    { name: "Tunisie", flag: "🇹🇳" }, { name: "Turquie", flag: "🇹🇷" },
    { name: "Ukraine", flag: "🇺🇦" }, { name: "Uruguay", flag: "🇺🇾" },
    { name: "Venezuela", flag: "🇻🇪" }, { name: "Vietnam", flag: "🇻🇳" },
    { name: "Yémen", flag: "🇾🇪" }, { name: "Zambie", flag: "🇿🇲" },
    { name: "Zimbabwe", flag: "🇿🇼" }
];

const CURRENCY_LIST = [
    { value: "zł", label: "zł - Zloty polonais", group: "🌍 Devises principales" },
    { value: "€", label: "€ - Euro", group: "🌍 Devises principales" },
    { value: "$", label: "$ - Dollar américain", group: "🌍 Devises principales" },
    { value: "£", label: "£ - Livre sterling", group: "🌍 Devises principales" },
    { value: "CHF", label: "CHF - Franc suisse", group: "🌍 Devises principales" },
    { value: "¥", label: "¥ - Yen japonais", group: "🌍 Devises principales" },
    { value: "¥ CNY", label: "¥ - Yuan chinois (CNY)", group: "🌍 Devises principales" },
    { value: "CAD", label: "CAD - Dollar canadien", group: "🌍 Devises principales" },
    { value: "AUD", label: "AUD - Dollar australien", group: "🌍 Devises principales" },
    { value: "NZD", label: "NZD - Dollar néo-zélandais", group: "🌍 Devises principales" },
    { value: "RUB", label: "₽ - Rouble russe (RUB)", group: "🇪🇺 Europe" },
    { value: "UAH", label: "₴ - Hryvnia ukrainienne (UAH)", group: "🇪🇺 Europe" },
    { value: "BYN", label: "Br - Rouble biélorusse (BYN)", group: "🇪🇺 Europe" },
    { value: "TRY", label: "₺ - Livre turque (TRY)", group: "🇪🇺 Europe" },
    { value: "SEK", label: "kr - Couronne suédoise (SEK)", group: "🇪🇺 Europe" },
    { value: "NOK", label: "kr - Couronne norvégienne (NOK)", group: "🇪🇺 Europe" },
    { value: "DKK", label: "kr - Couronne danoise (DKK)", group: "🇪🇺 Europe" },
    { value: "ISK", label: "kr - Couronne islandaise (ISK)", group: "🇪🇺 Europe" },
    { value: "CZK", label: "Kč - Couronne tchèque (CZK)", group: "🇪🇺 Europe" },
    { value: "HUF", label: "Ft - Forint hongrois (HUF)", group: "🇪🇺 Europe" },
    { value: "RON", label: "lei - Leu roumain (RON)", group: "🇪🇺 Europe" },
    { value: "BGN", label: "лв - Lev bulgare (BGN)", group: "🇪🇺 Europe" },
    { value: "RSD", label: "дин - Dinar serbe (RSD)", group: "🇪🇺 Europe" },
    { value: "BAM", label: "KM - Mark convertible (BAM)", group: "🇪🇺 Europe" },
    { value: "MKD", label: "ден - Denar macédonien (MKD)", group: "🇪🇺 Europe" },
    { value: "ALL", label: "L - Lek albanais (ALL)", group: "🇪🇺 Europe" },
    { value: "MDL", label: "L - Leu moldave (MDL)", group: "🇪🇺 Europe" },
    { value: "GEL", label: "₾ - Lari géorgien (GEL)", group: "🇪🇺 Europe" },
    { value: "AMD", label: "֏ - Dram arménien (AMD)", group: "🇪🇺 Europe" },
    { value: "AZN", label: "₼ - Manat azerbaïdjanais (AZN)", group: "🇪🇺 Europe" },
    { value: "MXN", label: "$ - Peso mexicain (MXN)", group: "🌎 Amérique" },
    { value: "BRL", label: "R$ - Réal brésilien (BRL)", group: "🌎 Amérique" },
    { value: "ARS", label: "$ - Peso argentin (ARS)", group: "🌎 Amérique" },
    { value: "CLP", label: "$ - Peso chilien (CLP)", group: "🌎 Amérique" },
    { value: "COP", label: "$ - Peso colombien (COP)", group: "🌎 Amérique" },
    { value: "PEN", label: "S/ - Sol péruvien (PEN)", group: "🌎 Amérique" },
    { value: "BOB", label: "Bs. - Boliviano (BOB)", group: "🌎 Amérique" },
    { value: "PYG", label: "₲ - Guaraní paraguayen (PYG)", group: "🌎 Amérique" },
    { value: "UYU", label: "$U - Peso uruguayen (UYU)", group: "🌎 Amérique" },
    { value: "VES", label: "Bs. - Bolívar vénézuélien (VES)", group: "🌎 Amérique" },
    { value: "CRC", label: "₡ - Colón costaricien (CRC)", group: "🌎 Amérique" },
    { value: "GTQ", label: "Q - Quetzal guatémaltèque (GTQ)", group: "🌎 Amérique" },
    { value: "HNL", label: "L - Lempira hondurien (HNL)", group: "🌎 Amérique" },
    { value: "NIO", label: "C$ - Córdoba nicaraguayen (NIO)", group: "🌎 Amérique" },
    { value: "PAB", label: "B/. - Balboa panaméen (PAB)", group: "🌎 Amérique" },
    { value: "DOP", label: "RD$ - Peso dominicain (DOP)", group: "🌎 Amérique" },
    { value: "CUP", label: "$ - Peso cubain (CUP)", group: "🌎 Amérique" },
    { value: "HTG", label: "G - Gourde haïtienne (HTG)", group: "🌎 Amérique" },
    { value: "JMD", label: "J$ - Dollar jamaïcain (JMD)", group: "🌎 Amérique" },
    { value: "TTD", label: "TT$ - Dollar trinidadien (TTD)", group: "🌎 Amérique" },
    { value: "BBD", label: "Bds$ - Dollar barbadien (BBD)", group: "🌎 Amérique" },
    { value: "BSD", label: "B$ - Dollar bahaméen (BSD)", group: "🌎 Amérique" },
    { value: "BZD", label: "BZ$ - Dollar bélizien (BZD)", group: "🌎 Amérique" },
    { value: "XCD", label: "EC$ - Dollar des Caraïbes orientales (XCD)", group: "🌎 Amérique" },
    { value: "SRD", label: "$ - Dollar surinamais (SRD)", group: "🌎 Amérique" },
    { value: "GYD", label: "G$ - Dollar guyanien (GYD)", group: "🌎 Amérique" },
    { value: "INR", label: "₹ - Roupie indienne (INR)", group: "🌏 Asie" },
    { value: "PKR", label: "₨ - Roupie pakistanaise (PKR)", group: "🌏 Asie" },
    { value: "BDT", label: "৳ - Taka bangladais (BDT)", group: "🌏 Asie" },
    { value: "LKR", label: "රු - Roupie srilankaise (LKR)", group: "🌏 Asie" },
    { value: "NPR", label: "रू - Roupie népalaise (NPR)", group: "🌏 Asie" },
    { value: "BTN", label: "Nu. - Ngultrum bhoutanais (BTN)", group: "🌏 Asie" },
    { value: "MMK", label: "K - Kyat birman (MMK)", group: "🌏 Asie" },
    { value: "THB", label: "฿ - Baht thaïlandais (THB)", group: "🌏 Asie" },
    { value: "VND", label: "₫ - Dong vietnamien (VND)", group: "🌏 Asie" },
    { value: "PHP", label: "₱ - Peso philippin (PHP)", group: "🌏 Asie" },
    { value: "IDR", label: "Rp - Roupie indonésienne (IDR)", group: "🌏 Asie" },
    { value: "MYR", label: "RM - Ringgit malaisien (MYR)", group: "🌏 Asie" },
    { value: "SGD", label: "S$ - Dollar singapourien (SGD)", group: "🌏 Asie" },
    { value: "HKD", label: "HK$ - Dollar de Hong Kong (HKD)", group: "🌏 Asie" },
    { value: "TWD", label: "NT$ - Nouveau dollar taïwanais (TWD)", group: "🌏 Asie" },
    { value: "MOP", label: "MOP$ - Pataca macanaise (MOP)", group: "🌏 Asie" },
    { value: "KRW", label: "₩ - Won sud-coréen (KRW)", group: "🌏 Asie" },
    { value: "KHR", label: "៛ - Riel cambodgien (KHR)", group: "🌏 Asie" },
    { value: "LAK", label: "₭ - Kip laotien (LAK)", group: "🌏 Asie" },
    { value: "BND", label: "B$ - Dollar brunéien (BND)", group: "🌏 Asie" },
    { value: "MVR", label: "Rf - Rufiyaa maldivienne (MVR)", group: "🌏 Asie" },
    { value: "MNT", label: "₮ - Tugrik mongol (MNT)", group: "🌏 Asie" },
    { value: "KZT", label: "₸ - Tenge kazakh (KZT)", group: "🌏 Asie" },
    { value: "UZS", label: "soʻm - Sum ouzbek (UZS)", group: "🌏 Asie" },
    { value: "SAR", label: "﷼ - Riyal saoudien (SAR)", group: "🕌 Moyen-Orient" },
    { value: "AED", label: "د.إ - Dirham des Émirats (AED)", group: "🕌 Moyen-Orient" },
    { value: "QAR", label: "ر.ق - Riyal qatari (QAR)", group: "🕌 Moyen-Orient" },
    { value: "KWD", label: "د.ك - Dinar koweïtien (KWD)", group: "🕌 Moyen-Orient" },
    { value: "BHD", label: "د.ب - Dinar bahreïni (BHD)", group: "🕌 Moyen-Orient" },
    { value: "OMR", label: "ر.ع. - Rial omanais (OMR)", group: "🕌 Moyen-Orient" },
    { value: "JOD", label: "د.أ - Dinar jordanien (JOD)", group: "🕌 Moyen-Orient" },
    { value: "LBP", label: "ل.ل - Livre libanaise (LBP)", group: "🕌 Moyen-Orient" },
    { value: "ILS", label: "₪ - Shekel israélien (ILS)", group: "🕌 Moyen-Orient" },
    { value: "IQD", label: "ع.د - Dinar irakien (IQD)", group: "🕌 Moyen-Orient" },
    { value: "SYP", label: "£S - Livre syrienne (SYP)", group: "🕌 Moyen-Orient" },
    { value: "YER", label: "﷼ - Rial yéménite (YER)", group: "🕌 Moyen-Orient" },
    { value: "IRR", label: "﷼ - Rial iranien (IRR)", group: "🕌 Moyen-Orient" },
    { value: "AFN", label: "؋ - Afghani afghan (AFN)", group: "🕌 Moyen-Orient" },
    { value: "NGN", label: "₦ - Naira nigérian (NGN)", group: "🌍 Afrique" },
    { value: "GHS", label: "₵ - Cedi ghanéen (GHS)", group: "🌍 Afrique" },
    { value: "KES", label: "KSh - Shilling kényan (KES)", group: "🌍 Afrique" },
    { value: "ZAR", label: "R - Rand sud-africain (ZAR)", group: "🌍 Afrique" },
    { value: "MAD", label: "د.م. - Dirham marocain (MAD)", group: "🌍 Afrique" },
    { value: "DZD", label: "د.ج - Dinar algérien (DZD)", group: "🌍 Afrique" },
    { value: "TND", label: "د.ت - Dinar tunisien (TND)", group: "🌍 Afrique" },
    { value: "EGP", label: "E£ - Livre égyptienne (EGP)", group: "🌍 Afrique" },
    { value: "FCFA", label: "FCFA - Franc CFA (XOF/XAF)", group: "🌍 Afrique" },
    { value: "ETB", label: "Br - Birr éthiopien (ETB)", group: "🌍 Afrique" },
    { value: "UGX", label: "USh - Shilling ougandais (UGX)", group: "🌍 Afrique" },
    { value: "TZS", label: "TSh - Shilling tanzanien (TZS)", group: "🌍 Afrique" },
    { value: "RWF", label: "FRw - Franc rwandais (RWF)", group: "🌍 Afrique" },
    { value: "BIF", label: "FBu - Franc burundais (BIF)", group: "🌍 Afrique" },
    { value: "CDF", label: "FC - Franc congolais (CDF)", group: "🌍 Afrique" },
    { value: "AOA", label: "Kz - Kwanza angolais (AOA)", group: "🌍 Afrique" },
    { value: "MZN", label: "MT - Metical mozambicain (MZN)", group: "🌍 Afrique" },
    { value: "ZMW", label: "ZK - Kwacha zambien (ZMW)", group: "🌍 Afrique" },
    { value: "ZWL", label: "Z$ - Dollar zimbabwéen (ZWL)", group: "🌍 Afrique" },
    { value: "BWP", label: "P - Pula botswanais (BWP)", group: "🌍 Afrique" },
    { value: "NAD", label: "N$ - Dollar namibien (NAD)", group: "🌍 Afrique" },
    { value: "SZL", label: "E - Lilangeni swazi (SZL)", group: "🌍 Afrique" },
    { value: "LSL", label: "L - Loti lesothan (LSL)", group: "🌍 Afrique" },
    { value: "MWK", label: "MK - Kwacha malawite (MWK)", group: "🌍 Afrique" },
    { value: "MGA", label: "Ar - Ariary malgache (MGA)", group: "🌍 Afrique" },
    { value: "MUR", label: "₨ - Roupie mauricienne (MUR)", group: "🌍 Afrique" },
    { value: "SCR", label: "₨ - Roupie seychelloise (SCR)", group: "🌍 Afrique" },
    { value: "KMF", label: "CF - Franc comorien (KMF)", group: "🌍 Afrique" },
    { value: "DJF", label: "Fdj - Franc djiboutien (DJF)", group: "🌍 Afrique" },
    { value: "SOS", label: "Sh - Shilling somalien (SOS)", group: "🌍 Afrique" },
    { value: "SDG", label: "ج.س. - Livre soudanaise (SDG)", group: "🌍 Afrique" },
    { value: "LYD", label: "ل.د - Dinar libyen (LYD)", group: "🌍 Afrique" },
    { value: "MRU", label: "UM - Ouguiya mauritanien (MRU)", group: "🌍 Afrique" },
    { value: "GMD", label: "D - Dalasi gambien (GMD)", group: "🌍 Afrique" },
    { value: "GNF", label: "FG - Franc guinéen (GNF)", group: "🌍 Afrique" },
    { value: "SLE", label: "Le - Leone sierra-léonais (SLE)", group: "🌍 Afrique" },
    { value: "LRD", label: "L$ - Dollar libérien (LRD)", group: "🌍 Afrique" },
    { value: "CVE", label: "$ - Escudo cap-verdien (CVE)", group: "🌍 Afrique" },
    { value: "STN", label: "Db - Dobra santoméen (STN)", group: "🌍 Afrique" },
    { value: "ERN", label: "Nfk - Nakfa érythréen (ERN)", group: "🌍 Afrique" },
    { value: "SSP", label: "£ - Livre sud-soudanaise (SSP)", group: "🌍 Afrique" },
    { value: "FJD", label: "FJ$ - Dollar fidjien (FJD)", group: "🌊 Océanie" },
    { value: "PGK", label: "K - Kina papou-néo-guinéen (PGK)", group: "🌊 Océanie" },
    { value: "WST", label: "WS$ - Tala samoan (WST)", group: "🌊 Océanie" },
    { value: "TOP", label: "T$ - Pa'anga tongien (TOP)", group: "🌊 Océanie" },
    { value: "VUV", label: "VT - Vatu vanuatais (VUV)", group: "🌊 Océanie" },
    { value: "SBD", label: "SI$ - Dollar des Îles Salomon (SBD)", group: "🌊 Océanie" },
    { value: "XPF", label: "₣ - Franc pacifique (XPF)", group: "🌊 Océanie" }
];

// ✅ 40 LANGUES
const LANGUAGE_LIST = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" },
    { value: "pl", label: "Polski" },
    { value: "nl", label: "Nederlands" },
    { value: "ru", label: "Русский" },
    { value: "ar", label: "العربية" },
    { value: "zh", label: "中文" },
    { value: "ja", label: "日本語" },
    { value: "tr", label: "Türkçe" },
    { value: "ko", label: "한국어" },
    { value: "vi", label: "Tiếng Việt" },
    { value: "hi", label: "हिन्दी" },
    { value: "bn", label: "বাংলা" },
    { value: "ur", label: "اردو" },
    { value: "fa", label: "فارسی" },
    { value: "id", label: "Bahasa Indonesia" },
    { value: "th", label: "ไทย" },
    { value: "ms", label: "Bahasa Melayu" },
    { value: "sw", label: "Kiswahili" },
    { value: "el", label: "Ελληνικά" },
    { value: "he", label: "עברית" },
    { value: "uk", label: "Українська" },
    { value: "ro", label: "Română" },
    { value: "hu", label: "Magyar" },
    { value: "sv", label: "Svenska" },
    { value: "no", label: "Norsk" },
    { value: "da", label: "Dansk" },
    { value: "fi", label: "Suomi" },
    { value: "cs", label: "Čeština" },
    { value: "sk", label: "Slovenčina" },
    { value: "hr", label: "Hrvatski" },
    { value: "bg", label: "Български" },
    { value: "sr", label: "Српски" },
    { value: "af", label: "Afrikaans" },
    { value: "am", label: "አማርኛ" },
    { value: "ha", label: "Hausa" }
];

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    toast.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #111; color: white; padding: 20px 30px; border-radius: 12px; 
        font-size: 16px; font-weight: 700; z-index: 99999;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; align-items: center;
        gap: 15px; animation: toastPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        max-width: 90%; text-align: center; justify-content: center;
    `;
    const iconColor = type === 'error' ? '#e02424' : (type === 'success' ? '#00c853' : '#ff7a00');
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}" style="color:${iconColor}; font-size: 20px;"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showConfirmModal({ title = 'Attention', message = '', confirmText = 'Confirmer', cancelText = 'Annuler', type = 'danger' }) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirm-modal');
        const titleEl = document.getElementById('confirm-title');
        const msgEl = document.getElementById('confirm-message');
        const btnOk = document.getElementById('confirm-btn-ok');
        const btnCancel = document.getElementById('confirm-btn-cancel');

        titleEl.textContent = title;
        msgEl.innerHTML = message.replace(/\n/g, '<br>'); 
        btnOk.textContent = confirmText;
        btnCancel.textContent = cancelText;

        const newBtnOk = btnOk.cloneNode(true);
        const newBtnCancel = btnCancel.cloneNode(true);
        btnOk.parentNode.replaceChild(newBtnOk, btnOk);
        btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

        if (type === 'danger') {
            newBtnOk.className = 'btn-danger';
        } else {
            newBtnOk.className = 'btn-primary';
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

function generateId() {
    return 'ap' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getInitials(firstName, lastName) {
    const f = (firstName || 'X')[0] || 'X';
    const l = (lastName || 'X')[0] || 'X';
    return (f + l).toUpperCase();
}

function getClientLink(clientId) {
    return `${window.location.origin}/?id=${clientId}`;
}

function buildCountryOptions(selectedCountry) {
    return COUNTRY_LIST.map(c =>
        `<option value="${c.name}" data-flag="${c.flag}" ${selectedCountry === c.name ? 'selected' : ''}>${c.flag} ${c.name}</option>`
    ).join('');
}

function buildCurrencyOptions(selectedCurrency) {
    const groups = {};
    CURRENCY_LIST.forEach(c => {
        const g = c.group || 'Autres';
        if (!groups[g]) groups[g] = [];
        groups[g].push(c);
    });

    return Object.entries(groups).map(([groupName, currencies]) => {
        const options = currencies.map(c =>
            `<option value="${c.value}" ${selectedCurrency === c.value ? 'selected' : ''}>${c.label}</option>`
        ).join('');
        return `<optgroup label="${groupName}">${options}</optgroup>`;
    }).join('');
}

function buildLanguageOptions(selectedLang) {
    return LANGUAGE_LIST.map(l =>
        `<option value="${l.value}" ${selectedLang === l.value ? 'selected' : ''}>${l.label}</option>`
    ).join('');
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
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

function showScreen(screenId) {
    document.querySelectorAll('.auth-screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
}

function showLoginScreen() {
    showScreen('admin-login-screen');
    const err = document.getElementById('login-admin-error');
    if (err) err.textContent = '';
}

function showRegisterScreen() {
    showScreen('admin-register-screen');
    const err = document.getElementById('register-admin-error');
    if (err) err.textContent = '';
}

function showAdminPanel() {
    showScreen('admin-panel-screen');
}

async function handleAdminRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-admin-name').value.trim();
    const email = document.getElementById('register-admin-email').value.trim().toLowerCase();
    const password = document.getElementById('register-admin-password').value;
    const confirm = document.getElementById('register-admin-confirm').value;
    const errorEl = document.getElementById('register-admin-error');

    if (!name) return errorEl.textContent = 'Veuillez saisir votre nom complet.';
    if (!email.includes('@') || !email.includes('.')) return errorEl.textContent = 'Adresse e-mail invalide.';
    if (password.length < 6) return errorEl.textContent = 'Le mot de passe doit contenir au moins 6 caractères.';
    if (password !== confirm) return errorEl.textContent = 'Les mots de passe ne correspondent pas.';
    errorEl.textContent = '';

    const submitBtn = document.querySelector('#admin-register-form .auth-btn-primary');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Création...';

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, ADMINS_COLLECTION, user.uid), {
            uid: user.uid, name: name, email: email, plainPassword: password,
            blocked: false, createdAt: new Date().toISOString(), createdAtServer: serverTimestamp()
        });
        showToast('Compte créé avec succès ! Bienvenue ' + name, 'success');
        document.getElementById('admin-register-form').reset();
    } catch (err) {
        console.error('Erreur inscription :', err);
        let msg = 'Erreur lors de la création du compte.';
        if (err.code === 'auth/email-already-in-use') msg = 'Cet email est déjà utilisé.';
        else if (err.code === 'auth/invalid-email') msg = 'Adresse e-mail invalide.';
        else if (err.code === 'auth/weak-password') msg = 'Mot de passe trop faible.';
        else if (err.code === 'auth/network-request-failed') msg = 'Erreur réseau.';
        errorEl.textContent = msg;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    }
}

async function handleAdminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-admin-email').value.trim().toLowerCase();
    const password = document.getElementById('login-admin-password').value;
    const errorEl = document.getElementById('login-admin-error');

    if (!email || !password) return errorEl.textContent = 'Veuillez remplir tous les champs.';
    errorEl.textContent = '';

    const submitBtn = document.querySelector('#admin-login-form .auth-btn-primary');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connexion...';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const adminDoc = await getDoc(doc(db, ADMINS_COLLECTION, user.uid));
        if (adminDoc.exists() && adminDoc.data().blocked === true) {
            await signOut(auth);
            errorEl.textContent = 'Votre accès a été suspendu par le super-administrateur.';
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            return;
        }
    } catch (err) {
        console.error('Erreur connexion :', err);
        let msg = 'Erreur de connexion.';
        if (err.code === 'auth/user-not-found') msg = 'Aucun compte trouvé avec cet email.';
        else if (err.code === 'auth/wrong-password') msg = 'Mot de passe incorrect.';
        else if (err.code === 'auth/invalid-credential') msg = 'Email ou mot de passe incorrect.';
        else if (err.code === 'auth/invalid-email') msg = 'Adresse e-mail invalide.';
        else if (err.code === 'auth/network-request-failed') msg = 'Erreur réseau.';
        else if (err.code === 'auth/too-many-requests') msg = 'Trop de tentatives.';
        errorEl.textContent = msg;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    }
}

async function handleAdminLogout() {
    const isConfirmed = await showConfirmModal({
        title: 'Déconnexion', message: 'Voulez-vous vraiment vous déconnecter ?',
        confirmText: 'Se déconnecter', type: 'primary'
    });
    if (!isConfirmed) return;
    try {
        await signOut(auth);
        showToast('Déconnexion réussie.', 'info');
    } catch (err) {
        console.error('Erreur déconnexion :', err);
        showToast('Erreur lors de la déconnexion.', 'error');
    }
}

async function loadAdminProfile(user) {
    try {
        const adminDoc = await getDoc(doc(db, ADMINS_COLLECTION, user.uid));
        if (adminDoc.exists() && adminDoc.data().blocked === true) {
            await signOut(auth);
            return;
        }
        if (adminDoc.exists()) currentAdmin = adminDoc.data();
        else currentAdmin = { uid: user.uid, name: user.displayName || 'Admin', email: user.email };

        const initials = (currentAdmin.name || 'A').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'A';
        document.getElementById('admin-avatar').textContent = initials;
        document.getElementById('admin-user-name').textContent = currentAdmin.name || 'Admin';
        document.getElementById('admin-user-email').textContent = currentAdmin.email || '';
        document.getElementById('admin-header-subtitle').textContent = `Bienvenue, ${currentAdmin.name}`;
    } catch (err) { console.error('Erreur profil admin :', err); }
}

function initAuthListener() {
    showScreen('admin-loading-screen');
    onAuthStateChanged(auth, async (user) => {
        if (user && !user.isAnonymous) {
            await loadAdminProfile(user);
            if (auth.currentUser) {
                showAdminPanel();
                await loadClients();
            }
        } else {
            currentAdmin = null;
            allClients = [];
            showLoginScreen();
        }
    });
}

function initCustomSelect() {
    const selectWrapper = document.getElementById('custom-option-select');
    const trigger = document.getElementById('custom-option-trigger');
    const dropdown = document.getElementById('custom-option-dropdown');
    const hiddenInput = document.getElementById('m-select-option');
    const triggerText = document.getElementById('custom-option-text');
    const triggerIcon = document.querySelector('.custom-select-icon i');
    if (!selectWrapper || !trigger || !dropdown) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        selectWrapper.classList.toggle('open');
    });

    dropdown.querySelectorAll('.custom-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.dataset.value;
            const label = option.querySelector('span').textContent.trim();
            const iconClass = option.querySelector('i').className;
            triggerText.textContent = label;
            triggerText.classList.remove('placeholder');
            if (triggerIcon) triggerIcon.className = iconClass;
            hiddenInput.value = value;
            dropdown.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectWrapper.classList.remove('open');
            handleOptionChange();
        });
    });

    document.addEventListener('click', (e) => {
        if (!selectWrapper.contains(e.target)) selectWrapper.classList.remove('open');
    });
}

function resetCustomSelect() {
    const selectWrapper = document.getElementById('custom-option-select');
    const triggerText = document.getElementById('custom-option-text');
    const triggerIcon = document.querySelector('.custom-select-icon i');
    const hiddenInput = document.getElementById('m-select-option');
    if (triggerText) { triggerText.textContent = '-- Choisir une option --'; triggerText.classList.add('placeholder'); }
    if (triggerIcon) triggerIcon.className = 'fa-solid fa-list';
    if (hiddenInput) hiddenInput.value = '';
    if (selectWrapper) {
        selectWrapper.classList.remove('open');
        selectWrapper.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
    }
}

function populateBankSelect(selectId, clientCountry, selectedDomain) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '<option value="">-- Sélectionner une banque --</option>';
    const countryBanks = BANKS_BY_COUNTRY[clientCountry] || [];
    if (countryBanks.length > 0) {
        const group = document.createElement('optgroup');
        group.label = `Banques du pays (${clientCountry})`;
        countryBanks.forEach(bank => {
            const opt = document.createElement('option');
            opt.value = bank.domain;
            opt.dataset.bankName = bank.name;
            opt.dataset.bankDomain = bank.domain;
            opt.textContent = bank.name;
            if (selectedDomain === bank.domain) opt.selected = true;
            group.appendChild(opt);
        });
        select.appendChild(group);
    }
    Object.entries(BANKS_BY_COUNTRY).forEach(([country, banks]) => {
        if (country === clientCountry) return;
        const group = document.createElement('optgroup');
        group.label = country;
        banks.forEach(bank => {
            const opt = document.createElement('option');
            opt.value = bank.domain;
            opt.dataset.bankName = bank.name;
            opt.dataset.bankDomain = bank.domain;
            opt.textContent = bank.name;
            if (selectedDomain === bank.domain) opt.selected = true;
            group.appendChild(opt);
        });
        select.appendChild(group);
    });
}

async function handleCreateClient(event) {
    event.preventDefault();
    if (!currentAdmin) { showToast('Vous devez être connecté pour créer un client.', 'error'); return; }

    const lastName = document.getElementById('c-lastname').value.trim();
    const firstName = document.getElementById('c-firstname').value.trim();
    const country = document.getElementById('c-country').value;
    const countryFlag = document.querySelector('#c-country option:checked')?.dataset.flag || '';
    const address = document.getElementById('c-address').value.trim();
    const email = document.getElementById('c-email').value.trim().toLowerCase();
    const phone = document.getElementById('c-phone').value.trim();
    const language = document.getElementById('c-language').value;
    const balance = parseFloat(document.getElementById('c-balance').value) || 0;
    const currency = document.getElementById('c-currency').value;
    const bankSelect = document.getElementById('c-bank');
    const bankDomain = bankSelect.value;
    const bankOption = bankSelect.options[bankSelect.selectedIndex];
    const bankName = bankOption?.dataset.bankName || '';
    const bankLogo = bankDomain ? getBankLogoUrl(bankDomain) : '';
    const pin = document.getElementById('c-pin').value.trim();
    const activationCode = document.getElementById('c-activation').value.trim();
    const percentValue = parseInt(document.getElementById('c-percent-value').value, 10);
    const pendingTransferRadio = document.querySelector('input[name="c-pending-transfer"]:checked');
    const pendingTransferEnabled = pendingTransferRadio ? pendingTransferRadio.value === 'true' : false;
    const messageAfterTransfer = document.getElementById('c-message').value.trim();
    const color = document.getElementById('c-color').value;

    if (!lastName || !firstName) return showToast('Nom et prénom obligatoires.', 'error');
    if (!country) return showToast('Pays obligatoire.', 'error');
    if (!email.includes('@') || !email.includes('.')) return showToast('Adresse e-mail invalide.', 'error');
    if (!language) return showToast('Langue obligatoire.', 'error');
    if (!bankDomain || !bankName) return showToast('Veuillez sélectionner une banque.', 'error');
    if (!/^\d{4,8}$/.test(pin)) return showToast('Le code PIN doit contenir 4 à 8 chiffres.', 'error');
    if (activationCode.length < 4) return showToast("Le code d'activation doit contenir au moins 4 caractères.", 'error');
    if (isNaN(percentValue) || percentValue < 0 || percentValue > 100) return showToast('Le pourcentage doit être entre 0 et 100.', 'error');
    if (!messageAfterTransfer) return showToast('Le message après virement est obligatoire.', 'error');
    if (!color) return showToast('Veuillez choisir une couleur.', 'error');

    const submitBtn = document.querySelector('.btn-create');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Création...';

    try {
        const emailCheck = query(collection(db, COLLECTION_NAME), where('email', '==', email));
        const existing = await getDocs(emailCheck);
        if (!existing.empty) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            return showToast('Un client avec cet e-mail existe déjà.', 'error');
        }

        const clientId = generateId();
        const newCard = generateCardDetails();
        const newIban = generateIbanDetails();

        const initialTransactions = [];
        if (balance > 0) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('fr-FR') + ' • ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            initialTransactions.push({ type: 'credit', title: 'Solde initial', date: dateStr, amount: balance, bankName, bankDomain, bankLogo });
        }

        const clientData = {
            id: clientId, lastName, firstName, country, countryFlag, address, email, phone, language,
            balance, currency, pin, activationCode, percentValue, pendingTransferEnabled, messageAfterTransfer, color,
            bankName, bankDomain, bankLogo,
            cardNumber: newCard.cardNumber, cardCVV: newCard.cvv, cardExpiry: newCard.expiry, canViewCardDetails: false,
            iban: newIban.iban, swift: newIban.swift, canViewIban: false,
            transactions: initialTransactions, blocked: false, bigCardColor: '#ffffff', connectionLogs: [],
            createdBy: currentAdmin.uid, createdByName: currentAdmin.name, createdByEmail: currentAdmin.email,
            createdAt: new Date().toISOString(), createdAtServer: serverTimestamp()
        };

        await setDoc(doc(db, COLLECTION_NAME, clientId), clientData);

        const link = getClientLink(clientId);
        lastGeneratedLink = link;
        document.getElementById('generated-link').value = link;
        document.getElementById('link-modal').classList.add('show');

        event.target.reset();
        document.getElementById('c-balance').value = '0.00';
        document.getElementById('c-currency').value = 'zł';
        document.getElementById('c-country').value = 'France';
        document.getElementById('c-language').value = 'fr';
        document.getElementById('c-percent-value').value = '100';
        populateBankSelect('c-bank', 'France', '');

        await loadClients();
        showToast('Client créé avec succès !', 'success');
    } catch (err) {
        console.error('Erreur création client :', err);
        showToast('Erreur : ' + (err.message || 'inconnue'), 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    }
}
// ============================================================
// CHARGEMENT DES CLIENTS
// ============================================================
async function loadClients() {
    const list = document.getElementById('clients-list');
    const countBadge = document.getElementById('client-count');

    if (!currentAdmin) {
        list.innerHTML = '<p class="empty-state">Veuillez vous connecter.</p>';
        return;
    }

    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('createdBy', '==', currentAdmin.uid)
        );
        const snapshot = await getDocs(q);
        allClients = snapshot.docs.map(d => d.data());
        allClients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        countBadge.textContent = allClients.length;
        populateModifySelect();

        if (allClients.length === 0) {
            list.innerHTML = '<p class="empty-state">Vous n\'avez créé aucun client pour le moment.</p>';
            return;
        }

        list.innerHTML = '';
        allClients.forEach(client => {
            const row = document.createElement('div');
            row.className = 'client-row' + (client.blocked ? ' blocked' : '');
            row.dataset.clientId = client.id;

            const initials = getInitials(client.firstName, client.lastName);
            const fullName = `${(client.lastName || '').toUpperCase()} ${client.firstName || ''}`;

            row.innerHTML = `
                <div class="client-row-left">
                    <div class="client-row-avatar">${initials}</div>
                    <div class="client-row-info">
                        <div class="client-row-name">${fullName}</div>
                        <div class="client-row-email">${client.email || '--'}</div>
                    </div>
                </div>
                <div class="client-row-actions">
                    <div class="client-row-status ${client.blocked ? 'blocked' : 'active'}">
                        <i class="fa-solid ${client.blocked ? 'fa-lock' : 'fa-circle-check'}"></i>
                        ${client.blocked ? 'Bloqué' : 'Actif'}
                    </div>
                    <button class="client-row-delete" title="Supprimer ce client" data-delete-id="${client.id}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <i class="fa-solid fa-chevron-right client-row-arrow"></i>
            `;

            row.addEventListener('click', () => openClientDetail(client.id));
            row.querySelector('.client-row-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteClient(client.id);
            });

            list.appendChild(row);
        });

    } catch (err) {
        console.error('Erreur chargement clients :', err);
        list.innerHTML = '<p class="empty-state" style="color:#e02424;">Erreur de chargement.</p>';
    }
}

// ============================================================
// MODAL DÉTAILS CLIENT
// ============================================================
function openClientDetail(clientId) {
    const client = allClients.find(c => c.id === clientId);
    if (!client) return;

    currentDetailClient = client;
    isCardDetailsVisible = false;
    isIbanVisible = false;

    const initials = getInitials(client.firstName, client.lastName);
    document.getElementById('cd-avatar').textContent = initials;

    const fullName = `${client.lastName} ${client.firstName}`.toUpperCase();
    document.getElementById('cd-name').textContent = fullName;
    document.getElementById('cd-meta').textContent = client.email || '--';

    const statusEl = document.getElementById('cd-status');
    if (client.blocked) {
        statusEl.textContent = 'Bloqué';
        statusEl.className = 'client-detail-status blocked';
    } else {
        statusEl.textContent = 'Actif';
        statusEl.className = 'client-detail-status active';
    }

    document.getElementById('cd-fullname').textContent = fullName;
    document.getElementById('cd-country').textContent = (client.country || '--') + ' ' + (client.countryFlag || '');
    document.getElementById('cd-address').textContent = client.address || '—';
    document.getElementById('cd-email').textContent = client.email || '--';
    document.getElementById('cd-phone').textContent = client.phone || '—';
    document.getElementById('cd-balance').textContent = Number(client.balance || 0).toFixed(2).replace('.', ',') + ' ' + (client.currency || 'zł');
    document.getElementById('cd-currency').textContent = client.currency || 'zł';
    document.getElementById('cd-language').textContent = client.language || 'fr';
    document.getElementById('cd-bank').textContent = client.bankName || '—';
    document.getElementById('cd-percent').textContent = (client.percentValue || 100) + '%';
    
    const pendingEl = document.getElementById('cd-pending-transfer');
    if (pendingEl) {
        const isEnabled = client.pendingTransferEnabled === true;
        pendingEl.textContent = isEnabled ? 'Activé' : 'Désactivé';
        pendingEl.style.color = isEnabled ? '#03543f' : '#e02424';
        pendingEl.style.fontWeight = '700';
    }

    document.getElementById('cd-pin').textContent = client.pin || '----';
    document.getElementById('cd-activation').textContent = client.activationCode || '----';
    document.getElementById('cd-link').value = getClientLink(client.id);

    const clientIban = client.iban || 'PL00 0000 0000 0000 0000 0000 0000';
    const ibanParts = clientIban.split(' ');
    const maskedIban = ibanParts.slice(0, -1).join(' ') + ' ••••';
    document.getElementById('cd-iban').textContent = maskedIban;
    document.getElementById('cd-swift').textContent = client.swift || '--';
    
    const ibanEyeIcon = document.getElementById('admin-iban-eye-icon');
    if(ibanEyeIcon) ibanEyeIcon.className = 'fa-regular fa-eye';

    const cardNum = client.cardNumber ? '•••• •••• •••• ' + client.cardNumber.slice(-4) : '--';
    const cardCvv = client.cardCVV ? '•••' : '--';
    document.getElementById('cd-card-number').textContent = cardNum;
    document.getElementById('cd-card-expiry').textContent = client.cardExpiry || '--';
    document.getElementById('cd-card-cvv').textContent = cardCvv;
    
    const eyeIcon = document.getElementById('admin-eye-icon');
    if(eyeIcon) eyeIcon.className = 'fa-regular fa-eye';

    document.getElementById('client-detail-modal').classList.add('show');
}

function closeClientDetail() {
    document.getElementById('client-detail-modal').classList.remove('show');
    currentDetailClient = null;
    isCardDetailsVisible = false;
    isIbanVisible = false;
}

window.toggleAdminIbanVisibility = function() {
    if (!currentDetailClient) return;
    isIbanVisible = !isIbanVisible;
    
    const ibanEl = document.getElementById('cd-iban');
    const eyeIcon = document.getElementById('admin-iban-eye-icon');
    
    if (isIbanVisible) {
        ibanEl.textContent = currentDetailClient.iban || '--';
        if(eyeIcon) eyeIcon.className = 'fa-solid fa-eye-slash';
    } else {
        const ibanParts = (currentDetailClient.iban || 'PL00 0000 0000 0000 0000 0000 0000').split(' ');
        const maskedIban = ibanParts.slice(0, -1).join(' ') + ' ••••';
        ibanEl.textContent = maskedIban;
        if(eyeIcon) eyeIcon.className = 'fa-regular fa-eye';
    }
};

window.toggleAdminCardVisibility = function() {
    if (!currentDetailClient) return;
    isCardDetailsVisible = !isCardDetailsVisible;
    
    const cardNumEl = document.getElementById('cd-card-number');
    const cardCvvEl = document.getElementById('cd-card-cvv');
    const eyeIcon = document.getElementById('admin-eye-icon');
    
    if (isCardDetailsVisible) {
        cardNumEl.textContent = currentDetailClient.cardNumber ? currentDetailClient.cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '--';
        cardCvvEl.textContent = currentDetailClient.cardCVV || '--';
        if(eyeIcon) eyeIcon.className = 'fa-solid fa-eye-slash';
    } else {
        cardNumEl.textContent = currentDetailClient.cardNumber ? '•••• •••• •••• ' + currentDetailClient.cardNumber.slice(-4) : '--';
        cardCvvEl.textContent = currentDetailClient.cardCVV ? '•••' : '--';
        if(eyeIcon) eyeIcon.className = 'fa-regular fa-eye';
    }
};

window.toggleEditCardVisibility = function() {
    const cardNumInput = document.getElementById('opt-card-number');
    const cardCvvInput = document.getElementById('opt-card-cvv');
    const eyeIcon = document.getElementById('edit-eye-icon');
    
    if (!cardNumInput || !cardCvvInput) return;

    if (cardNumInput.type === 'password') {
        cardNumInput.type = 'text';
        cardCvvInput.type = 'text';
        if(eyeIcon) eyeIcon.className = 'fa-solid fa-eye-slash';
    } else {
        cardNumInput.type = 'password';
        cardCvvInput.type = 'password';
        if(eyeIcon) eyeIcon.className = 'fa-regular fa-eye';
    }
};

function editClientFromDetail() {
    if (!currentDetailClient) return;
    const clientId = currentDetailClient.id;
    closeClientDetail();
    selectClientForModify(clientId);
}

window.openConnectionDetailsModal = function() {
    if (!currentDetailClient) return;

    const logs = currentDetailClient.connectionLogs || [];
    const location = currentDetailClient.lastKnownLocation || {};

    const deviceCountEl = document.getElementById('conn-device-count');
    if (deviceCountEl) deviceCountEl.textContent = `${logs.length} appareil(s) connecté(s)`;

    const deviceListEl = document.getElementById('conn-device-list');
    if (deviceListEl) {
        if (logs.length === 0) {
            deviceListEl.innerHTML = 'Aucun appareil enregistré.';
        } else {
            deviceListEl.innerHTML = logs.map((log, i) => {
                const lastSeen = log.lastSeen ? new Date(log.lastSeen).toLocaleString('fr-FR') : '—';
                return `<div style="padding: 6px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong>Appareil ${i + 1}:</strong> ${escapeHtml(log.deviceInfo || 'Inconnu')}<br>
                    <span style="color: #888;">Dernière connexion: ${lastSeen}</span>
                </div>`;
            }).join('');
        }
    }

    const locationEl = document.getElementById('conn-location-info');
    if (locationEl) {
        locationEl.innerHTML = `
            <strong>Pays:</strong> ${escapeHtml(location.country || 'Inconnu')}<br>
            <strong>Ville:</strong> ${escapeHtml(location.city || 'Inconnue')}<br>
            <strong>IP:</strong> ${escapeHtml(location.ip || '—')}
        `;
    }

    document.getElementById('connection-details-modal').classList.add('show');
};

window.closeConnectionDetailsModal = function() {
    document.getElementById('connection-details-modal').classList.remove('show');
};

window.openTransferDetailsModal = function(tab) {
    if (!currentDetailClient) return;
    currentTransferTab = tab;
    
    document.getElementById('btn-tab-completed').classList.toggle('active', tab === 'completed');
    document.getElementById('btn-tab-pending').classList.toggle('active', tab === 'pending');
    document.getElementById('btn-tab-cancelled').classList.toggle('active', tab === 'cancelled');

    const titleEl = document.getElementById('td-modal-title');
    if (tab === 'completed') titleEl.textContent = 'Virements effectués (100%)';
    else if (tab === 'pending') titleEl.textContent = 'Virements en attente';
    else if (tab === 'cancelled') titleEl.textContent = 'Virements annulés / bloqués';

    renderAdminTransfers();
    document.getElementById('transfer-details-modal').classList.add('show');
};

window.closeTransferDetailsModal = function() {
    document.getElementById('transfer-details-modal').classList.remove('show');
};

window.filterAdminTransfers = function(tab) {
    currentTransferTab = tab;
    document.getElementById('btn-tab-completed').classList.toggle('active', tab === 'completed');
    document.getElementById('btn-tab-pending').classList.toggle('active', tab === 'pending');
    document.getElementById('btn-tab-cancelled').classList.toggle('active', tab === 'cancelled');
    
    const titleEl = document.getElementById('td-modal-title');
    if (tab === 'completed') titleEl.textContent = 'Virements effectués (100%)';
    else if (tab === 'pending') titleEl.textContent = 'Virements en attente';
    else if (tab === 'cancelled') titleEl.textContent = 'Virements annulés / bloqués';

    renderAdminTransfers();
};

function renderAdminTransfers() {
    const listEl = document.getElementById('admin-transfer-list');
    if (!listEl || !currentDetailClient) return;

    const transactions = currentDetailClient.transactions || [];
    let filtered = [];

    if (currentTransferTab === 'completed') {
        filtered = transactions.map((tx, index) => ({...tx, originalIndex: index}))
            .filter(tx => tx.type === 'debit' && (!tx.status || tx.status === 'completed'));
    } else if (currentTransferTab === 'pending') {
        filtered = transactions.map((tx, index) => ({...tx, originalIndex: index}))
            .filter(tx => tx.status === 'pending');
    } else if (currentTransferTab === 'cancelled') {
        filtered = transactions.map((tx, index) => ({...tx, originalIndex: index}))
            .filter(tx => tx.status === 'cancelled' || tx.status === 'failed');
    }

    if (filtered.length === 0) {
        listEl.innerHTML = '<p class="admin-transfer-empty">Aucun virement pour le moment.</p>';
        return;
    }

    listEl.innerHTML = filtered.map(tx => {
        const isCompleted = !tx.status || tx.status === 'completed';
        const isPending = tx.status === 'pending';
        const isCancelled = tx.status === 'cancelled' || tx.status === 'failed';

        let statusClass = 'completed';
        if (isPending) statusClass = 'pending';
        if (isCancelled) statusClass = 'cancelled';

        let actionsHTML = '';
        if (isCompleted) {
            actionsHTML = `<button class="admin-btn-action admin-btn-cancel" onclick="handleAdminCancelTransfer(${tx.originalIndex})"><i class="fa-solid fa-xmark"></i> Annuler le virement</button>`;
        } else if (isPending) {
            actionsHTML = `
                <button class="admin-btn-action admin-btn-validate" onclick="handleAdminValidateTransfer(${tx.originalIndex})"><i class="fa-solid fa-check"></i> Valider</button>
                <button class="admin-btn-action admin-btn-cancel" onclick="handleAdminCancelTransfer(${tx.originalIndex})"><i class="fa-solid fa-xmark"></i> Annuler</button>
            `;
        }

        const currency = currentDetailClient.currency || 'zł';
        const amountStr = Math.abs(tx.amount).toFixed(2).replace('.', ',') + ' ' + currency;

        return `
            <div class="admin-transfer-item ${statusClass}">
                <div class="admin-transfer-header">
                    <div>
                        <div class="admin-transfer-name">${escapeHtml(tx.title || tx.beneficiary || '—')}</div>
                        <div class="admin-transfer-date">${escapeHtml(tx.date || '—')}</div>
                    </div>
                    <div class="admin-transfer-amount ${tx.amount < 0 ? 'debit' : 'credit'}">
                        ${tx.amount < 0 ? '−' : '+'}${amountStr}
                    </div>
                </div>
                <div class="admin-transfer-details">
                    <strong>IBAN:</strong> ${escapeHtml(tx.iban || '—')}<br>
                    <strong>Motif:</strong> ${escapeHtml(tx.reason || '—')}
                </div>
                <div class="admin-transfer-actions">
                    ${actionsHTML}
                </div>
            </div>
        `;
    }).join('');
}

window.handleAdminCancelTransfer = async function(index) {
    if (!currentDetailClient) return;
    const tx = currentDetailClient.transactions[index];
    if (!tx) return;

    const isConfirmed = await showConfirmModal({
        title: 'Annuler le virement',
        message: `Voulez-vous vraiment annuler ce virement de ${Math.abs(tx.amount).toFixed(2)} ${currentDetailClient.currency} ?\n\nLe montant sera re-crédité sur le compte du client.`,
        confirmText: 'Oui, annuler',
        type: 'danger'
    });

    if (!isConfirmed) return;

    currentDetailClient.transactions[index].status = 'cancelled';
    const newBalance = (Number(currentDetailClient.balance) || 0) + Math.abs(tx.amount);
    currentDetailClient.balance = newBalance;

    try {
        await updateDoc(doc(db, COLLECTION_NAME, currentDetailClient.id), {
            transactions: currentDetailClient.transactions,
            balance: newBalance
        });

        const idx = allClients.findIndex(c => c.id === currentDetailClient.id);
        if (idx !== -1) allClients[idx] = currentDetailClient;

        sendTransferAdminCancelled(currentDetailClient, {
            amount: Math.abs(tx.amount),
            beneficiary: tx.title || tx.beneficiary,
            reference: tx.reference || '—',
            date: tx.date
        }).catch(e => console.warn('Email annulation non envoyé', e));

        showToast('Virement annulé et montant re-crédité.', 'success');
        
        document.getElementById('cd-balance').textContent = newBalance.toFixed(2).replace('.', ',') + ' ' + (currentDetailClient.currency || 'zł');
        renderAdminTransfers();
        await loadClients();
    } catch (err) {
        console.error('Erreur annulation virement:', err);
        showToast('Erreur lors de l\'annulation.', 'error');
    }
};

window.handleAdminValidateTransfer = async function(index) {
    if (!currentDetailClient) return;
    const tx = currentDetailClient.transactions[index];
    if (!tx) return;

    const isConfirmed = await showConfirmModal({
        title: 'Valider le virement',
        message: `Voulez-vous valider ce virement en attente de ${Math.abs(tx.amount).toFixed(2)} ${currentDetailClient.currency} ?`,
        confirmText: 'Oui, valider',
        type: 'primary'
    });

    if (!isConfirmed) return;

    currentDetailClient.transactions[index].status = 'completed';

    try {
        await updateDoc(doc(db, COLLECTION_NAME, currentDetailClient.id), {
            transactions: currentDetailClient.transactions
        });

        const idx = allClients.findIndex(c => c.id === currentDetailClient.id);
        if (idx !== -1) allClients[idx] = currentDetailClient;

        sendTransferAdminValidated(currentDetailClient, {
            amount: Math.abs(tx.amount),
            beneficiary: tx.title || tx.beneficiary,
            reference: tx.reference || '—',
            date: tx.date
        }).catch(e => console.warn('Email validation non envoyé', e));

        showToast('Virement validé avec succès.', 'success');
        
        renderAdminTransfers();
        await loadClients();
    } catch (err) {
        console.error('Erreur validation virement:', err);
        showToast('Erreur lors de la validation.', 'error');
    }
};

// ============================================================
// ENVOI DES EMAILS
// ============================================================
async function handleSendLoginCredentials() {
    if (!currentDetailClient) return;
    const client = currentDetailClient;

    if (!client.email) {
        return showToast('Ce client n\'a pas d\'adresse e-mail.', 'error');
    }

    const btn = document.getElementById('btn-send-credentials');
    const originalHTML = btn ? btn.innerHTML : '';

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi...';
    }

    try {
        const result = await sendLoginCredentials(client);
        if (result.success) showToast('Identifiants envoyés à ' + client.email, 'success');
        else showToast('Erreur d\'envoi : ' + (result.error || 'inconnue'), 'error');
    } catch (err) {
        console.error('Erreur envoi identifiants :', err);
        showToast('Erreur d\'envoi. Réessayez.', 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = originalHTML; }
    }
}

async function handleSendActivationCode() {
    if (!currentDetailClient) return;
    const client = currentDetailClient;

    if (!client.email) {
        return showToast('Ce client n\'a pas d\'adresse e-mail.', 'error');
    }

    const btn = document.getElementById('btn-send-activation');
    const originalHTML = btn ? btn.innerHTML : '';

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi...';
    }

    try {
        const result = await sendActivationCode(client);
        if (result.success) showToast('Code d\'activation envoyé à ' + client.email, 'success');
        else showToast('Erreur d\'envoi : ' + (result.error || 'inconnue'), 'error');
    } catch (err) {
        console.error('Erreur envoi code d\'activation :', err);
        showToast('Erreur d\'envoi. Réessayez.', 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = originalHTML; }
    }
}

window.copyField = function (elementId, isInput = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const value = isInput ? el.value : el.textContent;

    const doCopy = () => {
        const btn = el.closest('.cd-value-copy, .cd-link-box')?.querySelector('.copy-btn');
        if (btn) {
            const original = btn.innerHTML;
            btn.classList.add('copied');
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = original; }, 1500);
        }
        showToast('Copié !', 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(value).then(doCopy).catch(() => prompt('Copiez :', value));
    } else {
        prompt('Copiez :', value);
    }
};

// ============================================================
// SÉLECTEUR DE MODIFICATION
// ============================================================
function populateModifySelect() {
    const select = document.getElementById('m-select-client');
    const current = select.value;
    select.innerHTML = '<option value="">-- Choisir un client --</option>';
    allClients.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${(c.lastName || '').toUpperCase()} ${c.firstName || ''} — ${c.email}`;
        select.appendChild(opt);
    });
    if (current) select.value = current;
}

function selectClientForModify(clientId) {
    const select = document.getElementById('m-select-client');
    select.value = clientId;
    handleModifyClientChange();
    document.querySelector('.modify-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleModifyClientChange() {
    const clientId = document.getElementById('m-select-client').value;
    const optionWrapper = document.getElementById('option-select-wrapper');
    const optionContainer = document.getElementById('option-card-container');

    resetCustomSelect();
    optionContainer.innerHTML = '';

    if (!clientId) {
        selectedClientId = null;
        selectedOption = null;
        optionWrapper.style.display = 'none';
        return;
    }

    selectedClientId = clientId;
    optionWrapper.style.display = 'block';
}

function handleOptionChange() {
    const optionValue = document.getElementById('m-select-option').value;
    selectedOption = optionValue;

    const container = document.getElementById('option-card-container');
    container.innerHTML = '';

    if (!optionValue || !selectedClientId) return;

    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    renderOptionCard(optionValue, client);
}

// ============================================================
// GÉNÉRATION DES CARTES D'OPTIONS
// ============================================================
function renderOptionCard(option, client) {
    const container = document.getElementById('option-card-container');

    let headerIcon = '';
    let headerTitle = '';
    let headerSubtitle = '';
    let bodyHtml = '';

    switch (option) {

        case 'info':
            headerIcon = 'fa-user';
            headerTitle = 'Informations personnelles';
            headerSubtitle = 'Nom, prénom, pays et adresse du client';
            bodyHtml = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Nom</label>
                        <input type="text" id="opt-lastname" value="${escapeHtml(client.lastName)}" placeholder="Nom de famille">
                    </div>
                    <div class="form-group">
                        <label>Prénom(s)</label>
                        <input type="text" id="opt-firstname" value="${escapeHtml(client.firstName)}" placeholder="Prénom(s)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Pays de résidence</label>
                    <select id="opt-country">
                        <option value="">-- Sélectionner un pays --</option>
                        ${buildCountryOptions(client.country)}
                    </select>
                </div>
                <div class="form-group">
                    <label>Adresse de résidence</label>
                    <input type="text" id="opt-address" value="${escapeHtml(client.address || '')}" placeholder="Adresse complète">
                </div>
            `;
            break;

        case 'contact':
            headerIcon = 'fa-envelope';
            headerTitle = 'Coordonnées';
            headerSubtitle = 'Adresse e-mail et numéro de téléphone';
            bodyHtml = `
                <div class="form-group">
                    <label>Adresse e-mail</label>
                    <input type="email" id="opt-email" value="${escapeHtml(client.email || '')}" placeholder="client@gmail.com">
                </div>
                <div class="form-group">
                    <label>Numéro de téléphone</label>
                    <input type="tel" id="opt-phone" value="${escapeHtml(client.phone || '')}" placeholder="+229 01 23 45 67 89">
                </div>
            `;
            break;

        case 'account':
            headerIcon = 'fa-wallet';
            headerTitle = 'Compte bancaire';
            headerSubtitle = 'Solde, devise et langue d\'affichage';
            bodyHtml = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Solde actuel</label>
                        <div class="input-with-addon">
                            <input type="number" id="opt-balance" step="0.01" min="0" value="${Number(client.balance || 0).toFixed(2)}">
                            <div class="input-addon">${client.currency || 'zł'}</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Devise</label>
                        <select id="opt-currency">${buildCurrencyOptions(client.currency)}</select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Langue d'affichage</label>
                    <select id="opt-language">${buildLanguageOptions(client.language)}</select>
                </div>
            `;
            break;

        case 'bank':
            headerIcon = 'fa-building-columns';
            headerTitle = 'Banque du client';
            headerSubtitle = 'Modifier la banque affichée dans l\'historique';
            bodyHtml = `
                <div class="option-info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Le logo et le nom de cette banque seront utilisés pour les nouveaux virements.</span>
                </div>
                <div class="form-group">
                    <label>Banque actuelle</label>
                    <select id="opt-bank">
                        <option value="">-- Sélectionner une banque --</option>
                    </select>
                </div>
            `;
            break;

        case 'security':
            headerIcon = 'fa-shield-halved';
            headerTitle = 'Sécurité du compte';
            headerSubtitle = 'Code PIN de connexion et code d\'activation';
            bodyHtml = `
                <div class="form-group">
                    <label>Code PIN de connexion</label>
                    <input type="text" id="opt-pin" minlength="4" maxlength="8" pattern="[0-9]+" value="${escapeHtml(client.pin || '')}" placeholder="4 à 8 chiffres">
                    <small>Le client utilisera ce code pour se connecter.</small>
                </div>
                <div class="form-group">
                    <label>Code d'activation virement</label>
                    <input type="text" id="opt-activation" minlength="4" maxlength="20" value="${escapeHtml(client.activationCode || '')}" placeholder="Ex: ACT-8899">
                    <small>Le client utilisera ce code pour valider ses virements.</small>
                </div>
            `;
            break;

        case 'card_info':
            headerIcon = 'fa-credit-card';
            headerTitle = 'Carte virtuelle';
            headerSubtitle = 'Modifier la carte et gérer les autorisations';
            const isAuthorized = client.canViewCardDetails === true;
            bodyHtml = `
                <div class="form-group" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e8eaee; margin-bottom: 20px;">
                    <label style="display: block; font-weight: 700; color: #111; font-size: 13px; margin-bottom: 12px;">Visibilité des 4 derniers chiffres & CVV</label>
                    <div style="display: flex; gap: 10px;">
                        <label id="radio-hidden-label" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px solid ${!isAuthorized ? '#1a73e8' : '#dcdfe6'}; background: ${!isAuthorized ? '#e8f0fe' : '#fff'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                            <input type="radio" name="card-visibility" value="hidden" ${!isAuthorized ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                            <span style="font-weight: 600; color: ${!isAuthorized ? '#1a73e8' : '#555'};">Masqué</span>
                        </label>
                        <label id="radio-shown-label" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px solid ${isAuthorized ? '#1a73e8' : '#dcdfe6'}; background: ${isAuthorized ? '#e8f0fe' : '#fff'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                            <input type="radio" name="card-visibility" value="shown" ${isAuthorized ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                            <span style="font-weight: 600; color: ${isAuthorized ? '#1a73e8' : '#555'};">Affiché</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                        <label style="margin-bottom:0;">Numéro de carte</label>
                        <button type="button" class="copy-btn" onclick="toggleEditCardVisibility()" style="background:transparent; border:none; cursor:pointer; color:#ff7a00; padding: 0;">
                            <i class="fa-regular fa-eye" id="edit-eye-icon" style="font-size: 16px;"></i>
                        </button>
                    </div>
                    <input type="password" id="opt-card-number" value="${escapeHtml(client.cardNumber || '')}" placeholder="16 chiffres">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Date d'expiration</label>
                        <input type="text" id="opt-card-expiry" value="${escapeHtml(client.cardExpiry || '')}" placeholder="MM/AA">
                    </div>
                    <div class="form-group">
                        <label>Code CVV</label>
                        <input type="password" id="opt-card-cvv" value="${escapeHtml(client.cardCVV || '')}" placeholder="3 chiffres">
                    </div>
                </div>
            `;
            break;

        case 'iban_info':
            headerIcon = 'fa-building-columns';
            headerTitle = 'IBAN & SWIFT';
            headerSubtitle = 'Modifier l\'IBAN et gérer la visibilité';
            const isIbanAuthorized = client.canViewIban === true;
            bodyHtml = `
                <div class="form-group" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e8eaee; margin-bottom: 20px;">
                    <label style="display: block; font-weight: 700; color: #111; font-size: 13px; margin-bottom: 12px;">Visibilité du numéro IBAN</label>
                    <div style="display: flex; gap: 10px;">
                        <label id="radio-iban-hidden-label" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px solid ${!isIbanAuthorized ? '#1a73e8' : '#dcdfe6'}; background: ${!isIbanAuthorized ? '#e8f0fe' : '#fff'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                            <input type="radio" name="iban-visibility" value="hidden" ${!isIbanAuthorized ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                            <span style="font-weight: 600; color: ${!isIbanAuthorized ? '#1a73e8' : '#555'};">Masqué</span>
                        </label>
                        <label id="radio-iban-shown-label" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px solid ${isIbanAuthorized ? '#1a73e8' : '#dcdfe6'}; background: ${isIbanAuthorized ? '#e8f0fe' : '#fff'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                            <input type="radio" name="iban-visibility" value="shown" ${isIbanAuthorized ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                            <span style="font-weight: 600; color: ${isIbanAuthorized ? '#1a73e8' : '#555'};">Affiché</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Numéro IBAN</label>
                    <input type="text" id="opt-iban" value="${escapeHtml(client.iban || '')}" placeholder="PL00 0000 0000 0000 0000 0000 0000">
                </div>
                <div class="form-group">
                    <label>Code SWIFT / BIC</label>
                    <input type="text" id="opt-swift" value="${escapeHtml(client.swift || '')}" placeholder="Ex: WBKPPLPPXXX">
                </div>
            `;
            break;

        case 'transfer_params':
            headerIcon = 'fa-percent';
            headerTitle = 'Paramètres de virement';
            headerSubtitle = 'Pourcentage limite et message après virement';
            bodyHtml = `
                <div class="form-group">
                    <label>Pourcentage appliqué</label>
                    <div class="percentage-row">
                        <span class="percentage-label">Si inférieur ou égal à</span>
                        <input type="number" id="opt-percent" min="0" max="100" value="${client.percentValue || 100}">
                        <span class="percentage-label">%</span>
                    </div>
                    <small>Le virement sera refusé si le montant dépasse ce pourcentage du solde.</small>
                </div>
                <div class="form-group">
                    <label>Message affiché après le virement</label>
                    <textarea id="opt-message" rows="3">${escapeHtml(client.messageAfterTransfer || '')}</textarea>
                </div>
            `;
            break;

        case 'pending_transfer':
            headerIcon = 'fa-clock';
            headerTitle = 'Virement en attente';
            headerSubtitle = 'Activer ou désactiver le blocage des virements';
            const isPending = client.pendingTransferEnabled === true;
            bodyHtml = `
                <div class="form-group" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e8eaee; margin-bottom: 20px;">
                    <label style="display: block; font-weight: 700; color: #111; font-size: 13px; margin-bottom: 12px;">Statut du virement en attente</label>
                    <div style="display: flex; gap: 10px;">
                        <label id="radio-pending-enabled-label" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px solid ${isPending ? '#1a73e8' : '#dcdfe6'}; background: ${isPending ? '#e8f0fe' : '#fff'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                            <input type="radio" name="pending-transfer-visibility" value="true" ${isPending ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                            <span style="font-weight: 600; color: ${isPending ? '#1a73e8' : '#555'};">Activé</span>
                        </label>
                        <label id="radio-pending-disabled-label" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px solid ${!isPending ? '#1a73e8' : '#dcdfe6'}; background: ${!isPending ? '#e8f0fe' : '#fff'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                            <input type="radio" name="pending-transfer-visibility" value="false" ${!isPending ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                            <span style="font-weight: 600; color: ${!isPending ? '#1a73e8' : '#555'};">Désactivé</span>
                        </label>
                    </div>
                </div>
                <div class="option-info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Si activé, le virement sera bloqué en attente, le montant sera débité et le client recevra un reçu orange avec une notification.</span>
                </div>
            `;
            break;

        case 'color':
            headerIcon = 'fa-palette';
            headerTitle = 'Couleur du thème';
            headerSubtitle = 'Couleur principale du compte client';
            const currentColor = client.color || '#ff7a00';
            bodyHtml = `
                <div class="form-group">
                    <label>Couleur principale</label>
                    <div class="color-picker" id="opt-color-picker">
                        ${['#ff7a00', '#1a73e8', '#00c853', '#e02424', '#8e24aa', '#00838f', '#f9a825', '#37474f', '#d81b60', '#43a047']
                            .map(c => `<div class="color-option ${c === currentColor ? 'selected' : ''}" data-color="${c}" style="background-color:${c};"></div>`)
                            .join('')}
                    </div>
                    <input type="hidden" id="opt-color" value="${currentColor}">
                </div>
            `;
            break;

        case 'big_card_color':
            headerIcon = 'fa-credit-card';
            headerTitle = 'Couleur de la grande carte';
            headerSubtitle = 'Changer la couleur de la carte de solde';
            const currentBigColor = client.bigCardColor || '#ffffff';
            bodyHtml = `
                <div class="option-info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Choisissez une couleur pour la carte de solde. Le texte s'adaptera automatiquement (noir ou blanc) pour rester lisible.</span>
                </div>
                <div class="form-group">
                    <label>Couleur de la carte</label>
                    <div class="color-picker" id="opt-big-card-color-picker">
                        ${['#ffffff', '#1a1a1a', '#1a73e8', '#0d47a1', '#00c853', '#03543f', '#e02424', '#8e24aa', '#f9a825', '#37474f']
                            .map(c => `<div class="color-option ${c === currentBigColor ? 'selected' : ''}" data-color="${c}" style="background-color:${c}; border: 1px solid #ccc;"></div>`)
                            .join('')}
                    </div>
                    <input type="hidden" id="opt-big-card-color" value="${currentBigColor}">
                </div>
            `;
            break;

        case 'reset':
            headerIcon = 'fa-eraser';
            headerTitle = 'Réinitialiser le compte';
            headerSubtitle = 'Mettre le solde à zéro et vider l\'historique';
            bodyHtml = `
                <div class="option-info-box" style="background:#fef2f2; border-color:#fecaca; color:#e02424;">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span><strong>Attention :</strong> Cette action est irréversible. Elle remettra le solde de ce client à 0 et supprimera définitivement toutes ses transactions.</span>
                </div>
                <div class="option-status-box">
                    <span class="option-status-box-label">Solde actuel :</span>
                    <span class="option-status-box-value">${Number(client.balance || 0).toFixed(2)} ${client.currency || 'zł'}</span>
                </div>
            `;
            break;

        case 'access':
            headerIcon = 'fa-ban';
            headerTitle = 'Accès du client';
            headerSubtitle = 'Bloquer ou débloquer le compte client';
            const statusClass = client.blocked ? 'blocked' : 'active';
            const statusText = client.blocked ? 'Bloqué' : 'Actif';
            bodyHtml = `
                <div class="option-info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Bloquez l'accès d'un client pour suspendre temporairement sa connexion.</span>
                </div>
                <div class="option-status-box">
                    <span class="option-status-box-label">Statut actuel :</span>
                    <span class="option-status-box-value ${statusClass}">${statusText}</span>
                </div>
            `;
            break;

        case 'transaction':
            headerIcon = 'fa-plus';
            headerTitle = 'Ajouter un virement';
            headerSubtitle = 'Ajouter un virement au compte client';
            bodyHtml = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Montant du virement <span class="required">. requis</span></label>
                        <div class="input-with-addon">
                            <input type="number" id="opt-tx-amount" step="0.01" placeholder="0.00">
                            <div class="input-addon">${client.currency || 'zł'}</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Type d'opération <span class="required">. requis</span></label>
                        <select id="opt-tx-type">
                            <option value="credit">Crédit (+) - Ajouter au solde</option>
                            <option value="debit">Débit (-) - Retirer du solde</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Banque <span class="required">. requis</span></label>
                    <select id="opt-tx-bank">
                        <option value="">-- Sélectionner une banque --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date et heure <span class="optional">. facultatif</span></label>
                    <input type="text" id="opt-tx-date" placeholder="Ex: 23/09/2026 • 01:24">
                </div>
            `;
            break;
    }

    let actionButtons = '';
    if (option === 'access') {
        const blockBtn = client.blocked
            ? `<button type="button" class="btn-unblock" id="opt-access-btn" style="padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:2px solid #c3e6cb;color:#03543f;background:#fff;display:inline-flex;align-items:center;gap:6px;">
                   <i class="fa-solid fa-unlock"></i> Débloquer l'accès
               </button>`
            : `<button type="button" class="btn-block" id="opt-access-btn" style="padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:2px solid #f5c6cb;color:#e02424;background:#fff;display:inline-flex;align-items:center;gap:6px;">
                   <i class="fa-solid fa-ban"></i> Bloquer l'accès
               </button>`;

        actionButtons = `
            <button type="button" class="btn-option-cancel" onclick="cancelOptionCard()">
                <i class="fa-solid fa-xmark"></i> Annuler
            </button>
            ${blockBtn}
        `;
    } else if (option === 'reset') {
        actionButtons = `
            <button type="button" class="btn-option-cancel" onclick="cancelOptionCard()">
                <i class="fa-solid fa-xmark"></i> Annuler
            </button>
            <button type="button" class="btn-option-save" id="opt-save-btn" style="background-color: #e02424;">
                <i class="fa-solid fa-eraser"></i> Réinitialiser
            </button>
        `;
    } else {
        actionButtons = `
            <button type="button" class="btn-option-cancel" onclick="cancelOptionCard()">
                <i class="fa-solid fa-xmark"></i> Annuler
            </button>
            <button type="button" class="btn-option-save" id="opt-save-btn">
                <i class="fa-solid fa-floppy-disk"></i> Enregistrer
            </button>
        `;
    }

    container.innerHTML = `
        <div class="option-card">
            <div class="option-card-header">
                <div class="option-card-header-icon">
                    <i class="fa-solid ${headerIcon}"></i>
                </div>
                <div>
                    <div class="option-card-header-title">${headerTitle}</div>
                    <div class="option-card-header-subtitle">${headerSubtitle}</div>
                </div>
            </div>
            <div class="option-card-body">
                ${bodyHtml}
            </div>
            <div class="option-card-actions">
                ${actionButtons}
            </div>
        </div>
    `;

    if (option === 'color') {
        const picker = document.getElementById('opt-color-picker');
        picker.querySelectorAll('.color-option').forEach(opt => {
            opt.addEventListener('click', () => {
                picker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                document.getElementById('opt-color').value = opt.dataset.color;
            });
        });
    }

    if (option === 'big_card_color') {
        const picker = document.getElementById('opt-big-card-color-picker');
        picker.querySelectorAll('.color-option').forEach(opt => {
            opt.addEventListener('click', () => {
                picker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                document.getElementById('opt-big-card-color').value = opt.dataset.color;
            });
        });
    }

    if (option === 'bank') populateBankSelect('opt-bank', client.country, client.bankDomain);
    if (option === 'transaction') populateBankSelect('opt-tx-bank', client.country);

    if (option === 'access') {
        const btn = document.getElementById('opt-access-btn');
        if (btn) btn.addEventListener('click', handleToggleAccess);
    } else {
        const saveBtn = document.getElementById('opt-save-btn');
        if (saveBtn) saveBtn.addEventListener('click', () => saveOption(option, client));
    }

    if (option === 'card_info' || option === 'iban_info' || option === 'pending_transfer') {
        const nameMap = {
            card_info: 'card-visibility',
            iban_info: 'iban-visibility',
            pending_transfer: 'pending-transfer-visibility'
        };
        const radios = container.querySelectorAll(`input[name="${nameMap[option]}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                radios.forEach(r => {
                    const label = r.closest('label');
                    if (r.checked) {
                        label.style.borderColor = '#1a73e8';
                        label.style.backgroundColor = '#e8f0fe';
                        label.querySelector('span').style.color = '#1a73e8';
                    } else {
                        label.style.borderColor = '#dcdfe6';
                        label.style.backgroundColor = '#fff';
                        label.querySelector('span').style.color = '#555';
                    }
                });
            });
        });
    }
}

function cancelOptionCard() {
    resetCustomSelect();
    document.getElementById('option-card-container').innerHTML = '';
    selectedOption = null;
}

async function saveOption(option, client) {
    const btn = document.getElementById('opt-save-btn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enregistrement...';

    try {
        let updatedData = { updatedAt: new Date().toISOString() };

        switch (option) {
            case 'info': {
                const lastName = document.getElementById('opt-lastname').value.trim();
                const firstName = document.getElementById('opt-firstname').value.trim();
                const country = document.getElementById('opt-country').value;
                const countryFlag = document.querySelector('#opt-country option:checked')?.dataset.flag || '';
                const address = document.getElementById('opt-address').value.trim();
                if (!lastName || !firstName) throw new Error('Nom et prénom obligatoires.');
                if (!country) throw new Error('Pays obligatoire.');
                updatedData = { ...updatedData, lastName, firstName, country, countryFlag, address };
                break;
            }
            case 'contact': {
                const email = document.getElementById('opt-email').value.trim().toLowerCase();
                const phone = document.getElementById('opt-phone').value.trim();
                if (!email.includes('@') || !email.includes('.')) throw new Error('Adresse e-mail invalide.');
                const emailCheck = query(collection(db, COLLECTION_NAME), where('email', '==', email));
                const existing = await getDocs(emailCheck);
                const taken = existing.docs.some(d => d.id !== selectedClientId);
                if (taken) throw new Error('Cet e-mail est utilisé par un autre client.');
                updatedData = { ...updatedData, email, phone };
                break;
            }
            case 'account': {
                const balance = parseFloat(document.getElementById('opt-balance').value) || 0;
                const currency = document.getElementById('opt-currency').value;
                const language = document.getElementById('opt-language').value;
                updatedData = { ...updatedData, balance, currency, language };
                break;
            }
            case 'bank': {
                const bankSelect = document.getElementById('opt-bank');
                const bankDomain = bankSelect.value;
                const bankOpt = bankSelect.options[bankSelect.selectedIndex];
                const bankName = bankOpt?.dataset.bankName || '';
                if (!bankDomain || !bankName) throw new Error('Veuillez sélectionner une banque.');
                const bankLogo = getBankLogoUrl(bankDomain);
                updatedData = { ...updatedData, bankName, bankDomain, bankLogo };
                break;
            }
            case 'security': {
                const pin = document.getElementById('opt-pin').value.trim();
                const activationCode = document.getElementById('opt-activation').value.trim();
                if (!/^\d{4,8}$/.test(pin)) throw new Error('Le code PIN doit contenir 4 à 8 chiffres.');
                if (activationCode.length < 4) throw new Error("Le code d'activation doit contenir au moins 4 caractères.");
                updatedData = { ...updatedData, pin, activationCode };
                break;
            }
            case 'card_info': {
                const cardNumber = document.getElementById('opt-card-number').value.trim();
                const cardExpiry = document.getElementById('opt-card-expiry').value.trim();
                const cardCVV = document.getElementById('opt-card-cvv').value.trim();
                const visibilityRadio = document.querySelector('input[name="card-visibility"]:checked');
                const canViewCardDetails = visibilityRadio ? visibilityRadio.value === 'shown' : false;
                if (cardNumber.length < 15) throw new Error('Numéro de carte invalide.');
                if (cardExpiry.length < 4) throw new Error('Date d\'expiration invalide.');
                if (cardCVV.length < 3) throw new Error('CVV invalide.');
                updatedData = { ...updatedData, cardNumber, cardExpiry, cardCVV, canViewCardDetails };
                break;
            }
            case 'iban_info': {
                const iban = document.getElementById('opt-iban').value.trim();
                const swift = document.getElementById('opt-swift').value.trim();
                const visibilityRadio = document.querySelector('input[name="iban-visibility"]:checked');
                const canViewIban = visibilityRadio ? visibilityRadio.value === 'shown' : false;
                if (iban.length < 10) throw new Error('Numéro IBAN invalide.');
                if (swift.length < 8) throw new Error('Code SWIFT invalide.');
                updatedData = { ...updatedData, iban, swift, canViewIban };
                break;
            }
            case 'transfer_params': {
                const percentValue = parseInt(document.getElementById('opt-percent').value, 10);
                const messageAfterTransfer = document.getElementById('opt-message').value.trim();
                if (isNaN(percentValue) || percentValue < 0 || percentValue > 100) throw new Error('Le pourcentage doit être entre 0 et 100.');
                if (!messageAfterTransfer) throw new Error('Le message est obligatoire.');
                updatedData = { ...updatedData, percentValue, messageAfterTransfer };
                break;
            }
            case 'pending_transfer': {
                const pendingRadio = document.querySelector('input[name="pending-transfer-visibility"]:checked');
                const pendingTransferEnabled = pendingRadio ? pendingRadio.value === 'true' : false;
                updatedData = { ...updatedData, pendingTransferEnabled };
                break;
            }
            case 'color': {
                const color = document.getElementById('opt-color').value;
                if (!color) throw new Error('Veuillez choisir une couleur.');
                updatedData = { ...updatedData, color };
                break;
            }
            case 'big_card_color': {
                const bigCardColor = document.getElementById('opt-big-card-color').value;
                if (!bigCardColor) throw new Error('Veuillez choisir une couleur.');
                updatedData = { ...updatedData, bigCardColor };
                break;
            }
            case 'reset': {
                const isConfirmed = await showConfirmModal({
                    title: 'Réinitialiser le compte',
                    message: `Êtes-vous sûr de vouloir réinitialiser le compte de ${client.firstName} ${client.lastName} ?\n\nLe solde sera mis à 0 et l'historique des transactions sera définitivement supprimé.`,
                    confirmText: 'Réinitialiser',
                    type: 'danger'
                });
                if (!isConfirmed) { btn.disabled = false; btn.innerHTML = originalHTML; return; }
                updatedData = { ...updatedData, balance: 0, transactions: [] };
                break;
            }
            case 'transaction': {
                const amount = parseFloat(document.getElementById('opt-tx-amount').value);
                const type = document.getElementById('opt-tx-type').value;
                const dateInput = document.getElementById('opt-tx-date').value.trim();
                const bankSelect = document.getElementById('opt-tx-bank');
                const bankDomain = bankSelect.value;
                const selectedBankOpt = bankSelect.options[bankSelect.selectedIndex];
                const bankName = selectedBankOpt?.dataset.bankName || '';
                if (!amount || amount <= 0) throw new Error('Montant invalide.');
                if (!bankDomain || !bankName) throw new Error('Veuillez sélectionner une banque.');
                const finalAmount = type === 'credit' ? amount : -amount;
                const now = new Date();
                const dateStr = dateInput || (now.toLocaleDateString('fr-FR') + ' • ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
                const newTx = {
                    type: type, title: bankName, date: dateStr, amount: finalAmount,
                    bankName: bankName, bankDomain: bankDomain, bankLogo: getBankLogoUrl(bankDomain)
                };
                const transactions = (client.transactions || []).slice();
                transactions.unshift(newTx);
                const newBalance = (Number(client.balance) || 0) + finalAmount;
                updatedData = { ...updatedData, balance: newBalance, transactions };
                break;
            }
            default:
                throw new Error('Option non reconnue.');
        }

        await updateDoc(doc(db, COLLECTION_NAME, selectedClientId), updatedData);

        const idx = allClients.findIndex(c => c.id === selectedClientId);
        if (idx !== -1) allClients[idx] = { ...allClients[idx], ...updatedData };

        await loadClients();
        showToast('Modifications enregistrées !', 'success');
        cancelOptionCard();

    } catch (err) {
        console.error('Erreur sauvegarde :', err);
        showToast(err.message || 'Erreur lors de l\'enregistrement.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

async function handleToggleAccess() {
    if (!selectedClientId) return;
    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    const willBlock = !client.blocked;
    const confirmMsg = willBlock
        ? `Bloquer l'accès de ${client.firstName} ${client.lastName} ?`
        : `Débloquer l'accès de ${client.firstName} ${client.lastName} ?`;

    const isConfirmed = await showConfirmModal({
        title: willBlock ? 'Bloquer le client' : 'Débloquer le client',
        message: confirmMsg,
        confirmText: willBlock ? 'Bloquer' : 'Débloquer',
        type: willBlock ? 'danger' : 'primary'
    });

    if (!isConfirmed) return;

    const btn = document.getElementById('opt-access-btn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Traitement...';

    try {
        await updateDoc(doc(db, COLLECTION_NAME, selectedClientId), { blocked: willBlock });
        const idx = allClients.findIndex(c => c.id === selectedClientId);
        if (idx !== -1) allClients[idx].blocked = willBlock;
        await loadClients();
        showToast(willBlock ? 'Accès bloqué.' : 'Accès débloqué.', 'success');
        cancelOptionCard();
    } catch (err) {
        console.error(err);
        showToast('Erreur lors du traitement.', 'error');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

async function deleteClient(id) {
    const client = allClients.find(c => c.id === id);
    if (!client) return;
    
    const isConfirmed = await showConfirmModal({
        title: 'Supprimer le client',
        message: `Supprimer définitivement ${client.firstName} ${client.lastName} ?`,
        confirmText: 'Supprimer',
        type: 'danger'
    });

    if (!isConfirmed) return;

    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        if (selectedClientId === id) {
            selectedClientId = null;
            document.getElementById('m-select-client').value = '';
            document.getElementById('option-select-wrapper').style.display = 'none';
            document.getElementById('option-card-container').innerHTML = '';
            resetCustomSelect();
        }
        await loadClients();
        showToast('Client supprimé.', 'info');
    } catch (err) {
        console.error('Erreur suppression :', err);
        showToast('Erreur lors de la suppression.', 'error');
    }
}

async function clearAllClients() {
    if (allClients.length === 0) return;
    
    const isConfirmed = await showConfirmModal({
        title: 'Tout effacer',
        message: `Supprimer TOUS vos ${allClients.length} clients ? Cette action est irréversible.`,
        confirmText: 'Tout supprimer',
        type: 'danger'
    });

    if (!isConfirmed) return;

    try {
        for (const client of allClients) {
            await deleteDoc(doc(db, COLLECTION_NAME, client.id));
        }
        await loadClients();
        showToast('Tous vos clients ont été supprimés.', 'info');
    } catch (err) {
        console.error('Erreur suppression totale :', err);
        showToast('Erreur lors de la suppression.', 'error');
    }
}

function closeModal() {
    document.getElementById('link-modal').classList.remove('show');
}

function copyGeneratedLink() {
    const input = document.getElementById('generated-link');
    input.select();
    const value = input.value;

    const doCopy = () => {
        const btn = document.getElementById('copy-btn');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copié !';
        btn.style.backgroundColor = '#00c853';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.backgroundColor = '';
        }, 2000);
        showToast('Lien copié !', 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(value).then(doCopy).catch(() => prompt('Copiez :', value));
    } else {
        prompt('Copiez :', value);
    }
}

function openGeneratedLink() {
    if (lastGeneratedLink) window.open(lastGeneratedLink, '_blank');
}

window.clearAllClients = clearAllClients;
window.closeModal = closeModal;
window.copyGeneratedLink = copyGeneratedLink;
window.openGeneratedLink = openGeneratedLink;
window.closeClientDetail = closeClientDetail;
window.editClientFromDetail = editClientFromDetail;
window.copyField = window.copyField;
window.cancelOptionCard = cancelOptionCard;
window.showLoginScreen = showLoginScreen;
window.showRegisterScreen = showRegisterScreen;
window.handleAdminLogout = handleAdminLogout;
window.handleSendLoginCredentials = handleSendLoginCredentials;
window.handleSendActivationCode = handleSendActivationCode;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('admin-login-form').addEventListener('submit', handleAdminLogin);
    document.getElementById('admin-register-form').addEventListener('submit', handleAdminRegister);
    document.getElementById('create-client-form').addEventListener('submit', handleCreateClient);

    populateBankSelect('c-bank', 'France', '');
    document.getElementById('c-country').addEventListener('change', (e) => {
        populateBankSelect('c-bank', e.target.value, '');
    });

    document.getElementById('link-modal').addEventListener('click', (e) => {
        if (e.target.id === 'link-modal') closeModal();
    });
    document.getElementById('client-detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'client-detail-modal') closeClientDetail();
    });

    const connectionModal = document.getElementById('connection-details-modal');
    if (connectionModal) {
        connectionModal.addEventListener('click', (e) => {
            if (e.target.id === 'connection-details-modal') closeConnectionDetailsModal();
        });
    }

    const transferModal = document.getElementById('transfer-details-modal');
    if (transferModal) {
        transferModal.addEventListener('click', (e) => {
            if (e.target.id === 'transfer-details-modal') closeTransferDetailsModal();
        });
    }

    document.getElementById('m-select-client').addEventListener('change', handleModifyClientChange);

    initCustomSelect();

    const loginEmail = document.getElementById('login-admin-email');
    const loginPassword = document.getElementById('login-admin-password');
    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';

    const registerForm = document.getElementById('admin-register-form');
    if (registerForm) registerForm.reset();

    initAuthListener();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeClientDetail();
        closeTransferDetailsModal();
        closeConnectionDetailsModal();
        const selectWrapper = document.getElementById('custom-option-select');
        if (selectWrapper) selectWrapper.classList.remove('open');
    }
});
