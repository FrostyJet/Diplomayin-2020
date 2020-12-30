import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [HomeModule, LoginModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
