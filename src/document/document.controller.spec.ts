import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from 'src/dto/create-document.dto';
import { DocumentEntity } from 'src/entities/document.entity';
import { Readable } from 'stream';

describe('DocumentController', () => {
  let documentController: DocumentController;
  let documentService: DocumentService;

  beforeEach(async () => {
    // Mocking the DocumentService methods
    const mockDocumentService = {
      getAllDocuments: jest.fn(),  // Mocking getAllDocuments method
      getDocumentById: jest.fn(),
      create: jest.fn(),  // Mocking the create method
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,  // Use the mock service
        },
      ],
    }).compile();

    documentController = module.get<DocumentController>(DocumentController);
    documentService = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(documentController).toBeDefined();
  });

  describe('getAllDocuments', () => {
    it('should return an array of documents', async () => {
      // Sample document data to return from the mock service
      const result: DocumentEntity[] = [
        { 
          id: 1, 
          title: 'Document 1', 
          createdAt: new Date('2025-01-01'), 
        }
      ];

      // Cast getAllDocuments method as jest.Mock
      (documentService.getAllDocuments as jest.Mock).mockResolvedValue(result);

      // Ensure that the controller returns the mocked result
      expect(await documentController.getAllDocuments()).toEqual(result);
    });
  });

  describe('getDocumentById', () => {
    it('should return a document by id', async () => {
      const result: DocumentEntity = { 
        id: 1, 
        title: 'Document 1', 
        createdAt: new Date('2025-01-01'),
      };

      // Cast getDocumentById method as jest.Mock
      (documentService.getDocumentById as jest.Mock).mockResolvedValue(result);

      expect(await documentController.getDocumentById(1)).toEqual(result);
    });

    it('should throw NotFoundException if document is not found', async () => {
      // Cast getDocumentById method as jest.Mock
      (documentService.getDocumentById as jest.Mock).mockResolvedValue(null);
      await expect(documentController.getDocumentById(999)).rejects.toThrow(NotFoundException);
    });
  });

  // In your controller test file
describe('create', () => {
  it('should create a document', async () => {
    const createDocumentDto: CreateDocumentDto = { title: 'New Document' };
    const result: DocumentEntity = { 
      id: 1, 
      title: 'New Document',
      createdAt: new Date('2025-01-01'),
    };

    // Mock an Express.Multer.File object
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'document.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from('mock file content'),  // Just a placeholder content
      stream: new Readable(),
      destination: 'uploads/',  // Where the file is stored (optional for mock)
      filename: 'mock-document.pdf',  // Name of the uploaded file (optional for mock)
      path: 'uploads/mock-document.pdf',  // Path to the uploaded file (optional for mock)
    };

    // Mocking the documentService.create method
    (documentService.create as jest.Mock).mockResolvedValue(result);

    // Mocking a user with 'admin' role to pass the authorization check
    const mockUser = { id: 1, role: 'admin' };

    // Pass the mock file instead of null
    expect(await documentController.createDocument({ user: mockUser }, createDocumentDto, mockFile)).toEqual(result);
  });

  it('should throw ForbiddenException if user is not an admin or editor', async () => {
    const createDocumentDto: CreateDocumentDto = { title: 'New Document' };
    (documentService.create as jest.Mock).mockResolvedValue(null);

    // Mocking a user with 'viewer' role to trigger ForbiddenException
    const mockUser = { id: 1, role: 'viewer' };

    // Mock the file (optional in this case, but needed for the test)
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'document.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from('mock file content'),
      stream: new Readable(),
      destination: 'uploads/',
      filename: 'mock-document.pdf',
      path: 'uploads/mock-document.pdf',
    };

    await expect(documentController.createDocument({ user: mockUser }, createDocumentDto, mockFile))
      .rejects.toThrow(ForbiddenException);
  });
});



describe('update', () => {
  it('should update a document if authorized', async () => {
    const updateDocumentDto: CreateDocumentDto = { title: 'Updated Document' };
    const result: DocumentEntity = { 
      id: 1, 
      title: 'Updated Document',
      createdAt: new Date('2025-01-01'),
    };

    // Cast update method as jest.Mock and mock the return value
    (documentService.update as jest.Mock).mockResolvedValue(result);

    // Mocking a user with 'editor' role to pass the authorization check
    const mockUser = { id: 1, role: 'editor' };

    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'document.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from('mock file content'),
      stream: new Readable(),
      destination: 'uploads/',
      filename: 'mock-document.pdf',
      path: 'uploads/mock-document.pdf',
    };

    // Assert that the updateDocument method in the controller calls the service and returns the expected result
    expect(await documentController.updateDocument({ user: mockUser }, 1, updateDocumentDto, mockFile)).toEqual(result);
  });

  it('should throw ForbiddenException if user is not authorized to update the document', async () => {
    const updateDocumentDto: CreateDocumentDto = { title: 'Updated Document' };
    
    // Mocking update method to return null, indicating the update operation failed
    (documentService.update as jest.Mock).mockResolvedValue(null);

    // Mocking a user with 'viewer' role to trigger ForbiddenException
    const mockUser = { id: 1, role: 'viewer' };

    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'document.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from('mock file content'),
      stream: new Readable(),
      destination: 'uploads/',
      filename: 'mock-document.pdf',
      path: 'uploads/mock-document.pdf',
    };

    // Assert that ForbiddenException is thrown when the user is not authorized
    await expect(documentController.updateDocument({ user: mockUser }, 1, updateDocumentDto, mockFile))
      .rejects.toThrow(ForbiddenException);
  });
});


  describe('delete', () => {
    it('should delete a document if authorized', async () => {
      const result = { message: 'Document deleted successfully' };

      // Cast delete method as jest.Mock
      (documentService.delete as jest.Mock).mockResolvedValue(result);

      // Mocking a user with 'editor' role to pass the authorization check
      const mockUser = { id: 1, role: 'editor' };

      expect(await documentController.deleteDocument({ user: mockUser }, 1)).toEqual(result);
    });

    it('should throw ForbiddenException if user is not authorized to delete the document', async () => {
      (documentService.delete as jest.Mock).mockResolvedValue(null);

      // Mocking a user with 'viewer' role to trigger ForbiddenException
      const mockUser = { id: 1, role: 'viewer' };

      await expect(documentController.deleteDocument({ user: mockUser }, 1))
        .rejects.toThrow(ForbiddenException);
    });
  });
});
