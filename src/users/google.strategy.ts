import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // please replace with your actual client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // please replace with your actual client secret
      callbackURL: 'http://localhost:3000/users/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    //const { name, emails, photos } = profile
    const user = await this.authService.findOrCreateUser({
      userId: profile.id,
      email: profile.emails[0].value,
      fullName: profile.displayName,
      verified: true,
      authStrategy: "google"
    })


    done(null, user);
  }
}
