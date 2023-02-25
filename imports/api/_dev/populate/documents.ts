import {faker} from '@faker-js/faker';

import {makeTemplate} from '../../../_test/fixtures';

import invoke from '../../endpoint/invoke';
import insertDocument from '../../endpoint/documents/insert';

export const newDocumentFormData = makeTemplate({
	format: () => undefined, // faker.company.bs(),
	array: () =>
		new TextEncoder().encode(`A1\\12345\\${faker.lorem.paragraph()}`),
	// source: () => faker.lorem.paragraph(),
	// parsed: () => false,
});

export const newDocument = async (invocation, extra?) => {
	const [_id] = await invoke(insertDocument, invocation, [
		newDocumentFormData(extra),
	]);
	return _id;
};

export const exampleMedidocReport = {
	count: 1,
	contents: `1/88888/77/321
Notissor                Adrien
Rue Jules                          123
1000      Bruxelles
Tel: 12 345 67 89
consultation d'urologie
196910160816
1/77777/66/210
Bachelard               Monilles
#A93031745123
DOE                     JANE
19930317
X
19691016
PZ7654321Y9
O.Ref.: Notissor 19691016 0800



#Rb
!consultation d'urologie
Contact dd: 16/10/1969 08:00 - consultation d'urologie
-----------------------------------------------------------------------



Cher, Chère,


Concerne:
Patiënt: DOE JANE
Date de naissance: 17/03/1993
Adresse:
consultation d'urologie le 16/10/1969


Rapport:


Cordiales salutations,



#R/
#A/
#/
`,
};

