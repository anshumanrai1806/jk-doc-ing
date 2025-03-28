import { IsInt } from 'class-validator';

export class CreateIngestionDto {
  @IsInt()
  documentId: number;

  @IsInt()
  userId: number;
}
