import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateMeetDto } from './createMeet.dto';
import { MeetMessagesHelper } from '../helpers/meetMessages.helper';
import { Type } from 'class-transformer';

export class UpdateMeetDto extends CreateMeetDto {
  @IsArray({ message: MeetMessagesHelper.UPDATE_OBEJCT_NAME_VALIDATION })
  @Type(() => UpdateMeetObjectDto)
  @ValidateNested({ each: true })
  objects: Array<UpdateMeetObjectDto>;
}

export class UpdateMeetObjectDto {
  @IsNotEmpty({ message: MeetMessagesHelper.UPDATE_OBEJCT_NAME_NOT_FOUND })
  name: string;

  @IsNumber({}, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  @Min(0, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  @Max(8, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  x: number;

  @IsNumber({}, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  @Min(0, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  @Max(8, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  y: number;

  @IsNumber({}, { message: MeetMessagesHelper.UPDATE_ZINDEX_VALIDATION })
  zindex: number;

  @IsString({ message: MeetMessagesHelper.UPDATE_ORIENTATION_VALIDATION })
  orientation: string;
}