export const exampleHealthoneReport = {
	count: 8,
	contents: `A1\\65859278\\Marks and Sons\\
A2\\65859278\\Hammes\\Douglas\\F\\190843\\43081943647\\
A3\\65859278\\1692 Fay Inlet\\10319-2315\\Lenoremouth\\
A4\\65859278\\Stokes\\110119\\\\C\\
L5\\65859278\\ANATA\\\\\\\\\\\\
L5\\65859278\\ANATA\\\\\\\\\\\\
L5\\65859278\\ANATA\\\\\\\\\\\\
L5\\65859278\\ANATA\\\\\\\\\\RENSEIGNEMENTS CLINIQUES:\\
L5\\65859278\\ANATA\\\\\\\\\\\\
L5\\65859278\\ANATA\\\\\\\\\\JOUE DROITE: NAEVUS INTRADERMIQUE HETEROGENE\\
L5\\65859278\\ANATA\\\\\\\\\\ANTECEDENTS DE MELANOME CHEZ LA MAMAN\\
L5\\65859278\\ANATA\\\\\\\\\\MISE A PLAT\\
L5\\65859278\\ANATA\\\\\\\\\\\\
L5\\65859278\\ANATA\\\\\\\\\\EXAMEN MICROSCOPIQUE:\\
L5\\65859278\\ANATA\\\\\\\\\\\\
L5\\65859278\\ANATA\\\\\\\\\\ON OBSERVE UNE TUMEUR MELANOCYTAIRE EN DOME, LIMITEE PAR UN EPIDERME MINCE\\
L5\\65859278\\ANATA\\\\\\\\\\LE DERME EST OCCUPE PAR DES CELLULES NAEVIQUES VOLONTIERS EPITHELIOIDES\\
L5\\65859278\\ANATA\\\\\\\\\\CERTAINS NOYAUX SONT VESICULEUX\\
L5\\65859278\\ANATA\\\\\\\\\\IL N'Y A PAS D'ATYPIE\\
L5\\65859278\\ANATA\\\\\\\\\\IL N'Y A PAS DE MITOSE\\
L5\\65859278\\ANATA\\\\\\\\\\CETTE COMPOSANTE NAEVIQUE EST ASSOCIEE A UN INFILTRAT INFLAMMATOIRE MONONUCLEE NET\\
L5\\65859278\\ANATA\\\\\\\\\\ON NOTE DES MELANOCYTES LENTIGINEUX ET QUELQUES THEQUES A LA JONCTION DERMO-EPIDERMIQUE\\
L5\\65859278\\ANATA\\\\\\\\\\IL EXISTE UN GRADIENT DE L'EXPRESSION DE HMB45 DE LA PROFONDEUR VERS LA SURFACE\\
L5\\65859278\\ANATA\\\\\\\\\\LES CELLULES EXPRIMENT LA PROTEINE P16\\
L5\\65859278\\ANATA\\\\\\\\\\LE MARQUAGE POUR KI67 NE MET PAS D'ACTIVITE PROLIFERANTE EN EVIDENCE DANS LA COMPOSANTE NAEVIQUE DERMIQUE\\
L5\\65859278\\ANATA\\\\\\\\\\\\
L5\\65859278\\ANATA\\\\\\\\\\CONCLUSION:\\
L5\\65859278\\ANATA\\\\\\\\\\\\
L5\\65859278\\ANATA\\\\\\\\\\NAEVUS MIXTE DE SPITZ IRRITE\\
L5\\65859278\\ANATA\\\\\\\\\\PAS DE MALIGNITE DECELEE\\
L5\\65859278\\ANATA\\\\\\\\\\COMME IL S'AGIT D'UNE MISE A PLAT, LA MARGE PROFONDE PASSE PAR LA LESION\\
L5\\65859278\\ANATA\\\\\\\\\\UNE EXERESE COMPLETE EST INDIQUEE\\
L5\\65859278\\ANATA\\\\\\\\\\\\
L5\\65859278\\ANATA\\\\\\\\\\\\
L5\\65859278\\ANATA\\\\\\\\\\DR  DECROO          DR  BOTULE                                     XXYY\\
A1\\4848-06755\\Mann and Sons\\
A2\\4848-06755\\Doe\\Jane\\F\\151039\\39101590477\\
A3\\4848-06755\\185 Wolff Lakes\\76737-6772\\South Loganfurt\\
A4\\4848-06755\\Bednar\\070119\\\\C\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\RENSEIGNEMENTS CLINIQUES\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\N 1: ABDOMEN GAUCHE SUPERIEUR\\
L5\\4848-06755\\ANATA\\\\\\\\\\N 2: ABDOMEN GAUCHE INFERIEUR\\
L5\\4848-06755\\ANATA\\\\\\\\\\N 1 ET N 2: NAEVUS INTRADERMIQUE PIGMENTE\\
L5\\4848-06755\\ANATA\\\\\\\\\\MISES A PLAT\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\EXAMEN MICROSCOPIQUE:\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\N 1:\\
L5\\4848-06755\\ANATA\\\\\\\\\\FRAGMENT CUTANE EN DOME LIMITE PAR UN EPIDERME MINCE\\
L5\\4848-06755\\ANATA\\\\\\\\\\L'AXE CONJONCTIF RENFERME DES CELLULES NAEVIQUES GROUPEES EN THEQUES OU EN AMAS\\
L5\\4848-06755\\ANATA\\\\\\\\\\ON NOTE EGALEMENT QUELQUES THEQUES ET MELANOCYTES LENTIGINEUX A LA JONCTION DERMO-EPIDERMIQUE\\
L5\\4848-06755\\ANATA\\\\\\\\\\IL N'Y A PAS D'ATYPIE\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\N 2:\\
L5\\4848-06755\\ANATA\\\\\\\\\\L'IMAGE EST HISTOLOGIQUEMENT SIMILAIRE A LA LESION NUMERO 1\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\CONCLUSION:\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\N 1:\\
L5\\4848-06755\\ANATA\\\\\\\\\\NAEVUS MIXTE A ACTIVITE JONCTIONNELLE MODEREE\\
L5\\4848-06755\\ANATA\\\\\\\\\\PAS DE MALIGNITE DECELEE\\
L5\\4848-06755\\ANATA\\\\\\\\\\LES MARGES PARAISSENT SAINES\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\N 2:\\
L5\\4848-06755\\ANATA\\\\\\\\\\NAEVUS MIXTE A ACTIVITE JONCTIONNELLE MODEREE\\
L5\\4848-06755\\ANATA\\\\\\\\\\PAS DE MALIGNITE DECELEE\\
L5\\4848-06755\\ANATA\\\\\\\\\\COMME IL S'AGIT D'UNE MISE A PLAT, LA MARGE PROFONDE PASSE PAR LA LESION\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
L5\\4848-06755\\ANATA\\\\\\\\\\DR  DECROO          DR  ARMAND                                              XXXX\\
L5\\4848-06755\\ANATA\\\\\\\\\\\\
A1\\38922719\\Wyman, Cassin and Cartwright\\
A2\\38922719\\Berge\\Augusta\\M\\241298\\98122428527\\
A3\\38922719\\542 Eliane Avenue\\82921-6358\\South Herbert\\
A4\\38922719\\Schumm\\070119\\\\C\\
L5\\38922719\\ANATA\\\\\\\\\\\\
L5\\38922719\\ANATA\\\\\\\\\\\\
L5\\38922719\\ANATA\\\\\\\\\\\\
L5\\38922719\\ANATA\\\\\\\\\\\\
L5\\38922719\\ANATA\\\\\\\\\\RENSEIGNEMENTS CLINIQUES\\
L5\\38922719\\ANATA\\\\\\\\\\\\
L5\\38922719\\ANATA\\\\\\\\\\MENTON: NAEVUS INTRADERMIQUE QUI AUGMENTE DE VOLUME\\
L5\\38922719\\ANATA\\\\\\\\\\MISE A PLAT\\
L5\\38922719\\ANATA\\\\\\\\\\\\
L5\\38922719\\ANATA\\\\\\\\\\EXAMEN MICROSCOPIQUE:\\
L5\\38922719\\ANATA\\\\\\\\\\\\
L5\\38922719\\ANATA\\\\\\\\\\FRAGMENT CUTANE MOLLUSCOIDE LIMITE PAR UN EPIDERME APLATI\\
L5\\38922719\\ANATA\\\\\\\\\\L'AXE CONJONCTIF RENFERME DES CELLULES NAEVIQUES MONOMORPHES GROUPEES AUTOUR D'ANNEXES PILOSEBACEES\\
L5\\38922719\\ANATA\\\\\\\\\\IL N'Y A PAS D'ACTIVITE DE JONCTION SIGNIFICATIVE, NI D'ATYPIE\\
L5\\38922719\\ANATA\\\\\\\\\\\\
L5\\38922719\\ANATA\\\\\\\\\\CONCLUSION:\\
L5\\38922719\\ANATA\\\\\\\\\\\\
L5\\38922719\\ANATA\\\\\\\\\\NAEVUS INTRADERMIQUE MOLLUSCIFORME BENIN\\
L5\\38922719\\ANATA\\\\\\\\\\COMME IL S'AGIT D'UNE MISE A PLAT, LA MARGE PROFONDE PASSE PAR LA LESION\\
L5\\38922719\\ANATA\\\\\\\\\\\\
L5\\38922719\\ANATA\\\\\\\\\\DR  DECROO          DR  ARMAND                                              YYYY\\
L5\\38922719\\ANATA\\\\\\\\\\\\
A1\\69694136\\Koss - Jaskolski\\
A2\\69694136\\Rice\\Marty\\M\\070706\\06070739744\\
A3\\69694136\\1686 Muriel Fall\\47379-7304\\Murrayton\\
A4\\69694136\\Muller\\070119\\\\C\\
L5\\69694136\\ANATA\\\\\\\\\\\\
L5\\69694136\\ANATA\\\\\\\\\\\\
L5\\69694136\\ANATA\\\\\\\\\\\\
L5\\69694136\\ANATA\\\\\\\\\\\\
L5\\69694136\\ANATA\\\\\\\\\\RENSEIGNEMENTS CLINIQUES\\
L5\\69694136\\ANATA\\\\\\\\\\\\
L5\\69694136\\ANATA\\\\\\\\\\MILIEU DU DOS: NAEVUS CONGENITAL HETEROGENE\\
L5\\69694136\\ANATA\\\\\\\\\\\\
L5\\69694136\\ANATA\\\\\\\\\\EXAMEN MICROSCOPIQUE:\\
L5\\69694136\\ANATA\\\\\\\\\\\\
L5\\69694136\\ANATA\\\\\\\\\\ON OBSERVE UNE TUMEUR MELANOCYTAIRE DE GRANDE TAILLE, BIEN LIMITEE LATERALEMENT ET SYMETRIQUE, CARACTERISEE PAR DES CELLULES\\
L5\\69694136\\ANATA\\\\\\\\\\NAEVIQUES GROUPEES EN AMAS DANS LE DERME SUPERFICIEL ET MOYEN AVEC UN PHENOMENE D'ENTRAINEMENT EN PROFONDEUR AUTOUR\\
L5\\69694136\\ANATA\\\\\\\\\\DES ANNEXES\\
L5\\69694136\\ANATA\\\\\\\\\\DES THEQUES ARRONDIES ET  MONOMORPHES SONT EGALEMENT PRESENTES A LA JONCTION DERMO-EPIDERMIQUE\\
L5\\69694136\\ANATA\\\\\\\\\\IL N'Y A PAS D'ATYPIE\\
L5\\69694136\\ANATA\\\\\\\\\\\\
L5\\69694136\\ANATA\\\\\\\\\\CONCLUSION:\\
L5\\69694136\\ANATA\\\\\\\\\\\\
L5\\69694136\\ANATA\\\\\\\\\\NAEVUS MIXTE A ACTIVITE JONCTIONNELLE NETTE\\
L5\\69694136\\ANATA\\\\\\\\\\LA LESION PRESENTE DES CARACTERISTIQUES HISTOLOGIQUES DE NAEVUS CONGENITAL\\
L5\\69694136\\ANATA\\\\\\\\\\PAS DE MALIGNITE DECELEE\\
L5\\69694136\\ANATA\\\\\\\\\\LES MARGES SONT SAINES\\
L5\\69694136\\ANATA\\\\\\\\\\\\
L5\\69694136\\ANATA\\\\\\\\\\DR  DECROO          DR  ARMAND                                              YYYY\\
A1\\41085527\\Crooks, Bogisich and Hirthe\\
A2\\41085527\\Parisian\\Mittie\\M\\150959\\59091560948\\
A3\\41085527\\94695 Kavon Turnpike\\93675-6161\\Alibury\\
A4\\41085527\\Waelchi\\110119\\\\C\\
L5\\41085527\\ANATA\\\\\\\\\\\\
L5\\41085527\\ANATA\\\\\\\\\\\\
L5\\41085527\\ANATA\\\\\\\\\\\\
L5\\41085527\\ANATA\\\\\\\\\\RENSEIGNEMENTS CLINIQUES :\\
L5\\41085527\\ANATA\\\\\\\\\\\\
L5\\41085527\\ANATA\\\\\\\\\\NUQUE: NAEVUS ID\\
L5\\41085527\\ANATA\\\\\\\\\\\\
L5\\41085527\\ANATA\\\\\\\\\\EXAMEN MICROSCOPIQUE :\\
L5\\41085527\\ANATA\\\\\\\\\\\\
L5\\41085527\\ANATA\\\\\\\\\\PRELEVEMENT CUTANE COUPE TRANSVERSALEMENT\\
L5\\41085527\\ANATA\\\\\\\\\\NOUS OBSERVONS UNE LESION MELANOCYTAIRE CARACTERISEE PAR DES THEQUES NAEVIQUES ET INTRADERMIQUES SOULEVANT UN\\
L5\\41085527\\ANATA\\\\\\\\\\EPIDERME SANS PARTICULARITE\\
L5\\41085527\\ANATA\\\\\\\\\\IL N'Y A PAS D'ACTIVITE JONCTIONNELLE NI D'INFILTRAT INFLAMMATOIRE SIGNIFICATIF\\
L5\\41085527\\ANATA\\\\\\\\\\\\
L5\\41085527\\ANATA\\\\\\\\\\CONCLUSION :\\
L5\\41085527\\ANATA\\\\\\\\\\\\
L5\\41085527\\ANATA\\\\\\\\\\IMAGE DE NAEVUS INTRADERMIQUE\\
L5\\41085527\\ANATA\\\\\\\\\\PAS DE MALIGNITE DECELEE\\
L5\\41085527\\ANATA\\\\\\\\\\IL PERSISTE DES CELLULES NAEVIQUES A LA MARGE INFERIEURE DU PRELEVEMENT, MAIS PEUT-ETRE S'AGIT-IL D'UN PRELEVEMENT PAR\\
L5\\41085527\\ANATA\\\\\\\\\\MISE A PLAT ?\\
L5\\41085527\\ANATA\\\\\\\\\\\\
L5\\41085527\\ANATA\\\\\\\\\\\\
L5\\41085527\\ANATA\\\\\\\\\\DR  VANCOMPERNOLLE          DR  BOTULE                                     ZZZZ\\
L5\\41085527\\ANATA\\\\\\\\\\\\
A1\\84911319\\Botsford, Christiansen and Becker\\
A2\\84911319\\Ankunding\\Telly\\M\\070435\\35040743576\\
A3\\84911319\\0542 Kshlerin River\\96229\\South Giannifurt\\
A4\\84911319\\Lang\\110119\\\\C\\
L5\\84911319\\ANATA\\\\\\\\\\\\
L5\\84911319\\ANATA\\\\\\\\\\\\
L5\\84911319\\ANATA\\\\\\\\\\\\
L5\\84911319\\ANATA\\\\\\\\\\RENSEIGNEMENTS CLINIQUES :\\
L5\\84911319\\ANATA\\\\\\\\\\\\
L5\\84911319\\ANATA\\\\\\\\\\JOUE GAUCHE: NAEVUS VERRUQUEUX BICOLORE VERSUS KS\\
L5\\84911319\\ANATA\\\\\\\\\\\\
L5\\84911319\\ANATA\\\\\\\\\\EXAMEN MICROSCOPIQUE :\\
L5\\84911319\\ANATA\\\\\\\\\\\\
L5\\84911319\\ANATA\\\\\\\\\\PRELEVEMENT CUTANE SUPERFICIEL FRAGMENTE\\
L5\\84911319\\ANATA\\\\\\\\\\LE DERME EST ACANTHOSIQUE, CONSTITUE DE PETITES CELLULES BASALOIDES, PARCOURU D'INVAGINATIONS ET D'INCLUSIONS CORNEES\\
L5\\84911319\\ANATA\\\\\\\\\\ABSENCE DE TUMEUR MELANOCYTAIRE\\
L5\\84911319\\ANATA\\\\\\\\\\\\
L5\\84911319\\ANATA\\\\\\\\\\CONCLUSION :\\
L5\\84911319\\ANATA\\\\\\\\\\\\
L5\\84911319\\ANATA\\\\\\\\\\KERATOSE SEBORRHEIQUE HYPERACANTHOSIQUE\\
L5\\84911319\\ANATA\\\\\\\\\\PAS DE MALIGNITE DECELEE\\
L5\\84911319\\ANATA\\\\\\\\\\\\
L5\\84911319\\ANATA\\\\\\\\\\\\
L5\\84911319\\ANATA\\\\\\\\\\DR  VANCOMPERNOLLE          DR  BOTULE                                     ZZZZ\\
L5\\84911319\\ANATA\\\\\\\\\\\\
A1\\82448040\\Jacobs and Sons\\
A2\\82448040\\Runte\\Anthony\\F\\101160\\60111022258\\
A3\\82448040\\9215 O'Kon Brook\\58809\\Alexaville\\
A4\\82448040\\Hermiston\\140119\\\\C\\
L5\\82448040\\ANATA\\\\\\\\\\\\
L5\\82448040\\ANATA\\\\\\\\\\\\
L5\\82448040\\ANATA\\\\\\\\\\\\
L5\\82448040\\ANATA\\\\\\\\\\RENSEIGNEMENTS CLINIQUES\\
L5\\82448040\\ANATA\\\\\\\\\\\\
L5\\82448040\\ANATA\\\\\\\\\\NODULE DOULOUREUX SUR CICATRICE POST- LIGATURE DES TROMPES PUIS REPRISE DE LA CICATRICE IL Y A PLUS OU MOINS VINGT ANS\\
L5\\82448040\\ANATA\\\\\\\\\\NEVROME ?  ENDOMETRIOSE ?\\
L5\\82448040\\ANATA\\\\\\\\\\\\
L5\\82448040\\ANATA\\\\\\\\\\EXAMEN MICROSCOPIQUE:\\
L5\\82448040\\ANATA\\\\\\\\\\\\
L5\\82448040\\ANATA\\\\\\\\\\LE DERME EST OCCUPE PAR DES FAISCEAUX DE COLLAGENE EPAISSIS ET HYALINISES\\
L5\\82448040\\ANATA\\\\\\\\\\IL N'Y A PAS D'ATYPIE\\
L5\\82448040\\ANATA\\\\\\\\\\\\
L5\\82448040\\ANATA\\\\\\\\\\CONCLUSION:\\
L5\\82448040\\ANATA\\\\\\\\\\\\
L5\\82448040\\ANATA\\\\\\\\\\IMAGE DE CHELOIDE\\
L5\\82448040\\ANATA\\\\\\\\\\PAS DE MALIGNITE DECELEE\\
L5\\82448040\\ANATA\\\\\\\\\\\\
L5\\82448040\\ANATA\\\\\\\\\\\\
L5\\82448040\\ANATA\\\\\\\\\\DR  DECROO          DR  ARMAND                                              XXXX\\
L5\\82448040\\ANATA\\\\\\\\\\\\
A1\\88759533\\Feest, Hoppe and Mante\\
A2\\88759533\\Stracke\\Johnathan\\M\\251245\\45122569124\\
A3\\88759533\\8800 Heloise Mission\\33704-5176\\Lake Abdul\\
A4\\88759533\\Wunsch\\140119\\\\C\\
L5\\88759533\\ANATA\\\\\\\\\\\\
L5\\88759533\\ANATA\\\\\\\\\\\\
L5\\88759533\\ANATA\\\\\\\\\\\\
L5\\88759533\\ANATA\\\\\\\\\\RENSEIGNEMENTS CLINIQUES\\
L5\\88759533\\ANATA\\\\\\\\\\\\
L5\\88759533\\ANATA\\\\\\\\\\MAXILLAIRE GAUCHE: PAPILLOME VERRUQUEUX\\
L5\\88759533\\ANATA\\\\\\\\\\\\
L5\\88759533\\ANATA\\\\\\\\\\EXAMEN MICROSCOPIQUE:\\
L5\\88759533\\ANATA\\\\\\\\\\\\
L5\\88759533\\ANATA\\\\\\\\\\L'EPIDERME EST HYPERACANTHOSIQUE HYPERPAPILLOMATEUX, HYPER- ET ESSENTIELLEMENT ORTHOKERATOSIQUE\\
L5\\88759533\\ANATA\\\\\\\\\\ON OBSERVE DES IMAGES VACUOLAIRES DANS LA COUCHE GRANULEUSE\\
L5\\88759533\\ANATA\\\\\\\\\\IL N'Y A PAS D'ATYPIE\\
L5\\88759533\\ANATA\\\\\\\\\\\\
L5\\88759533\\ANATA\\\\\\\\\\CONCLUSION:\\
L5\\88759533\\ANATA\\\\\\\\\\\\
L5\\88759533\\ANATA\\\\\\\\\\PAPILLOME VERRUQUEUX\\
L5\\88759533\\ANATA\\\\\\\\\\PAS DE MALIGNITE DECELEE\\
L5\\88759533\\ANATA\\\\\\\\\\\\
L5\\88759533\\ANATA\\\\\\\\\\\\
L5\\88759533\\ANATA\\\\\\\\\\DR  DECROO          DR  ARMAND                                              XXXX\\
L5\\88759533\\ANATA\\\\\\\\\\\\
END
`,
};

