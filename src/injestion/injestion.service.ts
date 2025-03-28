import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngestionEntity, IngestionStatus } from 'src/entities/ingestion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    @InjectRepository(IngestionEntity)
    private readonly ingestionRepository: Repository<IngestionEntity>,
  ) {}

  // Trigger ingestion for a given document id.
  async triggerIngestion(documentId: number , userId: number): Promise<IngestionEntity> {
    // Create a new ingestion record with "Processing" status using the enum value.
    const ingestion = this.ingestionRepository.create({
      documentId,
      userId,
      status: IngestionStatus.PROCESSING,
    });
    const saved = await this.ingestionRepository.save(ingestion);

    // Simulate ingestion delay & update status.
    this.simulateIngestionProcess(saved.id);
    return saved;
  }

  // Simulate the asynchronous ingestion process.
  private simulateIngestionProcess(ingestionId: number) {
    // Simulate delay of 5 seconds.
    setTimeout(async () => {
      // Randomly decide if ingestion succeeds or fails (80% chance success).
      const isSuccess = Math.random() > 0.2;
      const status = isSuccess ? IngestionStatus.COMPLETED : IngestionStatus.FAILED;
      const errorMessage = isSuccess ? null : 'Simulated ingestion error';

      try {
        await this.ingestionRepository.update(ingestionId, { status, errorMessage });
        this.logger.log(`Ingestion ${ingestionId} updated to status: ${status}`);
      } catch (err) {
        this.logger.error(`Failed to update ingestion ${ingestionId}: ${err.message}`);
      }
    }, 5000);
  }

  // Retrieve the ingestion status for a given document id.
  async getIngestionStatus(documentId: number): Promise<IngestionEntity[]> {
    return this.ingestionRepository.find({ where: { documentId } });
  }

  // Mock embedding retrieval API.
  getEmbedding(documentId: number): any {
    return {
      documentId,
      embedding: [0.1, 0.2, 0.3, 0.4, 0.5],  // Example vector
      message: 'This is a mock embedding vector.',
    };
  }
}
