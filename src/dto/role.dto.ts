import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole, description: 'New role to assign to the user' })
  @IsEnum(UserRole)
  role: UserRole;
}
