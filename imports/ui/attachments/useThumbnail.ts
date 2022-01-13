import {useState, useEffect} from 'react';

import {dataURL as pngDataURL} from '../../util/png';

import {thumbnail} from '../../lib/pdf/pdfthumbnails';

const eee = pngDataURL(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89x8AAuEB74Y0o2cAAAAASUVORK5CYII=',
);

interface Options {
	isImage?: boolean;
	isPDF?: boolean;
	width?: number;
	height?: number;
}

const useThumbnail = (
	url: string,
	{isImage, isPDF, width, height}: Options,
) => {
	const [src, setSrc] = useState(eee);

	useEffect((): (() => void) | void => {
		if (!url) return;

		if (isImage) {
			setSrc(url);
			return;
		}

		if (isPDF) {
			let mounted = true;
			console.debug('generating thumbnail for', url);
			thumbnail(url, {width, height})
				.then((dataUrl) => {
					if (mounted) setSrc(dataUrl);
				})
				.catch((error) => {
					console.error(
						`Failed to generate PDF thumbmail URL for upload '${url}'`,
						{error},
					);
				});
			return () => {
				mounted = false;
			};
		}
	}, [url, width, height, isImage, isPDF]);

	return src;
};

export default useThumbnail;
