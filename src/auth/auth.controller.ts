import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthGuardAdmin } from 'src/guard/auth.admin.guard';
import { UserGuard } from 'src/guard/auth.user.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() req) {
    console.log('REQ:', req);
    const admin = await this.authService.login(req);
    console.log('user:', admin);
    return admin;
  }

  @UseGuards(AuthGuardAdmin)
  @Get('profile')
  getHello(@Request() req) {
    return req.user;
  }

  @Post('user/login')
  async loginUser(@Body() req) {
    console.log('REQ:', req);
    const user = await this.authService.login(req);
    console.log('user:', user);
    return user;
  }

  @UseGuards(UserGuard)
  @Get('user/profile')
  helloUser(@Request() req) {
    return req.user;
  }
}
