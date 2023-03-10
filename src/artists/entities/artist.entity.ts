import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { IsUUID } from 'class-validator';
import { UpdateArtistDto } from '../dto/update-artist.dto';

export class Artist implements InMemoryDBEntity {
  @IsUUID()
  id: string;

  name: string;
  grammy: boolean;

  constructor(partial: Partial<Artist>) {
    Object.assign(this, partial);
  }

  update(artist: UpdateArtistDto) {
    this.grammy = artist.grammy !== undefined ? artist.grammy : this.grammy;
    this.name = artist.name !== undefined ? artist.name : this.name;

    return this;
  }
}
