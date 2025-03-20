import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions
});

io.on("connection", socket => {
    console.log("Un utilisateur s'est connecté :", socket.id);

    socket.on("joinRoom", ({ pseudo, code }) => {
        socket.join(code);
        console.log(`${pseudo} a rejoint la salle ${code}`);
    });

    socket.on("sendMessage", ({ pseudo, message, code }) => {
        console.log(`Message reçu de ${pseudo} dans la salle ${code}: ${message}`);
        // Émettre uniquement dans la salle définie par "code"
        io.to(code).emit("receiveMessage", { pseudo, message });
    });

    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté :", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Serveur WebSocket avec Socket.io sur http://localhost:3001");
});
