import { WebSocketServer, WebSocket, RawData } from "ws";
import { GameSessionManager } from "./gameSessions";
import { handleMessage, ClientContext } from "./messageHandler";

const wss = new WebSocketServer({ port: 2025 });
console.log("WebSocket server is running on ws://localhost:2025");

wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");
    const context: ClientContext = {
        currentRoomId: null,
        currentUser: null,
        currentGameSessionId: null,
    };

    ws.on("message", (data: RawData) => {
        try {
            const message = JSON.parse(data.toString());
            console.log("Received message:", message);
            handleMessage(ws, message, context);
        } catch (e) {
            console.error("Error processing message:", e);
            ws.send(JSON.stringify({ kind: "error", message: "Invalid message format" }));
        }
    });

    ws.on("close", () => {
        console.log(`Connection closed for user ${context.currentUser?.name}`);
        if (context.currentGameSessionId && context.currentUser) {
            const session = GameSessionManager.getSession(context.currentGameSessionId);
            if (session) {
                if (session.leader.name === context.currentUser.name) {
                    console.log(`The leader ${context.currentUser.name} disconnected. Clossing session ${context.currentGameSessionId}.`);
                    session.members.forEach(member => {
                        if (member.ws.readyState === WebSocket.OPEN) {
                            member.ws.send(JSON.stringify({
                                kind: "redirect_home",
                                message: "The leader left the game. Going going back to home page.",
                            }));
                            member.ws.close();
                        }
                    });
                    GameSessionManager.endSession(context.currentGameSessionId);
                } else {
                    if (session.removePlayer(context.currentUser)) {
                        console.log(`Player ${context.currentUser.name} has been removed from the session ${context.currentGameSessionId}`);
                    }
                }
            }
        }
    });
});
