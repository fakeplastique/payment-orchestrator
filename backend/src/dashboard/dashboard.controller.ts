import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@Query('days') days?: string, @CurrentUser() user?: AuthUser) {
    return this.dashboardService.getStats(Number(days) || 30, user!.companyId);
  }
}
