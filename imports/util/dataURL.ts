const dataURL = (mimeType: string, base64: string) =>
	`data:${mimeType};base64,${base64}`;
export default dataURL;
