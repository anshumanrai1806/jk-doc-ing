import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers() {
    const users = [
      { username: 'Anshuman', password: 'password', role: UserRole.EDITOR },
      { username: 'admin', password: 'password', role: UserRole.ADMIN },
    ];

    for (const user of users) {
      const existingUser = await this.userRepository.findOne({ where: { username: user.username } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await this.userRepository.create({ ...user, password: hashedPassword });
        await this.userRepository.save(newUser);
        this.logger.log(`Created default user: ${user.username}`);
      } else {
        this.logger.log(`User already exists: ${user.username}`);
      }
    }
  }
}
