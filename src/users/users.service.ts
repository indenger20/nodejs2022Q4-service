import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4, validate } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectInMemoryDBService('users')
    private db: InMemoryDBService<User>,
  ) {}

  create({ login, password }: CreateUserDto) {
    const newUser = new User({
      login,
      password,
      id: v4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const user = this.db.create(newUser);
    return user;
  }

  findAll() {
    const users = this.db.getAll();
    return users;
  }

  findOne(id: string) {
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const user = this.db.get(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  update(id: string, { oldPassword, newPassword }: UpdateUserDto) {
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const user = this.db.get(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.password !== oldPassword) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const updatedUser = { ...user, password: newPassword };

    this.db.update(updatedUser);

    return updatedUser;
  }

  remove(id: string) {
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const user = this.db.get(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    this.db.delete(id);
    return null;
  }
}
