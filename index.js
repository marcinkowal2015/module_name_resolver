"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var yargs_1 = require("yargs");
var stripComments = require("strip-json-comments");
function findTsConfigDirectory(path) {
    var currentDirContent = fs_1.readdirSync(path);
    if (!currentDirContent.includes("tsconfig.json")) {
        if (path_1.dirname(path) === (path_1.dirname(path_1.join(path, "..")))) {
            throw new Error("tsconfig.json not found");
        }
        return findTsConfigDirectory(path_1.join(path, ".."));
    }
    return path;
}
function modulesInDirectory(path) {
    var _a;
    var tsConfigDirectory = findTsConfigDirectory(path);
    var rawData = fs_1.readFileSync(tsConfigDirectory + "\\tsconfig.json", "utf8");
    var tsConfigContent = JSON.parse(stripComments(rawData));
    var tsConfigBaseUrl = (_a = tsConfigContent.compilerOptions.baseUrl, (_a !== null && _a !== void 0 ? _a : ""));
    var supportedExtNames = [".ts", ".tsx"];
    var tsFilesInDirectory = fs_1.readdirSync(path)
        .filter(function (x) { return supportedExtNames.includes(path_1.extname(x)); })
        .map(function (x) { return path_1.join(path, x); })
        .map(function (x) { return path_1.relative(path_1.join(tsConfigDirectory, tsConfigBaseUrl), x); })
        .map(function (x) { return x.replace(path_1.extname(x), ""); })
        .map(function (x) { return x.split(path_1.sep).join("/"); });
    return tsFilesInDirectory;
}
exports.modulesInDirectory = modulesInDirectory;
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
function resolveModuleName() {
    try {
        if (yargs_1.argv._[0]) {
            console.log(getModuleName(path_1.join(process.cwd(), yargs_1.argv._[0])));
        }
        else if (yargs_1.argv.file) {
            console.log(getModuleName(path_1.join(process.cwd(), yargs_1.argv.file)));
        }
        else {
            console.log(modulesInDirectory(process.cwd()));
        }
    }
    catch (_a) {
        console.log("tsconfig.json not found, cannot resolve modulename");
    }
}
exports.resolveModuleName = resolveModuleName;
