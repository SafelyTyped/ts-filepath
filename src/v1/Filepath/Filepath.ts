//
// Copyright (c) 2020-present Ganbaro Digital Ltd.
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the
//    distribution.
// 3. Neither the names of the copyright holders nor the names of its
//    contributors may be used to endorse or promote products derived
//    from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
import { RefinedString, THROW_THE_ERROR } from "@safelytyped/core-types";
import { PathApi } from "@safelytyped/node-pathapi";
import path from "path";

import { MakeFilepathOptions } from "./MakeFilepathOptions";
import { mustBeFilepathData } from "./mustBeFilepathData";

/**
 * `Filepath` is a safe type.
 *
 * @category Filepath
 */
export class Filepath extends RefinedString {

    /**
     * `#_base` is for keeping track of any path that this Filepath
     * is built from, relative to, and the like.
     *
     * Useful for tracking parent paths when resolving '$ref' entries
     * in JSON schema and the like.
     */
    #_base: string|undefined;

    /**
     * `#_pathApi` is the API to use for all path operations.
     *
     * Useful for passing in your own API when writing unit tests.
     */
    #_pathApi: PathApi;


    /**
     * `#_parts` holds the `path.parse()` result of this Filepath.
     *
     * It's an internal cache, to avoid repeated calls to `path.parse()`
     * from inside `Filepath.parse()`.
     */
    #_parts: path.ParsedPath | undefined;

    /**
     * `Constructor` creates a new `Filepath`.
     *
     * @param input
     * The data we need to build a Filepath.
     * @param onError
     * If `input` fails validation, we pass an {@link AppError}
     * to `onError()`.
     * @param base
     * Use this to keep track of a parent path of some kind.
     * @param pathApi
     * Use this if you want to pass in your own implementation (e.g. for
     * unit testing)
     */
    public constructor(
        input: string,
        {
            onError = THROW_THE_ERROR,
            pathApi = path,
            base
        }: Partial<MakeFilepathOptions> = {}
    ) {
        // we normalise the given path
        super(mustBeFilepathData, pathApi.normalize(input), { onError });

        this.#_base = base;
        this.#_pathApi = pathApi;
    }

    /**
     * `base` is for keeping track of any path that this Filepath
     * is built from, relative to, and the like.
     *
     * Useful for tracking parent paths when resolving '$ref' entries
     * in JSON schema and the like.
     */
    get base() {
        return this.#_base;
    }

    /**
     * `pathApi` is the API to use for all path operations.
     *
     * By default, this is the Node JS `path` module for your platform
     * (`path.windows` or `path.posix`).
     */
    get pathApi() {
        return this.#_pathApi;
    }

    // =======================================================================
    //
    // pathAPi wrappers
    //
    // -----------------------------------------------------------------------

    /**
     * `basename()` is a wrapper around NodeJS's `path.basename()`.
     *
     * `basename` returns the last portion of a path, similar to the Unix
     * `basename` command. Trailing directory separators are ignored,
     * see {@link PathApi.sep}.
     *
     * @param ext
     * An optional file extension to strip (if present).
     * @returns
     * The last portion of the Filepath. If the Filepath` ends in `ext`,
     * that is stripped too.
     */
    public basename(ext?: string): string {
        return this.#_pathApi.basename(this._value, ext);
    }

    /**
     * `dirname()` is a wrapper around NodeJS's `path.dirname()`.
     *
     * The returned Filepath will have the same `base` path and
     * same `pathApi` that this Filepath does.
     *
     * `dirname()` returns the directory name of `path`, similiar to
     * the UNIX `dirname` command. Trailing directory separators are
     * ignored, see {@link PathApi.sep}
     *
     * @returns
     * Everything but the last portion of `path`.
     */
    public dirname(
        {
            onError = THROW_THE_ERROR,
            pathApi = this.#_pathApi,
            base = this.#_base
        }: Partial<MakeFilepathOptions> = {}
    ): Filepath {
        return new Filepath(
            this.#_pathApi.dirname(this._value),
            { onError, pathApi, base }
        );
    }

    /**
     * `extname` is a wrapper around NodeJS's `path.extname()`.
     *
     * `extname()` returns the extension of the Filepath, from the last
     * occurance of the `.` character in the last segment of the path to
     * the end of the string.
     *
     * If there is no `.` in the last segment of the path, or if the only
     * `.` character is the first character of the last segment (ie a
     * UNIX dotfile with no extension), an empty string is returned.
     *
     * @returns
     * - the file extension (starting with a `.`) on success
     * - an empty string otherwise
     */
    public extname(): string {
        return this.#_pathApi.extname(this._value);
    }

    /**
     * `isAbsolute()` is a wrapper around NodeJS's `path.isAbsolute()`.
     *
     * `isAbsolute()` determines if this Filepath is an absolute path or not.
     *
     * An absolute path is a path that starts with a filesystem root
     * segment. Absolute paths are the opposite of relative paths: they
     * don't rely on the current working directory.
     *
     * @returns
     * - `true` if this Filepath is an absolute path.
     * - `false` if this Filepath is a relative path.
     */
    public isAbsolute(): boolean {
        return this.#_pathApi.isAbsolute(this._value);
    }

    /**
     * `join()` is a wrapper around NodeJS's `path.join()`.
     *
     * `join()` combines this Filepath and all the given segments into a
     * single string, using {@link PathApi.sep} as the delimiter, and then
     * normalises that string.
     *
     * Zero-length path segments are ignored.
     *
     * If the normalised string is empty, `join()` returns `.` (the
     * current working directory).
     *
     * The returned Filepath will have the same `base` path and
     * same `pathApi` that this Filepath does.
     *
     * @returns
     * The assembled path. Guaranteed never to be empty.
     */
    public join(...paths: string[]): Filepath {
        return new Filepath(
            this.#_pathApi.join(this._value, ...paths),
            {
                pathApi: this.#_pathApi,
                base: this.#_base
            }
        );
    }

    /**
     * `parse()` is a wrapper around NodeJS's `path.parse()`.
     *
     * `parse()` breaks down this Filepath into separate parts. Trailing
     * directory separators are ignored.
     *
     * The returned object can include any / all of:
     *
     * - `root`: the root of the filesystem, if the path is absolute
     * - `dir`: all the root and folder segments of the path
     * - `base`: the filename segment of the path
     * - `name`: the filename segment of the path, minus the extension
     * - `ext`: the extension segment of the path, starting with a `.`
     *
     * All of these are strings. Use {@link PathApi.format} to convert
     * this back into a single path string.
     *
     * @returns
     * The breakdown of this Filepath.
     */
    public parse(): path.ParsedPath {
        // we calculate it once, and then stash it
        // for repeated reference
        const retval = this.#_parts || this.#_pathApi.parse(this._value);
        this.#_parts = this.#_parts || retval;

        // all done
        return retval;
    }

}