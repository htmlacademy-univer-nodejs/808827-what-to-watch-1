export const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  MovieServiceInterface: Symbol.for('MovieServiceInterface'),
  MovieModel: Symbol.for('MovieModel'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  CommentModel: Symbol.for('CommentModel'),
  UserController: Symbol.for('UserController'),
  MovieController: Symbol.for('MovieController'),
  ExceptionFilterInterface: Symbol.for('ExceptionFilterInterface'),
  CommentController: Symbol.for('CommentController'),
  FavoriteModel: Symbol.for('FavoriteModel'),
  FavoriteServiceInterface: Symbol.for('FavoriteServiceInterface'),
  FavoriteController: Symbol.for('FavoriteController')
} as const;
