import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

const SALT_WORK_FACTOR = 10;

export const ENUM_PROFESSIONS = {
  'phys_ter': 'Ֆիզոթերաևտ',
  'otolar': 'Օտորոլարինգոլոգ',
  'orto': 'Վնասվածքաբան',
  'reabil': 'Ռեաբիլիտոլոգ',
  'nerv': 'Նյարդաբան',
  'manual': 'Մանուալ թերապևտ',
  'kineso': 'Կինեզոթերապևտ',
  'psychologist': 'Հոգեբան',
  'psychoanalyst': 'Հոգեվերլուծաբան',
  'soordo': 'Սուրդոմանկավարժ',
  'oligo': 'Օլիգոֆրենոմանկավարժ',
  'tiphlo': 'Տիֆլոմանկավարժ',
  'sl_therpahist': 'Լոգոպեդ',
  'art_therapist': 'Արտ թերապևտ',
  'ergo': 'Էրգո թերապևտ',
  'other': 'այլ',
};

export const ENUM_ACC_TYPE = {
  'regular': 'Սոց․ Մանկավարժ',
  'admin': 'Ադմինիստրատոր',
  'spec': 'Մասնագետ',
};

@Schema({
  toJSON: { virtuals: true },
})
export class Teacher extends Document {
  @Prop({ required: true, type: Object }) name: { first: string, last: string };
  @Prop({ required: true }) avatar: string;
  @Prop({ required: true }) password: string;
  @Prop() email: string;
  @Prop() type: string;
  @Prop() address: string;
  @Prop() spec: string;

  @Prop(raw({
    type: Date,
    required: true,
    default: new Date(),
  }))
  dateCreated: Date;

  static encryptPassword(string): Promise<string> {
    return new Promise((res, rej) => {
      // generate a salt
      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

        // hash the password using our new salt
        bcrypt.hash(string, salt, function(err, hash) {
          res(hash);
        });
      });
    });
  }
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

TeacherSchema.pre('save', async function(next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  user['password'] = await Teacher.encryptPassword(user['password']);
  next();
});