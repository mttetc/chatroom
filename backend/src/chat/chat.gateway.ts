import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message, User } from './types';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private messages: Message[] = [];
  private users: User[] = [];

  handleConnection(client: Socket) {
    const user: User = { id: client.id, name: `User${this.users.length + 1}` };
    this.users.push(user);
    this.server.emit('userUpdate', this.users);
    const welcomeMessage: Message = { id: Date.now(), user: 'System', text: 'Welcome to the chat!' };
    client.emit('message', welcomeMessage);
  }

  handleDisconnect(client: Socket) {
    this.users = this.users.filter(user => user.id !== client.id);
    this.server.emit('userUpdate', this.users);
  }

  @SubscribeMessage('getMessages')
  handleGetMessages(client: Socket, callback: (messages: Message[]) => void) {
    callback(this.messages);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: Omit<Message, 'id'>): void {
    const message: Message = { id: Date.now(), ...payload };
    this.messages.push(message);
    this.server.emit('message', message);
  }

  @SubscribeMessage('getUsers')
  handleGetUsers(client: Socket, callback: (users: User[]) => void) {
    callback(this.users);
  }
}