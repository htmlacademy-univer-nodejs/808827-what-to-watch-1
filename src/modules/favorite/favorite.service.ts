import {inject, injectable} from 'inversify';
import {FavoriteServiceInterface} from './favorite-service.interface.js';
import CreateFavoriteDto from './dto/create-favorite.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {FavoriteEntity} from './favorite.entity.js';
import {Component} from '../../types/component.types.js';
import {MovieEntity} from '../movie/movie.entity.js';
import {SortType} from '../../types/sort-type.enum.js';

@injectable()
export default class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(userId: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel.create({userId});
  }

  public async pushToFavorite(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    const {userId, movieId} = dto;
    return this.favoriteModel
      .findOneAndUpdate({userId}, {
        '$addToSet': {
          favorites: movieId
        }
      }).exec();
  }

  public async pullFromFavorite(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null> {
    const {userId, movieId} = dto;
    return this.favoriteModel
      .findOneAndUpdate({userId}, {
        '$pull': {
          favorites: movieId
        }
      }).exec();
  }

  public async getFavoriteByUserId(userId: string): Promise<DocumentType<MovieEntity>[]> {
    const favorites = await this.favoriteModel
      .distinct('favorites', {userId})
      .exec();

    return this.movieModel
      .find(
        {'_id': { '$in': favorites}})
      .sort({createdAt: SortType.Down})
      .exec();
  }
}
