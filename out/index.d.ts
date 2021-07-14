import { Uri } from "vscode";
/**
 * The offense's severity.
 */
export declare enum LinterOffenseSeverity {
    error = 0,
    warning = 1,
    information = 2,
    hint = 3
}
export declare type LinterOffense = {
    /**
     * The offense public code. This identifies the offense and will be used as
     * part of the diagnostic identifier.
     */
    code: string;
    /**
     * The offense message.
     */
    message: string;
    /**
     * The linter name that returned the offense. This **must** match the linter
     * name specified on the extension configuration.
     */
    source: string;
    /**
     * The document uri that's associated with this offense.
     */
    uri: Uri;
    /**
     * The type of offense.
     */
    severity: LinterOffenseSeverity;
    /**
     * The offense's starting line.
     * Must be zero-indexed and equal to or greater than zero.
     */
    lineStart: number;
    /**
     * The offense's starting column.
     * Must be zero-indexed and equal to or greater than zero.
     */
    columnStart: number;
    /**
     * The offense's ending line.
     * Must be zero-indexed and equal to or greater than zero.
     * Some linters don't return this info, so you can use the line start.
     */
    lineEnd: number;
    /**
     * The offense's ending column.
     * Must be zero-indexed and equal to or greater than zero.
     * Some linters don't return this info, so you can use the line start.
     */
    columnEnd: number;
    /**
     * Specify whether this offense can be fixed or not.
     * This will be used in conjunction with "fix-one" capability.
     */
    correctable: boolean;
    /**
     * The documentation url for this offense.
     */
    docsUrl?: string;
};
export declare type LinterParams = {
    /**
     * The document uri.
     */
    uri: Uri;
    /**
     * The command stdout output.
     */
    stdout: string;
    /**
     * The command stderr output.
     */
    stderr: string;
    /**
     * The command exit code.
     */
    status: number;
};
export declare type Line = {
    text: string;
    number: number;
};
/**
 * The `ignore-eol` function.
 * This function must return the current with a end-of-line (eol) pragma to
 * ignore the offense.
 */
export declare type LinterGetIgnoreEolPragmaFunction = (params: {
    line: Line;
    code: string;
}) => string;
/**
 * The `ignore-line` function.
 * This function must will receive the previous line (which could also contain)
 * a pragma instruction to ignore the next line with the offense.
 */
export declare type LinterGetIgnoreLinePragmaFunction = (params: {
    line: Line;
    code: string;
    indent: string;
}) => string;
/**
 * The `ignore-file` function.
 */
export declare type LinterGetIgnoreFilePragmaFunction = (params: {
    line: Line;
    code: string;
    indent: string;
}) => string;
/**
 * The function that processes the fixed output.
 * Some linters return a different format that needs to be parsed, and this
 * function allows us to do it so.
 */
export declare type LinterParseFixOutputFunction = (params: {
    input: string;
    stdout: string;
    stderr: string;
}) => string;
/**
 * The function that parses either stdout/stderr and return a list of offenses
 * that will be displayed on the UI.
 */
export declare type LinterGetOffensesFunction = (params: LinterParams) => LinterOffense[];
/**
 * Define a linter api.
 */
export declare type Linter = {
    getOffenses: LinterGetOffensesFunction;
    getIgnoreEolPragma?: LinterGetIgnoreEolPragmaFunction;
    getIgnoreLinePragma?: LinterGetIgnoreLinePragmaFunction;
    getIgnoreFilePragma?: LinterGetIgnoreFilePragmaFunction;
    parseFixOutput?: LinterParseFixOutputFunction;
};
/**
 * The command that will be executed.
 * The list must contain variables that will be replaced.
 *
 * The built-in variables are:
 *
 * - `$file`: the full file path.
 * - `$extension`: the file's extension, in lowercase.
 * - `$config`: the configuration file that will be used.
 * - `$debug`: whether debug mode is enabled or not.
 * - `$lint`: whether the command that will be executed is for linting.
 * - `$language`: the document's language id.
 * - `$code`: the offense's code,
 * - `$fixAll`: `true` when trying to fix the whole file.
 * - `$fixOne`: `true` when trying to fix one offense.
 * - `$fixCategory`: `true` when trying to fix one whole category.
 */
export declare type Command = string[] | string[][];
declare type LinterConfigType = {
    /**
     * The linter name.
     * Must match the extension's name.
     * E.g. if you extension is called `fnando.vscode-luacheck`, then you should
     * use `luacheck` as the linter name.
     */
    name: string;
    /**
     * The command that will be executed.
     */
    command: Command;
    /**
     * A list of config files that will be searched.
     */
    configFiles: string[];
    /**
     * Determines whether the linter is enabled or not.
     */
    enabled: boolean;
    /**
     * A list of languages that will be matched.
     * @see {@link https://code.visualstudio.com/docs/languages/identifiers}
     */
    languages: string[];
    /**
     * The list of linter capabilities.
     *
     * - `ignore-all`
     * - `ignore-line`
     * - `ignore-eol`
     * - `fix-one`
     * - `fix-category`
     * - `fix-all`
     */
    capabilities: string[];
    /**
     * The custom arguments that will be defined.
     * There are some semantics you can use, for instance, setting a variable when
     * a languages is matched.
     *
     * @example
     * ```json
     * {
     *   "args": {
     *     "$ruby": {
     *       "languages": ["ruby"]
     *     }
     *   }
     * }
     * ```
     */
    args?: {
        [key: string]: {
            languages?: string[];
            extensions?: string[];
        };
    };
    /**
     * The linter's website.
     */
    url: string;
    /**
     * When linter should be ran. Right now, the only accepted value is
     * `$is-rails`, which identifies whether the current directory is a Ruby on
     * Rails application by checking for a Gemfile that matches `gem "rails"`.
     */
    when: string[];
    /**
     * @private
     */
    importPath?: string;
};
export declare type LinterConfig = LinterConfigType & {
    [key in keyof LinterConfigType]: unknown;
};
export {};
