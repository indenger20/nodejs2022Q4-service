import { IsUUID } from 'class-validator';

export class Track {
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
