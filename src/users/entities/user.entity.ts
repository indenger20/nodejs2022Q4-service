import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { IsUUID, IsString } from 'class-validator';

export class User implements InMemoryDBEntity {
  @IsUUID()
  id: string;

  @IsString()
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
