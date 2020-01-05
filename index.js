"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var stripComments = require("strip-json-comments");
function findTsConfigDirectory(path) {
    var currentDirContent = fs_1.readdirSync(path);
    if (!currentDirContent.includes("tsconfig.json")) {
        return findTsConfigDirectory(path_1.join(path, ".."));
    }
    return path;
}
function modulesInCurrentDirectory() {
    var _a;
    var tsConfigDirectory = findTsConfigDirectory(process.cwd());
    var rawData = fs_1.readFileSync(tsConfigDirectory + "\\tsconfig.json", "utf8");
    var tsConfigContent = JSON.parse(stripComments(rawData));
    var tsConfigBaseUrl = (_a = tsConfigContent.compilerOptions.baseUrl, (_a !== null && _a !== void 0 ? _a : ""));
    var tsFilesInDirectory = fs_1.readdirSync(process.cwd())
        .filter(function (x) { return path_1.extname(x) === ".ts"; })
        .map(function (x) { return path_1.join(process.cwd(), x); })
        .map(function (x) { return path_1.relative(path_1.join(tsConfigDirectory, tsConfigBaseUrl), x); })
        .map(function (x) { return x.replace(".ts", ""); })
        .map(function (x) { return x.split(path_1.sep).join("/"); });
    return tsFilesInDirectory;
}
exports.modulesInCurrentDirectory = modulesInCurrentDirectory;
function getModuleName(modulePath) {
    var _a;
    var tsConfigDirectory = findTsConfigDirectory(path_1.dirname(modulePath));
    var rawData = fs_1.readFileSync(tsConfigDirectory + "\\tsconfig.json", "utf8");
    var tsConfigContent = JSON.parse(stripComments(rawData));
    var tsConfigBaseUrl = (_a = tsConfigContent.compilerOptions.baseUrl, (_a !== null && _a !== void 0 ? _a : "."));
    var rootModulePath = path_1.join(tsConfigDirectory, tsConfigBaseUrl);
    var moduleName = path_1.relative(rootModulePath, modulePath)
        .replace(path_1.extname(modulePath), "")
        .split(path_1.sep).join("/");
    return moduleName;
}
exports.getModuleName = getModuleName;
