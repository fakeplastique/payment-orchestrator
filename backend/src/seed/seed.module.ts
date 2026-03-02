import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedCommand } from './seed.command';
import { Companies } from '../entities/Companies';
import { Providers } from '../entities/Providers';
import { Users } from '../entities/Users';
import { Integrations } from '../entities/Integrations';
import { Transactions } from '../entities/Transactions';
import { FraudRules } from '../entities/FraudRules';
import { FraudChecks } from '../entities/FraudChecks';
import { RawLogs } from '../entities/RawLogs';
import { AuditLogs } from '../entities/AuditLogs';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Companies,
      Providers,
      Users,
      Integrations,
      Transactions,
      FraudRules,
      FraudChecks,
      RawLogs,
      AuditLogs,
    ]),
  ],
  providers: [SeedService, SeedCommand],
})
export class SeedModule {}
