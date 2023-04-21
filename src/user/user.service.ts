import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dtos/register.dto';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: RegisterDto) {
    dto.password = CryptoJS.AES.encrypt(
      dto.password.toString(),
      process.env.USER_CYPHER_SECRET_KEY,
    ).toString();

    const createdUser = new this.userModel(dto);
    await createdUser.save();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.userModel.findOne({ email });

    if (result) {
      return true;
    }
    return false;
  }
}
