import './sourcemap-register.cjs';import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(9925);
const auth_1 = __nccwpck_require__(3702);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 1514:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExecOutput = exports.exec = void 0;
const string_decoder_1 = __nccwpck_require__(1576);
const tr = __importStar(__nccwpck_require__(8159));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),

/***/ 8159:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.argStringToArray = exports.ToolRunner = void 0;
const os = __importStar(__nccwpck_require__(2037));
const events = __importStar(__nccwpck_require__(2361));
const child = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const io = __importStar(__nccwpck_require__(7436));
const ioUtil = __importStar(__nccwpck_require__(1962));
const timers_1 = __nccwpck_require__(9512);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),

/***/ 8090:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashFiles = exports.create = void 0;
const internal_globber_1 = __nccwpck_require__(8298);
const internal_hash_files_1 = __nccwpck_require__(2448);
/**
 * Constructs a globber
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob options
 */
function create(patterns, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield internal_globber_1.DefaultGlobber.create(patterns, options);
    });
}
exports.create = create;
/**
 * Computes the sha256 hash of a glob
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob options
 */
function hashFiles(patterns, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let followSymbolicLinks = true;
        if (options && typeof options.followSymbolicLinks === 'boolean') {
            followSymbolicLinks = options.followSymbolicLinks;
        }
        const globber = yield create(patterns, { followSymbolicLinks });
        return internal_hash_files_1.hashFiles(globber);
    });
}
exports.hashFiles = hashFiles;
//# sourceMappingURL=glob.js.map

/***/ }),

/***/ 1026:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOptions = void 0;
const core = __importStar(__nccwpck_require__(2186));
/**
 * Returns a copy with defaults filled in.
 */
function getOptions(copy) {
    const result = {
        followSymbolicLinks: true,
        implicitDescendants: true,
        matchDirectories: true,
        omitBrokenSymbolicLinks: true
    };
    if (copy) {
        if (typeof copy.followSymbolicLinks === 'boolean') {
            result.followSymbolicLinks = copy.followSymbolicLinks;
            core.debug(`followSymbolicLinks '${result.followSymbolicLinks}'`);
        }
        if (typeof copy.implicitDescendants === 'boolean') {
            result.implicitDescendants = copy.implicitDescendants;
            core.debug(`implicitDescendants '${result.implicitDescendants}'`);
        }
        if (typeof copy.matchDirectories === 'boolean') {
            result.matchDirectories = copy.matchDirectories;
            core.debug(`matchDirectories '${result.matchDirectories}'`);
        }
        if (typeof copy.omitBrokenSymbolicLinks === 'boolean') {
            result.omitBrokenSymbolicLinks = copy.omitBrokenSymbolicLinks;
            core.debug(`omitBrokenSymbolicLinks '${result.omitBrokenSymbolicLinks}'`);
        }
    }
    return result;
}
exports.getOptions = getOptions;
//# sourceMappingURL=internal-glob-options-helper.js.map

/***/ }),

/***/ 8298:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultGlobber = void 0;
const core = __importStar(__nccwpck_require__(2186));
const fs = __importStar(__nccwpck_require__(7147));
const globOptionsHelper = __importStar(__nccwpck_require__(1026));
const path = __importStar(__nccwpck_require__(1017));
const patternHelper = __importStar(__nccwpck_require__(9005));
const internal_match_kind_1 = __nccwpck_require__(1063);
const internal_pattern_1 = __nccwpck_require__(4536);
const internal_search_state_1 = __nccwpck_require__(9117);
const IS_WINDOWS = process.platform === 'win32';
class DefaultGlobber {
    constructor(options) {
        this.patterns = [];
        this.searchPaths = [];
        this.options = globOptionsHelper.getOptions(options);
    }
    getSearchPaths() {
        // Return a copy
        return this.searchPaths.slice();
    }
    glob() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                for (var _b = __asyncValues(this.globGenerator()), _c; _c = yield _b.next(), !_c.done;) {
                    const itemPath = _c.value;
                    result.push(itemPath);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        });
    }
    globGenerator() {
        return __asyncGenerator(this, arguments, function* globGenerator_1() {
            // Fill in defaults options
            const options = globOptionsHelper.getOptions(this.options);
            // Implicit descendants?
            const patterns = [];
            for (const pattern of this.patterns) {
                patterns.push(pattern);
                if (options.implicitDescendants &&
                    (pattern.trailingSeparator ||
                        pattern.segments[pattern.segments.length - 1] !== '**')) {
                    patterns.push(new internal_pattern_1.Pattern(pattern.negate, true, pattern.segments.concat('**')));
                }
            }
            // Push the search paths
            const stack = [];
            for (const searchPath of patternHelper.getSearchPaths(patterns)) {
                core.debug(`Search path '${searchPath}'`);
                // Exists?
                try {
                    // Intentionally using lstat. Detection for broken symlink
                    // will be performed later (if following symlinks).
                    yield __await(fs.promises.lstat(searchPath));
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        continue;
                    }
                    throw err;
                }
                stack.unshift(new internal_search_state_1.SearchState(searchPath, 1));
            }
            // Search
            const traversalChain = []; // used to detect cycles
            while (stack.length) {
                // Pop
                const item = stack.pop();
                // Match?
                const match = patternHelper.match(patterns, item.path);
                const partialMatch = !!match || patternHelper.partialMatch(patterns, item.path);
                if (!match && !partialMatch) {
                    continue;
                }
                // Stat
                const stats = yield __await(DefaultGlobber.stat(item, options, traversalChain)
                // Broken symlink, or symlink cycle detected, or no longer exists
                );
                // Broken symlink, or symlink cycle detected, or no longer exists
                if (!stats) {
                    continue;
                }
                // Directory
                if (stats.isDirectory()) {
                    // Matched
                    if (match & internal_match_kind_1.MatchKind.Directory && options.matchDirectories) {
                        yield yield __await(item.path);
                    }
                    // Descend?
                    else if (!partialMatch) {
                        continue;
                    }
                    // Push the child items in reverse
                    const childLevel = item.level + 1;
                    const childItems = (yield __await(fs.promises.readdir(item.path))).map(x => new internal_search_state_1.SearchState(path.join(item.path, x), childLevel));
                    stack.push(...childItems.reverse());
                }
                // File
                else if (match & internal_match_kind_1.MatchKind.File) {
                    yield yield __await(item.path);
                }
            }
        });
    }
    /**
     * Constructs a DefaultGlobber
     */
    static create(patterns, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new DefaultGlobber(options);
            if (IS_WINDOWS) {
                patterns = patterns.replace(/\r\n/g, '\n');
                patterns = patterns.replace(/\r/g, '\n');
            }
            const lines = patterns.split('\n').map(x => x.trim());
            for (const line of lines) {
                // Empty or comment
                if (!line || line.startsWith('#')) {
                    continue;
                }
                // Pattern
                else {
                    result.patterns.push(new internal_pattern_1.Pattern(line));
                }
            }
            result.searchPaths.push(...patternHelper.getSearchPaths(result.patterns));
            return result;
        });
    }
    static stat(item, options, traversalChain) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note:
            // `stat` returns info about the target of a symlink (or symlink chain)
            // `lstat` returns info about a symlink itself
            let stats;
            if (options.followSymbolicLinks) {
                try {
                    // Use `stat` (following symlinks)
                    stats = yield fs.promises.stat(item.path);
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        if (options.omitBrokenSymbolicLinks) {
                            core.debug(`Broken symlink '${item.path}'`);
                            return undefined;
                        }
                        throw new Error(`No information found for the path '${item.path}'. This may indicate a broken symbolic link.`);
                    }
                    throw err;
                }
            }
            else {
                // Use `lstat` (not following symlinks)
                stats = yield fs.promises.lstat(item.path);
            }
            // Note, isDirectory() returns false for the lstat of a symlink
            if (stats.isDirectory() && options.followSymbolicLinks) {
                // Get the realpath
                const realPath = yield fs.promises.realpath(item.path);
                // Fixup the traversal chain to match the item level
                while (traversalChain.length >= item.level) {
                    traversalChain.pop();
                }
                // Test for a cycle
                if (traversalChain.some((x) => x === realPath)) {
                    core.debug(`Symlink cycle detected for path '${item.path}' and realpath '${realPath}'`);
                    return undefined;
                }
                // Update the traversal chain
                traversalChain.push(realPath);
            }
            return stats;
        });
    }
}
exports.DefaultGlobber = DefaultGlobber;
//# sourceMappingURL=internal-globber.js.map

/***/ }),

/***/ 2448:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashFiles = void 0;
const crypto = __importStar(__nccwpck_require__(6113));
const core = __importStar(__nccwpck_require__(2186));
const fs = __importStar(__nccwpck_require__(7147));
const stream = __importStar(__nccwpck_require__(2781));
const util = __importStar(__nccwpck_require__(3837));
const path = __importStar(__nccwpck_require__(1017));
function hashFiles(globber) {
    var e_1, _a;
    var _b;
    return __awaiter(this, void 0, void 0, function* () {
        let hasMatch = false;
        const githubWorkspace = (_b = process.env['GITHUB_WORKSPACE']) !== null && _b !== void 0 ? _b : process.cwd();
        const result = crypto.createHash('sha256');
        let count = 0;
        try {
            for (var _c = __asyncValues(globber.globGenerator()), _d; _d = yield _c.next(), !_d.done;) {
                const file = _d.value;
                core.debug(file);
                if (!file.startsWith(`${githubWorkspace}${path.sep}`)) {
                    core.debug(`Ignore '${file}' since it is not under GITHUB_WORKSPACE.`);
                    continue;
                }
                if (fs.statSync(file).isDirectory()) {
                    core.debug(`Skip directory '${file}'.`);
                    continue;
                }
                const hash = crypto.createHash('sha256');
                const pipeline = util.promisify(stream.pipeline);
                yield pipeline(fs.createReadStream(file), hash);
                result.write(hash.digest());
                count++;
                if (!hasMatch) {
                    hasMatch = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        result.end();
        if (hasMatch) {
            core.debug(`Found ${count} files to hash.`);
            return result.digest('hex');
        }
        else {
            core.debug(`No matches found for glob`);
            return '';
        }
    });
}
exports.hashFiles = hashFiles;
//# sourceMappingURL=internal-hash-files.js.map

/***/ }),

/***/ 1063:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MatchKind = void 0;
/**
 * Indicates whether a pattern matches a path
 */
var MatchKind;
(function (MatchKind) {
    /** Not matched */
    MatchKind[MatchKind["None"] = 0] = "None";
    /** Matched if the path is a directory */
    MatchKind[MatchKind["Directory"] = 1] = "Directory";
    /** Matched if the path is a regular file */
    MatchKind[MatchKind["File"] = 2] = "File";
    /** Matched */
    MatchKind[MatchKind["All"] = 3] = "All";
})(MatchKind = exports.MatchKind || (exports.MatchKind = {}));
//# sourceMappingURL=internal-match-kind.js.map

/***/ }),

/***/ 1849:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.safeTrimTrailingSeparator = exports.normalizeSeparators = exports.hasRoot = exports.hasAbsoluteRoot = exports.ensureAbsoluteRoot = exports.dirname = void 0;
const path = __importStar(__nccwpck_require__(1017));
const assert_1 = __importDefault(__nccwpck_require__(9491));
const IS_WINDOWS = process.platform === 'win32';
/**
 * Similar to path.dirname except normalizes the path separators and slightly better handling for Windows UNC paths.
 *
 * For example, on Linux/macOS:
 * - `/               => /`
 * - `/hello          => /`
 *
 * For example, on Windows:
 * - `C:\             => C:\`
 * - `C:\hello        => C:\`
 * - `C:              => C:`
 * - `C:hello         => C:`
 * - `\               => \`
 * - `\hello          => \`
 * - `\\hello         => \\hello`
 * - `\\hello\world   => \\hello\world`
 */
function dirname(p) {
    // Normalize slashes and trim unnecessary trailing slash
    p = safeTrimTrailingSeparator(p);
    // Windows UNC root, e.g. \\hello or \\hello\world
    if (IS_WINDOWS && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p)) {
        return p;
    }
    // Get dirname
    let result = path.dirname(p);
    // Trim trailing slash for Windows UNC root, e.g. \\hello\world\
    if (IS_WINDOWS && /^\\\\[^\\]+\\[^\\]+\\$/.test(result)) {
        result = safeTrimTrailingSeparator(result);
    }
    return result;
}
exports.dirname = dirname;
/**
 * Roots the path if not already rooted. On Windows, relative roots like `\`
 * or `C:` are expanded based on the current working directory.
 */
function ensureAbsoluteRoot(root, itemPath) {
    assert_1.default(root, `ensureAbsoluteRoot parameter 'root' must not be empty`);
    assert_1.default(itemPath, `ensureAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Already rooted
    if (hasAbsoluteRoot(itemPath)) {
        return itemPath;
    }
    // Windows
    if (IS_WINDOWS) {
        // Check for itemPath like C: or C:foo
        if (itemPath.match(/^[A-Z]:[^\\/]|^[A-Z]:$/i)) {
            let cwd = process.cwd();
            assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            // Drive letter matches cwd? Expand to cwd
            if (itemPath[0].toUpperCase() === cwd[0].toUpperCase()) {
                // Drive only, e.g. C:
                if (itemPath.length === 2) {
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}`;
                }
                // Drive + path, e.g. C:foo
                else {
                    if (!cwd.endsWith('\\')) {
                        cwd += '\\';
                    }
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}${itemPath.substr(2)}`;
                }
            }
            // Different drive
            else {
                return `${itemPath[0]}:\\${itemPath.substr(2)}`;
            }
        }
        // Check for itemPath like \ or \foo
        else if (normalizeSeparators(itemPath).match(/^\\$|^\\[^\\]/)) {
            const cwd = process.cwd();
            assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            return `${cwd[0]}:\\${itemPath.substr(1)}`;
        }
    }
    assert_1.default(hasAbsoluteRoot(root), `ensureAbsoluteRoot parameter 'root' must have an absolute root`);
    // Otherwise ensure root ends with a separator
    if (root.endsWith('/') || (IS_WINDOWS && root.endsWith('\\'))) {
        // Intentionally empty
    }
    else {
        // Append separator
        root += path.sep;
    }
    return root + itemPath;
}
exports.ensureAbsoluteRoot = ensureAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\\hello\share` and `C:\hello` (and using alternate separator).
 */
function hasAbsoluteRoot(itemPath) {
    assert_1.default(itemPath, `hasAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \\hello\share or C:\hello
        return itemPath.startsWith('\\\\') || /^[A-Z]:\\/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasAbsoluteRoot = hasAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\`, `\hello`, `\\hello\share`, `C:`, and `C:\hello` (and using alternate separator).
 */
function hasRoot(itemPath) {
    assert_1.default(itemPath, `isRooted parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \ or \hello or \\hello
        // E.g. C: or C:\hello
        return itemPath.startsWith('\\') || /^[A-Z]:/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasRoot = hasRoot;
/**
 * Removes redundant slashes and converts `/` to `\` on Windows
 */
function normalizeSeparators(p) {
    p = p || '';
    // Windows
    if (IS_WINDOWS) {
        // Convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // Remove redundant slashes
        const isUnc = /^\\\\+[^\\]/.test(p); // e.g. \\hello
        return (isUnc ? '\\' : '') + p.replace(/\\\\+/g, '\\'); // preserve leading \\ for UNC
    }
    // Remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
exports.normalizeSeparators = normalizeSeparators;
/**
 * Normalizes the path separators and trims the trailing separator (when safe).
 * For example, `/foo/ => /foo` but `/ => /`
 */
function safeTrimTrailingSeparator(p) {
    // Short-circuit if empty
    if (!p) {
        return '';
    }
    // Normalize separators
    p = normalizeSeparators(p);
    // No trailing slash
    if (!p.endsWith(path.sep)) {
        return p;
    }
    // Check '/' on Linux/macOS and '\' on Windows
    if (p === path.sep) {
        return p;
    }
    // On Windows check if drive root. E.g. C:\
    if (IS_WINDOWS && /^[A-Z]:\\$/i.test(p)) {
        return p;
    }
    // Otherwise trim trailing slash
    return p.substr(0, p.length - 1);
}
exports.safeTrimTrailingSeparator = safeTrimTrailingSeparator;
//# sourceMappingURL=internal-path-helper.js.map

/***/ }),

/***/ 6836:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Path = void 0;
const path = __importStar(__nccwpck_require__(1017));
const pathHelper = __importStar(__nccwpck_require__(1849));
const assert_1 = __importDefault(__nccwpck_require__(9491));
const IS_WINDOWS = process.platform === 'win32';
/**
 * Helper class for parsing paths into segments
 */
class Path {
    /**
     * Constructs a Path
     * @param itemPath Path or array of segments
     */
    constructor(itemPath) {
        this.segments = [];
        // String
        if (typeof itemPath === 'string') {
            assert_1.default(itemPath, `Parameter 'itemPath' must not be empty`);
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
            // Not rooted
            if (!pathHelper.hasRoot(itemPath)) {
                this.segments = itemPath.split(path.sep);
            }
            // Rooted
            else {
                // Add all segments, while not at the root
                let remaining = itemPath;
                let dir = pathHelper.dirname(remaining);
                while (dir !== remaining) {
                    // Add the segment
                    const basename = path.basename(remaining);
                    this.segments.unshift(basename);
                    // Truncate the last segment
                    remaining = dir;
                    dir = pathHelper.dirname(remaining);
                }
                // Remainder is the root
                this.segments.unshift(remaining);
            }
        }
        // Array
        else {
            // Must not be empty
            assert_1.default(itemPath.length > 0, `Parameter 'itemPath' must not be an empty array`);
            // Each segment
            for (let i = 0; i < itemPath.length; i++) {
                let segment = itemPath[i];
                // Must not be empty
                assert_1.default(segment, `Parameter 'itemPath' must not contain any empty segments`);
                // Normalize slashes
                segment = pathHelper.normalizeSeparators(itemPath[i]);
                // Root segment
                if (i === 0 && pathHelper.hasRoot(segment)) {
                    segment = pathHelper.safeTrimTrailingSeparator(segment);
                    assert_1.default(segment === pathHelper.dirname(segment), `Parameter 'itemPath' root segment contains information for multiple segments`);
                    this.segments.push(segment);
                }
                // All other segments
                else {
                    // Must not contain slash
                    assert_1.default(!segment.includes(path.sep), `Parameter 'itemPath' contains unexpected path separators`);
                    this.segments.push(segment);
                }
            }
        }
    }
    /**
     * Converts the path to it's string representation
     */
    toString() {
        // First segment
        let result = this.segments[0];
        // All others
        let skipSlash = result.endsWith(path.sep) || (IS_WINDOWS && /^[A-Z]:$/i.test(result));
        for (let i = 1; i < this.segments.length; i++) {
            if (skipSlash) {
                skipSlash = false;
            }
            else {
                result += path.sep;
            }
            result += this.segments[i];
        }
        return result;
    }
}
exports.Path = Path;
//# sourceMappingURL=internal-path.js.map

/***/ }),

/***/ 9005:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.partialMatch = exports.match = exports.getSearchPaths = void 0;
const pathHelper = __importStar(__nccwpck_require__(1849));
const internal_match_kind_1 = __nccwpck_require__(1063);
const IS_WINDOWS = process.platform === 'win32';
/**
 * Given an array of patterns, returns an array of paths to search.
 * Duplicates and paths under other included paths are filtered out.
 */
function getSearchPaths(patterns) {
    // Ignore negate patterns
    patterns = patterns.filter(x => !x.negate);
    // Create a map of all search paths
    const searchPathMap = {};
    for (const pattern of patterns) {
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        searchPathMap[key] = 'candidate';
    }
    const result = [];
    for (const pattern of patterns) {
        // Check if already included
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        if (searchPathMap[key] === 'included') {
            continue;
        }
        // Check for an ancestor search path
        let foundAncestor = false;
        let tempKey = key;
        let parent = pathHelper.dirname(tempKey);
        while (parent !== tempKey) {
            if (searchPathMap[parent]) {
                foundAncestor = true;
                break;
            }
            tempKey = parent;
            parent = pathHelper.dirname(tempKey);
        }
        // Include the search pattern in the result
        if (!foundAncestor) {
            result.push(pattern.searchPath);
            searchPathMap[key] = 'included';
        }
    }
    return result;
}
exports.getSearchPaths = getSearchPaths;
/**
 * Matches the patterns against the path
 */
function match(patterns, itemPath) {
    let result = internal_match_kind_1.MatchKind.None;
    for (const pattern of patterns) {
        if (pattern.negate) {
            result &= ~pattern.match(itemPath);
        }
        else {
            result |= pattern.match(itemPath);
        }
    }
    return result;
}
exports.match = match;
/**
 * Checks whether to descend further into the directory
 */
function partialMatch(patterns, itemPath) {
    return patterns.some(x => !x.negate && x.partialMatch(itemPath));
}
exports.partialMatch = partialMatch;
//# sourceMappingURL=internal-pattern-helper.js.map

/***/ }),

/***/ 4536:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pattern = void 0;
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const pathHelper = __importStar(__nccwpck_require__(1849));
const assert_1 = __importDefault(__nccwpck_require__(9491));
const minimatch_1 = __nccwpck_require__(3973);
const internal_match_kind_1 = __nccwpck_require__(1063);
const internal_path_1 = __nccwpck_require__(6836);
const IS_WINDOWS = process.platform === 'win32';
class Pattern {
    constructor(patternOrNegate, isImplicitPattern = false, segments, homedir) {
        /**
         * Indicates whether matches should be excluded from the result set
         */
        this.negate = false;
        // Pattern overload
        let pattern;
        if (typeof patternOrNegate === 'string') {
            pattern = patternOrNegate.trim();
        }
        // Segments overload
        else {
            // Convert to pattern
            segments = segments || [];
            assert_1.default(segments.length, `Parameter 'segments' must not empty`);
            const root = Pattern.getLiteral(segments[0]);
            assert_1.default(root && pathHelper.hasAbsoluteRoot(root), `Parameter 'segments' first element must be a root path`);
            pattern = new internal_path_1.Path(segments).toString().trim();
            if (patternOrNegate) {
                pattern = `!${pattern}`;
            }
        }
        // Negate
        while (pattern.startsWith('!')) {
            this.negate = !this.negate;
            pattern = pattern.substr(1).trim();
        }
        // Normalize slashes and ensures absolute root
        pattern = Pattern.fixupPattern(pattern, homedir);
        // Segments
        this.segments = new internal_path_1.Path(pattern).segments;
        // Trailing slash indicates the pattern should only match directories, not regular files
        this.trailingSeparator = pathHelper
            .normalizeSeparators(pattern)
            .endsWith(path.sep);
        pattern = pathHelper.safeTrimTrailingSeparator(pattern);
        // Search path (literal path prior to the first glob segment)
        let foundGlob = false;
        const searchSegments = this.segments
            .map(x => Pattern.getLiteral(x))
            .filter(x => !foundGlob && !(foundGlob = x === ''));
        this.searchPath = new internal_path_1.Path(searchSegments).toString();
        // Root RegExp (required when determining partial match)
        this.rootRegExp = new RegExp(Pattern.regExpEscape(searchSegments[0]), IS_WINDOWS ? 'i' : '');
        this.isImplicitPattern = isImplicitPattern;
        // Create minimatch
        const minimatchOptions = {
            dot: true,
            nobrace: true,
            nocase: IS_WINDOWS,
            nocomment: true,
            noext: true,
            nonegate: true
        };
        pattern = IS_WINDOWS ? pattern.replace(/\\/g, '/') : pattern;
        this.minimatch = new minimatch_1.Minimatch(pattern, minimatchOptions);
    }
    /**
     * Matches the pattern against the specified path
     */
    match(itemPath) {
        // Last segment is globstar?
        if (this.segments[this.segments.length - 1] === '**') {
            // Normalize slashes
            itemPath = pathHelper.normalizeSeparators(itemPath);
            // Append a trailing slash. Otherwise Minimatch will not match the directory immediately
            // preceding the globstar. For example, given the pattern `/foo/**`, Minimatch returns
            // false for `/foo` but returns true for `/foo/`. Append a trailing slash to handle that quirk.
            if (!itemPath.endsWith(path.sep) && this.isImplicitPattern === false) {
                // Note, this is safe because the constructor ensures the pattern has an absolute root.
                // For example, formats like C: and C:foo on Windows are resolved to an absolute root.
                itemPath = `${itemPath}${path.sep}`;
            }
        }
        else {
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        }
        // Match
        if (this.minimatch.match(itemPath)) {
            return this.trailingSeparator ? internal_match_kind_1.MatchKind.Directory : internal_match_kind_1.MatchKind.All;
        }
        return internal_match_kind_1.MatchKind.None;
    }
    /**
     * Indicates whether the pattern may match descendants of the specified path
     */
    partialMatch(itemPath) {
        // Normalize slashes and trim unnecessary trailing slash
        itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        // matchOne does not handle root path correctly
        if (pathHelper.dirname(itemPath) === itemPath) {
            return this.rootRegExp.test(itemPath);
        }
        return this.minimatch.matchOne(itemPath.split(IS_WINDOWS ? /\\+/ : /\/+/), this.minimatch.set[0], true);
    }
    /**
     * Escapes glob patterns within a path
     */
    static globEscape(s) {
        return (IS_WINDOWS ? s : s.replace(/\\/g, '\\\\')) // escape '\' on Linux/macOS
            .replace(/(\[)(?=[^/]+\])/g, '[[]') // escape '[' when ']' follows within the path segment
            .replace(/\?/g, '[?]') // escape '?'
            .replace(/\*/g, '[*]'); // escape '*'
    }
    /**
     * Normalizes slashes and ensures absolute root
     */
    static fixupPattern(pattern, homedir) {
        // Empty
        assert_1.default(pattern, 'pattern cannot be empty');
        // Must not contain `.` segment, unless first segment
        // Must not contain `..` segment
        const literalSegments = new internal_path_1.Path(pattern).segments.map(x => Pattern.getLiteral(x));
        assert_1.default(literalSegments.every((x, i) => (x !== '.' || i === 0) && x !== '..'), `Invalid pattern '${pattern}'. Relative pathing '.' and '..' is not allowed.`);
        // Must not contain globs in root, e.g. Windows UNC path \\foo\b*r
        assert_1.default(!pathHelper.hasRoot(pattern) || literalSegments[0], `Invalid pattern '${pattern}'. Root segment must not contain globs.`);
        // Normalize slashes
        pattern = pathHelper.normalizeSeparators(pattern);
        // Replace leading `.` segment
        if (pattern === '.' || pattern.startsWith(`.${path.sep}`)) {
            pattern = Pattern.globEscape(process.cwd()) + pattern.substr(1);
        }
        // Replace leading `~` segment
        else if (pattern === '~' || pattern.startsWith(`~${path.sep}`)) {
            homedir = homedir || os.homedir();
            assert_1.default(homedir, 'Unable to determine HOME directory');
            assert_1.default(pathHelper.hasAbsoluteRoot(homedir), `Expected HOME directory to be a rooted path. Actual '${homedir}'`);
            pattern = Pattern.globEscape(homedir) + pattern.substr(1);
        }
        // Replace relative drive root, e.g. pattern is C: or C:foo
        else if (IS_WINDOWS &&
            (pattern.match(/^[A-Z]:$/i) || pattern.match(/^[A-Z]:[^\\]/i))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', pattern.substr(0, 2));
            if (pattern.length > 2 && !root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(2);
        }
        // Replace relative root, e.g. pattern is \ or \foo
        else if (IS_WINDOWS && (pattern === '\\' || pattern.match(/^\\[^\\]/))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', '\\');
            if (!root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(1);
        }
        // Otherwise ensure absolute root
        else {
            pattern = pathHelper.ensureAbsoluteRoot(Pattern.globEscape(process.cwd()), pattern);
        }
        return pathHelper.normalizeSeparators(pattern);
    }
    /**
     * Attempts to unescape a pattern segment to create a literal path segment.
     * Otherwise returns empty string.
     */
    static getLiteral(segment) {
        let literal = '';
        for (let i = 0; i < segment.length; i++) {
            const c = segment[i];
            // Escape
            if (c === '\\' && !IS_WINDOWS && i + 1 < segment.length) {
                literal += segment[++i];
                continue;
            }
            // Wildcard
            else if (c === '*' || c === '?') {
                return '';
            }
            // Character set
            else if (c === '[' && i + 1 < segment.length) {
                let set = '';
                let closed = -1;
                for (let i2 = i + 1; i2 < segment.length; i2++) {
                    const c2 = segment[i2];
                    // Escape
                    if (c2 === '\\' && !IS_WINDOWS && i2 + 1 < segment.length) {
                        set += segment[++i2];
                        continue;
                    }
                    // Closed
                    else if (c2 === ']') {
                        closed = i2;
                        break;
                    }
                    // Otherwise
                    else {
                        set += c2;
                    }
                }
                // Closed?
                if (closed >= 0) {
                    // Cannot convert
                    if (set.length > 1) {
                        return '';
                    }
                    // Convert to literal
                    if (set) {
                        literal += set;
                        i = closed;
                        continue;
                    }
                }
                // Otherwise fall thru
            }
            // Append
            literal += c;
        }
        return literal;
    }
    /**
     * Escapes regexp special characters
     * https://javascript.info/regexp-escaping
     */
    static regExpEscape(s) {
        return s.replace(/[[\\^$.|?*+()]/g, '\\$&');
    }
}
exports.Pattern = Pattern;
//# sourceMappingURL=internal-pattern.js.map

/***/ }),

/***/ 9117:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchState = void 0;
class SearchState {
    constructor(path, level) {
        this.path = path;
        this.level = level;
    }
}
exports.SearchState = SearchState;
//# sourceMappingURL=internal-search-state.js.map

/***/ }),

/***/ 3702:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(3685);
const https = __nccwpck_require__(5687);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 1962:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rename = exports.readlink = exports.readdir = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
const fs = __importStar(__nccwpck_require__(7147));
const path = __importStar(__nccwpck_require__(1017));
_a = fs.promises, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
exports.IS_WINDOWS = process.platform === 'win32';
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),

