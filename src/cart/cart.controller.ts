import { Body, Controller, Get, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}
  @Post()
  cart(@Body() body: any) {
    return this.cartService.findCart(body.userId);
  }
  @Post('update')
  updateCart(@Body() body: any) {
    return this.cartService.updateCart(body.userId, body.cartInput);
  }
}