export const exampleHealthoneLab = {
	count: 2,
	contents: `A1\\5847-76621\\Raynor, Roob and Maggio\\
A2\\5847-76621\\Cartwright\\Yasmin\\M\\23121988\\88122355791\\
A3\\5847-76621\\43895 Keyshawn Falls\\19198-3415\\Shaniashire\\
A4\\5847-76621\\Batz\\02022019\\1152\\C\\
L1\\5847-76621\\t_HEMATO\\ HEMATOLOGIE\\\\\\\\\\
L1\\5847-76621\\t_HEMOGRAMME\\Hemogramme\\\\\\\\\\
L1\\5847-76621\\327\\Hemoglobine\\11,5 - 17,0\\g/dl\\\\12,2\\
L1\\5847-76621\\325\\Hematies\\4,0 - 5,2\\10e6/mme3\\\\4,2\\
L1\\5847-76621\\328\\Hematocrite\\34,0 - 53,0\\%\\\\38,4\\
L1\\5847-76621\\329\\   t.c.m.h.\\24 - 34\\pg\\\\29\\
L1\\5847-76621\\330\\   c.c.m.h.\\32 - 36\\g/dl\\\\32\\
L1\\5847-76621\\331\\   volume globulaire moyen\\78 - 98\\fl\\\\91\\
L1\\5847-76621\\1980\\   Index d'anisocytose\\11 - 15\\%\\\\13\\
L1\\5847-76621\\376\\Reticulocytes\\\\\\C\\sans objet\\
L1\\5847-76621\\332\\Leucocytes\\3750 - 13000\\/mme3\\\\9410\\
L1\\5847-76621\\t_FO\\    Formule\\\\\\\\\\
L1\\5847-76621\\366\\Neutrophiles\\37 - 75\\%\\\\64\\
L1\\5847-76621\\367\\Eosinophiles\\< 5,0\\%\\\\2,9\\
L1\\5847-76621\\368\\Basophiles\\< 2,0\\%\\\\0,2\\
L1\\5847-76621\\369\\Monocytes\\1,0 - 10,0\\%\\\\6,7\\
L1\\5847-76621\\370\\Lymphocytes\\20 - 45\\%\\\\26\\
L1\\5847-76621\\371\\Neutrophiles\\1400 - 7700\\/mme3\\\\6022\\
L1\\5847-76621\\372\\Eosinophiles\\< 600\\/mme3\\\\273\\
L1\\5847-76621\\373\\Basophiles\\< 150\\/mme3\\\\19\\
L1\\5847-76621\\374\\Monocytes\\< 900\\/mme3\\\\630\\
L1\\5847-76621\\375\\Lymphocytes\\1300 - 4500\\/mme3\\\\2447\\
L1\\5847-76621\\t_COAG\\ HEMOSTASE\\\\\\\\\\
L1\\5847-76621\\334\\Thrombocytes\\160 - 440\\10e3/mm�\\\\248\\
L1\\5847-76621\\t_CHIMIE\\  BIOCHIMIE\\\\\\\\\\
L1\\5847-76621\\t_ASPECT\\  Index seriques\\\\\\\\\\
L1\\5847-76621\\2053\\Indice d'hemolyse\\< 1\\Index\\\\< 1\\
L1\\5847-76621\\2055\\Indice de lactescence\\< 1\\Index\\\\< 1\\
L1\\5847-76621\\2054\\Indice d'ictere\\< 1\\Index\\\\< 1\\
L1\\5847-76621\\t_MET.GLUC\\Metabolisme des glucides\\\\\\\\\\
L1\\5847-76621\\532\\Glycemie a jeun\\0,74 - 1,06\\g/l\\\\0,77\\
L1\\5847-76621\\t_HEPAT\\Fonction hepatique\\\\\\\\\\
L1\\5847-76621\\557\\Transaminase GP  (ALAT)\\< 41\\U /l\\\\15\\
L1\\5847-76621\\559\\g GT\\4 - 24\\U /l\\\\21\\
L1\\5847-76621\\570\\Bilirubine  totale\\< 0,90\\mg /dl\\\\0,51\\
L1\\5847-76621\\571\\Bilirubine conjuguee\\< 0,30\\mg /dl\\\\0,11\\
L1\\5847-76621\\572\\Bilirubine libre\\< 0,80\\mg /dl\\\\0,40\\
L1\\5847-76621\\t_RENAL\\Fonction renale\\\\\\\\\\
L1\\5847-76621\\581\\Creatinine\\3,9 - 8,4\\mg /l\\\\7,9\\
L1\\5847-76621\\2445\\GRF calculee (selon MDRD)\\\\ml/min/1.73 me2\\\\> 80\\
L1\\5847-76621\\t_PANC\\Fonction pancreatique\\\\\\\\\\
L1\\5847-76621\\622\\Lipase\\< 67\\U  /l\\\\16\\
L1\\5847-76621\\t_PROT_INFL\\Proteines\\\\\\\\\\
L1\\5847-76621\\585\\Proteines totales\\57,0 - 76,0\\g/l\\*\\79,9\\
L1\\5847-76621\\t_6350\\   Electrophorese\\\\\\\\\\
L1\\5847-76621\\969\\Albumine\\55 - 66\\%\\\\53\\
L1\\5847-76621\\970\\... soit (en valeur absolue)\\34 - 50\\g/l\\\\42\\
L1\\5847-76621\\971\\a-1 globulines\\3,5 - 7,5\\%\\\\4,9\\
L1\\5847-76621\\973\\a-2 globulines\\8 - 13\\%\\\\11\\
L1\\5847-76621\\975\\b-globulines\\8 - 13\\%\\\\13\\
L1\\5847-76621\\977\\g-globulines\\10 - 18\\%\\\\18\\
L1\\5847-76621\\978\\... soit (en valeur absolue)\\6 - 15\\g/l\\\\14\\
L1\\5847-76621\\t_6360\\Immunoelectrophorese des proteines\\\\\\\\\\
L1\\5847-76621\\986\\Interpretation\\\\\\C\\non effectue\\
L1\\5847-76621\\936\\CRP (C-reactive proteine) us\\< 3,0\\mg /l\\\\1,1\\
L1\\5847-76621\\t_ENDO\\ENDOCRINOLOGIE\\\\\\\\\\
L1\\5847-76621\\t_THYR\\Axe thyreotrope\\\\\\\\\\
L1\\5847-76621\\827\\TSH\\0,50 - 4,00\\mU /l\\\\0,85\\
L1\\5847-76621\\t_IMMUNO\\AUTO-IMMUNITE\\\\\\\\\\
L1\\5847-76621\\t_RHEU\\Maladies rhumatismales\\\\\\\\\\
L1\\5847-76621\\889\\Anti-noyau et cytoplasme  (IF)\\\\\\C\\negatif\\
L1\\5847-76621\\2213\\Anti-nucleaires (quantitatif)\\< 80\\Titre\\\\< 80\\
L1\\5847-76621\\t_ALLERGIE2\\ALLERGIE\\\\\\\\\\
L1\\5847-76621\\1044\\IgE totales\\< 120\\kU /l\\\\113\\
L1\\5847-76621\\2753\\Prelevement(s)\\\\\\C\\Identification sur  prelevement(s) : oui\\
L1\\5847-76621\\TEXTEF\\Texte de fin de protocole\\\\\\\\  Validation biologique informatique\\
L1\\5847-76621\\TEXTEF\\Texte de fin de protocole\\\\\\\\                                              Avec l'expression de nos sentiments confraternellement devoues\\
L1\\5847-76621\\TEXTEF\\Texte de fin de protocole\\\\\\\\                       Retour des conditions hivernales : nous attirons votre attention sur la sensibilite des prelevements sanguins \\
L1\\5847-76621\\TEXTEF\\Texte de fin de protocole\\\\\\\\                                                   au froid, particulierement pour des analyses telles que PTT (INR), potassium ...\\
L1\\5847-76621\\TEXTEF\\Texte de fin de protocole\\\\\\\\                                                                        En aucun cas,  le sang ne peut etre expose au gel.\\
A1\\0536-36930\\Harris, Gulgowski and Donnelly\\
A2\\0536-36930\\Doe\\Jane\\F\\04061955\\55060405242\\
A3\\0536-36930\\695 Crist Drive\\55814-9561\\New Nicolamouth\\
A4\\0536-36930\\Walter\\05022019\\1108\\C\\
L1\\0536-36930\\t_HEMATO\\ HEMATOLOGIE\\\\\\\\\\
L1\\0536-36930\\t_HEMOGRAMME\\Hemogramme\\\\\\\\\\
L1\\0536-36930\\327\\Hemoglobine\\13,0 - 18,0\\g/dl\\\\15,0\\
L1\\0536-36930\\325\\Hematies\\4,3 - 6,0\\10e6/mme3\\\\4,8\\
L1\\0536-36930\\328\\Hematocrite\\39,0 - 53,0\\%\\\\43,4\\
L1\\0536-36930\\329\\   t.c.m.h.\\24 - 34\\pg\\\\31\\
L1\\0536-36930\\330\\   c.c.m.h.\\32 - 36\\g/dl\\\\35\\
L1\\0536-36930\\331\\   volume globulaire moyen\\82 - 98\\fl\\\\90\\
L1\\0536-36930\\1980\\   Index d'anisocytose\\11 - 15\\%\\\\13\\
L1\\0536-36930\\332\\Leucocytes\\3800 - 11000\\/mme3\\\\5220\\
L1\\0536-36930\\t_FO\\    Formule\\\\\\\\\\
L1\\0536-36930\\366\\Neutrophiles\\37 - 75\\%\\\\58\\
L1\\0536-36930\\367\\Eosinophiles\\< 5,0\\%\\\\7,5\\
L1\\0536-36930\\368\\Basophiles\\< 2,0\\%\\\\0,9\\
L1\\0536-36930\\369\\Monocytes\\1,0 - 10,0\\%\\\\12,1\\
L1\\0536-36930\\370\\Lymphocytes\\20 - 45\\%\\\\21\\
L1\\0536-36930\\371\\Neutrophiles\\1400 - 7700\\/mme3\\\\3028\\
L1\\0536-36930\\372\\Eosinophiles\\< 600\\/mme3\\\\392\\
L1\\0536-36930\\373\\Basophiles\\< 110\\/mme3\\\\47\\
L1\\0536-36930\\374\\Monocytes\\150 - 1000\\/mme3\\\\632\\
L1\\0536-36930\\375\\Lymphocytes\\1000 - 4800\\/mme3\\\\1096\\
L1\\0536-36930\\t_COAG\\ HEMOSTASE\\\\\\\\\\
L1\\0536-36930\\334\\Thrombocytes\\140 - 440\\10e3/mm�\\\\229\\
L1\\0536-36930\\t_CHIMIE\\  BIOCHIMIE\\\\\\\\\\
L1\\0536-36930\\t_ASPECT\\  Index seriques\\\\\\\\\\
L1\\0536-36930\\2053\\Indice d'hemolyse\\< 1\\Index\\\\< 1\\
L1\\0536-36930\\2055\\Indice de lactescence\\< 1\\Index\\\\< 1\\
L1\\0536-36930\\2054\\Indice d'ictere\\< 1\\Index\\\\< 1\\
L1\\0536-36930\\t_ANEMIE\\Bilan biochimique de l'anemie\\\\\\\\\\
L1\\0536-36930\\610\\Fer\\59 - 170\\mcg/dl\\*\\54\\
L1\\0536-36930\\611\\Ferritine\\41 - 322\\mcg/l\\\\122\\
L1\\0536-36930\\t_MET.GLUC\\Metabolisme des glucides\\\\\\\\\\
L1\\0536-36930\\532\\Glycemie a jeun\\0,82 - 1,15\\g/l\\\\0,91\\
L1\\0536-36930\\t_HEPAT\\Fonction hepatique\\\\\\\\\\
L1\\0536-36930\\558\\Transaminase GO  (ASAT)\\< 50\\U /l\\\\27\\
L1\\0536-36930\\557\\Transaminase GP  (ALAT)\\< 41\\U /l\\\\36\\
L1\\0536-36930\\559\\g GT\\8 - 55\\U /l\\\\22\\
L1\\0536-36930\\561\\Lactate deshydrogenase (LDH)\\< 248\\U /l\\\\196\\
L1\\0536-36930\\t_ELECTRO\\Electrolytes\\\\\\\\\\
L1\\0536-36930\\586\\Sodium\\136 - 145\\mmol/l\\\\138\\
L1\\0536-36930\\587\\Potassium\\3,5 - 5,1\\mmol/l\\\\4,6\\
L1\\0536-36930\\588\\Chlorures\\98 - 109\\mmol/l\\\\102\\
L1\\0536-36930\\589\\Magnesium\\0,73 - 1,06\\mmol/l\\\\0,92\\
L1\\0536-36930\\627\\Calcium total\\2,19 - 2,54\\mmol/l\\\\2,28\\
L1\\0536-36930\\630\\Phosphates\\0,8 - 1,5\\mmol/l\\\\1,1\\
L1\\0536-36930\\t_RENAL\\Fonction renale\\\\\\\\\\
L1\\0536-36930\\581\\Creatinine\\7,2 - 11,8\\mg /l\\*\\6,9\\
L1\\0536-36930\\582\\Uree\\0,15 - 0,50\\g/l\\\\0,25\\
L1\\0536-36930\\583\\Acide urique\\30 - 75\\mg /l\\\\53\\
L1\\0536-36930\\2445\\GRF calculee (selon MDRD)\\80 - 140\\ml/min/1.73 me2\\\\> 80\\
L1\\0536-36930\\t_PANC\\Fonction pancreatique\\\\\\\\\\
L1\\0536-36930\\622\\Lipase\\< 67\\U  /l\\\\20\\
L1\\0536-36930\\t_MET.OSSEUX\\Metabolisme osseux\\\\\\\\\\
L1\\0536-36930\\634\\25(OH)Vitamine D\\30 - 100\\mcg/l\\*\\29\\
L1\\0536-36930\\t_PROT_INFL\\Proteines\\\\\\\\\\
L1\\0536-36930\\585\\Proteines totales\\63,0 - 80,0\\g/l\\\\73,6\\
L1\\0536-36930\\t_6350\\   Electrophorese\\\\\\\\\\
L1\\0536-36930\\969\\Albumine\\55 - 66\\%\\\\54\\
L1\\0536-36930\\970\\... soit (en valeur absolue)\\34 - 50\\g/l\\\\40\\
L1\\0536-36930\\971\\a-1 globulines\\3,5 - 7,5\\%\\\\4,7\\
L1\\0536-36930\\973\\a-2 globulines\\8 - 13\\%\\\\12\\
L1\\0536-36930\\975\\b-globulines\\8 - 13\\%\\\\13\\
L1\\0536-36930\\977\\g-globulines\\10 - 18\\%\\\\16\\
L1\\0536-36930\\978\\... soit (en valeur absolue)\\6 - 15\\g/l\\\\12\\
L1\\0536-36930\\936\\CRP (C-reactive proteine) us\\< 3,0\\mg /l\\*\\8,6\\
L1\\0536-36930\\t_TUMOR\\Marqueurs tumoraux�                  - non diagnostiques -\\\\\\\\\\
L1\\0536-36930\\t_PROSTATA\\Prostate\\\\\\\\\\
L1\\0536-36930\\637\\PSA\\< 3,60\\mcg/l\\\\1,78\\
L1\\0536-36930\\t_2250\\Facteurs de risque cardiovasculaire\\\\\\\\\\
L1\\0536-36930\\t_LIPI\\ Lipides\\\\\\\\\\
L1\\0536-36930\\541\\Cholesterol total\\1,40 - 1,90\\g/l\\\\1,90\\
L1\\0536-36930\\549\\Cholesterol VLDL (calcule)\\0,05 - 0,40\\g/l\\\\0,16\\
L1\\0536-36930\\2189\\Cholesterol LDL\\0,60 - 1,15\\g/l\\\\1,31\\
L1\\0536-36930\\542\\HDL Cholesterol\\0,40 - 0,80\\g/l\\\\0,43\\
L1\\0536-36930\\540\\Triglycerides\\0,25 - 1,50\\g/l\\\\0,79\\
L1\\0536-36930\\t_ENDO\\ENDOCRINOLOGIE\\\\\\\\\\
L1\\0536-36930\\t_THYR\\Axe thyreotrope\\\\\\\\\\
L1\\0536-36930\\827\\TSH\\0,50 - 4,00\\mU /l\\\\1,75\\
L1\\0536-36930\\TEXTEF\\Texte de fin de protocole\\\\\\\\  Validation biologique informatique\\
L1\\0536-36930\\TEXTEF\\Texte de fin de protocole\\\\\\\\                                              Avec l'expression de nos sentiments confraternellement devoues\\
L1\\0536-36930\\TEXTEF\\Texte de fin de protocole\\\\\\\\                       Retour des conditions hivernales : nous attirons votre attention sur la sensibilite des prelevements sanguins \\
L1\\0536-36930\\TEXTEF\\Texte de fin de protocole\\\\\\\\                                                   au froid, particulierement pour des analyses telles que PTT (INR), potassium ...\\
L1\\0536-36930\\TEXTEF\\Texte de fin de protocole\\\\\\\\                                                                        En aucun cas,  le sang ne peut etre expose au gel.\\
`,
};
