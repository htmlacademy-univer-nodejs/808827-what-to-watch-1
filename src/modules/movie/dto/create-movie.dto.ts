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
  Contains
} from 'class-validator';

export default class CreateMovieDto {
  @MinLength(2, {message: 'Minimum title length must be 2'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsDateString({}, {message: 'publicationDate must be valid ISO date'})
  public publicationDate!: Date;

  @IsString({message: 'type must be string'})
  public genre!: Genre;

  @IsInt({message: 'Year must be an integer'})
  public createdYear!: number;

  @IsNumber({},{message: 'Rating must be a number'})
  public rating!: number;

  @IsString({message: 'Preview must be an string'})
  public videoPreviewLink!: string;

  @IsString({message: 'Video must be an string'})
  public videoLink!: string;

  @IsArray({message: 'Field actors must be an array'})
  @IsString({each: true, message: 'Actors field must be an array of string'})
  public actors!: string[];

  @IsString({message: 'Director must be a string'})
  @MinLength(2, {message: 'Minimum director length must be 2'})
  @MaxLength(50, {message: 'Maximum director length must be 50'})
  public director!: string;

  @IsInt({message: 'Duration must be an integer'})
  public movieDuration!: number;

  @IsInt({message: 'Comment count must be an integer'})
  public commentAmount!: number;

  @IsMongoId({message: 'userId field must be valid an id'})
  public userId!: string;

  @Contains('.jpg',{message: 'Poster should be with the extension .jpg'})
  public posterLink!: string;

  @Contains('.jpg',{message: 'Background should be with the extension .jpg'})
  public backgroundPictureLink!: string;

  @IsString({message: 'Background color must be an string'})
  public backgroundColor!: string;
}
