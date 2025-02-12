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

  // 存储每个房间的连接客户端，房间id为客户端创建的时间戳
  private rooms: { [key: string]: Socket[] } = {};

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
    @MessageBody() data: { room: string; name: string },
  ) {
    if (!this.rooms[data.room]) {
      this.rooms[data.room] = [];
    }
    if (this.rooms[data.room].includes(client)) {
      // 已经在房间里
      return;
    }

    this.rooms[data.room].push(client);
    client.join(data.room);
    // client.emit('message', { content: '你进入了房间' });

    console.log(`Client ${client.id} joined room: ${data.room}`);

    // 给房间内除自己外的其他所有成员发送消息
    // client.to(room).emit('message', { type: 'join', content: '欢迎加入房间' });
    // 给房间内所有成员发送消息
    this.server
      .to(data.room)
      .emit('message', { type: 'join', content: `加入了房间`, userName: data.name });

    this.handleGetRoomUsers({ roomId: data.room });
  }

  // 离开房间
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; name: string },
  ) {
    // for (const item in this.rooms) {
    //   this.rooms[item] = this.rooms[item].filter((c) => c !== client);
    // }
    if(this.rooms[data.room]) {
      this.rooms[data.room] = this.rooms[data.room].filter((c) => c !== client);
    }
    this.server
      .to(data.room)
      .emit('message', { type: 'leave', content: '离开了房间', userName: data.name });
    console.log(`Client ${client.id} leave room ${data.room}`);
  }

  // 发送消息
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; content: string },
  ) {
    console.log(`Client ${client.id} send message ${data}`);
    const roomObj = this.rooms[data.room];
    if (roomObj) {
      // roomObj.forEach((c: any) => {
      //   console.log('发送消息', c);
      //   if (c.readyState === 1) {
      //     // 1 表示 WebSocket.OPEN
      //     c.emit('message', { content: data.content });
      //   }
      // });
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

// message 枚举类型：'join' | 'leave' | 'message' | 'roomUserNum'
