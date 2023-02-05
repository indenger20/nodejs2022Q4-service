import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Artist } from 'src/artists/entities/artist.entity';
import { v4, validate } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectInMemoryDBService('albums')
    private albumDb: InMemoryDBService<Album>,
    @InjectInMemoryDBService('artists')
    private artistDb: InMemoryDBService<Artist>,
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
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const album = this.albumDb.get(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

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
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const album = this.albumDb.get(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    this.albumDb.delete(id);
    return null;
  }
}
