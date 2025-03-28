import { UserRole } from 'src/entities/user.entity';

export const RolePermissions = {
  [UserRole.VIEWER]: ['read'],
  [UserRole.EDITOR]: ['read', 'write'],
  [UserRole.ADMIN]: ['read', 'write', 'manage'],
};
