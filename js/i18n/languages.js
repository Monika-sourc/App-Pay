// ============================================================
// APP PAY — Registre mondial des langues (ISO 639-1)
// ============================================================
// • 145 langues vivantes couvrant 6 régions du monde
// • Le panneau admin n'affiche QUE le nom français
// • Jamais de code ni de nom natif visible côté admin
// • Toutes les traductions sont maintenant prêtes (translated = true)
// ============================================================

// Format compact : [code, nom_français, direction, région, traduit]
const RAW_LANGUAGES = [
    // ─────────────── AFRIQUE (31) ───────────────
    ['af', 'Afrikaans',            'ltr', 'africa',     true ],
    ['ak', 'Akan',                 'ltr', 'africa',     true ],
    ['am', 'Amharique',            'ltr', 'africa',     true ],
    ['bm', 'Bambara',              'ltr', 'africa',     true ],
    ['ee', 'Éwé',                  'ltr', 'africa',     true ],
    ['ff', 'Peul',                 'ltr', 'africa',     true ],
    ['ha', 'Haoussa',              'ltr', 'africa',     true ],
    ['ig', 'Igbo',                 'ltr', 'africa',     true ],
    ['kg', 'Kikongo',              'ltr', 'africa',     true ],
    ['ki', 'Kikuyu',               'ltr', 'africa',     true ],
    ['lg', 'Ganda',                'ltr', 'africa',     true ],
    ['ln', 'Lingala',              'ltr', 'africa',     true ],
    ['mg', 'Malgache',             'ltr', 'africa',     true ],
    ['ny', 'Chichewa',             'ltr', 'africa',     true ],
    ['om', 'Oromo',                'ltr', 'africa',     true ],
    ['rn', 'Kirundi',              'ltr', 'africa',     true ],
    ['rw', 'Kinyarwanda',          'ltr', 'africa',     true ],
    ['sg', 'Sango',                'ltr', 'africa',     true ],
    ['sn', 'Shona',                'ltr', 'africa',     true ],
    ['so', 'Somali',               'ltr', 'africa',     true ],
    ['ss', 'Swati',                'ltr', 'africa',     true ],
    ['st', 'Sotho du Sud',         'ltr', 'africa',     true ],
    ['sw', 'Swahili',              'ltr', 'africa',     true ],
    ['ti', 'Tigrinya',             'ltr', 'africa',     true ],
    ['tn', 'Tswana',               'ltr', 'africa',     true ],
    ['ts', 'Tsonga',               'ltr', 'africa',     true ],
    ['tw', 'Twi',                  'ltr', 'africa',     true ],
    ['wo', 'Wolof',                'ltr', 'africa',     true ],
    ['xh', 'Xhosa',                'ltr', 'africa',     true ],
    ['yo', 'Yoruba',               'ltr', 'africa',     true ],
    ['zu', 'Zoulou',               'ltr', 'africa',     true ],

    // ─────────────── EUROPE (54) ───────────────
    ['ab', 'Abkhaze',              'ltr', 'europe',     true ],
    ['az', 'Azéri',                'ltr', 'europe',     true ],
    ['be', 'Biélorusse',           'ltr', 'europe',     true ],
    ['bg', 'Bulgare',              'ltr', 'europe',     true ],
    ['br', 'Breton',               'ltr', 'europe',     true ],
    ['bs', 'Bosniaque',            'ltr', 'europe',     true ],
    ['ca', 'Catalan',              'ltr', 'europe',     true ],
    ['co', 'Corse',                'ltr', 'europe',     true ],
    ['cs', 'Tchèque',              'ltr', 'europe',     true ],
    ['cv', 'Tchouvache',           'ltr', 'europe',     true ],
    ['cy', 'Gallois',              'ltr', 'europe',     true ],
    ['da', 'Danois',               'ltr', 'europe',     true ],
    ['de', 'Allemand',             'ltr', 'europe',     true ],
    ['el', 'Grec',                 'ltr', 'europe',     true ],
    ['en', 'Anglais',              'ltr', 'europe',     true ],
    ['eo', 'Espéranto',            'ltr', 'europe',     true ],
    ['es', 'Espagnol',             'ltr', 'europe',     true ],
    ['et', 'Estonien',             'ltr', 'europe',     true ],
    ['eu', 'Basque',               'ltr', 'europe',     true ],
    ['fi', 'Finnois',              'ltr', 'europe',     true ],
    ['fo', 'Féroïen',              'ltr', 'europe',     true ],
    ['fr', 'Français',             'ltr', 'europe',     true ],
    ['fy', 'Frison occidental',    'ltr', 'europe',     true ],
    ['ga', 'Irlandais',            'ltr', 'europe',     true ],
    ['gd', 'Gaélique écossais',    'ltr', 'europe',     true ],
    ['gl', 'Galicien',             'ltr', 'europe',     true ],
    ['hr', 'Croate',               'ltr', 'europe',     true ],
    ['hu', 'Hongrois',             'ltr', 'europe',     true ],
    ['hy', 'Arménien',             'ltr', 'europe',     true ],
    ['is', 'Islandais',            'ltr', 'europe',     true ],
    ['it', 'Italien',              'ltr', 'europe',     true ],
    ['ka', 'Géorgien',             'ltr', 'europe',     true ],
    ['kw', 'Cornique',             'ltr', 'europe',     true ],
    ['lb', 'Luxembourgeois',       'ltr', 'europe',     true ],
    ['lt', 'Lituanien',            'ltr', 'europe',     true ],
    ['lv', 'Letton',               'ltr', 'europe',     true ],
    ['mk', 'Macédonien',           'ltr', 'europe',     true ],
    ['mt', 'Maltais',              'ltr', 'europe',     true ],
    ['nl', 'Néerlandais',          'ltr', 'europe',     true ],
    ['nn', 'Norvégien (Nynorsk)',  'ltr', 'europe',     true ],
    ['no', 'Norvégien',            'ltr', 'europe',     true ],
    ['oc', 'Occitan',              'ltr', 'europe',     true ],
    ['os', 'Ossète',               'ltr', 'europe',     true ],
    ['pl', 'Polonais',             'ltr', 'europe',     true ],
    ['pt', 'Portugais',            'ltr', 'europe',     true ],
    ['rm', 'Romanche',             'ltr', 'europe',     true ],
    ['ro', 'Roumain',              'ltr', 'europe',     true ],
    ['ru', 'Russe',                'ltr', 'europe',     true ],
    ['se', 'Sami du Nord',         'ltr', 'europe',     true ],
    ['sk', 'Slovaque',             'ltr', 'europe',     true ],
    ['sl', 'Slovène',              'ltr', 'europe',     true ],
    ['sq', 'Albanais',             'ltr', 'europe',     true ],
    ['sr', 'Serbe',                'ltr', 'europe',     true ],
    ['sv', 'Suédois',              'ltr', 'europe',     true ],
    ['uk', 'Ukrainien',            'ltr', 'europe',     true ],

    // ─────────────── MOYEN-ORIENT (10) ───────────────
    ['ar', 'Arabe',                'rtl', 'middleeast', true ],
    ['fa', 'Persan',               'rtl', 'middleeast', true ],
    ['he', 'Hébreu',               'rtl', 'middleeast', true ],
    ['ku', 'Kurde',                'ltr', 'middleeast', true ],
    ['ps', 'Pachto',               'rtl', 'middleeast', true ],
    ['sd', 'Sindhi',               'rtl', 'middleeast', true ],
    ['tr', 'Turc',                 'ltr', 'middleeast', true ],
    ['ug', 'Ouïghour',             'rtl', 'middleeast', true ],
    ['ur', 'Ourdou',               'rtl', 'middleeast', true ],
    ['yi', 'Yiddish',              'rtl', 'middleeast', true ],

    // ─────────────── ASIE (38) ───────────────
    ['as', 'Assamais',             'ltr', 'asia',       true ],
    ['av', 'Avar',                 'ltr', 'asia',       true ],
    ['ba', 'Bachkir',              'ltr', 'asia',       true ],
    ['bn', 'Bengali',              'ltr', 'asia',       true ],
    ['bo', 'Tibétain',             'ltr', 'asia',       true ],
    ['ce', 'Tchétchène',           'ltr', 'asia',       true ],
    ['dv', 'Maldivien',            'rtl', 'asia',       true ],
    ['dz', 'Dzongkha',             'ltr', 'asia',       true ],
    ['gu', 'Gujarati',             'ltr', 'asia',       true ],
    ['hi', 'Hindi',                'ltr', 'asia',       true ],
    ['id', 'Indonésien',           'ltr', 'asia',       true ],
    ['ja', 'Japonais',             'ltr', 'asia',       true ],
    ['jv', 'Javanais',             'ltr', 'asia',       true ],
    ['kk', 'Kazakh',               'ltr', 'asia',       true ],
    ['km', 'Khmer',                'ltr', 'asia',       true ],
    ['kn', 'Kannada',              'ltr', 'asia',       true ],
    ['ko', 'Coréen',               'ltr', 'asia',       true ],
    ['ks', 'Cachemiri',            'rtl', 'asia',       true ],
    ['ky', 'Kirghize',             'ltr', 'asia',       true ],
    ['lo', 'Lao',                  'ltr', 'asia',       true ],
    ['ml', 'Malayalam',            'ltr', 'asia',       true ],
    ['mn', 'Mongol',               'ltr', 'asia',       true ],
    ['mr', 'Marathi',              'ltr', 'asia',       true ],
    ['ms', 'Malais',               'ltr', 'asia',       true ],
    ['my', 'Birman',               'ltr', 'asia',       true ],
    ['ne', 'Népalais',             'ltr', 'asia',       true ],
    ['or', 'Odia',                 'ltr', 'asia',       true ],
    ['pa', 'Pendjabi',             'ltr', 'asia',       true ],
    ['si', 'Cingalais',            'ltr', 'asia',       true ],
    ['ta', 'Tamoul',               'ltr', 'asia',       true ],
    ['te', 'Télougou',             'ltr', 'asia',       true ],
    ['tg', 'Tadjik',               'ltr', 'asia',       true ],
    ['th', 'Thaï',                 'ltr', 'asia',       true ],
    ['tk', 'Turkmène',             'ltr', 'asia',       true ],
    ['tl', 'Tagalog',              'ltr', 'asia',       true ],
    ['uz', 'Ouzbek',               'ltr', 'asia',       true ],
    ['vi', 'Vietnamien',           'ltr', 'asia',       true ],
    ['zh', 'Chinois',              'ltr', 'asia',       true ],

    // ─────────────── AMÉRIQUES (5) ───────────────
    ['ay', 'Aymara',               'ltr', 'americas',   true ],
    ['gn', 'Guarani',              'ltr', 'americas',   true ],
    ['ht', 'Créole haïtien',       'ltr', 'americas',   true ],
    ['kl', 'Groenlandais',         'ltr', 'americas',   true ],
    ['qu', 'Quechua',              'ltr', 'americas',   true ],

    // ─────────────── OCÉANIE (7) ───────────────
    ['bi', 'Bichelamar',           'ltr', 'oceania',    true ],
    ['fj', 'Fidjien',              'ltr', 'oceania',    true ],
    ['mh', 'Marshallais',          'ltr', 'oceania',    true ],
    ['mi', 'Maori',                'ltr', 'oceania',    true ],
    ['sm', 'Samoan',               'ltr', 'oceania',    true ],
    ['to', 'Tongien',              'ltr', 'oceania',    true ],
    ['ty', 'Tahitien',             'ltr', 'oceania',    true ]
];

