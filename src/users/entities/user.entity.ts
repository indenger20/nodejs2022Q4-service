import { IsUUID } from 'class-validator';

export class User {
  @IsUUID()
  id: string;

  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
