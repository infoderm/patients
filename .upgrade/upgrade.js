#!/usr/bin/env node

const ncu = require('npm-check-updates');
const fs = require('fs');

const renovateConfig = JSON.parse(fs.readFileSync('renovate.json').toString());
const packageRules = renovateConfig.packageRules[0];
const {
	matchPackageNames,
	matchPackagePrefixes,
} = packageRules;

const reject = matchPackageNames.concat(matchPackagePrefixes.map((x) => `${x}*`));

ncu.run({
  upgrade: process.argv[2] === '-u',
  reject,
  jsonUpgraded: false,
  silent: false,
}).catch(
  (error) => {
	console.error(error);
  }
);
