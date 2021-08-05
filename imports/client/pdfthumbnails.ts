import {fetchPDF} from './pdf';

function createContext(
	page: any,
	desiredWidth?: number,
	desiredHeight?: number
) {
	const viewport = page.getViewport({scale: 1});

	let scale = 1;

	if (desiredHeight !== undefined && desiredWidth === undefined) {
		scale = desiredHeight / viewport.height;
	} else if (desiredWidth !== undefined && desiredHeight === undefined) {
		scale = desiredWidth / viewport.width;
	}

	const scaledViewport = page.getViewport({scale});

	const canvas = document.createElement('canvas');
	canvas.width = desiredWidth || scaledViewport.width;
	canvas.height = desiredHeight || scaledViewport.height;

	const ctx = canvas.getContext('2d');

	return {
		canvasContext: ctx,
		viewport: scaledViewport
	};
}

interface Options {
	page?: number;
	width?: number;
	height?: number;
	type?: string;
	encoderOptions?: object;
}

export const thumbnail = async (
	url: string,
	{page = 1, width, height, type, encoderOptions}: Options
) =>
	// A Promise
	fetchPDF({url})
		.then(async (doc) => doc.getPage(page))
		.then(async (thepage) => {
			const renderContext = createContext(thepage, width, height);
			return thepage.render(renderContext).promise.then(() => renderContext);
		})
		.then((renderContext) => {
			const canvas = renderContext.canvasContext.canvas;
			const dataURL = canvas.toDataURL(type, encoderOptions);
			canvas.remove();
			return dataURL;
		});
