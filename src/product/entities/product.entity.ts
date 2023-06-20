import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Category } from './category.entity';
import { Thumbnail } from './thumbnail.entity';

@ObjectType()
export class Product {
  @Field(() => Int)
  slug: number;
  @Field()
  description: string;
  @Field(() => Float)
  price: any;
  @Field(() => Float)
  original_price: any;

  @Field()
  subtitle: string;
  @Field()
  name: string;

  @Field()
  image: string;
  @Field()
  createdAt: Date;
  @Field(() => Thumbnail)
  Thumbnail: Thumbnail[];
  @Field(() => Category)
  Category: Category;
}
