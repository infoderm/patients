import {useState, useEffect} from 'react';

import {thumbnail} from '../../client/pdfthumbnails';

const eee =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89x8AAuEB74Y0o2cAAAAASUVORK5CYII=';

interface Options {
	isImage?: boolean;
	isPDF?: boolean;
	width?: number;
	height?: number;
}

const useThumbnail = (
	url: string,
	{isImage, isPDF, width, height}: Options
) => {
	const [src, setSrc] = useState(eee);

	useEffect(() => {
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
						{error}
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
