import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { Users } from '../users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(identifier: string, password: string) {
    const user = await this.userService.login(identifier, password);

    const payload = {
      sub: user._id,
      email: user.email,
      name: user.name,
      employeeId: user.employeeId,
    };

    const token = this.jwtService.sign(payload);

    return {
      data: {
        user,
        token,
      },
    };
  }

  async register(user: Users) {
    return this.userService.create(user);
  }
}
