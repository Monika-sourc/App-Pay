// ============================================================
// APP PAY — Registre mondial des langues (ISO 639-1)
// ============================================================
// • 145 langues vivantes couvrant 6 régions du monde
// • Le panneau admin n'affiche QUE le nom français
// • Jamais de code ni de nom natif visible côté admin
// • translated = true  → traductions App Pay prêtes
//                false → fallback anglais propre (aucun texte cassé)
// • Aucune langue par défaut — l'admin DOIT choisir
// ============================================================

// Format compact : [code, nom_français, direction, région, traduit]
const RAW_LANGUAGES = [
    // ─────────────── AFRIQUE (31) ───────────────
    ['af', 'Afrikaans',            'ltr', 'africa',     true ],
    ['ak', 'Akan',                 'ltr', 'africa',     false],
    ['am', 'Amharique',            'ltr', 'africa',     true ],
    ['bm', 'Bambara',              'ltr', 'africa',     false],
    ['ee', 'Éwé',                  'ltr', 'africa',     false],
    ['ff', 'Peul',                 'ltr', 'africa',     false],
    ['ha', 'Haoussa',              'ltr', 'africa',     true ],
    ['ig', 'Igbo',                 'ltr', 'africa',     false],
    ['kg', 'Kikongo',              'ltr', 'africa',     false],
    ['ki', 'Kikuyu',               'ltr', 'africa',     false],
    ['lg', 'Ganda',                'ltr', 'africa',     false],
    ['ln', 'Lingala',              'ltr', 'africa',     false],
    ['mg', 'Malgache',             'ltr', 'africa',     false],
    ['ny', 'Chichewa',             'ltr', 'africa',     false],
    ['om', 'Oromo',                'ltr', 'africa',     false],
    ['rn', 'Kirundi',              'ltr', 'africa',     false],
    ['rw', 'Kinyarwanda',          'ltr', 'africa',     false],
    ['sg', 'Sango',                'ltr', 'africa',     false],
    ['sn', 'Shona',                'ltr', 'africa',     false],
    ['so', 'Somali',               'ltr', 'africa',     false],
    ['ss', 'Swati',                'ltr', 'africa',     false],
    ['st', 'Sotho du Sud',         'ltr', 'africa',     false],
    ['sw', 'Swahili',              'ltr', 'africa',     true ],
    ['ti', 'Tigrinya',             'ltr', 'africa',     false],
    ['tn', 'Tswana',               'ltr', 'africa',     false],
    ['ts', 'Tsonga',               'ltr', 'africa',     false],
    ['tw', 'Twi',                  'ltr', 'africa',     false],
    ['wo', 'Wolof',                'ltr', 'africa',     false],
    ['xh', 'Xhosa',                'ltr', 'africa',     false],
    ['yo', 'Yoruba',               'ltr', 'africa',     false],
    ['zu', 'Zoulou',               'ltr', 'africa',     false],

    // ─────────────── EUROPE (54) ───────────────
    ['ab', 'Abkhaze',              'ltr', 'europe',     false],
    ['az', 'Azéri',                'ltr', 'europe',     false],
    ['be', 'Biélorusse',           'ltr', 'europe',     false],
    ['bg', 'Bulgare',              'ltr', 'europe',     true ],
    ['br', 'Breton',               'ltr', 'europe',     false],
    ['bs', 'Bosniaque',            'ltr', 'europe',     false],
    ['ca', 'Catalan',              'ltr', 'europe',     false],
    ['co', 'Corse',                'ltr', 'europe',     false],
    ['cs', 'Tchèque',              'ltr', 'europe',     true ],
    ['cv', 'Tchouvache',           'ltr', 'europe',     false],
    ['cy', 'Gallois',              'ltr', 'europe',     false],
    ['da', 'Danois',               'ltr', 'europe',     true ],
    ['de', 'Allemand',             'ltr', 'europe',     true ],
    ['el', 'Grec',                 'ltr', 'europe',     true ],
    ['en', 'Anglais',              'ltr', 'europe',     true ],
    ['eo', 'Espéranto',            'ltr', 'europe',     false],
    ['es', 'Espagnol',             'ltr', 'europe',     true ],
    ['et', 'Estonien',             'ltr', 'europe',     false],
    ['eu', 'Basque',               'ltr', 'europe',     false],
    ['fi', 'Finnois',              'ltr', 'europe',     true ],
    ['fo', 'Féroïen',              'ltr', 'europe',     false],
    ['fr', 'Français',             'ltr', 'europe',     true ],
    ['fy', 'Frison occidental',    'ltr', 'europe',     false],
    ['ga', 'Irlandais',            'ltr', 'europe',     false],
    ['gd', 'Gaélique écossais',    'ltr', 'europe',     false],
    ['gl', 'Galicien',             'ltr', 'europe',     false],
    ['hr', 'Croate',               'ltr', 'europe',     true ],
    ['hu', 'Hongrois',             'ltr', 'europe',     true ],
    ['hy', 'Arménien',             'ltr', 'europe',     false],
    ['is', 'Islandais',            'ltr', 'europe',     false],
    ['it', 'Italien',              'ltr', 'europe',     true ],
    ['ka', 'Géorgien',             'ltr', 'europe',     false],
    ['kw', 'Cornique',             'ltr', 'europe',     false],
    ['lb', 'Luxembourgeois',       'ltr', 'europe',     false],
    ['lt', 'Lituanien',            'ltr', 'europe',     false],
    ['lv', 'Letton',               'ltr', 'europe',     false],
    ['mk', 'Macédonien',           'ltr', 'europe',     false],
    ['mt', 'Maltais',              'ltr', 'europe',     false],
    ['nl', 'Néerlandais',          'ltr', 'europe',     true ],
    ['nn', 'Norvégien (Nynorsk)',  'ltr', 'europe',     false],
    ['no', 'Norvégien',            'ltr', 'europe',     true ],
    ['oc', 'Occitan',              'ltr', 'europe',     false],
    ['os', 'Ossète',               'ltr', 'europe',     false],
    ['pl', 'Polonais',             'ltr', 'europe',     true ],
    ['pt', 'Portugais',            'ltr', 'europe',     true ],
    ['rm', 'Romanche',             'ltr', 'europe',     false],
    ['ro', 'Roumain',              'ltr', 'europe',     true ],
    ['ru', 'Russe',                'ltr', 'europe',     true ],
    ['se', 'Sami du Nord',         'ltr', 'europe',     false],
    ['sk', 'Slovaque',             'ltr', 'europe',     true ],
    ['sl', 'Slovène',              'ltr', 'europe',     false],
    ['sq', 'Albanais',             'ltr', 'europe',     false],
    ['sr', 'Serbe',                'ltr', 'europe',     true ],
    ['sv', 'Suédois',              'ltr', 'europe',     true ],
    ['uk', 'Ukrainien',            'ltr', 'europe',     true ],

    // ─────────────── MOYEN-ORIENT (10) ───────────────
    ['ar', 'Arabe',                'rtl', 'middleeast', true ],
    ['fa', 'Persan',               'rtl', 'middleeast', true ],
    ['he', 'Hébreu',               'rtl', 'middleeast', true ],
    ['ku', 'Kurde',                'ltr', 'middleeast', false],
    ['ps', 'Pachto',               'rtl', 'middleeast', false],
    ['sd', 'Sindhi',               'rtl', 'middleeast', false],
    ['tr', 'Turc',                 'ltr', 'middleeast', true ],
    ['ug', 'Ouïghour',             'rtl', 'middleeast', false],
    ['ur', 'Ourdou',               'rtl', 'middleeast', true ],
    ['yi', 'Yiddish',              'rtl', 'middleeast', false],

    // ─────────────── ASIE (38) ───────────────
    ['as', 'Assamais',             'ltr', 'asia',       false],
    ['av', 'Avar',                 'ltr', 'asia',       false],
    ['ba', 'Bachkir',              'ltr', 'asia',       false],
    ['bn', 'Bengali',              'ltr', 'asia',       true ],
    ['bo', 'Tibétain',             'ltr', 'asia',       false],
    ['ce', 'Tchétchène',           'ltr', 'asia',       false],
    ['dv', 'Maldivien',            'rtl', 'asia',       false],
    ['dz', 'Dzongkha',             'ltr', 'asia',       false],
    ['gu', 'Gujarati',             'ltr', 'asia',       false],
    ['hi', 'Hindi',                'ltr', 'asia',       true ],
    ['id', 'Indonésien',           'ltr', 'asia',       true ],
    ['ja', 'Japonais',             'ltr', 'asia',       true ],
    ['jv', 'Javanais',             'ltr', 'asia',       false],
    ['kk', 'Kazakh',               'ltr', 'asia',       false],
    ['km', 'Khmer',                'ltr', 'asia',       false],
    ['kn', 'Kannada',              'ltr', 'asia',       false],
    ['ko', 'Coréen',               'ltr', 'asia',       true ],
    ['ks', 'Cachemiri',            'rtl', 'asia',       false],
    ['ky', 'Kirghize',             'ltr', 'asia',       false],
    ['lo', 'Lao',                  'ltr', 'asia',       false],
    ['ml', 'Malayalam',            'ltr', 'asia',       false],
    ['mn', 'Mongol',               'ltr', 'asia',       false],
    ['mr', 'Marathi',              'ltr', 'asia',       false],
    ['ms', 'Malais',               'ltr', 'asia',       true ],
    ['my', 'Birman',               'ltr', 'asia',       false],
    ['ne', 'Népalais',             'ltr', 'asia',       false],
    ['or', 'Odia',                 'ltr', 'asia',       false],
    ['pa', 'Pendjabi',             'ltr', 'asia',       false],
    ['si', 'Cingalais',            'ltr', 'asia',       false],
    ['ta', 'Tamoul',               'ltr', 'asia',       false],
    ['te', 'Télougou',             'ltr', 'asia',       false],
    ['tg', 'Tadjik',               'ltr', 'asia',       false],
    ['th', 'Thaï',                 'ltr', 'asia',       true ],
    ['tk', 'Turkmène',             'ltr', 'asia',       false],
    ['tl', 'Tagalog',              'ltr', 'asia',       false],
    ['uz', 'Ouzbek',               'ltr', 'asia',       false],
    ['vi', 'Vietnamien',           'ltr', 'asia',       true ],
    ['zh', 'Chinois',              'ltr', 'asia',       true ],

    // ─────────────── AMÉRIQUES (5) ───────────────
    ['ay', 'Aymara',               'ltr', 'americas',   false],
    ['gn', 'Guarani',              'ltr', 'americas',   false],
    ['ht', 'Créole haïtien',       'ltr', 'americas',   false],
    ['kl', 'Groenlandais',         'ltr', 'americas',   false],
    ['qu', 'Quechua',              'ltr', 'americas',   false],

    // ─────────────── OCÉANIE (7) ───────────────
    ['bi', 'Bichelamar',           'ltr', 'oceania',    false],
    ['fj', 'Fidjien',              'ltr', 'oceania',    false],
    ['mh', 'Marshallais',          'ltr', 'oceania',    false],
    ['mi', 'Maori',                'ltr', 'oceania',    false],
    ['sm', 'Samoan',               'ltr', 'oceania',    false],
    ['to', 'Tongien',              'ltr', 'oceania',    false],
    ['ty', 'Tahitien',             'ltr', 'oceania',    false]
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
 * ► Symbole ⏳ sur les langues en préparation.
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
            const suffix = l.translated ? '' : ' ⏳';
            html += `<option value="${l.code}"${sel}>${l.fr}${suffix}</option>`;
        });
        html += `</optgroup>`;
    });

    return html;
}

/** Liste des codes dont les traductions sont prêtes (40 langues). */
export function getTranslatedCodes() {
    return LANGUAGES.filter(l => l.translated).map(l => l.code);
}

/** Compte total de langues supportées. */
export function getTotalLanguagesCount() {
    return LANGUAGES.length;
}
