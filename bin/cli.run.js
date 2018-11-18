'use strict';

// Dependencies
const chalk = require('chalk');

// Local dependencies
const {
	npmScripts
} = require('./../src/index');

const {
	failIfMultipleFlags
} = require('./utils/parseUtils');


module.exports = function runProgram(program) {

	program
		.command('run')
		.description(`${chalk.grey('npm run')} with fzf`)

		// Help
		.on('--help', function () {
			console.log();
			console.log('  Examples:');
			console.log('    ' + chalk.blueBright(`npf run, ${chalk.white("execute npm scripts with fzf")}`));
			console.log('    ' + chalk.blueBright(`npf run --no-fuzzy, ${chalk.white("execute npm scripts without fzf")}`));
			console.log();
		})
		.action(function () {

			// Fail if multiple flavor flags given at the same time
			failIfMultipleFlags(program, {
				positive: ['details'],
				negative: ['fuzzy', 'preview'],
				errMsg: 'Multiple flavor flags'
			});

			executeNpmScripts();

			function executeNpmScripts() {
				if (program.details) return console.log(`This combination does not exist`);

				(program.fuzzy) ? npmScripts().fzf(): npmScripts().print();
			}

		});
};
