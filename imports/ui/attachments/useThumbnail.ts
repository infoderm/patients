import {useState, useEffect} from 'react';

import eee from '../../util/eee';

import {thumbnailDataURL} from '../../lib/pdf/pdfthumbnails';

type Options = {
	isImage?: boolean;
	isPDF?: boolean;
	minWidth?: number;
	minHeight?: number;
};

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
