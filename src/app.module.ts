import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from 'config/typeorm.config';
import { UserManagementModule } from './user-management/user-management.module';
import { DocumentModule } from './document/document.module';
import { IngestionModule } from './injestion/injestion.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UserManagementModule,
    DocumentModule,
    IngestionModule,
  ]
})
export class AppModule {}
