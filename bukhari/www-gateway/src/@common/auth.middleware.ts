import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  async use(req: any, res: any, next: () => void) {
    if (!req.auth) {
      return res.redirect('/login');
    }

    next();
  }
}