type CardinalType = {
  x: number;
  y: number;
};

type UsersInRooomType = {
  userId: string;
  x: number;
  y: number;
};

type UsersRoonsType = {
  room: string;
  users: UsersInRooomType[];
};

export class UsersPositionHelper {
  private usersRoons: UsersRoonsType[] = [];

  getNewPosition = (usersInRoom: UsersInRooomType[]): CardinalType => {
    let x = Math.floor(Math.random() * 8 + 1);
    let y = Math.floor(Math.random() * 8 + 1);
    let existisUserInPosition = usersInRoom.find((u) => u.x === x && u.y === y);
    while (existisUserInPosition) {
      x = Math.floor(Math.random() * 8 + 1);
      y = Math.floor(Math.random() * 8 + 1);
      existisUserInPosition = usersInRoom.find((u) => u.x === x && u.y === y);
    }
    return { x, y };
  };

  createNewRoom = (userId: string, room: string): CardinalType => {
    const usersInRoom: UsersInRooomType[] = [];
    const { x, y } = this.getNewPosition(usersInRoom);
    usersInRoom.push({ userId, x, y });
    this.usersRoons.push({
      room,
      users: usersInRoom,
    });
    return { x, y };
  };

  getInitialPosition = (userId: string, room: string): CardinalType => {
    const existRoom = this.usersRoons.find((r) => r.room === room);
    if (!existRoom) {
      const { x, y } = this.createNewRoom(userId, room);
      return { x, y };
    }
    const usersInRoom = existRoom.users;
    const userWasInRoom = usersInRoom.find((u) => u.userId === userId);
    if (!userWasInRoom) {
      //usuário nunca esteve na sala
      const { x, y } = this.getNewPosition(usersInRoom);
      usersInRoom.push({ userId, x, y });
      return { x, y };
    } else {
      // usuário já esteve na sala antes
      const { x, y } = userWasInRoom;
      return { x, y };
    }
  };

  saveLastUserPosition(room: string, userId: string, x: number, y: number) {
    const existRoom = this.usersRoons.find((r) => r.room === room);
    const usersInRoom = existRoom.users;
    const user = usersInRoom.find((u) => u.userId === userId);
    user.x = x;
    user.y = y;
  }
}
