import { IsEnum, IsString } from 'class-validator';
import { FavoriteEnum } from '../interface/favoriteTypes';

export class PostQueryDto {
  @IsEnum(FavoriteEnum)
  type: FavoriteEnum;

  @IsString()
  id: string;
}
