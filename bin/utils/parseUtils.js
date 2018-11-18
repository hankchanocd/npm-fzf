/**
 * ParseUtils parse many different things
 *
 */


// Fail if multiple flags given at the same time
module.exports.failIfMultipleFlags = function (flags = {}, {
	positive = [],
	negative = [],
	errMsg = ''
}) {
    let count = 0;

	Object.keys(flags).forEach(i => {
		if (flags[i] && positive.length > 0) { // If both the option and positive have value
			positive.forEach(f => {
				if (i == f) {
					count += 1;
				}
			});
		}

		if (!flags[i] && negative.length > 0) { // If the option has false value and negative have value
			negative.forEach(f => {
				if (i == f) {
					count += 1;
				}
			});
		}

		if (count >= 2) {
			console.log(`${errMsg}. I'm confused.`);
			return process.exit(1);
		}
	});
};
