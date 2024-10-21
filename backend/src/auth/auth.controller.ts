import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './types';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('anonymous')
  async loginAnonymous() {
    return this.authService.login({} as LoginDto, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  async testAuth() {
    return { message: 'You are authenticated!' };
  }
}
