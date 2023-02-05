import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { IsUUID } from 'class-validator';
import { UpdateAlbumDto } from '../dto/update-album.dto';

export class Album implements InMemoryDBEntity {
  @IsUUID()
  id: string;

  name: string;
  year: number;
  artistId: string | null;

  constructor(partial: Partial<Album>) {
    Object.assign(this, partial);
  }

  update(album: UpdateAlbumDto) {
    this.name = album.name;
    this.year = album.year;
    this.artistId = album.artistId;

    return this;
  }
}
