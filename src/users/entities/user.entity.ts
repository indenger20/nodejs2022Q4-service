import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { Exclude } from 'class-transformer';

export class User implements InMemoryDBEntity {
  @Exclude()
  password: string;

  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  update(newPassword: string) {
    this.password = newPassword;
    this.updatedAt = Date.now();
    this.version += 1;

    return this;
  }
}
