import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function parseOrigins(value?: string) {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //✅ Enable CORS
  const allowedOrigins = [
    ...parseOrigins(process.env.CORS_ORIGINS),
    'http://localhost:4200',
    'http://localhost:45299',
  ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true); // allow this origin
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  // app.enableCors({
  //   origin: '*', // or '*' for all origins
  //   methods: 'GET,POST,PUT,DELETE,OPTIONS',
  //   allowedHeaders: '*',
  // });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
