import { IsString } from 'class-validator';

export class LoginBodyDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class RegisterBodyDto extends LoginBodyDto {
  @IsString()
  name: string;

  @IsString()
  confirmPassword: string;
}
