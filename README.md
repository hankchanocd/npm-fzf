# npm-fzf &nbsp;&nbsp; [![npm](https://img.shields.io/npm/v/npm-fzf.svg)](https://www.npmjs.com/package/npm-fzf) [![Build Status](https://travis-ci.org/hankchanocd/npm-fzf.svg?branch=master)](https://travis-ci.org/hankchanocd/npm-fzf) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Known Vulnerabilities](https://snyk.io/test/github/hankchanocd/npm-fzf/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hankchanocd/npm-fzf?targetFile=package.json) [![Github issues](https://img.shields.io/github/issues/hankchanocd/npm-fzf.svg)](https://github.com/hankchanocd/npm-fzf/issues)

> Fuzzy search npm modules with `fzf`

`npm-fzf`, also called `npf`, fuzzy search npm modules with [`fzf`](https://github.com/junegunn/fzf), creating a more fulfilling search experience at terminal.

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

# Feature flags
  -l, --local       list local dependencies, which is also the default feature
  -g, --global      list global modules
  -t, --time        show the latest global installs
  -s, --scripts     list/execute npm scripts

# Flavor flags
  -d, --details     include details to each dependency, but disable the default fuzzy mode
  -a, --all         a flavor flag that shows all available information on any feature flag
  -P, --no-preview  disable the default fzf preview mode
  -F, --no-fuzzy    disable the default fuzzy mode and resort to stdout

  -h, --help        output usage information
```

## Examples

### Global modules

```bash
$ npf -g
```

<p align="center"><img src="https://raw.githubusercontent.com/hankchanocd/npm-fzf/master/images/global_demo.png" width="650"></p>

### Recent global installs

A quick refresher on what the heck it's installed/upgraded globally in the recent past

```bash
$ npf -t
```

<p align="center"><img src="https://raw.githubusercontent.com/hankchanocd/npm-fzf/master/images/recent_demo.png" width="650"></p>

### Execute module's npm scripts

```bash
$ npf -s
```

<p align="center"><img src="https://raw.githubusercontent.com/hankchanocd/npm-fzf/master/images/scripts_demo.png" width="650"></p>

### Fetch from NPM registry

Fetch the module's latest version by default, unless a version is specified

```bash
$ npf express
```

<p align="center"><img src="https://raw.githubusercontent.com/hankchanocd/npm-fzf/master/images/fetch_module_demo.png" width="650"></p>

### Turn off preview mode

Preview mode uses `fzf --preview` underneath and is turned on in most cases by default. You can also opt for `--no-preview` to turn off the default preview mode.

```bash
$ npf -t --no-preview
$ npf -g --no-preview
$ npf -l --no-preview
$ npf express --no-preview
```

<p align="center"><img src="https://raw.githubusercontent.com/hankchanocd/npm-fzf/master/images/no-preview-demo.png" width="650"></p>

### Turn off fuzzy mode

Fuzzy mode is by default on. You can also opt for `--no-fuzzy` to turn it off.

```bash
$ npf -t --no-fuzzy
$ npf -g --no-fuzzy
```

<p align="center"><img src="https://raw.githubusercontent.com/hankchanocd/npm-fzf/master/images/no-fuzzy-demo.png" width="650"></p>

### Details flag

Applied to both local dependencies and global installs

```
$ npf --details
$ npf -g --details
```

<p align="center"><img src="https://raw.githubusercontent.com/hankchanocd/npm-fzf/master/images/details_demo.png" width="650"></p>

## API

`npf` uses [`npmlist`](https://github.com/hankchanocd/npmlist)'s API for getting modules' dependencies. `npf` itself does not expose any API.

```bash
$ npm install @hankchanocd/npmlist
```

## Tests

To perform unit tests and integration tests, simply run `npm test`. (Need Help)

## Changelog

**2018-Nov-15:** `v1` published.

## Contribution

If you have a suggestion, leave it in [Issues](https://github.com/hankchanocd/npm-fzf/issues) for discussion first. I will reply in no more than 3 days. See [here](./CONTRIBUTING.md) on how to contribute.

[`fzf`](https://github.com/junegunn/fzf) empowers many features that would otherwise be hard to imagine. If you haven't heard of `fzf`, check out junegunn's [`fzf`](https://github.com/junegunn/fzf). Check out my [Dotfiles](https://gitlab.com/hankchanocd/dotfiles/tree/master) to see more use cases of `fzf`.

## License

[MIT](./LICENSE.md)
