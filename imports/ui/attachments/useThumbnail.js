import {useState, useEffect} from 'react';

import {thumbnail} from '../../client/pdfthumbnails.js';

const eee =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89x8AAuEB74Y0o2cAAAAASUVORK5CYII=';

const useThumbnail = (url, {isImage, isPDF, width, height}) => {
	const [src, setSrc] = useState(eee);
	const desiredWidth = width && Number.parseInt(width, 10);
	const desiredHeight = height && Number.parseInt(height, 10);

	useEffect(() => {
		if (!url) return;

		if (isImage) {
			setSrc(url);
			return;
		}

		if (isPDF) {
			let mounted = true;
			console.debug('generating thumbnail for', url);
			thumbnail(url, {
				width: desiredWidth,
				height: desiredHeight
			})
				.then((dataUrl) => mounted && setSrc(dataUrl))
				.catch((error) =>
					console.error(
						`Failed to generate PDF thumbmail URL for upload '${url}'`,
						{error}
					)
				);
			return () => {
				mounted = false;
			};
		}
	}, [url, desiredWidth, desiredHeight, isImage, isPDF]);

	return src;
};

export default useThumbnail;
