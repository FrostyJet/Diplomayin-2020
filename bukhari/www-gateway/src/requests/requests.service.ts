import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from './schemas/request.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(Request.name) private requestModule: Model<Request>,
  ) {
  }

  async create(info: any): Promise<Request> {
    if (typeof info.teacherId == 'string') info.teacherId = Types.ObjectId(info.teacherId);
    if (typeof info.studentId == 'string') info.studentId = Types.ObjectId(info.studentId);

    info.isOpen = true;
    return (new this.requestModule(info)).save();
  }

  public async findByEmail(email: any): Promise<Request | null> {
    return this.requestModule.findOne({ email });
  }

  public async update(studentId, patch): Promise<any> {
    if (typeof studentId === 'string') studentId = Types.ObjectId(studentId);
    return this.requestModule.updateOne({ _id: studentId }, patch);
  }

  public async getById(studentId): Promise<Request> {
    if (typeof studentId === 'string') studentId = Types.ObjectId(studentId);
    return this.requestModule.findOne(studentId);
  }

  async findAll({ filters = {}, page = 1, limit = 10, sort = null }: any): Promise<any> {
    if (page < 1) page = 1;
    if (limit > 50) limit = 50;

    page = parseInt(page);
    limit = parseInt(limit);

    if (filters.search) {
      filters['$or'] = [
        { 'description': { $regex: '.*' + filters.search + '.*' } },
      ];

      delete filters.search;
    }

    if (filters.teacherId && typeof filters.teacherId == 'string') {
      filters.teacherId = Types.ObjectId(filters.teacherId);
    }

    const count = await this.requestModule.countDocuments(filters);

    let query = this.requestModule.find(filters)
      .populate('student')
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
    return this.requestModule.findOne(id).populate('student');
  }

  async deleteById(id) {
    if (typeof id === 'string') id = Types.ObjectId(id);
    return this.requestModule.deleteOne({ _id: id });
  }

  async findByStudentId(studentId: string | Types.ObjectId) {
    if (typeof studentId === 'string') studentId = Types.ObjectId(studentId);
    return this.requestModule.find({ studentId });
  }

  async addReply(requestId: any, data: { phone: any | string; fullname: any | string; message: any; email: any }) {
    if (typeof requestId === 'string') requestId = Types.ObjectId(requestId);
    return this.requestModule.updateOne({ _id: requestId }, { $push: { replies: data } });
  }

  getYearlyStats({ isOpen }) {
    return this.requestModule.aggregate([
      {
        $match:
          {
            isOpen: isOpen,
          },
      },
      {
        $group: {
          _id: { month: { $month: '$dateCreated' } }, count: { $sum: 1 },
        },
      },
    ]).exec();
  }

  async getTotalCount(filters: any = {}) {
    if (typeof filters.teacherId === 'string') filters.teacherId = Types.ObjectId(filters.teacherId);
    return this.requestModule.countDocuments(filters);
  }
}