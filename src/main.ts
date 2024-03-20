import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/HttpExceptionFilter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局注册错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局拦截器
  // app.useGlobalInterceptors(new ResponseInterceptor())
  //全局管道  
  // app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen(3000);

  // 热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
