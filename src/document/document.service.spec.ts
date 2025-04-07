import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocumentEntity } from 'src/entities/document.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateDocumentDto } from 'src/dto/create-document.dto';

describe('DocumentService', () => {
  let documentService: DocumentService;
  let documentRepository: Repository<DocumentEntity>;

  beforeEach(async () => {
    // Mocking the Repository methods with jest.fn()
    documentRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as Repository<DocumentEntity>;  // Cast to the correct type

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: getRepositoryToken(DocumentEntity), useValue: documentRepository }, // Use mocked repository
      ],
    }).compile();

    documentService = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(documentService).toBeDefined();
  });

  describe('getAllDocuments', () => {
    it('should return an array of documents', async () => {
      const result = [{ id: 1, title: 'Document 1' }];
      (documentRepository.find as jest.Mock).mockResolvedValue(result); // Mock find() method

      expect(await documentService.getAllDocuments()).toEqual(result);
    });
  });

  describe('getDocumentById', () => {
    it('should return a document by id', async () => {
      const result = { id: 1, title: 'Document 1' };
      (documentRepository.findOne as jest.Mock).mockResolvedValue(result); // Mock findOne() method

      expect(await documentService.getDocumentById(1)).toEqual(result);
    });

    it('should throw NotFoundException if document is not found', async () => {
      (documentRepository.findOne as jest.Mock).mockResolvedValue(null); // Simulate document not found
      await expect(documentService.getDocumentById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a document', async () => {
      const createDocumentDto: CreateDocumentDto = { title: 'New Document' };
      const result = { id: 1, title: 'New Document' };
      (documentRepository.save as jest.Mock).mockResolvedValue(result); // Mock save() method

      expect(await documentService.create(createDocumentDto, 1)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a document if the user is authorized', async () => {
      const updateDocumentDto: CreateDocumentDto = { title: 'Updated Document' };
      const result = { id: 1, title: 'Updated Document' };
      (documentRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, userId: 1 }); // Mock findOne()
      (documentRepository.update as jest.Mock).mockResolvedValue(result); // Mock update()

      expect(await documentService.update(1, updateDocumentDto, 1, true)).toEqual(result);
    });

    it('should throw ForbiddenException if the user is not authorized to update the document', async () => {
      (documentRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, userId: 2 }); // Simulate unauthorized user

      await expect(documentService.update(1, { title: 'Updated Document' }, 1, false)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete a document if the user is authorized', async () => {
      const result = { message: 'Document deleted successfully' };
      (documentRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, userId: 1 }); // Mock findOne()
      (documentRepository.delete as jest.Mock).mockResolvedValue(result); // Mock delete()

      expect(await documentService.delete(1, 1, true)).toEqual(result);
    });

    it('should throw ForbiddenException if the user is not authorized to delete the document', async () => {
      (documentRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, userId: 2 }); // Simulate unauthorized user

      await expect(documentService.delete(1, 1, false)).rejects.toThrow(ForbiddenException);
    });
  });
});
