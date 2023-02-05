import { HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'uuid';

export class Validator {
  static isIdUuid(id: string) {
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
  }
}
