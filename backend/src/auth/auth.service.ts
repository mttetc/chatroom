import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto, JwtPayload, AuthenticatedUser } from './types';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthenticatedUser> {
    const { name, password } = registerDto;
    const existingUser = await this.usersService.findOne(name);
    if (existingUser) {
      throw new UnauthorizedException('Name already exists');
    }

    const user = await this.usersService.create(name, password);
    return {
      id: user.id,
      name: user.name,
    };
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ access_token: string; user: AuthenticatedUser }> {
    const { name, password } = loginDto;
    const user = await this.usersService.findOne(name);

    if (!user || !(await bcrypt.compare(password, user.password!))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
    };

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }),
      user: authenticatedUser,
    };
  }

  async loginAnonymous(
    existingId?: string
  ): Promise<{ access_token: string; user: AuthenticatedUser }> {
    let anonymousUser = existingId
      ? await this.usersService.findById(existingId)
      : null;

    if (!anonymousUser || !anonymousUser.name.startsWith('Anonymous-')) {
      anonymousUser = this.usersService.createAnonymous();
    }

    const payload: JwtPayload = {
      id: anonymousUser.id,
      name: anonymousUser.name,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }),
      user: anonymousUser,
    };
  }

  async validateUser(payload: JwtPayload): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findById(payload.id);
    if (user) {
      return {
        id: user.id,
        name: user.name,
      };
    }
    return null;
  }

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
