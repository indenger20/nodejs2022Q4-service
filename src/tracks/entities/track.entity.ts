import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { IsUUID } from 'class-validator';
import { UpdateTrackDto } from '../dto/update-track.dto';

export class Track implements InMemoryDBEntity {
  @IsUUID()
  id: string;

  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;

  constructor(partial: Partial<Track>) {
    Object.assign(this, partial);
  }

  update(track: UpdateTrackDto) {
    console.log('track', track);

    this.name = track.name !== undefined ? track.name : this.name;
    this.artistId =
      track.artistId !== undefined ? track.artistId : this.artistId;
    this.albumId = track.albumId !== undefined ? track.albumId : this.albumId;
    this.duration =
      track.duration !== undefined ? track.duration : this.duration;

    return this;
  }
}
