import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import MovieResponse from './response/movie.response.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { fillDTO } from '../../utils/common.js';
import HttpError from '../../common/errors/http-error.js';
import { RequestQuery } from '../../types/request-query.js';
import * as core from 'express-serve-static-core';
import { asGenre } from '../../types/genre.type.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import CommentResponse from '../comment/response/comment.response.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.MovieServiceInterface)
    private readonly movieService: MovieServiceInterface,
    @inject(Component.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for MovieController');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateMovieDto)],
    });
    this.addRoute({
      path: '/promo',
      method: HttpMethod.Get,
      handler: this.getPromo,
      middlewares: [
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute({
      path: '/:movieId/preview',
      method: HttpMethod.Post,
      handler: this.upload,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'preview'),
      ],
    });
    this.addRoute({
      path: '/:movieId/poster',
      method: HttpMethod.Post,
      handler: this.upload,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'poster'),
      ],
    });
    this.addRoute({
      path: '/:movieId/bg',
      method: HttpMethod.Post,
      handler: this.upload,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'backgroundImage'),
      ],
    });
    this.addRoute({
      path: '/:movieId/video',
      method: HttpMethod.Post,
      handler: this.upload,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'video'),
      ],
    });
    this.addRoute({
      path: '/:movieId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute({
      path: '/genre/:genre',
      method: HttpMethod.Get,
      handler: this.getByGenre,
    });
  }

  public async index(
    { query }: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const limit = parseInt(query.limit ?? '0', 10) || 4;
    const movies = await this.movieService.find(limit);
    this.ok(res, fillDTO(MovieResponse, movies));
  }

  public async create(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateMovieDto
    >,
    res: Response
  ): Promise<void> {
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
        `Film with title «${body.title}» is not created.`,
        'FilmController'
      );
    }
    this.created(res, fillDTO(MovieResponse, result));
  }

  public async show(
    {params}: Request<core.ParamsDictionary>,
    res: Response
  ): Promise<void> {
    const {movieId} = params;
    const film = await this.movieService.findById(movieId);

    this.ok(res, fillDTO(MovieResponse, film));
  }

  public async getByGenre(
    { params }: Request<core.ParamsDictionary>,
    res: Response
  ): Promise<void> {
    const {genre} = params;
    const result = await this.movieService.findByGenre(asGenre(params.genre));


    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with genre ${genre} does not exist`,
        'MovieController'
      );
    }

    this.ok(res, fillDTO(MovieResponse, result));
  }

  public async update(
    {
      body,
      params,
    }: Request<core.ParamsDictionary, Record<string, unknown>, UpdateMovieDto>,
    res: Response
  ): Promise<void> {
    const {movieId} = params;
    const updatedMovie = await this.movieService.updateById(movieId, body);

    this.ok(res, fillDTO(MovieResponse, updatedMovie));
  }

  public async delete(
    { params }: Request<core.ParamsDictionary>,
    res: Response
  ): Promise<void> {
    const {movieId} = params;
    const result = await this.movieService.deleteById(movieId);
    await this.commentService.deleteById(movieId);

    this.noContent(res, result);
  }

  public async getPromo(
    _req: Request,
    res: Response
  ): Promise<void> {
    const movies = await this.movieService.find(1);
    const movie = await this.movieService.findPromoFilm(movies[0].id);

    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary, object, object>,
    res: Response
  ): Promise<void> {
    const {movieId} = params;

    const comments = await this.commentService.findCommentsByMovieId(movieId);

    if (comments?.length === 0) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Comments for movie are not found',
        'MovieController'
      );
    }

    this.ok(res, fillDTO(CommentResponse, comments));
  }

  public async upload(req: Request, res: Response) {
    const {movieId} = req.params;
    if (!req.file) {
      return;
    }
    const updateDTO = {[req.file.fieldname] : req.file.filename};
    await this.movieService.updateImageById(movieId, updateDTO);

    this.created(res, updateDTO);
  }
}
