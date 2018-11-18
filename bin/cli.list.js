'use strict';

// Dependencies
const chalk = require('chalk');

// Local dependencies
const {
	npmDependencies,
	npmRecent,
	npmGlobal
} = require('./../src/index');
const {
	npmList,
	npmListDetails
} = npmDependencies;

const {
	failIfMultipleFlags
} = require('./utils/parseUtils');


module.exports = function listProgram(program) {

	program
		.command('list')
		.alias('ls')
		.description(`${chalk.grey('npm list')} with fzf`)

		// Feature flags:
		.option('-l, --local', 'list local dependencies, which is also the default feature')
		.option('-g, --global', 'list global modules')
		.option('-t, --time', 'show the latest global installs')

		// Help
		.on('--help', function () {
			console.log();
			console.log('  Examples:');
			console.log('    ' + chalk.blueBright(`npf ls, ${chalk.white('a fzf list with preview of local dependencies')}`));
			console.log('    ' + chalk.blueBright(`npf ls -t, ${chalk.white('a fzf list of latest global installs')}`));
			console.log('    ' + chalk.blueBright(`npf ls -g --no-preview, ${chalk.white('a fuzzy list with no preview of global installs')}`));
			console.log('    ' + chalk.blueBright(`npf ls -g --details, ${chalk.white('a normal, detailed list of global installs')}`));
			console.log();
		})
		.action(function (options) {

			// Fail if multiple feature flags given at the same time
			failIfMultipleFlags(options, {
				positive: ['global', 'local', 'time'],
				errMsg: 'Multiple feature flags'
			});

			// Fail if multiple flavor flags given at the same time
			failIfMultipleFlags(program, {
				positive: ['details'],
				negative: ['fuzzy', 'preview'],
				errMsg: 'Multiple flavor flags'
			});


			if (options.global) {
				globalInstalls();

			} else if (options.local) {
				localDependencies();

			} else if (options.time) {
				recentGlobalInstalls();

			} else if (program.details) { // Default to npm local packages listing if only --details flag present
				localDetails();

			} else if (program.all) {
				// If none of the feature flags were detected but --all ...
				// --all is a flavor flag. It has no meaning if standing alone
				console.log(`Please specify a feature`);

			} else { // default is list local dependencies when nothing specified...
				localDependencies();
			}



			/*** Helper Functions ***/
			function globalInstalls() {
				if (!program.fuzzy) return npmGlobal().print();
				if (program.details) return npmGlobal().details();

				(program.preview) ? npmGlobal().fzfPreview(): npmGlobal().fzf();
			}

			function recentGlobalInstalls() {
				if (!program.fuzzy) return npmRecent().print();
				if (program.details) return console.log(`This combination does not exist`);

				(program.preview) ? npmRecent().fzfPreview(): npmRecent().fzf();
			}

			function localDependencies() {
				if (!program.fuzzy) return npmList().print();
				if (program.details) return npmListDetails();

				(program.preview) ? npmList().fzfPreview(): npmList().fzf();
			}

			function localDetails() { // localDetails() is reserved when no feature flag is provided
				npmListDetails();
            }

		});

};
