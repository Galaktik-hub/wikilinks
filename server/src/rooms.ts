// rooms.ts
import {WebSocket} from "ws";
import {Bot, JoinLeaveBot, BOTS} from "./bots";

export interface Room {
    id: number;
    members: Map<string, {ws: WebSocket; role: "creator" | "client"}>;
    bots: Map<string, Bot>;
}

const rooms: Map<number, Room> = new Map();

export function createRoom(roomId: number, userName: string, ws: WebSocket): void {
    const room: Room = {id: roomId, members: new Map(), bots: new Map()};
    room.members.set(userName, {ws, role: "creator"});

    BOTS.forEach(BotClass => {
        const botInstance = new BotClass(`Bot-${BotClass.name}`, (content: string, destination: string | null) => {
            if (destination) {
                const member = room.members.get(destination);
                if (member) {
                    member.ws.send(JSON.stringify({kind: "message_received", content, sender: botInstance.name}));
                }
            } else {
                room.members.forEach(member => {
                    member.ws.send(JSON.stringify({kind: "message_received", content, sender: botInstance.name}));
                });
            }
        });
        room.bots.set(botInstance.name, botInstance);
    });

    rooms.set(roomId, room);
}

export function joinRoom(roomId: number, userName: string, ws: WebSocket): Room | null {
    const room = rooms.get(roomId);
    if (!room) return null;
    room.members.set(userName, {ws, role: "client"});
    // Notifier les bots du join (si applicable)
    room.bots.forEach(bot => {
        if (bot instanceof JoinLeaveBot) {
            bot.notifyMemberJoin(userName);
        }
    });
    refreshPlayer(roomId, ws);
    return room;
}

export function refreshPlayer(roomId: number, ws: WebSocket): Room | null {
    const room = rooms.get(roomId);
    if (!room) return null;

    const players = Array.from(room.members.entries()).map(([username, {role}]) => ({
        username,
        role,
    }));

    room.members.forEach(member => {
        member.ws.send(JSON.stringify({kind: "players_update", players: players}));
    });
    return room;
}

export function closeRoom(roomId: number, userName: string): boolean {
    const room = rooms.get(roomId);
    if (room) {
        const member = room.members.get(userName);
        if (member && member.role === "creator") {
            room.members.forEach(member => {
                member.ws.send(JSON.stringify({kind: "room_closed", message: "La room a été fermée par le créateur"}));
                member.ws.close();
            });
            rooms.delete(roomId);
            return true;
        }
    }
    return false;
}

export function getRoom(roomId: number): Room | undefined {
    return rooms.get(roomId);
}

export function removeMember(roomId: number, userName: string) {
    const room = rooms.get(roomId);
    if (room) {
        room.members.delete(userName);
        room.bots.forEach(bot => {
            if (bot instanceof JoinLeaveBot) {
                bot.notifyMemberLeave(userName);
            }
        });
    }
}
