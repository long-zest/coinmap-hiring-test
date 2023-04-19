import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import { ValidationException } from './exceptions/validation.exception';
import { ValidationFilter } from './exceptions/validation.filter';

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);
  
  app.enableCors()

  app.useGlobalFilters(
    new ValidationFilter()
  )

  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const messages = errors.map(
        error => `${error.property} has wrong value '${error.value}', ${Object.values(error.constraints).join(', ')}`
      )

      return new ValidationException(messages)
    }
  }))

  app.useGlobalInterceptors(new TransformInterceptor())
  const port = 3333
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap();
