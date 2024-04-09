import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// TypeORM 的 Repository 是提供给我们进行数据库操作的一个抽象层，它封装了对实体的基本 CRUD 操作
import { Repository, Like, Not } from 'typeorm';
import { TestEntity } from './entity/test.entity';

/**  Repository
 *  新增数据 create + save
 *  修改 merge + save
 *  查询 find 、findOne
 *  删除 delete
 * */

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity) // 注入实体数据使用
    private readonly testRepository: Repository<TestEntity>,
  ) {}

  // 新增
  async create(data) {
    const res = await this.testRepository.create(data);
    await this.testRepository.save(res);

    return res;
  }

  // 查询所有
  async findAll() {
    return await this.testRepository.find();
  }

  // 通过id查询一条
  async findOne(id) {
    return await this.testRepository.findOne({
      where: { id },
    });
  }
  // 通过多个条件查询
  async findData(data) {
    return await this.testRepository.find({
      where: { ...data },
    });
  }

  // 删除
  async remove(id) {
    const result = await this.testRepository.delete(id);
    Logger.log(`删除返回数据：${JSON.stringify(result)}`);
    const res = {
      code: 200,
      message: 'success',
      data: '',
    };
    return result.affected
      ? res
      : new HttpException('无法删除，请稍候在试', HttpStatus.BAD_REQUEST);
  }

  // 修改 title
  async update(data) {
    const old = await this.findOne(data.id);
    const res = await this.testRepository.merge(old, {
      title: data.title,
      orderId: data.orderId,
    });

    await this.testRepository.save(res);
  }

  // 排序  order: { [key: string]: 'DESC' 降序 | 'ASC'升序 }
  async orderList() {
    return await this.testRepository.find({
      order: {
        id: 'DESC', // 按照id降序
        // createTime: 'ASC' // 按照创建时间升序
      },
    });
  }

  // 模糊查询
  async fuzzyQuery(data) {
    return await this.testRepository.find({
      where: {
        id: Not(data.id), // Not就是id不为 * 的
        title: Like(`%${data.title}%`), // title 里带有 * 的
      },
    });
  }

  // findAndCount   实现title模糊搜索以分页
  async count(query) {
    const { title, pageNo, pageSize } = query;
    const [list, total] = await this.testRepository.findAndCount({
      select: ['title', 'id', 'createTime', 'orderId'], // 返回的字段
      where: {
        title: Like(`%${title}%`),
      },
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });
    return {
      list,
      total,
    };
  }

  // findByIds 传入id数组查询
}
