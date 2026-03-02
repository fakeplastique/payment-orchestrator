import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integrations } from '../entities/Integrations';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(Integrations)
    private readonly repo: Repository<Integrations>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['company', 'provider'] });
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['company', 'provider', 'transactions'],
    });
  }
}
