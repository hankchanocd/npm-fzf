/**
 * Search for npm modules on npms.io with score analysis
 *
 */

// Dependencies
const chalk = require('chalk');
const spawn = require('child_process').spawn;
const {
	promisify
} = require("es6-promisify");

// Default to node-fzf, the much less capable implementation of fzf, only when fzf is not installed.
// Using node-fzf will lose many features
const nfzf = promisify(require('node-fzf'));
const commandExists = promisify(require('command-exists'));

// Local dependencies
const {
	npmSearch
} = require('@hankchanocd/npmlist');


module.exports = (module = '') => {
	if (!module) {
		return console.log(chalk.redBright(`Please provide a module`));
	}

	return {
		fzf() {
			commandExists('fzf').then(ans => {

				if (ans) {
					return npmSearch(module)
						.then(i => i.raw())
						.then(i => spawn(`echo "${i}" | tr ',' '\n' |
                                fzf --reverse --cycle --ansi --height=40%`, {
							stdio: 'inherit',
							shell: true
						}))
						.catch(err => console.log(chalk.redBright(err)));

				} else {
					return defaultNodeFzf(module);
				}

			}).catch(err => console.log(err));

		},


		fzfPreview() {
			commandExists('fzf').then(ans => {

				if (ans) {
					return npmSearch(module)
						.then(i => i.raw())
						.then(i => spawn(`echo "${i}" | tr ',' '\n' |
                                fzf --reverse --cycle --ansi \
                                --preview=" echo {} | tr ' ' '\n' | head -n 2 | tail -n 1 | xargs npm info "`, // Retrieve the middle part
							{
								stdio: 'inherit',
								shell: true
							}))
						.catch(err => console.log(chalk.redBright(err)));

				} else {
					return defaultNodeFzf(module);
				}

			}).catch(err => console.log(err));

		},


		print() {
			npmSearch(module)
				.then(i => i.default())
				.catch(err => console.log(chalk.redBright(err)));
		}
	};
};


function defaultNodeFzf(module = '') {
	console.log(`Warning: The default node-fzf doesn't have preview option`);

	if (!module) {
		return console.log(chalk.redBright(`Please provide a module`));
	}

	return npmSearch(module)
		.then(i => i.raw())
		.then(i => nfzf(i))
		.then(i => {
			const {
				selected,
				query
			} = i;
			if (!selected) {
				console.log('No matches for:', query);
			} else {
				console.log(selected.value);
			}
			return;
		})
		.catch(err => console.log(chalk.redBright(err)));
}
