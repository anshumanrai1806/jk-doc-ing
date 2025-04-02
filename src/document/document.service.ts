import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDocumentDto } from 'src/dto/create-document.dto';
import { DocumentEntity } from 'src/entities/document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
  ) { }

  async getAllDocuments(): Promise<DocumentEntity[]> {
    return this.documentRepository.find();
  }

  async getDocumentById(id: number): Promise<DocumentEntity> {
    const doc = await this.documentRepository.findOne({ where: { id } });
    if (!doc) {
      throw new NotFoundException('Document not found');
    }
    return doc;
  }

  async create(createDocumentDto: CreateDocumentDto, userId: number, file?: Express.Multer.File): Promise<DocumentEntity> {
    let fileChunks: string[] = [];

    if (file && file.buffer) {
      // Convert file buffer to a base64-encoded string
      const fileContentBase64 = file.buffer.toString('base64');
      const chunkSize = 1024; // adjust as needed
      for (let i = 0; i < fileContentBase64.length; i += chunkSize) {
        fileChunks.push(fileContentBase64.substring(i, i + chunkSize));
      }
    } else {
      // If file is not provided, you could throw an error or set fileChunks to undefined
      fileChunks = [];
    }

    const newDoc = this.documentRepository.create({
      title: createDocumentDto.title,
      userId,
      filename: file ? file.originalname : undefined,
      filePath: undefined,
      mimeType: file ? file.mimetype : undefined,
      fileChunks: fileChunks,
    } as Partial<DocumentEntity>);

    return this.documentRepository.save(newDoc);
  }

  async update(
    doc_id: number,
    updateDocumentDto: CreateDocumentDto, // or UpdateDocumentDto if available,
    id,
    isAdmin,
    file?: Express.Multer.File  
  ): Promise<DocumentEntity> {

    const document = await this.documentRepository.findOne({ where: { id: doc_id } });

    if (!document) {
      throw new NotFoundException('Document not found.');
    }

    // Check if the user is authorized to update
    if (document.userId !== id && !isAdmin) {
      throw new ForbiddenException('Editors can only update their own documents.');
    }

    let updateData: Partial<DocumentEntity> = {
      title: updateDocumentDto.title
    };

    if (file && file.buffer) {
      // Convert file buffer to base64 and break into chunks
      const fileContentBase64 = file.buffer.toString('base64');
      const chunkSize = 1024; // adjust chunk size as needed
      const fileChunks: string[] = [];
      for (let i = 0; i < fileContentBase64.length; i += chunkSize) {
        fileChunks.push(fileContentBase64.substring(i, i + chunkSize));
      }
      updateData = {
        ...updateData,
        filename: file.originalname,
        mimeType: file.mimetype,
        fileChunks: fileChunks,
      };
    }

    await this.documentRepository.update(doc_id, updateData);
    return this.getDocumentById(id);
  }

  async delete(doc_id: number , id: number, isAdmin): Promise<{ message: string }> {
    const document = await this.documentRepository.findOne({ where: { id: doc_id } });

    if (!document) {
      throw new NotFoundException('Document not found.');
    }

    // Check if the user is authorized to update
    if (document.userId !== id && !isAdmin) {
      throw new ForbiddenException('Editors can only update their own documents.');
    }
    
    await this.documentRepository.delete(id);
    return { message: 'Document deleted successfully' };
  }
}
