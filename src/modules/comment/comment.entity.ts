import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import { MovieEntity } from '../movie/movie.entity.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
  collection: 'comments'
  }
  })

export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public text!: string;

  @prop({required: true})
  public rating!: number;

  @prop({
    ref: UserEntity,
    required: true
    })
  public author!: Ref<UserEntity>;

  @prop({
    ref: MovieEntity,
    required: true
    })
  public movieId!: Ref<MovieEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
