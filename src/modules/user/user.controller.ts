import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { UserServiceInterface } from './user-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import UserResponse from './response/user.response.js';
import { createJWT, fillDTO } from '../../utils/common.js';
import CreateUserDto from './dto/create-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import { DEFAULT_AVATAR_FILE_NAME, JWT_ALGORITHM } from './user.constant.js';
import LoggedUserResponse from './response/logged-user-response.js';
import UploadUserAvatarResponse from './response/upload-user-avatar.response.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface)
    private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface)
    configService: ConfigInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for UserService…');

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
    });
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.authCheck,
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar'
        ),
      ],
    });
  }

  public async login(
    {
      body,
    }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.verifyUser(
      body,
      this.configService.get('SALT')
    );

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }
    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      { email: user.email, id: user.id }
    );

    this.ok(res, { ...fillDTO(LoggedUserResponse, user), token });
  }

  public async create(
    {
      body,
    }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response
  ): Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(
      {
        ...body,
        profilePictureLink: DEFAULT_AVATAR_FILE_NAME,
      },

      this.configService.get('SALT')
    );
    this.created(res, fillDTO(UserResponse, result));
  }

  public async logout(): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'This service (LOGOUT) not implemented',
      'userController'
    );
  }

  public async authCheck(req: Request, res: Response) {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }
    const user = await this.userService.findByEmail(req.user.email);

    this.ok(res, fillDTO(LoggedUserResponse, user));
  }

  public async uploadAvatar(req: Request, res: Response) {
    const {userId} = req.params;
    const uploadFile = {profilePictureLink: req.file?.filename};
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDTO(UploadUserAvatarResponse, uploadFile));
  }
}
