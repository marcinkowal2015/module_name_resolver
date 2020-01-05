import {readdirSync, readFileSync} from "fs";
import {join as joinPath, extname, relative, sep, dirname} from "path";

const stripComments = require("strip-json-comments");

function findTsConfigDirectory(path: string): string {
    const currentDirContent = readdirSync(path);
    if(!currentDirContent.includes("tsconfig.json")) {
        return findTsConfigDirectory(joinPath(path, ".."));
    }
    return path;
}

export function modulesInCurrentDirectory() {
    const tsConfigDirectory = findTsConfigDirectory(process.cwd())
    const rawData = readFileSync(`${tsConfigDirectory}\\tsconfig.json`, "utf8");
    const tsConfigContent = JSON.parse(stripComments(rawData));
    const tsConfigBaseUrl = tsConfigContent.compilerOptions.baseUrl ?? "";

    const tsFilesInDirectory = readdirSync(process.cwd())
        .filter(x => extname(x) === ".ts")
        .map(x => joinPath(process.cwd(), x))
        .map(x => relative(joinPath(tsConfigDirectory, tsConfigBaseUrl), x))
        .map(x => x.replace(".ts", ""))
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
