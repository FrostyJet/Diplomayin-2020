import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';

const _MongooseModule = MongooseModule.forFeature(
  [{ name: Teacher.name, schema: TeacherSchema }]);

@Module({
  imports: [_MongooseModule],
  providers: [TeachersService],
  controllers: [TeachersController],
  exports: [_MongooseModule, TeachersService],
})
export class TeachersModule {
}
