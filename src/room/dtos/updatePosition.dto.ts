import { IsNumber, IsString, Max, Min } from 'class-validator';
import { JoinRoomDto } from './joinRoom.dto';
import { MeetMessagesHelper } from 'src/meet/helpers/meetMessages.helper';

export class UpdateUserPositionDto extends JoinRoomDto {
  @IsNumber({}, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  @Min(0, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  @Max(8, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  x: number;

  @IsNumber({}, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  @Min(0, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  @Max(8, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
  y: number;

  @IsString({ message: MeetMessagesHelper.UPDATE_ORIENTATION_VALIDATION })
  orientation: string;
}
