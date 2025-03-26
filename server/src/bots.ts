export abstract class Bot {
    constructor(public name: string, protected sendMessage: (content: string, destination: string | null) => void) {}
    abstract notifyMemberJoin(name: string): void;
    abstract notifyMemberLeave(name: string): void;
    abstract notifyReceivedMessage(sender: string, content: string): boolean;
}

export class UpperCaseBot extends Bot {
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

export class JoinLeaveBot extends Bot {
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

export const BOTS = [UpperCaseBot, JoinLeaveBot];