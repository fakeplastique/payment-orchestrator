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

  async findAll(query: TransactionQueryDto) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.currency) where.currency = query.currency;

    const [data, total] = await this.repo.findAndCount({
      where,
      relations: ['integration'],
      order: { createdDate: 'DESC' },
      take: query.limit ?? 50,
      skip: query.offset ?? 0,
    });

    return { data, total };
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['integration', 'fraudChecks', 'fraudChecks.rule', 'rawLogs'],
    });
  }
}
