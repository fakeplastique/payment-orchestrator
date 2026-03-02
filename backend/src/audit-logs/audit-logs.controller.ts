import { Controller, Get } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.auditLogsService.findAll(user.companyId);
  }
}
