import { InMemoryDBConfig } from '@nestjs-addons/in-memory-db';
import { FavoriteType } from './favoriteTypes';

export interface FavoriteStore extends InMemoryDBConfig {
  id: FavoriteType;
  data: string[];
}
