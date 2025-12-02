import { Body, Controller, Post } from '@nestjs/common';
import { RegisterBodyDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterBodyDto) {
    console.log(body);
    return 'register endpoint';
    // return this.authService.register(body);
  }
}
