import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly repo: Repository<Users>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['company'] });
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['company'],
    });
  }
}