/***/ 7436:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
const assert_1 = __nccwpck_require__(9491);
const childProcess = __importStar(__nccwpck_require__(2081));
const path = __importStar(__nccwpck_require__(1017));
const util_1 = __nccwpck_require__(3837);
const ioUtil = __importStar(__nccwpck_require__(1962));
const exec = util_1.promisify(childProcess.exec);
const execFile = util_1.promisify(childProcess.execFile);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
            try {
                const cmdPath = ioUtil.getCmdPath();
                if (yield ioUtil.isDirectory(inputPath, true)) {
                    yield exec(`${cmdPath} /s /c "rd /s /q "%inputPath%""`, {
                        env: { inputPath }
                    });
                }
                else {
                    yield exec(`${cmdPath} /s /c "del /f /a "%inputPath%""`, {
                        env: { inputPath }
                    });
                }
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield ioUtil.unlink(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
        }
        else {
            let isDir = false;
            try {
                isDir = yield ioUtil.isDirectory(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
                return;
            }
            if (isDir) {
                yield execFile(`rm`, [`-rf`, `${inputPath}`]);
            }
            else {
                yield ioUtil.unlink(inputPath);
            }
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),

/***/ 2473:
/***/ (function(module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._readLinuxVersionFile = exports._getOsVersion = exports._findMatch = void 0;
const semver = __importStar(__nccwpck_require__(5911));
const core_1 = __nccwpck_require__(2186);
// needs to be require for core node modules to be mocked
/* eslint @typescript-eslint/no-require-imports: 0 */
const os = __nccwpck_require__(2037);
const cp = __nccwpck_require__(2081);
const fs = __nccwpck_require__(7147);
function _findMatch(versionSpec, stable, candidates, archFilter) {
    return __awaiter(this, void 0, void 0, function* () {
        const platFilter = os.platform();
        let result;
        let match;
        let file;
        for (const candidate of candidates) {
            const version = candidate.version;
            core_1.debug(`check ${version} satisfies ${versionSpec}`);
            if (semver.satisfies(version, versionSpec) &&
                (!stable || candidate.stable === stable)) {
                file = candidate.files.find(item => {
                    core_1.debug(`${item.arch}===${archFilter} && ${item.platform}===${platFilter}`);
                    let chk = item.arch === archFilter && item.platform === platFilter;
                    if (chk && item.platform_version) {
                        const osVersion = module.exports._getOsVersion();
                        if (osVersion === item.platform_version) {
                            chk = true;
                        }
                        else {
                            chk = semver.satisfies(osVersion, item.platform_version);
                        }
                    }
                    return chk;
                });
                if (file) {
                    core_1.debug(`matched ${candidate.version}`);
                    match = candidate;
                    break;
                }
            }
        }
        if (match && file) {
            // clone since we're mutating the file list to be only the file that matches
            result = Object.assign({}, match);
            result.files = [file];
        }
        return result;
    });
}
exports._findMatch = _findMatch;
function _getOsVersion() {
    // TODO: add windows and other linux, arm variants
    // right now filtering on version is only an ubuntu and macos scenario for tools we build for hosted (python)
    const plat = os.platform();
    let version = '';
    if (plat === 'darwin') {
        version = cp.execSync('sw_vers -productVersion').toString();
    }
    else if (plat === 'linux') {
        // lsb_release process not in some containers, readfile
        // Run cat /etc/lsb-release
        // DISTRIB_ID=Ubuntu
        // DISTRIB_RELEASE=18.04
        // DISTRIB_CODENAME=bionic
        // DISTRIB_DESCRIPTION="Ubuntu 18.04.4 LTS"
        const lsbContents = module.exports._readLinuxVersionFile();
        if (lsbContents) {
            const lines = lsbContents.split('\n');
            for (const line of lines) {
                const parts = line.split('=');
                if (parts.length === 2 &&
                    (parts[0].trim() === 'VERSION_ID' ||
                        parts[0].trim() === 'DISTRIB_RELEASE')) {
                    version = parts[1]
                        .trim()
                        .replace(/^"/, '')
                        .replace(/"$/, '');
                    break;
                }
            }
        }
    }
    return version;
}
exports._getOsVersion = _getOsVersion;
function _readLinuxVersionFile() {
    const lsbReleaseFile = '/etc/lsb-release';
    const osReleaseFile = '/etc/os-release';
    let contents = '';
    if (fs.existsSync(lsbReleaseFile)) {
        contents = fs.readFileSync(lsbReleaseFile).toString();
    }
    else if (fs.existsSync(osReleaseFile)) {
        contents = fs.readFileSync(osReleaseFile).toString();
    }
    return contents;
}
exports._readLinuxVersionFile = _readLinuxVersionFile;
//# sourceMappingURL=manifest.js.map

/***/ }),

/***/ 8279:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RetryHelper = void 0;
const core = __importStar(__nccwpck_require__(2186));
/**
 * Internal class for retries
 */
class RetryHelper {
    constructor(maxAttempts, minSeconds, maxSeconds) {
        if (maxAttempts < 1) {
            throw new Error('max attempts should be greater than or equal to 1');
        }
        this.maxAttempts = maxAttempts;
        this.minSeconds = Math.floor(minSeconds);
        this.maxSeconds = Math.floor(maxSeconds);
        if (this.minSeconds > this.maxSeconds) {
            throw new Error('min seconds should be less than or equal to max seconds');
        }
    }
    execute(action, isRetryable) {
        return __awaiter(this, void 0, void 0, function* () {
            let attempt = 1;
            while (attempt < this.maxAttempts) {
                // Try
                try {
                    return yield action();
                }
                catch (err) {
                    if (isRetryable && !isRetryable(err)) {
                        throw err;
                    }
                    core.info(err.message);
                }
                // Sleep
                const seconds = this.getSleepAmount();
                core.info(`Waiting ${seconds} seconds before trying again`);
                yield this.sleep(seconds);
                attempt++;
            }
            // Last attempt
            return yield action();
        });
    }
    getSleepAmount() {
        return (Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) +
            this.minSeconds);
    }
    sleep(seconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, seconds * 1000));
        });
    }
}
exports.RetryHelper = RetryHelper;
//# sourceMappingURL=retry-helper.js.map

/***/ }),

/***/ 7784:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evaluateVersions = exports.isExplicitVersion = exports.findFromManifest = exports.getManifestFromRepo = exports.findAllVersions = exports.find = exports.cacheFile = exports.cacheDir = exports.extractZip = exports.extractXar = exports.extractTar = exports.extract7z = exports.downloadTool = exports.HTTPError = void 0;
const core = __importStar(__nccwpck_require__(2186));
const io = __importStar(__nccwpck_require__(7436));
const fs = __importStar(__nccwpck_require__(7147));
const mm = __importStar(__nccwpck_require__(2473));
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const httpm = __importStar(__nccwpck_require__(9925));
const semver = __importStar(__nccwpck_require__(5911));
const stream = __importStar(__nccwpck_require__(2781));
const util = __importStar(__nccwpck_require__(3837));
const v4_1 = __importDefault(__nccwpck_require__(824));
const exec_1 = __nccwpck_require__(1514);
const assert_1 = __nccwpck_require__(9491);
const retry_helper_1 = __nccwpck_require__(8279);
class HTTPError extends Error {
    constructor(httpStatusCode) {
        super(`Unexpected HTTP response: ${httpStatusCode}`);
        this.httpStatusCode = httpStatusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.HTTPError = HTTPError;
const IS_WINDOWS = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';
const userAgent = 'actions/tool-cache';
/**
 * Download a tool from an url and stream it into a file
 *
 * @param url       url of tool to download
 * @param dest      path to download tool
 * @param auth      authorization header
 * @param headers   other headers
 * @returns         path to downloaded tool
 */
function downloadTool(url, dest, auth, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        dest = dest || path.join(_getTempDirectory(), v4_1.default());
        yield io.mkdirP(path.dirname(dest));
        core.debug(`Downloading ${url}`);
        core.debug(`Destination ${dest}`);
        const maxAttempts = 3;
        const minSeconds = _getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS', 10);
        const maxSeconds = _getGlobal('TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS', 20);
        const retryHelper = new retry_helper_1.RetryHelper(maxAttempts, minSeconds, maxSeconds);
        return yield retryHelper.execute(() => __awaiter(this, void 0, void 0, function* () {
            return yield downloadToolAttempt(url, dest || '', auth, headers);
        }), (err) => {
            if (err instanceof HTTPError && err.httpStatusCode) {
                // Don't retry anything less than 500, except 408 Request Timeout and 429 Too Many Requests
                if (err.httpStatusCode < 500 &&
                    err.httpStatusCode !== 408 &&
                    err.httpStatusCode !== 429) {
                    return false;
                }
            }
            // Otherwise retry
            return true;
        });
    });
}
exports.downloadTool = downloadTool;
function downloadToolAttempt(url, dest, auth, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs.existsSync(dest)) {
            throw new Error(`Destination file path ${dest} already exists`);
        }
        // Get the response headers
        const http = new httpm.HttpClient(userAgent, [], {
            allowRetries: false
        });
        if (auth) {
            core.debug('set auth');
            if (headers === undefined) {
                headers = {};
            }
            headers.authorization = auth;
        }
        const response = yield http.get(url, headers);
        if (response.message.statusCode !== 200) {
            const err = new HTTPError(response.message.statusCode);
            core.debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
            throw err;
        }
        // Download the response body
        const pipeline = util.promisify(stream.pipeline);
        const responseMessageFactory = _getGlobal('TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY', () => response.message);
        const readStream = responseMessageFactory();
        let succeeded = false;
        try {
            yield pipeline(readStream, fs.createWriteStream(dest));
            core.debug('download complete');
            succeeded = true;
            return dest;
        }
        finally {
            // Error, delete dest before retry
            if (!succeeded) {
                core.debug('download failed');
                try {
                    yield io.rmRF(dest);
                }
                catch (err) {
                    core.debug(`Failed to delete '${dest}'. ${err.message}`);
                }
            }
        }
    });
}
/**
 * Extract a .7z file
 *
 * @param file     path to the .7z file
 * @param dest     destination directory. Optional.
 * @param _7zPath  path to 7zr.exe. Optional, for long path support. Most .7z archives do not have this
 * problem. If your .7z archive contains very long paths, you can pass the path to 7zr.exe which will
 * gracefully handle long paths. By default 7zdec.exe is used because it is a very small program and is
 * bundled with the tool lib. However it does not support long paths. 7zr.exe is the reduced command line
 * interface, it is smaller than the full command line interface, and it does support long paths. At the
 * time of this writing, it is freely available from the LZMA SDK that is available on the 7zip website.
 * Be sure to check the current license agreement. If 7zr.exe is bundled with your action, then the path
 * to 7zr.exe can be pass to this function.
 * @returns        path to the destination directory
 */
function extract7z(file, dest, _7zPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_WINDOWS, 'extract7z() not supported on current OS');
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        const originalCwd = process.cwd();
        process.chdir(dest);
        if (_7zPath) {
            try {
                const logLevel = core.isDebug() ? '-bb1' : '-bb0';
                const args = [
                    'x',
                    logLevel,
                    '-bd',
                    '-sccUTF-8',
                    file
                ];
                const options = {
                    silent: true
                };
                yield exec_1.exec(`"${_7zPath}"`, args, options);
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        else {
            const escapedScript = path
                .join(__dirname, '..', 'scripts', 'Invoke-7zdec.ps1')
                .replace(/'/g, "''")
                .replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
            const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, '');
            const escapedTarget = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
            const command = `& '${escapedScript}' -Source '${escapedFile}' -Target '${escapedTarget}'`;
            const args = [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                command
            ];
            const options = {
                silent: true
            };
            try {
                const powershellPath = yield io.which('powershell', true);
                yield exec_1.exec(`"${powershellPath}"`, args, options);
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        return dest;
    });
}
exports.extract7z = extract7z;
/**
 * Extract a compressed tar archive
 *
 * @param file     path to the tar
 * @param dest     destination directory. Optional.
 * @param flags    flags for the tar command to use for extraction. Defaults to 'xz' (extracting gzipped tars). Optional.
 * @returns        path to the destination directory
 */
function extractTar(file, dest, flags = 'xz') {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new Error("parameter 'file' is required");
        }
        // Create dest
        dest = yield _createExtractFolder(dest);
        // Determine whether GNU tar
        core.debug('Checking tar --version');
        let versionOutput = '';
        yield exec_1.exec('tar --version', [], {
            ignoreReturnCode: true,
            silent: true,
            listeners: {
                stdout: (data) => (versionOutput += data.toString()),
                stderr: (data) => (versionOutput += data.toString())
            }
        });
        core.debug(versionOutput.trim());
        const isGnuTar = versionOutput.toUpperCase().includes('GNU TAR');
        // Initialize args
        let args;
        if (flags instanceof Array) {
            args = flags;
        }
        else {
            args = [flags];
        }
        if (core.isDebug() && !flags.includes('v')) {
            args.push('-v');
        }
        let destArg = dest;
        let fileArg = file;
        if (IS_WINDOWS && isGnuTar) {
            args.push('--force-local');
            destArg = dest.replace(/\\/g, '/');
            // Technically only the dest needs to have `/` but for aesthetic consistency
            // convert slashes in the file arg too.
            fileArg = file.replace(/\\/g, '/');
        }
        if (isGnuTar) {
            // Suppress warnings when using GNU tar to extract archives created by BSD tar
            args.push('--warning=no-unknown-keyword');
            args.push('--overwrite');
        }
        args.push('-C', destArg, '-f', fileArg);
        yield exec_1.exec(`tar`, args);
        return dest;
    });
}
exports.extractTar = extractTar;
/**
 * Extract a xar compatible archive
 *
 * @param file     path to the archive
 * @param dest     destination directory. Optional.
 * @param flags    flags for the xar. Optional.
 * @returns        path to the destination directory
 */
function extractXar(file, dest, flags = []) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(IS_MAC, 'extractXar() not supported on current OS');
        assert_1.ok(file, 'parameter "file" is required');
        dest = yield _createExtractFolder(dest);
        let args;
        if (flags instanceof Array) {
            args = flags;
        }
        else {
            args = [flags];
        }
        args.push('-x', '-C', dest, '-f', file);
        if (core.isDebug()) {
            args.push('-v');
        }
        const xarPath = yield io.which('xar', true);
        yield exec_1.exec(`"${xarPath}"`, _unique(args));
        return dest;
    });
}
exports.extractXar = extractXar;
/**
 * Extract a zip
 *
 * @param file     path to the zip
 * @param dest     destination directory. Optional.
 * @returns        path to the destination directory
 */
function extractZip(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new Error("parameter 'file' is required");
        }
        dest = yield _createExtractFolder(dest);
        if (IS_WINDOWS) {
            yield extractZipWin(file, dest);
        }
        else {
            yield extractZipNix(file, dest);
        }
        return dest;
    });
}
exports.extractZip = extractZip;
function extractZipWin(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        // build the powershell command
        const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, ''); // double-up single quotes, remove double quotes and newlines
        const escapedDest = dest.replace(/'/g, "''").replace(/"|\n|\r/g, '');
        const pwshPath = yield io.which('pwsh', false);
        //To match the file overwrite behavior on nix systems, we use the overwrite = true flag for ExtractToDirectory
        //and the -Force flag for Expand-Archive as a fallback
        if (pwshPath) {
            //attempt to use pwsh with ExtractToDirectory, if this fails attempt Expand-Archive
            const pwshCommand = [
                `$ErrorActionPreference = 'Stop' ;`,
                `try { Add-Type -AssemblyName System.IO.Compression.ZipFile } catch { } ;`,
                `try { [System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`,
                `catch { if (($_.Exception.GetType().FullName -eq 'System.Management.Automation.MethodException') -or ($_.Exception.GetType().FullName -eq 'System.Management.Automation.RuntimeException') ){ Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force } else { throw $_ } } ;`
            ].join(' ');
            const args = [
                '-NoLogo',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                pwshCommand
            ];
            core.debug(`Using pwsh at path: ${pwshPath}`);
            yield exec_1.exec(`"${pwshPath}"`, args);
        }
        else {
            const powershellCommand = [
                `$ErrorActionPreference = 'Stop' ;`,
                `try { Add-Type -AssemblyName System.IO.Compression.FileSystem } catch { } ;`,
                `if ((Get-Command -Name Expand-Archive -Module Microsoft.PowerShell.Archive -ErrorAction Ignore)) { Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force }`,
                `else {[System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`
            ].join(' ');
            const args = [
                '-NoLogo',
                '-Sta',
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy',
                'Unrestricted',
                '-Command',
                powershellCommand
            ];
            const powershellPath = yield io.which('powershell', true);
            core.debug(`Using powershell at path: ${powershellPath}`);
            yield exec_1.exec(`"${powershellPath}"`, args);
        }
    });
}
function extractZipNix(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        const unzipPath = yield io.which('unzip', true);
        const args = [file];
        if (!core.isDebug()) {
            args.unshift('-q');
        }
        args.unshift('-o'); //overwrite with -o, otherwise a prompt is shown which freezes the run
        yield exec_1.exec(`"${unzipPath}"`, args, { cwd: dest });
    });
}
/**
 * Caches a directory and installs it into the tool cacheDir
 *
 * @param sourceDir    the directory to cache into tools
 * @param tool          tool name
 * @param version       version of the tool.  semver format
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */
function cacheDir(sourceDir, tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        version = semver.clean(version) || version;
        arch = arch || os.arch();
        core.debug(`Caching tool ${tool} ${version} ${arch}`);
        core.debug(`source dir: ${sourceDir}`);
        if (!fs.statSync(sourceDir).isDirectory()) {
            throw new Error('sourceDir is not a directory');
        }
        // Create the tool dir
        const destPath = yield _createToolPath(tool, version, arch);
        // copy each child item. do not move. move can fail on Windows
        // due to anti-virus software having an open handle on a file.
        for (const itemName of fs.readdirSync(sourceDir)) {
            const s = path.join(sourceDir, itemName);
            yield io.cp(s, destPath, { recursive: true });
        }
        // write .complete
        _completeToolPath(tool, version, arch);
        return destPath;
    });
}
exports.cacheDir = cacheDir;
/**
 * Caches a downloaded file (GUID) and installs it
 * into the tool cache with a given targetName
 *
 * @param sourceFile    the file to cache into tools.  Typically a result of downloadTool which is a guid.
 * @param targetFile    the name of the file name in the tools directory
 * @param tool          tool name
 * @param version       version of the tool.  semver format
 * @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
 */
function cacheFile(sourceFile, targetFile, tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        version = semver.clean(version) || version;
        arch = arch || os.arch();
        core.debug(`Caching tool ${tool} ${version} ${arch}`);
        core.debug(`source file: ${sourceFile}`);
        if (!fs.statSync(sourceFile).isFile()) {
            throw new Error('sourceFile is not a file');
        }
        // create the tool dir
        const destFolder = yield _createToolPath(tool, version, arch);
        // copy instead of move. move can fail on Windows due to
        // anti-virus software having an open handle on a file.
        const destPath = path.join(destFolder, targetFile);
        core.debug(`destination file ${destPath}`);
        yield io.cp(sourceFile, destPath);
        // write .complete
        _completeToolPath(tool, version, arch);
        return destFolder;
    });
}
exports.cacheFile = cacheFile;
/**
 * Finds the path to a tool version in the local installed tool cache
 *
 * @param toolName      name of the tool
 * @param versionSpec   version of the tool
 * @param arch          optional arch.  defaults to arch of computer
 */
function find(toolName, versionSpec, arch) {
    if (!toolName) {
        throw new Error('toolName parameter is required');
    }
    if (!versionSpec) {
        throw new Error('versionSpec parameter is required');
    }
    arch = arch || os.arch();
    // attempt to resolve an explicit version
    if (!isExplicitVersion(versionSpec)) {
        const localVersions = findAllVersions(toolName, arch);
        const match = evaluateVersions(localVersions, versionSpec);
        versionSpec = match;
    }
    // check for the explicit version in the cache
    let toolPath = '';
    if (versionSpec) {
        versionSpec = semver.clean(versionSpec) || '';
        const cachePath = path.join(_getCacheDirectory(), toolName, versionSpec, arch);
        core.debug(`checking cache: ${cachePath}`);
        if (fs.existsSync(cachePath) && fs.existsSync(`${cachePath}.complete`)) {
            core.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
            toolPath = cachePath;
        }
        else {
            core.debug('not found');
        }
    }
    return toolPath;
}
exports.find = find;
/**
 * Finds the paths to all versions of a tool that are installed in the local tool cache
 *
 * @param toolName  name of the tool
 * @param arch      optional arch.  defaults to arch of computer
 */
