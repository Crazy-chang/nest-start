import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampTransformer } from '../../../core/common/index';

// 创建实体
/** @Column 属性说明
 *  length - 可选，表示该字段的大小，仅对 String 类型的字段有效，默认值 255
 * 
 * 
 * */ 
@Entity()
export class TestEntity {
  @Column('varchar', { name: 'title', comment: '名称', length: 10 })
  title: string;

  @Column('int', {
    name: 'order_id',
    comment: '序号',
    unsigned: true,
    default: () => "'0'",
  })
  orderId: number;

  // PrimaryGeneratedColumn 定义 id
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'id',
    unsigned: true,
  })
  id: number;

  // CreateDateColumn 定义 创建时间
  @CreateDateColumn({
    name: 'createTime',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new TimestampTransformer(),
  })
  createTime: Date;
}
