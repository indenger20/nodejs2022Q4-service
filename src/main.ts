import { writeFile } from 'node:fs/promises';
import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

const DEFAULT_PORT = '4000';

console.log('port', env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('REST example')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFile('./doc/api.yml', JSON.stringify(document));

  SwaggerModule.setup('api', app, document);
  await app.listen(env.PORT ?? DEFAULT_PORT);
}
bootstrap();
