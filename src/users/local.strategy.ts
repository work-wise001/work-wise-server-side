import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', 
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
      const user = await this.authService.validateUser(email.toLowerCase(), password);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;

    // //   const token = await this.authService.createToken(user);
    // //   res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    // //   res.status(HttpStatus.OK).json({
    // //     status: 'success',
    // //     user,
    // //     token,
    // //   });

    // const user = await this.authService.validateUser(email, password);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
  }
}
