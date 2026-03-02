import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from '../entities/Transactions';
import { TransactionQueryDto } from './dto/transaction-query.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly repo: Repository<Transactions>,
  ) {}

  async findAll(query: TransactionQueryDto, companyId: string) {
    const qb = this.repo
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.integration', 'i')
      .innerJoin('i.company', 'c', 'c.id = :companyId', { companyId })
      .orderBy('t.createdDate', 'DESC')
      .take(query.limit ?? 50)
      .skip(query.offset ?? 0);

    if (query.status) qb.andWhere('t.status = :status', { status: query.status });
    if (query.currency) qb.andWhere('t.currency = :currency', { currency: query.currency });

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  findOne(id: string, companyId: string) {
    return this.repo
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.integration', 'i')
      .innerJoin('i.company', 'c', 'c.id = :companyId', { companyId })
      .leftJoinAndSelect('t.fraudChecks', 'fc')
      .leftJoinAndSelect('fc.rule', 'r')
      .leftJoinAndSelect('t.rawLogs', 'rl')
      .where('t.id = :id', { id })
      .getOne();
  }
}
