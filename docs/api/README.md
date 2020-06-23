# API Docs

Welcome to `@safelytyped/filepath`!

- [Introduction](#introduction)
  - [What Is A Safe Type?](#what-is-a-safe-type)
  - [Why Use Safe Types?](#why-use-safe-types)
  - [Why A Filepath Type?](#why-a-filepath-type)
- [Our Goals](#our-goals)
  - [Our Design Criteria](#our-design-criteria)

## Introduction

### What Is A Safe Type?

A _safe type_ is a type that can only ever hold legal values.

For example, `Filepath` is a safe type because it can only ever hold a valid filesystem path (it just might not be valid on your computer!).

### Why Use Safe Types?

If your function accepts a _safe type_, your function doesn't need to do its own [defensive programming][Defensive Programming] for robustness.

**Safe types do the defensive programming for you.**

On top of that, we build our _safe types_ using [written coding standards][SafelyTyped Coding Standards].

### Why A Filepath Type?

You might be wondering why you should use `Filepath`, instead of a plain ol' `string`. There's a few reasons why:

* Compile-time checking:

    If you just use strings everywhere, the compiler can't tell a file path from a username. It certainly can't tell you when you accidentally use a username instead of a file path.

    If you use types everywhere, then the compiler can spot when you've passed the wrong kind of string into a function.

* A means to deliver functionality into business logic:

    If you pass typed values into your business logic, it can call methods on those types without having to know whether it's working with a _Filepath_ or a _URL_.

    _Value objects_ can implement [protocols][Protocol] (interfaces that describe behaviours). And business logic can consume and use objects based solely on their protocols, without caring whether they're a _Filepath_ or a _URL_.

* Runtime extensibility:

    Along with [protocols][Protocol], _value objects_ can be augmented at runtime with [extensions][Extension]. You don't have to submit a pull request to our repo and wait for us to merge it; you can create your own extension and use it locally straight away.

## Our Goals

The purpose of this library is to give us the smallest possible, viable [Filepath](Filepath) safe type that adds value to our code.

### Our Design Criteria

There's a couple of things that we wanted out of `Filepath`.

* [Filepath][Filepath]'s API should be very familiar to anyone who already knows NodeJS's `path` module.
* [Filepath][Filepath] should be useful for tracking a data location: a path that's built from a mix of a base path and a location relative to that base path.

[Filepath]: ./Filepath.md
[Branded Type]: https://github.com/SafelyTyped/ts-coding-standards/blob/master/glossary/branded-type.md
[Defensive Programming]: https://github.com/SafelyTyped/ts-coding-standards/blob/master/glossary/defensive-programming.md
[Extension]: https://github.com/SafelyTyped/ts-coding-standards/blob/master/glossary/extension.md
[Protocol]: https://github.com/SafelyTyped/ts-coding-standards/blob/master/glossary/protocol.md
[Refined Type]: https://github.com/SafelyTyped/ts-coding-standards/blob/master/glossary/refined-type.md
[SafelyTyped on GitHub]: https://github.com/SafelyTyped/
[SafelyTyped Coding Standards]: https://github.com/SafelyTyped/ts-coding-standards/