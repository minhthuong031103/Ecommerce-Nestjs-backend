import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';

@ObjectType()
export class Category {
  @Field(() => Int)
  slug: number;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field(() => [Product])
  Product: Product[];
}
