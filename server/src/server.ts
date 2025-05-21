import * as dotenv from "dotenv";
dotenv.config();
import {WebSocketServer, WebSocket, RawData} from "ws";
import {GameSessionManager} from "./gameSessions";
import {handleMessage, ClientContext} from "./messageHandler";
import logger from "./logger";
import mongoose from "mongoose";

const wss = new WebSocketServer({host: "0.0.0.0", port: 2025});
logger.info("WebSocket server is running on ws://localhost:2025");

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    logger.error("MongoDB URI is not defined in environment variables");
    process.exit(1);
}
mongoose.connect(mongoUri, {dbName: "Wikilinks"});

wss.on("connection", (ws: WebSocket) => {
    logger.info("New client connected");
    const context: ClientContext = {
        currentRoomId: null,
        currentUser: null,
        currentGameSessionId: null,
        currentChallengeSessionId: null,
    };

    ws.on("message", (data: RawData) => {
        try {
            const message = JSON.parse(data.toString());
            logger.info(`Received message: ${JSON.stringify(message)}`);
            handleMessage(ws, message, context);
        } catch (e) {
            logger.error(`Error processing message: ${e}`);
            ws.send(JSON.stringify({kind: "error", message: "Invalid message format"}));
        }
    });

    ws.on("close", () => {
        logger.info(`Connection closed for user ${context.currentUser?.name}`);
        if (context.currentGameSessionId && context.currentUser) {
            const session = GameSessionManager.getSession(context.currentGameSessionId);
            if (session) {
                session.handlePlayerDeparture(context.currentUser.name);
            }
        }
    });
});
