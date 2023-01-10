import {Expose} from 'class-transformer';

export default class FavoriteResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public poster!: string;
}
