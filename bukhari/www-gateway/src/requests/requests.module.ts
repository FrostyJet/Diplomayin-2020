import { forwardRef, Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from './schemas/request.schema';
import { StudentsModule } from '../students/students.module';
import { TeachersModule } from '../teachers/teachers.module';

const _MongooseModule = MongooseModule.forFeature(
  [{ name: Request.name, schema: RequestSchema }]);

@Module({
  imports: [_MongooseModule, forwardRef(() => StudentsModule), TeachersModule],
  providers: [RequestsService],
  controllers: [RequestsController],
  exports: [_MongooseModule, RequestsService],
})
export class RequestsModule {
}
