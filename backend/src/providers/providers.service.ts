import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Providers } from '../entities/Providers';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Providers)
    private readonly repo: Repository<Providers>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
