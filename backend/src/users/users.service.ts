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

  findAll(companyId: string) {
    return this.repo.find({
      where: { company: { id: companyId } },
      relations: ['company'],
      select: ['id', 'email', 'role', 'lastLoginDate', 'companyId'],
    });
  }

  findOne(id: string, companyId: string) {
    return this.repo.findOne({
      where: { id, company: { id: companyId } },
      relations: ['company'],
      select: ['id', 'email', 'role', 'lastLoginDate', 'companyId'],
    });
  }
}
