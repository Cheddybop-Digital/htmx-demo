import {
  IsEmail,
  IsString,
  IsUrl,
  IsOptional,
  ValidateIf,
  IsNotEmpty,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsUrl()
  @IsOptional()
  @ValidateIf((obj) => obj.avatarUrl !== null && obj.avatarUrl !== "")
  readonly avatarUrl: string;
}
