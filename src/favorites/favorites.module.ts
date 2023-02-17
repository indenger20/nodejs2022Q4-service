import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

@Module({
  imports: [
    InMemoryDBModule.forFeature('favorites', {}),
    InMemoryDBModule.forFeature('tracks', {}),
    InMemoryDBModule.forFeature('albums', {}),
    InMemoryDBModule.forFeature('artists', {}),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
