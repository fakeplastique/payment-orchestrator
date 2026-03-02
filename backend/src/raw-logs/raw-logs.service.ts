import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RawLogs } from '../entities/RawLogs';

@Injectable()
export class RawLogsService {
  constructor(
    @InjectRepository(RawLogs)
    private readonly repo: Repository<RawLogs>,
  ) {}

  findAll(companyId: string) {
    return this.repo
      .createQueryBuilder('rl')
      .innerJoinAndSelect('rl.transaction', 't')
      .innerJoin('t.integration', 'i')
      .innerJoin('i.company', 'c', 'c.id = :companyId', { companyId })
      .orderBy('rl.id', 'DESC')
      .take(100)
      .getMany();
  }
}
