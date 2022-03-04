// @ts-expect-error Needs more recent @types/node
import {Buffer} from 'buffer';
import {Readable} from 'stream';
import {Canvas, JpegConfig, PdfConfig, PngConfig} from 'canvas/types';
import addDays from 'date-fns/addDays';
import {DocumentInitParameters} from 'pdfjs-dist/types/src/display/api';
import {PageViewport} from 'pdfjs-dist/types/src/display/display_utils';

import lru, {IndexedDBPersistedLRUCache} from '../cache/lru';
import {fetchPDF} from './pdf';

let cache: IndexedDBPersistedLRUCache;
if (Meteor.isClient) {
	cache = lru({
		dbName: 'pdf-thumbnails-cache',
		maxCount: 200,
	});
}

interface CreateCanvasOptions {
	width: number;
	height: number;
}

const createCanvasIso = async ({
	width,
	height,
}: CreateCanvasOptions): Promise<HTMLCanvasElement | Canvas> => {
	if (Meteor.isServer) {
		const {createCanvas} = await import('canvas');
		return createCanvas(width, height);
	}

	const browserCanvas = document.createElement('canvas');
	browserCanvas.width = width;
	browserCanvas.height = height;
	return browserCanvas;
};

const destroyCanvasIso = (canvas: HTMLCanvasElement | Canvas) => {
	canvas.width = 0;
	canvas.height = 0;
	if (Meteor.isClient) {
		(canvas as HTMLCanvasElement).remove();
	}
};

interface CreateContextOptions extends CreateCanvasOptions {}

const createContextIso = async (
	options: CreateContextOptions,
): Promise<CanvasRenderingContext2D> => {
	return createCanvasIso(options).then(
		(canvas) => canvas.getContext('2d') as CanvasRenderingContext2D,
	);
};

interface RenderContext {
	canvasContext: CanvasRenderingContext2D;
	viewport: PageViewport;
}

const createRenderContextIso = async (
	page: any,
	minWidth?: number | undefined,
	minHeight?: number | undefined,
): Promise<RenderContext> => {
	const rawViewport = page.getViewport({scale: 1});

	const scaleHeight =
		minHeight === undefined ? 0 : minHeight / rawViewport.height;
	const scaleWidth = minWidth === undefined ? 0 : minWidth / rawViewport.width;

	const scale = Math.max(scaleHeight, scaleWidth) || 1;
	// scale = Math.min(1, scale); // This would prevent scaling up.
	// Since most PDFs are vector images we do not prevent this

	const scaledViewport = page.getViewport({scale});

	const canvasContext = await createContextIso(scaledViewport);

	return {
		canvasContext,
		viewport: scaledViewport,
	};
};

const destroyRenderContextIso = (renderContext: RenderContext) => {
	destroyCanvasIso(renderContext.canvasContext.canvas);
	renderContext.canvasContext = null;
};

interface PageOptions {
	page?: number;
	minWidth?: number;
	minHeight?: number;
}

const thumbnailRender = async (
	document: DocumentInitParameters,
	{page = 1, minWidth, minHeight}: PageOptions,
) =>
	fetchPDF(document)
		.then(async (doc) => {
			// "pages": doc.numPages
			return doc.getPage(page);
		})
		.then(async (thepage) => {
			const renderContext = await createRenderContextIso(
				thepage,
				minWidth,
				minHeight,
			);
			return thepage.render(renderContext).promise.then(() => {
				thepage.cleanup();
				return renderContext;
			});
		});

interface RenderOptions {
	type?: string;
	quality?: number;
}

export const thumbnailDataURL = async (
	url: string,
	pageOptions: PageOptions,
	{type, quality}: RenderOptions,
) => {
	if (Meteor.isServer) {
		throw new Error('not implemented');
	}

	const cached = await cache.find(url);

	if (cached === undefined) {
		console.debug('generating thumbnail for', url);
		const renderContext = await thumbnailRender(
			{
				url,
				disableAutoFetch: true,
			},
			pageOptions,
		);
		const canvas = renderContext.canvasContext.canvas;
		const dataURL = canvas.toDataURL(type, quality);
		destroyRenderContextIso(renderContext);
		await cache.set(url, dataURL, {expiry: addDays(new Date(), 1)});
		return dataURL;
	}

	return cached.value;
};

const toBlob = async (
	canvas: HTMLCanvasElement,
	{type, quality}: RenderOptions,
) =>
	new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(
			(blob: Blob) => {
				if (blob === null) {
					reject();
				} else {
					resolve(blob);
				}
			},
			type,
			quality,
		);
	});

export const thumbnailBlob = async (
	document: DocumentInitParameters,
	pageOptions: PageOptions,
	renderOptions: RenderOptions,
) => {
	const renderContext = await thumbnailRender(document, pageOptions);
	const canvas = renderContext.canvasContext.canvas;
	const blob = await toBlob(canvas, renderOptions);
	destroyRenderContextIso(renderContext);
	return blob;
};

interface CanvasPngRenderOptions {
	type?: 'image/png';
	config?: PngConfig;
}

interface CanvasJpegRenderOptions {
	type: 'image/jpeg';
	config?: JpegConfig;
}

interface CanvasPdfRenderOptions {
	type: 'image/pdf';
	config?: PdfConfig;
}

type CanvasRenderOptions =
	| CanvasPngRenderOptions
	| CanvasJpegRenderOptions
	| CanvasPdfRenderOptions;

const toBuffer = async (
	canvas: Canvas,
	{type = 'image/png', config}: CanvasRenderOptions,
) =>
	new Promise<Buffer>((resolve, reject) => {
		canvas.toBuffer(
			(error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			},
			// @ts-expect-error TypeScript cannot do proper type branching here
			type,
			config,
		);
	});

export const thumbnailBuffer = async (
	document: DocumentInitParameters,
	pageOptions: PageOptions,
	canvasRenderOptions: CanvasRenderOptions,
) => {
	const renderContext = await thumbnailRender(document, pageOptions);
	const canvas = renderContext.canvasContext.canvas as unknown as Canvas;
	const buffer = await toBuffer(canvas, canvasRenderOptions);
	destroyRenderContextIso(renderContext);
	return buffer;
};

export const thumbnailStream = async (
	document: DocumentInitParameters,
	pageOptions: PageOptions,
	{type = 'image/png', config}: CanvasRenderOptions,
): Promise<Readable> => {
	const renderContext = await thumbnailRender(document, pageOptions);
	const canvas = renderContext.canvasContext.canvas as unknown as Canvas;
	let stream: Readable;
	switch (type) {
		case 'image/png':
			stream = canvas.createPNGStream(config as PngConfig);
			break;
		case 'image/jpeg':
			stream = canvas.createJPEGStream(config as JpegConfig);
			break;
		case 'image/pdf':
			stream = canvas.createPDFStream(config as PdfConfig);
			break;
		default:
			throw new Error('not implemented');
	}

	stream.on('close', () => {
		destroyRenderContextIso(renderContext);
	});
	return stream;
};
