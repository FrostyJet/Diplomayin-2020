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
    return (new this.studentModel(info)).save();
  }

  public async findByEmail(email: any): Promise<Student | null> {
    return this.studentModel.findOne({ email });
  }

  public async update(studentId, patch): Promise<any> {
    if (typeof studentId === 'string') studentId = Types.ObjectId(studentId);
    return this.studentModel.updateOne({ _id: studentId }, patch);
  }

  public async getById(studentId): Promise<Student> {
    if (typeof studentId === 'string') studentId = Types.ObjectId(studentId);
    return this.studentModel.findOne(studentId);
  }

  async findAll({ filters = {}, page = 1, limit = 10, sort = null }: any): Promise<any> {
    const count = await this.studentModel.countDocuments(filters);

    if (page < 1) page = 1;
    if (limit > 50) limit = 50;

    page = parseInt(page);
    limit = parseInt(limit);

    if (filters.search) {
      filters['$or'] = [
        { 'name.first': { $regex: '.*' + filters.search + '.*' } },
        { 'name.last': { $regex: '.*' + filters.search + '.*' } },
        { 'address': { $regex: '.*' + filters.search + '.*' } },
      ];

      delete filters.search;
    }

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

  async deleteById(id) {
    if (typeof id === 'string') id = Types.ObjectId(id);
    return this.studentModel.deleteOne({ _id: id });
  }
}