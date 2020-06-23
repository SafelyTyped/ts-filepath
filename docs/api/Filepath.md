```typescript
// how to import into your own code
import { Filepath } from "@safelytyped/filepath";

// our base class and interface can be found here:
import { RefinedString, Value } from "@safelytyped/core-types";

/**
 * `Filepath` is a safe type. It represents a path to an item on
 * a (possibly local) filesystem.
 *
 * It acts as a wrapper around NodeJS's `path` module.
 *
 * @category Filepath
 */
export class Filepath extends RefinedString implements Value<string> {

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
    );

    /**
     * `base` is for keeping track of any path that this Filepath
     * is built from, relative to, and the like.
     *
     * Useful for tracking parent paths when resolving '$ref' entries
     * in JSON schema and the like.
     */
    public readonly base: string;

    /**
     * `pathApi` is the API to use for all path operations.
     *
     * By default, this is the Node JS `path` module for your platform
     * (`path.windows` or `path.posix`).
     */
    public readonly pathApi: string;

    // =======================================================================
    //
    // pathApi wrappers
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
    public basename(ext?: string): string;

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
    ): Filepath;

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
    public extname(): string;

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
    public isAbsolute(): boolean;

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
    public join(...paths: string[]): Filepath;

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
    public parse(): path.ParsedPath;

    /**
     * `relative()` is a wrapper around NodeJS's `path.relative()`.
     *
     * `relative()` calculates a relative path between `from` and `to`.
     * `from` is this Filepath.
     *
     * If `from` and `to` point to the same path (after calling
     * {@link PathApi.resolve} on them both), and empty string is returned.
     *
     * @param to
     * Where do you want the relative path to go to?
     * @returns
     * - An empty string if `from` and `to` point to the same path.
     * - The relative path otherwise.
     */
    public relative(to: Filepath): string;

    /**
     * `resolve()` is a wrapper around NodeJS's `path.resolve()`.
     *
     * `resolve()` combines this Filepath and the given path segments into
     *  an absolute path.
     *
     * It works from right-to-left (from the last segment backwards), and
     * it stops as soon as an absolute path has been constructed.
     *
     * Zero-length path segments are ignored.
     *
     * If the assembled path is a relative path, it is treated as a relative
     * path to the current working directory, and converted into an
     * absolute path.
     *
     * The assembled path is normalised before being returned. Trailing
     * path separators are removed.
     *
     * If no path segments are passed in, `resolve()` returns the absolute
     * path of resolving `this.valueOf()` against `this.base`. It's
     * a good way to get the absolute path of this Filepath. If this Filepath
     * doesn't have a `base`, it uses the process's current working directory.
     *
     * The returned Filepath will have the same `base` path and
     * same `pathApi` that this Filepath does.
     *
     * @returns
     * The assembled, normalised Filepath. Guaranteed to be an absolute path.
     */
    public resolve(...paths: string[]): Filepath;

    /**
     * `toNamespacedPath()` is a wrapper around NodeJS's
     * `path.toNamespacedPath()`.
     *
     * `toNamespacedPath()` behaves differently on Windows and on POSIX.
     *
     * On Windows, it converts this Filepath to the equivalent namespace-prefixed
     * path: https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces.
     *
     * On POSIX, a new Filepath is returned, containing the unmodified
     * `Filepath.toValue()`.
     *
     * @returns
     * - on Windows, the namespaced path.
     * - on POSIX, the unmodified path.
     */
    public toNamespacedPath(): Filepath;

    // =======================================================================
    //
    // INHERITED METHODS
    //
    // -----------------------------------------------------------------------

    /**
     * `[Symbol.toPrimitive]()` supports Javascript auto-conversion to
     * a string or number.
     */
    public [ Symbol.toPrimitive ](hint: PrimitiveHint): string | number;

    /**
     * valueOf() returns the wrapped value.
     *
     * For types passed by reference, we do NOT return a clone of any kind.
     * You have to be careful not to accidentally change this value.
     *
     * @returns the data that is stored in this object.
     */
    public valueOf(): T {
        return this._value;
    }

    /**
     * implementsValue() is a helper method for the {@link isValue} type guard
     * function.
     */
    public implementsValue(): this is Value<T>;
}
```