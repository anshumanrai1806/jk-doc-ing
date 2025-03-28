import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionEntity } from 'src/entities/ingestion.entity';
import { IngestionController } from './injestion.controller';
import { IngestionService } from './injestion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngestionEntity]),
  ] ,
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
