import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schemas/student.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {
  }

  async create(info: any): Promise<Student> {
    if (typeof info.teacherId == 'string') info.teacherId = Types.ObjectId(info.teacherId);
    return (new this.studentModel(info)).save();
  }

  public async findByEmail(email: any): Promise<Student | null> {
    return this.studentModel.findOne({ email });
  }

  public async update(studentId, patch): Promise<any> {
    if (typeof studentId === 'string') studentId = Types.ObjectId(studentId);
    if (typeof patch.teacherId === 'string') patch.teacherId = Types.ObjectId(patch.teacherId);
    return this.studentModel.updateOne({ _id: studentId }, patch);
  }

  public async getById(studentId): Promise<Student> {
    if (typeof studentId === 'string') studentId = Types.ObjectId(studentId);
    return this.studentModel.findOne(studentId);
  }

  async findAll({ filters = {}, page = 1, limit = 10, sort = null }: any): Promise<any> {
    if (page < 1) page = 1;
    if (limit > 50) limit = 50;

    page = parseInt(page);
    limit = parseInt(limit);

    if (filters.teacherId && typeof filters.teacherId == 'string') filters.teacherId = Types.ObjectId(filters.teacherId);

    if (filters.search) {
      filters['$or'] = [
        { 'name.first': { $regex: '.*' + filters.search + '.*' } },
        { 'name.last': { $regex: '.*' + filters.search + '.*' } },
        { 'address': { $regex: '.*' + filters.search + '.*' } },
      ];

      delete filters.search;
    }

    const count = await this.studentModel.countDocuments(filters);

    let query = this.studentModel.find(filters)
      .populate('teacher')
      .skip((page - 1) * limit)
      .limit(limit);

    if (sort) {
      query = query.sort(sort);
    }

    const rows = await query.exec();

    return {
      totalCount: count,
      list: rows,
    };
  }

  async findById(id: any) {
    if (typeof id === 'string') id = Types.ObjectId(id);
    return this.studentModel.findOne(id);
  }

  async findByTeacherId(teacherId: string | Types.ObjectId) {
    if (typeof teacherId === 'string') teacherId = Types.ObjectId(teacherId);
    return this.studentModel.find({ teacherId: teacherId });
  }

  async deleteById(id) {
    if (typeof id === 'string') id = Types.ObjectId(id);
    return this.studentModel.deleteOne({ _id: id });
  }

  async getTotalCount(filters: any = {}) {
    if (typeof filters.teacherId === 'string') filters.teacherId = Types.ObjectId(filters.teacherId);
    return this.studentModel.countDocuments(filters);
  }
}