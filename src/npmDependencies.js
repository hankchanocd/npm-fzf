/**
 * List module's dependencies
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
	npmDependencies
} = require('@hankchanocd/npmlist');


const npmList = () => {
	return {
		fzf() {
			commandExists('fzf').then(ans => {

				if (ans) {
					return npmDependencies.npmList().raw()
						.then(list => {
							let listStr = list.map(i => chalk.reset(i)).join('\n'); // Use reset to recover the corrupted colored string
							return spawn(`echo "${listStr}" |
								fzf --reverse --cycle --ansi --height=40%`, {
								stdio: 'inherit',
								shell: true
							});
						})
						.catch(err => console.log(chalk.redBright(err)));

				} else {
					return defaultNodeFzf();
				}

			}).catch(err => console.log(err));

		},


		fzfPreview() {
			commandExists('fzf').then(ans => {

				if (ans) {
					return npmDependencies.npmList().raw()
						.then(list => {
							let listStr = list.map(i => chalk.reset(i)).join('\n'); // Use reset to recover the corrupted colored string
							return spawn(`echo "${listStr}" |
								fzf --reverse --cycle --ansi \
	 								--preview-window=70% --preview=" [[ {} = 'Dependencies' ]] || [[ {} = 'DevDependencies' ]] || npm info {} "`, {
								stdio: 'inherit',
								shell: true
							});
						})
						.catch(err => console.log(chalk.redBright(err)));

				} else {
					return defaultNodeFzf();
				}

			}).catch(err => console.log(err));

		},


		print() {
			npmDependencies.npmList().default();
		}
	};
};


function defaultNodeFzf() {
	console.log(`Warning: The default node-fzf doesn't have preview option`);

	return npmDependencies.npmList().raw()
		.then(list => {
			list.forEach(i => {
				if (i.includes('Dependencies') || i.includes('DevDependencies')) {
					list.splice(list.indexOf(i), 1);
				}
			});

			return nfzf(list);
		})
		.then(i => {
			const {
				selected,
				query
			} = i;
			if (!selected) {
				console.log('No matches for:', query);
			}
			console.log(selected.value);
			return;
		})
		.catch(err => console.log(chalk.redBright(err)));
}


const npmListDetails = () => {
	return npmDependencies.npmListDetails();
};


module.exports = {
	npmList,
	npmListDetails
};
