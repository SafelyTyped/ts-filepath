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
import path from "path";

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

        describe("the `input` parameter", () => {
            it("normalises the given path before storing it", () => {
                const inputLocation = "this/hasnot/../has/been/./normalised";
                const dummyApi = new DummyPathApi();
                dummyApi.normalizeResponses = [path.posix.normalize(inputLocation)];

                const expectedCallList = [
                    "normalize()",
                ];
                const expectParamList = [
                    inputLocation,
                ];

                const unit = new Filepath(inputLocation, { pathApi: dummyApi });
                expect(unit.valueOf()).to.equal("this/has/been/normalised");

                const actualCallList = dummyApi.calledList;
                const actualParamList = dummyApi.paramList;

                expect(actualCallList).to.eql(expectedCallList);
                expect(actualParamList).to.eql(expectParamList);
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

    describe(".pathApi", () => {
        it("is the NodeJS path module by default", () => {
            const unit = new Filepath("dummy");
            const actualValue = unit.pathApi;

            expect(actualValue === path.posix || actualValue === path.win32).to.equal(true);
        });

        it("contains the user-supplied `pathApi` option", () => {
            const inputValue = new DummyPathApi();

            const unit = new Filepath("dummy", { pathApi: inputValue });
            expect(unit.pathApi).to.equal(inputValue);
        });
    });

    describe(".basename()", () => {
        it("returns the basename of the Filepath", () => {
            const inputLocation = process.cwd();
            const expectedValue = path.basename(process.cwd());

            const unit = new Filepath(inputLocation);
            const actualValue = unit.basename();

            expect(actualValue).to.equal(expectedValue);
        });

        it("strips the extension from the Filepath, if it matches", () => {
            const inputLocation = "example.ts";
            const expectedValue = "example";

            const unit = new Filepath(inputLocation);
            const actualValue = unit.basename(".ts");

            expect(actualValue).to.equal(expectedValue);
        });

        it("preserves the extension of the Filepath, if it does not match", () => {
            const inputLocation = "example.ts";
            const expectedValue = "example.ts";

            const unit = new Filepath(inputLocation);
            const actualValue = unit.basename(".php");

            expect(actualValue).to.equal(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const inputLocation = "example.ts";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "basename()",
                "basename()",
            ];
            const expectParamList = [
                "example.ts",
                ".php",
                "example.ts",
                null,
            ];

            const unit = new Filepath(inputLocation, { pathApi: dummyApi });
            expect(unit.valueOf()).to.equal("example.ts");

            dummyApi.reset();

            unit.basename(".php");
            unit.basename();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".dirname()", () => {
        it("returns the name of the parent, as a Filepath", () => {
            const unit = new Filepath("/tmp", { pathApi: path.posix });

            const expectedValue = new Filepath("/", { pathApi: path.posix});
            const actualValue = unit.dirname();

            expect(actualValue).to.eql(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const inputLocation = "/tmp";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "dirname()",

                // this is called by the constructor of the new Filepath
                // that unit.dirname() builds
                "normalize()",
            ];
            const expectParamList = [
                // from unit.dirname()
                "/tmp",

                // from the retval.constructor()
                "/",
            ];

            const unit = new Filepath(inputLocation, { pathApi: dummyApi });
            expect(unit.valueOf()).to.equal("/tmp");

            dummyApi.reset();
            dummyApi.dirnameResponses = ["/"];
            dummyApi.normalizeResponses = ["/"];

            unit.dirname();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".extname()", () => {
        it("returns the Filepath's extension", () => {
            const unit = new Filepath("example.ts", { pathApi: path.posix });

            const expectedValue = ".ts"
            const actualValue = unit.extname();

            expect(actualValue).to.eql(expectedValue);
        });

        it("returns an empty string if the Filepath has no extension", () => {
            const unit = new Filepath("example", { pathApi: path.posix });

            const expectedValue = ""
            const actualValue = unit.extname();

            expect(actualValue).to.eql(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const inputLocation = "example.ts";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "extname()",
            ];
            const expectParamList = [
                // from unit.extname
                "example.ts",
            ];

            const unit = new Filepath(inputLocation, { pathApi: dummyApi });
            expect(unit.valueOf()).to.equal("example.ts");

            dummyApi.reset();
            dummyApi.extnameResponses = [".ts"];

            unit.extname();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".isAbsolute()", () => {
        it("returns true if the Filepath contains an absolute path", () => {
            const unit = new Filepath("/tmp", { pathApi: path.posix });
            const expectedValue = true;

            const actualValue = unit.isAbsolute();

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns false if the Filepath contains a relative path", () => {
            const unit = new Filepath("./tmp", { pathApi: path.posix });
            const expectedValue = false;

            const actualValue = unit.isAbsolute();

            expect(actualValue).to.equal(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const inputLocation = "example.ts";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "isAbsolute()",
            ];
            const expectParamList = [
                // from unit.isAbsolute()
                "example.ts",
            ];

            const unit = new Filepath(inputLocation, { pathApi: dummyApi });
            expect(unit.valueOf()).to.equal("example.ts");

            dummyApi.reset();
            dummyApi.isAbsoluteResponses = [ true ];

            unit.isAbsolute();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".join()", () => {
        it("appends the given paths to the Filepath", () => {
            const unit = new Filepath(
                "/tmp/this/is/an/example",
                { pathApi: path.posix }
            );
            const expectedValue = new Filepath(
                "/tmp/this/is/another/example",
                { pathApi: path.posix }
            );

            const actualValue = unit.join("..", "..", "another/example");
            expect(actualValue).to.eql(expectedValue);
        });

        it("returns a Filepath that has the same `base` as the original Filepath", () => {
            const expectedBase = "/tmp/this/is";
            const unit1 = new Filepath(
                "an/example",
                {
                    pathApi: path.posix,
                    base: expectedBase
                }
            );

            const unit2 = unit1.join("..", "..", "another/example");
            const actualBase = unit2.base;

            expect(actualBase).to.eql(expectedBase);
        });

        it("uses the provided pathApi", () => {
            const inputLocation = "/tmp/this/isan/example";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = ["/tmp/this/is/an/example"];

            const expectedCallList = [
                // from unit.join()
                "join()",

                // from the retval.constructor
                "normalize()",
            ];
            const expectParamList = [
                // from unit.join()
                [
                    "/tmp/this/is/an/example",
                    "..",
                    "..",
                    "another/example",
                ],

                // from the retval.constructor
                "/tmp/this/is/another/example",
            ];

            const unit = new Filepath(
                inputLocation,
                { pathApi: dummyApi }
            );
            expect(unit.valueOf()).to.equal("/tmp/this/is/an/example");

            dummyApi.reset();
            dummyApi.joinResponses = ["/tmp/this/is/another/example"];
            dummyApi.resolveResponses = ["/tmp/this/is/another/example"];
            dummyApi.normalizeResponses = ["/tmp/this/is/another/example"];

            unit.join("..", "..", "another/example");
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".parse()", () => {
        it("breaks down the Filepath into consituent parts", () => {
            const unit = new Filepath("/tmp/example/file.ts");
            const expectedValue: path.ParsedPath = {
                "base": "file.ts",
                "dir": "/tmp/example",
                "ext": ".ts",
                "name": "file",
                "root": "/"
            };

            const actualValue = unit.parse();
            expect(actualValue).to.eql(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = ["/tmp/example/file.ts"];

            const expectedCallList = [
                // from unit.parse()
                "parse()",
            ];
            const expectParamList = [
                // from unit.parse()
                "/tmp/example/file.ts",
            ];

            const unit = new Filepath(
                "/tmp/example/file.ts",
                { pathApi: dummyApi }
            );
            expect(unit.valueOf()).to.equal("/tmp/example/file.ts");

            dummyApi.reset();

            unit.parse();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".relative()", () => {
        it("returns the relative path between two Filepaths", () => {
            const unit1 = new Filepath(
                "/this/is/an/example",
                { pathApi: path.posix }
            );
            const unit2 = new Filepath(
                "/this/is/another/example",
                { pathApi: path.posix }
            );

            const expectedValue = "../../another/example";
            const actualValue = unit1.relative(unit2);

            expect(actualValue).to.eql(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const dummyApi = new DummyPathApi();
            dummyApi.resolveResponses = ["/tmp/this/is/an/example"];
            dummyApi.normalizeResponses = ["/tmp/this/is/an/example"];

            const expectedCallList = [
                // from unit.relative()
                "relative()",
            ];
            const expectParamList = [
                // from unit.relative()
                "/tmp/this/is/an/example",
                "/tmp/this/is/another/example"
            ];

            const unit1 = new Filepath(
                "/tmp/this/is/an/example",
                { pathApi: dummyApi }
            );
            expect(unit1.valueOf()).to.equal("/tmp/this/is/an/example");
            const unit2 = new Filepath(
                "/tmp/this/is/another/example",
                { pathApi: path.posix }
            );
            expect(unit2.valueOf()).to.equal("/tmp/this/is/another/example");

            dummyApi.reset();

            unit1.relative(unit2);
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

});