import {execFile as execFileCb} from "node:child_process";
import {promisify} from "util";
import * as fs from "fs";
import * as path from "path";
import logger from "../logger";
import {getIdFromTitle, getTitleFromId} from "./wikipediaArticleUtils";

const execFileAsync = promisify(execFileCb);
const SOLVER_DIR = path.join(__dirname, "../solver");
const EXE_NAME = process.platform === "win32" ? "wikiSolveur.exe" : "wikiSolveur";
const SOLVER_PATH = path.join(SOLVER_DIR, EXE_NAME);
const TXT_PATH = path.join(SOLVER_DIR, "solver/graph.txt");
const BIN_PATH = TXT_PATH + ".bin";

/**
 * Ensure the solver binary exists by generating graph.txt.bin if missing.
 *
 * @returns Promise<void>
 */
async function ensureBinary(): Promise<void> {
    if (!fs.existsSync(BIN_PATH)) {
        logger.info("Generating graph.txt.bin");
        await execFileAsync(SOLVER_PATH, [TXT_PATH, "0", "0", "0"]);
    }
}

/**
 * Compute the shortest path between two article IDs.
 *
 * @param startId – numeric ID of the start article
 * @param targetId – numeric ID of the target article
 * @returns Promise<number[]>  array of article IDs along the path
 */
export async function solvePath(startId: number, targetId: number): Promise<number[]> {
    await ensureBinary();
    logger.info(`Running solver: start=${startId}, target=${targetId}`);
    const {stdout} = await execFileAsync(SOLVER_PATH, [BIN_PATH, "1", String(startId), String(targetId)]);
    const lines = stdout
        .trim()
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l);
    const last = lines[lines.length - 1];
    return last.split("->").map(s => Number(s.trim()));
}

/**
 * Resolve a path by article titles rather than IDs.
 *
 * @param startTitle – title of the start article
 * @param targetTitle – title of the target article
 * @returns Promise<number[]>  array of article IDs along the path
 */
export async function getIdPath(startTitle: string, targetTitle: string): Promise<number[]> {
    const startId = await getIdFromTitle(startTitle);
    const targetId = await getIdFromTitle(targetTitle);
    return solvePath(startId, targetId);
}

/**
 * Translate an ID-based path into titles.
 *
 * @param ids – array of article IDs
 * @returns Promise<string[]>  array of article titles
 */
export async function idPathToTitles(ids: number[]): Promise<string[]> {
    return Promise.all(ids.map(id => getTitleFromId(id)));
}
