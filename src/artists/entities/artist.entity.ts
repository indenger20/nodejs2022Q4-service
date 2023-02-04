import { IsUUID } from 'class-validator';
import { UpdateArtistDto } from '../dto/update-artist.dto';

export class Artist {
  @IsUUID()
  id: string;

  name: string;
  grammy: boolean;

  constructor(partial: Partial<Artist>) {
    Object.assign(this, partial);
  }

  update(artist: UpdateArtistDto) {
    this.grammy = artist.grammy;
    this.name = artist.name;
    return this;
  }
}
