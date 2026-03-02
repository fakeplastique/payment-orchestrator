import { Controller, Get } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('mine')
  findMine(@CurrentUser() user: AuthUser) {
    return this.companiesService.findMine(user.companyId);
  }
}
