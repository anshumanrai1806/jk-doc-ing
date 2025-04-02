import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { IngestionEntity, IngestionStatus } from 'src/entities/ingestion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IngestionListener implements OnModuleInit {
  private readonly logger = new Logger(IngestionListener.name);

  constructor(@InjectRepository(IngestionEntity)
  private readonly ingestionRepository: Repository<IngestionEntity>,) {}

  onModuleInit() {
    this.logger.log('Ingestion event listener initialized');
  }

  @OnEvent('ingestion.started')
  async handleIngestionEvent(ingestion: IngestionEntity) {
    this.logger.log(`Processing ingestion for document: ${ingestion.documentId}`);

    // Simulate async processing (mock delay)
    setTimeout(async () => {
      const isSuccess = Math.random() > 0.2;
      ingestion.status = isSuccess ? IngestionStatus.COMPLETED : IngestionStatus.FAILED;
      ingestion.errorMessage = isSuccess ? null : 'Simulated ingestion error';

      await this.ingestionRepository.save(ingestion);
      this.logger.log(`Ingestion ${ingestion.id} updated to status: ${ingestion.status}`);

      // Emit event after status update
      this.logger.log(`Emitting event: ingestion.completed`);
    }, 5000);
  }
}
