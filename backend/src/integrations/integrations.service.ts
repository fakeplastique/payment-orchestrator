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

  findAll(companyId: string) {
    return this.repo.find({
      where: { company: { id: companyId } },
      relations: ['company', 'provider'],
    });
  }

  findOne(id: string, companyId: string) {
    return this.repo.findOne({
      where: { id, company: { id: companyId } },
      relations: ['company', 'provider', 'transactions'],
    });
  }
}
