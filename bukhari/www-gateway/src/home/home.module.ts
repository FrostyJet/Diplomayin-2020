import { Module } from '@nestjs/common';
import { IndexController } from './index.controller';

@Module({
  imports: [HomeModule],
  controllers: [IndexController],
  providers: [],
})
export class HomeModule {
}
