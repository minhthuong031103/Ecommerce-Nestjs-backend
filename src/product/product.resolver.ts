import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Public } from 'src/auth/decorations/public.decorator';
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}
  @Public()
  @Query(() => [Product], { name: 'products' })
  products() {
    return this.productService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('slug', { type: () => Int }) slug: number) {
    return this.productService.findOne(slug);
  }
}
