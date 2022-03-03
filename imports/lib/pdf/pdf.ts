export const WORKER_URL = '/pdfjs-dist/build/pdf.worker.js';
// export const WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
export const CMAP_URL = '/pdfjs-dist/cmaps/';
export const CMAP_PACKED = true;

export async function fetchPDF({
	cMapUrl = CMAP_URL,
	cMapPacked = CMAP_PACKED,
	...rest
}) {
	const pdfjs = await import('pdfjs-dist');

	if (pdfjs.GlobalWorkerOptions.workerSrc === '') {
		pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;
	}

	return pdfjs.getDocument({cMapUrl, cMapPacked, ...rest}).promise;
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
