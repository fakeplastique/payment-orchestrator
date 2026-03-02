import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FraudChecks } from '../entities/FraudChecks';

@Injectable()
export class FraudChecksService {
  constructor(
    @InjectRepository(FraudChecks)
    private readonly repo: Repository<FraudChecks>,
  ) {}

  findAll(companyId: string) {
    return this.repo
      .createQueryBuilder('fc')
      .innerJoinAndSelect('fc.transaction', 't')
      .innerJoinAndSelect('fc.rule', 'r')
      .innerJoin('t.integration', 'i')
      .innerJoin('i.company', 'c', 'c.id = :companyId', { companyId })
      .orderBy('fc.checkDate', 'DESC')
      .take(100)
      .getMany();
  }
}
