import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { PostQueryDto } from './dto/post-query.dto';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('/:type/:id')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param()
    params: PostQueryDto,
  ) {
    return this.favoritesService.create(params.type, params.id);
  }

  @Delete('/:type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param()
    params: PostQueryDto,
  ) {
    return this.favoritesService.remove(params.type, params.id);
  }
}
