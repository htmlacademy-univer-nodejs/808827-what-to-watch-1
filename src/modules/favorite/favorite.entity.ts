import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

@modelOptions({
  schemaOptions: {
  collection: 'favorites'
  }
  })
export class FavoriteEntity extends defaultClasses.TimeStamps {

  @prop({
    ref: UserEntity,
    required: true
    })
  public userId!: Ref<UserEntity>;

  @prop({
    type: () => [String],
    required: true,
    default: []
    })
  public favorites!: string[];
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
