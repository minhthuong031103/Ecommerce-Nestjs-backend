import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaModule } from 'src/prisma.module';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [PrismaModule],
  providers: [AuthResolver, AuthService, JwtService],
  exports: [AuthResolver, AuthService],
})
export class AuthModule {}
