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
      isAnonymous: false,
    };
  }

  async login(
    loginDto: LoginDto,
    isAnonymous: boolean = false
  ): Promise<{ access_token: string; user: AuthenticatedUser }> {
    let user;

    if (isAnonymous) {
      user = this.usersService.createAnonymous();
    } else {
      const { name, password } = loginDto;
      user = await this.usersService.findOne(name);

      if (!user || !(await bcrypt.compare(password, user.password!))) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      isAnonymous: isAnonymous,
    };

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      name: user.name,
      isAnonymous: isAnonymous,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }),
      user: authenticatedUser,
    };
  }

  async validateUser(payload: JwtPayload): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findById(payload.id);
    if (user) {
      return {
        id: user.id,
        name: user.name,
        isAnonymous: payload.isAnonymous,
      };
    }
    return null;
  }
}
