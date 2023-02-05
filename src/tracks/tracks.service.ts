import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Validator } from 'src/share/validator';
import { v4, validate } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectInMemoryDBService('tracks')
    private trackDb: InMemoryDBService<Track>,
  ) {}

  create(createTrackDto: CreateTrackDto) {
    const newTrack = new Track({
      id: v4(),
      ...createTrackDto,
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
    return null;
  }
}
