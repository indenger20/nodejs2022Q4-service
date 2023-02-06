import { HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'uuid';

export class Validator {
  static isIdUuid(id: string) {
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
  }

  static isResoureExists({
    key,
    id,
    db,
  }: {
    key: string;
    id: string;
    db: any;
  }) {
    if (!id) {
      return;
    }
    const resource = db.get(id);
    if (!resource) {
      throw new HttpException(`${key} not found`, HttpStatus.NOT_FOUND);
    }
  }
}
