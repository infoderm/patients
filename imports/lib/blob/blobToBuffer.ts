const blobToBuffer = async (blob: Blob): Promise<ArrayBuffer> =>
	blob.arrayBuffer();
export default blobToBuffer;
