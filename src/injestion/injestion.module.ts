import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionEntity } from 'src/entities/ingestion.entity';
import { IngestionController } from './injestion.controller';
import { IngestionService } from './injestion.service';
import { IngestionListener } from './injestion.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngestionEntity]),
  ] ,
  controllers: [IngestionController],
  providers: [IngestionService , IngestionListener],
})
export class IngestionModule {}
