const blobFromDataURL = async (url: string): Promise<Blob> => {
	const response = await fetch(url);
	return response.blob();
};

export default blobFromDataURL;
