import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
  imports: [
    InMemoryDBModule.forFeature('albums', {}),
    InMemoryDBModule.forFeature('tracks', {}),
    InMemoryDBModule.forFeature('artists', {}),
    InMemoryDBModule.forFeature('favorites', {}),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
