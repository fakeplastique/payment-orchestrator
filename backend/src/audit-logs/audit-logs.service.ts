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

  findAll(companyId: string) {
    return this.repo.find({
      where: { user: { company: { id: companyId } } },
      relations: ['user'],
      order: { performedDate: 'DESC' },
    });
  }
}
