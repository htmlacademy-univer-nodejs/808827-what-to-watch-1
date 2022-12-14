import {inject, injectable} from 'inversify';
import {CommentServiceInterface} from './comment-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`New comment created: ${dto.text}`);

    return result.populate(['author']);
  }

  public async findById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel
      .findById(commentId)
      .populate(['author'])
      .exec();
  }

  public async findCommentsByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[] | null> {
    return this.commentModel
      .find({movieId})
      .populate(['author'])
      .exec();
  }

  public async update(
    movieId: string,
    dto: Partial<CreateCommentDto>
  ): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel.findByIdAndUpdate({ _id: movieId }, dto, {
      new: true,
    });
  }

  public async deleteById(movieId: string): Promise<void> {
    const records = await this.commentModel.find({ movieId });
    for await (const record of records) {
      await this.update(record.id, { deleted: true });
    }
  }
}
