import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { Message, User } from './types';

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
    console.log('New client connected', client.id);
    try {
      const user = await this.authenticateUser(client);
      client.data.user = user;
      console.log('User authenticated:', user.name);
      this.broadcastUserList();
    } catch (error) {
      console.error('Authentication error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    if (client.data.user) {
      this.usersService.removeUser(client.data.user.id);
      this.broadcastUserList();
    }
  }

  @SubscribeMessage('getMessages')
  handleGetMessages(): Message[] {
    console.log('Getting messages:', this.messages);
    return this.messages;
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, text: string): void {
    const user = client.data.user;
    const message: Message = this.createMessage(user, text);
    this.messages.push(message);
    this.server.emit('message', this.messages);
  }

  @SubscribeMessage('getUsers')
  getUsers(): User[] {
    return this.usersService.getAllUsers();
  }

  private async authenticateUser(client: Socket): Promise<User> {
    const { token, user: anonymousUser } = client.handshake.auth;

    if (!token && !anonymousUser) {
      throw new UnauthorizedException('No authentication provided');
    }

    if (anonymousUser) {
      console.log('Authenticating anonymous user');
      return this.usersService.createAnonymous();
    }

    try {
      console.log('Verifying token');
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
      console.log('Token payload:', payload);
      const user = await this.usersService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private createMessage(user: User, text: string): Message {
    return {
      id: Date.now(),
      text,
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }

  private broadcastUserList(): void {
    const users = this.usersService.getAllUsers();
    this.server.emit('userUpdate', users);
  }
}
