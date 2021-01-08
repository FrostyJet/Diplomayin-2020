import { Controller, Get, Render } from '@nestjs/common';

@Controller('login')
export class IndexController {

  @Get('/')
  @Render('login/index')
  getHello() {
    return {
      pageId: 'login/'
    };
  }
}
