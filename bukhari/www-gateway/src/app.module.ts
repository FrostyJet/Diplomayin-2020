import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TeachersModule } from './teachers/teachers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthContextMiddleware } from './@common/auth-context.middleware';
import { MediaModule } from './media/media.module';
import { StudentsModule } from './students/students.module';
import { StoriesModule } from './stories/stories.module';
import { RequestsModule } from './requests/requests.module';


const dbName = process.env.MONGO_INITDB_DATABASE;
const dbUsername = process.env.MONGO_INITDB_ROOT_USERNAME;
const dbPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dbHost = process.env.MONGODB_SERVICE_HOST || 'mongo';

const url = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:27017/${dbName}`; // process.env.MONGO_USERNAME;

@Module({
  imports: [MongooseModule.forRoot(url),
    HomeModule, RequestsModule, StoriesModule, LoginModule,
    DashboardModule, TeachersModule, MediaModule, StudentsModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthContextMiddleware)
      .forRoutes('*');
  }
}