import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';

@ObjectType()
export class ThumbnailContent1 {
  @Field(() => Int)
  id: number;

  @Field()
  url: string;

  @Field()
  createdAt: Date;

  @Field(() => Product)
  Product: Product;
}
