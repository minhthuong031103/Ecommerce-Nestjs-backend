import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}
  async findCart(userId: number) {
    const a = await this.prisma.cart.findUnique({
      where: { userId: userId },
      include: { user: true },
    });
    return a;
  }
  async updateCart(userId: number, cartInput) {
    const a = await this.prisma.cart.update({
      where: { userId: userId },
      data: { cartItems: cartInput },
    });

    return a;
  }
}
