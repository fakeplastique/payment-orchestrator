import { Controller, Get } from '@nestjs/common';
import { RawLogsService } from './raw-logs.service';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('raw-logs')
export class RawLogsController {
  constructor(private readonly rawLogsService: RawLogsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.rawLogsService.findAll(user.companyId);
  }
}
