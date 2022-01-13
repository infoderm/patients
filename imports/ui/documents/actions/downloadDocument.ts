import call from '../../../api/endpoint/call';
import documentFetch from '../../../api/endpoint/documents/fetch';
import saveTextAs from '../../output/saveTextAs';

const downloadDocument = async (document) => {
	const extensions = {
		// TODO maybe use LAB/REP kind dichotomy instead
		// Could also use better naming, for instance Mediris uses
		//    Format texte
		//        DMA-REP (Medidoc)
		//        ALA-AMF
		//        HDM-REC
		//        DMA-TEC

		// Résultats de laboratoire (pas en format texte)
		//        ALA-LAB (Medar)
		//        HDM-LAB (Health One)
		//
		// See: https://support.mediportal.be/fr/support/solutions/articles/1000303373-faq-messages-illisibles-dans-le-dossier-g%C3%A9n%C3%A9ralit%C3%A9s-
		healthone: 'HLT',
		medidoc: 'REP',
		// 'medar' : 'MDR' ,
	};

	const ext = extensions[document.format] || 'UNK';

	const name = document.parsed
		? `${document.identifier}-${document.reference}-${document.status}`
		: `${document._id}`;

	const filename = `${name}.${ext}`;

	const text =
		document.decoded ??
		document.source ??
		(await call(documentFetch, document._id));

	saveTextAs(text, filename);
};

export default downloadDocument;
