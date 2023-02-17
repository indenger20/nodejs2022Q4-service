import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Artist } from 'src/artists/entities/artist.entity';
import { FavoriteEnum } from 'src/favorites/interface/favoriteTypes';
import { FavoriteStore } from 'src/favorites/interface/store';
import {
  removeFromFavorites,
  removeFromResources,
} from 'src/share/utils/helpers';
import { Validator } from 'src/share/validator';
import { Track } from 'src/tracks/entities/track.entity';
import { v4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectInMemoryDBService('albums')
    private albumDb: InMemoryDBService<Album>,
    @InjectInMemoryDBService('tracks')
    private trackDb: InMemoryDBService<Track>,
    @InjectInMemoryDBService('artists')
    private artistDb: InMemoryDBService<Artist>,
    @InjectInMemoryDBService('favorites')
    private favoriteDb: InMemoryDBService<FavoriteStore>,
  ) {}

  private removeIdFromTracks(id: string) {
    removeFromResources({
      id,
      db: this.trackDb,
      key: 'albumId',
      Model: Track,
    });
  }

  private removeIdFromFav(id: string) {
    removeFromFavorites({ db: this.favoriteDb, id, type: FavoriteEnum.ALBUM });
  }

  private removeFromResources(id: string) {
    this.removeIdFromTracks(id);
    this.removeIdFromFav(id);
  }

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = new Album({
      id: v4(),
      ...createAlbumDto,
    });

    Validator.isResoureExists({
      db: this.artistDb,
      id: newAlbum.artistId,
      key: 'Artist',
    });

    const album = this.albumDb.create(newAlbum);

    return album;
  }

  findAll() {
    const albums = this.albumDb.getAll();
    return albums;
  }

  findOne(id: string) {
    Validator.isIdUuid(id);

    const album = this.albumDb.get(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    Validator.isIdUuid(id);

    const albumDto = this.albumDb.get(id);
    if (!albumDto) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    const album = new Album(albumDto);
    const updatedAlbum = album.update(updateAlbumDto);

    Validator.isResoureExists({
      db: this.artistDb,
      id: updatedAlbum.artistId,
      key: 'Artist',
    });

    this.albumDb.update(updatedAlbum);

    return updatedAlbum;
  }

  remove(id: string) {
    Validator.isIdUuid(id);

    const album = this.albumDb.get(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    this.albumDb.delete(id);
    this.removeFromResources(id);
    return null;
  }
}
