import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/HttpExceptionFilter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { IoAdapter } from '@nestjs/platform-socket.io';

declare const module: any;

const corsOptions: CorsOptions = {
  origin: '*', // 允许所有来源的跨域请求
  // 其他CORS相关配置（按需调整）
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的HTTP方法列表
  allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头列表
  // credentials: true, // 是否允许发送Cookie
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 使用全局CORS配置
  app.enableCors(corsOptions);
  // 全局注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局拦截器
  // app.useGlobalInterceptors(new ResponseInterceptor())
  //全局管道
  // app.useGlobalPipes(new ValidationPipe({ transform: true }))

  // 配置 WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3000);

  // 热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
