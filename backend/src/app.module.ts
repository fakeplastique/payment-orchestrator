import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from './companies/companies.module';
import { ProvidersModule } from './providers/providers.module';
import { UsersModule } from './users/users.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { RawLogsModule } from './raw-logs/raw-logs.module';
import { FraudRulesModule } from './fraud-rules/fraud-rules.module';
import { FraudChecksModule } from './fraud-checks/fraud-checks.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [__dirname + '/entities/*{.ts,.js}'],
        synchronize: false,
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),
    CompaniesModule,
    ProvidersModule,
    UsersModule,
    IntegrationsModule,
    TransactionsModule,
    AuditLogsModule,
    RawLogsModule,
    FraudRulesModule,
    FraudChecksModule,
    DashboardModule,
  ],
})
export class AppModule {}