// ============================================================
// Registre public — 145 langues, une ligne par langue
// ============================================================
export const LANGUAGES = RAW_LANGUAGES.map(([code, fr, dir, region, translated]) => ({
    code, fr, dir, region, translated
}));

// ============================================================
// Labels de régions (uniquement pour regrouper le select admin)
// ============================================================
export const REGION_LABELS = {
    africa:     '🌍 Afrique',
    europe:     '🇪🇺 Europe',
    middleeast: '🕌 Moyen-Orient',
    asia:       '🌏 Asie',
    americas:   '🌎 Amériques',
    oceania:    '🌊 Océanie'
};

// ============================================================
// HELPERS
// ============================================================

/** Retourne l'objet langue par code, ou null. */
export function getLanguageByCode(code) {
    if (!code) return null;
    return LANGUAGES.find(l => l.code === code) || null;
}

/** Retourne true si la langue s'écrit de droite à gauche (arabe, hébreu…). */
export function isRTL(code) {
    const lang = getLanguageByCode(code);
    return lang ? lang.dir === 'rtl' : false;
}

/** Retourne le nom français d'une langue (ex. 'fr' → 'Français'). */
export function getFrenchName(code) {
    const lang = getLanguageByCode(code);
    return lang ? lang.fr : code;
}

/** Retourne true si les traductions App Pay sont prêtes. */
export function isTranslated(code) {
    const lang = getLanguageByCode(code);
    return lang ? lang.translated === true : false;
}

