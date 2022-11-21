import {Genre} from '../../../types/genre.type.js';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  IsMongoId,
  MaxLength,
  MinLength,
  Contains,
  IsOptional,
} from 'class-validator';

export default class UpdateMovieDto {
  @IsOptional()
  @MinLength(2, {message: 'Minimum title length must be 2'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'publicationDate must be valid ISO date'})
  public publicationDate?: Date;

  @IsOptional()
  @IsString({message: 'type must be string'})
  public genre?: Genre;

  @IsOptional()
  @IsInt({message: 'Year must be an integer'})
  public createdYear!: number;

  @IsOptional()
  @IsNumber({},{message: 'Rating must be a number'})
  public rating?: number;

  @IsOptional()
  @IsString({message: 'Preview must be an string'})
  public videoPreviewLink?: string;

  @IsOptional()
  @IsString({message: 'Video must be an string'})
  public videoLink?: string;

  @IsOptional()
  @IsArray({message: 'Field actors must be an array'})
  @IsString({each: true, message: 'Actors field must be an array of string'})
  public actors?: string[];

  @IsOptional()
  @IsString({message: 'Director must be a string'})
  @MinLength(2, {message: 'Minimum director length must be 2'})
  @MaxLength(50, {message: 'Maximum director length must be 50'})
  public director?: string;

  @IsOptional()
  @IsInt({message: 'Duration must be an integer'})
  public movieDuration?: number;

  @IsOptional()
  @IsInt({message: 'Comment count must be an integer'})
  public commentAmount?: number;

  @IsOptional()
  @IsMongoId({message: 'userId field must be valid an id'})
  public userId?: string;

  @IsOptional()
  @Contains('.jpg',{message: 'Poster should be with the extension .jpg'})
  public posterLink?: string;

  @IsOptional()
  @Contains('.jpg',{message: 'Background should be with the extension .jpg'})
  public backgroundPictureLink?: string;

  @IsOptional()
  @IsString({message: 'Background color must be an string'})
  public backgroundColor?: string;
}
