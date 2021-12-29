import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as winston from 'winston';
import { AppModule } from './app.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
  WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('n2s3', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  //app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(3000);
}
bootstrap();
