/**
 * Fuzzy search recent global installs with fzf
 *
 */

// Dependencies
const chalk = require('chalk');
const spawn = require('child_process').spawn;
const util = require('util');

// Default to node-fzf, the much less capable implementation of fzf, only when fzf is not installed.
// Using node-fzf will lose many features
const nfzf = require('node-fzf');
const commandExists = util.promisify(require('command-exists'));

// Local dependencies
const {
	npmScripts,
	stringUtil
} = require('@hankchanocd/npmlist');


module.exports = () => {
	return {
		fzf() {
			commandExists('fzf').then(ans => {
					if (!ans) {
						return defaultNodeFzf();
					} else {
						return fzf();
					}
				})
				.catch(err => console.log(chalk.redBright(err)));

		},

		print() {
			npmScripts().default();
		}
	};
};

async function fzf() {
	let result = await npmScripts().raw();

	return spawn(`echo "${result}" | tr ',' '\n' |
								fzf --reverse --cycle --ansi --height=40% | tr ' ' '\n' | head -n 1 | xargs npm run `, {
		stdio: 'inherit',
		shell: true
	});
}

async function defaultNodeFzf() {
	let result = await npmScripts().raw();

	nfzf(result, function (result) {
		const {
			selected,
			query
		} = result;
		if (!selected) {
			return console.log('No matches for:', query);
		}

		let key = selected.value.split(' ')[0];
		key = stringUtil.getRidOfColors(key);
		key = stringUtil.getRidOfQuotationMarks(key);

		spawn('npm', ['run', key], {
			stdio: [process.stdin, process.stdout, process.stderr]
		});
	});
}