function findAllVersions(toolName, arch) {
    const versions = [];
    arch = arch || os.arch();
    const toolPath = path.join(_getCacheDirectory(), toolName);
    if (fs.existsSync(toolPath)) {
        const children = fs.readdirSync(toolPath);
        for (const child of children) {
            if (isExplicitVersion(child)) {
                const fullPath = path.join(toolPath, child, arch || '');
                if (fs.existsSync(fullPath) && fs.existsSync(`${fullPath}.complete`)) {
                    versions.push(child);
                }
            }
        }
    }
    return versions;
}
exports.findAllVersions = findAllVersions;
function getManifestFromRepo(owner, repo, auth, branch = 'master') {
    return __awaiter(this, void 0, void 0, function* () {
        let releases = [];
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`;
        const http = new httpm.HttpClient('tool-cache');
        const headers = {};
        if (auth) {
            core.debug('set auth');
            headers.authorization = auth;
        }
        const response = yield http.getJson(treeUrl, headers);
        if (!response.result) {
            return releases;
        }
        let manifestUrl = '';
        for (const item of response.result.tree) {
            if (item.path === 'versions-manifest.json') {
                manifestUrl = item.url;
                break;
            }
        }
        headers['accept'] = 'application/vnd.github.VERSION.raw';
        let versionsRaw = yield (yield http.get(manifestUrl, headers)).readBody();
        if (versionsRaw) {
            // shouldn't be needed but protects against invalid json saved with BOM
            versionsRaw = versionsRaw.replace(/^\uFEFF/, '');
            try {
                releases = JSON.parse(versionsRaw);
            }
            catch (_a) {
                core.debug('Invalid json');
            }
        }
        return releases;
    });
}
exports.getManifestFromRepo = getManifestFromRepo;
function findFromManifest(versionSpec, stable, manifest, archFilter = os.arch()) {
    return __awaiter(this, void 0, void 0, function* () {
        // wrap the internal impl
        const match = yield mm._findMatch(versionSpec, stable, manifest, archFilter);
        return match;
    });
}
exports.findFromManifest = findFromManifest;
function _createExtractFolder(dest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dest) {
            // create a temp dir
            dest = path.join(_getTempDirectory(), v4_1.default());
        }
        yield io.mkdirP(dest);
        return dest;
    });
}
function _createToolPath(tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || '');
        core.debug(`destination ${folderPath}`);
        const markerPath = `${folderPath}.complete`;
        yield io.rmRF(folderPath);
        yield io.rmRF(markerPath);
        yield io.mkdirP(folderPath);
        return folderPath;
    });
}
function _completeToolPath(tool, version, arch) {
    const folderPath = path.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || '');
    const markerPath = `${folderPath}.complete`;
    fs.writeFileSync(markerPath, '');
    core.debug('finished caching tool');
}
/**
 * Check if version string is explicit
 *
 * @param versionSpec      version string to check
 */
function isExplicitVersion(versionSpec) {
    const c = semver.clean(versionSpec) || '';
    core.debug(`isExplicit: ${c}`);
    const valid = semver.valid(c) != null;
    core.debug(`explicit? ${valid}`);
    return valid;
}
exports.isExplicitVersion = isExplicitVersion;
/**
 * Get the highest satisfiying semantic version in `versions` which satisfies `versionSpec`
 *
 * @param versions        array of versions to evaluate
 * @param versionSpec     semantic version spec to satisfy
 */
function evaluateVersions(versions, versionSpec) {
    let version = '';
    core.debug(`evaluating ${versions.length} versions`);
    versions = versions.sort((a, b) => {
        if (semver.gt(a, b)) {
            return 1;
        }
        return -1;
    });
    for (let i = versions.length - 1; i >= 0; i--) {
        const potential = versions[i];
        const satisfied = semver.satisfies(potential, versionSpec);
        if (satisfied) {
            version = potential;
            break;
        }
    }
    if (version) {
        core.debug(`matched: ${version}`);
    }
    else {
        core.debug('match not found');
    }
    return version;
}
exports.evaluateVersions = evaluateVersions;
/**
 * Gets RUNNER_TOOL_CACHE
 */
function _getCacheDirectory() {
    const cacheDirectory = process.env['RUNNER_TOOL_CACHE'] || '';
    assert_1.ok(cacheDirectory, 'Expected RUNNER_TOOL_CACHE to be defined');
    return cacheDirectory;
}
/**
 * Gets RUNNER_TEMP
 */
function _getTempDirectory() {
    const tempDirectory = process.env['RUNNER_TEMP'] || '';
    assert_1.ok(tempDirectory, 'Expected RUNNER_TEMP to be defined');
    return tempDirectory;
}
/**
 * Gets a global variable
 */
function _getGlobal(key, defaultValue) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const value = global[key];
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return value !== undefined ? value : defaultValue;
}
/**
 * Returns an array of unique values.
 * @param values Values to make unique.
 */
function _unique(values) {
    return Array.from(new Set(values));
}
//# sourceMappingURL=tool-cache.js.map

/***/ }),

/***/ 9417:
/***/ ((module) => {


module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 3717:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var concatMap = __nccwpck_require__(6891);
var balanced = __nccwpck_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 6891:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 3973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = (function () { try { return __nccwpck_require__(1017) } catch (e) {}}()) || {
  sep: '/'
}
minimatch.sep = path.sep

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __nccwpck_require__(3717)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  b = b || {}
  var t = {}
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || typeof def !== 'object' || !Object.keys(def).length) {
    return minimatch
  }

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }
  m.Minimatch.defaults = function defaults (options) {
    return orig.defaults(ext(def, options)).Minimatch
  }

  m.filter = function filter (pattern, options) {
    return orig.filter(pattern, ext(def, options))
  }

  m.defaults = function defaults (options) {
    return orig.defaults(ext(def, options))
  }

  m.makeRe = function makeRe (pattern, options) {
    return orig.makeRe(pattern, ext(def, options))
  }

  m.braceExpand = function braceExpand (pattern, options) {
    return orig.braceExpand(pattern, ext(def, options))
  }

  m.match = function (list, pattern, options) {
    return orig.match(list, pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  assertValidPattern(pattern)

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  assertValidPattern(pattern)

  if (!options) options = {}

  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (!options.allowWindowsEscape && path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false
  this.partial = !!options.partial

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = function debug() { console.error.apply(console, arguments) }

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  assertValidPattern(pattern)

  // Thanks to Yeting Li <https://github.com/yetingli> for
  // improving this regexp to avoid a ReDOS vulnerability.
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

var MAX_PATTERN_LENGTH = 1024 * 64
var assertValidPattern = function (pattern) {
  if (typeof pattern !== 'string') {
    throw new TypeError('invalid pattern')
  }

  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError('pattern is too long')
  }
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  assertValidPattern(pattern)

  var options = this.options

  // shortcuts
  if (pattern === '**') {
    if (!options.noglobstar)
      return GLOBSTAR
    else
      pattern = '*'
  }
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      /* istanbul ignore next */
      case '/': {
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false
      }

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        // split where the last [ was, make sure we don't have
        // an invalid re. if so, re-walk the contents of the
        // would-be class to re-translate any characters that
        // were passed through as-is
        // TODO: It would probably be faster to determine this
        // without a try/catch and a new RegExp, but it's tricky
        // to do safely.  For now, this is safe and works.
        var cs = pattern.substring(classStart + 1, i)
        try {
          RegExp('[' + cs + ']')
        } catch (er) {
          // not a valid class!
          var sp = this.parse(cs, SUBPARSE)
          re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
          hasMagic = hasMagic || sp[1]
          inClass = false
          continue
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '[': case '.': case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) /* istanbul ignore next - should be impossible */ {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) /* istanbul ignore next - should be impossible */ {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = function match (f, partial) {
  if (typeof partial === 'undefined') partial = this.partial
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    /* istanbul ignore if */
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      /* istanbul ignore if */
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      hit = f === p
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else /* istanbul ignore else */ if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    return (fi === fl - 1) && (file[fi] === '')
  }

  // should be unreachable.
  /* istanbul ignore next */
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 4694:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.EQ = __webpack_unused_export__ = exports.MY = exports.Qc = void 0;
/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at " + i);
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at " + j);
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at " + j);
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at " + i);
            if (!pattern)
                throw new TypeError("Missing pattern at " + i);
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
    };
    var consumeText = function () {
        var result = "";
        var value;
        // tslint:disable-next-line
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
exports.Qc = parse;
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
exports.MY = compile;
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:" + token.pattern + ")$", reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"" + token.name + "\" to not be empty");
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
        }
        return path;
    };
}
__webpack_unused_export__ = tokensToFunction;
/**
 * Create path match function from `path-to-regexp` spec.
 */
function match(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
    return regexpToFunction(re, keys, options);
}
exports.EQ = match;
/**
 * Create a path match function from `path-to-regexp` output.
 */
function regexpToFunction(re, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.decode, decode = _a === void 0 ? function (x) { return x; } : _a;
    return function (pathname) {
        var m = re.exec(pathname);
        if (!m)
            return false;
        var path = m[0], index = m.index;
        var params = Object.create(null);
        var _loop_1 = function (i) {
            // tslint:disable-next-line
            if (m[i] === undefined)
                return "continue";
            var key = keys[i - 1];
            if (key.modifier === "*" || key.modifier === "+") {
                params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
                    return decode(value, key);
                });
            }
            else {
                params[key.name] = decode(m[i], key);
            }
        };
        for (var i = 1; i < m.length; i++) {
            _loop_1(i);
        }
        return { path: path, index: index, params: params };
    };
}
__webpack_unused_export__ = regexpToFunction;
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}
/**
 * Pull out keys from a regexp.
 */
function regexpToRegexp(path, keys) {
    if (!keys)
        return path;
    var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
    var index = 0;
    var execResult = groupsRegex.exec(path.source);
    while (execResult) {
        keys.push({
            // Use parenthesized substring match if available, index otherwise
            name: execResult[1] || index++,
            prefix: "",
            suffix: "",
            modifier: "",
            pattern: ""
        });
        execResult = groupsRegex.exec(path.source);
    }
    return path;
}
/**
 * Transform an array into a regexp.
 */
function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
    return new RegExp("(?:" + parts.join("|") + ")", flags(options));
}
/**
 * Create a path regexp from string input.
 */
function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse(path, options), keys, options);
}
/**
 * Expose a function for taking tokens and returning a RegExp.
 */
function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) { options = {}; }
    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
    var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
    var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
    var route = start ? "^" : "";
    // Iterate over the tokens and create our regexp string.
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (typeof token === "string") {
            route += escapeString(encode(token));
        }
        else {
            var prefix = escapeString(encode(token.prefix));
            var suffix = escapeString(encode(token.suffix));
            if (token.pattern) {
                if (keys)
                    keys.push(token);
                if (prefix || suffix) {
                    if (token.modifier === "+" || token.modifier === "*") {
                        var mod = token.modifier === "*" ? "?" : "";
                        route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                    }
                    else {
                        route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                    }
                }
                else {
                    route += "(" + token.pattern + ")" + token.modifier;
                }
            }
            else {
                route += "(?:" + prefix + suffix + ")" + token.modifier;
            }
        }
    }
    if (end) {
        if (!strict)
            route += delimiter + "?";
        route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
    }
    else {
        var endToken = tokens[tokens.length - 1];
        var isEndDelimited = typeof endToken === "string"
            ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
            : // tslint:disable-next-line
                endToken === undefined;
        if (!strict) {
            route += "(?:" + delimiter + "(?=" + endsWith + "))?";
        }
        if (!isEndDelimited) {
            route += "(?=" + delimiter + "|" + endsWith + ")";
        }
    }
    return new RegExp(route, flags(options));
}
__webpack_unused_export__ = tokensToRegexp;
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 */
function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp)
        return regexpToRegexp(path, keys);
    if (Array.isArray(path))
        return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
}
__webpack_unused_export__ = pathToRegexp;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5911:
/***/ ((module, exports) => {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var t = exports.tokens = {}
var R = 0

function tok (n) {
  t[n] = R++
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

tok('NUMERICIDENTIFIER')
src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*'
tok('NUMERICIDENTIFIERLOOSE')
src[t.NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

tok('NONNUMERICIDENTIFIER')
src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

tok('MAINVERSION')
src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')'

tok('MAINVERSIONLOOSE')
src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

tok('PRERELEASEIDENTIFIER')
src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] +
                            '|' + src[t.NONNUMERICIDENTIFIER] + ')'

tok('PRERELEASEIDENTIFIERLOOSE')
src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[t.NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

tok('PRERELEASE')
src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))'

tok('PRERELEASELOOSE')
src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

tok('BUILDIDENTIFIER')
src[t.BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

tok('BUILD')
src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] +
             '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

tok('FULL')
tok('FULLPLAIN')
src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] +
                  src[t.PRERELEASE] + '?' +
                  src[t.BUILD] + '?'

src[t.FULL] = '^' + src[t.FULLPLAIN] + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
tok('LOOSEPLAIN')
src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] +
                  src[t.PRERELEASELOOSE] + '?' +
                  src[t.BUILD] + '?'

tok('LOOSE')
src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$'

tok('GTLT')
src[t.GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
tok('XRANGEIDENTIFIERLOOSE')
src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
tok('XRANGEIDENTIFIER')
src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*'

tok('XRANGEPLAIN')
src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[t.PRERELEASE] + ')?' +
                   src[t.BUILD] + '?' +
                   ')?)?'

tok('XRANGEPLAINLOOSE')
src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[t.PRERELEASELOOSE] + ')?' +
                        src[t.BUILD] + '?' +
                        ')?)?'

tok('XRANGE')
src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$'
tok('XRANGELOOSE')
src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
tok('COERCE')
src[t.COERCE] = '(^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'
tok('COERCERTL')
re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g')

// Tilde ranges.
// Meaning is "reasonably at or greater than"
tok('LONETILDE')
src[t.LONETILDE] = '(?:~>?)'

tok('TILDETRIM')
src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+'
re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

tok('TILDE')
src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$'
tok('TILDELOOSE')
src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
tok('LONECARET')
src[t.LONECARET] = '(?:\\^)'

tok('CARETTRIM')
src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+'
re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g')
var caretTrimReplace = '$1^'

tok('CARET')
src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$'
tok('CARETLOOSE')
src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
tok('COMPARATORLOOSE')
src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$'
tok('COMPARATOR')
src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
tok('COMPARATORTRIM')
src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] +
                      '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
tok('HYPHENRANGE')
src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s*$'

tok('HYPHENRANGELOOSE')
src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
tok('STAR')
src[t.STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

SemVer.prototype.compareBuild = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  var i = 0
  do {
    var a = this.build[i]
    var b = other.build[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.compareBuild = compareBuild
function compareBuild (a, b, loose) {
  var versionA = new SemVer(a, loose)
  var versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(b, a, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1] !== undefined ? m[1] : ''
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY || version === ANY) {
    return true
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    if (this.value === '') {
      return true
    }
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    if (comp.value === '') {
      return true
    }
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[t.COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[t.CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return (
      isSatisfiable(thisComparators, options) &&
      range.set.some(function (rangeComparators) {
        return (
          isSatisfiable(rangeComparators, options) &&
          thisComparators.every(function (thisComparator) {
            return rangeComparators.every(function (rangeComparator) {
              return thisComparator.intersects(rangeComparator, options)
            })
          })
        )
      })
    )
  })
}

// take a set of comparators and determine whether there
// exists a version which can satisfy it
function isSatisfiable (comparators, options) {
  var result = true
  var remainingComparators = comparators.slice()
  var testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every(function (otherComparator) {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p + pr
    } else if (xm) {
      ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0' + pr +
        ' <' + M + '.' + (+m + 1) + '.0' + pr
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version, options) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  var match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    var next
    while ((next = re[t.COERCERTL].exec(version)) &&
      (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
          next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(match[2] +
    '.' + (match[3] || '0') +
    '.' + (match[4] || '0'), options)
}


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 2707:
/***/ ((module) => {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ 5859:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.

var crypto = __nccwpck_require__(6113);

module.exports = function nodeRNG() {
  return crypto.randomBytes(16);
};


/***/ }),

/***/ 824:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var rng = __nccwpck_require__(5859);
var bytesToUuid = __nccwpck_require__(2707);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ 9491:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("assert");

/***/ }),

/***/ 2081:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("string_decoder");

/***/ }),

/***/ 9512:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("timers");

/***/ }),

/***/ 4404:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("util");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(2186);
// EXTERNAL MODULE: ./node_modules/path-to-regexp/dist/index.js
var dist = __nccwpck_require__(4694);
// EXTERNAL MODULE: ./node_modules/@actions/http-client/index.js
var http_client = __nccwpck_require__(9925);
;// CONCATENATED MODULE: ./src/lib/LokaliseAuthHandler.js
class LokaliseAuthHandler {
  constructor(token) {
    this.token = token;
  }

  prepareRequest(options) {
    // eslint-disable-next-line no-param-reassign
    options.headers['X-Api-Token'] = this.token;
  }

  // This handler cannot handle 401
  // eslint-disable-next-line class-methods-use-this
  canHandleAuthentication() {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  handleAuthentication() {
    return null;
  }
}

;// CONCATENATED MODULE: external "fs/promises"
const promises_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs/promises");
// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(1017);
// EXTERNAL MODULE: ./node_modules/@actions/glob/lib/glob.js
var glob = __nccwpck_require__(8090);
;// CONCATENATED MODULE: ./node_modules/bcp-47/lib/stringify.js
/**
 * @typedef {Partial<import('./parse.js').Schema>} Schema
 * @typedef {Partial<import('./parse.js').Extension>} Extension
 */

/**
 * Compile a language schema to a BCP 47 language tag.
 *
 * @param {Schema} schema
 * @returns {string}
 */
function stringify(schema = {}) {
  /** @type {Array<string>} */
  let result = []

  if (schema.irregular) {
    return schema.irregular
  }

  if (schema.regular) {
    return schema.regular
  }

  if (schema.language) {
    result = result.concat(
      schema.language,
      schema.extendedLanguageSubtags || [],
      schema.script || [],
      schema.region || [],
      schema.variants || []
    )

    const values = schema.extensions || []
    let index = -1

    while (++index < values.length) {
      const value = values[index]

      if (value.singleton && value.extensions && value.extensions.length > 0) {
        result.push(value.singleton, ...value.extensions)
      }
    }
  }

  if (schema.privateuse && schema.privateuse.length > 0) {
    result.push('x', ...schema.privateuse)
  }

  return result.join('-')
}

;// CONCATENATED MODULE: ./node_modules/is-alphabetical/index.js
/**
 * Check if the given character code, or the character code at the first
 * character, is alphabetical.
 *
 * @param {string|number} character
 * @returns {boolean} Whether `character` is alphabetical.
 */
function isAlphabetical(character) {
  const code =
    typeof character === 'string' ? character.charCodeAt(0) : character

  return (
    (code >= 97 && code <= 122) /* a-z */ ||
    (code >= 65 && code <= 90) /* A-Z */
  )
}

;// CONCATENATED MODULE: ./node_modules/is-decimal/index.js
/**
 * Check if the given character code, or the character code at the first
 * character, is decimal.
 *
 * @param {string|number} character
 * @returns {boolean} Whether `character` is a decimal
 */
function isDecimal(character) {
  const code =
    typeof character === 'string' ? character.charCodeAt(0) : character

  return code >= 48 && code <= 57 /* 0-9 */
}

;// CONCATENATED MODULE: ./node_modules/is-alphanumerical/index.js



/**
 * Check if the given character code, or the character code at the first
 * character, is alphanumerical.
 *
 * @param {string|number} character
 * @returns {boolean} Whether `character` is alphanumerical.
 */
function isAlphanumerical(character) {
  return isAlphabetical(character) || isDecimal(character)
}

;// CONCATENATED MODULE: ./node_modules/bcp-47/lib/regular.js
/** @type {Array<string>} */
const regular = [
  'art-lojban',
  'cel-gaulish',
  'no-bok',
  'no-nyn',
  'zh-guoyu',
  'zh-hakka',
  'zh-min',
  'zh-min-nan',
  'zh-xiang'
]

;// CONCATENATED MODULE: ./node_modules/bcp-47/lib/normal.js
/** @type {Record<string, string|null>} */
const normal = {
  'en-gb-oed': 'en-GB-oxendict',
  'i-ami': 'ami',
  'i-bnn': 'bnn',
  'i-default': null,
  'i-enochian': null,
  'i-hak': 'hak',
  'i-klingon': 'tlh',
  'i-lux': 'lb',
  'i-mingo': null,
  'i-navajo': 'nv',
  'i-pwn': 'pwn',
  'i-tao': 'tao',
  'i-tay': 'tay',
  'i-tsu': 'tsu',
  'sgn-be-fr': 'sfb',
  'sgn-be-nl': 'vgt',
  'sgn-ch-de': 'sgg',
  'art-lojban': 'jbo',
  'cel-gaulish': null,
  'no-bok': 'nb',
  'no-nyn': 'nn',
  'zh-guoyu': 'cmn',
  'zh-hakka': 'hak',
  'zh-min': null,
  'zh-min-nan': 'nan',
  'zh-xiang': 'hsn'
}

;// CONCATENATED MODULE: ./node_modules/bcp-47/lib/parse.js
/**
 * @callback Warning
 * @param {string} reason
 * @param {number} code
 * @param {number} offset
 * @returns {void}
 *
 * @typedef Options
 * @property {boolean} [normalize=true]
 * @property {boolean} [forgiving=false]
 * @property {Warning} [warning]
 *
 * @typedef Extension
 * @property {string} singleton
 * @property {Array<string>} extensions
 *
 * @typedef Schema
 * @property {string|null|undefined} language
 * @property {Array<string>} extendedLanguageSubtags
 * @property {string|null|undefined} script
 * @property {string|null|undefined} region
 * @property {Array<string>} variants
 * @property {Array<Extension>} extensions
 * @property {Array<string>} privateuse
 * @property {string|null|undefined} irregular
 * @property {string|null|undefined} regular
 */







const own = {}.hasOwnProperty

/**
 * Parse a BCP 47 language tag.
 *
 * @param {string} tag
 * @param {Options} [options]
 * @returns {Schema}
 */
function parse(tag, options = {}) {
  const result = empty()
  const source = String(tag)
  const value = source.toLowerCase()
  let index = 0

  // Check input.
  if (tag === null || tag === undefined) {
    throw new Error('Expected string, got `' + tag + '`')
  }

  // Let’s start.
  // First: the edge cases.
  if (own.call(normal, value)) {
    const replacement = normal[value]

    if (
      (options.normalize === undefined ||
        options.normalize === null ||
        options.normalize) &&
      typeof replacement === 'string'
    ) {
      return parse(replacement)
    }

    result[regular.includes(value) ? 'regular' : 'irregular'] = source

    return result
  }

  // Now, to actually parse, eat what could be a language.
  while (isAlphabetical(value.charCodeAt(index)) && index < 9) index++

  // A language.
  if (index > 1 /* Min 639. */ && index < 9 /* Max subtag. */) {
    // 5 and up is a subtag.
    // 4 is the size of reserved languages.
    // 3 an ISO 639-2 or ISO 639-3.
    // 2 is an ISO 639-1.
    // <https://github.com/wooorm/iso-639-2>
    // <https://github.com/wooorm/iso-639-3>
    result.language = source.slice(0, index)

    if (index < 4 /* Max 639. */) {
      let groups = 0

      while (
        value.charCodeAt(index) === 45 /* `-` */ &&
        isAlphabetical(value.charCodeAt(index + 1)) &&
        isAlphabetical(value.charCodeAt(index + 2)) &&
        isAlphabetical(value.charCodeAt(index + 3)) &&
        !isAlphabetical(value.charCodeAt(index + 4))
      ) {
        if (groups > 2 /* Max extended language subtag count. */) {
          return fail(
            index,
            3,
            'Too many extended language subtags, expected at most 3 subtags'
          )
        }

        // Extended language subtag.
        result.extendedLanguageSubtags.push(source.slice(index + 1, index + 4))
        index += 4
        groups++
      }
    }

    // ISO 15924 script.
    // <https://github.com/wooorm/iso-15924>
    if (
      value.charCodeAt(index) === 45 /* `-` */ &&
      isAlphabetical(value.charCodeAt(index + 1)) &&
      isAlphabetical(value.charCodeAt(index + 2)) &&
      isAlphabetical(value.charCodeAt(index + 3)) &&
      isAlphabetical(value.charCodeAt(index + 4)) &&
      !isAlphabetical(value.charCodeAt(index + 5))
    ) {
      result.script = source.slice(index + 1, index + 5)
      index += 5
    }

    if (value.charCodeAt(index) === 45 /* `-` */) {
      // ISO 3166-1 region.
      // <https://github.com/wooorm/iso-3166>
      if (
        isAlphabetical(value.charCodeAt(index + 1)) &&
        isAlphabetical(value.charCodeAt(index + 2)) &&
        !isAlphabetical(value.charCodeAt(index + 3))
      ) {
        result.region = source.slice(index + 1, index + 3)
        index += 3
      }
      // UN M49 region.
      // <https://github.com/wooorm/un-m49>
      else if (
        isDecimal(value.charCodeAt(index + 1)) &&
        isDecimal(value.charCodeAt(index + 2)) &&
        isDecimal(value.charCodeAt(index + 3)) &&
        !isDecimal(value.charCodeAt(index + 4))
      ) {
        result.region = source.slice(index + 1, index + 4)
        index += 4
      }
    }

    while (value.charCodeAt(index) === 45 /* `-` */) {
      const start = index + 1
      let offset = start

      while (isAlphanumerical(value.charCodeAt(offset))) {
        if (offset - start > 7 /* Max variant. */) {
          return fail(
            offset,
            1,
            'Too long variant, expected at most 8 characters'
          )
        }

        offset++
      }

      if (
        // Long variant.
        offset - start > 4 /* Min alpha numeric variant. */ ||
        // Short variant.
        (offset - start > 3 /* Min variant. */ &&
          isDecimal(value.charCodeAt(start)))
      ) {
        result.variants.push(source.slice(start, offset))
        index = offset
      }
      // Something else.
      else {
        break
      }
    }

    // Extensions.
    while (value.charCodeAt(index) === 45 /* `-` */) {
      // Exit if this isn’t an extension.
      if (
        value.charCodeAt(index + 1) === 120 /* `x` */ ||
        !isAlphanumerical(value.charCodeAt(index + 1)) ||
        value.charCodeAt(index + 2) !== 45 /* `-` */ ||
        !isAlphanumerical(value.charCodeAt(index + 3))
      ) {
        break
      }

      let offset = index + 2
      let groups = 0

      while (
        value.charCodeAt(offset) === 45 /* `-` */ &&
        isAlphanumerical(value.charCodeAt(offset + 1)) &&
        isAlphanumerical(value.charCodeAt(offset + 2))
      ) {
        const start = offset + 1
        offset = start + 2
        groups++

        while (isAlphanumerical(value.charCodeAt(offset))) {
          if (offset - start > 7 /* Max extension. */) {
            return fail(
              offset,
              2,
              'Too long extension, expected at most 8 characters'
            )
          }

          offset++
        }
      }

      if (!groups) {
        return fail(
          offset,
          4,
          'Empty extension, extensions must have at least 2 characters of content'
        )
      }

      result.extensions.push({
        singleton: source.charAt(index + 1),
        extensions: source.slice(index + 3, offset).split('-')
      })

      index = offset
    }
  }
  // Not a language.
  else {
    index = 0
  }

  // Private use.
  if (
    (index === 0 && value.charCodeAt(index) === 120) /* `x` */ ||
    (value.charCodeAt(index) === 45 /* `-` */ &&
      value.charCodeAt(index + 1) === 120) /* `x` */
  ) {
    index = index ? index + 2 : 1
    let offset = index

    while (
      value.charCodeAt(offset) === 45 /* `-` */ &&
      isAlphanumerical(value.charCodeAt(offset + 1))
    ) {
      const start = index + 1
      offset = start

      while (isAlphanumerical(value.charCodeAt(offset))) {
        if (offset - start > 7 /* Max private use. */) {
          return fail(
            offset,
            5,
            'Too long private-use area, expected at most 8 characters'
          )
        }

        offset++
      }

      result.privateuse.push(source.slice(index + 1, offset))
      index = offset
    }
  }

  if (index !== source.length) {
    return fail(index, 6, 'Found superfluous content after tag')
  }

  return result

  /**
   * Create an empty results object.
   *
   * @param {number} offset
   * @param {number} code
   * @param {string} reason
   * @returns {Schema}
   */
  function fail(offset, code, reason) {
    if (options.warning) options.warning(reason, code, offset)
    return options.forgiving ? result : empty()
  }
}

/**
 * Create an empty results object.
 *
 * @returns {Schema}
 */
function empty() {
  return {
    language: null,
    extendedLanguageSubtags: [],
    script: null,
    region: null,
    variants: [],
    extensions: [],
    privateuse: [],
    irregular: null,
    regular: null
  }
}

;// CONCATENATED MODULE: ./node_modules/bcp-47-match/index.js
/**
 * See <https://tools.ietf.org/html/rfc4647#section-3.1>
 * for more information on the algorithms.
 */

/**
 * @typedef {string} Tag
 * @typedef {Array<Tag>} Tags
 * @typedef {string} Range
 * @typedef {Array<Range>} Ranges
 *
 * @callback Check
 * @param {Tag} tag
 * @param {Range} range
 * @returns {boolean}
 *
 * @typedef {FilterOrLookup<true>} Filter
 * @typedef {FilterOrLookup<false>} Lookup
 */

/**
 * @template {boolean} IsFilter
 * @callback FilterOrLookup
 * @param {Tag|Tags} tags
 * @param {Range|Ranges} [ranges='*']
 * @returns {IsFilter extends true ? Tags : Tag|undefined}
 */

/**
 * Factory to perform a filter or a lookup.
 * This factory creates a function that accepts a list of tags and a list of
 * ranges, and contains logic to exit early for lookups.
 * `check` just has to deal with one tag and one range.
 * This match function iterates over ranges, and for each range,
 * iterates over tags.  That way, earlier ranges matching any tag have
 * precedence over later ranges.
 *
 * @template {boolean} IsFilter
 * @param {Check} check
 * @param {IsFilter} filter
 * @returns {FilterOrLookup<IsFilter>}
 */
function factory(check, filter) {
  return function (tags, ranges) {
    let left = cast(tags, 'tag')
    const right = cast(
      ranges === null || ranges === undefined ? '*' : ranges,
      'range'
    )
    /** @type {Tags} */
    const matches = []
    let rightIndex = -1

    while (++rightIndex < right.length) {
      const range = right[rightIndex].toLowerCase()

      // Ignore wildcards in lookup mode.
      if (!filter && range === '*') continue

      let leftIndex = -1
      /** @type {Tags} */
      const next = []

      while (++leftIndex < left.length) {
        if (check(left[leftIndex].toLowerCase(), range)) {
          // Exit if this is a lookup and we have a match.
          if (!filter) {
            return /** @type {IsFilter extends true ? Tags : Tag|undefined} */ (
              left[leftIndex]
            )
          }

          matches.push(left[leftIndex])
        } else {
          next.push(left[leftIndex])
        }
      }

      left = next
    }

    // If this is a filter, return the list.  If it’s a lookup, we didn’t find
    // a match, so return `undefined`.
    return /** @type {IsFilter extends true ? Tags : Tag|undefined} */ (
      filter ? matches : undefined
    )
  }
}

/**
 * Basic Filtering (Section 3.3.1) matches a language priority list consisting
 * of basic language ranges (Section 2.1) to sets of language tags.
 */
const basicFilter = factory(function (tag, range) {
  return range === '*' || tag === range || tag.includes(range + '-')
}, true)

/**
 * Extended Filtering (Section 3.3.2) matches a language priority list
 * consisting of extended language ranges (Section 2.2) to sets of language
 * tags.
 */
const extendedFilter = factory(function (tag, range) {
  // 3.3.2.1
  const left = tag.split('-')
  const right = range.split('-')
  let leftIndex = 0
  let rightIndex = 0

  // 3.3.2.2
  if (right[rightIndex] !== '*' && left[leftIndex] !== right[rightIndex]) {
    return false
  }

  leftIndex++
  rightIndex++

  // 3.3.2.3
  while (rightIndex < right.length) {
    // 3.3.2.3.A
    if (right[rightIndex] === '*') {
      rightIndex++
      continue
    }

    // 3.3.2.3.B
    if (!left[leftIndex]) return false

    // 3.3.2.3.C
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex++
      rightIndex++
      continue
    }

    // 3.3.2.3.D
    if (left[leftIndex].length === 1) return false

    // 3.3.2.3.E
    leftIndex++
  }

  // 3.3.2.4
  return true
}, true)

/**
 * Lookup (Section 3.4) matches a language priority list consisting of basic
 * language ranges to sets of language tags to find the one exact language tag
 * that best matches the range.
 */
const lookup = factory(function (tag, range) {
  let right = range

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    if (right === '*' || tag === right) return true

    let index = right.lastIndexOf('-')

    if (index < 0) return false

    if (right.charAt(index - 2) === '-') index -= 2

    right = right.slice(0, index)
  }
}, false)

/**
 * Validate tags or ranges, and cast them to arrays.
 *
 * @param {string|Array<string>} values
 * @param {string} name
 * @returns {Array<string>}
 */
function cast(values, name) {
  const value = values && typeof values === 'string' ? [values] : values

  if (!value || typeof value !== 'object' || !('length' in value)) {
    throw new Error(
      'Invalid ' + name + ' `' + value + '`, expected non-empty string'
    )
  }

  return value
}

;// CONCATENATED MODULE: ./node_modules/bcp-47-normalize/lib/matches.js
/**
 * @typedef Change
 * @property {string} from
 * @property {string} to
 */

/**
 * @type {Array<Change>}
 */
const matches = [
  {
    from: 'in',
    to: 'id'
  },
  {
    from: 'iw',
    to: 'he'
  },
  {
    from: 'ji',
    to: 'yi'
  },
  {
    from: 'jw',
    to: 'jv'
  },
  {
    from: 'mo',
    to: 'ro'
  },
  {
    from: 'scc',
    to: 'sr'
  },
  {
    from: 'scr',
    to: 'hr'
  },
  {
    from: 'aam',
    to: 'aas'
  },
  {
    from: 'adp',
    to: 'dz'
  },
  {
    from: 'aue',
    to: 'ktz'
  },
  {
    from: 'ayx',
    to: 'nun'
  },
  {
    from: 'bgm',
    to: 'bcg'
  },
  {
    from: 'bjd',
    to: 'drl'
  },
  {
    from: 'ccq',
    to: 'rki'
  },
  {
    from: 'cjr',
    to: 'mom'
  },
  {
    from: 'cka',
    to: 'cmr'
  },
  {
    from: 'cmk',
    to: 'xch'
  },
  {
    from: 'coy',
    to: 'pij'
  },
  {
    from: 'cqu',
    to: 'quh'
  },
  {
    from: 'drh',
    to: 'mn'
  },
  {
    from: 'drw',
    to: 'fa-af'
  },
  {
    from: 'gav',
    to: 'dev'
  },
  {
    from: 'gfx',
    to: 'vaj'
  },
  {
    from: 'ggn',
    to: 'gvr'
  },
  {
    from: 'gti',
    to: 'nyc'
  },
  {
    from: 'guv',
    to: 'duz'
  },
  {
    from: 'hrr',
    to: 'jal'
  },
  {
    from: 'ibi',
    to: 'opa'
  },
  {
    from: 'ilw',
    to: 'gal'
  },
  {
    from: 'jeg',
    to: 'oyb'
  },
  {
    from: 'kgc',
    to: 'tdf'
  },
  {
    from: 'kgh',
    to: 'kml'
  },
  {
    from: 'koj',
    to: 'kwv'
  },
  {
    from: 'krm',
    to: 'bmf'
  },
  {
    from: 'ktr',
    to: 'dtp'
  },
  {
    from: 'kvs',
    to: 'gdj'
  },
  {
    from: 'kwq',
    to: 'yam'
  },
  {
    from: 'kxe',
    to: 'tvd'
  },
  {
    from: 'kzj',
    to: 'dtp'
  },
  {
    from: 'kzt',
    to: 'dtp'
  },
  {
    from: 'lii',
    to: 'raq'
  },
  {
    from: 'lmm',
    to: 'rmx'
  },
  {
    from: 'meg',
    to: 'cir'
  },
  {
    from: 'mst',
    to: 'mry'
  },
  {
    from: 'mwj',
    to: 'vaj'
  },
  {
    from: 'myt',
    to: 'mry'
  },
  {
    from: 'nad',
    to: 'xny'
  },
  {
    from: 'ncp',
    to: 'kdz'
  },
  {
    from: 'nnx',
    to: 'ngv'
  },
  {
    from: 'nts',
    to: 'pij'
  },
  {
    from: 'oun',
    to: 'vaj'
  },
  {
    from: 'pcr',
    to: 'adx'
  },
  {
    from: 'pmc',
    to: 'huw'
  },
  {
    from: 'pmu',
    to: 'phr'
  },
  {
    from: 'ppa',
    to: 'bfy'
  },
  {
    from: 'ppr',
    to: 'lcq'
  },
  {
    from: 'pry',
    to: 'prt'
  },
  {
    from: 'puz',
    to: 'pub'
  },
  {
    from: 'sca',
    to: 'hle'
  },
  {
    from: 'skk',
    to: 'oyb'
  },
  {
    from: 'tdu',
    to: 'dtp'
  },
  {
    from: 'thc',
    to: 'tpo'
  },
  {
    from: 'thx',
    to: 'oyb'
  },
  {
    from: 'tie',
    to: 'ras'
  },
  {
    from: 'tkk',
    to: 'twm'
  },
  {
    from: 'tlw',
    to: 'weo'
  },
  {
    from: 'tmp',
    to: 'tyj'
  },
  {
    from: 'tne',
    to: 'kak'
  },
  {
    from: 'tnf',
    to: 'fa-af'
  },
  {
    from: 'tsf',
    to: 'taj'
  },
  {
    from: 'uok',
    to: 'ema'
  },
  {
    from: 'xba',
    to: 'cax'
  },
  {
    from: 'xia',
    to: 'acn'
  },
  {
    from: 'xkh',
    to: 'waw'
  },
  {
    from: 'xsj',
    to: 'suj'
  },
  {
    from: 'ybd',
    to: 'rki'
  },
  {
    from: 'yma',
    to: 'lrr'
  },
  {
    from: 'ymt',
    to: 'mtm'
  },
  {
    from: 'yos',
    to: 'zom'
  },
  {
    from: 'yuu',
    to: 'yug'
  },
  {
    from: 'asd',
    to: 'snz'
  },
  {
    from: 'dit',
    to: 'dif'
  },
  {
    from: 'llo',
    to: 'ngt'
  },
  {
    from: 'myd',
    to: 'aog'
  },
  {
    from: 'nns',
    to: 'nbr'
  },
  {
    from: 'agp',
    to: 'apf'
  },
  {
    from: 'ais',
    to: 'ami'
  },
  {
    from: 'baz',
    to: 'nvo'
  },
  {
    from: 'bhk',
    to: 'fbl'
  },
  {
    from: 'bic',
    to: 'bir'
  },
  {
    from: 'bjq',
    to: 'bzc'
  },
  {
    from: 'bkb',
    to: 'ebk'
  },
  {
    from: 'blg',
    to: 'iba'
  },
  {
    from: 'btb',
    to: 'beb'
  },
  {
    from: 'daf',
    to: 'dnj'
  },
  {
    from: 'dap',
    to: 'njz'
  },
  {
    from: 'djl',
    to: 'dze'
  },
  {
    from: 'dkl',
    to: 'aqd'
  },
  {
    from: 'drr',
    to: 'kzk'
  },
  {
    from: 'dud',
    to: 'uth'
  },
  {
    from: 'duj',
    to: 'dwu'
  },
  {
    from: 'dwl',
    to: 'dbt'
  },
  {
    from: 'elp',
    to: 'amq'
  },
  {
    from: 'gbc',
    to: 'wny'
  },
  {
    from: 'ggo',
    to: 'esg'
  },
  {
    from: 'ggr',
    to: 'gtu'
  },
  {
    from: 'gio',
    to: 'aou'
  },
  {
    from: 'gli',
    to: 'kzk'
  },
  {
    from: 'ill',
    to: 'ilm'
  },
  {
    from: 'izi',
    to: 'eza'
  },
  {
    from: 'jar',
    to: 'jgk'
  },
  {
    from: 'kdv',
    to: 'zkd'
  },
  {
    from: 'kgd',
    to: 'ncq'
  },
  {
    from: 'kpp',
    to: 'jkm'
  },
  {
    from: 'kxl',
    to: 'kru'
  },
  {
    from: 'kzh',
    to: 'dgl'
  },
  {
    from: 'leg',
    to: 'enl'
  },
  {
    from: 'mgx',
    to: 'jbk'
  },
  {
    from: 'mnt',
    to: 'wnn'
  },
  {
    from: 'mof',
    to: 'xnt'
  },
  {
    from: 'mwd',
    to: 'dmw'
  },
  {
    from: 'nbf',
    to: 'nru'
  },
  {
    from: 'nbx',
    to: 'ekc'
  },
  {
    from: 'nln',
    to: 'azd'
  },
  {
    from: 'nlr',
    to: 'nrk'
  },
  {
    from: 'noo',
    to: 'dtd'
  },
  {
    from: 'nxu',
    to: 'bpp'
  },
  {
    from: 'pat',
    to: 'kxr'
  },
  {
    from: 'rmr',
    to: 'emx'
  },
  {
    from: 'sap',
    to: 'aqt'
  },
  {
    from: 'sgl',
    to: 'isk'
  },
  {
    from: 'sul',
    to: 'sgd'
  },
  {
    from: 'sum',
    to: 'ulw'
  },
  {
    from: 'tgg',
    to: 'bjp'
  },
  {
    from: 'thw',
    to: 'ola'
  },
  {
    from: 'tid',
    to: 'itd'
  },
  {
    from: 'unp',
    to: 'wro'
  },
  {
    from: 'wgw',
    to: 'wgb'
  },
  {
    from: 'wit',
    to: 'nol'
  },
  {
    from: 'wiw',
    to: 'nwo'
  },
  {
    from: 'xrq',
    to: 'dmw'
  },
  {
    from: 'yen',
    to: 'ynq'
  },
  {
    from: 'yiy',
    to: 'yrm'
  },
  {
    from: 'zir',
    to: 'scv'
  },
  {
    from: 'sgn-br',
    to: 'bzs'
  },
  {
    from: 'sgn-co',
    to: 'csn'
  },
  {
    from: 'sgn-de',
    to: 'gsg'
  },
  {
    from: 'sgn-dk',
    to: 'dsl'
  },
  {
    from: 'sgn-fr',
    to: 'fsl'
  },
  {
    from: 'sgn-gb',
    to: 'bfi'
  },
  {
    from: 'sgn-gr',
    to: 'gss'
  },
  {
    from: 'sgn-ie',
    to: 'isg'
  },
  {
    from: 'sgn-it',
    to: 'ise'
  },
  {
    from: 'sgn-jp',
    to: 'jsl'
  },
  {
    from: 'sgn-mx',
    to: 'mfs'
  },
  {
    from: 'sgn-ni',
    to: 'ncs'
  },
  {
    from: 'sgn-nl',
    to: 'dse'
  },
  {
    from: 'sgn-no',
    to: 'nsi'
  },
  {
    from: 'sgn-pt',
    to: 'psr'
  },
  {
    from: 'sgn-se',
    to: 'swl'
  },
  {
    from: 'sgn-us',
    to: 'ase'
  },
  {
    from: 'sgn-za',
    to: 'sfs'
  },
  {
    from: 'sgn-es',
    to: 'ssp'
  },
  {
    from: 'zh-cmn',
    to: 'zh'
  },
  {
    from: 'zh-cmn-hans',
    to: 'zh-hans'
  },
  {
    from: 'zh-cmn-hant',
    to: 'zh-hant'
  },
  {
    from: 'zh-gan',
    to: 'gan'
  },
  {
    from: 'zh-wuu',
    to: 'wuu'
  },
  {
    from: 'zh-yue',
    to: 'yue'
  },
  {
    from: 'no-bokmal',
    to: 'nb'
  },
  {
    from: 'no-nynorsk',
    to: 'nn'
  },
  {
    from: 'aa-saaho',
    to: 'ssy'
  },
  {
    from: 'sh',
    to: 'sr-latn'
  },
  {
    from: 'cnr',
    to: 'sr-me'
  },
  {
    from: 'tl',
    to: 'fil'
  },
  {
    from: 'aju',
    to: 'jrb'
  },
  {
    from: 'als',
    to: 'sq'
  },
  {
    from: 'arb',
    to: 'ar'
  },
  {
    from: 'ayr',
    to: 'ay'
  },
  {
    from: 'azj',
    to: 'az'
  },
  {
    from: 'bcc',
    to: 'bal'
  },
  {
    from: 'bcl',
    to: 'bik'
  },
  {
    from: 'bxk',
    to: 'luy'
  },
  {
    from: 'bxr',
    to: 'bua'
  },
  {
    from: 'cld',
    to: 'syr'
  },
  {
    from: 'cmn',
    to: 'zh'
  },
  {
    from: 'cwd',
    to: 'cr'
  },
  {
    from: 'dgo',
    to: 'doi'
  },
  {
    from: 'dhd',
    to: 'mwr'
  },
  {
    from: 'dik',
    to: 'din'
  },
  {
    from: 'diq',
    to: 'zza'
  },
  {
    from: 'lbk',
    to: 'bnc'
  },
  {
    from: 'ekk',
    to: 'et'
  },
  {
    from: 'emk',
    to: 'man'
  },
  {
    from: 'esk',
    to: 'ik'
  },
  {
    from: 'fat',
    to: 'ak'
  },
  {
    from: 'fuc',
    to: 'ff'
  },
  {
    from: 'gaz',
    to: 'om'
  },
  {
    from: 'gbo',
    to: 'grb'
  },
  {
    from: 'gno',
    to: 'gon'
  },
  {
    from: 'gug',
    to: 'gn'
  },
  {
    from: 'gya',
    to: 'gba'
  },
  {
    from: 'hdn',
    to: 'hai'
  },
  {
    from: 'hea',
    to: 'hmn'
  },
  {
    from: 'ike',
    to: 'iu'
  },
  {
    from: 'kmr',
    to: 'ku'
  },
  {
    from: 'knc',
    to: 'kr'
  },
  {
    from: 'kng',
    to: 'kg'
  },
  {
    from: 'knn',
    to: 'kok'
  },
  {
    from: 'kpv',
    to: 'kv'
  },
  {
    from: 'lvs',
    to: 'lv'
  },
  {
    from: 'mhr',
    to: 'chm'
  },
  {
    from: 'mup',
    to: 'raj'
  },
  {
    from: 'khk',
    to: 'mn'
  },
  {
    from: 'npi',
    to: 'ne'
  },
  {
    from: 'ojg',
    to: 'oj'
  },
  {
    from: 'ory',
    to: 'or'
  },
  {
    from: 'pbu',
    to: 'ps'
  },
  {
    from: 'pes',
    to: 'fa'
  },
  {
    from: 'plt',
    to: 'mg'
  },
  {
    from: 'pnb',
    to: 'lah'
  },
  {
    from: 'quz',
    to: 'qu'
  },
  {
    from: 'rmy',
    to: 'rom'
  },
  {
    from: 'spy',
    to: 'kln'
  },
  {
    from: 'src',
    to: 'sc'
  },
  {
    from: 'swh',
    to: 'sw'
  },
  {
    from: 'ttq',
    to: 'tmh'
  },
  {
    from: 'tw',
    to: 'ak'
  },
  {
    from: 'umu',
    to: 'del'
  },
  {
    from: 'uzn',
    to: 'uz'
  },
  {
    from: 'xpe',
    to: 'kpe'
  },
  {
    from: 'xsl',
    to: 'den'
  },
  {
    from: 'ydd',
    to: 'yi'
  },
  {
    from: 'zai',
    to: 'zap'
  },
  {
    from: 'zsm',
    to: 'ms'
  },
  {
    from: 'zyb',
    to: 'za'
  },
  {
    from: 'him',
    to: 'srx'
  },
  {
    from: 'mnk',
    to: 'man'
  },
  {
    from: 'bh',
    to: 'bho'
  },
  {
    from: 'prs',
    to: 'fa-af'
  },
  {
    from: 'swc',
    to: 'sw-cd'
  },
  {
    from: 'aar',
    to: 'aa'
  },
  {
    from: 'abk',
    to: 'ab'
  },
  {
    from: 'ave',
    to: 'ae'
  },
  {
    from: 'afr',
    to: 'af'
  },
  {
    from: 'aka',
    to: 'ak'
  },
  {
    from: 'amh',
    to: 'am'
  },
  {
    from: 'arg',
    to: 'an'
  },
  {
    from: 'ara',
    to: 'ar'
  },
  {
    from: 'asm',
    to: 'as'
  },
  {
    from: 'ava',
    to: 'av'
  },
  {
    from: 'aym',
    to: 'ay'
  },
  {
    from: 'aze',
    to: 'az'
  },
  {
    from: 'bak',
    to: 'ba'
  },
  {
    from: 'bel',
    to: 'be'
  },
  {
    from: 'bul',
    to: 'bg'
  },
  {
    from: 'bih',
    to: 'bho'
  },
  {
    from: 'bis',
    to: 'bi'
  },
  {
    from: 'bam',
    to: 'bm'
  },
  {
    from: 'ben',
    to: 'bn'
  },
  {
    from: 'bod',
    to: 'bo'
  },
  {
    from: 'bre',
    to: 'br'
  },
  {
    from: 'bos',
    to: 'bs'
  },
  {
    from: 'cat',
    to: 'ca'
  },
  {
    from: 'che',
    to: 'ce'
  },
  {
    from: 'cha',
    to: 'ch'
  },
  {
    from: 'cos',
    to: 'co'
  },
  {
    from: 'cre',
    to: 'cr'
  },
  {
    from: 'ces',
    to: 'cs'
  },
  {
    from: 'chu',
    to: 'cu'
  },
  {
    from: 'chv',
    to: 'cv'
  },
  {
    from: 'cym',
    to: 'cy'
  },
  {
    from: 'dan',
    to: 'da'
  },
  {
    from: 'deu',
    to: 'de'
  },
  {
    from: 'div',
    to: 'dv'
  },
  {
    from: 'dzo',
    to: 'dz'
  },
  {
    from: 'ewe',
    to: 'ee'
  },
  {
    from: 'ell',
    to: 'el'
  },
  {
    from: 'eng',
    to: 'en'
  },
  {
    from: 'epo',
    to: 'eo'
  },
  {
    from: 'spa',
    to: 'es'
  },
  {
    from: 'est',
    to: 'et'
  },
  {
    from: 'eus',
    to: 'eu'
  },
  {
    from: 'fas',
    to: 'fa'
  },
  {
    from: 'ful',
    to: 'ff'
  },
  {
    from: 'fin',
    to: 'fi'
  },
  {
    from: 'fij',
    to: 'fj'
  },
  {
    from: 'fao',
    to: 'fo'
  },
  {
    from: 'fra',
    to: 'fr'
  },
  {
    from: 'fry',
    to: 'fy'
  },
  {
    from: 'gle',
    to: 'ga'
  },
  {
    from: 'gla',
    to: 'gd'
  },
  {
    from: 'glg',
    to: 'gl'
  },
  {
    from: 'grn',
    to: 'gn'
  },
  {
    from: 'guj',
    to: 'gu'
  },
  {
    from: 'glv',
    to: 'gv'
  },
  {
    from: 'hau',
    to: 'ha'
  },
  {
    from: 'heb',
    to: 'he'
  },
  {
    from: 'hin',
    to: 'hi'
  },
  {
    from: 'hmo',
    to: 'ho'
  },
  {
    from: 'hrv',
    to: 'hr'
  },
  {
    from: 'hat',
    to: 'ht'
  },
  {
    from: 'hun',
    to: 'hu'
  },
  {
    from: 'hye',
    to: 'hy'
  },
  {
    from: 'her',
    to: 'hz'
  },
  {
    from: 'ina',
    to: 'ia'
  },
  {
    from: 'ind',
    to: 'id'
  },
  {
    from: 'ile',
    to: 'ie'
  },
  {
    from: 'ibo',
    to: 'ig'
  },
  {
    from: 'iii',
    to: 'ii'
  },
  {
    from: 'ipk',
    to: 'ik'
  },
  {
    from: 'ido',
    to: 'io'
  },
  {
    from: 'isl',
    to: 'is'
  },
  {
    from: 'ita',
    to: 'it'
  },
  {
    from: 'iku',
    to: 'iu'
  },
  {
    from: 'jpn',
    to: 'ja'
  },
  {
    from: 'jav',
    to: 'jv'
  },
  {
    from: 'kat',
    to: 'ka'
  },
  {
    from: 'kon',
    to: 'kg'
  },
  {
    from: 'kik',
    to: 'ki'
  },
  {
    from: 'kua',
    to: 'kj'
  },
  {
    from: 'kaz',
    to: 'kk'
  },
  {
    from: 'kal',
    to: 'kl'
  },
  {
    from: 'khm',
    to: 'km'
  },
  {
    from: 'kan',
    to: 'kn'
  },
  {
    from: 'kor',
    to: 'ko'
  },
  {
    from: 'kau',
    to: 'kr'
  },
  {
    from: 'kas',
    to: 'ks'
  },
  {
    from: 'kur',
    to: 'ku'
  },
  {
    from: 'kom',
    to: 'kv'
  },
  {
    from: 'cor',
    to: 'kw'
  },
  {
    from: 'kir',
    to: 'ky'
  },
  {
    from: 'lat',
    to: 'la'
  },
  {
    from: 'ltz',
    to: 'lb'
  },
  {
    from: 'lug',
    to: 'lg'
  },
  {
    from: 'lim',
    to: 'li'
  },
  {
    from: 'lin',
    to: 'ln'
  },
  {
    from: 'lao',
    to: 'lo'
  },
  {
    from: 'lit',
    to: 'lt'
  },
  {
    from: 'lub',
    to: 'lu'
  },
  {
    from: 'lav',
    to: 'lv'
  },
  {
    from: 'mlg',
    to: 'mg'
  },
  {
    from: 'mah',
    to: 'mh'
  },
  {
    from: 'mri',
    to: 'mi'
  },
  {
    from: 'mkd',
    to: 'mk'
  },
  {
    from: 'mal',
    to: 'ml'
  },
  {
    from: 'mon',
    to: 'mn'
  },
  {
    from: 'mol',
    to: 'ro'
  },
  {
    from: 'mar',
    to: 'mr'
  },
  {
    from: 'msa',
    to: 'ms'
  },
  {
    from: 'mlt',
    to: 'mt'
  },
  {
    from: 'mya',
    to: 'my'
  },
  {
    from: 'nau',
    to: 'na'
  },
  {
    from: 'nob',
    to: 'nb'
  },
  {
    from: 'nde',
    to: 'nd'
  },
  {
    from: 'nep',
    to: 'ne'
  },
  {
    from: 'ndo',
    to: 'ng'
  },
  {
    from: 'nld',
    to: 'nl'
  },
  {
    from: 'nno',
    to: 'nn'
  },
  {
    from: 'nor',
    to: 'no'
  },
  {
    from: 'nbl',
    to: 'nr'
  },
  {
    from: 'nav',
    to: 'nv'
  },
  {
    from: 'nya',
    to: 'ny'
  },
  {
    from: 'oci',
    to: 'oc'
  },
  {
    from: 'oji',
    to: 'oj'
  },
  {
    from: 'orm',
    to: 'om'
  },
  {
    from: 'ori',
    to: 'or'
  },
  {
    from: 'oss',
    to: 'os'
  },
  {
    from: 'pan',
    to: 'pa'
  },
  {
    from: 'pli',
    to: 'pi'
  },
  {
    from: 'pol',
    to: 'pl'
  },
  {
    from: 'pus',
    to: 'ps'
  },
  {
    from: 'por',
    to: 'pt'
  },
  {
    from: 'que',
    to: 'qu'
  },
  {
    from: 'roh',
    to: 'rm'
  },
  {
    from: 'run',
    to: 'rn'
  },
  {
    from: 'ron',
    to: 'ro'
  },
  {
    from: 'rus',
    to: 'ru'
  },
  {
    from: 'kin',
    to: 'rw'
  },
  {
    from: 'san',
    to: 'sa'
  },
  {
    from: 'srd',
    to: 'sc'
  },
  {
    from: 'snd',
    to: 'sd'
  },
  {
    from: 'sme',
    to: 'se'
  },
  {
    from: 'sag',
    to: 'sg'
  },
  {
    from: 'hbs',
    to: 'sr-latn'
  },
  {
    from: 'sin',
    to: 'si'
  },
  {
    from: 'slk',
    to: 'sk'
  },
  {
    from: 'slv',
    to: 'sl'
  },
  {
    from: 'smo',
    to: 'sm'
  },
  {
    from: 'sna',
    to: 'sn'
  },
  {
    from: 'som',
    to: 'so'
  },
  {
    from: 'sqi',
    to: 'sq'
  },
  {
    from: 'srp',
    to: 'sr'
  },
  {
    from: 'ssw',
    to: 'ss'
  },
  {
    from: 'sot',
    to: 'st'
  },
  {
    from: 'sun',
    to: 'su'
  },
  {
    from: 'swe',
    to: 'sv'
  },
  {
    from: 'swa',
    to: 'sw'
  },
  {
    from: 'tam',
    to: 'ta'
  },
  {
    from: 'tel',
    to: 'te'
  },
  {
    from: 'tgk',
    to: 'tg'
  },
  {
    from: 'tha',
    to: 'th'
  },
  {
    from: 'tir',
    to: 'ti'
  },
  {
    from: 'tuk',
    to: 'tk'
  },
  {
    from: 'tgl',
    to: 'fil'
  },
  {
    from: 'tsn',
    to: 'tn'
  },
  {
    from: 'ton',
    to: 'to'
  },
  {
    from: 'tur',
    to: 'tr'
  },
  {
    from: 'tso',
    to: 'ts'
  },
  {
    from: 'tat',
    to: 'tt'
  },
  {
    from: 'twi',
    to: 'ak'
  },
  {
    from: 'tah',
    to: 'ty'
  },
  {
    from: 'uig',
    to: 'ug'
  },
  {
    from: 'ukr',
    to: 'uk'
  },
  {
    from: 'urd',
    to: 'ur'
  },
  {
    from: 'uzb',
    to: 'uz'
  },
  {
    from: 'ven',
    to: 've'
  },
  {
    from: 'vie',
    to: 'vi'
  },
  {
    from: 'vol',
    to: 'vo'
  },
  {
    from: 'wln',
    to: 'wa'
  },
  {
    from: 'wol',
    to: 'wo'
  },
  {
    from: 'xho',
    to: 'xh'
  },
  {
    from: 'yid',
    to: 'yi'
  },
  {
    from: 'yor',
    to: 'yo'
  },
  {
    from: 'zha',
    to: 'za'
  },
  {
    from: 'zho',
    to: 'zh'
  },
  {
    from: 'zul',
    to: 'zu'
  },
  {
    from: 'alb',
    to: 'sq'
  },
  {
    from: 'arm',
    to: 'hy'
  },
  {
    from: 'baq',
    to: 'eu'
  },
  {
    from: 'bur',
    to: 'my'
  },
  {
    from: 'chi',
    to: 'zh'
  },
  {
    from: 'cze',
    to: 'cs'
  },
  {
    from: 'dut',
    to: 'nl'
  },
  {
    from: 'fre',
    to: 'fr'
  },
  {
    from: 'geo',
    to: 'ka'
  },
  {
    from: 'ger',
    to: 'de'
  },
  {
    from: 'gre',
    to: 'el'
  },
  {
    from: 'ice',
    to: 'is'
  },
  {
    from: 'mac',
    to: 'mk'
  },
  {
    from: 'mao',
    to: 'mi'
  },
  {
    from: 'may',
    to: 'ms'
  },
  {
    from: 'per',
    to: 'fa'
  },
  {
    from: 'rum',
    to: 'ro'
  },
  {
    from: 'slo',
    to: 'sk'
  },
  {
    from: 'tib',
    to: 'bo'
  },
  {
    from: 'wel',
    to: 'cy'
  },
  {
    from: 'und-aaland',
    to: 'und-ax'
  },
  {
    from: 'hy-arevmda',
    to: 'hyw'
  },
  {
    from: 'und-arevmda',
    to: 'und'
  },
  {
    from: 'und-arevela',
    to: 'und'
  },
  {
    from: 'und-lojban',
    to: 'und'
  },
  {
    from: 'und-saaho',
    to: 'und'
  },
  {
    from: 'und-bokmal',
    to: 'und'
  },
  {
    from: 'und-nynorsk',
    to: 'und'
  },
  {
    from: 'und-hakka',
    to: 'und'
  },
  {
    from: 'und-xiang',
    to: 'und'
  },
  {
    from: 'und-hepburn-heploc',
    to: 'und-alalc97'
  }
]

;// CONCATENATED MODULE: ./node_modules/bcp-47-normalize/lib/fields.js
/**
 * @typedef {'script'|'region'|'variants'} Field
 *
 * @typedef AddOrRemove
 * @property {Field} field
 * @property {string} value
 *
 * @typedef Change
 * @property {AddOrRemove} from
 * @property {AddOrRemove} to
 */

/**
 * @type {Array<Change>}
 */
const fields = [
  {
    from: {
      field: 'script',
      value: 'qaai'
    },
    to: {
      field: 'script',
      value: 'zinh'
    }
  },
  {
    from: {
      field: 'region',
      value: 'bu'
    },
    to: {
      field: 'region',
      value: 'mm'
    }
  },
  {
    from: {
      field: 'region',
      value: 'ct'
    },
    to: {
      field: 'region',
      value: 'ki'
    }
  },
  {
    from: {
      field: 'region',
      value: 'dd'
    },
    to: {
      field: 'region',
      value: 'de'
    }
  },
  {
    from: {
      field: 'region',
      value: 'dy'
    },
    to: {
      field: 'region',
      value: 'bj'
    }
  },
  {
    from: {
      field: 'region',
      value: 'fx'
    },
    to: {
      field: 'region',
      value: 'fr'
    }
  },
  {
    from: {
      field: 'region',
      value: 'hv'
    },
    to: {
      field: 'region',
      value: 'bf'
    }
  },
  {
    from: {
      field: 'region',
      value: 'jt'
    },
    to: {
      field: 'region',
      value: 'um'
    }
  },
  {
    from: {
      field: 'region',
      value: 'mi'
    },
    to: {
      field: 'region',
      value: 'um'
    }
  },
  {
    from: {
      field: 'region',
      value: 'nh'
    },
    to: {
      field: 'region',
      value: 'vu'
    }
  },
  {
    from: {
      field: 'region',
      value: 'nq'
    },
    to: {
      field: 'region',
      value: 'aq'
    }
  },
  {
    from: {
      field: 'region',
      value: 'pu'
    },
    to: {
      field: 'region',
      value: 'um'
    }
  },
  {
    from: {
      field: 'region',
      value: 'pz'
    },
    to: {
      field: 'region',
      value: 'pa'
    }
  },
  {
    from: {
      field: 'region',
      value: 'qu'
    },
    to: {
      field: 'region',
      value: 'eu'
    }
  },
  {
    from: {
      field: 'region',
      value: 'rh'
    },
    to: {
      field: 'region',
      value: 'zw'
    }
  },
  {
    from: {
      field: 'region',
      value: 'tp'
    },
    to: {
      field: 'region',
      value: 'tl'
    }
  },
  {
    from: {
      field: 'region',
      value: 'uk'
    },
    to: {
      field: 'region',
      value: 'gb'
    }
  },
  {
    from: {
      field: 'region',
      value: 'vd'
    },
    to: {
      field: 'region',
      value: 'vn'
    }
  },
  {
    from: {
      field: 'region',
      value: 'wk'
    },
    to: {
      field: 'region',
      value: 'um'
    }
  },
  {
    from: {
      field: 'region',
      value: 'yd'
    },
    to: {
      field: 'region',
      value: 'ye'
    }
  },
  {
    from: {
      field: 'region',
      value: 'zr'
    },
    to: {
      field: 'region',
      value: 'cd'
    }
  },
  {
    from: {
      field: 'region',
      value: '230'
    },
    to: {
      field: 'region',
      value: 'et'
    }
  },
  {
    from: {
      field: 'region',
      value: '280'
    },
    to: {
      field: 'region',
      value: 'de'
    }
  },
  {
    from: {
      field: 'region',
      value: '736'
    },
    to: {
      field: 'region',
      value: 'sd'
    }
  },
  {
    from: {
      field: 'region',
      value: '886'
    },
    to: {
      field: 'region',
      value: 'ye'
    }
  },
  {
    from: {
      field: 'region',
      value: '958'
    },
    to: {
      field: 'region',
      value: 'aa'
    }
  },
  {
    from: {
      field: 'region',
      value: '020'
    },
    to: {
      field: 'region',
      value: 'ad'
    }
  },
  {
    from: {
      field: 'region',
      value: '784'
    },
    to: {
      field: 'region',
      value: 'ae'
    }
  },
  {
    from: {
      field: 'region',
      value: '004'
    },
    to: {
      field: 'region',
      value: 'af'
    }
  },
  {
    from: {
      field: 'region',
      value: '028'
    },
    to: {
      field: 'region',
      value: 'ag'
    }
  },
  {
    from: {
      field: 'region',
      value: '660'
    },
    to: {
      field: 'region',
      value: 'ai'
    }
  },
  {
    from: {
      field: 'region',
      value: '008'
    },
    to: {
      field: 'region',
      value: 'al'
    }
  },
  {
    from: {
      field: 'region',
      value: '051'
    },
    to: {
      field: 'region',
      value: 'am'
    }
  },
  {
    from: {
      field: 'region',
      value: '024'
    },
    to: {
      field: 'region',
      value: 'ao'
    }
  },
  {
    from: {
      field: 'region',
      value: '010'
    },
    to: {
      field: 'region',
      value: 'aq'
    }
  },
  {
    from: {
      field: 'region',
      value: '032'
    },
    to: {
      field: 'region',
      value: 'ar'
    }
  },
  {
    from: {
      field: 'region',
      value: '016'
    },
    to: {
      field: 'region',
      value: 'as'
    }
  },
  {
    from: {
      field: 'region',
      value: '040'
    },
    to: {
      field: 'region',
      value: 'at'
    }
  },
  {
    from: {
      field: 'region',
      value: '036'
    },
    to: {
      field: 'region',
      value: 'au'
    }
  },
  {
    from: {
      field: 'region',
      value: '533'
    },
    to: {
      field: 'region',
      value: 'aw'
    }
  },
  {
    from: {
      field: 'region',
      value: '248'
    },
    to: {
      field: 'region',
      value: 'ax'
    }
  },
  {
    from: {
      field: 'region',
      value: '031'
    },
    to: {
      field: 'region',
      value: 'az'
    }
  },
  {
    from: {
      field: 'region',
      value: '070'
    },
    to: {
      field: 'region',
      value: 'ba'
    }
  },
  {
    from: {
      field: 'region',
      value: '052'
    },
    to: {
      field: 'region',
      value: 'bb'
    }
  },
  {
    from: {
      field: 'region',
      value: '050'
    },
    to: {
      field: 'region',
      value: 'bd'
    }
  },
  {
    from: {
      field: 'region',
      value: '056'
    },
    to: {
      field: 'region',
      value: 'be'
    }
  },
  {
    from: {
      field: 'region',
      value: '854'
    },
    to: {
      field: 'region',
      value: 'bf'
    }
  },
  {
    from: {
      field: 'region',
      value: '100'
    },
    to: {
      field: 'region',
      value: 'bg'
    }
  },
  {
    from: {
      field: 'region',
      value: '048'
    },
    to: {
      field: 'region',
      value: 'bh'
    }
  },
  {
    from: {
      field: 'region',
      value: '108'
    },
    to: {
      field: 'region',
      value: 'bi'
    }
  },
  {
    from: {
      field: 'region',
      value: '204'
    },
    to: {
      field: 'region',
      value: 'bj'
    }
  },
  {
    from: {
      field: 'region',
      value: '652'
    },
    to: {
      field: 'region',
      value: 'bl'
    }
  },
  {
    from: {
      field: 'region',
      value: '060'
    },
    to: {
      field: 'region',
      value: 'bm'
    }
  },
  {
    from: {
      field: 'region',
      value: '096'
    },
    to: {
      field: 'region',
      value: 'bn'
    }
  },
  {
    from: {
      field: 'region',
      value: '068'
    },
    to: {
      field: 'region',
      value: 'bo'
    }
  },
  {
    from: {
      field: 'region',
      value: '535'
    },
    to: {
      field: 'region',
      value: 'bq'
    }
  },
  {
    from: {
      field: 'region',
      value: '076'
    },
    to: {
      field: 'region',
      value: 'br'
    }
  },
  {
    from: {
      field: 'region',
      value: '044'
    },
    to: {
      field: 'region',
      value: 'bs'
    }
  },
  {
    from: {
      field: 'region',
      value: '064'
    },
    to: {
      field: 'region',
      value: 'bt'
    }
  },
  {
    from: {
      field: 'region',
      value: '104'
    },
    to: {
      field: 'region',
      value: 'mm'
    }
  },
  {
    from: {
      field: 'region',
      value: '074'
    },
    to: {
      field: 'region',
      value: 'bv'
    }
  },
  {
    from: {
      field: 'region',
      value: '072'
    },
    to: {
      field: 'region',
      value: 'bw'
    }
  },
  {
    from: {
      field: 'region',
      value: '112'
    },
    to: {
      field: 'region',
      value: 'by'
    }
  },
  {
    from: {
      field: 'region',
      value: '084'
    },
    to: {
      field: 'region',
      value: 'bz'
    }
  },
  {
    from: {
      field: 'region',
      value: '124'
    },
    to: {
      field: 'region',
      value: 'ca'
    }
  },
  {
    from: {
      field: 'region',
      value: '166'
    },
    to: {
      field: 'region',
      value: 'cc'
    }
  },
  {
    from: {
      field: 'region',
      value: '180'
    },
    to: {
      field: 'region',
      value: 'cd'
    }
  },
  {
    from: {
      field: 'region',
      value: '140'
    },
    to: {
      field: 'region',
      value: 'cf'
    }
  },
  {
    from: {
      field: 'region',
      value: '178'
    },
    to: {
      field: 'region',
      value: 'cg'
    }
  },
  {
    from: {
      field: 'region',
      value: '756'
    },
    to: {
      field: 'region',
      value: 'ch'
    }
  },
  {
    from: {
      field: 'region',
      value: '384'
    },
    to: {
      field: 'region',
      value: 'ci'
    }
  },
  {
    from: {
      field: 'region',
      value: '184'
    },
    to: {
      field: 'region',
      value: 'ck'
    }
  },
  {
    from: {
      field: 'region',
      value: '152'
    },
    to: {
      field: 'region',
      value: 'cl'
    }
  },
  {
    from: {
      field: 'region',
      value: '120'
    },
    to: {
      field: 'region',
      value: 'cm'
    }
  },
  {
    from: {
      field: 'region',
      value: '156'
    },
    to: {
      field: 'region',
      value: 'cn'
    }
  },
  {
    from: {
      field: 'region',
      value: '170'
    },
    to: {
      field: 'region',
      value: 'co'
    }
  },
  {
    from: {
      field: 'region',
      value: '188'
    },
    to: {
      field: 'region',
      value: 'cr'
    }
  },
  {
    from: {
      field: 'region',
      value: '192'
    },
    to: {
      field: 'region',
      value: 'cu'
    }
  },
  {
    from: {
      field: 'region',
      value: '132'
    },
    to: {
      field: 'region',
      value: 'cv'
    }
  },
  {
    from: {
      field: 'region',
      value: '531'
    },
    to: {
      field: 'region',
      value: 'cw'
    }
  },
  {
    from: {
      field: 'region',
      value: '162'
    },
    to: {
      field: 'region',
      value: 'cx'
    }
  },
  {
    from: {
      field: 'region',
      value: '196'
    },
    to: {
      field: 'region',
      value: 'cy'
    }
  },
  {
    from: {
      field: 'region',
      value: '203'
    },
    to: {
      field: 'region',
      value: 'cz'
    }
  },
  {
    from: {
      field: 'region',
      value: '278'
    },
    to: {
      field: 'region',
      value: 'de'
    }
  },
  {
    from: {
      field: 'region',
      value: '276'
    },
    to: {
      field: 'region',
      value: 'de'
    }
  },
  {
    from: {
      field: 'region',
      value: '262'
    },
    to: {
      field: 'region',
      value: 'dj'
    }
  },
  {
    from: {
      field: 'region',
      value: '208'
    },
    to: {
      field: 'region',
      value: 'dk'
    }
  },
  {
    from: {
      field: 'region',
      value: '212'
    },
    to: {
      field: 'region',
      value: 'dm'
    }
  },
  {
    from: {
      field: 'region',
      value: '214'
    },
    to: {
      field: 'region',
      value: 'do'
    }
  },
  {
    from: {
      field: 'region',
      value: '012'
    },
    to: {
      field: 'region',
      value: 'dz'
    }
  },
  {
    from: {
      field: 'region',
      value: '218'
    },
    to: {
      field: 'region',
      value: 'ec'
    }
  },
  {
    from: {
      field: 'region',
      value: '233'
    },
    to: {
      field: 'region',
      value: 'ee'
    }
  },
  {
    from: {
      field: 'region',
      value: '818'
    },
    to: {
      field: 'region',
      value: 'eg'
    }
  },
  {
    from: {
      field: 'region',
      value: '732'
    },
    to: {
      field: 'region',
      value: 'eh'
    }
  },
  {
    from: {
      field: 'region',
      value: '232'
    },
    to: {
      field: 'region',
      value: 'er'
    }
  },
  {
    from: {
      field: 'region',
      value: '724'
    },
    to: {
      field: 'region',
      value: 'es'
    }
  },
  {
    from: {
      field: 'region',
      value: '231'
    },
    to: {
      field: 'region',
      value: 'et'
    }
  },
  {
    from: {
      field: 'region',
      value: '246'
    },
    to: {
      field: 'region',
      value: 'fi'
    }
  },
  {
    from: {
      field: 'region',
      value: '242'
    },
    to: {
      field: 'region',
      value: 'fj'
    }
  },
  {
    from: {
      field: 'region',
      value: '238'
    },
    to: {
      field: 'region',
      value: 'fk'
    }
  },
  {
    from: {
      field: 'region',
      value: '583'
    },
    to: {
      field: 'region',
      value: 'fm'
    }
  },
  {
    from: {
      field: 'region',
      value: '234'
    },
    to: {
      field: 'region',
      value: 'fo'
    }
  },
  {
    from: {
      field: 'region',
      value: '250'
    },
    to: {
      field: 'region',
      value: 'fr'
    }
  },
  {
    from: {
      field: 'region',
      value: '249'
    },
    to: {
      field: 'region',
      value: 'fr'
    }
  },
  {
    from: {
      field: 'region',
      value: '266'
    },
    to: {
      field: 'region',
      value: 'ga'
    }
  },
  {
    from: {
      field: 'region',
      value: '826'
    },
    to: {
      field: 'region',
      value: 'gb'
    }
  },
  {
    from: {
      field: 'region',
      value: '308'
    },
    to: {
      field: 'region',
      value: 'gd'
    }
  },
  {
    from: {
      field: 'region',
      value: '268'
    },
    to: {
      field: 'region',
      value: 'ge'
    }
  },
  {
    from: {
      field: 'region',
      value: '254'
    },
    to: {
      field: 'region',
      value: 'gf'
    }
  },
  {
    from: {
      field: 'region',
      value: '831'
    },
    to: {
      field: 'region',
      value: 'gg'
    }
  },
  {
    from: {
      field: 'region',
      value: '288'
    },
    to: {
      field: 'region',
      value: 'gh'
    }
  },
  {
    from: {
      field: 'region',
      value: '292'
    },
    to: {
      field: 'region',
      value: 'gi'
    }
  },
  {
    from: {
      field: 'region',
      value: '304'
    },
    to: {
      field: 'region',
      value: 'gl'
    }
  },
  {
    from: {
      field: 'region',
      value: '270'
    },
    to: {
      field: 'region',
      value: 'gm'
    }
  },
  {
    from: {
      field: 'region',
      value: '324'
    },
    to: {
      field: 'region',
      value: 'gn'
    }
  },
  {
    from: {
      field: 'region',
      value: '312'
    },
    to: {
      field: 'region',
      value: 'gp'
    }
  },
  {
    from: {
      field: 'region',
      value: '226'
    },
    to: {
      field: 'region',
      value: 'gq'
    }
  },
  {
    from: {
      field: 'region',
      value: '300'
    },
    to: {
      field: 'region',
      value: 'gr'
    }
  },
  {
    from: {
      field: 'region',
      value: '239'
    },
    to: {
      field: 'region',
      value: 'gs'
    }
  },
  {
    from: {
      field: 'region',
      value: '320'
    },
    to: {
      field: 'region',
      value: 'gt'
    }
  },
  {
    from: {
      field: 'region',
      value: '316'
    },
    to: {
      field: 'region',
      value: 'gu'
    }
  },
  {
    from: {
      field: 'region',
      value: '624'
    },
    to: {
      field: 'region',
      value: 'gw'
    }
  },
  {
    from: {
      field: 'region',
      value: '328'
    },
    to: {
      field: 'region',
      value: 'gy'
    }
  },
  {
    from: {
      field: 'region',
      value: '344'
    },
    to: {
      field: 'region',
      value: 'hk'
    }
  },
  {
    from: {
      field: 'region',
      value: '334'
    },
    to: {
      field: 'region',
      value: 'hm'
    }
  },
  {
    from: {
      field: 'region',
      value: '340'
    },
    to: {
      field: 'region',
      value: 'hn'
    }
  },
  {
    from: {
      field: 'region',
      value: '191'
    },
    to: {
      field: 'region',
      value: 'hr'
    }
  },
  {
    from: {
      field: 'region',
      value: '332'
    },
    to: {
      field: 'region',
      value: 'ht'
    }
  },
  {
    from: {
      field: 'region',
      value: '348'
    },
    to: {
      field: 'region',
      value: 'hu'
    }
  },
  {
    from: {
      field: 'region',
      value: '360'
    },
    to: {
      field: 'region',
      value: 'id'
    }
  },
  {
    from: {
      field: 'region',
      value: '372'
    },
    to: {
      field: 'region',
      value: 'ie'
    }
  },
  {
    from: {
      field: 'region',
      value: '376'
    },
    to: {
      field: 'region',
      value: 'il'
    }
  },
  {
    from: {
      field: 'region',
      value: '833'
    },
    to: {
      field: 'region',
      value: 'im'
    }
  },
  {
    from: {
      field: 'region',
      value: '356'
    },
    to: {
      field: 'region',
      value: 'in'
    }
  },
  {
    from: {
      field: 'region',
      value: '086'
    },
    to: {
      field: 'region',
      value: 'io'
    }
  },
  {
    from: {
      field: 'region',
      value: '368'
    },
    to: {
      field: 'region',
      value: 'iq'
    }
  },
  {
    from: {
      field: 'region',
      value: '364'
    },
    to: {
      field: 'region',
      value: 'ir'
    }
  },
  {
    from: {
      field: 'region',
      value: '352'
    },
    to: {
      field: 'region',
      value: 'is'
    }
  },
  {
    from: {
      field: 'region',
      value: '380'
    },
    to: {
      field: 'region',
      value: 'it'
    }
  },
  {
    from: {
      field: 'region',
      value: '832'
    },
    to: {
      field: 'region',
      value: 'je'
    }
  },
  {
    from: {
      field: 'region',
      value: '388'
    },
    to: {
      field: 'region',
      value: 'jm'
    }
  },
  {
    from: {
      field: 'region',
      value: '400'
    },
    to: {
      field: 'region',
      value: 'jo'
    }
  },
  {
    from: {
      field: 'region',
      value: '392'
    },
    to: {
      field: 'region',
      value: 'jp'
    }
  },
  {
    from: {
      field: 'region',
      value: '404'
    },
    to: {
      field: 'region',
      value: 'ke'
    }
  },
  {
    from: {
      field: 'region',
      value: '417'
    },
    to: {
      field: 'region',
      value: 'kg'
    }
  },
  {
    from: {
      field: 'region',
      value: '116'
    },
    to: {
      field: 'region',
      value: 'kh'
    }
  },
  {
    from: {
      field: 'region',
      value: '296'
    },
    to: {
      field: 'region',
      value: 'ki'
    }
  },
  {
    from: {
      field: 'region',
      value: '174'
    },
    to: {
      field: 'region',
      value: 'km'
    }
  },
  {
    from: {
      field: 'region',
      value: '659'
    },
    to: {
      field: 'region',
      value: 'kn'
    }
  },
  {
    from: {
      field: 'region',
      value: '408'
    },
    to: {
      field: 'region',
      value: 'kp'
    }
  },
  {
    from: {
      field: 'region',
      value: '410'
    },
    to: {
      field: 'region',
      value: 'kr'
    }
  },
  {
    from: {
      field: 'region',
      value: '414'
    },
    to: {
      field: 'region',
      value: 'kw'
    }
  },
  {
    from: {
      field: 'region',
      value: '136'
    },
    to: {
      field: 'region',
      value: 'ky'
    }
  },
  {
    from: {
      field: 'region',
      value: '398'
    },
    to: {
      field: 'region',
      value: 'kz'
    }
  },
  {
    from: {
      field: 'region',
      value: '418'
    },
    to: {
      field: 'region',
      value: 'la'
    }
  },
  {
    from: {
      field: 'region',
      value: '422'
    },
    to: {
      field: 'region',
      value: 'lb'
    }
  },
  {
    from: {
      field: 'region',
      value: '662'
    },
    to: {
      field: 'region',
      value: 'lc'
    }
  },
  {
    from: {
      field: 'region',
      value: '438'
    },
    to: {
      field: 'region',
      value: 'li'
    }
  },
  {
    from: {
      field: 'region',
      value: '144'
    },
    to: {
      field: 'region',
      value: 'lk'
    }
  },
  {
    from: {
      field: 'region',
      value: '430'
    },
    to: {
      field: 'region',
      value: 'lr'
    }
  },
  {
    from: {
      field: 'region',
      value: '426'
    },
    to: {
      field: 'region',
      value: 'ls'
    }
  },
  {
    from: {
      field: 'region',
      value: '440'
    },
    to: {
      field: 'region',
      value: 'lt'
    }
  },
  {
    from: {
      field: 'region',
      value: '442'
    },
    to: {
      field: 'region',
      value: 'lu'
    }
  },
  {
    from: {
      field: 'region',
      value: '428'
    },
    to: {
      field: 'region',
      value: 'lv'
    }
  },
  {
    from: {
      field: 'region',
      value: '434'
    },
    to: {
      field: 'region',
      value: 'ly'
    }
  },
  {
    from: {
      field: 'region',
      value: '504'
    },
    to: {
      field: 'region',
      value: 'ma'
    }
  },
  {
    from: {
      field: 'region',
      value: '492'
    },
    to: {
      field: 'region',
      value: 'mc'
    }
  },
  {
    from: {
      field: 'region',
      value: '498'
    },
    to: {
      field: 'region',
      value: 'md'
    }
  },
  {
    from: {
      field: 'region',
      value: '499'
    },
    to: {
      field: 'region',
      value: 'me'
    }
  },
  {
    from: {
      field: 'region',
      value: '663'
    },
    to: {
      field: 'region',
      value: 'mf'
    }
  },
  {
    from: {
      field: 'region',
      value: '450'
    },
    to: {
      field: 'region',
      value: 'mg'
    }
  },
  {
    from: {
      field: 'region',
      value: '584'
    },
    to: {
      field: 'region',
      value: 'mh'
    }
  },
  {
    from: {
      field: 'region',
      value: '807'
    },
    to: {
      field: 'region',
      value: 'mk'
    }
  },
  {
    from: {
      field: 'region',
      value: '466'
    },
    to: {
      field: 'region',
      value: 'ml'
    }
  },
  {
    from: {
      field: 'region',
      value: '496'
    },
    to: {
      field: 'region',
      value: 'mn'
    }
  },
  {
    from: {
      field: 'region',
      value: '446'
    },
    to: {
      field: 'region',
      value: 'mo'
    }
  },
  {
    from: {
      field: 'region',
      value: '580'
    },
    to: {
      field: 'region',
      value: 'mp'
    }
  },
  {
    from: {
      field: 'region',
      value: '474'
    },
    to: {
      field: 'region',
      value: 'mq'
    }
  },
  {
    from: {
      field: 'region',
      value: '478'
    },
    to: {
      field: 'region',
      value: 'mr'
    }
  },
  {
    from: {
      field: 'region',
      value: '500'
    },
    to: {
      field: 'region',
      value: 'ms'
    }
  },
  {
    from: {
      field: 'region',
      value: '470'
    },
    to: {
      field: 'region',
      value: 'mt'
    }
  },
  {
    from: {
      field: 'region',
      value: '480'
    },
    to: {
      field: 'region',
      value: 'mu'
    }
  },
  {
    from: {
      field: 'region',
      value: '462'
    },
    to: {
      field: 'region',
      value: 'mv'
    }
  },
  {
    from: {
      field: 'region',
      value: '454'
    },
    to: {
      field: 'region',
      value: 'mw'
    }
  },
  {
    from: {
      field: 'region',
      value: '484'
    },
    to: {
      field: 'region',
      value: 'mx'
    }
  },
  {
    from: {
      field: 'region',
      value: '458'
    },
    to: {
      field: 'region',
      value: 'my'
    }
  },
  {
    from: {
      field: 'region',
      value: '508'
    },
    to: {
      field: 'region',
      value: 'mz'
    }
  },
  {
    from: {
      field: 'region',
      value: '516'
    },
    to: {
      field: 'region',
      value: 'na'
    }
  },
  {
    from: {
      field: 'region',
      value: '540'
    },
    to: {
      field: 'region',
      value: 'nc'
    }
  },
  {
    from: {
      field: 'region',
      value: '562'
    },
    to: {
      field: 'region',
      value: 'ne'
    }
  },
  {
    from: {
      field: 'region',
      value: '574'
    },
    to: {
      field: 'region',
      value: 'nf'
    }
  },
  {
    from: {
      field: 'region',
      value: '566'
    },
    to: {
      field: 'region',
      value: 'ng'
    }
  },
  {
    from: {
      field: 'region',
      value: '558'
    },
    to: {
      field: 'region',
      value: 'ni'
    }
  },
  {
    from: {
      field: 'region',
      value: '528'
    },
    to: {
      field: 'region',
      value: 'nl'
    }
  },
  {
    from: {
      field: 'region',
      value: '578'
    },
    to: {
      field: 'region',
      value: 'no'
    }
  },
  {
    from: {
      field: 'region',
      value: '524'
    },
    to: {
      field: 'region',
      value: 'np'
    }
  },
  {
    from: {
      field: 'region',
      value: '520'
    },
    to: {
      field: 'region',
      value: 'nr'
    }
  },
  {
    from: {
      field: 'region',
      value: '570'
    },
    to: {
      field: 'region',
      value: 'nu'
    }
  },
  {
    from: {
      field: 'region',
      value: '554'
    },
    to: {
      field: 'region',
      value: 'nz'
    }
  },
  {
    from: {
      field: 'region',
      value: '512'
    },
    to: {
      field: 'region',
      value: 'om'
    }
  },
  {
    from: {
      field: 'region',
      value: '591'
    },
    to: {
      field: 'region',
      value: 'pa'
    }
  },
  {
    from: {
      field: 'region',
      value: '604'
    },
    to: {
      field: 'region',
      value: 'pe'
    }
  },
  {
    from: {
      field: 'region',
      value: '258'
    },
    to: {
      field: 'region',
      value: 'pf'
    }
  },
  {
    from: {
      field: 'region',
      value: '598'
    },
    to: {
      field: 'region',
      value: 'pg'
    }
  },
  {
    from: {
      field: 'region',
      value: '608'
    },
    to: {
      field: 'region',
      value: 'ph'
    }
  },
  {
    from: {
      field: 'region',
      value: '586'
    },
    to: {
      field: 'region',
      value: 'pk'
    }
  },
  {
    from: {
      field: 'region',
      value: '616'
    },
    to: {
      field: 'region',
      value: 'pl'
    }
  },
  {
    from: {
      field: 'region',
      value: '666'
    },
    to: {
      field: 'region',
      value: 'pm'
    }
  },
  {
    from: {
      field: 'region',
      value: '612'
    },
    to: {
      field: 'region',
      value: 'pn'
    }
  },
  {
    from: {
      field: 'region',
      value: '630'
    },
    to: {
      field: 'region',
      value: 'pr'
    }
  },
  {
    from: {
      field: 'region',
      value: '275'
    },
    to: {
      field: 'region',
      value: 'ps'
    }
  },
  {
    from: {
      field: 'region',
      value: '620'
    },
    to: {
      field: 'region',
      value: 'pt'
    }
  },
  {
    from: {
      field: 'region',
      value: '585'
    },
    to: {
      field: 'region',
      value: 'pw'
    }
  },
  {
    from: {
      field: 'region',
      value: '600'
    },
    to: {
      field: 'region',
      value: 'py'
    }
  },
  {
    from: {
      field: 'region',
      value: '634'
    },
    to: {
      field: 'region',
      value: 'qa'
    }
  },
  {
    from: {
      field: 'region',
      value: '959'
    },
    to: {
      field: 'region',
      value: 'qm'
    }
  },
  {
    from: {
      field: 'region',
      value: '960'
    },
    to: {
      field: 'region',
      value: 'qn'
    }
  },
  {
    from: {
      field: 'region',
      value: '962'
    },
    to: {
      field: 'region',
      value: 'qp'
    }
  },
  {
    from: {
      field: 'region',
      value: '963'
    },
    to: {
      field: 'region',
      value: 'qq'
    }
  },
  {
    from: {
      field: 'region',
      value: '964'
    },
    to: {
      field: 'region',
      value: 'qr'
    }
  },
  {
    from: {
      field: 'region',
      value: '965'
    },
    to: {
      field: 'region',
      value: 'qs'
    }
  },
  {
    from: {
      field: 'region',
      value: '966'
    },
    to: {
      field: 'region',
      value: 'qt'
    }
  },
  {
    from: {
      field: 'region',
      value: '967'
    },
    to: {
      field: 'region',
      value: 'eu'
    }
  },
  {
    from: {
      field: 'region',
      value: '968'
    },
    to: {
      field: 'region',
      value: 'qv'
    }
  },
  {
    from: {
      field: 'region',
      value: '969'
    },
    to: {
      field: 'region',
      value: 'qw'
    }
  },
  {
    from: {
      field: 'region',
      value: '970'
    },
    to: {
      field: 'region',
      value: 'qx'
    }
  },
  {
    from: {
      field: 'region',
      value: '971'
    },
    to: {
      field: 'region',
      value: 'qy'
    }
  },
  {
    from: {
      field: 'region',
      value: '972'
    },
    to: {
      field: 'region',
      value: 'qz'
    }
  },
  {
    from: {
      field: 'region',
      value: '638'
    },
    to: {
      field: 'region',
      value: 're'
    }
  },
  {
    from: {
      field: 'region',
      value: '642'
    },
    to: {
      field: 'region',
      value: 'ro'
    }
  },
  {
    from: {
      field: 'region',
      value: '688'
    },
    to: {
      field: 'region',
      value: 'rs'
    }
  },
  {
    from: {
      field: 'region',
      value: '643'
    },
    to: {
      field: 'region',
      value: 'ru'
    }
  },
  {
    from: {
      field: 'region',
      value: '646'
    },
    to: {
      field: 'region',
      value: 'rw'
    }
  },
  {
    from: {
      field: 'region',
      value: '682'
    },
    to: {
      field: 'region',
      value: 'sa'
    }
  },
  {
    from: {
      field: 'region',
      value: '090'
    },
    to: {
      field: 'region',
      value: 'sb'
    }
  },
  {
    from: {
      field: 'region',
      value: '690'
    },
    to: {
      field: 'region',
      value: 'sc'
    }
  },
  {
    from: {
      field: 'region',
      value: '729'
    },
    to: {
      field: 'region',
      value: 'sd'
    }
  },
  {
    from: {
      field: 'region',
      value: '752'
    },
    to: {
      field: 'region',
      value: 'se'
    }
  },
  {
    from: {
      field: 'region',
      value: '702'
    },
    to: {
      field: 'region',
      value: 'sg'
    }
  },
  {
    from: {
      field: 'region',
      value: '654'
    },
    to: {
      field: 'region',
      value: 'sh'
    }
  },
  {
    from: {
      field: 'region',
      value: '705'
    },
    to: {
      field: 'region',
      value: 'si'
    }
  },
  {
    from: {
      field: 'region',
      value: '744'
    },
    to: {
      field: 'region',
      value: 'sj'
    }
  },
  {
    from: {
      field: 'region',
      value: '703'
    },
    to: {
      field: 'region',
      value: 'sk'
    }
  },
  {
    from: {
      field: 'region',
      value: '694'
    },
    to: {
      field: 'region',
      value: 'sl'
    }
  },
  {
    from: {
      field: 'region',
      value: '674'
    },
    to: {
      field: 'region',
      value: 'sm'
    }
  },
  {
    from: {
      field: 'region',
      value: '686'
    },
    to: {
      field: 'region',
      value: 'sn'
    }
  },
  {
    from: {
      field: 'region',
      value: '706'
    },
    to: {
      field: 'region',
      value: 'so'
    }
  },
  {
    from: {
      field: 'region',
      value: '740'
    },
    to: {
      field: 'region',
      value: 'sr'
    }
  },
  {
    from: {
      field: 'region',
      value: '728'
    },
    to: {
      field: 'region',
      value: 'ss'
    }
  },
  {
    from: {
      field: 'region',
      value: '678'
    },
    to: {
      field: 'region',
      value: 'st'
    }
  },
  {
    from: {
      field: 'region',
      value: '222'
    },
    to: {
      field: 'region',
      value: 'sv'
    }
  },
  {
    from: {
      field: 'region',
      value: '534'
    },
    to: {
      field: 'region',
      value: 'sx'
    }
  },
  {
    from: {
      field: 'region',
      value: '760'
    },
    to: {
      field: 'region',
      value: 'sy'
    }
  },
  {
    from: {
      field: 'region',
      value: '748'
    },
    to: {
      field: 'region',
      value: 'sz'
    }
  },
  {
    from: {
      field: 'region',
      value: '796'
    },
    to: {
      field: 'region',
      value: 'tc'
    }
  },
  {
    from: {
      field: 'region',
      value: '148'
    },
    to: {
      field: 'region',
      value: 'td'
    }
  },
  {
    from: {
      field: 'region',
      value: '260'
    },
    to: {
      field: 'region',
      value: 'tf'
    }
  },
  {
    from: {
      field: 'region',
      value: '768'
    },
    to: {
      field: 'region',
      value: 'tg'
    }
  },
  {
    from: {
      field: 'region',
      value: '764'
    },
    to: {
      field: 'region',
      value: 'th'
    }
  },
  {
    from: {
      field: 'region',
      value: '762'
    },
    to: {
      field: 'region',
      value: 'tj'
    }
  },
  {
    from: {
      field: 'region',
      value: '772'
    },
    to: {
      field: 'region',
      value: 'tk'
    }
  },
  {
    from: {
      field: 'region',
      value: '626'
    },
    to: {
      field: 'region',
      value: 'tl'
    }
  },
  {
    from: {
      field: 'region',
      value: '795'
    },
    to: {
      field: 'region',
      value: 'tm'
    }
  },
  {
    from: {
      field: 'region',
      value: '788'
    },
    to: {
      field: 'region',
      value: 'tn'
    }
  },
  {
    from: {
      field: 'region',
      value: '776'
    },
    to: {
      field: 'region',
      value: 'to'
    }
  },
  {
    from: {
      field: 'region',
      value: '792'
    },
    to: {
      field: 'region',
      value: 'tr'
    }
  },
  {
    from: {
      field: 'region',
      value: '780'
    },
    to: {
      field: 'region',
      value: 'tt'
    }
  },
  {
    from: {
      field: 'region',
      value: '798'
    },
    to: {
      field: 'region',
      value: 'tv'
    }
  },
  {
    from: {
      field: 'region',
      value: '158'
    },
    to: {
      field: 'region',
      value: 'tw'
    }
  },
  {
    from: {
      field: 'region',
      value: '834'
    },
    to: {
      field: 'region',
      value: 'tz'
    }
  },
  {
    from: {
      field: 'region',
      value: '804'
    },
    to: {
      field: 'region',
      value: 'ua'
    }
  },
  {
    from: {
      field: 'region',
      value: '800'
    },
    to: {
      field: 'region',
      value: 'ug'
    }
  },
  {
    from: {
      field: 'region',
      value: '581'
    },
    to: {
      field: 'region',
      value: 'um'
    }
  },
  {
    from: {
      field: 'region',
      value: '840'
    },
    to: {
      field: 'region',
      value: 'us'
    }
  },
  {
    from: {
      field: 'region',
      value: '858'
    },
    to: {
      field: 'region',
      value: 'uy'
    }
  },
  {
    from: {
      field: 'region',
      value: '860'
    },
    to: {
      field: 'region',
      value: 'uz'
    }
  },
  {
    from: {
      field: 'region',
      value: '336'
    },
    to: {
      field: 'region',
      value: 'va'
    }
  },
  {
    from: {
      field: 'region',
      value: '670'
    },
    to: {
      field: 'region',
      value: 'vc'
    }
  },
  {
    from: {
      field: 'region',
      value: '862'
    },
    to: {
      field: 'region',
      value: 've'
    }
  },
  {
    from: {
      field: 'region',
      value: '092'
    },
    to: {
      field: 'region',
      value: 'vg'
    }
  },
  {
    from: {
      field: 'region',
      value: '850'
    },
    to: {
      field: 'region',
      value: 'vi'
    }
  },
  {
    from: {
      field: 'region',
      value: '704'
    },
    to: {
      field: 'region',
      value: 'vn'
    }
  },
  {
    from: {
      field: 'region',
      value: '548'
    },
    to: {
      field: 'region',
      value: 'vu'
    }
  },
  {
    from: {
      field: 'region',
      value: '876'
    },
    to: {
      field: 'region',
      value: 'wf'
    }
  },
  {
    from: {
      field: 'region',
      value: '882'
    },
    to: {
      field: 'region',
      value: 'ws'
    }
  },
  {
    from: {
      field: 'region',
      value: '973'
    },
    to: {
      field: 'region',
      value: 'xa'
    }
  },
  {
    from: {
      field: 'region',
      value: '974'
    },
    to: {
      field: 'region',
      value: 'xb'
    }
  },
  {
    from: {
      field: 'region',
      value: '975'
    },
    to: {
      field: 'region',
      value: 'xc'
    }
  },
  {
    from: {
      field: 'region',
      value: '976'
    },
    to: {
      field: 'region',
      value: 'xd'
    }
  },
  {
    from: {
      field: 'region',
      value: '977'
    },
    to: {
      field: 'region',
      value: 'xe'
    }
  },
  {
    from: {
      field: 'region',
      value: '978'
    },
    to: {
      field: 'region',
      value: 'xf'
    }
  },
  {
    from: {
      field: 'region',
      value: '979'
    },
    to: {
      field: 'region',
      value: 'xg'
    }
  },
  {
    from: {
      field: 'region',
      value: '980'
    },
    to: {
      field: 'region',
      value: 'xh'
    }
  },
  {
    from: {
      field: 'region',
      value: '981'
    },
    to: {
      field: 'region',
      value: 'xi'
    }
  },
  {
    from: {
      field: 'region',
      value: '982'
    },
    to: {
      field: 'region',
      value: 'xj'
    }
  },
  {
    from: {
      field: 'region',
      value: '983'
    },
    to: {
      field: 'region',
      value: 'xk'
    }
  },
  {
    from: {
      field: 'region',
      value: '984'
    },
    to: {
      field: 'region',
      value: 'xl'
    }
  },
  {
    from: {
      field: 'region',
      value: '985'
    },
    to: {
      field: 'region',
      value: 'xm'
    }
  },
  {
    from: {
      field: 'region',
      value: '986'
    },
    to: {
      field: 'region',
      value: 'xn'
    }
  },
  {
    from: {
      field: 'region',
      value: '987'
    },
    to: {
      field: 'region',
      value: 'xo'
    }
  },
  {
    from: {
      field: 'region',
      value: '988'
    },
    to: {
      field: 'region',
      value: 'xp'
    }
  },
  {
    from: {
      field: 'region',
      value: '989'
    },
    to: {
      field: 'region',
      value: 'xq'
    }
  },
  {
    from: {
      field: 'region',
      value: '990'
    },
    to: {
      field: 'region',
      value: 'xr'
    }
  },
  {
    from: {
      field: 'region',
      value: '991'
    },
    to: {
      field: 'region',
      value: 'xs'
    }
  },
  {
    from: {
      field: 'region',
      value: '992'
    },
    to: {
      field: 'region',
      value: 'xt'
    }
  },
  {
    from: {
      field: 'region',
      value: '993'
    },
    to: {
      field: 'region',
      value: 'xu'
    }
  },
  {
    from: {
      field: 'region',
      value: '994'
    },
    to: {
      field: 'region',
      value: 'xv'
    }
  },
  {
    from: {
      field: 'region',
      value: '995'
    },
    to: {
      field: 'region',
      value: 'xw'
    }
  },
  {
    from: {
      field: 'region',
      value: '996'
    },
    to: {
      field: 'region',
      value: 'xx'
    }
  },
  {
    from: {
      field: 'region',
      value: '997'
    },
    to: {
      field: 'region',
      value: 'xy'
    }
  },
  {
    from: {
      field: 'region',
      value: '998'
    },
    to: {
      field: 'region',
      value: 'xz'
    }
  },
  {
    from: {
      field: 'region',
      value: '720'
    },
    to: {
      field: 'region',
      value: 'ye'
    }
  },
  {
    from: {
      field: 'region',
      value: '887'
    },
    to: {
      field: 'region',
      value: 'ye'
    }
  },
  {
    from: {
      field: 'region',
      value: '175'
    },
    to: {
      field: 'region',
      value: 'yt'
    }
  },
  {
    from: {
      field: 'region',
      value: '710'
    },
    to: {
      field: 'region',
      value: 'za'
    }
  },
  {
    from: {
      field: 'region',
      value: '894'
    },
    to: {
      field: 'region',
      value: 'zm'
    }
  },
  {
    from: {
      field: 'region',
      value: '716'
    },
    to: {
      field: 'region',
      value: 'zw'
    }
  },
  {
    from: {
      field: 'region',
      value: '999'
    },
    to: {
      field: 'region',
      value: 'zz'
    }
  },
  {
    from: {
      field: 'variants',
      value: 'polytoni'
    },
    to: {
      field: 'variants',
      value: 'polyton'
    }
  },
  {
    from: {
      field: 'variants',
      value: 'heploc'
    },
    to: {
      field: 'variants',
      value: 'alalc97'
    }
  }
]

;// CONCATENATED MODULE: ./node_modules/bcp-47-normalize/lib/many.js
/**
 * @typedef {'script'|'region'|'variants'} Field
 */

/**
 * @type {{region: Record<string, Array<string>>}}
 */
const many = {
  region: {
    172: [
      'ru',
      'am',
      'az',
      'by',
      'ge',
      'kg',
      'kz',
      'md',
      'tj',
      'tm',
      'ua',
      'uz'
    ],
    200: ['cz', 'sk'],
    530: ['cw', 'sx', 'bq'],
    532: ['cw', 'sx', 'bq'],
    536: ['sa', 'iq'],
    582: ['fm', 'mh', 'mp', 'pw'],
    810: [
      'ru',
      'am',
      'az',
      'by',
      'ee',
      'ge',
      'kz',
      'kg',
      'lv',
      'lt',
      'md',
      'tj',
      'tm',
      'ua',
      'uz'
    ],
    830: ['je', 'gg'],
    890: ['rs', 'me', 'si', 'hr', 'mk', 'ba'],
    891: ['rs', 'me'],
    an: ['cw', 'sx', 'bq'],
    cs: ['rs', 'me'],
    fq: ['aq', 'tf'],
    nt: ['sa', 'iq'],
    pc: ['fm', 'mh', 'mp', 'pw'],
    su: [
      'ru',
      'am',
      'az',
      'by',
      'ee',
      'ge',
      'kz',
      'kg',
      'lv',
      'lt',
      'md',
      'tj',
      'tm',
      'ua',
      'uz'
    ],
    yu: ['rs', 'me'],
    '062': ['034', '143'],
    ant: ['cw', 'sx', 'bq'],
    scg: ['rs', 'me'],
    ntz: ['sa', 'iq'],
    sun: [
      'ru',
      'am',
      'az',
      'by',
      'ee',
      'ge',
      'kz',
      'kg',
      'lv',
      'lt',
      'md',
      'tj',
      'tm',
      'ua',
      'uz'
    ],
    yug: ['rs', 'me']
  }
}

;// CONCATENATED MODULE: ./node_modules/bcp-47-normalize/lib/likely.js
/**
 * @type {Record<string, string>}
 */
const likely = {
  aa: 'aa-latn-et',
  aai: 'aai-latn-zz',
  aak: 'aak-latn-zz',
  aau: 'aau-latn-zz',
  ab: 'ab-cyrl-ge',
  abi: 'abi-latn-zz',
  abq: 'abq-cyrl-zz',
  abr: 'abr-latn-gh',
  abt: 'abt-latn-zz',
  aby: 'aby-latn-zz',
  acd: 'acd-latn-zz',
  ace: 'ace-latn-id',
  ach: 'ach-latn-ug',
  ada: 'ada-latn-gh',
  ade: 'ade-latn-zz',
  adj: 'adj-latn-zz',
  adp: 'adp-tibt-bt',
  ady: 'ady-cyrl-ru',
  adz: 'adz-latn-zz',
  ae: 'ae-avst-ir',
  aeb: 'aeb-arab-tn',
  aey: 'aey-latn-zz',
  af: 'af-latn-za',
  agc: 'agc-latn-zz',
  agd: 'agd-latn-zz',
  agg: 'agg-latn-zz',
  agm: 'agm-latn-zz',
  ago: 'ago-latn-zz',
  agq: 'agq-latn-cm',
  aha: 'aha-latn-zz',
  ahl: 'ahl-latn-zz',
  aho: 'aho-ahom-in',
  ajg: 'ajg-latn-zz',
  ak: 'ak-latn-gh',
  akk: 'akk-xsux-iq',
  ala: 'ala-latn-zz',
  ali: 'ali-latn-zz',
  aln: 'aln-latn-xk',
  alt: 'alt-cyrl-ru',
  am: 'am-ethi-et',
  amm: 'amm-latn-zz',
  amn: 'amn-latn-zz',
  amo: 'amo-latn-ng',
  amp: 'amp-latn-zz',
  an: 'an-latn-es',
  anc: 'anc-latn-zz',
  ank: 'ank-latn-zz',
  ann: 'ann-latn-zz',
  any: 'any-latn-zz',
  aoj: 'aoj-latn-zz',
  aom: 'aom-latn-zz',
  aoz: 'aoz-latn-id',
  apc: 'apc-arab-zz',
  apd: 'apd-arab-tg',
  ape: 'ape-latn-zz',
  apr: 'apr-latn-zz',
  aps: 'aps-latn-zz',
  apz: 'apz-latn-zz',
  ar: 'ar-arab-eg',
  arc: 'arc-armi-ir',
  'arc-nbat': 'arc-nbat-jo',
  'arc-palm': 'arc-palm-sy',
  arh: 'arh-latn-zz',
  arn: 'arn-latn-cl',
  aro: 'aro-latn-bo',
  arq: 'arq-arab-dz',
  ars: 'ars-arab-sa',
  ary: 'ary-arab-ma',
  arz: 'arz-arab-eg',
  as: 'as-beng-in',
  asa: 'asa-latn-tz',
  ase: 'ase-sgnw-us',
  asg: 'asg-latn-zz',
  aso: 'aso-latn-zz',
  ast: 'ast-latn-es',
  ata: 'ata-latn-zz',
  atg: 'atg-latn-zz',
  atj: 'atj-latn-ca',
  auy: 'auy-latn-zz',
  av: 'av-cyrl-ru',
  avl: 'avl-arab-zz',
  avn: 'avn-latn-zz',
  avt: 'avt-latn-zz',
  avu: 'avu-latn-zz',
  awa: 'awa-deva-in',
  awb: 'awb-latn-zz',
  awo: 'awo-latn-zz',
  awx: 'awx-latn-zz',
  ay: 'ay-latn-bo',
  ayb: 'ayb-latn-zz',
  az: 'az-latn-az',
  'az-arab': 'az-arab-ir',
  'az-iq': 'az-arab-iq',
  'az-ir': 'az-arab-ir',
  'az-ru': 'az-cyrl-ru',
  ba: 'ba-cyrl-ru',
  bal: 'bal-arab-pk',
  ban: 'ban-latn-id',
  bap: 'bap-deva-np',
  bar: 'bar-latn-at',
  bas: 'bas-latn-cm',
  bav: 'bav-latn-zz',
  bax: 'bax-bamu-cm',
  bba: 'bba-latn-zz',
  bbb: 'bbb-latn-zz',
  bbc: 'bbc-latn-id',
  bbd: 'bbd-latn-zz',
  bbj: 'bbj-latn-cm',
  bbp: 'bbp-latn-zz',
  bbr: 'bbr-latn-zz',
  bcf: 'bcf-latn-zz',
  bch: 'bch-latn-zz',
  bci: 'bci-latn-ci',
  bcm: 'bcm-latn-zz',
  bcn: 'bcn-latn-zz',
  bco: 'bco-latn-zz',
  bcq: 'bcq-ethi-zz',
  bcu: 'bcu-latn-zz',
  bdd: 'bdd-latn-zz',
  be: 'be-cyrl-by',
  bef: 'bef-latn-zz',
  beh: 'beh-latn-zz',
  bej: 'bej-arab-sd',
  bem: 'bem-latn-zm',
  bet: 'bet-latn-zz',
  bew: 'bew-latn-id',
  bex: 'bex-latn-zz',
  bez: 'bez-latn-tz',
  bfd: 'bfd-latn-cm',
  bfq: 'bfq-taml-in',
  bft: 'bft-arab-pk',
  bfy: 'bfy-deva-in',
  bg: 'bg-cyrl-bg',
  bgc: 'bgc-deva-in',
  bgn: 'bgn-arab-pk',
  bgx: 'bgx-grek-tr',
  bhb: 'bhb-deva-in',
  bhg: 'bhg-latn-zz',
  bhi: 'bhi-deva-in',
  bhl: 'bhl-latn-zz',
  bho: 'bho-deva-in',
  bhy: 'bhy-latn-zz',
  bi: 'bi-latn-vu',
  bib: 'bib-latn-zz',
  big: 'big-latn-zz',
  bik: 'bik-latn-ph',
  bim: 'bim-latn-zz',
  bin: 'bin-latn-ng',
  bio: 'bio-latn-zz',
  biq: 'biq-latn-zz',
  bjh: 'bjh-latn-zz',
  bji: 'bji-ethi-zz',
  bjj: 'bjj-deva-in',
  bjn: 'bjn-latn-id',
  bjo: 'bjo-latn-zz',
  bjr: 'bjr-latn-zz',
  bjt: 'bjt-latn-sn',
  bjz: 'bjz-latn-zz',
  bkc: 'bkc-latn-zz',
  bkm: 'bkm-latn-cm',
  bkq: 'bkq-latn-zz',
  bku: 'bku-latn-ph',
  bkv: 'bkv-latn-zz',
  bla: 'bla-latn-ca',
  blg: 'blg-latn-my',
  blt: 'blt-tavt-vn',
  bm: 'bm-latn-ml',
  bmh: 'bmh-latn-zz',
  bmk: 'bmk-latn-zz',
  bmq: 'bmq-latn-ml',
  bmu: 'bmu-latn-zz',
  bn: 'bn-beng-bd',
  bng: 'bng-latn-zz',
  bnm: 'bnm-latn-zz',
  bnp: 'bnp-latn-zz',
  bo: 'bo-tibt-cn',
  boj: 'boj-latn-zz',
  bom: 'bom-latn-zz',
  bon: 'bon-latn-zz',
  bpy: 'bpy-beng-in',
  bqc: 'bqc-latn-zz',
  bqi: 'bqi-arab-ir',
  bqp: 'bqp-latn-zz',
  bqv: 'bqv-latn-ci',
  br: 'br-latn-fr',
  bra: 'bra-deva-in',
  brh: 'brh-arab-pk',
  brx: 'brx-deva-in',
  brz: 'brz-latn-zz',
  bs: 'bs-latn-ba',
  bsj: 'bsj-latn-zz',
  bsq: 'bsq-bass-lr',
  bss: 'bss-latn-cm',
  bst: 'bst-ethi-zz',
  bto: 'bto-latn-ph',
  btt: 'btt-latn-zz',
  btv: 'btv-deva-pk',
  bua: 'bua-cyrl-ru',
  buc: 'buc-latn-yt',
  bud: 'bud-latn-zz',
  bug: 'bug-latn-id',
  buk: 'buk-latn-zz',
  bum: 'bum-latn-cm',
  buo: 'buo-latn-zz',
  bus: 'bus-latn-zz',
  buu: 'buu-latn-zz',
  bvb: 'bvb-latn-gq',
  bwd: 'bwd-latn-zz',
  bwr: 'bwr-latn-zz',
  bxh: 'bxh-latn-zz',
  bye: 'bye-latn-zz',
  byn: 'byn-ethi-er',
  byr: 'byr-latn-zz',
  bys: 'bys-latn-zz',
  byv: 'byv-latn-cm',
  byx: 'byx-latn-zz',
  bza: 'bza-latn-zz',
  bze: 'bze-latn-ml',
  bzf: 'bzf-latn-zz',
  bzh: 'bzh-latn-zz',
  bzw: 'bzw-latn-zz',
  ca: 'ca-latn-es',
  cad: 'cad-latn-us',
  can: 'can-latn-zz',
  cbj: 'cbj-latn-zz',
  cch: 'cch-latn-ng',
  ccp: 'ccp-cakm-bd',
  ce: 'ce-cyrl-ru',
  ceb: 'ceb-latn-ph',
  cfa: 'cfa-latn-zz',
  cgg: 'cgg-latn-ug',
  ch: 'ch-latn-gu',
  chk: 'chk-latn-fm',
  chm: 'chm-cyrl-ru',
  cho: 'cho-latn-us',
  chp: 'chp-latn-ca',
  chr: 'chr-cher-us',
  cic: 'cic-latn-us',
  cja: 'cja-arab-kh',
  cjm: 'cjm-cham-vn',
  cjv: 'cjv-latn-zz',
  ckb: 'ckb-arab-iq',
  ckl: 'ckl-latn-zz',
  cko: 'cko-latn-zz',
  cky: 'cky-latn-zz',
  cla: 'cla-latn-zz',
  clc: 'clc-latn-ca',
  cme: 'cme-latn-zz',
  cmg: 'cmg-soyo-mn',
  co: 'co-latn-fr',
  cop: 'cop-copt-eg',
  cps: 'cps-latn-ph',
  cr: 'cr-cans-ca',
  crg: 'crg-latn-ca',
  crh: 'crh-cyrl-ua',
  crk: 'crk-cans-ca',
  crl: 'crl-cans-ca',
  crs: 'crs-latn-sc',
  cs: 'cs-latn-cz',
  csb: 'csb-latn-pl',
  csw: 'csw-cans-ca',
  ctd: 'ctd-pauc-mm',
  cu: 'cu-cyrl-ru',
  'cu-glag': 'cu-glag-bg',
  cv: 'cv-cyrl-ru',
  cy: 'cy-latn-gb',
  da: 'da-latn-dk',
  dad: 'dad-latn-zz',
  daf: 'daf-latn-ci',
  dag: 'dag-latn-zz',
  dah: 'dah-latn-zz',
  dak: 'dak-latn-us',
  dar: 'dar-cyrl-ru',
  dav: 'dav-latn-ke',
  dbd: 'dbd-latn-zz',
  dbq: 'dbq-latn-zz',
  dcc: 'dcc-arab-in',
  ddn: 'ddn-latn-zz',
  de: 'de-latn-de',
  ded: 'ded-latn-zz',
  den: 'den-latn-ca',
  dga: 'dga-latn-zz',
  dgh: 'dgh-latn-zz',
  dgi: 'dgi-latn-zz',
  dgl: 'dgl-arab-zz',
  dgr: 'dgr-latn-ca',
  dgz: 'dgz-latn-zz',
  dia: 'dia-latn-zz',
  dje: 'dje-latn-ne',
  dmf: 'dmf-medf-ng',
  dnj: 'dnj-latn-ci',
  dob: 'dob-latn-zz',
  doi: 'doi-deva-in',
  dop: 'dop-latn-zz',
  dow: 'dow-latn-zz',
  drh: 'drh-mong-cn',
  dri: 'dri-latn-zz',
  drs: 'drs-ethi-zz',
  dsb: 'dsb-latn-de',
  dtm: 'dtm-latn-ml',
  dtp: 'dtp-latn-my',
  dts: 'dts-latn-zz',
  dty: 'dty-deva-np',
  dua: 'dua-latn-cm',
  duc: 'duc-latn-zz',
  dud: 'dud-latn-zz',
  dug: 'dug-latn-zz',
  dv: 'dv-thaa-mv',
  dva: 'dva-latn-zz',
  dww: 'dww-latn-zz',
  dyo: 'dyo-latn-sn',
  dyu: 'dyu-latn-bf',
  dz: 'dz-tibt-bt',
  dzg: 'dzg-latn-zz',
  ebu: 'ebu-latn-ke',
  ee: 'ee-latn-gh',
  efi: 'efi-latn-ng',
  egl: 'egl-latn-it',
  egy: 'egy-egyp-eg',
  eka: 'eka-latn-zz',
  eky: 'eky-kali-mm',
  el: 'el-grek-gr',
  ema: 'ema-latn-zz',
  emi: 'emi-latn-zz',
  en: 'en-latn-us',
  'en-shaw': 'en-shaw-gb',
  enn: 'enn-latn-zz',
  enq: 'enq-latn-zz',
  eo: 'eo-latn-001',
  eri: 'eri-latn-zz',
  es: 'es-latn-es',
  esg: 'esg-gonm-in',
  esu: 'esu-latn-us',
  et: 'et-latn-ee',
  etr: 'etr-latn-zz',
  ett: 'ett-ital-it',
  etu: 'etu-latn-zz',
  etx: 'etx-latn-zz',
  eu: 'eu-latn-es',
  ewo: 'ewo-latn-cm',
  ext: 'ext-latn-es',
  eza: 'eza-latn-zz',
  fa: 'fa-arab-ir',
  faa: 'faa-latn-zz',
  fab: 'fab-latn-zz',
  fag: 'fag-latn-zz',
  fai: 'fai-latn-zz',
  fan: 'fan-latn-gq',
  ff: 'ff-latn-sn',
  'ff-adlm': 'ff-adlm-gn',
  ffi: 'ffi-latn-zz',
  ffm: 'ffm-latn-ml',
  fi: 'fi-latn-fi',
  fia: 'fia-arab-sd',
  fil: 'fil-latn-ph',
  fit: 'fit-latn-se',
  fj: 'fj-latn-fj',
  flr: 'flr-latn-zz',
  fmp: 'fmp-latn-zz',
  fo: 'fo-latn-fo',
  fod: 'fod-latn-zz',
  fon: 'fon-latn-bj',
  for: 'for-latn-zz',
  fpe: 'fpe-latn-zz',
  fqs: 'fqs-latn-zz',
  fr: 'fr-latn-fr',
  frc: 'frc-latn-us',
  frp: 'frp-latn-fr',
  frr: 'frr-latn-de',
  frs: 'frs-latn-de',
  fub: 'fub-arab-cm',
  fud: 'fud-latn-wf',
  fue: 'fue-latn-zz',
  fuf: 'fuf-latn-gn',
  fuh: 'fuh-latn-zz',
  fuq: 'fuq-latn-ne',
  fur: 'fur-latn-it',
  fuv: 'fuv-latn-ng',
  fuy: 'fuy-latn-zz',
  fvr: 'fvr-latn-sd',
  fy: 'fy-latn-nl',
  ga: 'ga-latn-ie',
  gaa: 'gaa-latn-gh',
  gaf: 'gaf-latn-zz',
  gag: 'gag-latn-md',
  gah: 'gah-latn-zz',
  gaj: 'gaj-latn-zz',
  gam: 'gam-latn-zz',
  gan: 'gan-hans-cn',
  gaw: 'gaw-latn-zz',
  gay: 'gay-latn-id',
  gba: 'gba-latn-zz',
  gbf: 'gbf-latn-zz',
  gbm: 'gbm-deva-in',
  gby: 'gby-latn-zz',
  gbz: 'gbz-arab-ir',
  gcr: 'gcr-latn-gf',
  gd: 'gd-latn-gb',
  gde: 'gde-latn-zz',
  gdn: 'gdn-latn-zz',
  gdr: 'gdr-latn-zz',
  geb: 'geb-latn-zz',
  gej: 'gej-latn-zz',
  gel: 'gel-latn-zz',
  gez: 'gez-ethi-et',
  gfk: 'gfk-latn-zz',
  ggn: 'ggn-deva-np',
  ghs: 'ghs-latn-zz',
  gil: 'gil-latn-ki',
  gim: 'gim-latn-zz',
  gjk: 'gjk-arab-pk',
  gjn: 'gjn-latn-zz',
  gju: 'gju-arab-pk',
  gkn: 'gkn-latn-zz',
  gkp: 'gkp-latn-zz',
  gl: 'gl-latn-es',
  glk: 'glk-arab-ir',
  gmm: 'gmm-latn-zz',
  gmv: 'gmv-ethi-zz',
  gn: 'gn-latn-py',
  gnd: 'gnd-latn-zz',
  gng: 'gng-latn-zz',
  god: 'god-latn-zz',
  gof: 'gof-ethi-zz',
  goi: 'goi-latn-zz',
  gom: 'gom-deva-in',
  gon: 'gon-telu-in',
  gor: 'gor-latn-id',
  gos: 'gos-latn-nl',
  got: 'got-goth-ua',
  grb: 'grb-latn-zz',
  grc: 'grc-cprt-cy',
  'grc-linb': 'grc-linb-gr',
  grt: 'grt-beng-in',
  grw: 'grw-latn-zz',
  gsw: 'gsw-latn-ch',
  gu: 'gu-gujr-in',
  gub: 'gub-latn-br',
  guc: 'guc-latn-co',
  gud: 'gud-latn-zz',
  gur: 'gur-latn-gh',
  guw: 'guw-latn-zz',
  gux: 'gux-latn-zz',
  guz: 'guz-latn-ke',
  gv: 'gv-latn-im',
  gvf: 'gvf-latn-zz',
  gvr: 'gvr-deva-np',
  gvs: 'gvs-latn-zz',
  gwc: 'gwc-arab-zz',
  gwi: 'gwi-latn-ca',
  gwt: 'gwt-arab-zz',
  gyi: 'gyi-latn-zz',
  ha: 'ha-latn-ng',
  'ha-cm': 'ha-arab-cm',
  'ha-sd': 'ha-arab-sd',
  hag: 'hag-latn-zz',
  hak: 'hak-hans-cn',
  ham: 'ham-latn-zz',
  haw: 'haw-latn-us',
  haz: 'haz-arab-af',
  hbb: 'hbb-latn-zz',
  hdy: 'hdy-ethi-zz',
  he: 'he-hebr-il',
  hhy: 'hhy-latn-zz',
  hi: 'hi-deva-in',
  'hi-latn': 'hi-latn-in',
  hia: 'hia-latn-zz',
  hif: 'hif-latn-fj',
  hig: 'hig-latn-zz',
  hih: 'hih-latn-zz',
  hil: 'hil-latn-ph',
  hla: 'hla-latn-zz',
  hlu: 'hlu-hluw-tr',
  hmd: 'hmd-plrd-cn',
  hmt: 'hmt-latn-zz',
  hnd: 'hnd-arab-pk',
  hne: 'hne-deva-in',
  hnj: 'hnj-hmnp-us',
  hnn: 'hnn-latn-ph',
  hno: 'hno-arab-pk',
  ho: 'ho-latn-pg',
  hoc: 'hoc-deva-in',
  hoj: 'hoj-deva-in',
  hot: 'hot-latn-zz',
  hr: 'hr-latn-hr',
  hsb: 'hsb-latn-de',
  hsn: 'hsn-hans-cn',
  ht: 'ht-latn-ht',
  hu: 'hu-latn-hu',
  hui: 'hui-latn-zz',
  hur: 'hur-latn-ca',
  hy: 'hy-armn-am',
  hz: 'hz-latn-na',
  ia: 'ia-latn-001',
  ian: 'ian-latn-zz',
  iar: 'iar-latn-zz',
  iba: 'iba-latn-my',
  ibb: 'ibb-latn-ng',
  iby: 'iby-latn-zz',
  ica: 'ica-latn-zz',
  ich: 'ich-latn-zz',
  id: 'id-latn-id',
  idd: 'idd-latn-zz',
  idi: 'idi-latn-zz',
  idu: 'idu-latn-zz',
  ife: 'ife-latn-tg',
  ig: 'ig-latn-ng',
  igb: 'igb-latn-zz',
  ige: 'ige-latn-zz',
  ii: 'ii-yiii-cn',
  ijj: 'ijj-latn-zz',
  ik: 'ik-latn-us',
  ikk: 'ikk-latn-zz',
  ikw: 'ikw-latn-zz',
  ikx: 'ikx-latn-zz',
  ilo: 'ilo-latn-ph',
  imo: 'imo-latn-zz',
  in: 'in-latn-id',
  inh: 'inh-cyrl-ru',
  io: 'io-latn-001',
  iou: 'iou-latn-zz',
  iri: 'iri-latn-zz',
  is: 'is-latn-is',
  it: 'it-latn-it',
  iu: 'iu-cans-ca',
  iw: 'iw-hebr-il',
  iwm: 'iwm-latn-zz',
  iws: 'iws-latn-zz',
  izh: 'izh-latn-ru',
  izi: 'izi-latn-zz',
  ja: 'ja-jpan-jp',
  jab: 'jab-latn-zz',
  jam: 'jam-latn-jm',
  jar: 'jar-latn-zz',
  jbo: 'jbo-latn-001',
  jbu: 'jbu-latn-zz',
  jen: 'jen-latn-zz',
  jgk: 'jgk-latn-zz',
  jgo: 'jgo-latn-cm',
  ji: 'ji-hebr-ua',
  jib: 'jib-latn-zz',
  jmc: 'jmc-latn-tz',
  jml: 'jml-deva-np',
  jra: 'jra-latn-zz',
  jut: 'jut-latn-dk',
  jv: 'jv-latn-id',
  jw: 'jw-latn-id',
  ka: 'ka-geor-ge',
  kaa: 'kaa-cyrl-uz',
  kab: 'kab-latn-dz',
  kac: 'kac-latn-mm',
  kad: 'kad-latn-zz',
  kai: 'kai-latn-zz',
  kaj: 'kaj-latn-ng',
  kam: 'kam-latn-ke',
  kao: 'kao-latn-ml',
  kaw: 'kaw-kawi-id',
  kbd: 'kbd-cyrl-ru',
  kbm: 'kbm-latn-zz',
  kbp: 'kbp-latn-zz',
  kbq: 'kbq-latn-zz',
  kbx: 'kbx-latn-zz',
  kby: 'kby-arab-ne',
  kcg: 'kcg-latn-ng',
  kck: 'kck-latn-zw',
  kcl: 'kcl-latn-zz',
  kct: 'kct-latn-zz',
  kde: 'kde-latn-tz',
  kdh: 'kdh-latn-tg',
  kdl: 'kdl-latn-zz',
  kdt: 'kdt-thai-th',
  kea: 'kea-latn-cv',
  ken: 'ken-latn-cm',
  kez: 'kez-latn-zz',
  kfo: 'kfo-latn-ci',
  kfr: 'kfr-deva-in',
  kfy: 'kfy-deva-in',
  kg: 'kg-latn-cd',
  kge: 'kge-latn-id',
  kgf: 'kgf-latn-zz',
  kgp: 'kgp-latn-br',
  kha: 'kha-latn-in',
  khb: 'khb-talu-cn',
  khn: 'khn-deva-in',
  khq: 'khq-latn-ml',
  khs: 'khs-latn-zz',
  kht: 'kht-mymr-in',
  khw: 'khw-arab-pk',
  khz: 'khz-latn-zz',
  ki: 'ki-latn-ke',
  kij: 'kij-latn-zz',
  kiu: 'kiu-latn-tr',
  kiw: 'kiw-latn-zz',
  kj: 'kj-latn-na',
  kjd: 'kjd-latn-zz',
  kjg: 'kjg-laoo-la',
  kjs: 'kjs-latn-zz',
  kjy: 'kjy-latn-zz',
  kk: 'kk-cyrl-kz',
  'kk-af': 'kk-arab-af',
  'kk-arab': 'kk-arab-cn',
  'kk-cn': 'kk-arab-cn',
  'kk-ir': 'kk-arab-ir',
  'kk-mn': 'kk-arab-mn',
  kkc: 'kkc-latn-zz',
  kkj: 'kkj-latn-cm',
  kl: 'kl-latn-gl',
  kln: 'kln-latn-ke',
  klq: 'klq-latn-zz',
  klt: 'klt-latn-zz',
  klx: 'klx-latn-zz',
  km: 'km-khmr-kh',
  kmb: 'kmb-latn-ao',
  kmh: 'kmh-latn-zz',
  kmo: 'kmo-latn-zz',
  kms: 'kms-latn-zz',
  kmu: 'kmu-latn-zz',
  kmw: 'kmw-latn-zz',
  kn: 'kn-knda-in',
  knf: 'knf-latn-gw',
  knp: 'knp-latn-zz',
  ko: 'ko-kore-kr',
  koi: 'koi-cyrl-ru',
  kok: 'kok-deva-in',
  kol: 'kol-latn-zz',
  kos: 'kos-latn-fm',
  koz: 'koz-latn-zz',
  kpe: 'kpe-latn-lr',
  kpf: 'kpf-latn-zz',
  kpo: 'kpo-latn-zz',
  kpr: 'kpr-latn-zz',
  kpx: 'kpx-latn-zz',
  kqb: 'kqb-latn-zz',
  kqf: 'kqf-latn-zz',
  kqs: 'kqs-latn-zz',
  kqy: 'kqy-ethi-zz',
  kr: 'kr-latn-zz',
  krc: 'krc-cyrl-ru',
  kri: 'kri-latn-sl',
  krj: 'krj-latn-ph',
  krl: 'krl-latn-ru',
  krs: 'krs-latn-zz',
  kru: 'kru-deva-in',
  ks: 'ks-arab-in',
  ksb: 'ksb-latn-tz',
  ksd: 'ksd-latn-zz',
  ksf: 'ksf-latn-cm',
  ksh: 'ksh-latn-de',
  ksj: 'ksj-latn-zz',
  ksr: 'ksr-latn-zz',
  ktb: 'ktb-ethi-zz',
  ktm: 'ktm-latn-zz',
  kto: 'kto-latn-zz',
  ktr: 'ktr-latn-my',
  ku: 'ku-latn-tr',
  'ku-arab': 'ku-arab-iq',
  'ku-lb': 'ku-arab-lb',
  'ku-yezi': 'ku-yezi-ge',
  kub: 'kub-latn-zz',
  kud: 'kud-latn-zz',
  kue: 'kue-latn-zz',
  kuj: 'kuj-latn-zz',
  kum: 'kum-cyrl-ru',
  kun: 'kun-latn-zz',
  kup: 'kup-latn-zz',
  kus: 'kus-latn-zz',
  kv: 'kv-cyrl-ru',
  kvg: 'kvg-latn-zz',
  kvr: 'kvr-latn-id',
  kvx: 'kvx-arab-pk',
  kw: 'kw-latn-gb',
  kwj: 'kwj-latn-zz',
  kwk: 'kwk-latn-ca',
  kwo: 'kwo-latn-zz',
  kwq: 'kwq-latn-zz',
  kxa: 'kxa-latn-zz',
  kxc: 'kxc-ethi-zz',
  kxe: 'kxe-latn-zz',
  kxl: 'kxl-deva-in',
  kxm: 'kxm-thai-th',
  kxp: 'kxp-arab-pk',
  kxw: 'kxw-latn-zz',
  kxz: 'kxz-latn-zz',
  ky: 'ky-cyrl-kg',
  'ky-arab': 'ky-arab-cn',
  'ky-cn': 'ky-arab-cn',
  'ky-latn': 'ky-latn-tr',
  'ky-tr': 'ky-latn-tr',
  kye: 'kye-latn-zz',
  kyx: 'kyx-latn-zz',
  kzh: 'kzh-arab-zz',
  kzj: 'kzj-latn-my',
  kzr: 'kzr-latn-zz',
  kzt: 'kzt-latn-my',
  la: 'la-latn-va',
  lab: 'lab-lina-gr',
  lad: 'lad-hebr-il',
  lag: 'lag-latn-tz',
  lah: 'lah-arab-pk',
  laj: 'laj-latn-ug',
  las: 'las-latn-zz',
  lb: 'lb-latn-lu',
  lbe: 'lbe-cyrl-ru',
  lbu: 'lbu-latn-zz',
  lbw: 'lbw-latn-id',
  lcm: 'lcm-latn-zz',
  lcp: 'lcp-thai-cn',
  ldb: 'ldb-latn-zz',
  led: 'led-latn-zz',
  lee: 'lee-latn-zz',
  lem: 'lem-latn-zz',
  lep: 'lep-lepc-in',
  leq: 'leq-latn-zz',
  leu: 'leu-latn-zz',
  lez: 'lez-cyrl-ru',
  lg: 'lg-latn-ug',
  lgg: 'lgg-latn-zz',
  li: 'li-latn-nl',
  lia: 'lia-latn-zz',
  lid: 'lid-latn-zz',
  lif: 'lif-deva-np',
  'lif-limb': 'lif-limb-in',
  lig: 'lig-latn-zz',
  lih: 'lih-latn-zz',
  lij: 'lij-latn-it',
  lil: 'lil-latn-ca',
  lis: 'lis-lisu-cn',
  ljp: 'ljp-latn-id',
  lki: 'lki-arab-ir',
  lkt: 'lkt-latn-us',
  lle: 'lle-latn-zz',
  lln: 'lln-latn-zz',
  lmn: 'lmn-telu-in',
  lmo: 'lmo-latn-it',
  lmp: 'lmp-latn-zz',
  ln: 'ln-latn-cd',
  lns: 'lns-latn-zz',
  lnu: 'lnu-latn-zz',
  lo: 'lo-laoo-la',
  loj: 'loj-latn-zz',
  lok: 'lok-latn-zz',
  lol: 'lol-latn-cd',
  lor: 'lor-latn-zz',
  los: 'los-latn-zz',
  loz: 'loz-latn-zm',
  lrc: 'lrc-arab-ir',
  lt: 'lt-latn-lt',
  ltg: 'ltg-latn-lv',
  lu: 'lu-latn-cd',
  lua: 'lua-latn-cd',
  luo: 'luo-latn-ke',
  luy: 'luy-latn-ke',
  luz: 'luz-arab-ir',
  lv: 'lv-latn-lv',
  lwl: 'lwl-thai-th',
  lzh: 'lzh-hans-cn',
  lzz: 'lzz-latn-tr',
  mad: 'mad-latn-id',
  maf: 'maf-latn-cm',
  mag: 'mag-deva-in',
  mai: 'mai-deva-in',
  mak: 'mak-latn-id',
  man: 'man-latn-gm',
  'man-gn': 'man-nkoo-gn',
  'man-nkoo': 'man-nkoo-gn',
  mas: 'mas-latn-ke',
  maw: 'maw-latn-zz',
  maz: 'maz-latn-mx',
  mbh: 'mbh-latn-zz',
  mbo: 'mbo-latn-zz',
  mbq: 'mbq-latn-zz',
  mbu: 'mbu-latn-zz',
  mbw: 'mbw-latn-zz',
  mci: 'mci-latn-zz',
  mcp: 'mcp-latn-zz',
  mcq: 'mcq-latn-zz',
  mcr: 'mcr-latn-zz',
  mcu: 'mcu-latn-zz',
  mda: 'mda-latn-zz',
  mde: 'mde-arab-zz',
  mdf: 'mdf-cyrl-ru',
  mdh: 'mdh-latn-ph',
  mdj: 'mdj-latn-zz',
  mdr: 'mdr-latn-id',
  mdx: 'mdx-ethi-zz',
  med: 'med-latn-zz',
  mee: 'mee-latn-zz',
  mek: 'mek-latn-zz',
  men: 'men-latn-sl',
  mer: 'mer-latn-ke',
  met: 'met-latn-zz',
  meu: 'meu-latn-zz',
  mfa: 'mfa-arab-th',
  mfe: 'mfe-latn-mu',
  mfn: 'mfn-latn-zz',
  mfo: 'mfo-latn-zz',
  mfq: 'mfq-latn-zz',
  mg: 'mg-latn-mg',
  mgh: 'mgh-latn-mz',
  mgl: 'mgl-latn-zz',
  mgo: 'mgo-latn-cm',
  mgp: 'mgp-deva-np',
  mgy: 'mgy-latn-tz',
  mh: 'mh-latn-mh',
  mhi: 'mhi-latn-zz',
  mhl: 'mhl-latn-zz',
  mi: 'mi-latn-nz',
  mic: 'mic-latn-ca',
  mif: 'mif-latn-zz',
  min: 'min-latn-id',
  miw: 'miw-latn-zz',
  mk: 'mk-cyrl-mk',
  mki: 'mki-arab-zz',
  mkl: 'mkl-latn-zz',
  mkp: 'mkp-latn-zz',
  mkw: 'mkw-latn-zz',
  ml: 'ml-mlym-in',
  mle: 'mle-latn-zz',
  mlp: 'mlp-latn-zz',
  mls: 'mls-latn-sd',
  mmo: 'mmo-latn-zz',
  mmu: 'mmu-latn-zz',
  mmx: 'mmx-latn-zz',
  mn: 'mn-cyrl-mn',
  'mn-cn': 'mn-mong-cn',
  'mn-mong': 'mn-mong-cn',
  mna: 'mna-latn-zz',
  mnf: 'mnf-latn-zz',
  mni: 'mni-beng-in',
  mnw: 'mnw-mymr-mm',
  mo: 'mo-latn-ro',
  moa: 'moa-latn-zz',
  moe: 'moe-latn-ca',
  moh: 'moh-latn-ca',
  mos: 'mos-latn-bf',
  mox: 'mox-latn-zz',
  mpp: 'mpp-latn-zz',
  mps: 'mps-latn-zz',
  mpt: 'mpt-latn-zz',
  mpx: 'mpx-latn-zz',
  mql: 'mql-latn-zz',
  mr: 'mr-deva-in',
  mrd: 'mrd-deva-np',
  mrj: 'mrj-cyrl-ru',
  mro: 'mro-mroo-bd',
  ms: 'ms-latn-my',
  'ms-cc': 'ms-arab-cc',
  mt: 'mt-latn-mt',
  mtc: 'mtc-latn-zz',
  mtf: 'mtf-latn-zz',
  mti: 'mti-latn-zz',
  mtr: 'mtr-deva-in',
  mua: 'mua-latn-cm',
  mur: 'mur-latn-zz',
  mus: 'mus-latn-us',
  mva: 'mva-latn-zz',
  mvn: 'mvn-latn-zz',
  mvy: 'mvy-arab-pk',
  mwk: 'mwk-latn-ml',
  mwr: 'mwr-deva-in',
  mwv: 'mwv-latn-id',
  mww: 'mww-hmnp-us',
  mxc: 'mxc-latn-zw',
  mxm: 'mxm-latn-zz',
  my: 'my-mymr-mm',
  myk: 'myk-latn-zz',
  mym: 'mym-ethi-zz',
  myv: 'myv-cyrl-ru',
  myw: 'myw-latn-zz',
  myx: 'myx-latn-ug',
  myz: 'myz-mand-ir',
  mzk: 'mzk-latn-zz',
  mzm: 'mzm-latn-zz',
  mzn: 'mzn-arab-ir',
  mzp: 'mzp-latn-zz',
  mzw: 'mzw-latn-zz',
  mzz: 'mzz-latn-zz',
  na: 'na-latn-nr',
  nac: 'nac-latn-zz',
  naf: 'naf-latn-zz',
  nak: 'nak-latn-zz',
  nan: 'nan-hans-cn',
  nap: 'nap-latn-it',
  naq: 'naq-latn-na',
  nas: 'nas-latn-zz',
  nb: 'nb-latn-no',
  nca: 'nca-latn-zz',
  nce: 'nce-latn-zz',
  ncf: 'ncf-latn-zz',
  nch: 'nch-latn-mx',
  nco: 'nco-latn-zz',
  ncu: 'ncu-latn-zz',
  nd: 'nd-latn-zw',
  ndc: 'ndc-latn-mz',
  nds: 'nds-latn-de',
  ne: 'ne-deva-np',
  neb: 'neb-latn-zz',
  new: 'new-deva-np',
  nex: 'nex-latn-zz',
  nfr: 'nfr-latn-zz',
  ng: 'ng-latn-na',
  nga: 'nga-latn-zz',
  ngb: 'ngb-latn-zz',
  ngl: 'ngl-latn-mz',
  nhb: 'nhb-latn-zz',
  nhe: 'nhe-latn-mx',
  nhw: 'nhw-latn-mx',
  nif: 'nif-latn-zz',
  nii: 'nii-latn-zz',
  nij: 'nij-latn-id',
  nin: 'nin-latn-zz',
  niu: 'niu-latn-nu',
  niy: 'niy-latn-zz',
  niz: 'niz-latn-zz',
  njo: 'njo-latn-in',
  nkg: 'nkg-latn-zz',
  nko: 'nko-latn-zz',
  nl: 'nl-latn-nl',
  nmg: 'nmg-latn-cm',
  nmz: 'nmz-latn-zz',
  nn: 'nn-latn-no',
  nnf: 'nnf-latn-zz',
  nnh: 'nnh-latn-cm',
  nnk: 'nnk-latn-zz',
  nnm: 'nnm-latn-zz',
  nnp: 'nnp-wcho-in',
  no: 'no-latn-no',
  nod: 'nod-lana-th',
  noe: 'noe-deva-in',
  non: 'non-runr-se',
  nop: 'nop-latn-zz',
  nou: 'nou-latn-zz',
  nqo: 'nqo-nkoo-gn',
  nr: 'nr-latn-za',
  nrb: 'nrb-latn-zz',
  nsk: 'nsk-cans-ca',
  nsn: 'nsn-latn-zz',
  nso: 'nso-latn-za',
  nss: 'nss-latn-zz',
  nst: 'nst-tnsa-in',
  ntm: 'ntm-latn-zz',
  ntr: 'ntr-latn-zz',
  nui: 'nui-latn-zz',
  nup: 'nup-latn-zz',
  nus: 'nus-latn-ss',
  nuv: 'nuv-latn-zz',
  nux: 'nux-latn-zz',
  nv: 'nv-latn-us',
  nwb: 'nwb-latn-zz',
  nxq: 'nxq-latn-cn',
  nxr: 'nxr-latn-zz',
  ny: 'ny-latn-mw',
  nym: 'nym-latn-tz',
  nyn: 'nyn-latn-ug',
  nzi: 'nzi-latn-gh',
  oc: 'oc-latn-fr',
  ogc: 'ogc-latn-zz',
  oj: 'oj-cans-ca',
  ojs: 'ojs-cans-ca',
  oka: 'oka-latn-ca',
  okr: 'okr-latn-zz',
  okv: 'okv-latn-zz',
  om: 'om-latn-et',
  ong: 'ong-latn-zz',
  onn: 'onn-latn-zz',
  ons: 'ons-latn-zz',
  opm: 'opm-latn-zz',
  or: 'or-orya-in',
  oro: 'oro-latn-zz',
  oru: 'oru-arab-zz',
  os: 'os-cyrl-ge',
  osa: 'osa-osge-us',
  ota: 'ota-arab-zz',
  otk: 'otk-orkh-mn',
  oui: 'oui-ougr-143',
  ozm: 'ozm-latn-zz',
  pa: 'pa-guru-in',
  'pa-arab': 'pa-arab-pk',
  'pa-pk': 'pa-arab-pk',
  pag: 'pag-latn-ph',
  pal: 'pal-phli-ir',
  'pal-phlp': 'pal-phlp-cn',
  pam: 'pam-latn-ph',
  pap: 'pap-latn-aw',
  pau: 'pau-latn-pw',
  pbi: 'pbi-latn-zz',
  pcd: 'pcd-latn-fr',
  pcm: 'pcm-latn-ng',
  pdc: 'pdc-latn-us',
  pdt: 'pdt-latn-ca',
  ped: 'ped-latn-zz',
  peo: 'peo-xpeo-ir',
  pex: 'pex-latn-zz',
  pfl: 'pfl-latn-de',
  phl: 'phl-arab-zz',
  phn: 'phn-phnx-lb',
  pil: 'pil-latn-zz',
  pip: 'pip-latn-zz',
  pka: 'pka-brah-in',
  pko: 'pko-latn-ke',
  pl: 'pl-latn-pl',
  pla: 'pla-latn-zz',
  pms: 'pms-latn-it',
  png: 'png-latn-zz',
  pnn: 'pnn-latn-zz',
  pnt: 'pnt-grek-gr',
  pon: 'pon-latn-fm',
  ppa: 'ppa-deva-in',
  ppo: 'ppo-latn-zz',
  pqm: 'pqm-latn-ca',
  pra: 'pra-khar-pk',
  prd: 'prd-arab-ir',
  prg: 'prg-latn-001',
  ps: 'ps-arab-af',
  pss: 'pss-latn-zz',
  pt: 'pt-latn-br',
  ptp: 'ptp-latn-zz',
  puu: 'puu-latn-ga',
  pwa: 'pwa-latn-zz',
  qu: 'qu-latn-pe',
  quc: 'quc-latn-gt',
  qug: 'qug-latn-ec',
  rai: 'rai-latn-zz',
  raj: 'raj-deva-in',
  rao: 'rao-latn-zz',
  rcf: 'rcf-latn-re',
  rej: 'rej-latn-id',
  rel: 'rel-latn-zz',
  res: 'res-latn-zz',
  rgn: 'rgn-latn-it',
  rhg: 'rhg-rohg-mm',
  ria: 'ria-latn-in',
  rif: 'rif-tfng-ma',
  'rif-nl': 'rif-latn-nl',
  rjs: 'rjs-deva-np',
  rkt: 'rkt-beng-bd',
  rm: 'rm-latn-ch',
  rmf: 'rmf-latn-fi',
  rmo: 'rmo-latn-ch',
  rmt: 'rmt-arab-ir',
  rmu: 'rmu-latn-se',
  rn: 'rn-latn-bi',
  rna: 'rna-latn-zz',
  rng: 'rng-latn-mz',
  ro: 'ro-latn-ro',
  rob: 'rob-latn-id',
  rof: 'rof-latn-tz',
  roo: 'roo-latn-zz',
  rro: 'rro-latn-zz',
  rtm: 'rtm-latn-fj',
  ru: 'ru-cyrl-ru',
  rue: 'rue-cyrl-ua',
  rug: 'rug-latn-sb',
  rw: 'rw-latn-rw',
  rwk: 'rwk-latn-tz',
  rwo: 'rwo-latn-zz',
  ryu: 'ryu-kana-jp',
  sa: 'sa-deva-in',
  saf: 'saf-latn-gh',
  sah: 'sah-cyrl-ru',
  saq: 'saq-latn-ke',
  sas: 'sas-latn-id',
  sat: 'sat-olck-in',
  sav: 'sav-latn-sn',
  saz: 'saz-saur-in',
  sba: 'sba-latn-zz',
  sbe: 'sbe-latn-zz',
  sbp: 'sbp-latn-tz',
  sc: 'sc-latn-it',
  sck: 'sck-deva-in',
  scl: 'scl-arab-zz',
  scn: 'scn-latn-it',
  sco: 'sco-latn-gb',
  sd: 'sd-arab-pk',
  'sd-deva': 'sd-deva-in',
  'sd-in': 'sd-deva-in',
  'sd-khoj': 'sd-khoj-in',
  'sd-sind': 'sd-sind-in',
  sdc: 'sdc-latn-it',
  sdh: 'sdh-arab-ir',
  se: 'se-latn-no',
  sef: 'sef-latn-ci',
  seh: 'seh-latn-mz',
  sei: 'sei-latn-mx',
  ses: 'ses-latn-ml',
  sg: 'sg-latn-cf',
  sga: 'sga-ogam-ie',
  sgs: 'sgs-latn-lt',
  sgw: 'sgw-ethi-zz',
  sgz: 'sgz-latn-zz',
  shi: 'shi-tfng-ma',
  shk: 'shk-latn-zz',
  shn: 'shn-mymr-mm',
  shu: 'shu-arab-zz',
  si: 'si-sinh-lk',
  sid: 'sid-latn-et',
  sig: 'sig-latn-zz',
  sil: 'sil-latn-zz',
  sim: 'sim-latn-zz',
  sjr: 'sjr-latn-zz',
  sk: 'sk-latn-sk',
  skc: 'skc-latn-zz',
  skr: 'skr-arab-pk',
  sks: 'sks-latn-zz',
  sl: 'sl-latn-si',
  sld: 'sld-latn-zz',
  sli: 'sli-latn-pl',
  sll: 'sll-latn-zz',
  sly: 'sly-latn-id',
  sm: 'sm-latn-ws',
  sma: 'sma-latn-se',
  smj: 'smj-latn-se',
  smn: 'smn-latn-fi',
  smp: 'smp-samr-il',
  smq: 'smq-latn-zz',
  sms: 'sms-latn-fi',
  sn: 'sn-latn-zw',
  snc: 'snc-latn-zz',
  snk: 'snk-latn-ml',
  snp: 'snp-latn-zz',
  snx: 'snx-latn-zz',
  sny: 'sny-latn-zz',
  so: 'so-latn-so',
  sog: 'sog-sogd-uz',
  sok: 'sok-latn-zz',
  soq: 'soq-latn-zz',
  sou: 'sou-thai-th',
  soy: 'soy-latn-zz',
  spd: 'spd-latn-zz',
  spl: 'spl-latn-zz',
  sps: 'sps-latn-zz',
  sq: 'sq-latn-al',
  sr: 'sr-cyrl-rs',
  'sr-me': 'sr-latn-me',
  'sr-ro': 'sr-latn-ro',
  'sr-ru': 'sr-latn-ru',
  'sr-tr': 'sr-latn-tr',
  srb: 'srb-sora-in',
  srn: 'srn-latn-sr',
  srr: 'srr-latn-sn',
  srx: 'srx-deva-in',
  ss: 'ss-latn-za',
  ssd: 'ssd-latn-zz',
  ssg: 'ssg-latn-zz',
  ssy: 'ssy-latn-er',
  st: 'st-latn-za',
  stk: 'stk-latn-zz',
  stq: 'stq-latn-de',
  su: 'su-latn-id',
  sua: 'sua-latn-zz',
  sue: 'sue-latn-zz',
  suk: 'suk-latn-tz',
  sur: 'sur-latn-zz',
  sus: 'sus-latn-gn',
  sv: 'sv-latn-se',
  sw: 'sw-latn-tz',
  swb: 'swb-arab-yt',
  swc: 'swc-latn-cd',
  swg: 'swg-latn-de',
  swp: 'swp-latn-zz',
  swv: 'swv-deva-in',
  sxn: 'sxn-latn-id',
  sxw: 'sxw-latn-zz',
  syl: 'syl-beng-bd',
  syr: 'syr-syrc-iq',
  szl: 'szl-latn-pl',
  ta: 'ta-taml-in',
  taj: 'taj-deva-np',
  tal: 'tal-latn-zz',
  tan: 'tan-latn-zz',
  taq: 'taq-latn-zz',
  tbc: 'tbc-latn-zz',
  tbd: 'tbd-latn-zz',
  tbf: 'tbf-latn-zz',
  tbg: 'tbg-latn-zz',
  tbo: 'tbo-latn-zz',
  tbw: 'tbw-latn-ph',
  tbz: 'tbz-latn-zz',
  tci: 'tci-latn-zz',
  tcy: 'tcy-knda-in',
  tdd: 'tdd-tale-cn',
  tdg: 'tdg-deva-np',
  tdh: 'tdh-deva-np',
  tdu: 'tdu-latn-my',
  te: 'te-telu-in',
  ted: 'ted-latn-zz',
  tem: 'tem-latn-sl',
  teo: 'teo-latn-ug',
  tet: 'tet-latn-tl',
  tfi: 'tfi-latn-zz',
  tg: 'tg-cyrl-tj',
  'tg-arab': 'tg-arab-pk',
  'tg-pk': 'tg-arab-pk',
  tgc: 'tgc-latn-zz',
  tgo: 'tgo-latn-zz',
  tgu: 'tgu-latn-zz',
  th: 'th-thai-th',
  thl: 'thl-deva-np',
  thq: 'thq-deva-np',
  thr: 'thr-deva-np',
  ti: 'ti-ethi-et',
  tif: 'tif-latn-zz',
  tig: 'tig-ethi-er',
  tik: 'tik-latn-zz',
  tim: 'tim-latn-zz',
  tio: 'tio-latn-zz',
  tiv: 'tiv-latn-ng',
  tk: 'tk-latn-tm',
  tkl: 'tkl-latn-tk',
  tkr: 'tkr-latn-az',
  tkt: 'tkt-deva-np',
  tl: 'tl-latn-ph',
  tlf: 'tlf-latn-zz',
  tlx: 'tlx-latn-zz',
  tly: 'tly-latn-az',
  tmh: 'tmh-latn-ne',
  tmy: 'tmy-latn-zz',
  tn: 'tn-latn-za',
  tnh: 'tnh-latn-zz',
  to: 'to-latn-to',
  tof: 'tof-latn-zz',
  tog: 'tog-latn-mw',
  toq: 'toq-latn-zz',
  tpi: 'tpi-latn-pg',
  tpm: 'tpm-latn-zz',
  tpz: 'tpz-latn-zz',
  tqo: 'tqo-latn-zz',
  tr: 'tr-latn-tr',
  tru: 'tru-latn-tr',
  trv: 'trv-latn-tw',
  trw: 'trw-arab-pk',
  ts: 'ts-latn-za',
  tsd: 'tsd-grek-gr',
  tsf: 'tsf-deva-np',
  tsg: 'tsg-latn-ph',
  tsj: 'tsj-tibt-bt',
  tsw: 'tsw-latn-zz',
  tt: 'tt-cyrl-ru',
  ttd: 'ttd-latn-zz',
  tte: 'tte-latn-zz',
  ttj: 'ttj-latn-ug',
  ttr: 'ttr-latn-zz',
  tts: 'tts-thai-th',
  ttt: 'ttt-latn-az',
  tuh: 'tuh-latn-zz',
  tul: 'tul-latn-zz',
  tum: 'tum-latn-mw',
  tuq: 'tuq-latn-zz',
  tvd: 'tvd-latn-zz',
  tvl: 'tvl-latn-tv',
  tvu: 'tvu-latn-zz',
  twh: 'twh-latn-zz',
  twq: 'twq-latn-ne',
  txg: 'txg-tang-cn',
  txo: 'txo-toto-in',
  ty: 'ty-latn-pf',
  tya: 'tya-latn-zz',
  tyv: 'tyv-cyrl-ru',
  tzm: 'tzm-latn-ma',
  ubu: 'ubu-latn-zz',
  udi: 'udi-aghb-ru',
  udm: 'udm-cyrl-ru',
  ug: 'ug-arab-cn',
  'ug-cyrl': 'ug-cyrl-kz',
  'ug-kz': 'ug-cyrl-kz',
  'ug-mn': 'ug-cyrl-mn',
  uga: 'uga-ugar-sy',
  uk: 'uk-cyrl-ua',
  uli: 'uli-latn-fm',
  umb: 'umb-latn-ao',
  und: 'en-latn-us',
  'und-002': 'en-latn-ng',
  'und-003': 'en-latn-us',
  'und-005': 'pt-latn-br',
  'und-009': 'en-latn-au',
  'und-011': 'en-latn-ng',
  'und-013': 'es-latn-mx',
  'und-014': 'sw-latn-tz',
  'und-015': 'ar-arab-eg',
  'und-017': 'sw-latn-cd',
  'und-018': 'en-latn-za',
  'und-019': 'en-latn-us',
  'und-021': 'en-latn-us',
  'und-029': 'es-latn-cu',
  'und-030': 'zh-hans-cn',
  'und-034': 'hi-deva-in',
  'und-035': 'id-latn-id',
  'und-039': 'it-latn-it',
  'und-053': 'en-latn-au',
  'und-054': 'en-latn-pg',
  'und-057': 'en-latn-gu',
  'und-061': 'sm-latn-ws',
  'und-142': 'zh-hans-cn',
  'und-143': 'uz-latn-uz',
  'und-145': 'ar-arab-sa',
  'und-150': 'ru-cyrl-ru',
  'und-151': 'ru-cyrl-ru',
  'und-154': 'en-latn-gb',
  'und-155': 'de-latn-de',
  'und-202': 'en-latn-ng',
  'und-419': 'es-latn-419',
  'und-ad': 'ca-latn-ad',
  'und-adlm': 'ff-adlm-gn',
  'und-ae': 'ar-arab-ae',
  'und-af': 'fa-arab-af',
  'und-aghb': 'udi-aghb-ru',
  'und-ahom': 'aho-ahom-in',
  'und-al': 'sq-latn-al',
  'und-am': 'hy-armn-am',
  'und-ao': 'pt-latn-ao',
  'und-aq': 'und-latn-aq',
  'und-ar': 'es-latn-ar',
  'und-arab': 'ar-arab-eg',
  'und-arab-cc': 'ms-arab-cc',
  'und-arab-cn': 'ug-arab-cn',
  'und-arab-gb': 'ur-arab-gb',
  'und-arab-id': 'ms-arab-id',
  'und-arab-in': 'ur-arab-in',
  'und-arab-kh': 'cja-arab-kh',
  'und-arab-mm': 'rhg-arab-mm',
  'und-arab-mn': 'kk-arab-mn',
  'und-arab-mu': 'ur-arab-mu',
  'und-arab-ng': 'ha-arab-ng',
  'und-arab-pk': 'ur-arab-pk',
  'und-arab-tg': 'apd-arab-tg',
  'und-arab-th': 'mfa-arab-th',
  'und-arab-tj': 'fa-arab-tj',
  'und-arab-tr': 'az-arab-tr',
  'und-arab-yt': 'swb-arab-yt',
  'und-armi': 'arc-armi-ir',
  'und-armn': 'hy-armn-am',
  'und-as': 'sm-latn-as',
  'und-at': 'de-latn-at',
  'und-avst': 'ae-avst-ir',
  'und-aw': 'nl-latn-aw',
  'und-ax': 'sv-latn-ax',
  'und-az': 'az-latn-az',
  'und-ba': 'bs-latn-ba',
  'und-bali': 'ban-bali-id',
  'und-bamu': 'bax-bamu-cm',
  'und-bass': 'bsq-bass-lr',
  'und-batk': 'bbc-batk-id',
  'und-bd': 'bn-beng-bd',
  'und-be': 'nl-latn-be',
  'und-beng': 'bn-beng-bd',
  'und-bf': 'fr-latn-bf',
  'und-bg': 'bg-cyrl-bg',
  'und-bh': 'ar-arab-bh',
  'und-bhks': 'sa-bhks-in',
  'und-bi': 'rn-latn-bi',
  'und-bj': 'fr-latn-bj',
  'und-bl': 'fr-latn-bl',
  'und-bn': 'ms-latn-bn',
  'und-bo': 'es-latn-bo',
  'und-bopo': 'zh-bopo-tw',
  'und-bq': 'pap-latn-bq',
  'und-br': 'pt-latn-br',
  'und-brah': 'pka-brah-in',
  'und-brai': 'fr-brai-fr',
  'und-bt': 'dz-tibt-bt',
  'und-bugi': 'bug-bugi-id',
  'und-buhd': 'bku-buhd-ph',
  'und-bv': 'und-latn-bv',
  'und-by': 'be-cyrl-by',
  'und-cakm': 'ccp-cakm-bd',
  'und-cans': 'iu-cans-ca',
  'und-cari': 'xcr-cari-tr',
  'und-cd': 'sw-latn-cd',
  'und-cf': 'fr-latn-cf',
  'und-cg': 'fr-latn-cg',
  'und-ch': 'de-latn-ch',
  'und-cham': 'cjm-cham-vn',
  'und-cher': 'chr-cher-us',
  'und-chrs': 'xco-chrs-uz',
  'und-ci': 'fr-latn-ci',
  'und-cl': 'es-latn-cl',
  'und-cm': 'fr-latn-cm',
  'und-cn': 'zh-hans-cn',
  'und-co': 'es-latn-co',
  'und-copt': 'cop-copt-eg',
  'und-cp': 'und-latn-cp',
  'und-cpmn': 'und-cpmn-cy',
  'und-cpmn-cy': 'und-cpmn-cy',
  'und-cprt': 'grc-cprt-cy',
  'und-cr': 'es-latn-cr',
  'und-cu': 'es-latn-cu',
  'und-cv': 'pt-latn-cv',
  'und-cw': 'pap-latn-cw',
  'und-cy': 'el-grek-cy',
  'und-cyrl': 'ru-cyrl-ru',
  'und-cyrl-al': 'mk-cyrl-al',
  'und-cyrl-ba': 'sr-cyrl-ba',
  'und-cyrl-ge': 'ab-cyrl-ge',
  'und-cyrl-gr': 'mk-cyrl-gr',
  'und-cyrl-md': 'uk-cyrl-md',
  'und-cyrl-ro': 'bg-cyrl-ro',
  'und-cyrl-sk': 'uk-cyrl-sk',
  'und-cyrl-tr': 'kbd-cyrl-tr',
  'und-cyrl-xk': 'sr-cyrl-xk',
  'und-cz': 'cs-latn-cz',
  'und-de': 'de-latn-de',
  'und-deva': 'hi-deva-in',
  'und-deva-bt': 'ne-deva-bt',
  'und-deva-fj': 'hif-deva-fj',
  'und-deva-mu': 'bho-deva-mu',
  'und-deva-pk': 'btv-deva-pk',
  'und-diak': 'dv-diak-mv',
  'und-dj': 'aa-latn-dj',
  'und-dk': 'da-latn-dk',
  'und-do': 'es-latn-do',
  'und-dogr': 'doi-dogr-in',
  'und-dupl': 'fr-dupl-fr',
  'und-dz': 'ar-arab-dz',
  'und-ea': 'es-latn-ea',
  'und-ec': 'es-latn-ec',
  'und-ee': 'et-latn-ee',
  'und-eg': 'ar-arab-eg',
  'und-egyp': 'egy-egyp-eg',
  'und-eh': 'ar-arab-eh',
  'und-elba': 'sq-elba-al',
  'und-elym': 'arc-elym-ir',
  'und-er': 'ti-ethi-er',
  'und-es': 'es-latn-es',
  'und-et': 'am-ethi-et',
  'und-ethi': 'am-ethi-et',
  'und-eu': 'en-latn-ie',
  'und-ez': 'de-latn-ez',
  'und-fi': 'fi-latn-fi',
  'und-fo': 'fo-latn-fo',
  'und-fr': 'fr-latn-fr',
  'und-ga': 'fr-latn-ga',
  'und-ge': 'ka-geor-ge',
  'und-geor': 'ka-geor-ge',
  'und-gf': 'fr-latn-gf',
  'und-gh': 'ak-latn-gh',
  'und-gl': 'kl-latn-gl',
  'und-glag': 'cu-glag-bg',
  'und-gn': 'fr-latn-gn',
  'und-gong': 'wsg-gong-in',
  'und-gonm': 'esg-gonm-in',
  'und-goth': 'got-goth-ua',
  'und-gp': 'fr-latn-gp',
  'und-gq': 'es-latn-gq',
  'und-gr': 'el-grek-gr',
  'und-gran': 'sa-gran-in',
  'und-grek': 'el-grek-gr',
  'und-grek-tr': 'bgx-grek-tr',
  'und-gs': 'und-latn-gs',
  'und-gt': 'es-latn-gt',
  'und-gujr': 'gu-gujr-in',
  'und-guru': 'pa-guru-in',
  'und-gw': 'pt-latn-gw',
  'und-hanb': 'zh-hanb-tw',
  'und-hang': 'ko-hang-kr',
  'und-hani': 'zh-hani-cn',
  'und-hano': 'hnn-hano-ph',
  'und-hans': 'zh-hans-cn',
  'und-hant': 'zh-hant-tw',
  'und-hant-ca': 'yue-hant-ca',
  'und-hebr': 'he-hebr-il',
  'und-hebr-se': 'yi-hebr-se',
  'und-hebr-ua': 'yi-hebr-ua',
  'und-hebr-us': 'yi-hebr-us',
  'und-hira': 'ja-hira-jp',
  'und-hk': 'zh-hant-hk',
  'und-hluw': 'hlu-hluw-tr',
  'und-hm': 'und-latn-hm',
  'und-hmng': 'hnj-hmng-la',
  'und-hmnp': 'hnj-hmnp-us',
  'und-hn': 'es-latn-hn',
  'und-hr': 'hr-latn-hr',
  'und-ht': 'ht-latn-ht',
  'und-hu': 'hu-latn-hu',
  'und-hung': 'hu-hung-hu',
  'und-ic': 'es-latn-ic',
  'und-id': 'id-latn-id',
  'und-il': 'he-hebr-il',
  'und-in': 'hi-deva-in',
  'und-iq': 'ar-arab-iq',
  'und-ir': 'fa-arab-ir',
  'und-is': 'is-latn-is',
  'und-it': 'it-latn-it',
  'und-ital': 'ett-ital-it',
  'und-jamo': 'ko-jamo-kr',
  'und-java': 'jv-java-id',
  'und-jo': 'ar-arab-jo',
  'und-jp': 'ja-jpan-jp',
  'und-jpan': 'ja-jpan-jp',
  'und-kali': 'eky-kali-mm',
  'und-kana': 'ja-kana-jp',
  'und-kawi': 'kaw-kawi-id',
  'und-ke': 'sw-latn-ke',
  'und-kg': 'ky-cyrl-kg',
  'und-kh': 'km-khmr-kh',
  'und-khar': 'pra-khar-pk',
  'und-khmr': 'km-khmr-kh',
  'und-khoj': 'sd-khoj-in',
  'und-kits': 'zkt-kits-cn',
  'und-km': 'ar-arab-km',
  'und-knda': 'kn-knda-in',
  'und-kore': 'ko-kore-kr',
  'und-kp': 'ko-kore-kp',
  'und-kr': 'ko-kore-kr',
  'und-kthi': 'bho-kthi-in',
  'und-kw': 'ar-arab-kw',
  'und-kz': 'ru-cyrl-kz',
  'und-la': 'lo-laoo-la',
  'und-lana': 'nod-lana-th',
  'und-laoo': 'lo-laoo-la',
  'und-latn-af': 'tk-latn-af',
  'und-latn-am': 'ku-latn-am',
  'und-latn-cn': 'za-latn-cn',
  'und-latn-cy': 'tr-latn-cy',
  'und-latn-dz': 'fr-latn-dz',
  'und-latn-et': 'en-latn-et',
  'und-latn-ge': 'ku-latn-ge',
  'und-latn-ir': 'tk-latn-ir',
  'und-latn-km': 'fr-latn-km',
  'und-latn-ma': 'fr-latn-ma',
  'und-latn-mk': 'sq-latn-mk',
  'und-latn-mm': 'kac-latn-mm',
  'und-latn-mo': 'pt-latn-mo',
  'und-latn-mr': 'fr-latn-mr',
  'und-latn-ru': 'krl-latn-ru',
  'und-latn-sy': 'fr-latn-sy',
  'und-latn-tn': 'fr-latn-tn',
  'und-latn-tw': 'trv-latn-tw',
  'und-latn-ua': 'pl-latn-ua',
  'und-lb': 'ar-arab-lb',
  'und-lepc': 'lep-lepc-in',
  'und-li': 'de-latn-li',
  'und-limb': 'lif-limb-in',
  'und-lina': 'lab-lina-gr',
  'und-linb': 'grc-linb-gr',
  'und-lisu': 'lis-lisu-cn',
  'und-lk': 'si-sinh-lk',
  'und-ls': 'st-latn-ls',
  'und-lt': 'lt-latn-lt',
  'und-lu': 'fr-latn-lu',
  'und-lv': 'lv-latn-lv',
  'und-ly': 'ar-arab-ly',
  'und-lyci': 'xlc-lyci-tr',
  'und-lydi': 'xld-lydi-tr',
  'und-ma': 'ar-arab-ma',
  'und-mahj': 'hi-mahj-in',
  'und-maka': 'mak-maka-id',
  'und-mand': 'myz-mand-ir',
  'und-mani': 'xmn-mani-cn',
  'und-marc': 'bo-marc-cn',
  'und-mc': 'fr-latn-mc',
  'und-md': 'ro-latn-md',
  'und-me': 'sr-latn-me',
  'und-medf': 'dmf-medf-ng',
  'und-mend': 'men-mend-sl',
  'und-merc': 'xmr-merc-sd',
  'und-mero': 'xmr-mero-sd',
  'und-mf': 'fr-latn-mf',
  'und-mg': 'mg-latn-mg',
  'und-mk': 'mk-cyrl-mk',
  'und-ml': 'bm-latn-ml',
  'und-mlym': 'ml-mlym-in',
  'und-mm': 'my-mymr-mm',
  'und-mn': 'mn-cyrl-mn',
  'und-mo': 'zh-hant-mo',
  'und-modi': 'mr-modi-in',
  'und-mong': 'mn-mong-cn',
  'und-mq': 'fr-latn-mq',
  'und-mr': 'ar-arab-mr',
  'und-mroo': 'mro-mroo-bd',
  'und-mt': 'mt-latn-mt',
  'und-mtei': 'mni-mtei-in',
  'und-mu': 'mfe-latn-mu',
  'und-mult': 'skr-mult-pk',
  'und-mv': 'dv-thaa-mv',
  'und-mx': 'es-latn-mx',
  'und-my': 'ms-latn-my',
  'und-mymr': 'my-mymr-mm',
  'und-mymr-in': 'kht-mymr-in',
  'und-mymr-th': 'mnw-mymr-th',
  'und-mz': 'pt-latn-mz',
  'und-na': 'af-latn-na',
  'und-nagm': 'unr-nagm-in',
  'und-nand': 'sa-nand-in',
  'und-narb': 'xna-narb-sa',
  'und-nbat': 'arc-nbat-jo',
  'und-nc': 'fr-latn-nc',
  'und-ne': 'ha-latn-ne',
  'und-newa': 'new-newa-np',
  'und-ni': 'es-latn-ni',
  'und-nkoo': 'man-nkoo-gn',
  'und-nl': 'nl-latn-nl',
  'und-no': 'nb-latn-no',
  'und-np': 'ne-deva-np',
  'und-nshu': 'zhx-nshu-cn',
  'und-ogam': 'sga-ogam-ie',
  'und-olck': 'sat-olck-in',
  'und-om': 'ar-arab-om',
  'und-orkh': 'otk-orkh-mn',
  'und-orya': 'or-orya-in',
  'und-osge': 'osa-osge-us',
  'und-osma': 'so-osma-so',
  'und-ougr': 'oui-ougr-143',
  'und-pa': 'es-latn-pa',
  'und-palm': 'arc-palm-sy',
  'und-pauc': 'ctd-pauc-mm',
  'und-pe': 'es-latn-pe',
  'und-perm': 'kv-perm-ru',
  'und-pf': 'fr-latn-pf',
  'und-pg': 'tpi-latn-pg',
  'und-ph': 'fil-latn-ph',
  'und-phag': 'lzh-phag-cn',
  'und-phli': 'pal-phli-ir',
  'und-phlp': 'pal-phlp-cn',
  'und-phnx': 'phn-phnx-lb',
  'und-pk': 'ur-arab-pk',
  'und-pl': 'pl-latn-pl',
  'und-plrd': 'hmd-plrd-cn',
  'und-pm': 'fr-latn-pm',
  'und-pr': 'es-latn-pr',
  'und-prti': 'xpr-prti-ir',
  'und-ps': 'ar-arab-ps',
  'und-pt': 'pt-latn-pt',
  'und-pw': 'pau-latn-pw',
  'und-py': 'gn-latn-py',
  'und-qa': 'ar-arab-qa',
  'und-qo': 'en-latn-dg',
  'und-re': 'fr-latn-re',
  'und-rjng': 'rej-rjng-id',
  'und-ro': 'ro-latn-ro',
  'und-rohg': 'rhg-rohg-mm',
  'und-rs': 'sr-cyrl-rs',
  'und-ru': 'ru-cyrl-ru',
  'und-runr': 'non-runr-se',
  'und-rw': 'rw-latn-rw',
  'und-sa': 'ar-arab-sa',
  'und-samr': 'smp-samr-il',
  'und-sarb': 'xsa-sarb-ye',
  'und-saur': 'saz-saur-in',
  'und-sc': 'fr-latn-sc',
  'und-sd': 'ar-arab-sd',
  'und-se': 'sv-latn-se',
  'und-sgnw': 'ase-sgnw-us',
  'und-shaw': 'en-shaw-gb',
  'und-shrd': 'sa-shrd-in',
  'und-si': 'sl-latn-si',
  'und-sidd': 'sa-sidd-in',
  'und-sind': 'sd-sind-in',
  'und-sinh': 'si-sinh-lk',
  'und-sj': 'nb-latn-sj',
  'und-sk': 'sk-latn-sk',
  'und-sm': 'it-latn-sm',
  'und-sn': 'fr-latn-sn',
  'und-so': 'so-latn-so',
  'und-sogd': 'sog-sogd-uz',
  'und-sogo': 'sog-sogo-uz',
  'und-sora': 'srb-sora-in',
  'und-soyo': 'cmg-soyo-mn',
  'und-sr': 'nl-latn-sr',
  'und-st': 'pt-latn-st',
  'und-sund': 'su-sund-id',
  'und-sv': 'es-latn-sv',
  'und-sy': 'ar-arab-sy',
  'und-sylo': 'syl-sylo-bd',
  'und-syrc': 'syr-syrc-iq',
  'und-tagb': 'tbw-tagb-ph',
  'und-takr': 'doi-takr-in',
  'und-tale': 'tdd-tale-cn',
  'und-talu': 'khb-talu-cn',
  'und-taml': 'ta-taml-in',
  'und-tang': 'txg-tang-cn',
  'und-tavt': 'blt-tavt-vn',
  'und-td': 'fr-latn-td',
  'und-telu': 'te-telu-in',
  'und-tf': 'fr-latn-tf',
  'und-tfng': 'zgh-tfng-ma',
  'und-tg': 'fr-latn-tg',
  'und-tglg': 'fil-tglg-ph',
  'und-th': 'th-thai-th',
  'und-thaa': 'dv-thaa-mv',
  'und-thai': 'th-thai-th',
  'und-thai-cn': 'lcp-thai-cn',
  'und-thai-kh': 'kdt-thai-kh',
  'und-thai-la': 'kdt-thai-la',
  'und-tibt': 'bo-tibt-cn',
  'und-tirh': 'mai-tirh-in',
  'und-tj': 'tg-cyrl-tj',
  'und-tk': 'tkl-latn-tk',
  'und-tl': 'pt-latn-tl',
  'und-tm': 'tk-latn-tm',
  'und-tn': 'ar-arab-tn',
  'und-tnsa': 'nst-tnsa-in',
  'und-to': 'to-latn-to',
  'und-toto': 'txo-toto-in',
  'und-tr': 'tr-latn-tr',
  'und-tv': 'tvl-latn-tv',
  'und-tw': 'zh-hant-tw',
  'und-tz': 'sw-latn-tz',
  'und-ua': 'uk-cyrl-ua',
  'und-ug': 'sw-latn-ug',
  'und-ugar': 'uga-ugar-sy',
  'und-uy': 'es-latn-uy',
  'und-uz': 'uz-latn-uz',
  'und-va': 'it-latn-va',
  'und-vaii': 'vai-vaii-lr',
  'und-ve': 'es-latn-ve',
  'und-vith': 'sq-vith-al',
  'und-vn': 'vi-latn-vn',
  'und-vu': 'bi-latn-vu',
  'und-wara': 'hoc-wara-in',
  'und-wcho': 'nnp-wcho-in',
  'und-wf': 'fr-latn-wf',
  'und-ws': 'sm-latn-ws',
  'und-xk': 'sq-latn-xk',
  'und-xpeo': 'peo-xpeo-ir',
  'und-xsux': 'akk-xsux-iq',
  'und-ye': 'ar-arab-ye',
  'und-yezi': 'ku-yezi-ge',
  'und-yiii': 'ii-yiii-cn',
  'und-yt': 'fr-latn-yt',
  'und-zanb': 'cmg-zanb-mn',
  'und-zw': 'sn-latn-zw',
  unr: 'unr-beng-in',
  'unr-deva': 'unr-deva-np',
  'unr-np': 'unr-deva-np',
  unx: 'unx-beng-in',
  uok: 'uok-latn-zz',
  ur: 'ur-arab-pk',
  uri: 'uri-latn-zz',
  urt: 'urt-latn-zz',
  urw: 'urw-latn-zz',
  usa: 'usa-latn-zz',
  uth: 'uth-latn-zz',
  utr: 'utr-latn-zz',
  uvh: 'uvh-latn-zz',
  uvl: 'uvl-latn-zz',
  uz: 'uz-latn-uz',
  'uz-af': 'uz-arab-af',
  'uz-arab': 'uz-arab-af',
  'uz-cn': 'uz-cyrl-cn',
  vag: 'vag-latn-zz',
  vai: 'vai-vaii-lr',
  van: 'van-latn-zz',
  ve: 've-latn-za',
  vec: 'vec-latn-it',
  vep: 'vep-latn-ru',
  vi: 'vi-latn-vn',
  vic: 'vic-latn-sx',
  viv: 'viv-latn-zz',
  vls: 'vls-latn-be',
  vmf: 'vmf-latn-de',
  vmw: 'vmw-latn-mz',
  vo: 'vo-latn-001',
  vot: 'vot-latn-ru',
  vro: 'vro-latn-ee',
  vun: 'vun-latn-tz',
  vut: 'vut-latn-zz',
  wa: 'wa-latn-be',
  wae: 'wae-latn-ch',
  waj: 'waj-latn-zz',
  wal: 'wal-ethi-et',
  wan: 'wan-latn-zz',
  war: 'war-latn-ph',
  wbp: 'wbp-latn-au',
  wbq: 'wbq-telu-in',
  wbr: 'wbr-deva-in',
  wci: 'wci-latn-zz',
  wer: 'wer-latn-zz',
  wgi: 'wgi-latn-zz',
  whg: 'whg-latn-zz',
  wib: 'wib-latn-zz',
  wiu: 'wiu-latn-zz',
  wiv: 'wiv-latn-zz',
  wja: 'wja-latn-zz',
  wji: 'wji-latn-zz',
  wls: 'wls-latn-wf',
  wmo: 'wmo-latn-zz',
  wnc: 'wnc-latn-zz',
  wni: 'wni-arab-km',
  wnu: 'wnu-latn-zz',
  wo: 'wo-latn-sn',
  wob: 'wob-latn-zz',
  wos: 'wos-latn-zz',
  wrs: 'wrs-latn-zz',
  wsg: 'wsg-gong-in',
  wsk: 'wsk-latn-zz',
  wtm: 'wtm-deva-in',
  wuu: 'wuu-hans-cn',
  wuv: 'wuv-latn-zz',
  wwa: 'wwa-latn-zz',
  xav: 'xav-latn-br',
  xbi: 'xbi-latn-zz',
  xco: 'xco-chrs-uz',
  xcr: 'xcr-cari-tr',
  xes: 'xes-latn-zz',
  xh: 'xh-latn-za',
  xla: 'xla-latn-zz',
  xlc: 'xlc-lyci-tr',
  xld: 'xld-lydi-tr',
  xmf: 'xmf-geor-ge',
  xmn: 'xmn-mani-cn',
  xmr: 'xmr-merc-sd',
  xna: 'xna-narb-sa',
  xnr: 'xnr-deva-in',
  xog: 'xog-latn-ug',
  xon: 'xon-latn-zz',
  xpr: 'xpr-prti-ir',
  xrb: 'xrb-latn-zz',
  xsa: 'xsa-sarb-ye',
  xsi: 'xsi-latn-zz',
  xsm: 'xsm-latn-zz',
  xsr: 'xsr-deva-np',
  xwe: 'xwe-latn-zz',
  yam: 'yam-latn-zz',
  yao: 'yao-latn-mz',
  yap: 'yap-latn-fm',
  yas: 'yas-latn-zz',
  yat: 'yat-latn-zz',
  yav: 'yav-latn-cm',
  yay: 'yay-latn-zz',
  yaz: 'yaz-latn-zz',
  yba: 'yba-latn-zz',
  ybb: 'ybb-latn-cm',
  yby: 'yby-latn-zz',
  yer: 'yer-latn-zz',
  ygr: 'ygr-latn-zz',
  ygw: 'ygw-latn-zz',
  yi: 'yi-hebr-001',
  yko: 'yko-latn-zz',
  yle: 'yle-latn-zz',
  ylg: 'ylg-latn-zz',
  yll: 'yll-latn-zz',
  yml: 'yml-latn-zz',
  yo: 'yo-latn-ng',
  yon: 'yon-latn-zz',
  yrb: 'yrb-latn-zz',
  yre: 'yre-latn-zz',
  yrl: 'yrl-latn-br',
  yss: 'yss-latn-zz',
  yua: 'yua-latn-mx',
  yue: 'yue-hant-hk',
  'yue-cn': 'yue-hans-cn',
  'yue-hans': 'yue-hans-cn',
  yuj: 'yuj-latn-zz',
  yut: 'yut-latn-zz',
  yuw: 'yuw-latn-zz',
  za: 'za-latn-cn',
  zag: 'zag-latn-sd',
  zdj: 'zdj-arab-km',
  zea: 'zea-latn-nl',
  zgh: 'zgh-tfng-ma',
  zh: 'zh-hans-cn',
  'zh-au': 'zh-hant-au',
  'zh-bn': 'zh-hant-bn',
  'zh-bopo': 'zh-bopo-tw',
  'zh-gb': 'zh-hant-gb',
  'zh-gf': 'zh-hant-gf',
  'zh-hanb': 'zh-hanb-tw',
  'zh-hant': 'zh-hant-tw',
  'zh-hk': 'zh-hant-hk',
  'zh-id': 'zh-hant-id',
  'zh-mo': 'zh-hant-mo',
  'zh-pa': 'zh-hant-pa',
  'zh-pf': 'zh-hant-pf',
  'zh-ph': 'zh-hant-ph',
  'zh-sr': 'zh-hant-sr',
  'zh-th': 'zh-hant-th',
  'zh-tw': 'zh-hant-tw',
  'zh-us': 'zh-hant-us',
  'zh-vn': 'zh-hant-vn',
  zhx: 'zhx-nshu-cn',
  zia: 'zia-latn-zz',
  zkt: 'zkt-kits-cn',
  zlm: 'zlm-latn-tg',
  zmi: 'zmi-latn-my',
  zne: 'zne-latn-zz',
  zu: 'zu-latn-za',
  zza: 'zza-latn-tr'
}

;// CONCATENATED MODULE: ./node_modules/bcp-47-normalize/lib/index.js
/**
 * @typedef {import('bcp-47').Warning} Warning
 * @typedef {import('bcp-47').Schema} Schema
 * @typedef {import('bcp-47').Extension} Extension
 *
 * @typedef Options
 * @property {boolean} [forgiving]
 * @property {Warning} [warning]
 */








const lib_own = {}.hasOwnProperty

const collator = new Intl.Collator()

/**
 * @param {Schema} base
 * @param {Partial<Schema>} changes
 * @returns {Schema}
 */
function merge(base, changes) {
  if (!base.language) base.language = changes.language
  if (!base.script) base.script = changes.script
  if (!base.region) base.region = changes.region
  if (changes.variants) base.variants.push(...changes.variants)

  return base
}

/**
 * Mostly like:
 * <https://github.com/formatjs/formatjs/blob/a15e757/packages/intl-locale/index.ts#L254>
 * But doesn’t crash.
 *
 * @param {Schema} schema
 * @returns {string}
 */
function addLikelySubtags(schema) {
  const {language, script, region} = schema
  /** @type {string|undefined} */
  let match

  if (
    script &&
    region &&
    (match = likely[stringify({language, script, region})])
  ) {
    schema.script = undefined
    schema.region = undefined
  } else if (script && (match = likely[stringify({language, script})])) {
    schema.script = undefined
  } else if (region && (match = likely[stringify({language, region})])) {
    schema.region = undefined
  } else if (language && (match = likely[language])) {
    // Empty.
  }

  if (match) {
    schema.language = undefined
    merge(schema, parse(match))
  }

  return stringify(schema)
}

/**
 * @param {Schema} schema
 */
function removeLikelySubtags(schema) {
  addLikelySubtags(schema)

  const {language, script, region} = schema

  if (!language) return schema

  const maxLocale = stringify({language, script, region})

  if (maxLocale === addLikelySubtags(parse(language))) {
    schema.script = undefined
    schema.region = undefined
  } else if (
    region &&
    maxLocale === addLikelySubtags(parse(language + '-' + region))
  ) {
    schema.script = undefined
  } else if (
    script &&
    maxLocale === addLikelySubtags(parse(language + '-' + script))
  ) {
    schema.region = undefined
  }

  return schema
}

/**
 * Normalize the given BCP 47 tag according to Unicode CLDR suggestions.
 *
 * @param {string} tag
 *   BCP 47 tag.
 * @param {Options} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Normal, canonical, and pretty BCP 47 tag.
 */
function bcp47Normalize(tag, options) {
  const settings = options || {}
  // 1. normalize and lowercase the tag (`sgn-be-fr` -> `sfb`).
  const schema = parse(String(tag || '').toLowerCase(), settings)
  const value = stringify(schema)

  if (!value) {
    return value
  }

  let index = -1

  // 2. Do fancy, expensive replaces (`ha-latn-gh` -> `ha-gh`).
  while (++index < matches.length) {
    let from = matches[index].from

    if (from.slice(0, 4) === 'und-' && schema.language) {
      from = schema.language + from.slice(3)
    }

    if (extendedFilter(value, from).length > 0) {
      replace(schema, from, matches[index].to)
    }
  }

  // 3. Do basic field replaces (`en-840` -> `en-us`).
  index = -1

  while (++index < fields.length) {
    if (remove(schema, fields[index].from.field, fields[index].from.value)) {
      add(schema, fields[index].to.field, fields[index].to.value)
    }
  }

  // 4. Minimize.
  removeLikelySubtags(schema)

  // 5. Sort variants, and sort extensions on singleton.
  schema.variants.sort(collator.compare)
  schema.extensions.sort(compareSingleton)

  // 6. Warn if fields (currently only regions) should be updated but have
  // multiple choices.
  if (settings.warning) {
    /** @type {keyof many} */
    let key

    for (key in many) {
      if (lib_own.call(many, key)) {
        const map = many[key]
        const value = schema[key]
        if (value && lib_own.call(map, value)) {
          const replacements = map[value]
          settings.warning(
            'Deprecated ' +
              key +
              ' `' +
              value +
              '`, expected one of `' +
              replacements.join('`, `') +
              '`',
            -1,
            7
          )
        }
      }
    }
  }

  // 7. Add proper casing back.
  // Format script (ISO 15924) as titlecase (example: `Latn`):
  if (schema.script) {
    schema.script =
      schema.script.charAt(0).toUpperCase() + schema.script.slice(1)
  }

  // Format region (ISO 3166) as uppercase (note: this doesn’t affect numeric
  // codes, which is fine):
  if (schema.region) {
    schema.region = schema.region.toUpperCase()
  }

  return stringify(schema)
}

