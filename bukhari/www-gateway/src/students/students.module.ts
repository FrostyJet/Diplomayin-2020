import { forwardRef, Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { TeachersModule } from '../teachers/teachers.module';
import { StoriesModule } from '../stories/stories.module';

const _MongooseModule = MongooseModule.forFeature(
  [{ name: Student.name, schema: StudentSchema }]);

@Module({
  imports: [_MongooseModule, TeachersModule, forwardRef(() => StoriesModule)],
  providers: [StudentsService],
  controllers: [StudentsController],
  exports: [_MongooseModule, StudentsService],
})
export class StudentsModule {
}
