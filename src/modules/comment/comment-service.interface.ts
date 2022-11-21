import {DocumentType} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
  findCommentsByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[] | null>;
  update(movieId: string, dto: Partial<CreateCommentDto>): Promise<DocumentType<CommentEntity> | null>;
  deleteById(movieId: string): Promise<void>;
}
