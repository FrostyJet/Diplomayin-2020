import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IndexController } from './index.controller';
import { GamesController } from './games.controller';
import { SettingsController } from './settings.controller';
import { AuthMiddleware } from '../@common/auth.middleware';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
  imports: [DashboardModule, forwardRef(() => TeachersModule)],
  controllers: [IndexController, GamesController, SettingsController],
  providers: [],
})

export class DashboardModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('/dashboard/*');
  }
}