import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto = { username: 'testuser', password: 'testpassword' };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Mock user repository behavior
      userRepositoryMock.findOne.mockResolvedValue(null); // No user with the same username
      userRepositoryMock.save.mockResolvedValue({ ...createUserDto, password: hashedPassword });

      const result = await authService.register(createUserDto);

      expect(result).toEqual({ message: 'User registered successfully' });
      expect(userRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
        username: createUserDto.username,
        password: hashedPassword,
        role: 'viewer', // Default role for new users
      }));
    });

    it('should throw ConflictException if username already exists', async () => {
      const createUserDto = { username: 'testuser', password: 'testpassword' };

      // Mock user repository behavior
      userRepositoryMock.findOne.mockResolvedValue({ username: 'testuser' }); // User exists

      await expect(authService.register(createUserDto)).rejects.toThrow(ConflictException);
      await expect(authService.register(createUserDto)).rejects.toThrow('Username already exists');
    });
  });

  describe('login', () => {
    it('should log in and return an access token', async () => {
      const loginDto = { username: 'testuser', password: 'testpassword' };
      const user = { id: 1, username: 'testuser', password: await bcrypt.hash('testpassword', 10), role: 'viewer' };

      // Mock user repository behavior
      userRepositoryMock.findOne.mockResolvedValue(user);
      jwtServiceMock.sign.mockReturnValue('mocked-jwt-token');

      const result = await authService.login(loginDto);

      expect(result).toEqual({ accessToken: 'mocked-jwt-token' });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
        role: user.role,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginDto = { username: 'nonexistentuser', password: 'testpassword' };

      // Mock user repository behavior
      userRepositoryMock.findOne.mockResolvedValue(null); // User not found

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(authService.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto = { username: 'testuser', password: 'wrongpassword' };
      const user = { id: 1, username: 'testuser', password: await bcrypt.hash('testpassword', 10), role: 'viewer' };

      // Mock user repository behavior
      userRepositoryMock.findOne.mockResolvedValue(user);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(authService.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should return a success message on logout', async () => {
      const result = await authService.logout();
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });
});
