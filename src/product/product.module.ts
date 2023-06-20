import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { PrismaModule } from 'src/prisma.module';
import { ProductController } from './product.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProductResolver, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
