import {Expose, Type} from 'class-transformer';
import {Genre} from '../../../types/genre.type.js';
import UserResponse from '../../user/response/user.response.js';

export default class MovieResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publicationDate!: string;

  @Expose()
  public genre!: Genre;

  @Expose()
  public createdYear!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public videoPreviewLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public movieDuration!: number;

  @Expose()
  public commentAmount!: number;

  @Expose()
  @Type(() => UserResponse)
  public userId!: UserResponse;

  @Expose()
  public posterLink!: string;

  @Expose()
  public backgroundPictureLink!: string;

  @Expose()
  public backgroundColor!: string;
}
