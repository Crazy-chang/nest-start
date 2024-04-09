import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TestModule } from './modules/test/test.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from './core/common/index';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [getConfig],
    }),
    AuthModule,
    UserModule,
    TestModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql', // 数据库类型
        host: '', // 主机，默认为localhost
        port: 3306, // 端口号
        username: 'prod', // 用户名
        password: 'Bojia2023', // 密码
        database: 'zzc', // 数据库名
        logging: true, // 开启所有数据库信息打印
        // timezone: '+08:00', // 服务器上配置的时区
        timezone: 'Z',
        synchronize: true, // 根据实体自动创建数据库表，生产环境建议关闭，否则可能导致数据被清空
        // entities: [`${__dirname}/**/*.entity{.ts,.js}`], // 引入实体，使用该方式可能有bug   mac 系统支持这种
        autoLoadEntities: true, // 自动加载实体 // windows 系统支持这种
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
