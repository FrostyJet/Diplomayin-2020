import { Body, Controller, Get, Post, Query, Render, Req, Res } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import * as querystring from 'querystring';
import { ENUM_ACC_TYPE, ENUM_PROFESSIONS, Teacher } from './schemas/teacher.schema';

const PREFIX = 'dashboard/teachers';

@Controller('')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {
  }

  @Get(PREFIX + '/create')
  @Render('dashboard/teachers/create-edit')
  async renderCreate(@Req() req) {
    const msg = req.session.msg;
    req.session.msg = null;

    return {
      msg,
      pageId: 'teachers/create',
      errors: null,
      created: false,
      data: {
        name: null,
      },
    };
  }

  @Get(PREFIX + '/:id')
  @Render('dashboard/teachers/create-edit')
  async renderUpdate(@Body() body, @Req() req) {
    const msg = req.session.msg;
    req.session.msg = null;

    const data = await this.teachersService.findById(req.params.id);

    return {
      pageId: 'teachers/edit', msg,
      data, updated: false, errors: null, professions: ENUM_PROFESSIONS, accTypes: ENUM_ACC_TYPE
    };
  }

  @Post(PREFIX + '/create')
  async create(@Body() body, @Req() req, @Res() res) {
    const data = {
      type: body.type || 'regular',
      name: {},
    };
    const errors = [];

    const duplicate = await this.teachersService.findByEmail(body.email);
    if (duplicate) errors.push('Տվյալ էլ հասցնել արդեն գրանցված է');

    if (body.firstname || body.lastname) {
      data.name = {
        first: body.firstname,
        last: body.lastname,
      };
    }

    if (body.email) data['email'] = body.email;
    if (body.address) data['address'] = body.address;
    if (body.avatar) data['avatar'] = body.avatar;
    if (body.password) data['password'] = body.password;
    if (body.spec) data['spec'] = body.spec;

    if (!errors.length) {
      const result = await this.teachersService.create(data);
      req.session.msg = {
        type: 'success',
        text: 'Հաշիվը հաջողությամբ ստեղծված է',
      };

      return res.redirect('/dashboard/teachers/' + result.id);
    } else {
      req.session.msg = {
        type: 'error',
        text: errors.join('<br>'),
      };

      return res.redirect('/dashboard/teachers/create');
    }
  }

  @Post(PREFIX + '/:id')
  async handleUpdate(@Body() body, @Req() req, @Res() res) {
    const { id } = req.params;
    const data = await this.teachersService.findById(id);

    const errors = [];

    const duplicate = await this.teachersService.findByEmail(body.email);
    if (duplicate && duplicate.id != id) errors.push('Տվյալ էլ հասցնել արդեն գրանցված է');

    if (body.firstname || body.lastname) {
      data.name = {
        first: body.firstname,
        last: body.lastname,
      };
    }

    if (body.email) data['email'] = body.email;
    if (body.address) data['address'] = body.address;
    if (body.avatar) data['avatar'] = body.avatar;
    if (body.type) data['type'] = body.type;
    if (body.spec) data['spec'] = body.spec;
    if (body.password) {
      data['password'] = await Teacher.encryptPassword(body.password);
    }

    if (!errors.length) {
      await this.teachersService.update(id, data);

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

    return res.redirect('/dashboard/teachers/' + id);
  }

  @Post('/teachers/login')
  async handleLogin(@Body() body) {
    return this.teachersService.login(body);
  }

  @Get(PREFIX + '/delete/:id')
  async handleDelete(@Req() req, @Res() res) {
    const { id } = req.params;

    await this.teachersService.deleteById(id);

    req.session.msg = {
      type: 'success',
      text: 'Հաշիվը հաջողությամբ հեռացված է',
    };

    return res.redirect('/dashboard/teachers');
  }

  @Get(PREFIX)
  @Render(PREFIX + '/index')
  async renderList(@Query() query, @Req() req) {
    const { page = 1 } = query;
    const filters = {};
    const msg = req.session.msg;
    req.session.msg = null;

    if (query.search) filters['search'] = query.search;

    const rows = await this.teachersService.findAll({ page, filters: { ...filters }, sort: { _id: -1 } });

    filters['queryString'] = querystring.stringify(filters);

    return {
      msg,
      pageId: 'teachers/index',
      rows: rows,
      page,
      pageLimit: 10,
      filters,
    };
  }
}
