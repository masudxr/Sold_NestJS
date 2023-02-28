import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = { username: user.name, sub: user.password };
    console.log('auth service payload:', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
