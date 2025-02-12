import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TestModule } from './modules/test/test.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfig } from './core/common/index';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoringrecordModule } from './modules/scoringrecord/scoringrecord.module';
import { SpiderModule } from './modules/spider/spider.module';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    AuthModule,
    UserModule,
    TestModule,
    ScoringrecordModule,
    // 连接数据库
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const { host, port, username, password, database } = configService.get('DB');
        return {
          type: 'mysql', // 数据库类型
          host, // 主机，默认为localhost
          port, // 端口号
          username, // 用户名
          password, // 密码
          database, // 数据库名
          logging: true, // 开启所有数据库信息打印
          // timezone: '+08:00', // 服务器上配置的时区
          timezone: 'Z',
          synchronize: false, // 根据实体自动创建数据库表，生产环境建议关闭，否则可能导致数据被清空
          // entities: [`${__dirname}/**/*.entity{.ts,.js}`], // 引入实体，使用该方式可能有bug   mac 系统支持这种
          autoLoadEntities: true, // 自动加载实体 // windows 系统支持这种
        };
      },
      inject: [ConfigService],
    }),
    SpiderModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}
