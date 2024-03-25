import * as dayjs from 'dayjs';
import { ValueTransformer } from 'typeorm';

// 读取项目配置
export const getConfig = () => {
  const config = {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
  };

  return config;
};

// 时间格式化，防止出现2022-0101T09:12:23.102Z
export class TimestampTransformer implements ValueTransformer {
  constructor(private readonly formatstr: string = 'YYYY-MM-DD HH:mm:ss') {}

  to(value: any) {
    return value;
  }

  from(value: any) {
    return dayjs(value).format(this.formatstr);
  }
}
