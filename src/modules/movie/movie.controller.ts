import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {MovieServiceInterface} from './movie-service.interface.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import {StatusCodes} from 'http-status-codes';
import MovieResponse from './response/movie.response.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {fillDTO} from '../../utils/common.js';
import HttpError from '../../common/errors/http-error.js';
import {RequestQuery} from '../../types/request-query.js';
import * as core from 'express-serve-static-core';
import {asGenre} from '../../types/genre.type.js';

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.CommentServiceInterface) private commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromo});
    this.addRoute({path: '/:filmId', method: HttpMethod.Get, handler: this.getById});
    this.addRoute({path: '/:filmId', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:filmId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/genre/:genre', method: HttpMethod.Get, handler: this.getByGenre});
  }

  public async index(
    {query}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ):Promise<void> {
    const limit = parseInt(query.limit ?? '0', 10) || 4;
    const films = await this.movieService.find(limit);
    console.log(limit, films, fillDTO(MovieResponse, films));
    this.send(res, StatusCodes.OK, fillDTO(MovieResponse, films));
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>,
    res: Response): Promise<void> {
    const existsFilm = await this.movieService.findByTitle(body.title);

    if (existsFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with title «${body.title}» exists.`,
        'FilmController'
      );
    }

    const result = await this.movieService.create(body);
    if (!result) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `Film with title «${body.title}» not created.`,
        'FilmController'
      );
    }
    this.created(
      res,
      fillDTO(MovieResponse, result)
    );
  }

  public async getById(
    {params}: Request<core.ParamsDictionary>,
    res: Response
  ):Promise<void> {
    const existFilm = await this.movieService.findById(params.filmId);

    if (!existFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with ID ${params.filmId} not exist`,
        'FilmController'
      );
    }

    this.ok(res, fillDTO(MovieResponse, existFilm));
  }

  public async getByGenre(
    {params}: Request<core.ParamsDictionary>,
    res: Response
  ):Promise<void> {
    const result = await this.movieService.findByGenre(asGenre(params.genre));

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with genre ${params.genre} not exist`,
        'FilmController'
      );
    }

    this.ok(res, fillDTO(MovieResponse, result));
  }

  public async update(
    {body, params}:  Request<core.ParamsDictionary , Record<string, unknown>, UpdateMovieDto>,
    res: Response
  ):Promise<void> {
    const updatedFilm = await this.movieService.updateById(params.filmId, body);
    if (!updatedFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with ID: ${params.filmId} not found`,
        'FilmController'
      );
    }
    const result = await this.movieService.findById(updatedFilm.id);
    this.ok(res, fillDTO(MovieResponse, result));
  }

  public async delete(
    {params}:  Request<core.ParamsDictionary>,
    res: Response
  ):Promise<void> {
    const result = await this.movieService.deleteById(params.filmId);
    if (!result) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with ID: ${params.filmId} not deleted`,
        'FilmController'
      );
    }
    await this.commentService.delete(params.filmId);

    this.ok(res, fillDTO(MovieResponse, result));
  }

  public async getPromo(
    _req: Request,
    res: Response
  ):Promise<void> {
    const films = await this.movieService.find(1);
    const promoFilm = await this.movieService.findPromoFilm(films[0].id);

    if (!promoFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Promo film not exist',
        'FilmController'
      );
    }

    this.ok(res, fillDTO(MovieResponse, promoFilm));
  }
}
