
import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import { Genre } from '../../types/genre.type.js';
import UpdateMovieDto from './dto/update-movie.dto.js';

export interface MovieServiceInterface {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  updateById(filmId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  deleteById(filmId: string): Promise<DocumentType<MovieEntity> | null>;
  find(count: number): Promise<DocumentType<MovieEntity>[]>;
  findByTitle(title: string): Promise<DocumentType<MovieEntity> | null>
  findByGenre(genre: Genre): Promise<DocumentType<MovieEntity>[]>;
  findById(filmId: string): Promise<DocumentType<MovieEntity> | null>;
  findPromoFilm(filmId: string): Promise<DocumentType<MovieEntity> | null>;
  increaseCommentCount(filmId: string): Promise<DocumentType<MovieEntity> | null>;
  updateRating(filmId: string, rating: number): Promise<DocumentType<MovieEntity> | null>;
}
