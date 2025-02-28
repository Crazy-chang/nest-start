// src/websocket/websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// 装饰器用于标记这是一个 WebSocket 网关
@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // 获取 socket 服务器的实例
  @WebSocketServer() server: Server;

  // 存储每个房间的连接客户端
  private rooms: { [key: string]: Socket[] } = {};
  // 存储每个房间，记录房间内用户列表
  private roomsUsers: { [key: string]: any[] } = {};

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized', server);
  }

  // 处理客户端连接事件
  handleConnection(client: Socket) {
    console.log('客户端连接:', client.id);
  }

  // 断开连接
  handleDisconnect(client: Socket) {
    console.log('断开连接', client.id);
  }

  // 创建/加入房间
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room?: string; name: string },
  ) {
    // 房间id：当前时间戳
    const roomID = data.room ? data.room : `${new Date().getTime()}`;

    if (!this.rooms[roomID]) {
      this.rooms[roomID] = [];
      this.roomsUsers[roomID] = [];
    }
    if (this.rooms[roomID].includes(client)) {
      client.emit('message', { type: 'message', content: '你已经在房间里!' });
      return;
    }

    this.rooms[roomID].push(client);
    this.roomsUsers[roomID].push({ id: client.id, userName: data.name });
    client.join(roomID);

    console.log(`Client ${client.id} joined room: ${roomID}`);

    // 给房间内所有成员发送消息
    this.sendRoomAllUsers(data.room ? 'join' : 'create', roomID, data.name);

    // this.server.to(roomID) -- 不生效？
    // this.server
    //   .to(roomID)
    //   .emit('message', { type: 'join', content: `加入了房间`, userName: data.name });

    // 给房间内除自己外的其他所有成员发送消息 -- 不生效?
    // client.to(roomID).emit('message', { type: 'join', content: '欢迎加入房间' });
  }

  // 离开房间
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; name: string },
  ) {
    if (this.rooms[data.room]) {
      this.rooms[data.room] = this.rooms[data.room].filter((c) => c !== client);
      this.roomsUsers[data.room] = this.roomsUsers[data.room].filter((its) => {
        return its.userName !== data.name;
      });
      // 发送给房间其他人
      this.sendRoomAllUsers('leave', data.room, data.name);
      // 如果房间为空，删除房间
      if (this.rooms[data.room].length === 0) {
        delete this.rooms[data.room];
        delete this.roomsUsers[data.room];
      }
    }
    // 不生效？
    // this.server
    //   .to(data.room)
    //   .emit('message', { type: 'leave', content: '离开了房间', userName: data.name });
    console.log(`Client ${client.id} leave room ${data.room}`);
  }

  /** 给房间内所有成员发送消息
   * @param type 事件类型
   * @param roomId 房间id
   * @param userName 用户名
   * @returns void
   * */
  sendRoomAllUsers(type: string, roomId: string, userName: string) {
    for (let i = 0; i < this.rooms[roomId].length; i++) {
      const clientData = this.rooms[roomId][i];
      clientData.emit('message', {
        type,
        roomId,
        userName,
        roomUserList: this.roomsUsers[roomId],
      });
    }
  }

  // 发送消息
  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; content: string; name: string },
  ) {
    console.log(`Client ${data.name} send message ${data.content} `);
    const roomList = this.rooms[data.room];
    if (roomList) {
      for (let i = 0; i < roomList.length; i++) {
        const clientData = roomList[i];
        clientData.emit('message', {
          type: 'message',
          roomId: data.room,
          userName: data.name,
          content: data.content,
        });
      }

      // this.server
      //   .to(data.room)
      //   .emit('message', { type: 'message', content: data.content, userName: client.id });
    }
  }

  // 获取当前房间的人数
  handleGetRoomUsers(@MessageBody() body: any) {
    const room = this.server.sockets.adapter.rooms.get(body.roomId);
    if (room) {
      this.server
        .to(body.roomId)
        .emit('message', { type: 'roomUserNum', content: room.size });
    } else {
      this.server
        .to(body.roomId)
        .emit('message', { type: 'roomUserNum', content: 0 });
    }
  }
}

// @SubscribeMessage('xxx') 的主要作用是定义一个方法来监听和处理来自客户端发送的 'xxx' 事件

// message 枚举类型：'create' ｜ 'join' | 'leave' | 'message' | 'roomUserNum'
