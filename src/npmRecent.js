/**
 * Fuzzy search recent global installs with fzf
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
	npmRecent
} = require('@hankchanocd/npmlist');


module.exports = () => {
	return {
		fzf() {
			commandExists('fzf').then(ans => {

				if (ans) {
					return npmRecent().all()
						.then(i => i.raw())
						.then(i => spawn(`echo "${i}" | tr ',' '\n' |
								fzf --reverse --cycle --ansi --height=40%`, {
							stdio: 'inherit',
							shell: true
						}))
						.catch(err => console.log(chalk.redBright(err)));

				} else {
					return defaultNodeFzf();
				}

			}).catch(err => console.log(err));

		},


		fzfPreview() {
			commandExists('fzf').then(ans => {

				if (ans) {
					return npmRecent().all()
						.then(i => i.raw())
						.then(i => spawn(`echo "${i}" | tr ',' '\n' |
								fzf --reverse --cycle --ansi \
	 								--preview-window=70% --preview=" echo {} | tr ' ' '\n' | head -n 1 | xargs npm info "`, {
							stdio: 'inherit',
							shell: true
						}))
						.catch(err => console.log(chalk.redBright(err)));

				} else {
					return defaultNodeFzf();
				}

			}).catch(err => console.log(err));

		},


		print() {
			npmRecent().all()
				.then(i => console.log(i.default()))
				.catch(err => console.log(chalk.redBright(err)));
		}
	};
};


function defaultNodeFzf() {
	console.log(`The default node-fzf doesn't have preview option`);

	return npmRecent().all()
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
