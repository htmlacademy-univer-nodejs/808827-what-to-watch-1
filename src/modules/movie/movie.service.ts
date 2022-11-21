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
    movieId: string,
    dto: UpdateMovieDto
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, dto, { new: true })
      .populate(['userId'])
      .exec();
  }

  public async deleteById(
    movieId: string
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findByIdAndDelete(movieId).exec();
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
    movieId: string
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(movieId).populate(['userId']).exec();
  }

  public async findByTitle(title: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findOne({title});
  }

  public async findPromoFilm(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findById(movieId)
      .populate('userId')
      .exec();
  }

  public async updateRating(
    movieId: string,
    rating: number
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, {
        '$inc': {
          commentCount: 1,
          rating: rating,
        }
      }).exec();
  }

  public async exists(movieId: string): Promise<boolean> {
    return this.movieModel
      .exists({_id: movieId}) !== null;
  }
}
