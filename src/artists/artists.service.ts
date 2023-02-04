import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4, validate } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectInMemoryDBService('artists')
    private db: InMemoryDBService<Artist>,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const newArtist = new Artist({
      id: v4(),
      ...createArtistDto,
    });
    const artist = this.db.create(newArtist);
    return artist;
  }

  findAll() {
    const artists = this.db.getAll();
    return artists;
  }

  findOne(id: string) {
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const artist = this.db.get(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const artistDto = this.db.get(id);
    if (!artistDto) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    const artist = new Artist(artistDto);
    const updatedArtist = artist.update(updateArtistDto);

    this.db.update(updatedArtist);

    return updatedArtist;
  }

  remove(id: string) {
    if (validate(id) === false) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const artist = this.db.get(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    this.db.delete(id);
    return null;
  }
}
