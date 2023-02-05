import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { IsUUID } from 'class-validator';

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
}
