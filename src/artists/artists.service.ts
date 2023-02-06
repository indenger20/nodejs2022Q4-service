import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/albums/entities/album.entity';
import { FavoriteEnum } from 'src/favorites/interface/favoriteTypes';
import { FavoriteStore } from 'src/favorites/interface/store';
import { Validator } from 'src/share/validator';
import { UpdateTrackDto } from 'src/tracks/dto/update-track.dto';
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
    const tracks = this.trackDb.query((track) => track.artistId === id);

    if (tracks.length) {
      tracks.forEach((trackDto) => {
        const track = new Track(trackDto);
        const updatedTrack = track.update({ artistId: null });
        this.trackDb.update(updatedTrack);
      });
    }
  }

  private removeIdFromAlbums(id: string) {
    const albums = this.albumDb.query((album) => album.artistId === id);

    if (albums.length) {
      albums.forEach((albumDto) => {
        const album = new Album(albumDto);
        const updatedAlbum = album.update({ artistId: null });
        this.albumDb.update(updatedAlbum);
      });
    }
  }

  private removeIdFromFav(id: string) {
    const favs = this.favoriteDb.getAll();
    const artistIds = favs.find((fav) => fav.id === FavoriteEnum.ARTIST);

    const filteredIds = artistIds?.data.filter((artistId) => artistId !== id);
    this.favoriteDb.update({
      id: FavoriteEnum.ARTIST,
      data: filteredIds,
    } as FavoriteStore);
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
