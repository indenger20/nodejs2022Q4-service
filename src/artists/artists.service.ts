import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/albums/entities/album.entity';
import { FavoriteEnum } from 'src/favorites/interface/favoriteTypes';
import { FavoriteStore } from 'src/favorites/interface/store';
import {
  removeFromFavorites,
  removeFromResources,
} from 'src/share/utils/helpers';
import { Validator } from 'src/share/validator';
import { Track } from 'src/tracks/entities/track.entity';
import { v4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectInMemoryDBService('artists')
    private db: InMemoryDBService<Artist>,
    @InjectInMemoryDBService('tracks')
    private trackDb: InMemoryDBService<Track>,
    @InjectInMemoryDBService('albums')
    private albumDb: InMemoryDBService<Album>,
    @InjectInMemoryDBService('favorites')
    private favoriteDb: InMemoryDBService<FavoriteStore>,
  ) {}

  private removeIdFromTracks(id: string) {
    removeFromResources({
      id,
      db: this.trackDb,
      key: 'artistId',
      Model: Track,
    });
  }

  private removeIdFromAlbums(id: string) {
    removeFromResources({
      id,
      db: this.albumDb,
      key: 'artistId',
      Model: Album,
    });
  }

  private removeIdFromFav(id: string) {
    removeFromFavorites({ db: this.favoriteDb, id, type: FavoriteEnum.ARTIST });
  }

  private removeFromResources(id: string) {
    this.removeIdFromTracks(id);
    this.removeIdFromAlbums(id);
    this.removeIdFromFav(id);
  }

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
    Validator.isIdUuid(id);

    const artist = this.db.get(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    Validator.isIdUuid(id);

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
    Validator.isIdUuid(id);

    const artist = this.db.get(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    this.db.delete(id);
    this.removeFromResources(id);
    return null;
  }
}
