import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthContextMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const token = req.cookies['auth-token'] || null;

    let decoded = null;
    try {
      decoded = jwt.verify(token, 'hiddenString');
    } catch (err) {
      // err
    }

    req.auth = decoded;
    next();
  }
}