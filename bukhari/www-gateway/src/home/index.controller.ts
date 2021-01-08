import { Controller, Get, Render } from '@nestjs/common';

@Controller('/')
export class IndexController {

  @Get('/')
  @Render('home/index')
  getHello() {
    return {
      pageId: 'index/'
    };
  }
}
