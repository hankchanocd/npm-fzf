'use strict';

// Dependencies
const chalk = require('chalk');
const pkgInfo = require('pkginfo');
const cwd = process.cwd();

// Local dependencies
const {
	npmRegistry
} = require('./../src/index');

const {
	failIfMultipleFlags
} = require('./utils/parseUtils');


module.exports = function infoProgram(program) {

	program
		.command('info [module]')
		.description(`${chalk.grey('npm info')} with fzf`)

		// Help
		.on('--help', function () {
			console.log();
			console.log('  Examples:');
			console.log('    ' + chalk.blueBright(`npf info [module], ${chalk.white("a fuzzy list with preview of a module's dependencies fetched from NPM registry")}`));
			console.log('    ' + chalk.blueBright(`npf info [module] --no-preview, ${chalk.white("a fuzzy list of a module's dependencies fetched from NPM registry")}`));
			console.log('    ' + chalk.blueBright(`npf info [module] --no-fuzzy, ${chalk.white("a list of a module's dependencies fetched from NPM registry")}`));
			console.log();
		})
		.action(function (module) {

			// Fail if multiple flavor flags given at the same time
			failIfMultipleFlags(program, {
				positive: ['details'],
				negative: ['fuzzy', 'preview'],
				errMsg: 'Multiple flavor flags'
			});

			if (!module) {
				let pkg;
				try {
					pkg = {
						exports: {}
					};
					pkgInfo(pkg, {
						dir: cwd,
						include: ["name"]
					});
					module = pkg.exports.name;

				} catch (e) {
					return console.log(chalk.redBright("No package.json found"));
				}

			} else if (module === '-') {
				return console.log(chalk.white('Incomplete flag')); // i.e. 'npf info -'

			} else if (module === '/' || module === '~' || module === '*' || module === '^' || module === '`') {
				return console.log(chalk.white('Invalid input')); // typos
			}


			fetchNPMRegistry(module);

			function fetchNPMRegistry(module) {
				if (program.all || program.details) return npmRegistry(module).print();

				if (!program.fuzzy) return npmRegistry(module).print();

				(program.preview) ? npmRegistry(module).fzfPreview(): npmRegistry(module).fzf();
			}
		});
};
