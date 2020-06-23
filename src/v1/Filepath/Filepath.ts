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
        super(mustBeFilepathData, input, { onError });

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

}