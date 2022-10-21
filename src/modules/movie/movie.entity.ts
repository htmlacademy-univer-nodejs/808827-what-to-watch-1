import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';
import {genres, Genre} from '../../types/genre.type.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true, minlength: 2, maxlength: 100})
  public title!: string;

  @prop({trim: true, required: true, minlength: 20, maxlength: 1024})
  public description!: string;

  @prop({required: true})
  public publicationDate!: Date;

  @prop({
    type: () => String,
    required: true,
    enum: genres
  })
  public genre!: Genre;

  @prop({required: true})
  public createdYear!: number;

  @prop({required: true})
  public rating!: number;

  @prop({required: true})
  public videoPreviewLink!: string;

  @prop({required: true})
  public videoLink!: string;

  @prop({required: true})
  public actors!: string[];

  @prop({required: true, minlength: 2, maxlength: 50})
  public director!: string;

  @prop({required: true})
  public movieDuration!: number;

  @prop({default: 0})
  public commentAmount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({required: true, match: /([^\s]+(\.jpg)$)/})
  public posterLink!: string;

  @prop({required: true, match: /([^\s]+(\.jpg)$)/})
  public backgroundPictureLink!: string;

  @prop({required: true})
  public backgroundColor!: string;
}

export const MovieModel = getModelForClass(MovieEntity);