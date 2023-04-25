import { IsBoolean } from 'class-validator';
import { JoinRoomDto } from './joinRoom.dto';
import { RoomMessagesHelper } from '../helpers/roomMessages.helper';

export class ToggleMuteDto extends JoinRoomDto {
  @IsBoolean({ message: RoomMessagesHelper.MUTE_NOT_VALID })
  muted: boolean;
}
