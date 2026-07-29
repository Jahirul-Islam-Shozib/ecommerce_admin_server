import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

function parseOrigins(value?: string) {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase body size limit for base64 image uploads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // ✅ Enable CORS
  const allowedOrigins = [
    ...parseOrigins(process.env.CORS_ORIGINS),
    'http://localhost:4200',
    'http://localhost:35981',
    'http://172.16.234.38:4401',
    'http://172.16.234.38:4400',
    'https://sq-products.jotno.dev',
    'https://sqp-admin.jotno.dev',
  ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // allow requests with no origin (like Postman/curl)
      if (!origin) return callback(null, true);

      // don't throw — just pass false so CORS headers are still returned correctly
      callback(null, allowedOrigins.includes(origin));
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
