import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Track } from 'src/tracks/entities/track.entity';
import { validate } from 'uuid';
import { FavoriteType } from './interface/favoriteTypes';
import { FavoriteStore } from './interface/store';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectInMemoryDBService('favorites')
    private db: InMemoryDBService<FavoriteStore>,
    @InjectInMemoryDBService('tracks')
    private tracksDb: InMemoryDBService<Track>,
  ) {}

  private resolveEntity(type: FavoriteType) {
    const entity = this.db.get(type);

    if (!entity) {
      this.db.create({ id: type, data: [] });
    }

    const existingEntity = this.db.get(type);
    return existingEntity;
  }

  private validateResoure(type: FavoriteType, id: string) {
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const resource = this[`${type}Db`].get(id);

    if (!resource) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    }
  }

  private prepareFavResponse(favs: FavoriteStore[]) {
    const favsWithData = favs.map((fav) => {
      const data = this[`${fav.id}Db`].getMany(fav.data);
      return {
        id: fav.id,
        data,
      };
    });

    const result = favsWithData.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr.data,
      };
    }, {});
    return result;
  }

  findAll() {
    const favs = this.db.getAll();

    const result = this.prepareFavResponse(favs);

    return result;
  }

  create(type: FavoriteType, id: string) {
    const favEntity = this.resolveEntity(type);

    this.validateResoure(type, id);

    if (favEntity.data.includes(id)) {
      throw new HttpException(
        'Resource already in favorites',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.db.update({
      ...favEntity,
      data: [...favEntity.data, id],
    });

    const updatedEntity = this.resolveEntity(type);

    return updatedEntity;
  }

  remove(type: FavoriteType, id: string) {
    const favEntity = this.resolveEntity(type);

    this.validateResoure(type, id);

    if (!favEntity.data.includes(id)) {
      throw new HttpException(
        'Resource is not in favorites',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedData = favEntity.data.filter((favId) => favId !== id);

    this.db.update({
      ...favEntity,
      data: updatedData,
    });

    return null;
  }
}
