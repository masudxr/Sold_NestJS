import {
  HttpException,
  HttpStatus,
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

  async reqUser(req: any) {
    const bearer = req.header('authorization');
    bearer.replace('Bearer ', '');
    const parts = bearer.split(' ');
    if (parts.length === 2) {
      const token = parts[1];
      try {
        const ver = await this._jwtService.verifyAsync(token, {
          secret: 'SECRET',
        });
        console.log('req ver', ver);

        const user = await this._userService.findOne(ver.name);
        console.log('req User', user);
        if (user.name == ver.username) {
          return user;
        }
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: error.message,
          },
          HttpStatus.FORBIDDEN,
          {
            cause: error,
          },
        );
      }
    }
    return false;
  }
}
