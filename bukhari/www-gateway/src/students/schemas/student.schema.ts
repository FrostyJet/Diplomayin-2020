import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  toJSON: { virtuals: true },
})
export class Student extends Document {
  @Prop({ required: true, type: Object }) name: { first: string, last: string };
  @Prop({ required: true }) avatar: string;
  @Prop() address: string;
  @Prop() teacherId: Types.ObjectId;

  @Prop(raw({
    type: Date,
    required: true,
    default: new Date(),
  }))
  dateCreated: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.virtual('teacher', {
  ref: 'Teacher',
  localField: 'teacherId',
  foreignField: '_id',
  justOne: true,
});