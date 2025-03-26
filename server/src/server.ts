import { WebSocket, WebSocketServer, RawData } from 'ws';
import { randomInt } from "node:crypto";

interface Room {
    id: string;
    members: Map<string, { ws: WebSocket, role: 'creator' | 'client' }>;
    bots: Map<string, Bot>;
}

abstract class Bot {
    constructor(public name: string, protected sendMessage: (content: string, destination: string | null) => void) {}
    abstract notifyMemberJoin(name: string): void;
    abstract notifyMemberLeave(name: string): void;
    abstract notifyReceivedMessage(sender: string, content: string): boolean;
}

class UpperCaseBot extends Bot {
    notifyMemberJoin(name: string): void {
    }
    notifyMemberLeave(name: string): void {
    }
    notifyReceivedMessage(sender: string, content: string): boolean {
        console.log(`UpperCaseBot (${this.name}) received message from ${sender}: ${content}`);
        if (content.startsWith('/upper')) {
            const response = `${content.replace('/upper', '').toUpperCase()}`;
            console.log(`UpperCaseBot (${this.name}) intercepts message, sending private response: ${response}`);
            this.sendMessage(response, sender);
            return true;
        }
        return false;
    }
}

class JoinLeaveBot extends Bot {
    notifyMemberJoin(name: string | null): void {
        console.log(`JoinLeaveBot (${this.name}) notified of member join: ${name}`);
        this.sendMessage(`User ${name} has joined the room.`, null);
    }
    notifyMemberLeave(name: string | null): void {
        console.log(`JoinLeaveBot (${this.name}) notified of member leave: ${name}`);
        this.sendMessage(`User ${name} has left the room.`, null);
    }
    notifyReceivedMessage(sender: string, content: string): boolean {
        return false;
    }
}

const BOTS = [UpperCaseBot, JoinLeaveBot];
const rooms: Map<string, Room> = new Map();

