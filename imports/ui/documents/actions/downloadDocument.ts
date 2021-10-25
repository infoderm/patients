import call from '../../../api/endpoint/call';
import documentFetch from '../../../api/endpoint/documents/fetch';
import saveTextAs from '../../../client/saveTextAs';

const downloadDocument = async (document) => {
	const extensions = {
		healthone: 'HLT',
		// 'medar' : 'MDR' ,
		// 'medidoc' : 'MDD' ,
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
