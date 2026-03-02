import { Controller, Get, Param, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionQueryDto } from './dto/transaction-query.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(@Query() query: TransactionQueryDto) {
    return this.transactionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }
}
