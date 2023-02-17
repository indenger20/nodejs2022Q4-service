import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { FavoriteEnum } from '../interface/favoriteTypes';

export class PostQueryDto {
  @ApiProperty({ enum: FavoriteEnum })
  @IsEnum(FavoriteEnum)
  type: FavoriteEnum;

  @ApiProperty()
  @IsString()
  id: string;
}
