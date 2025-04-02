import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { IngestionEntity, IngestionStatus } from 'src/entities/ingestion.entity';
import { Repository } from 'typeorm';


export interface IngestionRecord {
  documentId: number;
  userId: number;
  status: IngestionStatus;
  errorMessage?: string;
}

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);
  private ingestionStore: Record<number, IngestionRecord> = {}; // In-memory store

  constructor(@InjectRepository(IngestionEntity)
  private readonly ingestionRepository: Repository<IngestionEntity>, private eventEmitter: EventEmitter2) { }

  async triggerIngestion(documentId: number, userId: number): Promise<IngestionEntity> {
    const ingestion = this.ingestionRepository.create({
      documentId,
      userId,
      status: IngestionStatus.PROCESSING,
    });
    const savedIngestion = await this.ingestionRepository.save(ingestion);

    // Emit event to process ingestion
    this.eventEmitter.emit('ingestion.started', savedIngestion);
    return savedIngestion;
  }

  private processIngestion(documentId: number) {
    const isSuccess = Math.random() > 0.2; // 80% chance of success
    const status = isSuccess ? IngestionStatus.COMPLETED : IngestionStatus.FAILED;
    const errorMessage = isSuccess ? undefined : 'Simulated ingestion error';

    // Update the ingestion status
    if (this.ingestionStore[documentId]) {
      this.ingestionStore[documentId].status = status;
      this.ingestionStore[documentId].errorMessage = errorMessage;
    }

    // Emit event for ingestion status update
    this.eventEmitter.emit('ingestion.updated', { documentId, status });

    this.logger.log(`Ingestion ${documentId} updated to status: ${status}`);
  }

  async getIngestionStatus(documentId: number): Promise<IngestionRecord | null> {
    return this.ingestionStore[documentId] || null;
  }

  getEmbedding(documentId: number): any {
    return {
      documentId,
      embedding: [0.1, 0.2, 0.3, 0.4, 0.5], // Mock embedding vector
      message: 'This is a mock embedding vector.',
    };
  }
}
