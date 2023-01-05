import { IsEmail, IsString, Length } from 'class-validator';

export default class CreateUserDto {

  @IsString({message: 'Name is required'})
  @Length(1, 15, {message: '1 to 15 length is required'})
  public name!: string;

  @IsEmail({}, {message: 'Email must be valid'})
  public email!: string;

  public profilePictureLink!: string;

  @IsString({message: 'Password is required'})
  @Length(6, 12, {message: '6 to 12 length is required'})
  public password!: string;
}
