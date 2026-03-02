import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RawLogs } from '../entities/RawLogs';

@Injectable()
export class RawLogsService {
  constructor(
    @InjectRepository(RawLogs)
    private readonly repo: Repository<RawLogs>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['transaction'], order: { id: 'DESC' }, take: 100 });
  }
}
