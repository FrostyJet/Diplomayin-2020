import { Module } from '@nestjs/common';
import { IndexController } from './index.controller';

@Module({
  imports: [LoginModule],
  controllers: [IndexController],
  providers: [],
})
export class LoginModule {
}
