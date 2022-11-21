export default class CreateCommentDto {
  public text!: string;
  public rating!: number;
  public date!: Date;
  public userId!: string;
  public movieId!: string;
  deleted?: boolean;
}
