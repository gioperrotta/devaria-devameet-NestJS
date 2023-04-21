import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserMessagesHelper } from '../helpers/messages.helper';

export class RegisterDto {
  @MinLength(2, { message: UserMessagesHelper.REGISTER_NAME_NOT_VALID })
  name: string;

  @IsEmail({}, { message: UserMessagesHelper.REGISTER_EMAIL_NOT_VALID })
  email: string;

  @MinLength(4, { message: UserMessagesHelper.REGISTER_STRONG_PASSWORD })
  @MaxLength(12, { message: UserMessagesHelper.REGISTER_STRONG_PASSWORD })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: UserMessagesHelper.REGISTER_STRONG_PASSWORD,
  })
  password: string;

  @IsString()
  avatar: string;
}
