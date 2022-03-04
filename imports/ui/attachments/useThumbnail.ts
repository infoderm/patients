import {useState, useEffect} from 'react';

import {dataURL as pngDataURL} from '../../util/png';

import {thumbnailDataURL} from '../../lib/pdf/pdfthumbnails';

const eee = pngDataURL(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89x8AAuEB74Y0o2cAAAAASUVORK5CYII=',
);

interface Options {
	isImage?: boolean;
	isPDF?: boolean;
	minWidth?: number;
	minHeight?: number;
}

const useThumbnail = (
	url: string,
	{isImage, isPDF, minWidth, minHeight}: Options,
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
			thumbnailDataURL(url, {minWidth, minHeight}, {type: 'image/png'})
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
	}, [url, minWidth, minHeight, isImage, isPDF]);

	return src;
};

export default useThumbnail;