/**
 * @param {Schema} schema
 * @param {string} from
 * @param {string} to
 * @returns {void}
 */
function replace(schema, from, to) {
  const left = parse(from)
  const right = parse(to)
  /** @type {Array<string>} */
  const removed = []
  /** @type {string|null|undefined} */
  const lang = left.language
  /** @type {keyof schema} */
  let key

  // Remove values from `from`:
  for (key in left) {
    if (lib_own.call(left, key)) {
      const value = left[key]
      if (value && remove(schema, key, value)) {
        removed.push(key)
      }
    }
  }

  // Add values from `to`:
  for (key in right) {
    if (lib_own.call(right, key)) {
      const value = right[key]
      // Only add values that are defined on `to`, and that were either removed by
      // `from` or are currently empty.
      if (lang && value && (removed.includes(key) || !schema[key])) {
        add(schema, key, key === 'language' && value === 'und' ? lang : value)
      }
    }
  }
}

/**
 * @param {Schema} object
 * @param {keyof Schema} key
 * @param {string|Array<string>|Array<Extension>} value
 * @returns {boolean}
 */
function remove(object, key, value) {
  let removed = false
  /** @type {string|Array<string>|Array<Extension>|null|undefined} */
  let result

  if (value) {
    const current = object[key]
    result = current

    if (Array.isArray(current)) {
      result = []
      let index = -1

      while (++index < current.length) {
        const item = current[index]

        // @ts-expect-error: TS can’t handle the two lists.
        if (value.includes(item)) {
          removed = true
        } else {
          // @ts-expect-error: TS can’t handle the two lists.
          result.push(item)
        }
      }
    } else if (current === value) {
      result = null
      removed = true
    }

    // @ts-expect-error: Assume the value matches.
    object[key] = result
  }

  return removed
}

