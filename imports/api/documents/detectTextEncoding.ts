// Const utfLabelToEncoding = {
// 'iso-8859-1': 'windows-1252',
// } ;

const detectTextEncoding = async (
	array: Uint8Array,
): Promise<null | string> => {
	const chardet = await import('chardet');
	// Const utfLabel = chardet.detect(array).toLowerCase();
	// const encoding = utfLabelToEncoding[utfLabel] || utfLabel;
	const encoding = chardet.detect(array)?.toLowerCase();
	return encoding;
};

export default detectTextEncoding;
