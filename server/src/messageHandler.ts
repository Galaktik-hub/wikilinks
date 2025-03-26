import { WebSocket, RawData } from 'ws';
import { createRoom, joinRoom, closeRoom, getRoom, removeMember } from './rooms';

interface Message {
    kind: string;
    [key: string]: any;
}

export function handleMessage(data: RawData, ws: WebSocket, context: { currentRoomId: string | null, currentUserName: string | null }) {
    try {
        const message: Message = JSON.parse(data.toString());
        switch (message.kind) {
            case 'create_room': {
                const room = createRoom(message.user_name, ws);
                context.currentRoomId = room.id;
                context.currentUserName = message.user_name;
                ws.send(JSON.stringify({ kind: 'room_created', room_id: room.id }));
                break;
            }
            case 'join_room': {
                const room = joinRoom(message.room_id, message.user_name, ws);
                if (!room) {
                    ws.send(JSON.stringify({ kind: 'error', message: 'Room not found' }));
                    ws.close();
                    return;
                }
                context.currentRoomId = room.id;
                context.currentUserName = message.user_name;
                ws.send(JSON.stringify({ kind: 'room_joined', room_id: room.id, room_description: "Description not managed", users: Array.from(room.members.keys()) }));
                break;
            }
            case 'send_message': {
                const { currentRoomId, currentUserName } = context;
                if (!currentRoomId || !currentUserName) {
                    ws.send(JSON.stringify({ kind: 'error', message: 'Not in a room' }));
                    return;
                }
                const room = getRoom(currentRoomId);
                if (!room) return;
                let intercepted = false;
                room.bots.forEach(bot => {
                    if (bot.notifyReceivedMessage(currentUserName, message.content)) {
                        intercepted = true;
                    }
                });
                if (!intercepted) {
                    room.members.forEach((member, userName) => {
                        member.ws.send(JSON.stringify({ kind: 'message_received', content: message.content, sender: currentUserName }));
                    });
                }
                break;
            }
            case 'disconnect': {
                const { currentRoomId, currentUserName } = context;
                if (currentRoomId && currentUserName) {
                    removeMember(currentRoomId, currentUserName);
                }
                ws.close();
                break;
            }
            case 'close_room': {
                const { currentRoomId, currentUserName } = context;
                if (currentRoomId && currentUserName) {
                    if (!closeRoom(currentRoomId, currentUserName)) {
                        ws.send(JSON.stringify({ kind: 'error', message: 'Only the creator can close the room' }));
                    }
                }
                break;
            }
            default: {
                ws.send(JSON.stringify({ kind: 'error', message: 'Invalid message kind' }));
                ws.close();
            }
        }
    } catch (e) {
        ws.send(JSON.stringify({ kind: 'error', message: 'Invalid message format' }));
    }
}
