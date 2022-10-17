import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import {Component} from '../types/component.types.js';

@injectable()
export default class Application {
  @inject(Component.LoggerInterface) private logger: LoggerInterface;
  @inject(Component.ConfigInterface) private config: ConfigInterface;

  constructor(logger: LoggerInterface, config: ConfigInterface) {
    this.logger = logger;
    this.config = config;
  }

  public async init() {
    this.logger.info('Application initialization…');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
