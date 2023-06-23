import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin(@Body() body: any) {
    return this.authService.signin(body);
  }
  @Post('signup')
  signup(@Body() body: any) {
    return this.authService.signup(body);
  }
}
