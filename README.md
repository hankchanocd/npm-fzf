# npm-fzf  &nbsp;&nbsp; [![npm](https://img.shields.io/npm/v/npm-fzf.svg)](https://www.npmjs.com/package/npm-fzf) [![Build Status](https://travis-ci.org/hankchanocd/npm-fzf.svg?branch=master)](https://travis-ci.org/hankchanocd/npm-fzf) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Known Vulnerabilities](https://snyk.io/test/github/hankchanocd/npm-fzf/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hankchanocd/npm-fzf?targetFile=package.json) [![Github issues](https://img.shields.io/github/issues/hankchanocd/npm-fzf.svg)](https://github.com/hankchanocd/npm-fzf/issues)

> Fuzzy search npm modules with `fzf`

`npf` fuzzy search a npm module with [`fzf`](https://github.com/junegunn/fzf), making a more fulfilling search experience.

## Requirements

(Must): `npf` requires Node 8 for runtime or above.

(Highly Recommended): [`fzf`](https://github.com/junegunn/fzf) is used heavily by `npf`. If `fzf` is not installed, `npf` will default to a much less capable sibling, [`node-fzf`](https://github.com/talmobi/node-fzf) - `fzf`'s implementation in Node.

## CLI

```bash
$ npm install -g npm-fzf
```

## Usage

```
Usage: npf [option] [name]

Fuzzy search npm modules with fzf

Options:
  -v, --version     output the version number
  -l, --local       list local dependencies, which is also the default feature
  -g, --global      list global modules
  -t, --time        show the latest global installs
  -s, --scripts     list/execute npm scripts
  -d, --details     include details to each dependency, but disable the default fuzzy mode
  -a, --all         a flavor flag that shows all available information on any feature flag
  -P, --no-preview  disable the default fzf preview mode
  -F, --no-fuzzy    disable the default fuzzy mode and resort to stdout
  -h, --help        output usage information

  Examples:
    npf, a fzf list with preview of local dependencies
    npf -t, a fzf list of latest global installs
    npf -s, a fzf list of npm scripts using fzf
    npf -g --no-preview, a fuzzy list with no preview of global installs
    npf -s --no-fuzzy, a normal list of npm scripts
    npf -g --details, a normal, detailed list of global installs
    npf [module], a fuzzy list with preview of a module's dependencies fetched from NPM registry
```

## Tests

  To perform unit tests and integration tests, simply run `npm test`. (Need Help)

## Changelog

  **2018-Nov-15:** `v1` published.

## Contribution

If you have a suggestion, leave it in [Issues](https://github.com/hankchanocd/npm-fzf/issues) for discussion first. I will reply in no more than 3 days. See [here](./CONTRIBUTING.md) on how to contribute.

[`fzf`](https://github.com/junegunn/fzf) empowers many features that would otherwise be hard to imagine. If you haven't of `fzf`, check out junegunn's [`fzf`](https://github.com/junegunn/fzf). Check out my [Dotfiles](https://gitlab.com/hankchanocd/dotfiles/tree/master) to see more use cases of `fzf`.

## License

[MIT](./LICENSE.md)
