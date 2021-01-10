import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from './schemas/story.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class StoriesService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<Story>,
  ) {
  }

  async create(info: any): Promise<Story> {
    if (typeof info.teacherId == 'string') info.teacherId = Types.ObjectId(info.teacherId);
    if (typeof info.studentId == 'string') info.studentId = Types.ObjectId(info.studentId);

    return (new this.storyModel(info)).save();
  }

  public async findByEmail(email: any): Promise<Story | null> {
    return this.storyModel.findOne({ email });
  }

  public async update(studentId, patch): Promise<any> {
    if (typeof studentId === 'string') studentId = Types.ObjectId(studentId);
    return this.storyModel.updateOne({ _id: studentId }, patch);
  }

  public async getById(studentId): Promise<Story> {
    if (typeof studentId === 'string') studentId = Types.ObjectId(studentId);
    return this.storyModel.findOne(studentId);
  }

  async findAll({ filters = {}, page = 1, limit = 10, sort = null }: any): Promise<any> {
    if (page < 1) page = 1;
    if (limit > 50) limit = 50;

    page = parseInt(page);
    limit = parseInt(limit);

    if (filters.search) {
      filters['$or'] = [
        { 'subject': { $regex: '.*' + filters.search + '.*' } },
        { 'content': { $regex: '.*' + filters.search + '.*' } },
      ];

      delete filters.search;
    }

    const count = await this.storyModel.countDocuments(filters);

    let query = this.storyModel.find(filters)
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
    return this.storyModel.findOne(id).populate('student');
  }

  async deleteById(id) {
    if (typeof id === 'string') id = Types.ObjectId(id);
    return this.storyModel.deleteOne({ _id: id });
  }

  async addComment(storyId, comment) {
    if (typeof storyId === 'string') storyId = Types.ObjectId(storyId);
    return this.storyModel.updateOne({ _id: storyId }, { $push: { comments: comment } });
  }

  async findByStudentId(studentId: string | Types.ObjectId) {
    if (typeof studentId === 'string') studentId = Types.ObjectId(studentId);
    return this.storyModel.find({ studentId });
  }

  async getTotalCount(filters: any = {}) {
    if (typeof filters.teacherId === 'string') filters.teacherId = Types.ObjectId(filters.teacherId);
    return this.storyModel.countDocuments(filters);
  }
}