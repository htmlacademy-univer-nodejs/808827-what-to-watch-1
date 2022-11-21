import {IsInt, IsMongoId, Length, Min, Max} from 'class-validator';

export default class CreateCommentDto {
  @Length(5, 1024, {message: 'text length must be 5 to 1024 symbols'})
  public text!: string;

  @IsInt({message: 'rating must be an integer'})
  @Min(0, {message: 'minimum value must be not lower than 0'})
  @Max(10, {message: 'maximum value must be not greater than 10'})
  public rating!: number;

  @IsMongoId({message: 'author field must be valid'})
  public author!: string;

  @IsMongoId({message: 'filmId field must be valid'})
  public movieId!: string;

  deleted?: boolean;
}
