import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Users } from '../users/schema/user.schema';

export class LoginDto {
  identifier: string; // email or phone
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.identifier, body.password);
  }

  @Post('register')
  register(@Body() user: Users) {
    return this.authService.register(user);
  }
}
