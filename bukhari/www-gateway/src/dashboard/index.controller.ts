import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { TeachersService } from '../teachers/teachers.service';
import { StudentsService } from '../students/students.service';
import { RequestsService } from '../requests/requests.service';
import * as https from 'https';
import * as fs from 'fs';

@Controller('dashboard')
export class IndexController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
    private readonly requestsService: RequestsService,
  ) {
  }

  @Get('/generate-teacher')
  async generateTeacher() {
    const response: string = await this.fetchRandomUser();
    const data = JSON.parse(response);

    const user = {
      name: {
        first: data.results[0].name.first,
        last: data.results[0].name.last,
      },
      password: '123456',
      email: data.results[0].email,
      type: Math.random() > 0.5 ? 'admin' : 'regular',
      avatar: '/teachers/' + Date.now() + '.jpg',
      address: data.results[0].location.country + ', ' + data.results[0].location.city + ' (' + data.results[0].location.state + ')',
    };

    await new Promise(res => {
      const filePath = __dirname + '/../../public/media' + user.avatar;
      fs.closeSync(fs.openSync(filePath, 'w'));

      const file = fs.createWriteStream(filePath);

      const request = https.get(data.results[0].picture.large, function(response) {
        response.pipe(file);
        res();
      });
    });

    const created = await this.teachersService.create(user);

    return created;
  }

  @Get('/generate-student')
  async generateStudent() {
    const response: string = await this.fetchRandomUser();
    const data = JSON.parse(response);

    const teacherId = '5ff9b862022a0b0398015d13';

    const user = {
      name: {
        first: data.results[0].name.first,
        last: data.results[0].name.last,
      },
      password: '123456',
      avatar: '/students/' + Date.now() + '.jpg',
      address: data.results[0].location.country + ', ' + data.results[0].location.city + ' (' + data.results[0].location.state + ')',
      teacherId: teacherId,
    };

    await new Promise(res => {
      const filePath = __dirname + '/../../public/media' + user.avatar;
      fs.closeSync(fs.openSync(filePath, 'w'));

      const file = fs.createWriteStream(filePath);

      const request = https.get(data.results[0].picture.large, function(response) {
        response.pipe(file);
        res();
      });
    });

    const created = await this.studentsService.create(user);

    return created;
  }

  @Post('/get-auth')
  async getAuthInfo(@Req() req) {
    const id = req.auth.teacher.id;
    const teacher = await this.teachersService.getById(id);

    return teacher;
  }

  @Get('/')
  @Render('dashboard/index')
  async renderDashboard(@Req() req, @Res() res) {
    if(req.auth.teacher.type == 'spec') {
      return res.redirect('/dashboard/requests/spec');
    }

    const tasks = [];
    /* Cards */
    tasks.push(this.studentsService.getTotalCount());
    tasks.push(this.studentsService.getTotalCount({ teacherId: req.auth.teacher.id }));
    tasks.push(this.teachersService.getTotalCount());

    /* Pie Chart */
    tasks.push(this.requestsService.getTotalCount({ teacherId: req.auth.teacher.id }));
    tasks.push(this.requestsService.getTotalCount({ isOpen: false }));
    tasks.push(this.requestsService.getTotalCount({}));

    /* Line Chart */
    tasks.push(this.requestsService.getYearlyStats({ isOpen: false }));
    tasks.push(this.requestsService.getYearlyStats({ isOpen: true }));

    const [
      studentsCount, assignedStudentsCount, teachersCount,
      assignedRequestsCount, resolvedRequestsCount, totalRequestsCount,
      yearlyStatsResolved, yearlyStatsOpen,
    ] = await Promise.all(tasks);

    console.log(yearlyStatsResolved);

    return {
      pageId: 'dashboard/',
      yearlyStatsResolved, yearlyStatsOpen,
      counts: {
        studentsCount,
        totalRequestsCount,
        teachersCount,
        assignedStudentsCount,
        assignedRequestsCount,
        resolvedRequestsCount,
      },
    };
  }

  private fetchRandomUser(): Promise<string> {
    return new Promise((res) => {
      https.get('https://randomuser.me/api', (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          res(data);
        });

      }).on('error', (err) => {
        console.log('Error: ' + err.message);
      });
    });
  }
}
