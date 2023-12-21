import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phoneNumber: string;

  @IsString()
  readonly avatarUrl: string;
}
