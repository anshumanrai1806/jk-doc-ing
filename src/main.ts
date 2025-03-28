import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

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
