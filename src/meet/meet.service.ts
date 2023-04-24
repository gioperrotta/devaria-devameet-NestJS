import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meet, MeetDocument } from './schemas/meet.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateMeetDto } from './dto/createMeet.dto';
import { generateLink } from './helpers/linkGenerator.helper';
import {
  MeetObject,
  MeetObjectDocument,
  MeetObjectSchema,
} from './schemas/meetObject.scheam';
import { UpdateMeetDto } from './dto/updateMeet.dto';
import { MeetMessagesHelper } from './helpers/meetMessages.helper';

@Injectable()
export class MeetService {
  private readonly logger = new Logger(MeetService.name);

  constructor(
    @InjectModel(Meet.name) private readonly model: Model<MeetDocument>,
    @InjectModel(MeetObject.name)
    private readonly objectModel: Model<MeetObjectDocument>,
    private readonly userService: UserService,
  ) {}

  async getMeetsByUser(userId: string) {
    this.logger.debug('geetMeetsByUser - ' + userId);
    return this.model.find({ user: userId });
  }

  async createMeet(userId: string, dto: CreateMeetDto) {
    this.logger.debug('createMeetByUser - ' + userId);

    const user = await this.userService.getUserById(userId);

    const meet = {
      ...dto,
      user,
      link: generateLink(),
    };

    const createdMeet = new this.model(meet);
    return await createdMeet.save();
  }

  async deleteMeetByUser(userId: string, meetId: string) {
    this.logger.debug(`deleteMeetByUser - ${userId} - ${meetId}`);
    return this.model.deleteOne({ user: userId, _id: meetId });
  }

  async getMeetObjects(userId: string, meetId: string) {
    this.logger.debug(`getMeetObjects - ${userId} - ${meetId}`);
    const user = await this.userService.getUserById(userId);
    const meet = await this.model.findOne({ user, _id: meetId });

    return await this.objectModel.find({ meet });
  }

  async updateMeet(userId: string, meetId: string, dto: UpdateMeetDto) {
    this.logger.debug(`updateMeet - ${userId} - ${meetId}`);
    const user = await this.userService.getUserById(userId);
    const meet = await this.model.findOne({ user, _id: meetId });

    if (!meet) {
      throw new BadRequestException(MeetMessagesHelper.UPDATE_MEET_NOT_FOUND);
    }

    meet.name = dto.name;
    meet.color = dto.color;
    await this.model.findByIdAndUpdate({ _id: meetId }, meet);

    await this.objectModel.deleteMany({ meet });

    let objectPayload;

    for (const object of dto.objects) {
      objectPayload = {
        meet,
        ...object,
      };
      await this.objectModel.create(objectPayload);
    }
  }
}
