import {DocumentType} from '@typegoose/typegoose';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
  findCommentsByFilmId(filmId: string): Promise<DocumentType<CommentEntity>[] | null>;
  update(filmId: string, dto: Partial<CreateCommentDto>): Promise<DocumentType<CommentEntity> | null>;
  delete(movieId: string): Promise<void>;
}
