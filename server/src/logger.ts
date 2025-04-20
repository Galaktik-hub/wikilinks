import {createLogger, format, transports, addColors} from "winston";
// eslint-disable-next-line @typescript-eslint/no-require-imports
import DailyRotateFile = require("winston-daily-rotate-file");
import * as fs from "node:fs";
import * as path from "node:path";

const logDir = "logs";

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, {recursive: true});
}

const dailyRotateFileTransport = new DailyRotateFile({
    filename: path.join(logDir, "server-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m", // Taille max par fichier
    maxFiles: "14d", // Garde les fichiers des 14 derniers jours
});

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        debug: "magenta",
    },
};

addColors(customLevels.colors);

const logger = createLogger({
    levels: customLevels.levels,
    level: "debug",
    format: format.combine(
        format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`),
    ),
    transports: [new transports.Console(), dailyRotateFileTransport],
});

export default logger;
