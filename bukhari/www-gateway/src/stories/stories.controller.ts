import { Body, Controller, Get, Post, Query, Render, Req, Res } from '@nestjs/common';
import { StoriesService } from './stories.service';
import * as querystring from 'querystring';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';

@Controller('dashboard/stories')
export class StoriesController {
  constructor(
    private readonly storiesService: StoriesService,
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
  ) {
  }

  @Get('/create')
  @Render('dashboard/stories/create-edit')
  async renderCreate(@Req() req, @Query() query) {
    const { studentId } = query;

    const students = await this.studentsService.findByTeacherId(req.auth.teacher.id);

    const msg = req.session.msg;
    req.session.msg = null;

    return {
      pageId: 'stories/index',
      studentId, students, preselectedStudentId: studentId,
      msg,
    };
  }

  @Get(':id')
  @Render('dashboard/stories/post')
  async renderSingle(@Req() req, @Query() query) {
    const { id } = req.params;
    const msg = req.session.msg;
    req.session.msg = null;

    const story = await this.storiesService.findById(id);

    let comments: any = story.comments;
    const teacherIds = story.comments.reduce((arr, comment) => {
      if (!arr.includes(comment['teacherId'])) arr.push(comment['teacherId']);
      return arr;
    }, []);

    const teachers = await this.teachersService.findByTeacherIds(teacherIds);
    const teachersHash = {};
    teachers.forEach(teacher => {
      teachersHash[teacher.id] = teacher;
    });

    comments = comments.map(comment => {
      comment.teacher = teachersHash[comment.teacherId];
      return comment;
    });

    return {
      pageId: 'stories/index',
      msg, data: story, comments, auth: req.auth,
    };
  }

  @Post('/create')
  async handleCreate(@Req() req, @Res() res, @Body() body) {
    const data = {
      studentId: body.studentId,
      subject: body.subject,
      content: body.content,
      replies: [],
      teacherId: req.auth.teacher.id,
      isOpen: true,
    };

    const story = await this.storiesService.create(data);

    req.session.msg = {
      type: 'success',
      text: 'Հրապարակումը հաջողությամբ իրականացված է',
    };

    return res.redirect('/dashboard/stories/' + story.id);
  }

  @Post('/add-comment')
  async handleAddComment(@Req() req, @Res() res, @Body() body) {
    const { storyId } = body;
    const comment = {
      comment: body.comment,
      teacherId: req.auth.teacher.id,
    };

    const story = await this.storiesService.addComment(storyId, comment);

    req.session.msg = {
      type: 'success',
      text: 'Մեկնաբանությունը ավելացվել է',
    };

    return res.redirect('/dashboard/stories/' + storyId);
  }

  @Post('/edit/:id')
  async handleEdit(@Req() req, @Res() res, @Body() body) {
    const { id } = req.params;
    const data = {
      isOpen: Boolean(body.isOpen == 1),
    };

    const story = await this.storiesService.update(id, data);

    req.session.msg = {
      type: 'success',
      text: 'Թվյալները թարմացված են',
    };

    return res.redirect('/dashboard/stories/' + id);
  }

  @Get('/')
  @Render('dashboard/stories/index')
  async renderList(@Req() req, @Query() query) {
    const { page = 1 } = query;
    const filters = {};
    const msg = req.session.msg;
    req.session.msg = null;

    if (query.search) filters['search'] = query.search;

    const rows = await this.storiesService.findAll({ page, filters: { ...filters }, sort: {  'isOpen': -1, dateCreated: -1,} });

    filters['queryString'] = querystring.stringify(filters);

    return {
      pageId: 'stories/index',
      rows: rows, msg,
      page,
      pageLimit: 10,
      filters,
    };
  }
}
