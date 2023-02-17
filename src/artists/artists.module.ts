import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
  imports: [
    InMemoryDBModule.forFeature('artists', {}),
    InMemoryDBModule.forFeature('tracks', {}),
    InMemoryDBModule.forFeature('albums', {}),
    InMemoryDBModule.forFeature('favorites', {}),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
