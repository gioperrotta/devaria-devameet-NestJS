import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { MessagesHelper } from './helpers/messages.helper';

import { RegisterDto } from 'src/user/dtos/register.dto';
import { UserService } from 'src/user/user.service';
import { UserMessagesHelper } from 'src/user/helpers/messages.helper';

// Regra de negócio é sempre no service
@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(private readonly useService: UserService) {}

  login(dto: LoginDto) {
    this.logger.debug('login - started');
    if (dto.login !== 'teste@teste.com' || dto.password !== '1234') {
      throw new BadRequestException(
        MessagesHelper.AUTH_PASSWORD_OR_LOGIN_NOT_FOUND,
      );
    }
    return dto;
  }

  async register(dto: RegisterDto) {
    this.logger.debug('register - started');
    if (await this.useService.existsByEmail(dto.email)) {
      throw new BadRequestException(
        UserMessagesHelper.REGISTER_EXIST_EMAIL_ACCOUNT,
      );
    }
    await this.useService.create(dto);
  }
}
