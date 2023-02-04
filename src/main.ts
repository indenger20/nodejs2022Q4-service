import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PORT = '4000';

console.log('port', env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.PORT ?? DEFAULT_PORT);
}
bootstrap();
