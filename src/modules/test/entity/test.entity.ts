import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampTransformer } from '../../../core/common/index';

// 创建实体
@Entity()
export class TestEntity {
  @Column('varchar', { name: 'title', comment: '名称', length: 100 })
  title: string;

  // 自增id 
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'id',
    unsigned: true,
  })
  id: number;

  // 创建数据的时间
  @CreateDateColumn({
    name: 'createTime',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new TimestampTransformer(),
  })
  createTime: Date;
}
