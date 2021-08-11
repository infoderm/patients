'use strict';

const fs = require('fs');

const tsc = (paths) => {
	const encoding = 'utf8';
	const originalTSConfigPath = 'tsconfig.json';
	// NOTE: MUST be in same directory.
	const lintStagedTSConfigPath = 'lint-staged.tsconfig.json';
	const originalTSConfig = JSON.parse(
		fs.readFileSync(originalTSConfigPath, encoding),
	);
	const lintStagedTSConfig = {
		...originalTSConfig,
		include: ['types/**/*', ...paths],
	};
	fs.writeFileSync(lintStagedTSConfigPath, JSON.stringify(lintStagedTSConfig));
	return `npm run tsc -- --noEmit --project ${lintStagedTSConfigPath}`;
};

const lint = 'npm run lint-and-fix';

module.exports = {
	'*.{js,ts,tsx}': [lint, tsc],
};
