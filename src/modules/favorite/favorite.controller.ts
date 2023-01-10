import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {FavoriteServiceInterface} from './favorite-service.interface.js';
import CreateFavoriteDto from './dto/create-favorite.dto.js';
import FavoriteResponse from './response/favorite-response.dto.js';
import {fillDTO} from '../../utils/common.js';
import {StatusCodes} from 'http-status-codes';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../../common/config/config.interface.js';

@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for FavoriteController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateFavoriteDto)]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
  }

  public async index(
    {user}: Request<Record<string, unknown>, Record<string, unknown>>,
    res: Response): Promise<void> {
    const {id} = user;

    const favorites = await this.favoriteService.getFavoriteByUserId(id);
    this.send(res, StatusCodes.OK, fillDTO(FavoriteResponse, favorites));
  }

  public async create(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateFavoriteDto>,
    res: Response): Promise<void> {
    const {movieId} = body;
    const {id} = user;
    await this.favoriteService.pushToFavorite({movieId, userId: id});

    const favorites = await this.favoriteService.getFavoriteByUserId(id);
    this.created(res, fillDTO(FavoriteResponse, favorites));
  }

  public async delete(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateFavoriteDto>,
    res: Response): Promise<void> {
    const {movieId} = body;
    const {id: userId} = user;

    await this.favoriteService.pullFromFavorite({movieId, userId});

    const favorites = await this.favoriteService.getFavoriteByUserId(userId);
    this.ok(res, fillDTO(FavoriteResponse, favorites));
  }
}
