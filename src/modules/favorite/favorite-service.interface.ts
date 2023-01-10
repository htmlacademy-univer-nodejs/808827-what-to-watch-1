import CreateFavoriteDto from './dto/create-favorite.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {FavoriteEntity} from './favorite.entity.js';
import {MovieEntity} from '../movie/movie.entity.js';

export interface FavoriteServiceInterface {
  create(userId: string): Promise<DocumentType<FavoriteEntity> | null>;
  pushToFavorite(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null>;
  pullFromFavorite(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity> | null>;
  getFavoriteByUserId(userId: string): Promise<DocumentType<MovieEntity>[]>;
}
