import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';
import { ThumbnailContent1 } from './thumbnailContent.entity';

@ObjectType()
export class Thumbnail {
  @Field(() => [ThumbnailContent1])
  ThumbnailContent: [ThumbnailContent1];
}
