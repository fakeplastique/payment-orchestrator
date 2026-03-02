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

  findAll() {
    return this.repo.find({
      relations: ['transaction', 'rule'],
      order: { checkDate: 'DESC' },
      take: 100,
    });
  }
}
