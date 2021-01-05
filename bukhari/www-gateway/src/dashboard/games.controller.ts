import { Controller, Get, Render, Req, Res } from '@nestjs/common';

@Controller('dashboard/games')
export class GamesController {

  @Get('/')
  @Render('dashboard/games/index')
  renderGames() {
    return {
      pageId: 'games/',
    };
  }

  @Get('/:id')
  renderSingleGame(@Res() res, @Req() req) {
    const { id } = req.params;

    return res.render('dashboard/games/' + id);
  }
}
