import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from 'src/passwordEncryption/bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private _jwtService: JwtService,
    private _userService: UserService,
  ) {}

  async login(user: any) {
    console.log('service user', user);
    if (!user.name || !user.password) {
      throw new UnauthorizedException();
    }
    const userDB = await this._userService.findOneByName(user.name);
    console.log('userDb', userDB);
    if (userDB) {
      const pass = comparePasswords(user.password, userDB.password);
      if (pass) {
        const payload = { username: user.name, sub: user.password };
        console.log('auth service payload:', payload);
        return {
          access_token: this._jwtService.sign(payload),
        };
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
