import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
  imports: [
    InMemoryDBModule.forFeature('tracks', {}),
    InMemoryDBModule.forFeature('artists', {}),
    InMemoryDBModule.forFeature('albums', {}),
    InMemoryDBModule.forFeature('favorites', {}),
  ],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
