import { inject, injectable } from 'inversify';
import { MovieServiceInterface } from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Genre } from '../../types/genre.type.js';
import UpdateMovieDto from './dto/update-movie.dto.js';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.MovieModel)
    private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const movie = await this.movieModel.create(dto);
    this.logger.info(`New movie created: ${dto.title}`);

    return movie;
  }

  public async updateById(
    filmId: string,
    dto: UpdateMovieDto
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(filmId, dto, { new: true })
      .populate(['userId'])
      .exec();
  }

  public async deleteById(
    filmId: string
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findByIdAndDelete(filmId).exec();
  }

  public async find(): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel.find().populate(['userId']).exec();
  }

  public async findByGenre(
    genre: Genre
  ): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel.find({ genre: genre }).populate(['userId']).exec();
  }

  public async findById(
    filmId: string
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(filmId).populate(['userId']).exec();
  }

  public async increaseCommentCount(
    filmId: string
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(filmId, {
        $inc: {
          commentCount: 1,
        },
      })
      .exec();
  }

  public async updateRating(
    filmId: string,
    rating: number
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findByIdAndUpdate(filmId, { rating: rating }).exec();
  }
}
