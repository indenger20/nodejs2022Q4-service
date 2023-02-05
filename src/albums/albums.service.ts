import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = new Album({
      id: v4(),
      ...createAlbumDto,
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
    return null;
  }
}
