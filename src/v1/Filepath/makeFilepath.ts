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

import {
    applyFunctionalOptions,
    FunctionalOption,
    OnErrorOptions,
    SmartConstructor,
    THROW_THE_ERROR,
} from "@safelytyped/core-types";
import path from "path";

import { Filepath } from "./Filepath";
import { MakeFilepathOptions } from "./MakeFilepathOptions";

/**
 * `makeFilepath()` is a smart constructor. It verifies that the
 * `input` contains valid Filepath data, by calling
 * {@link mustBeFilepathData}.
 *
 * @category Filepath
 * @param input
 * This is the data we'll use to create the new Filepath
 * @param onError
 * If `input` fails validation, we'll pass an {@link AppError} to this.
 * @param base
 * Use this to keep track of a parent path of some kind.
 * @param pathApi
 * Use this if you want to pass in your own implementation (e.g. for
 * unit testing)
 * @param fnOpts
 * These are user-supplied functional options.
 * @returns
 * The new Filepath object.
 */
export const makeFilepath: SmartConstructor<string, Filepath, OnErrorOptions, Filepath> = (
    input: string,
    {
        onError = THROW_THE_ERROR,
        pathApi = path,
        base
    }: Partial<MakeFilepathOptions> = {},
    ...fnOpts: FunctionalOption<Filepath, OnErrorOptions>[]
): Filepath => applyFunctionalOptions(
    new Filepath(input, { onError, pathApi, base }),
    { onError },
    ...fnOpts
);