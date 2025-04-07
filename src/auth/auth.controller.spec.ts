import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = { username: 'testuser', password: 'testpassword' };
      const result = { message: 'User successfully registered' };

      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await authController.register(createUserDto)).toEqual(result);
    });

    it('should throw BadRequestException when registration fails', async () => {
      const createUserDto: CreateUserDto = { username: 'testuser', password: 'testpassword' };

      jest.spyOn(authService, 'register').mockRejectedValue(new BadRequestException('Registration failed'));

      try {
        await authController.register(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Registration failed');
      }
    });
  });

  describe('login', () => {
    it('should log in the user and return an access token', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'testpassword' };
  
      const result = { accessToken: 'some_jwt_token' };
  
      jest.spyOn(authService, 'login').mockResolvedValue(result);
  
      expect(await authController.login(loginDto)).toEqual(result);
    });

    it('should throw BadRequestException when login fails', async () => {
      const loginDto: LoginDto = { username: 'wronguser', password: 'wrongpassword' };

      jest.spyOn(authService, 'login').mockRejectedValue(new BadRequestException('Invalid credentials'));

      try {
        await authController.login(loginDto);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Invalid credentials');
      }
    });
  });

  describe('logout', () => {
    it('should log out the user successfully', async () => {
      const result = { message: 'User logged out successfully' };

      jest.spyOn(authService, 'logout').mockResolvedValue(result);

      expect(await authController.logout()).toEqual(result);
    });
  });
});
