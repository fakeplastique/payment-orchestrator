import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraudRules } from '../entities/FraudRules';
import { FraudRulesController } from './fraud-rules.controller';
import { FraudRulesService } from './fraud-rules.service';

@Module({
  imports: [TypeOrmModule.forFeature([FraudRules])],
  controllers: [FraudRulesController],
  providers: [FraudRulesService],
  exports: [FraudRulesService],
})
export class FraudRulesModule {}
