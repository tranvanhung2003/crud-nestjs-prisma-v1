import { IsString, Length } from 'class-validator';
import { Match } from 'src/shared/decorators/custom-validator.decorator';

export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  name: string;

  @IsString()
  @Match('password')
  confirmPassword: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class LogoutDto extends RefreshTokenDto {}
