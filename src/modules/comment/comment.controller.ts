import {Request, Response} from 'express';
import {inject} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {MovieServiceInterface} from '../movie/movie-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/common.js';
import CommentResponse from './response/comment.response.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';

export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
      ]
    });
  }

  public async create(
    {body, user}: Request<object, object, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const {movieId, rating} = body;

    const comment = await this.commentService.create({...body, author: user.id});
    await this.movieService.updateRating(movieId, rating);
    this.created(res, fillDTO(CommentResponse, comment));
  }
}
