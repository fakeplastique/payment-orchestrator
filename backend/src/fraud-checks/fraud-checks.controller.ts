import { Controller, Get } from '@nestjs/common';
import { FraudChecksService } from './fraud-checks.service';

@Controller('fraud-checks')
export class FraudChecksController {
  constructor(private readonly fraudChecksService: FraudChecksService) {}

  @Get()
  findAll() {
    return this.fraudChecksService.findAll();
  }
}
