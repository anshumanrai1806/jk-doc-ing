import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from 'src/entities/user.entity';
import { CreateDocumentDto } from 'src/dto/create-document.dto';
import { DocumentEntity } from 'src/entities/document.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { DocumentService } from './document.service';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) { }

  @Get()
  @Roles(UserRole.VIEWER, UserRole.EDITOR, UserRole.ADMIN) // All roles can view
  async getAllDocuments(): Promise<DocumentEntity[]> {
    return this.documentService.getAllDocuments();
  }

  @Get(':id')
  @Roles(UserRole.VIEWER, UserRole.EDITOR, UserRole.ADMIN)
  async getDocumentById(@Param('id') id: number): Promise<DocumentEntity> {
    return this.documentService.getDocumentById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new document (Editor/Admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Document Title' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional file upload',
        },
      },
      required: ['title'],
    },
  })
  async createDocument(
    @Req() req,
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const { role , id} = req.user;
    if (role !== 'admin' && role !== 'editor') {
      throw new ForbiddenException('Only editors and admins can create documents.');
    }
    return this.documentService.create(createDocumentDto, id, file);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a document (Editor/Admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Document Title' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional file upload',
        },
      },
      required: ['title'],
    },
  })
  async updateDocument(
    @Req() req,
    @Param('id') id: number,
    @Body() updateDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const { role } = req.user;
    if (role !== 'admin' && role !== 'editor') {
      throw new ForbiddenException('Only editors and admins can update documents.');
    }
    return this.documentService.update(id, updateDocumentDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a document (Editor/Admin only)' })
  async deleteDocument(
    @Req() req,
    @Param('id') id: number
  ) {
    const { role } = req.user;
    if (role !== 'admin' && role !== 'editor') {
      throw new ForbiddenException('Only editors and admins can delete documents.');
    }
    return this.documentService.delete(id);
  }

}
