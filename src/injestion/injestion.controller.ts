import { Controller, Post, Body, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IngestionRecord, IngestionService } from './injestion.service';

@ApiTags('Ingestion')
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) { }

  @Post('trigger')
  @ApiOperation({ summary: 'Trigger ingestion for a document' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        documentId: { type: 'number', example: 123 },
        userId: { type: 'number', example: 456 },
      },
    },
  })
  async triggerIngestion(@Body() body: { documentId: number; userId: number }) {
    return this.ingestionService.triggerIngestion(body.documentId, body.userId);
  }

  @Get('status/:documentId')
  @ApiOperation({ summary: 'Check ingestion status for a document' })
  async getStatus(@Param('documentId', ParseIntPipe) documentId: number) {
    const status = await this.ingestionService.getIngestionStatus(documentId);
    if (!status) {
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
