import { Body, Controller, Get, Post, Query, Render, Req, Res } from '@nestjs/common';
import { RequestsService } from '../requests/requests.service';
import * as querystring from 'querystring';

@Controller('/requests')
export class RequestsController {
  public professions = {
    'psychologist': 'Հոգեբան',
    'sl_therpahist': 'Լոգոպեդ',
    'psychoanalyst': 'Հոգեվերլուծաբան',
    'art_therapist': 'Արտ թերապեվտ',
    'addiction_counselor': 'կախվածության խորհրդատու',
    'sport_counselor': 'Կինեզոթերապեվտ / Ֆիզ․ կուլտ․ մասնագետ',
    'other': 'այլ',
  };

  constructor(
    private readonly requestsService: RequestsService,
  ) {
  }

  @Get('/')
  @Render('home/requests')
  async renderRequests(@Req() req, @Res() res, @Query() query) {
    const { page = 1 } = query;
    const filters = {};
    const msg = req.session.msg;
    req.session.msg = null;

    if (query.search) filters['search'] = query.search;

    const rows = await this.requestsService.findAll({ page, filters: { ...filters }, sort: { 'isOpen': -1 } });

    filters['queryString'] = querystring.stringify(filters);

    return {
      rows: rows, msg,
      page, professions: this.professions,
      pageLimit: 10,
      filters,
      pageId: 'requests/',
    };
  }

  @Post('/apply')
  async applyToRequest(@Req() req, @Res() res, @Body() body) {
    const { page = 1 } = body;

    const data = {
      email: body.email,
      phone: body.phone,
      fullname: body.fullname,
      message: body.message,
    };

    await this.requestsService.addReply(body.requestId, data);

    req.session.msg = {
      type: 'success',
      text: 'Հայտը հաջողությամբ ուղարկված է',
    };

    return res.redirect('/requests');
  }
}
