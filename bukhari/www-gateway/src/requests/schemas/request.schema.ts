import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  toJSON: { virtuals: true },
})
export class Request extends Document {
  @Prop() teacherId: Types.ObjectId;
  @Prop() studentId: Types.ObjectId;
  @Prop() description: string;
  @Prop() professionId: string;
  @Prop() isOpen: boolean;
  @Prop() specId: Types.ObjectId;
  @Prop() specStart: Date;
  @Prop() specEnd: Date;
  @Prop() specResult: string;

  @Prop(raw({
    type: Date,
    required: true,
    default: new Date(),
  }))
  dateCreated: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);

RequestSchema.virtual('teacher', {
  ref: 'Teacher',
  localField: 'teacherId',
  foreignField: '_id',
  justOne: true,
});

RequestSchema.virtual('student', {
  ref: 'Student',
  localField: 'studentId',
  foreignField: '_id',
  justOne: true,
});

RequestSchema.virtual('spec', {
  ref: 'Teacher',
  localField: 'specId',
  foreignField: '_id',
  justOne: true,
});