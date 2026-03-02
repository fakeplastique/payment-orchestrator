import { Controller, Get, Param } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.integrationsService.findAll(user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.integrationsService.findOne(id, user.companyId);
  }
}
