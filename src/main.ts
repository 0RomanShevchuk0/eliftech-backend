import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './filters/exception.filter';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ExceptionsFilter(), new PrismaExceptionFilter());

  const allowedDomains = process.env.ALLOWED_ORIGINS?.split(',') || [];
  console.log('allowedDomains:', allowedDomains);

  app.enableCors({
    origin: allowedDomains,
    methods: 'PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
