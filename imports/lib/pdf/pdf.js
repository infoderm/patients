import pdfjs from 'pdfjs-dist';

// "pages": doc.pdfInfo.numPages

export const WORKER_URL = '/pdfjs-dist/build/pdf.worker.js';
// export const WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
export const CMAP_URL = '/pdfjs-dist/cmaps/';
export const CMAP_PACKED = true;

export function fetchPDF(options) {
	const {url} = options;
	const cMapUrl = options?.cMapUrl ?? CMAP_URL;
	const cMapPacked = options?.cMapPacked ?? CMAP_PACKED;

	if (pdfjs.GlobalWorkerOptions.workerSrc === '') {
		pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;
	}

	return pdfjs.getDocument({url, cMapUrl, cMapPacked}).promise;
}
