import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { userSchema } from "./users.model";
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from "./jwt.strategy";
import { MailService } from '../utils/mail.service';
import { GenerateOTP } from "../utils/generate.otp"; 
import { FileService } from "../file/files.service";
import { FileModule } from "../file/files.module"

@Module({
    imports: [JwtModule.registerAsync({       
      imports: [ConfigModule, FileModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      }),
      MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
      PassportModule,
      //PassportModule.register({ defaultStrategy: 'google' })
    ],
    controllers: [AuthController],
    providers: [AuthService, 
      FileService,
      MailService,
      GenerateOTP,
      GoogleStrategy, 
      LocalStrategy,
      JwtStrategy
    ],
})

export class authModule {}