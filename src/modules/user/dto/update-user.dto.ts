import {IsOptional, IsString, Length} from 'class-validator';

export default class UpdateUserDto {
  @IsOptional()
  @IsString({message: 'Name is required'})
  @Length(1, 15, {message: '1 to 15 length is required'})
  public name?: string;

  @IsOptional()
  @IsString({message: 'profilePictureLink must be a string'})
  public profilePictureLink?: string;
}
