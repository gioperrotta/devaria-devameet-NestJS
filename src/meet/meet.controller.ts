import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { MeetService } from './meet.service';
import { GetMeetDto } from './dto/getMeet.dto';
import { CreateMeetDto } from './dto/createMeet.dto';
import { UpdateMeetDto } from './dto/updateMeet.dto';

@Controller('meet')
export class MeetController {
  constructor(private readonly service: MeetService) {}

  @Get()
  async getMeets(@Request() req) {
    const { userId } = req?.user;

    const result = await this.service.getMeetsByUser(userId);

    return result.map(
      (meet) =>
        ({
          id: meet._id.toString(),
          name: meet.name,
          color: meet.color,
          link: meet.link,
        } as GetMeetDto),
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMeetById(@Request() req, @Param() params) {
    const { userId } = req?.user;
    const { id } = params;
    return await this.service.getMeetById(userId, id);
  }

  @Post()
  async createMeet(@Request() req, @Body() dto: CreateMeetDto) {
    const { userId } = req?.user;
    return await this.service.createMeet(userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteMeet(@Request() req, @Param() params) {
    const { userId } = req?.user;
    const { id } = params;
    await this.service.deleteMeetByUser(userId, id);
  }

  @Get('object/:id')
  async getObjectsByMeet(@Request() req, @Param() params) {
    const { userId } = req?.user;
    const { id } = params;
    return await this.service.getMeetObjects(userId, id);
  }

  @Put(':id')
  async updateMeet(
    @Request() req,
    @Param() params,
    @Body() dto: UpdateMeetDto,
  ) {
    const { userId } = req?.user;
    const { id } = params;
    await this.service.updateMeet(userId, id, dto);
  }
}
