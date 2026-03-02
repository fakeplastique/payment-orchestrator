import { Controller, Get } from '@nestjs/common';
import { RawLogsService } from './raw-logs.service';

@Controller('raw-logs')
export class RawLogsController {
  constructor(private readonly rawLogsService: RawLogsService) {}

  @Get()
  findAll() {
    return this.rawLogsService.findAll();
  }
}
