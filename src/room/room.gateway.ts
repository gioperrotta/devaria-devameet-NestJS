import {
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dtos/joinRoom.dto';
import { UpdateUserPositionDto } from './dtos/updatePosition.dto';
import { ToggleMuteDto } from './dtos/toggleMute.dto';
import { UsersPositionHelper } from './helpers/usersPosition.heper';

type ActiveSocketType = {
  room: string;
  id: string;
  userId: string;
};

@WebSocketGateway({ cors: true })
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect {
  constructor(private readonly service: RoomService) {}

  @WebSocketServer() wss: Server;

  private logger = new Logger(RoomGateway.name);
  private activeSockets: ActiveSocketType[] = [];
  private userPosition = new UsersPositionHelper();

  async handleDisconnect(client: any) {
    const existingOnSocket = this.activeSockets.find(
      (socket) => socket.id === client.id,
    );

    if (!existingOnSocket) return;

    const link = existingOnSocket.room;
    const userId = existingOnSocket.userId;
    const users = await this.service.listUsersPositionByLink(link);
    const { x, y } = users.find((u) => u.clientId === client.id);
    this.userPosition.saveLastUserPosition(link, userId, x, y);

    this.activeSockets = this.activeSockets.filter(
      (socket) => socket.id !== client.id,
    );

    await this.service.deleteUserPosition(client.id);
    client.broadcast.emit(`${existingOnSocket.room}-remove-user`, {
      socketId: client.id,
    });

    this.logger.debug(`Client: ${client.id} disconnected`);
  }

  afterInit(server: any) {
    this.logger.log('Gateway Initialized', server);
  }
  @SubscribeMessage('join')
  async handleJoin(client: Socket, payload: JoinRoomDto) {
    const { link, userId } = payload;

    const existingOnSocket = this.activeSockets.find(
      (socket) => socket.room === link && socket.id === client.id,
    );

    if (!existingOnSocket) {
      this.activeSockets.push({ room: link, id: client.id, userId });
      const { x, y } = this.userPosition.getInitialPosition(userId, link);
      const dto = {
        link,
        userId,
        x,
        y,
        orientation: 'down',
      } as UpdateUserPositionDto;

      await this.service.updateUserPosition(client.id, dto);
      const users = await this.service.listUsersPositionByLink(link);

      this.wss.emit(`${link}-update-user-list`, { users });
      client.broadcast.emit(`${link}-add-user`, { user: client.id });
    }

    this.logger.debug(`Socket client: ${client.id} start to join room ${link}`);
  }

  @SubscribeMessage('move')
  async handleMove(client: Socket, payload: UpdateUserPositionDto) {
    const { link, userId, x, y, orientation } = payload;
    const dto = { link, userId, x, y, orientation } as UpdateUserPositionDto;

    await this.service.updateUserPosition(client.id, dto);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, { users });
  }

  @SubscribeMessage('toggl-mute-user')
  async handleToglMute(client: Socket, payload: ToggleMuteDto) {
    const { link } = payload;
    await this.service.updateUserMute(payload);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, { users });
  }

  @SubscribeMessage('call-user')
  async callUser(client: Socket, data: any) {
    this.logger.debug(`call User: ${client.id} to: ${data.to}`);
    client.to(data.to).emit('call-made', {
      offer: data.offer,
      socket: client.id,
    });
  }

  @SubscribeMessage('make-answer')
  async makeAnswer(client: Socket, data: any) {
    this.logger.debug(`make Answer ${client.id} to: ${data.to}`);
    client.to(data.to).emit('answer-made', {
      answer: data.answer,
      socket: client.id,
    });
  }
}
