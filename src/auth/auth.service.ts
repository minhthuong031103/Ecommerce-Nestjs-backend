import { ForbiddenException, Injectable } from '@nestjs/common';

import { UpdateAuthInput } from './dto/update-auth.input';
import { SignUpInput } from './dto/signup-input';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignInInput } from './dto/signin-input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signUpInput: SignUpInput) {
    const hashedPasswordArgon = await argon.hash(signUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        name: signUpInput.name,
        email: signUpInput.email,
        hashedPassword: hashedPasswordArgon,
      },
    });
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    const { hashedPassword, ...result } = user;
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: result,
    };
  }
  async signin(signInInput: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: signInInput.email },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const isPasswordValid = await argon.verify(
      user.hashedPassword,
      signInInput.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    const { hashedPassword, ...result } = user;
    return {
      accessToken,
      refreshToken,
      user: result,
    };
  }
  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
    return { loggedOut: true };
  }

  async createToken(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      { userId: userId, email: email },
      { expiresIn: '1h', secret: this.configService.get('JWT_SECRET') },
    );
    const refreshToken = this.jwtService.sign(
      { userId: userId, email: email },
      { expiresIn: '7d', secret: this.configService.get('JWT_SECRET') },
    );
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashedRefreshToken },
    });
  }

  async getNewToken(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const doRefreshTokenMatch = await argon.verify(user.hashedRefreshToken, rt);

    if (!doRefreshTokenMatch) {
      throw new ForbiddenException('Invalid refresh token');
    }
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
    );
    const { hashedPassword, ...result } = user;
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, result };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
