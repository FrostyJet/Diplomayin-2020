import { Body, Controller, Get, Patch, Render, Req, Res } from '@nestjs/common';
import { TeachersService } from '../teachers/teachers.service';

@Controller('dashboard/settings')
export class SettingsController {
  constructor(
    private readonly teachersService: TeachersService,
  ) {
  }

  @Get('/')
  @Render('dashboard/settings/index')
  async renderSettings(@Req() req, @Res() res) {
    return res.redirect('/dashboard/teachers/' + req.auth.teacher.id);

    const teacher = await this.teachersService.getById(req.auth.teacher.id);
    return { teacher, pageId: 'settings/' };
  }

  @Patch('/')
  async updateSettings(@Req() req, @Body() body) {
    const { auth } = req;

    const patch = {
      ...body,
    };

    if (body.firstname || body.lastname) {
      patch.name = {
        first: body.firstname,
        last: body.lastname,
      };
    }

    const result = await this.teachersService.update(auth.teacher.id, patch);

    return {
      success: result.ok,
    };
  }
}
