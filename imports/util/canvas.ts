import {type Canvas} from 'canvas/types';

export {
	type Canvas,
	type JpegConfig,
	type PdfConfig,
	type PngConfig,
} from 'canvas/types';

type CreateCanvasOptions = {
	width: number;
	height: number;
};

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

export const destroyCanvasIso = (canvas: HTMLCanvasElement | Canvas) => {
	canvas.width = 0;
	canvas.height = 0;
	if (Meteor.isClient) {
		(canvas as HTMLCanvasElement).remove();
	}
};

type CreateContextOptions = {} & CreateCanvasOptions;

export const createContextIso = async (
	options: CreateContextOptions,
): Promise<CanvasRenderingContext2D> => {
	return createCanvasIso(options).then(
		(canvas) => canvas.getContext('2d') as CanvasRenderingContext2D,
	);
};

export const destroyContextIso = (context: CanvasRenderingContext2D) => {
	destroyCanvasIso(context.canvas);
};
