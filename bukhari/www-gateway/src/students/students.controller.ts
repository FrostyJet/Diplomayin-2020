import { Body, Controller, Get, Post, Query, Render, Req, Res } from '@nestjs/common';
import { StudentsService } from './students.service';
import * as querystring from 'querystring';
import { TeachersService } from '../teachers/teachers.service';

@Controller('dashboard/students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
  ) {
  }

  @Get('/')
  @Render('dashboard/students/index')
  async renderList(@Req() req, @Query() query) {
    const { page = 1 } = query;
    const filters = {};
    const msg = req.session.msg;
    req.session.msg = null;

    if (query.search) filters['search'] = query.search;

    const rows = await this.studentsService.findAll({ page, filters: { ...filters } });

    filters['queryString'] = querystring.stringify(filters);

    return {
      pageId: 'students/index',
      rows: rows, msg,
      page,
      pageLimit: 10,
      filters,
    };
  }

  @Get('create')
  @Render('dashboard/students/create-edit')
  async renderCreate(@Req() req) {
    const teachers = await this.teachersService.findAll({ limit: 100 });
    const msg = req.session.msg;
    req.session.msg = null;

    return {
      pageId: 'students/create', teachers: teachers.list,
      errors: null,
      created: false, msg,
      data: {
        name: null,
      },
    };
  }

  @Get(':id')
  @Render('dashboard/students/create-edit')
  async renderUpdate(@Body() body, @Req() req) {
    const data = await this.studentsService.findById(req.params.id);
    const teachers = await this.teachersService.findAll({ limit: 100 });
    const msg = req.session.msg;
    req.session.msg = null;

    return {
      msg, data,
      pageId: 'students/edit', teachers: teachers.list,
    };
  }

  @Post('create')
  async create(@Req() req, @Body() body, @Res() res) {
    const data = {
      type: body.type || 'regular',
      name: {},
    };
    const errors = [];
    const teachers = await this.teachersService.findAll({ limit: 100 });

    if (body.firstname || body.lastname) {
      data.name = {
        first: body.firstname,
        last: body.lastname,
      };
    }

    if (body.avatar) data['avatar'] = body.avatar;
    else errors.push('Նկարը պարտադիր է');

    if (body.address) data['address'] = body.address;
    if (body.teacherId) data['teacherId'] = body.teacherId;

    if (!errors.length) {
      const result = await this.studentsService.create(data);
      req.session.msg = {
        type: 'success',
        text: 'Հաշիվը հաջողությամբ ստեղծված է',
      };

      return res.redirect('/dashboard/students/' + result.id);
    } else {
      req.session.msg = {
        type: 'error',
        text: errors.join('<br>'),
      };

      return res.redirect('/dashboard/students/create');
    }
  }

  @Post(':id')
  async handleUpdate(@Body() body, @Req() req, @Res() res) {
    const { id } = req.params;
    const data = await this.studentsService.findById(id);

    const errors = [];

    if (body.firstname || body.lastname) {
      data.name = {
        first: body.firstname,
        last: body.lastname,
      };
    }

    if (body.email) data['email'] = body.email;
    if (body.address) data['address'] = body.address;
    if (body.avatar) data['avatar'] = body.avatar;
    if (body.teacherId) data['teacherId'] = body.teacherId;

    if (!errors.length) {
      await this.studentsService.update(id, data);

      req.session.msg = {
        type: 'success',
        text: 'Հաշիվը հաջողությամբ թարմացված է',
      };
    } else {
      req.session.msg = {
        type: 'error',
        text: errors.join('<br>'),
      };
    }

    return res.redirect('/dashboard/students/' + id);
  }

  @Get('delete/:id')
  async handleDelete(@Req() req, @Res() res) {
    const { id } = req.params;

    await this.studentsService.deleteById(id);

    req.session.msg = {
      type: 'success',
      text: 'Հաշիվը հաջողությամբ հեռացված է',
    };

    return res.redirect('/dashboard/students');
  }
}
