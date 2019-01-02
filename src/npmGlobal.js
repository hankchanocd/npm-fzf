/**
 * npmGlobal.js lists global installs with fzf.
 *
 */

// Dependencies
const chalk = require("chalk");
const spawn = require("child_process").spawn;
const { promisify } = require("es6-promisify");

// Default to node-fzf, the much less capable implementation of fzf, only when fzf is not installed.
// Using node-fzf will lose many features
const nfzf = promisify(require("node-fzf"));
const commandExists = promisify(require("command-exists"));

// Local dependencies
const { npmGlobal } = require("@hankchanocd/npmlist");

module.exports = () => {
	return {
		fzf() {
			commandExists("fzf")
				.then(ans => {
					if (ans) {
						return npmGlobal()
							.then(i => i.simple().raw())
							.then(i =>
								spawn(
									`echo "${i}" | tr ',' '\n' |
								fzf --reverse --cycle --ansi --height=40%`,
									{
										stdio: "inherit",
										shell: true
									}
								)
							)
							.catch(err => console.log(chalk.redBright(err)));
					} else {
						return defaultNodeFzf();
					}
				})
				.catch(err => console.log(err));
		},

		fzfPreview() {
			commandExists("fzf")
				.then(ans => {
					if (ans) {
						return npmGlobal()
							.then(i => i.simple().raw())
							.then(i =>
								spawn(
									`echo "${i}" | tr ',' '\n' |
								fzf --reverse --cycle --ansi \
	 								--preview-window=70% --preview=" echo {} | tr '├──' ' ' | head -n 1 | xargs npm info "`,
									{
										stdio: "inherit",
										shell: true
									}
								)
							)
							.catch(err => console.log(chalk.redBright(err)));
					} else {
						return defaultNodeFzf();
					}
				})
				.catch(err => console.log(err));
		},

		print() {
			npmGlobal()
				.then(i => i.simple().print())
				.catch(err => console.log(chalk.redBright(err)));
		},

		details() {
			npmGlobal()
				.then(i => i.details())
				.catch(err => console.log(chalk.redBright(err)));
		}
	};
};

function defaultNodeFzf() {
	console.log(`Warning: The default node-fzf doesn't have preview option`);

	return npmGlobal()
		.then(i => i.simple().raw())
		.then(i => nfzf(i))
		.then(i => {
			const { selected, query } = i;
			if (!selected) {
				console.log("No matches for:", query);
			} else {
				console.log(selected.value);
			}
			return;
		})
		.catch(err => console.log(chalk.redBright(err)));
}
