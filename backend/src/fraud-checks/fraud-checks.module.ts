import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraudChecks } from '../entities/FraudChecks';
import { FraudChecksController } from './fraud-checks.controller';
import { FraudChecksService } from './fraud-checks.service';

@Module({
  imports: [TypeOrmModule.forFeature([FraudChecks])],
  controllers: [FraudChecksController],
  providers: [FraudChecksService],
  exports: [FraudChecksService],
})
export class FraudChecksModule {}
