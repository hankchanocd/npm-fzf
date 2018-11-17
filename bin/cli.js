#!/usr/bin/env node --harmony

'use strict';

// Dependencies
const program = require('commander');

const listProgram = require('./cli.list');
const infoProgram = require('./cli.info');
const runProgram = require('./cli.run');

program
	.version('1.0.0', '-v, --version')
	.description('npm with fzf')

	// Flavor flags:
	.option('-d, --details', 'include details to each dependency, but disable the fuzzy mode')
	.option('-P, --no-preview', 'disable the default fzf preview mode')
	.option('-F, --no-fuzzy', 'disable the default fuzzy mode and resort to stdout');

listProgram(program);
infoProgram(program);
runProgram(program);

program.parse(process.argv);

// Display help by default
if (!process.argv.slice(2).length) {
	program.outputHelp();
}
