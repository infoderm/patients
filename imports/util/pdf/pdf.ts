import {type DocumentInitParameters} from 'pdfjs-dist/types/src/display/api';

export {type DocumentInitParameters} from 'pdfjs-dist/types/src/display/api';
export {type PageViewport} from 'pdfjs-dist/types/src/display/display_utils';

export const WORKER_URL = Meteor.isClient
	? '/pdfjs-dist/build/pdf.worker.min.mjs'
	: './pdf.worker.mjs';
export const CMAP_URL = Meteor.isClient
	? '/pdfjs-dist/cmaps/'
	: './npm/node_modules/pdfjs-dist/cmaps/';
export const CMAP_PACKED = true;
export const STANDARD_FONT_DATA_URL = Meteor.isClient
	? '/pdfjs-dist/standard_fonts/'
	: './npm/node_modules/pdfjs-dist/standard_fonts/';

/* istanbul ignore next */
export const _embedWorker = async () => {
	// NOTE: This forces Meteor to embed the worker in the server build.
	if (Meteor.isServer) await import('./pdfjs-dist/pdf.worker.mjs');
};

export async function fetchPDF({
	cMapUrl = CMAP_URL,
	cMapPacked = CMAP_PACKED,
	standardFontDataUrl = STANDARD_FONT_DATA_URL,
	isEvalSupported = false,
	...rest
}: DocumentInitParameters) {
	const pdfjs = await import('./pdfjs-dist/pdf.mjs');

	if (pdfjs.GlobalWorkerOptions.workerSrc === '') {
		pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;
		// NOTE For CDN delivery
		// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
	}

	return pdfjs.getDocument({
		cMapUrl,
		cMapPacked,
		standardFontDataUrl,
		isEvalSupported,
		...rest,
	}).promise;
}

export async function saveHTMLElementAsPDF(
	element: HTMLElement,
	{filename = 'print.pdf'}: {filename?: string},
) {
	const {default: PDF} = await import('jspdf');
	const pdf = new PDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4',
		compress: true,
	});
	await pdf.html(element, {
		width: 210, // Width of A4 paper
		windowWidth: element.getBoundingClientRect().width,
		async callback(doc) {
			await doc.save(filename, {returnPromise: true});
		},
	});
}
