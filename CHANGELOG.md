# CHANGELOG

## Introduction

This CHANGELOG tells you:

* when a release was made
* what is in each release

It also tells you what changes have been completed, and will be included in the next tagged release.

For each release, changes are grouped under these headings:

* _Backwards-Compatibility Breaks_: a list of any backwards-compatibility breaks
* _New_: a list of new features. If the feature came from a contributor via a PR, make sure you link to the PR and give them a mention here.
* _Fixes_: a list of bugs that have been fixed. If there's an issue for the bug, make sure you link to the GitHub issue here.
* _Dependencies_: a list of dependencies that have been added / updated / removed.
* _Tools_: a list of bundled tools that have been added / updated / removed.

## develop branch

The following changes have been completed, and will be included in the next tagged release.

### Fixes

* Added simultaneous support for CommonJS and ESM runtime environments

### Dependencies

* Upgraded to Typescript v5.2

### Tools

* Switched from tslint to eslint

## v0.1.1

Released Wednesday, 26th May 2021.

### Dependencies

* Upgraded all dependencies to the latest version.

## v0.1.0

Released Tuesday, 23rd June 2020.

### New

* Errors
  - added `InvalidFilepathDataError`
* Filepath
  - added `Filepath`
    - added `Filepath` `base` option
    - added `Filepath` `pathApi` option
    - added `Filepath.basename()`
    - added `Filepath.dirname()`
    - added `Filepath.extname()`
    - added `Filepath.isAbsolute()`
    - added `Filepath.join()`
    - added `Filepath.parse()`
    - added `Filepath.relative()`
    - added `Filepath.resolve()`
    - added `Filepath.toNamespacedPath()`
  - added `MakeFilepathOptions`
  - added `isFilepathData()`
  - added `makeFilepath()`
  - added `mustBeFilepath()`
  - added `validateFilepathData()`
