import { Controller, Put, Param, Body, Delete, Req, UseGuards, ForbiddenException, Get } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserRole } from 'src/entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UpdateUserRoleDto } from 'src/dto/role.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) { }

  @Put(':id/role')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user’s role (Admin only)' })
  @ApiBody({ type: UpdateUserRoleDto }) // ✅ Explicitly define request body schema
  async updateRole(
    @Req() req,
    @Param('id') userId: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ) {
    const { role } = req.user;
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update user roles.');
    }
    return this.userManagementService.updateUserRole(userId, updateUserRoleDto.role);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user (Admin only)' })
  async deleteUser(
    @Req() req,
    @Param('id') userId: number
  ) {
    const { role } = req.user;
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users.');
    }
    return this.userManagementService.deleteUser(userId);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch all users (Admin only)' })
  async getAllUsers(@Req() req) {
    const { role } = req.user;
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can view all users.');
    }
    return this.userManagementService.getAllUsers();
  }
}