/**
 * @param {Schema} object
 * @param {keyof Schema} key
 * @param {string|Array<string>|Array<Extension>} value
 * @returns {void}
 */
function add(object, key, value) {
  /** @type {string|Array<string>|Array<Extension>|null|undefined} */
  const current = object[key]

  if (Array.isArray(current)) {
    const list = Array.isArray(value) ? value : [value]
    /** @type {number} */
    let index = -1

    while (++index < list.length) {
      const item = list[index]

      // @ts-expect-error: TS can’t handle the two lists.
      if (!current.includes(item)) {
        // @ts-expect-error: TS can’t handle the two lists.
        current.push(item)
      }
    }
  } else {
    // @ts-expect-error: Assume the value matches.
    object[key] = value
  }
}

/**
 * @param {Extension} left
 * @param {Extension} right
 * @returns {number}
 */
function compareSingleton(left, right) {
  return collator.compare(left.singleton, right.singleton)
}

;// CONCATENATED MODULE: ./src/utils.js





function createGlobber(regexpPath) {
  const toPath = (0,dist/* compile */.MY)(regexpPath);
  const globberPath = toPath({ locale: '*' });

  return glob.create(globberPath);
}

function normalizeLocale(locale) {
  return bcp47Normalize(locale, {
    forgiving: false,
    warning: reason => core.warning(reason),
  });
}

