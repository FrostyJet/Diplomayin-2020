import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as EjsMate from 'ejs-mate';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';

const APP_PORT = 80;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // "View" Setups
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('ejs', EjsMate);
  app.setViewEngine('ejs');

  // Cookies
  app.use(cookieParser());

  // Session configurations
  app.use(
    session({
      secret: 'hiddenString',
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(APP_PORT);
}

bootstrap();
