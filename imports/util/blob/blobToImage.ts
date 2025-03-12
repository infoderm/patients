const blobToImage = async (blob: Blob): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const url = URL.createObjectURL(blob);
		const img = new Image();
		img.addEventListener('load', () => {
			URL.revokeObjectURL(url);
			resolve(img);
		});

		img.addEventListener('error', (error) => {
			URL.revokeObjectURL(url);
			reject(error);
		});

		img.addEventListener('abort', (_e) => {
			reject(new Error(`Image load aborted for ${url}`));
		});

		img.src = url;
	});

export default blobToImage;
