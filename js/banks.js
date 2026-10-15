// ============================================================
// APP PAY - Liste des banques par pays (5 par pays)
// Format : { name: "Nom de la banque", domain: "domaine.com" }
// Le logo est récupéré automatiquement via logo.clearbit.com
// ============================================================

export const BANKS_BY_COUNTRY = {
    // ============ AFRIQUE DE L'OUEST ============
    "Bénin": [
        { name: "Bank of Africa Bénin", domain: "boabenin.com" },
        { name: "Ecobank Bénin", domain: "ecobank.com" },
        { name: "UBA Bénin", domain: "ubagroup.com" },
        { name: "Orabank Bénin", domain: "orabank.net" },
        { name: "NSIA Banque", domain: "nsiabanque.com" }
    ],
    "Côte d'Ivoire": [
        { name: "Société Générale CI", domain: "societegenerale.ci" },
        { name: "NSIA Banque", domain: "nsiabanque.com" },
        { name: "BICICI", domain: "bicici.ci" },
        { name: "Orabank CI", domain: "orabank.net" },
        { name: "Coris Bank CI", domain: "corisbank.ci" }
    ],
    "Sénégal": [
        { name: "SGBS", domain: "societegenerale.sn" },
        { name: "CBAO", domain: "cbao.sn" },
        { name: "Ecobank Sénégal", domain: "ecobank.com" },
        { name: "BICIS", domain: "bicis.sn" },
        { name: "Banque Atlantique", domain: "banqueatlantique.net" }
    ],
    "Togo": [
        { name: "Ecobank Togo", domain: "ecobank.com" },
        { name: "Orabank Togo", domain: "orabank.net" },
        { name: "UTB", domain: "utb.tg" },
        { name: "BSIC Togo", domain: "bsic.tg" },
        { name: "BTCI", domain: "btci.tg" }
    ],
    "Burkina Faso": [
        { name: "Coris Bank", domain: "corisbank.bf" },
        { name: "Orabank BF", domain: "orabank.net" },
        { name: "Bank of Africa BF", domain: "boaburkina.bf" },
        { name: "UBA Burkina", domain: "ubagroup.com" },
        { name: "Ecobank Burkina", domain: "ecobank.com" }
    ],
    "Mali": [
        { name: "BDM-SA", domain: "bdm-sa.com.ml" },
        { name: "BNDA", domain: "bnda.ml" },
        { name: "BMS-SA", domain: "bms-sa.ml" },
        { name: "Bank of Africa Mali", domain: "boamali.ml" },
        { name: "Ecobank Mali", domain: "ecobank.com" }
    ],
    "Niger": [
        { name: "BOA Niger", domain: "boaniger.com" },
        { name: "Sonibank", domain: "sonibank.com" },
        { name: "BIA-Niger", domain: "bianiger.com" },
        { name: "Ecobank Niger", domain: "ecobank.com" },
        { name: "BSIC Niger", domain: "bsic-niger.com" }
    ],
    "Nigéria": [
        { name: "Access Bank", domain: "accessbankplc.com" },
        { name: "GTBank", domain: "gtbank.com" },
        { name: "First Bank", domain: "firstbanknigeria.com" },
        { name: "UBA Nigeria", domain: "ubagroup.com" },
        { name: "Zenith Bank", domain: "zenithbank.com" }
    ],
    "Ghana": [
        { name: "GCB Bank", domain: "gcbbank.com.gh" },
        { name: "Ecobank Ghana", domain: "ecobank.com" },
        { name: "Stanbic Bank Ghana", domain: "stanbicbank.com.gh" },
        { name: "Fidelity Bank Ghana", domain: "fidelitybank.com.gh" },
        { name: "Absa Ghana", domain: "absa.com.gh" }
    ],

    // ============ AFRIQUE CENTRALE ============
    "Cameroun": [
        { name: "Afriland First Bank", domain: "afrilandfirstbank.com" },
        { name: "SGC", domain: "societegenerale.cm" },
        { name: "BICEC", domain: "bicec.com" },
        { name: "Ecobank Cameroun", domain: "ecobank.com" },
        { name: "UBA Cameroun", domain: "ubagroup.com" }
    ],
    "Gabon": [
        { name: "BGFIBank", domain: "bgfibank.com" },
        { name: "UGB", domain: "ugb.ga" },
        { name: "BICIG", domain: "bicig.com" },
        { name: "Ecobank Gabon", domain: "ecobank.com" },
        { name: "Orabank Gabon", domain: "orabank.net" }
    ],
    "Congo": [
        { name: "BGFIBank Congo", domain: "bgfibank.com" },
        { name: "LCBC", domain: "lcbc.cg" },
        { name: "Ecobank Congo", domain: "ecobank.com" },
        { name: "UBA Congo", domain: "ubagroup.com" },
        { name: "BCI Congo", domain: "bci.cg" }
    ],
    "République Démocratique du Congo": [
        { name: "Rawbank", domain: "rawbank.com" },
        { name: "Equity BCDC", domain: "equitybcdc.cd" },
        { name: "TMB", domain: "trustmerchantbank.com" },
        { name: "FBNBank RDC", domain: "fbnbank.cd" },
        { name: "Ecobank RDC", domain: "ecobank.com" }
    ],

    // ============ AFRIQUE DU NORD ============
    "Maroc": [
        { name: "Attijariwafa Bank", domain: "attijariwafabank.com" },
        { name: "BMCE Bank", domain: "bmcebank.ma" },
        { name: "Banque Populaire", domain: "bp.ma" },
        { name: "CIH Bank", domain: "cihbank.ma" },
        { name: "Société Générale Maroc", domain: "sgmaroc.com" }
    ],
    "Algérie": [
        { name: "BNA Algérie", domain: "bna.dz" },
        { name: "BEA", domain: "bea.dz" },
        { name: "CPA", domain: "cpa-bank.dz" },
        { name: "BADR", domain: "badrbanque.dz" },
        { name: "Société Générale Algérie", domain: "societegenerale.dz" }
    ],
    "Tunisie": [
        { name: "STB", domain: "stb.com.tn" },
        { name: "BNA Tunisie", domain: "bna.tn" },
        { name: "BIAT", domain: "biat.com.tn" },
        { name: "Amen Bank", domain: "amenbank.com.tn" },
        { name: "UIB", domain: "uib.com.tn" }
    ],
    "Égypte": [
        { name: "National Bank of Egypt", domain: "nbe.com.eg" },
        { name: "Banque Misr", domain: "banquemisr.com" },
        { name: "CIB Egypt", domain: "cibeg.com" },
        { name: "QNB Alahli", domain: "qnbalahli.com" },
        { name: "HSBC Egypt", domain: "hsbc.com.eg" }
    ],

    // ============ AFRIQUE DE L'EST ============
    "Kenya": [
        { name: "KCB Bank", domain: "kcbgroup.com" },
        { name: "Equity Bank", domain: "equitygroupholdings.com" },
        { name: "Co-operative Bank", domain: "co-opbank.co.ke" },
        { name: "Absa Kenya", domain: "absa.co.ke" },
        { name: "Standard Chartered Kenya", domain: "sc.com" }
    ],
    "Tanzanie": [
        { name: "CRDB Bank", domain: "crdbbank.co.tz" },
        { name: "NMB Bank", domain: "nmbbank.co.tz" },
        { name: "NBC", domain: "nbctanzania.com" },
        { name: "Stanbic Tanzania", domain: "stanbicbank.co.tz" },
        { name: "Exim Bank Tanzania", domain: "eximbank.co.tz" }
    ],
    "Ouganda": [
        { name: "Stanbic Uganda", domain: "stanbicbank.co.ug" },
        { name: "Centenary Bank", domain: "centenarybank.co.ug" },
        { name: "DFCU Bank", domain: "dfcugroup.com" },
        { name: "Absa Uganda", domain: "absa.co.ug" },
        { name: "Bank of Baroda Uganda", domain: "bankofbaroda.co.ug" }
    ],
    "Rwanda": [
        { name: "Bank of Kigali", domain: "bk.rw" },
        { name: "I&M Bank Rwanda", domain: "imbankgroup.com" },
        { name: "Equity Bank Rwanda", domain: "equitygroupholdings.com" },
        { name: "BPR Bank", domain: "bpr.rw" },
        { name: "Cogebanque", domain: "cogebanque.co.rw" }
    ],
    "Éthiopie": [
        { name: "Commercial Bank of Ethiopia", domain: "combanketh.et" },
        { name: "Awash Bank", domain: "awashbank.com" },
        { name: "Dashen Bank", domain: "dashenbanksc.com" },
        { name: "Bank of Abyssinia", domain: "bankofabyssinia.com" },
        { name: "Wegagen Bank", domain: "wegagen.com" }
    ],

    // ============ AFRIQUE AUSTRALE ============
    "Afrique du Sud": [
        { name: "Standard Bank", domain: "standardbank.com" },
        { name: "ABSA", domain: "absa.co.za" },
        { name: "FNB", domain: "fnb.co.za" },
        { name: "Nedbank", domain: "nedbank.co.za" },
        { name: "Capitec", domain: "capitecbank.co.za" }
    ],
    "Zambie": [
        { name: "Zambia National Commercial Bank", domain: "zanaco.co.zm" },
        { name: "Absa Zambia", domain: "absa.co.zm" },
        { name: "Stanbic Zambia", domain: "stanbicbank.co.zm" },
        { name: "FNB Zambia", domain: "fnb.co.zm" },
        { name: "Indo-Zambia Bank", domain: "izb.co.zm" }
    ],

    // ============ EUROPE ============
    "France": [
        { name: "BNP Paribas", domain: "bnpparibas.com" },
        { name: "Société Générale", domain: "societegenerale.com" },
        { name: "Crédit Agricole", domain: "credit-agricole.com" },
        { name: "LCL", domain: "lcl.fr" },
        { name: "La Banque Postale", domain: "labanquepostale.fr" }
    ],
    "Belgique": [
        { name: "BNP Paribas Fortis", domain: "bnpparibasfortis.be" },
        { name: "KBC", domain: "kbc.be" },
        { name: "Belfius", domain: "belfius.be" },
        { name: "ING Belgique", domain: "ing.be" },
        { name: "Argenta", domain: "argenta.be" }
    ],
    "Suisse": [
        { name: "UBS", domain: "ubs.com" },
        { name: "Credit Suisse", domain: "credit-suisse.com" },
        { name: "Raiffeisen", domain: "raiffeisen.ch" },
        { name: "PostFinance", domain: "postfinance.ch" },
        { name: "Julius Baer", domain: "juliusbaer.com" }
    ],
    "Allemagne": [
        { name: "Deutsche Bank", domain: "db.com" },
        { name: "Commerzbank", domain: "commerzbank.com" },
        { name: "DZ Bank", domain: "dzbank.de" },
        { name: "KfW", domain: "kfw.de" },
        { name: "HypoVereinsbank", domain: "hypovereinsbank.de" }
    ],
    "Pologne": [
        { name: "PKO BP", domain: "pkobp.pl" },
        { name: "Pekao", domain: "pekao.com.pl" },
        { name: "Santander Bank Polska", domain: "santander.pl" },
        { name: "mBank", domain: "mbank.pl" },
        { name: "ING Bank Śląski", domain: "ing.pl" }
    ],
    "Royaume-Uni": [
        { name: "Barclays", domain: "barclays.co.uk" },
        { name: "HSBC UK", domain: "hsbc.co.uk" },
        { name: "Lloyds Bank", domain: "lloydsbank.com" },
        { name: "NatWest", domain: "natwest.com" },
        { name: "Santander UK", domain: "santander.co.uk" }
    ],
    "Espagne": [
        { name: "Santander", domain: "santander.com" },
        { name: "BBVA", domain: "bbva.com" },
        { name: "CaixaBank", domain: "caixabank.com" },
        { name: "Banco Sabadell", domain: "bancsabadell.com" },
        { name: "Bankinter", domain: "bankinter.com" }
    ],
    "Italie": [
        { name: "Intesa Sanpaolo", domain: "intesasanpaolo.com" },
        { name: "UniCredit", domain: "unicredit.it" },
        { name: "Banco BPM", domain: "bancobpm.it" },
        { name: "BPER Banca", domain: "bper.it" },
        { name: "Monte dei Paschi di Siena", domain: "mps.it" }
    ],
    "Portugal": [
        { name: "Caixa Geral de Depósitos", domain: "cgd.pt" },
        { name: "Millennium BCP", domain: "millenniumbcp.pt" },
        { name: "Novo Banco", domain: "novobanco.pt" },
        { name: "BPI", domain: "bancobpi.pt" },
        { name: "Santander Totta", domain: "santandertotta.pt" }
    ],
    "Pays-Bas": [
        { name: "ING", domain: "ing.nl" },
        { name: "Rabobank", domain: "rabobank.nl" },
        { name: "ABN AMRO", domain: "abnamro.nl" },
        { name: "SNS Bank", domain: "snsbank.nl" },
        { name: "Triodos Bank", domain: "triodos.com" }
    ],

    // ============ AMÉRIQUE DU NORD ============
    "États-Unis": [
        { name: "JPMorgan Chase", domain: "jpmorganchase.com" },
        { name: "Bank of America", domain: "bankofamerica.com" },
        { name: "Wells Fargo", domain: "wellsfargo.com" },
        { name: "Citibank", domain: "citibank.com" },
        { name: "Goldman Sachs", domain: "goldmansachs.com" }
    ],
    "Canada": [
        { name: "RBC Royal Bank", domain: "rbcroyalbank.com" },
        { name: "TD Bank", domain: "td.com" },
        { name: "Scotiabank", domain: "scotiabank.com" },
        { name: "BMO", domain: "bmo.com" },
        { name: "CIBC", domain: "cibc.com" }
    ],

    // ============ ASIE ============
    "Chine": [
        { name: "ICBC", domain: "icbc.com.cn" },
        { name: "China Construction Bank", domain: "ccb.com" },
        { name: "Agricultural Bank of China", domain: "abchina.com" },
        { name: "Bank of China", domain: "boc.cn" },
        { name: "Bank of Communications", domain: "bankcomm.com" }
    ],
    "Japon": [
        { name: "MUFG", domain: "mufg.jp" },
        { name: "SMFG", domain: "smfg.co.jp" },
        { name: "Mizuho", domain: "mizuhobank.co.jp" },
        { name: "Resona Bank", domain: "resonabank.co.jp" },
        { name: "Japan Post Bank", domain: "jp-bank.japanpost.jp" }
    ],
    "Inde": [
        { name: "State Bank of India", domain: "sbi.co.in" },
        { name: "HDFC Bank", domain: "hdfcbank.com" },
        { name: "ICICI Bank", domain: "icicibank.com" },
        { name: "Axis Bank", domain: "axisbank.com" },
        { name: "Kotak Mahindra Bank", domain: "kotak.com" }
    ],
    "Émirats Arabes Unis": [
        { name: "Emirates NBD", domain: "emiratesnbd.com" },
        { name: "First Abu Dhabi Bank", domain: "bankfab.com" },
        { name: "ADCB", domain: "adcb.com" },
        { name: "Mashreq Bank", domain: "mashreqbank.com" },
        { name: "Dubai Islamic Bank", domain: "dib.ae" }
    ],

    // ============ AUTRES / GÉNÉRIQUE ============
    "Autre": [
        { name: "Bank of Africa", domain: "bank-of-africa.com" },
        { name: "Ecobank", domain: "ecobank.com" },
        { name: "UBA", domain: "ubagroup.com" },
        { name: "Orabank", domain: "orabank.net" },
        { name: "Société Générale", domain: "societegenerale.com" }
    ]
};

// ✅ Fonction utilitaire : récupérer l'URL du logo
export function getBankLogoUrl(domain) {
    if (!domain) return '';
    return `https://logo.clearbit.com/${domain}`;
}

// ✅ Fonction utilitaire : obtenir la liste complète des banques à plat
export function getAllBanks() {
    const all = [];
    Object.entries(BANKS_BY_COUNTRY).forEach(([country, banks]) => {
        banks.forEach(bank => {
            all.push({ ...bank, country });
        });
    });
    return all;
}
