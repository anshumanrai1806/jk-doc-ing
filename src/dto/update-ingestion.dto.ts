import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IngestionStatus } from 'src/entities/ingestion.entity';

export class UpdateIngestionDto {
  @IsEnum(IngestionStatus)
  status: IngestionStatus;

  @IsOptional()
  @IsString()
  errorMessage?: string;
}
