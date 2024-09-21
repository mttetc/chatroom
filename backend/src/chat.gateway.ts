import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private messages: string[] = [];

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('message', 'Welcome to the chat!');
    this.sendMessageHistory(client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    this.messages.push(payload);
    this.server.emit('message', payload);
  }

  private sendMessageHistory(client: Socket) {
    this.messages.forEach((message) => {
      client.emit('message', message);
    });
  }
}