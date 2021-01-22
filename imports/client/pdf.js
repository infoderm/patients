import pdfjs from 'pdfjs-dist';

// "pages": doc.pdfInfo.numPages

export const WORKER_URL = 'pdfjs-dist/build/pdf.worker.js';
export const CMAP_URL = 'pdfjs-dist/cmaps/';
export const CMAP_PACKED = true;

export function fetchPDF({url, cMapUrl, cMapPacked}) {
	cMapUrl = cMapUrl ?? CMAP_URL;
	cMapPacked = cMapPacked ?? CMAP_PACKED;

	return import('pdfjs-dist/build/pdf.worker.js').then((module) => {
		const globalObject = typeof window !== 'undefined' ? window : {};
		if (globalObject.pdfjsWorker === undefined) {
			globalObject.pdfjsWorker = module;
		}

		return pdfjs.getDocument({url, cMapUrl, cMapPacked}).promise;
	});
}