function serializeLocale(locale) {
  const normalizedLocale = normalizeLocale(locale);

  // Lokalise expects _ (underscore) rather than hyphen (-).
  return normalizedLocale?.replace('-', '_');
}

function deserializeLocale(locale) {
  // Lokalise provides _ (underscore) rather than expected hyphen (-).
  const normalizedLocale = normalizeLocale(locale.replace('_', '-'));

  // We expect lower-case
  return normalizedLocale.toLowerCase();
}

;// CONCATENATED MODULE: ./src/upload.js






async function uploadFile(httpClient, { project, filePath, ...options }) {
  const locale = serializeLocale(options.locale);

  if (!locale) {
    core.warning({
      title: 'Unable to extract locale from path',
      file: filePath,
    });

    return undefined;
  }

  const data = await promises_namespaceObject.readFile(filePath, { encoding: 'base64' });

  return httpClient
    .postJson(`https://api.lokalise.co/api2/projects/${project}/files/upload`, {
      data,
      filename: filePath,
      lang_iso: locale,
      // Lokalise seems to have a problem with their "Universal Placeholders".
      // Lokalise has been notified and they are looking into it.
      // We'll keep our own format for now.
      convert_placeholders: false,
    })
    .then(response => response?.result)
    .catch(error => {
      throw new Error(error?.result?.error?.message ?? 'Unexpected error');
    });
}

