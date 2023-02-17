import { Module } from '@nestjs/common';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [InMemoryDBModule.forFeature('users', {})],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
