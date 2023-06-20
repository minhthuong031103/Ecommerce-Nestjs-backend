import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from 'src/auth/decorations/public.decorator';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { AuthGuard } from '@nestjs/passport';

@Public()
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/all')
  async getAllProducts() {
    return this.productService.findAll();
  }
  //   @UseGuards(AuthGuard('jwt'))
  @Get('/view/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.findOne(Number(slug));
  }

  @Get('/category')
  async getAllCategories() {
    return this.productService.findAllCategories();
  }
  @Get('/category/:slug')
  async getProductByCategory(@Param('slug') slug: string) {
    return this.productService.findProductByCategory(Number(slug));
  }
}