async function upload(httpClient, { project, ...options }) {
  const absolutePath = external_path_.resolve(process.cwd(), options.path);
  const matchPath = (0,dist/* match */.EQ)(absolutePath);

  const globber = await createGlobber(absolutePath);

  const uploadedPaths = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const filePath of globber.globGenerator()) {
    const matchedPath = matchPath(filePath);
    const { locale } = matchedPath.params;

    await uploadFile(httpClient, { project, locale, filePath }).catch(error => {
      core.setFailed({
        title: error.message,
        file: filePath,
      });
    });

    uploadedPaths.push(filePath);
  }

  return uploadedPaths;
}

// EXTERNAL MODULE: ./node_modules/@actions/io/lib/io.js
var io = __nccwpck_require__(7436);
// EXTERNAL MODULE: ./node_modules/@actions/exec/lib/exec.js
var exec = __nccwpck_require__(1514);
// EXTERNAL MODULE: ./node_modules/@actions/tool-cache/lib/tool-cache.js
var tool_cache = __nccwpck_require__(7784);
;// CONCATENATED MODULE: ./src/download.js







// Re-implementation of extractZip from @actions/tool-cache to preserve folder structure
async function extractZip(filePath, destinationPath) {
  const unzipPath = await io.which('unzip', true);
  const args = ['-q', '-o'];
  args.push(filePath);

  await (0,exec.exec)(`"${unzipPath}"`, args, { cwd: destinationPath });
}