const wss = new WebSocketServer({ port: 2025 });
console.log("WebSocket server is running on ws://localhost:2025");

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    let currentRoomId: string | null = null;
    let currentUserName: string | null = null;

    ws.on('message', (data: RawData) => {
        console.log('Received raw data:', data.toString());
        try {
            const message = JSON.parse(data.toString());
            console.log('Parsed message:', message);
            switch (message.kind) {
                case 'create_room': {
                    console.log(`Creating room requested by ${message.user_name}`);
                    // const roomId = randomUUID();
                    const roomId = randomInt(100000, 999999).toString();
                    currentRoomId = roomId;
                    currentUserName = message.user_name;
                    const room: Room = { id: roomId, members: new Map(), bots: new Map() };
                    room.members.set(message.user_name, { ws, role: 'creator' });
                    console.log(`Room ${roomId} created by ${message.user_name}`);

                    // Initialisation des bots
                    BOTS.forEach(BotClass => {
                        const botInstance = new BotClass(`Bot-${BotClass.name}`, (content: string, destination: string | null) => {
                            console.log(`Bot sending message to ${destination ? destination : 'all'}: ${content}`);
                            if (destination) {
                                const member = room.members.get(destination);
                                if (member) {
                                    member.ws.send(JSON.stringify({ kind: 'message_received', content: `${content}`, sender: botInstance.name }));
                                }
                            } else {
                                room.members.forEach(member => {
                                    member.ws.send(JSON.stringify({ kind: 'message_received', content: `${content}`, sender: botInstance.name }));
                                });
                            }
                        });
                        room.bots.set(botInstance.name, botInstance);
                        console.log(`Bot ${botInstance.name} initialized in room ${roomId}`);
                    });
                    rooms.set(roomId, room);
                    ws.send(JSON.stringify({ kind: 'room_created', room_id: roomId }));
                    console.log(`Room creation confirmation sent with room_id: ${roomId}`);
                    break;
                }
                case 'join_room': {
                    console.log(`${message.user_name} requests to join room ${message.room_id}`);
                    const room = rooms.get(message.room_id);
                    if (!room) {
                        console.log(`Room ${message.room_id} not found`);
                        ws.send(JSON.stringify({ kind: 'error', message: 'Room not found' }));
                        ws.close();
                        return;
                    }
                    currentRoomId = message.room_id;
                    currentUserName = message.user_name;
                    room.members.set(message.user_name, { ws, role: 'client' });
                    console.log(`${message.user_name} joined room ${message.room_id} as client`);

                    // Appel du JoinLeaveBot pour notifier l'arrivée
                    room.bots.forEach(bot => {
                        if (bot instanceof JoinLeaveBot) {
                            bot.notifyMemberJoin(message.user_name);
                        }
                    });

                    ws.send(JSON.stringify({ kind: 'room_joined', room_id: message.room_id, room_description: "Description not managed", users: Array.from(room.members.keys()) }));
                    console.log(`Room join confirmation sent to ${message.user_name}`);
                    break;
                }
                case 'send_message': {
                    console.log(`${currentUserName} is sending message: ${message.content}`);
                    if (!currentRoomId || !currentUserName) {
                        console.log('User not in a room, cannot send message');
                        ws.send(JSON.stringify({ kind: 'error', message: 'Not in a room' }));
                        return;
                    }
                    const room = rooms.get(currentRoomId);
                    if (!room) return;
                    let intercepted = false;
                    room.bots.forEach(bot => {
                        if (bot.notifyReceivedMessage(currentUserName!, message.content)) {
                            intercepted = true;
                        }
                    });
                    if (!intercepted) {
                        // Diffusion à tous les membres, y compris l'émetteur
                        room.members.forEach((member, userName) => {
                            console.log(`Forwarding message to ${userName}`);
                            member.ws.send(JSON.stringify({ kind: 'message_received', content: message.content, sender: currentUserName }));
                        });
                    } else {
                        console.log('Message intercepted by bot(s), not forwarded to any member');
                    }
                    break;
                }
                case 'disconnect': {
                    console.log(`${currentUserName} requested disconnect`);
                    if (currentRoomId && currentUserName) {
                        const room = rooms.get(currentRoomId);
                        if (room) {
                            room.members.delete(currentUserName);
                            console.log(`User ${currentUserName} removed from room ${currentRoomId}`);
                            // Appel du JoinLeaveBot pour notifier le départ
                            room.bots.forEach(bot => {
                                if (bot instanceof JoinLeaveBot) {
                                    bot.notifyMemberLeave(currentUserName);
                                }
                            });
                        }
                    }
                    ws.close();
                    break;
                }
                case 'close_room': {
                    console.log(`${currentUserName} requested to close the room`);
                    if (currentRoomId && currentUserName) {
                        const room = rooms.get(currentRoomId);
                        if (room) {
                            const user = room.members.get(currentUserName);
                            if (user && user.role === 'creator') {
                                room.members.forEach((member, userName) => {
                                    console.log(`Notifying ${userName} that room is closed`);
                                    member.ws.send(JSON.stringify({ kind: 'room_closed', message: 'La room a été fermée par le créateur' }));
                                    member.ws.close();
                                });
                                rooms.delete(currentRoomId);
                                console.log(`Room ${currentRoomId} closed by creator`);
                            } else {
                                console.log('Only the creator can close the room');
                                ws.send(JSON.stringify({ kind: 'error', message: 'Only the creator can close the room' }));
                            }
                        }
                    }
                    break;
                }
                default: {
                    console.log('Invalid message kind received:', message.kind);
                    ws.send(JSON.stringify({ kind: 'error', message: 'Invalid message kind' }));
                    ws.close();
                }
            }
        } catch (e) {
            console.error('Error processing message:', e);
            ws.send(JSON.stringify({ kind: 'error', message: 'Invalid message format' }));
        }
    });

    ws.on('close', () => {
        console.log(`Connection closed for user ${currentUserName}`);
        if (currentRoomId && currentUserName) {
            const room = rooms.get(currentRoomId);
            if (room) {
                room.members.delete(currentUserName);
                console.log(`User ${currentUserName} removed from room ${currentRoomId} on close`);
                // Appel du JoinLeaveBot pour notifier le départ
                room.bots.forEach(bot => {
                    if (bot instanceof JoinLeaveBot) {
                        bot.notifyMemberLeave(currentUserName);
                    }
                });
            }
        }
    });
});
