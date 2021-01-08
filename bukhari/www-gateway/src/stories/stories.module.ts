import { forwardRef, Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './schemas/story.schema';
import { StudentsModule } from '../students/students.module';
import { TeachersModule } from '../teachers/teachers.module';

const _MongooseModule = MongooseModule.forFeature(
  [{ name: Story.name, schema: StorySchema }]);

@Module({
  imports: [_MongooseModule, forwardRef(() => StudentsModule), TeachersModule],
  providers: [StoriesService],
  controllers: [StoriesController],
  exports: [_MongooseModule, StoriesService],
})
export class StoriesModule {
}
