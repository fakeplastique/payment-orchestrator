import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogs } from '../entities/AuditLogs';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLogs)
    private readonly repo: Repository<AuditLogs>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['user'], order: { performedDate: 'DESC' } });
  }
}
