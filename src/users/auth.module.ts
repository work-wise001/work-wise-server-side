import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { userSchema } from "./users.model";
//import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [JwtModule.registerAsync({       
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      }),MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
    controllers: [AuthController],
    providers: [AuthService],
})

export class authModule {}