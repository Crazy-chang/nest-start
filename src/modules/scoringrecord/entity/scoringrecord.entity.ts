import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampTransformer } from '../../../core/common/index';

// 计分记录列表实体
/** @Column 属性说明
 *  id - 可选，表示该字段的大小，仅对 String 类型的字段有效，默认值 255
 *  id - 可选，表示该字段的大小，仅对 String 类型的字段有效，默认值 255
 *  id - 可选，表示该字段的大小，仅对 String 类型的字段有效，默认值 255
 * */
@Entity()
export class ScoreEntity {
  // PrimaryGeneratedColumn 定义 id
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: 'id',
    unsigned: true,
  })
  id: number;

  @Column('varchar', {
    name: 'playName',
    comment: '玩家姓名',
    length: 10,
  })
  playName: string;

  @Column('int', {
    name: 'scoreId',
    comment: '分数',
    default: () => "'0'",
  })
  scoreId: number;

  // CreateDateColumn 定义 创建时间
  @CreateDateColumn({
    name: 'createTime',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new TimestampTransformer(),
  })
  createTime: Date;
}
