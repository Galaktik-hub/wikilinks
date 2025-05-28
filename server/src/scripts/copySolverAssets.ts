import * as fs from "fs";
import * as path from "path";

const files = ["wikiSolveur", "wikiSolveur.exe", "solver/graph.txt", "solver/graph.txt.bin"];
const destBase = path.join(__dirname, "../../build/server/src/solver");

if (!fs.existsSync(destBase)) fs.mkdirSync(destBase, {recursive: true});

for (const file of files) {
    const src = path.join(__dirname, "../solver", file);
    const dest = path.join(destBase, file);
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, {recursive: true});
    fs.copyFileSync(src, dest);
}
