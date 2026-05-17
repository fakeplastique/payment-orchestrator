import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integrations } from '../entities/Integrations';
import { Transactions } from '../entities/Transactions';
import { RawLogs } from '../entities/RawLogs';
import { FraudChecks } from '../entities/FraudChecks';
import { FraudRules } from '../entities/FraudRules';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Integrations, Transactions, RawLogs, FraudChecks, FraudRules]),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
