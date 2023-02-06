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
    this.name = track.name ?? this.name;
    this.artistId = track.artistId ?? this.artistId;
    this.albumId = track.albumId ?? this.albumId;
    this.duration = track.duration ?? this.duration;

    return this;
  }
}
