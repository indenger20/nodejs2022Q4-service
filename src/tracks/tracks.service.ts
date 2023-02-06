import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { FavoriteEnum } from 'src/favorites/interface/favoriteTypes';
import { FavoriteStore } from 'src/favorites/interface/store';
import { removeFromFavorites } from 'src/share/utils/helpers';
import { Validator } from 'src/share/validator';
import { v4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectInMemoryDBService('tracks')
    private trackDb: InMemoryDBService<Track>,
    @InjectInMemoryDBService('artists')
    private artistDb: InMemoryDBService<Artist>,
    @InjectInMemoryDBService('albums')
    private albumDb: InMemoryDBService<Album>,
    @InjectInMemoryDBService('favorites')
    private favoriteDb: InMemoryDBService<FavoriteStore>,
  ) {}

  private removeIdFromFav(id: string) {
    removeFromFavorites({ db: this.favoriteDb, id, type: FavoriteEnum.TRACK });
  }

  private removeFromResources(id: string) {
    this.removeIdFromFav(id);
  }

  create(createTrackDto: CreateTrackDto) {
    const newTrack = new Track({
      id: v4(),
      ...createTrackDto,
    });

    Validator.isResoureExists({
      db: this.artistDb,
      id: newTrack.artistId,
      key: 'Artist',
    });
    Validator.isResoureExists({
      db: this.albumDb,
      id: newTrack.albumId,
      key: 'Album',
    });

    const track = this.trackDb.create(newTrack);

    return track;
  }

  findAll() {
    const tracks = this.trackDb.getAll();
    return tracks;
  }

  findOne(id: string) {
    Validator.isIdUuid(id);

    const track = this.trackDb.get(id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    Validator.isIdUuid(id);

    const trackDto = this.trackDb.get(id);
    if (!trackDto) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    const track = new Track(trackDto);

    const updatedTrack = track.update(updateTrackDto);

    Validator.isResoureExists({
      db: this.artistDb,
      id: updatedTrack.artistId,
      key: 'Artist',
    });
    Validator.isResoureExists({
      db: this.albumDb,
      id: updatedTrack.albumId,
      key: 'Album',
    });

    this.trackDb.update(updatedTrack);

    return updatedTrack;
  }

  remove(id: string) {
    Validator.isIdUuid(id);

    const track = this.trackDb.get(id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    this.trackDb.delete(id);
    this.removeFromResources(id);
    return null;
  }
}
