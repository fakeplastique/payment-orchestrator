import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawLogs } from '../entities/RawLogs';
import { RawLogsController } from './raw-logs.controller';
import { RawLogsService } from './raw-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([RawLogs])],
  controllers: [RawLogsController],
  providers: [RawLogsService],
  exports: [RawLogsService],
})
export class RawLogsModule {}
