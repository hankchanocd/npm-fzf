'use strict';

// Dependencies
const chalk = require('chalk');

// Local dependencies
const {
	npmSearch
} = require('./../src/index');

const {
	failIfMultipleFlags
} = require('./utils/parseUtils');


module.exports = function infoProgram(program) {

	program
		.command('search <module...>')
		.description(`${chalk.grey('npm search')} with fzf`)

		// Help
		.on('--help', function () {
			console.log();
			console.log('  Examples:');
			console.log('    ' + chalk.blueBright(`npf search <module...>, ${chalk.white("fuzzy search for npm modules with preview")}`));
			console.log('    ' + chalk.blueBright(`npf search <module...> --no-preview, ${chalk.white("fuzzy search for npm modules without preview")}`));
			console.log('    ' + chalk.blueBright(`npf search <module...> --no-fuzzy, ${chalk.white("plain search for npm modules")}`));
			console.log();
		})
		.action(function (module) {

			// Fail if multiple flavor flags given at the same time
			failIfMultipleFlags(program, {
				positive: ['details'],
				negative: ['fuzzy', 'preview'],
				errMsg: 'Multiple flavor flags'
			});

			if (module === '-') {
				return console.log(chalk.white('Incomplete flag')); // i.e. 'npf info -'

			} else if (module === '/' || module === '~' || module === '*' || module === '^' || module === '`') {
				return console.log(chalk.white('Invalid input')); // typos
			}


			search(module);

			function search(module) {
				if (program.all || program.details) return npmSearch(module).print();

				if (!program.fuzzy) return npmSearch(module).print();

				(program.preview) ? npmSearch(module).fzfPreview(): npmSearch(module).fzf();
			}
		});
};
