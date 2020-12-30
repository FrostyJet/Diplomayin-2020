import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as EjsMate from 'ejs-mate';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

const APP_PORT = 80;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/st' });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('ejs', EjsMate);
  app.setViewEngine('ejs');
  app.use(cookieParser());

  await app.listen(APP_PORT);
}

bootstrap();
