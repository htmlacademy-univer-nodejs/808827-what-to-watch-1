import {Genre} from '../../../types/genre.type.js';

export default class UpdateMovieDto {
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public genre!: Genre;
  public createdYear!: number;
  public videoPreviewLink!: string;
  public videoLink!: string;
  public actors!: string[];
  public director!: string;
  public movieDuration!: number;
  public userId!: string;
  public posterLink!: string;
  public backgroundPictureLink!: string;
  public backgroundColor!: string;
}