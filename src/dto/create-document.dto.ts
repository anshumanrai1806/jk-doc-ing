import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Title of the document' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
