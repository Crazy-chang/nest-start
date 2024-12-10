import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 全局错误统一处理
// https://nest.nodejs.cn/exception-filters

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 全部错误信息
    let message = exception.message;

    if (message === 'Unauthorized') {
      message = 'token已过期';
    }
    // Logger 系统日志
    Logger.log('错误提示', message);

    // 设置返回的状态码、发送错误信息
    response.status(status).json({
      message,
      code: status,
      url: request.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
}
