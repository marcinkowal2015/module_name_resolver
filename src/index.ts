import {readdirSync, readFileSync} from "fs";
import {join as joinPath, extname, relative, sep, dirname} from "path";
import {argv} from "yargs";

const stripComments = require("strip-json-comments");

function findTsConfigDirectory(path: string): string {
    const currentDirContent = readdirSync(path);
    if(!currentDirContent.includes("tsconfig.json")) {
        if(dirname(path) === (dirname(joinPath(path, "..")))) {
            throw new Error("tsconfig.json not found");
        }
        return findTsConfigDirectory(joinPath(path, ".."));
    }
    return path;
}

export function modulesInDirectory(path: string) {
    const tsConfigDirectory = findTsConfigDirectory(path)
    const rawData = readFileSync(`${tsConfigDirectory}\\tsconfig.json`, "utf8");
    const tsConfigContent = JSON.parse(stripComments(rawData));
    const tsConfigBaseUrl = tsConfigContent.compilerOptions.baseUrl ?? "";
    const supportedExtNames = [".ts", ".tsx"]

    const tsFilesInDirectory = readdirSync(path)
        .filter(x => supportedExtNames.includes(extname(x)))
        .map(x => joinPath(path, x))
        .map(x => relative(joinPath(tsConfigDirectory, tsConfigBaseUrl), x))
        .map(x => x.replace(extname(x), ""))
        .map(x => x.split(sep).join("/"));

    return tsFilesInDirectory;
}


export function getModuleName(modulePath: string) {
    const tsConfigDirectory = findTsConfigDirectory(dirname(modulePath))
    const rawData = readFileSync(`${tsConfigDirectory}\\tsconfig.json`, "utf8");
    const tsConfigContent = JSON.parse(stripComments(rawData));
    const tsConfigBaseUrl = tsConfigContent.compilerOptions.baseUrl ?? ".";

    const rootModulePath = joinPath(tsConfigDirectory, tsConfigBaseUrl);
    const moduleName = relative(rootModulePath, modulePath)
        .replace(extname(modulePath), "")
        .split(sep).join("/");

    return moduleName;
}

export function resolveModuleName() {
    try{
        if(argv._[0]) {
            console.log(getModuleName(joinPath(process.cwd(), argv._[0])));
        } else if(argv.file) {
            console.log(getModuleName(joinPath(process.cwd(),argv.file as string)));
        } else {
            console.log(modulesInDirectory(process.cwd()));
        }
    } catch {
        console.log("tsconfig.json not found, cannot resolve modulename")
    }
}
