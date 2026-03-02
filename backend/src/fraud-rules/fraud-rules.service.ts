import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FraudRules } from '../entities/FraudRules';

@Injectable()
export class FraudRulesService {
  constructor(
    @InjectRepository(FraudRules)
    private readonly repo: Repository<FraudRules>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['fraudChecks'] });
  }
}
