'use strict';

// The escape code comes from https://github.com/okonet/lint-staged/pull/875/files#diff-1f3abab6f042ef9a50a2cce81b57a98b9b111c8374311c4b532777dbd21ecd80

/**
 * Escape a shell argument for Unix shells:
 * - Escape all weird characters with `\`
 * - Double-escape spaces for execa (`\\ `)
 * @see https://qntm.org/cmd
 * @see https://github.com/sindresorhus/execa/blob/a827d82203a1440e585276bef5d399a5953801f1/lib/command.js#L20
 * @param {string} arg the argument
 * @returns {string} the escaped argument
 */
const escapeUnixShellArg = (arg) =>
	`${arg.replace(/(\W)/g, '\\$1').replace(/( )/g, '\\$1')}`;

/**
 * Temporary no-op function.
 * @todo Actually figure out how to escape paths on Windows
 *
 * @param {string} _arg the argument
 * @returns {string} the escape argument
 */
const escapeWinCmdArg = (_arg) => {
	throw new Error('not implemented');
};

/**
 * "Internally" expose the platform option for testing
 * @param {string} arg the argument
 * @param {string} platform the platform
 * @returns {string} the escaped command line argument
 */
const escapeArg = (arg, platform) => {
	const isWin = platform === 'win32';
	return isWin ? escapeWinCmdArg(arg) : escapeUnixShellArg(arg);
};

/**
 * Escape a command line argument based on the current platform
 * @param {string} arg the raw command line argument
 * @returns {string} the escaped command line argument
 */
const escape = (arg) => escapeArg(arg, process.platform);

module.exports = {
	'*.{js,ts,tsx}': (filenames) => [
		`npm run lint-and-fix -- ${filenames.map(escape).join(' ')}`,
		'npm run tsc'
	]
};
