#!/usr/bin/env node --harmony

'use strict';

// Dependencies
const program = require('commander');
const chalk = require('chalk');

// Local dependencies
const {
	npmDependencies,
	npmScripts,
	npmRegistry,
	npmRecent,
	npmGlobal
} = require('./../src/index');
const {
	npmList,
	npmListDetails
} = npmDependencies;


program
	.version('1.0.0', '-v, --version')
	.usage(`[option] [name]`)
	.description('Fuzzy search npm modules with fzf')

	// Four main features:
	.option('-l, --local', 'list local dependencies, which is also the default feature')
	.option('-g, --global', 'list global modules')
	.option('-t, --time', 'show the latest global installs')
	.option('-s, --scripts', 'list/execute npm scripts')

	// Flavor flags:
	.option('-d, --details', 'include details to each dependency, but disable the default fuzzy mode')
	.option('-a, --all', 'a flavor flag that shows all available information on any feature flag')
	.option('-P, --no-preview', 'disable the default fzf preview mode')
	.option('-F, --no-fuzzy', 'disable the default fuzzy mode and resort to stdout')

	// Help
	.on('--help', function () {
		console.log();
		console.log('  Examples:');
		console.log('    ' + chalk.blueBright(`npf, ${chalk.white('a fzf list with preview of local dependencies')}`));
		console.log('    ' + chalk.blueBright(`npf -t, ${chalk.white('a fzf list of latest global installs')}`));
		console.log('    ' + chalk.blueBright(`npf -s, ${chalk.white("a fzf list of npm scripts using fzf")}`));
		console.log('    ' + chalk.blueBright(`npf -g --no-preview, ${chalk.white('a fuzzy list with no preview of global installs')}`));
		console.log('    ' + chalk.blueBright(`npf -s --no-fuzzy, ${chalk.white("a normal list of npm scripts")}`));
		console.log('    ' + chalk.blueBright(`npf -g --details, ${chalk.white('a normal, detailed list of global installs')}`));
		console.log('    ' + chalk.blueBright(`npf [module], ${chalk.white("a fuzzy list with preview of a module's dependencies fetched from NPM registry")}`));
		console.log();
	})
	.parse(process.argv);


// Fail if multiple feature flags given at the same time
(function failIfMultipleFeatureFlags() {
	let count = 0;
	Object.keys(program).forEach(i => {
		if (i == 'global' || i == 'local' || i == 'time' || i == 'scripts') {
			if (program[i]) count += 1;
		}

		if (count >= 2) {
			console.log(`Multiple feature flags. I'm confused.`);
			return process.exit(1);
		}
	});
})();

// Fail if multiple flavor flags given at the same time
(function failIfMultipleFlavorFlags() {
	let count = 0;
	Object.keys(program).forEach(i => {
		if (i == 'details' || i == 'all') {
			if (program[i]) count += 1;
		}

		if (i == 'fuzzy' || i == 'preview') { // no-fuzzy, no-preview
			if (!program[i]) count += 1;
		}

		if (count >= 2) {
			console.log(`Multiple flavor flags. I'm confused.`);
			return process.exit(1);
		}
	});
})();



if (program.global) {
	listGlobalPackages();

} else if (program.local) {
	listLocalDependencies();

} else if (program.time) {
	recentGlobalInstalls();

} else if (program.args.length > 0) { // execute if a module is specified, i.e. `npl express --all`
	fetchFromNPMRegistry();

} else if (program.scripts) {
	listNpmScripts();

} else if (program.details) { // Default to npm local packages listing if only --details flag present
	listLocalDetails();

} else if (program.all) {
	// If none of the feature flags were detected but --all ...
	// --all is a flavor flag. It has no meaning if standing alone
	console.log(`Please specify a feature`);

} else { // default is list local dependencies when nothing specified...
	listLocalDependencies();
}



/*** Helper Functions ***/
function listGlobalPackages() {
	if (!program.fuzzy) {
		return npmGlobal().print();
	}

	if (program.details) {
		return npmGlobal().details();
	}

	if (!program.preview) {
		return npmGlobal().fzf();
	} else {
		return npmGlobal().fzfPreview();
	}
}

function recentGlobalInstalls() {
	if (!program.fuzzy) {
		return npmRecent().print();
	}

	if (program.details) {
		return console.log(`This combination does not exist`);
	}

	if (!program.preview) {
		return npmRecent().fzf();
	} else {
		return npmRecent().fzfPreview();
	}
}

function listLocalDependencies() {
	if (!program.fuzzy) {
		return npmList().print();
	}

	if (program.details) {
		return npmListDetails();
	}

	if (!program.preview) {
		return npmList().fzf();
	} else {
		return npmList().fzfPreview();
	}
}

function listLocalDetails() { // listLocalDetails() is reserved when no feature flag is provided
	npmListDetails();
}

function fetchFromNPMRegistry() {
	/* Filter */
	if (!program.args.length == 1) {
		return console.log(chalk.white('Only one module is allowed'));
	}

	const module = program.args[0];
	if (module === '-') { // incomplete flag => 'npl -'
		return console.log(chalk.white('Incomplete flag'));
	}

	if (module === '/' || module === '~' || module === '*' || module === '^' || module === '`') { // typos
		return console.log(chalk.white('Invalid input'));
	}

	if (program.all || program.details) {
		return npmRegistry(module).print();
	}

	if (!program.fuzzy) {
		return npmRegistry(module).print();
	}

	if (!program.preview) {
		return npmRegistry(module).fzf();
	} else {
		return npmRegistry(module).fzfPreview();
	}
}

function listNpmScripts() {
	if (program.details) {
		return console.log(`This combination does not exist`);
	}

	if (!program.fuzzy) {
		return npmScripts().print();
	} else {
		return npmScripts().fzf();
	}
}
