import { Module } from '@nestjs/common';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [InMemoryDBModule.forRoot({}), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
