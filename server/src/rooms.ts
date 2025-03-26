// rooms.ts
import { WebSocket } from 'ws';
import { Bot, JoinLeaveBot, BOTS } from "./bots";
import { randomInt } from "node:crypto";

export interface Room {
    id: string;
    members: Map<string, { ws: WebSocket, role: 'creator' | 'client' }>;
    bots: Map<string, Bot>;
}

const rooms: Map<string, Room> = new Map();

export function createRoom(userName: string, ws: WebSocket): Room {
    const roomId = randomInt(100000, 999999).toString();
    const room: Room = { id: roomId, members: new Map(), bots: new Map() };
    room.members.set(userName, { ws, role: 'creator' });

    // Initialisation des bots
    BOTS.forEach(BotClass => {
        const botInstance = new BotClass(`Bot-${BotClass.name}`, (content: string, destination: string | null) => {
            if (destination) {
                const member = room.members.get(destination);
                if (member) {
                    member.ws.send(JSON.stringify({ kind: 'message_received', content, sender: botInstance.name }));
                }
            } else {
                room.members.forEach(member => {
                    member.ws.send(JSON.stringify({ kind: 'message_received', content, sender: botInstance.name }));
                });
            }
        });
        room.bots.set(botInstance.name, botInstance);
    });

    rooms.set(roomId, room);
    return room;
}

export function joinRoom(roomId: string, userName: string, ws: WebSocket): Room | null {
    const room = rooms.get(roomId);
    if (!room) return null;
    room.members.set(userName, { ws, role: 'client' });
    // Notifier les bots du join (si applicable)
    room.bots.forEach(bot => {
        if (bot instanceof JoinLeaveBot) {
            bot.notifyMemberJoin(userName);
        }
    });
    return room;
}

export function closeRoom(roomId: string, userName: string): boolean {
    const room = rooms.get(roomId);
    if (room) {
        const member = room.members.get(userName);
        if (member && member.role === 'creator') {
            room.members.forEach(member => {
                member.ws.send(JSON.stringify({ kind: 'room_closed', message: 'La room a été fermée par le créateur' }));
                member.ws.close();
            });
            rooms.delete(roomId);
            return true;
        }
    }
    return false;
}

export function getRoom(roomId: string): Room | undefined {
    return rooms.get(roomId);
}

export function removeMember(roomId: string, userName: string) {
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
