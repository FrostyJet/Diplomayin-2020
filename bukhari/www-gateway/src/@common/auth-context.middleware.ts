import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TeachersService } from '../teachers/teachers.service';
import { ENUM_PROFESSIONS } from '../teachers/schemas/teacher.schema';

@Injectable()
export class AuthContextMiddleware implements NestMiddleware {
  constructor(private teachersService: TeachersService) {
  }

  async use(req: any, res: any, next: () => void) {
    const token = req.cookies['auth-token'] || null;

    let decoded = null;
    let teacher = null;
    try {
      decoded = jwt.verify(token, 'hiddenString');
      decoded.teacher = teacher = await this.teachersService.getById(decoded.teacher.id);
    } catch (err) {
      // err
    }

    res.locals = {
      auth: teacher,
      spec: ENUM_PROFESSIONS,
    };

    req.auth = decoded;
    next();
  }
}