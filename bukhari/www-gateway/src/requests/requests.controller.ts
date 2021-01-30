import { Body, Controller, Get, Post, Query, Render, Req, Res } from '@nestjs/common';
import { RequestsService } from './requests.service';
import * as querystring from 'querystring';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';
import { ENUM_PROFESSIONS } from '../teachers/schemas/teacher.schema';

const PREFIX = 'dashboard/requests';

@Controller()
export class RequestsController {
  public professions = ENUM_PROFESSIONS;

  constructor(
    private readonly requestsService: RequestsService,
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
  ) {
  }

  @Get(PREFIX + '/create')
  @Render('dashboard/requests/create-edit')
  async renderCreate(@Req() req, @Query() query) {
    const { studentId } = query;
    let student = null;
    let students = null;

    if (studentId) {
      student = await this.studentsService.findById(studentId);
    }

    if (!student) {
      if (req.auth.teacher.type == 'regular') {
        students = await this.studentsService.findByTeacherId(req.auth.teacher.id);
      } else {
        students = await this.studentsService.findAll({ page: 1, limit: 200, sort: { name: 1 } });
        students = students.list;
      }
    }

    const msg = req.session.msg;
    req.session.msg = null;

    return {
      pageId: 'requests/index',
      studentId, students, student, preselectedStudentId: studentId,
      msg, professions: this.professions,
    };
  }

  @Get(PREFIX + '/apply')
  async applyToRequest(@Req() req, @Res() res, @Query() query) {
    const { specId, postId } = query;

    await this.requestsService.apply({ specId, postId });

    req.session.msg = {
      type: 'success',
      text: 'Հայտը ավելացվելց Ձեր ընթացիկ հայտերի բաժնում։',
    };

    return res.redirect('back');
  }

  @Post(PREFIX + '/close')
  async closeToRequest(@Req() req, @Res() res, @Body() query) {
    const { postId, specResult } = query;

    await this.requestsService.close({ specResult, postId });

    req.session.msg = {
      type: 'success',
      text: 'Հայտը հաջողությամբ փակված է',
    };

    return res.redirect('back');
  }

  @Get(PREFIX + '/spec')
  @Render('dashboard/requests/index-spec')
  async renderSpecList(@Req() req, @Query() query) {
    const { page = 1 } = query;
    const filters = { professionId: req.auth.teacher.spec, specId: null };
    const msg = req.session.msg;
    req.session.msg = null;

    if (query.search) filters['search'] = query.search;

    const rows = await this.requestsService.findAll({ page, filters: { ...filters }, sort: { 'isOpen': -1 } });

    filters['queryString'] = querystring.stringify(filters);

    return {
      pageId: 'requests/spec',
      rows: rows, msg,
      page, professions: this.professions,
      pageLimit: 10,
      filters,
    };
  }

  @Get(PREFIX + '/assigned')
  @Render('dashboard/requests/index-assigned')
  async renderAssignedList(@Req() req, @Query() query) {
    const { page = 1 } = query;
    const filters = { specId: req.auth.teacher.id };
    const msg = req.session.msg;
    req.session.msg = null;

    if (query.search) filters['search'] = query.search;

    const rows = await this.requestsService.findAll({ page, filters: { ...filters }, sort: { 'isOpen': -1 } });

    filters['queryString'] = querystring.stringify(filters);

    return {
      pageId: 'requests/assigned',
      rows: rows, msg,
      page, professions: this.professions,
      pageLimit: 10,
      filters,
    };
  }

  @Get(PREFIX + '/:id')
  @Render('dashboard/requests/post')
  async renderSingle(@Req() req, @Query() query) {
    const { id } = req.params;
    const msg = req.session.msg;
    req.session.msg = null;

    const request = await this.requestsService.findById(id);

    return {
      pageId: 'requests/index',
      msg, data: request, professions: this.professions,
    };
  }

  @Post(PREFIX + '/create')
  async handleCreate(@Req() req, @Res() res, @Body() body) {
    const student = await this.studentsService.findById(body.studentId);

    const data = {
      studentId: body.studentId,
      description: body.description,
      teacherId: student.teacherId,
      professionId: body.professionId,
    };

    const story = await this.requestsService.create(data);

    req.session.msg = {
      type: 'success',
      text: 'Հրապարակումը հաջողությամբ իրականացված է',
    };

    return res.redirect('/dashboard/requests/' + story.id);
  }

  @Post(PREFIX + '/edit/:id')
  async handleEdit(@Req() req, @Res() res, @Body() body) {
    const { id } = req.params;
    const data = {
      isOpen: Boolean(body.isOpen == 1),
    };

    await this.requestsService.update(id, data);

    req.session.msg = {
      type: 'success',
      text: 'Թվյալները թարմացված են',
    };

    return res.redirect('/dashboard/requests/' + id);
  }

  @Get(PREFIX + '/delete/:id')
  async deleteRequest(@Req() req, @Res() res) {
    const { id } = req.params;

    await this.requestsService.deleteById(id);

    req.session.msg = {
      type: 'success',
      text: 'Հայտը հաջողությամբ հեռացվել է',
    };

    return res.redirect('/dashboard/requests/');
  }

  @Get(PREFIX + '/')
  @Render('dashboard/requests/index')
  async renderList(@Req() req, @Query() query) {
    const { page = 1 } = query;
    const filters = { teacherId: req.auth.teacher.id };
    const msg = req.session.msg;
    req.session.msg = null;

    if (query.search) filters['search'] = query.search;

    const rows = await this.requestsService.findAll({ page, filters: { ...filters }, sort: { 'isOpen': -1 } });

    filters['queryString'] = querystring.stringify(filters);

    return {
      pageId: 'requests/index',
      rows: rows, msg,
      page, professions: this.professions,
      pageLimit: 10,
      filters,
    };
  }
}
