import { UserService } from './../user.service';
// import { JWT_SECRET } from './../../config';
import { IExpressRequest } from './../../types/express-request.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = undefined;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const jwtSecret = this.configService.get<string>(
      'JWT_SECRET',
      'JWT_SECRET',
    );

    try {
      const decode = verify(token, jwtSecret) as JwtPayload;
      const user = await this.userService.findById(decode.id);
      if (user) req.user = user;
      else req.user = undefined;
      next();
    } catch (error) {
      console.error('Token validation error:', error);
      req.user = undefined;
      next();
    }
  }
}
