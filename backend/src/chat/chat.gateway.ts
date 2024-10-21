import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message, User } from './types';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private messages: Message[] = [];

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const user = await this.authenticateUser(client);
      client.data.user = user;
      client.emit('setName', user.name);
      this.broadcastUserList();
      const welcomeMessage: Message = {
        id: Date.now(),
        user: null,
        text: `Welcome to the chat, ${user.name}!`,
      };
      this.server.emit('message', welcomeMessage);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.user && client.data.user.isAnonymous) {
      this.usersService.removeAnonymousUser(client.data.user.id);
    }
    this.broadcastUserList();
  }

  private async authenticateUser(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
      const user = await this.usersService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private broadcastUserList() {
    const users = this.usersService.getAllUsers();
    this.server.emit('userUpdate', users);
  }

  @SubscribeMessage('getMessages')
  handleGetMessages(client: Socket, callback: (messages: Message[]) => void) {
    console.log('Fetching messages');
    callback(this.messages);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    const user = client.data.user;
    const message: Message = {
      id: Date.now(),
      text: payload,
      user: {
        id: user.id,
        name: user.name,
      },
    };
    this.messages.push(message);
    console.log('New message:', message);
    this.server.emit('message', message);
  }

  @SubscribeMessage('getUsers')
  handleGetUsers(
    client: Socket,
    callback: (users: Omit<User, 'password'>[]) => void
  ) {
    callback(this.usersService.getAllUsers());
  }
}
