import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Validator } from 'src/share/validator';
import { Track } from 'src/tracks/entities/track.entity';
import { FavoriteEnum } from './interface/favoriteTypes';
import { FavoriteStore } from './interface/store';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectInMemoryDBService('favorites')
    private db: InMemoryDBService<FavoriteStore>,
    @InjectInMemoryDBService('tracks')
    private trackDb: InMemoryDBService<Track>,
    @InjectInMemoryDBService('albums')
    private albumDb: InMemoryDBService<Album>,
    @InjectInMemoryDBService('artists')
    private artistDb: InMemoryDBService<Artist>,
  ) {}

  private typesMapper(type: FavoriteEnum) {
    const types = {
      [FavoriteEnum.ARTIST]: 'artists',
      [FavoriteEnum.ALBUM]: 'albums',
      [FavoriteEnum.TRACK]: 'tracks',
    };

    return types[type];
  }

  private resolveEntity(type: FavoriteEnum) {
    const entity = this.db.get(type);

    if (!entity) {
      this.db.create({ id: type, data: [] });
    }

    const existingEntity = this.db.get(type);
    return existingEntity;
  }

  private validateResoure(type: FavoriteEnum, id: string) {
    Validator.isIdUuid(id);

    const resource = this[`${type}Db`].get(id);

    if (!resource) {
      throw new HttpException(
        'Resource not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
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

    const result = favsWithData.reduce(
      (acc, curr) => {
        const key = this.typesMapper(curr.id);
        return {
          ...acc,
          [key]: curr.data,
        };
      },
      {
        [this.typesMapper(FavoriteEnum.ARTIST)]: [],
        [this.typesMapper(FavoriteEnum.ALBUM)]: [],
        [this.typesMapper(FavoriteEnum.TRACK)]: [],
      },
    );
    return result;
  }

  findAll() {
    const favs = this.db.getAll();

    const result = this.prepareFavResponse(favs);

    return result;
  }

  create(type: FavoriteEnum, id: string) {
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

  remove(type: FavoriteEnum, id: string) {
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
