import {readdirSync, readFileSync} from "fs";
import {join as joinPath, extname, relative, sep} from "path";
import stripComments from "strip-json-comments";

function findTsConfigDirectory(path: string): string {
    const currentDirContent = readdirSync(path);
    if(!currentDirContent.includes("tsconfig.json")) {
        return findTsConfigDirectory(joinPath(path, ".."));
    }
    return path;
}
const tsConfigDirectory = findTsConfigDirectory(process.cwd())
const rawData = readFileSync(`${tsConfigDirectory}\\tsconfig.json`, "utf8");
const tsConfigContent = JSON.parse(stripComments(rawData));
const tsConfigBaseUrl = tsConfigContent.compilerOptions.baseUrl ?? "";

console.log(joinPath(tsConfigDirectory, tsConfigBaseUrl));

const tsFilesInDirectory = readdirSync(process.cwd())
    .filter(x => extname(x) === ".ts")
    .map(x => joinPath(process.cwd(), x))
    .map(x => relative(joinPath(tsConfigDirectory, tsConfigBaseUrl), x))
    .map(x => x.replace(".ts", ""))
    .map(x => x.split(sep).join("/"));

console.log(tsFilesInDirectory);