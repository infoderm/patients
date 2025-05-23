import {useCallback, useState} from 'react';

import {useSnackbar} from 'notistack';

import {type DocumentDocument} from '../../../api/collection/documents';
import call from '../../../api/endpoint/call';
import documentFetch from '../../../api/endpoint/documents/fetch';
import type Optional from '../../../util/types/Optional';
import saveTextAs from '../../output/saveTextAs';

export type DocumentDownloadTarget = Pick<
	Optional<DocumentDocument, 'decoded' | 'source'>,
	| '_id'
	| 'parsed'
	| 'source'
	| 'decoded'
	| 'format'
	| 'identifier'
	| 'reference'
	| 'status'
>;

const downloadDocument = async (document: DocumentDownloadTarget) => {
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
		'DMA-REP': 'REP',
		// 'medar' : 'MDR' ,
		unknown: 'UNK',
	};

	const ext = extensions[document.format ?? 'unknown'] ?? 'UNK';

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

export const useDocumentDownload = (document: DocumentDownloadTarget) => {
	const {enqueueSnackbar} = useSnackbar();
	const [downloading, setDownloading] = useState(false);

	const download = useCallback(async () => {
		setDownloading(true);
		try {
			await downloadDocument(document);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'unknown error';
			console.error(message);
			console.debug({error});
			enqueueSnackbar(message, {variant: 'error'});
		} finally {
			setDownloading(false);
		}
	}, [document]);

	return [downloading, download];
};
