import * as dotenv from 'dotenv';
import * as path from 'path';

// Load root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Next.js frontend
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL, // Render deployment URL
  ].filter(Boolean);

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        }
      : allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 OilERP NestJS API running on port ${port}`);
}
bootstrap();
