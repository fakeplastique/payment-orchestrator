import { Controller, Get } from '@nestjs/common';
import { FraudChecksService } from './fraud-checks.service';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('fraud-checks')
export class FraudChecksController {
  constructor(private readonly fraudChecksService: FraudChecksService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.fraudChecksService.findAll(user.companyId);
  }
}
