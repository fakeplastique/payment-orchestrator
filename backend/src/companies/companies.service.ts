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

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['users', 'integrations'],
    });
  }
}
