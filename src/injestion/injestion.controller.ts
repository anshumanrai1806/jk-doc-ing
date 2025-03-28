import { Controller, Post, Body, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IngestionService } from './injestion.service';
import { CreateIngestionDto } from 'src/dto/create-ingestion.dto';

@ApiTags('Ingestion')
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Trigger ingestion for a document' })
  async triggerIngestion(@Body() createIngestionDto: CreateIngestionDto) {
    const { documentId, userId } = createIngestionDto;
    if (!documentId || !userId) {
      throw new HttpException('documentId and userId are required', HttpStatus.BAD_REQUEST);
    }
    // Pass both documentId and userId to the service (make sure your service accepts both)
    return this.ingestionService.triggerIngestion(documentId, userId);
  }

  @Get('status/:documentId')
  @ApiOperation({ summary: 'Check ingestion status for a document' })
  async getStatus(@Param('documentId', ParseIntPipe) documentId: number) {
    const status = await this.ingestionService.getIngestionStatus(documentId);
    if (!status || status.length === 0) {
      throw new HttpException('No ingestion found for this document', HttpStatus.NOT_FOUND);
    }
    return status;
  }

  @Get('embedding/:documentId')
  @ApiOperation({ summary: 'Retrieve mock embedding for a document' })
  getEmbedding(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.ingestionService.getEmbedding(documentId);
  }
}
