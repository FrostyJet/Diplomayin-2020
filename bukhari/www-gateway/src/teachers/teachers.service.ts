import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher } from './schemas/teacher.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
  ) {
  }

  async create(info: any): Promise<Teacher> {
    return (new this.teacherModel(info)).save();
  }

  async login({ email, password }): Promise<any> {
    const teacher: Teacher = await this.findByEmail(email);
    let passwordMatches = false;

    if (teacher) {
      passwordMatches = await bcrypt.compare(password, teacher.password);
    }

    const result = {
      success: false,
      token: undefined, teacher: undefined,
    };

    if (passwordMatches) {
      result.success = true;
      result.teacher = teacher;
      result.token = jwt.sign({ teacher: { id: teacher.id } }, 'hiddenString');
    }

    return result;
  }

  public async findByEmail(email: any): Promise<Teacher | null> {
    return this.teacherModel.findOne({ email });
  }

  public async update(teacherId, patch): Promise<any> {
    if (typeof teacherId === 'string') teacherId = Types.ObjectId(teacherId);
    return this.teacherModel.updateOne({ _id: teacherId }, patch);
  }

  public async getById(teacherId): Promise<Teacher> {
    if (typeof teacherId === 'string') teacherId = Types.ObjectId(teacherId);
    return this.teacherModel.findOne(teacherId);
  }

  async findAll({ filters = {}, page = 1, limit = 10, sort = null }: any): Promise<any> {
    if (page < 1) page = 1;
    if (limit > 50) limit = 50;

    page = parseInt(page);
    limit = parseInt(limit);

    if (filters.search) {
      filters['$or'] = [
        { 'name.first': { $regex: '.*' + filters.search + '.*' } },
        { 'name.last': { $regex: '.*' + filters.search + '.*' } },
        { 'email': { $regex: '.*' + filters.search + '.*' } },
        { 'address': { $regex: '.*' + filters.search + '.*' } },
      ];

      delete filters.search;
    }

    const count = await this.teacherModel.countDocuments(filters);

    let query = this.teacherModel.find(filters)
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
    return this.teacherModel.findOne(id);
  }

  async deleteById(id) {
    if (typeof id === 'string') id = Types.ObjectId(id);
    return this.teacherModel.deleteOne({ _id: id });
  }

  async findByTeacherIds(teacherIds: string[]) {
    const ids = teacherIds.map(id => Types.ObjectId(id));
    return this.teacherModel.find({ _id: { $in: ids } });
  }
}