async function download(httpClient, options) {
  const toTranslationFilePath = (0,dist/* compile */.MY)(options.path);

  const response = await httpClient.postJson(
    `https://api.lokalise.co/api2/projects/${options.project}/files/download`,
    {
      format: 'po',
      original_filenames: false,
      export_empty_as: 'empty',
      placeholder_format: 'icu',
      bundle_structure: toTranslationFilePath({ locale: '%LANG_ISO%' }),
    }
  );

  const downloadUrl = response.result.bundle_url;
  const relativeZipPath = await (0,tool_cache.downloadTool)(downloadUrl);
  const absoluteZipPath = external_path_.resolve(relativeZipPath);
  const extractedFromZipPath = external_path_.dirname(absoluteZipPath);

  await extractZip(absoluteZipPath, extractedFromZipPath);

  const tmpTranslationsPath = external_path_.join(extractedFromZipPath, options.path);
  const matchTranslationFilePath = (0,dist/* match */.EQ)(tmpTranslationsPath);
  const globber = await createGlobber(tmpTranslationsPath);

  const downloadedPaths = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const sourceFilePath of globber.globGenerator()) {
    const matchedPath = matchTranslationFilePath(sourceFilePath);
    const locale = deserializeLocale(matchedPath.params.locale);
    const destinationFilePath = toTranslationFilePath({ locale });

    await io.mkdirP(external_path_.dirname(destinationFilePath));
    await io.cp(sourceFilePath, destinationFilePath, { recursive: true });

    downloadedPaths.push(destinationFilePath);
  }

  return downloadedPaths;
}

;// CONCATENATED MODULE: ./src/action.js






function newLineList(list) {
  return list.filter(item => item !== '').join('\n');
}

/**
 * GitHub Action
 * @param {Object} options - Action configuration options
 * @param {string} options.token - Lokalise API Token
 * @param {string} options.project - Lokalise Project ID
 * @param {string} options.path - Path to translation file(s)
 * @param {boolean} options.upload - Defines if we should upload files
 * @param {boolean} options.download - Defines if we should download filess
 */
async function action(options) {
  const authHandler = new LokaliseAuthHandler(options.token);
  const httpClient = new http_client.HttpClient('translate-action', [authHandler]);

  try {
    if (options.upload) {
      core.debug('upload: true');
      const uploadedPaths = await upload(httpClient, options);
      core.setOutput('uploads', newLineList(uploadedPaths));
    }

    if (options.download) {
      core.debug('download: true');
      const downloadedPaths = await download(httpClient, options);
      core.setOutput('downloads', newLineList(downloadedPaths));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

;// CONCATENATED MODULE: ./src/index.js




const IS_WINDOWS = process.platform === 'win32';

function isValidPath(format) {
  const tokens = (0,dist/* parse */.Qc)(format);

  function isLocaleToken(token) {
    return token.name === 'locale';
  }

  return tokens.some(isLocaleToken);
}

(async function main() {
  const token = core.getInput('token', { required: true });
  const project = core.getInput('project', { required: true });
  const path = core.getInput('path', { required: true });
  const upload = core.getBooleanInput('upload', { required: false });
  const download = core.getBooleanInput('download', { required: false });

  try {
    if (!isValidPath(path)) {
      throw new Error(`\`path\` must include a :locale parameter.`);
    }

    if (download && IS_WINDOWS) {
      throw new Error('Cannot download files on windows due to complicated unzip.');
    }

    await action({ token, project, path, upload, download });
  } catch (error) {
    core.setFailed(error.message);
  }
})();

})();


//# sourceMappingURL=index.js.map