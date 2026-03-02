import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Companies } from '../entities/Companies';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Companies)
    private readonly repo: Repository<Companies>,
  ) {}

  findMine(companyId: string) {
    return this.repo.findOne({
      where: { id: companyId },
      relations: ['users', 'integrations'],
    });
  }
}
