import { forwardRef, Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { TeachersModule } from '../teachers/teachers.module';
import { StoriesModule } from '../stories/stories.module';
import { RequestsModule } from '../requests/requests.module';

const _MongooseModule = MongooseModule.forFeature(
  [{ name: Student.name, schema: StudentSchema }]);

@Module({
  imports: [_MongooseModule, TeachersModule, forwardRef(() => RequestsModule), forwardRef(() => StoriesModule)],
  providers: [StudentsService],
  controllers: [StudentsController],
  exports: [_MongooseModule, StudentsService],
})
export class StudentsModule {
}
