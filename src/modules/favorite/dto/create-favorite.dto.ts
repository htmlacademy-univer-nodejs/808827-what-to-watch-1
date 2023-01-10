import {IsMongoId} from 'class-validator';

export default class CreateFavoriteDto {
  public userId!: string;

  @IsMongoId({message: 'movieId field must be valid'})
  public movieId!: string;
}
