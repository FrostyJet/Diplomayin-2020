import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  toJSON: { virtuals: true },
})
export class Story extends Document {
  @Prop() teacherId: Types.ObjectId;
  @Prop() studentId: Types.ObjectId;
  @Prop() subject: string;
  @Prop() content: string;
  @Prop() comments: string[];
  @Prop() isOpen: boolean;

  @Prop(raw({
    type: Date,
    required: true,
    default: new Date(),
  }))
  dateCreated: Date;
}

export const StorySchema = SchemaFactory.createForClass(Story);

StorySchema.virtual('teacher', {
  ref: 'Teacher',
  localField: 'teacherId',
  foreignField: '_id',
  justOne: true,
});

StorySchema.virtual('student', {
  ref: 'Student',
  localField: 'studentId',
  foreignField: '_id',
  justOne: true,
});