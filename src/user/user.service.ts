import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async create(userData: createUserDto) {
    const createdUser = new this.userModel(userData);
    return await createdUser.save();
  }
  async findOne(username: string, password: string) {
    return await this.userModel.findOne({ username, password });
  }
}
