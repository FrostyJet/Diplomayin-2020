import { Controller, Get, Render } from '@nestjs/common';

@Controller('dashboard')
export class IndexController {

  @Get('/')
  @Render('dashboard/index')
  renderDashboard() {
    return {
      pageId: 'dashboard/'
    };
  }
}
