// tslint:disable: no-unused-expression
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
import { AnyAppError } from "@safelytyped/core-types";
import { expect } from "chai";
import { describe } from "mocha";

import { ValidFilepaths } from "../_fixtures/Filepaths";
import { DummyPathApi } from "../_fixtures/PathApi";
import { Filepath } from "./Filepath";


describe("Filepath()", () => {
    describe(".constructor", () => {
        describe("accepts any valid filepath", () => {
            ValidFilepaths.forEach(inputValue => {
                it("accepts " + JSON.stringify(inputValue), () => {
                    const actualValue = new Filepath(inputValue);
                    expect(actualValue).to.be.instanceOf(Filepath);
                    expect(actualValue.valueOf()).to.equal(inputValue);
                });
            });
        });

        describe("user-supplied options", () => {
            describe("`base` option", () => {
                it("accepts a `base` option", () => {
                    const inputValue = "/this/is/a/test";

                    const actualValue = new Filepath("dummy", { base: inputValue });
                    expect(actualValue.base).to.equal(inputValue);
                });
            });

            describe("`onError` option", () => {
                it("accepts an `onError` option", () => {
                    const inputValue = (x: AnyAppError): never => {
                        throw x;
                    };

                    // at the moment, we've no way to trigger the onError
                    // handler at all
                    const unit = new Filepath("dummy", { onError: inputValue });
                    expect(unit).to.be.instanceOf(Filepath);
                });
            })

            describe("`pathApi` option", () => {
                it("accepts a `pathApi` option", () => {
                    const inputValue = new DummyPathApi();

                    const actualValue = new Filepath("dummy", { pathApi: inputValue });
                    expect(actualValue.pathApi).to.equal(inputValue);
                });
            });
        });
    });

    describe(".base", () => {
        it("is `undefined` by default", () => {
            const unit = new Filepath("dummy");

            expect(unit.base).to.be.undefined;
        });

        it("contains the user-supplied `base` option", () => {
            const inputValue = "/this/is/a/test";

            const unit = new Filepath("dummy", { base: inputValue });
            expect(unit.base).to.equal(inputValue);
        });
    });
});