import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  artistId?: string | null;

  @IsOptional()
  @IsString()
  albumId?: string | null;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
