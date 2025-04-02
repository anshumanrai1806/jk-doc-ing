import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EventEmitter2 } from '@nestjs/event-emitter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend & Swagger
  app.enableCors({
    origin: '*', // Change to frontend URL for production
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000); // Use PORT from .env, default to 3000

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
    },
  });
  await microservice.listen();
  console.log('📢 Microservice for Ingestion started');

  // Event Emitter (For Ingestion Events)
  const eventEmitter = app.get(EventEmitter2);
  eventEmitter.emit('app.started', {});

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Document-Management API')
    .setDescription('API documentation for Document-Management')
    .setVersion('1.0')
    .addTag('Users') // Tag for user module
    .addBearerAuth() // Add Authorization Header
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keeps auth tokens across reloads
      tryItOutEnabled: true, // Enables Try It Out by default
    },
  });

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📄 Swagger UI available at http://localhost:${port}/api`);
}
declare const module: any;

// Automatically refresh Swagger on backend changes
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => bootstrap());
}

bootstrap();
