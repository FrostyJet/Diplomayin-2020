import { Module } from '@nestjs/common';
import { IndexController } from './index.controller';
import { RequestsController } from './requests.controller';
import { RequestsModule } from '../requests/requests.module';

@Module({
  imports: [HomeModule, RequestsModule],
  controllers: [IndexController, RequestsController],
  providers: [],
})
export class HomeModule {
}
