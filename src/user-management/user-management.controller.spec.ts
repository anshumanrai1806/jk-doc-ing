import { Test, TestingModule } from '@nestjs/testing';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from 'src/entities/user.entity';
import { UpdateUserRoleDto } from 'src/dto/role.dto';

describe('UserManagementController', () => {
  let userManagementController: UserManagementController;
  let userManagementService: UserManagementService;

  const mockUser = { id: 1, role: UserRole.ADMIN }; // Mocked admin user for authorization checks

  beforeEach(async () => {
    const mockUserManagementService = {
      updateUserRole: jest.fn(),
      deleteUser: jest.fn(),
      getAllUsers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserManagementController],
      providers: [
        {
          provide: UserManagementService,
          useValue: mockUserManagementService,
        },
      ],
    }).compile();

    userManagementController = module.get<UserManagementController>(UserManagementController);
    userManagementService = module.get<UserManagementService>(UserManagementService);
  });

  it('should be defined', () => {
    expect(userManagementController).toBeDefined();
  });

  describe('updateRole', () => {
    it('should update user role if user is an admin', async () => {
      const updateUserRoleDto: UpdateUserRoleDto = { role: UserRole.EDITOR };
      const result = { id: 1, role: UserRole.EDITOR };

      (userManagementService.updateUserRole as jest.Mock).mockResolvedValue(result);

      expect(
        await userManagementController.updateRole(
          { user: mockUser },
          1,
          updateUserRoleDto,
        ),
      ).toEqual(result);
    });

    it('should throw ForbiddenException if user is not an admin', async () => {
      const updateUserRoleDto: UpdateUserRoleDto = { role: UserRole.EDITOR };
      const mockNonAdminUser = { id: 1, role: UserRole.VIEWER }; // Mock non-admin user

      await expect(
        userManagementController.updateRole(
          { user: mockNonAdminUser },
          1,
          updateUserRoleDto,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user if user is an admin', async () => {
      const result = undefined; // No return expected for void methods

      (userManagementService.deleteUser as jest.Mock).mockResolvedValue(result);

      await expect(
        userManagementController.deleteUser({ user: mockUser }, 1),
      ).resolves.toEqual(result);
    });

    it('should throw ForbiddenException if user is not an admin', async () => {
      const mockNonAdminUser = { id: 1, role: UserRole.VIEWER }; // Mock non-admin user

      await expect(
        userManagementController.deleteUser({ user: mockNonAdminUser }, 1),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users if user is an admin', async () => {
      const users = [{ id: 1, role: UserRole.ADMIN }];
      (userManagementService.getAllUsers as jest.Mock).mockResolvedValue(users);

      expect(await userManagementController.getAllUsers({ user: mockUser })).toEqual(users);
    });

    it('should throw ForbiddenException if user is not an admin', async () => {
      const mockNonAdminUser = { id: 1, role: UserRole.VIEWER }; // Mock non-admin user

      await expect(
        userManagementController.getAllUsers({ user: mockNonAdminUser }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
