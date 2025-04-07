import { Test, TestingModule } from '@nestjs/testing';
import { UserManagementService } from './user-management.service';
import { User, UserRole } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserManagementService', () => {
  let userManagementService: UserManagementService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserManagementService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userManagementService = module.get<UserManagementService>(UserManagementService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userManagementService).toBeDefined();
  });

  describe('updateUserRole', () => {
    it('should update a user role', async () => {
      const user = { id: 1, role: 'viewer' } as User;
      const newRole: UserRole = UserRole.EDITOR;
      const updatedUser = { ...user, role: newRole };

      userRepository.findOne = jest.fn().mockResolvedValue(user);
      userRepository.save = jest.fn().mockResolvedValue(updatedUser);

      expect(await userManagementService.updateUserRole(1, newRole)).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      const newRole: UserRole = UserRole.EDITOR;

      await expect(userManagementService.updateUserRole(1, newRole)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      userRepository.delete = jest.fn().mockResolvedValue({});

      await expect(userManagementService.deleteUser(1)).resolves.not.toThrow();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, role: 'admin' }];
      userRepository.find = jest.fn().mockResolvedValue(users);

      expect(await userManagementService.getAllUsers()).toEqual(users);
    });
  });
});
