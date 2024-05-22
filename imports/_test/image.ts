import {assert} from 'chai';

import {type Sharp} from 'sharp';

import {createContextIso, destroyContextIso} from '../lib/canvas';
import blobToImage from '../lib/blob/blobToImage';

type TypedArray =
	| Uint8Array
	| Uint8ClampedArray
	| Int8Array
	| Uint16Array
	| Int16Array
	| Uint32Array
	| Int32Array
	| Float32Array
	| Float64Array;
type SharpInput = ArrayBuffer | TypedArray;
type S = Sharp | SharpInput;

type I = HTMLImageElement | ArrayBuffer;

type Image = S | I;

const _s = async (x: S): Promise<Sharp> => {
	const {default: sharp} = await import('sharp');
	return x instanceof sharp ? (x as Sharp) : sharp(x as SharpInput);
};

const _i = async (x: I): Promise<HTMLImageElement> => {
	if (x instanceof HTMLImageElement) return x;
	const blob = new Blob([x], {type: 'image/png'});
	const image = await blobToImage(blob);
	return image;
};

const _pixels = async (image: HTMLImageElement): Promise<Uint8ClampedArray> => {
	const {width, height} = image;
	const context = await createContextIso({width, height});
	context.drawImage(image, 0, 0);
	const data = context.getImageData(0, 0, width, height).data;
	destroyContextIso(context);
	return data;
};

const _xorClient = (
	a: Uint8ClampedArray,
	b: Uint8ClampedArray,
): Uint8ClampedArray => {
	const n = a.length;
	assert.strictEqual(b.length, n);
	const delta = new Uint8ClampedArray(n);
	for (let i = 0; i < n; ++i) {
		// eslint-disable-next-line no-bitwise
		delta[i] = a[i]! ^ b[i]!;
	}

	return delta;
};

const _diffClient = async (a: Image, b: Image) => {
	const _a = await _i(a as I);
	const _b = await _i(b as I);
	const aPixels = await _pixels(_a);
	const bPixels = await _pixels(_b);
	return _xorClient(aPixels, bPixels);
};

const _diffServer = async (a: Image, b: Image) => {
	const _a = await _s(a as S);
	const _b = await _s(b as S);
	const delta = await _xorServer(_a, _b);
	return delta.raw().toBuffer();
};

export const diff = Meteor.isServer ? _diffServer : _diffClient;

export const assertEqual = async (a: Image, b: Image) => {
	const delta = await diff(a, b);
	assert(
		!delta.some((value, index) => index % 4 !== 3 && value !== 0),
		`Input images are not equal.`,
	);
};

const _assertSameDimensions = async (a: Sharp, b: Sharp): Promise<void> => {
	const {
		width: aWidth,
		height: aHeight,
		channels: aChannels,
		hasAlpha: aHasAlpha,
	} = await a.metadata();
	const {
		width: bWidth,
		height: bHeight,
		channels: bChannels,
		hasAlpha: bHasAlpha,
	} = await b.metadata();

	assert.strictEqual(
		aWidth,
		bWidth,
		`Images have different widths: ${aWidth} !== ${bWidth}`,
	);

	assert.strictEqual(
		aHeight,
		bHeight,
		`Images have different heights: ${aHeight} !== ${bHeight}`,
	);

	assert.strictEqual(
		aChannels,
		bChannels,
		`Images have different number of channels: ${aChannels} !== ${bChannels}`,
	);

	assert.strictEqual(
		aHasAlpha,
		bHasAlpha,
		`Images have different alpha channel settings: ${aHasAlpha} !== ${bHasAlpha}`,
	);
};

const _xorServer = async (a: Sharp, b: Sharp): Promise<Sharp> => {
	await _assertSameDimensions(a, b);
	const _b = await b.toBuffer();
	return a.boolean(_b, 'eor');
};

const _whiteRectanglePNGServer = async (options: {
	width: number;
	height: number;
}) => {
	const {default: sharp} = await import('sharp');
	return sharp({
		create: {
			...options,
			channels: 4,
			background: {r: 255, g: 255, b: 255, alpha: 0},
		},
	}).png();
};

const _whiteRectanglePNGClient = async ({
	width,
	height,
}: {
	width: number;
	height: number;
}): Promise<HTMLImageElement> => {
	const context = await createContextIso({width, height});
	context.fillStyle = '#FFFFFF';
	context.fillRect(0, 0, width, height);
	const url = context.canvas.toDataURL('image/png');
	destroyContextIso(context);
	const img = new Image();
	img.src = url;
	return img;
};

export const whiteRectanglePNG = Meteor.isServer
	? _whiteRectanglePNGServer
	: _whiteRectanglePNGClient;
