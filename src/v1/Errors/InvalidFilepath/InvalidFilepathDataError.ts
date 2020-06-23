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
    AppError,
    AppErrorData,
    makeHttpStatusCode,
    makeStructuredProblemReport
} from "@safelytyped/core-types";

import { MODULE_NAME } from "../defaults/MODULE_NAME";
import { InvalidFilepathData } from "./InvalidFilepathData";

/**
 * `InvalidFilepathDataError` is thrown whenever we're given an
 * invalid value to {@link makeFilepath}.
 *
 * @category Errors
 */
export class InvalidFilepathDataError extends AppError<InvalidFilepathData> {
    public constructor(params: InvalidFilepathData & AppErrorData) {
        const spr = makeStructuredProblemReport<InvalidFilepathData>({
            definedBy: MODULE_NAME,
            description: "input falls outside the range of a valid Filepath",
            errorId: params.errorId,
            extra: { public: params.public },
            status: makeHttpStatusCode(422),
        });

        super(spr);
    }
}