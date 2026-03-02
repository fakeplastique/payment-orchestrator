import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FraudRulesService } from './fraud-rules.service';

@Controller('fraud-rules')
export class FraudRulesController {
  constructor(private readonly fraudRulesService: FraudRulesService) {}

  @Get()
  findAll() {
    return this.fraudRulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fraudRulesService.findOne(id);
  }
}
