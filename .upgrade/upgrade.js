#!/usr/bin/env node

const fs = require('fs');

const ncu = require('npm-check-updates');

const renovateConfig = JSON.parse(fs.readFileSync('renovate.json').toString());
const packageRules = renovateConfig.packageRules[0];
const {matchPackageNames, matchPackagePrefixes} = packageRules;

const reject = matchPackageNames
	.concat(matchPackagePrefixes.map((x) => `${x}*`))
	.concat([
		'downshift',
		'healthone',
		'idb',
		'medidoc',
		'mem',
		'pdfjs-dist',
		'puppeteer',
		'react-router-dom',
		'react-spring',
		'total-order',
		'xo',
		'@mui/x-date-pickers',
		'@combinatorics/*',
		'@total-order/*',
		'@set-theory/*',
		'@iterable-iterator/*',
		'@heap-data-structure/*',
		'@functional-abstraction/*',
	]);

ncu
	.run({
		upgrade: process.argv[2] === '-u',
		reject,
		jsonUpgraded: false,
		silent: false,
	})
	.catch((error) => {
		console.error(error);
	});
