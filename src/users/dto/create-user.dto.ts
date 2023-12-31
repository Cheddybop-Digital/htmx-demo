import {
  IsEmail,
  IsString,
  IsUrl,
  IsOptional,
  ValidateIf,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly phoneNumber: string;

  @IsUrl()
  @IsOptional()
  @ValidateIf((obj) => obj.avatarUrl !== null && obj.avatarUrl !== "")
  readonly avatarUrl: string;
}
