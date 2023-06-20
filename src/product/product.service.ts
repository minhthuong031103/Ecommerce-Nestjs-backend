import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const a = await this.prisma.product.findMany({
      include: { Category: true, Thumbnail: true },
    });

    return a;
  }

  findOne(slug: any) {
    return this.prisma.product.findUnique({
      where: { slug: slug },
      include: { Thumbnail: true },
    });
  }
  findAllCategories() {
    return this.prisma.category.findMany({
      where: {},
      include: { Product: true },
    });
  }

  findProductByCategory(slug: number) {
    return this.prisma.category.findUnique({
      where: { slug: slug },
      include: { Product: true },
    });
  }
}
