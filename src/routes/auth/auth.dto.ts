import { Exclude } from 'class-transformer';
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

export class RegisterResponseDto {
  @Exclude()
  password: string;

  constructor(object: Record<string, any>) {
    Object.assign(this, object);
  }
}

export class RefreshTokenBodyDto {
  @IsString()
  refreshToken: string;
}
