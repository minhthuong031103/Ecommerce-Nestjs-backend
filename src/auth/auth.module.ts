import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaModule } from 'src/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
@Module({
  imports: [PrismaModule],
  providers: [AuthResolver, AuthService, JwtService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthResolver, AuthService],
})
export class AuthModule {}
