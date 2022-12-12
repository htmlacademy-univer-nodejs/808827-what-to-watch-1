
import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import { Genre } from '../../types/genre.type.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface MovieServiceInterface extends DocumentExistsInterface{
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  updateImageById(filmId: string, newFile: object): Promise<DocumentType<MovieEntity> | null>
  deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  find(count: number): Promise<DocumentType<MovieEntity>[]>;
  findByTitle(title: string): Promise<DocumentType<MovieEntity> | null>
  findByGenre(genre: Genre): Promise<DocumentType<MovieEntity>[]>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  findPromoFilm(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  updateRating(movieId: string, rating: number): Promise<DocumentType<MovieEntity> | null>;
  exists(movieId: string): Promise<boolean>;
}
