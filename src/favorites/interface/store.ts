import { InMemoryDBConfig } from '@nestjs-addons/in-memory-db';
import { FavoriteEnum } from './favoriteTypes';

export interface FavoriteStore extends InMemoryDBConfig {
  id: FavoriteEnum;
  data: string[];
}