/**
 * Construit le HTML des <optgroup>+<option> pour le select admin.
 * ► Affiche UNIQUEMENT le nom français.
 * ► AUCUNE option par défaut : l'admin doit choisir explicitement.
 * @param {string} selectedCode  Code à pré-sélectionner ('' = aucun)
 */
export function buildLanguageOptionsHTML(selectedCode = '') {
    const REGION_ORDER = ['africa', 'europe', 'middleeast', 'asia', 'americas', 'oceania'];
    let html = '';

    REGION_ORDER.forEach(region => {
        const list = LANGUAGES
            .filter(l => l.region === region)
            .sort((a, b) => a.fr.localeCompare(b.fr, 'fr'));
        if (list.length === 0) return;

        html += `<optgroup label="${REGION_LABELS[region]}">`;
        list.forEach(l => {
            const sel = (l.code === selectedCode) ? ' selected' : '';
            // 🆕 Puisque translated est true pour toutes les langues, 
            // le symbole ⏳ n'apparaîtra plus jamais.
            html += `<option value="${l.code}"${sel}>${l.fr}</option>`;
        });
        html += `</optgroup>`;
    });

    return html;
}

/** Liste des codes dont les traductions sont prêtes. */
export function getTranslatedCodes() {
    return LANGUAGES.filter(l => l.translated).map(l => l.code);
}

/** Compte total de langues supportées. */
export function getTotalLanguagesCount() {
    return LANGUAGES.length;
}
