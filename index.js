"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var strip_json_comments_1 = __importDefault(require("strip-json-comments"));
function findTsConfigDirectory(path) {
    var currentDirContent = fs_1.readdirSync(path);
    if (!currentDirContent.includes("tsconfig.json")) {
        return findTsConfigDirectory(path_1.join(path, ".."));
    }
    return path;
}
var tsConfigDirectory = findTsConfigDirectory(process.cwd());
var rawData = fs_1.readFileSync(tsConfigDirectory + "\\tsconfig.json", "utf8");
var tsConfigContent = JSON.parse(strip_json_comments_1.default(rawData));
var tsConfigBaseUrl = (_a = tsConfigContent.compilerOptions.baseUrl, (_a !== null && _a !== void 0 ? _a : ""));
console.log(path_1.join(tsConfigDirectory, tsConfigBaseUrl));
var tsFilesInDirectory = fs_1.readdirSync(process.cwd())
    .filter(function (x) { return path_1.extname(x) === ".ts"; })
    .map(function (x) { return path_1.join(process.cwd(), x); })
    .map(function (x) { return path_1.relative(path_1.join(tsConfigDirectory, tsConfigBaseUrl), x); })
    .map(function (x) { return x.replace(".ts", ""); })
    .map(function (x) { return x.split(path_1.sep).join("/"); });
console.log(tsFilesInDirectory);
