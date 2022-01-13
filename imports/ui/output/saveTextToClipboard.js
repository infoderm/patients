/**
 * Saves input text to clipboard synchronously.
 *
 * @param {string} str Input text.
 */
export default function saveTextToClipboard(str) {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.display = 'block';
	el.style.width = '0';
	el.style.height = '0';
	el.style.left = '-9999px';
	document.body.append(el);
	el.select();
	document.execCommand('copy');
	el.remove();
}
