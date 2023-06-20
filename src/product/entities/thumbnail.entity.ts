import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';
import { ThumbnailContent1 } from './thumbnailContent.entity';

@ObjectType()
export class Thumbnail {
  @Field(() => Int)
  id: number;

  @Field()
  url: string;

  @Field()
  createdAt: Date;

  @Field(() => Int)
  productSlug: number;
}
