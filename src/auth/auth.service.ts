import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  // Register a new user
  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { username, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      role: UserRole.VIEWER,  // Explicitly cast the role
    });


    await this.userRepository.save(newUser);
    return { message: 'User registered successfully' };
  }

  // User login and JWT token generation
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(user);
    const payload = { sub: user.id, username: user.username, role: user.role }; // Include role
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  // Logout (Handled client-side by removing JWT)
  async logout(): Promise<{ message: string }> {
    return { message: 'Logout successful' };
  }
}
