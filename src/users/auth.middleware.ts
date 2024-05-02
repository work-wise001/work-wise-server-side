import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new UnauthorizedException("Authentication invalid 01");
    }
    const token = authHeader.split(' ')[1];

    try {
      const payload: any = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });

      (req as any)= {
        userId: payload.user.userId,
        firstName: payload.user.firstName,
        email: payload.user.email,
      };
      next();
      
    //   req['user'] = {
    //     userId: payload.user._id,
    //     firstName: payload.user.fullName,
    //     email: payload.user.email,
    //   };
      next();
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
